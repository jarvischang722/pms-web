/**
 * Created by Jun Chang on 2016/12/30.
 * 會員驗證相關作業
 */

var authSvc = require("../services/AuthService");
var _ = require("underscore");
var async = require("async");
var roleFuncSvc = require("../services/RoleFuncService");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var i18n = require('i18n');
var langSvc = require("../services/LangService");

/**
 * 登入頁面
 */
exports.loginPage = function (req, res, next) {
    if (req.session.user) {
        if (!_.isUndefined(req.session.user.sys_id)) {
            res.redirect("/");
            return;
        }
        res.redirect("/systemOption");
        return;

    }

    res.render('user/loginPage');
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

        res.json({success: !_.isNull(userInfo), errorCode: errorCode, errorMsg: "", user: userInfo});
    });

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
    let sys_id = req.body["sys_id"] || "";
    if (!_.isUndefined(req.session.user.sys_id) && !_.isEqual(sys_id, req.session.user.sys_id)) {
        delete  req.cookies.usingSubsysID;
        req.session.user.sys_id = sys_id;
        res.clearCookie("usingSubsysID");
        res.clearCookie("usingPrgID");
    }
    try {
        if (!_.isEmpty(sys_id)) {
            var params = {
                user_comp_cod: req.session.user.cmp_id.trim(),
                user_id: req.session.user.usr_id,
                fun_comp_cod: req.session.user.cmp_id.trim(),
                fun_hotel_cod: req.session.user.fun_hotel_cod
            };
            queryAgent.queryList("QUY_ROLE_USER_USE_SYSTEM", params, 0, 0, function (err, sysRows) {
                var sysObj = _.findWhere(sysRows, {sys_id: sys_id}) || {};
                req.session.user.sys_id = sysObj.sys_id;
                langSvc.handleMultiLangContentByField("lang_s99_system", 'sys_name', '', function (err, sysLang) {
                    sysLang = _.where(sysLang, {sys_id: req.session.user.sys_id});
                    _.each(sysLang, function (sys) {
                        req.session.user["sys_name_" + sys.locale] = sys.words;
                    });
                    roleFuncSvc.updateUserPurview(req, function (err) {
                        var usingSubsysID = req.session.user.subsysMenu.length > 0 ? req.session.user.subsysMenu[0].subsys_id : "";
                        if (!_.isUndefined(req.cookies.usingSubsysID)) {
                            usingSubsysID = req.cookies.usingSubsysID;
                        }
                        res.cookie('usingSubsysID', usingSubsysID);
                        // res.redirect("/bacchus4web/" + usingSubsysID);
                        res.json({success: true, subsysPage: "/bacchus4web/" + usingSubsysID});
                    });
                });
            });
        } else {
            res.send("Not found system!");
        }

    } catch (err) {
        res.send(err);
    }
};

/**
 * 取得使用者可使用功能權限
 */
exports.getUserSubsys = function (req, res) {
    if (req.session.user) {
        res.json({success: true, subsysMenu: req.session.user.subsysMenu || []});
    } else {
        res.json({success: true, errorMsg: '未登入', subsysMenu: []});
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
        res.json({success: _.isNull(err), errorMsg: err, quickMenu: quickMenu});
    });
};


/**
 * 取得選擇的公司
 */
exports.getSelectCompony = function (req, res) {
    queryAgent.queryList("QRY_SELECT_COMPANY", {}, 0, 0, function (err, getData) {
        if (err) {
            res.json({success: false, errorMsg: err});
        }
        else {
            res.json({success: true, selectCompany: getData});
        }
    });
}

/**
 * 取得使用者資料
 */
exports.getUserInfo = function (req, res) {
    res.json({success: !_.isUndefined(req.session.user), errorMsg: 'not login!', userInfo: req.session.user});
};
/**
 * 新增 角色權限(靜態)
 */
exports.getAuthorityRole = function (req, res) {
    res.render("user/authorityRole");
};
/**
 * 新增 人員權限(靜態)
 */
exports.getAuthorityStaff = function (req, res) {
    res.render("user/authorityStaff");
};
/**
 * 新增 功能權限(靜態)
 */
exports.getAuthorityFeature = function (req, res) {
    res.render("user/authorityFeature");
};


/**
 *  經由公司代號 cmp_id 取得部門資訊
 */
exports.getCompGrp = function (req, res) {
    queryAgent.queryList("QRY_S99_GROUP_BY_CMP_ID", req.session.user, 0, 0, function (err, compGrpList) {
        res.json({success: true, compGrpList: compGrpList});
    });
};

/**
 * 抓取全部角色
 */
exports.getAllRoles = function (req, res) {
    queryAgent.queryList("QRY_ALL_ROLE_BY_COMP_COD", req.session.user, 0, 0, function (err, roles) {
        res.json({success: true, roles: roles});
    });
};

/**
 *抓取單一角色全部對應的帳號
 */
exports.getRoleOfAccounts = function (req, res) {
    var params = req.session.user;
    if (req.body.role_id) {
        params["role_id"] = req.body.role_id;
    }
    queryAgent.queryList("QRY_ROLE_OF_ACCOUNTS", params, 0, 0, function (err, accounts) {
        res.json({success: true, accounts: accounts});
    });
};