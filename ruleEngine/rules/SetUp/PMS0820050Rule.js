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
        var lo_result = new ReturnClass();
        var lo_error = null;

        postData.field.modificable = postData.singleRowData.sys_default == "Y" ? "N" : "Y";
        callback(lo_error, [postData.field]);
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
            let lo_beginDat = "";
            let lo_endDat = "";
            rent_cal_dat = new Date(rent_cal_dat);

            if (!_.isUndefined(postData.rowData.begin_dat)) {
                lo_beginDat = moment(new Date(postData.rowData.begin_dat));
            }
            if (!_.isUndefined(postData.rowData.end_dat)) {
                lo_endDat = moment(new Date(postData.rowData.end_dat));
            }

            if (lo_beginDat != "" && lo_endDat != "") {

                // 1) 判斷開始日語結束日
                if (lo_endDat.diff(lo_beginDat) < 0) {
                    return cb(true, "結束日期不可以早於開始日期");
                }
                // 2) 判斷結束日與滾房租日
                if (lo_endDat.diff(moment(rent_cal_dat), "days") < 0) {
                    lo_result.isModifiable = false;
                    lo_result.readonlyFields.push("end_dat");
                    lo_result.readonlyFields.push("item_qnt");
                    return cb(true, "結束日不可小於滾房租日");
                }
                // 3) 判斷開始日與滾房租日
                if (lo_beginDat.diff(moment(rent_cal_dat), "days") < 0) {
                    lo_result.isModifiable = false;
                    lo_result.readonlyFields.push("begin_dat");
                    return cb(true, "開始日不可小於滾房租日");
                }
                // 4) 判斷區間是否重疊
                let lb_chkBeginDat;
                let lb_chkEndDat;
                let ls_repeatMsg;
                let li_curIdx = _.findIndex(la_dtData, {key_nos: Number(postData.rowData.key_nos)});

                _.each(la_dtData, function (comparDT, compIdx) {
                    if (comparDT.key_nos != postData.rowData.key_nos) {
                        lb_chkBeginDat = chkDateIsBetween(comparDT.begin_dat, comparDT.end_dat, lo_beginDat);
                        lb_chkEndDat = chkDateIsBetween(comparDT.begin_dat, comparDT.end_dat, lo_endDat);
                        if (lb_chkBeginDat && lb_chkEndDat) {
                            ls_repeatMsg = "第" + (li_curIdx + 1) + "行" + lo_beginDat.format("YYYY/MM/DD") + "~" + lo_endDat.format("YYYY/MM/DD") +
                                "與第" + (compIdx + 1) + "行" + moment(comparDT.begin_dat).format("YYYY/MM/DD") + "~" + moment(comparDT.end_dat).format("YYYY/MM/DD") + ",日期區間重疊";
                            return cb(true, ls_repeatMsg);
                        }
                    }
                });
            }
            else {
                cb(false, null);
            }

        }
    },

    r_HfduserfSaveDel: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        async.waterfall([
            chkSysDefault,
            chkItemIsUse
        ], function (err, result) {
            if (err) {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = "系統預設，不可刪除";
                lo_error.errorCod = "1111";
            }
            callback(lo_error, lo_result);
        });

        function chkSysDefault(cb) {
            if (postData.singleRowData.sys_default == "Y") {
                return cb(true, "系統預設,不可刪除");
            }
            cb(null, "");
        }

        function chkItemIsUse(chkDefault, cb) {
            let params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod,
                item_cod: postData.singleRowData.item_cod
            };
            queryAgent.query("QRY_HFD_USE_DT_COUNT", params, function (err, qryResult) {
                if (!_.isNull(qryResult)) {
                    return cb(true, "已使用中,不可刪除");
                }
                cb(null, "");
            });
        }

    },

    r_HfduserfBegindatAttr: function(postData, session, callback){
        let lo_result = new ReturnClass();
        let lo_error = null;
        let dtData = postData.dtData;
        let field = postData.field;

        // let begin_dat


        callback(lo_error, lo_result);
    },

    r_pms0820050_add: function(postData, session, callback){
        let lo_result = new ReturnClass();
        let lo_error = null;
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        };
        queryAgent.query("R_PMS0820050_ADD", lo_params, function(err, result){
            lo_result.defaultValues = {view_seq: result.view_seq + 1};
            callback(lo_error, lo_result);
        });

    }
};

function chkDateIsBetween(begin_dat, end_dat, now_dat) {
    return moment(now_dat).isBetween(begin_dat, end_dat);
}
