/**
 * Created by kaiyue on 2017/10/22.
 * 作業儲存轉接器
 */

let _ = require("underscore");
let async = require("async");
let moment = require("moment");
let mongoAgent = require("../plugins/mongodb");
let commonRule = require("../ruleEngine/rules/CommonRule");
let commonTools = require("../utils/CommonTools");
let langSvc = require("../services/LangService");
let go_postData = null;
let go_session = null;
let gs_template_id = null;
let ga_mainFieldsData = [];
let ga_gsFieldsData = [];
let ga_dgFieldsData = [];
let go_saveExecDatas = {};
let gn_exec_seq = 1;
let go_userInfo = null;
let gs_mainTableName = "";    // 主要Table name
let gs_dgTableName = "";      // DT Table name
let ga_createData = [];
let ga_updateData = [];
let ga_deleteData = [];
let ga_dtCreateData = [];
let ga_dtUpdateData = [];
let ga_dtDeleteData = [];

function initData() {
    go_saveExecDatas = {};
    gn_exec_seq = 1;
}

function operationSaveAdapterClass(postData, session) {
    go_postData = postData;
    go_session = session;
    go_userInfo = session.user;
    ga_createData = postData.tmpCUD.createData || [];
    ga_updateData = postData.tmpCUD.updateData || [];
    ga_deleteData = postData.tmpCUD.deleteData || [];
    ga_oriData = postData.tmpCUD.oriData || [];
    ga_dtCreateData = postData.tmpCUD.dt_createData || [];
    ga_dtUpdateData = postData.tmpCUD.dt_updateData || [];
    ga_dtDeleteData = postData.tmpCUD.dt_deleteData || [];
    ga_dtOriUpdateData = postData.tmpCUD.dt_oriUpdateData || [];

    initData();

    this.set_saveExecDatas = function (ln_exec_seq, lo_saveExecDatas) {
        go_saveExecDatas = lo_saveExecDatas || {};
        ln_exec_seq++;
        gn_exec_seq = ln_exec_seq || 1;
    };

    // 執行程序
    this.exec = function (callback) {
        async.waterfall([
            qryTemplateRfData,              //查templateRf資料
            chkTmpType,                     //檢查為多筆、單筆、mn-dt或特殊
            qryFieldData,                   //取欄位資料
            combineDtDeleteExecData,        //組dt刪除資料
            combineMainData,                //組此筆新刪修資料
            combineDtCreateEditExecData,    //組dt新增修改資料
            sortByEventTime,                //依事件時間(event_time)調整儲存順序
            convertToApiFormat              //將tmpCUD轉換為打API格式
        ], function (err, data) {
            callback(err, data);
        });
    };
}

/**
 * 查詢TemplateRf資料
 */
function qryTemplateRfData(callback) {
    mongoAgent.TemplateRf.find({
        prg_id: go_postData.prg_id,
        page_id: go_postData.page_id
    }, function (err, rfData) {
        rfData = commonTools.mongoDocToObject(rfData);
        callback(null, rfData);
    });
}

/**
 * 判斷template_id 為 多筆、單筆、mn-dt或特殊版型
 * @param rfData {Object} TemplateRf 資料
 */
function chkTmpType(rfData, callback) {
    let ln_isDataGridExist = _.findIndex(rfData, {template_id: "datagrid"});
    let ln_isGridSingleExist = _.findIndex(rfData, {template_id: "gridsingle"});
    let ln_isSpecialIsExist = _.findIndex(rfData, {template_id: "special"});

    if (ln_isDataGridExist != -1 && ln_isGridSingleExist != -1) {
        gs_mainTableName = rfData[ln_isGridSingleExist].table_name;
        gs_dgTableName = rfData[ln_isDataGridExist].table_name;
        gs_template_id = "mn-dt";
    }
    else if (ln_isDataGridExist != -1 && ln_isGridSingleExist == -1) {
        gs_dgTableName = rfData[ln_isDataGridExist].table_name;
        gs_template_id = "datagrid";
    }
    else if (ln_isDataGridExist == -1 && ln_isGridSingleExist != -1) {
        gs_mainTableName = rfData[ln_isGridSingleExist].table_name;
        gs_template_id = "gridsingle";
    }
    else {
        gs_mainTableName = rfData[ln_isSpecialIsExist].table_name;
        gs_template_id = "special";
    }
    callback(null, rfData);
}

