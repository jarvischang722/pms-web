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

/**
 * 從資料庫撈取房型圖片資料
 * @param postData {Object}
 * @param session {Object}
 * @param callback {Obejct}
 */
exports.getRoomTypeUploadPic = function (postData, session, callback) {
    let params = {
        athena_id: session.user.athena_id,
        hotel_cod: session.user.fun_hotel_cod,
        room_cod: postData.room_cod,
        begin_dat: postData.begin_dat
    };
    queryAgent.queryList("QRY_PIC_PATH".toUpperCase(), params, 0, 0, function (err, getResult) {
        getResult = filter_array(getResult);
        _.each(getResult, function (eachFile) {
            eachFile.pic_path = sysConfig.image_url + eachFile.pic_path;
        });

        callback(err, getResult);
    });
};

function filter_array(test_array) {
    var index = -1,
        arr_length = test_array ? test_array.length : 0,
        resIndex = -1,
        result = [];

    while (++index < arr_length) {
        var value = test_array[index].pic_path;

        if (value) {
            result[++resIndex] = {pic_path: value};
        }
    }

    return result;
}