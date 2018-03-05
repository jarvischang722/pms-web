/**
 * Created by a16009 on 2017/10/11.
 * 程式編號: PSIW510030
 * 程式名稱: 門市WEB訂單作業
 */

const saleAndInventoryCrtl = require("../controllers/saleAndInventoryController");
const authMW = require("../middlewares/authMiddleware");
const sysMW = require("../middlewares/systemMiddleware");
const i18nMW = require("../middlewares/i18nMiddleware");
const middles = [i18nMW,authMW,sysMW];

/* GET  page. */
module.exports = function(app) {

    //門市WEB訂單作業
    app.get('/psi/PSIW510030', middles, saleAndInventoryCrtl.getPSIW510030);

    app.post('/api/getQueryResult', middles, saleAndInventoryCrtl.getQueryResult);

    app.post('/api/callSaveAPI', middles, saleAndInventoryCrtl.callSaveAPI);

    app.post('/api/callAPI', saleAndInventoryCrtl.callAPI);

    app.post('/api/callOrderAPI', middles, saleAndInventoryCrtl.callOrderAPI);

    //WebService
    app.post('/api/dominos/:trans_cod', saleAndInventoryCrtl.dominosWebService);
};