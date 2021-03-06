/**
 * Created by Jun Chang on 2017/2/7.
 * 對照檔
 */
var setCrtl = require("../controllers/manageSetting");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];
var apiMiddles = [authMW];

/* GET  page. */
module.exports = function (app) {

    //設定
    //app.get('/manageSetting', middles, setCrtl.manageSetting);

    //設定檔
    app.get('/dataSetting/:prg_id', middles, setCrtl.dataSetting);

    //對照檔入口
    app.get('/mainSetUp/:prg_id', middles, setCrtl.mainSetUp);

    app.get('/dataGridSetUp/:prg_id', middles, setCrtl.dataGridSetUp);

    app.get('/gridSingleSetUp/:prg_id', middles, setCrtl.gridSingleSetUp);

    app.get('/specialSetUp/:prg_id', middles, setCrtl.specialSetUp);

    app.post('/api/dbTableLock', apiMiddles, setCrtl.dbTableLock);

    app.post('/api/dbTableUnLock', apiMiddles, setCrtl.dbTableUnLock);


};

