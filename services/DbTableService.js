/**
 * Created by Jun Chang on 2017/2/10.
 */

let tools = require("../utils/CommonTools");
let _ = require("underscore");
let sysConfig = require("../configs/systemConfig");
let queryAgent = require('../plugins/kplug-oracle/QueryAgent');
let i18n = require("i18n");
let logSvc = require("./LogService");
let mailSvc = require("./MailService");
let langSvc = require("./LangService");
let ruleAgent = require("../ruleEngine/ruleAgent");
let moment = require("moment");
let go_sysConf = require("../configs/systemConfig");
let commonRule = require("../ruleEngine/rules/CommonRule");
let optSaveAdapter = require("../ruleEngine/operationSaveAdapter");
let async = require("async");
let mongoAgent = require("../plugins/mongodb");
let dataRuleSvc = require('../services/DataRuleService');
let ErrorClass = require("../ruleEngine/errorClass");
let ReturnClass = require("../ruleEngine/returnClass");
const saveDataModule = require("./common/saveDataModule");
/**
 *
 * @param prg_id{String} : 程式編號
 * @param table_name{String}: lock的table
 * @param userInfo{Object} : 使用者資訊
 * @param lock_type{String} : 上鎖類別 T: table | R:recode
 * @param key_cod {String} : recode 才會有
 * @param socket_id {String} : socket_id
 * @param callback{function} : 回調函數
 */
exports.doTableLock = function (prg_id, table_name, userInfo, lock_type, key_cod, socket_id, callback) {
    try {
        let user_id = userInfo.usr_id;
        let athena_id = userInfo.athena_id;
        let hotel_cod = userInfo.fun_hotel_cod;
        let REVE_CODE = "BAC09008010000";
        queryAgent.query("QRY_CONN_SESSION", {}, function (err, session) {
            let params = {
                "REVE-CODE": REVE_CODE,
                "program_id": prg_id,
                "table_name": table_name,
                "key_cod": _.isUndefined(key_cod) ? "" : key_cod,
                "user": user_id,
                "type": lock_type,
                "session_id": session.db_session_id || "",
                "athena_id": athena_id,
                "hotel_cod": hotel_cod,
                "socket_id": socket_id
            };

            tools.requestApi(sysConfig.api_url.common, params, function (err, res, data) {
                let success = true;
                let errorMsg = null;
                if (err || !data) {
                    success = false;
                    errorMsg = err;

                } else {
                    if (data["RETN-CODE"] != '0000') {
                        success = false;
                        errorMsg = i18n.__("table_in_use", data["RETN-CODE-DESC"]);
                    }
                }

                callback(errorMsg, success);
            });
        });
    } catch (err) {
        callback(err, false);
    }
};

/**
 *
 * @param prg_id{String} : 程式編號
 * @param table_name{String}: unlock的table
 * @param userInfo{Object} : 使用者資訊
 * @param lock_type{String} : 上鎖類別 T: table | R:recode
 * @param key_cod {String} : recode 才會有
 * @param socket_id {String} : socket_id
 * @param callback{function} : 回調函數
 */
exports.doTableUnLock = function (prg_id, table_name, userInfo, lock_type, key_cod, socket_id, callback) {
    try {
        let user_id = userInfo ? userInfo.usr_id : '';
        let athena_id = userInfo ? userInfo.athena_id : '';
        let hotel_cod = userInfo ? userInfo.fun_hotel_cod : '';
        let REVE_CODE = "BAC09008020000";
        if (_.isUndefined(userInfo) || (_.isUndefined(prg_id) || _.isEmpty(prg_id))) {
            REVE_CODE = 'BAC09008040000';
        }

        queryAgent.query("QRY_CONN_SESSION", {}, function (err, session) {

            let params = {
                "REVE-CODE": REVE_CODE,
                "program_id": prg_id,
                "table_name": table_name,
                "key_cod": _.isUndefined(key_cod) ? "" : key_cod,
                "user": user_id,
                "type": lock_type,
                "session_id": session.db_session_id || "",
                "athena_id": athena_id,
                "hotel_cod": hotel_cod,
                "socket_id": socket_id
            };

            tools.requestApi(sysConfig.api_url.common, params, function (err, res, data) {
                let success = true;
                let errorMsg = null;
                if (err || !data) {
                    success = false;
                    errorMsg = err;
                } else {
                    if (typeof data === 'object' && data["RETN-CODE"] != '0000') {
                        success = false;
                        errorMsg = i18n.__("table_in_use", data["RETN-CODE-DESC"]);
                    }
                }

                callback(errorMsg, success);
            });

        });
    } catch (err) {
        callback(err, true);
    }
};


