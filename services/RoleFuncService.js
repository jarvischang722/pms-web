/**
 * Created by Jun Chang on 2016/12/30.
 * 角色權限
 */

const queryAgent = require('../plugins/kplug-oracle/QueryAgent');
const _ = require("underscore");
const async = require("async");
const alasql = require("alasql");
const langSvc = require("./LangService");
const SysFuncPurviewSvc = require("../services/SysFuncPurviewService");

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
            let subsysMenu = _.map(_.groupBy(funcRows, "subsys_id"), function (group) {
                return {
                    subsys_id: group[0].subsys_id,
                    subsys_nam: group[0].subsys_nam,
                    modules: _.map(_.groupBy(group, 'mdl_id'), function (mdl_grp) {
                        return {
                            mdl_id: mdl_grp[0].mdl_id,
                            mdl_name: mdl_grp[0].mdl_name,
                            subsys_id: mdl_grp[0].subsys_id
                        };
                    })

                };
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
                            };
                        });

                });
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
    SysFuncPurviewSvc.getUserSubsysPurviewBySysID(req, req.session.activeSystem.id, function (err, subsysMenu) {
        req.session.user.subsysMenu = subsysMenu;
        callback(err, subsysMenu);
    });
};


/**
 * 取設定群組裡的Process
 * @param userInfo
 * @param mdl_id
 * @param callback
 */
exports.handleGroupMdlProcess = function (userInfo, mdl_id, la_locales, callback) {
    let params = {
        user_athena_id: userInfo.user_athena_id,
        user_comp_cod: userInfo.cmp_id.trim(),
        user_id: userInfo.usr_id,
        athena_id: userInfo.athena_id,
        func_hotel_cod: userInfo.fun_hotel_cod,
        pre_id: mdl_id,
        id_typ: "PROCESS",
        role_id: userInfo.role_id
    };
    queryAgent.queryList("QRY_BAC_PROCESS_BY_MODULE", params, 0, 0, function (err, prosList) {
        if (err) {
            callback(null, []);
        } else {
            langSvc.handleMultiLangContentByField("lang_s99_process", "pro_name", "", function (err, proLangList) {
                //多語系
                _.each(prosList, function (pro, pIdx) {
                    _.each(la_locales, function (locale) {
                        let lo_proLang = _.findWhere(proLangList, {pro_id: pro.pro_id, locale: locale.lang});
                        prosList[pIdx]["pro_name_" + locale.lang] = lo_proLang ? lo_proLang.words : pro.pro_name;
                    });
                });
                callback(null, prosList);
            });

        }
    });
};