/**
 * Created by a14020 on 2017/5/11.
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
    /*
     PMS0860020 :如cust_mn有資料就不能刪除
     */
    chk_business_rf_is_exist_cust_mn: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params = {
            athena_id: session.user.athena_id,
            business_cod: postData.singleRowData.business_cod
        };

        queryAgent.query("QRY_BUSINESS_RF_IS_EXIST_CUST_MN_COUNT".toUpperCase(), params, function (err, guestData) {
            if (!err) {
                if (guestData.cust_mn_count > 0) {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = "在商務公司資料維護已使用,不可刪除";
                    lo_error.errorCod = "1111";
                    callback(lo_error, lo_result);
                } else {
                    callback(lo_error, lo_result);
                }
            } else {
                callback(err, lo_result);
            }
        })
    }
}