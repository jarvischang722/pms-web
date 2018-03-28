/**
 * Created by kaiyue on 2017/11/13.
 */
const moment = require("moment");
const _ = require("underscore");

const dataRuleSvc = require("../../services/DataRuleService");
const mongoAgent = require("../../plugins/mongodb");
const tools = require("../../utils/CommonTools");
const optSaveAdapter = require("../../ruleEngine/operationSaveAdapter");
const saveDataAdapter = require("./saveDataAdapter");
const go_sysConf = require("../../configs/systemConfig");
const logSvc = require("../../services/LogService");
const mailSvc = require("../../services/MailService");

/**
 * 儲存樣板
 */
class saveTemplate {

    constructor() {
        this.lo_saveExecDatas = {};     //要打API 所有exec data
        this.ln_exec_seq = 1;           //執行順序 從1開始
        this.lo_apiFormater = {};       //API格式
    }

    /**
     * 設定參數
     * @param postData {object} 前端資料
     * @param session {object}
     */
    setParams(postData, session) {
        this.lo_postData = postData;
        this.lo_session = session;
    }

    /**
     * 儲存前規則檢查
     * @returns {Promise<*>}
     */
    async chkRuleBeforeSave() {
        throw new Error("must implement chkRuleBeforeSave");
    }

    /**
     * 作業儲存轉接器 tmpCUD 轉 API格式
     * @returns {Promise<void>}
     */
    async saveFormatAdapter() {
        throw new Error("must implement saveFormatAdapter");
    }

    /**
     * 檢查API格式
     * @returns {Promise<void>}
     */
    async chkApiFormater() {
        throw new Error("must implement chkApiFormater");
    }

    /**
     * 呼叫API
     * @returns {Promise<void>}
     */
    async callApi() {
        await this.chkApiFormater();
        return new Promise((resolve, reject) => {
            tools.requestApi(go_sysConf.api_url, this.lo_apiFormater, (apiErr, apiRes, data) => {
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

                //log 紀錄
                logSvc.recordLogAPI({
                    log_id: log_id,
                    success: lb_success,
                    prg_id: this.lo_postData.prg_id,
                    api_prg_code: this.lo_postData.trans_cod,
                    req_content: this.lo_apiFormater,
                    res_content: data
                });

                //寄出exceptionMail
                if (lb_success == false) {
                    mailSvc.sendExceptionMail({
                        log_id: log_id,
                        exceptionType: "execSQL",
                        errorMsg: ls_msg
                    });
                    reject(new Error(ls_msg));
                }
                else {
                    resolve(data["RETN-DATA"] || {});
                }
            });
        });
    }

    /**
     * 儲存流程
     * @returns {Promise<void>}
     */
    async execSaveProc() {
        try {
            await this.chkRuleBeforeSave();
            await this.saveFormatAdapter();
            let lo_result = await this.callApi();
            return lo_result;
            // return this.lo_apiFormater;
        }
        catch (err) {
            throw err;
        }
    }

    /**
     * 檢查規則是否存在
     * @returns {Promise<*>}
     */
    async chkRuleIsExist() {
        return await mongoAgent.PrgFunction.find({
            prg_id: this.lo_postData.prg_id,
            page_id: _.isNaN(Number(this.lo_postData.page_id)) ? 1 : Number(this.lo_postData.page_id)
        }).exec().then(data => {
            return data;
        }).catch(err => {
            throw new Error(err);
        });
    }
}

/**
 * 作業(新)儲存流程格式
 */
class newSaveDataProc extends saveTemplate {

    /**
     * 儲存前規則檢查
     * @returns {Promise<*>}
     */
    async chkRuleBeforeSave() {
        let la_rules = await this.chkRuleIsExist();
        if (la_rules.length > 0) {
            return new Promise((resolve, reject) => {
                dataRuleSvc.doOperationRuleProcBeforeSave(this.lo_postData, this.lo_session, la_rules, (err, chkResult) => {
                    if (err) {
                        reject(err);
                    }

                    if (chkResult.extendExecDataArrSet.length > 0) {
                        this.lo_postData = _.extend(this.lo_postData, chkResult.extendExecDataArrSet[0]);
                    }

                    if (!_.isUndefined(chkResult.effectValues)) {
                        this.lo_postData = _.extend(this.lo_postData, chkResult.effectValues);
                    }
                    resolve(this.lo_postData);
                });
            })
        }
        else {
            return this.lo_postData;
        }
    }