/**
 * 查詢欄位資料
 * @param {Object} rfData: templateRf 欄位資料
 */
function qryFieldData(rfData, callback) {
    async.parallel([
        function (cb) {
            if (gs_template_id == "datagrid" || gs_template_id == "mn-dt" || gs_template_id == "special") {
                mongoAgent.UIDatagridField.find({
                    prg_id: go_postData.prg_id,
                    page_id: go_postData.page_id
                }, function (err, la_dgFieldsData) {
                    ga_dgFieldsData = commonTools.mongoDocToObject(la_dgFieldsData);
                    cb(null, ga_dgFieldsData);
                });
            }
            else {
                cb(null, []);
            }
        },
        function (cb) {
            if (gs_template_id == "gridsingle" || gs_template_id == "mn-dt" || gs_template_id == "special") {
                mongoAgent.UIPageField.find({
                    prg_id: go_postData.prg_id,
                    page_id: go_postData.page_id
                }, function (err, la_gsFieldsData) {
                    ga_gsFieldsData = commonTools.mongoDocToObject(la_gsFieldsData);
                    cb(null, ga_gsFieldsData);
                });
            }
            else {
                cb(null, []);
            }
        }
    ], function (err, result) {
        ga_createData = commonTools.handleOperationProcData(ga_createData, ga_gsFieldsData);
        ga_deleteData = commonTools.handleOperationProcData(ga_deleteData, ga_gsFieldsData);
        ga_updateData = commonTools.handleOperationProcData(ga_updateData, ga_gsFieldsData);

        ga_dtCreateData = commonTools.handleOperationProcData(ga_dtCreateData, ga_dgFieldsData);
        ga_dtDeleteData = commonTools.handleOperationProcData(ga_dtDeleteData, ga_dgFieldsData);
        ga_dtUpdateData = commonTools.handleOperationProcData(ga_dtUpdateData, ga_dgFieldsData);

        if (gs_template_id == "datagrid") {
            ga_mainFieldsData = ga_dgFieldsData;
        }
        else if (gs_template_id == "gridsingle") {
            ga_mainFieldsData = ga_gsFieldsData;
        }
        else {
            ga_mainFieldsData = ga_gsFieldsData;
        }
        callback(err, rfData);
    });
}

//組合DT 刪除檢查
function combineDtDeleteExecData(rfData, callback) {
    try {
        _.each(ga_dtDeleteData, function (data) {
            var lo_fieldsData = qryFieldsDataByTabPageID(data);
            var tmpDel = {
                "function": "0",
                "table_name": gs_dgTableName,
                "kindOfRel": 'dt',
                event_time: data.event_time
            }; //0 代表刪除
            var mnRowData = data["mnRowData"] || {};
            delete data["mnRowData"];
            tmpDel.condition = [];
            //組合where 條件
            _.each(lo_fieldsData.dgKeyFields, function (keyField, keyIdx) {
                if (!_.isUndefined(data[keyField.ui_field_name])) {
                    tmpDel.condition.push({
                        key: keyField.ui_field_name,
                        operation: "=",
                        value: data[keyField.ui_field_name]
                    });
                }

            });
            go_saveExecDatas[gn_exec_seq] = tmpDel;
            gn_exec_seq++;

            // 修改Mn: 此目的為了更新Mn最後異動日
            // var mnEvent_time = moment(new Date(data.event_time)).subtract(1, "seconds").format("YYYY/MM/DD HH:mm:ss");
            // var tmpMnUpd = {
            //     "function": "2",
            //     "table_name": gs_mainTableName,
            //     event_time: mnEvent_time
            // };
            // tmpMnUpd = _.extend(tmpMnUpd, commonRule.getEditDefaultDataRule(go_session));
            // tmpMnUpd.condition = [];
            // //組合where 條件
            // _.each(lo_fieldsData.mainKeyFields, function (keyField) {
            //     if (!_.isUndefined(data[keyField.ui_field_name])) {
            //         tmpMnUpd.condition.push({
            //             key: keyField.ui_field_name,
            //             operation: "=",
            //             value: data[keyField.ui_field_name]
            //         });
            //     }
            //
            // });
            // go_saveExecDatas[gn_exec_seq] = tmpMnUpd;
            // gn_exec_seq++;
        });
        callback(null, '0300');
    }
    catch (err) {
        callback(err, '0300');
    }
}

