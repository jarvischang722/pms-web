/**
 * Created by a16010 on 2018/03/01.
 */
const _ = require("underscore");
const moment = require("moment");
const async = require("async");
const path = require('path');
const appRootDir = path.dirname(require.main.filename);
const ruleRootPath = appRootDir + "/ruleEngine/";
const queryAgent = require(appRootDir + '/plugins/kplug-oracle/QueryAgent');
const commandRules = require("./../CommonRule");
const ReturnClass = require(ruleRootPath + "/returnClass");
const ErrorClass = require(ruleRootPath + "/errorClass");
const tools = require(appRootDir + "/utils/CommonTools");
const sysConf = require("../../../configs/systemConfig");

module.exports = {
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
        if (postData["cust_idx.from_table"] == "GHIST_MN") {
            lo_return.effectValues["cust_idx.cust_sta"] = postData.status_cod;
        }
        if (postData.oldValue != "V" && postData.newValue == "V") {
            lo_return.effectValues["vip_sta"] = 1;
        }
        if (postData.oldValue == "V" && (postData.newValue != "V" && postData.newValue != "B")) {
            lo_return.effectValues["vip_sta"] = 0;
        }

        callback(lo_error, lo_return);
    },

    /**
     * 1.編輯姓名資料時，依輸入姓名資料拆分姓及名，並帶入相關欄位
     方式請看『K:\MIS\Bacchus\SYS_飯店前檯\共用程式\依姓名拆分姓與名.docx』
     2.同步異動first_nam、last_nam、cust_idx.alt_nam、cust_idx.first_nam、cust_idx.last_nam
     3.輸入姓名或生日時，且姓名及生日皆有資料，系統檢查是否已存在相同住客歷史資料，若存在則提示訊息「此住客資料已存在」(僅提示非錯誤,可以繼續操作)，
     檢查SQL：SELECT  COUNT(*)  FROM  GHIST_MN
     WHERE  ATHENA_ID = '德安代號'
     AND  ALT_NAM = '姓名'
     AND  BIRTH_DAT = '生日'
     AND  ROWNUM <= 1"
     */
    r_alt_nam(postData, session, callback) {

    }
};