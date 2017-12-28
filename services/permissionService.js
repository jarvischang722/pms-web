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

        let apiParams = {
            "REVE-CODE": "BAC03009010000",
            "program_id": "permission",
            "user": session.user.usr_id,
            "count": Object.keys(saveExecData).length,
            "exec_data": saveExecData
        };
        if (_.size(saveExecData) > 0) {
            tools.requestApi(sysConfig.api_url, apiParams, function (apiErr, apiRes, data) {
                var success = true;
                var errMsg = null;
                var log_id = moment().format("YYYYMMDDHHmmss");
                if (apiErr) {
                    success = false;
                    errMsg = apiErr;
                }
                else if (data["RETN-CODE"] != "0000") {
                    success = false;
                    errMsg = data["RETN-CODE-DESC"];
                }

                //寄出exceptionMail
                if (!success) {
                    mailSvc.sendExceptionMail({
                        log_id: log_id,
                        exceptionType: "execSQL",
                        errorMsg: errMsg
                    });
                }

                logSvc.recordLogAPI({
                    success: success,
                    log_id: log_id,
                    prg_id: prg_id,
                    api_prg_code: '0300901000',
                    req_content: apiParams,
                    res_content: data
                });

                callback(errMsg, success);
            });
        }
        else {
            callback(null, true);
        }
    });
};

function combinStaffExecData(postData, session, callback) {

    let ln_exec_seq = 1;
    let la_staffOfRole = postData.staffOfRole;
    let la_staffChecked = postData.staffChecked;
    let la_staffList = postData.staffList;
    let ls_selRole = postData.selRole;
    let lo_savaExecDatas = {};
    let lo_userInfo = session.user;
    //原始資料在勾選人員資料裡沒有，代表刪除
    _.each(la_staffOfRole, function (lo_staffOfRole) {
        let ln_isExist = _.findIndex(la_staffChecked, function (ls_staffChecked) {
            return ls_staffChecked == lo_staffOfRole.user_id;
        });

        if (ln_isExist == -1) {
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
                    value: lo_staffOfRole.user_id
                }
            ];
            lo_savaExecDatas[ln_exec_seq] = tmpDel;
            ln_exec_seq++;
        }
    });

    //勾選人員資料在原始資料裡沒有，代表新增
    _.each(la_staffChecked, function (ls_staffChecked) {
        let ln_isExist = _.findIndex(la_staffOfRole, function (lo_staffOfRole) {
            return ls_staffChecked == lo_staffOfRole.user_id;
        });
        if (ln_isExist == -1) {
            let tmpIns = {"function": "1"}; //1  新增
            tmpIns["table_name"] = "BAC_ROLE_USER";

            let lo_staff = _.findWhere(la_staffList, {usr_id: ls_staffChecked});
            _.each(Object.keys(lo_staff), function (objKey) {
                tmpIns[objKey] = lo_staff[objKey];
            });

            tmpIns = _.extend(tmpIns, commonRule.getCreateCommonDefaultDataRule(session));
            lo_savaExecDatas[ln_exec_seq] = tmpIns;
            ln_exec_seq++;
        }
    });
    callback(null, lo_savaExecDatas);
}

function combinFuncExecData(postData, session, callback) {
    let ln_exec_seq = 1;
    let la_funcOfRole = postData.funcsOfRole;
    let la_funcChecked = postData.funcChecked;

    let ls_selRole = postData.selRole;
    let lo_savaExecDatas = {};
    let lo_userInfo = session.user;

    async.waterfall([
        function (cb) {
            qryFuncList(session.user, function (err, la_funcList) {
                cb(err, la_funcList);
            });
        },
        function (la_funcList, cb) {
            //原始資料在勾選功能資料裡沒有，代表刪除
            _.each(la_funcOfRole, function (lo_funcOfRole) {
                let ln_isExist = _.findIndex(la_funcChecked, function (lo_funcChecked) {
                    return lo_funcChecked == lo_funcOfRole.current_id;
                });
                if (ln_isExist == -1) {
                    let tmpDel = {"function": "0"}; //0 代表刪除
                    tmpDel["table_name"] = "BAC_ROLE_FUNCTION";
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
                            value: lo_userInfo.user_athena_id
                        },
                        {
                            key: "FUNC_HOTEL_COD",
                            operation: "=",
                            value: lo_userInfo.fun_hotel_cod
                        },
                        {
                            key: "CURRENT_ID",
                            operation: "=",
                            value: lo_funcOfRole.current_id
                        }
                    ];
                    lo_savaExecDatas[ln_exec_seq] = tmpDel;
                    ln_exec_seq++;
                }
            });

            //勾選功能資料在原始資料裡沒有，代表新增
            _.each(la_funcChecked, function (ls_funcChecked) {
                if (_.findIndex(la_funcOfRole, {current_id: ls_funcChecked}) == -1) {
                    let tmpIns = {"function": "1"}; //1  新增
                    tmpIns["table_name"] = "BAC_ROLE_FUNCTION";

                    let lo_func = _.findWhere(la_funcList, {current_id: ls_funcChecked});
                    if (!_.isUndefined(lo_func)) {
                        _.each(Object.keys(lo_func), function (objKey) {
                            tmpIns[objKey] = lo_func[objKey];
                        });
                        tmpIns = _.extend(tmpIns, commonRule.getCreateCommonDefaultDataRule(session));
                        lo_savaExecDatas[ln_exec_seq] = tmpIns;
                        ln_exec_seq++;
                    }
                }
            });
            cb(null, "");
        }
    ], function (err, result) {
        callback(null, lo_savaExecDatas);
    });
}

