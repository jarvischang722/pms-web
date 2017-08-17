var _ = require("underscore");
var moment = require("moment");
//var async = require("async");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var ruleRootPath = appRootDir + "/ruleEngine/";
var queryAgent = require(appRootDir + '/plugins/kplug-oracle/QueryAgent');
var commandRules = require("./../CommonRule");
var ReturnClass = require(ruleRootPath + "/returnClass");
var ErrorClass = require(ruleRootPath + "/errorClass");

module.exports = {
    chk_ghist_prefer_rf_del: function(postData, session, callback){
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params = {
            athena_id: session.user.athena_id,
            prefer_cod: postData.singleRowData.prefer_cod
        }
        queryAgent.query("QRY_GHIST_PREFER_RF_COUNT".toUpperCase(), params, function (err, chkResult) {
            if (chkResult) {
                if (chkResult.use_count > 0) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "已被交通接駁記錄使用，無法刪除";
                    lo_error.errorCod = "1111";
                }
                callback(lo_error, lo_result);
            }
        });
    }
}