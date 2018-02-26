const _ = require("underscore");
const async = require("async");
const ruleAgent = require("../ruleEngine/ruleAgent");
const queryAgent = require("../plugins/kplug-oracle/QueryAgent");
const moment = require("moment");
const fs = require("fs");
const tools = require('../utils/CommonTools');
const sysConf = require("../configs/systemConfig");
const alasql = require("alasql");

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

exports.qryRmNosPageOneMap = async (postData, session) => {
    let rmNosObj = new rmNosPageOneMap(postData, session);
    try {
        let lb_ps_result = await rmNosObj.callProcedure();
        let lo_rmNosPageOneData = await rmNosObj.qryRmNosPageOneData();
        let lo_convRmNosData = await rmNosObj.convRmNosData(lo_rmNosPageOneData);

        return {success: true, data: lo_convRmNosData};
    }
    catch (error) {
        return {success: false, errMsg: error.message};
    }
};

class rmNosPageOneMap {
    constructor(postData, session) {
        this.postData = postData;
        this.userInfo = session.user;
        this.ln_date_range = 14;
    }

    /**
     * 查詢下拉欄位資料格式轉換
     */
    convSearchFieldsData() {
    }

    /**
     * 查詢房號資料
     */
    async callProcedure() {
        this.convSearchFieldsData();
        let lo_apiParam = {
            "REVE-CODE": "PMS0110050",
            hotel_cod: this.userInfo.hotel_cod,
            athena_id: this.userInfo.athena_id,
            program_id: "PMS0110050",
            count: 1,
            user: this.userInfo.usr_id,
            func_id: "0100",
            exec_data: {
                "1": {
                    athena_id: this.userInfo.athena_id,
                    hotel_cod: this.userInfo.hotel_cod,
                    usr_id: this.userInfo.usr_id,
                    socket_id: this.postData.socket_id,
                    begin_dat: this.postData.begin_dat,
                    query_days: this.ln_date_range,
                    room_cod: this.postData.room_cod || "",
                    room_nos: this.postData.room_nos || "",
                    character_rmk: this.postData.character_rmk || "",
                    build_nos: this.postData.build_nos || "",
                    floor_nos: this.postData.floor_nos || ""
                }
            }
        };

        return new Promise((resolve, reject) => {
            tools.requestApi(sysConf.api_url, lo_apiParam, function (err, res, data) {
                var errorMsg = "";
                if (err || !data) {
                    reject(err);
                } else if (data["RETN-CODE"] != "0000") {
                    errorMsg = data["RETN-CODE-DESC"] || '發生錯誤';
                    console.error(errorMsg);
                    reject({message: errorMsg});
                } else {
                    resolve(true);
                }
            });
        });
    }

    /**
     * 查詢DB: roomList, roomPeriod, roomUse
     */
    async qryRmNosPageOneData() {
        let lo_params = {
            athena_id: this.userInfo.athena_id,
            hotel_cod: this.userInfo.hotel_cod,
            usr_id: this.userInfo.usr_id,
            socket_id: this.postData.socket_id
        };
        let [la_roomList, la_roomPeriod, la_roomUse] = await Promise.all([
            //查房型資料
            new Promise((resolve, reject) => {
                queryAgent.queryList("QRY_ROOM_LIST", lo_params, 0, 0, function (err, data) {
                    if (err) {
                        reject({message: err});
                    }
                    else {
                        resolve(data);
                    }
                });
            }),
            //查房型有效日
            new Promise((resolve, reject) => {
                queryAgent.queryList("QRY_ROOM_PERIOD", lo_params, 0, 0, function(err, data){
                    if (err) {
                        reject({message: err});
                    }
                    else {
                        _.each(data, function(lo_data){
                            lo_data.period_begin_dat = lo_data.begin_dat;
                            lo_data.period_end_dat = lo_data.end_dat;
                            delete lo_data.begin_dat;
                            delete lo_data.end_dat;
                        });
                        resolve(data);
                    }
                });
            }),
            //查房型使用資料
            new Promise((resolve, reject) => {
                queryAgent.queryList("QRY_ROOM_USE", lo_params, 0, 0, function(err, data){
                    if (err) {
                        reject({message: err});
                    }
                    else {
                        _.each(data, function(lo_data){
                            lo_data.use_begin_dat = lo_data.begin_dat;
                            lo_data.use_end_dat = lo_data.end_dat;
                            delete lo_data.begin_dat;
                            delete lo_data.end_dat;
                        });
                        resolve(data);
                    }
                });
            })
        ]);

        return {roomList: la_roomList, roomPeriod: la_roomPeriod, roomUse: la_roomUse};
    }

    /**
     * 資料轉換
     * @param rmNosPageOneData {object} 房號資料
     */
    async convRmNosData(rmNosPageOneData) {
        let ln_begin_dat = moment(this.postData.begin_dat).date();
        let lo_convData = {
            date_range: {
                begin_dat: ln_begin_dat,
                end_dat: ln_begin_dat + this.ln_date_range - 1
            },
            roomNosData: []
        };

        let la_rmNosData = alasql("select * from ? rmList " +
            "inner join ? rmPeriod on rmList.room_cod = rmPeriod.room_cod and rmList.room_nos = rmPeriod.room_nos", [rmNosPageOneData.roomList, rmNosPageOneData.roomPeriod]);

        _.each(la_rmNosData, function (lo_rmNosData) {
            let ln_date_diff = moment(lo_rmNosData.period_end_dat).diff(moment(lo_rmNosData.period_begin_dat), "d");
            let ln_period_begin_dat = moment(lo_rmNosData.period_begin_dat).date();
            let ln_period_end_dat = ln_period_begin_dat + ln_date_diff;

            let la_rmUse = _.where(rmNosPageOneData.roomUse, {
                room_cod: lo_rmNosData.room_cod,
                room_nos: lo_rmNosData.room_nos
            });
            let la_room_use = [];
            _.each(la_rmUse, function (lo_rmUse) {
                let ln_use_date_diff = moment(lo_rmUse.use_end_dat).diff(moment(lo_rmUse.use_begin_dat), "d");
                let ln_use_begin_dat = moment(lo_rmUse.use_begin_dat).date();
                let ln_use_end_dat = ln_use_begin_dat + ln_use_date_diff;

                let ln_cico_date_diff = moment(lo_rmUse.co_dat).diff(moment(lo_rmUse.ci_dat), "d");
                let ln_ci_dat = moment(lo_rmUse.ci_dat).date();
                let ln_co_dat = ln_ci_dat + ln_cico_date_diff;

                la_room_use.push({
                    use_typ: lo_rmUse.use_typ,
                    use_rmk: lo_rmUse.use_rmk,
                    begin_dat: ln_use_begin_dat,
                    end_dat: ln_use_end_dat,
                    ci_dat: ln_ci_dat,
                    co_dat: ln_co_dat,
                    ikey: lo_rmUse.ikey,
                    ikey_seq_nos: lo_rmUse.ikey_seq_nos,
                    ci_ser: lo_rmUse.ci_ser,
                    tr_key_nos: lo_rmUse.tr_key_nos
                })
            });

            lo_convData.roomNosData.push({
                room_cod: lo_rmNosData.room_cod,
                room_nos: lo_rmNosData.room_nos,
                room_sta: lo_rmNosData.clean_sta == "D" ? "Dirty" : "Clean",
                begin_dat: ln_period_begin_dat,
                end_dat: ln_period_end_dat,
                room_use: _.clone(la_room_use)
            })
        });


        return lo_convData;
    }
}