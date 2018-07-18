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

    //button功能規則
    app.post('/api/chkPrgFuncRule', apiMiddles, ruleCrtl.chkPrgFuncRule);

    //dt欄位規則檢查
    app.post('/api/chkDtFieldRule', apiMiddles, ruleCrtl.chkDtFieldRule);

    //dg select click 規則檢查
    app.post('/api/chkDgSelectClickRule', apiMiddles, ruleCrtl.chkDgSelectClickRule);

    //dg selectgrid 搜尋時規則檢查
    app.post('/api/chkDgSelectgridQryRule', apiMiddles, ruleCrtl.chkDgSelectgridQryRule);

    //新增功能規則
    app.post('/api/addFuncRule', apiMiddles, ruleCrtl.addFuncRule);

    //編輯功能規則
    app.post('/api/editFuncRule', apiMiddles, ruleCrtl.editFuncRule);

    //刪除功能規則
    app.post('/api/deleteFuncRule', apiMiddles, ruleCrtl.deleteFuncRule);

    //透過規則取資料
    app.post('/api/queryDataByRule', apiMiddles, ruleCrtl.queryDataByRule);

    //透過規則取下拉資料
    app.post('/api/chkSelectOptionRule', apiMiddles, ruleCrtl.chkSelectOptionRule);

    //取得回復房間名稱與簡稱
    app.post('/api/revertRoomNam', apiMiddles, ruleCrtl.revertRoomNam);

    app.post('/api/revertRoomSna', apiMiddles, ruleCrtl.revertRoomSna);

    app.all("/api/getSelectOptions", ruleCrtl.getSelectOptions);

};

