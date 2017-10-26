/**
 * Created by a17010 on 2017/10/13.
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
    /**
     * 1.未於商務公司資料指定者可刪除
     * 2.未於訂房卡資料指定者可刪除
     * 3.未於營業目標設定者可刪除業務員(暫不處理)
     */
    r_SalesmnDelSave: function (postData, session, callback) {
        let lo_params = {
            athena_id: session.user.athena_id,
            sales_cod: postData.singleRowData.sales_cod
        };
        let lo_result = new ReturnClass();
        let lo_error = null;

        async.waterfall([
            chkCustMn,
            chkOrderMn
        ], function (errMsg, result) {
            callback(lo_error, lo_result);
        });

        //1.
        function chkCustMn(cb) {
            queryAgent.query("CHK_SALES_COD_IS_EXIST_IN_CUST_MN".toUpperCase(), lo_params, function (err, salesData) {
                if (err) {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = err;
                    lo_error.errorCod = "1111";
                }
                else {
                    if (salesData.cust_sales_count > 0) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = "商務公司資料已使用，不可刪除";
                        lo_error.errorCod = "pms62msg1";
                    }
                }
                cb(lo_error, lo_result);
            });
        }
        //2.
        function chkOrderMn(data, cb) {
            queryAgent.query("CHK_SALES_COD_IS_EXIST_IN_ORDER_MN".toUpperCase(), lo_params, function (err, salesData) {
                if (err) {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = err;
                    lo_error.errorCod = "1111";
                }
                else {
                    if (salesData.order_sales_Count > 0) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = "訂房卡資料已使用，不可刪除";
                        lo_error.errorCod = "pms62msg2";
                    }
                }

                cb(lo_error, lo_result);
            });
        }
        //3.未於營業目標設定者可刪除業務員(暫不處理)
        function chkSaleGoal(data, cb){
            //未於營業目標設定者可刪除業務員(暫不處理)
        }
    }
};