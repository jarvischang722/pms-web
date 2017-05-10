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
    var sys_id = req.session.user.sys_id;
    var la_locales = ['en','zh_TW'];
    var params = {
        user_comp_cod: req.session.user.cmp_id.trim(),
        user_id: req.session.user.usr_id,
        athena_id: req.session.user.athena_id,
        func_hotel_cod: req.session.user.fun_hotel_cod
    };
    var la_menuList = [];
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

                la_menuList = menuList;

                callback(err, menuList);
            });
        },
        function (la_menuSubSys, callback) {
            //找出系統全部子系統
            var la_menuSubSys = _.where(la_menuList, {
                pre_id: sys_id,
                id_typ: 'SUBSYS'
            });
            queryAgent.queryList("QRY_BAC_SUBSYSTEM_BY_SYS_ID", {sys_id: sys_id}, 0, 0, function (err, subsysList) {
                subsysList = alasql("select subsys.* " +
                    "from  ? subsys  " +
                    "inner join ? meun_sub_sys  on meun_sub_sys.current_id = subsys.subsys_id "
                    , [subsysList, la_menuSubSys]);


                langSvc.handleMultiLangContentByField("lang_bac_subsysmenu_rf",'subsys_nam','',function(err,langContent){

                    _.each(subsysList,function(subsys,sysIdx){
                        _.each(la_locales,function(locale){
                            var lo_subsysLang = _.findWhere(langContent,{subsys_id:subsys.subsys_id,locale:locale});
                            subsysList[sysIdx]["subsys_nam_"+locale] = lo_subsysLang ? lo_subsysLang.words : "";
                        })

                    })

                    callback(err, subsysList);

                });
            });
        },
        function (subsysList, callback) {

            queryAgent.queryList("QRY_S99_PROCESS_BY_SYS_MODULE", {sys_id: sys_id}, 0, 0, function (err, mdlProList) {
                // console.log(mdlProList);
                var mdlList = [];
                var mdlMenu = _.groupBy(mdlProList, "mdl_id");
                _.each(mdlMenu, function (processMenu, mdl_id) {
                    var lo_mdlInfo = mdlMenu[mdl_id][0];
                    mdlList.push({
                        mdl_id: lo_mdlInfo.mdl_id,
                        mdl_name_zh_TW: lo_mdlInfo.mdl_name_zh_tw,
                        mdl_name_en: lo_mdlInfo.mdl_name_en,
                        processMenu: processMenu
                    });
                });

                _.each(subsysList, function (subsys, sIdx) {
                    var menuMdlList = _.where(la_menuList, {
                        pre_id: subsys.subsys_id,
                        id_typ: 'MODEL'
                    })
                    var la_mdlList = [];
                    _.each(menuMdlList, function (mdl) {
                        var ls_mdl_id = mdl.current_id;
                        if (_.findIndex(mdlList, {mdl_id: ls_mdl_id}) > -1) {
                            la_mdlList.push(mdlList[_.findIndex(mdlList, {mdl_id: ls_mdl_id})]);
                        }
                    })
                    subsysList[sIdx]["mdlMenu"] = la_mdlList;
                });

                callback(err, subsysList);
            });

        }
    ], function (err, subsysList) {
        req.session.user.subsysMenu = subsysList;
        callback(err, subsysList);
    });
};