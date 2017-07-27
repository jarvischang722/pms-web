/**
 * Created by Jun on 2017/2/25.
 * page single gird 相關
 */
var config = require("../configs/database");
var sysConf = require("../configs/SystemConfig");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var mongoAgent = require("../plugins/mongodb");
var _ = require("underscore");
var async = require("async");
var i18n = require("i18n");
var moment = require("moment");
var tools = require("../utils/CommonTools");
var dataRuleSvc = require("./DataRuleService");
var commonRule = require("../ruleEngine/rules/CommonRule");
var logSvc = require("./LogService");
var mailSvc = require("./MailService");
var langSvc = require("./LangService");
var ruleAgent = require("../ruleEngine/ruleAgent");

/**
 * 抓取singlePage 欄位資料
 * @param session {Object}: session
 * @param page_id {Number} : 頁面編號
 * @param prg_id {String}  : 程式編號
 * @param callback
 */
exports.fetchPageFieldAttr = function (session, page_id, prg_id, callback) {
    var la_fields = []; //欄位屬性陣列
    var userInfo = session.user;
    async.waterfall([
        //1) 撈出全部的欄位屬性
        function (callback) {
            mongoAgent.UI_PageField.find({page_id: page_id, prg_id: prg_id}).sort({
                row_seq: 1,
                col_seq: 1
            }).exec(function (err, fields) {
                la_fields = tools.mongoDocToObject(fields);
                callback(err, fields);
            });
        },
        //2) 撈取屬性陣列裡有select的來源
        function (fields, callback) {
            var selectDSFunc = [];
            _.each(la_fields, function (field, fIdx) {
                if (field.ui_type == 'select') {
                    selectDSFunc.push(
                        function (callback) {
                            mongoAgent.UI_Type_Select.findOne({
                                prg_id: prg_id,
                                ui_field_name: field.ui_field_name
                            }).exec(function (err, selRow) {
                                la_fields[fIdx].selectData = [];
                                if (selRow) {
                                    selRow = selRow.toObject();
                                    la_fields[fIdx].ds_from_sql = selRow.ds_from_sql || "";
                                    la_fields[fIdx].referiable = selRow.referiable || "N";
                                    la_fields[fIdx].defaultVal = selRow.defaultVal || "";
                                    dataRuleSvc.getSelectOptions(userInfo, selRow, function (selectData) {
                                        la_fields[fIdx].selectData = selectData;
                                        callback(null, {ui_field_idx: fIdx, ui_field_name: field.ui_field_name});
                                    });
                                }else{
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
                                            la_fields[fIdx] = result[0];
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
                                            la_fields[fIdx] = result[0];
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
                                            la_fields[fIdx] = result[0];
                                            callback(err, {ui_field_idx: fIdx, field: result});
                                        } else {
                                            callback(err, {ui_field_idx: fIdx, field: result});
                                        }
                                    });
                                } else {
                                    callback(null, {ui_field_idx: fIdx, field: result});
                                }
                            }
                        }
                    );
                }
            });

            async.parallel(selectDSFunc, function (err, result) {
                callback(err, result);
            });
        },
        //3) 撈取page2 如果有grid的資料跟欄位
        function (result, callback) {
            var ln_grid_field_idx = _.findIndex(la_fields, {page_id: page_id, ui_type: 'grid'});

            if (ln_grid_field_idx > -1) {
                var lo_grid_field = la_fields[ln_grid_field_idx];

                mongoAgent.UIDatagridField.find({
                    prg_id: prg_id,
                    user_id: userInfo.usr_id,
                    athena_id: userInfo.athena_id,
                    page_id: Number(page_id),
                    grid_field_name: lo_grid_field.ui_field_name
                }).sort({col_seq: 1}).exec(function (err, fields) {
                    if (err || fields.length == 0) {
                        mongoAgent.UIDatagridField.find({
                            user_id: "",
                            athena_id: "",
                            prg_id: prg_id,
                            page_id: page_id
                        }).sort({col_seq: 1}).exec(function (err, commonFields) {
                            lo_grid_field.datagridFields = tools.mongoDocToObject(commonFields);
                            callback(err, commonFields);
                        });
                    } else {
                        lo_grid_field.datagridFields = tools.mongoDocToObject(fields);
                        callback(err, fields);
                    }

                });
            } else {
                callback(null, 'grid');
            }

        },
        //4 處理欄位多語系
        function (fields, callback) {
            mongoAgent.LangUIField.find({
                prg_id: prg_id,
                page_id: page_id
            }).exec(function (err, fieldLang) {
                _.each(la_fields, function (field, fIdx) {
                    let tmpLang = _.findWhere(fieldLang, {ui_field_name: field["ui_field_name"].toLowerCase()});
                    la_fields[fIdx]["ui_display_name"] = tmpLang ? tmpLang["ui_display_name_" + session.locale] : "";
                    if (field.ui_type == 'grid') {
                        _.each(field.datagridFields, function (field, Idx) {
                            let tmpLang = _.findWhere(fieldLang, {ui_field_name: field["ui_field_name"].toLowerCase()});
                            la_fields[fIdx].datagridFields[Idx]["ui_display_name"] = tmpLang ? tmpLang["ui_display_name_" + session.locale] : "";
                        });
                    }
                });
                callback(err, la_fields);
            });
        }
    ], function (err, result) {
        if (err) {
            la_fields = [];
        }
        callback(err, la_fields);
    });


};

