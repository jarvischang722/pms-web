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

function operationSaveAdapterClass(postData, session) {
    let lo_params = {
        trans_cod: postData.trans_cod,
        prg_id: postData.prg_id,
        page_id: postData.page_id,
        func_id: postData.func_id,
        oriData: postData.tmpCUD.oriData || [],
        createData: postData.tmpCUD.createData || [],
        updateData: postData.tmpCUD.updateData || [],
        deleteData: postData.tmpCUD.deleteData || [],
        dtOriData: postData.tmpCUD.dt_oriData || [],
        dtCreateData: postData.tmpCUD.dt_createData || [],
        dtUpdateData: postData.tmpCUD.dt_updateData || [],
        dtDeleteData: postData.tmpCUD.dt_deleteData || [],
        saveExecDatas: {},
        exec_seq: 1
    };
    let lo_apiFormat = null;

    this.set_saveExecDatas = function (exec_seq, saveExecDatas) {
        lo_params.saveExecDatas = saveExecDatas || {};
        exec_seq++;
        lo_params.exec_seq = exec_seq || 1;
    };

    // 執行程序
    this.formating = async function () {

        try {
            let lo_rfData = await qryTemplateRfData(lo_params);
            let lo_tmpIdType = chkTmpIdType(lo_rfData);
            lo_tmpIdType = await qryFieldData(lo_rfData, lo_tmpIdType, lo_params, session);
            lo_params = combineDtDeleteExecData(lo_rfData, lo_tmpIdType, lo_params);
            lo_params = await combineMainData(lo_rfData, lo_tmpIdType, lo_params, session);
            lo_params = await combineDtCreateEditExecData(lo_rfData, lo_tmpIdType, lo_params, session);
            lo_params = sortByEventTime(lo_params);
            lo_apiFormat = convertToApiFormat(lo_params, lo_tmpIdType, session);
            return lo_apiFormat;
        }
        catch (err) {
            throw new Error(err);
        }
    };

    /**
     * 取API格式
     * @returns {Object} API格式
     */
    this.getApiFormat = function () {
        return lo_apiFormat;
    };
}

/**
 * 查詢TemplateRf資料
 * @param params {object} 相關參數資料
 */
async function qryTemplateRfData(params) {
    return await mongoAgent.TemplateRf.find({prg_id: params.prg_id, page_id: params.page_id}).exec().then(rfData => {
        return commonTools.mongoDocToObject(rfData);
    }).catch(err => {
        throw new Error(err);
    });
}

/**
 * 判斷template_id 為 多筆、單筆、mn-dt或特殊版型
 * @param rfData {Object} TemplateRf 資料
 */
function chkTmpIdType(rfData) {
    let ln_isDataGridExist = _.findIndex(rfData, {template_id: "datagrid"});
    let ln_isGridSingleExist = _.findIndex(rfData, {template_id: "gridsingle"});
    let ln_isSpecialIsExist = _.findIndex(rfData, {template_id: "special"});
    let ls_mainTableName = "";
    let ls_dgTableName = "";
    let ls_template_id = "";

    if (ln_isDataGridExist != -1 && ln_isGridSingleExist != -1) {
        ls_mainTableName = rfData[ln_isGridSingleExist].table_name;
        ls_dgTableName = rfData[ln_isDataGridExist].table_name;
        ls_template_id = "mn-dt";
    }
    else if (ln_isDataGridExist != -1 && ln_isGridSingleExist == -1) {
        ls_mainTableName = rfData[ln_isDataGridExist].table_name;
        ls_dgTableName = rfData[ln_isDataGridExist].table_name;
        ls_template_id = "datagrid";
    }
    else if (ln_isDataGridExist == -1 && ln_isGridSingleExist != -1) {
        ls_mainTableName = rfData[ln_isGridSingleExist].table_name;
        ls_template_id = "gridsingle";
    }
    else {
        ls_mainTableName = rfData[ln_isSpecialIsExist].table_name;
        ls_template_id = "special";
    }
    let lo_rtnData = {
        mainTableName: ls_mainTableName,
        dgTableName: ls_dgTableName,
        template_id: ls_template_id
    };
    return lo_rtnData;
}

