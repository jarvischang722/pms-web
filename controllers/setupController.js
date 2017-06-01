/**
 * Created by Jun on 2017/5/9.
 */
var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var tbSVC = require("../services/dbTableService");
var mongoAgent = require("../plugins/mongodb");
var trafficSvc = require("../services/trafficService");


/**
 * 前台參數設定 Module
 */
exports.front_desk_conf = function (req, res) {
    res.render('subsystem/setup/front_desk_conf');
};


/**
 * 設定 layout
 */
exports.setupLayout = function (req, res) {
    var mdl_id = req.params.mdl_id; //模組ID
    res.render('subsystem/setup/setupLayout', {mdl_id: mdl_id});
};


/** 訂房確認書 email **/
exports.getReservationCheckMail = function (req, res) {
    res.render("subsystem/setup/specialTmp/reservationCheckMail");
};
//假日日期設定
exports.getHolidayDateSet = function (req, res) {
    res.render("subsystem/setup/specialTmp/holidayDateSet");
};


/**
 * 獲取交通接駁資料
 */
exports.getTrafficData = function (req, res) {
    trafficSvc.handleTrafficData(req.body, req.session, function (err, trafficData) {
        res.json({success: _.isNull(err), trafficData: trafficData});
    })
};