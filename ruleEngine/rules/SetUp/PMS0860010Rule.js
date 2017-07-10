/**
 * Created by a16010 on 2017/5/15.
 * 程式代碼: PMS0860010, 商務公司類別設定
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
    chk_cust_type_rf_is_exist_cust_mn: function(postData, session, callback){
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params = {
            athena_id: session.user.athena_id,
            type_cod: postData.singleRowData.type_cod
        }
        queryAgent.query("chk_cust_type_rf_is_exist_cust_mn".toUpperCase(), params, function (err, chkResult) {
            if (chkResult) {
                if (chkResult.cust_mn_count > 0) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "商務公司資料維護已使用,不可刪除";
                    lo_error.errorCod = "1111";
                }
                callback(lo_error, lo_result);
            }
        });
    }
}
