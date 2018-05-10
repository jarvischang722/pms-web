/**
 * Created by jing on 2018/05/07.
 */
const reportCrtl = require("../controllers/reportController");
const authMW = require("../middlewares/authMiddleware");
const sysMW = require("../middlewares/systemMiddleware");
const i18nMW = require("../middlewares/i18nMiddleware");
const middles = [i18nMW, authMW, sysMW];

/* GET  page. */
module.exports = function (app) {
    //報表
    app.get("/report/:prg_id", middles, reportCrtl.report);
    //產生報表
    app.post("/api/doGenReport", middles, reportCrtl.doGenReport);
};