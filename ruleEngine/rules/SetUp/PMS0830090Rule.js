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
var mongoAgent = require(appRootDir + '/plugins/mongodb');
var dataRuleSvc = require(appRootDir + '/services/DataRuleService');
var commandRules = require("./../CommonRule");
var ReturnClass = require(ruleRootPath + "/returnClass");
var ErrorClass = require(ruleRootPath + "/errorClass");

module.exports = {
    //「類別」為『N:指定使用』時,一定要輸入『客戶代號』
    r_MasterrfSaveModify: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var masterTyp = postData.singleRowData.master_typ;
        var showCod = postData.singleRowData.show_cod;

        if (masterTyp == "N") {
            if (showCod != "") {
                callback(lo_error, lo_result);
            }
            else {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = commandRules.getMsgByCod("pms83msg9", session.locale);
                callback(lo_error, lo_result);
            }
        }
        else {
            callback(lo_error, lo_result);
        }
    },
    //「類別」為「系統自動給號」，且「目前狀態」不為「使用中」時，才能刪除
    r_MasterrfSaveDel: function (postData, session, callback) {

        var lo_result = new ReturnClass();
        var lo_error = null;

        if (postData.singleRowData.master_typ == "A" && postData.singleRowData.master_sta != "Y") {
            callback(lo_error, lo_result);
        }
        else {
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = commandRules.getMsgByCod("pms83msg10", session.locale);
            callback(lo_error, lo_result);
        }
    },

    //舊值=N,詢問是否執行清空客戶代號
    chkMasterrfMastertyp: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;

        //舊值=N,詢問是否執行清空客戶代號
        if (postData.oriSingleRowData.master_typ == "N" && postData.singleRowData != null) {
            lo_result.showConfirm = true;
            lo_result.confirmMsg = commandRules.getMsgByCod("pms83msg11", session.locale);
            lo_result.alertMsg = commandRules.getMsgByCod("pms83msg12", session.locale);
        }
        callback(lo_error, lo_result);

    },
    //選擇訂金編號
    chkMasterrfDepositnos: function (postData, session, callback) {
        var userInfo = session.user;
        var prg_id = postData.prg_id;
        var field = _.isUndefined(postData.fields) ? {} : postData.fields;
        var ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        var params = postData.singleRowData.ashow_cod == "" ? userInfo : _.extend(postData.singleRowData, userInfo);

        var selectDSFunc = [];
        var result = new ReturnClass();
        //Page2欄位:跳出視窗的欄位(對應)
        var updateFieldName = {
            deposit_nos: "deposit_nos",
            deposit_nam: "alt_nam"
        };

        var fieldNameChangeLanguage = {
            deposit_nos: "訂金編號",
            alt_nam: "客戶姓名",
            banlance_amt: "帳戶餘額",
            uniinv_sta: "發票開立方式",
            id_cod: "身份證字號",
            hand_nod: "手工單號",
            type1_nam: "訂金大類"
        };

        if (ui_field_name != "") {
            selectDSFunc.push(
                function (callback) {
                    mongoAgent.UITypeSelect.findOne({
                        prg_id: prg_id,
                        ui_field_name: ui_field_name
                    }).exec(function (err, selRow) {
                        selRow = selRow.toObject();
                        dataRuleSvc.getSelectOptions(params, selRow, field, function (selectData) {

                            //特殊專用
                            _.each(selectData, function (value, index) {
                                switch (value.uniinv_sta) {
                                    case "Y":
                                        value.uniinv_sta = "Y:先開";
                                        break;
                                    case "N":
                                        value.uniinv_sta = "N:後開";
                                        break;
                                    case "X":
                                        value.uniinv_sta = "X:已開";
                                        break;
                                    default:
                                        value.uniinv_sta = "";
                                }
                            });

                            result.effectValues.showDataGrid = selectData.selectDataDisplay;
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
        } else {
            callback(null, result);
        }
    },

    //選擇客戶代號
    chkMasterrfShowcod: function (postData, session, callback) {
        var userInfo = session.user;
        var prg_id = postData.prg_id;
        var field = _.isUndefined(postData.fields) ? {} : postData.fields.ui_field_name;
        var ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        var params = postData.singleRowData.ashow_cod == "" ? userInfo : _.extend(postData.singleRowData, userInfo);

        var selectDSFunc = [];
        var result = new ReturnClass();

        if (postData.singleRowData.master_typ == "N") {
            //Page2欄位:跳出視窗的欄位(對應)
            var updateFieldName = {
                cust_cod: "cust_cod",
                show_cod: "show_cod",
                cust_nam: "cust_nam"
            };

            var fieldNameChangeLanguage = {
                show_cod: "客戶代號",
                cust_nam: "客戶名稱",
                contact1_rmk: "連絡電話",
                status_cod: "狀態"
            };

            if (ui_field_name != "") {
                selectDSFunc.push(
                    function (callback) {
                        mongoAgent.UITypeSelect.findOne({
                            prg_id: prg_id,
                            ui_field_name: ui_field_name
                        }).exec(function (err, selRow) {
                            selRow = selRow.toObject();
                            dataRuleSvc.getSelectOptions(params, selRow, field, function (selectData) {
                                result.effectValues.showDataGrid = selectData.selectDataDisplay;
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
            } else {
                callback(null, result);
            }
        }
    },

    rMasterrfIns: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;

        var lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.fun_hotel_cod
        };

        //不可設 room_mn 房號的第一碼
        queryAgent.queryList("QRY_ROOM_MN_ROOM_NOS", lo_params, 0, 0, function (err, getResult) {
            if (getResult) {
                if (!_.isUndefined(postData.singleRowData.master_nos)) {
                    var prefix = postData.singleRowData.master_nos.substr(0, 1);
                    var index = _.findIndex(getResult, {room_nos: prefix});
                    if (index != -1) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = commandRules.getMsgByCod("pms83msg13", session.locale);
                    }
                }
                callback(lo_error, lo_result);
            }
            if (err) {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = err;
                lo_error.errorCod = "1111";
                callback(lo_error, lo_result);
            }
        });
    },

    // 欄位master_sta=Y時,這筆資料要變成readonly(所有欄位不可改)
    r_0401: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;

        if (postData.singleRowData.master_sta == "Y") {
            lo_error = new ErrorClass();
            lo_result.isModifiable = false;
        }
        callback(lo_error, lo_result);
    }
}