var authMW = require("../middlewares/authMiddleware");
var businessCrtl = require("../controllers/businessController");
var i18nMW = require("../middlewares/i18nMiddleware");

var middles = [authMW, i18nMW];
var middles2 = [i18nMW];
module.exports = function (app, passport) {



    //新增 角色權限
    app.get('/authorityRole', businessCrtl.getAuthorityRole);

    //新增 人員權限
    app.get('/authorityStaff', businessCrtl.getAuthorityStaff);

    //訂房確認書 email
    app.get('/reservationCheckMail', businessCrtl.getReservationCheckMail);

    //假日日期設定
    app.get('/holidayDateSet', businessCrtl.getHolidayDateSet);

    //商務公司資料編輯
    app.get('/businessCompanyData', businessCrtl.getBusinessCompanyData);

    //業務員資料編輯(業務→業務員設定作業→業務員資料維護)
    app.get('/clerkDataDefend', businessCrtl.getClerkDataDefend);

    //首頁 依房型訂房
    app.get('/reservationRoomType', businessCrtl.getReservationRoomType);

};

