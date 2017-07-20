/**
 * Created by a14020 on 2017/5/24.
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
    chkContactrfContacttyp: function (postData, session, callback) {
        //var deleteFlag=postData.delete_flag;
        var error = null;
        var result = new ReturnClass();
        callback(error, result);
        
    },
    chk_contact_rf_del: function (postData, session, callback) {
        var error = null;
        var result = new ReturnClass();
        callback(error, result);
    }
};