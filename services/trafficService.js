/**
 * Created by Jun on 2017/5/26.
 */
var config = require("../configs/database");
var sysConf = require("../configs/SystemConfig");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var mongoAgent = require("../plugins/mongodb");
var _ = require("underscore");
var async = require("async");
var moment = require("moment");
var i18n = require("i18n");
var tools = require("../utils/commonTools");
var dataRuleSvc = require("../services/dataRuleService");
var ruleAgent = require("../ruleEngine/ruleAgent");
var logSvc = require("./logService");
var mailSvc = require("./mailService");
var langSvc = require("./langService");


exports.handleTrafficData = function (postData, session,callback) {
    var params = {
        // athena_id: session.user.usr_id,
        // hotel_cod: session.user.func_hotel_cod
    };
    params.athena_id = 1;
    params.hotel_cod = "02";

    async.parallel({
        arrive_rf: function (callback) {
            queryAgent.queryList("QRY_HFD_ARRIVE_RF", params, 0, 0, function (err, arrive_rf) {
                if (err) {
                    console.error(err);
                    arrive_rf = [];
                }
                callback(null, arrive_rf);
            })
        },
        leave_rf: function (callback) {
            queryAgent.queryList("QRY_HFD_LEAVE_RF", params, 0, 0, function (err, leave_rf) {
                if (err) {
                    console.error(err);
                    leave_rf = [];
                }
                callback(null, leave_rf);
            })
        }
    }, function (err, results) {
        callback(err,results)
    });

};