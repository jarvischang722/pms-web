/**
 * Created by a17010 on 2017/12/11.
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

    /**
     * PMS0620050 搜尋列 hoffice_cust_idx.show_cod popupgrid
     */
    sel_cust_mn_pcust_idx: function (postData, session, callback) {
        var lo_params = {
            athena_id: session.user.user_athena_id
        };
        var lo_result = new ReturnClass();
        var lo_error = null;

        let ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        let updateFieldName = {
            pcust_idx_cust_cod: "pcust_idx_cust_cod",
            pcust_idx_show_cod: "pcust_idx_show_cod",
            pcust_idx_cust_nam: "pcust_idx_cust_nam"
        };

        let fieldNameChangeLanguage = {
            pcust_idx_cust_cod: "公司代號",
            pcust_idx_show_cod: "公司編號",
            pcust_idx_cust_nam: "公司名稱"
        };

        if (ui_field_name != "") {
            queryAgent.queryList("SEL_CUST_MN_FOR_PCUST_IDX".toUpperCase(), lo_params, 0, 0, function (err, custList) {
                if (!err) {
                    lo_result.effectValues.showDataGrid = custList;
                    lo_result.effectValues.updateFieldNameTmp = updateFieldName;
                    lo_result.effectValues.fieldNameChangeLanguageTmp = fieldNameChangeLanguage;
                    callback(lo_error, [lo_result]);
                }
            });
        }
        else {
            callback(null, lo_result);
        }
    },

    /**
     * PMS0620050 搜尋列 hoffice_cust_idx.show_cod popupgrid
     */
    sel_cust_mn_hoffice_cust_idx: function (postData, session, callback) {
        var lo_params = {
            athena_id: session.user.user_athena_id
        };
        var lo_result = new ReturnClass();
        var lo_error = null;

        let ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        let updateFieldName = {
            hoffice_cust_idx_cust_cod: "hoffice_cust_idx_cust_cod",
            hoffice_cust_idx_show_cod: "hoffice_cust_idx_show_cod",
            hoffice_cust_idx_cust_nam: "hoffice_cust_idx_cust_nam"
        };

        let fieldNameChangeLanguage = {
            hoffice_cust_idx_cust_cod: "公司代號",
            hoffice_cust_idx_show_cod: "公司編號",
            hoffice_cust_idx_cust_nam: "公司名稱"
        };

        if (ui_field_name != "") {
            queryAgent.queryList("SEL_CUST_MN_FOR_HOFFICE_CUST_IDX".toUpperCase(), lo_params, 0, 0, function (err, custList) {
                if (!err) {
                    lo_result.effectValues.showDataGrid = custList;
                    lo_result.effectValues.updateFieldNameTmp = updateFieldName;
                    lo_result.effectValues.fieldNameChangeLanguageTmp = fieldNameChangeLanguage;
                    callback(lo_error, [lo_result]);
                }
            });
        }
        else {
            callback(null, lo_result);
        }
    }
};