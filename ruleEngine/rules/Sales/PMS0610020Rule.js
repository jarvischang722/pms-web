/**
 * Created by a17010 on 2017/12/11.
 */
var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var ruleRootPath = appRootDir + "/ruleEngine/";
var queryAgent = require(appRootDir + '/plugins/kplug-oracle/QueryAgent');
var commandRules = require("./../CommonRule");
var ReturnClass = require(ruleRootPath + "/returnClass");
var ErrorClass = require(ruleRootPath + "/errorClass");
var tools = require(appRootDir + "/utils/CommonTools");

module.exports = {
    /**
     * PMS0610020 商務公司資料編輯 各欄位預設值
     * @param postData
     * @param session
     * @param callback
     */
    defaultCustMn: function (postData, session, callback) {
        let lo_result = new ReturnClass;
        let lo_error = null;
        let lo_params = postData.params;

        let ls_custMncontractSta = "";
        let ls_custMnCustCod = "";
        let ls_custMnShowCod = "";
        let ls_custMnPcustCod = "";

        async.waterfall([
            //取得欄位contractSta
            function (cb) {
                queryAgent.query("SEL_DEAFULTCONTRACTSTA", {athena_id: session.user.athena_id}, function (err, csData) {
                    if (err) {
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = err;
                        lo_result.success = false;
                    }
                    else {
                        ls_custMncontractSta = csData.status_cod;
                    }
                    cb(lo_error, lo_result);
                });
            },
            //取得欄位custCod、showCod
            function (result, cb) {
                if (_.isUndefined(postData.prg_id)) {
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "Missing Program ID.";
                    lo_result.success = false;
                    cb(lo_error, lo_result);
                }
                else {
                    let prg_id = postData.prg_id;

                    // let apiParams = {
                    //     "REVE-CODE": "PMS0620030",
                    //     "athena_id": userInfo.athena_id,
                    //     "hotel_cod": userInfo.hotel_cod,
                    //     "program_id": prg_id,
                    //     "user": userInfo.usr_id,
                    //     "count": 1,
                    //     "exec_data": [{
                    //         function: '0500',
                    //         sales_cod: sales_cod,
                    //         cust_cod: cust_cod,
                    //         upd_order_mn: upd_order_mn
                    //     }]
                    // };
                    // tools.requestApi(sysConf.api_url, apiParams, function (apiErr, apiRes, data) {
                    //
                    //     if (apiErr || !data) {
                    //         lo_result.success = false;
                    //         lo_error = new ErrorClass();
                    //         lo_error.errorMsg = apiErr;
                    //     }
                    //     else if (data["RETN-CODE"] != "0000") {
                    //         lo_result.success = false;
                    //         lo_error = new ErrorClass();
                    //         console.error(data["RETN-CODE-DESC"]);
                    //         lo_error.errorMsg = "save error!";
                    //     }
                    //     cb(lo_error, lo_result);
                    // });
                    ls_custMnCustCod = "HFD000000000000102  ";
                    ls_custMnShowCod = ls_custMnCustCod.substring(8, 12);
                    ls_custMnPcustCod = ls_custMnCustCod;
                    cb(lo_error, lo_result);
                }
            }
        ], function (err, result) {
            lo_result.defaultValues = {
                cust_mn_cust_cod: ls_custMnCustCod,
                cust_mn_show_cod: ls_custMnShowCod,
                cust_mn_pcust_cod: ls_custMnPcustCod
            };
            callback(lo_error, lo_result);
        });
    }
};