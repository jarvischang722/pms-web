/**
 * Created by kaiyue on 2017/12/26.
 */
const path = require('path');
const moment = require("moment");
const _ = require("underscore");
const async = require("async");
const alasql = require("alasql");

const ruleAgent = require("../ruleEngine/ruleAgent");
const queryAgent = require("../plugins/kplug-oracle/QueryAgent");
const mongoAgent = require("../plugins/mongodb");
const sysConfig = require("../configs/systemConfig");
const tools = require("../utils/CommonTools");
const fetechDataModule = require("./common/fetchDataModule");
const commonRule = require("../ruleEngine/rules/CommonRule");
const langSvc = require("../services/LangService");
const logSvc = require("../services/LogService");
const mailSvc = require("../services/MailService");
const dbSvc = require("../services/DbTableService");

exports.saveAuthByRole = function (postData, session, callback) {
    let ln_exec_seq = 1;
    let saveExecData = {};

    async.parallel({
        staffExecData: combinStaffExecData.bind(null, postData, session),
        funcExecData: combinFuncExecData.bind(null, postData, session)
    }, function (err, result) {
        saveExecData = _.clone(result.staffExecData);
        ln_exec_seq = Object.keys(result.staffExecData).length;
        ln_exec_seq++;
        _.each(result.funcExecData, function (lo_funcExecData) {
            saveExecData[ln_exec_seq] = lo_funcExecData;
            ln_exec_seq++;
        });

        // console.log(saveExecData);
        // callback(err, "");
        dbSvc.execSQL("SYS0110010", saveExecData, session, callback);
    });
};

function combinStaffExecData(postData, session, callback) {

    let ln_exec_seq = 1;
    // let la_staffOfRole = postData.staffOfRole;
    let la_staffChecked = postData.staffChecked;
    let la_staffUnChecked = postData.staffUnChecked;
    let la_staffList = postData.staffList;
    let ls_selRole = postData.selRole;
    let lo_savaExecDatas = {};
    let lo_userInfo = session.user;

    //勾選增加人員資料
    _.each(la_staffChecked, function (lo_staffChecked) {
        let tmpIns = {"function": "1"}; //1  新增
        tmpIns["table_name"] = "BAC_ROLE_USER";

        let lo_staff = _.findWhere(la_staffList, {usr_id: lo_staffChecked.id});
        if (!_.isUndefined(lo_staff)) {
            tmpIns.role_athena_id = lo_userInfo.athena_id;
            tmpIns.role_comp_cod = lo_staff.cmp_id;
            tmpIns.role_id = ls_selRole;
            tmpIns.user_athena_id = lo_userInfo.athena_id;
            tmpIns.user_comp_cod = lo_staff.cmp_id;
            tmpIns.user_id = lo_staff.usr_id;

            tmpIns = _.extend(tmpIns, commonRule.getCreateCommonDefaultDataRule(session));
            lo_savaExecDatas[ln_exec_seq] = tmpIns;
            ln_exec_seq++;
        }
    });

    //取消勾選刪除人員資料
    _.each(la_staffUnChecked, function (lo_staffUnChecked) {
        let tmpDel = {"function": "0"}; //0 代表刪除
        tmpDel["table_name"] = "BAC_ROLE_USER";
        tmpDel.condition = [
            {
                key: "role_id",
                operation: "=",
                value: ls_selRole
            },
            {
                key: "user_athena_id",
                operation: "=",
                value: lo_userInfo.user_athena_id
            },
            {
                key: "user_comp_cod",
                operation: "=",
                value: lo_userInfo.cmp_id
            },
            {
                key: "user_id",
                operation: "=",
                value: lo_staffUnChecked.id
            }
        ];
        lo_savaExecDatas[ln_exec_seq] = tmpDel;
        ln_exec_seq++;
    });
    callback(null, lo_savaExecDatas);
}

