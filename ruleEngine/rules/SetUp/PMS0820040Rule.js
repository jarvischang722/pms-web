/**
 * Created by a17017 on 2018/1/27.
 * ProgramID : PMS0820040
 * 航空公司設定
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

    /**
     * 刪除前檢查
     * 1.已於住客歷史資料指定者，不允許刪除:訊息『已於住客歷史資料中使用，不可刪除』
     * 2.已於住客資料指定者，不允許刪除:訊息『已於住客資料中使用，不可刪除
     * @param postData
     * @param session
     * @param callback
     */
    chk_ghist_airline_rf_del: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        var lo_params = {
            athena_id: session.user.athena_id,
            airline_cod: postData.singleRowData.airline_cod
        };

        async.waterfall([
            chkGuestHistory,
            chkGuest
        ], function (err, result) {
            callback(err, result);
        });

        function chkGuestHistory(cb) {
            queryAgent.query("GET_GHIST_MN.AIRLINE_COD_COUNT", lo_params, function (err, getResult) {
                if (err) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "555";
                    cb(lo_error, lo_result);
                }
                else {
                    if (getResult.ghistcount > 0) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = commandRules.getMsgByCod("pms82msg27", session.locale);
                    }
                    cb(lo_error, lo_result);
                }
            });
        }

        function chkGuest(data, cb) {
            queryAgent.query("GET_GUEST_MN.AIRLINE_COD_COUNT", lo_params, function (err, getResult) {
                if (err) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "555";
                    cb(lo_error, lo_result);
                }
                else {
                    if (getResult.guest_count > 0) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = commandRules.getMsgByCod("pms82msg28", session.locale);
                    }
                    cb(lo_error, lo_result);
                }
            });
        }
    }
};