/**
 * 刪除所有指定SocketID 的Lock
 * @param socket_id {String} : socket_id
 * @param callback{function} : 回調函數
 */
exports.doTableUnLockBySocketID = function (socket_id, callback) {
    try {

        let REVE_CODE = "BAC09008040000";


        queryAgent.query("QRY_CONN_SESSION", {}, function (err, session) {

            let params = {
                "REVE-CODE": REVE_CODE,
                "socket_id": socket_id
            };

            tools.requestApi(sysConfig.api_url.common, params, function (err, res, data) {
                let success = true;
                let errorMsg = null;
                if (err || !data) {
                    success = false;
                    errorMsg = err;
                }

                callback(errorMsg, success);
            });

        });
    } catch (err) {
        callback(err, true);
    }
};

/**
 * unlock 全部
 * @param callback
 */
exports.doTableAllUnLock = function (callback) {
    try {
        let REVE_CODE = "BAC09008030000";
        tools.requestApi(sysConfig.api_url.common, {"REVE-CODE": REVE_CODE}, function (err, res, data) {
            let success = true;
            let errorMsg = null;
            if (err || !data) {
                success = false;
                errorMsg = err;
            } else {
                if (data["RETN-CODE"] != '0000') {
                    success = false;
                    errorMsg = data["RETN-CODE-DESC"] || "";
                }
            }

            callback(errorMsg, success);
        });
    } catch (err) {
        callback(err, false);
    }

};

/**
 *
 * @param callback
 */
exports.handleExecSQLProcess = function (formData, session, callback) {
    if (_.isUndefined(formData.prg_id)) {
        return callback("Missing Program ID.", false);
    }
    if (_.isUndefined(session.user) || _.size(session.user) == 0) {
        return callback("Not Login.", false);
    }

    let prg_id = formData.prg_id;
    let saveExecDatas = this.combineExecData(formData.fieldData, formData.tmpCUD, session, formData.mainTableName);
    this.execSQL(prg_id, saveExecDatas, session, callback);
};

exports.execSQL = function (prg_id, saveExecDatas, session, callback) {
    let userInfo = session.user;
    let apiParams = {
        "REVE-CODE": "BAC03009010000",
        "program_id": prg_id,
        "user": userInfo.usr_id,
        "count": Object.keys(saveExecDatas).length,
        "exec_data": saveExecDatas
    };
    if (_.size(saveExecDatas) > 0) {
        tools.requestApi(sysConfig.api_url.common, apiParams, function (apiErr, apiRes, data) {
            let success = true;
            let errMsg = null;
            let log_id = moment().format("YYYYMMDDHHmmss");
            if (apiErr) {
                success = false;
                errMsg = apiErr;
            }
            else if (data["RETN-CODE"] != "0000") {
                success = false;
                errMsg = data["RETN-CODE-DESC"];
            }

            //寄出exceptionMail
            if (!success) {
                mailSvc.sendExceptionMail({
                    log_id: log_id,
                    exceptionType: "execSQL",
                    errorMsg: errMsg
                });
            }

            logSvc.recordLogAPI({
                success: success,
                log_id: log_id,
                prg_id: prg_id,
                api_prg_code: '0300901000',
                req_content: apiParams,
                res_content: data
            });

            callback(errMsg, success);
        });
    }
    else {
        callback(null, true);
    }
};

/**
 *
 * @param fieldData
 * @param tmpCUD
 * @param mainTableName
 * @param session
 * @return {{}}
 */
