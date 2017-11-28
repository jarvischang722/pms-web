/**
 * Created by kaiyue on 2017/11/08.
 */
let resvbanquetCtrl = require("../controllers/reserveBanquetController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];
var apiMiddles = [authMW];

module.exports = function(app, passport){

    //reserveBanquet格萊天漾訂席頁
    app.get("/reserveBanquet/RS0W202010", middles, resvbanquetCtrl.getRS0W202010);

    app.post("/reserveBanquet/qryPageOneData", apiMiddles, resvbanquetCtrl.qryPageOneData);

    app.post("/reserveBanquet/qryPageTwoData", apiMiddles, resvbanquetCtrl.qryPageTwoData);

    app.post("/reserveBanquet/qrySystemParam", apiMiddles, resvbanquetCtrl.qrySystemParam);

    app.post("/reserveBanquet/chk_use_typ", apiMiddles, resvbanquetCtrl.chk_use_typ);
};