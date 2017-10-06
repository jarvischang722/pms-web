/**
 * Created by jing on 2017/8/03.
 */
var nightAuditCrtl = require("../controllers/nightAuditController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];

/* GET  page. */
module.exports = function (app) {

    //夜間稽核
    app.get('/PMS0510010',middles, nightAuditCrtl.getPMS0510010);

    //房價稽核表
    app.get('/PMS0510020', middles,nightAuditCrtl.getPMS0510020);

};