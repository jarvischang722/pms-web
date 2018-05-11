/**
 * Created by Jun on 2017/12/03.
 * 系統功能權限
 */
const _ = require("underscore");
const async = require("async");
const alasql = require("alasql");
const queryAgent = require("../plugins/kplug-oracle/QueryAgent");
const langSvc = require("../services/LangService");

/**
 * 取得使用者可使用的系統權限
 * @param req
 * @param callback
 */
exports.getUserAllowSystem = function (req, callback) {
    let la_locales = _.pluck(req.cookies.sys_locales, "lang");
    let lo_params = {
        user_comp_cod: req.session.user.cmp_id.trim(),
        user_id: req.session.user.usr_id,
        fun_comp_cod: req.session.user.cmp_id.trim(),
        fun_hotel_cod: req.session.user.fun_hotel_cod
    };

    queryAgent.queryList("QUY_ROLE_USER_USE_SYSTEM", lo_params, 0, 0, function (err, sysRows) {
        langSvc.handleMultiLangContentByField("lang_s99_system", "sys_name", "", function (err, sysLang) {
            _.each(sysRows, function (sys, sIdx) {
                let allLangForSys = _.where(sysLang, {sys_id: sys.sys_id});
                _.each(la_locales, function (locale) {
                    let sys_name = "";
                    let tmp = _.findWhere(allLangForSys, {locale: locale});
                    if (!_.isUndefined(tmp)) {
                        sys_name = tmp.words;
                    }
                    sysRows[sIdx]["sys_name_" + locale] = sys_name;
                });
            });
            callback(err, sysRows);
        });

    });
};


/**
 * 取得子系統內的所有功能權限
 * @param req
 * @param sysID
 * @param callback
 */
