/**
 * Created by Jun on 2017/2/10.
 */
var dgCrtl = require("../controllers/datagridController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];
var apiMiddles = [authMW];

module.exports = function (app) {

    //取得設定檔資料
    app.post('/api/prgDataGridDataQuery', apiMiddles, dgCrtl.prgDataGridDataQuery);

    //儲存使用者欄位資料
    app.post('/api/saveFieldOptionByUser', apiMiddles, dgCrtl.saveFieldOptionByUser);

    //儲存
    app.post('/api/saveDataRow', apiMiddles, dgCrtl.saveDataRow);

    //取得Row預設值
    app.post('/api/handleDataGridAddEventRule', apiMiddles, dgCrtl.handleDataGridAddEventRule);

    //按下刪除按鈕資料檢查
    app.post('/api/handleDataGridDeleteEventRule', apiMiddles, dgCrtl.handleDataGridDeleteEventRule);

};

