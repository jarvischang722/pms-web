/**
 * Created by a14020 on 2017/7/13.
 */
let _ = require("underscore");
let moment = require("moment");
let async = require("async");
let path = require('path');
let appRootDir = path.dirname(require.main.filename);
let ruleRootPath = appRootDir + "/ruleEngine/";
let queryAgent = require(appRootDir + '/plugins/kplug-oracle/QueryAgent');
let commandRules = require("./../CommonRule");
let ReturnClass = require(ruleRootPath + "/returnClass");
let ErrorClass = require(ruleRootPath + "/errorClass");
let mongoAgent = require(appRootDir + '/plugins/mongodb');
let dataRuleSvc = require(appRootDir + '/services/DataRuleService');

module.exports = {
    /**
     * PMS0810180 :ashow_cod檢查及抓取資料
     * @param postData
     * @param session
     * @param callback
     */
    chkGwcustrfAshowcod: function (postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        if (postData.singleRowData.ashow_cod == "") return callback(lo_error, lo_return);

        async.waterfall([
            function (cb) {
                let lo_params = {
                    athena_id: session.user.athena_id,
                    ashow_cod: postData.singleRowData.ashow_cod
                };
                queryAgent.query("QRY_CUST_MN_FOR_ASHOW_COD", lo_params, function (err, result) {
                    if (err) {
                        cb(err, null);
                    }
                    else {
                        let lo_effectData = {
                            ashow_cod: result.show_cod,
                            acust_cod: result.cust_cod,
                            acust_nam: result.cust_nam
                        };
                        cb(null, lo_effectData);
                    }
                });
            },
            function (effectData, cb) {
                if (postData.singleRowData.ashow_cod == postData.oriSingleRowData.ashow_cod) {
                    return cb(null, effectData);
                }
                let lo_params = {
                    athena_id: session.user.athena_id,
                    acust_cod: effectData.acust_cod
                };
                queryAgent.query("QRY_ACUST_COD_IS_EXIST", lo_params, function (err, result) {
                    if (err) {
                        cb(err, null);
                    }
                    else if (result.acust_cod_count > 0) {
                        let ls_errorMsg = commandRules.getMsgByCod("pms81msg45", session.locale);
                        cb(ls_errorMsg, null);
                    }
                    else {
                        cb(null, effectData);
                    }
                });
            }
        ], function (err, result) {
            if (err) {
                lo_return.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = err;
            }
            else {
                lo_return.effectValues = result;
            }

            callback(lo_error, lo_return);
        });
    },

    /**
     * PMS0810180 :cshow_code檢查及抓取資料
     * @param postData
     * @param session
     * @param callback
     */
    chkGwcustrfCshowcod: function (postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        if (postData.singleRowData.cshow_cod == "") return callback(lo_error, lo_return);
        let lo_params = {
            athena_id: session.user.athena_id,
            ashow_cod: postData.singleRowData.cshow_cod
        };
        queryAgent.query("QRY_CUST_MN_FOR_ASHOW_COD", lo_params, function (err, result) {
            if (err) {
                lo_return.success = false;
                lo_error = new ErrorClass();
                lo_error.errMsg = err;
            }
            else {
                lo_return.effectValues = {
                    cshow_cod: result.show_cod,
                    ccust_cod: result.cust_cod,
                    ccust_nam: result.cust_nam
                };
            }
            callback(lo_error, lo_return);
        });
    },

    /**
     * 通路代號只能有一筆(跳訊息+清除資料)
     * @param 跳訊息
     */
    chkGwcustrfAgentno: function (postData, session, callback) {
        let lo_error = null;
        let lo_result = new ReturnClass();
        params = {
            athena_id: postData.singleRowData.athena_id,
            agent_no: postData.singleRowData.agent_no
        };

        queryAgent.query("QRY_GW_CUST_RF_COUNT".toUpperCase(), params, function (err, result) {
            if (result) {
                if (result.agentnocount > 0) {
                    lo_result.success = true;

                    postData.singleRowData.agent_no = "";
                    lo_result.effectValues = postData.singleRowData;

                    lo_result.showAlert = true;
                    lo_result.alertMsg = commandRules.getMsgByCod("pms81msg31", session.locale);
                }
                callback(lo_error, lo_result);
            }
        });
    }
};