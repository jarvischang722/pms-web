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

    //取是否全場(選項)
    lang_bqplace_dt_isallplace: function (postData, callback) {
        selOptLib.lang_bqplace_dt_isallplace(postData, function (err, result) {
            callback(null, result);
        });
    },

    //場地代號 popupgrid
    sel_popup_place_cod: function (postData, session, callback) {
        var userInfo = session.user;
        var prg_id = postData.prg_id;
        var field = _.isUndefined(postData.fields) ? "": postData.fields;
        var ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        var params = postData.singleRowData.ashow_cod == "" ? userInfo : _.extend(postData.singleRowData, userInfo);

        var selectDSFunc = [];
        var result = new ReturnClass();

        //Page2欄位:跳出視窗的欄位(對應)
        var updateFieldName = {
            place_cod: "place_cod",
            place_nam: "place_nam",
            place_eng: "place_eng",
            rspt_cod: "rspt_cod",
            desk_qnt: "desk_qnt",
            //隱藏欄位
            unit_amt: "unit_amt"
        };

        var fieldNameChangeLanguage = {
            place_cod: "場地代號",
            place_nam: "場地名稱",
            place_eng: "場地別名",
            rspt_cod: "廳別",
            desk_qnt: "桌數",
            //隱藏欄位
            unit_amt: "unit_amt"
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

    chk_begin_tim: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;

        if(postData.editRowData.begin_tim == null || postData.editRowData.begin_tim == "" || postData.editRowData.end_tim == null || postData.editRowData.end_tim == ""){
            callback(lo_error, lo_result);
            return;
        }

        postData.editRowData.begin_tim = postData.editRowData.begin_tim.replace(":", "");
        postData.editRowData.end_tim = postData.editRowData.end_tim.replace(":", "");

        if(Number(postData.editRowData.begin_tim.toString().substr(0,2)) > 23 || Number(postData.editRowData.begin_tim.toString().substr(2,2) > 60) || Number(postData.editRowData.end_tim.toString().substr(0,2)) > 23 || Number(postData.editRowData.end_tim.toString().substr(2,2) > 60)){
            callback(lo_error, lo_result);
            return;
        }

        var begin_hour = Number(postData.editRowData.begin_tim.toString().substr(0,2));
        var begin_min = Number(postData.editRowData.begin_tim.toString().substr(2,2));
        var end_hour = Number(postData.editRowData.end_tim.toString().substr(0,2));
        var end_min = Number(postData.editRowData.end_tim.toString().substr(2,2));

        if(end_hour < begin_hour){
            end_hour += 24;
        }

        var div_hour = end_hour - begin_hour;
        var div_min = end_min - begin_min;

        var total_min = (div_hour * 60) + div_min;

        lo_result.effectValues.order_qnt = formatFloat(total_min / 60, 1);

        //解除
        postData.editRowData.unit_amt = removeAmtFormat(postData.editRowData.unit_amt);

        //取前台金額小數位數
        queryAgent.query('QRY_ROUND_HFD', {}, function (err, Result) {
            if (!err) {
                var round = Result.round_hfd;
                lo_result.effectValues.place_amt = formatFloat(postData.editRowData.unit_amt * lo_result.effectValues.order_qnt, round);
                lo_result.effectValues.special_amt = lo_result.effectValues.place_amt;

                var disc_amt = formatFloat((lo_result.effectValues.place_amt - lo_result.effectValues.special_amt), round);

                if(disc_amt < 0){
                    disc_amt = 0;
                }

                lo_result.effectValues.disc_amt = disc_amt;
                callback(lo_error, lo_result);
            }
            else {
                lo_error = new ErrorClass();
                lo_error.errorMsg = err || "error";
                lo_error.errorCod = "1111";
                callback(lo_error, lo_result);
            }
        });
    },

    chk_special_amt: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;

        if(postData.editRowData.begin_tim == null || postData.editRowData.begin_tim == "" || postData.editRowData.end_tim == null || postData.editRowData.end_tim == ""){
            callback(lo_error, lo_result);
            return;
        }

        //取前台金額小數位數
        queryAgent.query('QRY_ROUND_HFD', {}, function (err, Result) {
            if (!err) {
                var round = Result.round_hfd;

                var disc_amt = formatFloat((postData.editRowData.place_amt - postData.editRowData.special_amt), round);

                if(disc_amt < 0){
                    disc_amt = 0;
                }

                lo_result.effectValues.disc_amt = disc_amt;
                callback(lo_error, lo_result);
            }
            else {
                lo_error = new ErrorClass();
                lo_error.errorMsg = err || "error";
                lo_error.errorCod = "1111";
                callback(lo_error, lo_result);
            }
        });
    }

};

//四捨五入
function formatFloat(num, pos) {
    var size = Math.pow(10, pos);
    return Math.round(num * size) / size;
}

/**
 * 資料轉回無format
 * @param val {string} 依format轉換後的值
 */
function removeAmtFormat(val) {

    var ls_amtValue = "";

    if (val.indexOf(',') > -1) {
        let la_splitAmtValue = val.split(',');
        _.each(la_splitAmtValue, function (ls_splitAmtValue) {
            ls_amtValue = ls_amtValue + ls_splitAmtValue;
        });

        if (ls_amtValue.indexOf('.') > -1) {
            ls_amtValue = ls_amtValue.substring(0, ls_amtValue.indexOf('.'));
        }

        return ls_amtValue;
    }

    if (val.indexOf('.') > -1) {
        ls_amtValue = val.substring(0, val.indexOf('.'));

        return ls_amtValue;
    }

    return val;
}