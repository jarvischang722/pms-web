/**
 * Created by a16010 on 2017/6/12.
 */

var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var _ = require("underscore");
var async = require("async");
var moment = require("moment");
var i18n = require("i18n");
var ruleAgent = require("../ruleEngine/ruleAgent");

exports.getHolidayKindSet = function(postData, session, callback) {
    var params = {
        athena_id: session.user.athena_id,
        hotel_cod: session.user.fun_hotel_cod
    };

    queryAgent.queryList("QRY_HOLIDAY_KIND_RF", params, 0, 0, function (err, result) {
        if (err) {
            console.error(err);
            callback(err, null);
        }
        else{
            callback(null, result);
        }

    })
};

exports.getHolidayDateSet = function(postData, session, callback){
    var params = {
        athena_id: session.user.athena_id,
        hotel_cod: session.user.fun_hotel_cod,
        begin_dat: postData.year + "/01/01",
        end_dat: postData.year + "/12/31"
    }

    queryAgent.queryList("QRY_HOLIDAY_RF", params, 0, 0, function(err, result){
        if(err){
            console.error(err);
            callback(err, null);
        }
        else{
            callback(null, result);
        }
    })
};

// 取年度總日期天數
exports.getHolidayDateCount = function(postData, session, callback){
    var params = {
        athena_id: session.user.athena_id,
        hotel_cod: session.user.fun_hotel_cod,
        begin_dat: postData.year + "/01/01",
        end_dat: postData.year + "/12/31"
    }

    queryAgent.query("QRY_HOLIDAY_RF_COUNT", params, function(err, result){
        if(err){
            console.log(err);
            callback(err, callback);
        }
        else{
            callback(null, result.datecount);
        }
    })
}