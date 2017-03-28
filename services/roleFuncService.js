/**
 * Created by Jun Chang on 2016/12/30.
 * 角色權限
 */

var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var _ = require("underscore");
var async = require("async");

/**
 * 根據系統找出所有對應的子系統和模組
 * @param params {Object}
 * @param callback {Function} （err, subsysGrp） :
 *              error : 錯誤
 *              subsysGrp : 分類子系統 > 模組 > 作業
 */
exports.querySubsyMdulBySys = function (params, callback) {
    try {
        queryAgent.queryList('QRY_BAC_SYS_MODULE_BY_USER', params, 0,0, function (err, funcRows) {

            if (err) {
                callback(null, []);
                return;
            }

            //根據子系統與模組分組
            var subsysGrp = _.map(_.groupBy(funcRows, "subsys_id"), function (group) {
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
            _.each(subsysGrp, function (val, gIdx) {
                _.each(val.modules, function (mdl, mIdx) {
                    if (_.isUndefined(subsysGrp[gIdx]["modules"][mIdx])) {
                        subsysGrp[gIdx]["modules"][mIdx] = {};
                    }

                    subsysGrp[gIdx]["modules"][mIdx]["pros"] = _.map(
                        _.where(funcRows, {subsys_id: val.subsys_id, mdl_id: mdl.mdl_id}), function (pro) {
                            return {
                                pro_id: pro.pro_id,
                                pro_name: pro.pro_name
                            }
                        });

                })
            });

            callback(null, subsysGrp);
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
exports.updateUserPurview = function(req,callback) {
    var params = {
        user_comp_cod: req.session.user.cmp_id.trim(),
        user_id: req.session.user.usr_id,
        sys_id: req.session.user.sys_id,
        fun_hotel_cod: req.session.user.fun_hotel_cod
    };
    var _this = this;

    var funcs = [];

    _this.querySubsyMdulBySys(params, function (err, subsysGrp) {
        req.session.user.subsysGrp = subsysGrp;
        _.each(subsysGrp, function (subsysItem, sIdx) {
            funcs.push(
                function (callback) {
                    var params = {
                        user_comp_cod: req.session.user.cmp_id.trim(),
                        user_id: req.session.user.usr_id,
                        sys_id: req.session.user.sys_id,
                        fun_hotel_cod: req.session.user.fun_hotel_cod,
                        subsys_id: subsysItem.subsys_id
                    };
                    _this.querySubsysQuickMenu(params, function (err, quickMenu) {
                        req.session.user.subsysGrp[sIdx]["quickMenu"] = quickMenu;
                        callback(err, quickMenu);
                    });
                }
            )
        });
        //抓取每個子系統的快選單
        async.parallel(funcs, function (err, result) {
            callback(err,"");
        });

    });

};