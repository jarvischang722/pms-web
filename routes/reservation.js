/**
 * Created by jing on 2017/5/31.
 */
var reservationCrtl = require("../controllers/reservationController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];

/* GET  page. */
module.exports = function (app) {
    //依房型訂房(靜態)
    app.get('/reservationRoomType', middles, reservationCrtl.getReservationRoomType);

    //setup 房價設定(靜態)
    app.get('/setRateCode', middles, reservationCrtl.getSetRateCode);

    //交通接駁設定(靜態)
    app.get('/trafficConnection', middles, reservationCrtl.getTrafficConnection);

    //鎖控設定(靜態)
    app.get('/resv_blockSetting', middles, reservationCrtl.getResv_blockSetting);

    //超訂設定(靜態)
    app.get('/PMS0120020', middles, reservationCrtl.getPMS0120020);

    //住客歷史(靜態 quickMenu)
    app.get('/resv_gProfile', middles, reservationCrtl.getResv_gProfile);

    //訂房卡多筆(靜態 quickMenu)
    // app.get('/resv_bookings', middles, reservationCrtl.getResv_bookings);
    app.get('/resv_bookings', middles, reservationCrtl.getPMS0110040);

    //異動紀錄(靜態 quickMenu)
    app.get('/resv_changeRecords', middles, reservationCrtl.getResv_changeRecords);

    //鎖控iframe(靜態 quickMenu)
    app.get('/resvBlockSettingTable_1', middles, reservationCrtl.getResv_blockSettingTable);

    //專案訂房(靜態 quickMenu)
    app.get('/PMS0110030', middles, reservationCrtl.getPMS0110030);

    //依房號訂房(靜態 quickMenu)
    app.get('/resv_roomPlan', middles, reservationCrtl.getResv_roomPlan);

    //櫃檯備品iframe(靜態)
    app.get('/counterSupplies-Table_1', middles, reservationCrtl.getResv_counterSuppliesTable);

    //櫃檯備品iframe(靜態)
    app.get('/resv_ratePlanTable', middles, reservationCrtl.getResv_ratePlanTable);

    //amenitiesIny. 櫃檯備品iframe(靜態)
    app.get('/resv_amenitiesIframe', middles, reservationCrtl.getResv_amenitiesIframe);

    //交辦事項(靜態)
    app.get('/PMS0120070', middles, reservationCrtl.getPMS0120070);

    //房價一覽表iframe(靜態)
    app.get('/resv_rateListTable', middles, reservationCrtl.getResv_rateListTable);

    //[PMS0110010依房型訂房] 首頁地圖資料
    app.post("/api/qryPageOneDataByRmTyp", middles, reservationCrtl.qryPageOneDataByRmTyp);

    //[PMS0110050依房號訂房] 首頁地圖資料
    app.post("/api/qryRmNosPageOneMap", middles, reservationCrtl.qryRmNosPageOneMap);

    //A7滾房租日
    app.post("/api/qryRentCalDat", middles, reservationCrtl.qryRentCalDat);


};