/**
 * 撈取單筆記錄
 * @param session{Object}: session
 * @param postData{Object} :  參數
 * @param callback {function} (err, rowData)
 */
exports.handleSinglePageRowData = function (session, postData, callback) {
    var prg_id = postData.prg_id || "";
    var userInfo = session.user;
    var lo_rowData = {};
    var lo_dtData = [];
    async.waterfall([
            function (callback) {
                mongoAgent.TemplateRf.findOne({
                    prg_id: prg_id,
                    page_id: 2
                }, function (err, singleData) {

                    if (err || !singleData) {
                        callback("no data", {});
                        return;
                    }
                    singleData = singleData.toObject();

                    //將統一的參數先放進去
                    postData["prg_id"] = prg_id;
                    postData["athena_id"] = userInfo.athena_id;
                    postData["hotel_cod"] = userInfo.fun_hotel_cod;
                    postData["user_id"] = userInfo.usr_id;

                    postData = tools.handlePreprocessData(postData);

                    queryAgent.query(singleData.rule_func_name.toUpperCase(), postData, function (err, rowData) {

                        if (err || !rowData) {
                            return callback("no data", {});
                        }

                        langSvc.handleSingleDataLangConv(rowData, prg_id, 2, session.locale, function (err, rowData) {
                            lo_rowData = tools.handlePreprocessData(rowData);
                            callback(null, rowData);
                        });

                    });
                });
            },
            //抓取dt datagrid 資料
            function (rowData, callback) {
                let go_dataGridField;
                async.waterfall([
                    function (callback) {
                        mongoAgent.UI_PageField.findOne({
                            prg_id: prg_id,
                            ui_type: 'grid',
                            page_id: 2
                        }, function (err, pageField) {
                            callback(err, pageField);
                        });
                    },
                    // 找dt datagrid欄位資料
                    function (pageField, callback) {
                        mongoAgent.UIDatagridField.find({
                            prg_id: prg_id,
                            page_id: 2
                        }, function (err, dataGridField) {
                            go_dataGridField = tools.mongoDocToObject(dataGridField);
                            callback(err, pageField);
                        });
                    },
                    function (pageField, callback) {
                        if (pageField) {
                            mongoAgent.TemplateRf.findOne({
                                prg_id: prg_id,
                                page_id: 2,
                                template_id:'datagrid'
                            }, function (err, grid) {
                                callback(err, grid);
                            });
                        } else {
                            callback(null, {});
                        }

                    },
                    function (grid, callback) {
                        if (_.size(grid)) {
                            let params = {};
                            let dtKeys = _.pluck(_.where(go_dataGridField, {keyable: 'Y'}), "ui_field_name");
                            _.each(dtKeys, function (key) {
                                params[key] = lo_rowData[key] || '';
                            });
                            params["athena_id"] = userInfo.athena_id;
                            params["hotel_cod"] = userInfo.hotel_cod;

                            queryAgent.queryList(grid.rule_func_name.toUpperCase(), params, 0, 0, function (err, dtDataList) {
                                _.each(dtDataList, function (row, idx) {
                                    dtDataList[idx] = tools.handlePreprocessData(row);
                                });
                                lo_dtData = dtDataList;

                                callback(err, dtDataList);
                            });
                        } else {
                            callback(null, []);
                        }
                    }
                ], function (err, result) {
                    callback(err, lo_dtData);
                });


            },
            function (rowData, callback) {
                //func_id  0401  抓完要編輯的資料後，要檢查此筆Row Data 可否被編輯
                mongoAgent.DatagridFunction.findOne({
                    prg_id: prg_id,
                    func_id: '0401'
                }, function (err, func) {
                    if (err || !func) {
                        func = "";
                    } else {
                        func = func.toObject().rule_func_name;
                    }

                    dataRuleSvc.chkIsModificableRowData(func, lo_rowData, session, function (err, result) {
                        callback(err, result);
                    });
                });


            }, function (result, callback) {
                mongoAgent.UI_PageField.find({
                    prg_id: prg_id,
                    page_id: 2
                }, function (err, pageField) {
                    dataValueChange(pageField, lo_rowData);
                    callback(err, result);
                });
            }
        ],
        function (err, result) {
            result["rowData"] = lo_rowData;
            result["dtData"] = lo_dtData;
            callback(err, result);
        }
    );


};

