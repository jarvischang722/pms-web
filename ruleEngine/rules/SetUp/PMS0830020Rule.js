/**
 * Created by a16010 on 2017/5/11.
 * 程式代碼: PMS0830020, 服務種類設定
 */

var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var ruleRootPath = appRootDir+"/ruleEngine/";
var queryAgent = require(appRootDir+'/plugins/kplug-oracle/QueryAgent');
var commandRules = require("./../CommonRule");
var ReturnClass = require(ruleRootPath+"/returnClass");
var ErrorClass = require(ruleRootPath+"/errorClass");

module.exports = {
    chkUsetyp: function (postData, session, callback){
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params = {
            athena_id: session.user.athena_id,
            modify_sta: postData.singleRowData.modify_sta
        };

        var createSubFunc = [];
        var isDeleteRow = false;
    },

    chkSourcerfModifysta: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params = {
            athena_id: session.user.athena_id,
            source_grp: postData.singleRowData.source_grp
        };

        var createSubFunc = [];
        var isDeleteRow = false;

        createSubFunc.push(
            function (callback) {
                async.waterfall([
                    function (callback) {
                        var modifySta = postData.singleRowData.modify_sta.trim();
                        if (modifySta == "N") {
                            isDeleteRow = false;
                            callback(null, isDeleteRow);
                        } else {
                            isDeleteRow = true;
                            callback(null, isDeleteRow);
                        }
                    },
                    function (data, callback) {
                        queryAgent.query("GET_ORDER_MN.GUEST_TYP_COUNT".toUpperCase(), params, function (err, guestData) {
                            if (!err) {
                                if (data == true) {
                                    if (guestData.guest_count > 0) {
                                        isDeleteRow = false;
                                        callback(null, isDeleteRow);
                                    } else {
                                        isDeleteRow = true;
                                        callback(null, isDeleteRow);
                                    }
                                } else {
                                    callback(null, data);
                                }
                            } else {
                                callback(err, []);
                            }
                        })
                    }, function (data, callback) {
                        queryAgent.query("GET_GW_CUST_RF.DEFAULT_GUEST_TYP_COUNT".toUpperCase(), params, function (err, guestData) {
                            if (!err) {
                                if (data == true) {
                                    if (guestData.guest_count > 0) {
                                        isDeleteRow = false;
                                        callback(null, isDeleteRow);
                                    } else {
                                        isDeleteRow = true;
                                        callback(null, isDeleteRow);
                                    }
                                } else {
                                    callback(null, data);
                                }
                            } else {
                                callback(err, []);
                            }
                        })
                    }
                    // , function (data, callback) {  SAM 等待星光大哥確認package
                    //
                    // }
                ], function (errMsg, result) {
                    if (errMsg == null) {

                        if (result == false) {
                            lo_error = new ErrorClass();
                            lo_result.success = false;
                            lo_error.errorCod = "1111";
                            lo_error.errorMsg = "已經有使用到此類別，不能刪除";
                        }

                        callback(lo_error, lo_result);

                    } else {
                        callback(lo_error, lo_result);
                    }
                })
            }
        );

        async.parallel(createSubFunc, function (err, result) {
            callback(err, result);
        })
    }
}