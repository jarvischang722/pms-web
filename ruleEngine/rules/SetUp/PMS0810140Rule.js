/**
 * Created by a14020 on 2017/4/13.
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
    //FOC_DT.FREE_TYP已經用到的,此筆資料不可刪除
    chk_foc_rf_is_exist_foc_dt: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.fun_hotel_cod,
            free_typ: postData.singleRowData.free_typ
        };

        if (!_.isEmpty(postData.singleRowData.free_typ.trim())) {
            queryAgent.query("QRY_FOC_DT_FREE_GRP_COUNT".toUpperCase(), params, function (err, guestData) {
                if (!err) {
                    if (guestData.source_count > 0) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = "已經用到的,此筆資料不可刪除";
                        lo_error.errorCod = "1111";

                        callback(lo_error, lo_result);
                    } else {
                        callback(lo_error, lo_result);

                    }
                } else {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = err;
                    lo_error.errorCod = "1111";

                    callback(err, lo_result);
                }

            });
        }
    },
    //role_sta=4指定金額時free_qnt 固定為1不可修改
    chk_foc_rf_role_sta: function (postData, session, callback) {
        var roleStaNewValue = postData.newValue;
        var lo_result = new ReturnClass();
        var lo_error = null;

        if (roleStaNewValue == "4") {
            postData.rowData.free_qnt = "1";
            postData.rowData.role_sta = roleStaNewValue;
            lo_result.effectValues = postData.rowData;
            callback(lo_error, lo_result);
        } else {
            callback(lo_error, lo_result);
        }
    },
    //role_sta=4指定金額時free_qnt 固定為1不可修改
    chk_foc_rf_free_qnt: function (postData, session, callback) {
        var freeQntNewValue = postData.singleRowData.free_qnt;
        var roleStaValue = postData.singleRowData.role_sta;
        // var freeQntNewValue = postData.newValue;
        // var roleStaValue = postData.rowData.role_sta;
        var lo_result = new ReturnClass();
        var lo_error = null;

        //if (freeQntNewValue != "1" && roleStaValue == "4") {
        if (freeQntNewValue != "1" && roleStaValue == "4") {
            //postData.rowData.free_qnt = "1";
            lo_error = new ErrorClass();
            lo_error.errorMsg = "FREE規則為『4.指定金額』,FREE間數(分子)必須為1";
            lo_result.success = false;
            lo_error.errorCod = "1111";
            //lo_result.effectValues = postData.rowData;
            callback(lo_error, lo_result);
        } else {
            callback(lo_error, lo_result);
        }
    }
};