    /**
     * 作業儲存轉接器 tmpCUD 轉 API格式
     * @returns {Promise<void>}
     */
    async saveFormatAdapter() {
        let lo_saveAdapter = new saveDataAdapter(this.lo_postData, this.lo_session);

        //轉換格式
        try {
            this.lo_apiFormater = await lo_saveAdapter.formating();
        }
        catch (err) {
            throw new Error(err);
        }

    }

    /**
     * 驗證(新)API格式
     */
    async chkApiFormater() {
        let la_apiField = ["locale", "reve_code", "prg_id", "func_id", "client_ip", "server_ip", "event_time", "mac", "page_data"];
        _.every(la_apiField, ls_apiField => {
            if (_.isUndefined(this.lo_apiFormater[ls_apiField]) || this.lo_apiFormater[ls_apiField].trim() == "") {
                throw new Error(`api format error, ${ls_apiField} is not exist`);
            }
        });
    }
}

/**
 * 作業(舊)儲存流程、格式
 */
class oldSaveDataProc extends saveTemplate {

    /**
     * 儲存前規則檢查
     * @returns {Promise<*>}
     */
    async chkRuleBeforeSave() {
        let la_rules = await this.chkRuleIsExist();
        if (la_rules.length > 0) {
            return new Promise((resolve, reject) => {
                dataRuleSvc.doOperationRuleProcBeforeSave(this.lo_postData, this.lo_session, la_rules, (err, chkResult) => {
                    if (err) {
                        reject(err);
                    }

                    if (chkResult.extendExecDataArrSet.length > 0) {
                        _.each(chkResult.extendExecDataArrSet, function (execData) {
                            this.lo_saveExecDatas[this.ln_exec_seq] = execData;
                            this.ln_exec_seq++;
                        });
                    }

                    if (!_.isUndefined(chkResult.effectValues)) {
                        this.lo_postData = _.extend(this.lo_postData, chkResult.effectValues);
                    }
                    resolve(this.lo_postData);
                });
            })
        }
        else {
            return this.lo_postData;
        }
    }

    /**
     * 作業儲存轉接器 tmpCUD 轉 API格式
     * @returns {Promise<void>}
     */
    async saveFormatAdapter() {
        let lo_optSaveAdapter = new optSaveAdapter(this.lo_postData, this.lo_session);
        if (this.ln_exec_seq > 1) {
            lo_optSaveAdapter.set_saveExecDatas(this.ln_exec_seq, this.lo_saveExecDatas);
        }

        //轉換格式
        try {
            this.lo_apiFormater = await lo_optSaveAdapter.formating();
        }
        catch (err) {
            throw new Error(err);
        }
    }

    /**
     * 驗證(舊)API格式
     */
    async chkApiFormater() {
        let la_apiField = ["REVE-CODE", "program_id", "func_id", "athena_id", "hotel_cod", "user", "table_name", "count", "exec_data"];
        _.every(la_apiField, ls_apiField => {
            if (_.isUndefined(this.lo_apiFormater[ls_apiField]) || this.lo_apiFormater[ls_apiField].trim() == "") {
                throw new Error("api format error");
            }
        });
    }
}

/**
 * 儲存工廠
 * @param type {string} 新舊格式
 * @returns {*}
 */
function factory(type) {
    let lo_saveDataModule;
    if (type == "newSaveFormat") {
        lo_saveDataModule = new newSaveDataProc();
    }
    else if (type == "oldSaveFormat") {
        lo_saveDataModule = new oldSaveDataProc();
    }
    return lo_saveDataModule;
}

exports.factory = factory;