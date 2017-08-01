/**
 * Created by jing on 2017/5/24.
 */

var cashierCrtl = require("../controllers/cashierController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,sysMW];

/* GET  page. */
module.exports = function(app  ) {

    //外幣匯兌(靜態)
    app.get('/PMS0320010', cashierCrtl.getPMS0320010);

    //住客帳維護(靜態)
    app.get('/PMS0310010', cashierCrtl.getPMS0310010);

    //出鈉　已結帳處理(靜態)
    app.get('/PMS0310030', cashierCrtl.getPMS0310030);

    //取得收入小分類
    app.post('/api/getStypeRf', cashierCrtl.getStypeRf);

    //
    app.post('/api/getRouteDtByRouteCod', cashierCrtl.getRouteDtByRouteCod);
    //
    app.post('/api/doSavePMS0830080', cashierCrtl.doSavePMS0830080);
};