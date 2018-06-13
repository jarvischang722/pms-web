/**
 * Created by a17007 on 2018/6/7.
 */
const _ = require("underscore");
const _s = require("underscore.string");
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
     * 編輯單筆訂房卡時，將order_appraise轉到tmp_order_appraise
     * @param postData
     * @param session
     * @param callback
     */
    convert_oder_appraise_to_tmp: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let apiParams = {
            "REVE-CODE": "PMS0110041",
            "prg_id": "PMS0110041",
            "func_id": "0900",
            "athena_id": session.user.athena_id,
            "hotel_cod": session.user.hotel_cod,
            "ikey": postData.ikey
        };
        tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
            if (apiErr || !data) {
                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = apiErr;
            }
            else if (data["RETN-CODE"] != "0000") {
                lo_result.success = false;
                lo_error = new ErrorClass();
                console.error(data["RETN-CODE-DESC"]);
                lo_error.errorMsg = data["RETN-CODE-DESC"];
            }
            callback(lo_error, lo_result);
        });
        // callback(lo_error, lo_result);

    }
};