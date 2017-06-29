/**
 * Created by a14020 on 2017/5/25.
 */

var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var ruleRootPath = appRootDir+"/ruleEngine/";
var queryAgent = require(appRootDir+'/plugins/kplug-oracle/QueryAgent');
var commandRules = require("./../CommonRule");
var ReturnClass = require(ruleRootPath+"/returnClass");
var ErrorClass = require(ruleRootPath+"/errorClass");

module.exports = {

    r_cntry_rf_del: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params={
            athena_id : session.user.athena_id,
        };

        if(!_.isEmpty(postData.singleRowData.live_cod.trim())) {
            queryAgent.query("QRY_HOTEL_SVAL_MN_IS_CNTRY_RF_DEL",params,function (err,guestData) {
                if(!err){
                    if(guestData.hotel_cod != ""){
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg ="[" +  hotel_cod　+ "]館-住客歷史參數-本國國籍, 已設定, 不可刪除";
                        lo_error.errorCod="1111";
                        callback(lo_error,lo_result);
                    }else {
                        callback(lo_error,lo_result);
                    }
                }else
                {
                    callback(err,lo_result);
                }
            })
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
                                if (dataInfo.displayFiled != null) {
                                    if (displayFiled == "Y") {
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
                        })
                    }
                ],function (errMsg, result) {
                    callback(null, result);
                })
            });

        async.parallel(createSubFunc, function (err, result) {
            callback(err, result);
        })
    },
    chk_cntry_rf_contry_cod: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params={
            athena_id : session.user.athena_id,
        };
        callback(lo_error,lo_result);


    }

}