/**
 * Created by jing on 2017/5/24.
 */

var salesCrtl = require("../controllers/salesController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW, authMW, sysMW];
var apiMiddles = [authMW];
/* GET  page. */
module.exports = function (app) {


    //商務公司資料編輯
    app.get('/sales/PMS0610010', middles, salesCrtl.getPMS0610010);

    //業務員資料編輯(業務→業務員設定作業→業務員資料維護)
    app.get('/sales/PMS0620010', middles, salesCrtl.getPMS0620010);

    //業務 拜訪計畫
    app.get('/sales/PMS0620040', middles, salesCrtl.getPMS0620040);

    //業務 拜訪紀錄
    app.get('/sales/PMS0620050', middles, salesCrtl.getPMS0620050);

    //[PMS0860060_業務員組別設定] 取得業務員多筆
    app.post("/api/sales/qrySalesMn", apiMiddles, salesCrtl.qrySalesMn);

    //[PMS0620020_業務員資料編輯] 取得業務員單筆欄位
    app.post("/api/sales/qrySingleGridFieldData_PM0620020", apiMiddles, salesCrtl.qrySingleGridFieldData_PM0620020);

    //[PMS0620020_業務員資料編輯] 取得業務員單筆資料
    app.post("/api/sales/qrySalesMn_PM0620020", apiMiddles, salesCrtl.qrySalesMn_PM0620020);

    //[PMS0620020_業務員] 新增按鈕規則驗證
    app.post("/api/sales/addFuncRule_PMS0620020", apiMiddles, salesCrtl.addFuncRule_PMS0620020);

    app.post("api/sales/qryTreeSelectData", apiMiddles, salesCrtl.qryTreeSelectData);

};