/**
 * 儲存新增修改刪除資料
 * @param session {Object} : session
 * @param postData {Object} : 前端導入的資料
 * @param callback {function} :
 */
exports.handleSaveSingleGridData = function (postData, session, callback) {
    var userInfo = session.user;
    var savaExecDatas = {};  //要打API 所有exec data
    var exec_seq = 1;        // 執行順序 從1開始
    var page_id = postData["page_id"] || 2;
    var prg_id = postData["prg_id"] || "";
    var deleteData = postData["deleteData"] || [];
    var createData = postData["createData"] || [];
    var editData = postData["editData"] || [];
    var dt_deleteData = postData["dt_deleteData"] || [];
    var dt_createData = postData["dt_createData"] || [];
    var dt_editData = postData["dt_editData"] || [];
    var prgFields = [];        // 執行 program  的欄位
    var la_dtPrgDatagridFields = [];   // 執行 dt datagrid 的欄位
    var mainTableName = "";    // 主要Table name
    var dtTableName = "";      // DT Table name
    var la_keyFields = [];        // 主檔資料表pk
    var la_dtkeyFields = [];      // 明細資料表pk
    var la_dtFields = [];           //明細的資料欄位

    /** main process **/
    async.waterfall([
        getTableName,       //(1)撈取要異動的table name
        getDtTableName,     //(2)取得DT要異動的table name
        getPrgField,        //(3)取得此程式的欄位
        chkDtDeleteRule,    //(4)DT 刪除資料規則檢查
        combineDtDeleteExecData,//(5)組合DT 刪除檢查
        chkRuleBeforeSave,  //(6)資料儲存前檢查
        combineMainData,    //(7)組合此筆要新增刪除修改的資料
        chkDtCreateEditRule, //(8)DT 新增修改規則檢查
        combineDtCreateEditExecData, //(9)組合DT 新增修改執行資料
        chkRuleAfterSave,   //(10)資料儲存後檢查
        doSaveDataByAPI     //(11)打API 儲存
    ], function (err, result) {
        if (err) {
            err = err.errorMsg;
        }
        callback(err, result);
    });

    //撈取要異動的table name
    function getTableName(callback) {
        //抓取對應的table
        mongoAgent.TemplateRf.findOne({
            page_id: page_id,
            prg_id: prg_id
            // template_id: "gridsingle"
        }, function (err, sg_tmp) {
            if (err || !sg_tmp) {
                callback("not found table name", mainTableName);
                return;
            }

            mainTableName = sg_tmp.toObject().table_name || "";
            callback(null, mainTableName);
        });
    }

    //取得要異動dt 的Table name
    function getDtTableName(prgFields, callback) {
        var params = {
            prg_id: prg_id,
            page_id: 2,
            ui_type: 'grid'
        };
        mongoAgent.UI_PageField.findOne(params).exec(function (err, dtfield) {
            if (dtfield) {

                params = {
                    prg_id: prg_id,
                    ui_field_name: dtfield.toObject().ui_field_name
                };
                mongoAgent.TemplateRf.findOne({
                    prg_id: prg_id,
                    page_id: 2,
                    template_id: 'datagrid'
                }).exec(function (err, grid) {
                    if (grid) {
                        dtTableName = grid.toObject().table_name;
                        callback(err, dtTableName);
                    } else {
                        callback(null, dtTableName);
                    }
                });
            } else {
                callback(null, dtTableName);
            }
        });
    }

    //取得此程式的欄位
    function getPrgField(dtTableName, callback) {
        async.parallel([
            function (callback) {
                mongoAgent.UI_PageField.find({
                    prg_id: prg_id,
                    athena_id: '',
                    user_id: '',
                    page_id: 2
                }, function (err, fields) {
                    if (err) {
                        callback(err, fields);
                    }
                    if (fields.length > 0) {
                        fields = tools.mongoDocToObject(fields);
                    }
                    prgFields = fields;
                    la_dtFields = prgFields;
                    la_keyFields = _.where(fields, {keyable: 'Y'}) || [];
                    callback(null, la_keyFields);
                });
            },
            //取dt datagrid欄位
            function (callback) {

                if (!_.isEmpty(dtTableName)) {
                    mongoAgent.UIDatagridField.find({
                        prg_id: prg_id,
                        athena_id: '',
                        user_id: '',
                        page_id: 2
                    }, function (err, fields) {
                        if (err) {
                            callback(err, fields);
                        }
                        if (fields.length > 0) {
                            fields = tools.mongoDocToObject(fields);
                            la_dtPrgDatagridFields = fields;
                        }
                        la_dtkeyFields = _.where(la_dtPrgDatagridFields, {keyable: 'Y'}) || [];
                        callback(null, la_dtkeyFields);
                    });
                } else {
                    callback(null, la_dtkeyFields);
                }
            }
        ], function (err, result) {
            deleteData = tools.handlePreprocessData(postData["deleteData"], prgFields);
            createData = tools.handlePreprocessData(postData["createData"], prgFields);
            editData = tools.handlePreprocessData(postData["editData"], prgFields);
            dt_deleteData = tools.handlePreprocessData(postData["dt_deleteData"], la_dtkeyFields);
            dt_createData = tools.handlePreprocessData(postData["dt_createData"], la_dtkeyFields);
            dt_editData = tools.handlePreprocessData(postData["dt_editData"], la_dtkeyFields);
            callback(err, result);
        });

    }


    //DT 刪除資料規則檢查
    function chkDtDeleteRule(fields, callback) {

        if (!_.isUndefined(postData["dt_deleteData"]) && postData["dt_deleteData"].length > 0) {
            postData["page_id"] = page_id;
            postData["isDtData"] = true;
            dataRuleSvc.handleDeleteFuncRule(postData, session, function (err, result) {
                if (err || !result.success) {
                    callback(err, result);
                } else {
                    callback(null, result);
                }
            });
        } else {
            callback(null, true);
        }

    }

    //組合DT 刪除檢查
    function combineDtDeleteExecData(checkResult, callback) {
        try {
            _.each(dt_deleteData, function (data) {
                var tmpDel = {"function": "0", "table_name": dtTableName}; //0 代表刪除
                tmpDel.condition = [];
                //組合where 條件
                _.each(la_dtkeyFields, function (keyField, keyIdx) {
                    if (!_.isUndefined(data[keyField.ui_field_name])) {
                        tmpDel.condition.push({
                            key: keyField.ui_field_name,
                            operation: "=",
                            value: data[keyField.ui_field_name]
                        });
                    }

                });
                savaExecDatas[exec_seq] = tmpDel;
                exec_seq++;
            });

            callback(null, '0300');

        } catch (err) {

            callback(err, '0300');

        }
    }

    //資料儲存前檢查
    function chkRuleBeforeSave(fields, callback) {

        dataRuleSvc.doChkSingleGridBeforeSave(postData, session, function (chk_err, chk_result) {
            if (!chk_err && chk_result.extendExecDataArrSet.length > 0) {
                _.each(chk_result.extendExecDataArrSet, function (execData) {
                    savaExecDatas[exec_seq] = execData;
                    exec_seq++;
                });
            }

            callback(chk_err, chk_result);

        });

    }

    //組合此筆要新增刪除修改的資料
    function combineMainData(chkReuslt, callback) {
        var la_multiLangFields = _.filter(prgFields, function (field) {
            return field.multi_lang_table != "";
        });  //多語系欄位
        async.parallel([
            //新增 0200
            function (callback) {
                if (_.isUndefined(createData) || createData.length == 0) {
                    return callback(null, '0200');
                }
                _.each(createData, function (data) {
                    var tmpIns = {"function": "1", "table_name": mainTableName}; //1  新增


                    _.each(Object.keys(data), function (objKey) {
                        if (!_.isUndefined(data[objKey])) {
                            var value = data[objKey];

                            _.each(la_dtFields, function (row) {
                                if (row.ui_field_name == objKey) {
                                    var finalValue = changeValueFormat4Save(value, row.ui_type);
                                    value = finalValue ? finalValue : value;
                                }
                            });

                            if (typeof data[objKey] === 'string') {
                                data[objKey] = data[objKey].trim();
                            }
                            tmpIns[objKey] = value;
                        }
                    });
                    tmpIns = _.extend(tmpIns, commonRule.getCreateCommonDefaultDataRule(session));
                    savaExecDatas[exec_seq] = tmpIns;
                    exec_seq++;

                    /** 處理每一筆多語系 handleSaveMultiLang **/
                    if (!_.isUndefined(data.multiLang) && data.multiLang.length > 0) {
                        _.each(data.multiLang, function (lo_lang) {
                            var ls_locale = lo_lang.locale || "";
                            _.each(lo_lang, function (langVal, fieldName) {
                                if (fieldName != "locale" && !_.isEmpty(langVal)) {
                                    var langTable = _.findWhere(la_multiLangFields, {ui_field_name: fieldName}).multi_lang_table;
                                    var lo_langTmp = {
                                        function: '1',
                                        table_name: langTable,
                                        locale: ls_locale,
                                        field_name: fieldName,
                                        words: langVal
                                    };
                                    _.each(_.pluck(la_keyFields, "ui_field_name"), function (keyField) {
                                        if (!_.isUndefined(data[keyField])) {
                                            lo_langTmp[keyField] = typeof data[keyField] === "string"
                                                ? data[keyField].trim() : data[keyField];
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
                if (_.isUndefined(deleteData) || deleteData.length == 0) {
                    return callback(null, '0300');
                }
                _.each(deleteData, function (data) {
                    var tmpDel = {"function": "0", "table_name": mainTableName}; //0 代表刪除
                    tmpDel.condition = [];
                    //組合where 條件
                    _.each(la_keyFields, function (keyField, keyIdx) {
                        if (!_.isUndefined(data[keyField.ui_field_name])) {
                            tmpDel.condition.push({
                                key: keyField.ui_field_name,
                                operation: "=",
                                value: data[keyField.ui_field_name]
                            });
                        }

                    });
                    savaExecDatas[exec_seq] = tmpDel;
                    exec_seq++;

                    if (dtTableName != "") {
                        combineDelDetailData(dtTableName, la_dtkeyFields, data);
                    }
                });
                callback(null, '0300');
            },
            //修改 0400
            function (callback) {
                if (_.isUndefined(editData) || editData.length == 0) {
                    return callback(null, '0400');
                }

                _.each(editData, function (data) {
                    var tmpEdit = {"function": "2", "table_name": mainTableName}; //2  編輯
                    _.each(Object.keys(data), function (objKey) {
                        if (!_.isUndefined(data[objKey])) {
                            tmpEdit[objKey] = data[objKey];

                            _.each(la_dtFields, function (row) {
                                if (row.ui_field_name == objKey) {
                                    var finalValue = changeValueFormat4Save(tmpEdit[objKey], row.ui_type);
                                    tmpEdit[objKey] = finalValue ? finalValue : tmpEdit[objKey];
                                }
                            });
                        }
                    });
                    var lo_keysData = {};
                    tmpEdit = _.extend(tmpEdit, commonRule.getEditDefaultDataRule(session));

                    delete tmpEdit["ins_dat"];
                    delete tmpEdit["ins_usr"];

                    tmpEdit.condition = [];
                    //組合where 條件
                    _.each(la_keyFields, function (keyField) {
                        if (!_.isUndefined(data[keyField.ui_field_name])) {
                            tmpEdit.condition.push({
                                key: keyField.ui_field_name,
                                operation: "=",
                                value: data[keyField.ui_field_name]
                            });
                            lo_keysData[keyField.ui_field_name] = data[keyField.ui_field_name];
                        }

                    });

                    /** 處理每一筆多語系 handleSaveMultiLang **/
                    if (!_.isUndefined(data.multiLang) && data.multiLang.length > 0) {
                        var langProcessFunc = [];
                        _.each(data.multiLang, function (lo_lang) {
                            var ls_locale = lo_lang.locale || "";
                            langProcessFunc.push(
                                function (callback) {
                                    var chkFuncs = [];
                                    _.each(lo_lang, function (langVal, fieldName) {
                                        if (fieldName != "locale" && !_.isEmpty(langVal)) {
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
                                                    _.each(_.pluck(la_keyFields, "ui_field_name"), function (keyField) {
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
                            savaExecDatas[exec_seq] = tmpEdit;
                            exec_seq++;
                            callback(null, '0400');
                        });
                    } else {
                        savaExecDatas[exec_seq] = tmpEdit;
                        exec_seq++;
                        callback(null, '0400');
                    }
                });


            }
        ], function (err, result) {
            callback(err, result);
        });
    }

    //DT 新增修改規則檢查
    function chkDtCreateEditRule(result, callback) {
        callback(null, result);
    }

    //組合DT 新增修改執行資料
    function combineDtCreateEditExecData(chkResult, callback) {
        var la_dtMultiLangFields = _.filter(la_dtPrgDatagridFields, function (field) {
            return field.multi_lang_table != "";
        });  //多語系欄位

        try {
            //dt 新增
            _.each(dt_createData, function (data) {
                var tmpIns = {"function": "1", "table_name": dtTableName}; //1  新增
                tmpIns = _.extend(tmpIns, commonRule.getCreateCommonDefaultDataRule(session));
                var mnRowData = data["mnRowData"] || {};
                delete data["mnRowData"];

                _.each(Object.keys(data), function (objKey) {
                    if (!_.isUndefined(data[objKey])) {
                        var value = data[objKey];
                        if (typeof data[objKey] === 'string') {
                            data[objKey] = data[objKey].trim();
                        }
                        tmpIns[objKey] = value;
                    }
                });

                //塞入mn pk
                _.each(la_keyFields, function (keyField) {
                    if (!_.isUndefined(mnRowData[keyField.ui_field_name])) {
                        tmpIns[keyField.ui_field_name] = mnRowData[keyField.ui_field_name].trim();
                    }
                });
                savaExecDatas[exec_seq] = tmpIns;
                exec_seq++;

                /** 處理每一筆多語系 handleSaveMultiLang **/
                if (!_.isUndefined(data.multiLang) && data.multiLang.length > 0) {
                    _.each(data.multiLang, function (lo_lang) {
                        var ls_locale = lo_lang.locale || "";
                        _.each(lo_lang, function (langVal, fieldName) {
                            if (fieldName != "locale" && fieldName != "display_locale" && !_.isEmpty(langVal)) {
                                var langTable = _.findWhere(la_dtMultiLangFields, {ui_field_name: fieldName}).multi_lang_table;
                                var lo_langTmp = {
                                    function: '1',
                                    table_name: langTable,
                                    locale: ls_locale,
                                    field_name: fieldName,
                                    words: langVal
                                };
                                _.each(_.pluck(la_dtkeyFields, "ui_field_name"), function (keyField) {
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

            //dt 編輯
            _.each(dt_editData, function (data) {
                var tmpEdit = {"function": "2", "table_name": dtTableName}; //2  編輯
                var mnRowData = data["mnRowData"] || {};

                delete data["mnRowData"];

                _.each(Object.keys(data), function (objKey) {
                    var objValue = data[objKey];
                    if (!_.isUndefined(data[objKey]) && typeof objValue === "string") {
                        tmpEdit[objKey] = objValue.trim();
                    }
                    tmpEdit[objKey] = objValue;
                });

                //塞入mn pk
                _.each(la_keyFields, function (keyField) {
                    if (!_.isUndefined(mnRowData[keyField.ui_field_name])) {
                        tmpEdit[keyField.ui_field_name] = mnRowData[keyField.ui_field_name].trim();
                    }
                });

                tmpEdit = _.extend(tmpEdit, commonRule.getEditDefaultDataRule(session));

                tmpEdit.condition = [];
                //組合where 條件
                _.each(la_dtkeyFields, function (keyField) {
                    if (!_.isUndefined(data[keyField.ui_field_name])) {
                        tmpEdit.condition.push({
                            key: keyField.ui_field_name,
                            operation: "=",
                            value: data[keyField.ui_field_name]
                        });
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
                                                var langTable = _.findWhere(la_dtMultiLangFields, {ui_field_name: fieldName}).multi_lang_table;
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
                                                var lo_keysData = {};
                                                _.each(_.pluck(la_dtkeyFields, "ui_field_name"), function (keyField) {
                                                    if (!_.isUndefined(tmpEdit[keyField])) {
                                                        lo_condition.push({
                                                            key: keyField,
                                                            operation: "=",
                                                            value: data[keyField]
                                                        });
                                                        lo_keysData[keyField] = typeof tmpEdit[keyField] === "string"
                                                            ? data[keyField].trim() : tmpEdit[keyField];

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
            });


            callback(null, savaExecDatas);
        } catch (err) {
            callback(err, savaExecDatas);
        }

    }

    //資料儲存後檢查
    function chkRuleAfterSave(combineReuslt, callback) {
        dataRuleSvc.doChkSingleGridAfterSave(postData, session, function (chk_err, chk_result) {
            if (!chk_err && chk_result.length > 0) {
                _.each(chk_result.extendExecDataArrSet, function (execData) {
                    savaExecDatas[exec_seq] = execData;
                    exec_seq++;
                });
            }
            callback(chk_err, chk_result);

        });
    }

    //打API 儲存
    function doSaveDataByAPI(chk_result, callback) {

        var apiParams = {
            "REVE-CODE": "BAC03009010000",
            "program_id": prg_id,
            "user": userInfo.usr_id,
            "table_name": mainTableName,
            "count": Object.keys(savaExecDatas).length,
            "exec_data": savaExecDatas
        };
        // console.dir(apiParams);
        // callback(null, {success:true});
        tools.requestApi(sysConf.api_url, apiParams, function (apiErr, apiRes, data) {
            var log_id = moment().format("YYYYMMDDHHmmss");
            var err = null;
            if (apiErr || !data) {
                chk_result.success = false;
                err = {};
                err.errorMsg = apiErr;
            } else if (data["RETN-CODE"] != "0000") {
                chk_result.success = false;
                err = {};
                console.error(data["RETN-CODE-DESC"]);
                err.errorMsg = "save error!";
            }

            //寄出exceptionMail
            if (!chk_result.success) {
                mailSvc.sendExceptionMail({
                    log_id: log_id,
                    exceptionType: "execSQL",
                    errorMsg: err.errorMsg
                });
            }
            //log 紀錄
            logSvc.recordLogAPI({
                log_id: log_id,
                success: chk_result.success,
                prg_id: prg_id,
                api_prg_code: '0300901000',
                req_content: apiParams,
                res_content: data
            });
            callback(err, chk_result);
        });
    }

    //組要刪除的dt資料
    function combineDelDetailData(dtTableName, la_dtkeyFields, mnData) {
        let tmpDel = {"function": "0", "table_name": dtTableName}; //0 代表刪除
        tmpDel.condition = [];
        //組合where 條件
        _.each(la_dtkeyFields, function (keyField, keyIdx) {
            if (!_.isUndefined(mnData[keyField.ui_field_name])) {
                tmpDel.condition.push({
                    key: keyField.ui_field_name,
                    operation: "=",
                    value: mnData[keyField.ui_field_name]
                });
            }

        });
        savaExecDatas[exec_seq] = tmpDel;
        exec_seq++;
    }

};

//取得跳窗頁面的值
exports.handleSelectTextGridData = function (session, postData, callback) {
    var ruleName = postData.fields.rule_func_name;

    ruleAgent[ruleName](postData, session, function (err, result) {
        callback(err,result[0].effectValues);
    });
};

//將欄位名稱以及資料一筆一筆轉換頁面上顯示的資料
function dataValueChange(fields, data) {
    fields = tools.mongoDocToObject(fields);

    _.each(Object.keys(data), function (objKey) {
        if (!_.isUndefined(data[objKey])) {
            var value = data[objKey];

            // _.each(fields, function (row) {
            //     if (row.ui_field_name == objKey && row.ui_type == "time") {
            //         var hour = value.substring(0,2);
            //         var min = value.substring(2,4);
            //         var fieldName = hour + ":" + min;
            //
            //         data[objKey] = fieldName;
            //     } else if (row.ui_field_name == objKey && row.ui_type == "percent") {
            //         data[objKey] = (parseFloat(value) * 100);
            //     }
            // })

            _.each(fields, function (row) {
                if (row.ui_field_name == objKey) {
                    var finalValue = changeValueFormat(value, row.ui_type);
                    if (row.ui_type != "checkbox") {
                        data[objKey] = finalValue ? finalValue : value;
                    } else {
                        data[objKey] = finalValue;
                    }

                }
            });
        }
    });
}

//將要顯示在頁面上的欄位格式做轉換
function changeValueFormat(value, ui_type) {
    var valueTemp;
    if (ui_type == "time") {
        if (!_.isEmpty(value)) {
            var hour = value.substring(0, 2);
            var min = value.substring(2, 4);
            var fieldName = hour + ":" + min;
        }
        valueTemp = fieldName;
    } else if (ui_type == "percent") {
        valueTemp = parseFloat(value) * 100;
    } else if (ui_type == "checkbox") {
        if (value == "Y") {
            valueTemp = true;
        } else {
            valueTemp = false;
        }
    }

    return valueTemp;
}

//將儲存或修改的欄位格式做轉換
function changeValueFormat4Save(value, ui_type) {
    var valueTemp;
    if (ui_type == "time") {
        valueTemp = value.replace(":", "");
    } else if (ui_type == "percent") {
        valueTemp = parseFloat(value) / 100;
    } else if (ui_type == "checkbox") {
        if (value.toUpperCase() == "TRUE") {
            valueTemp = "Y";
        } else {
            valueTemp = "N";
        }
    }

    return valueTemp;
}