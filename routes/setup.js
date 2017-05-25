/**
 * Created by Jun on 2017/5/9.
 */
var setupCrtl = require("../controllers/setupController");
var authMW = require("../middlewares/authMiddleware");
var hotelMW = require("../middlewares/hotelMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,hotelMW];

/* GET  page. */
module.exports = function(app  ) {

    /** 飯店前台參數 **/
    app.get('/setup/front_desk_conf', middles, setupCrtl.front_desk_conf);

    /** 訂房對照檔 **/
    app.get('/setup/reservation_comparison', middles, setupCrtl.reservation_comparison);

    /** 設定Layout **/
    app.get('/setup/:mdl_id', middles, setupCrtl.setupLayout);

    // /** 訂房確認書 email **/
    // app.get('/setup/reservationCheckMail', setupCrtl.getReservationCheckMail);
    //
    // /** 假日日期設定 **/
    // app.get('/setup/holidayDateSet', setupCrtl.getHolidayDateSet);


};