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
var tools = require("../utils/commonTools");
var dataRuleSvc = require("../services/dataRuleService");
var ruleAgent = require("../ruleEngine/ruleAgent");
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
                    err = "找不到對應的程式編號"
                }

                callback(err, templateRule.rule_id)
            })
        },
        // 2)找尋對照檔需要用到的Table
        function (rule_id, callback) {
            mongoAgent.RuleRf.findOne({rule_id: rule_id, rule_type: 'SQL'}, function (err, ruleData) {
                if (err || !ruleData) {
                    err = "找不到對應的資料";
                    return callback(err, null);
                }

                callback(err, ruleData.rule)

            })
        },
        // 3)撈取對照檔的資料
        function (sqlTag, callback) {
            queryAgent.queryList(sqlTag, params, 0, 0, function (err, data) {
                dataGridRows = data;
                callback(err, dataGridRows)
            })
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
                        callback(err, fieldData)
                    })
                } else {
                    fieldData = UserFieldData;
                    callback(err, fieldData);
                }
            })
        },
        function (col, callback) {
            mongoAgent.UIFieldFormat.find({prg_id: prg_id}, function (err, fmtRows) {
                if (!err) {
                    _.each(fieldData, function (field, fIdx) {
                        fieldData[fIdx] = field.toObject();
                        var tmpFmt = _.findWhere(fmtRows, {prg_id: prg_id, ui_field_name: field.ui_field_name}) || {};
                        fieldData[fIdx]["format_func_name"] = _.size(tmpFmt) > 0 ? tmpFmt["format_func_name"] : []
                    })
                }

                callback(err, fieldData)
            })
        }
    ], function (err, result) {

        if (err) {
            console.error(err);
        }


        callback(err, dataGridRows, fieldData)

    })


};

/**
 * 取datagrid 資料欄位 (新)
 * @param userInfo
 * @param prg_id
 * @param callback
 */
exports.fetchPrgDataGrid = function (userInfo, prg_id, callback) {
    var page_id = 1;
    var params = {
        user_id: userInfo.usr_id,
        athena_id: userInfo.athena_id
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
                    err = "Not found datagrid "
                }

                callback(err, pageInfo)
            })
        },
        // 2)
        function (pageInfo, callback) {
            mongoAgent.UI_Type_Grid.findOne({
                prg_id: prg_id,
                ui_field_name: pageInfo.ui_field_name
            }, function (err, gridInfo) {
                if (err || !gridInfo) {
                    err = "找不到對應的資料";
                    return callback(err, null);
                }

                callback(err, gridInfo)

            })
        },
        // 3)
        function (gridInfo, callback) {
            queryAgent.queryList(gridInfo.rule_func_name.toUpperCase(), params, 0, 0, function (err, data) {
                dataGridRows = data;
                callback(err, dataGridRows)
            })
        },
        //找尋field 屬性資料
        function (dataRow, callback) {
            //先依使用者id 與館別找此PRG_ID有無欄位屬性，若無則抓預設
            mongoAgent.UIDatagridField.find({
                user_id: userInfo.usr_id,
                athena_id: userInfo.athena_id,
                prg_id: prg_id,
                page_id: page_id
            }).sort({col_seq: 1}).exec(function (err, UserFieldData) {
                if (err || UserFieldData.length == 0) {
                    mongoAgent.UIDatagridField.find({
                        user_id: "",
                        athena_id: "",
                        prg_id: prg_id,
                        page_id: page_id
                    }).sort({col_seq: 1}).exec(function (err, commonField) {
                        fieldData = commonField;
                        callback(err, fieldData)
                    })
                } else {
                    fieldData = UserFieldData;
                    callback(err, fieldData);
                }
            })
        },
        //尋找ui_type有select的話，取得combobox的資料
        function (fields, callback) {

            fieldData = tools.mongoDocToObject(fields);

            var selectDSFunc = [];
            _.each(fieldData, function (field, fIdx) {
                if (field.ui_type == 'select') {
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

                                    dataRuleSvc.GET_SELECT_OPTIONS(userInfo, selRow, function (selectData) {
                                        fieldData[fIdx].selectData = selectData;
                                        callback(null, {ui_field_idx: fIdx, ui_field_name: field.ui_field_name});
                                    });
                                } else {
                                    callback(null, {ui_field_idx: fIdx, ui_field_name: field.ui_field_name});
                                }
                            })
                        }
                    )
                }
            });

            async.parallel(selectDSFunc, function (err, result) {
                callback(err, result)
            })
        }
    ], function (err, result) {

        if (err) {
            console.error(err);
        }

        //fieldData = tools.mongoDocToObject(fieldData);

        callback(err, dataGridRows, fieldData)

    })


};

