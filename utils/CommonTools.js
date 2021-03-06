/**
 * Created by Jun on 2016/4/24.
 */
const request = require("request");
const moment = require('moment');
const _ = require('underscore');
const mailSvc = require("../services/MailService");

/**
 * 打API
 * @param apiUrl {string}: 要打API的URL
 * @param params {object}: 參數
 * @returns {Promise<*>}
 */
exports.requestApi = async function (apiUrl, params) {
    const callback = arguments[2];

    const lang = params["lang"] || "zh_TW";  //語系

    params = JSON.stringify(params);

    const deUrl = apiUrl + '?lang=' + lang + '&testLog=Y&TxnData=' + params;

    params = new Buffer(params).toString('base64');    //編碼

    const url = apiUrl + '?lang=' + lang + '&TxnData=' + params;

    console.log(deUrl);

    console.log(url);

    const lo_requestParams = {
        method: 'post',
        url: apiUrl,
        encoding: "utf8",
        timeout: 30000,
        json: true,
        form: {lang: lang, TxnData: params}
    };

    const lo_requestResult = await new Promise(resolve => {
        request(lo_requestParams, (err, response, data) => {
            let ls_errorMsg = null;
            if (err) {
                // Timeout 事件發生
                if (err.code === 'ESOCKETTIMEDOUT') {
                    const mailInfo = {
                        exceptionType: "API Timeout",
                        errorMsg: err.code
                    };
                    mailSvc.sendExceptionMail(mailInfo);
                    ls_errorMsg = 'Request Timeout';
                }

            }
            resolve({apiErr: ls_errorMsg, response, data});
        });
    });

    if (_.isUndefined(callback)) {
        if (lo_requestResult.apiErr || !lo_requestResult.data) {
            return lo_requestResult.apiErr;
        }
        else {
            return lo_requestResult.data;
        }
    }
    else {
        callback(lo_requestResult.apiErr, lo_requestResult.response, lo_requestResult.data);
    }


};


/**
 * mongodb _doc 轉成物件
 * @param mongoDataRows{Array}: 從mongo 撈出來的多筆資料
 */
exports.mongoDocToObject = function (mongoDataRows) {
    try {
        if (_.isArray(mongoDataRows)) {
            _.each(mongoDataRows, function (row, idx) {
                mongoDataRows[idx] = row.toObject();
            });
        }
        else {
            mongoDataRows = mongoDataRows.toObject();
        }

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
    let returnJson = {errorMsg: err ? err.errorMsg || "" : ""};
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
 * 作業資料預處理
 * @param la_data {Array|Object} : 資料
 * @param la_fieldAttrs {Array[Object]}  所有欄位屬性
 */
exports.handleOperationProcData = function (la_data, la_fieldAttrs) {
    if (_.isArray(la_data)) {
        _.each(la_data, function (lo_data) {
            let la_fieldAttrFilter = _.where(la_fieldAttrs, {tab_page_id: lo_data.tab_page_id});
            convUtcToDate(lo_data, la_fieldAttrFilter);
        });
    } else if (_.isObject(la_data)) {
        let la_fieldAttrFilter = _.where(la_fieldAttrs, {tab_page_id: la_data.tab_page_id});
        convUtcToDate(la_data, la_fieldAttrFilter);
    }

    return la_data;
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
        if (!_.isUndefined(fieldAttrs) && val != null && val != "") {
            let lo_field = _.findWhere(fieldAttrs, {ui_field_name: fieldName});
            if (lo_field) {
                if (lo_field.ui_type == 'date') {
                    lo_data[fieldName] = moment(new Date(lo_data[fieldName])).format("YYYY/MM/DD");
                } else if (lo_field.ui_type == 'datetime') {
                    lo_data[fieldName] = moment(new Date(lo_data[fieldName])).format("YYYY/MM/DD HH:mm:ss");
                }
            }
        }
        else {
            if (lo_data[fieldName] != null) {
                if (fieldName == 'ins_dat' || fieldName == 'upd_dat') {
                    lo_data[fieldName] = moment(new Date(lo_data[fieldName])).format("YYYY/MM/DD HH:mm:ss");
                }
            }
        }
    });

    return lo_data;
}

/**
 * trim 掉 object 裡所有字串
 * @param notTrimObject
 * @return Object
 */
exports.trimObjectAllVal = function (notTrimObject) {
    _.each(notTrimObject, function (data, idx) {
        _.each(data, function (d, key) {
            if (typeof d === 'string') {
                notTrimObject[idx][key] = d.trim();
            } else {
                notTrimObject[idx][key] = d;
            }
        });

    })
    return notTrimObject;
};

/**
 * 組合key值
 * @param obj {Object} : 資料
 * @param keys {Array} : key name
 * @param isNeedAthenaID {Boolean} : 是否需要回傳Athena_id & hotel_cod
 * @return {Object}
 */
exports.combineKeys = function (obj, keys, isNeedAthenaID) {
    let lo_key = {};
    _.each(keys, function (key) {
        if (!_.isUndefined(obj[key])) {
            lo_key[key] = obj[key];
        }
    });
    if (!_.isUndefined(isNeedAthenaID) && !isNeedAthenaID) {
        delete  lo_key["athena_id"];
        delete  lo_key["hotel_cod"];
    }
    return lo_key;
};


