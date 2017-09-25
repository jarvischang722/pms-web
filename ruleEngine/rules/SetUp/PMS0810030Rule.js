/**
 * Created by a14020 on 2017/5/25.
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

module.exports = {

    r_cntry_rf_del: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params = {
            athena_id: session.user.athena_id,
            contry_cod:postData.singleRowData.contry_cod
        };

        if (!_.isEmpty(postData.singleRowData.contry_cod.trim())) {
            queryAgent.query("QRY_HOTEL_SVAL_MN_IS_CNTRY_RF_DEL", params, function (err, guestData) {
                if (!err) {
                    if (guestData != null) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = "[" + hotel_cod + "]館-住客歷史參數-本國國籍, 已設定, 不可刪除";
                        lo_error.errorCod = "1111";
                        callback(lo_error, lo_result);
                    } else {
                        callback(lo_error, lo_result);
                    }
                } else {
                    callback(err, lo_result);
                }
            });
        }

    },
    r_cntry_rf_show_hq_cod: function (field, userInfo, callback) {
        var params = {
            athena_id: userInfo.athena_id
        };
        var createSubFunc = [];
        createSubFunc.push(
            function (callback) {
                async.waterfall([
                    function (callback) {
                        queryAgent.query("CHK_PG_HAVE_EIS_SYS", params, function (err, dataInfo) {
                            if (!err) {
                                if (dataInfo.displayfiled != null) {
                                    if (dataInfo.displayfiled == "Y") {
                                        field.visiable = "Y";
                                        callback(null, field);
                                    } else {
                                        field.visiable = "N";
                                        callback(null, field);
                                    }
                                } else {
                                    field.visiable = "N";
                                    callback(null, field);
                                }
                            } else {
                                field.visiable = "N";
                                callback(err, field);
                            }
                        });
                    }
                ], function (errMsg, result) {
                    callback(null, result);
                });
            });

        async.parallel(createSubFunc, function (err, result) {
            callback(err, result);
        });
    },
    //選擇國籍代號，如統計代號沒值則從國籍代入
    chk_cntry_rf_contry_cod: function (postData, session, callback) {
        var contryCode = postData.newValue;
        var statisticCod = postData.rowData.statistic_cod;
        var lo_result = new ReturnClass();
        var lo_error = null;

        if(!_.isEmpty(statisticCod)) {
            callback(lo_error, lo_result);
        }else {
            lo_result.success = true;
            postData.rowData.statistic_cod = contryCode;
            lo_result.effectValues = postData.rowData;
            callback(lo_error, lo_result);
        }

    },
    //選擇格式後，顯示備註欄位
    qry_cntry_rf_mail_fmt_remark1: function (postData, session, callback) {
        var mailFmtDisplayName = postData.newValue;
        var lo_result = new ReturnClass();
        var lo_error = null;

        var params = {
            athena_id: session.user.athena_id,
            mail_fmt: postData.rowData.mail_fmt
        };

        queryAgent.query("QRY_CNTRY_RF_REMARK".toUpperCase(), params, function (err, result) {
            if (!err) {
                postData.rowData.remark1 = result.remark1;
                lo_result.success = true;
                lo_result.effectValues = postData.rowData;
                callback(lo_error, lo_result);
            }
        })
    },
    PMS0810030_mail_fmt: function () {

        var options = new Object;

        options.panelWidth = '200';
        options.idField = 'value';
        options.textField = 'value';

        var columns = [[
            {field:'value',title:'格式代號',width:100},
            {field:'display',title:'格式說明',width:100}]];

        options.columns = columns;

        return options;
    }
};