function combinFuncExecData(postData, session, callback) {
    let ln_exec_seq = 1;
    let la_funcChecked = postData.funcChecked || [];
    let la_funcUnChecked = postData.funcUnChecked || [];

    let ls_selRole = postData.selRole;
    let lo_savaExecDatas = {};
    let lo_userInfo = session.user;

    async.waterfall([
        function (cb) {
            let lo_params = {
                athena_id: lo_userInfo.athena_id,
                comp_cod: lo_userInfo.cmp_id,
                hotel_cod: lo_userInfo.fun_hotel_cod
            };
            queryAgent.queryList("QRY_BAC_PROCESSMENU", lo_params, 0, 0, function (err, result) {
                cb(err, result);
            });
        },
        function (la_funcList, cb) {
            _.each(la_funcUnChecked, function (lo_funcUnChecked) {
                lo_funcUnChecked.parent = lo_funcUnChecked.parent == "#" ? "ROOT" : lo_funcUnChecked.parent;
                let tmpDel = {"function": "0"}; //0 代表刪除
                tmpDel["table_name"] = "BAC_ROLE_FUNCTION";
                let ls_func_id = lo_funcUnChecked.id.indexOf("_") != -1 ? lo_funcUnChecked.id.split("_")[1] : lo_funcUnChecked.id;
                tmpDel.condition = [
                    {
                        key: "ROLE_COMP_COD",
                        operation: "=",
                        value: lo_userInfo.cmp_id
                    },
                    {
                        key: "ROLE_ID",
                        operation: "=",
                        value: ls_selRole
                    },
                    {
                        key: "FUNC_COMP_COD",
                        operation: "=",
                        value: lo_userInfo.cmp_id
                    },
                    {
                        key: "FUNC_HOTEL_COD",
                        operation: "=",
                        value: lo_userInfo.fun_hotel_cod
                    },
                    {
                        key: "PRE_ID",
                        operation: "=",
                        value: lo_funcUnChecked.parent
                    },
                    {
                        key: "CURRENT_ID",
                        operation: "=",
                        value: ls_func_id
                    }
                ];
                lo_savaExecDatas[ln_exec_seq] = tmpDel;
                ln_exec_seq++;
            });

            _.each(la_funcChecked, function (lo_funcChecked) {
                lo_funcChecked.parent = lo_funcChecked.parent == "#" ? "ROOT" : lo_funcChecked.parent;
                let tmpIns = {"function": "1"}; //1  新增
                tmpIns["table_name"] = "BAC_ROLE_FUNCTION";
                let ls_func_id = lo_funcChecked.id.indexOf("_") != -1 ? lo_funcChecked.id.split("_")[1] : lo_funcChecked.id;
                let lo_func = _.findWhere(la_funcList, {
                    current_id: ls_func_id,
                    pre_id: lo_funcChecked.parent
                });
                if (!_.isUndefined(lo_func)) {
                    tmpIns.role_athena_id = lo_userInfo.athena_id;
                    tmpIns.role_comp_cod = lo_userInfo.cmp_id;
                    tmpIns.role_id = ls_selRole;
                    tmpIns.func_athena_id = lo_userInfo.athena_id;
                    tmpIns.func_comp_cod = lo_userInfo.cmp_id;
                    tmpIns.func_hotel_cod = lo_userInfo.hotel_cod;
                    tmpIns.pre_id = lo_func.pre_id;
                    tmpIns.current_id = lo_func.current_id;
                    tmpIns.id_typ = lo_func.id_typ;
                    tmpIns.level_nos = lo_func.level_nos;
                    tmpIns.sort_cod = 0;
                    tmpIns = _.extend(tmpIns, commonRule.getCreateCommonDefaultDataRule(session));

                    lo_savaExecDatas[ln_exec_seq] = tmpIns;
                    ln_exec_seq++;
                }
            });
            cb(null, "");
        }
    ], function (err, result) {
        callback(null, lo_savaExecDatas);
    });
}

