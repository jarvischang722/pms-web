/**
 * Created by Jun on 2017/5/7.
 */
var operCtrl = require("../controllers/operationController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,sysMW];
var apiMiddles = [authMW];

/* GET  page. */
module.exports = function(app  ) {
    /** 作業儲存 **/
    app.post("/api/doOperationSave", apiMiddles, operCtrl.doOperationSave);

    app.post("/api/fetchDataGridFieldData", apiMiddles, operCtrl.fetchDataGridFieldData);
};