/**
 * Created by Jun on 2017/2/10.
 * dataGrid 相關處理
 */
var config = require("../configs/database");
var sysConf = require("../configs/SystemConfig");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var mongoAgent = require("../plugins/mongodb");
var _ = require("underscore");
var async = require("async");
var moment = require("moment");
var i18n = require("i18n");
var tools = require("../utils/CommonTools");
var dataRuleSvc = require("./DataRuleService");
var ruleAgent = require("../ruleEngine/ruleAgent");
var logSvc = require("./LogService");
var mailSvc = require("./MailService");
var langSvc = require("./LangService");
/**
 * 抓取datagrid 資料
 * @param userInfo
 * @param prg_id
 * @param callback
 */
exports.fetchPrgDataGridData = function (userInfo, prg_id, callback) {
    var params = {
        user_comp_cod: userInfo.user_comp_cod,
        user_id: userInfo.user_id,
        fun_comp_cod: userInfo.fun_comp_cod,
        fun_hotel_cod: userInfo.fun_hotel_cod,
        athena_id: userInfo.athena_id
    };
    var dataGridRows = [];
    var fieldData = [];

    async.waterfall([
        // 1)找尋對照檔對應的資料
        function (callback) {
            mongoAgent.TemplateDatagrid.findOne({prg_id: prg_id}, function (err, templateRule) {
                if (err || !templateRule) {
                    err = "找不到對應的程式編號";
                }

                callback(err, templateRule.rule_id);
            });
        },
        // 2)找尋對照檔需要用到的Table
        function (rule_id, callback) {
            mongoAgent.RuleRf.findOne({rule_id: rule_id, rule_type: 'SQL'}, function (err, ruleData) {
                if (err || !ruleData) {
                    err = "找不到對應的資料";
                    return callback(err, null);
                }

                callback(err, ruleData.rule);

            });
        },
        // 3)撈取對照檔的資料
        function (sqlTag, callback) {
            queryAgent.queryList(sqlTag, params, 0, 0, function (err, data) {
                dataGridRows = data;
                callback(err, dataGridRows);
            });
        },
        //找尋field 屬性資料
        function (dataRow, callback) {
            //先依使用者id 與館別找此PRG_ID有無欄位屬性，若無則抓預設
            mongoAgent.UIDatagridField.find({
                user_id: userInfo.usr_id,
                athena_id: userInfo.athena_id,
                prg_id: prg_id
            }).sort({col_seq: 1}).exec(function (err, UserFieldData) {
                if (err || UserFieldData.length == 0) {
                    mongoAgent.UIDatagridField.find({
                        user_id: "",
                        athena_id: "",
                        prg_id: prg_id
                    }).sort({col_seq: 1}).exec(function (err, commonField) {
                        fieldData = commonField;
                        callback(err, fieldData);
                    });
                } else {
                    fieldData = UserFieldData;
                    callback(err, fieldData);
                }
            });
        },
        function (col, callback) {
            mongoAgent.UIFieldFormat.find({prg_id: prg_id}, function (err, fmtRows) {
                if (!err) {
                    _.each(fieldData, function (field, fIdx) {
                        fieldData[fIdx] = field.toObject();
                        var tmpFmt = _.findWhere(fmtRows, {prg_id: prg_id, ui_field_name: field.ui_field_name}) || {};
                        fieldData[fIdx]["format_func_name"] = _.size(tmpFmt) > 0 ? tmpFmt["format_func_name"] : [];
                    });
                }

                callback(err, fieldData);
            });
        }
    ], function (err, result) {

        if (err) {
            console.error(err);
        }


        callback(err, dataGridRows, fieldData);

    });


};

/**
 * 取datagrid 資料欄位 (新)
 * @param session
 * @param prg_id
 * @param callback
 */
