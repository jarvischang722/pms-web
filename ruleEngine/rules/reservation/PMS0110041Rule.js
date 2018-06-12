/**
 * Created by a17007 on 2018/6/7.
 */
let _ = require("underscore");
let _s = require("underscore.string");
let moment = require("moment");
let async = require("async");
let path = require('path');
let appRootDir = path.dirname(require.main.filename);
let ruleRootPath = appRootDir + "/ruleEngine/";
let queryAgent = require(appRootDir + '/plugins/kplug-oracle/QueryAgent');
let commandRules = require("./../CommonRule");
let ReturnClass = require(ruleRootPath + "/returnClass");
let ErrorClass = require(ruleRootPath + "/errorClass");
let tools = require(appRootDir + "/utils/CommonTools");
let sysConf = require("../../../configs/systemConfig");

module.exports = {

};