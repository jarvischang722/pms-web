const _ = require("underscore");
const _s = require("underscore.string");
const moment = require("moment");
const clusterQueryAgent = require("../../../plugins/kplug-oracle/ClusterQueryAgent");
const queryAgent = require("../../../plugins/kplug-oracle/QueryAgent");
const commonRule = require("./../CommonRule");
const ReturnClass = require("../../returnClass");
const ErrorClass = require("../../errorClass");
const tools = require("../../../utils/CommonTools");
const sysConf = require("../../../configs/systemConfig");
const encryptTools = require("../../../utils/encryptTools");

module.exports = {

    /**
     * 抓取飯店房型種類
     * @param postData
     * @param session
     * @param callback
     */
    getRoomType: function (postData, session, callback) {
        try {
            let lo_return = new ReturnClass();
            let lo_error = null;

            let lo_default_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod,
                // ci_dat: '2018/06/29'
                ci_dat: postData.ci_dat
            };

            let lo_clusterParam = commonRule.ConvertToQueryParams(session.athena_id, "QRY_ROOM_TYPE_DT");
            clusterQueryAgent.queryList(lo_clusterParam, lo_default_params, function (err, result) {
                if (err) {
                    lo_error = new ErrorClass();
                    lo_return.success = false;
                    lo_error.errorMsg = err;
                }
                else {
                    result.push({room_cod: 'ALL', view_seq: -1});
                    result = _.sortBy(result, 'view_seq');

                    lo_return.success = true;
                    lo_return.effectValues = result;
                }
                callback(lo_error, lo_return);
            });
        }
        catch (err) {
            lo_error = new ErrorClass();
            lo_return.success = false;
            lo_error.errorMsg = err;
        }
    },

    /**
     * 抓取飯店樓層資訊
     * @param postData
     * @param session
     * @param callback
     */
    getRoomMnQryFloorNos: function (postData, session, callback) {
        try {
            let lo_return = new ReturnClass();
            let lo_error = null;

            let lo_default_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod
            };

            let lo_clusterParam = commonRule.ConvertToQueryParams(session.athena_id, "QRY_ROOM_MN_QRY_FLOOR_NOS");
            clusterQueryAgent.queryList(lo_clusterParam, lo_default_params, function (err, result) {
                if (err) {
                    lo_error = new ErrorClass();
                    lo_return.success = false;
                    lo_error.errorMsg = err;
                }
                else {
                    result = result.map(lo_data => {
                        lo_data.value = parseInt(lo_data.value);
                        lo_data.display = parseInt(lo_data.display) + "F";
                        return lo_data;
                    });
                    result.push({value: -1, display: "ALL"});
                    result = _.sortBy(result, "value");

                    lo_return.success = true;
                    lo_return.effectValues = result;
                }
                callback(lo_error, lo_return);
            });
        }
        catch (err) {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err;
            lo_return.success = false;
        }
    },

    /**
     * 抓取飯店顏色說明
     * @param postData
     * @param session
     * @param callback
     */
    getRoomColor: function (postData, session, callback) {
        try {
            let lo_return = new ReturnClass();
            let lo_error = null;

            let lo_default_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod
            };

            let lo_clusterParam = commonRule.ConvertToQueryParams(session.athena_id, "QRY_ROOM_COLOR");
            clusterQueryAgent.queryList(lo_clusterParam, lo_default_params, function (err, result) {
                if (err) {
                    lo_error = new ErrorClass();
                    lo_return.success = false;
                    lo_error.errorMsg = err;
                }
                else {
                    lo_return.success = true;
                    lo_return.effectValues = result;
                }
                callback(lo_error, lo_return);
            });
        }
        catch (err) {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err;
            lo_return.success = false;
        }
    },

    //有問題 排房資料,
    fetchRoomData: function (params, session, callback) {
        const lo_orderDt = params.order_dt;

        let apiParams = {
            "REVE-CODE": "PMS0210030",
            "prg_id": "PMS0210030",
            "func_id": "2010",
            "client_ip": "",
            "locale": "zh_TW",

            "athena_id": session.athena_id,
            "hotel_cod": session.hotel_cod,
            "usr_id": session.user.usr_id,
            "socket_id": "",
            "ci_dat": moment(lo_orderDt.ci_dat).format("YYYY/MM/DD"),
            "co_dat": moment(lo_orderDt.co_dat).format("YYYY/MM/DD"),
            // "room_cod": lo_orderDt.room_cod,
            "room_cod": "",
            "character_rmk": "",
            "build_nos": "",
            "floor_nos": "",
            // "floor_nos": lo_orderDt.floor_nos,
            "bed_sta": "",
            "can_assign": lo_orderDt.can_assign
        };

        tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
            let success = true;
            let errorMsg = "";
            if (apiErr || !data) {
                success = false;
                errorMsg = apiErr;
            } else if (data["RETN-CODE"] != "0000") {
                success = false;
                errorMsg = data["RETN-CODE-DESC"] || '發生錯誤';
                console.error(data["RETN-CODE-DESC"]);
            } else {
                errorMsg = data["RETN-CODE-DESC"];
            }
            callback(errorMsg, success, data);
        });
    },
    fetRoomListData: function (params, session, callback) {
        try {
            let lo_return = new ReturnClass();
            let lo_error = null;

            let lo_default_params = {
                athena_id: 1,
                hotel_cod: "02",
                usr_id: "a17017",
                socket_id: ""
            };

            let lo_clusterParam = commonRule.ConvertToQueryParams(session.athena_id, "QRY_ROOM_DATA_LIST");
            clusterQueryAgent.queryList(lo_clusterParam, lo_default_params, function (err, result) {
                if (err) {
                    lo_error = new ErrorClass();
                    lo_return.success = false;
                    lo_error.errorMsg = err;
                }
                else {
                    lo_return.success = true;
                    lo_return.effectValues = result;
                }
                callback(lo_error, lo_return);
            });
        }
        catch (err) {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err;
            lo_return.success = false;
        }
    },

    /**
     * 排房
     * @param params
     * @param session
     * @param callback
     */
    doAssign: function (params, session, callback) {
        const lo_order_dt = params.order_dt;
        let apiParams = {
            "locale": "zh_TW",
            "REVE-CODE": "PMS0210030",
            "prg_id": "PMS0210030",
            "func_id": "1010",
            "page_data": {
                "1": {
                    "tabs_data": {
                        "1": [
                            {
                                "athena_id": session.athena_id,
                                "hotel_cod": session.hotel_cod,
                                "ikey": lo_order_dt.ikey,
                                "ikey_seq_nos": lo_order_dt.ikey_seq_nos,
                                "ci_dat": lo_order_dt.ci_dat,
                                "co_dat": lo_order_dt.co_dat,
                                "room_cod": lo_order_dt.room_cod,
                                "room_nos": lo_order_dt.room_nos,
                                "upd_usr": session.user.usr_id,
                                conditions: {
                                    "athena_id": session.athena_id,
                                    "hotel_cod": session.hotel_cod,
                                    "ikey": lo_order_dt.ikey,
                                    "ikey_seq_nos": lo_order_dt.ikey_seq_nos,
                                    "ci_dat": lo_order_dt.ci_dat,
                                    "co_dat": lo_order_dt.co_dat,
                                    "room_cod": lo_order_dt.room_cod,
                                    "room_nos": lo_order_dt.room_nos,
                                    "upd_usr": session.user.usr_id
                                }
                            }
                        ]
                    }
                }
            },
            "client_ip": "",
            "server_ip": "",
            "event_time": moment().format(),
            "mac": ""
        };

        tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
            let success = true;
            let errorMsg = "";
            if (apiErr || !data) {
                success = false;
                errorMsg = apiErr;
            } else if (data["RETN-CODE"] !== "0000") {
                success = false;
                errorMsg = data["RETN-CODE-DESC"] || "發生錯誤";
                console.error(data["RETN-CODE-DESC"]);
            } else {
                errorMsg = data["RETN-CODE-DESC"];
            }
            callback(errorMsg, success, data);
        });
    },
    /**
     * 取消排房
     * @param params
     * @param session
     * @param callback
     */
    doUnassign: function (params, session, callback) {
        const lo_order_dt = params.order_dt;
        let apiParams = {
            "locale": "zh_TW",
            "REVE-CODE": "PMS0210030",
            "prg_id": "PMS0210030",
            "func_id": "1030",
            "page_data": {
                "1": {
                    "tabs_data": {
                        "1": [
                            {
                                "athena_id": session.athena_id,
                                "hotel_cod": session.hotel_cod,
                                "ikey": lo_order_dt.ikey,
                                "ikey_seq_nos": lo_order_dt.ikey_seq_nos,
                                conditions: {
                                    "athena_id": session.athena_id,
                                    "hotel_cod": session.hotel_cod,
                                    "ikey": lo_order_dt.ikey,
                                    "ikey_seq_nos": lo_order_dt.ikey_seq_nos
                                }
                            }
                        ]
                    }
                }
            }
        };
        tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
            let success = true;
            let errorMsg = "";
            if (apiErr || !data) {
                success = false;
                errorMsg = apiErr;
            } else if (data["RETN-CODE"] !== "0000") {
                success = false;
                errorMsg = data["RETN-CODE-DESC"] || "發生錯誤";
                console.error(data["RETN-CODE-DESC"]);
            } else {
                errorMsg = data["RETN-CODE-DESC"];
            }
            callback(errorMsg, success, data);
        });
    },

    /**
     * 鎖定排房
     * @param params
     * @param session
     * @param callback
     */
    doAsiLock: function (params, session, callback) {
        let apiParams = {};
        //
        tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
            let success = true;
            let errorMsg = "";
            if (apiErr || !data) {
                success = false;
                errorMsg = apiErr;
            } else if (data["RETN-CODE"] !== "0000") {
                success = false;
                errorMsg = data["RETN-CODE-DESC"] || "發生錯誤";
                console.error(data["RETN-CODE-DESC"]);
            } else {
                errorMsg = data["RETN-CODE-DESC"];
            }
            callback(errorMsg, success, data);
        });
    },

    /**
     * 檢查房號可否排房
     * @param params
     * @param session
     * @param callback
     */
    checkRoomNos: function (params, session, callback) {
        try {
            let lo_order_dt = params.order_dt;
            let lo_return = new ReturnClass();
            let lo_error = null;

            let lo_default_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod,
                end_dat: lo_order_dt.end_dat,
                begin_dat: lo_order_dt.begin_dat,
                room_nos: lo_order_dt.room_nos
            };

            let lo_clusterParam = commonRule.ConvertToQueryParams(session.athena_id, "CHECK_ROOM_NOS");
            clusterQueryAgent.queryList(lo_clusterParam, lo_default_params, function (err, result) {
                if (err) {
                    lo_error = new ErrorClass();
                    lo_return.success = false;
                    lo_error.errorMsg = err;
                }
                else {
                    lo_return.success = true;
                    lo_return.effectValues = result;
                }
                callback(lo_error, lo_return);
            });
        }
        catch (err) {
            lo_error = new ErrorClass();
            lo_return.success = false;
            lo_error.errorMsg = err;
        }
    },
    /**
     * 批次取消預計取消排房明細資料
     * @param params
     * @param session
     * @param callback
     */
    quyCancelRoomList: function (params, session, callback) {
        try {
            let lo_return = new ReturnClass();
            let lo_error = null;

            let lo_default_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod,
                ikey: params.ikey,
                assign_sta: params.assign_sta,
                order_sta: params.order_sta,
                ci_dat: params.ci_dat,
                co_dat: params.co_dat,
                rate_cod: params.rate_cod,
                use_cod: params.use_cod,
                room_cod: params.room_cod,
                rent_amt: params.rent_amt,
                serv_amt: params.serv_amt
            };

            let lo_clusterParam = commonRule.ConvertToQueryParams(session.athena_id, "QRY_CANCEL_ROOM_LIST");
            clusterQueryAgent.queryList(lo_clusterParam, lo_default_params, function (err, result) {
                if (err) {
                    lo_error = new ErrorClass();
                    lo_return.success = false;
                    lo_error.errorMsg = err;
                }
                else {
                    lo_return.success = true;
                    lo_return.effectValues = result;
                }
                callback(lo_error, lo_return);
            });
        }
        catch (err) {
            lo_error = new ErrorClass();
            lo_return.success = false;
            lo_error.errorMsg = err;
        }
    }
};