/**
 * Created by a16010 on 2017/8/28.
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
    qrySalesMn: function (postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        let lo_params = {
            athena_id: session.user.athena_id,
            class_cod: postData.class_cod
        };
        queryAgent.queryList("QRY_SALES_MN", lo_params, 0, 0, function (err, getResult) {
            if (!err) {
                lo_return.effectValues = getResult;
            }
            else {
                lo_error = new ErrorClass();
                lo_return.success = false;
                lo_error.errorMsg = err;
                lo_error.errorCod = "1111";
            }
            callback(lo_error, lo_return);
        });
    },

    /**
     * 未於業務員資料中指定者可刪除
     * 訊息:業務員資料維護已使用,不可刪除
     */
    chk_sales_class_kvrf_is_exist_sales_mn: function (postData, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        let li_counter = 0;

        let lo_params = {
            athena_id: session.user.athena_id
        };

        _.each(postData.deleteData, function(lo_deleteData){
            lo_params.class_cod = lo_deleteData.class_cod;

            queryAgent.query("CHK_SALES_CLASS_ISEXIST", lo_params, function (err, getResult) {
                li_counter++;
                if (getResult.sales_mn_count > 0) {
                    lo_error = new ErrorClass();
                    lo_return.success = false;
                    lo_error.errorMsg = "業務員資料維護已使用，不可刪除";
                    lo_error.errorCod = "1111";
                    callback(lo_error, lo_return);
                    return true;
                }

                if(li_counter == postData.deleteData.length){
                    callback(lo_error, lo_return);
                }
            });
        });


    }
};

