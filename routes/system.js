/**
 * Created by Jun on 2017/5/7.
 */
var systCrtl = require("../controllers/systemController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,sysMW];

/* GET  page. */
module.exports = function(app  ) {


    app.get('/subsystem/reservation', middles, systCrtl.reservation);
    app.get('/subsystem/reception', middles, systCrtl.reception);
    app.get('/subsystem/cashier', middles, systCrtl.cashier);
    app.get('/subsystem/housekeeping', middles, systCrtl.housekeeping);
    app.get('/subsystem/nightAudit', middles, systCrtl.night_check);
    app.get('/subsystem/sales', middles, systCrtl.sales);
    app.get('/subsystem/report', middles, systCrtl.report);
    app.get('/subsystem/setup', middles, systCrtl.setup);
    app.get('/subsystem/ownMenu', middles, systCrtl.ownMenu);
    app.get('/subsystem/common', middles, systCrtl.commom);

    /** **/
    app.post('/api/getGroupMdlPros', middles, systCrtl.getGroupMdlPros);
    app.post("/api/uploadFile", middles, systCrtl.uploadFile);

};