exports.saveAuthByStaff = function (postData, session, callback) {
    let ln_exec_seq = 1;
    let la_checkedRoleList = postData.checkedRoleList;
    let la_oriCheckedRoleList = postData.oriCheckedRoleList;
    let lo_savaExecDatas = {};
    let lo_userInfo = session.user;
    let la_staffList = postData.staffList;
    let ls_user_id = postData.user_id;

    _.each(la_oriCheckedRoleList, function (lo_oriCheckedRoleList) {
        let ln_isExist = _.findIndex(la_checkedRoleList, function (lo_checkedRoleList) {
            return lo_oriCheckedRoleList == lo_checkedRoleList;
        });
        // 原始資料在勾選角色裡沒有，代表刪除
        if (ln_isExist == -1) {
            let tmpDel = {"function": "0"}; //0 代表刪除
            tmpDel["table_name"] = "BAC_ROLE_USER";
            tmpDel.condition = [
                {
                    key: "role_id",
                    operation: "=",
                    value: lo_oriCheckedRoleList
                },
                {
                    key: "user_athena_id",
                    operation: "=",
                    value: lo_userInfo.user_athena_id
                },
                {
                    key: "user_comp_cod",
                    operation: "=",
                    value: lo_userInfo.cmp_id
                },
                {
                    key: "user_id",
                    operation: "=",
                    value: ls_user_id
                }
            ];
            lo_savaExecDatas[ln_exec_seq] = tmpDel;
            ln_exec_seq++;
        }
    });

    _.each(la_checkedRoleList, function (lo_checkedRoleList) {
        let ln_isExist = _.findIndex(la_oriCheckedRoleList, function (lo_oriCheckedRoleList) {
            return lo_oriCheckedRoleList == lo_checkedRoleList;
        });
        // 勾選資料在原始資料裡沒有，代表新增
        if (ln_isExist == -1) {
            let tmpIns = {"function": "1"}; //1  新增
            tmpIns["table_name"] = "BAC_ROLE_USER";

            let lo_staff = _.findWhere(la_staffList, {usr_id: ls_user_id});
            if (!_.isUndefined(lo_staff)) {
                tmpIns.role_athena_id = lo_userInfo.athena_id;
                tmpIns.role_comp_cod = lo_staff.cmp_id;
                tmpIns.role_id = lo_checkedRoleList;
                tmpIns.user_athena_id = lo_userInfo.athena_id;
                tmpIns.user_comp_cod = lo_staff.cmp_id;
                tmpIns.user_id = lo_staff.usr_id;

                tmpIns = _.extend(tmpIns, commonRule.getCreateCommonDefaultDataRule(session));
                lo_savaExecDatas[ln_exec_seq] = tmpIns;
                ln_exec_seq++;
            }

        }
    });

    dbSvc.execSQL("SYS0110010", lo_savaExecDatas, session, callback);
};

exports.saveAuthByFunc = function (postData, session, callback) {
    let ln_exec_seq = 1;
    let la_checkedRoleList = postData.checkedRoleList;
    let la_oriCheckedRoleList = postData.oriCheckedRoleList;
    let lo_saveExecDatas = {};
    let lo_userInfo = session.user;
    let ls_current_id = postData.current_id;
    let ls_pre_id = postData.pre_id;

    async.waterfall([
        function (cb) {
            let lo_params = {
                athena_id: lo_userInfo.athena_id,
                comp_cod: lo_userInfo.cmp_id,
                hotel_cod: lo_userInfo.fun_hotel_cod
            };
            queryAgent.queryList("QRY_BAC_PROCESSMENU", lo_params, 0, 0, function (err, result) {
                cb(err, result);
            });
        },
        function (la_funcList, cb) {
            _.each(la_oriCheckedRoleList, function (lo_oriCheckedRoleList) {
                let ln_isExist = _.findIndex(la_checkedRoleList, function (lo_checkedRoleList) {
                    return lo_oriCheckedRoleList == lo_checkedRoleList;
                });
                // 原始資料在勾選角色裡沒有，代表刪除
                if (ln_isExist == -1) {
                    let tmpDel = {"function": "0"}; //0 代表刪除
                    tmpDel["table_name"] = "BAC_ROLE_FUNCTION";
                    tmpDel.condition = [
                        {
                            key: "role_id",
                            operation: "=",
                            value: lo_oriCheckedRoleList
                        },
                        {
                            key: "func_athena_id",
                            operation: "=",
                            value: lo_userInfo.athena_id
                        },
                        {
                            key: "func_comp_cod",
                            operation: "=",
                            value: lo_userInfo.cmp_id
                        },
                        {
                            key: "func_hotel_cod",
                            operation: "=",
                            value: lo_userInfo.fun_hotel_cod
                        },
                        {
                            key: "current_id",
                            operation: "=",
                            value: ls_current_id
                        },
                        {
                            key: "pre_id",
                            operation: "=",
                            value: ls_pre_id
                        }
                    ];
                    lo_saveExecDatas[ln_exec_seq] = tmpDel;
                    ln_exec_seq++;
                }
            });

            _.each(la_checkedRoleList, function (lo_checkedRoleList) {
                let ln_isExist = _.findIndex(la_oriCheckedRoleList, function (lo_oriCheckedRoleList) {
                    return lo_oriCheckedRoleList == lo_checkedRoleList;
                });
                // 勾選資料在原始資料裡沒有，代表新增
                if (ln_isExist == -1) {
                    let tmpIns = {"function": "1"}; //1  新增
                    tmpIns["table_name"] = "BAC_ROLE_FUNCTION";

                    let lo_func = _.findWhere(la_funcList, {current_id: ls_current_id, pre_id: ls_pre_id});
                    if (!_.isUndefined(lo_func)) {
                        tmpIns.role_athena_id = lo_userInfo.athena_id;
                        tmpIns.role_comp_cod = lo_userInfo.cmp_id;
                        tmpIns.role_id = lo_checkedRoleList;
                        tmpIns.func_athena_id = lo_userInfo.athena_id;
                        tmpIns.func_comp_cod = lo_userInfo.cmp_id;
                        tmpIns.func_hotel_cod = lo_userInfo.hotel_cod;
                        tmpIns.pre_id = lo_func.pre_id;
                        tmpIns.current_id = ls_current_id;
                        tmpIns.id_typ = lo_func.id_typ;
                        tmpIns.level_nos = lo_func.level_nos;
                        tmpIns.sort_cod = 0;

                        tmpIns = _.extend(tmpIns, commonRule.getCreateCommonDefaultDataRule(session));
                        lo_saveExecDatas[ln_exec_seq] = tmpIns;
                        ln_exec_seq++;
                    }
                }
            });
            cb(null, lo_saveExecDatas);
        }
    ], function (err, saveExecDatas) {
        dbSvc.execSQL("SYS0110010", saveExecDatas, session, callback);
    });
};

