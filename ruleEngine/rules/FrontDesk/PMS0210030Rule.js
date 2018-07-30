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
        let lo_error = null;

        let lo_default_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod,
            // ci_dat: '2018/06/29'
            ci_dat: postData.ci_dat
        };

        try {
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

    fetchRoomData: function (params, session, callback) {
        let apiParams = {
            "REVE-CODE": "PMS0210030",
            "prg_id": "PMS0210030",
            "athena_id": session.athena_id,
            "hotel_cod": session.hotel_cod,
            "func_id": "2010",
            "client_ip": "",
            "locale": "zh_TW",

            "usr_id": session.user.usr_id,
            "socket_id": "",
            "begin_dat": params.ci_dat,
            "end_dat": params.co_dat,
            "room_cod": params.room_cod,
            "character_rmk": params.character_rmk,
            "build_nos": params.build_nos,
            "floor_nos": params.floor_nos,
            "bed_sta": params.bed_sta,
            "can_assign": params.can_assign
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
    }
};