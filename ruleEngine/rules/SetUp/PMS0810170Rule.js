/**
 * Created by a16009 on 2017/6/16.
 * 程式代碼: PMS0810170, 假日類別設定
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
    chk_holiday_kind_rf_is_exist_holiday_rf: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var isDeleteRow = false;

        var lb_isDefault = postData.singleRowData.sys_default == "Y" ? false : true;

        var params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.fun_hotel_cod,
            day_sta: postData.singleRowData.day_sta
        };

        if (lb_isDefault == false) {
            lo_result.success = false;
            lo_error = new ErrorClass();
            lo_error.errorMsg = "系統預設,不可異動";
            lo_error.errorCod = "1111";
        }

        async.waterfall([
            function (callback) {
                //取得假日類別設定數量
                queryAgent.query("QRY_HOLIDAY_RF_NUM", params, function (err, holidayData) {
                    if (!err) {
                        if (holidayData.count > 0) {
                            isDeleteRow = false;
                            callback(null, isDeleteRow);
                        } else {
                            isDeleteRow = true;
                            callback(null, isDeleteRow);
                        }
                    } else {
                        callback(err, lo_result);
                    }
                });
            }
            ], function (errMsg, result) {
                if (errMsg == null) {

                    if (result == false) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorCod = "1111";
                        lo_error.errorMsg = "假日日期設定有用到,不可刪除";
                    }

                    callback(lo_error, lo_result);

                } else {
                    callback(lo_error, lo_result);
                }
            }
        );
    }
};