/**
 * 查詢欄位資料
 * @param rfData {object} TemplateRf資料
 * @param tmpIdType {object} 版型、儲存table相關資訊
 * @param params {object} 相關參數資料
 * @param session {object}
 * @returns {Promise<*>}
 */
async function qryFieldData(rfData, tmpIdType, params, session) {

    try {
        let [la_dgFieldsData, la_gsFieldsData] = await Promise.all([
            qryUIDatagridField(),
            qryPageField()
        ]);

        //Mn
        commonTools.handleOperationProcData(params.createData, la_gsFieldsData);
        commonTools.handleOperationProcData(params.deleteData, la_gsFieldsData);
        commonTools.handleOperationProcData(params.updateData, la_gsFieldsData);
        //Dt
        commonTools.handleOperationProcData(params.dtCreateData, la_dgFieldsData);
        commonTools.handleOperationProcData(params.dtDeleteData, la_dgFieldsData);
        commonTools.handleOperationProcData(params.dtUpdateData, la_dgFieldsData);

        if (tmpIdType.template_id == "datagrid") {
            tmpIdType.mainFieldsData = la_dgFieldsData;
        }
        else if (tmpIdType.template_id == "gridsingle") {
            tmpIdType.mainFieldsData = la_gsFieldsData;
        }
        else {
            tmpIdType.mainFieldsData = la_gsFieldsData;
        }

        return tmpIdType;
    }
    catch (err) {
        throw new Error(err);
    }

    async function qryUIDatagridField() {
        if (tmpIdType.template_id == "datagrid" || tmpIdType.template_id == "mn-dt" || tmpIdType.template_id == "special") {
            return await mongoAgent.UIDatagridField.find({
                prg_id: params.prg_id,
                page_id: params.page_id
            }).exec().then(la_dgFieldsData => {
                return commonTools.mongoDocToObject(la_dgFieldsData);
            }).catch(err => {
                throw new Error(err);
            });
        }
        else {
            return [];
        }
    }

    async function qryPageField() {
        if (tmpIdType.template_id == "gridsingle" || tmpIdType.template_id == "mn-dt" || tmpIdType.template_id == "special") {
            return await mongoAgent.UIPageField.find({
                prg_id: params.prg_id,
                page_id: params.page_id
            }).exec().then(la_gsFieldsData => {
                return commonTools.mongoDocToObject(la_gsFieldsData);
            }).catch(err => {
                throw new Error(err);
            });
        }
        else {
            return [];
        }
    }
}

//組合DT 刪除檢查
function combineDtDeleteExecData(rfData, tmpIdType, params) {
    try {
        _.each(params.dtDeleteData, function (data) {
            let ln_tab_page_id = _.isUndefined(data.tab_page_id) ? 1 : data.tab_page_id;
            let ls_dgTableName = _.findWhere(rfData, {
                tab_page_id: Number(ln_tab_page_id),
                template_id: "datagrid"
            }).table_name;

            let lo_fieldsData = qryFieldsDataByTabPageID(data, tmpIdType);
            let tmpDel = {
                "function": "0",
                "table_name": ls_dgTableName,
                "kindOfRel": 'dt',
                event_time: data.event_time
            }; //0 代表刪除
            let mnRowData = data["mnRowData"] || {};
            delete data["mnRowData"];
            tmpDel.condition = [];
            //組合where 條件
            _.each(lo_fieldsData.dgKeyFields, function (keyField) {
                if (!_.isUndefined(data[keyField.ui_field_name])) {
                    tmpDel.condition.push({
                        key: keyField.ui_field_name,
                        operation: "=",
                        value: data[keyField.ui_field_name]
                    });
                }
            });
            params.saveExecDatas[params.exec_seq] = tmpDel;
            params.exec_seq++;
        });
        return params;
    }
    catch (err) {
        throw new Error(err);
    }
}

/**
 * 組合此筆要新增刪除修改的資料
 * @param rfData {object} TemplateRf資料
 * @param params {object} 相關參數資料
 * @param tmpIdType {object} 版型、儲存table相關資訊
 * @param session
 * @returns {Promise<any>}
 */
