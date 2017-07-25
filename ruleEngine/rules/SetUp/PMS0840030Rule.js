/**
 * Created by a14020 on 2017/7/24.
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
    //依『貨品代號』,設定『是否扣庫存』
    chkHkproductrfGoodscod: function(postData, session, callback){
        var lo_result = new ReturnClass();
        var lo_error = null;
        var goodCodValue = postData.singleRowData.good_cod;

        if( !_.isEmpty(goodCodValue)){
            postData.singleRowData.inv_sta = "Y";
            lo_result.effectValues = postData.singleRowData;
            callback(lo_error, lo_result);
        }else {
            postData.singleRowData.inv_sta = "N";
            lo_result.effectValues = postData.singleRowData;
            callback(lo_error, lo_result);
        }
    },
    //若N:無服務費時, SERV_RAT = 0
    chkHkproductrfServicesta:function(postData, session, callback){
        var lo_result = new ReturnClass();
        var lo_error = null;
        var serviceStaValue = postData.singleRowData.service_sta;

        if( serviceStaValue == "N"){
            postData.singleRowData.serv_rat = "0";
            lo_result.effectValues = postData.singleRowData;
            callback(lo_error, lo_result);
        }else {
            callback(lo_error, lo_result);
        }
    },
    //若設要收服務費時，則值要大於0
    chkHkproductrfServrat:function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var serviceStaValue = postData.singleRowData.service_sta;
        var servratValue = postData.singleRowData.serv_rat;

        if( serviceStaValue == "N"){
            if(servratValue != "0"){
                lo_error = new ErrorClass();
                // postData.singleRowData.serv_rat = "0";
                // lo_result.effectValues = postData.singleRowData;
                lo_error.succeed
                callback(lo_error, lo_result);
            }

        }else {
            callback(lo_error, lo_result);
        }
    }
}