exports.getUserSubsysPurviewBySysID = function (req, sysID, callback) {
    let userInfo = req.session.user;
    let ls_sys_id = sysID;
    let la_locales = req.cookies.sys_locales || [];
    let ls_locale = req.session.locale;
    let lo_params = {
        user_athena_id: userInfo.user_athena_id,
        user_comp_cod: userInfo.cmp_id.trim(),
        user_id: userInfo.usr_id,
        athena_id: userInfo.athena_id,
        hotel_cod: userInfo.hotel_cod,
        func_hotel_cod: userInfo.fun_hotel_cod.trim()
    };

    let la_allMdlProList = []; // 全部作業
    let la_allMenuList = []; // 全部Menu
    let lao_subsysList = []; //全部子系統
    let lao_mdlLangList = []; //模組多語系
    let lao_proLangList = []; //作業多語系
    async.series([
        //使用者所有的功能
        function (callback) {
            queryAgent.queryList("QRY_BAC_SYS_MODULE_BY_USER", lo_params, 0, 0, function (err, menuList) {
                if (err) {
                    menuList = [];
                }

                menuList = _.where(menuList, {
                    menu_athena_id: req.session.user.athena_id,
                    func_comp_cod: req.session.user.cmp_id.trim(),
                    func_hotel_cod: req.session.user.fun_hotel_cod.trim()
                });

                la_allMenuList = _.uniq(menuList, function (lo_allMenuSubSys) {
                    return lo_allMenuSubSys.current_id;
                });

                callback(err, menuList);
            });
        },
        //找出系統全部子系統
        function (callback) {

            let la_allMenuSubSys = _.uniq(_.where(la_allMenuList, {
                pre_id: ls_sys_id,
                id_typ: "SUBSYS"
            }, function (lo_allMenuSubSys) {
                return lo_allMenuSubSys.current_id;
            }));

            queryAgent.queryList("QRY_BAC_SUBSYSTEM_BY_SYS_ID", {sys_id: ls_sys_id}, 0, 0, function (err, subsysList) {
                lao_subsysList = alasql("select subsys.*, meun_sub_sys.sort_cod " +
                    "from  ? subsys  " +
                    "inner join ? meun_sub_sys  on meun_sub_sys.current_id = subsys.subsys_id " +
                    "order by meun_sub_sys.sort_cod"
                    , [subsysList, la_allMenuSubSys]);

                langSvc.handleMultiLangContentByField("lang_bac_subsysmenu_rf", "subsys_nam", "", function (err, langContent) {
                    _.each(lao_subsysList, function (subsys, sysIdx) {
                        _.each(la_locales, function (locale) {
                            let lo_subsysLang = _.findWhere(langContent, {
                                subsys_id: subsys.subsys_id,
                                locale: locale.lang
                            });
                            lao_subsysList[sysIdx]["subsys_nam_" + locale.lang] = lo_subsysLang ? lo_subsysLang.words : "";
                        });
                    });

                    callback(err, null);
                });
            });
        },
        //找出模組作業的多語系
        function (callback) {
            async.parallel({
                proLangList: function (callback) {
                    langSvc.handleMultiLangContentByField("lang_s99_process", "pro_name", "", function (err, proLangList) {
                        callback(err, proLangList);
                    });
                },
                mdlLangList: function (callback) {
                    langSvc.handleMultiLangContentByField("lang_s99_model", "mdl_name", "", function (err, mdlLangList) {
                        callback(err, mdlLangList);
                    });
                }
            }, function (err, results) {
                lao_mdlLangList = results.mdlLangList;
                lao_proLangList = results.proLangList;
                callback(err, "done");
            });

        },
        //找出系統模組
        function (callback) {

            queryAgent.queryList("QRY_S99_PROCESS_BY_SYS_MODULE", _.extend(lo_params, {sys_id: ls_sys_id}), 0, 0, function (err, mdlProList) {

                let mdlList = [];
                la_allMdlProList = mdlProList;
                let mdlMenu = _.groupBy(mdlProList, "mdl_id");
                _.each(mdlMenu, function (processMenu, mdl_id) {
                    let lo_mdlInfo = mdlMenu[mdl_id][0];
                    let lo_mdl = {};
                    _.each(processMenu, function (pro, pIdx) {

                        processMenu[pIdx]["pro_name"] = _.findWhere(lao_proLangList, {
                            pro_id: pro.pro_id,
                            locale: ls_locale
                        })
                            ? _.findWhere(lao_proLangList, {pro_id: pro.pro_id, locale: ls_locale}).words
                            : pro.pro_name;

                        //TODO 只需要取一個語言就好(目前使用者正在使用的語言)
                        _.each(la_locales, function (locale) {
                            let lo_proLang = _.findWhere(lao_proLangList, {pro_id: pro.pro_id, locale: locale.lang});
                            processMenu[pIdx]["pro_name_" + locale.lang] = lo_proLang ? lo_proLang.words : pro.pro_name;
                        });
                    });

                    lo_mdl["mdl_name"] = _.findWhere(lao_mdlLangList, {mdl_id: lo_mdlInfo.mdl_id, locale: ls_locale})
                        ? _.findWhere(lao_mdlLangList, {mdl_id: lo_mdlInfo.mdl_id, locale: ls_locale}).words
                        : lo_mdlInfo.mdl_name;

                    _.each(la_locales, function (locale) {
                        let lo_mdlLang = _.findWhere(lao_mdlLangList, {mdl_id: lo_mdlInfo.mdl_id, locale: locale.lang});
                        lo_mdl["mdl_name_" + locale.lang] = lo_mdlLang ? lo_mdlLang.words : lo_mdlInfo.mdl_name;
                    });

                    lo_mdl["mdl_id"] = lo_mdlInfo.mdl_id;
                    lo_mdl["mdl_url"] = lo_mdlInfo.mdl_url;
                    lo_mdl["group_sta"] = lo_mdlInfo.group_sta;
                    lo_mdl["processMenu"] = processMenu;
                    lo_mdl["edition"] = lo_mdlInfo.edition;
                    mdlList.push(lo_mdl);
                });

                _.each(lao_subsysList, function (subsys, sIdx) {
                    let menuMdlList = _.where(la_allMenuList, {
                        pre_id: subsys.subsys_id,
                        id_typ: "MODEL"
                    });
                    let la_mdlList = [];
                    _.each(menuMdlList, function (mdl) {
                        let ls_mdl_id = mdl.current_id;
                        if (_.findIndex(mdlList, {mdl_id: ls_mdl_id}) > -1) {
                            la_mdlList.push(mdlList[_.findIndex(mdlList, {mdl_id: ls_mdl_id})]);
                        }
                    });
                    lao_subsysList[sIdx]["mdlMenu"] = la_mdlList;
                    lao_subsysList[sIdx]["reportMenu"] = [].concat(..._.pluck(_.where(la_mdlList, {group_sta: "R"}), "processMenu"));
                });

                callback(err, lao_subsysList);
            });

        },
        //組合QuickMenu
        function (callback) {
            let la_allQuickMenu = [];
            let quickMenuParams = {
                user_athena_id: userInfo.user_athena_id,
                user_comp_cod: userInfo.cmp_id.trim(),
                user_id: userInfo.usr_id,
                athena_id: userInfo.athena_id,
                func_hotel_cod: userInfo.fun_hotel_cod
            };
            queryAgent.queryList("QRY_USER_QUICK_MENU", quickMenuParams, 0, 0, function (err, allQuickMenuList) {
                if (err) {
                    callback(null, lao_subsysList);
                }

                allQuickMenuList = filterSysIdMenu(ls_sys_id, allQuickMenuList);

                //過濾此系統的quickMenu
                function filterSysIdMenu(sys_id, allQuickMenuList) {
                    let la_subsys_id = _.pluck(_.where(la_allMenuList, {
                        pre_id: sys_id,
                        id_typ: "SUBSYS"
                    }), "current_id");
                    allQuickMenuList = _.filter(allQuickMenuList, function (quick) {
                        return _.indexOf(la_subsys_id, quick.subsys_id) > -1;
                    });

                    return allQuickMenuList;
                }

                _.each(allQuickMenuList, function (quickData) {
                    let tmpQuickObj = {};
                    let lo_pro = _.findWhere(la_allMenuList, {current_id: quickData.pro_id});
                    if (!_.isUndefined(lo_pro)) {

                        if (lo_pro.id_typ == "MODEL") {
                            let lo_subsys = _.findWhere(lao_subsysList, {subsys_id: lo_pro.pre_id});
                            let lo_mdl = _.findWhere(lo_subsys.mdlMenu, {mdl_id: quickData.pro_id});
                            if (!_.isUndefined(lo_mdl)) {
                                tmpQuickObj = {
                                    pro_id: lo_mdl.mdl_id,
                                    pro_url: lo_mdl.mdl_url,
                                    subsys_id: quickData.subsys_id,
                                    edition: lo_mdl.edition
                                };
                                _.each(la_locales, function (locale) {
                                    if (!_.isUndefined(lo_mdl["mdl_name_" + locale.lang])) {
                                        tmpQuickObj["pro_name_" + locale.lang] = lo_mdl["mdl_name_" + locale.lang];
                                    }
                                });
                                la_allQuickMenu.push(tmpQuickObj);
                            }
                        } else if (lo_pro.id_typ == "PROCESS") {
                            let lo_verConf = require("../configs/versionCtrlPrgConf.json");
                            let pro = _.findWhere(la_allMdlProList, {pro_id: lo_pro.current_id});
                            if (!_.isUndefined(pro)) {
                                tmpQuickObj = {
                                    pro_id: pro.pro_id,
                                    pro_url: pro.pro_url,
                                    subsys_id: quickData.subsys_id,
                                    edition: pro.edition,
                                    isBusinessVer: "N",
                                    isEnterpriseVer: "N"
                                };
                                //為了判斷第二階段與第三階段上的QuickMenu 以顏色區分
                                if (_.indexOf(lo_verConf.Business, pro.pro_id) > -1) {
                                    tmpQuickObj.isBusinessVer = "Y";
                                }
                                if (_.indexOf(lo_verConf.Enterprise, pro.pro_id) > -1) {
                                    tmpQuickObj.isEnterpriseVer = "Y";
                                }
                                _.each(la_locales, function (locale) {
                                    if (!_.isUndefined(pro["pro_name_" + locale.lang])) {
                                        tmpQuickObj["pro_name_" + locale.lang] = pro["pro_name_" + locale.lang];
                                    }
                                });
                                la_allQuickMenu.push(tmpQuickObj);
                            }
                        }
                    }
                });

                if (la_allQuickMenu.length > 0) {
                    let lo_subsysQuickMenuGrp = _.groupBy(la_allQuickMenu, "subsys_id");
                    _.each(lao_subsysList, function (subsysObj, sIdx) {
                        lao_subsysList[sIdx]["quickMenu"] = !_.isUndefined(lo_subsysQuickMenuGrp[subsysObj.subsys_id])
                            ? lo_subsysQuickMenuGrp[subsysObj.subsys_id]
                            : [];
                    });
                }
                callback(null, lao_subsysList);
            });

        }
    ], function (err) {
        callback(err, lao_subsysList);
    });
};

exports.getAllSystem = function (postData, session, callback) {
    let lo_params = {
        user_comp_cod: session.user.cmp_id.trim(),
        fun_comp_cod: session.user.cmp_id.trim(),
        fun_hotel_cod: session.user.fun_hotel_cod
    };
    queryAgent.queryList("QUY_ROLE_USER_USE_SYSTEM", lo_params, 0, 0, function (err, sysList) {
        if (err) {
            callback(err, sysList);
        }
        else {
            callback(err, sysList);
        }
    });
};