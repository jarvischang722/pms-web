/**
 * Created by jing on 2017/7/05.
 */
var nightAuditCrtl = require("../controllers/nightAuditController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];

/* GET  page. */
module.exports = function (app) {

    //房價稽核表
    app.get('/PMS0510020', nightAuditCrtl.getPMS0510020);

};