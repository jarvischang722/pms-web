/**
 * Created by Jun Chang on 2017/2/10.
 */

var tools = require("../utils/commonTools");
var _ = require("underscore");
var sysConfig = require("../configs/SystemConfig");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');

/**
 *
 * @param prg_id{String} : 程式編號
 * @param table_name{String}: lock的table
 * @param user_id{String} : 使用者編號
 * @param lock_type{String} : 上鎖類別 T: table | R:recode
 * @param key_cod {String} : recode 才會有
 * @param athena_id {String} : ATHENA_ID
 * @param socket_id {String} : socket_id
 * @param callback{function} : 回調函數
 */
exports.doTableLock = function (prg_id, table_name, user_id, lock_type, key_cod, athena_id, socket_id, callback) {
    try {
        var REVE_CODE = "0200930010";
        queryAgent.query("QRY_CONN_SESSION", {}, function (err, session) {
            var params = {
                "REVE-CODE": REVE_CODE,
                "program_id": prg_id,
                "table_name": table_name,
                "key_cod": _.isUndefined(key_cod) ? "" : key_cod,
                "user": user_id,
                "type": lock_type,
                "session_id":  "1111",
                "athena_id": athena_id,
                "socket_id": socket_id
            };

            tools.requestApi(sysConfig.api_url, params, function (err, res, data) {
                var success = true;
                var errorMsg = null;
                if (err) {
                    success = false;
                    errorMsg = err;
                }

                if (!err && data["RETN-CODE"] != '0000') {
                    success = false;
                    errorMsg = data["RETN-CODE-DESC"];
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
 * @param user_id{String} : 使用者編號
 * @param lock_type{String} : 上鎖類別 T: table | R:recode
 * @param key_cod {String} : recode 才會有
 * @param athena_id {String} : ATHENA_ID
 * @param socket_id {String} : socket_id
 * @param callback{function} : 回調函數
 */
exports.doTableUnLock = function (prg_id, table_name, user_id, lock_type, key_cod, athena_id, socket_id, callback) {
    try {
        var REVE_CODE = "0200930011";
        queryAgent.query("QRY_CONN_SESSION", {}, function (err, session) {

            var params = {
                "REVE-CODE": REVE_CODE,
                "program_id": prg_id,
                "table_name": table_name,
                "key_cod": _.isUndefined(key_cod) ? "" : key_cod,
                "user": user_id,
                "type": lock_type,
                "session_id": "1111",
                "athena_id": athena_id,
                "socket_id": socket_id
            };

            tools.requestApi(sysConfig.api_url, params, function (err, res, data) {
                var success = true;
                var errorMsg = null;
                if (err) {
                    success = false;
                    errorMsg = err;
                }

                if (!err && data["RETN-CODE"] != '0000') {
                    success = false;
                    errorMsg = data["RETN-CODE-DESC"] || "";
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
            }

            if (!err && data["RETN-CODE"] != '0000') {
                success = false;
                errorMsg = data["RETN-CODE-DESC"] || "";
            }

            callback(errorMsg, success);
        })
    } catch (err) {
        callback(err, false);
    }

};