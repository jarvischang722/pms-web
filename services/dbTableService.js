/**
 * Created by Jun Chang on 2017/2/10.
 */

var tools = require("../utils/commonTools");
var _ = require("underscore");
var sysConfig = require("../configs/SystemConfig");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var i18n = require("i18n");
var logSvc = require("./logService");
var mailSvc = require("./mailService");
var langSvc = require("./langService");
var ruleAgent = require("../ruleEngine/ruleAgent");
var moment = require("moment");

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
        let REVE_CODE = "0200930010";
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
                if (err) {
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
        let user_id = userInfo.usr_id;
        let athena_id = userInfo.athena_id;
        let hotel_cod = userInfo.fun_hotel_cod;
        let REVE_CODE = "0200930011";
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
                if (err) {
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
 * unlock 全部
 * @param callback
 */
exports.doTableAllUnLock = function (callback) {
    try {
        var REVE_CODE = "0200930012";
        tools.requestApi(sysConfig.api_url, {"REVE-CODE": REVE_CODE}, function (err, res, data) {
            var success = true;
            var errorMsg = null;
            if (err) {
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
    var savaExecDatas = this.combineExecData(formData.fieldData,formData.tmpCUD,session,formData.mainTableName) ;
    var prg_id = formData.prg_id;
    var userInfo = session.user;
    var apiParams = {
        "REVE-CODE": "0300901000",
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
exports.combineExecData = function(fieldData,tmpCUD,session,mainTableName){
    var savaExecDatas = {};
    var exec_seq = 1;
    var userInfo = session.user;
    var las_keyFields = _.pluck(_.where(fieldData,{keyable: 'Y'}),"ui_field_name");
    _.each(tmpCUD.createData,function(c_data){
        var tmpIns = {"function": "1"}; //1  新增
        tmpIns["table_name"] = mainTableName;

        c_data = handleDateFormat(fieldData, c_data);

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
        tmpEdit["athena_id"] = userInfo.athena_id;
        tmpEdit["hotel_cod"] = userInfo.fun_hotel_cod;

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
        });

        savaExecDatas[exec_seq] = tmpEdit;
        exec_seq++;
    });


    return savaExecDatas;
};