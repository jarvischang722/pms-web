/**
 * Created by Jun on 2017/5/18.
 * PMS0810210 活動展期規則
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
     * 1.新增時key_nos產生方式
     select max(key_nos) + 1 from hfd_daily_event where athena_id = ? and hotel_cod = ?
     2.若結束日期為空值將開始日期帶到結束日期
     * @param postData
     * @param session
     * @param callback
     */
    qry_key_nos: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;

        lo_result.defaultValues = commandRules.getCreateCommonDefaultDataRule(session);

        var lo_max_key_nos = 0;
        for(i = 0; i < postData.gridDataInfo.rows.length; i++) {
            var lo_current_key_nos = Number(postData.gridDataInfo.rows[i].key_nos);
            if(lo_current_key_nos > lo_max_key_nos)
                lo_max_key_nos = lo_current_key_nos;
        }

        lo_result.defaultValues.key_nos = lo_max_key_nos += 1;

        callback(lo_error, lo_result);
    },
    chk_hfd_daily_event_ins: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var singleRowData = postData["singleRowData"];

        if (_.isUndefined(singleRowData["end_dat"]) || _.isEmpty(singleRowData["end_dat"])) {
            singleRowData["end_dat"] = singleRowData["begin_dat"];
        }

        lo_result.modifiedRowData = singleRowData;
        callback(lo_error, lo_result);
    },
    //Sam:確認開始日期小於結束日期
    chk_begin_day_correct : function (postData, session, callback) {

        var lo_result = new ReturnClass();
        var lo_error = null;

        if(postData.rowData.end_dat == null || postData.rowData.end_dat == '') return; //如沒資料就跳過規則判斷

        var startDate = postData.newValue;
        var endDate = postData.rowData.end_dat;

        if ((Date.parse(startDate)).valueOf() <= (Date.parse(endDate)).valueOf()) {
            callback(lo_error, lo_result);
        } else {
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = "開始日期不能大於結束日期";
            lo_error.errorCod = "1111";
            postData.rowData.begin_dat = "";
            lo_result.effectValues = postData.rowData;
            callback(lo_error, lo_result);
        }
    },
    //Sam:確認開始日期小於結束日期
    chk_end_day_correct : function (postData, session, callback) {

        var lo_result = new ReturnClass();
        var lo_error = null;

        if(postData.rowData.begin_dat == null || postData.rowData.begin_dat == '') return; //如沒資料就跳過規則判斷

        var startDate = postData.rowData.begin_dat;
        var endDate = postData.newValue;

        if ((Date.parse(startDate)).valueOf() <= (Date.parse(endDate)).valueOf()) {
            callback(lo_error, lo_result);
        } else {
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = "結束日期不能小於開始日期";
            lo_error.errorCod = "1111";
            postData.rowData.end_dat = "";
            lo_result.effectValues = postData.rowData;
            callback(lo_error, lo_result);
        }
    }
};