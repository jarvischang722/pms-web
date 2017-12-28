/**
 * Created by Jun on 2017/5/7.
 */
var systCrtl = require("../controllers/systemController");
const permissionCrtl = require("../controllers/permissionController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];

/* GET  page. */
module.exports = function (app) {
    app.get('/subsystem/reservation', middles, systCrtl.reservation);
    app.get('/subsystem/reception', middles, systCrtl.reception);
    app.get('/subsystem/cashier', middles, systCrtl.cashier);
    app.get('/subsystem/houseKeeping', middles, systCrtl.houseKeeping);
    app.get('/subsystem/nightAudit', middles, systCrtl.night_check);
    app.get('/subsystem/sales', middles, systCrtl.sales);
    app.get('/subsystem/report', middles, systCrtl.report);
    app.get('/subsystem/setup', middles, systCrtl.setup);
    app.get('/subsystem/ownMenu', middles, systCrtl.ownMenu);
    app.get('/subsystem/common', middles, systCrtl.commom);

    /** **/
    app.post('/api/getGroupMdlPros', middles, systCrtl.getGroupMdlPros);
    app.post("/api/uploadFile", middles, systCrtl.uploadFile);

    /** 取得異動紀錄　**/
    app.post("/api/getSetupPrgChangeLog", middles, systCrtl.getSetupPrgChangeLog);
    /** 取得Session 過期時間　**/
    app.post("/api/getSessionExpireTime", systCrtl.getSessionExpireTime);

    //權限設定
    app.get('/sys/permissionSetup', middles, systCrtl.permissionSetup);

    app.post("/api/saveAuthByRole", middles, permissionCrtl.saveAuthByRole);
    app.post("/api/qryRoleByUserID", middles, permissionCrtl.qryRoleByUserID);

};