exports.combineExecData = function (fieldData, tmpCUD, session, mainTableName) {
    let savaExecDatas = {};
    let exec_seq = 1;
    let userInfo = session.user;
    let las_keyFields = _.pluck(_.where(fieldData, {keyable: 'Y'}), "ui_field_name");
    if (!tmpCUD) {
        tmpCUD = {};
    }
    _.each(tmpCUD.createData, function (c_data) {
        let tmpIns = {"function": "1"}; //1  新增
        tmpIns["table_name"] = mainTableName;

        try {
            c_data = handleDateFormat(fieldData, c_data);
        }
        catch (err) {

        }

        _.each(Object.keys(c_data), function (objKey) {
            tmpIns[objKey] = c_data[objKey];
        });

        tmpIns = _.extend(tmpIns, commonRule.getCreateCommonDefaultDataRule(session));

        savaExecDatas[exec_seq] = tmpIns;
        exec_seq++;
    });

    _.each(tmpCUD.deleteData, function (d_data) {
        let tmpDel = {"function": "0"}; //0 代表刪除
        tmpDel["table_name"] = mainTableName;
        tmpDel.condition = [];
        //組合where 條件
        _.each(las_keyFields, function (keyField, keyIdx) {
            if (!_.isUndefined(d_data[keyField])) {
                tmpDel.condition.push({
                    key: keyField,
                    operation: "=",
                    value: d_data[keyField]
                });
            }
        });

        savaExecDatas[exec_seq] = tmpDel;
        exec_seq++;
    });

    _.each(tmpCUD.updateData, function (u_data) {
        let tmpEdit = {"function": "2"}; //2  編輯
        tmpEdit["table_name"] = mainTableName;

        _.each(Object.keys(u_data), function (objKey) {
            tmpEdit[objKey] = u_data[objKey];
        });

        tmpEdit = _.extend(tmpEdit, commonRule.getEditDefaultDataRule(session));

        delete tmpEdit["ins_dat"];
        delete tmpEdit["ins_usr"];

        tmpEdit.condition = [];
        let lo_keysData = {};
        //組合where 條件
        _.each(las_keyFields, function (keyField, keyIdx) {
            if (!_.isUndefined(u_data[keyField])) {
                tmpEdit.condition.push({
                    key: keyField,
                    operation: "=",
                    value: u_data[keyField]
                });
                lo_keysData[keyField] = u_data[keyField];
            }

            if (keyField == "athena_id" || keyField == "hotel_cod") {
                tmpEdit.condition.push({
                    key: keyField,
                    operation: "=",
                    value: tmpEdit[keyField]
                });
            }
        });

        savaExecDatas[exec_seq] = tmpEdit;
        exec_seq++;
    });


    return savaExecDatas;
};

/**
 * PMS0830080 分帳規則儲存
 * @param session
 * @param postData
 * @param callback
 */
