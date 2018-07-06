/**
 * Created by kaiyue on 2017/11/15.
 */
const _ = require("underscore");
const _s = require("underscore.string");
const async = require("async");

const ruleAgent = require("../../ruleEngine/ruleAgent");
const queryAgent = require("../../plugins/kplug-oracle/QueryAgent");
const mongoAgent = require("../../plugins/mongodb");
const tools = require("../../utils/CommonTools");
const dataRuleSvc = require("../../services/DataRuleService");
const fieldAttrSvc = require("../../services/FieldsAttrService");
const langSvc = require("../../services/LangService");
const db = require("../../plugins/kplug-oracle/DB.js");

// 多筆流程
exports.DataGridProc = function (postData, session) {
    let ls_prg_id = postData.prg_id;
    let ln_page_id = postData.page_id || 1;
    let ln_tab_page_id = postData.tab_page_id || 1;
    let ls_template_id = postData.template_id || "";
    let lo_searchCond = postData.searchCond || {}; //搜尋條件

    let lo_params = {
        prg_id: ls_prg_id,
        page_id: ln_page_id,
        tab_page_id: ln_tab_page_id,
        template_id: ls_template_id == "" ? "datagrid" : ls_template_id,
        searchCond: lo_searchCond
    };
    /**
     * 查詢欄位資料
     * @param callback
     */
    this.fetchDgFieldsData = async function () {
        try {
            let la_dgFieldData = await qryUIDatagridFields(lo_params, session);
            la_dgFieldData = await qryFormatRule(la_dgFieldData, lo_params, session);
            la_dgFieldData = await qryLangUIFields(la_dgFieldData, lo_params, session);
            la_dgFieldData = await qrySelectOption(la_dgFieldData, lo_params, session);
            la_dgFieldData = await qrySearchFields(la_dgFieldData, lo_params, session);

            return la_dgFieldData;
        }
        catch (err) {
            throw new Error(err);
        }
    };

    /**
     * 查詢oracle資料
     * @param callback
     */
    this.fetchDgRowData = async function () {
        try {
            let lo_rfData = await qryDgTemplateRf(lo_params, session);                  //查詢templateRf
            let la_dgRowData = await qryRowData(lo_rfData, lo_params, session);         //查詢多筆資料
            la_dgRowData = await filterRowData(la_dgRowData, lo_params, session);       //依條件過濾多筆資料
            la_dgRowData = await rowDataMultiLang(la_dgRowData, lo_params, session);    //內容多語系
            return la_dgRowData;
        }
        catch (err) {
            throw new Error(err);
        }
    };

    /**
     * 取多筆 資料
     * @param callback
     */
    this.fetchDgData = async function () {
        let fetchFieldsResult, fetchRowsResult;
        try {
            [fetchFieldsResult, fetchRowsResult] = await Promise.all([
                this.fetchDgFieldsData(),     //取多筆欄位資料
                this.fetchDgRowData(),        //取多筆欄位資料
            ]);
            let lo_rtnData = {
                searchFields: fetchFieldsResult.searchFields,
                dgFieldsData: fetchFieldsResult.dgFieldsData,
                dgRowData: fetchRowsResult
            };
            return lo_rtnData;
        }
        catch (err) {
            if (err == "templateRf is null") {
                err = null;
                return {
                    searchFields: fetchFieldsResult.searchFields,
                    dgFieldsData: fetchFieldsResult.dgFieldsData,
                    dgRowData: []
                }
            }
        }
    };
};

