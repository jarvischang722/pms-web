/**
 * Created by Jun on 2017/4/18.
 */
let mongoAgent = require("../plugins/mongodb");
let _ = require("underscore");
let moment = require("moment");
let mailSvc = require("./MailService");
let async = require("async");
let queryAgent = require('../plugins/kplug-oracle/QueryAgent');

/**
 * 紀錄API Log
 * @param LogData{Object} :
 {
      log_id:       YYYYMMDDHHmmss
      prg_id:        //作業編號
      api_prg_code: //API 程式編號
      req_content : //打給API的資料
      res_content : //API回傳的時間
 }
 */
exports.recordLogAPI = function (LogData) {


    LogData["ins_datetime"] = new Date();

    new mongoAgent.LogsAPI(LogData).save(function (err, saved) {
        if (err) {
            mailSvc.sendExceptionMail({
                log_id: LogData.log_id || "",
                exceptionType: 'log',
                errorMsg: err
            });
            console.error(err);
        }
    });
};

/**
 * 取得設定異動紀錄
 * @param req
 * @param callback
 */
exports.getSetupPrgChangeLog = function (req, callback) {
    let ls_prg_id = req.body.prg_id;
    let ga_locale = req.session.locale;
    let ga_allUser = [];
    let gs_tableName = "";
    let gs_dtTableName = "";
    let userInfo = req.session.user;
    // let userInfo = {
    //     athena_id: 1,
    //     cmp_id: 'MIRACHU'
    // };
    let ga_allLangField = [];
    let ga_allChangeLog = [];
    let ga_prgFields = [];
    async.waterfall([
        function (callback) {
            queryAgent.queryList("QRY_ALL_USER_WITH_COMP", userInfo, 0, 0, function (err, allUser) {
                ga_allUser = allUser;
                callback(err, allUser);
            });
        },
        function (allUser, callback) {
            mongoAgent.TemplateRf.find({prg_id: ls_prg_id}, function (err, template) {
                if (err) {
                    return callback(err);
                }

                //多筆
                if (template.length == 1) {
                    gs_tableName = template[0].table_name;
                }
                //單筆
                else if (template.length == 2) {
                    gs_tableName = _.findWhere(template, {page_id: 2, template_id: 'gridSingle'}).table_name;
                }
                //mn_dt
                else if (template.length == 2) {
                    gs_tableName = _.findWhere(template, {page_id: 2, template_id: 'gridSingle'}).table_name;
                    gs_dtTableName = _.findWhere(template, {page_id: 2, template_id: 'datagrid'}).table_name;
                }
                callback(err, template);
            });
        },
        function (template, callback) {
            mongoAgent.SettingHistory.find({table_name: gs_tableName.toLowerCase()})
                .sort({event_time: -1}).exec(function (err, allLogs) {

                callback(err, allLogs);
            });
        },
        function (allLogs, callback) {
            mongoAgent.LangUIField.find({prg_id: ls_prg_id}).exec(function (err, allLangField) {
                ga_allLangField = allLangField;
                callback(err, allLogs);
            });
        },
        function (allLogs, callback) {
            mongoAgent.UIDatagridField.find({prg_id: ls_prg_id}).exec(function (err, prgFields) {
                var finalAllLogs = [];
                _.each(allLogs, function (logData) {
                    logData = logData.toObject();
                    let lo_tmpLog = {desc_mn: [], desc_dt: [], keys: []};
                    lo_tmpLog.event_time = moment(logData.event_time).format("YYYY/MM/DD HH:mm:ss");
                    lo_tmpLog.user = _.findWhere(ga_allUser, {usr_id: logData.user})
                        ? _.findWhere(ga_allUser, {usr_id: logData.user}).usr_cname : logData.user;
                    lo_tmpLog.action = logData.action;
                    _.each(logData.key, function (val, field_name) {
                        field_name = _.findWhere(ga_allLangField, {ui_field_name: field_name})
                            ? _.findWhere(ga_allLangField, {ui_field_name: field_name})["ui_display_name_" + ga_locale] : field_name;
                        lo_tmpLog.keys.push(field_name + " : " + val);
                    });
                    _.each(logData.dataOfChanges, function (changeData, field_name) {

                        lo_tmpLog.desc_mn.push(
                            {
                                field_name: _.findWhere(ga_allLangField, {ui_field_name: field_name})
                                    ? _.findWhere(ga_allLangField, {ui_field_name: field_name})["ui_display_name_" + ga_locale] : field_name,
                                newVal: changeData["newVal"],
                                oldVal: changeData["oldVal"]
                            });

                    });

                    finalAllLogs.push(lo_tmpLog);
                });

                callback(null, finalAllLogs);
            });


        }
    ], function (err, finalAllLog) {
        callback(err, finalAllLog);
    });

};