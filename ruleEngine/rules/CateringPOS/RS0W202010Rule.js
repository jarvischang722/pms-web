/**
 * Created by a16009 on 2017/11/23.
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
var selOptLib = require("../SelectOptionsLib");


module.exports = {
    lang_bquet_mn_order_sta: function (postData, callback) {
        selOptLib.lang_bquet_mn_order_sta(postData, function (err, result) {
            callback(null, result);
        });
    }
};