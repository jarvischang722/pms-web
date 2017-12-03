/**
 * Created by 柏浩 on 2017/10/16.
 */

var config = require("../configs/database");
require('../plugins/kplug-oracle/DB').create(config.oracle);
var queryAgent = require("../plugins/kplug-oracle/QueryAgent");
var mongoAgent = require("../plugins/mongodb");
var async = require("async");
var langSvc = require("../services/LangService");
var dataRuleSvc = require("../services/DataRuleService");
var tools = require("../utils/CommonTools");
var _ = require("underscore");


var userInfo = {

    user_id: "a16010",
    athena_id: 1
};

var params = {
    prg_id: 'PMS0620020',
    page_id: 1
};

handleSinglePageRowData_test(userInfo, params);

function handleSinglePageRowData_test(userInfo, params) {
    let prg_id = params.prg_id;
    let page_id = params.page_id;
    let athena_id = userInfo.athena_id;
    let user_id = userInfo.user_id;
    let postData = [];
    let lo_pageField;
    let lo_rowData;
    let go_dataGridFieldHotelDT;
    let go_dataGridFieldClassHS;

    async.parallel([
        //取sales_mn資料
        function (callback) {
            async.waterfall([
                function (cb) {
                    var lo_qryParams = {
                        prg_id: prg_id,
                        page_id: page_id
                    };

                    mongoAgent.UIPageField.find(lo_qryParams, function (err, pageField) {
                        lo_pageField = pageField;
                        cb(err, pageField);
                    });
                },
                function (pageField, cb) {
                    var lo_qryParams = {
                        prg_id: prg_id,
                        page_id: page_id
                    };

                    mongoAgent.TemplateRf.findOne(lo_qryParams, function (err, singleData) {
                        if (err || !singleData) {
                            callback("no data", {});
                            return;
                        }

                        singleData = singleData.toObject();
                        console.log(singleData);
                        postData["prg_id"] = prg_id;
                        postData["athena_id"] = athena_id;
                        postData["user_id"] = user_id;
                        postData["sales_cod"] = "RD";

                        queryAgent.query(singleData.rule_func_name.toUpperCase(), postData, function (err, rowData) {
                            if (err || !rowData) {
                                cb("no data", null);
                            }
                            else {
                                langSvc.handleSingleDataLangConv(rowData, prg_id, page_id, "zh_TW", function (errLangConv, rowDataLangConv) {
                                    lo_rowData = tools.handlePreprocessData(rowDataLangConv, pageField);
                                    cb(null, rowData);
                                });
                            }
                        });

                    });
                }
            ], function (errSingleData, resultSingleData) {
                if (errSingleData) {
                    callback(errSingleData, null);
                }
                else {
                    lo_rowData = resultSingleData;
                    callback(null, resultSingleData);
                }
            });
        },
        //取sales_hotel_dt資料
        function (callback) {
            async.waterfall([
                function (cb) {
                    mongoAgent.UIDatagridField.find({
                        prg_id: prg_id,
                        tab_page_id: 1
                    }, function (err, dataGridField) {
                        go_dataGridFieldHotelDT = tools.mongoDocToObject(dataGridField);

                        cb(err, dataGridField);
                    });
                },
                function (datagridField, cb) {
                    let lo_dtData = {};
                    let params = {};
                    params["athena_id"] = 1;
                    params["sales_cod"] = 'RD';

                    queryAgent.queryList("qry_sales_hotel_dt", params, 0, 0, function (err, dtDataList) {
                        _.each(dtDataList, function (row, idx) {
                            dtDataList[idx] = tools.handlePreprocessData(row, lo_pageField);
                        });
                        lo_dtData = dtDataList;

                        fetchDataGridFieldAttr(datagridField, lo_dtData, function (result) {
                            cb(err, result);
                        });
                    });
                }
            ], function (errDataGridHotelDT, resultDataGridHotelDT) {
                if (errDataGridHotelDT) {
                    callback(errDataGridHotelDT, null);
                }
                else {
                    callback(null, resultDataGridHotelDT);
                }
            });
        },
        // 取sales_class_hs資料
        function (callback) {
            async.waterfall([
                function (cb) {
                    mongoAgent.UIDatagridField.find({
                        prg_id: prg_id,
                        tab_page_id: 2
                    }, function (err, dataGridField) {
                        go_dataGridFieldClassHS = tools.mongoDocToObject(dataGridField);

                        cb(err, dataGridField);
                    });
                },
                function (datagridField, cb) {
                    let lo_dtData = {};
                    let params = {};
                    params["athena_id"] = 1;
                    params["sales_cod"] = 'RD';

                    queryAgent.queryList("qry_sales_class_hs", params, 0, 0, function (err, dtDataList) {
                        _.each(dtDataList, function (row, idx) {
                            dtDataList[idx] = tools.handlePreprocessData(row, lo_pageField);
                        });
                        lo_dtData = dtDataList;

                        fetchDataGridFieldAttr(datagridField, lo_dtData, function (result) {
                            cb(err, result);
                        });
                    });
                }
            ], function (errDataGridClassHS, resultDataGridClassHS) {
                if (errDataGridClassHS) {
                    callback(errDataGridClassHS, null);
                }
                else {
                    callback(resultDataGridClassHS, resultDataGridClassHS);
                }
            });
        }
    ], function (err, result) {
        dataValueChange(lo_pageField, lo_rowData);

        console.log("ERR: " + err);
        console.log(result);
    });

}

