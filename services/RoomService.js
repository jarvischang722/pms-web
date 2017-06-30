/**
 * Created by Jun on 2017/6/30.
 * 房間相關服務
 */
const moment = require("moment");
const queryAgent = require('../plugins/kplug-oracle/QueryAgent');
const mongoAgent = require("../plugins/mongodb");
const _ = require("underscore");
const async = require("async");
const CommonTools = require("../utils/CommonTools");
const sysConfig = require("../configs/SystemConfig");

/**
 * 從資料庫撈取房型排序資料
 * @param session {Object}
 * @param callback {Obejct}
 */
exports.getRoomCodOrder = function (session, callback) {
    let params = {athena_id: session.user.athena_id, hotel_cod: session.user.fun_hotel_cod};
    queryAgent.queryList("QRY_ROOM_COD_ORDER", params, 0, 0, function (err, roomCodOrderData) {
        callback(err, roomCodOrderData);
    });
};