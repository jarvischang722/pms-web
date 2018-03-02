/**
 * Created by jing on 2017/7/05.
 */
var processCrtl = require("../controllers/processController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];

/* GET  page. */
module.exports = function (app) {

    //前台流程設定(靜態)
    app.get('/PMS0710010', middles, processCrtl.getPMS0710010);
};