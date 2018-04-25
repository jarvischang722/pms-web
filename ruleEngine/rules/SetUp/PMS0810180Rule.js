/**
 * Created by a14020 on 2017/7/13.
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
let mongoAgent = require(appRootDir + '/plugins/mongodb');
let dataRuleSvc = require(appRootDir + '/services/DataRuleService');

module.exports = {
    /**
     * PMS0810180 :ashow_cod檢查及抓取資料
     * @param postData
     * @param session
     * @param callback
     */
    chkGwcustrfAshowcod: function (postData, session, callback) {
        let userInfo = session.user;
        let prg_id = postData.prg_id;
        let field = _.isUndefined(postData.fields) ? {} : postData.fields;
        let ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        let params = postData.singleRowData.ashow_cod == "" ? userInfo : _.extend(postData.singleRowData, userInfo);

        let selectDSFunc = [];
        let result = new ReturnClass();
        let updateFieldName = {
            ashow_cod: "show_cod",
            acust_cod: "cust_cod",
            acust_nam: "cust_nam"
        };

        let fieldNameChangeLanguage = {
            show_cod: "客戶代號",
            cust_cod: "客戶編號",
            cust_nam: "客戶名稱",
            contract1_rmk: "連絡電話",
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
    },

    /**
     * PMS0810180 :cshow_code檢查及抓取資料
     * @param postData
     * @param session
     * @param callback
     */
    chkGwcustrfCshowcod: function (postData, session, callback) {
        let userInfo = session.user;
        let prg_id = postData.prg_id;
        let field = _.isUndefined(postData.fields) ? {} : postData.fields;
        let ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        let params = postData.singleRowData.ashow_cod == "" ? userInfo : _.extend(postData.singleRowData, userInfo);

        let selectDSFunc = [];
        let result = new ReturnClass();
        let updateFieldName = {
            cshow_cod: "show_cod",
            ccust_cod: "cust_cod",
            ccust_nam: "cust_nam"
        };

        let fieldNameChangeLanguage = {
            show_cod: "客戶代號",
            cust_cod: "客戶編號",
            cust_nam: "客戶名稱",
            contract1_rmk: "連絡電話",
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
    },

    /**
     * 通路代號只能有一筆(跳訊息+清除資料)
     * @param 跳訊息
     */
    chkGwcustrfAgentno: function (postData, session, callback) {
        let lo_error = null;
        let lo_result = new ReturnClass();
        params = {
            athena_id: postData.singleRowData.athena_id,
            agent_no: postData.singleRowData.agent_no
        };

        queryAgent.query("QRY_GW_CUST_RF_COUNT".toUpperCase(), params, function (err, result) {
            if (result) {
                if (result.agentnocount > 0) {
                    lo_result.success = true;

                    postData.singleRowData.agent_no = "";
                    lo_result.effectValues = postData.singleRowData;

                    lo_result.showAlert = true;
                    lo_error.alertMsg = commandRules.getMsgByCod("pms81msg31", session.locale);
                }
                callback(lo_error, lo_result);
            }
        });
    }
};