/**
 * Created by a17017 on 2018/1/10.
 * select grid 欄位名稱
 */

const i18n = require("i18n");
const fs = require("fs");
const async = require("async");
const commandRules = require('./CommonRule');

/**
 * PMS0610020 商務公司資料編輯 欄位公司
 * @param session
 * @param callback
 */
exports.sel_custMnCustColumn = function (session, callback) {
    let lo_result = {
        columns: [
            {
                field: "show_cod",
                title: commandRules.getColumnByNam("PMS0610020_show_cod", session.locale),
                width: 100
            },
            {
                field: "cust_nam",
                title: commandRules.getColumnByNam("PMS0610020_cust_nam", session.locale),
                width: 300
            },
            {
                field: "uni_cod",
                title: commandRules.getColumnByNam("PMS0610020_uni_cod", session.locale),
                width: 100
            },
            {
                field: "uni_title",
                title: commandRules.getColumnByNam("PMS0610020_uni_title", session.locale),
                width: 180
            },
            {
                field: "cust_cod",
                hidden: true
            },
            {
                field: "cust_dispalay",
                hidden: true
            }
        ],
        display: "cust_display",
        value: "cust_cod"
    };
    callback(null, lo_result);
};

/**
 * PMS0610020 商務公司資料編輯 欄位業務
 * @param session
 * @param callback
 */
exports.sel_salesMnHotelStatusNColumn = function(session, callback){
    let lo_result = {
        columns: [
            {
                field: "sales_cod",
                title: commandRules.getColumnByNam("PMS0610020_sales_cod", session.locale),
                width: 100
            },
            {
                field: "sales_nam",
                title: commandRules.getColumnByNam("PMS0610020_sales_nam", session.locale),
                width: 100
            },
            {
                field: "class_nam",
                title: commandRules.getColumnByNam("PMS0610020_class_nam", session.locale),
                width: 100
            },
            {
                field: "sales_display",
                hidden: true
            }
        ],
        display: "sales_display",
        value: "sales_cod"
    };
    callback(null, lo_result);
};

/**
 * PMS0620020 業務員資料編輯 欄位使用者代號
 * @param session
 * @param callback
 */
exports.qry_user_nos_column = function(session, callback){
    let lo_result = {
        columns: [
            {
                field: "user_nos",
                title: commandRules.getColumnByNam("PMS0620020_user_nos", session.locale),
                width: 80
            },
            {
                field: "user_name",
                title: commandRules.getColumnByNam("PMS0620020_user_name", session.locale),
                width: 150
            },
            {
                field: "user_display",
                hidden: true
            }
        ],
        display: "user_display",
        value: "user_nos"
    };
    callback(null, lo_result);
};

function getlocaleContent(session, callback) {
    var localeContent = {};
    var appRootPath = require('app-root-path').path;
    var localesPath = appRootPath + "/locales/";
    var err = null;

    try {
        fs.exists(localesPath + session.locale.toLowerCase() + ".json", function (isExist) {
            if (isExist) {
                localeContent = require(localesPath + session.locale.toLowerCase() + ".json");
            } else {
                console.error("找不到多語系對應檔案[" + localesPath + session.locale.toLowerCase() + ".json" + "]");
                localeContent = require(localesPath + "en.json");
            }
            callback(err, localeContent);
        });
    }
    catch (ex) {
        console.error(ex);
        err = ex;
        callback(err, null);
    }
}

