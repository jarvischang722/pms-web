/**
 * Created by jing on 2017/5/24.
 */

var salesCrtl = require("../controllers/salesController");
var authMW = require("../middlewares/authMiddleware");
var hotelMW = require("../middlewares/hotelMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,hotelMW];

/* GET  page. */
module.exports = function(app  ) {


    //商務公司資料編輯
    app.get('/sales/PMS0610010', salesCrtl.getPMS0610010);

    //業務員資料編輯(業務→業務員設定作業→業務員資料維護)
    app.get('/sales/PMS0620010', salesCrtl.getPMS0620010);

    //業務 拜訪計畫
    app.get('/sales/PMS0620040', salesCrtl.getPMS0620040);

    //業務 拜訪紀錄
    app.get('/sales/PMS0620050', salesCrtl.getPMS0620050);


};