// 單筆流程
exports.GridSingleProc = function (postData, session) {
    let lo_params = {
        prg_id: postData.prg_id,
        page_id: postData.page_id || 2,
        tab_page_id: postData.tab_page_id || 1,
        searchCond: postData.searchCond || {},
        template_id: postData.template_id || ""
    };

    /**
     * 查詢單筆mn欄位資料
     * @param callback
     */
    this.fetchGsMnFieldsData = async function () {

        try {
            let la_gsFieldsData = await qryUIPageFields(lo_params, session);
            la_gsFieldsData = await qrySelectOption(la_gsFieldsData, lo_params, session);
            la_gsFieldsData = await qryFormatRule(la_gsFieldsData, lo_params, session);
            la_gsFieldsData = await qryLangUIFields(la_gsFieldsData, lo_params, session);
            return la_gsFieldsData;
        }
        catch (err) {
            throw new Error(err);
        }
    };

    /**
     * 查詢單筆mn oracle資料
     * @param callback
     */
    this.fetchGsMnRowData = async function () {

        try {
            let lo_rfData = await qryGsTemplateRf(lo_params, session);
            let la_gsRowData = await qryRowData(lo_rfData, lo_params, session);
            la_gsRowData = await filterRowData(la_gsRowData, lo_params, session);
            la_gsRowData = await rowDataMultiLang(la_gsRowData, lo_params, session);
            return la_gsRowData;
        }
        catch (err) {
            throw new Error(err);
        }
    };

    /**
     * 查詢預設單筆mn oracle資料
     * @param callback
     */
    this.fetchDefaultMnRowData = async function () {

        try {
            let lo_initField = {};
            let [la_fieldNameList, la_selectData] = await Promise.all([
                qryFieldName(lo_params, session),
                qrySelectData(lo_params, session)
            ]);

            _.each(la_fieldNameList, function (ls_fieldName) {
                if (_s.include(ls_fieldName, "athena_id")) {
                    lo_initField[ls_fieldName] = session.user.athena_id;
                }
                else if (_s.include(ls_fieldName, "hotel_cod")) {
                    lo_initField[ls_fieldName] = session.user.hotel_cod;
                }
                else {
                    lo_initField[ls_fieldName] = "";
                }
            });

            return new Promise((resolve, reject) => {
                mongoAgent.PrgFunction.findOne({
                    prg_id: lo_params.prg_id,
                    func_id: '0200',
                    page_id: lo_params.page_id,
                    tab_page_id: lo_params.tab_page_id,
                    template_id: lo_params.template_id == "" ? "gridsingle" : lo_params.template_id
                }, function (err, func) {
                    if (err) {
                        reject(err);
                    }
                    if (func) {
                        func = tools.mongoDocToObject(func);
                    }
                    if (!err && func && !_.isEmpty(func.rule_func_name) && !_.isUndefined(ruleAgent[func.rule_func_name])) {
                        ruleAgent[func.rule_func_name](postData, session, function (err, result) {
                            if (err) reject(err);
                            //取typeSelect的預設值
                            _.each(la_selectData, function (value, index) {
                                if (value.defaultVal != "") {
                                    result.defaultValues[value.ui_field_name] = value.defaultVal;
                                }
                            });
                            //FENG LOOK PART
                            result.defaultValues = _.extend(lo_initField, result.defaultValues);
                            resolve(result);
                        });
                    }
                    else {
                        //取typeSelect的預設值
                        let result = {};
                        _.each(la_selectData, function (value, index) {
                            if (value.defaultVal != "") {
                                result[value.ui_field_name] = value.defaultVal;
                            }
                        });

                        result = _.extend(lo_initField, result);
                        resolve({success: true, defaultValues: result});
                    }
                });
            });
        }
        catch (err) {
            throw new Error(err);
        }
    };

    /**
     * 取單筆mn 資料
     * @param callback
     */
    this.fetchGsMnData = async function () {

        try {
            let [la_pageField, la_rowData] = await Promise.all([
                this.fetchGsMnFieldsData(),
                this.fetchGsMnRowData()
            ]);
            if (la_rowData.length == 0) {
                throw "data err";
            }
            else {
                dataValueChange(la_pageField, la_rowData[0]);
            }
            let lo_gsMnData = {
                fieldsData: la_pageField,
                rowData: la_rowData
            };
            return lo_gsMnData;
        }
        catch (err) {
            throw new Error(err);
        }
    };

};

// 取搜尋欄位資料(page_id: 3)
exports.qrySearchFields = async function (postData, session) {
    let lo_params = {
        prg_id: postData.prg_id,
        page_id: 3,
    };

    try {
        let la_fields = await qrySearchFieldsAttr(lo_params, session);
        return la_fields;
    }
    catch (err) {
        throw new Error(err);
    }
};

/**
 * 查詢單筆欄位名稱
 **/
async function qryFieldName(params, session) {
    let lo_params = {
        prg_id: params.prg_id,
        page_id: Number(params.page_id),
        tab_page_id: Number(params.tab_page_id),
        template_id: params.template_id == "" ? "gridsingle" : params.template_id
    };

    return await mongoAgent.UIPageField.find(lo_params).exec().then((fieldNameList) => {
        return _.pluck(fieldNameList, "ui_field_name");
    }).catch((err) => {
        throw new Error(err);
    });
}

