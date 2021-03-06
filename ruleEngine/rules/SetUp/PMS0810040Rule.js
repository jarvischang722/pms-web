/**
 * Created by Jun on 2017/3/30.
 * 州別對照檔規則
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

