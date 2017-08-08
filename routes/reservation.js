/**
 * Created by jing on 2017/5/31.
 */
var reservationCrtl = require("../controllers/reservationController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,sysMW];

/* GET  page. */
module.exports = function(app  ) {


    //依房型訂房(靜態)
    app.get('/reservationRoomType', reservationCrtl.getReservationRoomType);

    //setUp 房價設定(靜態)
    app.get('/setRateCode', reservationCrtl.getSetRateCode);

    //交通接駁設定(靜態)
    app.get('/trafficConnection', reservationCrtl.getTrafficConnection);

    //鎖控設定(靜態)
    app.get('/resv_blockSetting', reservationCrtl.getResv_blockSetting);

    //超訂設定(靜態)
    app.get('/PMS0120020', reservationCrtl.getPMS0120020);

    //住客歷史(靜態 quickMenu)
    app.get('/resv_gProfile', reservationCrtl.getResv_gProfile);

    //訂房卡多筆(靜態 quickMenu)
    app.get('/resv_bookings', reservationCrtl.getResv_bookings);

    //異動紀錄(靜態 quickMenu)
    app.get('/resv_changeRecords', reservationCrtl.getResv_changeRecords);

    //鎖控iframe(靜態 quickMenu)
    app.get('/resvBlockSettingTable_1', reservationCrtl.getResv_blockSettingTable);

    //專案訂房(靜態 quickMenu)
    app.get('/PMS0110030', reservationCrtl.getPMS0110030);

    //依房號訂房(靜態 quickMenu)
    app.get('/resv_roomPlan', reservationCrtl.getResv_roomPlan);

    //櫃檯備品iframe(靜態)
    app.get('/counterSupplies-Table_1', reservationCrtl.getResv_counterSuppliesTable);

    //櫃檯備品iframe(靜態)
    app.get('/resv_ratePlanTable', reservationCrtl.getResv_ratePlanTable);

    //交辦事項(靜態)
    app.get('/PMS0120070', reservationCrtl.getPMS0120070);

};