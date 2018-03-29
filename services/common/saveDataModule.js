/**
 * Created by kaiyue on 2017/11/13.
 */
const path = require('path');
const moment = require("moment");
const _ = require("underscore");
const async = require("async");

const dataRuleSvc = require("../../services/DataRuleService");
const queryAgent = require("../../plugins/kplug-oracle/QueryAgent");
const mongoAgent = require("../../plugins/mongodb");
const tools = require("../../utils/CommonTools");
const optSaveAdapter = require("../../ruleEngine/operationSaveAdapter");
const go_sysConf = require("../../configs/systemConfig");
const logSvc = require("../../services/LogService");


class saveTemplate {

    constructor() {
        this.lo_saveExecDatas = {};
        this.ln_exec_seq = 1;
    }

    setParams(postData, session) {
        this.postData = postData;
        this.session = session;
    }

    async chkRuleBeforeSave() {
        throw new Error("error");
    }

    saveFormatAdapter() {
        throw new Error("error");
    }

    callApi() {
        throw new Error("error");
    }

    async chkRuleIsExist() {
        return await mongoAgent.PrgFunction.find({
            prg_id: this.postData.prg_id,
            page_id: _.isNaN(Number(this.postData.page_id)) ? 1 : Number(this.postData.page_id)
        }).exec().then(data => {
            return data;
        }).catch(err => {
            throw new Error(err);
        });
    }
}

// 新作業儲存流程
class saveDataModule extends saveTemplate {

    async chkRuleBeforeSave() {
        let self = this;
        let la_rules = await this.chkRuleIsExist();
        if (la_rules.length > 0) {
            return new Promise((resolve, reject) => {
                dataRuleSvc.doOperationRuleProcBeforeSave(self.postData, self.session, la_rules, function (err, chkResult) {
                    if (err) {
                        return reject(err);
                    }

                    if (chkResult.extendExecDataArrSet.length > 0) {
                        _.each(chkResult.extendExecDataArrSet, function (execData) {
                            self.lo_saveExecDatas[self.ln_exec_seq] = execData;
                            self.ln_exec_seq++;
                        });
                    }

                    if (!_.isUndefined(chkResult.effectValues)) {
                        self.postData = _.extend(self.postData, chkResult.effectValues);
                    }
                    resolve(self.postData);
                });
            })
        }
        else {
            return self.postData;
        }
    }

    saveFormatAdapter() {

    }

    show() {
        return {postData: this.postData, session: this.session};
    }


}