exports.doSavePMS0830080 = function (session, postData, callback) {
    let lo_userInfo = session.user;
    let lo_createData = postData.createData || {};
    let lo_updateData = postData.updateData || {};
    let la_deleteData = postData.deleteData || [];
    let la_dtCreateData = postData.dt_createData;
    let la_dtUpdateData = postData.dt_updateData;
    let lo_mnData = {}; // 主檔資料(一次儲存只會有一筆)
    let lo_savaExecDatas = {};
    let ln_exec_seq = 1;
    let la_commonCond = [
        {
            key: "athena_id",
            operation: "=",
            value: lo_userInfo.athena_id
        },
        {
            key: "hotel_cod",
            operation: "=",
            value: lo_userInfo.hotel_cod
        }
    ];

    //組合新增資料
    if (_.size(lo_createData) > 0) {
        lo_mnData = lo_createData;
        let tmpCreateData = {"function": "1", "table_name": "route_mn"};
        tmpCreateData = _.extend(tmpCreateData, lo_mnData);
        lo_savaExecDatas[ln_exec_seq] = _.extend(tmpCreateData, ruleAgent.getCreateCommonDefaultDataRule(session));
        ln_exec_seq++;
    }
    //組合編輯資料
    if (_.size(lo_updateData) > 0) {
        lo_mnData = lo_updateData;
        let tmpUpdData = {"function": "2", "table_name": "route_mn"};
        tmpUpdData.condition = JSON.parse(JSON.stringify(la_commonCond));

        tmpUpdData.condition.push({
            key: "route_cod",
            operation: "=",
            value: lo_mnData.route_cod
        });
        tmpUpdData = _.extend(tmpUpdData, {route_cod: lo_mnData.route_cod.trim()});
        lo_savaExecDatas[ln_exec_seq] = _.extend(tmpUpdData, ruleAgent.getEditDefaultDataRule(session));
        delete lo_savaExecDatas[ln_exec_seq]["ins_dat"];
        delete lo_savaExecDatas[ln_exec_seq]["ins_usr"];
        ln_exec_seq++;
    }
    //組合刪除資料
    _.each(la_deleteData, function (delData) {
        let tmpDelData = {"function": "0", "table_name": "route_dt"};
        tmpDelData.condition = JSON.parse(JSON.stringify(la_commonCond));
        tmpDelData.condition.push({
            key: "route_cod",
            operation: "=",
            value: delData.route_cod
        });
        //先刪除dt
        lo_savaExecDatas[ln_exec_seq] = tmpDelData;
        ln_exec_seq++;

        //再刪除mn
        tmpDelData = JSON.parse(JSON.stringify(tmpDelData));
        tmpDelData.table_name = "route_mn";
        lo_savaExecDatas[ln_exec_seq] = tmpDelData;
        ln_exec_seq++;
    });
    //dt 新增資料
    _.each(la_dtCreateData, function (dtCreateData) {
        let tmpCreateData = {"function": "1", "table_name": "route_dt"};
        tmpCreateData = _.extend(tmpCreateData, dtCreateData);
        tmpCreateData["route_cod"] = lo_mnData.route_cod;
        lo_savaExecDatas[ln_exec_seq] = _.extend(tmpCreateData, ruleAgent.getCreateCommonDefaultDataRule(session));
        ln_exec_seq++;
    });
    //dt 編輯資料
    _.each(la_dtUpdateData, function (dtUpdData) {
        let tmpDtUpdData = {"function": "2", "table_name": "route_dt"};
        tmpDtUpdData.condition = JSON.parse(JSON.stringify(la_commonCond));

        tmpDtUpdData.condition.push({
                key: "route_cod",
                operation: "=",
                value: lo_mnData.route_cod
            },
            {
                key: "small_typ",
                operation: "=",
                value: dtUpdData.small_typ
            });
        tmpDtUpdData = _.extend(tmpDtUpdData, dtUpdData);
        tmpDtUpdData["route_cod"] = lo_mnData.route_cod;
        lo_savaExecDatas[ln_exec_seq] = _.extend(tmpDtUpdData, ruleAgent.getEditDefaultDataRule(session));
        ln_exec_seq++;
    });

    let apiParams = {
        "REVE-CODE": "BAC03009010000",
        "program_id": "PMS0830080",
        "user": lo_userInfo.usr_id,
        "count": Object.keys(lo_savaExecDatas).length,
        "exec_data": lo_savaExecDatas
    };

    tools.requestApi(go_sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
        let err = null;
        let success = true;
        if (apiErr || !data) {
            success = false;
            err = {};
            err.errorMsg = apiErr;
        } else if (data["RETN-CODE"] != "0000") {
            success = false;
            err = {};
            console.error(data["RETN-CODE-DESC"]);
            err.errorMsg = "save error!";
        }
        callback(err, success);
    });

};

/**
 * PMS0830070 虛擬帳單項目設定
 * @param session
 * @param postData
 * @param callback
 */
