/**
 * Created by jing on 2017/7/05.
 */
var frontDeskCrtl = require("../controllers/frontDeskController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];

/* GET  page. */
module.exports = function (app) {

    //櫃檯備品(靜態)
    app.get('/PMS0210020', frontDeskCrtl.getPMS0210020);

    //團體管理(靜態)
    app.get('/PMS0210040', frontDeskCrtl.getPMS0210040);

    //CO清單(靜態)
    app.get('/PMS0210070', frontDeskCrtl.getPMS0210070);

    //message(靜態)
    app.get('/PMS0210130', frontDeskCrtl.getPMS0210130);

    // C/I清單 (靜態)
    app.get('/PMS0210060', frontDeskCrtl.getPMS0210060);

    //排房處理
    app.get('/PMS0210030', frontDeskCrtl.getPMS0210030);

    //住客查詢
    app.get('/PMS0210050', frontDeskCrtl.getPMS0210050);

    //晨呼
    app.get('/PMS0210120', frontDeskCrtl.getPMS0210120);
};