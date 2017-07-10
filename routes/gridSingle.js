/**
 * Created by Jun on 2017/2/25.
 */

var sgCrtl = require("../controllers/gridSingleController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,sysMW];

module.exports = function(app ) {

    //取得欄位資料
    app.post('/api/singleGridPageFieldQuery',middles,  sgCrtl.singleGridPageFieldQuery);

    //取得頁面ID2 單筆資料
    app.post('/api/singlePageRowDataQuery',middles,  sgCrtl.singlePageRowDataQuery);

    //儲存資料API
    app.post('/api/saveGridSingleData',middles, sgCrtl.saveGridSingleData);

    //取得跳窗頁面資料(用在跳窗選擇資料後可帶回資料到欄位)
    app.post('/api/selectGridData',middles, sgCrtl.selectGridData);


};

