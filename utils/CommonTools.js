/**
 * Created by Jun on 2016/4/24.
 */
var request = require("request");
var moment = require('moment');
var _ = require('underscore');
var async = require('async');
var mailSvc = require("../services/MailService");


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

    deUrl = apiUrl + '?lang=' + lang + '&' + 'testLog=Y&TxnData=' + params;

    params = new Buffer(params).toString('base64');    //編碼

    url = apiUrl + '?lang=' + lang + '&TxnData=' + params;

    console.log(deUrl);

    console.log(url);

    request({
            method: 'post',
            url: apiUrl,
            encoding: "utf8",
            timeout: 30000,
            json: true,
            form: {lang: lang, TxnData: params}
        },
        function (err, response, data) {
            var errorMsg = null;
            if (err) {
                // Timeout 事件發生
                if (err.code == 'ESOCKETTIMEDOUT') {
                    var mailInfo = {
                        exceptionType: "API Timeout",
                        errorMsg: err.code
                    };
                    mailSvc.sendExceptionMail(mailInfo);
                    errorMsg = 'Request Timeout';
                }

            }
            callback(errorMsg, response, data);
        });
};


/**
 * mongodb _doc 轉成物件
 * @param mongoDataRows{Array}: 從mongo 撈出來的多筆資料
 */
exports.mongoDocToObject = function (mongoDataRows) {
    try {
        _.each(mongoDataRows, function (row, idx) {
            mongoDataRows[idx] = row.toObject();
        });
    } catch (ex) {
        console.error(ex);
    }

    return mongoDataRows;
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
        returnJson = _.extend(err, result);
    } else {
        returnJson = _.extend(returnJson, result);
    }

    return returnJson;
};

/**
 * 檢查需必填的參數名稱
 * @param params
 * @param checkKeys
 * @return {{success: boolean, errorMsg: string}}
 */
exports.checkRequireParams = function (params, checkKeys) {
    let result = {success: true, errorMsg: ''};
    _.each(checkKeys, function (key) {
        if (_.isUndefined(params[key])) {
            result.success = false;
            result.errorMsg = "[" + key + "] is required";
        }
    });
    return result;
};


/**
 * 資料預處理
 * @param lao_data {Array|Object} : 資料
 * @param fieldAttrs {Array[Object]}  所有欄位屬性
 * @return {*}
 */
exports.handlePreprocessData = function (lao_data, fieldAttrs) {
    if (_.isArray(lao_data)) {
        _.each(lao_data, function (lo_data) {
            convUtcToDate(lo_data, fieldAttrs);
        });
    } else if (_.isObject(lao_data)) {
        convUtcToDate(lao_data, fieldAttrs);
    }

    return lao_data;

};

/**
 * 查詢資料庫前將欄位是日期的UTC 轉為 YYYY/MM/DD or YYYY/MM/DD HH:mm:ss
 * @param lo_data {Array|Object} : 資料
 * @param fieldAttrs {Array[Object]}  所有欄位屬性
 * @return {*}
 */
function convUtcToDate(lo_data, fieldAttrs) {

    _.each(lo_data, function (val, fieldName) {
        if (!_.isUndefined(fieldAttrs)) {
            let lo_field = _.findWhere(fieldAttrs, {ui_field_name: fieldName});
            if (lo_field) {
                if (lo_field.ui_type == 'date') {
                    lo_data[fieldName] = moment(new Date(lo_data[fieldName])).format("YYYY/MM/DD");
                } else if (lo_field.ui_type == 'datetime') {
                    lo_data[fieldName] = moment(new Date(lo_data[fieldName])).format("YYYY/MM/DD HH:mm:ss");
                }
            }
        } else {
            var patternDat = /_dat$/i; //找尋欄位是dat或date結尾
            if (patternDat.test(fieldName)) {
                lo_data[fieldName] = moment(new Date(lo_data[fieldName])).format("YYYY/MM/DD");
            }

            if (fieldName == 'ins_dat' || fieldName == 'upd_dat') {
                lo_data[fieldName] = moment(new Date(lo_data[fieldName])).format("YYYY/MM/DD HH:mm:ss");
            }
        }
    });

    return lo_data;
}