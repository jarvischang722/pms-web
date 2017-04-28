var authMW = require("../middlewares/authMiddleware");
var userCrtl = require("../controllers/userController");
var i18nMW = require("../middlewares/i18nMiddleware");

var middles = [authMW, i18nMW];
var middles2 = [i18nMW];
module.exports = function (app, passport) {


    //登入頁面
    app.get('/login', middles2, userCrtl.loginPage);

    app.get('/casLogin', userCrtl.casLogin);


    /** API  **/

    //驗證是否登入成功
    app.post('/api/authLogin', userCrtl.authLogin);

    //取得使用者資料
    app.post('/api/getUserInfo', userCrtl.getUserInfo);

    //登出
    app.post('/cas/logout', userCrtl.logout);

    //選擇系統別
    app.post('/api/selectSystem', userCrtl.selectSystem);

    //取得使用者子系統權限
    app.post('/api/getUserSubsys', userCrtl.getUserSubsys);


    //取得QuickMenu
    app.post('/api/getSubsysQuickMenu', userCrtl.getSubsysQuickMenu);

    //新增 角色權限
    app.get('/authorityRole', userCrtl.getAuthorityRole);

    //新增 人員權限
    app.get('/authorityStaff', userCrtl.getAuthorityStaff);

    //訂房確認書 email
    app.get('/reservationCheckMail', userCrtl.getReservationCheckMail);

    //假日日期設定
    app.get('/holidayDateSet', userCrtl.getHolidayDateSet);

    //商務公司資料編輯
    app.get('/businessCompanyData', userCrtl.getBusinessCompanyData);

    //業務員資料編輯(業務→業務員設定作業→業務員資料維護)
    app.get('/clerkDataDefend', userCrtl.getClerkDataDefend);
};

