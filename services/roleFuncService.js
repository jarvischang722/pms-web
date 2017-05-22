/**
 * Created by Jun Chang on 2016/12/30.
 * 角色權限
 */

var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var _ = require("underscore");
var async = require("async");
var alasql = require("alasql");
var langSvc = require("./langService");

/**
 * 根據系統找出所有對應的子系統和模組
 * @param params {Object}
 * @param callback {Function} （err, subsysMenu） :
 *              error : 錯誤
 *              subsysMenu : 分類子系統 > 模組 > 作業
 */
exports.querySubsyMdulBySys = function (params, callback) {
    try {
        queryAgent.queryList('QRY_BAC_SYS_MODULE_BY_USER', params, 0, 0, function (err, funcRows) {

            if (err) {
                callback(null, []);
                return;
            }

            //根據子系統與模組分組
            var subsysMenu = _.map(_.groupBy(funcRows, "subsys_id"), function (group) {
                return {
                    subsys_id: group[0].subsys_id,
                    subsys_nam: group[0].subsys_nam,
                    modules: _.map(_.groupBy(group, 'mdl_id'), function (mdl_grp) {
                        return {
                            mdl_id: mdl_grp[0].mdl_id,
                            mdl_name: mdl_grp[0].mdl_name,
                            subsys_id: mdl_grp[0].subsys_id,
                        }
                    })

                }
            });

            //分類作業
            _.each(subsysMenu, function (val, gIdx) {
                _.each(val.modules, function (mdl, mIdx) {
                    if (_.isUndefined(subsysMenu[gIdx]["modules"][mIdx])) {
                        subsysMenu[gIdx]["modules"][mIdx] = {};
                    }

                    subsysMenu[gIdx]["modules"][mIdx]["pros"] = _.map(
                        _.where(funcRows, {subsys_id: val.subsys_id, mdl_id: mdl.mdl_id}), function (pro) {
                            return {
                                pro_id: pro.pro_id,
                                pro_name: pro.pro_name
                            }
                        });

                })
            });

            callback(null, subsysMenu);
        });
    } catch (error) {
        callback(error, []);
    }
};


/**
 * 獲取子系統的快選單列表
 * @param params
 * @param callback
 */
exports.querySubsysQuickMenu = function (params, callback) {
    queryAgent.queryList('QRY_USER_QUICK_MENU', params, 0, 0, function (err, quickMenuRows) {
        callback(err, quickMenuRows);
    });
};


/**
 *  更新使用者權限
 * @param req
 */
