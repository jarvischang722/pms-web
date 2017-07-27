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

    //Arrivals
    app.get('/PMS0210060', frontDeskCrtl.getPMS0210060);
};