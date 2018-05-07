/**
 * Created by jing on 2018/05/07.
 */
var reportCrtl = require("../controllers/reportController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];

/* GET  page. */
module.exports = function (app) {
    //報表(靜態)
    app.get('/report', middles, reportCrtl.getreport);
};