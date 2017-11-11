/**
 * Created by 柏浩 on 2017/10/16.
 * sales 作業 相關
 */

var config = require("../configs/database");
var sysConf = require("../configs/systemConfig");
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
let fieldAttrSvc = require("./FieldsAttrService");
var ruleAgent = require("../ruleEngine/ruleAgent");
var commonTools = require("../utils/CommonTools");

/**
 * [PMS0620020] 業務員資料編輯 撈取單筆紀錄
 * @param session{Object}: session
 * @param postData{Object} :  參數
 * @param callback {function} (err, rowData)
 */
exports.handleSinglePageRowData_PM0620020 = function (session, postData, callback) {
    var prg_id = postData.prg_id || "";
    var userInfo = session.user;
    var locale = session.locale;

    async.parallel([
        //取sales_mn資料
        function (cbp) {
            async.waterfall([
                //取sales_mn欄位資料
                function (cb) {
                    mongoAgent.UIPageField.find({
                        prg_id: prg_id,
                        page_id: 1
                    }, function (errPageField, pageField) {
                        if (errPageField) {
                            cb(errPageField, null);
                        }
                        else {
                            cb(null, pageField);
                        }
                    });
                },
                //取取sales_mn資料並處理多語系
                function (pageField, cb) {
                    postData["athena_id"] = userInfo.athena_id;

                    if(postData["user_nos"] == ""){
                        queryAgent.query("QRY_SALES_MN_ALL_FIELDS_USER_NOS_BLANK", postData, function (errRowData, rowData) {
                            if (errRowData || !rowData ) {
                                cb(errRowData, null);
                            }
                            else {
                                langSvc.handleSingleDataLangConv(rowData, prg_id, 1, locale, function (errLangConv, rowDataLangConv) {
                                    var lo_rowData = tools.handlePreprocessData(rowDataLangConv, pageField);

                                    var postData = {
                                        rowData: lo_rowData,
                                        pageField: pageField
                                    };
                                    cb(null, postData);
                                });
                            }
                        });
                    }
                    else{
                        queryAgent.query("QRY_SALES_MN_ALL_FIELDS", postData, function (errRowData, rowData) {
                            if (errRowData || !rowData ) {
                                cb(errRowData, null);
                            }
                            else {
                                langSvc.handleSingleDataLangConv(rowData, prg_id, 1, locale, function (errLangConv, rowDataLangConv) {
                                    var lo_rowData = tools.handlePreprocessData(rowDataLangConv, pageField);

                                    var postData = {
                                        rowData: lo_rowData,
                                        pageField: pageField
                                    };
                                    cb(null, postData);
                                });
                            }
                        });
                    }
                },
                function (postData, cb) {
                    var lo_rowData = postData.rowData;
                    var lo_pageField = postData.pageField;

                    mongoAgent.SetupPageFunction.findOne({
                        prg_id: prg_id,
                        func_id: '0401'
                    }, function (err, func) {
                        if (err || !func) {
                            func = "";
                        } else {
                            func = func.toObject().rule_func_name;
                        }

                        dataRuleSvc.chkIsModificableRowData(func, lo_rowData, session, function (err, result) {
                            result["pageField"] = lo_pageField;
                            result["rowData"] = lo_rowData;
                            cb(err, result);
                        });
                    });
                }
            ], function (errSalesMN, resultSalesMN) {
                dataValueChange(resultSalesMN["pageField"], resultSalesMN["rowData"])
                cbp(errSalesMN, resultSalesMN);
            });
        },
        //取sales_hotel_dt資料
        function (cbp) {
            var params = {
                prg_id: prg_id,
                page_id: 1,
                tab_page_id: 1,
                sales_cod: postData.sales_cod
            };

            fetchPrgDataGrid_PMS0620020(session, params, function (err, dataGridRows, fieldData, la_searchFields) {
                var lo_rtnObject = {
                    dataGridDataHotelDT: dataGridRows,
                    dataGridFieldHotelDT: fieldData
                };

                if (err) {
                    cbp(err, null);
                }
                else {
                    cbp(null, lo_rtnObject);
                }
            });
        },
        //取sales_class_hs資料
        function (cbp) {
            var params = {
                prg_id: prg_id,
                page_id: 1,
                tab_page_id: 2,
                sales_cod: postData.sales_cod
            };

            fetchPrgDataGrid_PMS0620020(session, params, function (err, dataGridRows, fieldData, la_searchFields) {
                var lo_rtnObject = {
                    dataGridDataClassHs: dataGridRows,
                    dataGridFieldClassHs: fieldData
                };

                if (err) {
                    cbp(err, null);
                }
                else {
                    cbp(null, lo_rtnObject);
                }
            });
        }
    ], function (err, result) {
        callback(err, result);
    });

    function fetchPrgDataGrid_PMS0620020(session, postData, callback) {
        let prg_id = postData.prg_id;
        let userInfo = session.user;
        let page_id = postData.page_id;
        let tab_page_id = postData.tab_page_id;
        let lo_searchCond = postData.searchCond || {}; //搜尋條件
        let params = {
            athena_id: userInfo.athena_id,
            sales_cod: postData.sales_cod
        };
        let dataGridRows = [];
        let fieldData = [];
        let la_searchFields = [];

        _.each(lo_searchCond, function (condVal, condKey) {
            if (_.isArray(condVal) && condVal.length > 0) {
                params[condKey] = condVal;
            } else if (!_.isUndefined(condVal) && !_.isEmpty(condVal)) {
                params[condKey] = condVal;
            }
        });

        async.waterfall([
            function (cb) {
                mongoAgent.TemplateRf.findOne({
                    prg_id: prg_id,
                    page_id: page_id,
                    tab_page_id: tab_page_id,
                    template_id: "datagrid"
                }, function (err, grid) {
                    cb(err, grid);
                });
            },
            function (grid, cb) {
                queryAgent.queryList(grid.rule_func_name, params, 0, 0, function (err, data) {
                    dataGridRows = data;
                    if (err) {
                        console.error(err);
                    }
                    cb(null, dataGridRows);
                });
            },
            //  ) 條件過濾
            function (dataRow, cb) {
                if (!_.isUndefined(ruleAgent[prg_id + "Filter"])) {
                    ruleAgent[prg_id + "Filter"](dataRow, session, params, function (dataRow) {
                        dataGridRows = dataRow;
                        cb(null, dataRow);
                    });
                } else {
                    cb(null, dataRow);
                }

            },
            // 4)找尋field 屬性資料
            function (dataRow, cb) {
                //先依使用者id 與館別找此PRG_ID有無欄位屬性，若無則抓預設
                mongoAgent.UIDatagridField.find({
                    user_id: userInfo.usr_id,
                    athena_id: userInfo.athena_id,
                    prg_id: prg_id,
                    page_id: page_id,
                    tab_page_id: tab_page_id
                }).sort({col_seq: 1}).select({_id: 0}).exec(function (err, UserFieldData) {
                    if (err || UserFieldData.length == 0) {
                        mongoAgent.UIDatagridField.find({
                            user_id: "",
                            prg_id: prg_id,
                            page_id: page_id,
                            tab_page_id: tab_page_id
                        }).sort({col_seq: 1}).select({_id: 0}).exec(function (err, commonFields) {
                            fieldData = tools.mongoDocToObject(commonFields);
                            cb(err, fieldData);
                        });
                    }
                    else {
                        fieldData = tools.mongoDocToObject(UserFieldData);
                        cb(err, fieldData);
                    }
                });
            },
            //欄位多語系
            function (fieldData, cb) {
                mongoAgent.LangUIField.find({
                    prg_id: prg_id,
                    page_id: page_id,
                    tab_page_id: tab_page_id,
                    template_id: "datagrid"
                }).exec(function (err, fieldLang) {
                    fieldLang = tools.mongoDocToObject(fieldLang);
                    _.each(fieldData, function (field, fIdx) {
                        let tmpLang = _.findWhere(fieldLang, {ui_field_name: field["ui_field_name"].toLowerCase()});
                        if (tmpLang) {
                            fieldData[fIdx]["ui_display_name"] = tmpLang && tmpLang["ui_display_name_" + session.locale] != ""
                                ? tmpLang["ui_display_name_" + session.locale]
                                : tmpLang["ui_display_name_zh_TW"] ? tmpLang["ui_display_name_zh_TW"] + '(' + session.locale + ')' : '';
                        }
                    });
                    cb(err, fieldData);
                });
            },
            // 5)尋找ui_type有select的話，取得combobox的資料；看(visiable,modificable,requirable) "C"要檢查是否要顯示欄位
            function (fields, cb) {

                var selectDSFunc = [];
                _.each(fieldData, function (field, fIdx) {
                    if (field.ui_type == 'select' || field.ui_type == 'multiselect' || field.ui_type == 'checkbox' || field.ui_type == 'selectgrid') {

                        //讀取selectgrid的設定參數
                        if (field.ui_type == 'selectgrid') {
                            var func_name = prg_id + '_' + field.ui_field_name;
                            fieldData[fIdx].selectGridOptions = ruleAgent[func_name]();
                        }

                        selectDSFunc.push(
                            function (cb) {
                                mongoAgent.UITypeSelect.findOne({
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
                                            cb(null, {ui_field_idx: fIdx, ui_field_name: field.ui_field_name});
                                        });

                                    }
                                    else {
                                        cb(null, {ui_field_idx: fIdx, ui_field_name: field.ui_field_name});
                                    }
                                });
                            }
                        );
                    }

                    //SAM:看(visiable,modificable,requirable) "C"要檢查是否要顯示欄位 2017/6/20
                    var attrName = field.attr_func_name;
                    if (!_.isEmpty(attrName)) {
                        selectDSFunc.push(
                            function (cb) {
                                if (field.visiable == "C") {
                                    if (!_.isEmpty(attrName) && !_.isUndefined(ruleAgent[attrName])) {
                                        ruleAgent[attrName](field, userInfo, function (err, result) {
                                            if (result) {
                                                fieldData[fIdx] = result[0];
                                                cb(err, {ui_field_idx: fIdx, field: result});
                                            } else {
                                                cb(err, {ui_field_idx: fIdx, field: result});
                                            }
                                        });
                                    } else {
                                        cb(null, {ui_field_idx: fIdx, field: result});
                                    }
                                }
                                else if (field.modificable == "C") {
                                    if (!_.isEmpty(attrName) && !_.isUndefined(ruleAgent[attrName])) {
                                        ruleAgent[attrName](field, userInfo, function (err, result) {
                                            if (result) {
                                                fieldData[fIdx] = result[0];
                                                cb(err, {ui_field_idx: fIdx, field: result});
                                            } else {
                                                cb(err, {ui_field_idx: fIdx, field: result});
                                            }
                                        });
                                    } else {
                                        cb(null, {ui_field_idx: fIdx, field: result});
                                    }
                                }
                                else if (field.requirable == "C") {
                                    if (!_.isEmpty(attrName) && !_.isUndefined(ruleAgent[attrName])) {
                                        ruleAgent[attrName](field, userInfo, function (err, result) {
                                            if (result) {
                                                fieldData[fIdx] = result[0];
                                                cb(err, {ui_field_idx: fIdx, field: result});
                                            } else {
                                                cb(err, {ui_field_idx: fIdx, field: result});
                                            }
                                        });
                                    } else {
                                        cb(null, {ui_field_idx: fIdx, field: result});
                                    }
                                }
                                else {
                                    cb(null, {ui_field_idx: fIdx, visiable: field.visiable});
                                }
                            }
                        );
                    }
                });

                async.parallel(selectDSFunc, function (err, result) {
                    cb(err, result);
                });
            },
            // 6)內容多語處理
            function (data, cb) {
                langSvc.handleMultiDataLangConv(dataGridRows, prg_id, page_id, session.locale, function (err, Rows) {
                    dataGridRows = Rows;
                    cb(null, dataGridRows);
                });
            },
            // 7)撈取搜尋欄位
            function (data, cb) {
                fieldAttrSvc.getAllUIPageFieldAttr({
                    prg_id: prg_id,
                    page_id: 3,
                    locale: session.locale
                }, userInfo, function (err, fields) {
                    la_searchFields = fields;
                    cb(null, fields);
                });
            }

        ], function (err, result) {

            if (err) {
                console.error(err);
            }


            callback(err, {dataGridRows: dataGridRows, fieldData: fieldData, la_searchFields: la_searchFields});

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
            valueTemp = commonRule.accMul(parseFloat(value), 100);
        } else if (ui_type == "checkbox") {
            if (value == "Y") {
                valueTemp = true;
            } else {
                valueTemp = false;
            }
        } else if (ui_type == "multiselect") {
            var array = value.replace(/'/g, "").split(',');
            valueTemp = [];
            for (i = 0; i < array.length; i++) {
                valueTemp.push(array[i]);
            }
        }

        return valueTemp;
    }

};

