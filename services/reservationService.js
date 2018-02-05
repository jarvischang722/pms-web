const _ = require("underscore");
const async = require("async");
const ruleAgent = require("../ruleEngine/ruleAgent");
const queryAgent = require("../plugins/kplug-oracle/QueryAgent");
const moment = require("moment");

exports.qryPageOneDataByRmTyp = function (postData, session, callback) {
    let ln_date_range = 20;
    let lo_userInfo = session.user;
    let lo_params = {
        athena_id: lo_userInfo.athena_id,
        hotel_cod: lo_userInfo.hotel_cod,
        begin_dat: postData.begin_dat
    };
    let ls_end_dat = moment(postData.begin_dat).add(ln_date_range, "days").format("YYYY/MM/DD");
    lo_params.end_dat = ls_end_dat;

    async.waterfall([
        function (cb) {
            queryAgent.query("QRY_WRS_COD", lo_params, function (err, result) {
                let ls_wrs_cod = (_.isUndefined(result.as_wrs_cod) || result.as_wrs_cod.trim() == "" || result.as_wrs_cod == null) ? "@$$" : result.as_wrs_cod.trim();
                cb(err, ls_wrs_cod);
            });
        },
        function (wrs_cod, cb) {
            lo_params.as_wrs_cod = wrs_cod;
            queryAgent.queryList("QRY_RESV_ROOM_TYP", lo_params, 0, 0, function (err, result) {
                cb(err, result);
            });
        }
    ], function (err, la_resvRmTypData) {
        if (la_resvRmTypData.length == 0) {
            callback(null, {});
        }
        else {
            let ln_begin_dat = moment(postData.begin_dat).date();
            let ln_end_dat = ln_begin_dat + ln_date_range;
            let lo_converData = convResvRmTypData(la_resvRmTypData);
            let lo_rtnData = {
                date_range: {
                    begin_dat: ln_begin_dat,
                    end_dat: ln_end_dat,
                    color: lo_converData.color
                },
                roomTypData: lo_converData.rmTypData,
                totalAvailable: lo_converData.calcAllRmData.totalAva,
                occupancy: lo_converData.calcAllRmData.occu,
                phyAvailable: lo_converData.calcAllRmData.phyAva,
                phyOccupancy: lo_converData.calcAllRmData.phyOccu
            };

            callback(err, lo_rtnData);
        }
    });

};

/**
 * left_qnt, use_qnt, room_qnt, over_limit, phy_qnt
 * @param la_resvRmTypData
 * @returns {*}
 */
function convResvRmTypData(la_resvRmTypData) {
    let ln_date_range = 20;
    let la_color = [];
    let lb_isColorInit = false;
    let la_rmTypGroupByRmCod = _.groupBy(la_resvRmTypData, "room_cod");

    _.each(la_rmTypGroupByRmCod, function (la_resvRmCod, idx) {
        la_resvRmCod = _.sortBy(la_resvRmCod, "batch_dat");
        _.each(la_resvRmCod, function (lo_resvRmCod) {
            if (lb_isColorInit == false) {
                la_color.push(lo_resvRmCod.color);
            }
            lo_resvRmCod.batch_dat = moment(lo_resvRmCod.batch_dat).format("YYYY/MM/DD");
        });
        lb_isColorInit = true;

        let la_rmTypGroupByRmQnt = _.groupBy(la_resvRmCod, "room_qnt");
        let la_rmTypConvData = [];
        _.each(la_rmTypGroupByRmQnt, function (la_resvRmQnt, key) {
            let ln_begin_dat = moment(la_resvRmQnt[0].batch_dat).date();
            let ln_end_dat = moment(la_resvRmQnt[la_resvRmQnt.length - 1].batch_dat).date();
            if (ln_end_dat <= ln_begin_dat) {
                ln_end_dat = ln_begin_dat + la_resvRmQnt.length - 1;
            }
            let lo_resvRmTypData = {
                room_qnt: key,
                begin_dat: moment(la_resvRmQnt[0].batch_dat).date(),
                end_dat: ln_end_dat,
                emptyRm: [],
                useRm: [],
                wrsRm: [],
                notWrsRm: [],
                overBooking: []
            };
            _.each(la_resvRmQnt, function (lo_resvRmQnt) {
                lo_resvRmTypData.emptyRm.push(lo_resvRmQnt.left_qnt);
                lo_resvRmTypData.useRm.push(lo_resvRmQnt.use_qnt);
                lo_resvRmTypData.wrsRm.push(lo_resvRmQnt.wrs_block);
                lo_resvRmTypData.notWrsRm.push(lo_resvRmQnt.notwrs_block);
                lo_resvRmTypData.overBooking.push(lo_resvRmQnt.over_limit);
            });
            la_rmTypConvData.push(lo_resvRmTypData);
        });


        la_rmTypGroupByRmCod[idx] = _.clone(la_rmTypConvData);
    });

    let la_sortRmTypByBatchDat = _.sortBy(la_resvRmTypData, "batch_dat");
    let ln_totalAva = 0;
    let ln_occu = 0;
    let ln_phyAva = 0;
    let ln_phyOccu = 0;
    let ln_begin_dat = moment(la_sortRmTypByBatchDat[0].batch_dat).date();
    let ln_end_dat = ln_begin_dat + ln_date_range;

    let lo_totalAva = {
        begin_dat: ln_begin_dat,
        end_dat: ln_end_dat,
        number: []
    };
    let lo_occu = {
        begin_dat: ln_begin_dat,
        end_dat: ln_end_dat,
        number: []
    };
    let lo_phyAva = {
        begin_dat: ln_begin_dat,
        end_dat: ln_end_dat,
        number: []
    };
    let lo_phyOccu = {
        begin_dat: ln_begin_dat,
        end_dat: ln_end_dat,
        number: []
    };
    let ls_batch_dat = null;
    _.each(la_sortRmTypByBatchDat, function (lo_sortRmTypByBatchDat, idx) {
        if (ls_batch_dat != lo_sortRmTypByBatchDat.batch_dat) {
            if (ls_batch_dat != null) {
                lo_totalAva.number.push(ln_totalAva);
                lo_occu.number.push(ln_occu);
                lo_phyAva.number.push(ln_phyAva);
                lo_phyOccu.number.push(ln_phyOccu);
                ln_totalAva = 0;
                ln_occu = 0;
                ln_phyOccu = 0;
                ln_phyAva = 0;
            }
            ls_batch_dat = lo_sortRmTypByBatchDat.batch_dat;
        }
        ln_totalAva += lo_sortRmTypByBatchDat.left_qnt;
        ln_occu = lo_sortRmTypByBatchDat.order_rat_all;
        ln_phyAva += lo_sortRmTypByBatchDat.phy_qnt;
        ln_phyOccu = lo_sortRmTypByBatchDat.order_rat_phy;

        if (idx == la_sortRmTypByBatchDat.length - 1) {
            lo_totalAva.number.push(ln_totalAva);
            lo_occu.number.push(ln_occu);
            lo_phyAva.number.push(ln_phyAva);
            lo_phyOccu.number.push(ln_phyOccu);
        }
    });

    let lo_calcAllRmData = {
        totalAva: lo_totalAva,
        occu: lo_occu,
        phyAva: lo_phyAva,
        phyOccu: lo_phyOccu
    };

    return {rmTypData: la_rmTypGroupByRmCod, color: la_color, calcAllRmData: lo_calcAllRmData};
}