exports.addRole = function (postData, session, callback) {
    let lo_params = {
        "function": "1",
        table_name: "BAC_ROLE",
        role_id: postData.role_id,
        role_nam: postData.role_name,
        role_athena_id: session.user.athena_id,
        role_comp_cod: session.user.cmp_id
    };
    lo_params = _.extend(lo_params, commonRule.getCreateCommonDefaultDataRule(session));
    let lo_saveExecDatas = {
        "1": lo_params
    };
    // callback(null, "");
    dbSvc.execSQL("SYS0110010", lo_saveExecDatas, session, callback);
};

exports.delRole = function (postData, session, callback) {
    let lo_del_bac_role = {
        "function": "0",
        table_name: "BAC_ROLE",
        condition: [
            {
                key: "role_id",
                operation: "=",
                value: postData.role_id
            },
            {
                key: "role_athena_id",
                operation: "=",
                value: session.user.athena_id
            },
            {
                key: "role_comp_cod",
                operation: "=",
                value: session.user.cmp_id
            }
        ]
    };
    let lo_del_bac_role_func = {
        "function": "0",
        table_name: "BAC_ROLE_FUNCTION",
        condition: [
            {
                key: "role_athena_id",
                operation: "=",
                value: session.user.athena_id
            },
            {
                key: "role_comp_cod",
                operation: "=",
                value: session.user.cmp_id
            },
            {
                key: "role_id",
                operation: "=",
                value: postData.role_id
            }
        ]
    };
    let lo_del_bac_role_user = {
        "function": "0",
        table_name: "BAC_ROLE_FUNCTION",
        condition: [
            {
                key: "role_athena_id",
                operation: "=",
                value: session.user.athena_id
            },
            {
                key: "role_comp_cod",
                operation: "=",
                value: session.user.cmp_id
            },
            {
                key: "role_id",
                operation: "=",
                value: postData.role_id
            }
        ]
    };
    let lo_saveExecDatas = {
        "1": lo_del_bac_role,
        "2": lo_del_bac_role_user,
        "3": lo_del_bac_role_func
    };
    dbSvc.execSQL("SYS0110010", lo_saveExecDatas, session, callback);
};