exports.handleSinglePageFieldData_PM0620020 = function (session, postData, callback) {
    var prg_id = postData.prg_id || "";
    var userInfo = session.user;
    var locale = session.locale;
    var la_saleMnfields = []; //欄位屬性陣列
    var la_hotelDtFields = [];
    var la_classHsFields = [];

    async.parallel([
        //取sales_mn欄位
        function (cb) {
            async.waterfall([
                //1) 撈出全部的欄位屬性
                function (cbw) {
                    mongoAgent.UIPageField.find({page_id: 1, prg_id: prg_id}).sort({
                        row_seq: 1,
                        col_seq: 1
                    }).exec(function (err, fields) {
                        la_saleMnfields = tools.mongoDocToObject(fields);
                        cbw(err, fields);
                    });
                },
                //2) 撈取屬性陣列裡有select的來源
                function (fields, cbw) {
                    var selectDSFunc = [];

                    _.each(la_saleMnfields, function (field, fIdx) {
                        if (field.ui_type == 'select' || field.ui_type == 'multiselect' || field.ui_type == 'checkbox' || field.ui_type == 'selectgrid') {

                            //讀取selectgrid的設定參數
                            if (field.ui_type == 'selectgrid') {
                                var func_name = prg_id + '_' + field.ui_field_name;
                                la_saleMnfields[fIdx].selectGridOptions = ruleAgent[func_name]();
                            }

                            selectDSFunc.push(
                                function(cbw) {
                                    mongoAgent.UITypeSelect.findOne({
                                        prg_id: prg_id,
                                        ui_field_name: field.ui_field_name
                                    }).exec(function (err, selRow) {
                                        la_saleMnfields[fIdx].selectData = [];
                                        if (selRow) {
                                            selRow = selRow.toObject();
                                            la_saleMnfields[fIdx].ds_from_sql = selRow.ds_from_sql || "";
                                            la_saleMnfields[fIdx].referiable = selRow.referiable || "N";
                                            la_saleMnfields[fIdx].defaultVal = selRow.defaultVal || "";
                                            dataRuleSvc.getSelectOptions(userInfo, selRow, function (selectData) {
                                                la_saleMnfields[fIdx].selectData = selectData;
                                                cbw(null, {ui_field_idx: fIdx, ui_field_name: field.ui_field_name});
                                            });
                                        } else {
                                            cbw(null, {ui_field_idx: fIdx, ui_field_name: field.ui_field_name});
                                        }

                                    });
                                }
                            );
                        }
                        else if(field.ui_type == "tree"){
                            selectDSFunc.push(
                                function(cbw) {
                                    la_saleMnfields[fIdx].selectData = [];
                                    ruleAgent[field.rule_func_name](field, userInfo, function(err, result){
                                        la_saleMnfields[fIdx].selectData = result.selectOptions;
                                        cbw(null, {ui_field_idx: fIdx, ui_field_name: field.ui_field_name});
                                    });
                                }
                            );
                        }
                    });

                    async.parallel(selectDSFunc, function (err, result) {
                        cbw(err, result);
                    });
                },
                //3) 處理欄位多語系
                function (fields, cbw){
                    mongoAgent.LangUIField.find({
                        prg_id: prg_id,
                        page_id: 1
                    }).exec(function (err, fieldLang) {
                        _.each(la_saleMnfields, function (field, fIdx) {
                            let tmpLang = _.findWhere(fieldLang, {ui_field_name: field["ui_field_name"].toLowerCase()});
                            if (tmpLang) {
                                la_saleMnfields[fIdx]["ui_display_name"] = tmpLang["ui_display_name_" + session.locale] != ''
                                    ? tmpLang["ui_display_name_" + session.locale]
                                    : tmpLang["ui_display_name_zh_TW"] + '(' + session.locale + ')';
                            }

                            if(field.ui_type == 'grid'){
                                _.each(field.datagridFields, function (field, Idx) {
                                    let tmpLang = _.findWhere(fieldLang, {ui_field_name: field["ui_field_name"].toLowerCase()});
                                    if (tmpLang) {
                                        la_saleMnfields[fIdx].datagridFields[Idx]["ui_display_name"] = tmpLang && tmpLang["ui_display_name_" + session.locale] != '' ? tmpLang["ui_display_name_" + session.locale]
                                            : tmpLang["ui_display_name_zh_TW"] + '(' + session.locale + ')';
                                    }

                                });
                            }
                        });
                        cbw(err, la_saleMnfields);
                    });
                }
            ], function (errSalesMnField, salesMnField) {
                cb(errSalesMnField, salesMnField);
            });
        },
        // 取sales_hotel_dt欄位
        function (cb) {
            async.waterfall([
                function (cbw) {
                    mongoAgent.UIPageField.findOne({
                        prg_id: prg_id,
                        page_id: 1,
                        tab_page_id: 1,
                        ui_type: 'grid'
                    }, function (err, pageInfo) {
                        if (err || !pageInfo) {
                            err = "Not found datagrid ";
                        }

                        cbw(err, pageInfo);
                    });
                },
                //找尋field 屬性資料
                function(pageInfo, cbw){
                    mongoAgent.UIDatagridField.find({
                        user_id: userInfo.usr_id,
                        athena_id: userInfo.athena_id,
                        prg_id: prg_id,
                        page_id: 1,
                        tab_page_id: 1
                    }).sort({col_seq: 1}).exec(function (errHotelDtField, hotelDtField) {
                        if (errHotelDtField || hotelDtField.length == 0) {
                            mongoAgent.UIDatagridField.find({
                                user_id: "",
                                prg_id: prg_id,
                                page_id: 1,
                                tab_page_id: 1
                            }).sort({col_seq: 1}).select({_id: 0}).exec(function (err, commonFields) {
                                la_hotelDtFields = tools.mongoDocToObject(commonFields);
                                cbw(err, la_hotelDtFields);
                            });
                        }
                        else {
                            la_hotelDtFields = tools.mongoDocToObject(hotelDtField);
                            cbw(errHotelDtField, la_hotelDtFields);
                        }
                    });
                },
                //欄位多語系
                function(fieldData, cbw){
                    mongoAgent.LangUIField.find({
                        prg_id: prg_id,
                        page_id: 1,
                        tab_page_id: 1
                    }).exec(function (err, fieldLang) {
                        fieldLang = tools.mongoDocToObject(fieldLang);
                        _.each(fieldData, function (field, fIdx) {
                            let tmpLang = _.findWhere(fieldLang, {ui_field_name: field["ui_field_name"].toLowerCase()});
                            if(tmpLang){
                                fieldData[fIdx]["ui_display_name"] = tmpLang && tmpLang["ui_display_name_" + session.locale] != ""
                                    ? tmpLang["ui_display_name_" + session.locale]
                                    : tmpLang["ui_display_name_zh_TW"] ? tmpLang["ui_display_name_zh_TW"] + '('+session.locale+')' : '';
                            }
                        });
                        cbw(err, fieldData);
                    });
                },
                //尋找ui_type有select的話，取得combobox的資料；看(visiable,modificable,requirable)
                function(fields, cbw){
                    var selectDSFunc = [];
                    _.each(fields, function(field, fIdx){
                        if (field.ui_type == 'select' || field.ui_type == 'multiselect' || field.ui_type == 'checkbox' || field.ui_type == 'selectgrid'){
                            if (field.ui_type == 'selectgrid') {
                                var func_name = prg_id + '_' + field.ui_field_name;
                                la_hotelDtFields[fIdx].selectGridOptions = ruleAgent[func_name]();
                            }
                        }

                        selectDSFunc.push(
                            function (cbw) {
                                mongoAgent.UITypeSelect.findOne({
                                    prg_id: prg_id,
                                    ui_field_name: field.ui_field_name
                                }).exec(function (err, selRow) {
                                    la_hotelDtFields[fIdx].selectData = [];
                                    if (selRow) {
                                        selRow = selRow.toObject();
                                        la_hotelDtFields[fIdx].ds_from_sql = selRow.ds_from_sql || "";
                                        la_hotelDtFields[fIdx].referiable = selRow.referiable || "N";
                                        la_hotelDtFields[fIdx].defaultVal = selRow.defaultVal || "";

                                        dataRuleSvc.getSelectOptions(userInfo, selRow, function (selectData) {
                                            la_hotelDtFields[fIdx].selectData = selectData;
                                            cbw(null, {ui_field_idx: fIdx, ui_field_name: field.ui_field_name});
                                        });

                                    } else {
                                        cbw(null, {ui_field_idx: fIdx, ui_field_name: field.ui_field_name});
                                    }
                                });
                            }
                        );
                    });

                    async.parallel(selectDSFunc, function (err, result) {
                        cbw(err, result);
                    });
                }
            ], function (errHotelDtField, hotelDtField){
                cb(errHotelDtField, la_hotelDtFields);
            });
        },
        // 取sales_class_hs欄位
        function (cb) {
            async.waterfall([
                function (cbw) {
                    mongoAgent.UIPageField.findOne({
                        prg_id: prg_id,
                        page_id: 1,
                        tab_page_id: 2,
                        ui_type: 'grid'
                    }, function (err, pageInfo) {
                        if (err || !pageInfo) {
                            err = "Not found datagrid ";
                        }

                        cbw(err, pageInfo);
                    });
                },
                //找尋field 屬性資料
                function(pageInfo, cbw){
                    mongoAgent.UIDatagridField.find({
                        user_id: userInfo.usr_id,
                        athena_id: userInfo.athena_id,
                        prg_id: prg_id,
                        page_id: 1,
                        tab_page_id: 2
                    }).sort({col_seq: 1}).exec(function (errClassHsField, classHsField) {
                        if (errClassHsField || classHsField.length == 0) {
                            mongoAgent.UIDatagridField.find({
                                user_id: "",
                                prg_id: prg_id,
                                page_id: 1,
                                tab_page_id: 2
                            }).sort({col_seq: 1}).select({_id: 0}).exec(function (err, commonFields) {
                                la_classHsFields = tools.mongoDocToObject(commonFields);
                                cbw(err, la_classHsFields);
                            });
                        }
                        else {
                            la_classHsFields = tools.mongoDocToObject(classHsField);
                            cbw(errClassHsField, la_classHsFields);
                        }
                    });
                },
                //欄位多語系
                function(fieldData, cbw){
                    mongoAgent.LangUIField.find({
                        prg_id: prg_id,
                        page_id: 1,
                        tab_page_id: 2
                    }).exec(function (err, fieldLang) {
                        fieldLang = tools.mongoDocToObject(fieldLang);
                        _.each(fieldData, function (field, fIdx) {
                            let tmpLang = _.findWhere(fieldLang, {ui_field_name: field["ui_field_name"].toLowerCase()});
                            if(tmpLang){
                                fieldData[fIdx]["ui_display_name"] = tmpLang && tmpLang["ui_display_name_" + session.locale] != ""
                                    ? tmpLang["ui_display_name_" + session.locale]
                                    : tmpLang["ui_display_name_zh_TW"] ? tmpLang["ui_display_name_zh_TW"] + '('+session.locale+')' : '';
                            }
                        });
                        cbw(err, fieldData);
                    });
                },
                //尋找ui_type有select的話，取得combobox的資料；看(visiable,modificable,requirable)
                function(fields, cbw){
                    var selectDSFunc = [];
                    _.each(fields, function(field, fIdx){
                        if (field.ui_type == 'select' || field.ui_type == 'multiselect' || field.ui_type == 'checkbox' || field.ui_type == 'selectgrid'){
                            if (field.ui_type == 'selectgrid') {
                                var func_name = prg_id + '_' + field.ui_field_name;
                                la_classHsFields[fIdx].selectGridOptions = ruleAgent[func_name]();
                            }
                        }

                        selectDSFunc.push(
                            function (cbw) {
                                mongoAgent.UITypeSelect.findOne({
                                    prg_id: prg_id,
                                    ui_field_name: field.ui_field_name
                                }).exec(function (err, selRow) {
                                    la_classHsFields[fIdx].selectData = [];
                                    if (selRow) {
                                        selRow = selRow.toObject();
                                        la_classHsFields[fIdx].ds_from_sql = selRow.ds_from_sql || "";
                                        la_classHsFields[fIdx].referiable = selRow.referiable || "N";
                                        la_classHsFields[fIdx].defaultVal = selRow.defaultVal || "";

                                        dataRuleSvc.getSelectOptions(userInfo, selRow, function (selectData) {
                                            la_classHsFields[fIdx].selectData = selectData;
                                            cbw(null, {ui_field_idx: fIdx, ui_field_name: field.ui_field_name});
                                        });

                                    } else {
                                        cbw(null, {ui_field_idx: fIdx, ui_field_name: field.ui_field_name});
                                    }
                                });
                            }
                        );
                    });

                    async.parallel(selectDSFunc, function (err, result) {
                        cbw(err, result);
                    });
                }
            ], function (errClassHsField, classHsField) {
                cb(errClassHsField, la_classHsFields);
            });
        }
    ], function (err, result) {
        callback(err, result);
    });

};

