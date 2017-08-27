/**
 * Created by Jun Chang on 2017/3/7.
 * 規則引擎服務
 */
var _ = require("underscore");
var fs = require("fs");
var rulesDirectory = __dirname + "/rules/";
var AllRuleClass = {};

loadDirRules(rulesDirectory);

function loadDirRules(rootPath) {
    AllRuleClass = require("./rules/CommonRule");
    fs.readdir(rootPath, function (err, files) {
        if (err) {
            throw err;
        }

        files.forEach(function (file) {
            fs.stat(rootPath + file, function (err, stats) {
                if (err) {
                    throw err;
                }

                if (stats.isFile()) {
                    // console.log("%s is file", file);
                    if (file.indexOf(".js") > -1) {
                        AllRuleClass = _.extend(AllRuleClass, require(rootPath + file));
                    }
                }
                else if (stats.isDirectory()) {
                    // console.log("%s is a directory", file);
                    loadDirRules(rootPath + file + "/");
                }

            });
        });
    });
}


module.exports = AllRuleClass;

