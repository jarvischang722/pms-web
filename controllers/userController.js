/**
 * Created by Jun Chang on 2016/12/30.
 * 帳號相關作業
 */
const authSvc = require("../services/AuthService");
const _ = require("underscore");
const async = require("async");
const roleFuncSvc = require("../services/RoleFuncService");
const queryAgent = require('../plugins/kplug-oracle/QueryAgent');
const langSvc = require("../services/LangService");
const fs = require("fs");
const ip = require("ip");
const SysFuncPurviewSvc = require("../services/SysFuncPurviewService");

/**
 * 登入頁面
 */
exports.loginPage = function (req, res) {
    if (req.session.user) {
        if (!_.isUndefined(req.session.activeSystem.id)) {
            res.redirect("/");
            return;
        }
        res.redirect("/systemOption");
        return;
    }
    let ls_account = "";
    let clientIP = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    clientIP = clientIP.substr(clientIP.lastIndexOf(':') + 1);
    try {
        fs.exists("configs/IPsUsersRef.json", function (isExist) {
            if (isExist) {
                let IPsUsersRef = require("../configs/IPsUsersRef.json");

                _.each(IPsUsersRef.ipObj, function (user, ipSubnet) {
                    if (ipSubnet.toString().indexOf("/") > -1) {
                        if (ip.cidrSubnet(ipSubnet).contains(clientIP)) {
                            ls_account = user.toString();
                        }
                    } else {
                        if (_.isEqual(ipSubnet, clientIP)) {
                            ls_account = user.toString();
                        }
                    }
                });
            }
            res.render('user/loginPage', {account: ls_account});
        });
    }
    catch (ex) {
        res.render('user/loginPage', {account: ls_account});
    }
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
    if (!_.isUndefined(req.session.activeSystem.id) && !_.isEqual(sys_id, req.session.activeSystem.id)) {
        delete req.cookies.usingSubsysID;
        req.session.activeSystem.id = sys_id;
        res.clearCookie("usingSubsysID");
        res.clearCookie("usingPrgID");
    }
    try {
        if (!_.isEmpty(sys_id)) {
            let params = {
                user_comp_cod: req.session.user.cmp_id.trim(),
                user_id: req.session.user.usr_id,
                fun_comp_cod: req.session.user.cmp_id.trim(),
                fun_hotel_cod: req.session.user.fun_hotel_cod
            };
            queryAgent.queryList("QUY_ROLE_USER_USE_SYSTEM", params, 0, 0, function (err, sysRows) {
                let sysObj = _.findWhere(sysRows, {sys_id: sys_id}) || {};
                req.session.activeSystem.id = sysObj.sys_id;
                langSvc.handleMultiLangContentByField("lang_s99_system", 'sys_name', '', function (err, sysLang) {
                    sysLang = _.where(sysLang, {sys_id: req.session.activeSystem.id});
                    _.each(sysLang, function (sys) {
                        let ls_sysAbbrName = ""; //縮寫
                        req.session.activeSystem["name_" + sys.locale] = sys.words;
                        if (sys.locale == 'en') {
                            sys.words.split(" ").forEach(function (s) {
                                ls_sysAbbrName += s.substring(0, 1);
                            });
                            req.session.activeSystem.abbrName = ls_sysAbbrName;
                        }
                    });

                    roleFuncSvc.updateUserPurview(req, function (err) {
                        let usingSubsysID = req.session.user.subsysMenu.length > 0 ? req.session.user.subsysMenu[0].subsys_id : "";
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
        res.json({
            success: true,
            subsysMenu: req.session.user.subsysMenu || [],
            activeSystem: req.session.activeSystem
        });
    }
    else {
        res.json({success: true, errorMsg: '未登入', subsysMenu: []});
    }
};

/**
 * 獲取子系統快選單
 */
exports.getSubsysQuickMenu = function (req, res) {
    let params = {
        user_comp_cod: req.session.user.cmp_id.trim(),
        user_id: req.session.user.usr_id,
        sys_id: req.session.activeSystem.id,
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
};

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
    let params = req.session.user;
    if (req.body.role_id) {
        params["role_id"] = req.body.role_id;
    }
    queryAgent.queryList("QRY_ROLE_OF_ACCOUNTS", params, 0, 0, function (err, accounts) {
        res.json({success: true, accounts: accounts});
    });
};

/**
 * 取得作業每顆按鈕func_id的權限
 */
exports.getUserFuncPurviewByProID = function (req, res) {
    try {
        let params = {
            user_id: req.session.user.usr_id,
            comp_cod: req.session.user.cmp_id,
            athena_id: req.session.user.athena_id,
            hotel_cod: req.session.user.hotel_cod,
            prg_id: req.body.prg_id
        };
        async.parallel({
            funcPurvs: function (callback) {
                queryAgent.queryList("QRY_PROCESS_USER_FUNC_PURVIEW", params, 0, 0, function (err, funcPurvs) {
                    callback(err, funcPurvs);
                });
            },
            funcLangs: function (callback) {
                langSvc.handleMultiLangContentByKey("LANG_BAC_PROCESS_FUNC_RF", req.session.locale,
                    {pro_id: req.body.prg_id}, "func_nam", function (err, funcLangs) {
                        callback(err, funcLangs);
                    });
            }
        }, function (err, results) {

            let retnfuncPurvs = [];
            _.each(results.funcPurvs, function (func) {
                retnfuncPurvs.push({
                    func_id: func.current_id,
                    func_nam: _.findIndex(results.funcLangs, {func_id: func.current_id}) > -1
                        ? _.findWhere(results.funcLangs, {func_id: func.current_id}).words : func.current_id
                });
            });
            res.json({success: _.isNull(err), funcPurvs: retnfuncPurvs});
        });

    } catch (err) {
        res.json({success: false, errorMsg: err.message, funcPurvs: []});
    }

};


/**
 * 取得某一個系統的所有權限資料
 */
exports.userSubsysPurviewBySysID = function (req, res) {
    let ls_sysID = req.body.sys_id;
    SysFuncPurviewSvc.getUserSubsysPurviewBySysID(req, ls_sysID, function (err, subsysMenu) {
        res.json({success: err == null, subsysMenu});
    });
};