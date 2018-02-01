/**
 * Created by Jun a17017 on 2018/1/19.
 */

var tools = require("../utils/CommonTools");
var _ = require("underscore");
var sysConfig = require("../configs/systemConfig");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var i18n = require("i18n");
var logSvc = require("./LogService");
var mailSvc = require("./MailService");
var langSvc = require("./LangService");
var ruleAgent = require("../ruleEngine/ruleAgent");
var moment = require("moment");
var go_sysConf = require("../configs/systemConfig");
var commonRule = require("../ruleEngine/rules/CommonRule");
let optSaveAdapter = require("../ruleEngine/operationSaveAdapter");
let async = require("async");
let mongoAgent = require("../plugins/mongodb");
let dataRuleSvc = require('../services/DataRuleService');
let ErrorClass = require("../ruleEngine/errorClass");
let ReturnClass = require("../ruleEngine/returnClass");

/**
 * 人數控管
 * @param session{object}
 * @param session_id{string}
 */
exports.doCheckOnlineUser = function (session, session_id, callback) {
    let success = true;
    let errorMsg = null;
    let lo_params = {
        athena_id: session.user.onlineUserBy.athena_id,
        comp_cod: session.user.onlineUserBy.comp_cod.trim(),
        hotel_cod: session.user.onlineUserBy.hotel_cod
    };
    let la_onlineUserSession = [];

    async.waterfall([
        //取得onlineUserSession中所有session id
        function (cb) {
            mongoAgent.OnlineUser.findOne(lo_params, function (err, getResult) {
                if (err) {
                    success = false;
                    cb(err, success);
                }
                else if (!getResult) {
                    success = false;
                    errorMsg = 'OnlineUser is null';
                    cb(errorMsg, success);
                }
                else{
                    la_onlineUserSession = getResult.onlineUserSession;
                    cb(null, getResult.onlineUserSession);
                }
            });
        },
        //取得線上的onlineUserSession
        function (la_sessionId, cb) {
            mongoAgent.Sessions.find({}, function (err, getResult) {
                if (err) {
                    success = false;
                    cb(err, success);
                }
                else if (!getResult) {
                    success = false;
                    errorMsg = 'OnlineUser is null';
                    cb(errorMsg, success);
                }
                else{
                    let la_nowSessionId = getResult;
                    let la_existSessionId = [];
                    _.each(la_sessionId, function (lo_sessionId) {
                        let ln_noneExistIdx = _.findIndex(la_nowSessionId, {_id: lo_sessionId.session_id});
                        if (ln_noneExistIdx > -1) {
                            la_existSessionId.push(lo_sessionId);
                        }
                    });
                    cb(null, la_existSessionId);
                }
            });
        },
        //刪掉不在線上的session
        function (la_existSessionId, cb) {
            mongoAgent.OnlineUser.update(lo_params, {onlineUserSession: la_existSessionId}, function (err) {
                if (err) {
                    success = false;
                }
                cb(err, success);
            });
        },
        //更新在線人數
        function (lb_success, cb) {
            mongoAgent.OnlineUser.findOne(lo_params, function (err, getResult) {
                if (err) {
                    success = false;
                    cb(err, success);
                }
                else if (!getResult) {
                    success = false;
                    errorMsg = 'OnlineUser is null';
                    cb(errorMsg, success);
                }
                else {
                    if (_.findIndex(getResult.onlineUserSession, {session_id: session_id}) == -1) {
                        if (getResult.onlineUserSession.length < getResult.availUserNum) {
                            let lo_insertData = {
                                session_id: session_id,
                                usr_id: session.user.usr_id,
                                insertDate: moment(new Date())
                            };
                            getResult.onlineUserSession.push(lo_insertData);

                            mongoAgent.OnlineUser.update(lo_params, {onlineUserSession: getResult.onlineUserSession}, function (err) {
                                if (err) {
                                    success = false;
                                    errorMsg = err;
                                }
                                cb(errorMsg, success);
                            });
                        }
                        else {
                            success = false;
                            errorMsg = "超過人數上限";
                            cb(errorMsg, success);
                        }
                    }
                    else {
                        cb(errorMsg, success);
                    }
                }
            });
        }
    ], function (err, result) {
        callback(err, result);
    });
};

/**
 * 刪除在 mongo 中的seeeion_id
 * @param go_session
 * @param gs_sessionId
 */
exports.doReleaseOnlineUser = function (session, session_id, callback) {
    let success = true;
    let errorMsg = null;
    let lo_params = {
        athena_id: session.user.onlineUserBy.athena_id,
        comp_cod: session.user.onlineUserBy.comp_cod.trim(),
        hotel_cod: session.user.onlineUserBy.hotel_cod
    };

    mongoAgent.OnlineUser.findOne(lo_params, function (err, getResult) {
        if (err) {
            success = false;
            errorMsg = err;
            callback(errorMsg, success);
        }
        else if (!getResult) {
            success = false;
            errorMsg = 'OnlineUser is null';
            callback(errorMsg, success);
        }
        else {
            let ln_sessionUserIndex = _.findIndex(getResult.onlineUserSession, {session_id: session_id});
            if (ln_sessionUserIndex > -1) {
                getResult.onlineUserSession.splice(ln_sessionUserIndex, 1);
                mongoAgent.OnlineUser.update(lo_params, {onlineUserSession: getResult.onlineUserSession}, function (err) {
                    if (err) {
                        success = false;
                        errorMsg = err;
                    }
                    callback(errorMsg, success);
                });
            }
            else {
                success = false;
                errorMsg = "555";
                callback(errorMsg, success);
            }
        }

    });
};