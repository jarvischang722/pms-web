/**
 * Created by jing on 2017/5/24.
 */

var cashierCrtl = require("../controllers/cashierController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];
var apiMiddles = [authMW];
/* GET  page. */
module.exports = function (app) {

    //外幣匯兌(靜態)
    app.get('/PMS0320010', middles, cashierCrtl.getPMS0320010);

    //住客帳維護(靜態)
    app.get('/PMS0310010', middles, cashierCrtl.getPMS0310010);

    //出鈉　已結帳處理(靜態)
    app.get('/PMS0310030', middles, cashierCrtl.getPMS0310030);

    //取得收入小分類
    app.post('/api/getStypeRf', apiMiddles, cashierCrtl.getStypeRf);

    //
    app.post('/api/getRouteDtByRouteCod', apiMiddles, cashierCrtl.getRouteDtByRouteCod);
    //
    app.post('/api/doSavePMS0830080', apiMiddles, cashierCrtl.doSavePMS0830080);
    //儲存
    app.post('/api/doSavePMS0830070', apiMiddles, cashierCrtl.doSavePMS0830070);

    //取得單筆資料
    app.post("/api/qryPMS0830070SingleData", apiMiddles, cashierCrtl.qryPMS0830070SingleData);
    //取得單筆
    // app.post('/api/qryPMS0830070SingleMn', cashierCrtl.qryPMS0830070SingleMn);
    //取得DT
    // app.post('/api/qryPMS0830070SingleDt', cashierCrtl.qryPMS0830070SingleDt);
    //取得DT2
    app.post('/api/qryPMS0830070SingleDt2', apiMiddles, cashierCrtl.qryPMS0830070SingleDt2);
    //取得DT的DT
    app.post('/api/qryPMS0830070SingleDt4Dt', apiMiddles, cashierCrtl.qryPMS0830070SingleDt4Dt);
    //取得DT2全部資料
    app.post('/api/qryPMS0830070Dt2AllData', apiMiddles, cashierCrtl.qryPMS0830070Dt2AllData);
};