/**
 * 查詢單筆下拉欄位資料
 **/
async function qrySelectData(params, session) {
    let lo_params = {
        prg_id: params.prg_id,
        page_id: Number(params.page_id),
        tab_page_id: Number(params.tab_page_id),
        template_id: params.template_id == "" ? "gridsingle" : params.template_id
    };

    return await mongoAgent.UITypeSelect.find(lo_params).exec().then((selectData) => {
        return tools.mongoDocToObject(selectData);
    }).catch(err => {
        throw new Error(err);
    });
}

/**
 * 查詢多筆templateRf
 **/
async function qryDgTemplateRf(params, session) {
    let lo_params = {
        prg_id: params.prg_id,
        page_id: Number(params.page_id),
        tab_page_id: Number(params.tab_page_id),
        template_id: 'datagrid'
    };

    // return new Promise((resolve, reject) => {
    return await mongoAgent.TemplateRf.findOne(lo_params).exec().then((result) => {
        if (!result) {
            throw new Error("templateRf is null");
        }
        else {
            return tools.mongoDocToObject(result);
        }
    }).catch((err) => {
        throw new Error(err);
    });
}

/**
 * 查詢多筆templateRf
 */
async function qryGsTemplateRf(params, session) {
    let lo_params = {
        prg_id: params.prg_id,
        page_id: Number(params.page_id),
        tab_page_id: Number(params.tab_page_id),
        template_id: params.template_id == "" ? "gridsingle" : params.template_id
    };

    let result = await mongoAgent.TemplateRf.findOne(lo_params).exec().then((result) => {
        return tools.mongoDocToObject(result);
    }).catch((err) => {
        throw new Error(err);
    });
    return result;
}

/**
 * 查詢多筆資料
 */