function fetchDataGridFieldAttr(lo_dataGridField, lo_dtData, callback) {
    var selectDSFunc = [];
    _.each(lo_dataGridField, function (field, fIdx) {

        if (field.ui_type == 'select' || field.ui_type == 'multiselect' || field.ui_type == 'checkbox' || field.ui_type == 'selectgrid') {

            //讀取selectgrid的設定參數
            if (field.ui_type == 'selectgrid') {
                var func_name = prg_id + '_' + field.ui_field_name;
                lo_dataGridField[fIdx].selectGridOptions = ruleAgent[func_name]();
            }

            selectDSFunc.push(
                function (callback) {
                    mongoAgent.UITypeSelect.findOne({
                        prg_id: prg_id,
                        ui_field_name: field.ui_field_name
                    }).exec(function (err, selRow) {
                        lo_dataGridField[fIdx].selectData = [];
                        if (selRow) {
                            selRow = selRow.toObject();
                            lo_dataGridField[fIdx].ds_from_sql = selRow.ds_from_sql || "";
                            lo_dataGridField[fIdx].referiable = selRow.referiable || "N";
                            lo_dataGridField[fIdx].defaultVal = selRow.defaultVal || "";

                            dataRuleSvc.getSelectOptions(userInfo, selRow, field, function (selectData) {
                                lo_dataGridField[fIdx].selectData = selectData;
                                callback(null, {ui_field_idx: fIdx, ui_field_name: field.ui_field_name});
                            });

                        } else {
                            callback(null, {ui_field_idx: fIdx, ui_field_name: field.ui_field_name});
                        }
                    });
                }
            );
        }

        var attrName = field.attr_func_name;
        if (!_.isEmpty(attrName) && lo_dtData.length != 0) {
            let lo_params = {
                field: field,
                dtData: lo_dtData
            }
            selectDSFunc.push(
                function (callback) {
                    if (field.visiable == "C") {
                        if (!_.isEmpty(attrName) && !_.isUndefined(ruleAgent[attrName])) {
                            ruleAgent[attrName](lo_params, userInfo, function (err, result) {
                                if (result) {
                                    lo_dataGridField[fIdx] = result[0];
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
                            ruleAgent[attrName](lo_params, userInfo, function (err, result) {
                                if (result) {
                                    // lo_dataGridField[fIdx] = result[0];
                                    callback(err, {ui_field_idx: fIdx, field: result});
                                } else {
                                    callback(err, {ui_field_idx: fIdx, field: result});
                                }
                            });
                        } else {
                            callback(null, {});
                        }
                    } else if (field.requirable == "C") {
                        if (!_.isEmpty(attrName) && !_.isUndefined(ruleAgent[attrName])) {
                            ruleAgent[attrName](lo_params, userInfo, function (err, result) {
                                if (result) {
                                    lo_dataGridField[fIdx] = result[0];
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
}

//將欄位名稱以及資料一筆一筆轉換頁面上顯示的資料
function dataValueChange(fields, data) {
    fields = tools.mongoDocToObject(fields);

    _.each(Object.keys(data), function (objKey) {
        if (!_.isUndefined(data[objKey])) {
            var value = data[objKey];

            _.each(fields, function (row) {
                if (row.ui_field_name == objKey) {
                    var finalValue = changeValueFormat(value, row.ui_type);
                    if (row.ui_type != "checkbox") {
                        data[objKey] = finalValue ? finalValue : value;
                    }
                    else {
                        data[objKey] = finalValue;
                    }

                }
            });
        }
    });
}

