/**
 * Created by Jun on 2017/3/7.
 */
var ruleCrtl = require("../controllers/dataRuleController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];
var apiMiddles = [authMW];

module.exports = function (app) {

    //欄位規則檢查
    app.post('/api/chkFieldRule', apiMiddles, ruleCrtl.chkFieldRule);

    //dt欄位規則檢查
    app.post('/api/chkDtFieldRule', apiMiddles, ruleCrtl.chkDtFieldRule);

    //新增功能規則
    app.post('/api/addFuncRule', apiMiddles, ruleCrtl.addFuncRule);

    //編輯功能規則
    app.post('/api/editFuncRule', apiMiddles, ruleCrtl.editFuncRule);

    //刪除功能規則
    app.post('/api/deleteFuncRule', apiMiddles, ruleCrtl.deleteFuncRule);

    //取得回復房間名稱與簡稱
    app.post('/api/revertRoomNam', apiMiddles, ruleCrtl.revertRoomNam);

    app.post('/api/revertRoomSna', apiMiddles, ruleCrtl.revertRoomSna);

    app.all("/api/getSelectOptions",  ruleCrtl.getSelectOptions);
};

