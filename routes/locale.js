/**
 * Created by Jun on 2017/4/26.
 * 多語系Route
 */
var langCrtl = require("../controllers/langController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];
var apiMiddles = [authMW];


/* GET  page. */
module.exports = function (app) {

    //一個欄位全語系的內容
    app.post('/api/fieldAllLocaleContent', apiMiddles, langCrtl.fieldAllLocaleContent);

    //全部多語欄位資料
    app.post('/api/multiLangFieldContentByKey', apiMiddles, langCrtl.multiLangFieldContentByKey);

    //取得i18n 語系對應檔內容
    app.post('/api/getLocaleContent', langCrtl.getLocaleContent);

};