var authMW = require("../middlewares/authMiddleware");
var userCrtl = require("../controllers/userController");
var i18nMW = require("../middlewares/i18nMiddleware");

var middles = [authMW, i18nMW];
var middles2 = [i18nMW];
var apiMiddles = [authMW];
module.exports = function (app, passport) {


    //登入頁面
    app.get('/login', middles2, userCrtl.loginPage);

    app.get('/casLogin', userCrtl.casLogin);


    /** API  **/

    //驗證是否登入成功
    app.post('/api/authLogin', userCrtl.authLogin);
    //取得使用者資料
    app.post('/api/getUserInfo', apiMiddles, userCrtl.getUserInfo);
    //登出
    app.post('/cas/logout', userCrtl.logout);
    //選擇系統別
    app.post('/api/selectSystem', userCrtl.selectSystem);
    //取得使用者子系統權限
    app.post('/api/getUserSubsys', apiMiddles, userCrtl.getUserSubsys);
    //取得公司選項
    app.post('/api/getSelectCompany', userCrtl.getSelectCompony);
    //取得QuickMenu
    app.post('/api/getSubsysQuickMenu', apiMiddles, userCrtl.getSubsysQuickMenu);
    //新增 角色權限(靜態)
    app.get('/authorityRole', userCrtl.getAuthorityRole);
    //新增 人員權限(靜態)
    app.get('/authorityStaff', userCrtl.getAuthorityStaff);
    //新增 功能權限(靜態)
    app.get('/authorityFeature', userCrtl.getAuthorityFeature);
    // 經由公司代號 cmp_id 取得部門資訊
    app.post('/api/getCompGrp', apiMiddles, userCrtl.getCompGrp);
    //取得全部角色
    app.post('/api/getAllRoles', apiMiddles, userCrtl.getAllRoles);
    //取得角色對應全部的帳號
    app.post('/api/getRoleOfAccounts', apiMiddles, userCrtl.getRoleOfAccounts);
    //取得作業每顆按鈕func_id的權限
    app.post('/api/getUserFuncPurviewByProID', apiMiddles, userCrtl.getUserFuncPurviewByProID);
    //取得某一個系統的所有權限資料
    app.post('/api/userSubsysPurviewBySysID', apiMiddles, userCrtl.userSubsysPurviewBySysID);
    //新增 修改密碼(靜態)
    app.get('/editPassword', userCrtl.getEditPassword);
};

