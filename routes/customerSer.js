/**
 * Created by jing on 2018/03/29.
 */
var customerSerCrtl = require("../controllers/customerSerController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];

/* GET  page. */
module.exports = function (app) {

    //客戶維護設定(靜態)
    app.get('/SER0140010', middles, customerSerCrtl.getSER0140010);
};