async function combineMainData(rfData, tmpIdType, params, session) {
    let la_multiLangFields = _.filter(tmpIdType.mainFieldsData, function (field) {
        return field.multi_lang_table != "";
    });  //多語系欄位

    return new Promise((resolve, reject) => {
        async.parallel([
            //新增 0200
            function (callback) {
                if (_.isUndefined(params.createData) || params.createData.length == 0) {
                    return callback(null, '0200');
                }
                _.each(params.createData, function (data) {
                    let lo_fieldsData = qryFieldsDataByTabPageID(data, tmpIdType);
                    let tmpIns = {"function": "1", "table_name": tmpIdType.mainTableName}; //1  新增
                    _.each(Object.keys(data), function (objKey) {
                        if (!_.isUndefined(data[objKey])) {
                            let value = data[objKey];

                            _.each(lo_fieldsData.mainFieldsData, function (row) {
                                if (row.ui_field_name == objKey) {
                                    let finalValue = changeValueFormat4Save(value, row.ui_type);
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
                    params.saveExecDatas[params.exec_seq] = tmpIns;
                    params.exec_seq++;

                    /** 處理每一筆多語系 handleSaveMultiLang **/
                    if (!_.isUndefined(data.multiLang) && data.multiLang.length > 0) {
                        _.each(data.multiLang, function (lo_lang) {
                            let ls_locale = lo_lang.locale || "";
                            _.each(lo_lang, function (langVal, fieldName) {
                                if (fieldName != "locale" && !_.isEmpty(langVal)) {
                                    let langTable = _.findWhere(la_multiLangFields, {ui_field_name: fieldName}).multi_lang_table;
                                    let lo_langTmp = {
                                        function: '1',
                                        table_name: langTable,
                                        locale: ls_locale,
                                        field_name: fieldName,
                                        words: langVal
                                    };
                                    _.each(_.pluck(lo_fieldsData.mainKeyFields, "ui_field_name"), function (keyField) {
                                        if (!_.isUndefined(data[keyField])) {
                                            lo_langTmp[keyField] = typeof data[keyField] === "string"
                                                ? data[keyField].trim() : data[keyField];
                                        }
                                    });
                                    params.saveExecDatas[params.exec_seq] = lo_langTmp;
                                    params.exec_seq++;
                                }
                            });
                        });
                    }

                });

                callback(null, '0200');
            },
            //刪除 0300
            function (callback) {
                if (_.isUndefined(params.deleteData) || params.deleteData.length == 0) {
                    return callback(null, '0300');
                }
                _.each(params.deleteData, function (data) {
                    let lo_fieldsData = qryFieldsDataByTabPageID(data, tmpIdType);
                    let tmpDel = {"function": "0", "table_name": tmpIdType.mainTableName, event_time: data.event_time}; //0 代表刪除
                    data = _.extend(data, commonRule.getEditDefaultDataRule(session));
                    tmpDel.condition = [];
                    //組合where 條件
                    _.each(lo_fieldsData.mainKeyFields, function (keyField) {
                        if (!_.isUndefined(data[keyField.ui_field_name])) {
                            tmpDel.condition.push({
                                key: keyField.ui_field_name,
                                operation: "=",
                                value: data[keyField.ui_field_name]
                            });
                        }

                    });
                    params.saveExecDatas[params.exec_seq] = tmpDel;
                    params.exec_seq++;

                    if (tmpIdType.dgTableName != "") {
                        params = combineDelDetailData(tmpIdType.dgTableName, lo_fieldsData.mainKeyFields, params, data);
                    }
                });
                callback(null, '0300');
            },
            //修改 0400
            function (callback) {
                if (_.isUndefined(params.updateData) || params.updateData.length == 0) {
                    return callback(null, '0400');
                }

                let la_updateFunc = [];
                _.each(params.updateData, function (data, index) {
                    la_updateFunc.push(
                        function (cb) {
                            let lo_fieldsData = qryFieldsDataByTabPageID(data, tmpIdType);
                            let tmpEdit = {"function": "2", "table_name": tmpIdType.mainTableName}; //2  編輯
                            _.each(Object.keys(data), function (objKey) {
                                if(objKey == "route_cod"){
                                    console.log(objKey);
                                }
                                if (!_.isUndefined(data[objKey])) {
                                    tmpEdit[objKey] = data[objKey];

                                    _.each(lo_fieldsData.mainFieldsData, function (row) {
                                        if (row.ui_field_name == objKey) {
                                            let finalValue = changeValueFormat4Save(tmpEdit[objKey], row.ui_type);
                                            tmpEdit[objKey] = finalValue ? finalValue : tmpEdit[objKey];
                                        }
                                    });
                                }
                            });
                            let lo_keysData = {};

                            data = _.extend(data, commonRule.getEditDefaultDataRule(session));
                            tmpEdit = _.extend(tmpEdit, commonRule.getEditDefaultDataRule(session));
                            params.oriData[index] = _.extend(params.oriData[index], commonRule.getEditDefaultDataRule(session));

                            tmpEdit.condition = [];
                            //組合where 條件,判斷是否有舊資料
                            _.each(lo_fieldsData.mainKeyFields, function (keyField) {
                                if (!_.isUndefined(params.oriData[index][keyField.ui_field_name])) {
                                    tmpEdit.condition.push({
                                        key: keyField.ui_field_name,
                                        operation: "=",
                                        value: params.oriData[index][keyField.ui_field_name]
                                    });
                                    lo_keysData[keyField.ui_field_name] = data[keyField.ui_field_name];
                                }

                            });
                            params.saveExecDatas[params.exec_seq] = tmpEdit;
                            params.exec_seq++;

                            /** 處理每一筆多語系 handleSaveMultiLang **/
                            if (!_.isUndefined(data.multiLang) && data.multiLang.length > 0) {
                                let langProcessFunc = [];
                                _.each(data.multiLang, function (lo_lang) {
                                    let ls_locale = lo_lang.locale || "";
                                    langProcessFunc.push(
                                        function (callback) {
                                            let chkFuncs = [];
                                            _.each(lo_lang, function (langVal, fieldName) {
                                                if (fieldName != "locale" && !_.isEmpty(langVal)) {
                                                    chkFuncs.push(
                                                        function (callback) {
                                                            let langTable = _.findWhere(la_multiLangFields, {ui_field_name: fieldName}).multi_lang_table;
                                                            let lo_langTmp = {
                                                                table_name: langTable,
                                                                words: langVal
                                                            };
                                                            let lo_condition = [
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
                                                                }
                                                                else {
                                                                    lo_langTmp["function"] = "1";  //新增;
                                                                    lo_langTmp["locale"] = ls_locale;  //
                                                                    lo_langTmp["field_name"] = fieldName;  //
                                                                    lo_langTmp = _.extend(lo_langTmp, lo_keysData);
                                                                }

                                                                params.saveExecDatas[params.exec_seq] = lo_langTmp;
                                                                params.exec_seq++;

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
                                    params.saveExecDatas[params.exec_seq] = tmpEdit;
                                    params.exec_seq++;
                                    cb(null, '0400');
                                });
                            }
                            else {
                                cb(null, '0400');
                            }
                        }
                    );
                });

                async.parallel(la_updateFunc, function (err, results) {
                    callback(null, '0400');
                });

            }
        ], function (err, result) {
            if (err) {
                reject(err);
            }
            else {
                resolve(params);
            }

        });
    });
}

/**
 * 組合DT 新增修改執行資料
 * @param rfData {object} TemplateRf資料
 * @param params {object} 相關參數資料
 * @param tmpIdType {object} 版型、儲存table相關資訊
 * @param session
 * @returns {*}
 */
async function combineDtCreateEditExecData(rfData, tmpIdTyp, params, session) {
    //多語系欄位
    let la_dtMultiLangFields = _.filter(tmpIdTyp.dgFieldsData, function (field) {
        return field.multi_lang_table != "";
    });

    try {
        //dt 新增
        _.each(params.dtCreateData, function (data) {
            let ln_tab_page_id = _.isUndefined(data.tab_page_id) ? 1 : data.tab_page_id;
            let ls_dgTableName = _.findWhere(rfData, {
                tab_page_id: Number(ln_tab_page_id),
                template_id: "datagrid"
            }).table_name;
            let lo_fieldsData = qryFieldsDataByTabPageID(data, tmpIdTyp);
            let tmpIns = {"function": "1", "table_name": ls_dgTableName, "kindOfRel": "dt"}; //1  新增
            let mnRowData = data["mnRowData"] || {};
            delete data["mnRowData"];

            _.each(Object.keys(data), function (objKey) {
                if (!_.isUndefined(data[objKey])) {
                    let value = data[objKey];
                    if (typeof data[objKey] === 'string') {
                        data[objKey] = data[objKey].trim();
                    }
                    tmpIns[objKey] = value;
                }
            });

            let lo_default = commonRule.getCreateCommonDefaultDataRule(session);
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
            params.saveExecDatas[params.exec_seq] = tmpIns;
            params.exec_seq++;

            /** 處理每一筆多語系 handleSaveMultiLang **/
            if (!_.isUndefined(data.multiLang) && data.multiLang.length > 0) {
                _.each(data.multiLang, function (lo_lang) {
                    let ls_locale = lo_lang.locale || "";
                    _.each(lo_lang, function (langVal, fieldName) {
                        if (fieldName != "locale" && fieldName != "display_locale" && !_.isEmpty(langVal)) {
                            let langTable = _.findWhere(la_dtMultiLangFields, {ui_field_name: fieldName}).multi_lang_table;
                            let lo_langTmp = {
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
                            params.saveExecDatas[params.exec_seq] = lo_langTmp;
                            params.exec_seq++;
                        }
                    });
                });
            }
        });

        //dt 編輯
        let la_dtUpdateData = [];
        _.each(params.dtUpdateData, function (data, index) {
            la_dtUpdateData.push(
                function (callback) {
                    let ln_tab_page_id = _.isUndefined(data.tab_page_id) ? 1 : data.tab_page_id;
                    let ls_dgTableName = _.findWhere(rfData, {
                        tab_page_id: Number(ln_tab_page_id),
                        template_id: "datagrid"
                    }).table_name;
                    let lo_fieldsData = qryFieldsDataByTabPageID(data, tmpIdTyp);
                    let tmpEdit = {"function": "2", "table_name": ls_dgTableName, "kindOfRel": "dt"}; //2  編輯
                    let mnRowData = data["mnRowData"] || {};
                    delete data["mnRowData"];

                    _.each(Object.keys(data), function (objKey) {
                        let objValue = data[objKey];
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

                    let lo_default = commonRule.getEditDefaultDataRule(session);
                    if (!_.isUndefined(data.hotel_cod) && data.hotel_cod.trim() != "") {
                        delete lo_default["hotel_cod"];
                    }
                    data = _.extend(data, lo_default);
                    tmpEdit = _.extend(tmpEdit, lo_default);
                    params.dtOriData[index] = _.extend(params.dtOriData[index], lo_default);

                    tmpEdit.condition = [];
                    //組合where 條件
                    _.each(lo_fieldsData.dgKeyFields, function (keyField) {
                        if (!_.isUndefined(params.dtOriData[index][keyField.ui_field_name])) {
                            tmpEdit.condition.push({
                                key: keyField.ui_field_name,
                                operation: "=",
                                value: params.dtOriData[index][keyField.ui_field_name]
                            });
                        }
                    });
                    params.saveExecDatas[params.exec_seq] = tmpEdit;
                    params.exec_seq++;

                    /** 處理每一筆多語系 handleSaveMultiLang **/
                    if (!_.isUndefined(data.multiLang) && data.multiLang.length > 0) {
                        let langProcessFunc = [];
                        _.each(data.multiLang, function (lo_lang) {
                            let ls_locale = lo_lang.locale || "";
                            langProcessFunc.push(
                                function (cb) {
                                    let chkFuncs = [];
                                    _.each(lo_lang, function (langVal, fieldName) {
                                        if (fieldName != "locale" && fieldName != "display_locale" && !_.isEmpty(langVal)) {
                                            chkFuncs.push(
                                                function (callback) {
                                                    let langTable = _.findWhere(la_dtMultiLangFields, {ui_field_name: fieldName}).multi_lang_table;
                                                    let lo_langTmp = {
                                                        table_name: langTable,
                                                        words: langVal
                                                    };
                                                    let lo_condition = [
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
                                                    let lo_keysData = {};
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

                                                        params.saveExecDatas[params.exec_seq] = lo_langTmp;
                                                        params.exec_seq++;

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
                        callback(null, '0400');
                    }
                });
        });

        if (params.dtUpdateData.length == 0) {
            return params;
        }
        else{
            return new Promise((resolve, reject) => {
                async.parallel(la_dtUpdateData, function (err, result) {
                    if(err) reject(err);
                    else resolve(params);
                });
            });
        }
    }
    catch (err) {
        throw new Error(err);
    }

}

/**
 * 依事件時間(event_time)調整儲存順序
 * @param params {object} 相關參數資料
 * @returns {*}
 */
function sortByEventTime(params) {
    let lo_reformatExecDatas = {};
    let lo_saveExecDatasSorted = _.sortBy(_.values(params.saveExecDatas), function (lo_saveExecData) {
        return moment(new Date(lo_saveExecData.event_time)).format("YYYY/MM/DD HH:mm:ss");
    });

    _.each(lo_saveExecDatasSorted, function (lo_data, index) {
        index++;
        lo_reformatExecDatas[index] = lo_data;
    });
    params.saveExecDatas = JSON.parse(JSON.stringify(lo_reformatExecDatas));
    return params;
}

/**
 * 轉換為API格式
 * @param params {object} 相關參數資料
 * @param tmpIdType {object} 版型、儲存table相關資訊
 * @param session
 * @returns {{"REVE-CODE": string|*|string, program_id: string|string, func_id: string, athena_id: number, hotel_cod: string, user: *|string|usr_id|{type, trim, required}, table_name: *|string|string|string|string|string, count: number, exec_data: any | *}}
 */
function convertToApiFormat(params, tmpIdType, session) {
    let lo_apiParams = {
        "REVE-CODE": params.trans_cod,
        "program_id": params.prg_id,
        "func_id": params.func_id || "",
        "athena_id": session.user.athena_id,
        "hotel_cod": session.user.hotel_cod,
        "user": session.user.usr_id,
        "table_name": tmpIdType.mainTableName,
        "count": Object.keys(params.saveExecDatas).length,
        "exec_data": params.saveExecDatas
    };
    return lo_apiParams;
}

//region //func area
/**
 * 將儲存或修改的欄位格式做轉換
 * @param value
 * @param ui_type
 * @returns {*}
 */
function changeValueFormat4Save(value, ui_type) {
    let valueTemp;

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

/**
 * 組要刪除的dt資料
 * @param dtTableName
 * @param la_dtkeyFields
 * @param params
 * @param mnData
 * @returns {*}
 */
function combineDelDetailData(dtTableName, la_dtkeyFields, params, mnData) {
    let ls_event_time = moment(new Date(mnData.event_time)).subtract("1", "seconds").format("YYYY/MM/DD HH:mm:ss");
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
    params.saveExecDatas[params.exec_seq] = tmpDel;
    params.exec_seq++;
    return params;
}

//endregion

/**
 * 由tab_page_id找欄位及欄位為keyable
 * @param data {object} 新刪修資料
 * @param tmpIdType {object} 版型、儲存table相關資訊
 * @returns {{mainFieldsData, mainKeyFields, dgFieldsData, dgKeyFields}}
 */
function qryFieldsDataByTabPageID(data, tmpIdType) {
    let ln_tab_page_id = Number(data.tab_page_id) || 1;
    let la_mainFieldsData = _.where(tmpIdType.mainFieldsData, {tab_page_id: ln_tab_page_id}) || tmpIdType.mainFieldsData;
    let la_mainKeyFields = _.where(la_mainFieldsData, {keyable: "Y"}) || [];
    let la_dgFieldsData = _.where(tmpIdType.dgFieldsData, {tab_page_id: ln_tab_page_id}) || tmpIdType.dgFieldsData;
    let la_dgKeyFields = _.where(la_dgFieldsData, {keyable: "Y"}) || [];
    _.each(la_dgKeyFields, (lo_dgKeyFields, index) => {
        _.each(lo_dgKeyFields, (val, key) => {
            if (key == 'ui_field_name') {
                let la_keySplit = val.split(".");
                let ls_field_name = la_keySplit[1];
                if (!_.isUndefined(ls_field_name)) {
                    la_dgKeyFields[index][key] = ls_field_name;
                }
            }
        });
    });
    let rtnData = {
        mainFieldsData: _.clone(la_mainFieldsData),
        mainKeyFields: _.clone(la_mainKeyFields),
        dgFieldsData: _.clone(la_dgFieldsData),
        dgKeyFields: _.clone(la_dgKeyFields)
    };

    return rtnData;
}

module.exports = operationSaveAdapterClass;