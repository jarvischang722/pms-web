/**
 * Created by kaiyue on 2017/11/15.
 */

const path = require('path');
const moment = require("moment");
const _ = require("underscore");
const async = require("async");

const appRootDir = path.dirname(require.main.filename);
const ruleAgent = require(appRootDir + "/ruleEngine/ruleAgent");
const queryAgent = require(appRootDir + "/plugins/kplug-oracle/QueryAgent");
const mongoAgent = require(appRootDir + "/plugins/mongodb");
const sysConfig = require(appRootDir + "/configs/systemConfig");
const tools = require(appRootDir + "/utils/CommonTools");
const dataRuleSvc = require(appRootDir + "/services/DataRuleService");
const fieldAttrSvc = require(appRootDir + "/services/FieldsAttrService");
const langSvc = require(appRootDir + "/services/LangService");

let go_session;
let go_searchCond;
let gs_prg_id;
let gn_page_id;

// 多筆流程
function DataGridProcModule(postData, session) {
    let self = this;
    gn_page_id = postData.page_id || 1;
    go_session = session;
    gs_prg_id = postData.prg_id;
    go_searchCond = postData.searchCond || {}; //搜尋條件

    /**
     * 查詢欄位資料
     * @param callback
     */
    this.fetchFieldData = function (callback) {
        async.waterfall([
            qryUIDatagridField,     //取多筆欄位資料
            qryLangUIField,         //欄位多語系
            qrySelectOption,        //查詢SelectOption
            qrySearchField          //取搜尋欄位
        ], function (err, result) {
            callback(err, result);
        });
    };

    /**
     * 查詢oracle資料
     * @param callback
     */
    this.fetchRowData = function (callback) {
        async.waterfall([
            qryTemplateRf,     //查詢templateRf
            qryRowData,        //查詢多筆資料
            filterRowData,          //依條件過濾多筆資料
            rowDataMultiLang        //內容多語系
        ], function (err, result) {
            callback(err, result);
        });
    };
}

/**
 * 查詢templateRf
 */
function qryTemplateRf(callback) {
    mongoAgent.TemplateRf.findOne({
        prg_id: gs_prg_id,
        page_id: gn_page_id
    }, function (err, result) {
        callback(err, result);
    });
};

/**
 * 查詢多筆資料
 */
function qryRowData(lo_rfData, callback) {
    let lo_params = filterSearchCond();
    let ls_rule_func_name = lo_rfData.rule_func_name;
    queryAgent.queryList(ls_rule_func_name.toLocaleUpperCase(), lo_params, 0, 0, function (err, result) {
        callback(err, result);
    });
};


/**
 * 取多筆欄位資料
 * @param lo_params {object} 查詢條件
 * @param callback
 */
function qryUIDatagridField(callback) {
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
};

/**
 * 欄位多語系
 * @param lo_params {object} 查詢多語系條件
 * @param la_dgFieldData {array} 所有多筆欄位資料
 * @param callback
 */
function qryLangUIField(la_dgFieldData, callback) {
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
};

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
};

/**
 * 查詢搜尋欄位
 * @param la_dgFieldData {array} 所有多筆欄位資料
 * @param callback
 */
function qrySearchField(la_dgFieldData, callback) {
    fieldAttrSvc.getAllUIPageFieldAttr({
        prg_id: gs_prg_id,
        page_id: 3,
        locale: go_session.locale
    }, go_session.user, function (err, fields) {
        let lo_rtnData = {
            searchFields: fields,
            dgFieldsData: la_dgFieldData
        };
        callback(null, lo_rtnData);
    });
};

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
};

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
};

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
};

/**
 * 多筆資料多語系
 * @param la_dgRowData {array} 多筆資料
 * @param callback
 */
function rowDataMultiLang(la_dgRowData, callback) {
    langSvc.handleMultiDataLangConv(la_dgRowData, gs_prg_id, gn_page_id, go_session.locale, function (err, Rows) {
        callback(null, Rows);
    });
};

module.exports = DataGridProcModule;