exports.handleAddFuncRule_PMS0620020 = function (session, postData, callback) {
    let prg_id = postData.prg_id;
    let page_id = postData.page_id ? Number(postData.page_id) : 1;
    async.parallel([
        function (cb) {
            mongoAgent.UIPageField.find({prg_id: prg_id, page_id: page_id}, function (err, fieldNameList) {
                cb(err, _.pluck(fieldNameList, "ui_field_name"));
            });
        },
        function(cb){
            mongoAgent.UITypeSelect.find({prg_id: prg_id}, function (err, selectData) {
                cb(err, selectData);
            });
        }
    ], function (err, getResult) {
        var fieldNameList = getResult[0];
        var selectData = commonTools.mongoDocToObject(getResult[1]);
        let lo_initField = {};
        _.each(fieldNameList, function (name) {
            if (name == "athena_id") {
                lo_initField[name] = session.user.athena_id;
            }
            else if (name == "hotel_cod") {
                lo_initField[name] = session.user.hotel_cod;
            }
            else {
                lo_initField[name] = "";
            }
        });
        mongoAgent.SetupDatagridFunction.findOne({
            prg_id: prg_id,
            func_id: '0200',
            page_id: page_id
        }, function (err, func) {
            if (func) {
                func = func.toObject();
            }
            if (!err && func && !_.isEmpty(func.rule_func_name) && !_.isUndefined(ruleAgent[func.rule_func_name])) {

                ruleAgent[func.rule_func_name](postData, session, function (err, result) {

                    //取typeSelect的預設值
                    _.each(selectData, function (value, index) {
                        if(value.defaultVal != ""){
                            result.defaultValues[value.ui_field_name] = value.defaultVal;
                        }
                    });

                    result.defaultValues = _.extend(lo_initField, result.defaultValues);

                    callback(err, result);
                });

            } else {

                //取typeSelect的預設值
                var result = {};
                _.each(selectData, function (value, index) {
                    if(value.defaultVal != ""){
                        result[value.ui_field_name] = value.defaultVal;
                    }
                });

                result = _.extend(lo_initField, result);
                callback(null, {success: true, defaultValues: result});
            }

        });
    });
};


