/**
 * Created by Jun Chang on 2017/2/10.
 */

var tools = require("../utils/CommonTools");
var _ = require("underscore");
var sysConfig = require("../configs/SystemConfig");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var i18n = require("i18n");
var logSvc = require("./LogService");
var mailSvc = require("./MailService");
var langSvc = require("./LangService");
var ruleAgent = require("../ruleEngine/ruleAgent");
var moment = require("moment");
var go_sysConf = require("../configs/SystemConfig");
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
            var params = {
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

            tools.requestApi(sysConfig.api_url, params, function (err, res, data) {
                var success = true;
                var errorMsg = null;
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

            var params = {
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

            tools.requestApi(sysConfig.api_url, params, function (err, res, data) {
                var success = true;
                var errorMsg = null;
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

            var params = {
                "REVE-CODE": REVE_CODE,
                "socket_id": socket_id
            };

            tools.requestApi(sysConfig.api_url, params, function (err, res, data) {
                var success = true;
                var errorMsg = null;
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
        var REVE_CODE = "BAC09008030000";
        tools.requestApi(sysConfig.api_url, {"REVE-CODE": REVE_CODE}, function (err, res, data) {
            var success = true;
            var errorMsg = null;
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
    var savaExecDatas = this.combineExecData(formData.fieldData, formData.tmpCUD, session, formData.mainTableName);
    var prg_id = formData.prg_id;
    var userInfo = session.user;
    var apiParams = {
        "REVE-CODE": "BAC03009010000",
        "program_id": prg_id,
        "user": userInfo.usr_id,
        "count": Object.keys(savaExecDatas).length,
        "exec_data": savaExecDatas
    };
    if (_.size(savaExecDatas) > 0) {
        tools.requestApi(sysConfig.api_url, apiParams, function (apiErr, apiRes, data) {
            var success = true;
            var errMsg = null;
            var log_id = moment().format("YYYYMMDDHHmmss");
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
    } else {
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
    var savaExecDatas = {};
    var exec_seq = 1;
    var userInfo = session.user;
    var las_keyFields = _.pluck(_.where(fieldData, {keyable: 'Y'}), "ui_field_name");
    if (!tmpCUD) {
        tmpCUD = {};
    }
    _.each(tmpCUD.createData, function (c_data) {
        var tmpIns = {"function": "1"}; //1  新增
        tmpIns["table_name"] = mainTableName;

        try {
            c_data = handleDateFormat(fieldData, c_data);
        }
        catch (err) {

        }

        _.each(Object.keys(c_data), function (objKey) {
            tmpIns[objKey] = c_data[objKey];
        });

        tmpIns = _.extend(tmpIns, ruleAgent.getCreateCommonDefaultDataRule(session));

        savaExecDatas[exec_seq] = tmpIns;
        exec_seq++;
    });

    _.each(tmpCUD.deleteData, function (d_data) {
        var tmpDel = {"function": "0"}; //0 代表刪除
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
        var tmpEdit = {"function": "2"}; //2  編輯
        tmpEdit["table_name"] = mainTableName;

        _.each(Object.keys(u_data), function (objKey) {
            tmpEdit[objKey] = u_data[objKey];
        });

        tmpEdit = _.extend(tmpEdit, ruleAgent.getEditDefaultDataRule(session));

        delete tmpEdit["ins_dat"];
        delete tmpEdit["ins_usr"];

        tmpEdit.condition = [];
        var lo_keysData = {};
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
    let lo_mnData = {};  // 主檔資料(一次儲存只會有一筆)
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
        ;
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
        ;
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

    tools.requestApi(go_sysConf.api_url, apiParams, function (apiErr, apiRes, data) {
        var err = null;
        var success = true;
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
    let la_dt2CreateData = postData.dt2_createData || [];
    let la_dt2UpdateData = postData.dt2_updateData || [];
    let lo_mnData = {};  // 主檔資料(一次儲存只會有一筆)
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
        delete lo_mnData["hc_adjfolio_dt"];
        delete lo_mnData["hc_adjfolio_dt2"];
        let tmpCreateData = {"function": "1", "table_name": "hc_adjfolio_mn"};
        tmpCreateData = _.extend(tmpCreateData, lo_mnData);
        lo_savaExecDatas[ln_exec_seq] = _.extend(tmpCreateData, ruleAgent.getCreateCommonDefaultDataRule(session));
        ln_exec_seq++;
    }
    //組合編輯資料
    if (_.size(lo_updateData) > 0) {
        lo_mnData = lo_updateData;
        let tmpUpdData = {"function": "2", "table_name": "hc_adjfolio_mn"};
        tmpUpdData.condition = JSON.parse(JSON.stringify(la_commonCond));
        tmpUpdData.condition.push({
            key: "adjfolio_cod",
            operation: "=",
            value: lo_mnData.adjfolio_cod
        });
        tmpUpdData = _.extend(tmpUpdData, {adjfolio_rmk: lo_mnData.adjfolio_rmk.trim()});
        lo_savaExecDatas[ln_exec_seq] = _.extend(tmpUpdData, ruleAgent.getEditDefaultDataRule(session));
        delete lo_savaExecDatas[ln_exec_seq]["ins_dat"];
        delete lo_savaExecDatas[ln_exec_seq]["ins_usr"];
        ln_exec_seq++;
    }
    //組合刪除資料
    _.each(la_deleteData, function (delData) {
        //先刪除dt2
        let tmpDelData = {"function": "0", "table_name": "hc_adjfolio_dt2"};
        tmpDelData.condition = JSON.parse(JSON.stringify(la_commonCond));
        tmpDelData.condition.push({
                key: "adjfolio_cod",
                operation: "=",
                value: delData.adjfolio_cod
            }
        );

        lo_savaExecDatas[ln_exec_seq] = tmpDelData;
        ln_exec_seq++;

        //先刪除dt
        tmpDelData = JSON.parse(JSON.stringify(tmpDelData));
        tmpDelData.table_name = "hc_adjfolio_dt";

        lo_savaExecDatas[ln_exec_seq] = tmpDelData;
        ln_exec_seq++;

        //再刪除mn
        tmpDelData = JSON.parse(JSON.stringify(tmpDelData));
        tmpDelData.table_name = "hc_adjfolio_mn";
        lo_savaExecDatas[ln_exec_seq] = tmpDelData;
        ln_exec_seq++;
    });
    //dt 新增資料
    for (var i = 0; i < la_dtCreateData.length; i++) {
        let tmpCreateData = {"function": "1", "table_name": "hc_adjfolio_dt"};
        tmpCreateData = _.extend(tmpCreateData, la_dtCreateData[i]);
        tmpCreateData["adjfolio_cod"] = lo_mnData.adjfolio_cod;
        lo_savaExecDatas[ln_exec_seq] = _.extend(tmpCreateData, ruleAgent.getCreateCommonDefaultDataRule(session));
        ln_exec_seq++;
    }
    //dt 編輯資料
    for (var i = 0; i < la_dtUpdateData.length; i++) {

        let tmpDtUpdData = {"function": "2", "table_name": "hc_adjfolio_dt"};

        if(la_dtUpdateData[i].deleted == "true" && la_dtUpdateData[i].edited == "true"){    //刪除DT
            tmpDtUpdData.function = "0";
            tmpDtUpdData.condition = JSON.parse(JSON.stringify(la_commonCond));
            tmpDtUpdData.condition.push({
                    key: "adjfolio_cod",
                    operation: "=",
                    value: lo_mnData.adjfolio_cod
                },
                {
                    key: "seq_nos",
                    operation: "=",
                    value: la_dtUpdateData[i].seq_nos
                });
            tmpDtUpdData = _.extend(tmpDtUpdData, la_dtUpdateData[i]);
            lo_savaExecDatas[ln_exec_seq] = _.extend(tmpDtUpdData, ruleAgent.getEditDefaultDataRule(session));
            ln_exec_seq++;

            let tmpDtUpdDataDt2 = {"function": "0", "table_name": "hc_adjfolio_dt2"};

            tmpDtUpdDataDt2.condition = JSON.parse(JSON.stringify(la_commonCond));
            tmpDtUpdDataDt2.condition.push({
                    key: "adjfolio_cod",
                    operation: "=",
                    value: lo_mnData.adjfolio_cod
                },
                {
                    key: "seq_nos",
                    operation: "=",
                    value: la_dtUpdateData[i].seq_nos
                });
            tmpDtUpdDataDt2 = _.extend(tmpDtUpdDataDt2, la_dtUpdateData[i]);
            lo_savaExecDatas[ln_exec_seq] = _.extend(tmpDtUpdDataDt2, ruleAgent.getEditDefaultDataRule(session));
            ln_exec_seq++;

        }else if(la_dtUpdateData[i].deleted == "false" && la_dtUpdateData[i].created == "true"){    //新增DT
            tmpDtUpdData.function = "1";
            tmpDtUpdData = _.extend(tmpDtUpdData, la_dtUpdateData[i]);
            tmpDtUpdData["adjfolio_cod"] = lo_mnData.adjfolio_cod;
            lo_savaExecDatas[ln_exec_seq] = _.extend(tmpDtUpdData, ruleAgent.getEditDefaultDataRule(session));
            ln_exec_seq++;

        }else  if(la_dtUpdateData[i].deleted == "false" && la_dtUpdateData[i].edited == "true"){    //更新DT
            tmpDtUpdData.function = "2";
            tmpDtUpdData.condition = JSON.parse(JSON.stringify(la_commonCond));
            tmpDtUpdData.condition.push({
                    key: "adjfolio_cod",
                    operation: "=",
                    value: lo_mnData.adjfolio_cod
                },
                {
                    key: "seq_nos",
                    operation: "=",
                    value: la_dtUpdateData[i].seq_nos
                });
            tmpDtUpdData = _.extend(tmpDtUpdData, la_dtUpdateData[i]);
            tmpDtUpdData["item_nam"] = la_dtUpdateData[i].item_nam;
            lo_savaExecDatas[ln_exec_seq] = _.extend(tmpDtUpdData, ruleAgent.getEditDefaultDataRule(session));
            ln_exec_seq++;
        }
    }
    //dt2 新增資料
    for (var i = 0; i < la_dt2CreateData.length; i++) {
        let tmpCreateData = {"function": "1", "table_name": "hc_adjfolio_dt2"};
        tmpCreateData = _.extend(tmpCreateData, la_dt2CreateData[i]);
        tmpCreateData["adjfolio_cod"] = lo_mnData.adjfolio_cod;
        tmpCreateData["athena_id"] = session.user.athena_id;
        tmpCreateData["hotel_cod"] = session.user.fun_hotel_cod;
        delete tmpCreateData["item_sna"];
        delete tmpCreateData["checked"];
        delete tmpCreateData["disabled"];
        lo_savaExecDatas[ln_exec_seq] = tmpCreateData;
        ln_exec_seq++;
    }
    //dt 編輯資料
    for (var i = 0; i < la_dt2UpdateData.length; i++) {
        //先刪除dt2
        let tmpDelData = {"function": "0", "table_name": "hc_adjfolio_dt2"};

        if(la_dt2UpdateData[i].check == "false" && la_dt2UpdateData[i].checked == "true"){

            tmpDelData.condition = JSON.parse(JSON.stringify(la_commonCond));
            tmpDelData.condition.push(
                {
                    key: "adjfolio_cod",
                    operation: "=",
                    value: lo_mnData.adjfolio_cod
                },
                {
                    key: "item_nos",
                    operation: "=",
                    value: la_dt2UpdateData[i].item_nos
                },
                {
                    key: "seq_nos",
                    operation: "=",
                    value: la_dt2UpdateData[i].seq_nos
                }
            );

            lo_savaExecDatas[ln_exec_seq] = tmpDelData;
            ln_exec_seq++;
        }else {
            let tmpCreateData = {"function": "1", "table_name": "hc_adjfolio_dt2"};
            tmpCreateData = _.extend(tmpCreateData, la_dt2UpdateData[i]);
            tmpCreateData["adjfolio_cod"] = lo_mnData.adjfolio_cod;
            tmpCreateData["athena_id"] = session.user.athena_id;
            tmpCreateData["hotel_cod"] = session.user.fun_hotel_cod;
            delete tmpCreateData["item_sna"];
            delete tmpCreateData["checked"];
            delete tmpCreateData["disabled"];

            lo_savaExecDatas[ln_exec_seq] = tmpCreateData;
            ln_exec_seq++;
        }
    };

    let apiParams = {
        "REVE-CODE": "BAC03009010000",
        "program_id": "PMS0830070",
        "user": lo_userInfo.usr_id,
        "count": Object.keys(lo_savaExecDatas).length,
        "exec_data": lo_savaExecDatas
    };

    tools.requestApi(go_sysConf.api_url, apiParams, function (apiErr, apiRes, data) {
        var err = null;
        var success = true;
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