exports.qryPermissionFuncTreeData = function (req, session, callback) {
    async.waterfall([
        qryFuncList.bind(null, session.user),  //取功能清單
        function (funcList, cb) {
            let ln_counter = 0;
            let la_locales = _.pluck(req.cookies.sys_locales, "lang");
            let la_sysList = _.where(funcList, {id_typ: "SYSTEM"});

            _.each(la_sysList, function (lo_sysList) {
                let ls_sysID = lo_sysList.current_id;

                async.waterfall([
                    function (cb1) {
                        langSvc.handleMultiLangContentByField("lang_s99_system", 'sys_name', '', function (err, sysLang) {
                            let allLangForSys = _.where(sysLang, {sys_id: lo_sysList.current_id});
                            _.each(la_locales, function (locale) {
                                let sys_name = "";
                                let tmp = _.findWhere(allLangForSys, {locale: locale});
                                if (!_.isUndefined(tmp)) {
                                    sys_name = tmp.words;
                                }
                                lo_sysList["sys_name_" + locale] = sys_name;
                            });
                            cb1(err, lo_sysList);
                        });
                    },
                    function (lo_sysList, cb1) {
                        getChildNodeBySysId(req, funcList, ls_sysID, function (err, subsysMenu) {
                            ln_counter++;
                            lo_sysList.subSys = subsysMenu;
                            if (ln_counter == la_sysList.length) {
                                cb1(err, la_sysList);
                            }
                        });
                    }
                ], function (err, result) {
                    cb(err, result);
                });
            });
        }          //組樹狀資料結構
    ], function (err, result) {
        callback(err, result);
    });
};

/**
 * 取功能清單
 * @param userInfo {object} 使用者資訊
 * @param cb
 */
function qryFuncList(userInfo, cb) {
    let lo_params = {
        athena_id: userInfo.athena_id,
        comp_cod: userInfo.cmp_id,
        hotel_cod: userInfo.fun_hotel_cod
    };
    queryAgent.queryList("QRY_BAC_PROCESSMENU", lo_params, 0, 0, function (err, result) {
        cb(err, result);
    });
}

/**
 * 透過系統別取子系統，模組，作業多語系組合成樹狀結構
 * @param req
 * @param funcList  {array} 功能清單
 * @param sysID {string} 系統別
 * @param callback
 */
