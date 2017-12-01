/**
 * Created by jing on 2017/11/25.
 */

var adminCrtl = require("../controllers/adminController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];
var apiMiddles = [authMW];

/* GET  page. */
module.exports = function (app) {

    // 設定欄位寬度的屬性
    app.get('/setPageProSize', middles, adminCrtl.getSetPageProSize);

};