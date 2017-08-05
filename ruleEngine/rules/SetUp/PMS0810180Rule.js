/**
 * Created by a14020 on 2017/7/13.
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
var mongoAgent = require(appRootDir + '/plugins/mongodb');
var dataRuleSvc = require(appRootDir + '/services/DataRuleService');

module.exports = {
    /*
     PMS0810180 :ashow_cod檢查及抓取資料
     */
    chkGwcustrfAshowcod: function (postData, session, callback) {
        var userInfo = session.user;
        var prg_id = postData.prg_id;
        var ui_field_name = _.isUndefined(postData.fields) ? "": postData.fields.ui_field_name;
        var params = postData.singleRowData.ashow_cod == "" ? userInfo : _.extend(postData.singleRowData, userInfo);

        var selectDSFunc = [];
        var result = new ReturnClass();
        var updateFieldName = {
            ashow_cod: "show_cod",
            acust_cod: "cust_cod",
            acust_nam: "cust_nam"
        };

        var fieldNameChangeLanguage = {
            show_cod: "客戶代號",
            cust_cod: "客戶編號",
            cust_nam: "客戶名稱",
            contract1_rmk:"連絡電話",
            status_cod : "狀態"
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
    /*
     PMS0810180 :cshow_code檢查及抓取資料
     */
    chkGwcustrfCshowcod: function (postData, session, callback) {
        var userInfo = session.user;
        var prg_id = postData.prg_id;
        var ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        var params = postData.singleRowData.ashow_cod == "" ? userInfo : _.extend(postData.singleRowData, userInfo);

        var selectDSFunc = [];
        var result = new ReturnClass();
        var updateFieldName = {
            cshow_cod: "show_cod",
            ccust_cod: "cust_cod",
            ccust_nam: "cust_nam"
        };

        var fieldNameChangeLanguage = {
            show_cod: "客戶代號",
            cust_cod: "客戶編號",
            cust_nam: "客戶名稱",
            contract1_rmk:"連絡電話",
            status_cod : "狀態"
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