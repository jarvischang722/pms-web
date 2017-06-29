var sysCrtl = require("../controllers/systemController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,sysMW];


/* GET  page. */
module.exports = function(app, passport ) {
    //首頁
    app.get('/', middles, sysCrtl.index);

    //主頁面
    app.get('/bacchus4web/:subsys_id', middles, sysCrtl.index);

    //系統別選擇
    app.get('/systemOption', sysCrtl.systemOption);

    //館別切換
    app.post('/changeHotelCod', sysCrtl.changeHotelCod);

    //前端插入資料資料庫api
    app.post('/api/execSQLProcess',sysCrtl.execSQLProcess);
};

