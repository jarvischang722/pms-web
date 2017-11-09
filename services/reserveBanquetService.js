/**
 * Created by kaiyue on 2017/11/08.
 */
var _ = require("underscore");
var fs = require('fs');
var moment = require("moment");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var ruleRootPath = appRootDir + "/ruleEngine/";
var ReturnClass = require(ruleRootPath + "/returnClass");
var ErrorClass = require(ruleRootPath + "/errorClass");

//[RS00202010] 取格萊天漾查詢頁資料
exports.qryPageOneData = function (postData, session, callback) {
    let lo_error = null;
    let lo_result = new ReturnClass();
    fs.readFile("./public/jsonData/reserveBanquet/banquetData.json", "utf8", function (err, data) {
        data = JSON.parse(data);
        rtnData = convertDataToDisplay(data);
        lo_result.defaultValues = rtnData;
        callback(lo_error, lo_result);
    });
};

//[RS00202010]
function convertDataToDisplay(lo_data) {

    return lo_data;
}