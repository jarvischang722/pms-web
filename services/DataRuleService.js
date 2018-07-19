/**
 * Created by Jun Chang on 2017/2/15.
 */

let moment = require("moment");
let queryAgent = require('../plugins/kplug-oracle/QueryAgent');
let mongoAgent = require("../plugins/mongodb");
let ruleAgent = require("../ruleEngine/ruleAgent");
let commonRule = require("../ruleEngine/rules/CommonRule");
let commonTools = require("../utils/CommonTools");
let _ = require("underscore");
let async = require("async");
let ReturnClass = require("../ruleEngine/returnClass");
let ErrorClass = require("../ruleEngine/errorClass");


/**
 * 取得user athena id
 * @param session
 * @returns {*|string}
 * @constructor
 */
exports.GET_SESSION_USER_ATHENA_ID = function (session) {
    return session.user["user_athena_id"] || "";
};

/**
 * 取得athena id
 * @param session
 * @returns {*|string}
 * @constructor
 */
exports.GET_SESSION_ATHENA_ID = function (session) {
    return session.user["athena_id"] || "";
};

/**
 * 取得所在館別的hotel_cod
 * @param session
 * @returns {*|string}
 * @constructor
 */
exports.GET_SESSION_HOTEL_COD = function (session) {
    return session.user["fun_hotel_cod"] || "";
};


/**
 * 取得使用者代號
 * @param session
 * @returns {*|string}
 * @constructor
 */
exports.GET_SESSION_LOGIN_USER = function (session) {
    return session.user["usr_id"] || "";
};


/**
 * 取得系統時間
 * @returns {*|string}
 * @constructor
 */
exports.GET_SESSION_SYSTEM_DATE = function () {
    return moment().format("YYYY/MM/DD HH:mm:ss");
};

/**
 *
 * @param sql_tag
 * @constructor
 */
exports.qrySelectOptionsFromSQL = function (userInfo, sql_tag, callback) {
    queryAgent.queryList(sql_tag, userInfo, 0, 0, function (selData) {
        callback(selData);
    });
};

/**
 * 取得Select options值
 * @param session
 * @param typeSelectField
 * @param field
 * @param callback
 * @constructor
 */
exports.getSelectOptions = async function (session, typeSelectField, field, callback) {
    let lo_selectData = {
        selectDataDisplay: [],
        selectData: []
    };

    if (typeSelectField.referiable == "Y") {
        callback(lo_selectData);
        return;
    }

    //下拉資料來源為sql
    if (typeSelectField.ds_from_sql == "Y") {
        let sql_tag = typeSelectField.rule_func_name.toUpperCase();

        try {
            //1.取下拉顯示資料(全部資料)
            let la_displayData = await qrySelectOptionDisplayData();
            //2.分版本
            let la_editionOption = await this.handleRuleExtendFunc(la_displayData, session, typeSelectField);
            //3.過濾下拉資料
            let la_selectData = await filterSelectOption(la_editionOption);

            lo_selectData.selectDataDisplay = la_displayData;
            lo_selectData.selectData = la_selectData;

        }
        catch (err) {
            console.error(err);
        }
        callback(lo_selectData);

        /**
         * 取下拉資料
         * @returns {Promise<any>}
         */
        async function qrySelectOptionDisplayData() {
            return new Promise((resolve, reject) => {
                queryAgent.queryList(sql_tag, session.user, 0, 0, function (err, selData) {
                    if (err) {
                        console.error(err);
                        selData = [];
                    }

                    _.each(selData, function (lo_selData, index) {
                        if (!_.isUndefined(lo_selData.value)) {
                            if (field.modificable == 'N') {
                                selData[index].display = lo_selData.display;
                            }
                            else {
                                selData[index].display = lo_selData.value + " : " + lo_selData.display;
                            }
                        }
                    });
                    resolve(selData);
                });
            });
        }

        /**
         * 過濾要顯示的下拉資料
         * @param selectData {array} 原始下拉資料
         * @returns {Promise<any>}
         */
        async function filterSelectOption(selectData) {
            return new Promise((resolve, reject) => {
                if (!_.isUndefined(typeSelectField.display_func_name) && typeSelectField.display_func_name != "") {
                    ruleAgent[typeSelectField.display_func_name](selectData, function (data) {
                        resolve(data);
                    });
                }
                else {
                    resolve(selectData);
                }
            });
        }
    }
    //下拉來源為對應檔
    else if (typeSelectField.ds_from_sql.toUpperCase() != "R") {
        if (!_.isUndefined(ruleAgent[typeSelectField.rule_func_name])) {
            //方法訂義都需傳入一個Object參數集合
            let la_selectOptions = await new Promise(resolve => {
                ruleAgent[typeSelectField.rule_func_name](session.user, function (err, data) {
                    if (err) {
                        resolve([]);
                        console.error(err);
                    }
                    else {
                        _.each(data.selectOptions, function (lo_selData, index) {
                            if (!_.isUndefined(lo_selData.value)) {
                                data.selectOptions[index].display = lo_selData.display;
                            }
                        });
                    }
                    resolve(data.selectOptions);
                });
            });

            let la_editionOption = await this.handleRuleExtendFunc(la_selectOptions, session, typeSelectField);
            lo_selectData.selectDataDisplay = la_editionOption;
            lo_selectData.selectData = la_editionOption;
            callback(lo_selectData);
        }
        else {
            callback(lo_selectData);
        }
    }
    //下拉來源為當之作業的rule
    else {
        callback(lo_selectData);
    }
};

