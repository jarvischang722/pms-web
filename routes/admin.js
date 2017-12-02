/**
 * Created by jing on 2017/11/25.
 */

var adminCrtl = require("../controllers/adminController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];
var apiMiddles = [authMW];


module.exports = function (app) {

    // 設定欄位寬度的屬性
    app.get('/prgPropsSetup', middles, adminCrtl.prgPropsSetup);
    app.post('/api/admin/getProgramPropsByPrgID', apiMiddles, adminCrtl.getProgramPropsByPrgID);
    app.post('/api/admin/handleCollSave', apiMiddles, adminCrtl.handleCollSave);

};