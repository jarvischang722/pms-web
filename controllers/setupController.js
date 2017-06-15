/**
 * Created by Jun on 2017/5/9.
 */
var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var tbSVC = require("../services/dbTableService");
var mongoAgent = require("../plugins/mongodb");
var trafficSvc = require("../services/trafficService");
var holidayDateSvc = require("../services/holidayDateService");


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
    res.render('subsystem/setup/setupLayout', {mdl_id: mdl_id, current_subsys_id:req.cookies["current_subsys_id"]});
};


/** 訂房確認書 email **/
exports.getReservationCheckMail = function (req, res) {
    res.render("subsystem/setup/specialTmp/reservationCheckMail");
};
//假日日期設定
// exports.getHolidayDateSet = function (req, res) {
//     res.render("subsystem/setup/specialTmp/holidayDateSet");
// };

// 取假日種類設定檔
exports.getHolidayKindSet = function(req, res){
    holidayDateSvc.getHolidayKindSet(req.body, req.session, function(err, dateKindSetData){
        res.json({success: _.isNull(err), dateKindSetData: dateKindSetData})
    })
};

// 取假日日期設定
exports.getHolidayDateSet = function(req, res){
    holidayDateSvc.getHolidayDateSet(req.body, req.session, function(err, dateSetData){
        res.json({success: _.isNull(err), dateSetData: dateSetData})
    })
};

// 取年度總天數
exports.getHolidayDateCount = function(req, res){
    holidayDateSvc.getHolidayDateCount(req.body, req.session, function(err, getResult){
        res.json({success: _.isNull(err), dateCount: getResult});
    })
};


/**
 * 獲取交通接駁資料
 */
exports.getTrafficData = function (req, res) {
    trafficSvc.handleTrafficData(req.body, req.session, function (err, trafficData) {
        res.json({success: _.isNull(err), trafficData: trafficData});
    })
};