/**
 * Created by a16010 on 2017/7/27.
 * 程式代碼: PMS0830010, 出納員設定
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
var selOptLib = require("../SelectOptionsLib");

module.exports = {
    chkCashierrfCashiercod: function (postData, session, callback) {
        console.log(postData);
    },
    qryCashierrfUsesta: function (postData, callback) {
        selOptLib.qryCashierrfUsesta(postData, function (err, result) {
            callback(result);
        });
    },
    chkCashierrfOpentimes: function (postData, session, callback) {
        let lo_params = {
            athena_id: session.athena_id,
            hotel_cod: session.func_hotel_cod
        };
        this.qryUseShiftOpen(lo_params, function (err, qryResult) {
            postData.visiable = (qryResult == "Y") ? "N" : "Y";
            callback(null, [postData]);
        });
    },

    // QRY_USE_SHIFT_OPEN 參數:是否用班別開班
    qryUseShiftOpen: function (params, callback) {
        queryAgent.query("QRY_USE_SHIFT_OPEN", params, function (err, getResult) {
            if (_.isNull(getResult.use_shift_open) || getResult.use_shift_open == "Y") {
                getResult.use_shift_open = "N";
            }
            callback(err, getResult.use_shift_open);
        });
    },

    chkCashierrfDefshiftcod: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.fun_hotel_cod
        };

        this.qryUseShiftOpen(lo_params, function (err, use_shift_open) {
            if (postData.singleRowData.use_sta == "true" && use_shift_open == "N") {

                async.waterfall([
                    qryRentCalDat,
                    chkDefShiftCod,
                    chkCashierRf
                ], function (err, result) {
                    if (err) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorCod = "1111";
                        lo_error.errorMsg = result;
                        lo_result.effectValues = postData.oriSingleRowData;

                    }
                    callback(lo_error, lo_result);
                });

            }
        });

        function qryRentCalDat(cb) {
            queryAgent.query("QRY_RENT_CAL_DAT", lo_params, function (err, getResult) {
                if (getResult) {
                    cb(null, getResult.rent_cal_dat);
                }
            });
        }

        function chkDefShiftCod(rent_cal_dat, cb) {
            let lo_chkParams = lo_params;
            lo_chkParams.shop_dat = rent_cal_dat;
            lo_chkParams.shift_cod = postData.oriSingleRowData.def_shift_cod;
            queryAgent.query("QRY_OPEN_RF_COUNT", lo_chkParams, function (err, getResult) {
                if (getResult.openrfcount > 0) {
                    cb(true, "今天已經有開班，不能異動");
                }
                else {
                    cb(null, "");
                }
            });
        }

        function chkCashierRf(chk, cb) {
            let lo_chkParams = lo_params;
            lo_chkParams.def_shift_cod = postData.singleRowData.def_shift_cod;
            lo_chkParams.cashier_cod = postData.singleRowData.cashier_cod;
            queryAgent.query("QRY_CASHIER_RF_COUNT", lo_chkParams, function (err, getResult) {
                if (getResult.cashierrfcount > 0) {
                    cb(true, "預設班別不可重複");
                }
                else {
                    cb(null, "");
                }
            });
        }


    }
};