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
        let lo_return = new ReturnClass();
        let lo_error = new ErrorClass();
        try {
            let lo_default_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod,
                // ci_dat: '2018/06/29'
                ci_dat: postData.ci_dat
            };

            let lo_clusterParam = commonRule.ConvertToQueryParams(session.athena_id, "QRY_ROOM_TYPE_DT");
            clusterQueryAgent.queryList(lo_clusterParam, lo_default_params, function (err, result) {
                if (err) {
                    lo_return.success = false;
                    lo_error.errorMsg = err;
                }
                else {
                    result.push({room_cod: "ALL", view_seq: -1});
                    result = _.sortBy(result, "view_seq");

                    lo_return.success = true;
                    lo_return.effectValues = result;
                }
                callback(lo_error, lo_return);
            });
        }
        catch (err) {
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
        let lo_return = new ReturnClass();
        let lo_error = new ErrorClass();
        try {
            let lo_default_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod
            };

            let lo_clusterParam = commonRule.ConvertToQueryParams(session.athena_id, "QRY_ROOM_MN_QRY_FLOOR_NOS");
            clusterQueryAgent.queryList(lo_clusterParam, lo_default_params, function (err, result) {
                if (err) {
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
        let lo_return = new ReturnClass();
        let lo_error = new ErrorClass();
        let self = this;
        try {
            let lo_default_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod
            };

            let lo_clusterParam = commonRule.ConvertToQueryParams(session.athena_id, "QRY_ROOM_COLOR");
            clusterQueryAgent.queryList(lo_clusterParam, lo_default_params, function (err, result) {
                if (err) {
                    lo_return.success = false;
                    lo_error.errorMsg = err;
                }
                else {
                    lo_return.success = true;
                    result.map(data => {
                        data["color"] = self.colorCodToHex(data["color"]);
                        return data;
                    });
                    lo_return.effectValues = result;
                }
                callback(lo_error, lo_return);
            });
        }
        catch (err) {
            lo_error.errorMsg = err;
            lo_return.success = false;
        }
    },

    /**
     * 抓取排房房間資料
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise<void>}
     */
    fetchRoomData: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = new ErrorClass();
        try {
            const lo_orderDt = postData.order_dt;

            // 組資料格式，樓層: 1樓、3樓、5樓、7樓	 => '1','3','5','7'
            // 打API給後端時資料是長 "'1','3','5','7'" 詭異
            let ls_roomFloor = lo_orderDt.floor_nos.map(data => {
                if (data === '') {
                    return "";
                }
                return "'" + data + "'";
            });
            ls_roomFloor = ls_roomFloor.join(',');

            // 組資料格式，房間種類
            let ls_roomType;
            if (lo_orderDt.select_room_cod === 'ALL') {
                ls_roomType = "";
            } else {
                ls_roomType = "'" + lo_orderDt.select_room_cod + "'";
            }


            let apiParams = {
                "REVE-CODE": "PMS0210030",
                "prg_id": "PMS0210030",
                "func_id": "2010",
                "client_ip": "",
                "locale": "zh_TW",
                "athena_id": session.athena_id,
                "hotel_cod": session.hotel_cod,
                "usr_id": session.user.usr_id,
                "socket_id": session.user.usr_id,
                "ci_dat": moment(lo_orderDt.ci_dat).format("YYYY/MM/DD"),
                "co_dat": moment(lo_orderDt.co_dat).format("YYYY/MM/DD"),
                "room_cod": ls_roomType,
                "character_rmk": "",
                "build_nos": "",
                "floor_nos": ls_roomFloor,
                "bed_sta": "",
                "can_assign": lo_orderDt.can_assign
            };

            let lo_spRoomList = await new Promise((resolve, reject) => {
                tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
                    if (apiErr || !data) {
                        reject(apiErr)
                    }
                    else {
                        resolve(data)
                    }
                });
            });

            if (lo_spRoomList["RETN-CODE"] !== "0000") {
                lo_result.success = false;
                lo_error.errorMsg = lo_spRoomList["RETN-CODE-DESC"];
                console.error(lo_spRoomList["RETN-CODE-DESC"]);
            } else {
                let lo_default_params = {
                    athena_id: session.athena_id,
                    hotel_cod: session.hotel_cod,
                    usr_id: session.user.usr_id,
                    socket_id: session.user.usr_id
                };
                let lo_fetchRoomList = await new Promise((resolve, reject) => {
                    const lo_fetchTempTableParam = commonRule.ConvertToQueryParams(session.athena_id, "QRY_ROOM_DATA_LIST");
                    clusterQueryAgent.queryList(lo_fetchTempTableParam, lo_default_params, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });

                _.each(lo_fetchRoomList,(lo_roomItem)=>{
                    lo_roomItem.view_bgcolor = this.colorCodToHex(lo_roomItem.view_bgcolor)
                });

                lo_result.success = true;
                lo_result.effectValues.roomList = lo_fetchRoomList;
            }
        }
        catch (err) {
            lo_result.success = false;
            lo_error.errorMsg = err;
        }

        callback(lo_error, lo_result);
    },

    /**
     * 排房 Button
     * @param params
     * @param session
     * @param callback
     */
    doAssign: async function (params, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = new ErrorClass();
        try {
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
                                    "room_cod": lo_order_dt.select_room_cod,
                                    "room_nos": lo_order_dt.select_room_nos,
                                    "upd_usr": session.user.usr_id,
                                    conditions: {
                                        "athena_id": session.athena_id,
                                        "hotel_cod": session.hotel_cod,
                                        "ikey": lo_order_dt.ikey,
                                        "ikey_seq_nos": lo_order_dt.ikey_seq_nos,
                                        "ci_dat": lo_order_dt.ci_dat,
                                        "co_dat": lo_order_dt.co_dat,
                                        "room_cod": lo_order_dt.select_room_cod,
                                        "room_nos": lo_order_dt.select_room_nos,
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

            let lo_insertAssign = await new Promise((resolve, reject) => {
                tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
                    if (apiErr || !data) {
                        reject(apiErr)
                    }
                    else {
                        resolve(data)
                    }
                });
            });

            if (lo_insertAssign["RETN-CODE"] !== "0000") {
                lo_result.success = false;
                lo_error.errorMsg = lo_insertAssign["RETN-CODE-DESC"];
                console.error(lo_insertAssign["RETN-CODE-DESC"]);
            } else {
                lo_error.errorMsg = lo_insertAssign["RETN-CODE-DESC"];
                lo_result.success = true;
            }
        } catch (err) {
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_error, lo_result);
    },

    /**
     * 批次排房確定按鈕 Button
     * @param params
     * @param session
     * @param callback
     */
    doBatchAssign: async function (params, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = new ErrorClass();
        try {
            const lo_order_dt = params.order_dt;

            let la_Data = lo_order_dt.assignDataList.map(lo_data => {
                return {
                    "athena_id": session.athena_id,
                    "hotel_cod": session.hotel_cod,
                    "ikey": lo_order_dt.ikey,
                    "ikey_seq_nos": lo_data.ikey_seq_nos,
                    "ci_dat": lo_order_dt.ci_dat,
                    "co_dat": lo_order_dt.co_dat,
                    "room_cod": lo_order_dt.select_batch_room_cod,
                    "room_nos": lo_data.room_nos,
                    "upd_usr": session.user.usr_id,
                    conditions: {
                        "athena_id": session.athena_id,
                        "hotel_cod": session.hotel_cod,
                        "ikey": lo_order_dt.ikey,
                        "ikey_seq_nos": lo_data.ikey_seq_nos,
                        "ci_dat": lo_order_dt.ci_dat,
                        "co_dat": lo_order_dt.co_dat,
                        "room_cod": lo_order_dt.select_batch_room_cod,
                        "room_nos": lo_data.room_nos,
                        "upd_usr": session.user.usr_id
                    }
                };
            });

            let apiParams = {
                "locale": "zh_TW",
                "REVE-CODE": "PMS0210030",
                "prg_id": "PMS0210030",
                "func_id": "1010",
                "page_data": {
                    "1": {
                        "tabs_data": {
                            "1": la_Data
                        }
                    }
                },
                "client_ip": "",
                "server_ip": "",
                "event_time": moment().format(),
                "mac": ""
            };

            let lo_insertBatchAssign = await new Promise((resolve, reject) => {
                tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
                    if (apiErr || !data) {
                        reject(apiErr)
                    }
                    else {
                        resolve(data)
                    }
                });
            });

            if (lo_insertBatchAssign["RETN-CODE"] !== "0000") {
                lo_result.success = false;
                lo_error.errorMsg = lo_insertBatchAssign["RETN-CODE-DESC"];
                console.error(lo_insertBatchAssign["RETN-CODE-DESC"]);
            } else {
                lo_error.errorMsg = lo_insertBatchAssign["RETN-CODE-DESC"];
                lo_result.success = true;
            }
        } catch (err) {
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_error, lo_result);
    },

    /**
     * 取消排房Button
     * @param params
     * @param session
     * @param callback
     */
    doUnassign: async function (params, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = new ErrorClass();
        try {
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
                                    "upd_usr": session.user.usr_id,
                                    conditions: {
                                        "athena_id": session.athena_id,
                                        "hotel_cod": session.hotel_cod,
                                        "ikey": lo_order_dt.ikey,
                                        "ikey_seq_nos": lo_order_dt.ikey_seq_nos,
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

            let lo_doUnAssign = await new Promise((resolve, reject) => {
                tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
                    if (apiErr || !data) {
                        reject(apiErr)
                    }
                    else {
                        resolve(data)
                    }
                });
            });

            if (lo_doUnAssign["RETN-CODE"] !== "0000") {
                lo_result.success = false;
                lo_error.errorMsg = lo_doUnAssign["RETN-CODE-DESC"];
                console.error(lo_doUnAssign["RETN-CODE-DESC"]);
            } else {
                lo_error.errorMsg = lo_doUnAssign["RETN-CODE-DESC"];
                lo_result.success = true;
            }
            // tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
            //     let success = true;
            //     let errorMsg = "";
            //     if (apiErr || !data) {
            //         success = false;
            //         errorMsg = apiErr;
            //     } else if (data["RETN-CODE"] !== "0000") {
            //         success = false;
            //         errorMsg = data["RETN-CODE-DESC"] || "發生錯誤";
            //         console.error(data["RETN-CODE-DESC"]);
            //     } else {
            //         errorMsg = data["RETN-CODE-DESC"];
            //     }
            //     callback(errorMsg, success, data);
            // });
        } catch (err) {
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_error, lo_result);
    },

    /**
     * 批次取消 Button
     * @param params
     * @param session
     * @param callback
     */
    doBatchUnassign: async function(params, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = new ErrorClass();
        try {
            const lo_order_dt = params.order_dt;

            let la_Data = lo_order_dt.ikey_seq_nos_List.map(data => {
                return {
                    "athena_id": session.athena_id,
                    "hotel_cod": session.hotel_cod,
                    "ikey": lo_order_dt.ikey,
                    "ikey_seq_nos": data,
                    "upd_usr": session.user.usr_id,
                    conditions: {
                        "athena_id": session.athena_id,
                        "hotel_cod": session.hotel_cod,
                        "ikey": lo_order_dt.ikey,
                        "ikey_seq_nos": data,
                        "upd_usr": session.user.usr_id
                    }
                };
            });

            let apiParams = {
                "locale": "zh_TW",
                "REVE-CODE": "PMS0210030",
                "prg_id": "PMS0210030",
                "func_id": "1030",
                "page_data": {
                    "1": {
                        "tabs_data": {
                            "1": la_Data
                        }
                    }
                },
                "client_ip": "",
                "server_ip": "",
                "event_time": moment().format(),
                "mac": ""
            };

            let lo_doUnbatchAssign = await new Promise((resolve, reject) => {
                tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
                    if (apiErr || !data) {
                        reject(apiErr)
                    }
                    else {
                        resolve(data)
                    }
                });
            });

            if (lo_doUnbatchAssign["RETN-CODE"] !== "0000") {
                lo_result.success = false;
                lo_error.errorMsg = lo_doUnbatchAssign["RETN-CODE-DESC"];
                console.error(lo_doUnbatchAssign["RETN-CODE-DESC"]);
            } else {
                lo_error.errorMsg = lo_doUnbatchAssign["RETN-CODE-DESC"];
                lo_result.success = true;
            }
        } catch (err) {
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_error, lo_result);
    },

    /**
     * 鎖定排房 Button
     * @param params
     * @param session
     * @param callback
     */
    doAsiLock: async function (params, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = new ErrorClass();
        try {
            const lo_order_dt = params.order_dt;
            let ls_asiLock = lo_order_dt.asi_lock === "Y" ? "N" : "Y";

            let apiParams = {
                "locale": "zh_TW",
                "REVE-CODE": "PMS0210030",
                "prg_id": "PMS0210030",
                "func_id": "1050",
                "page_data": {
                    "1": {
                        "tabs_data": {
                            "1": [
                                {
                                    "athena_id": session.athena_id,
                                    "hotel_cod": session.hotel_cod,
                                    "ikey": lo_order_dt.ikey,
                                    "ikey_seq_nos": lo_order_dt.ikey_seq_nos,
                                    "asi_lock": ls_asiLock,
                                    "upd_usr": session.user.usr_id,
                                    conditions: {
                                        "athena_id": session.athena_id,
                                        "hotel_cod": session.hotel_cod,
                                        "ikey": lo_order_dt.ikey,
                                        "ikey_seq_nos": lo_order_dt.ikey_seq_nos,
                                        "asi_lock": ls_asiLock,
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

            let lo_doAsLock = await new Promise((resolve, reject) => {
                tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
                    if (apiErr || !data) {
                        reject(apiErr)
                    }
                    else {
                        resolve(data)
                    }
                });
            });

            if (lo_doAsLock["RETN-CODE"] !== "0000") {
                lo_result.success = false;
                lo_error.errorMsg = lo_doAsLock["RETN-CODE-DESC"];
                console.error(lo_doAsLock["RETN-CODE-DESC"]);
            } else {
                lo_error.errorMsg = lo_doAsLock["RETN-CODE-DESC"];
                lo_result.success = true;
            }
        } catch (err) {
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_error, lo_result);
    },

    /**
     * 檢查房號可否排房
     * - 檢查開始日期 = 入住日期
     * - 若入住日期 = 退房日期，則檢查結束日期 = 退房日期
     * - 否則 檢查結束日期 = 退房日期 -1
     * @param params
     * @param session
     * @param callback
     */
    checkRoomNos: function (params, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = new ErrorClass();
        try {
            let lo_order_dt = params.order_dt;
            let ld_beginDat = lo_order_dt.begin_dat;
            let ld_endDat = lo_order_dt.end_dat;

            if (ld_beginDat !== ld_endDat) {
                ld_endDat = moment(ld_endDat).add(-1, "days").format("YYYY/MM/DD");
            }

            let lo_default_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod,
                begin_dat: ld_beginDat,
                end_dat: ld_endDat,
                room_nos: lo_order_dt.select_room_nos
            };

            let lo_clusterParam = commonRule.ConvertToQueryParams(session.athena_id, "CHECK_ROOM_NOS");
            clusterQueryAgent.queryList(lo_clusterParam, lo_default_params, function (err, result) {
                if (err) {
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
        let lo_return = new ReturnClass();
        let lo_error = new ErrorClass();
        try {
            let lo_default_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod,
                ikey: params.ikey,
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
            lo_return.success = false;
            lo_error.errorMsg = err;
        }
    },

    /**
     * 批次排房預計排房明細資料
     * @param params
     * @param session
     * @param callback
     */
    quyBatchAssignDt: function (params, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = new ErrorClass();
        try {
            let lo_order_dt = params.order_dt;
            let lo_default_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod,
                ikey: lo_order_dt.ikey,
                order_sta: lo_order_dt.order_sta,
                ci_dat: lo_order_dt.ci_dat,
                co_dat: lo_order_dt.co_dat,
                rate_cod: lo_order_dt.rate_cod,
                use_cod: lo_order_dt.use_cod,
                room_cod: lo_order_dt.room_cod,
                rent_amt: lo_order_dt.rent_amt,
                serv_amt: lo_order_dt.serv_amt
            };

            let lo_clusterParam = commonRule.ConvertToQueryParams(session.athena_id, "QRY_BATCH_ASSIGN_DT");
            clusterQueryAgent.queryList(lo_clusterParam, lo_default_params, function (err, result) {
                if (err) {
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
            lo_return.success = false;
            lo_error.errorMsg = err;
        }
    },

    //反轉成16進位
    colorCodToHex: function (colorCod) {
        if (_.isUndefined(colorCod)) {
            colorCod = 0;
        }
        colorCod = Number(colorCod);
        let lo_rgb = this.colorCodToRgb(colorCod);
        return this.rgbToHex(lo_rgb.r, lo_rgb.g, lo_rgb.b);
    },
    //反轉成RGB
    colorCodToRgb: function (colorCod) {
        colorCod = Number(colorCod);
        let lo_color = {r: 0, g: 0, b: 0};
        let remainder = Math.floor(colorCod % 65536);
        lo_color.b = Math.floor(colorCod / 65536);
        lo_color.g = Math.floor(remainder / 256);
        remainder = Math.floor(colorCod % 256);
        lo_color.r = remainder;
        return lo_color;

    },
    //RGB 轉 16進位色碼
    rgbToHex: function (r, g, b) {
        return (r < 16 ? "0" + r.toString(16).toUpperCase() : r.toString(16).toUpperCase()) + (g < 16 ? "0" + g.toString(16).toUpperCase() : g.toString(16).toUpperCase()) + (b < 16 ? "0" + b.toString(16).toUpperCase() : b.toString(16).toUpperCase());
    }

};