exports.updateUserPurview = function (req, callback) {

    var userInfo = req.session.user;
    var sys_id = userInfo.sys_id;
    var la_locales = req.cookies.sys_locales || [];
    var params = {
        user_athena_id: userInfo.user_athena_id,
        user_comp_cod: userInfo.cmp_id.trim(),
        user_id: userInfo.usr_id,
        athena_id: userInfo.athena_id,
        func_hotel_cod: userInfo.fun_hotel_cod
    };
    var la_allMdlProList = [];  // 全部作業
    var la_allMenuList = []; // 全部Menu 
    async.waterfall([
        function (callback) {
            queryAgent.queryList("QRY_BAC_SYS_MODULE_BY_USER", params, 0, 0, function (err, menuList) {
                if (err) {
                    menuList = [];
                }

                menuList = _.where(menuList, {
                    menu_athena_id: req.session.user.athena_id,
                    func_comp_cod: req.session.user.cmp_id.trim(),
                    func_hotel_cod: req.session.user.fun_hotel_cod,
                });

                la_allMenuList = menuList;

                callback(err, menuList);
            });
        },
        function (la_menuSubSys, callback) {
            //找出系統全部子系統
            var la_allMenuSubSys = _.where(la_allMenuList, {
                pre_id: sys_id,
                id_typ: 'SUBSYS'
            });
            queryAgent.queryList("QRY_BAC_SUBSYSTEM_BY_SYS_ID", {sys_id: sys_id}, 0, 0, function (err, subsysList) {
                subsysList = alasql("select subsys.* " +
                    "from  ? subsys  " +
                    "inner join ? meun_sub_sys  on meun_sub_sys.current_id = subsys.subsys_id "
                    , [subsysList, la_allMenuSubSys]);

                langSvc.handleMultiLangContentByField("lang_bac_subsysmenu_rf", 'subsys_nam', '', function (err, langContent) {

                    _.each(subsysList, function (subsys, sysIdx) {
                        _.each(la_locales, function (locale) {
                            var lo_subsysLang = _.findWhere(langContent, {
                                subsys_id: subsys.subsys_id,
                                locale: locale.lang
                            });
                            subsysList[sysIdx]["subsys_nam_" + locale.lang] = lo_subsysLang ? lo_subsysLang.words : "";
                        })
                    });

                    callback(err, subsysList);
                });
            });
        },
        //找出作業的多語系
        function (subsysList, callback) {
            langSvc.handleMultiLangContentByField("lang_s99_process", "pro_name", "", function (err, proLangList) {
                callback(err, subsysList, proLangList);
            })
        },
        //找出系統模組
        function (subsysList, proLangList, callback) {

            queryAgent.queryList("QRY_S99_PROCESS_BY_SYS_MODULE", {sys_id: sys_id}, 0, 0, function (err, mdlProList) {
                var mdlList = [];
                //TODO 多語系
                la_allMdlProList = mdlProList;
                var mdlMenu = _.groupBy(mdlProList, "mdl_id");
                _.each(mdlMenu, function (processMenu, mdl_id) {
                    var lo_mdlInfo = mdlMenu[mdl_id][0];
                    _.each(processMenu, function (pro, pIdx) {
                        _.each(la_locales, function (locale) {
                            var lo_proLang = _.findWhere(proLangList, {pro_id: pro.pro_id, locale: locale.lang});
                            processMenu[pIdx]["pro_name_" + locale.lang] = lo_proLang ? lo_proLang.words : pro.pro_name;
                        })
                    });
                    mdlList.push({
                        mdl_id: lo_mdlInfo.mdl_id,
                        mdl_name_zh_TW: lo_mdlInfo.mdl_name_zh_tw,
                        mdl_name_en: lo_mdlInfo.mdl_name_en,
                        mdl_url: lo_mdlInfo.mdl_url,
                        group_sta: lo_mdlInfo.group_sta,
                        processMenu: processMenu
                    });
                });

                _.each(subsysList, function (subsys, sIdx) {
                    var menuMdlList = _.where(la_allMenuList, {
                        pre_id: subsys.subsys_id,
                        id_typ: 'MODEL'
                    });
                    var la_mdlList = [];
                    _.each(menuMdlList, function (mdl) {
                        var ls_mdl_id = mdl.current_id;
                        if (_.findIndex(mdlList, {mdl_id: ls_mdl_id}) > -1) {
                            la_mdlList.push(mdlList[_.findIndex(mdlList, {mdl_id: ls_mdl_id})]);
                        }
                    });
                    subsysList[sIdx]["mdlMenu"] = la_mdlList;
                });

                callback(err, subsysList);
            });

        },
        //組合QuickMenu
        function (subsysList, callback) {
            var la_allQuickMenu = [];
            var quickMenuParams = {
                user_athena_id: userInfo.user_athena_id,
                user_comp_cod: userInfo.cmp_id.trim(),
                user_id: userInfo.usr_id,
                athena_id: userInfo.athena_id,
                func_hotel_cod: userInfo.fun_hotel_cod
            };
            queryAgent.queryList("QRY_USER_QUICK_MENU", quickMenuParams, 0, 0, function (err, allQuickMenuList) {
                if (err) {
                    callback(null, subsysList);
                }
                _.each(allQuickMenuList, function (quickData) {
                    var tmpQuickObj = {};
                    var lo_pro = _.findWhere(la_allMenuList, {current_id: quickData.pro_id});
                    if (!_.isUndefined(lo_pro)) {

                        if (lo_pro.id_typ == "MODEL") {
                            var lo_subsys = _.findWhere(subsysList, {subsys_id: lo_pro.pre_id});
                            var lo_mdl = _.findWhere(lo_subsys.mdlMenu, {mdl_id: quickData.pro_id});
                            if (!_.isUndefined(lo_mdl)) {
                                tmpQuickObj = {
                                    pro_id: lo_mdl.mdl_id,
                                    pro_url: lo_mdl.mdl_url,
                                    subsys_id: quickData.subsys_id
                                };
                                _.each(la_locales, function (locale) {
                                    if (!_.isUndefined(lo_mdl["mdl_name_" + locale.lang])) {
                                        tmpQuickObj["pro_name_" + locale.lang] = lo_mdl["mdl_name_" + locale.lang];
                                    }
                                });
                                la_allQuickMenu.push(tmpQuickObj);
                            }
                        } else if (lo_pro.id_typ == "PROCESS") {

                            var lo_pro = _.findWhere(la_allMdlProList, {pro_id: lo_pro.pro_id});
                            if (!_.isUndefined(lo_pro)) {
                                tmpQuickObj = {
                                    pro_id: lo_pro.pro_id,
                                    pro_url: lo_pro.pro_url,
                                    subsys_id: quickData.subsys_id
                                };
                                la_allQuickMenu.push(tmpQuickObj);
                            }

                        }

                    }


                });

                if (la_allQuickMenu.length > 0) {
                    var lo_subsysQuickMenuGrp = _.groupBy(la_allQuickMenu, "subsys_id");
                    _.each(subsysList, function (subsysObj, sIdx) {
                        subsysList[sIdx]["quickMenu"] = !_.isUndefined(lo_subsysQuickMenuGrp[subsysObj.subsys_id])
                            ? lo_subsysQuickMenuGrp[subsysObj.subsys_id]
                            : [];
                    });
                }


                callback(null, subsysList);

            });

        }
    ], function (err, subsysList) {
        req.session.user.subsysMenu = subsysList;
        callback(err, subsysList);
    });
};


/**
 * 取設定群組裡的Process
 * @param userInfo
 * @param mdl_id
 * @param callback
 */
exports.handleGroupMdlProcess = function (userInfo, mdl_id, la_locales, callback) {
    var params = {
        user_athena_id: userInfo.user_athena_id,
        user_comp_cod: userInfo.cmp_id.trim(),
        user_id: userInfo.usr_id,
        athena_id: userInfo.athena_id,
        func_hotel_cod: userInfo.fun_hotel_cod,
        pre_id: mdl_id,
        id_typ: "PROCESS"
    };
    queryAgent.queryList("QRY_BAC_PROCESS_BY_MODULE", params, 0, 0, function (err, prosList) {
        if (err) {
            callback(null, []);
        } else {
            langSvc.handleMultiLangContentByField("lang_s99_process", "pro_name", "", function (err, proLangList) {
                //多語系
                _.each(prosList, function (pro, pIdx) {
                    _.each(la_locales, function (locale) {
                        var lo_proLang = _.findWhere(proLangList, {pro_id: pro.pro_id, locale: locale.lang});
                        prosList[pIdx]["pro_name_" + locale.lang] = lo_proLang ? lo_proLang.words : pro.pro_name;
                    })
                });
                callback(null, prosList);
            })

        }
    })
};