/**
 * 取得SelectGrid options值
 * @param params
 * @param selRow
 * @param field
 * @param callback
 */
exports.getSelectGridOption = function (session, typeSelectField, field, callback) {
    //要回傳的資料
    let lo_selectData = {};

    async.waterfall([
        //取得欄位、display、value資料
        qrySelectGridColumn,
        //取得下拉資料
        qrySelectGridData
    ], function (err, result) {
        if (err) {
            callback(err, null);
        }
        else {
            lo_selectData = result;
            lo_selectData.isQrySrcBefore = typeSelectField.is_qry_src_before == "" || _.isUndefined(typeSelectField.is_qry_src_before) ?
                "Y" : typeSelectField.is_qry_src_before;
            callback(err, lo_selectData);
        }
    });

    function qrySelectGridColumn(cb) {
        if (!_.isUndefined(ruleAgent[typeSelectField.column_func_name])) {
            ruleAgent[typeSelectField.column_func_name](session, function (err, data) {
                cb(err, data);
            });
        }
        else {
            let err = "column_func_name is undefined";
            cb(err, null);
        }
    }

    function qrySelectGridData(selectData, cb) {
        if (_.isEmpty(selectData)) {
            let err = "select's attribute is null";
            cb(err, null);
        }
        else {
            if (typeSelectField.is_qry_src_before != "N") {
                let sql_tag = typeSelectField.rule_func_name.toUpperCase();
                let lo_params = session.user;
                queryAgent.queryList(sql_tag, lo_params, 0, 0, function (err, selData) {
                    if (err) {
                        selData = [];
                    }
                    cb(err, {
                        selectData: selData,
                        columns: selectData.columns,
                        display: selectData.display,
                        value: selectData.value
                    });
                });
            }
            else {
                cb(null, {
                    selectData: [],
                    columns: selectData.columns,
                    display: selectData.display,
                    value: selectData.value
                });
            }
        }
    }
};

exports.handleRuleExtendFunc = async function (postData, session, fieldsData) {
    if (_.isUndefined(fieldsData.rule_extend_func_name)) return postData;

    if (_.isArray(fieldsData.rule_extend_func_name)) {
        let lo_result = await execRuleExtendFuncIsArray(postData, session, fieldsData);
        return lo_result;
    }
};

async function execRuleExtendFuncIsArray(postData, session, fieldsData) {
    let lb_isAddPrgID = false;
    if (_.isUndefined(postData.prg_id)) {
        postData.prg_id = fieldsData.prg_id;
        lb_isAddPrgID = true;
    }
    let la_ruleExtendFunc = _.sortBy(fieldsData.rule_extend_func_name, "sort");

    for (let lo_ruleExtendFunc of la_ruleExtendFunc) {
        let la_ruleName = Object.keys(lo_ruleExtendFunc);
        for (let ls_ruleName of la_ruleName) {
            let ls_enable = lo_ruleExtendFunc[ls_ruleName];
            if (ls_ruleName != "sort" && ls_enable == "Y") {
                let lo_result = await ruleAgent[ls_ruleName](postData, session);
                _.extend(postData, lo_result);
            }
        }
    }

    if (lb_isAddPrgID) {
        delete postData.prg_id;
    }
    return postData;
}

/**
 * 使用者離開欄位時檢查
 * @param postData
 * @param session
 * @return callback
 */
exports.handleBlurUiField = function (postData, session, callback) {
    if (!_.isUndefined(ruleAgent[postData.rule_func_name])) {

        ruleAgent[postData.rule_func_name](postData, session, function (err, result) {
            callback(err, result);
        });
    } else {
        let errorObj = new ErrorClass();
        errorObj.errorMsg = "Not found rule function.";
        callback(errorObj, new ReturnClass());
    }
};

