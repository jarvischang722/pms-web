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

    },

    /**
     * order dt 中使用房型及計價房型的下拉資料
     * @param postData
     * @param session
     * @param callback
     */
    select_cod_data: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let ls_ciDat = postData.rowData.ci_dat || "";
        let ls_coDat = postData.rowData.co_dat || "";
        let ls_rateCod = postData.rowData.rate_cod || "";
        try {
            if (ls_ciDat != "" && ls_coDat != "" && ls_rateCod != "") {
                let lo_params = {
                    athena_id: session.user.athena_id,
                    hotel_cod: session.user.hotel_cod,
                    co_dat: moment(postData.rowData.co_dat).format("YYYY/MM/DD"),
                    ci_dat: moment(postData.rowData.ci_dat).format("YYYY/MM/DD"),
                    rate_cod: ls_rateCod
                };

                let la_roomCodSelectData = await new Promise((resolve, reject) => {
                    queryAgent.queryList("SEL_ORDERDTROOMCOD", lo_params, 0, 0, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                _.each(la_roomCodSelectData, (lo_roomCodSelectData, idx) => {
                    la_roomCodSelectData[idx].display = lo_roomCodSelectData.value + ':' + lo_roomCodSelectData.display;
                });

                lo_params.days = postData.rowData.days;
                let la_useCodSelectData = await new Promise((resolve, reject) => {
                    queryAgent.queryList("SEL_ORDERDTUSECOD", lo_params, 0, 0, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                _.each(la_useCodSelectData, (lo_useCodSelectData, idx) => {
                    lo_useCodSelectData[idx].display = lo_useCodSelectData.value + ':' + lo_useCodSelectData.display;
                });

                lo_result.selectField = ["room_cod", "use_cod"];
                lo_result.multiSelectOptions.room_cod = la_roomCodSelectData;
                lo_result.multiSelectOptions.use_cod = la_useCodSelectData;
            }
            else {
                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = "請輸入c/i日期";
            }
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_result, lo_error);
    }
};