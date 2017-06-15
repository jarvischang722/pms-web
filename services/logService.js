/**
 * Created by Jun on 2017/4/18.
 */
var mongoAgent = require("../plugins/mongodb");
var _ = require("underscore");
var moment = require("moment");
var mailSvc = require("../services/mailService");

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