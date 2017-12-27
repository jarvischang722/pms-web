/**
 * Created by Mike on 2017/10/11.
 */

var saleAndInventoryCrtl = require("../controllers/saleAndInventoryController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,sysMW];

/* GET  page. */
module.exports = function(app) {

    //門市WEB訂單作業
    app.get('/psi/PSIW510030', middles, saleAndInventoryCrtl.getPSIW510030);

    app.post('/api/getQueryResult', middles, saleAndInventoryCrtl.getQueryResult);

    app.post('/api/callSaveAPI', middles, saleAndInventoryCrtl.callSaveAPI);

    app.post('/api/callAPI', middles, saleAndInventoryCrtl.callAPI);

    app.post('/api/callOrderAPI', middles, saleAndInventoryCrtl.callOrderAPI);

    //WebService
    app.post('/api/dominos/:trans_cod', saleAndInventoryCrtl.dominosWebService);
};