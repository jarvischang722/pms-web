/**
 * Created by kaiyue on 2017/11/08.
 */
let reserveBanquetCtrl = require("../controllers/reserveBanquetController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];
var apiMiddles = [authMW];

module.exports = function(app, passport){

    //reserveBanquet格萊天漾訂席頁
    app.get("/reserveBanquet/RS00202010", middles, reserveBanquetCtrl.getRS00202010);
};