/**
 * Created by a17017 on 2018/1/10.
 * select grid 欄位名稱
 */

const commandRules = require('./CommonRule');

exports.sel_business_rf_column = function (session, callback) {
    let lo_result = {
        columns: [
            {
                field: "business_cod",
                title: commandRules.getColumnByNam("business_cod", session.locale),
                width: 100
            },
            {
                field: "business_rmk",
                title: commandRules.getColumnByNam("business_rmk", session.locale),
                width: 380
            },
            {
                field: "business_display",
                hidden: true
            }
        ],
        display: "business_display",
        value: "business_cod"
    };
    callback(null, lo_result);
};

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
 * PMS0610020 商務公司資料編輯 相關人員姓名
 * @param session
 * @param callback
 */
exports.sel_cust_idx_cust_mn_pers_dt_column = function (session, callback) {
    let lo_result = {
        columns: [
            {
                field: "alt_nam",
                title: commandRules.getColumnByNam("ALT_NAM", session.locale),
                width: 100
            },
            {
                field: "mobile_nos",
                title: commandRules.getColumnByNam("MOBILE_NOS", session.locale),
                width: 100
            },
            {
                field: "office_tel",
                title: commandRules.getColumnByNam("OFFICE_TEL", session.locale),
                width: 100
            },
            {
                field: "home_tel",
                title: commandRules.getColumnByNam("HOME_TEL", session.locale),
                width: 100
            },
            {
                field: "fax_nos",
                title: commandRules.getColumnByNam("FAX_NOS", session.locale),
                width: 100
            },
            {
                field: "e_mail",
                title: commandRules.getColumnByNam("E_MAIL", session.locale),
                width: 100
            },
            {
                field: "sex_typ",
                title: commandRules.getColumnByNam("SEX_TYP", session.locale),
                width: 100
            },
            {
                field: "birth_dat",
                title: commandRules.getColumnByNam("BIRTH_DAT", session.locale),
                width: 100
            }

        ],
        display: "alt_nam",
        value: "alt_nam"
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
exports.QRY_SEL_SALUTE_COD_column = function (session, callback) {
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
exports.QRY_SEL_HFD_LIVE_COD_RF_Column = function (session, callback) {
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

exports.sel_ashowCodColumn = function (session, callback) {
    let lo_result = {
        columns: [
            {
                field: "show_cod",
                title: commandRules.getColumnByNam("show_cod", session.locale),
                width: 100
            },
            {
                field: "cust_cod",
                title: commandRules.getColumnByNam("cust_cod", session.locale),
                width: 100
            },
            {
                field: "cust_nam",
                title: commandRules.getColumnByNam("cust_nam", session.locale),
                width: 150
            },
            {
                field: "contact1_rmk",
                title: commandRules.getColumnByNam("contact_rmk", session.locale),
                width: 100
            },
            {
                field: "status_cod",
                title: commandRules.getColumnByNam("status_cod", session.locale),
                width: 50
            }
        ],
        display: "show_cod",
        value: "show_cod"
    };
    callback(null, lo_result);
};

exports.sel_alt_nam = function (session, callback) {
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

exports.sel_atten_nam = function (session, callback) {
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

/**
 * 欄位市場類別
 * @param session
 * @param callback
 */
exports.sel_guest_typ_column = function (session, callback) {
    let lo_result = {
        columns: [
            {
                field: "guest_typ",
                title: commandRules.getColumnByNam("guest_typ", session.locale),
                width: 100
            },
            {
                field: "guest_sna",
                title: commandRules.getColumnByNam("guest_sna", session.locale),
                width: 100
            },
            {
                field: "guest_nam",
                title: commandRules.getColumnByNam("guest_nam", session.locale),
                width: 100
            },
            {
                field: "guest_display",
                hidden: true
            }
        ],
        display: "guest_display",
        value: "guest_typ"
    };
    callback(null, lo_result);
};

exports.sel_alt_nam_for_order_column = function (session, callback) {

    let lo_result = {
        columns: [
            {
                field: 'cust_cod',
                title: commandRules.getColumnByNam("cust_cod", session.locale),
                width: 100
            },
            {
                field: 'alt_nam',
                title: commandRules.getColumnByNam("alt_nam", session.locale),
                width: 100
            },
            {
                field: 'first_nam',
                title: commandRules.getColumnByNam("first_nam", session.locale),
                width: 100
            },
            {
                field: 'last_nam',
                title: commandRules.getColumnByNam("last_nam", session.locale),
                width: 100
            },
            {
                field: 'cust_typ',
                title: commandRules.getColumnByNam("cust_typ", session.locale),
                width: 100
            },
            {
                field: 'cust_sta',
                title: commandRules.getColumnByNam("cust_sta", session.locale),
                width: 100
            },
            {
                field: 'show_cod',
                title: commandRules.getColumnByNam("show_cod", session.locale),
                width: 100
            },
            {
                field: 'id_cod',
                title: commandRules.getColumnByNam("id_cod", session.locale),
                width: 100
            },
            {
                field: 'birth_dat',
                title: commandRules.getColumnByNam("birth_dat", session.locale),
                width: 100
            },
            {
                field: 'comp_nam',
                title: commandRules.getColumnByNam("comp_nam", session.locale),
                width: 100
            },
            {
                field: 'visit_nos',
                title: commandRules.getColumnByNam("visit_nos", session.locale),
                width: 100
            },
            {
                field: "guest_display",
                hidden: true
            }
        ],
        display: "guest_display",
        value: "cust_cod"
    };
    callback(null, lo_result);
};

exports.sel_acust_nam_for_order_column = function (session, callback) {

    let lo_result = {
        columns: [
            {
                field: 'cust_cod',
                title: commandRules.getColumnByNam("cust_cod", session.locale),
                width: 100
            },
            {
                field: 'alt_nam',
                title: commandRules.getColumnByNam("alt_nam", session.locale),
                width: 100
            },
            {
                field: 'uni_cod',
                title: commandRules.getColumnByNam("uni_cod", session.locale),
                width: 100
            },
            {
                field: 'office_tel',
                title: commandRules.getColumnByNam("office_tel", session.locale),
                width: 100
            },
            {
                field: 'sales_cod',
                title: commandRules.getColumnByNam("sales_cod", session.locale),
                width: 100
            },
            {
                field: "guest_display",
                hidden: true
            }
        ],
        display: "guest_display",
        value: "cust_cod"
    };
    callback(null, lo_result);
};

exports.sel_hfdguarenteerfguarenteetyp_y_for_column = function (session, callback) {

    let lo_result = {
        columns: [
            {
                field: 'guarentee_typ',
                title: commandRules.getColumnByNam("guarentee_typ", session.locale),
                width: 100
            },
            {
                field: 'guarentee_nam',
                title: commandRules.getColumnByNam("guarentee_nam", session.locale),
                width: 100
            },
            {
                field: 'guarentee_rmk',
                title: commandRules.getColumnByNam("guarentee_rmk", session.locale),
                width: 100
            },
            {
                field: 'dp_req',
                title: commandRules.getColumnByNam("dp_req", session.locale),
                width: 100
            },
            {
                field: 'cc_req',
                title: commandRules.getColumnByNam("cc_req", session.locale),
                width: 100
            },
            {
                field: 'keep_way',
                title: commandRules.getColumnByNam("keep_way", session.locale),
                width: 100
            },
            {
                field: 'keep_day',
                title: commandRules.getColumnByNam("keep_day", session.locale),
                width: 100
            },
            {
                field: 'keep_tim',
                title: commandRules.getColumnByNam("keep_tim", session.locale),
                width: 100
            },
            {
                field: "guest_display",
                hidden: true
            }
        ],
        display: "guest_display",
        value: "cust_cod"
    };
    callback(null, lo_result);
};

exports.sel_orderdtusecod_for_column = function (session, callback) {
    let lo_result = {
        columns: [
            {
                field: 'room_cod',
                title: commandRules.getColumnByNam("room_cod", session.locale),
                width: 100
            },
            {
                field: 'room_sna',
                title: commandRules.getColumnByNam("room_sna", session.locale),
                width: 100
            },
            {
                field: 'view_seq',
                hidden: true
            },
            {
                field: "guest_display",
                hidden: true
            }
        ],
        display: "guest_display",
        value: "cust_cod"
    };
    callback(null, lo_result);
};

exports.sel_orderdtroomcod_for_column = function (session, callback) {
    let lo_result = {
        columns: [
            {
                field: 'room_cod',
                title: commandRules.getColumnByNam("room_cod", session.locale),
                width: 100
            },
            {
                field: 'room_sna',
                title: commandRules.getColumnByNam("room_sna", session.locale),
                width: 100
            },
            {
                field: 'view_seq',
                hidden: true
            },
            {
                field: "guest_display",
                hidden: true
            }
        ],
        display: "guest_display",
        value: "cust_cod"
    };
    callback(null, lo_result);
};