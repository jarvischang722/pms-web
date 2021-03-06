/**
 * Created by a17010 on 2017/10/13.
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
            chkOrderMn,
            delClassHs,
            delHotelDt
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
                        lo_error.errorMsg = commandRules.getMsgByCod("pms62msg1", session.locale);
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
                        lo_error.errorMsg = commandRules.getMsgByCod("pms62msg2", session.locale);
                    }
                }

                cb(lo_error, lo_result);
            });
        }

        //3.未於營業目標設定者可刪除業務員(暫不處理)
        function chkSaleGoal(data, cb) {
            //未於營業目標設定者可刪除業務員(暫不處理)
        }

        //4.刪除組別異動紀錄
        function delClassHs(data, cb) {
            lo_result.extendExecDataArrSet.push({
                function: '0',
                table_name: 'sales_class_hs',
                condition: [{
                    key: 'athena_id',
                    operation: "=",
                    value: lo_params.athena_id
                }, {
                    key: 'sales_cod',
                    operation: "=",
                    value: lo_params.sales_cod
                }],
                event_time: moment().format("YYYY/MM/DD HH:mm:ss"),
                kindOfRel: 'dt'
            });
            cb(lo_error, lo_result);
        }

        //5.刪除hotel dt資料
        function delHotelDt(data, cb) {
            lo_result.extendExecDataArrSet.push({
                function: '0',
                table_name: 'sales_hotel_dt',
                condition: [{
                    key: 'athena_id',
                    operation: "=",
                    value: lo_params.athena_id
                }, {
                    key: 'sales_cod',
                    operation: "=",
                    value: lo_params.sales_cod
                }],
                event_time: moment().format("YYYY/MM/DD HH:mm:ss"),
                kindOfRel: 'dt'
            });
            cb(lo_error, lo_result);
        }
    }
};