/**
 * Created by a16009 on 2017/11/23.
 */
var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var ruleRootPath = appRootDir　+　"/ruleEngine/";
var queryAgent = require(appRootDir　+　'/plugins/kplug-oracle/QueryAgent');
var mongoAgent = require(appRootDir + '/plugins/mongodb');
var dataRuleSvc = require(appRootDir + '/services/DataRuleService');
var commandRules = require("./../CommonRule");
var ReturnClass = require(ruleRootPath　+　"/returnClass");
var ErrorClass = require(ruleRootPath　+　"/errorClass");
var selOptLib = require("../SelectOptionsLib");


module.exports = {

    //取定席狀態下拉
    lang_bquet_mn_order_sta: function (postData, callback) {
        selOptLib.lang_bquet_mn_order_sta(postData, function (err, result) {
            callback(null, result);
        });
    },

    //聯絡人 popupgrid 下拉
    sel_atten_nam: function (postData, session, callback) {
        var userInfo = session.user;
        var prg_id = postData.prg_id;
        var ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        var params = postData.singleRowData.ashow_cod == "" ? userInfo : _.extend(postData.singleRowData, userInfo);

        var selectDSFunc = [];
        var result = new ReturnClass();

        //Page2欄位:跳出視窗的欄位(對應)
        var updateFieldName = {
            atten_nam: "atten_nam",
            role_rmk: "role_rmk",
            tel_nos: "tel_nos"
        };

        var fieldNameChangeLanguage = {
            atten_nam: "名稱",
            role_rmk: "職稱",
            tel_nos: "電話"
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
        } else {
            callback(null, result);
        }
    },

    //客戶姓名 popupgrid 下拉
    sel_alt_nam: function (postData, session, callback) {
        var userInfo = session.user;
        var prg_id = postData.prg_id;
        var ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        var params = postData.singleRowData.ashow_cod == "" ? userInfo : _.extend(postData.singleRowData, userInfo);

        var selectDSFunc = [];
        var result = new ReturnClass();

        //Page2欄位:跳出視窗的欄位(對應)
        var updateFieldName = {
            show_cod: "show_cod",
            alt_nam: "alt_nam",
            contact_rmk: "contact_rmk",
            first_nam: "first_nam",
            last_nam: "last_nam",
            cust_typ: "cust_typ",
            cust_sta: "cust_sta"
        };

        var fieldNameChangeLanguage = {
            show_cod: "客戶代號",
            alt_nam: "客戶姓名",
            contact_rmk: "聯絡電話",
            first_nam: "First Name",
            last_nam: "Last Name",
            cust_typ: "客戶類別",
            cust_sta: "客戶狀態"
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
        } else {
            callback(null, result);
        }
    },

    //場地代號 popupgrid 下拉
    sel_place_cod: function (postData, session, callback) {
        var userInfo = session.user;
        var prg_id = postData.prg_id;
        var ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        var params = postData.singleRowData.ashow_cod == "" ? userInfo : _.extend(postData.singleRowData, userInfo);

        var selectDSFunc = [];
        var result = new ReturnClass();

        //Page2欄位:跳出視窗的欄位(對應)
        var updateFieldName = {
            show_cod: "show_cod",
            alt_nam: "alt_nam",
            contact_rmk: "contact_rmk",
            first_nam: "first_nam",
            last_nam: "last_nam",
            cust_typ: "cust_typ",
            cust_sta: "cust_sta"
        };

        var fieldNameChangeLanguage = {
            show_cod: "客戶代號",
            alt_nam: "客戶姓名",
            contact_rmk: "聯絡電話",
            first_nam: "First Name",
            last_nam: "Last Name",
            cust_typ: "客戶類別",
            cust_sta: "客戶狀態"
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
        } else {
            callback(null, result);
        }
    }

};