// 作業儲存流程
function operationSaveProc() {
    let lo_saveExecDatas = {}; //要打API 所有exec data
    let ln_exec_seq = 1; // 執行順序 從1開始
    let postData, session;

    this.setParams = function (lo_postData, lo_session) {
        postData = lo_postData;
        session = lo_session;
    };

    // 儲存前規則檢查
    this.doRuleProcBeforeSave = function (callback) {
        chkRuleIsExist(function (err, la_rules) {
            if (la_rules.length != 0) {
                dataRuleSvc.doOperationRuleProcBeforeSave(postData, session, la_rules, function (err, chkResult) {
                    if (!err && chkResult.extendExecDataArrSet.length > 0) {
                        _.each(chkResult.extendExecDataArrSet, function (execData) {
                            lo_saveExecDatas[ln_exec_seq] = execData;
                            ln_exec_seq++;
                        });
                    }

                    if (!err && !_.isUndefined(chkResult.effectValues)) {
                        postData = _.extend(postData, chkResult.effectValues);
                    }
                    callback(err, postData);
                });
            }
            else {
                callback(err, postData);
            }
        });
    };

    // 作業儲存轉接器 tmpCUD 轉 API格式
    this.doOptSaveAdapter = function () {
        let lo_saveData = null;
        let callback = null;
        if (arguments.length == 2) {
            lo_saveData = arguments[0];
            callback = arguments[1];
        }
        else {
            lo_saveData = postData;
            callback = arguments[0];
        }

        let lo_optSaveAdapter = new optSaveAdapter(lo_saveData, session);
        if (ln_exec_seq != 1) {
            lo_optSaveAdapter.set_saveExecDatas(ln_exec_seq, lo_saveExecDatas);
        }

        //轉換格式
        lo_optSaveAdapter.formating(function (err, lo_apiParams) {
            callback(err, lo_optSaveAdapter);
        });
    };

    // 打API
    this.doAPI = function (optSaveAdapter, callback) {
        let rtnData;
        if (_.isUndefined(optSaveAdapter)) {
            rtnData = {
                success: false,
                errorMsg: "optAdapter is undefined"
            };
            return callback({}, rtnData);
        }

        // 一定樣經過轉接器才能打API
        let lb_isOptSaveAdpt = optSaveAdapter.constructor.name == "operationSaveAdapterClass" ? true : false;
        if (lb_isOptSaveAdpt == false) {
            rtnData = {
                success: false,
                errorMsg: "Data format is not from operationSaveAdapter"
            };
            console.error(rtnData);
            return callback({}, rtnData);
        }

        //取API格式
        let lb_isApiError = false;
        let lo_apiParams = optSaveAdapter.getApiFormat();
        let la_apiField = ["REVE-CODE", "program_id", "func_id", "athena_id", "hotel_cod", "user", "table_name", "count", "exec_data"];
        _.every(la_apiField, function (ls_apiField) {
            if (_.isUndefined(lo_apiParams[ls_apiField]) || lo_apiParams[ls_apiField].trim() == "") {
                rtnData = {
                    success: false,
                    errorMsg: "api format error"
                };
                lb_isApiError = true;
                return false;
            }
        });

        if (lb_isApiError) {
            return callback({}, rtnData);
        }
        //打A
        tools.requestApi(go_sysConf.api_url, lo_apiParams, function (apiErr, apiRes, data) {
            let log_id = moment().format("YYYYMMDDHHmmss");
            let ls_msg = null;
            let lb_success = true;
            if (apiErr || !data) {
                lb_success = false;
                ls_msg = apiErr;
            }
            else if (data["RETN-CODE"] != "0000") { //回傳有誤
                lb_success = false;
                console.error(data["RETN-CODE-DESC"]);
                ls_msg = data["RETN-CODE-DESC"] || "error!!";
            }
            else { //成功
                lb_success = true;
                console.info(data["RETN-CODE-DESC"]);
                ls_msg = data["RETN-CODE-DESC"] || "";
            }

            //寄出exceptionMail
            if (lb_success == false) {
                mailSvc.sendExceptionMail({
                    log_id: log_id,
                    exceptionType: "execSQL",
                    errorMsg: ls_msg
                });
            }
            //log 紀錄
            logSvc.recordLogAPI({
                log_id: log_id,
                success: lb_success,
                prg_id: postData.prg_id,
                api_prg_code: postData.trans_cod,
                req_content: lo_apiParams,
                res_content: data
            });

            let rtnData = {
                success: lb_success,
                errorMsg: ls_msg,
                data: data["RETN-DATA"] || {}
            };
            callback(null, rtnData);
        });
    };

    //檢查是否有rule
    function chkRuleIsExist(callback) {
        mongoAgent.PrgFunction.find({
            prg_id: postData.prg_id,
            page_id: _.isNaN(Number(postData.page_id)) ? 1 : Number(postData.page_id)
        }, function (err, getResult) {
            callback(err, tools.mongoDocToObject(getResult));
        });
    }

}

function factory(type) {
    let lo_saveDataModule;
    if (type == "newSaveFormat") {
        lo_saveDataModule = new saveDataModule();
    }
    else if (type == "oldSaveFormat") {
        lo_saveDataModule = new operationSaveProc();
    }
    return lo_saveDataModule;
}

exports.factory = factory;