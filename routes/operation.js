/**
 * Created by Jun on 2017/5/7.
 */
var operCtrl = require("../controllers/operationController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];
var apiMiddles = [authMW];

/* GET  page. */
module.exports = function (app) {
    /** 作業儲存 **/
    app.post("/api/doOperationSave", apiMiddles, operCtrl.doOperationSave);

    /**
     * 作業新儲存格式
     */
    app.post("/api/execNewFormatSQL", apiMiddles, operCtrl.execNewFormatSQL);

    /**
     * (作業)查詢多筆欄位
     */
    app.post("/api/fetchDataGridFieldData", apiMiddles, operCtrl.fetchDgFieldData);

    /**
     * (作業)查詢單筆欄位
     */
    app.post("/api/fetchSinglePageFieldData", apiMiddles, operCtrl.fetchGsFieldData);

    /**
     * 取作業(只有)搜尋欄位資料
     */
    app.post("/api/fetchOnlySearchFieldsData", apiMiddles, operCtrl.fetchOnlySearchFieldsData);
    /**
     * (作業)查詢(只有)多筆欄位
     */
    app.post("/api/fetchOnlyDataGridFieldData", apiMiddles, operCtrl.fetchOnlyDgFieldData);

    /**
     * (作業)查詢(只有)單筆欄位
     */
    app.post("/api/fetchOnlySinglePageFieldData", apiMiddles, operCtrl.fetchOnlyGsFieldData);

    /**
     * (作業)查詢預設單筆資料
     */
    app.post("/api/fetchDefaultSingleRowData", apiMiddles, operCtrl.fetchDefaultGsRowData);

    /**
     * (作業) 查詢多筆資料
     */
    app.post("/api/fetchDgRowData", apiMiddles, operCtrl.fetchDgRowData);
};