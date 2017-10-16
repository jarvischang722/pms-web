/**
 * Created by Mike on 2017/10/16.
 * dataGrid 相關處理
 */
let config = require("../configs/database");
let sysConf = require("../configs/SystemConfig");
let queryAgent = require('../plugins/kplug-oracle/QueryAgent');
let mongoAgent = require("../plugins/mongodb");
let _ = require("underscore");
let async = require("async");
let moment = require("moment");
let i18n = require("i18n");
let tools = require("../utils/CommonTools");
let dataRuleSvc = require("./DataRuleService");
let ruleAgent = require("../ruleEngine/ruleAgent");
let logSvc = require("./LogService");
let mailSvc = require("./MailService");
let langSvc = require("./LangService");
let fieldAttrSvc = require("./FieldsAttrService");


/**
 * QuerySQL
 * @param session
 * @param prg_id
 * @param callback
 */
exports.getDataGridRows = function (params ,session, callback) {

    var lo_error = null;

    var lo_params = {
        athena_id : "1",
        hotel_cod : "02",
        comp_cod: params.comp_cod,
        key_cod1: params.key_cod1
    };

    queryAgent.queryList("QRY_HKMTYPE_RF", lo_params, 0, 0, function (err, Result) {
        if (Result) {
            callback(lo_error, Result);
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err;
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });

};


/**
 * 欄位驗證
 * @param prg_id
 * @param ui_field_name
 * @param verifyValue
 * @param callback
 */
exports.doCheckFieldFormatVerify = function (prg_id, ui_field_name, verifyValue, callback) {

    async.waterfall([
        //驗證資料格式是否正常
        function (callback) {
            mongoAgent.UIFieldFormat.findOne({
                prg_id: prg_id,
                ui_field_name: ui_field_name
            }, function (err, fieldFormat) {
                if (!err && fieldFormat) {

                    mongoAgent.FormatRF.findOne({format_id: fieldFormat.format_id}, function (err, format) {
                        console.log(ui_field_name);

                        var regExp = new RegExp(format.reg_exp);
                        if (!regExp.test(verifyValue)) {
                            callback("資料格式錯誤", false);
                        }
                    });
                } else {
                    callback(null, true);
                }
            });
        },
        //驗證資料內容是否正確
        function (checkFormat, callback) {
            callback(null, true);
        }
    ], function (err, success) {

        if (err || !success) {
            callback(err, false);
        } else {
            callback(null, true);
        }
    });


};

/**
 * DataGrid儲存使用者新增,修改,刪除的資料到資料庫
 * @param postData
 * @param session
 * @param callback
 */
exports.doSaveDataGrid = function (postData, session, callback) {
    var mainTableName = "";
    var savaExecDatas = {};
    var exec_seq = 1;
    var userInfo = session.user;
    var athena_id = userInfo.athena_id;
    var hotel_cod = userInfo["fun_hotel_cod"];
    var prg_id = postData["prg_id"] || "";
    var prgFields = []; //prg 所屬的欄位

    async.waterfall([
        getTableName, //抓取TABLE NAME
        getPrgField,  //取得此程式的欄位
        doChkSaveRule,//先驗證資料是否規則正確
        doSaveDataByAPI //實作儲存
    ], function (err, result) {
        callback(err, result);
    });


    function getTableName(callback) {
        //抓取對應的table
        mongoAgent.TemplateRf.findOne({
            page_id: 1,
            prg_id: prg_id,
            template_id: 'datagrid'
        }, function (err, tmpObj) {
            if (!err && tmpObj) {
                tmpObj = tmpObj.toObject();
                mainTableName = tmpObj.table_name;
                callback(null, mainTableName);
            } else {
                callback("not found table name", mainTableName);
            }
        });
    }

    //取得此程式的欄位
    function getPrgField(mainTableName, callback) {
        mongoAgent.UIDatagridField.find({athena_id: '', user_id: '', prg_id: prg_id}, function (err, fieds) {
            if (err) {
                callback(err, fieds);
                return;
            }
            prgFields = fieds;
            callback(null, fieds);
        });
    }

    //儲存前資料驗證檢查
    function doChkSaveRule(fieds, callback) {
        dataRuleSvc.handleDataGridBeforeSaveChkRule(postData, session, function (err, result) {
            if (!err) {
                //組成本筆資料儲存前，需要異動其他資料的sql api資料
                _.each(result.la_before_save_create_sql_action, function (c_action) {
                    savaExecDatas[exec_seq] = c_action;
                    exec_seq++;
                });
                _.each(result.la_before_save_update_sql_action, function (u_action) {
                    savaExecDatas[exec_seq] = u_action;
                    exec_seq++;
                });
                _.each(result.la_before_save_delete_sql_action, function (d_action) {
                    savaExecDatas[exec_seq] = d_action;
                    exec_seq++;
                });
                postData = result.postData;
            }
            callback(err, result);
        });
    }

    //實作儲存
    function doSaveDataByAPI(chkResult, callback) {
        var deleteData = postData["deleteData"] || [];
        var createData = postData["createData"] || [];
        var updateData = postData["updateData"] || [];
        var keyFields = _.pluck(_.where(prgFields, {keyable: 'Y'}), "ui_field_name") || []; //屬於key 的欄位
        var la_multiLangFields = _.filter(prgFields, function (field) {
            return field.multi_lang_table != "";
        });  //多語系欄位
        async.parallel([
            //新增 0200
            function (callback) {
                if (createData.length == 0) {
                    return callback(null, '0200');
                }
                _.each(createData, function (data) {
                    var tmpIns = {"function": "1"}; //1  新增
                    tmpIns["table_name"] = mainTableName;

                    data = handleDateFormat(prgFields, data);

                    _.each(Object.keys(data), function (objKey) {
                        tmpIns[objKey] = data[objKey];
                    });

                    tmpIns = _.extend(tmpIns, ruleAgent.getCreateCommonDefaultDataRule(session));

                    savaExecDatas[exec_seq] = tmpIns;
                    exec_seq++;

                    /** 處理每一筆多語系 handleSaveMultiLang **/
                    if (!_.isUndefined(data.multiLang) && data.multiLang.length > 0) {
                        _.each(data.multiLang, function (lo_lang) {
                            var ls_locale = lo_lang.locale || "";
                            _.each(lo_lang, function (langVal, fieldName) {
                                if (fieldName != "locale" && fieldName != "display_locale" && !_.isEmpty(langVal)) {
                                    var langTable = _.findWhere(la_multiLangFields, {ui_field_name: fieldName}).multi_lang_table;
                                    var lo_langTmp = {
                                        function: '1',
                                        table_name: langTable,
                                        locale: ls_locale,
                                        field_name: fieldName,
                                        words: langVal
                                    };
                                    _.each(keyFields, function (keyField) {
                                        if (!_.isUndefined(data[keyField])) {
                                            lo_langTmp[keyField] = typeof data[keyField] === "string" ? data[keyField].trim() : data[keyField];
                                        }
                                    });
                                    savaExecDatas[exec_seq] = lo_langTmp;
                                    exec_seq++;
                                }
                            });
                        });
                    }

                });
                callback(null, '0200');
            },
            //刪除 0300
            function (callback) {
                _.each(deleteData, function (data) {
                    var tmpDel = {"function": "0"}; //0 代表刪除
                    tmpDel["table_name"] = mainTableName;
                    tmpDel.condition = [];
                    //組合where 條件
                    _.each(keyFields, function (keyField, keyIdx) {
                        if (!_.isUndefined(data[keyField])) {
                            tmpDel.condition.push({
                                key: keyField,
                                operation: "=",
                                value: data[keyField]
                            });
                        }
                    });

                    savaExecDatas[exec_seq] = tmpDel;
                    exec_seq++;

                    /** 刪除多語系 **/
                    if (la_multiLangFields.length > 0) {
                        var ls_langTable = la_multiLangFields[0].multi_lang_table;
                        var langDel = {"function": "0"};
                        langDel["table_name"] = ls_langTable;
                        langDel.condition = [];
                        _.each(keyFields, function (keyField, keyIdx) {
                            if (!_.isUndefined(data[keyField])) {
                                langDel.condition.push({
                                    key: keyField,
                                    operation: "=",
                                    value: data[keyField]
                                });
                            }
                        });
                        savaExecDatas[exec_seq] = langDel;
                        exec_seq++;
                    }

                });
                callback(null, '0300');
            },
            //修改 0400
            function (callback) {
                if (updateData.length == 0) {
                    return callback(null, '0400');
                }
                var updateFuncs = [];
                _.each(updateData, function (data) {
                    updateFuncs.push(
                        function (callback) {
                            var tmpEdit = {"function": "2"}; //2  編輯
                            tmpEdit["table_name"] = mainTableName;
                            tmpEdit["athena_id"] = userInfo.athena_id;
                            tmpEdit["hotel_cod"] = userInfo.fun_hotel_cod;

                            data = handleDateFormat(prgFields, data);

                            _.each(Object.keys(data), function (objKey) {
                                tmpEdit[objKey] = data[objKey];
                            });

                            tmpEdit = _.extend(tmpEdit, ruleAgent.getEditDefaultDataRule(session));

                            delete tmpEdit["ins_dat"];
                            delete tmpEdit["ins_usr"];

                            tmpEdit.condition = [];
                            var lo_keysData = {};
                            //組合where 條件
                            _.each(keyFields, function (keyField, keyIdx) {
                                if (!_.isUndefined(data[keyField])) {
                                    tmpEdit.condition.push({
                                        key: keyField,
                                        operation: "=",
                                        value: data[keyField]
                                    });
                                    lo_keysData[keyField] = data[keyField];
                                }
                            });

                            savaExecDatas[exec_seq] = tmpEdit;
                            exec_seq++;

                            /** 處理每一筆多語系 handleSaveMultiLang **/
                            if (!_.isUndefined(data.multiLang) && data.multiLang.length > 0) {
                                var langProcessFunc = [];
                                _.each(data.multiLang, function (lo_lang) {
                                    var ls_locale = lo_lang.locale || "";
                                    langProcessFunc.push(
                                        function (callback) {
                                            var chkFuncs = [];
                                            _.each(lo_lang, function (langVal, fieldName) {
                                                if (fieldName != "locale" && fieldName != "display_locale" && !_.isEmpty(langVal)) {
                                                    chkFuncs.push(
                                                        function (callback) {
                                                            var langTable = _.findWhere(la_multiLangFields, {ui_field_name: fieldName}).multi_lang_table;
                                                            var lo_langTmp = {
                                                                table_name: langTable,
                                                                words: langVal
                                                            };
                                                            var lo_condition = [
                                                                {
                                                                    key: "locale",
                                                                    operation: "=",
                                                                    value: ls_locale
                                                                },
                                                                {
                                                                    key: "field_name",
                                                                    operation: "=",
                                                                    value: fieldName
                                                                }
                                                            ];
                                                            _.each(keyFields, function (keyField) {
                                                                if (!_.isUndefined(data[keyField])) {
                                                                    lo_condition.push({
                                                                        key: keyField,
                                                                        operation: "=",
                                                                        value: data[keyField]
                                                                    });
                                                                    lo_keysData[keyField] = typeof data[keyField] === "string"
                                                                        ? data[keyField].trim() : data[keyField];

                                                                }
                                                            });


                                                            //檢查key + field 是否在langTable 有資料, 有的話更新, 沒有則新增
                                                            langSvc.handleMultiLangContentByKey(langTable, ls_locale, lo_keysData, fieldName, function (err, rows) {
                                                                if (rows.length > 0) {
                                                                    lo_langTmp["function"] = "2";  //編輯
                                                                    lo_langTmp["condition"] = lo_condition; //放入條件
                                                                } else {
                                                                    lo_langTmp["function"] = "1";  //新增;
                                                                    lo_langTmp["locale"] = ls_locale;  //
                                                                    lo_langTmp["field_name"] = fieldName;  //
                                                                    lo_langTmp = _.extend(lo_langTmp, lo_keysData);
                                                                }

                                                                savaExecDatas[exec_seq] = lo_langTmp;
                                                                exec_seq++;

                                                                callback(null, rows);

                                                            });
                                                        }
                                                    );
                                                }
                                            });
                                            async.parallel(chkFuncs, function (err, results) {
                                                callback(null, results);
                                            });
                                        }
                                    );

                                });

                                async.parallel(langProcessFunc, function (err, results) {
                                    callback(null, '0400');
                                });

                            } else {
                                callback(null, '0400');
                            }
                        }
                    );
                });

                async.parallel(updateFuncs, function (err, results) {
                    callback(null, '0400');
                });

            }
        ], function (err, results) {
            if (err) {
                return callback(err, false);
            }
            //抓取特殊的交易代碼
            mongoAgent.TransactionRf.findOne({
                prg_id: prg_id,
                page_id: 1,
                tab_page_id: 1,
                template_id: 'datagrid',
                func_id: '0500'
            }, function (errTrans, transData) {
                if (errTrans) {
                    return callback(errTrans, false);
                }

                var apiParams = {
                    "REVE-CODE": transData ? transData.trans_code || "BAC03009010000" : "BAC03009010000",
                    "program_id": prg_id,
                    "user": userInfo.usr_id,
                    "count": Object.keys(savaExecDatas).length,
                    "exec_data": savaExecDatas
                };

                tools.requestApi(sysConf.api_url, apiParams, function (apiErr, apiRes, data) {
                    var success = true;
                    var errMsg = null;
                    var log_id = moment().format("YYYYMMDDHHmmss");
                    if (apiErr || !data) {
                        chkResult.success = false;
                        errMsg = apiErr;
                    }
                    else if (data["RETN-CODE"] != "0000") {
                        chkResult.success = false;
                        errMsg = data["RETN-CODE-DESC"];
                    }

                    //寄出exceptionMail
                    if (!chkResult.success) {
                        mailSvc.sendExceptionMail({
                            log_id: log_id,
                            exceptionType: "execSQL",
                            errorMsg: errMsg
                        });
                    }

                    logSvc.recordLogAPI({
                        success: chkResult.success,
                        log_id: log_id,
                        prg_id: prg_id,
                        api_prg_code: '0300901000',
                        req_content: apiParams,
                        res_content: data
                    });
                    callback(errMsg, chkResult);
                });


            });
        });
    }

};

/**
 * 根據field 屬性格式化日期格式
 * @param prgFields
 * @param rowData
 * @return {*}
 */
function handleDateFormat(prgFields, rowData) {
    prgFields = _.filter(prgFields, function (field) {
        return field.ui_type == 'date' || field.ui_type == 'datetime';
    });

    _.each(rowData, function (val, field_name) {
        var la_tmpField = _.findWhere(prgFields, {ui_field_name: field_name});
        if (!_.isUndefined(la_tmpField)) {
            if (la_tmpField.ui_type == 'date') {
                rowData[field_name] = moment(new Date(val)).format("YYYY/MM/DD");
            } else if (la_tmpField.ui_type == 'datetime') {
                rowData[field_name] = moment(new Date(val)).format("YYYY/MM/DD HH:mm:ss");
            }
        }
    });

    return rowData;
}


