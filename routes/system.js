/**
 * Created by Jun on 2017/5/7.
 */
var systCrtl = require("../controllers/systemController");
var authMW = require("../middlewares/authMiddleware");
var hotelMW = require("../middlewares/hotelMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,hotelMW];

/* GET  page. */
module.exports = function(app  ) {


    app.get('/subsystem/reservation', middles, systCrtl.reservation);
    app.get('/subsystem/reception', middles, systCrtl.reception);
    app.get('/subsystem/cashier', middles, systCrtl.cashier);
    app.get('/subsystem/housekeeping', middles, systCrtl.housekeeping);
    app.get('/subsystem/night_check', middles, systCrtl.night_check);
    app.get('/subsystem/sales', middles, systCrtl.sales);
    app.get('/subsystem/report', middles, systCrtl.report);
    app.get('/subsystem/setup', middles, systCrtl.setup);
    app.get('/subsystem/customize_setup', middles, systCrtl.customize_setup);
    app.get('/subsystem/common', middles, systCrtl.commom);

    /** **/
    app.post('/api/getGroupMdlPros', middles, systCrtl.getGroupMdlPros);

};