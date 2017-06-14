/**
 * Created by Jun Chang on 2017/2/15.
 */

var moment = require("moment");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var mongoAgent = require("../plugins/mongodb");
var ruleAgent = require("../ruleEngine/ruleAgent");
var commonTools = require("../utils/commonTools");
var _ = require("underscore");
var async = require("async");
var ReturnClass = require("../ruleEngine/returnClass");
var ErrorClass = require("../ruleEngine/errorClass");


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
 * @param params
 * @param selRow
 * @param callback
 * @constructor
 */
exports.getSelectOptions = function (params, selRow, callback) {

    if (selRow.referiable == "Y") {
        callback([]);
        return;
    }

    if (selRow.ds_from_sql == "Y") {
        var sql_tag = selRow.rule_func_name.toUpperCase();
        queryAgent.queryList(sql_tag, params, 0, 0, function (err, selData) {
            if (err) {
                selData = [];
            }
            callback(selData);
        });
    } else {
        if (!_.isUndefined(ruleAgent[selRow.rule_func_name])) {
            //方法訂義都需傳入一個Object參數集合
            ruleAgent[selRow.rule_func_name](params, function (err,result) {
                callback(result.selectOptions);
            });
        }else{
            callback([]);
        }
    }
};


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
        var errorObj = new ErrorClass();
        errorObj.errorMsg = "Not found rule function.";
        callback(errorObj, new ReturnClass());

    }

};

/**
 * 按下新增按鈕需要抓取的預設值
 * @param postData
 * @param session
 * @return callback
 */
