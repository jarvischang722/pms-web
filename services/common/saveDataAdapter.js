/**
 * Created by kaiyue on 2017/10/22.
 * 作業儲存轉接器
 */

const _ = require("underscore");
const moment = require("moment");
const mongoAgent = require("../../plugins/mongodb");
const commonTools = require("../../utils/CommonTools");
const ruleAgent = require("../../ruleEngine/ruleAgent");

class saveDataAdapter {
    constructor(postData, session) {
        this.session = session;
        this.params = {
            prg_id: postData.prg_id,
            func_id: postData.func_id,
            createData: postData.tmpCUD.createData || [],
            updateData: postData.tmpCUD.updateData || [],
            deleteData: postData.tmpCUD.deleteData || [],
            oriData: postData.tmpCUD.oriData || []
        };
    }

    /**
     * 組API格式流程
     * @returns {Promise<{locale, reve_code, prg_id, func_id, client_ip, server_ip, event_time, mac, page_data}|*>}
     */
    async formating() {
        // let lo_apiFormat = this.apiFormat();
        try {
            // 為tmpCUD給action_cod
            await Promise.all([
                this.insertAction("createData"),
                this.insertAction("updateData"),
                this.insertAction("deleteData")
            ]);
            // 查詢templateRf, UIDatagridField, UIPageField
            let [la_tmpRf, la_dgFields, la_gsFields] = await Promise.all([
                this.qryTemplateRf(),
                this.qryUIDataGridFields(),
                this.qryUIPageFields()
            ]);
            // 查詢key值
            let {la_dgKeyFields, la_gsKeyFields} = await this.findFieldsCondition(la_dgFields, la_gsFields);
            await this.insertCondIntoTmpCUD(la_tmpRf, la_dgKeyFields, la_gsKeyFields);
            let lo_page_data = await this.formatData();
            let lo_apiFormat = this.apiFormat();
            lo_apiFormat.page_data = lo_page_data;
            return lo_apiFormat;
        }
        catch (err) {
            throw err;
        }
    }

    /**
     * 查詢templateRf
     * @returns {Promise<*>}
     */
    async qryTemplateRf() {
        return await mongoAgent.TemplateRf.find({prg_id: this.params.prg_id}).exec().then(data => {
            return commonTools.mongoDocToObject(data);
        }).catch(err => {
            throw new Error(err);
        });
    }

    /**
     * 查詢datagrid欄位
     * @returns {Promise<*>}
     */
    async qryUIDataGridFields() {
        return await mongoAgent.UIDatagridField.find({prg_id: this.params.prg_id}).exec().then(data => {
            return commonTools.mongoDocToObject(data);
        }).catch(err => {
            throw new Error(err);
        })
    }

    /**
     * 查詢gridsingle欄位
     * @returns {Promise<*>}
     */
    async qryUIPageFields() {
        return await mongoAgent.UIPageField.find({prg_id: this.params.prg_id}).exec().then(data => {
            return commonTools.mongoDocToObject(data);
        }).catch(err => {
            throw new Error(err);
        })
    }

    /**
     * 查詢欄位key值
     * @param dgFields {array} datagrid欄位資料
     * @param gsFields {array} gridsingle欄位資料
     * @returns {Promise<{la_dgKeyFields: *, la_gsKeyFields: *}>}
     */
    async findFieldsCondition(dgFields, gsFields) {
        let la_dgKeyFields = _.where(dgFields, {keyable: "Y"});
        let la_gsKeyFields = _.where(gsFields, {keyable: "Y"});
        return {la_dgKeyFields: la_dgKeyFields, la_gsKeyFields: la_gsKeyFields};
    }

    /**
     * tmpCUD組conditions流程
     * @param tmpRf {array} templateRf資料
     * @param dgKeyFields {array} datagrid欄位為key值資料
     * @param gsKeyFields {array} gridsingle欄位為key值資料
     * @returns {Promise<[any , any , any]>}
     */
    async insertCondIntoTmpCUD(tmpRf, dgKeyFields, gsKeyFields) {
        return await Promise.all([
            this.execInsertCond(tmpRf, dgKeyFields, gsKeyFields, "createData"),
            this.execInsertCond(tmpRf, dgKeyFields, gsKeyFields, "updateData"),
            this.execInsertCond(tmpRf, dgKeyFields, gsKeyFields, "deleteData")
        ])
    }

