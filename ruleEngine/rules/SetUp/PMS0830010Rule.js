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
        let lo_params = {
            athena_id: session.user.athena_id,
            cmp_id: session.user.cmp_id
        };

        let ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        let result = new ReturnClass();
        let updateFieldName = {
            cashier_cod: "value",
            cashier_nam: "display"
        };

        let fieldNameChangeLanguage = {
            value: "出納員代號",
            display: "出納員名稱"
        };

        if (ui_field_name != "") {
            queryAgent.queryList("QRY_CASHIER_RF_CASHIER_COD", lo_params, 0, 0, function (err, getResult) {
                if (!err) {
                    result.effectValues.showDataGrid = getResult;
                    result.effectValues.updateFieldNameTmp = updateFieldName;
                    result.effectValues.fieldNameChangeLanguageTmp = fieldNameChangeLanguage;
                    callback(null, [result]);
                }
            });
        }
        else {
            callback(null, result);
        }
    },
    // 參數:是否用班別開班
    qryCashierrfUsesta: function (postData, callback) {
        selOptLib.qryCashierrfUsesta(postData, function (err, result) {
            callback(result);
        });
    },

    /**
     * 若參數是否用班別開班 = Y 時，
     * 「預設班別、今日已開班次數及今日最後開班時間」欄位畫面不顯示
     */
    chkCashierrfOpentimes: function (postData, session, callback) {
        let lo_params = {
            athena_id: session.athena_id,
            hotel_cod: session.fun_hotel_cod
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
                getResult.use_shift_open = "Y";
            }
            callback(err, getResult.use_shift_open);
        });
    },

    /**
     * 欄位use_sta=Y且『參數:是否用班別開班=N』則
     * (1)如果欄位def_shift_cod舊值今天已經有開班,則不能異動
     * (2)『預設班別不可重複』
     */
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

        //滾房租日
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


    },

    //開班檔已有資料，則不能刪除
    r_CashierrfDelSave: function (postData, session, callback) {
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        };
        let lo_return = new ReturnClass();
        let lo_error = null;
        let li_counter = 0;
        _.each(postData.deleteData, function (lo_deleteData) {
            lo_params.open_man = lo_deleteData.cashier_cod;

            queryAgent.query("QRY_OPEN_RF_COUNT_BY_OPEN_MAN", lo_params, function (err, getResult) {
                li_counter++;
                if (err) {
                    lo_return.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = err.message;
                    lo_error.errorCod = "1111";
                    callback(lo_error, lo_return);
                    return true;
                }
                if (getResult.openrfcount > 0) {
                    lo_return.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "開班檔已有資料，不能刪除";
                    lo_error.errorCod = "1111";
                }

                if (li_counter == postData.deleteData.length) {
                    callback(lo_error, lo_return);
                }

            });
        });
    },

    useStaDefault: function(postData, session, callback){
        let lo_return = new ReturnClass();
        lo_return.defaultValues = {use_sta: true};
        callback(null, lo_return);
    },

    PMS0830010_cashier_cod: function () {

        var options = new Object;

        options.panelWidth = '200';
        options.idField = 'value';
        options.textField = 'display';

        var columns = [[
            {field:'value', title: '出納員代號', width: 100},
            {field:'display', title: '出納員名稱', width: 100}]];

        options.columns = columns;

        return options;
    }
};