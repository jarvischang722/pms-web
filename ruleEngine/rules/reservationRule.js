/**
 * Created by Jun Chang on 2017/3/7.
 * 訂房規則
 */

var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var queryAgent = require('../../plugins/kplug-oracle/QueryAgent');
var commandRules = require("./commonRule");
var ReturnClass = require("../returnClass");
var ErrorClass = require("../errorClass");

module.exports = {
    /**
     * 房間大類新增時預設值
     * @param postData {Object} : 使用者傳來的資料
     * @param session {Object}  : Session
     * @param callback {Function} :
     */
    room_rf_add: function (postData, session, callback) {
        var result = new ReturnClass();
        var error = null;
        result.defaultValues = commandRules.getCreateCommonDefaultDataRule(session);
        callback(error, result);
    },
    /**
     * 洲別新增預設值
     * @param postData {Object} : 使用者傳來的資料
     * @param session {Object}  : Session
     * @param callback {Function} :
     */
    state_rf_add: function (postData, session, callback) {
        var result = new ReturnClass();
        var error = null;
        result.defaultValues = commandRules.getCreateCommonDefaultDataRule(session);
        callback(error, result);
    }
};