exports.updRole = function (postData, session, callback) {
    let lo_userInfo = session.user;
    let lo_params = {
        "function": "2",
        table_name: "BAC_ROLE",
        role_id: postData.role_id,
        role_nam: postData.role_name,
        role_athena_id: session.user.athena_id,
        role_comp_cod: session.user.cmp_id,
        condition: [
            {
                key: 'role_athena_id',
                operation: "=",
                value: lo_userInfo.athena_id
            },
            {
                key: 'role_comp_cod',
                operation: "=",
                value: lo_userInfo.cmp_id
            },
            {
                key: 'role_id',
                operation: "=",
                value: postData.ori_role_id
            }
        ]
    };
    let lo_upd_bac_role_func = {
        "function": "2",
        table_name: "BAC_ROLE_FUNCTION",
        role_id: postData.role_id,
        condition: [
            {
                key: "role_athena_id",
                operation: "=",
                value: lo_userInfo.athena_id
            },
            {
                key: "role_comp_cod",
                operation: "=",
                value: lo_userInfo.cmp_id
            },
            {
                key: "role_id",
                operation: "=",
                value: postData.ori_role_id
            }
        ]
    };
    let lo_upd_bac_role_user = {
        "function": "2",
        table_name: "BAC_ROLE_FUNCTION",
        role_id: postData.role_id,
        condition: [
            {
                key: "role_athena_id",
                operation: "=",
                value: session.user.athena_id
            },
            {
                key: "role_comp_cod",
                operation: "=",
                value: session.user.cmp_id
            },
            {
                key: "role_id",
                operation: "=",
                value: postData.ori_role_id
            }
        ]
    };
    let lo_saveExecDatas = {
        "1": lo_params,
        "2": lo_upd_bac_role_func,
        "3": lo_upd_bac_role_user
    };
    // console.log(lo_saveExecDatas);
    // callback(null, "");
    dbSvc.execSQL("SYS0110010", lo_saveExecDatas, session, callback);
};

exports.addStaff = function (postData, session, callback) {
    let lo_userInfo = session.user;
    let lo_params = {
        "function": "1",
        table_name: "S99_user",
        user_athena_id: lo_userInfo.athena_id,
        hotel_cod: lo_userInfo.hotel_cod,
        usr_id: postData.usr_id,
        usr_cname: postData.usr_cname,
        grp_id: postData.grp_id,
        cmp_id: session.user.cmp_id
    };
    lo_params = _.extend(lo_params, commonRule.getCreateCommonDefaultDataRule(session));
    let lo_saveExecDatas = {
        "1": lo_params
    };
    callback(null, lo_params);
    // dbSvc.execSQL("SYS0110010", lo_saveExecDatas, session, callback);
};

exports.qryPermissionFuncTreeData = function (req, session, callback) {
    async.waterfall([
        qryFuncList.bind(null, req),    //取功能清單
        genPermissionFuncTree
    ], function (err, result) {
        callback(err, result);
    });
};

/**
 * 取功能清單
 * @param userInfo {object} 使用者資訊
 * @param cb
 */
function qryFuncList(req, cb) {
    let userInfo = req.session.user;
    let lo_params = {
        athena_id: userInfo.athena_id,
        comp_cod: userInfo.cmp_id,
        hotel_cod: userInfo.fun_hotel_cod
    };
    queryAgent.queryList("QRY_BAC_PROCESSMENU", lo_params, 0, 0, function (err, result) {
        cb(err, req, result);
    });
}

/**
 * 透過系統別取子系統，模組，作業多語系組合成樹狀結構
 * @param req
 * @param funcList  {array} 功能清單
 * @param sysID {string} 系統別
 * @param callback
 */
