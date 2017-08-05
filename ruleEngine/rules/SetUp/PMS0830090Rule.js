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
var ErrorClass = require(ruleRootPath + "/errorClass");

module.exports = {
    //「類別」為『N:指定使用』時,一定要輸入『客戶代號』
    r_MasterrfSaveModify : function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var masterTyp = postData.singleRowData.master_typ;
        var showCod = postData.singleRowData.show_cod;

        if(masterTyp == "N"){
            if(showCod != ""){
                callback(lo_error,lo_result);
            }
        }
        callback(null,lo_result);
    },
    //「類別」為「系統自動給號」，且「目前狀態」不為「使用中」時，才能刪除
    r_MasterrfSaveDel:function (postData, session, callback) {
        var lo_result = new ReturnClass();
        callback(null,lo_result);
    },
    //1.「目前狀態」為「Y:使用中」時,這個欄位不可改
    //2.舊值=N,詢問是否執行清空客戶代號
    chkMasterrfMastertyp:function (postData, session, callback) {
        var lo_result = new ReturnClass();
        callback(null,lo_result);
    },
    //只能在P:暫停使用／N:未使用做互換
    chkMasterrfMastersta:function (postData, session, callback) {
        var lo_result = new ReturnClass();
        callback(null,lo_result);
    },
    //選擇訂金編號
    chkMasterrfDepositnos: function (postData, session, callback) {
        var userInfo = session.user;
        var prg_id = postData.prg_id;
        var ui_field_name = _.isUndefined(postData.fields) ? "": postData.fields.ui_field_name;
        var params = postData.singleRowData.ashow_cod == "" ? userInfo : _.extend(postData.singleRowData, userInfo);

        var selectDSFunc = [];
        var result = new ReturnClass();
        //Page2欄位:跳出視窗的欄位(對應)
        var updateFieldName = {
            deposit_nos: "deposit_nos",
            deposit_nam: "alt_nam"
        };

        var fieldNameChangeLanguage = {
            deposit_nos : "訂金編號",
            alt_nam : "客戶姓名",
            banlance_amt: "帳戶餘額",
            uniinv_sta:"發票開立方式",
            id_cod : "身份證字號",
            hand_nod:"手工單號",
            type1_nam:"訂金大類"
        };

        if(ui_field_name != "") {
            selectDSFunc.push(
                function (callback) {
                    mongoAgent.UI_Type_Select.findOne({
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
        }else {
            callback(null, result);
        }
    },
    //選擇客戶代號
    chkMasterrfShowcod: function (postData, session, callback) {
        var userInfo = session.user;
        var prg_id = postData.prg_id;
        var ui_field_name = _.isUndefined(postData.fields) ? "": postData.fields.ui_field_name;
        var params = postData.singleRowData.ashow_cod == "" ? userInfo : _.extend(postData.singleRowData, userInfo);

        var selectDSFunc = [];
        var result = new ReturnClass();

        if(postData.singleRowData.master_typ == "N") {
            //Page2欄位:跳出視窗的欄位(對應)
            var updateFieldName = {
                cust_cod: "cust_cod",
                cust_nam: "cust_nam"
            };

            var fieldNameChangeLanguage = {
                show_cod: "客戶代號",
                cust_nam: "客戶名稱",
                cust_typ: "客戶類別"
            };

            if (ui_field_name != "") {
                selectDSFunc.push(
                    function (callback) {
                        mongoAgent.UI_Type_Select.findOne({
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
            } else {
                callback(null, result);
            }
        }
    }
}