/**
 * Created by jing on 2017/5/31.
 */

var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/RoleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/RoleFuncService");

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
exports.getPMS0120020 = function (req, res) {
    res.render("subsystem/reservation/PMS0120020");
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
/**
 * 鎖控iframe(靜態 quickMenu)
 */
exports.getResv_blockSettingTable = function (req, res) {
    res.render("subsystem/reservation/PMS0100000_module/resvBlockSettingTable_1");
};
/**
 * 專案訂房(靜態 quickMenu)
 */
exports.getPMS0110030 = function (req, res) {
    res.render("subsystem/reservation/PMS0110030");
};

/**
 * 依房號訂房
 */
exports.getResv_roomPlan = function (req, res) {
    res.render("subsystem/reservation/resv_roomPlan");
};
/**
 * 櫃檯備品iframe(靜態)
 */
exports.getResv_counterSuppliesTable = function (req, res) {
    res.render("subsystem/reservation/PMS0100000_module/counterSupplies-Table_1");
};
/**
 * 交辦事項(靜態)
 */
exports.getPMS0120070 = function (req, res) {
    res.render("subsystem/reservation/PMS0120070");
};
/**
 * 出鈉-已結帳處理
 */
exports.getPMS0310030 = function (req, res) {
    res.render("subsystem/cashier/PMS0310030");
};
/**
 * arrivals
 */
exports.getPMS0210060 = function (req, res) {
    res.render("subsystem/cashier/PMS0210060");
};