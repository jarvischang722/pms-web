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
                title: commandRules.getColumnByNam("show_cod", session.locale),
                width: 100
            },
            {
                field: "cust_nam",
                title: commandRules.getColumnByNam("cust_nam", session.locale),
                width: 300
            },
            {
                field: "uni_cod",
                title: commandRules.getColumnByNam("uni_cod", session.locale),
                width: 100
            },
            {
                field: "uni_title",
                title: commandRules.getColumnByNam("uni_title", session.locale),
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
                title: commandRules.getColumnByNam("sales_cod", session.locale),
                width: 100
            },
            {
                field: "sales_nam",
                title: commandRules.getColumnByNam("sales_nam", session.locale),
                width: 100
            },
            {
                field: "class_nam",
                title: commandRules.getColumnByNam("class_nam", session.locale),
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
                title: commandRules.getColumnByNam("user_nos", session.locale),
                width: 80
            },
            {
                field: "user_name",
                title: commandRules.getColumnByNam("Puser_name", session.locale),
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
                title: commandRules.getColumnByNam("show_cod", session.locale),
                width: 100
            },
            {
                field: "cust_nam",
                title: commandRules.getColumnByNam("cust_nam", session.locale),
                width: 300
            },
            {
                field: "uni_cod",
                title: commandRules.getColumnByNam("uni_cod", session.locale),
                width: 100
            },
            {
                field: "uni_title",
                title: commandRules.getColumnByNam("uni_title", session.locale),
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


exports.sel_alt_nam = function(session, callback){
    let lo_result = {
        columns: [
            {
                field: "show_cod",
                title: commandRules.getColumnByNam("cust_user_nos", session.locale),
                width: 100
            },
            {
                field: "alt_nam",
                title: commandRules.getColumnByNam("alt_nam", session.locale),
                width: 100
            },
            {
                field: "contact_rmk",
                title: commandRules.getColumnByNam("contact_rmk", session.locale),
                width: 100
            },
            {
                field: "first_nam",
                title: commandRules.getColumnByNam("first_nam", session.locale),
                width: 100
            },
            {
                field: "last_nam",
                title: commandRules.getColumnByNam("last_nam", session.locale),
                width: 100
            },
            {
                field: "cust_typ",
                title: commandRules.getColumnByNam("cust_typ", session.locale),
                width: 100
            },
            {
                field: "cust_sta",
                title: commandRules.getColumnByNam("cust_sta", session.locale),
                width: 100
            },
            {
                field: "cust_cod",
                width: 0,
                hidden: true
            }
        ],
        display: "alt_nam",
        value: "alt_nam"
    };
    callback(null, lo_result);
};

exports.sel_atten_nam = function(session, callback){
    let lo_result = {
        columns: [
            {
                field: "atten_nam",
                title: commandRules.getColumnByNam("atten_nam", session.locale),
                width: 100
            },
            {
                field: "role_rmk",
                title: commandRules.getColumnByNam("role_rmk", session.locale),
                width: 100
            },
            {
                field: "tel_nos",
                title: commandRules.getColumnByNam("tel_nos", session.locale),
                width: 100
            }
        ],
        display: "atten_nam",
        value: "atten_nam"
    };
    callback(null, lo_result);
};
