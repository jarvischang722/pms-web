/**
 * Created by kaiyue on 2017/11/15.
 */

const path = require('path');
const moment = require("moment");
const _ = require("underscore");
const async = require("async");

const ruleAgent = require("../../ruleEngine/ruleAgent");
const queryAgent = require("../../plugins/kplug-oracle/QueryAgent");
const mongoAgent = require("../../plugins/mongodb");
const sysConfig = require("../../configs/systemConfig");
const tools = require("../../utils/CommonTools");
const dataRuleSvc = require("../../services/DataRuleService");
const fieldAttrSvc = require("../../services/FieldsAttrService");
const langSvc = require("../../services/LangService");

let go_session;
let go_searchCond;
let gs_prg_id;
let gn_page_id;
let gn_tab_page_id;

// 多筆流程
exports.DataGridProc = function (postData, session) {
    gn_page_id = postData.page_id || 1;
    gn_tab_page_id = postData.tab_page_id || 1;
    go_session = session;
    gs_prg_id = postData.prg_id;
    go_searchCond = postData.searchCond || {}; //搜尋條件

    let self = this;
    /**
     * 查詢欄位資料
     * @param callback
     */
    this.fetchDgFieldsData = function (callback) {
        async.waterfall([
            qryUIDatagridFields,     //取多筆欄位資料
            qryFormatRule,            //format_func_name轉換
            qryLangUIFields,         //欄位多語系
            qrySelectOption,         //查詢SelectOption
            qrySearchFields          //取搜尋欄位
        ], function (err, result) {
            callback(err, result);
        });
    };

    /**
     * 查詢oracle資料
     * @param callback
     */
    this.fetchDgRowData = function (callback) {
        async.waterfall([
            qryDgTemplateRf,     //查詢templateRf
            qryRowData,        //查詢多筆資料
            filterRowData,          //依條件過濾多筆資料
            rowDataMultiLang        //內容多語系
        ], function (err, result) {
            callback(err, result);
        });
    };

    /**
     * 取多筆 資料
     * @param callback
     */
    this.fetchDgData = function (callback) {
        async.parallel({
            fetchFieldsResult: self.fetchDgFieldsData,   //取多筆欄位資料
            fetchRowsResult: self.fetchDgRowData         //取多筆資料
        }, function (err, result) {
            if (err == "templateRf is null") {
                err = null;
                return callback(err, result);
            }
            let lo_rtnData = {
                searchFields: result.fetchFieldsResult.searchFields,
                dgFieldsData: result.fetchFieldsResult.dgFieldsData,
                dgRowData: result.fetchRowsResult
            };
            callback(err, lo_rtnData);
        });
    };
};

