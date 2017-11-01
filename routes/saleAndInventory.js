/**
 * Created by Mike on 2017/10/11.
 */

var saleAndInventoryCrtl = require("../controllers/saleAndInventoryController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,sysMW];
var middles2 = [authMW];

/* GET  page. */
module.exports = function(app) {

    //門市WEB訂單作業
    app.get('/saleAndInventory/PSIW500030', middles2, saleAndInventoryCrtl.getPSIW500030);

    app.post('/api/getQueryResult', middles2, saleAndInventoryCrtl.getQueryResult);

    app.post('/api/callSaveAPI', middles2, saleAndInventoryCrtl.callSaveAPI);

    app.post('/api/callAPI', middles2, saleAndInventoryCrtl.callAPI);

    app.post('/api/callOrderAPI', middles2, saleAndInventoryCrtl.callOrderAPI);

    //WebService
    app.post('/api/dominos/:trans_cod', saleAndInventoryCrtl.dominosWebService);
};