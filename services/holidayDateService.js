/**
 * Created by a16010 on 2017/6/12.
 */

var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var _ = require("underscore");
var async = require("async");
var moment = require("moment");
var i18n = require("i18n");
var ruleAgent = require("../ruleEngine/ruleAgent");

exports.getHolidayDateSet = function(postData, session, callback) {
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
}