async function qryRowData(lo_rfData, params, session) {
    let lo_params = filterSearchCond(params, session);;
    let ls_rule_func_name = lo_rfData.rule_func_name

    return new Promise((resolve, reject) => {
        queryAgent.queryList(ls_rule_func_name.toLocaleUpperCase(), lo_params, 0, 0, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}

/**
 * 取多筆欄位資料
 * @param lo_params {object} 查詢條件
 * @param callback
 */
async function qryUIDatagridFields(params, session) {
    //抓使用者及預設欄位
    let lo_params = {
        $or: [
            {user_id: ""},
            {user_id: session.user.usr_id}
        ],
        prg_id: params.prg_id,
        page_id: Number(params.page_id),
        tab_page_id: Number(params.tab_page_id)
    };
    let la_fieldData = [];
    return new Promise((resolve, reject) => {
        mongoAgent.UIDatagridField.find(lo_params).sort({col_seq: 1}).select({_id: 0}).exec(function (err, dgFieldData) {
            if (err) {
                reject(err);
            }
            else if (!dgFieldData) {
                err = "uiDatagridFields is null";
                reject(err);
            }
            else {
                la_fieldData = tools.mongoDocToObject(dgFieldData);
                //過濾使用者欄位
                let la_userFieldData = _.filter(la_fieldData, function (lo_fieldData) {
                    return lo_fieldData.user_id != "";
                });

                if (la_userFieldData.length != 0) {
                    la_fieldData = la_userFieldData;
                }
                resolve(la_fieldData);
            }
        });
    });
}

/**
 * 取單筆欄位資料
 */
async function qryUIPageFields(params, session) {

    return new Promise((resolve, reject) => {
        mongoAgent.UIPageField.find({
            prg_id: params.prg_id,
            page_id: Number(params.page_id),
            tab_page_id: Number(params.tab_page_id),
            template_id: params.template_id == "" ? "gridsingle" : params.template_id
        }, function (err, result) {
            if (err) {
                err = "uiPageFields is null";
                reject(err);
            }
            else {
                let la_gsFieldsData = tools.mongoDocToObject(result);
                resolve(la_gsFieldsData);
            }
        });
    });
}

/**
 * format_func_name轉換成 object
 * @param la_fieldData{array}所有欄位資料
 * @param callback
 */
async function qryFormatRule(la_fieldData, params, session) {
    let ln_counter = 0;
    if (la_fieldData.length == 0) {
        return la_fieldData;
    }
    return await _.each(la_fieldData, async function (lo_fieldData) {
        let lo_format = {
            rule_name: "",
            rule_val: "",
            validate: ""
        };

        let ls_formatFuncName = _.clone(lo_fieldData["format_func_name"]);
        lo_fieldData["format_func_name"] = lo_format;

        try {
            if (ls_formatFuncName.indexOf(",") > -1) {
                let la_formatFuncName = ls_formatFuncName.split(",");
                for (let i = 1; i < la_formatFuncName.length; i++) {
                    lo_fieldData["format_func_name"].validate = lo_format.validate + "," + la_formatFuncName[i];
                }
                await qryOracleFormat(la_formatFuncName[0]);
            }
            else {
                await qryOracleFormat(ls_formatFuncName);
            }
            ln_counter++;
            if (ln_counter == la_fieldData.length) {
                return la_fieldData;
            }
        }
        catch (err) {
            return err;
        }


        /**
         * 去oracle撈format參數
         * @param ls_formatName{string} format 的名稱
         */
        async function qryOracleFormat(ls_formatName) {

            let daoBean = ls_formatName != "" ? db.loadDao({dao: ls_formatName.toUpperCase(), id: 'default'}) : null;
            return new Promise((resolve, reject) => {
                if (daoBean != null) {
                    queryAgent.query(ls_formatName.toUpperCase(), {athena_id: session.user.athena_id}, function (err, result) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            lo_fieldData["format_func_name"].rule_name = ls_formatFuncName;
                            lo_fieldData["format_func_name"].rule_val = result.format_val;
                            resolve(lo_fieldData);
                        }
                    });
                }
                else {
                    lo_fieldData["format_func_name"].validate = ls_formatFuncName;
                    resolve(lo_fieldData);
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
async function qryLangUIFields(la_dgFieldData, params, session) {
    let lo_params = {
        prg_id: params.prg_id,
        page_id: Number(params.page_id)
    };
    await mongoAgent.LangUIField.find(lo_params).exec(function (err, fieldLang) {
        fieldLang = tools.mongoDocToObject(fieldLang);
        _.each(la_dgFieldData, function (lo_dgFieldData, fIdx) {
            let tmpLang = _.findWhere(fieldLang, {ui_field_name: lo_dgFieldData["ui_field_name"].toLowerCase()});
            if (tmpLang) {
                la_dgFieldData[fIdx]["ui_display_name"] = tmpLang["ui_display_name_" + session.locale] != ""
                    ? tmpLang["ui_display_name_" + session.locale]
                    : tmpLang["ui_display_name_zh_TW"] ? tmpLang["ui_display_name_zh_TW"] + '(' + session.locale + ')' : '';

                la_dgFieldData[fIdx]["ui_hint"] = tmpLang["ui_display_name_" + session.locale] || "";
            }
        });
    });
    return la_dgFieldData;
}

/**
 * 查詢下拉Option
 * @param la_dgFieldData {array} 所有多筆欄位資料
 * @param callback
 */
async function qrySelectOption(la_dgFieldData, params, session) {
    let la_asyncParaFunc = [];
    _.each(la_dgFieldData, function (lo_dgField, fIdx) {
        if (lo_dgField.ui_type == 'select' || lo_dgField.ui_type == 'multiselect' || lo_dgField.ui_type == 'checkbox' || lo_dgField.ui_type == 'selectgrid') {

            //讀取selectgrid的設定參數
            // if (lo_dgField.ui_type == 'selectgrid') {
            //     var func_name = gs_prg_id + '_' + lo_dgField.ui_field_name;
            //     la_dgFieldData[fIdx].selectGridOptions = ruleAgent[func_name]();
            // }
            genAsyncParaFunc(la_dgFieldData, fIdx);
        }
        else if (_.isEqual(lo_dgField.ui_type, "tree") || _.isEqual(lo_dgField.ui_type, "multitree")) {
            la_asyncParaFunc.push(
                function (cb) {
                    la_dgFieldData[fIdx].selectData = [];
                    ruleAgent[lo_dgField.rule_func_name](lo_dgField, session.user, function (err, result) {
                        la_dgFieldData[fIdx].selectData = result.selectOptions;
                        cb(null, la_dgFieldData[fIdx]);
                    });
                }
            );
        }
        chkDgFieldIsC(la_dgFieldData, fIdx);
    });

    return new Promise((resolve, reject) => {
        async.parallel(la_asyncParaFunc, function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(la_dgFieldData);
            }
        });
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
                    prg_id: params.prg_id,
                    page_id: Number(params.page_id),
                    ui_field_name: lo_dgField.ui_field_name
                }).exec(function (err, selRow) {
                    la_dgFieldData[fIdx].selectData = [];
                    if (selRow) {
                        selRow = selRow.toObject();
                        la_dgFieldData[fIdx].ds_from_sql = selRow.ds_from_sql || "";
                        la_dgFieldData[fIdx].referiable = selRow.referiable || "N";
                        la_dgFieldData[fIdx].defaultVal = selRow.defaultVal || "";

                        if (la_dgFieldData[fIdx].ui_type == "selectgrid" || la_dgFieldData[fIdx].ui_type == "multiselectgrid") {
                            dataRuleSvc.getSelectGridOption(session, selRow, la_dgFieldData[fIdx], function (err, selectData) {
                                la_dgFieldData[fIdx].selectData = selectData;
                                cb(err, {ui_field_idx: fIdx, ui_field_name: lo_dgField.ui_field_name});
                            });
                        }
                        else {
                            dataRuleSvc.getSelectOptions(session, selRow, la_dgFieldData[fIdx], function (selectData) {
                                la_dgFieldData[fIdx].selectDataDisplay = selectData.selectDataDisplay;
                                la_dgFieldData[fIdx].selectData =
                                    selectData.selectData.length == 0 ? selectData.selectDataDisplay : selectData.selectData;
                                cb(null, {ui_field_idx: fIdx, ui_field_name: lo_dgField.ui_field_name});
                            });
                        }
                    }
                    else {
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
                            ruleAgent[ls_attrName](lo_dgField, session.user, function (err, result) {
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
async function qrySearchFields(la_dgFieldData, params, session) {
    try {
        let la_allPageFields = await qrySearchFieldsAttr(params, session);
        let la_fieldData = await qryFormatRule(la_allPageFields, params, session);

        return {
            searchFields: la_fieldData,
            dgFieldsData: la_dgFieldData
        };
    }
    catch (err) {
        return err;
    }
}

async function qrySearchFieldsAttr(params, session) {
    return new Promise((resolve, reject) => {
        fieldAttrSvc.getAllUIPageFieldAttr({
            prg_id: params.prg_id,
            page_id: 3,
            locale: session.locale
        }, session, function (err, fields) {
            if (err) {
                reject(err);
            }
            else {
                resolve(fields);
            }
        });
    })

}

/**
 * 過濾掉無效條件
 * @returns {{user_id: (string|*), athena_id, hotel_cod: (*|string|string)}}
 */
function filterSearchCond(params, session) {
    let lo_params = {
        user_id: session.user.usr_id,
        athena_id: session.user.athena_id,
        hotel_cod: session.user.fun_hotel_cod
    };
    _.each(params.searchCond, function (condVal, condKey) {
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
async function filterRowData(la_dgRowData, params, session) {
    let lo_params = {
        user_id: session.user.usr_id,
        athena_id: session.user.athena_id,
        hotel_cod: session.user.fun_hotel_cod
    };
    let ls_ruleFilterName = params.prg_id + "Filter";
    return new Promise((resolve, reject) => {
        if (!_.isUndefined(ruleAgent[ls_ruleFilterName])) {
            ruleAgent[ls_ruleFilterName](la_dgRowData, session, lo_params, function (dataRow) {
                resolve(dataRow);
            });
        } else {
            resolve(la_dgRowData);
        }
    });

}

/**
 * 多筆資料多語系
 * @param la_dgRowData {array} 多筆資料
 * @param callback
 */
async function rowDataMultiLang(la_dgRowData, params, session) {
    return new Promise((resolve, reject) => {
        if (la_dgRowData.length > 0) {
            if (params.template_id == "datagrid") {
                langSvc.handleMultiDataLangConv(la_dgRowData, params.prg_id, params.page_id, session.locale, function (err, Rows) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(Rows);
                    }
                });
            }
            else {
                langSvc["handleSingleDataLangConv"](la_dgRowData[0], params.prg_id, params.page_id, session.locale, function (err, Rows) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve([Rows]);
                    }
                });
            }
        }
        else {
            resolve(la_dgRowData)
        }

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
    return data;
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




