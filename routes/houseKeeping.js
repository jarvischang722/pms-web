/**
 * Created by jing on 2017/7/19.
 */

var houseKeepingCrtl = require("../controllers/houseKeepingController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];
var apiMiddles = [authMW];

/* GET  page. */
module.exports = function (app) {

    //失物管理(靜態)
    app.get('/PMS0410050', middles, houseKeepingCrtl.getPMS0410050);

    //房務入帳
    app.get('/PMS0410020', middles, houseKeepingCrtl.getPMS0410020);

    //房務管理
    app.get('/PMS0410010', middles, houseKeepingCrtl.getPMS0410010);

    //打掃安排
    app.get('/PMS0410060', middles, houseKeepingCrtl.getPMS0410060);
};