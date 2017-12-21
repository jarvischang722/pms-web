/**
 * Created by kaiyue on 2017/11/08.
 */
let resvbanquetCtrl = require("../controllers/reserveBanquetController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];

module.exports = function(app, passport){

    //reserveBanquet格萊天漾訂席頁
    app.get("/rs/RS0W212010", middles, resvbanquetCtrl.getRS0W212010);

    app.post("/reserveBanquet/qryPageOneData", middles, resvbanquetCtrl.qryPageOneData);

    app.post("/reserveBanquet/qryPageTwoData", middles, resvbanquetCtrl.qryPageTwoData);

    app.post("/reserveBanquet/qrySystemParam", middles, resvbanquetCtrl.qrySystemParam);

    app.post("/reserveBanquet/chk_use_typ", middles, resvbanquetCtrl.chk_use_typ);

    app.post("/reserveBanquet/def_proc_sta", middles, resvbanquetCtrl.def_proc_sta);

    app.post("/reserveBanquet/qry_bqcust_mn", middles, resvbanquetCtrl.qry_bqcust_mn);

    app.post("/reserveBanquet/chgOrderStaAPI", middles, resvbanquetCtrl.chgOrderStaAPI);

    app.post("/reserveBanquet/getPlaceUnitAmt", middles, resvbanquetCtrl.getPlaceUnitAmt);

};