/**
 * Created by Jun on 2017/4/24.
 */
var _ = require("underscore");
var fs = require("fs");
var rulesDirectory = __dirname + "/rules/";
var AllRuleClass = {};
var ori_paths = "../ruleEngine/rules/";


readDir(ori_paths);

function readDir(paths) {
    console.log("______ "+paths+"______");
    fs.readdir(paths, function (err, files) {
        if (err) throw err;

        files.forEach( function (file) {
            fs.stat(paths + file, function (err, stats) {
                if (err) throw err;

                if (stats.isFile()) {
                     console.log("%s is file", file);
                }
                else if (stats.isDirectory ()) {
                    console.log("%s is a directory", file);
                    readDir(paths+file+"/");
                }

            });
        });
    });
}

// fs.readdirSync(rulesDirectory).filter(function (file) {
//     console.log(file.isDirectory());
//     AllRuleClass = _.extend(AllRuleClass,require(rulesDirectory + file));
// })

