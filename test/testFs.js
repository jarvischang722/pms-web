/**
 * Created by Jun on 2017/4/24.
 */
var _ = require("underscore");
var fs = require("fs");
var rulesDirectory = __dirname + "/rules/";
var AllRuleClass = {};
var ori_paths = "../ruleEngine/rules/";
var path = require('path');
var appRootPath = require('app-root-path').path;
var appRootDir = path.dirname(require.main.filename);
var sprintf = require('sprintf').sprintf;

// readDir(ori_paths);
// readFile();
var _path = appRootPath+"/locales/zh_tw.json";

console.log(sprintf("hello %s","maz"));
function readFile() {
    console.log(appRootPath);
    var _path = appRootPath+"/locales/zh_tw.json";
    console.log(require(_path));
    console.log(_path);
    fs.exists(_path, function (exists) {
        if (!exists) {
            console.error("找不到語系對應檔,預設抓英文");
            _path = appRootPath+"/locales/en.json";
        }
        console.log(_path);

        fs.readFile(_path, 'utf8', function (err, data) {
            if (err) throw err;

            console.dir(data);
        });
    });
}

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

