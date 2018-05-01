/**
 * Created by jing on 2018/03/29.
 */
var sysManagementCrtl = require("../controllers/sysManagementController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];

/* GET  page. */
module.exports = function (app) {
    //客戶購買授權(靜態)
    app.get('/SYS0210010', middles, sysManagementCrtl.getSYS0210010);
};