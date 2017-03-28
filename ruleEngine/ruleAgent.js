/**
 * Created by Jun Chang on 2017/3/7.
 * 規則引擎服務
 */
var _ = require("underscore");
var fs = require("fs");
var rulesDirectory = __dirname + "/rules/";
var AllRuleClass = {};

fs.readdirSync(rulesDirectory).filter(function (file) {
    AllRuleClass = _.extend(AllRuleClass,require(rulesDirectory + file));
})

module.exports = AllRuleClass;

