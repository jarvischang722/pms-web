/**
 * Created by jing on 2017/5/31.
 */
var reservationCrtl = require("../controllers/reservationController");
var authMW = require("../middlewares/authMiddleware");
var hotelMW = require("../middlewares/hotelMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,hotelMW];

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

};