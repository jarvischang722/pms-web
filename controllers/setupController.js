/**
 * Created by Jun on 2017/5/9.
 */
var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var tbSVC = require("../services/dbTableService");
var mongoAgent = require("../plugins/mongodb");


/**
 * 前台參數設定 Module
 */
exports.front_desk_conf = function (req, res) {
    res.render('subsystem/setup/front_desk_conf');
};

/**
 * 訂房對照檔
 */
exports.reservation_comparison = function (req, res) {
    res.render('subsystem/setup/reservation_comparison', {sys_id: req.params.sys_id, subsys_id: req.params.subsys_id});
};


/**
 * 設定 layout
 */
exports.setupLayout = function (req, res) {
    var mdl_id = req.params.mdl_id; //模組ID
    res.render('subsystem/setup/setupLayout', {mdl_id: mdl_id});
};



// /** 訂房確認書 email **/
// exports.getReservationCheckMail = function (req, res) {
//     res.render("subsystem/setup/reservationCheckMail");
// };
// //假日日期設定
// exports.getHolidayDateSet = function (req, res) {
//     res.render("subsystem/setup/holidayDateSet");
// };