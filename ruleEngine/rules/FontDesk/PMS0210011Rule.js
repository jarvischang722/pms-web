/**
 * Created by a16010 on 2018/03/01.
 */
const _ = require("underscore");
const _s = require("underscore.string");
const moment = require("moment");
const queryAgent = require("../../../plugins/kplug-oracle/QueryAgent");
const commonRule = require("./../CommonRule");
const ReturnClass = require("../../returnClass");
const ErrorClass = require("../../errorClass");
const tools = require("../../../utils/CommonTools");
const sysConf = require("../../../configs/systemConfig");
const encryptTools = require("../../../utils/encryptTools");

module.exports = {
    /**
     * 單筆主檔各欄位預設值
     * @param postData {object}
     * @param session {object}
     * @param callback
     * @returns {Promise<void>}
     */
    async defaultGhistMn(postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;
        let lo_params = postData.params;
        let lo_defaultValue = {};

        let lo_default_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        };

        try {
            let [lo_ghistMn, lo_default_salute_cod, lo_default_contry_cod, lo_default_lang_cod] = await Promise.all([
                this.getGhistMnSeriesNos(postData, session),
                this.getAddDefault("QRY_DEFAULT_SALUTE_COD", "salute_cod", lo_default_params),    //取預設稱謂
                this.getAddDefault("QRY_DEFAULT_CONTRY_COD", "contry_cod", lo_default_params),    //取預設國籍
                this.getAddDefault("QRY_DEFAULT_LANG_COD", "lang_cod", lo_default_params)         //取預設語言
            ]);

            _.extend(lo_defaultValue, lo_ghistMn, lo_default_salute_cod, lo_default_contry_cod, lo_default_lang_cod);
            lo_result.defaultValues = lo_defaultValue;
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_error, lo_result);
    },

    /**
     * gcust_cod、show_cod，系統編號取號
     * @param postData {object}
     * @param session {object}
     * @returns {Promise<any>}
     */
    async getGhistMnSeriesNos(postData, session) {
        let lo_apiParams = {
            "REVE-CODE": "BAC0900805",
            "func_id": "0000",
            "athena_id": session.user.athena_id,
            "comp_cod": session.user.cmp_id,
            "hotel_cod": session.user.hotel_cod,
            "sys_cod": "HFD",
            "nos_nam": "CUST_COD",
            "link_dat": "2000/01/01"
        };

        return new Promise((resolve, reject) => {
            tools.requestApi(sysConf.api_url.java, lo_apiParams, function (apiErr, apiRes, data) {
                if (apiErr || !data) {
                    reject(apiErr);
                }
                else if (data["RETN-CODE"] != "0000") {
                    reject(data["RETN-CODE-DESC"]);
                }
                else {
                    let ls_cod = data["SERIES_NOS"].toString();
                    let ls_ghistMnGcustCod = "HFD" + _s.lpad(ls_cod, 13, '0') + _s.rpad(session.user.hotel_cod.trim(), 4, '');
                    let ls_ghistMnShowCod = ls_ghistMnGcustCod.substring(8, 20);
                    resolve({
                        gcust_cod: ls_ghistMnGcustCod,
                        show_cod: ls_ghistMnShowCod
                    });
                }
            });
        });
    },

    /**
     * 取新增預設值
     * @param rule_func_name {string} 規則
     * @param sql_col_name  {string} sql欄位名稱
     * @param params {object} sql查詢條件
     * @returns {Promise<any>}
     */
    async getAddDefault(rule_func_name, sql_col_name, params) {
        return new Promise((resolve, reject) => {
            queryAgent.query(rule_func_name, params, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    let lo_rtnData = {};
                    lo_rtnData[sql_col_name] = result["default_" + sql_col_name];
                    resolve(lo_rtnData);
                }
            });
        });
    },

    /**
     * 1.共用系統下拉選單－zipcod_rf
     * 2.若使用者有選擇郵遞區號，則自動將郵遞區號對應之地址資料帶至地址欄位【地址有值不蓋掉，地址無值時才帶入】(SA 7.7.3.4)
     * P.S.地址欄位可修改，不限制內容需與郵遞區號設定資料符合
     */
    sel_zip_cod(postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        let lo_params = {
            athena_id: session.user.athena_id,
            zip_cod: postData["address_dt.zip_cod"]
        };
        queryAgent.query("QRY_ZIP_COD", lo_params, function (err, result) {
            if (err) {
                lo_error = new ErrorClass();
                lo_return.success = false;
                lo_error.errorMsg = err;
            }
            else {
                lo_return.effectValues = {"address_dt.add_rmk": result};
            }
            callback(lo_error, lo_return);
        });
    },

    /**
     * 狀態改變
     * 1.若客戶索引檔來源資料表為住客歷史,才同步異動cust_idx.cust_sta
     * 作法:
     * if 檢查cust_idx.from_table == 'GHIST_MN'  then
     * cust_idx.cust_sta = status_cod
     * end if
     * 2.舊狀態不是V,新狀態改為V:VIP時，將欄位vip_sta等級改為1
     * 3.舊狀態是V:VIP,新狀態改為不是『V:VIP and B:黑名單』時，將欄位vip_sta等級改為0
     * 4.舊狀態是V:VIP,新狀態改為B:黑名單時，
     * (1)系統顯示確認訊息，若使用者確定修改，則異動狀態且欄位vip_sta等級改為0，否則不異動
     * 確認訊息「狀態改為黑名單，等級變為0，是否確認修改?」
     **/
    r_status_cod(postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        let ls_oriStatusCod = postData.oriSingleData[0].status_cod;
        let ls_statusCod = postData.singleRowData[0].status_cod;
        if (postData.singleRowData[0]["cust_idx.from_table"] == "GHIST_MN") {
            lo_return.effectValues["cust_idx.cust_sta"] = ls_statusCod;
        }
        if (ls_oriStatusCod != "V" && ls_statusCod == "V") {
            lo_return.effectValues["vip_sta"] = 1;
        }
        if (ls_oriStatusCod == "V" && ls_statusCod == "N") {
            lo_return.effectValues["vip_sta"] = 0;
        }
        if (ls_oriStatusCod == "V" && ls_statusCod == "B") {
            lo_return.showConfirm = true;
            lo_return.confirmMsg = commonRule.getMsgByCod("pms21msg3", session.locale);
            lo_return.effectValues["vip_sta"] = 0;
        }

        callback(lo_error, lo_return);
    },

    /**
     * 1.編輯姓名資料時，依輸入姓名資料拆分姓及名，並帶入相關欄位
     * 方式請看『K:\MIS\Bacchus\SYS_飯店前檯\共用程式\依姓名拆分姓與名.docx』
     * 2.同步異動first_nam、last_nam、cust_idx.alt_nam、cust_idx.first_nam、cust_idx.last_nam
     * 3.輸入姓名或生日時，且姓名及生日皆有資料，系統檢查是否已存在相同住客歷史資料，若存在則提示訊息「此住客資料已存在」(僅提示非錯誤,可以繼續操作)，
     * 檢查SQL：SELECT  COUNT(*)  FROM  GHIST_MN
     * WHERE  ATHENA_ID = '德安代號'
     * AND  ALT_NAM = '姓名'
     * AND  BIRTH_DAT = '生日'
     * AND  ROWNUM <= 1
     * @param postData
     * @param session
     * @param callback
     */
    r_alt_nam(postData, session, callback) {
        let lo_return = new ReturnClass();
        let ls_alt_nam = postData.singleRowData[0].alt_nam;
        let ls_ch_str = "";
        let ls_en_str = "";
        let ls_first_name = "";
        let ls_last_name = "";
        //1. 拆分出中文姓名及英文姓名
        let la_str = ls_alt_nam.split(",");
        //若姓名中有兩個以上逗點「,」，則將第一個逗點前的資料列為中文姓名，其餘為英文姓名
        if (la_str.length >= 3) {
            ls_ch_str = la_str[0];
            _.each(la_str, function (lo_str, index) {
                if (index != 0) {
                    ls_en_str += lo_str;
                    if (index != la_str.length - 1) {
                        ls_en_str += ",";
                    }
                }
            });
        }
        //若姓名中僅有一個或無逗點，則檢查姓名中是否有中文
        else {
            //若其中有中文資料，則將姓名列為中文姓名，無英文姓名
            if (this.chkStrHasChinese(ls_alt_nam)) {
                ls_ch_str = ls_alt_nam;
                le_en_str = "";
            }
            //若無中文資料，則將姓名列為英文姓名，無中文姓名
            else {
                ls_en_str = ls_alt_nam;
                ls_ch_str = "";
            }
        }

        //處理中文姓名
        if (ls_ch_str != "" && ls_en_str == "") {
            if (ls_ch_str.length == 2) {
                ls_first_name = ls_ch_str[1];
                ls_last_name = ls_ch_str[0];
            }
            else if (ls_ch_str.length == 3) {
                ls_last_name = ls_ch_str[0];
                ls_first_name = ls_ch_str[1] + ls_ch_str[2];
            }
            else if (ls_ch_str.length == 4) {
                ls_last_name = ls_ch_str[0];
                ls_first_name = ls_ch_str[1] + ls_ch_str[2] + ls_ch_str[3];
            }
            else {
                ls_last_name = ls_ch_str;
                ls_first_name = ls_ch_str;
            }
        }

        //處理英文姓名
        if (ls_en_str != "" && ls_ch_str == "") {
            let la_en_str_by_comma = ls_en_str.split(",");
            if (la_en_str_by_comma.length > 1) {
                ls_last_name = la_en_str_by_comma[0];
                ls_first_name = la_en_str_by_comma[1];
            }
            else {
                let la_en_str_by_space = ls_en_str.split(" ");
                if (la_en_str_by_space.length > 1) {
                    _.each(la_en_str_by_space, function (lo_en_str_by_space, index) {
                        if (la_en_str_by_space.length - 1 > index) {
                            ls_first_name += lo_en_str_by_space;
                            if (la_en_str_by_space.length - 2 > index) {
                                ls_first_name += " ";
                            }
                        }
                        else {
                            ls_last_name = lo_en_str_by_space;
                        }
                    })
                }
                else {
                    ls_first_name = ls_en_str;
                    ls_last_name = ls_en_str;
                }
            }
        }

        /**
         * 組合中文姓與英文姓、中文名與英文名
         * 若同時有中文姓名及英文姓名，則組合中文姓與英文姓、中文名與英文名，並使用逗點分隔
         * 如中文姓為「王」，英文姓為「Wang」，則組合成「王,Wang」
         */
        if (ls_en_str != "" && ls_ch_str != "") {
            let la_en_str = ls_en_str.split(",");
            _.each(ls_ch_str, function (ch_str, index) {
                if (index == 0) {
                    ls_last_name = ch_str + "," + la_en_str[0];
                }
                else {
                    ls_first_name += ch_str;
                }
            });
            ls_first_name += "," + la_en_str[1];
        }

        lo_return.effectValues = {
            first_nam: ls_first_name,
            last_nam: ls_last_name,
            "cust_idx.alt_nam": ls_alt_nam,
            "cust_idx.first_nam": ls_first_name,
            "cust_idx.last_nam": ls_last_name
        };

        this.r_cust_idx_birth_dat(postData, session, function (err, result) {
            if (err) {
                callback(err, result);
            }
            else {
                lo_return.showAlert = result.showAlert;
                lo_return.alertMsg = result.alertMsg;
                callback(err, lo_return);
            }
        });
        // callback(null, lo_return);
        // console.log("中文:" + ls_ch_str, "英文：" + ls_en_str, "姓：" + ls_last_name, "名：" + ls_first_name);
        // console.log("test");
        // queryAgent.query("CHK_ALT_NAM_IS_EXIST", lo_params, function (err, result) {
        // })
    },

    /**
     * 用姓名及生日,檢查是否已存在相同住客歷史資料
     * @param postData  {object}
     * @param session {object}
     * @param callback
     */
    r_cust_idx_birth_dat(postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        let ls_alt_nam = postData.singleRowData[0].alt_nam || "";
        let ls_birth_dat = postData.singleRowData[0]["cust_idx.birth_dat"] == "" ? "" : moment(postData.singleRowData[0]["cust_idx.birth_dat"]).format("YYYY/MM/DD");
        let ls_ori_birth_dat = postData.oriSingleData[0]["cust_idx.birth_dat"] == "" ? "" : moment(postData.oriSingleData[0]["cust_idx.birth_dat"]).format("YYYY/MM/DD");

        if (ls_alt_nam != "" && ls_birth_dat != "" && ls_birth_dat != ls_ori_birth_dat) {
            let lo_param = {
                athena_id: session.user.athena_id,
                alt_nam: ls_alt_nam,
                birth_dat: ls_birth_dat
            };
            queryAgent.query("CHK_ALT_NAM_IS_EXIST", lo_param, function (err, result) {
                if (err) {
                    lo_error = new ErrorClass();
                    lo_return.success = false;
                    lo_error.errorMsg = err;
                }
                else {
                    if (result.alt_nam_count > 0) {
                        lo_return.showAlert = true;
                        lo_return.alertMsg = commonRule.getMsgByCod("pms21msg1", session.locale);
                    }
                }
                callback(lo_error, lo_return);
            });
        }
        else {
            callback(lo_error, lo_return);
        }
    },

    /**
     * 稱謂改變要改性別
     * 1.到稱謂設定查是男是女,設定cust_idx.sex_typ
     * 2.由於這2個欄位有可能是空白,或是男女都可使用,或是不分,所以
     * (1)man_flag=Y && woman_flag <> Y 則 sex_typ = M
     * (2)man_flag<>Y && woman_flag = Y 則 sex_typ = F
     * @param postData {object}
     * @param session {object}
     * @param callback
     */
    r_salute_cod(postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        if (postData.singleRowData[0].salute_cod == postData.oriSingleData[0].salute_cod) {
            lo_return.isEffectFromRule = true;
            return callback(lo_error, lo_return);
        }
        let lb_sex_typ;
        let lo_params = {
            athena_id: session.user.athena_id,
            salute_cod: postData.singleRowData[0].salute_cod
        };
        queryAgent.query("QRY_GENDER_BY_SALUTE_COD", lo_params, function (err, result) {
            if (err) {
                lo_error = new ErrorClass();
                lo_return.success = false;
                lo_error.errorMsg = err;
            }
            else {
                let lb_man = result.man_flag;
                let lb_woman = result.woman_flag;
                if (lb_man == "Y" && lb_woman != "Y") {
                    lb_sex_typ = "M";
                }
                else if (lb_man != "Y" && lb_woman == "Y") {
                    lb_sex_typ = "F";
                }
                else {
                    lb_sex_typ = "M";
                }
                lo_return.effectValues = {"cust_idx.sex_typ": lb_sex_typ};
            }
            callback(lo_error, lo_return);
        });
    },

    /**
     * 國籍改變要改『居住地、使用語言』
     * @param postData {object}
     * @param session {object}
     * @param callback
     */
    r_contry_cod(postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        if (postData.singleRowData[0].contry_cod == postData.oriSingleData[0].contry_cod) {
            lo_return.isEffectFromRule = true;
            return callback(lo_error, lo_return);
        }
        let lo_params = {
            athena_id: session.user.athena_id,
            contry_cod: postData.singleRowData[0].contry_cod
        };
        queryAgent.query("QRY_LANG_BY_CONTRY_COD", lo_params, function (err, result) {
            if (err) {
                lo_error = new ErrorClass();
                lo_return.success = false;
                lo_error.errorMsg = err;
            }
            else if (result != null) {
                lo_return.effectValues = {
                    live_cod: postData.singleRowData[0].contry_cod,
                    lang_cod: result.lang_cod
                };
            }
            callback(lo_error, lo_return);
        });
    },

    /**
     * 1.改不為零時，將欄位status_cod改為V:VIP
     * 2.改為零時，將欄位status_cod改為N:一般
     * 3.若客戶索引檔來源資料表為住客歷史,才同步異動cust_idx.cust_sta
     * 作法:
     * if 檢查cust_idx.from_table == 'GHIST_MN'  then
     * cust_idx.cust_sta = status_cod
     * end if
     * @param postData
     * @param session
     * @param callback
     */
    r_vip_sta(postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        let ln_old_vip_sta = postData.oriSingleData[0].vip_sta;
        let ln_new_vip_sta = postData.singleRowData[0].vip_sta;

        //1.改不為零時，將欄位status_cod改為V:VIP
        if (ln_new_vip_sta != "0") {
            lo_return.effectValues = {status_cod: "V"};
        }
        //2.改為零時，將欄位status_cod改為N:一般
        else {
            lo_return.effectValues = {status_cod: "N"};
        }

        //3.若客戶索引檔來源資料表為住客歷史,才同步異動cust_idx.cust_sta
        if (postData.singleRowData[0]["cust_idx.from_table"] == 'GHIST_MN') {
            lo_return.effectValues["cust_idx.cust_sta"] = lo_return.effectValues.status_cod;
        }

        callback(lo_error, lo_return);
    },

    /**
     * 其他聯絡方式
     * 電子郵件、聯絡方式、地址
     * @param postData
     * @param session
     * @param callback
     */
    async r_1040(postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        let lo_params = {
            athena_id: session.user.athena_id,
            cust_cod: postData.cust_cod
        };

        try {
            let [lo_email, lo_contact, lo_address] = await Promise.all([
                this.getElseContact("QRY_ADDRESS_DT_EMAIL_BY_CUST_COD", lo_params),
                this.getElseContact("QRY_ADDRESS_DT_CONTACT_BY_CUST_COD", lo_params),
                this.getElseContact("QRY_ADDRESS_DT_ADDRESS_BY_CUST_COD", lo_params)
            ]);

            lo_return.defaultValues = {
                emailData: lo_email,
                contactData: lo_contact,
                addressData: lo_address
            };
            callback(lo_error, lo_return);
        }
        catch (err) {
            lo_error = new ErrorClass();
            lo_return.success = false;
            lo_error.errorMsg = err;
        }
    },

    /**
     * 其他聯絡方式
     * @param dao_name {string} dao sql 名稱
     * @param params    {object} sql 條件
     * @returns {Promise<any>}
     */
    async getElseContact(dao_name, params) {
        return new Promise((resolve, reject) => {
            queryAgent.queryList(dao_name, params, 0, 0, function (err, result) {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(result);
                }
            })
        });
    },

    /**
     * 判段字串是否有中文
     * @param str {string} 字串
     */
    chkStrHasChinese(str) {
        if (/.*[\u4e00-\u9fa5]+.*/.test(str)) {
            return true;
        } else {
            return false;
        }
    },

    /**
     * 儲存資料前的檢查(新增)
     * @param postData
     * @param session
     * @param callback
     */
    async saveAddGhistMn(postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;

        let lo_createData = postData.tmpCUD.createData[0];
        let ls_credit_nos = lo_createData.credit_nos;
        let lo_cust_idx = {};
        let lo_ghist_visit_dt = {};
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        };
        //卡號遮罩
        let ls_masked_credit_nos;
        try {
            ls_masked_credit_nos = await new Promise((resolve, reject) => {
                queryAgent.query("QRY_DMASK_CREDIT_NOS", lo_params, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        let ln_dmask_credit_nos = result.dmask_credit_nos || "99";
                        let ls_masked = this.doCreditNosMask(ls_credit_nos, ln_dmask_credit_nos);
                        resolve(ls_masked);
                    }
                });
            });
        }
        catch (err) {
            console.log(err.message);
            lo_error = new ErrorClass();
            lo_error.errorMsg = err.message;
            lo_return.success = false;

            return callback(lo_error, lo_return);
        }

        //卡號加密
        // lo_createData.credit_nos = encryptTools.publicEncrypt(lo_createData.credit_nos);

        _.each(lo_createData, (val, key) => {
            let la_keySplit = key.split(".");

            if (la_keySplit.length > 1) {
                let ls_table_name = la_keySplit[0];
                let ls_field_name = la_keySplit[1];
                if (ls_table_name == "cust_idx") {
                    lo_cust_idx["cust_cod"] = lo_createData.gcust_cod;
                    lo_cust_idx["show_cod"] = lo_createData.show_cod;
                    lo_cust_idx[ls_field_name] = val;
                    delete lo_createData[key];
                }
                else if (ls_table_name == "ghist_visit_dt") {
                    lo_ghist_visit_dt["athena_id"] = lo_createData.athena_id;
                    lo_ghist_visit_dt["gcust_cod"] = lo_createData.gcust_cod;
                    lo_ghist_visit_dt["hotel_cod"] = session.user.hotel_cod;
                    lo_ghist_visit_dt[ls_field_name] = val;
                    delete lo_createData[key];
                }
            }
        });

        let lo_custIdxData = {
            function: 1,
            table_name: 'cust_idx',
        };
        _.extend(lo_custIdxData, lo_cust_idx);
        lo_return.extendExecDataArrSet.push(lo_custIdxData);

        let lo_ghistVisitDtData = {
            function: 1,
            table_name: 'ghist_visit_dt',
        };
        _.extend(lo_ghistVisitDtData, lo_ghist_visit_dt);

        lo_return.extendExecDataArrSet.push(lo_ghistVisitDtData);

        callback(lo_error, lo_return);
    },

    /**
     * 儲存資料前的檢查(刪除)
     * 若已為訂房使用(含在館住客)則不允許刪除
     * 訊息「姓名(歷史編號)此筆資料已為訂房使用(館別代號:館別名稱)，不可刪除」
     * 如「王大明(HFD0000101)此筆資料已為訂房使用(館別01:台北館)，不可刪除」
     * */
    async saveDelGhistMn(postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        let lo_params = {
            athena_id: session.user.athena_id,
            gcust_cod: postData.tmpCUD.deleteData[0].gcust_cod
        };

        await queryAgent.query("CHK_GUEST_MN_IS_EXIST", lo_params, function (err, result) {
            if (err) {
                lo_error = new ErrorClass();
                lo_return.success = false;
                lo_error.errorMsg = err;
            }
            else {
                if (result) {
                    lo_error = new ErrorClass();
                    lo_return.success = false;
                    let ls_multiErrorMsg = commonRule.getMsgByCod("pms21msg2", session.locale);
                    lo_error.errorMsg = _s.sprintf(ls_multiErrorMsg, result.alt_nam, result.show_cod, result.hotel_cod, result.hotel_nam);
                }
            }
        });

        callback(lo_error, lo_return);
    },

    /**
     * 儲存資料前的檢查(修改)
     * @param postData
     * @param session
     * @param callback
     */
    saveUpdateGhistMn(postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;

        let lo_updateData = postData.tmpCUD.updateData[0];
        let lo_cust_idx = {};
        let lo_ghist_visit_dt = {};

        //卡號加密
        lo_updateData.credit_nos = encryptTools.publicEncrypt(lo_updateData.credit_nos);

        _.each(lo_updateData, (val, key) => {
            let la_keySplit = key.split(".");

            if (la_keySplit.length > 1) {
                let ls_table_name = la_keySplit[0];
                let ls_field_name = la_keySplit[1];
                if (ls_table_name == "cust_idx") {
                    lo_cust_idx[ls_field_name] = val;
                    delete lo_updateData[key];
                }
                else if (ls_table_name == "ghist_visit_dt") {
                    lo_ghist_visit_dt["athena_id"] = lo_updateData.athena_id;
                    lo_ghist_visit_dt["gcust_cod"] = lo_updateData.gcust_cod;
                    lo_ghist_visit_dt["hotel_cod"] = session.user.hotel_cod;
                    lo_ghist_visit_dt[ls_field_name] = val;
                    delete lo_updateData[key];
                }
            }
        });

        let lo_custIdxData = {
            function: 2,
            table_name: 'cust_idx',
            condition: [{
                key: 'athena_id',
                operation: "=",
                value: session.user.athena_id
            }, {
                key: 'cust_cod',
                operation: "=",
                value: lo_cust_idx.cust_cod
            }],
        }
        _.extend(lo_custIdxData, lo_cust_idx);
        lo_return.extendExecDataArrSet.push(lo_custIdxData);

        let lo_ghistVisitDtData = {
            function: 2,
            table_name: 'ghist_visit_dt',
            condition: [{
                key: 'athena_id',
                operation: "=",
                value: session.user.athena_id
            }, {
                key: 'hotel_cod',
                operation: "=",
                value: session.user.hotel_cod
            },
                {
                    key: 'gcust_cod',
                    operation: "=",
                    value: lo_ghist_visit_dt.gcust_cod
                }],
        };
        _.extend(lo_ghistVisitDtData, lo_ghist_visit_dt);
        lo_return.extendExecDataArrSet.push(lo_ghistVisitDtData);

        callback(lo_error, lo_return);
    },

    /**
     * 解密加卡號遮罩
     * 信用卡號遮罩
     * 參數選項:2、7、99
     * 2:從第2位遮罩，保留後四位，範例:3***********1234
     * 7:從第7位遮罩，保留後四位，範例:321234******1234
     * 99:無遮罩，範例:3212345678901234
     * 預設值：7
     * @param postData
     * @param session
     * @param callback
     */
    async r_credit_nos(postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        let ls_credit_nos = postData.singleRowData[0].credit_nos;
        let ls_oriCredit_nos = postData.oriSingleData[0].credit_nos;
        //改卡號 和 新增不用遮罩
        if (ls_credit_nos != ls_oriCredit_nos || ls_oriCredit_nos == "") {
            return callback(null, lo_return);
        }

        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        };
        queryAgent.query("QRY_DMASK_CREDIT_NOS", lo_params, (err, result) => {
            if (err) {
                console.error(err);
                lo_return.effectValues = {credit_nos: ls_credit_nos};
            }
            else {
                //資料是否為加密
                if (ls_credit_nos.length > 16) {
                    //TODO: 卡號解密打小良API
                    ls_credit_nos = this.decodeCreditNos(ls_credit_nos);
                }
                let ls_masked = this.doCreditNosMask(ls_credit_nos, result.dmask_credit_nos);
                lo_return.effectValues = {credit_nos: ls_masked};
            }
            callback(lo_error, lo_return);
        });
    },

    /**
     * 信用卡號遮罩
     * 參數選項:2、7、99
     * 2:從第2位遮罩，保留後四位，範例:3***********1234
     * 7:從第7位遮罩，保留後四位，範例:321234******1234
     * 99:無遮罩，範例:3212345678901234
     * 預設值：7
     * @param credit_nos {string} 卡號明碼
     * @param mask_nos {string} 遮罩號碼
     */
    doCreditNosMask(credit_nos, mask_nos) {
        let ls_masked_nos;
        if (mask_nos == "99") return credit_nos;

        let ln_mask_num = credit_nos.length - Number(mask_nos) - 4;
        let ls_replace_str = _s.repeat("*", ln_mask_num);
        ls_masked_nos = _s.splice(credit_nos, mask_nos, ln_mask_num, ls_replace_str);
        return ls_masked_nos;
    }
};