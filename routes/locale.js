/**
 * Created by Jun on 2017/4/26.
 * 多語系Route
 */
var langCrtl = require("../controllers/langController");
var authMW = require("../middlewares/authMiddleware");
var hotelMW = require("../middlewares/hotelMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,hotelMW];


/* GET  page. */
module.exports = function(app ) {

    //一個欄位全語系的內容
    app.post('/api/fieldAllLocaleContent', langCrtl.fieldAllLocaleContent);

    //全部多語欄位資料
    app.post('/api/multiLangFieldContentByKey', langCrtl.multiLangFieldContentByKey);

};