function genPermissionFuncTree(req, la_funcList, callback) {
    let la_locales = _.pluck(req.cookies.sys_locales, "lang");

    async.waterfall([
        //找出模組作業的多語系
        function (cb) {
            async.parallel({
                sysLangList: function (lo_cb) {
                    langSvc.handleMultiLangContentByField("lang_s99_system", 'sys_name', '', function (err, sysLang) {
                        lo_cb(err, sysLang);
                    });
                },
                subsysLangList: function (lo_cb) {
                    langSvc.handleMultiLangContentByField("lang_bac_subsysmenu_rf", 'subsys_nam', '', function (err, subsysLangList) {
                        lo_cb(err, subsysLangList);
                    });
                },
                mdlLangList: function (lo_cb) {
                    langSvc.handleMultiLangContentByField("lang_s99_model", "mdl_name", "", function (err, mdlLangList) {
                        lo_cb(err, mdlLangList);
                    });
                },
                proLangList: function (lo_cb) {
                    langSvc.handleMultiLangContentByField("lang_s99_process", "pro_name", "", function (err, proLangList) {
                        lo_cb(err, proLangList);
                    });
                },
                funcLangList: function (lo_cb) {
                    langSvc.handleMultiLangContentByField("lang_bac_process_func_rf", "func_nam", "", function (err, funcLangList) {
                        lo_cb(err, funcLangList);
                    });
                }
            }, function (err, results) {
                cb(err, results.sysLangList, results.subsysLangList, results.mdlLangList, results.proLangList, results.funcLangList);
            });
        },
        //組功能樹狀結構
        function (la_sysLang, la_subsysLang, la_mdlLang, la_proLang, la_funcLang, cb) {
            let la_sys = _.where(la_funcList, {id_typ: "SYSTEM"});
            _.each(la_sys, function (lo_sys) {
                //系統多語系
                _.each(la_locales, function (locale) {
                    let lo_sysLang = _.findWhere(la_sysLang, {locale: locale, sys_id: lo_sys.current_id});
                    let sys_name = _.isUndefined(lo_sysLang) ? lo_sys.current_id : lo_sysLang.words;
                    lo_sys["sys_name_" + locale] = sys_name;
                });

                //子系統
                let la_subsys = _.where(la_funcList, {pre_id: lo_sys.current_id, id_typ: "SUBSYS"});
                _.each(la_subsys, function (lo_subsys) {
                    //子系統多語系
                    _.each(la_locales, function (lo_locale) {
                        let lo_subsysLang = _.findWhere(la_subsysLang, {
                            subsys_id: lo_subsys.current_id,
                            locale: lo_locale
                        });
                        let subsys_name = _.isUndefined(lo_subsysLang) ? lo_subsys.current_id : lo_subsysLang.words;
                        lo_subsys["subsys_nam_" + lo_locale] = subsys_name;
                    });

                    //模組
                    let la_model = _.where(la_funcList, {pre_id: lo_subsys.current_id, id_typ: "MODEL"});
                    _.each(la_model, function (lo_model) {
                        //模組多語系
                        _.each(la_locales, function (lo_locale) {
                            let lo_mdlLang = _.findWhere(la_mdlLang, {locale: lo_locale, mdl_id: lo_model.current_id});
                            let mdl_name = _.isUndefined(lo_mdlLang) ? lo_model.current_id : lo_mdlLang.words;
                            lo_model["mdl_nam_" + lo_locale] = mdl_name;
                        });

                        let la_process = _.where(la_funcList, {pre_id: lo_model.current_id, id_typ: "PROCESS"});
                        _.each(la_process, function (lo_process) {
                            //作業多語系
                            _.each(la_locales, function (lo_locale) {
                                let lo_proLang = _.findWhere(la_proLang, {
                                    locale: lo_locale,
                                    pro_id: lo_process.current_id
                                });
                                let pro_name = _.isUndefined(lo_proLang) ? lo_process.current_id : lo_proLang.words;
                                lo_process["pro_nam_" + lo_locale] = pro_name;
                            });

                            let la_func = _.where(la_funcList, {pre_id: lo_process.current_id, id_typ: "FUNCTION"});
                            _.each(la_func, function (lo_func) {
                                //功能多語系
                                _.each(la_locales, function (lo_locale) {
                                    let lo_funcLang = _.findWhere(la_funcLang, {
                                        locale: lo_locale,
                                        func_id: lo_func.current_id,
                                        pro_id: lo_process.current_id
                                    });
                                    let func_name = _.isUndefined(lo_funcLang) ? lo_func.current_id : lo_funcLang.words;
                                    lo_func["func_nam_" + lo_locale] = func_name;
                                });
                            });
                        });
                    });
                });
            });
            cb(null, la_funcList);
        }
    ], function (err, result) {
        let lo_rtn = {
            funcTreeData: result,
            funnList: la_funcList
        };
        callback(err, lo_rtn);
    });
}

exports.qryRoleByUserID = function (postData, session, callback) {
    let lo_params = {
        athena_id: session.user.athena_id,
        user_id: postData.user_id
    };

    queryAgent.queryList("QRY_ROLE_OF_ACCOUNTS", lo_params, 0, 0, function (err, result) {
        callback(err, result);
    });
};

exports.qryRoleByCurrentID = function (postData, session, callback) {
    let ls_id = postData.current_id.indexOf("_") != -1 ? postData.current_id.split("_")[1] : postData.current_id;
    let lo_params = {
        athena_id: session.user.athena_id,
        hotel_cod: session.user.hotel_cod,
        current_id: ls_id,
        pre_id: postData.pre_id
    };
    let la_roleList = [];

    queryAgent.queryList("QRY_ROLE_OF_FUNCTION", lo_params, 0, 0, function (err, la_roleByFuncList) {
        _.each(la_roleByFuncList, function (lo_roleByFunctionList) {
            la_roleList.push(lo_roleByFunctionList.role_id);
        });
        la_roleList = _.uniq(la_roleList);
        callback(err, la_roleList);
    });
};