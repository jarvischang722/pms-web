/**
 * Created by a16010 on 2017/5/25.
 * 程式代碼: PMS0820010, 房間特色設定
 */

var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var ruleRootPath = appRootDir + "/ruleEngine/";
var queryAgent = require(appRootDir + '/plugins/kplug-oracle/QueryAgent');
var commandRules = require("./../CommonRule");
var ReturnClass = require(ruleRootPath + "/returnClass");
var ErrorClass = require(ruleRootPath + "/errorClass");

module.exports = {
    chk_Character_rf_Character_nam: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;

        var lb_isDefault = (postData.rowData.sys_default == "Y") ? true : false;
        if (lb_isDefault) {
            lo_result.success = false;
            lo_error = new ErrorClass();
            lo_error.errorMsg = commandRules.getMsgByCod("pms81msg29", session.locale);
            if (postData.oldValue != "") {
                postData.rowData.character_nam = postData.oldValue;
                lo_result.effectValues = postData.rowData;
            }
        }
        callback(lo_error, lo_result);
    },
    chk_character_rf_del: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var isDeleteRow = false;
        let ls_errCod;

        var params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.fun_hotel_cod,
            character_cod: postData.singleRowData.character_cod
        };

        async.waterfall([
            function (callback) {
                var lb_isDefault = postData.singleRowData.sys_default == "Y" ? true : false;
                if (lb_isDefault) {
                    isDeleteRow = false;
                    ls_errCod = "pms81msg18";
                } else {
                    isDeleteRow = true;
                }
                callback(null, isDeleteRow);
            },
            function (deleteResult, callback) {
                if (deleteResult) {
                    //房間設定
                    queryAgent.query("CHK_ROOM_MN_ISEXIST_CHARACTER_COD", params, function (err, guestData) {
                        if (!err) {
                            if (guestData.character_cod_count > 0) {
                                isDeleteRow = false;
                                ls_errCod = "pms82msg1";
                            } else {
                                isDeleteRow = true;
                            }
                            callback(null, isDeleteRow);
                        } else {
                            callback(err, lo_result);
                        }
                    });
                } else {
                    callback(null, deleteResult);
                }
            },
            function (deleteResult, callback) {
                if (deleteResult) {
                    //查詢滾房租日
                    queryAgent.query("CHK_EDIT_RVEMCOD_RF_DAT", {athena_id: params.athena_id}, function (err, getResult) {
                        if (!err) {
                            if (getResult) {
                                var belong_dat = getResult.belong_dat;
                                params.belong_dat = belong_dat.trim();
                                queryAgent.query("CHK_ORDER_DT_ISEXIST", params, function (err, chkResult) {
                                    if (chkResult) {
                                        if (chkResult.order_dt_count > 0) {
                                            isDeleteRow = false;
                                            ls_errCod = "pms82msg2";
                                        } else {
                                            isDeleteRow = true;
                                        }
                                        callback(null, isDeleteRow);
                                    }
                                    else {
                                        callback(null, deleteResult);
                                    }
                                });
                            } else {
                                callback(err, deleteResult);
                            }

                        } else {
                            callback(err, lo_result);
                        }
                    });
                }
                else {
                    callback(null, deleteResult);
                }
            }
        ], function (errMsg, result) {
            if (errMsg == null) {
                if (result == false) {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = commandRules.getMsgByCod(ls_errCod, session.locale);
                }
            }
            callback(lo_error, lo_result);
        });
    }
}