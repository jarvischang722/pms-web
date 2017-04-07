/**
 * Created by Jun on 2016/4/24.
 */
var request = require("request");
var moment = require('moment');
var _ = require('underscore');
var async = require('async');
var mailSvc = require("../services/mailService");


/**
 * @param {String} apiUrl : 要打API的URL
 * @param {JSON} params :　參數
 * @param callback : 回調函數
 * **/
exports.requestApi = function (apiUrl, params, callback) {

    var url = "";

    var deUrl = "";

    var lang = params["lang"] || "zh_TW";  //語系

    params = JSON.stringify(params);

    deUrl = apiUrl + '?lang=' + lang + '&' + '&TxnData=' + params;

    //params   = Base64.encode(params);    //加密

    params = encodeURIComponent(params);

    url = apiUrl + '?lang=' + lang + '&TxnData=' + params;

    console.log(deUrl);

    request({url: url, encoding: "utf8", timeout: 30000, json: true}, function (err, response, data) {
        var errorMsg = null;
        if (err) {
            if (err.code == 'ESOCKETTIMEDOUT') {
                var mailInfo = {
                    exceptionType:"API Timeout",
                    errorMsg: err.code
                };
                mailSvc.sendExceptionMail(mailInfo);
                errorMsg = 'Request Timeout'
            }

        }
        callback(errorMsg, response, data);
    })


};


/**
 * mongodb _doc 轉成物件
 * @param dataRows
 */
exports.mongoDocToObject = function (dataRows) {
    try {
        _.each(dataRows, function (row, idx) {
            dataRows[idx] = row.toObject();
        })
    } catch (err) {

    }

    return dataRows;
};

/**
 * 查詢資料庫前將欄位是日期的UTC 轉為 YYYY/MM/DD
 * @param fieldObject
 * @return {*}
 */
exports.convUtcToDate = function (fieldObject) {
    var patternDat = /_dat$/i; //找尋欄位是dat或date結尾

    _.each(Object.keys(fieldObject), function (field, idx) {
        if (patternDat.test(field)) {
            fieldObject[field] = moment(new Date(fieldObject[field])).format("YYYY/MM/DD");
        }

        if (field == 'ins_dat' || field == 'upd_dat') {
            fieldObject[field] = moment(new Date(fieldObject[field])).format("YYYY/MM/DD HH:mm:ss");
        }
    });


    return fieldObject;

};


/**
 * 合併兩個json object
 * @param obj1 : 第1個json
 * @param obj2 : 第2個json
 * @return mergeObj  : 合併後的JSON
 * **/
exports.mergeObject = function (obj1, obj2) {
    var mergeObj = {};
    for (var attrname in obj1) {
        mergeObj[attrname] = obj1[attrname];
    }
    for (var attrname in obj2) {
        mergeObj[attrname] = obj2[attrname];
    }
    return mergeObj;
};

/**
 * request 回傳前合併err
 * @param err {null | Object}
 * @param result {Object}
 * @return returnJson {Object}
 */
exports.mergeRtnErrResultJson = function (err, result) {
    var returnJson = {errorMsg: err ? err.errorMsg || "" : ""};
    if (err) {
        returnJson = this.mergeObject(err, result);
    } else {
        returnJson = this.mergeObject(returnJson, result);
    }

    return returnJson;
};