/**
 * 使用者按下按鈕時檢查
 * @param postData
 * @param session
 * @returns {Promise<void>}
 */
exports.handlePrgFuncRule = async (postData, session) => {
    const lo_param = {
        prg_id: postData.prg_id,
        func_id: postData.func_id
    };

    if (!_.isUndefined(postData.page_id)) lo_param.page_id = Number(postData.page_id);
    if (!_.isUndefined(postData.tab_page_id)) lo_param.tab_page_id = Number(postData.tab_page_id);

    //從mongo PrgFunction 找資料
    const lo_prgFuncData = await mongoAgent.PrgFunction.findOne(lo_param).exec()
        .then(result => {
            return commonTools.mongoDocToObject(result);
        })
        .catch(err => {
            let lo_error = new ErrorClass();
            lo_error.errorMsg = err;
            throw lo_error;
        });

    //判斷ruleAgent裡是否有規則
    if (!_.isUndefined(ruleAgent[lo_prgFuncData.rule_func_name])) {
        return await new Promise((resolve, reject) => {
            ruleAgent[lo_prgFuncData.rule_func_name](postData, session, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        });
    }
    else {
        let lo_error = new ErrorClass();
        lo_error.errorMsg = "Not found rule function.";
        throw lo_error;
    }
};

/**
 * 透過規則取下拉資料
 * @param postData
 * @param session
 * @returns {Promise.<void>}
 */
exports.handleSelectOptionRule = async function (postData, session) {
    const lo_param = {
        prg_id: postData.prg_id,
        ui_field_name: postData.ui_field_name
    };

    if (!_.isUndefined(postData.page_id)) lo_param.page_id = Number(postData.page_id);
    if (!_.isUndefined(postData.tab_page_id)) lo_param.tab_page_id = Number(postData.tab_page_id);

    //從mongo UITypeSelect 找資料
    const lo_uiTypeSelectData = await mongoAgent.UITypeSelect.findOne(lo_param).exec()
        .then(result => {
            return commonTools.mongoDocToObject(result);
        })
        .catch(err => {
            let lo_error = new ErrorClass();
            lo_error.errorMsg = err;
            throw lo_error;
        });

    //判斷ruleAgent裡是否有規則
    if (!_.isUndefined(ruleAgent[lo_uiTypeSelectData.rule_func_name]) && lo_uiTypeSelectData.ds_from_sql.toUpperCase() == "R") {
        return await new Promise((resolve, reject) => {
            ruleAgent[lo_uiTypeSelectData.rule_func_name](postData, session, (err, result) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            });
        })
    }
    else {
        let lo_error = new ErrorClass();
        lo_error.errorMsg = "Not found rule function.";
        throw lo_error;
    }
};


exports.handleClickUiRow = function (postData, session, callback) {
    let la_dtField = postData.dtField;

    let funcField = _.filter(la_dtField, function (dtField) {
        return dtField.rule_func_name != "";
    });

    if (funcField.length != 0) {
        _.each(funcField, function (dtField, Idx) {
            ruleAgent[dtField.rule_func_name](postData, session, function (err, result) {
                if (Idx + 1 == funcField.length) {
                    callback(err, result);
                }
            });
        });
    }
    else {
        callback(null, new ReturnClass());
    }
};

/**
 * 按下新增按鈕需要抓取的預設值
 * @param postData
 * @param session
 * @return callback
 */
