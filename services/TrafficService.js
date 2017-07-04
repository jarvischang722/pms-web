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
var tools = require("../utils/CommonTools");
var dataRuleSvc = require("./DataRuleService");
var ruleAgent = require("../ruleEngine/ruleAgent");
var logSvc = require("./LogService");
var mailSvc = require("./MailService");
var langSvc = require("./LangService");


/**
 * 取得交通接駁資料
 * @param postData
 * @param session
 * @param callback
 */
exports.handleTrafficData = function (postData, session, callback) {

    var params = {
        athena_id: session.user.athena_id,
        hotel_cod: session.user.fun_hotel_cod
    };

    async.parallel({
        arrive_rf: function (callback) {
            queryAgent.queryList("QRY_HFD_ARRIVE_RF", params, 0, 0, function (err, arrive_rf) {
                if (err) {
                    console.error(err);
                    arrive_rf = [];
                }
                _.each(arrive_rf, function (data) {
                    var arrive_tim = data["arrive_tim"];
                    if (!_.isEmpty(arrive_tim) && arrive_tim.length == 4) {
                        data["arrive_tim"] = arrive_tim.substring(0, 2) + ":" + arrive_tim.substring(2, 4);
                    }
                });
                callback(null, arrive_rf);
            });
        },
        leave_rf: function (callback) {
            queryAgent.queryList("QRY_HFD_LEAVE_RF", params, 0, 0, function (err, leave_rf) {
                if (err) {
                    console.error(err);
                    leave_rf = [];
                }
                _.each(leave_rf, function (data) {
                    var leave_tim = data["leave_tim"];
                    var to_tim = data["to_tim"];
                    if (!_.isEmpty(leave_tim) && leave_tim.length == 4) {
                        data["leave_tim"] = leave_tim.substring(0, 2) + ":" + leave_tim.substring(2, 4);
                    }
                    if (!_.isEmpty(leave_tim) && leave_tim.length == 4) {
                        data["to_tim"] = to_tim.substring(0, 2) + ":" + to_tim.substring(2, 4);
                    }
                });
                callback(null, leave_rf);
            });
        }
    }, function (err, results) {
        callback(err, results);
    });

};