function getChildNodeBySysId(req, funcList, sysID, callback) {
    let userInfo = req.session.user;
    let ls_sys_id = sysID;
    let la_locales = req.cookies.sys_locales || [];

    let la_allMdlProList = [];  // 全部作業
    let la_allMenuList = funcList; // 全部Menu
    async.waterfall([
        //找出系統全部子系統
        function (cb) {
            let la_allMenuSubSys = _.where(funcList, {
                pre_id: ls_sys_id,
                id_typ: 'SUBSYS'
            });
            la_allMenuSubSys = _.uniq(la_allMenuSubSys, function (lo_allMenuSubSys) {
                return lo_allMenuSubSys.current_id;
            });
            queryAgent.queryList("QRY_BAC_SUBSYSTEM_BY_SYS_ID", {sys_id: ls_sys_id}, 0, 0, function (err, subsysList) {
                subsysList = alasql("select subsys.* " +
                    "from  ? subsys  " +
                    "inner join ? meun_sub_sys  on meun_sub_sys.current_id = subsys.subsys_id "
                    , [subsysList, la_allMenuSubSys]);

                langSvc.handleMultiLangContentByField("lang_bac_subsysmenu_rf", 'subsys_nam', '', function (err, langContent) {
                    _.each(subsysList, function (subsys, sysIdx) {
                        _.each(la_locales, function (locale) {
                            let lo_subsysLang = _.findWhere(langContent, {
                                subsys_id: subsys.subsys_id,
                                locale: locale.lang
                            });
                            subsysList[sysIdx]["subsys_nam_" + locale.lang] = lo_subsysLang ? lo_subsysLang.words : "";
                        });
                    });

                    cb(err, subsysList);
                });
            });
        },
        //找出模組作業的多語系
        function (subsysList, cb) {
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
                cb(err, subsysList, results.mdlLangList, results.proLangList);
            });

        },
        //找出系統模組
        function (subsysList, mdlLangList, proLangList, cb) {

            queryAgent.queryList("QRY_S99_PROCESS_BY_SYS_MODULE", {sys_id: ls_sys_id}, 0, 0, function (err, mdlProList) {
                let mdlList = [];
                la_allMdlProList = mdlProList;
                let mdlMenu = _.groupBy(mdlProList, "mdl_id");
                _.each(mdlMenu, function (processMenu, mdl_id) {
                    let lo_mdlInfo = mdlMenu[mdl_id][0];
                    let lo_mdl = {};
                    _.each(processMenu, function (pro, pIdx) {
                        _.each(la_locales, function (locale) {
                            let lo_proLang = _.findWhere(proLangList, {pro_id: pro.pro_id, locale: locale.lang});
                            processMenu[pIdx]["pro_name_" + locale.lang] = lo_proLang ? lo_proLang.words : pro.pro_name;
                        });
                    });

                    _.each(la_locales, function (locale) {
                        let lo_mdlLang = _.findWhere(mdlLangList, {mdl_id: lo_mdlInfo.mdl_id, locale: locale.lang});
                        lo_mdl["mdl_name_" + locale.lang] = lo_mdlLang ? lo_mdlLang.words : lo_mdlInfo.mdl_name;
                    });

                    lo_mdl['mdl_id'] = lo_mdlInfo.mdl_id;
                    lo_mdl['mdl_url'] = lo_mdlInfo.mdl_url;
                    lo_mdl['group_sta'] = lo_mdlInfo.group_sta;
                    lo_mdl['processMenu'] = processMenu;
                    mdlList.push(lo_mdl);
                });

                _.each(subsysList, function (subsys, sIdx) {
                    let menuMdlList = _.where(la_allMenuList, {
                        pre_id: subsys.subsys_id,
                        id_typ: 'MODEL'
                    });
                    let la_mdlList = [];
                    _.each(menuMdlList, function (mdl) {
                        let ls_mdl_id = mdl.current_id;
                        if (_.findIndex(mdlList, {mdl_id: ls_mdl_id}) > -1) {
                            la_mdlList.push(mdlList[_.findIndex(mdlList, {mdl_id: ls_mdl_id})]);
                        }
                    });
                    subsysList[sIdx]["mdlMenu"] = la_mdlList;
                });

                cb(err, subsysList);
            });

        },
        //組合QuickMenu
        function (subsysList, cb) {
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
                    cb(null, subsysList);
                }

                allQuickMenuList = filterSysIdMenu(ls_sys_id, allQuickMenuList);

                //過濾此系統的quickMenu
                function filterSysIdMenu(sys_id, allQuickMenuList) {
                    let la_subsys_id = _.pluck(_.where(la_allMenuList, {
                        pre_id: sys_id,
                        id_typ: 'SUBSYS'
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
                            let lo_subsys = _.findWhere(subsysList, {subsys_id: lo_pro.pre_id});
                            let lo_mdl = _.findWhere(lo_subsys.mdlMenu, {mdl_id: quickData.pro_id});
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
                            let lo_verConf = require("../configs/versionCtrlPrgConf.json");
                            let pro = _.findWhere(la_allMdlProList, {pro_id: lo_pro.current_id});
                            if (!_.isUndefined(pro)) {
                                tmpQuickObj = {
                                    pro_id: pro.pro_id,
                                    pro_url: pro.pro_url,
                                    subsys_id: quickData.subsys_id,
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
                    _.each(subsysList, function (subsysObj, sIdx) {
                        subsysList[sIdx]["quickMenu"] = !_.isUndefined(lo_subsysQuickMenuGrp[subsysObj.subsys_id])
                            ? lo_subsysQuickMenuGrp[subsysObj.subsys_id]
                            : [];
                    });
                }
                cb(null, subsysList);
            });

        }
    ], function (err, subsysList) {
        callback(err, subsysList);
    });
}

exports.qryRoleByUserID = function (postData, session, callback) {
    let lo_params = {
        athena_id: session.user.athena_id,
        user_id: postData.user_id
    };

    queryAgent.queryList("QRY_ROLE_OF_ACCOUNTS", lo_params, 0, 0, function(err, result){
        console.log(result);
        callback(err, result);
    });
};