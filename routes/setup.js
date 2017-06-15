/**
 * Created by Jun on 2017/5/9.
 */
var setupCrtl = require("../controllers/setupController");
var authMW = require("../middlewares/authMiddleware");
var hotelMW = require("../middlewares/hotelMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,hotelMW];

/* GET  page. */
module.exports = function(app) {

    /** 飯店前台參數 **/
    app.get('/setup/front_desk_conf', middles, setupCrtl.front_desk_conf);

    /** 訂房確認書 email **/
    app.get('/reservationCheckMail', setupCrtl.getReservationCheckMail);

    /** 假日日期設定 **/
    // app.get('/holidayDateSet', setupCrtl.getHolidayDateSet);

    /** 設定Layout **/
    app.get('/setup/:mdl_id', middles, setupCrtl.setupLayout);

    /** 交通接駁設定資料 **/
    app.post('/api/getTrafficData',setupCrtl.getTrafficData);

    // 取得假日種類設定資料
    app.post("/api/getHolidayKindSet", setupCrtl.getHolidayKindSet);

    // 取假日日期設定
    app.post("/api/getHolidayDateSet", setupCrtl.getHolidayDateSet);

    // 取年度總天數
    app.post("/api/getHolidayDateCount", setupCrtl.getHolidayDateCount);
};