exports.fetchPrgDataGrid = function (session, prg_id, callback) {
    var userInfo = session.user;
    var page_id = 1;
    var params = {
        user_id: userInfo.usr_id,
        athena_id: userInfo.athena_id,
        hotel_cod: userInfo.fun_hotel_cod
    };
    var dataGridRows = [];
    var fieldData = [];

    async.waterfall([
        // 1)
        function (callback) {
            mongoAgent.UI_PageField.findOne({
                prg_id: prg_id,
                page_id: page_id,
                ui_type: 'grid'
            }, function (err, pageInfo) {
                if (err || !pageInfo) {
                    err = "Not found datagrid ";
                }

                callback(err, pageInfo);
            });
        },
        // 2)
        function (pageInfo, callback) {
            mongoAgent.TemplateRf.findOne({
                prg_id: prg_id,
                page_id: 1
            }, function (err, gridInfo) {
                if (err || !gridInfo) {
                    gridInfo = {};
                }

                callback(err, gridInfo);

            });
        },
        // 3)
        function (gridInfo, callback) {
            if (!_.isUndefined(gridInfo.rule_func_name) && !_.isEmpty(gridInfo.rule_func_name)) {
                queryAgent.queryList(gridInfo.rule_func_name.toUpperCase(), params, 0, 0, function (err, data) {
                    dataGridRows = data;
                    if (err) {
                        console.error(err);
                    }
                    callback(null, dataGridRows);
                });
            } else {
                callback(null, []);
            }

        },
        // 4)找尋field 屬性資料
        function (dataRow, callback) {
            //先依使用者id 與館別找此PRG_ID有無欄位屬性，若無則抓預設
            mongoAgent.UIDatagridField.find({
                user_id: userInfo.usr_id,
                athena_id: userInfo.athena_id,
                prg_id: prg_id,
                page_id: page_id
            }).sort({col_seq: 1}).select({_id: 0}).exec(function (err, UserFieldData) {
                if (err || UserFieldData.length == 0) {
                    mongoAgent.UIDatagridField.find({
                        user_id: "",
                        prg_id: prg_id,
                        page_id: page_id
                    }).sort({col_seq: 1}).select({_id: 0}).exec(function (err, commonFields) {
                        fieldData = tools.mongoDocToObject(commonFields);
                        callback(err, fieldData);
                    });
                } else {
                    fieldData = tools.mongoDocToObject(UserFieldData);
                    callback(err, fieldData);
                }
            });
        },
        //欄位多語系
        function (fieldData, callback) {
            mongoAgent.LangUIField.find({
                prg_id: prg_id,
                page_id: page_id
            }).exec(function (err, fieldLang) {
                fieldLang = tools.mongoDocToObject(fieldLang);
                _.each(fieldData, function (field, fIdx) {
                    let tmpLang = _.findWhere(fieldLang, {ui_field_name: field["ui_field_name"].toLowerCase()});
                    fieldData[fIdx]["ui_display_name"] = tmpLang ? tmpLang["ui_display_name_" + session.locale] : "";
                });
                callback(err, fieldData);
            });
        },
        // 5)尋找ui_type有select的話，取得combobox的資料；看(visiable,modificable,requirable) "C"要檢查是否要顯示欄位
        function (fields, callback) {

            var selectDSFunc = [];
            _.each(fieldData, function (field, fIdx) {
                if (field.ui_type == 'select' || field.ui_type == 'multiselect' || field.ui_type == 'checkbox' || field.ui_type == 'selectgrid') {

                    //讀取selectgrid的設定參數
                    if(field.ui_type == 'selectgrid'){
                         var func_name = prg_id + '_' + field.ui_field_name;
                         fieldData[fIdx].selectGridOptions = ruleAgent[func_name]();
                    }

                    selectDSFunc.push(
                        function (callback) {
                            mongoAgent.UI_Type_Select.findOne({
                                prg_id: prg_id,
                                ui_field_name: field.ui_field_name
                            }).exec(function (err, selRow) {
                                fieldData[fIdx].selectData = [];
                                if (selRow) {
                                    selRow = selRow.toObject();
                                    fieldData[fIdx].ds_from_sql = selRow.ds_from_sql || "";
                                    fieldData[fIdx].referiable = selRow.referiable || "N";
                                    fieldData[fIdx].defaultVal = selRow.defaultVal || "";

                                    dataRuleSvc.getSelectOptions(userInfo, selRow, function (selectData) {
                                        fieldData[fIdx].selectData = selectData;
                                        callback(null, {ui_field_idx: fIdx, ui_field_name: field.ui_field_name});
                                    });

                                } else {
                                    callback(null, {ui_field_idx: fIdx, ui_field_name: field.ui_field_name});
                                }
                            });
                        }
                    );
                }

                //SAM:看(visiable,modificable,requirable) "C"要檢查是否要顯示欄位 2017/6/20
                var attrName = field.attr_func_name;
                if (!_.isEmpty(attrName)) {
                    selectDSFunc.push(
                        function (callback) {
                            if (field.visiable == "C") {
                                if (!_.isEmpty(attrName) && !_.isUndefined(ruleAgent[attrName])) {
                                    ruleAgent[attrName](field, userInfo, function (err, result) {
                                        if (result) {
                                            fieldData[fIdx] = result[0];
                                            callback(err, {ui_field_idx: fIdx, field: result});
                                        } else {
                                            callback(err, {ui_field_idx: fIdx, field: result});
                                        }
                                    });
                                } else {
                                    callback(null, {ui_field_idx: fIdx, field: result});
                                }
                            } else if (field.modificable == "C") {
                                if (!_.isEmpty(attrName) && !_.isUndefined(ruleAgent[attrName])) {
                                    ruleAgent[attrName](field, userInfo, function (err, result) {
                                        if (result) {
                                            fieldData[fIdx] = result[0];
                                            callback(err, {ui_field_idx: fIdx, field: result});
                                        } else {
                                            callback(err, {ui_field_idx: fIdx, field: result});
                                        }
                                    });
                                } else {
                                    callback(null, {ui_field_idx: fIdx, field: result});
                                }
                            } else if (field.requirable == "C") {
                                if (!_.isEmpty(attrName) && !_.isUndefined(ruleAgent[attrName])) {
                                    ruleAgent[attrName](field, userInfo, function (err, result) {
                                        if (result) {
                                            fieldData[fIdx] = result[0];
                                            callback(err, {ui_field_idx: fIdx, field: result});
                                        } else {
                                            callback(err, {ui_field_idx: fIdx, field: result});
                                        }
                                    });
                                } else {
                                    callback(null, {ui_field_idx: fIdx, field: result});
                                }
                            } else {
                                callback(null, {ui_field_idx: fIdx, visiable: field.visiable});
                            }
                        }
                    );
                }
            });

            async.parallel(selectDSFunc, function (err, result) {
                callback(err, result);
            });
        },
        // 6)內容多語處理
        function (data, callback) {
            langSvc.handleMultiDataLangConv(dataGridRows, prg_id, page_id, session.locale, function (err, Rows) {
                dataGridRows = Rows;
                callback(null, dataGridRows);
            });
        }
    ], function (err, result) {

        if (err) {
            console.error(err);
        }

        callback(err, dataGridRows, fieldData);

    });


};

