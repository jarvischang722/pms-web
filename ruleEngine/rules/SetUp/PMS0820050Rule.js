/**
 * Created by a16010 on 2017/7/20.
 * 程式代碼: PMS0820050, 櫃檯備品庫存設定
 */

var _ = require("underscore");
var _s = require("underscore.string");
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
        postData.field.modificable = postData.singleRowData.sys_default == "Y" ? "N" : "Y";
        callback(null, [postData.field]);
    },

    /**
     * 參數滾房租日
     * pg_ais2.sf_get_hotel_sval(hotel_cod, 'HFD', 'rent_cal_dat',  Athena_id )
     * 1.欄位「end_dat結束日期」不可以早於「begin_dat開始日期」
     * 2.結束日大於等於滾房租日
     * 3.開始日大於等於滾房租日
     * 4.明細日期不能重疊,例如第2行2015/5/1~2015/7/31,第3行2015/7/31~2015/12/31,這樣就算重疊
     * 訊息:第2行2015/5/1~2015/7/31與第3行2015/7/31~2015/12/31,日期區間重疊
     */
    chk_hfd_use_dt_begin_end_dat: function (postData, session, callback) {
        let ls_rentCalDat;
        let la_dtData = _.clone(postData.allRowData);
        let lo_result = new ReturnClass();
        let lo_error = null;
        let lo_oldValue = postData.oldValue == "" ? postData.rowData[postData.validateField] : postData.oldValue;
        let lb_begin_dat_enable = false;
        let lb_end_dat_enable = false;
        let params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        };

        async.waterfall([
            qryRentCalDat,          //參數滾房租日
            chkBeginAndEndDat
        ], function (err, result) {
            if (err) {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = result;
                lo_error.errorCod = "1111";
                if (postData.rowData.createRow == "Y") {
                    postData.rowData.begin_dat = "";
                    postData.rowData.end_dat = "";
                }
                postData.rowData[postData.validateField] = postData.oldValue;
                lo_result.effectValues = postData.rowData;
            }

            if (lb_end_dat_enable) {
                lo_result.isModifiable = false;
                lo_result.readonlyFields.push("end_dat");
                lo_result.readonlyFields.push("item_qnt");
            }
            if (lb_begin_dat_enable) {
                lo_result.isModifiable = false;
                lo_result.readonlyFields.push("begin_dat");
            }

            callback(lo_error, lo_result);
        });

        function qryRentCalDat(cb) {
            queryAgent.query("QRY_RENT_CAL_DAT".toUpperCase(), params, function (err, getResult) {
                if (getResult) {
                    ls_rentCalDat = getResult.rent_cal_dat;
                    cb(null, getResult.rent_cal_dat);
                }
            });
        }

        function chkBeginAndEndDat(rent_cal_dat, cb) {
            let ls_errMsg = "";
            let lo_beginDat = "";
            let lo_endDat = "";
            rent_cal_dat = new Date(rent_cal_dat);

            try {
                if (postData.editRowData.begin_dat != "" && !_.isUndefined(postData.editRowData.begin_dat)) {
                    lo_beginDat = moment(new Date(postData.editRowData.begin_dat));
                }
                if (postData.editRowData.end_dat != "" && !_.isUndefined(postData.editRowData.end_dat)) {
                    lo_endDat = moment(new Date(postData.editRowData.end_dat));
                }
            }
            catch (ex) {
                lo_beginDat = "";
                lo_endDat = "";
            }

            /**
             * r_HfduserfBegindatAttr
             */
            // 判斷修改時，小於滾房租日不能修改(1.開始日期大於等於滾房租日期可修改、2.結束日期大於等於滾房租日期可修改)
            if (postData.rowData.createRow != "Y" && postData.oldValue == "") {
                if (lo_endDat != "") {
                    // 2) 判斷結束日與滾房租日，不能修改
                    if (lo_endDat.diff(moment(rent_cal_dat), "days") < 0) {
                        if (moment(new Date(lo_oldValue)).diff(moment(rent_cal_dat), "days") < 0) {
                            lb_end_dat_enable = true;
                        }
                        ls_errMsg = commandRules.getMsgByCod("pms82msg18", session.locale);
                        return cb(false, ls_errMsg);
                    }
                }

                if (lo_beginDat != "") {
                    // 3) 判斷開始日與滾房租日，不能修改
                    if (lo_beginDat.diff(moment(rent_cal_dat), "days") < 0) {
                        if (moment(new Date(lo_oldValue)).diff(moment(rent_cal_dat), "days") < 0) {
                            lb_begin_dat_enable = true;
                        }
                        ls_errMsg = commandRules.getMsgByCod("pms82msg17", session.locale);
                        return cb(false, ls_errMsg);
                    }
                }
            }

            /**
             * chk_hfd_use_dt_begin_end_dat
             */
            // 2) 判斷結束日與滾房租日(結束日大於等於滾房租日)
            if (lo_endDat != "") {
                if (lo_endDat.diff(moment(rent_cal_dat), "days") < 0) {
                    ls_errMsg = commandRules.getMsgByCod("pms82msg18", session.locale);
                    return cb(true, ls_errMsg);
                }
            }
            // 3) 判斷開始日與滾房租日(開始日大於等於滾房租日)
            if (lo_beginDat != "") {
                if (lo_beginDat.diff(moment(rent_cal_dat), "days") < 0) {
                    ls_errMsg = commandRules.getMsgByCod("pms82msg17", session.locale);
                    return cb(true, ls_errMsg);
                }
            }

            if (lo_beginDat != "" && lo_endDat != "") {
                // 1) 判斷開始日語結束日(結束日期不可以早於開始日期)
                if (lo_endDat.diff(lo_beginDat) < 0) {
                    ls_errMsg = commandRules.getMsgByCod("pms81msg2", session.locale);
                    return cb(true, ls_errMsg);
                }

                // 4) 判斷區間是否重疊(每筆明細日期不能重疊)
                let lb_chkOverLap;
                let li_curIdx;
                if (!_.isUndefined(postData.editRowData.key_nos)) {
                    li_curIdx = _.findIndex(la_dtData, {key_nos: postData.editRowData.key_nos});
                }
                else {
                    let lo_editRowData = _.clone(postData.editRowData);
                    for (var i = 0; i < la_dtData.length; i++) {
                        var lo_dtData = la_dtData[i];
                        if (_.isEqual(lo_dtData, lo_editRowData)) {
                            li_curIdx = i;
                            break;
                        }
                        else {
                            li_curIdx = -1;
                        }
                    }
                }
                if (!_.isUndefined(postData.allRowData)) {
                    postData.allRowData = _.difference(postData.allRowData, [postData.allRowData[li_curIdx]]);
                    _.each(postData.allRowData, function (comparDT, compIdx) {
                        let ls_begin_dat = moment(new Date(comparDT.begin_dat));
                        let ls_end_dat = moment(new Date(comparDT.end_dat));
                        lb_chkOverLap = commandRules.chkDateIsBetween(ls_begin_dat, ls_end_dat, lo_beginDat, lo_endDat);
                        if (lb_chkOverLap) {
                            let li_allRowDataIdx = _.findIndex(la_dtData, comparDT);
                            ls_errMsg = commandRules.getMsgByCod("pms82msg19", session.locale);
                            ls_errMsg = _s.sprintf(ls_errMsg, li_curIdx + 1, lo_beginDat.format("YYYY/MM/DD"), lo_endDat.format("YYYY/MM/DD"), li_allRowDataIdx + 1, moment(ls_begin_dat).format("YYYY/MM/DD"), moment(ls_end_dat).format("YYYY/MM/DD"));
                            return cb(true, ls_errMsg);
                        }
                    });
                    cb(false, "");
                }
                else {
                    cb(false, "");
                }
            }
            else {
                cb(false, null);
            }

        }
    },

    r_HfduserfSaveDel: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        //刪除dt資料就不做規則驗證
        if (postData.isDtData) {
            callback(lo_error, lo_result);
        }
        else {
            async.waterfall([
                chkSysDefault,
                chkItemIsUse
            ], function (err, chkResult) {
                if (err) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = chkResult;
                    lo_error.errorCod = "1111";
                }
                callback(lo_error, lo_result);
            });
        }

        function chkSysDefault(cb) {
            if (postData.singleRowData.sys_default == "Y") {
                let ls_errMsg = commandRules.getMsgByCod("pms81msg18", session.locale);
                return cb(true, ls_errMsg);
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
                if (qryResult.item_count > 0) {
                    let ls_errMsg = commandRules.getMsgByCod("pms82msg20", session.locale);
                    return cb(true, ls_errMsg);
                }
                cb(null, "");
            });
        }

    },

    r_pms0820050_add: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        };
        queryAgent.query("R_PMS0820050_ADD", lo_params, function (err, result) {
            lo_result.defaultValues = {view_seq: result.view_seq};
            callback(lo_error, lo_result);
        });

    },

    r_pms0820050_dt_add: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var la_allRows = postData.allRows;
        var ln_maxSeqNos = 0;
        _.each(la_allRows, function (lo_rowData) {
            var ln_keyNos = Number(lo_rowData.key_nos);

            if (ln_keyNos >= ln_maxSeqNos) {
                ln_maxSeqNos = ln_keyNos + 1;
            }
        });

        lo_result.defaultValues = {key_nos: ln_maxSeqNos.toString()};
        callback(null, lo_result);
    }
};