/**
 * 儲存使用者離開後datagrid 欄位的屬性
 * @param prg_id
 * @param userInfo
 * @param fieldOptions
 * @param callback
 */
exports.doSaveFieldOption = function (prg_id, userInfo, fieldOptions, callback) {
    var saveFuncs = [];

    _.each(fieldOptions, function (field) {
        saveFuncs.push(
            //檢查有無相同資訊 (user_id,hotel_cod,ui_field_name,prg_id) 為一個key
            //有則更新 , 沒有就新增

            function (callback) {
                mongoAgent.UIDatagridField.findOne({
                    user_id: userInfo.usr_id.trim(),
                    athena_id: userInfo.athena_id,
                    ui_field_name: field.ui_field_name.trim(),
                    prg_id: prg_id
                }).exec(function (err, userField) {

                    if (err) {
                        callback(err, null);
                        return;
                    }

                    field.user_id = userInfo.usr_id.trim();
                    field.athena_id = userInfo.athena_id;
                    field.prg_id = prg_id.trim();

                    if (userField) {
                        //更新
                        mongoAgent.UIDatagridField.update({
                                user_id: userInfo.usr_id.trim(),
                                athena_id: userInfo.athena_id,
                                ui_field_name: field.ui_field_name.trim(),
                                prg_id: prg_id
                            }
                            , field, function (err) {
                                if (err) {
                                    callback(err, null);
                                    return;
                                }

                                callback(null, field.ui_field_name);

                            })
                    } else {

                        //新增
                        var UIDgFieldSchema = new mongoAgent.UIDatagridField(field);
                        UIDgFieldSchema.save(function (err) {
                            callback(err, field.ui_field_name);
                        })
                    }
                });

            }
        );
    });

    async.parallel(saveFuncs, function (err, result) {
        if (err) {
            callback(err, false);
        } else {
            callback(null, true);
        }
    })

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
                            callback("資料格式錯誤", false)
                        }
                    })
                } else {
                    callback(null, true)
                }
            });
        },
        //驗證資料內容是否正確
        function (checkFormat, callback) {
            callback(null, true)
        }
    ], function (err, success) {

        if (err || !success) {
            callback(err, false);
        } else {
            callback(null, true);
        }
    })


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
    var hotel_cod = userInfo["fun_hotel_cod"];
    var prg_id = postData["prg_id"] || "";
    var deleteData = postData["deleteData"] || [];
    var createData = postData["createData"] || [];
    var updateData = postData["updateData"] || [];
    var prgFields = []; //prg 所屬的欄位

    async.waterfall([
        getTableName, //抓取TABLE NAME
        getPrgField,  //取得此程式的欄位
        doChkSaveRule,//先驗證資料是否規則正確
        doSaveDataByAPI //實作儲存
    ], function (err, result) {
        callback(err, result)
    });


    function getTableName(callback) {
        //抓取對應的table
        mongoAgent.UI_PageField.findOne({
            page_id: 1,
            prg_id: prg_id,
            template_id: 'datagrid'
        }, function (err, pageObj) {
            if (!err && pageObj) {
                mongoAgent.UI_Type_Grid.findOne({
                    ui_field_name: pageObj.ui_field_name,
                    prg_id: prg_id
                }, function (err, gridObj) {
                    if (err || !gridObj) {
                        callback("not found table name", mainTableName);
                        return;
                    }

                    gridObj = gridObj.toObject();
                    mainTableName = gridObj.table_name;
                    callback(null, mainTableName);
                })
            } else {
                callback("not found table name", mainTableName);
            }
        })
    }

    //取得此程式的欄位
    function getPrgField(table_name, callback) {
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
            }
            callback(err, result);
        })
    }

    //實作儲存
    function doSaveDataByAPI(chkResult, callback) {

        var keyFields = _.pluck(_.where(prgFields, {keyable: 'Y'}), "ui_field_name") || []; //屬於key 的欄位
        async.parallel([
            //新增 0200
            function (callback) {
                _.each(createData, function (data) {
                    var tmpIns = {"function": "1"}; //1  新增
                    tmpIns["table_name"] = mainTableName;

                    _.each(Object.keys(data), function (objKey) {
                        tmpIns[objKey] = data[objKey];
                    });
                    tmpIns["athena_id"] = userInfo.athena_id;
                    tmpIns["hotel_cod"] = userInfo.fun_hotel_cod;
                    tmpIns["ins_dat"] = moment().format("YYYY/MM/DD HH:mm:ss");
                    tmpIns["ins_usr"] = userInfo.usr_id;
                    tmpIns["upd_dat"] = moment().format("YYYY/MM/DD HH:mm:ss");
                    tmpIns["upd_usr"] = userInfo.usr_id;
                    savaExecDatas[exec_seq] = tmpIns;
                    exec_seq++;
                })
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
                })
                callback(null, '0300');
            },
            //修改 0400
            function (callback) {
                _.each(updateData, function (data) {
                    var tmpEdit = {"function": "2"}; //2  編輯
                    tmpEdit["table_name"] = mainTableName;
                    tmpEdit["athena_id"] = userInfo.athena_id;
                    tmpEdit["hotel_cod"] = userInfo.fun_hotel_cod;

                    _.each(Object.keys(data), function (objKey) {
                        tmpEdit[objKey] = data[objKey];
                    });

                    tmpEdit["upd_dat"] = moment().format("YYYY/MM/DD HH:mm:ss");
                    tmpEdit["upd_usr"] = userInfo.usr_id;
                    delete  tmpEdit["ins_dat"];
                    delete  tmpEdit["ins_usr"];

                    tmpEdit.condition = [];
                    //組合where 條件
                    _.each(keyFields, function (keyField, keyIdx) {
                        if (!_.isUndefined(data[keyField])) {
                            tmpEdit.condition.push({
                                key: keyField,
                                operation: "=",
                                value: data[keyField]
                            });
                        }
                    });

                    savaExecDatas[exec_seq] = tmpEdit;
                    exec_seq++;
                })
                callback(null, '0400');
            }
        ], function (err, result) {

            if (err) {
                callback(err, false);
            }
            //抓取對應的table
            mongoAgent.UI_Type_Grid.findOne({prg_id: prg_id}, function (err, tmpDG) {
                if (!err && tmpDG) {
                    tmpDG = tmpDG.toObject();
                    var apiParams = {
                        "REVE-CODE": "0300901000",
                        "program_id": prg_id,
                        "user": userInfo.usr_id,
                        "table_name": tmpDG.table_name || "",
                        "count": Object.keys(savaExecDatas).length,
                        "exec_data": savaExecDatas
                    };

                    tools.requestApi(sysConf.api_url, apiParams, function (apiErr, apiRes, data) {
                        var success = true;
                        var errMsg = null;
                        if (apiErr) {
                            chkResult.success = false;
                            errMsg = apiErr;
                        }
                        else if (data["RETN-CODE"] != "0000") {
                            chkResult.success = false;
                            errMsg = data["RETN-CODE-DESC"];
                        }

                        callback(errMsg, chkResult);
                    })
                } else {
                    callback("not found table name", chkResult);
                }
            });

        })
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
    var prg_id = postData["prg_id"];
    async.waterfall([
        //抓取規則
        function (callback) {
            mongoAgent.DatagridFunction
                .findOne({prg_id: prg_id, func_id: '0200'}).exec(function (err, funcRules) {

                if (funcRules) {
                    addRuleFunc = funcRules.toObject();
                }

                callback(err, true);
            })
        },
        //抓取新增資料
        function (data, callback) {
            lo_result.defaultValues = _.extend(lo_result.defaultValues, ruleAgent.getCreateCommonDefaultDataRule(session));
            if (!_.isEmpty(addRuleFunc) && !_.isUndefined(ruleAgent[addRuleFunc])) {
                ruleAgent[addRuleFunc](postData, session, function (err, result) {
                    lo_result.defaultValues = _.extend(lo_result.defaultValues, result.defaultValues);
                    callback(err, lo_result);
                })
            } else {
                callback(null, lo_result);
            }

        }
    ], function (err, result) {
        callback(null, lo_result);
    });
};


