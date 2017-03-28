/**
 * Created by Jun Chang on 2017/2/7.
 * 對照檔
 */
var setCrtl = require("../controllers/manageSetting");
var authMW = require("../middlewares/authMiddleware");
var hotelMW = require("../middlewares/hotelMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");

var middles = [i18nMW,authMW,hotelMW];


/* GET  page. */
module.exports = function(app  ) {

    //設定
    app.get('/manageSetting', middles, setCrtl.manageSetting);

    //設定檔
    app.get('/dataSetting/:prg_id', middles, setCrtl.dataSetting);

    //對照檔入口
    app.get('/mainSetUp/:prg_id', middles, setCrtl.mainSetUp);

    app.get('/dataGridSetUp/:prg_id', middles, setCrtl.dataGridSetUp);

    app.get('/gridSingleSetUp/:prg_id', middles, setCrtl.gridSingleSetUp);

    app.post('/api/dbTableLock',  setCrtl.dbTableLock);

    app.post('/api/dbTableUnLock', setCrtl.dbTableUnLock);


};