//組合此筆要新增刪除修改的資料
function combineMainData(rfData, callback) {
    var la_multiLangFields = _.filter(ga_mainFieldsData, function (field) {
        return field.multi_lang_table != "";
    });  //多語系欄位
    async.parallel([
        //新增 0200
        function (callback) {
            if (_.isUndefined(ga_createData) || ga_createData.length == 0) {
                return callback(null, '0200');
            }
            _.each(ga_createData, function (data) {
                var lo_fieldsData = qryFieldsDataByTabPageID(data);
                var tmpIns = {"function": "1", "table_name": gs_mainTableName}; //1  新增
                _.each(Object.keys(data), function (objKey) {
                    if (!_.isUndefined(data[objKey])) {
                        var value = data[objKey];

                        _.each(lo_fieldsData.mainFieldsData, function (row) {
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
                //TODO: 暫時給session
                // go_session.user = {
                //     athena_id: 1,
                //     fun_hotel_cod: '02',
                //     usr_id: "a16010"
                // };
                tmpIns = _.extend(tmpIns, commonRule.getCreateCommonDefaultDataRule(go_session));
                go_saveExecDatas[gn_exec_seq] = tmpIns;
                gn_exec_seq++;

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
                                }
                                _.each(_.pluck(lo_fieldsData.mainKeyFields, "ui_field_name"), function (keyField) {
                                    if (!_.isUndefined(data[keyField])) {
                                        lo_langTmp[keyField] = typeof data[keyField] === "string"
                                            ? data[keyField].trim() : data[keyField];
                                    }
                                });
                                go_saveExecDatas[gn_exec_seq] = lo_langTmp;
                                gn_exec_seq++;
                            }
                        });
                    });
                }

            });

            callback(null, '0200');
        },
        //刪除 0300
        function (callback) {
            if (_.isUndefined(ga_deleteData) || ga_deleteData.length == 0) {
                return callback(null, '0300');
            }
            _.each(ga_deleteData, function (data) {
                var lo_fieldsData = qryFieldsDataByTabPageID(data);
                var tmpDel = {"function": "0", "table_name": gs_mainTableName, event_time: data.event_time}; //0 代表刪除
                data = _.extend(data, commonRule.getEditDefaultDataRule(go_session));
                tmpDel.condition = [];
                //組合where 條件
                _.each(lo_fieldsData.mainKeyFields, function (keyField, keyIdx) {
                    if (!_.isUndefined(data[keyField.ui_field_name])) {
                        tmpDel.condition.push({
                            key: keyField.ui_field_name,
                            operation: "=",
                            value: data[keyField.ui_field_name]
                        });
                    }

                });
                go_saveExecDatas[gn_exec_seq] = tmpDel;
                gn_exec_seq++;

                if (gs_dgTableName != "") {
                    combineDelDetailData(gs_dgTableName, lo_fieldsData.mainKeyFields, data);
                }
            });
            callback(null, '0300');
        },
        //修改 0400
        function (callback) {
            if (_.isUndefined(ga_updateData) || ga_updateData.length == 0) {
                return callback(null, '0400');
            }

            _.each(ga_updateData, function (data, index) {
                var lo_fieldsData = qryFieldsDataByTabPageID(data);
                var tmpEdit = {"function": "2", "table_name": gs_mainTableName}; //2  編輯
                _.each(Object.keys(data), function (objKey) {
                    if (!_.isUndefined(data[objKey])) {
                        tmpEdit[objKey] = data[objKey];

                        _.each(lo_fieldsData.mainFieldsData, function (row) {
                            if (row.ui_field_name == objKey) {
                                var finalValue = changeValueFormat4Save(tmpEdit[objKey], row.ui_type);
                                tmpEdit[objKey] = finalValue ? finalValue : tmpEdit[objKey];
                            }
                        });
                    }
                });
                var lo_keysData = {};

                data = _.extend(data, commonRule.getEditDefaultDataRule(go_session));
                tmpEdit = _.extend(tmpEdit, commonRule.getEditDefaultDataRule(go_session));

                tmpEdit.condition = [];
                //組合where 條件
                _.each(lo_fieldsData.mainKeyFields, function (keyField) {
                    if (!_.isUndefined(ga_oriData[index][keyField.ui_field_name])) {
                        tmpEdit.condition.push({
                            key: keyField.ui_field_name,
                            operation: "=",
                            value: ga_oriData[index][keyField.ui_field_name]
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
                                                _.each(_.pluck(lo_fieldsData.mainKeyFields, "ui_field_name"), function (keyField) {
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

                                                    go_saveExecDatas[gn_exec_seq] = lo_langTmp;
                                                    gn_exec_seq++;

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
                        go_saveExecDatas[gn_exec_seq] = tmpEdit;
                        gn_exec_seq++;
                        callback(null, '0400');
                    });
                }
                else {
                    go_saveExecDatas[gn_exec_seq] = tmpEdit;
                    gn_exec_seq++;
                    callback(null, '0400');
                }
            });


        }
    ], function (err, result) {
        callback(err, result);
    });
}

//組合DT 新增修改執行資料
function combineDtCreateEditExecData(rfData, callback) {
    var la_dtMultiLangFields = _.filter(ga_dgFieldsData, function (field) {
        return field.multi_lang_table != "";
    });  //多語系欄位

    try {
        //dt 新增
        _.each(ga_dtCreateData, function (data) {
            var lo_fieldsData = qryFieldsDataByTabPageID(data);
            var tmpIns = {"function": "1", "table_name": gs_dgTableName, "kindOfRel": "dt"}; //1  新增
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

            let lo_default = commonRule.getCreateCommonDefaultDataRule(go_session);
            if (!_.isUndefined(data.hotel_cod) && data.hotel_cod.trim() != "") {
                delete lo_default["hotel_cod"];
            }
            tmpIns = _.extend(tmpIns, lo_default);


            //塞入mn pk
            _.each(lo_fieldsData.mainKeyFields, function (keyField) {
                if (!_.isUndefined(mnRowData[keyField.ui_field_name])) {
                    tmpIns[keyField.ui_field_name] = mnRowData[keyField.ui_field_name].trim();
                }
            });
            go_saveExecDatas[gn_exec_seq] = tmpIns;
            gn_exec_seq++;

            // 修改Mn: 此目的為了更新Mn最後異動日
            // var mnEvent_time = moment(new Date(data.event_time)).subtract(1, "seconds").format("YYYY/MM/DD HH:mm:ss");
            // var tmpMnUpd = {
            //     "function": "2",
            //     "table_name": gs_mainTableName,
            //     event_time: mnEvent_time
            // };
            // tmpMnUpd = _.extend(tmpMnUpd, commonRule.getEditDefaultDataRule(go_session));
            // tmpMnUpd.condition = [];
            // //組合where 條件
            // _.each(lo_fieldsData.mainKeyFields, function (keyField) {
            //     if (!_.isUndefined(data[keyField.ui_field_name])) {
            //         tmpMnUpd.condition.push({
            //             key: keyField.ui_field_name,
            //             operation: "=",
            //             value: data[keyField.ui_field_name]
            //         });
            //     }
            //
            // });
            // go_saveExecDatas[gn_exec_seq] = tmpMnUpd;
            // gn_exec_seq++;

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
                            _.each(_.pluck(lo_fieldsData.dgKeyFields, "ui_field_name"), function (keyField) {
                                if (!_.isUndefined(data[keyField])) {
                                    lo_langTmp[keyField] = typeof data[keyField] === "string" ? data[keyField].trim() : data[keyField];
                                }
                            });
                            go_saveExecDatas[gn_exec_seq] = lo_langTmp;
                            gn_exec_seq++;
                        }
                    });
                });
            }
        });

        //dt 編輯
        _.each(ga_dtUpdateData, function (data, index) {
            var lo_fieldsData = qryFieldsDataByTabPageID(data);
            var tmpEdit = {"function": "2", "table_name": gs_dgTableName, "kindOfRel": "dt"}; //2  編輯
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
            _.each(lo_fieldsData.mainKeyFields, function (keyField) {
                if (!_.isUndefined(mnRowData[keyField.ui_field_name])) {
                    tmpEdit[keyField.ui_field_name] = mnRowData[keyField.ui_field_name].trim();
                }
            });

            let lo_default = commonRule.getEditDefaultDataRule(go_session);
            if (!_.isUndefined(data.hotel_cod) && data.hotel_cod.trim() != "") {
                delete lo_default["hotel_cod"];
            }
            data = _.extend(data, lo_default);
            tmpEdit = _.extend(tmpEdit, lo_default);

            tmpEdit.condition = [];
            //組合where 條件
            _.each(lo_fieldsData.dgKeyFields, function (keyField) {
                if (!_.isUndefined(ga_dtOriUpdateData[index][keyField.ui_field_name])) {
                    tmpEdit.condition.push({
                        key: keyField.ui_field_name,
                        operation: "=",
                        value: ga_dtOriUpdateData[index][keyField.ui_field_name]
                    });
                }
            });
            go_saveExecDatas[gn_exec_seq] = tmpEdit;
            gn_exec_seq++;

            // 修改Mn: 此目的為了更新Mn最後異動日
            // var mnEvent_time = moment(new Date(data.event_time)).subtract(1, "seconds").format("YYYY/MM/DD HH:mm:ss");
            // var tmpMnUpd = {
            //     "function": "2",
            //     "table_name": gs_mainTableName,
            //     event_time: mnEvent_time
            // };
            // tmpMnUpd = _.extend(tmpMnUpd, commonRule.getEditDefaultDataRule(go_session));
            // tmpMnUpd.condition = [];
            // //組合where 條件
            // _.each(lo_fieldsData.mainKeyFields, function (keyField) {
            //     if (!_.isUndefined(data[keyField.ui_field_name])) {
            //         tmpMnUpd.condition.push({
            //             key: keyField.ui_field_name,
            //             operation: "=",
            //             value: data[keyField.ui_field_name]
            //         });
            //     }
            //
            // });
            // go_saveExecDatas[gn_exec_seq] = tmpMnUpd;
            // gn_exec_seq++;

            /** 處理每一筆多語系 handleSaveMultiLang **/
            if (!_.isUndefined(data.multiLang) && data.multiLang.length > 0) {
                var langProcessFunc = [];
                _.each(data.multiLang, function (lo_lang) {
                    var ls_locale = lo_lang.locale || "";
                    langProcessFunc.push(
                        function (cb) {
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
                                            _.each(_.pluck(lo_fieldsData.dgKeyFields, "ui_field_name"), function (keyField) {
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

                                                go_saveExecDatas[gn_exec_seq] = lo_langTmp;
                                                gn_exec_seq++;

                                                callback(null, rows);

                                            });
                                        }
                                    );
                                }
                            });
                            async.parallel(chkFuncs, function (err, results) {
                                cb(null, results);
                            });
                        }
                    );

                });

                async.parallel(langProcessFunc, function (err, results) {
                    callback(null, '0400');
                });
            }
            else {
                callback(null, go_saveExecDatas);
            }
        });

        if (ga_dtUpdateData.length == 0) {
            callback(null, go_saveExecDatas);
        }
    } catch (err) {
        callback(err, go_saveExecDatas);
    }

}