exports.handleAddFuncRule = function (postData, session, callback) {
    mongoAgent.DatagridFunction.findOne({
        prg_id: postData.prg_id,
        func_id: '0200',
        page_id: postData.page_id || 1
    }, function (err, func) {

        if (!err && func) {
            func = func.toObject();
            if (!_.isEmpty(func.rule_func_name) && !_.isUndefined(ruleAgent[func.rule_func_name])) {

                ruleAgent[func.rule_func_name](postData, session, function (err, result) {
                    callback(err, result);
                });

            } else {
                // var errorObj = new ReturnClass();
                // errorObj.errorMsg = "Not found rule function.";
                callback(null, new ReturnClass());

            }
        } else {

            callback(null, new ReturnClass());
        }


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
        var errorObj = new ReturnClass();
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
    var isDtData = postData["isDtData"] || false;
    var prg_id = postData.prg_id;
    var page_id = Number(postData.page_id || 1 ) ;
    mongoAgent.DatagridFunction.findOne({
        prg_id: prg_id,
        func_id: '0300',
        page_id: page_id
    }, function (err, func) {
        var lo_result = new ReturnClass();
        if (!err && func) {
            func = func.toObject();
            if (!_.isEmpty(func.rule_func_name) && !_.isUndefined(ruleAgent[func.rule_func_name])) {
                var funcs = [];
                var deleteData = postData["deleteData"] || [];

                if (isDtData) {
                    deleteData = postData["dt_deleteData"] || [];
                }


                _.each(deleteData, function (d_data) {
                    postData.singleRowData = d_data;
                    funcs.push(
                        function (callback) {
                            ruleAgent[func.rule_func_name](postData, session, function (err, result) {
                                callback(err, result);
                            });
                        }
                    );
                });

                async.parallel(funcs, function (err, result) {
                    if (err) {
                        lo_result.success = false;
                    }

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
        var errorObj = new ReturnClass();
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
        var postData = {
            singleRowData: rowData
        };
        ruleAgent[rule_func_name](postData, session, function (err, result) {
            callback(err, result);
        });

    } else {
        // var errorObj = new ReturnClass();
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
    var prg_id = postData["prg_id"] || "";
    var deleteData = postData["deleteData"] || [];
    var createData = postData["createData"] || [];
    var updateData = postData["updateData"] || [];
    var la_before_save_create_sql_action = [];      //儲存前需要新增插入資料庫的動作
    var la_before_save_delete_sql_action = [];      //儲存前需要刪除資料庫的動作
    var la_before_save_update_sql_action = [];      //儲存前需要修改資料庫的動作
    var lo_beforeSaveCreateCheckResult = [];       //檢查update 結果
    var lo_beforeSaveUpdateCheckResult = [];       //檢查

    mongoAgent.DatagridFunction.find({prg_id: prg_id}).exec(function (err, ruleFuncs) {
        if (ruleFuncs.length > 0) {
            ruleFuncs = commonTools.mongoDocToObject(ruleFuncs);
        }
        //檢查新增資料
        function chkCreateData(callback) {
            var createChkFuncs = [];
            var beforeCreateFuncRule = _.findIndex(ruleFuncs, {func_id: '0521'}) > -1
                ? _.findWhere(ruleFuncs, {func_id: '0521'}).rule_func_name
                : "";
            _.each(createData, function (c_data,cIdx) {
                if (!_.isEmpty(beforeCreateFuncRule) && !_.isUndefined(ruleAgent[beforeCreateFuncRule])) {
                    var createPostData = {
                        singleRowData: c_data
                    };
                    createPostData = _.extend(createPostData, postData);
                    createChkFuncs.push(
                        function (callback) {
                            ruleAgent[beforeCreateFuncRule](createPostData, session, function (err, result) {
                                if (result.extendExecDataArrSet.length > 0) {
                                    la_before_save_create_sql_action = _.union(la_before_save_create_sql_action, result.extendExecDataArrSet);
                                }
                                if(_.isUndefined(result.modifiedRowData) && _.size(result.modifiedRowData) > 0){
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
            var editChkFuncs = [];
            var beforeEditFuncRule = _.findIndex(ruleFuncs, {func_id: '0541'}) > -1
                ? _.findWhere(ruleFuncs, {func_id: '0541'}).rule_func_name
                : "";
            _.each(updateData, function (u_data) {
                if (!_.isEmpty(beforeEditFuncRule) && !_.isUndefined(ruleAgent[beforeEditFuncRule])) {
                    var editPostData = {
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

            var delChkFuncs = [];
            var beforeDeleteFuncRule = _.findIndex(ruleFuncs, {func_id: '0531'}) > -1
                ? _.findWhere(ruleFuncs, {func_id: '0531'}).rule_func_name
                : "";
            _.each(deleteData, function (d_data) {
                if (!_.isEmpty(beforeDeleteFuncRule) && !_.isUndefined(ruleAgent[beforeDeleteFuncRule])) {
                    var deletePostData = {
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
'use strict';
exports.chkDatagridDeleteEventRule = function (postData, session, callback) {
    var prg_id = postData["prg_id"];
    var deleteData = postData["deleteData"] || [];
    var delChkFuncs = [];
    mongoAgent.DatagridFunction.findOne({prg_id: prg_id, func_id: '0300'}, function (err, deleteRule) {

        var beforeDeleteFuncRule = !err && deleteRule ? deleteRule.toObject().rule_func_name : "";
        if (!_.isEmpty(beforeDeleteFuncRule) && !_.isUndefined(ruleAgent[beforeDeleteFuncRule])) {
            _.each(deleteData, function (d_data) {
                var deletePostData = {
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
                var lo_result = new ReturnClass();
                if (err) {
                    lo_result.success = false;
                }
                callback(err, lo_result);
            });
        } else {
            callback(null, new ReturnClass());
        }

    });
};


/**
 * 單檔singleGrid 儲存單筆資料"前"的規則驗證檢查
 */
exports.doChkSingleGridBeforeSave = function (postData, session, callback) {
    try {
        var prg_id = postData.prg_id;
        var page_id = postData.page_id || 2;
        var userInfo = session.user;
        var lo_chkResult = new ReturnClass();
        var lo_chkError = null;
        var tmpExtendExecDataArrSet = [];  //新刪修回傳要執行的SQL API 組合
        var deleteData = postData["deleteData"] || [];
        var createData = postData["createData"] || [];
        var editData = postData["editData"] || [];
        mongoAgent.PageFunction.find({prg_id: prg_id, page_id: page_id}).exec(function (err, rules) {
            if (!err && rules.length > 0) {
                async.parallel([
                    //新增資料檢查
                    function (callback) {
                        var createRuleFuncName = _.findIndex(rules, {func_id: '0521'}) > -1
                            ? _.findWhere(rules, {func_id: '0521'}).rule_func_name
                            : "";
                        if (createData.length > 0 && !_.isEmpty(createRuleFuncName)) {
                            var createSubFunc = [];
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
                                            }
                                            callback(err, 'create');
                                        });

                                    }
                                );
                            });

                            async.parallel(createSubFunc, function (err, result) {
                                callback(err, 'create');
                            });

                        } else {
                            callback(null, 'create');
                        }

                    },
                    //修改資料檢查
                    function (callback) {
                        var updateRuleFuncName = _.findIndex(rules, {func_id: '0541'}) > -1
                            ? _.findWhere(rules, {func_id: '0541'}).rule_func_name
                            : "";
                        if (editData.length > 0 && !_.isEmpty(updateRuleFuncName)) {
                            var updateSubFunc = [];
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
                        var deleteRuleFuncName = _.findIndex(rules, {func_id: '0531'}) > -1
                            ? _.findWhere(rules, {func_id: '0531'}).rule_func_name
                            : "";
                        if (deleteData.length > 0 && !_.isEmpty(deleteRuleFuncName)) {
                            var deleteSubFunc = [];
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
        var lo_chkResult = new ReturnClass();
        var lo_chkError = null;
        callback(lo_chkError, lo_chkResult);
    } catch (err) {
        lo_chkError = new ErrorClass();
        lo_chkError.errorMsg = err;
        lo_chkError.errorCod = "1111";
        lo_chkResult.success = false;
        callback(lo_chkError, lo_chkResult);
    }


};
