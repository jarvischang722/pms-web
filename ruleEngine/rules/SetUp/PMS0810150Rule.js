/**
 * Created by a14020 on 2017/6/7.
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

    //確認"需收訂金"欄位為N需設為0
    chkDpreq: function (postData, session, callback) {
        var dpreqTmp = postData.singleRowData.dp_req;
        var lo_result = new ReturnClass();
        var lo_error = null;
        if (dpreqTmp == "N") {
            postData.singleRowData.dp_rat = "0";
            lo_result.effectValues = postData.singleRowData;
            callback(lo_error, lo_result);
        } else {
            callback(lo_error, lo_result);
        }
    },
    //新增儲存時驗證dp_req(需收訂金)
    r_svr2msg_rf_ins_save: function (postData, session, callback) {
        this.ins_modify_func(postData, session, callback);
    },
    //修改儲存時驗證dp_req(需收訂金)
    r_svr2msg_rf_modify_save: function (postData, session, callback) {
        this.ins_modify_func(postData, session, callback);
    },

    ins_modify_func: function(postData, session, callback){
        var dpreqTemp = postData.singleRowData.dp_req;
        var dpratTemp = postData.singleRowData.dp_rat;

        var guarenrmkTmp = postData.singleRowData.guarentee_rmk.trim();  //內容
        var viewSeqTmp = postData.singleRowData.view_seq;  //排序
        var lo_result = new ReturnClass();
        var lo_error = null;

        if (guarenrmkTmp == "") {
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = commandRules.getMsgByCod("pms81msg25", session.locale);
        } else if (viewSeqTmp == "") {
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = commandRules.getMsgByCod("pms81msg26", session.locale);
        } else {

            if (dpreqTemp == "Y") {
                if (dpratTemp <= 0) {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = commandRules.getMsgByCod("pms81msg27", session.locale);
                }
            } else {
                if (dpratTemp != 0) {
                    postData.singleRowData.dp_rat = "0";
                    lo_result.effectValues = postData.singleRowData;
                }
            }
        }
        callback(lo_error, lo_result);
    },

    //訂房主黨有使用代號則不可刪除
    chk_hfd_guarentee_rf_is_exist_order_mn: function (postData, session, callback) {

        var lo_result = new ReturnClass();
        var lo_error = null;
        var params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.fun_hotel_cod,
            guarentee_typ: postData.singleRowData.guarentee_typ
        };

        if (!_.isEmpty(postData.singleRowData.guarentee_typ.trim())) {
            queryAgent.query("GET_ORDER_MN.GUARENTEE_TYP_COUNT".toUpperCase(), params, function (err, guestData) {
                if (!err) {
                    if (guestData.guarentee_typ_count > 0) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = commandRules.getMsgByCod("pms81msg28", session.locale);
                    }
                } else {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = err;
                    lo_error.errorCod = "1111";
                }
                callback(lo_error, lo_result);
            });
        }
    }
};