//依事件時間(event_time)調整儲存順序
function sortByEventTime(data, callback) {
    var lo_reformatExecDatas = {};
    var lo_saveExecDatasSorted = _.sortBy(_.values(go_saveExecDatas), function (lo_saveExecData) {
        return moment(new Date(lo_saveExecData.event_time)).format("YYYY/MM/DD HH:mm:ss");
    });

    _.each(lo_saveExecDatasSorted, function (lo_data, index) {
        index++;
        lo_reformatExecDatas[index] = lo_data;
    });

    callback(null, lo_reformatExecDatas);
}

//轉換為API格式
function convertToApiFormat(lo_saveExecDatasSorted, callback) {
    var apiParams = {
        "REVE-CODE": go_postData.trans_cod,
        "program_id": go_postData.prg_id,
        "user": go_session.user.usr_id,
        "table_name": gs_mainTableName,
        "count": Object.keys(lo_saveExecDatasSorted).length,
        "exec_data": lo_saveExecDatasSorted
    };
    callback(null, apiParams);
}

//region //func area
//將儲存或修改的欄位格式做轉換
function changeValueFormat4Save(value, ui_type) {
    var valueTemp;

    if (value == null || value == "") {
        return "";
    }

    if (ui_type == "time") {
        valueTemp = value.replace(":", "");
    } else if (ui_type == "percent") {
        valueTemp = parseFloat(value) / 100;
    } else if (ui_type == "checkbox") {
        if (value.toUpperCase() == "TRUE" || value.toUpperCase() == "Y") {
            valueTemp = "Y";
        } else {
            valueTemp = "N";
        }
    } else if (ui_type == "multiselect") {
        valueTemp = "'" + value.join() + "'";
    }
    else if (ui_type.toLocaleLowerCase() == "number") {
        valueTemp = Number(value);
    }

    return valueTemp;
}

