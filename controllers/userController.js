/**
 * Created by Jun Chang on 2016/12/30.
 * 帳號相關作業
 */
const authSvc = require("../services/AuthService");
const _ = require("underscore");
const async = require("async");
const roleFuncSvc = require("../services/RoleFuncService");
const queryAgent = require('../plugins/kplug-oracle/QueryAgent');
const commonRule = require("../ruleEngine/rules/CommonRule");
const langSvc = require("../services/LangService");
const fs = require("fs");
const ip = require("ip");
const SysFuncPurviewSvc = require("../services/SysFuncPurviewService");
const go_permissionSvc = require("../services/permissionService");
const go_userActionSvc = require("../services/userActionService");
const go_sysConf = require("../configs/systemConfig");
const passport = require('passport');
/**
 * 登入頁面
 */
exports.loginPage = async function (req, res) {
    if (req.session.user) {
        if (!_.isUndefined(req.session.activeSystem.id)) {
            res.redirect("/");
            return;
        }
        res.redirect("/systemOption");
        return;
    }

    try {
        if (_.isUndefined(req.params.athena_id)) {
            if (!_.isUndefined(req.cookies.athena_id) && !_.isUndefined(req.cookies.comp_cod)) {
                return res.redirect(`/${req.cookies.athena_id}/${req.cookies.comp_cod}/login`);
            } else if (!_.isUndefined(req.cookies.athena_id) && _.isUndefined(req.cookies.comp_cod)) {
                return res.redirect(`/${req.cookies.athena_id}/login`);
            }

            const lo_company = await commonRule.clusterQuery(req.session, {}, "QRY_SELECT_COMPANY");
            if (lo_company) {
                return res.redirect(`/${lo_company.athena_id}/${lo_company.cmp_id.trim()}/login`);
            }
        }
        else {
            if (!req.params.athena_id || _.isEmpty(req.params.athena_id)) {
                res.clearCookie("athena_id");
            }
            else {
                res.cookie("athena_id", req.params.athena_id, {maxAge: go_sysConf.sessionExpiredMS || 1000 * 60 * 60 * 3});
            }

            if (!req.params.comp_cod || _.isEmpty(req.params.comp_cod)) {
                res.clearCookie("comp_cod");
            }
            else {
                res.cookie("comp_cod", req.params.comp_cod, {maxAge: go_sysConf.sessionExpiredMS || 1000 * 60 * 60 * 3});
            }
            res.render('user/loginPage', {chkAthenaID: ""});
        }
    }
    catch (err) {
        console.error(err);
        res.render('user/loginPage', {chkAthenaID: "網址請輸入集團別"});
    }


    // try {
    //     async.waterfall([
    //         function (callback) {
    //             if (_.isUndefined(req.params.athena_id)) {
    //                 if (!_.isUndefined(req.cookies.athena_id) && !_.isUndefined(req.cookies.comp_cod)) {
    //                     return res.redirect(`/${req.cookies.athena_id}/${req.cookies.comp_cod}/login`);
    //                 } else if (!_.isUndefined(req.cookies.athena_id) && _.isUndefined(req.cookies.comp_cod)) {
    //                     return res.redirect(`/${req.cookies.athena_id}/login`);
    //                 }
    //                 queryAgent.query("QRY_SELECT_COMPANY", {}, function (err, company) {
    //                     if (err) {
    //                         return callback(err, 'done');
    //                     } else {
    //                         if (company) {
    //                             return res.redirect(`/${company.athena_id}/${company.cmp_id.trim()}/login`);
    //                         }
    //                     }
    //                     callback(null, 'done');
    //                 });
    //             }
    //             else {
    //                 if (!req.params.athena_id || _.isEmpty(req.params.athena_id)) {
    //                     res.clearCookie("athena_id");
    //                 }
    //                 else {
    //                     res.cookie("athena_id", req.params.athena_id, {maxAge: go_sysConf.sessionExpiredMS || 1000 * 60 * 60 * 3});
    //                 }
    //
    //                 if (!req.params.comp_cod || _.isEmpty(req.params.comp_cod)) {
    //                     res.clearCookie("comp_cod");
    //                 }
    //                 else {
    //                     res.cookie("comp_cod", req.params.comp_cod, {maxAge: go_sysConf.sessionExpiredMS || 1000 * 60 * 60 * 3});
    //                 }
    //
    //                 callback(null, 'done');
    //             }
    //         }
    //     ], function (err) {
    //
    //         res.render('user/loginPage');
    //     });
    //
    // }
    // catch (ex) {
    //     console.error(ex);
    //     res.render('user/loginPage');
    // }
};

