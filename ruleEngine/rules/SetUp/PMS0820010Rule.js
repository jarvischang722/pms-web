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

        var lb_isDefault = (postData.rowData.sys_default == "Y") ? false : true;
        if (lb_isDefault == false) {

            lo_result.success = false;
            lo_error = new ErrorClass();
            lo_error.errorMsg = "系統預設,不可異動";
            lo_error.errorCod = "1111";
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

        var params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.fun_hotel_cod,
            character_cod: postData.singleRowData.character_cod
        };

        var lb_isDefault = postData.singleRowData.sys_default == "Y" ? false:true;

        if (lb_isDefault == false) {

            lo_result.success = false;
            lo_error = new ErrorClass();
            lo_error.errorMsg = "系統預設,不可異動";
            lo_error.errorCod = "1111";
        }

        async.waterfall([
            function (callback) {
                //房間設定
                queryAgent.query("CHK_ROOM_MN_ISEXIST_CHARACTER_COD", params, function (err, guestData) {
                    if (!err) {
                        if (guestData.character_cod_count > 0) {
                            isDeleteRow = false;
                            callback(null, isDeleteRow);
                        } else {
                            isDeleteRow = true;
                            callback(null, isDeleteRow);
                        }
                    } else {
                        callback(err, lo_result);
                    }
                })
            },
            function (deleteResult, callback) {
                //查詢滾房租日
                queryAgent.query("CHK_EDIT_RVEMCOD_RF_DAT", {athena_id: params.athena_id}, function (err, getResult) {
                    if (getResult) {
                        var belong_dat = getResult.belong_dat;
                        params.belong_dat = belong_dat.trim();
                        queryAgent.query("CHK_ORDER_DT_ISEXIST", params, function (err, chkResult) {
                            if (chkResult) {
                                if (chkResult.order_dt_count > 0) {
                                    isDeleteRow = false;
                                    callback('訂房卡已使用,不可刪除', isDeleteRow);
                                } else {
                                    if (isDeleteRow && deleteResult)
                                        isDeleteRow = true;
                                    else {
                                        isDeleteRow = false;
                                    }
                                    callback(null, isDeleteRow);
                                }
                            }
                            else {
                                callback(null, deleteResult);
                            }


                        })
                    } else {
                        callback(err, deleteResult);
                    }
                });
            }
        ], function (errMsg, result) {
            if (errMsg == null) {

                if (result == false) {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorCod = "1111";
                    lo_error.errorMsg = "房間設定已使用,不可刪除";
                }

                callback(lo_error, lo_result);

            } else {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorCod = "1111";
                lo_error.errorMsg = errMsg;
                callback(lo_error, lo_result);
            }
        })


    }
}