// 單筆流程
exports.GridSingleProc = function (postData, session) {
    gn_page_id = postData.page_id || 2;
    gn_tab_page_id = postData.tab_page_id || 1;
    go_session = session;
    gs_prg_id = postData.prg_id;
    go_searchCond = postData.searchCond || {}; //搜尋條件

    let self = this;

    /**
     * 查詢單筆mn欄位資料
     * @param callback
     */
    this.fetchGsMnFieldsData = function (callback) {
        async.waterfall([
            qryUIPageFields,     //取單筆欄位資料
            qrySelectOption,     //查詢selectOption
            qryFormatRule,        //format_func_name轉換
            qryLangUIFields      //處理欄位多語系
        ], function (err, result) {
            callback(err, result);
        });
    };

    /**
     * 查詢單筆mn oracle資料
     * @param callback
     */
    this.fetchGsMnRowData = function (callback) {
        async.waterfall([
            qryGsTemplateRf,     //查詢templateRf
            qryRowData,        //查詢多筆資料
            filterRowData,     //依條件過濾多筆資料
            rowDataMultiLang   //內容多語系
        ], function (err, result) {
            callback(err, result);
        });
    };

    /**
     * 查詢預設單筆mn oracle資料
     * @param callback
     */
    this.fetchDefaultMnRowData = function (callback) {
        async.parallel({
            qryFieldName,
            qrySelectData
        }, function (err, getResult) {
            var la_fieldNameList = getResult[0];
            var la_selectData = tools.mongoDocToObject(getResult[1]);
            var lo_initField = {};

            _.each(la_fieldNameList, function (ls_fieldName) {
                if (ls_fieldName == "athena_id") {
                    lo_initField[ls_fieldName] = session.user.athena_id;
                }
                else if (ls_fieldName == "hotel_cod") {
                    lo_initField[ls_fieldName] = session.user.hotel_cod;
                }
                else {
                    lo_initField[ls_fieldName] = "";
                }
            });

            mongoAgent.PrgFunction.findOne({
                prg_id: gs_prg_id,
                func_id: '0200',
                page_id: gn_page_id,
                tab_page_id: gn_tab_page_id
            }, function(err, func){
                if (func) {
                    func = func.toObject();
                }
                if (!err && func && !_.isEmpty(func.rule_func_name) && !_.isUndefined(ruleAgent[func.rule_func_name])) {

                    ruleAgent[func.rule_func_name](postData, session, function (err, result) {

                        //取typeSelect的預設值
                        _.each(la_selectData, function (value, index) {
                            if(value.defaultVal != ""){
                                result.defaultValues[value.ui_field_name] = value.defaultVal;
                            }
                        });

                        result.defaultValues = _.extend(lo_initField, result.defaultValues);

                        callback(err, result);
                    });

                }
                else {
                    //取typeSelect的預設值
                    var result = {};
                    _.each(la_selectData, function (value, index) {
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

    /**
     * 取單筆mn 資料
     * @param callback
     */
    this.fetchGsMnData = function (callback) {
        async.waterfall([
            function (cb) {
                async.parallel({
                    fieldsData: self.fetchGsMnFieldsData,
                    rowData: self.fetchGsMnRowData
                }, function (err, resultMnData) {
                    cb(err, resultMnData);
                });
            },
            function (mnData, cb) {
                let la_pageField = mnData.fieldsData;
                let lo_rowData = mnData.rowData;
                dataValueChange(la_pageField, lo_rowData);

                let gsMnData = {
                    fieldsData: la_pageField,
                    rowData: lo_rowData
                }
                cb(null, gsMnData);
            }
        ], function (err, result) {
            callback(err, result);
        });
    };

};

/*
 * 查詢單筆欄位名稱
 */
function qryFieldName(callback) {
    var lo_params = {
        prg_id: gs_prg_id,
        page_id: Number(gn_page_id)
    };

    mongoAgent.UIPageField.find(lo_params, function (err, fieldNameList) {
        callback(err, _.pluck(fieldNameList, "ui_field_name"));
    });
}

/*
 * 查詢單筆下拉欄位資料
 */
function qrySelectData(callback) {
    var lo_params = {
        prg_id: gs_prg_id,
        page_id: Number(gn_page_id)
    };

    mongoAgent.UITypeSelect.find(lo_params, function (err, selectData) {
        callback(err, selectData);
    });
}

/*
 * 查詢多筆templateRf
 */
function qryDgTemplateRf(callback) {
    var lo_params = {
        prg_id: gs_prg_id,
        page_id: Number(gn_page_id),
        tab_page_id: Number(gn_tab_page_id),
        template_id: 'datagrid'
    };

    mongoAgent.TemplateRf.findOne(lo_params, function (err, result) {
        if (!result) {
            err = "templateRf is null";
        }
        callback(err, result);
    });
}

/**
 * 查詢多筆templateRf
 */
function qryGsTemplateRf(callback) {
    var lo_params = {
        prg_id: gs_prg_id,
        page_id: Number(gn_page_id),
        tab_page_id: Number(gn_tab_page_id),
        template_id: 'gridsingle'
    };

    mongoAgent.TemplateRf.findOne(lo_params, function (err, result) {
        if (!result) {
            err = "templateRf is null";
        }
        callback(err, result);
    });
}

/**
 * 查詢多筆資料
 */
function qryRowData(lo_rfData, callback) {
    let lo_params = filterSearchCond();
    let ls_rule_func_name = lo_rfData.rule_func_name;
    queryAgent.queryList(ls_rule_func_name.toLocaleUpperCase(), lo_params, 0, 0, function (err, result) {
        callback(err, result);
    });
}

/**
 * 取多筆欄位資料
 * @param lo_params {object} 查詢條件
 * @param callback
 */
function qryUIDatagridFields(callback) {
    //抓使用者及預設欄位
    let lo_params = {
        $or: [
            {user_id: ""},
            {user_id: go_session.user.user_id}
        ],
        prg_id: gs_prg_id
    };
    let la_fieldData = [];
    mongoAgent.UIDatagridField.find(lo_params).sort({col_seq: 1}).select({_id: 0}).exec(function (err, dgFieldData) {
        if (!dgFieldData) {
            err = "uiDatagridFields is null";
            return callback(err, dgFieldData);
        }
        la_fieldData = tools.mongoDocToObject(dgFieldData);
        //過濾使用者欄位
        let la_userFieldData = _.filter(la_fieldData, function (lo_fieldData) {
            return lo_fieldData.user_id != "";
        });

        if (la_userFieldData.length != 0) {
            la_fieldData = la_userFieldData;
        }
        callback(err, la_fieldData);
    });
}

/**
 * 取單筆欄位資料
 */
function qryUIPageFields(callback) {
    mongoAgent.UIPageField.find({
        prg_id: gs_prg_id,
        page_id: Number(gn_page_id)
    }, function (err, result) {
        if (!result) {
            err = "uiPageFields is null";
            return callback(err, result);
        }
        let la_gsFieldsData = tools.mongoDocToObject(result);
        callback(err, la_gsFieldsData);
    });
}

/**
 * format_func_name轉換成 object
 * @param la_fieldData{array}所有欄位資料
 * @param callback
 */
function qryFormatRule(la_fieldData, callback) {
    let ln_counter = 0;

    _.each(la_fieldData, function (lo_fieldData) {
        var lo_format = {
            rule_name: "",
            rule_val: "",
            validate: ""
        };

        var ls_formatFuncName = _.clone(lo_fieldData["format_func_name"]);
        lo_fieldData["format_func_name"] = lo_format;

        if (ls_formatFuncName.indexOf(",") > -1) {
            var la_formatFuncName = ls_formatFuncName.split(",");
            for (var i = 1; i < la_formatFuncName.length; i++) {
                lo_fieldData["format_func_name"].validate = lo_format.validate + "," + la_formatFuncName[i];
            }
            qryOracleFormat(la_formatFuncName[0]);
        }
        else {
            qryOracleFormat(ls_formatFuncName);
        }

        /**
         * 去oracle撈format參數
         * @param ls_formatName{string} format 的名稱
         */
        function qryOracleFormat(ls_formatName) {
            queryAgent.query(ls_formatName.toUpperCase(), {athena_id: go_session.user.athena_id}, function (err, result) {
                ln_counter++;
                if (err) {
                    lo_fieldData["format_func_name"].validate = ls_formatFuncName;
                }
                else {
                    lo_fieldData["format_func_name"].rule_name = ls_formatFuncName;
                    lo_fieldData["format_func_name"].rule_val = result.format_val;
                }

                if (ln_counter == la_fieldData.length) {
                    callback(null, la_fieldData);
                }
            });
        }
    });
}

/**
 * 欄位多語系
 * @param lo_params {object} 查詢多語系條件
 * @param la_dgFieldData {array} 所有多筆欄位資料
 * @param callback
 */
function qryLangUIFields(la_dgFieldData, callback) {
    let lo_params = {
        prg_id: gs_prg_id,
        page_id: gn_page_id
    };
    mongoAgent.LangUIField.find(lo_params).exec(function (err, fieldLang) {
        fieldLang = tools.mongoDocToObject(fieldLang);
        _.each(la_dgFieldData, function (lo_dgFieldData, fIdx) {
            let tmpLang = _.findWhere(fieldLang, {ui_field_name: lo_dgFieldData["ui_field_name"].toLowerCase()});
            if (tmpLang) {
                la_dgFieldData[fIdx]["ui_display_name"] = tmpLang["ui_display_name_" + go_session.locale] != ""
                    ? tmpLang["ui_display_name_" + go_session.locale]
                    : tmpLang["ui_display_name_zh_TW"] ? tmpLang["ui_display_name_zh_TW"] + '(' + go_session.locale + ')' : '';

                la_dgFieldData[fIdx]["ui_hint"] = tmpLang["ui_display_name_" + go_session.locale] || "";

            }
        });
        callback(err, la_dgFieldData);
    });
}

/**
 * 查詢下拉Option
 * @param la_dgFieldData {array} 所有多筆欄位資料
 * @param callback
 */
function qrySelectOption(la_dgFieldData, callback) {
    var la_asyncParaFunc = [];
    _.each(la_dgFieldData, function (lo_dgField, fIdx) {
        if (lo_dgField.ui_type == 'select' || lo_dgField.ui_type == 'multiselect' || lo_dgField.ui_type == 'checkbox' || lo_dgField.ui_type == 'selectgrid') {

            //讀取selectgrid的設定參數
            if (lo_dgField.ui_type == 'selectgrid') {
                var func_name = gs_prg_id + '_' + lo_dgField.ui_field_name;
                la_dgFieldData[fIdx].selectGridOptions = ruleAgent[func_name]();
            }
            genAsyncParaFunc(la_dgFieldData, fIdx);
        }
        chkDgFieldIsC(la_dgFieldData, fIdx);
    });

    async.parallel(la_asyncParaFunc, function (err, result) {
        callback(err, la_dgFieldData);
    });

    /**
     * 產生執行async parallel function
     * @param lo_dgField {object} 多筆欄位
     * @param fIdx {number} 多筆欄位index
     */
    function genAsyncParaFunc(la_dgFieldData, fIdx) {
        let lo_dgField = la_dgFieldData[fIdx];
        la_asyncParaFunc.push(
            function (cb) {
                mongoAgent.UITypeSelect.findOne({
                    prg_id: gs_prg_id,
                    ui_field_name: lo_dgField.ui_field_name
                }).exec(function (err, selRow) {
                    la_dgFieldData[fIdx].selectData = [];
                    if (selRow) {
                        selRow = selRow.toObject();
                        la_dgFieldData[fIdx].ds_from_sql = selRow.ds_from_sql || "";
                        la_dgFieldData[fIdx].referiable = selRow.referiable || "N";
                        la_dgFieldData[fIdx].defaultVal = selRow.defaultVal || "";

                        dataRuleSvc.getSelectOptions(go_session.user, selRow, la_dgFieldData[fIdx], function (selectData) {
                            la_dgFieldData[fIdx].selectData = selectData;
                            cb(null, {ui_field_idx: fIdx, ui_field_name: lo_dgField.ui_field_name});
                        });

                    } else {
                        cb(null, {ui_field_idx: fIdx, ui_field_name: lo_dgField.ui_field_name});
                    }
                });
            }
        );
    }

    /**
     * 檢查欄位visiable, modificable, requirable為C是否要顯示
     * @param lo_dgField {object} 多筆欄位
     * @param fIdx {number} 多筆欄位index
     */
    function chkDgFieldIsC(la_dgFieldData, fIdx) {
        let lo_dgField = la_dgFieldData[fIdx];
        let ls_attrName = lo_dgField.attr_func_name;
        if (!_.isEmpty(ls_attrName)) {
            la_asyncParaFunc.push(
                function (cb) {
                    if (lo_dgField.visiable == "C" || lo_dgField.modificable == "C" || lo_dgField.requirable == "C") {
                        if (!_.isEmpty(ls_attrName) && !_.isUndefined(ruleAgent[ls_attrName])) {
                            ruleAgent[ls_attrName](lo_dgField, go_session.user, function (err, result) {
                                if (result) {
                                    la_dgFieldData[fIdx] = result[0];
                                    cb(err, {ui_field_idx: fIdx, field: result});
                                } else {
                                    cb(err, {ui_field_idx: fIdx, field: result});
                                }
                            });
                        } else {
                            cb(null, {ui_field_idx: fIdx, field: lo_dgField});
                        }
                    }
                    else {
                        cb(null, {ui_field_idx: fIdx, visiable: lo_dgField.visiable});
                    }
                }
            );
        }
    }
}

/**
 * 查詢搜尋欄位
 * @param la_dgFieldData {array} 所有多筆欄位資料
 * @param callback
 */
function qrySearchFields(la_dgFieldData, callback) {
    async.waterfall([
        function (cb) {
            fieldAttrSvc.getAllUIPageFieldAttr({
                prg_id: gs_prg_id,
                page_id: 3,
                locale: go_session.locale
            }, go_session.user, function (err, fields) {
                cb(err, fields);
            });
        },
        qryFormatRule
    ], function (err, result) {
        let lo_rtnData = {
            searchFields: result,
            dgFieldsData: la_dgFieldData
        };
        callback(null, lo_rtnData);
    });
}

/**
 * 判斷傳入參數數量(實作多型功能)
 * @param args {array} function傳入參數
 * @returns {{callback: *, data: *}}
 */
function chkParam(args) {
    let lo_callback;
    let lo_data;
    if (args.length == 1) {
        lo_callback = args[0];
    }
    else {
        lo_data = args[0];
        lo_callback = args[1];
    }
    return {callback: lo_callback, data: lo_data};
}

/**
 * 過濾掉無效條件
 * @returns {{user_id: (string|*), athena_id, hotel_cod: (*|string|string)}}
 */
function filterSearchCond() {
    let lo_params = {
        user_id: go_session.user.usr_id,
        athena_id: go_session.user.athena_id,
        hotel_cod: go_session.user.fun_hotel_cod
    };
    _.each(go_searchCond, function (condVal, condKey) {
        if (_.isArray(condVal) && condVal.length > 0) {
            lo_params[condKey] = condVal;
        } else if (!_.isUndefined(condVal) && !_.isEmpty(condVal)) {
            lo_params[condKey] = condVal;
        }
    });

    return lo_params;
}

/**
 * 依搜尋條件過濾多筆資料
 * @param la_dgRowData {array} 多筆資料
 * @param callback
 */
function filterRowData(la_dgRowData, callback) {
    let lo_params = {
        user_id: go_session.user.usr_id,
        athena_id: go_session.user.athena_id,
        hotel_cod: go_session.user.fun_hotel_cod
    };
    let ls_ruleFilterName = gs_prg_id + "Filter";
    if (!_.isUndefined(ruleAgent[ls_ruleFilterName])) {
        ruleAgent[ls_ruleFilterName](la_dgRowData, go_session, lo_params, function (dataRow) {
            callback(null, dataRow);
        });
    } else {
        callback(null, la_dgRowData);
    }
}

/**
 * 多筆資料多語系
 * @param la_dgRowData {array} 多筆資料
 * @param callback
 */
function rowDataMultiLang(la_dgRowData, callback) {
    langSvc.handleMultiDataLangConv(la_dgRowData, gs_prg_id, gn_page_id, go_session.locale, function (err, Rows) {
        callback(null, Rows);
    });
}

/**
 * 將欄位名稱以及資料一筆一筆轉換頁面上顯示的資料
 * @param fields {arrays} 單筆 欄位資料
 * @param data {object} 單筆 資料
 */
function dataValueChange(fields, data) {
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

/**
 * 將要顯示在頁面上的欄位格式做轉換
 * @param value {string} 單筆 資料
 * @param ui_type {string} 單筆 欄位型態
 */
function changeValueFormat(value, ui_type) {
    var valueTemp = "";
    if (value == null) {
        return valueTemp;
    }
    if (ui_type == "time") {
        if (!_.isEmpty(value)) {
            var hour = value.substring(0, 2);
            var min = value.substring(2, 4);
            var fieldName = hour + ":" + min;
            valueTemp = fieldName;
        }
    }
    else if (ui_type == "percent") {
        valueTemp = commonRule.accMul(parseFloat(value), 100);
    }
    else if (ui_type == "checkbox") {
        if (value == "Y") {
            valueTemp = true;
        }
        else {
            valueTemp = false;
        }
    }
    else if (ui_type == "multiselect") {
        var array = value.replace(/'/g, "").split(',');
        valueTemp = [];
        for (i = 0; i < array.length; i++) {
            valueTemp.push(array[i]);
        }
    }
    else if (ui_type.toLocaleLowerCase() == "number") {
        valueTemp = Number(value);
    }

    return valueTemp;
}




