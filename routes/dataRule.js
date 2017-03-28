/**
 * Created by Jun on 2017/3/7.
 */
var ruleCrtl = require("../controllers/dataRuleController");
var authMW = require("../middlewares/authMiddleware");
var hotelMW = require("../middlewares/hotelMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,hotelMW];

module.exports = function(app ) {

    //欄位規則檢查
    app.post('/api/chkFieldRule',middles, ruleCrtl.chkFieldRule);

    //新增功能規則
    app.post('/api/addFuncRule',middles, ruleCrtl.addFuncRule);

    //編輯功能規則
    app.post('/api/editFuncRule',middles, ruleCrtl.editFuncRule);

    //刪除功能規則
    app.post('/api/deleteFuncRule',middles, ruleCrtl.deleteFuncRule);

};