/**
 * 取系統參數
 */
exports.getsysConfig = function (req, res) {
    res.json({sysConf: go_sysConf});
};

/**
 * 取預設帳號
 */
exports.getDefaultAccount = function (req, res) {
    let ls_account = "";
    let clientIP = req.body.ip;

    clientIP = clientIP.substr(clientIP.lastIndexOf(':') + 1);

    //判斷IP網段是否有對應的username
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
        res.json({account: ls_account});
    });

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
            req.session.athena_id = userInfo.athena_id;
            req.session.hotel_cod = userInfo.hotel_cod.trim();
            res.cookie("login_username", userInfo.usr_id, {maxAge: go_sysConf.sessionExpiredMS || 1000 * 60 * 60 * 3});
            res.cookie("login_comp_id", userInfo.cmp_id.trim(), {maxAge: go_sysConf.sessionExpiredMS || 1000 * 60 * 60 * 3});
            res.cookie("hotel_cod", req.session.hotel_cod, {signed: true});
        }

        res.json({
            success: !_.isNull(userInfo),
            errorCode: errorCode,
            errorMsg: _.isNull(err) || _.isUndefined(err.message) ? "" : err.message,
            user: userInfo
        });
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
        // delete req.cookies.usingSubsysID;
        // req.session.activeSystem.id = sys_id;
        // res.clearCookie("usingSubsysID");
        // res.clearCookie("usingPrgID");
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
                        if (!_.isUndefined(req.cookies.usingSubsysID) && req.cookies.usingSubsysID != "") {
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

    queryAgent.queryList("QRY_SELECT_COMPANY", {
        athena_id: req.cookies.athena_id,
        comp_cod: req.cookies.comp_cod
    }, 0, 0, function (err, getData) {

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
 * 抓取全部功能權限
 */
exports.getAllFuncs = function (req, res) {
    async.waterfall([
        getAllSystem,
        getUserSubsysPurviewBySysID
    ], function (err, result) {
        res.json({success: err == null, errMsg: err, funcList: result});
    });

    function getAllSystem(cb) {
        SysFuncPurviewSvc.getAllSystem(req.body, req.session, function (err, sysList) {
            cb(err, sysList);
        });
    }

    function getUserSubsysPurviewBySysID(sysList, cb) {
        let ln_counter = 0;
        req.body.remove = true;
        _.each(sysList, function (lo_sysList) {
            let ls_sysID = lo_sysList.sys_id;
            SysFuncPurviewSvc.getUserSubsysPurviewBySysID(req, ls_sysID, function (err, subsysMenu) {
                ln_counter++;
                lo_sysList.subSys = subsysMenu;
                if (ln_counter == sysList.length) {
                    cb(err, sysList);
                }
            });
        });
    }
};

/**
 * 抓取單一角色對應的功能權限
 */
exports.getFuncsOfRole = function (req, res) {
    let lo_userInfo = req.session.user;
    let lo_params = {};
    if (req.body.role_id) {
        lo_params.user_athena_id = lo_userInfo.athena_id;
        lo_params.user_comp_cod = lo_userInfo.cmp_id;
        lo_params.role_id = req.body.role_id;
        lo_params.athena_id = lo_userInfo.athena_id;
        lo_params.func_hotel_cod = lo_userInfo.fun_hotel_cod;
    }

    queryAgent.queryList("QRY_BAC_SYS_MODULE_BY_USER", lo_params, 0, 0, function (err, funcsOfRole) {
        res.json({success: true, funcsOfRole: funcsOfRole});
    });
};

/**
 * 取得作業每顆按鈕func_id的權限
 */
exports.getUserFuncPurviewByProID = async function (req, res) {

    try {
        let las_funcPurvs = await go_permissionSvc.getUserFuncPurviewByProID(req.session, req.body);
        res.json({success: true, funcPurvs: las_funcPurvs});
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

/**
 * 修改密碼
 */
exports.doEditPassword = function (req, res) {
    authSvc.doEditPassword(req, function (err, errorCode) {
        res.json({
            success: _.isNull(err),
            errorCode: errorCode,
            errorMsg: _.isNull(err) || _.isUndefined(err.message) ? "" : err.message
        });
    });
};

/**
 * 記錄使用者動作func_id執行時間
 */
exports.saveFuncExecTime = (req, res) => {
    go_userActionSvc.doSaveFuncExecTime(req, function (err) {
        res.json({success: err == null, errorMsg: err});
    })
};