/**
 * Created by a17017 on 2018/07/27.
 */
const _ = require("underscore");
const _s = require("underscore.string");
const moment = require("moment");
const queryAgent = require("../../../plugins/kplug-oracle/QueryAgent");
const clusterQueryAgent = require("../../../plugins/kplug-oracle/ClusterQueryAgent");
const commonRule = require("./../CommonRule");
const ReturnClass = require("../../returnClass");
const ErrorClass = require("../../errorClass");
const tools = require("../../../utils/CommonTools");
const sysConf = require("../../../configs/systemConfig");
const encryptTools = require("../../../utils/encryptTools");

module.exports = {
    /**
     * 開啟入住畫面的檢查
     * 1.關閉訂房卡編輯畫面後判斷此訂房卡是否有今日入住之訂房資料
     * @param postData
     * @param session
     * @param callback
     */
    doOpenCheckIn: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let lo_param = {
            athena_id: session.athena_id,
            hotel_cod: session.hotel_cod,
            ikey: postData.singleRowData.ikey,
            rent_cal_dat: postData.rent_cal_dat
        };

        let lo_clusterParam = commonRule.ConvertToQueryParams(session.athena_id, "CHK_ORDER_DT_HAVE_TODAY");

        try {
            let lo_qryData = await getDbData(lo_clusterParam, lo_param);
            if (lo_qryData.order_count <= 0) {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = commonRule.getMsgByCod("pms21msg7", session.locale);
            }
        }
        catch (err) {
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
            console.error(err);
        }

        callback(lo_error, lo_result);
    },
    /**
     * 自動生成guest mn 資料
     * @param postData
     * @param session
     * @param callback
     */
    r_2010: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let la_orderMnData = [_.extend(postData.orderMnData, {
            conditions: {
                athena_id: postData.orderMnData.athena_id,
                hotel_cod: postData.orderMnData.athena_id,
                ikey: postData.orderMnData.ikey
            },
            action: 'U'
        })];
        let la_guestMnData = postData.guestMnData;
        _.each(la_guestMnData, (lo_data, ln_idx) => {
            la_guestMnData[ln_idx] = _.extend(lo_data, {
                conditions: {
                    athena_id: lo_data.athena_id,
                    hotel_cod: lo_data.athena_id,
                    ikey: lo_data.ikey,
                    ikey_seq_nos: lo_data.ikey_seq_nos
                },
                action: 'U'
            });
        });
        let lo_pageData = {
            "1": {
                tabs_data: {
                    "11": la_orderMnData,
                    "12": la_guestMnData
                }
            }
        };

        let apiParams = {
            "REVE-CODE": "PMS0210060",
            "prg_id": "PMS0210060",
            "func_id": "2010",
            "client_ip": "",
            "locale": session.locale,
            "athena_id": session.user.athena_id,
            "hotel_cod": session.user.hotel_cod,
            "page_data": lo_pageData
        };
        tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
            if (apiErr || !data) {
                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = apiErr;
            }
            else if (data["RETN-CODE"] != "0000") {
                lo_result.success = false;
                lo_error = new ErrorClass();
                if (!_.isUndefined(data["RETN-DATA"])) {
                    console.error(data["RETN-DATA"]["data"]);
                    lo_error.errorMsg = data["RETN-DATA"]["data"];
                }
                else {
                    console.error(data["RETN-CODE-DESC"]);
                    lo_error.errorMsg = data["RETN-CODE-DESC"];
                }

            }
            if (!_.isUndefined(data["RETN-DATA"])) {
                lo_result.effectValues = data["RETN-DATA"]["ciserdata"];
            }
            callback(lo_error, lo_result);
        });
    },
    /**
     *檢查order mn 公帳號
     * @param postData
     * @param session
     * @param callback
     */
    r_1012: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;
        let lb_isFirst = postData.isFirst === "false" ? false : true;

        try {
            if (lb_isFirst) {
                let lo_chkMaster = await new Promise((resolve, reject) => {
                    const lo_clusterParam = commonRule.ConvertToQueryParams(session.athena_id, "QRY_ORDER_MN_MASTER");
                    const lo_param = {
                        athena_id: session.athena_id,
                        hotel_cod: session.hotel_cod,
                        ikey: postData.orderMnData.ikey
                    };
                    clusterQueryAgent.query(lo_clusterParam, lo_param, (err, result) => {
                        if (err) {
                            reject(err)
                        }
                        else {
                            resolve(result);
                        }
                    })
                });

                if (_.isNull(lo_chkMaster.master_nos) && lo_chkMaster.master_sta === 'Y') {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = commonRule.getMsgByCod("pms21msg6", session.locale)
                }
                else if (!_.isNull(lo_chkMaster.master_nos) && lo_chkMaster.master_sta === 'Y') {
                    lo_result.showConfirm = true;

                }
            }
            else {
                let lo_fetchGuestCoDatParam = {
                    cluster_param: commonRule.ConvertToQueryParams(session.athena_id, "QRY_GUEST_MAX_CO_DAT"),
                    param: {
                        athena_id: session.athena_id,
                        hotel_cod: session.hotel_cod,
                        master_nos: postData.orderMnData.master_nos
                    }
                };
                let lo_fetchOrderCoDatParam = {
                    cluster_param: commonRule.ConvertToQueryParams(session.athena_id, "QRY_ODER_DT_MAX_CO_DAT"),
                    param: {
                        athena_id: session.athena_id,
                        hotel_cod: session.hotel_cod,
                        ikey: postData.orderMnData.ikey
                    }
                };
                let [lo_fetchGuestCoDat, lo_fetchOrderDtCoDat] = await Promise.all([
                    getDbData(lo_fetchGuestCoDatParam.cluster_param, lo_fetchGuestCoDatParam.param),
                    getDbData(lo_fetchOrderCoDatParam.cluster_param, lo_fetchOrderCoDatParam.param)
                ]);

                let ls_coDat = !_.isNull(lo_fetchGuestCoDat.co_dat) ? lo_fetchGuestCoDat.co_dat : lo_fetchOrderDtCoDat.co_dat;
                let lo_pageData = {
                    "1": {
                        tabs_data: {
                            "11": {
                                athena_id: session.user.athena_id,
                                hotel_cod: session.user.hotel_cod,
                                ikey: postData.orderMnData.ikey,
                                co_dat: moment(ls_coDat).format("YYYY/MM/DD"),
                                ins_usr: session.user.usr_id,
                            }
                        }
                    }
                };

                let lo_ciMaster = await new Promise((resolve, reject) => {
                    let apiParams = {
                        "REVE-CODE": "PMS0210060",
                        "prg_id": "PMS0210060",
                        "func_id": "1012",
                        "client_ip": "",
                        "locale": session.locale,
                        "athena_id": session.user.athena_id,
                        "hotel_cod": session.user.hotel_cod,
                        "page_data": lo_pageData,
                        "event_time": moment().format()
                    };
                    tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
                        if (apiErr || !data) {
                            reject(apiErr)
                        }
                        else {
                            resolve(data)
                        }
                    });
                });
                if (lo_ciMaster["RETN-CODE"] !== "0000") {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    console.error(lo_ciMaster["RETN-CODE-DESC"]);
                    lo_error.errorMsg = lo_ciMaster["RETN-CODE-DESC"];
                }
            }
        }
        catch (err) {
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
            console.error(err);
        }

        callback(lo_error, lo_result);
    },
    /**
     * 入住
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise.<void>}
     */
    doCheckIn: async function (postData, session) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let la_orderMnData = [_.extend(postData.orderMnData, {upd_usr: session.user.usr_id})];
        let la_guestMnData = postData.guestMnData;

        let lo_pageData = {
            "1010": {
                tabs_data: {
                    "11": la_orderMnData,
                    "12": la_guestMnData
                }
            }
        };

        try {
            return await new Promise((resolve, reject) => {
                let apiParams = {
                    "reve_code": "PMS0210060",
                    "func_id": "1011",
                    "athena_id": session.athena_id,
                    "hotel_cod": session.hotel_cod,
                    "event_time": moment().format(),
                    "page_data": lo_pageData
                };
                tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
                    if (apiErr || !data) {
                        reject(apiErr)
                    }
                    else {
                        if (data["RETN-CODE"] != "0000") {
                            if (!_.isUndefined(data["RETN-DATA"])) {
                                reject(data["RETN-DATA"]["data"]);
                            }
                            else {
                                reject(data["RETN-CODE-DESC"]);
                            }
                        }
                        else {
                            resolve(lo_result);
                        }
                    }
                });
            });
        }
        catch (err) {
            throw err;
        }
    },
    /**
     * 取消入住
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise.<void>}
     */
    doCancelCheckIn: async function (postData, session) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let la_orderMnData = [_.extend(postData.orderMnData, {upd_usr: session.user.usr_id})];
        let la_guestMnData = postData.guestMnData;

        let lo_pageData = {
            "1020": {
                tabs_data: {
                    "11": la_orderMnData,
                    "12": la_guestMnData
                }
            }
        };

        try {
            return await new Promise((resolve, reject) => {
                let apiParams = {
                    "reve_code": "PMS0210060",
                    "func_id": "1022",
                    "athena_id": session.athena_id,
                    "hotel_cod": session.hotel_cod,
                    "event_time": moment().format(),
                    "page_data": lo_pageData
                };
                tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
                    if (apiErr || !data) {
                        reject(apiErr)
                    }
                    else {
                        if (data["RETN-CODE"] != "0000") {
                            if (!_.isUndefined(data["RETN-DATA"])) {
                                reject(data["RETN-DATA"]["data"]);
                            }
                            else {
                                reject(data["RETN-CODE-DESC"]);
                            }
                        }
                        else {
                            resolve(lo_result);
                        }
                    }
                });
            });
        }
        catch (err) {
            throw err;
        }
    }
};

async function getDbData(cluster_param, param) {
    return await new Promise((resolve, reject) => {
        clusterQueryAgent.query(cluster_param, param, (err, result) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(result);
            }
        });
    });
}