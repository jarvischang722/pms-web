/**
 * Created by Jun on 2017/6/27.
 * API 交易
 */
const moment = require("moment");
const queryAgent = require('../plugins/kplug-oracle/QueryAgent');
const mongoAgent = require("../plugins/mongodb");
const _ = require("underscore");
const async = require("async");
const CommonTools = require("../utils/CommonTools");
const sysConfig = require("../configs/SystemConfig");
const fs = require("fs");


/**
 * 產生房型庫存
 * 交易代碼 : PMS08100201004
 * @param session {Object}
 * @param params  {Object}
 * @param cb
 */
exports.genRoomTypeStock = function (session, params, cb) {
    let checkResult = CommonTools.checkRequireParams(params, ['start_dat', 'end_dat', 'reset_qnt']);
    if (!checkResult.success) {
        return cb(checkResult["errorMsg"], checkResult.success);
    }
    params["REVE-CODE"] = "PMS08100201004";
    params["athena_id"] = session.user.athena_id;
    params["hotel_cod"] = session.user.fun_hotel_cod;
    params["sys_cod"] = "HFD";
    CommonTools.requestApi(sysConfig.api_url, params, function (err, res, data) {
        if (err) {
            return cb(err, false);
        } else if (data["RETN-CODE"] != "0000") {
            return cb(data["RETN-CODE-DESC"], false);
        } else {
            cb(null, true);
        }
    });
};

/**
 * 房型圖檔官網上傳
 * 交易代碼 : PMS08100201003
 * @param session
 * @param params
 * @param cb
 */
exports.uploadRoomTypePic = function (session, params, cb) {
    let checkResult = CommonTools.checkRequireParams(params, ['room_cod', 'begin_dat']);
    if (!checkResult.success) {
        return cb(checkResult["errorMsg"], checkResult.success);
    }
    params["REVE-CODE"] = "PMS08100201003";
    params["athena_id"] = session.user.athena_id;
    params["hotel_cod"] = session.user.fun_hotel_cod;
    params["sys_cod"] = "HFD";
    CommonTools.requestApi(sysConfig.api_url, params, function (err, res, data) {
        if (err) {
            return cb(err, false);
        } else if (data["RETN-CODE"] != "0000") {
            return cb(data["RETN-CODE-DESC"], false);
        } else {
            cb(null, true);
        }
    });
};

/**
 * 上傳房型(房型設定)
 * 交易代碼 : PMS08100201002
 * @param session
 * @param params
 * @param cb
 */
exports.uploadRoomType = function (session, params, cb) {
    let checkResult = CommonTools.checkRequireParams(params, ['room_cod', 'begin_dat']);
    if (!checkResult.success) {
        return cb(checkResult["errorMsg"], checkResult.success);
    }
    params["REVE-CODE"] = "PMS08100201002";
    params["athena_id"] = session.user.athena_id;
    params["hotel_cod"] = session.user.fun_hotel_cod;
    params["sys_cod"] = "HFD";
    CommonTools.requestApi(sysConfig.api_url, params, function (err, res, data) {
        if (err) {
            return cb(err, false);
        } else if (data["RETN-CODE"] != "0000") {
            return cb(data["RETN-CODE-DESC"], false);
        } else {
            cb(null, true);
        }
    });
};