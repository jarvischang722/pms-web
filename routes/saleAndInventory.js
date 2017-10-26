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
    app.get('/saleAndInventory/PSIW500030', saleAndInventoryCrtl.getPSIW500030);

    app.post('/api/getQueryResult', saleAndInventoryCrtl.getQueryResult);

    app.post('/api/callSaveAPI', saleAndInventoryCrtl.callSaveAPI);

    app.post('/api/callAPI', saleAndInventoryCrtl.callAPI);

    app.post('/api/callOrderAPI', saleAndInventoryCrtl.callOrderAPI);
};