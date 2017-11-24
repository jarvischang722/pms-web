/**
 * Created by Jun on 2017/5/9.
 */
var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var tbSVC = require("../services/DbTableService");
var mongoAgent = require("../plugins/mongodb");
var trafficSvc = require("../services/TrafficService");
var holidayDateSvc = require("../services/HolidayDateService");
let roomSvc = require("../services/RoomService");
var singleGridSVC = require("../services/GridSingleService");

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
    res.render('subsystem/setup/setupLayout', {mdl_id: mdl_id, usingSubsysID: req.cookies["usingSubsysID"]});
};


/** 訂房確認書 email **/
exports.getReservationCheckMail = function (req, res) {
    res.render("subsystem/setup/specialTmp/reservationCheckMail");
};

// 取假日種類設定檔
exports.getHolidayKindSet = function (req, res) {
    holidayDateSvc.getHolidayKindSet(req.body, req.session, function (err, dateKindSetData) {
        res.json({success: _.isNull(err), dateKindSetData: dateKindSetData});
    });
};

// 取假日日期設定
exports.getHolidayDateSet = function (req, res) {
    holidayDateSvc.getHolidayDateSet(req.body, req.session, function (err, dateSetData) {
        res.json({success: _.isNull(err), dateSetData: dateSetData});
    });
};

// 取年度總天數
exports.getHolidayDateCount = function (req, res) {
    holidayDateSvc.getHolidayDateCount(req.body, req.session, function (err, getResult) {
        res.json({success: _.isNull(err), dateCount: getResult});
    });
};


/**
 * 獲取交通接駁資料
 */
exports.getTrafficData = function (req, res) {
    trafficSvc.handleTrafficData(req.body, req.session, function (err, trafficData) {
        res.json({success: _.isNull(err), trafficData: trafficData});
    });
};

/**
 * 房型排序
 */
exports.roomCodOrder = function (req, res) {
    roomSvc.getRoomCodOrder(req.session, function (err, roomCodOrderData) {
        res.json({success: _.isNull(err), errorMsg: err, roomCodOrderData: roomCodOrderData});
    });
};

// 取房型圖片
exports.getRoomTypeUploadPic = function (req, res) {
    roomSvc.getRoomTypeUploadPic(req.body, req.session, function (err, getResult) {
        res.json({success: _.isNull(err), errorMsg: err, roomTypePicData: getResult});
    });
}

/**
 * 分帳規則(靜態)
 */
exports.getPMS0830080 = function (req, res) {
    res.render("subsystem/setup/PMS0830080");
};

/**
 * 區域別(靜態)
 */
exports.getPMS0860030 = function (req, res) {
    res.render("subsystem/setup/PMS0860030");
};
/**
 * 業務員組別(靜態)
 */
exports.getPMS0860060 = function (req, res) {
    res.render("subsystem/setup/specialTmp/PMS0860060");
};

/**
 * PMS0820020房間設定(靜態)
 */
exports.getPMS0820020 = function (req, res) {
    res.render("subsystem/setup/specialTmp/PMS0820020");
};

/**
 * 取得庫存最大日期
 */
exports.getRoomTypeMaxStockDate = function (req, res) {
    queryAgent.query("QRY_RMINV_MN_MAX_BATCH_DAT", req.session.user, function (err, data) {
        res.json({success: !_.isNull(err), errorMsg: err, max_batch_dat: data.max_batch_dat});
    });
};

/**
 * 取得程式搜尋欄位
 */
exports.getSearchUIFields = function(req,res){

};