//組要刪除的dt資料
function combineDelDetailData(dtTableName, la_dtkeyFields, mnData) {
    var ls_event_time = moment(new Date(mnData.event_time)).subtract("1", "seconds").format("YYYY/MM/DD HH:mm:ss");
    let tmpDel = {"function": "0", "table_name": dtTableName, "kindOfRel": "dt", event_time: ls_event_time}; //0 代表刪除
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
    go_saveExecDatas[gn_exec_seq] = tmpDel;
    gn_exec_seq++;
}

//endregion

function qryFieldsDataByTabPageID(lo_data) {
    let ln_tab_page_id = Number(lo_data.tab_page_id) || 1;
    let la_mainFieldsData = _.where(ga_mainFieldsData, {tab_page_id: ln_tab_page_id}) || ga_mainFieldsData;
    let la_mainKeyFields = _.where(la_mainFieldsData, {keyable: "Y"}) || [];
    let la_dgFieldsData = _.where(ga_dgFieldsData, {tab_page_id: ln_tab_page_id}) || ga_dgFieldsData;
    let la_dgKeyFields = _.where(la_dgFieldsData, {keyable: "Y"}) || [];
    let rtnData = {
        mainFieldsData: _.clone(la_mainFieldsData),
        mainKeyFields: _.clone(la_mainKeyFields),
        dgFieldsData: _.clone(la_dgFieldsData),
        dgKeyFields: _.clone(la_dgKeyFields)
    };

    return rtnData;
}

module.exports = operationSaveAdapterClass;