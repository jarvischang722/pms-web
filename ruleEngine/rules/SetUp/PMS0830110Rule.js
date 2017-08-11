/**
 * Created by a14020 on 2017/7/24.
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
    chkA6hfdareapntrfIsexistA6hfdprintdt: function(postData, session, callback){
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.fun_hotel_cod,
            areapnt_cod: postData.singleRowData.areapnt_cod
        }
        queryAgent.query("QRY_AREAPNT_COD_A6HFD_PRINT_DT_COUNT".toUpperCase(), params, function (err, chkResult) {
            if (chkResult) {
                if (chkResult.cust_mn_count > 0) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "區域「（區域代號）」已有相關列印資料，不可刪除";
                    lo_error.errorCod = "1111";
                }
                callback(lo_error, lo_result);
            }
        });
    },
    qry_areapnt_sta_default: function(postData, session, callback){
        var lo_result = new ReturnClass();
        var lo_error = null;
        lo_result.defaultValues.areapnt_sta = "Y";
        callback(lo_error, lo_result);
    }
}