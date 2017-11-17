/**
 * Created by a14020 on 2017/7/24.
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
var mongoAgent = require(appRootDir + '/plugins/mongodb');
var ErrorClass = require(ruleRootPath + "/errorClass");
var dataRuleSvc = require(appRootDir + '/services/DataRuleService');

module.exports = {
    //依『貨品代號』,設定『是否扣庫存』
    chkHkproductrfGoodscod: function (postData, session, callback) {
        var userInfo = session.user;
        var prg_id = postData.prg_id;
        var ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        var params = {
            athena_id: session.user.athena_id,
            comp_cod: session.user.cmp_id
        };

        var selectDSFunc = [];
        var result = new ReturnClass();
        var updateFieldName = {
            goods_cod: "goods_cod",
            goods_sna: "goods_sna",
            goods_rmk: "goods_rmk",
            group_nam: "group_nam",
            inv_sta: "inv_sta"

        };

        var fieldNameChangeLanguage = {
            goods_cod: "貨品代號",
            goods_sna: "貨品名稱",
            goods_rmk: "貨品描述",
            group_nam: "貨品小分類"
        };

        if (ui_field_name != "") {
            selectDSFunc.push(
                function (callback) {
                    mongoAgent.UITypeSelect.findOne({
                        prg_id: prg_id,
                        ui_field_name: ui_field_name
                    }).exec(function (err, selRow) {
                        selRow = selRow.toObject();

                        dataRuleSvc.getSelectOptions(params, selRow, function (selectData) {
                            result.effectValues.showDataGrid = selectData;
                            result.effectValues.updateFieldNameTmp = updateFieldName;
                            result.effectValues.fieldNameChangeLanguageTmp = fieldNameChangeLanguage;
                            callback(null, result);
                        });
                    });
                }
            );
            async.parallel(selectDSFunc, function (err, result) {
                callback(err, result);
            });
        }
        else {
            if (postData.singleRowData.goods_cod.trim() != "") {
                postData.singleRowData.inv_sta = "Y";
            } else {
                postData.singleRowData.inv_sta = "N";
            }
            result.effectValues.inv_sta = postData.singleRowData.inv_sta;
            callback(null, result);
        }
    },

    //若N:無服務費時, SERV_RAT = 0
    chkHkproductrfServicesta: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;

        if (postData.singleRowData.service_sta == "false") {
            postData.singleRowData.serv_rat = "0";
            lo_result.effectValues.serv_rat = postData.singleRowData.serv_rat;
            callback(lo_error, lo_result);
        } else {
            callback(lo_error, lo_result);
        }
    },
    //若設要收服務費時，則值要大於0
    chkHkproductrfServrat: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;

        var servratValue = postData.singleRowData.serv_rat;

        if (postData.singleRowData.service_sta == "false") {
            if (postData.singleRowData.serv_rat != 0) {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = commandRules.getMsgByCod("pms84msg4", session.locale);
                postData.singleRowData.serv_rat = "0";
                lo_result.effectValues.serv_rat = postData.singleRowData.serv_rat;
            }
            callback(lo_error, lo_result);
        } else {
            if (isNaN(Number(postData.singleRowData.serv_rat)) || Number(postData.singleRowData.serv_rat) <= 0) {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = commandRules.getMsgByCod("pms84msg5", session.locale);
                postData.singleRowData.serv_rat = "";
                lo_result.effectValues.serv_rat = postData.singleRowData.serv_rat;
            }
            callback(lo_error, lo_result);
        }
    },
    //0541若設要收服務費時，則值要大於0
    r_HkproductrfSaveModify: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;

        var servratValue = postData.singleRowData.serv_rat;

        if(postData.singleRowData.service_sta == "false"){
            if(postData.singleRowData.serv_rat != 0)
            {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = commandRules.getMsgByCod("pms84msg4", session.locale);
                postData.singleRowData.serv_rat = "0";
                lo_result.effectValues.serv_rat = postData.singleRowData.serv_rat;
            }
            callback(lo_error, lo_result);
        }
        else {
            if (isNaN(Number(postData.singleRowData.serv_rat)) || Number(postData.singleRowData.serv_rat) <= 0) {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = commandRules.getMsgByCod("pms84msg5", session.locale);
                postData.singleRowData.serv_rat = "";
                lo_result.effectValues.serv_rat = postData.singleRowData.serv_rat;
            }
            callback(lo_error, lo_result);
        }
    },
    //顯示順序,目前已存在的資料的最大值+1
    rHkproductrfIns: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;

        var params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.fun_hotel_cod
        };

        queryAgent.query("QRYHKPRODUCTRFINS".toUpperCase(), params, function (err, result) {
            if (!err) {
                lo_result.defaultValues.view_seq = result.view_seq;
            }
            callback(lo_error, lo_result);
        });
    },
    r_HkproductrfSaveDel: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;

        var params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.fun_hotel_cod,
            product_nos: postData.singleRowData.product_nos
        };

        queryAgent.query("GET_PRODUCT_NOS_COUNT".toUpperCase(), params, function (err, result) {
            if (!err) {
                if (result.count > 0) {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = commandRules.getMsgByCod("pms84msg6", session.locale);
                }
            }
            callback(lo_error, lo_result);
        });
    },
    //選擇小分類後，帶回中分類
    qryMiddleTyp: function (postData, session, callback) {

        var lo_result = new ReturnClass();
        var lo_error = null;

        var params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.fun_hotel_cod,
            small_typ: postData.singleRowData.small_typ
        };
        if (postData.singleRowData.small_typ == "") {
            return callback(lo_error, lo_result);
        }
        queryAgent.query("GETHKPRODUCTRFMIDDLETYP".toUpperCase(), params, function (err, result) {
            if (!err) {
                postData.singleRowData.middle_typ = result.middle_typ;
                lo_result.success = true;
                lo_result.effectValues = postData.singleRowData;
            }
            callback(lo_error, lo_result);
        });
    }
}