/**
 * Created by jing on 2017/5/31.
 */

const _ = require("underscore");
const queryAgent = require('../plugins/kplug-oracle/QueryAgent');
const resvSvc = require("../services/reservationService");

/**
 * 依房型訂房(靜態)
 */
exports.getReservationRoomType = function (req, res) {
    res.render("subsystem/reservation/reservationRoomType");
};

/**
 * setup 房價設定(靜態)
 */
exports.getSetRateCode = function (req, res) {
    res.render("subsystem/setup/specialTmp/PMS0810230", {prg_id: "PMS0810230"});
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
 * ratePlan iframe(靜態)
 */
exports.getResv_ratePlanTable = function (req, res) {
    res.render("subsystem/reservation/PMS0100000_module/resv_ratePlanTable");
};
/**
 * 交辦事項(靜態)
 */
exports.getPMS0120070 = function (req, res) {
    res.render("subsystem/reservation/PMS0120070");
};

exports.getPMS0110040 = function(req, res){
    res.render("subsystem/reservation/PMS0110040");
}
/**
 * 房價一覽表iframe(靜態)
 */
exports.getResv_rateListTable = function (req, res) {
    res.render("subsystem/reservation/PMS0100000_module/resv_rateListTable");
};

//[PMS0110010依房型訂房] 首頁地圖資料
exports.qryPageOneDataByRmTyp = function (req, res) {
    resvSvc.qryPageOneDataByRmTyp(req.body, req.session, function (err, result) {
        res.json({success: err == null, data: result, errorMsg: err});
    });
};

//[PMS0110050依房號訂房] 首頁地圖資料
exports.qryRmNosPageOneMap = async (req, res) => {
    let lo_result = await resvSvc.qryRmNosPageOneMap(req.body, req.session);
    res.json({success: lo_result.success == true, data: lo_result.data, errorMsg: lo_result.errMsg});
};

exports.qryRentCalDat = function (req, res) {
    let lo_userInfo = req.session.user;
    let lo_params = {
        athena_id: lo_userInfo.athena_id,
        hotel_cod: lo_userInfo.hotel_cod
    };
    queryAgent.query("QRY_RENT_CAL_DAT", lo_params, function (err, result) {
        res.json({success: err == null, rent_cal_dat: result.rent_cal_dat});
    });
};