/**
 * 儲存使用者離開後datagrid 欄位的屬性
 * @param prg_id {String}
 * @param page_id {Number}
 * @param userInfo {Object}
 * @param fieldOptions {Array}
 * @param callback
 */
exports.doSaveFieldOption = function (prg_id, page_id, userInfo, fieldOptions, callback) {

    var lo_fieldGrp = _.groupBy(fieldOptions, "grid_field_name");
    var la_oriFieldData = [];  //程式原始欄位資料
    var la_userFieldData = [];  //For 使用者程式原始欄位資料
    async.waterfall([
        function (cb) {
            var lo_key = {
                prg_id: prg_id,
                page_id: Number(page_id),
                user_id: {$in: ['', userInfo.usr_id.trim()]},
                athena_id: {$in: ['', userInfo.athena_id]}
            };
            mongoAgent.UIDatagridField.find(lo_key).select({_id: 0}).exec(function (err, allFieldData) {
                if (err || !allFieldData) {
                    allFieldData = [];
                }
                tools.mongoDocToObject(allFieldData);
                la_oriFieldData = _.filter(allFieldData, function (field) {
                    return field.user_id == "" || field.user_id == "";
                });
                la_userFieldData = _.filter(allFieldData, function (field) {
                    return field.user_id != "" || field.user_id != "";
                });
                cb(err, allFieldData);
            });
        },
        function (allFieldData, cb) {
            var laf_saveFuncs = []; //要執行的function
            _.each(lo_fieldGrp, function (fields, grid_field_name) {
                // 與原始欄位資料比較 ，補上user 沒有存到的欄位
                _.each(_.where(la_oriFieldData, {grid_field_name: grid_field_name}), function (field) {
                    if (_.findIndex(fields, {ui_field_name: field.ui_field_name}) == -1) {
                        fields.push(field);
                    }
                });
                _.each(fields, function (field) {
                    laf_saveFuncs.push(
                        function (callback) {
                            let lo_cond = {
                                "user_id": userInfo.usr_id.trim(),
                                "athena_id": userInfo.athena_id,
                                "prg_id": prg_id.trim(),
                                "ui_field_name": field.ui_field_name,
                                "grid_field_name": field.grid_field_name
                            };
                            let oriSingleField = _.findWhere(la_oriFieldData, {ui_field_name: field.ui_field_name}) || {};
                            let userField = _.findIndex(la_userFieldData, {
                                "ui_field_name": field.ui_field_name,
                                "grid_field_name": field.grid_field_name
                            });

                            field.user_id = userInfo.usr_id.trim();
                            field.athena_id = Number(userInfo.athena_id);
                            field.prg_id = prg_id.trim();
                            field = _.extend(oriSingleField, field);
                            if (userField > -1) {
                                //更新
                                mongoAgent.UIDatagridField.update(lo_cond, field, function (err) {
                                    callback(err, field.ui_field_name);
                                });
                            } else {
                                //新增
                                new mongoAgent.UIDatagridField(field).save(function (err) {
                                    callback(err, field.ui_field_name);
                                });
                            }
                        }
                    );

                });
            });

            cb(null, laf_saveFuncs);
        }

    ], function (err, laf_saveFuncs) {
        async.parallel(laf_saveFuncs, function (err) {
            if (err) {
                callback(err, false);
            } else {
                callback(null, true);
            }
        });
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
                    if(la_multiLangFields.length > 0){
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
        ], function (err, result) {

            if (err) {
                return callback(err, false);
            }
            //抓取對應的table

            var apiParams = {
                "REVE-CODE": "BAC03009010000",
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
    }

};

/**
 * datagrid 新增規則
 * @param postData
 * @param session
 * @param callback
 */
exports.getPrgRowDefaultObject = function (postData, session, callback) {
    var lo_result = {
        defaultValues: {
            createRow: "Y"
        }
    };
    var addRuleFunc = "";  //按下新增按鈕的規則
    var addTypeSelect = "";  //帶預設值
    var prg_id = postData["prg_id"];
    var page_id = postData["page_id"] || 1;
    async.waterfall([
        //抓取規則
        function (callback) {
            mongoAgent.DatagridFunction
                .findOne({prg_id: prg_id, page_id: page_id, func_id: '0200'}).exec(function (err, funcRules) {

                if (funcRules) {
                    addRuleFunc = funcRules.toObject();
                }

                callback(err, true);
            });
        },
        //取得欄位預設值
        function (data, callback) {
            mongoAgent.UI_Type_Select
                .findOne({prg_id: prg_id}).find(function (err, funcRules) {

                if (funcRules) {
                    addTypeSelect = funcRules;
                }
                callback(err, true);
            });
        },
        //抓取新增資料
        function (data, callback) {
            lo_result.defaultValues = _.extend(lo_result.defaultValues, ruleAgent.getCreateCommonDefaultDataRule(session));
            if (!_.isEmpty(addRuleFunc) && !_.isUndefined(ruleAgent[addRuleFunc.rule_func_name])) {
                ruleAgent[addRuleFunc.rule_func_name](postData, session, function (err, result) {
                    lo_result.defaultValues = _.extend(lo_result.defaultValues, result.defaultValues);
                    callback(err, lo_result);
                });
            } else {
                callback(null, lo_result);
            }
        },
        //將預設值放進欄位中
        function (data, callback) {
            _.each(addTypeSelect, function (funRow) {
                funRow = funRow.toObject();
                if (funRow["defaultVal"] != "") {
                    var columnName = funRow["ui_field_name"];
                    lo_result.defaultValues[columnName] = funRow["defaultVal"];
                }
            })
            callback(null, lo_result);
        }
    ], function (err, result) {
        callback(null, lo_result);
    });
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