exports.doSavePMS0830070 = function (session, postData, callback) {
    let lo_userInfo = session.user;
    let lo_createData = postData.createData || {};
    let lo_updateData = postData.updateData || {};
    let la_deleteData = postData.deleteData || [];
    let la_dtCreateData = postData.dt_createData || [];
    let la_dtUpdateData = postData.dt_updateData || [];
    let la_dtDeleteData = postData.dt_deleteData || [];
    let la_dt2CreateData = postData.dt2_createData || [];
    // let la_dt2UpdateData = postData.dt2_updateData || [];
    let la_dt2DeleteData = postData.dt2_deleteData || [];
    let lo_mnData = {}; // 主檔資料(一次儲存只會有一筆)
    let lo_savaExecDatas = {};
    let ln_exec_seq = 1;
    let la_commonCond = [
        {
            key: "athena_id",
            operation: "=",
            value: lo_userInfo.athena_id
        },
        {
            key: "hotel_cod",
            operation: "=",
            value: lo_userInfo.hotel_cod
        }
    ];

    //組合新增資料
    if (_.size(lo_createData) > 0) {
        lo_mnData = lo_createData;
        // delete lo_mnData["hc_adjfolio_dt"];
        // delete lo_mnData["hc_adjfolio_dt2"];
        let tmpCreateData = {"function": "1", "table_name": "hc_adjfolio_mn"};
        tmpCreateData = _.extend(tmpCreateData, lo_mnData);
        lo_savaExecDatas[ln_exec_seq] = _.extend(tmpCreateData, commonRule.getCreateCommonDefaultDataRule(session));
        ln_exec_seq++;
    }
    //組合編輯資料
    if (_.size(lo_updateData) > 0) {
        lo_mnData = lo_updateData;
        let tmpUpdData = {"function": "2", "table_name": "hc_adjfolio_mn"};
        tmpUpdData.condition = _.clone(la_commonCond);
        tmpUpdData.condition.push({
            key: "adjfolio_cod",
            operation: "=",
            value: lo_mnData.adjfolio_cod
        });
        tmpUpdData = _.extend(tmpUpdData, {adjfolio_rmk: lo_mnData.adjfolio_rmk.trim()});
        lo_savaExecDatas[ln_exec_seq] = _.extend(tmpUpdData, commonRule.getEditDefaultDataRule(session));
        ln_exec_seq++;
    }
    //組合刪除資料
    _.each(la_deleteData, function (delData) {
        //先刪除dt2
        let tmpDelData = {"function": "0", "table_name": "hc_adjfolio_dt2"};
        tmpDelData.condition = _.clone(la_commonCond);
        tmpDelData.condition.push({
            key: "adjfolio_cod",
            operation: "=",
            value: delData.adjfolio_cod
        });
        lo_savaExecDatas[ln_exec_seq] = tmpDelData;
        ln_exec_seq++;

        //先刪除dt
        tmpDelData = _.clone(tmpDelData);
        tmpDelData.table_name = "hc_adjfolio_dt";
        lo_savaExecDatas[ln_exec_seq] = tmpDelData;
        ln_exec_seq++;

        //再刪除mn
        tmpDelData = _.clone(tmpDelData);
        tmpDelData.table_name = "hc_adjfolio_mn";
        lo_savaExecDatas[ln_exec_seq] = tmpDelData;
        ln_exec_seq++;
    });


    //dt 刪除資料
    _.each(la_dtDeleteData, function (lo_dtDeleteData) {
        //先刪除dt2
        let dt2DelData = {"function": "0", "table_name": "hc_adjfolio_dt2"};
        dt2DelData.condition = _.clone(la_commonCond);
        dt2DelData.condition.push(
            {
                key: "adjfolio_cod",
                operation: "=",
                value: lo_mnData.adjfolio_cod
            },
            {
                key: "seq_nos",
                operation: "=",
                value: lo_dtDeleteData.seq_nos
            });
        lo_savaExecDatas[ln_exec_seq] = dt2DelData;
        ln_exec_seq++;

        //刪除dt資料
        let dtDelData = {"function": "0", "table_name": "hc_adjfolio_dt"};
        dtDelData.condition = _.clone(la_commonCond);
        dtDelData.condition.push(
            {
                key: "adjfolio_cod",
                operation: "=",
                value: lo_mnData.adjfolio_cod
            },
            {
                key: "seq_nos",
                operation: "=",
                value: lo_dtDeleteData.seq_nos
            });
        lo_savaExecDatas[ln_exec_seq] = dtDelData;
        ln_exec_seq++;
    });
    //dt 新增資料
    _.each(la_dtCreateData, function (lo_dtCreateData) {
        let dtCreateData = {"function": "1", "table_name": "hc_adjfolio_dt"};
        dtCreateData = _.extend(dtCreateData, lo_dtCreateData);
        dtCreateData["adjfolio_cod"] = lo_mnData.adjfolio_cod;
        lo_savaExecDatas[ln_exec_seq] = _.extend(dtCreateData, commonRule.getCreateCommonDefaultDataRule(session));
        ln_exec_seq++;
    });
    //dt 編輯資料
    _.each(la_dtUpdateData, function (lo_dtUpdateData) {
        let dtUpdateData = {"function": "2", "table_name": "hc_adjfolio_dt"};
        dtUpdateData.condition = _.clone(la_commonCond);
        dtUpdateData.condition.push({
                key: "adjfolio_cod",
                operation: "=",
                value: lo_mnData.adjfolio_cod
            },
            {
                key: "seq_nos",
                operation: "=",
                value: lo_dtUpdateData.seq_nos
            });
        dtUpdateData = _.extend(dtUpdateData, lo_dtUpdateData);
        lo_savaExecDatas[ln_exec_seq] = _.extend(dtUpdateData, commonRule.getEditDefaultDataRule(session));
        ln_exec_seq++;
    });

    //dt2 刪除資料
    _.each(la_dt2DeleteData, function (lo_dt2DeleteData) {
        let dt2DelData = {"function": "0", "table_name": "hc_adjfolio_dt2"};
        dt2DelData.condition = _.clone(la_commonCond);
        dt2DelData.condition.push(
            {
                key: "adjfolio_cod",
                operation: "=",
                value: lo_mnData.adjfolio_cod
            },
            {
                key: "seq_nos",
                operation: "=",
                value: lo_dt2DeleteData.seq_nos
            },
            {
                key: "item_nos",
                operation: "=",
                value: lo_dt2DeleteData.item_nos
            });
        lo_savaExecDatas[ln_exec_seq] = dt2DelData;
        ln_exec_seq++;
    });
    //dt2 新增資料
    _.each(la_dt2CreateData, function (lo_dt2CreateData) {
        let dt2CreateData = {"function": "1", "table_name": "hc_adjfolio_dt2"};
        dt2CreateData = _.extend(dt2CreateData, lo_dt2CreateData);
        dt2CreateData["athena_id"] = session.user.athena_id;
        dt2CreateData["hotel_cod"] = session.user.fun_hotel_cod;
        lo_savaExecDatas[ln_exec_seq] = _.extend(dt2CreateData, commonRule.getCreateCommonDefaultDataRule(session));
        ln_exec_seq++;
    });


    let apiParams = {
        "REVE-CODE": "BAC03009010000",
        "program_id": "PMS0830070",
        "user": lo_userInfo.usr_id,
        "count": Object.keys(lo_savaExecDatas).length,
        "exec_data": lo_savaExecDatas
    };

    // return callback(null, true);
    tools.requestApi(go_sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
        let err = null;
        let success = true;
        if (apiErr || !data) {
            success = false;
            err = {};
            err.errorMsg = apiErr;
        } else if (data["RETN-CODE"] != "0000") {
            success = false;
            err = {};
            console.error(data["RETN-CODE-DESC"]);
            err.errorMsg = "save error!";
        }
        callback(err, success);
    });

};

/**
 * 執行作業儲存
 */
exports.execProcSQL = async function (postData, session) {
    let lo_saveProc = saveDataModule.factory("oldSaveFormat");
    lo_saveProc.setParams(postData, session);
    try {
        let lo_result = await lo_saveProc.execSaveProc();
        return {success: true, errorMsg: ""};
    }
    catch (err) {
        let ls_errorMsg = err.errorMsg || err.message;
        return {success: false, errorMsg: ls_errorMsg};
    }
};

exports.execNewFormatSQL = async function (postData, session) {
    let lo_saveProc = saveDataModule.factory("newSaveFormat");
    lo_saveProc.setParams(postData, session);
    try {
        let lo_result = await lo_saveProc.execSaveProc();
        return {success: true, errorMsg: ""};
    }
    catch (err) {
        let ls_errorMsg = err.errorMsg || err.message;
        return {success: false, errorMsg: ls_errorMsg};
    }
};