exports.handleAddFuncRule = function (postData, session, callback) {
    let prg_id = postData.prg_id;
    let page_id = postData.page_id ? Number(postData.page_id) : 1;
    async.parallel([
        function (cb) {
            mongoAgent.UIPageField.find({prg_id: prg_id, page_id: 2}, function (err, fieldNameList) {
                cb(err, _.pluck(fieldNameList, "ui_field_name"));
            });
        },
        function (cb) {
            mongoAgent.UITypeSelect.find({prg_id: prg_id}, function (err, selectData) {
                cb(err, selectData);
            });
        }
    ], function (err, getResult) {
        let fieldNameList = getResult[0];
        let selectData = commonTools.mongoDocToObject(getResult[1]);
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
                        if (value.defaultVal != "") {
                            result.defaultValues[value.ui_field_name] = value.defaultVal;
                        }
                    });

                    result.defaultValues = _.extend(lo_initField, result.defaultValues);

                    callback(err, result);
                });

            } else {

                //取typeSelect的預設值
                let result = {};
                _.each(selectData, function (value, index) {
                    if (value.defaultVal != "") {
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
 * 按下編輯按鈕
 * @param postData
 * @param session
 * @return callback
 */
exports.handleEditFuncRule = function (postData, session, callback) {
    if (!_.isUndefined(ruleAgent[postData.rule_func_name])) {

        ruleAgent[postData.rule_func_name](postData, session, function (err, result) {
            callback(err, result);
        });

    } else {
        let errorObj = new ReturnClass();
        errorObj.errorMsg = "Not found rule function.";
        callback(errorObj, new ReturnClass());

    }
};

/**
 * datagrid 刪除規則檢查
 * @param postData
 * @param session
 * @return callback
 */
exports.handleDeleteFuncRule = function (postData, session, callback) {
    let isDtData = postData["isDtData"] || false;
    let prg_id = postData.prg_id;
    let page_id = Number(postData.page_id || 1);
    let dbName = (page_id == 2) ? "SetupPageFunction" : "SetupDatagridFunction";

    mongoAgent[dbName].findOne({
        prg_id: prg_id,
        func_id: '0300',
        "$or": [{"page_id": {$not: {$exists: true}}}, {"page_id": page_id}]
    }, function (err, func) {
        let lo_result = new ReturnClass();
        if (!err && func) {
            func = func.toObject();
            if (!_.isEmpty(func.rule_func_name) && !_.isUndefined(ruleAgent[func.rule_func_name])) {
                let funcs = [];
                let deleteData = postData["deleteData"] || [];

                if (isDtData) {
                    deleteData = postData["dt_deleteData"] || [];
                }

                _.each(deleteData, function (d_data) {
                    postData.singleRowData = d_data;
                    let lo_postData = _.clone(postData);
                    funcs.push(
                        function (callback) {
                            ruleAgent[func.rule_func_name](lo_postData, session, function (err, result) {
                                callback(err, result);
                            });
                        }
                    );
                });

                async.parallel(funcs, function (err, result) {
                    if (err) {
                        lo_result.success = false;
                    }
                    _.each(result, function (lo_data) {
                        if (!_.isUndefined(lo_data)) {
                            lo_result.extendExecDataArrSet = lo_data.extendExecDataArrSet;
                        }
                    });

                    callback(err, lo_result);
                });

            } else {
                callback(null, new ReturnClass());
            }
        } else {
            callback(null, new ReturnClass());
        }
    });
};

/*
 * dataGrid select click 規則檢查
 * @param postData
 * @param session
 * @return callback
 */
exports.chkSelectClickRule = function (postData, session, callback) {
    commonRule.chkSelectClickRule(postData, session, function (result) {
        callback(result.error, result.return);
    });
};

/**
 * dataGrid selectgrid 搜尋時規則檢查
 * @param postData
 * @param session
 * @param callback
 */
exports.chkDgSelectgridQryRule = function (postData, session, callback) {
    commonRule.chkDgSelectgridQryRule(postData, session, function (result) {
        callback(result.error, result.return);
    });
};

/**
 * 單檔儲存前資料驗證檢查
 * @param postData
 * @param session
 * @return callback
 */
exports.handleSaveFuncRule = function (postData, session, callback) {

    if (!_.isUndefined(ruleAgent[postData.rule_func_name])) {

        ruleAgent[postData.rule_func_name](postData, session, function (err, result) {
            callback(err, result);
        });

    } else {
        let errorObj = new ReturnClass();
        errorObj.errorMsg = "Not found rule function.";
        callback(errorObj, new ReturnClass());

    }
};

/**
 * 檢查此筆資料可否被編輯
 * @param rule_func_name{String} : 規則名稱
 * @param rowData{Object} :
 * @param session{Object}:
 * @param callback{Function}:
 */
exports.chkIsModificableRowData = function (rule_func_name, rowData, session, callback) {
    if (!_.isEmpty(rule_func_name) && !_.isUndefined(ruleAgent[rule_func_name])) {
        let postData = {
            singleRowData: rowData
        };
        ruleAgent[rule_func_name](postData, session, function (err, result) {
            callback(err, result);
        });

    } else {
        // let errorObj = new ReturnClass();
        // errorObj.errorMsg = "Not found rule function.";
        callback(null, new ReturnClass());

    }
};

/**
 * 多筆儲存前規則驗證
 * @param postData
 * @param session
 * @param callback
 */
exports.handleDataGridBeforeSaveChkRule = function (postData, session, callback) {
    let prg_id = postData["prg_id"] || "";
    let deleteData = postData["deleteData"] || [];
    let createData = postData["createData"] || [];
    let updateData = postData["updateData"] || [];
    let la_before_save_create_sql_action = [];      //儲存前需要新增插入資料庫的動作
    let la_before_save_delete_sql_action = [];      //儲存前需要刪除資料庫的動作
    let la_before_save_update_sql_action = [];      //儲存前需要修改資料庫的動作
    let lo_beforeSaveCreateCheckResult = [];       //檢查update 結果
    let lo_beforeSaveUpdateCheckResult = [];       //檢查

    mongoAgent.SetupDatagridFunction.find({prg_id: prg_id}).exec(function (err, ruleFuncs) {
        if (ruleFuncs.length > 0) {
            ruleFuncs = commonTools.mongoDocToObject(ruleFuncs);
        }

        //檢查新增資料
        function chkCreateData(callback) {
            let createChkFuncs = [];
            let beforeCreateFuncRule = _.findIndex(ruleFuncs, {func_id: '0521'}) > -1
                ? _.findWhere(ruleFuncs, {func_id: '0521'}).rule_func_name
                : "";
            _.each(createData, function (c_data, cIdx) {
                if (!_.isEmpty(beforeCreateFuncRule) && !_.isUndefined(ruleAgent[beforeCreateFuncRule])) {
                    let createPostData = {
                        singleRowData: c_data
                    };
                    createPostData = _.extend(createPostData, postData);
                    createChkFuncs.push(
                        function (callback) {
                            ruleAgent[beforeCreateFuncRule](createPostData, session, function (err, result) {
                                if (result.extendExecDataArrSet.length > 0) {
                                    la_before_save_create_sql_action = _.union(la_before_save_create_sql_action, result.extendExecDataArrSet);
                                }
                                if (_.isUndefined(result.modifiedRowData) && _.size(result.modifiedRowData) > 0) {
                                    postData["createData"][cIdx] = result.modifiedRowData;
                                }
                                callback(err ? err.errorMsg : null, result.success);
                            });
                        }
                    );

                }
            });

            async.parallel(createChkFuncs, function (err, result) {
                callback(err, 'chkCreateData');
            });
        }

        //檢查修改資料
        function chkEditData(callback) {
            let editChkFuncs = [];
            let beforeEditFuncRule = _.findIndex(ruleFuncs, {func_id: '0541'}) > -1
                ? _.findWhere(ruleFuncs, {func_id: '0541'}).rule_func_name
                : "";
            _.each(updateData, function (u_data) {
                if (!_.isEmpty(beforeEditFuncRule) && !_.isUndefined(ruleAgent[beforeEditFuncRule])) {
                    let editPostData = {
                        singleRowData: u_data
                    };
                    editPostData = _.extend(editPostData, postData);
                    editChkFuncs.push(
                        function (callback) {
                            ruleAgent[beforeEditFuncRule](editPostData, session, function (err, result) {
                                if (result.extendExecDataArrSet.length > 0) {
                                    la_before_save_delete_sql_action = _.union(la_before_save_delete_sql_action, result.extendExecDataArrSet);
                                }
                                callback(err ? err.errorMsg : null, result.success);
                            });
                        }
                    );
                }
            });

            async.parallel(editChkFuncs, function (err, result) {
                callback(err, 'chkEditData');
            });
        }

        //檢查刪除資料
        function chkDeleteData(callback) {

            let delChkFuncs = [];
            let beforeDeleteFuncRule = _.findIndex(ruleFuncs, {func_id: '0531'}) > -1
                ? _.findWhere(ruleFuncs, {func_id: '0531'}).rule_func_name
                : "";
            _.each(deleteData, function (d_data) {
                if (!_.isEmpty(beforeDeleteFuncRule) && !_.isUndefined(ruleAgent[beforeDeleteFuncRule])) {
                    let deletePostData = {
                        singleRowData: d_data
                    };
                    deletePostData = _.extend(deletePostData, postData);
                    delChkFuncs.push(
                        function (callback) {
                            ruleAgent[beforeDeleteFuncRule](deletePostData, session, function (err, result) {
                                if (result.extendExecDataArrSet.length > 0) {
                                    la_before_save_delete_sql_action = _.union(la_before_save_delete_sql_action, result.extendExecDataArrSet);
                                }
                                callback(err, result.success);
                            });
                        }
                    );

                }
            });

            async.parallel(delChkFuncs, function (err, result) {
                callback(err, 'chkDeleteData');
            });
        }

        async.parallel([chkCreateData, chkEditData, chkDeleteData], function (err, result) {
            result = new ReturnClass();
            result.success = err == null;
            result.la_before_save_create_sql_action = la_before_save_create_sql_action;
            result.la_before_save_delete_sql_action = la_before_save_delete_sql_action;
            result.la_before_save_update_sql_action = la_before_save_update_sql_action;
            result.postData = postData;
            callback(err, result);
        });

    });
};


/**
 * 檢查datagrid 多筆刪除的規則檢查
 * @param postData
 * @param session
 * @param callback
 */
exports.chkDatagridDeleteEventRule = function (postData, session, callback) {
    let prg_id = postData["prg_id"];
    let page_id = postData.page_id || 1;
    let tab_page_id = postData.tab_page_id || 1;
    let deleteData = postData["deleteData"] || [];
    let delChkFuncs = [];
    let lo_mongoCollection = prg_id.substring(0, 5) == "PMS08" ? "SetupDatagridFunction" : "PrgFunction";//設定的collection 為SetupDatagridFunction、作業為PrgFunction
    let lo_params = {};//mongo 搜尋條件

    if (lo_mongoCollection == "SetupDatagridFunction") {
        lo_params = {
            prg_id: prg_id,
            page_id: Number(page_id),
            func_id: '0300'
        };
    }
    else {
        lo_params = {
            prg_id: prg_id,
            page_id: Number(page_id),
            tab_page_id: Number(tab_page_id),
            func_id: '0300'
        };
    }

    mongoAgent[lo_mongoCollection].findOne(lo_params, function (err, deleteRule) {
        let beforeDeleteFuncRule = !err && deleteRule ? deleteRule.toObject().rule_func_name : "";
        if (!_.isEmpty(beforeDeleteFuncRule) && !_.isUndefined(ruleAgent[beforeDeleteFuncRule])) {
            _.each(deleteData, function (d_data) {
                let deletePostData = {
                    singleRowData: d_data
                };
                deletePostData = _.extend(deletePostData, postData);
                delChkFuncs.push(
                    function (callback) {
                        ruleAgent[beforeDeleteFuncRule](deletePostData, session, function (err, result) {
                            callback(err, result);
                        });
                    }
                );

            });
            async.parallel(delChkFuncs, function (err, result) {
                let lo_result = new ReturnClass();
                if (err) {
                    lo_result.success = false;
                }
                callback(err, lo_result);
            });
        }
        else {
            callback(null, new ReturnClass());
        }

    });
};


/**
 * 單檔singleGrid 儲存單筆資料"前"的規則驗證檢查
 */
exports.doChkSingleGridBeforeSave = function (postData, session, callback) {
    try {
        let prg_id = postData.prg_id;
        let page_id = postData.page_id || 2;
        let userInfo = session.user;
        let lo_chkResult = new ReturnClass();
        let lo_chkError = null;
        let tmpExtendExecDataArrSet = [];  //新刪修回傳要執行的SQL API 組合
        let deleteData = postData["deleteData"] || [];
        let createData = postData["createData"] || [];
        let editData = postData["editData"] || [];
        mongoAgent.SetupPageFunction.find({prg_id: prg_id, page_id: page_id}).exec(function (err, rules) {
            if (!err && rules.length > 0) {
                async.parallel([
                    //新增資料檢查
                    function (callback) {
                        let createRuleFuncName = _.findIndex(rules, {func_id: '0521'}) > -1
                            ? _.findWhere(rules, {func_id: '0521'}).rule_func_name
                            : "";
                        if (createData.length > 0 && !_.isEmpty(createRuleFuncName)) {
                            let createSubFunc = [];
                            _.each(createData, function (c_data) {
                                createSubFunc.push(
                                    function (callback) {
                                        if (_.isUndefined(ruleAgent[createRuleFuncName])) {
                                            callback(null, 'create');
                                            return;
                                        }
                                        postData["singleRowData"] = c_data;
                                        ruleAgent[createRuleFuncName](postData, session, function (err, result) {
                                            if (!err) {
                                                tmpExtendExecDataArrSet = _.union(tmpExtendExecDataArrSet, result.extendExecDataArrSet);
                                                if (!_.isEmpty(result.effectValues)) {
                                                    postData.singleRowData = result.effectValues;
                                                }
                                            }
                                            callback(err, 'create');
                                        });

                                    }
                                );
                            });

                            async.parallel(createSubFunc, function (err, result) {
                                callback(err, 'create');
                            });

                        }
                        else {
                            callback(null, 'create');
                        }

                    },
                    //修改資料檢查
                    function (callback) {
                        let updateRuleFuncName = _.findIndex(rules, {func_id: '0541'}) > -1
                            ? _.findWhere(rules, {func_id: '0541'}).rule_func_name
                            : "";
                        if (editData.length > 0 && !_.isEmpty(updateRuleFuncName)) {
                            let updateSubFunc = [];
                            _.each(editData, function (u_data) {
                                updateSubFunc.push(
                                    function (callback) {
                                        if (_.isUndefined(ruleAgent[updateRuleFuncName])) {
                                            callback(null, 'update');
                                            return;
                                        }

                                        postData["singleRowData"] = u_data;
                                        ruleAgent[updateRuleFuncName](postData, session, function (err, result) {
                                            if (!err) {
                                                tmpExtendExecDataArrSet = _.union(tmpExtendExecDataArrSet, result.extendExecDataArrSet);
                                                if (!_.isEmpty(result.effectValues)) {
                                                    postData.singleRowData = result.effectValues;
                                                }
                                            }
                                            callback(err, 'update');
                                        });

                                    }
                                );
                            });

                            async.parallel(updateSubFunc, function (err, result) {
                                callback(err, 'update');
                            });

                        } else {
                            callback(null, 'update');
                        }
                    },
                    //刪除資料檢查
                    function (callback) {
                        let deleteRuleFuncName = _.findIndex(rules, {func_id: '0531'}) > -1
                            ? _.findWhere(rules, {func_id: '0531'}).rule_func_name
                            : "";
                        if (deleteData.length > 0 && !_.isEmpty(deleteRuleFuncName)) {
                            let deleteSubFunc = [];
                            _.each(deleteData, function (d_data) {
                                deleteSubFunc.push(
                                    function (callback) {
                                        if (_.isUndefined(ruleAgent[deleteRuleFuncName])) {
                                            callback(null, 'delete');
                                            return;
                                        }
                                        postData["singleRowData"] = d_data;
                                        ruleAgent[deleteRuleFuncName](postData, session, function (err, result) {
                                            if (!err) {
                                                tmpExtendExecDataArrSet = _.union(tmpExtendExecDataArrSet, result.extendExecDataArrSet);
                                            }
                                            callback(err, 'delete');
                                        });

                                    }
                                );
                            });

                            async.parallel(deleteSubFunc, function (err, result) {
                                callback(err, 'delete');
                            });

                        } else {
                            callback(null, 'delete');
                        }
                    }
                ], function (err, chkResult) {

                    if (err) {
                        lo_chkError = new ErrorClass();
                        lo_chkError.errorMsg = err.errorMsg;
                        lo_chkError.errorCod = "1111";
                        lo_chkResult.success = false;
                    }
                    lo_chkResult.extendExecDataArrSet = tmpExtendExecDataArrSet;
                    lo_chkResult.effectValues = postData.singleRowData;

                    callback(lo_chkError, lo_chkResult);
                });
            } else {
                // 無任何規則不用檢查
                callback(null, lo_chkResult);
            }
        });
    } catch (err) {
        lo_chkError = new ErrorClass();
        lo_chkError.errorMsg = err;
        lo_chkError.errorCod = "1111";
        lo_chkResult.success = false;
        callback(lo_chkError, lo_chkResult);
    }
};

/**
 * 單檔singleGrid 儲存單筆資料"後"的規則驗證檢查
 */
exports.doChkSingleGridAfterSave = function (postData, session, callback) {
    //TODO 單檔Mn 儲存前規則檢查
    try {
        let lo_chkResult = new ReturnClass();
        let lo_chkError = null;
        callback(lo_chkError, lo_chkResult);
    } catch (err) {
        lo_chkError = new ErrorClass();
        lo_chkError.errorMsg = err;
        lo_chkError.errorCod = "1111";
        lo_chkResult.success = false;
        callback(lo_chkError, lo_chkResult);
    }


};

/**
 * 特殊版型多筆，按下特殊按鈕，規則檢查
 */
exports.chkSpecialDataGridBtnEventRule = function (postData, session, callback) {
    let func_id = postData.func_id || "";
    let prg_id = postData.prg_id || "";

    if (_.isUndefined(ruleAgent[prg_id + "_" + func_id])) {
        callback(null, '');
        return;
    }
    else if (func_id == "" || prg_id == "") {
        console.error("prg_id 或 func_id為空值");
        callback(null, '');
        return;
    }

    ruleAgent[prg_id + "_" + func_id](postData, session, function (err, result) {
        callback(err, result);
    });
};

/**
 * 儲存"前"，執行作業規則檢查
 */
exports.doOperationRuleProcBeforeSave = async function (postData, session, rules, callback) {
    let la_createData = postData["tmpCUD"]["createData"] || [];
    let la_updateData = postData["tmpCUD"]["updateData"] || [];
    let la_deleteData = postData["tmpCUD"]["deleteData"] || [];
    let la_tmpExtendExecDataArrSet = [];  //新刪修回傳要執行的SQL API 組合
    let lo_result = new ReturnClass();
    let lo_error = null;

    try {
        async.parallel([
            //新增資料檢查
            function (para_cb) {
                let createRuleFuncName = _.findIndex(rules, {func_id: '0521'}) > -1
                    ? _.findWhere(rules, {func_id: '0521'}).rule_func_name
                    : "";
                if (la_createData.length > 0 && !_.isEmpty(createRuleFuncName)) {
                    let createSubFunc = [];
                    _.each(la_createData, function (c_data, index) {
                        createSubFunc.push(
                            function (cb) {
                                if (_.isUndefined(ruleAgent[createRuleFuncName])) {
                                    cb(null, 'create');
                                    return;
                                }
                                postData["singleRowData"] = c_data;
                                ruleAgent[createRuleFuncName](postData, session, function (err, result) {
                                    if (!err) {
                                        la_tmpExtendExecDataArrSet = _.union(la_tmpExtendExecDataArrSet, result.extendExecDataArrSet);
                                        if (!_.isEmpty(result.effectValues)) {
                                            postData.createData[index] = _.extend(postData.createData[index], result.effectValues);
                                        }
                                    }
                                    cb(err, 'create');
                                });

                            }
                        );
                    });

                    async.parallel(createSubFunc, function (err, result) {
                        para_cb(err, 'create');
                    });

                }
                else {
                    para_cb(null, 'create');
                }

            },
            //修改資料檢查
            function (para_cb) {
                let updateRuleFuncName = _.findIndex(rules, {func_id: '0541'}) > -1
                    ? _.findWhere(rules, {func_id: '0541'}).rule_func_name
                    : "";
                if (la_updateData.length > 0 && !_.isEmpty(updateRuleFuncName)) {
                    let updateSubFunc = [];
                    _.each(la_updateData, function (u_data, index) {
                        updateSubFunc.push(
                            function (cb) {
                                if (_.isUndefined(ruleAgent[updateRuleFuncName])) {
                                    cb(null, 'update');
                                    return;
                                }

                                postData["singleRowData"] = u_data;
                                ruleAgent[updateRuleFuncName](postData, session, function (err, result) {
                                    if (!err) {
                                        la_tmpExtendExecDataArrSet = _.union(la_tmpExtendExecDataArrSet, result.extendExecDataArrSet);
                                        if (!_.isEmpty(result.effectValues)) {
                                            postData.updateData[index] = _.extend(postData.updateData[index], result.effectValues);
                                        }
                                    }
                                    cb(err, 'update');
                                });

                            }
                        );
                    });

                    async.parallel(updateSubFunc, function (err, result) {
                        para_cb(err, 'update');
                    });

                }
                else {
                    para_cb(null, 'update');
                }
            },
            //刪除資料檢查
            function (para_cb) {
                let deleteRuleFuncName = _.findIndex(rules, {func_id: '0531'}) > -1
                    ? _.findWhere(rules, {func_id: '0531'}).rule_func_name
                    : "";
                if (la_deleteData.length > 0 && !_.isEmpty(deleteRuleFuncName)) {
                    let deleteSubFunc = [];
                    _.each(la_deleteData, function (d_data, index) {
                        deleteSubFunc.push(
                            function (cb) {
                                if (_.isUndefined(ruleAgent[deleteRuleFuncName])) {
                                    cb(null, 'delete');
                                    return;
                                }
                                postData["singleRowData"] = d_data;
                                ruleAgent[deleteRuleFuncName](postData, session, function (err, result) {
                                    if (!err) {
                                        la_tmpExtendExecDataArrSet = _.union(la_tmpExtendExecDataArrSet, result.extendExecDataArrSet);
                                        if (!_.isEmpty(result.effectValues)) {
                                            postData.deleteData[index] = _.extend(postData.deleteData[index], result.effectValues);
                                        }
                                    }
                                    cb(err, 'delete');
                                });

                            }
                        );
                    });

                    async.parallel(deleteSubFunc, function (err, result) {
                        para_cb(err, 'delete');
                    });

                } else {
                    para_cb(null, 'delete');
                }
            }
        ], function (err, chkResult) {
            if (err) {
                lo_error = new ErrorClass();
                lo_error.errorMsg = err.errorMsg;
                lo_error.errorCod = "1111";
                lo_result.success = false;
            }
            else {
                lo_result.extendExecDataArrSet = la_tmpExtendExecDataArrSet;
                delete postData.singleRowData;
                lo_result.effectValues = postData;
            }

            callback(lo_error, lo_result);
        });
    }
    catch (err) {
        lo_error = new ErrorClass();
        lo_result.success = false;
        lo_error.errorMsg = err;
        lo_error.errorCod = "1111";
        callback(lo_error, lo_result);
    }
};
