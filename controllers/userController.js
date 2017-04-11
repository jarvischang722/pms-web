/**
 * Created by Jun Chang on 2016/12/30.
 * 會員驗證相關作業
 */

var authSvc = require("../services/authService");
var _ = require("underscore");
var async = require("async");
var roleFuncSvc = require("../services/roleFuncService");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var i18n = require('i18n');


/**
 * 登入頁面
 */
exports.loginPage = function (req, res, next) {

    if (req.session.user) {
        if (!_.isUndefined(req.session.user.sys_id)) {
            res.redirect("/");
            return;
        } else {
            res.redirect("/systemOption");
            return
        }
    }

    res.render("user/loginPage");
};


/**
 * casLogin
 */
exports.casLogin = function (req, res, next) {
    passport.authenticate('cas', function (err, user, info) {
        if (err) {
            return next(err);
        }

        if (!user) {
            req.session.messages = info.message;
            return res.redirect('/');
        }

        req.logIn(user, function (err) {
            if (err) {
                return next(err);
            }

            req.session.messages = '';
            return res.redirect('/');
        });
    })(req, res, next);
};

/**
 * 登入API
 */
exports.authLogin = function (req, res) {


    authSvc.doAuthAccount(req.body, function (err, errorCode, userInfo) {

        if (!err && userInfo) {
            req.session.user = userInfo;

        }

        res.json({success: !_.isNull(userInfo), errorCode: errorCode, errorMsg: "", user: userInfo})
    })

};

/**
 * 登出
 */
exports.logout = function (req, res) {
    req.session.user = null;
    res.json({success: true});
};

/**
 * 選擇系統別
 */
exports.selectSystem = function (req, res) {
    var sys_id = req.body["sys_id"] || "";
    try {
        if (!_.isEmpty(sys_id)) {
            var params = {
                user_comp_cod: req.session.user.cmp_id.trim(),
                user_id: req.session.user.usr_id,
                fun_comp_cod: req.session.user.cmp_id.trim(),
                fun_hotel_cod: req.session.user.fun_hotel_cod
            };
            queryAgent.queryList("QUY_ROLE_USER_USE_SYSTEM", params, 0, 0, function (err, sysRows) {
                var sysObj = _.findWhere(sysRows, {sys_id: sys_id}) || {}

                req.session.user.sys_id = sysObj.sys_id;
                req.session.user.sys_name_en = sysObj["sys_name_en"];
                req.session.user.sys_name_zh_tw = sysObj["sys_name_zh_tw"];
                roleFuncSvc.updateUserPurview(req, function (err) {
                    res.json({success: err == null, errorMsg: err});
                });

            })
        } else {
            res.json({success: false, errorMsg: '未選擇系統別'});
        }

    } catch (err) {
        res.json({success: false, errorMsg: err});
    }
};

/**
 * 取得使用者可使用功能權限
 */
exports.getUserSubsys = function (req, res) {
    if (req.session.user) {
        res.json({success: true, subsysGrp: req.session.user.subsysGrp || []});
    } else {
        res.json({success: true, errorMsg: '未登入', subsysGrp: []});
    }
};

/**
 * 獲取子系統快選單
 */
exports.getSubsysQuickMenu = function (req, res) {
    var params = {
        user_comp_cod: req.session.user.cmp_id.trim(),
        user_id: req.session.user.usr_id,
        sys_id: req.session.user.sys_id,
        fun_hotel_cod: req.session.user.fun_hotel_cod,
        subsys_id: req.body["subsys_id"]
    };
    roleFuncSvc.querySubsysQuickMenu(params, function (err, quickMenu) {
        res.json({success: _.isNull(err), errorMsg: err, quickMenu: quickMenu})
    });
};

/**
 * 取得使用者資料
 */
exports.getUserInfo = function (req, res) {
    res.json({success: !_.isUndefined(req.session.user), errorMsg: 'not login!', userInfo: req.session.user});
};

//新增 角色權限
exports.getAuthorityRole = function (req, res) {
    res.render("user/authorityRole");
};
//新增 人員權限
exports.getAuthorityStaff = function (req, res) {
    res.render("user/authorityStaff");
};
//訂房確認書 email
exports.getReservationCheckMail = function (req, res) {
    res.render("user/reservationCheckMail");
};
//假日日期設定
exports.getHolidayDateSet = function (req, res) {
    res.render("user/holidayDateSet");
};