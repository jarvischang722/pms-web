/**
 * Created by Jun Chang on 2017/2/10.
 */

var tools = require("../utils/commonTools");
var _ = require("underscore");
var sysConfig = require("../configs/SystemConfig");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var i18n = require("i18n");

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
                    if (data["SYSMSG"]["MSG-ID"] == "0000" && data["RETN-CODE"] != '0000') {
                        success = false;
                        errorMsg = i18n.__("table_in_use", data["RETN-CODE-DESC"]);
                    }
                }

                callback(errorMsg, success);
            })
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
                    if (data["SYSMSG"]["MSG-ID"] == "0000" && data["RETN-CODE"] != '0000') {
                        success = false;
                        errorMsg = i18n.__("table_in_use", data["RETN-CODE-DESC"]);
                    }
                }

                callback(errorMsg, success);
            })

        });
    } catch (err) {
        callback(err, false);
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
                if (data["SYSMSG"]["MSG-ID"] == "0000" && data["RETN-CODE"] != '0000') {
                    success = false;
                    errorMsg = data["RETN-CODE-DESC"] || "";
                }
            }

            callback(errorMsg, success);
        })
    } catch (err) {
        callback(err, false);
    }

};