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
exports.sel_salesMnHotelStatusNColumn = function (session, callback) {
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
exports.qry_user_nos_column = function (session, callback) {
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

/**
 * PMS0210010 住客歷史 欄位國籍
 * @param session
 * @param callback
 */
exports.sel_GhistMnContrycodColumn = function (session, callback) {
    let lo_result = {
        columns: [
            {
                field: "contry_cod",
                title: commandRules.getColumnByNam("contry_cod", session.locale),
                width: 80
            },
            {
                field: "contry_nam",
                title: commandRules.getColumnByNam("contry_nam", session.locale),
                width: 150
            },
            {
                field: "contry_sna",
                title: commandRules.getColumnByNam("contry_sna", session.locale),
                width: 150
            },
            {
                field: "contry_display",
                hidden: true
            }
        ],
        display: "contry_display",
        value: "contry_cod"
    };
    callback(null, lo_result);
};

/**
 * PMS0210010 住客歷史 欄位國籍
 * @param session
 * @param callback
 */
exports.sel_AgentIdxShowcodColumn = function (session, callback) {
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
 * PMS0210011 住客歷史資料編輯 欄位稱謂
 * @param session
 * @param callback
 */
exports.QRY_SEL_SALUTE_COD_column = function(session, callback){
    let lo_result = {
        columns: [
            {
                field: "salute_cod",
                title: commandRules.getColumnByNam("salute_cod", session.locale),
                width: 100
            },
            {
                field: "salute_nam",
                title: commandRules.getColumnByNam("salute_nam", session.locale),
                width: 100
            },
            {
                field: "man_flag",
                title: commandRules.getColumnByNam("man_flag", session.locale),
                width: 100
            },
            {
                field: "woman_flag",
                title: commandRules.getColumnByNam("woman_flag", session.locale),
                width: 100
            },
            {
                field: "salute_display",
                hidden: true
            }
        ],
        display: "salute_display",
        value: "salute_cod"
    };
    callback(null, lo_result);
};

/**
 * PMS0210011 住客歷史資料編輯 欄位居住地
 * @param session
 * @param callback
 */
exports.QRY_SEL_HFD_LIVE_COD_RF_Column = function(session, callback){
    let lo_result = {
        columns: [
            {
                field: "live_cod",
                title: commandRules.getColumnByNam("live_cod", session.locale),
                width: 100
            },
            {
                field: "live_nam",
                title: commandRules.getColumnByNam("live_nam", session.locale),
                width: 100
            },
            {
                field: "live_sna",
                title: commandRules.getColumnByNam("live_sna", session.locale),
                width: 100
            },
            {
                field: "contry_nam",
                title: commandRules.getColumnByNam("contry_nam", session.locale),
                width: 100
            },
            {
                field: "live_display",
                hidden: true
            }
        ],
        display: "live_display",
        value: "live_cod"
    };
    callback(null, lo_result);
};


function getlocaleContent(session, callback) {
    let localeContent = {};
    let appRootPath = require('app-root-path').path;
    let localesPath = appRootPath + "/locales/";
    let err = null;

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






