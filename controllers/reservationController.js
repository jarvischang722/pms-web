/**
 * Created by jing on 2017/5/31.
 */

var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/roleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/roleFuncService");

/**
 * 依房型訂房(靜態)
 */
exports.getReservationRoomType = function (req, res) {
    res.render("subsystem/reservation/reservationRoomType");
};
/**
 * setUp 房價設定(靜態)
 */
exports.getSetRateCode = function (req, res) {
    res.render("subsystem/reservation//setRateCode");
};

/**
 * 交通接駁設定(靜態)
 */
exports.getTrafficConnection = function (req, res) {
    res.render("subsystem/reservation/trafficConnection");
};

/**
 * 鎖控設定(靜態)
 */
exports.getResv_blockSetting = function (req, res) {
    res.render("subsystem/reservation/resv_blockSetting");
};

/**
 * 超訂設定(靜態)
 */
exports.getPMS0130010 = function (req, res) {
    res.render("subsystem/reservation/PMS0130010");
};

/**
 * 住客歷史(靜態 quickMenu)
 */
exports.getResv_gProfile = function (req, res) {
    res.render("subsystem/reservation/resv_gProfile");
};

/**
 * 訂房卡多筆(靜態 quickMenu)
 */
exports.getResv_bookings = function (req, res) {
    res.render("subsystem/reservation/resv_bookings");
};
/**
 * 異動紀錄(靜態 quickMenu)
 */
exports.getResv_changeRecords = function (req, res) {
    res.render("subsystem/reservation/resv_changeRecords");
};