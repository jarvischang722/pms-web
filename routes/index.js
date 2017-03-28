var sysCrtl = require("../controllers/systemController");
var authMW = require("../middlewares/authMiddleware");
var hotelMW = require("../middlewares/hotelMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,hotelMW];


/* GET  page. */
module.exports = function(app, passport ) {
    //首頁
    app.get('/', middles, sysCrtl.index);

    //系統別選擇
    app.get('/systemOption', sysCrtl.systemOption);

    //館別切換
    app.post('/changeHotelCod', sysCrtl.changeHotelCod);

    //
    app.get('/manageReservation', middles, sysCrtl.manageReservation);


};

