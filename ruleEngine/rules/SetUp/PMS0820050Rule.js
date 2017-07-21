/**
 * Created by a16010 on 2017/7/20.
 * 程式代碼: PMS0820050, 櫃檯備品庫存設定
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
    r_HfduserfViewseqAttr: function (postData, session, callback) {
        var result = new ReturnClass();
        var error = null;
        var ls_sys_default = _.findWhere(postData, {ui_field_name: "sys_default"});
        var lo_view_seq = _.findWhere(postData, {ui_field_name: "view_seq"});
        lo_view_seq.modificable = ls_sys_default.modificable == "Y" ? "N" : "Y";
        callback(error, [lo_view_seq]);
    },
    chk_hfd_use_dt_begin_end_dat: function (postData, session, callback) {
        let ls_rentCalDat;
        let la_dtData;
        let lo_result = new ReturnClass();
        let lo_error = null;
        let params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        };

        async.waterfall([
            qryHfdUseDtData,
            qryRentCalDat,
            chkBeginAndEndDat
        ], function (err, result) {
            if (err) {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = result;
                lo_error.errorCod = "1111";
                lo_result.effectValues = postData.rowData;
            }
            callback(lo_error, lo_result);
        });

        function qryHfdUseDtData(cb) {
            params.item_cod = postData.rowData.item_cod;
            queryAgent.queryList("qry_hfd_use_dt".toUpperCase(), params, 0, 0, function (err, getResult) {
                if (getResult) {
                    la_dtData = getResult;
                    cb(null, la_dtData);
                }
            });
        }

        function qryRentCalDat(dtData, cb) {
            queryAgent.query("QRY_RENT_CAL_DAT".toUpperCase(), params, function (err, getResult) {
                if (getResult) {
                    ls_rentCalDat = getResult.rent_cal_dat;
                    cb(null, getResult.rent_cal_dat);
                }
            });
        }

        function chkBeginAndEndDat(rent_cal_dat, cb) {
            let lo_beginDat;
            let lo_endDat;
            if (postData.validateField == "begin_dat") {
                lo_beginDat = moment(new Date(postData.newValue));
                lo_endDat = moment(postData.rowData.end_dat);
            }
            else {
                lo_beginDat = moment(postData.rowData.begin_dat);
                lo_endDat = moment(new Date(postData.newValue));
            }
            // 1)
            if (lo_endDat.diff(lo_beginDat) < 0) {
                return cb(true, "結束日期不可以早於開始日期");
            }
            // 2)
            if (lo_endDat.diff(moment(rent_cal_dat), "days") < 0) {
                return cb(true, "結束日不可小於滾房租日");
            }
            // 3)
            if (lo_beginDat.diff(moment(rent_cal_dat), "days") < 0) {
                return cb(true, "開始日不可小於滾房租日");
            }
            // 4)
            let lb_chkBeginDat;
            let lb_chkEndDat;
            let ls_repeatMsg;
            let li_curIdx = _.findIndex(la_dtData, {key_nos: postData.rowData.key_nos});


            _.each(la_dtData, function (comparDT, compIdx) {
                if (comparDT.key_nos != postData.rowData.key_nos) {
                    lb_chkBeginDat = chkDateIsBetween(comparDT.begin_dat, comparDT.end_dat, lo_beginDat);
                    lb_chkEndDat = chkDateIsBetween(comparDT.begin_dat, comparDT.end_dat, lo_endDat);
                    if (lb_chkBeginDat && lb_chkEndDat) {
                        ls_repeatMsg = "第" + li_curIdx + "行" + lo_beginDat.format("YYYY/MM/DD") + "~" + lo_endDat.format("YYYY/MM/DD") +
                            "與第" + compIdx + "行" + moment(comparDT.begin_dat).format("YYYY/MM/DD") + "~" + moment(comparDT.end_dat).format("YYYY/MM/DD") + ",日期區間重疊";
                        return cb(true, ls_repeatMsg);
                    }
                }
            });


        }
    }
};

function chkDateIsBetween(begin_dat, end_dat, now_dat) {
    return moment(now_dat).isBetween(begin_dat, end_dat);
}
