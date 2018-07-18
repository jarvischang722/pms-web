/**
 * Created by a17007 on 2018/6/7.
 */
const _ = require("underscore");
const _s = require("underscore.string");
const moment = require("moment");
const async = require("async");
const path = require('path');
const appRootDir = path.dirname(require.main.filename);
const ruleRootPath = appRootDir + "/ruleEngine/";
const queryAgent = require(appRootDir + '/plugins/kplug-oracle/QueryAgent');
const clusterQueryAgent = require("../../../plugins/kplug-oracle/ClusterQueryAgent");
const commandRules = require("./../CommonRule");
const ReturnClass = require(ruleRootPath + "/returnClass");
const ErrorClass = require(ruleRootPath + "/errorClass");
const tools = require(appRootDir + "/utils/CommonTools");
const sysConf = require("../../../configs/systemConfig");

module.exports = {
    /**
     * order dt 欄位ci日期
     * 1.連動欄位days
     * 2.當source_typ=DU時,days=0
     * 3.重算房價
     * 4.取房型下拉資料
     * @param postData
     * @param session
     * @param callback
     */
    chkOrderdtCidat: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            let ls_ciDat = postData.singleRowData[0].ci_dat || "";
            let ls_coDat = postData.singleRowData[0].co_dat || "";

            //連動欄位days
            let ln_days = moment(new Date(ls_coDat)).diff(moment(new Date(ls_ciDat)), "days");

            //當source_typ=DU時,days=0
            let ls_sourceTyp = postData.singleRowData[0].source_typ || "";
            if (ls_sourceTyp !== "") {
                ln_days = ls_sourceTyp === "DU" ? 0 : ln_days;
            }

            //重算房價
            let lo_calculationRoomPrice = {};
            if (ln_days !== 0) {
                postData.singleRowData[0].days = ln_days;
                lo_calculationRoomPrice = await CalculationRoomPrice(postData.singleRowData[0], session);
            }

            lo_result.effectValues.days = ln_days;
            lo_result.effectValues.ci_dat = moment(ls_ciDat).format("YYYY/MM/DD");
            lo_result.effectValues.co_dat = moment(ls_coDat).format("YYYY/MM/DD");
            lo_result.effectValues.ci_dat_week = moment(ls_ciDat).format("ddd");
            lo_result.effectValues.co_dat_week = moment(ls_coDat).format("ddd");
            lo_result.effectValues = _.extend(lo_result.effectValues, lo_calculationRoomPrice.data);

            //取得房型下拉資料
            let lo_roomTypSelectData = await GetRoomTypSelectOption(postData.singleRowData[0], session);
            lo_result.selectField = ["room_cod", "use_cod"];
            lo_result.multiSelectOptions.room_cod = lo_roomTypSelectData.data.roomCodSelectData;
            lo_result.multiSelectOptions.use_cod = lo_roomTypSelectData.data.useCodSelectData;
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }

        callback(lo_error, lo_result);
    },

    /**
     * order dt 欄位co日期
     * 1.連動欄位days
     * 2.當source_typ=DU時,days=0
     * 3.重算房價
     * 4.取房型下拉資料
     * @param postData
     * @param session
     * @param callback
     */
    chkOrderdtCodat: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            let ls_ciDat = postData.singleRowData[0].ci_dat || "";
            let ls_coDat = postData.singleRowData[0].co_dat || "";

            //連動欄位days
            let ln_days = moment(new Date(ls_ciDat)).diff(moment(new Date(ls_coDat)), "days");

            //當source_typ=DU時,days=0
            let ls_sourceTyp = postData.singleRowData[0].source_typ || "";
            if (ls_sourceTyp !== "") {
                ln_days = ls_sourceTyp === "DU" ? 0 : ln_days;
            }

            //重算房價
            let lo_calculationRoomPrice = {};
            if (ln_days !== 0) {
                postData.singleRowData[0].days = ln_days;
                lo_calculationRoomPrice = await CalculationRoomPrice(postData.singleRowData[0], session);

            }

            lo_result.effectValues.days = ln_days;
            lo_result.effectValues.ci_dat = moment(ls_ciDat).format("YYYY/MM/DD");
            lo_result.effectValues.co_dat = moment(ls_coDat).format("YYYY/MM/DD");
            lo_result.effectValues.ci_dat_week = moment(ls_ciDat).format("ddd");
            lo_result.effectValues.co_dat_week = moment(ls_coDat).format("ddd");
            lo_result.effectValues = _.extend(lo_result.effectValues, lo_calculationRoomPrice.data);

            //取得房型下拉資料
            let lo_roomTypSelectData = await GetRoomTypSelectOption(postData.singleRowData[0], session);
            lo_result.selectField = ["room_cod", "use_cod"];
            lo_result.multiSelectOptions.room_cod = lo_roomTypSelectData.data.roomCodSelectData;
            lo_result.multiSelectOptions.use_cod = lo_roomTypSelectData.data.useCodSelectData;
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }

        callback(lo_error, lo_result);
    },

    /**
     *  order dt 欄位 房價代號
     * 1.帶回soruce_typ, guest_typ,commis_rat
     * 2.欄位佣金commis_rat,可否修改
     * 3.計算房價
     * 4.取房型下拉資料
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise<void>}
     */
    chkOrderdtRatecod: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {

            let ls_rateCod = postData.singleRowData[0].rate_cod || "";
            if (ls_rateCod != "") {
                let lo_param = {
                    athena_id: session.athena_id,
                    hotel_cod: session.hotel_cod,
                    rate_cod: ls_rateCod
                };

                //帶回soruce_typ, guest_typ,commis_rat
                let lo_daoParams = commandRules.ConvertToQueryParams(lo_param.athena_id, "SEL_SOURCE_TYP_GUEST_TYP_COMMIS_RAT_FOR_RATECOD");
                let lo_fetchData = await new Promise((resolve, reject) => {
                    clusterQueryAgent.queryList(lo_daoParams, lo_param, function (err, result) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });

                //欄位佣金commis_rat,可否修改
                lo_daoParams = commandRules.ConvertToQueryParams(lo_param.athena_id, "SEL_COMMIS_CHG_FOR_ATHENA_ID_AND_HOTEL_ID_AND_RATE_COD");
                let lo_fetchCommis = await new Promise((resolve, reject) => {
                    clusterQueryAgent.query(lo_daoParams, lo_param, function (err, result) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });
                if (lo_fetchCommis.commis_chg == "N") {
                    lo_result.readonlyFields.push("commis_rat");
                }
                else {
                    lo_result.modifyFields.push("commis_rat");
                }

                //檢查新rate_cod與計價房型能否配對


                //重算房價
                let lo_calculationRoomPrice = await CalculationRoomPrice(postData.singleRowData[0], session);

                lo_result.effectValues = _.extend(lo_result.effectValues, lo_fetchData);
                lo_result.effectValues = _.extend(lo_result.effectValues, lo_calculationRoomPrice.data);

                //取得房型下拉資料
                let lo_roomTypSelectData = await GetRoomTypSelectOption(postData.singleRowData[0], session);
                lo_result.selectField = ["room_cod", "use_cod"];
                lo_result.multiSelectOptions.room_cod = lo_roomTypSelectData.data.roomCodSelectData;
                lo_result.multiSelectOptions.use_cod = lo_roomTypSelectData.data.useCodSelectData;
            }
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }

        callback(lo_error, lo_result);
    },

    /**
     * order dt 欄位 大人
     * 1.檢查人數不可超過計價房型設定中的最大人數
     * @param postData
     * @param session
     * @param callback
     */
    chkOrderdtAdultqnt: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {

            let ls_roomCod = postData.singleRowData[0].room_cod || "";
            if (ls_roomCod != "") {
                let lo_param = {
                    athena_id: session.athena_id,
                    hotel_cod: session.hotel_cod,
                    room_cod: ls_roomCod
                };

            }


            //帶回soruce_typ, guest_typ,commis_rat
            let lo_daoParams = commandRules.ConvertToQueryParams(lo_param.athena_id, "SEL_SOURCE_TYP_GUEST_TYP_COMMIS_RAT_FOR_RATECOD");
            let lo_fetchData = await
                new Promise((resolve, reject) => {
                    clusterQueryAgent.queryList(lo_daoParams, lo_param, function (err, result) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });

            //欄位佣金commis_rat,可否修改
            lo_daoParams = commandRules.ConvertToQueryParams(lo_param.athena_id, "SEL_COMMIS_CHG_FOR_ATHENA_ID_AND_HOTEL_ID_AND_RATE_COD");
            let lo_fetchCommis = await
                new Promise((resolve, reject) => {
                    clusterQueryAgent.queryList(lo_daoParams, lo_param, function (err, result) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });
            if (lo_fetchCommis.commis_chg == "N") {
                lo_result.readonlyFields.push("commis_rat");
            }

            //檢查新rate_cod與計價房型能否配對


            //重算房價
            let lo_calculationRoomPrice = await CalculationRoomPrice(postData.singleRowData[0], session);

            lo_result.effectValues = _.extend(lo_result.effectValues, lo_fetchData);
            lo_result.effectValues = _.extend(lo_result.effectValues, lo_calculationRoomPrice.data);

            //取得房型下拉資料
            let lo_roomTypSelectData = await
                GetRoomTypSelectOption(postData.singleRowData[0], session);
            lo_result.selectField = ["room_cod", "use_cod"];
            lo_result.multiSelectOptions.room_cod = lo_roomTypSelectData.data.roomCodSelectData;
            lo_result.multiSelectOptions.use_cod = lo_roomTypSelectData.data.useCodSelectData;
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }

        callback(lo_error, lo_result);
    }
};

//計算房價
async function CalculationRoomPrice(orderDtData, session) {
    let lo_data = {
        success: true,
        errorMsg: "",
        data: {}
    };

    try {
        let apiParams = {
            "REVE-CODE": "PMS0110041",
            "prg_id": "PMS0110041",
            "func_id": "0700",
            "athena_id": session.user.athena_id,
            "hotel_cod": session.user.hotel_cod,
            "key_nos": orderDtData.key_nos,
            "rate_cod": orderDtData.rate_cod,
            "room_cod": orderDtData.room_cod,
            "acust_cod": orderDtData.acust_cod,
            "ci_dat": moment(orderDtData.ci_dat).format("YYYY/MM/DD"),
            "stay_night": orderDtData.days,
            "order_sta": orderDtData.order_sta,
            "add_man_qnt": 0,
            "add_child_qnt": 0,
            "ikey": orderDtData.ikey,
            "ikey_seq_nos": [orderDtData.ikey_seq_nos],
            "upd_usr": session.user.usr_id,
        };

        let lo_computePrice = await new Promise((resolve, reject) => {
            tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
                if (apiErr || !data) {
                    reject(apiErr)
                }
                else {
                    resolve(data)
                }
            });
        });

        if (lo_computePrice["RETN-CODE"] != "0000") {
            lo_data.success = false;
            lo_data.errorMsg = lo_computePrice["RETN-CODE-DESC"];
        }
        else {
            let lo_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod,
                ikey_seq_nos: orderDtData.ikey_seq_nos,
                ikey: orderDtData.ikey,
                key_nos: orderDtData.key_nos
            };
            let lo_fetchPrice = await new Promise((resolve, reject) => {
                queryAgent.query("QUY_ORDER_APPRAISE_FOR_ORDER_DT", lo_params, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            lo_data.data.rent_amt = lo_fetchPrice.rent_amt;
            lo_data.data.serv_amt = lo_fetchPrice.serv_amt;
            lo_data.data.other_amt = Number(lo_fetchPrice.total) - Number(lo_fetchPrice.serv_amt) - Number(lo_fetchPrice.rent_amt);
        }
    }
    catch (err) {
        console.log(err);
        lo_data.success = false;
        lo_data.errorMsg = err;
    }

    return lo_data;
}

//取房型下拉資料
async function GetRoomTypSelectOption(orderDtData, session) {
    let lo_data = {
        success: true,
        errorMsg: "",
        data: {}
    };

    try {
        let lo_params = {
            athena_id: session.athena_id,
            hotel_cod: session.hotel_cod,
            co_dat: moment(orderDtData.co_dat).format("YYYY/MM/DD"),
            ci_dat: moment(orderDtData.ci_dat).format("YYYY/MM/DD"),
            rate_cod: orderDtData.rate_cod,
            days: orderDtData.days
        };

        let [la_roomCodSelectData, la_useCodSelectData] = await Promise.all([
            await new Promise((resolve, reject) => {
                const lo_daoParams = commandRules.ConvertToQueryParams(session.athena_id, "SEL_ORDERDTROOMCOD");
                clusterQueryAgent.queryList(lo_daoParams, lo_params, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            }),
            await new Promise((resolve, reject) => {
                const lo_daoParams = commandRules.ConvertToQueryParams(session.athena_id, "SEL_ORDERDTUSECOD");
                clusterQueryAgent.queryList(lo_daoParams, lo_params, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            }),
        ]);

        _.each(la_roomCodSelectData, (lo_roomCodSelectData, idx) => {
            la_roomCodSelectData[idx].display = lo_roomCodSelectData.value + ':' + lo_roomCodSelectData.display;
        });
        _.each(la_useCodSelectData, (lo_useCodSelectData, idx) => {
            la_useCodSelectData[idx].display = lo_useCodSelectData.value + ':' + lo_useCodSelectData.display;
        });

        lo_data.data.roomCodSelectData = la_roomCodSelectData;
        lo_data.data.useCodSelectData = la_useCodSelectData;
    }
    catch (err) {
        console.log(err);
        lo_data.success = false;
        lo_data.errorMsg = err;
    }

    return lo_data;
}