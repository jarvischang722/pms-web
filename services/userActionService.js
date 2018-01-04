/**
 * Created by a17017 Chang on 2018/1/4.
 * 使用者操作紀錄
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
 * 記錄使用者操作的狀態
 * @param session{object}
 * @param session_id{string}
 * @param prg_id{string}
 * @param func_id{string}
 * @param url{string}
 * @param callback{function}
 */
exports.doRecordUserAction = function(session, session_id, prg_id, func_id, url, callback){
    let success = true;
    let errorMsg = null;
    let lo_saveData = {
        session_id: session_id,
        prg_id: prg_id,
        func_id: func_id,
        url: url,
        event_time: moment(new Date()),
        athena_id:session.user.athena_id,
        comp_cod:session.user.cmp_id,
        hotel_cod: session.user.hotel_cod,
        usr_id:session.user.usr_id
    };

    mongoAgent.UserAction(lo_saveData).save(function(err){
        if (err) {
            success = false;
            errorMsg = err;
        }
        callback(err, success);
    });
};