    /**
     * 將tmpCUD每筆資料組conditions
     * @param tmpRf {array} templateRf資料
     * @param dgKeyFields {array} datagrid欄位為key值資料
     * @param gsKeyFields {array} gridsingle欄位為key值資料
     * @param dataType {string} 新刪修資料判斷
     * @returns {Promise<{}>}
     */
    async execInsertCond(tmpRf, dgKeyFields, gsKeyFields, dataType) {
        let la_tmpCudData = this.params[dataType];
        if (la_tmpCudData.length > 0) {
            try {
                _.each(la_tmpCudData, (lo_tmpCudData, index) => {
                    let ls_template_id = _.findWhere(tmpRf, {
                        page_id: Number(lo_tmpCudData.page_id),
                        tab_page_id: Number(lo_tmpCudData.tab_page_id)
                    }).template_id;

                    if (ls_template_id.toLocaleLowerCase() == "special") {
                        let ls_rule_func_name = `${this.params.prg_id}_templateRf`;
                        ls_template_id = ruleAgent[ls_rule_func_name](lo_tmpCudData.page_id, lo_tmpCudData.tab_page_id);
                    }
                    let la_keyFields = ls_template_id.toLocaleLowerCase() == "datagrid" ? dgKeyFields : gsKeyFields;

                    let la_filterKeyFieldsByPageIdTabPageId = _.where(la_keyFields, {
                        page_id: Number(lo_tmpCudData.page_id),
                        tab_page_id: Number(lo_tmpCudData.tab_page_id)
                    });
                    lo_tmpCudData.conditions = {};
                    _.each(la_filterKeyFieldsByPageIdTabPageId, lo_keyField => {
                        let la_condData = lo_tmpCudData.action == "U" ? this.params.oriData[index] : lo_tmpCudData;
                        if (!_.isUndefined(lo_tmpCudData[lo_keyField.ui_field_name]) && !_.isUndefined(la_condData[lo_keyField.ui_field_name])) {
                            lo_tmpCudData.conditions[lo_keyField.ui_field_name] = la_condData[lo_keyField.ui_field_name];
                        }
                        else {
                            throw (`${dataType} ${lo_keyField.ui_field_name} is key, not found`);
                        }
                    });
                });
                return {};
            }
            catch (err) {
                throw new Error(err);
            }
        }
        else {
            return {};
        }
    }

    /**
     * 組API格式
     * @returns {Promise<{}>}
     */
    async formatData() {
        let la_tmpCud = _.union(this.params.createData, this.params.updateData, this.params.deleteData);
        //group page_id
        let lo_groupByPageId = _.groupBy(la_tmpCud, "page_id");
        let lo_groupByTabPgaeId = {};

        let lo_page_data = {};
        //group tab_page_id and
        _.each(lo_groupByPageId, (la_groupByPageId, ln_page_id) => {
            lo_page_data[ln_page_id] = {
                tabs_data: {}
            };

            lo_groupByTabPgaeId[ln_page_id] = _.groupBy(la_groupByPageId, "tab_page_id");
            _.each(lo_groupByTabPgaeId[ln_page_id], (la_groupByTabPageId, ln_tab_page_id) => {
                lo_page_data[ln_page_id].tabs_data[ln_tab_page_id] = [];
                _.each(la_groupByTabPageId, lo_data => {
                    lo_data = _.extend(lo_data, this.getCommonDefaultData(lo_data));
                    lo_page_data[ln_page_id].tabs_data[ln_tab_page_id].push(lo_data);
                });
                //依照event_time排續
                lo_page_data[ln_page_id].tabs_data[ln_tab_page_id] = _.sortBy(lo_page_data[ln_page_id].tabs_data[ln_tab_page_id], lo_data => {
                    return lo_data.event_time;
                });
                //給seq順序
                _.each(lo_page_data[ln_page_id].tabs_data[ln_tab_page_id], (lo_tabPageData, seq) => {
                    lo_tabPageData.seq = seq + 1;
                });
            });
        });

        return lo_page_data;
    }

    /**
     * 新增action代碼: C, U, D
     * @returns {Promise<void>}
     */
    async insertAction(dataType) {
        let ls_action = "";
        if (dataType == "createData") {
            ls_action = "C";
        }
        else if (dataType == "updateData") {
            ls_action = "U";
        }
        else if (dataType == "deleteData") {
            ls_action = "D";
        }
        else {
            throw new Error("dataType not found");
        }
        _.each(this.params[dataType], (lo_Data, index) => {
            this.params[dataType][index].action = ls_action;
        });
    }

    getCommonDefaultData(saveData) {
        if (_.isUndefined(this.session)) {
            return {};
        }
        if (saveData.action == "C") {
            return {
                athena_id: this.session.user.athena_id,
                hotel_cod: this.session.user.fun_hotel_cod,
                ins_usr: this.session.user.usr_id,
                ins_dat: moment().format(),
                upd_usr: this.session.user.usr_id,
                upd_dat: moment().format()
            };
        }
        else {
            delete saveData["ins_dat"];
            delete saveData["ins_usr"];
            return {
                athena_id: this.session.user.athena_id,
                hotel_cod: this.session.user.fun_hotel_cod,
                upd_usr: this.session.user.usr_id,
                upd_dat: moment().format()
            };
        }
    }

    apiFormat() {
        return {
            locale: this.session.locale,
            reve_code: this.params.prg_id,
            prg_id: this.params.prg_id,
            func_id: this.params.func_id,
            client_ip: "",
            server_ip: "",
            event_time: moment().format(),
            mac: "",
            page_data: {}
        }
    }
}

module.exports = saveDataAdapter;