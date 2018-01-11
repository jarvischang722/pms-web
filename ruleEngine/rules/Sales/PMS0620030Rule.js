/**
 * Created by a17010 on 2017/12/18.
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
     * PMS0620030 欄位 指定業務員 下拉資料 popupgrid
     */
    sel_sales_mn_hotel_status_n: function (postData, session, callback) {
        var lo_params = {
            athena_id: session.user.user_athena_id
        };
        var lo_result = new ReturnClass();
        var lo_error = null;

        let ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        let updateFieldName = {
            sales_cod: "sales_cod",
            sales_nam: "sales_mn",
            class_nam: "class_nam"
        };

        let fieldNameChangeLanguage = {
            sales_cod: "業務員代號",
            sales_nam: "業務員姓名",
            class_nam: "組別"
        };

        if (ui_field_name != "") {
            queryAgent.queryList("sel_sales_mn_hotel_status_n".toUpperCase(), lo_params, 0, 0, function (err, userList) {
                if (!err) {
                    lo_result.effectValues.showDataGrid = userList;
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