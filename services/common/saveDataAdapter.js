/**
 * Created by kaiyue on 2017/10/22.
 * 作業儲存轉接器
 */

const _ = require("underscore");
const moment = require("moment");
const mongoAgent = require("../../plugins/mongodb");
const commonRule = require("../../ruleEngine/rules/CommonRule");
const commonTools = require("../../utils/CommonTools");
const langSvc = require("../../services/LangService");
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

    async formating() {
        // let lo_apiFormat = this.apiFormat();
        try {
            let [la_tmpRf, la_dgFields, la_gsFields] = await Promise.all([
                this.qryTemplateRf(),
                this.qryUIDataGridFields(),
                this.qryUIPageFields()
            ]);
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

    async qryTemplateRf() {
        return await mongoAgent.TemplateRf.find({prg_id: this.params.prg_id}).exec().then(data => {
            return commonTools.mongoDocToObject(data);
        }).catch(err => {
            throw new Error(err);
        });
    }

    async qryUIDataGridFields() {
        return await mongoAgent.UIDatagridField.find({prg_id: this.params.prg_id}).exec().then(data => {
            return commonTools.mongoDocToObject(data);
        }).catch(err => {
            throw new Error(err);
        })
    }

    async qryUIPageFields() {
        return await mongoAgent.UIPageField.find({prg_id: this.params.prg_id}).exec().then(data => {
            return commonTools.mongoDocToObject(data);
        }).catch(err => {
            throw new Error(err);
        })
    }

    async findFieldsCondition(dgFields, gsFields) {
        let la_dgKeyFields = _.where(dgFields, {keyable: "Y"});
        let la_gsKeyFields = _.where(gsFields, {keyable: "Y"});
        return {la_dgKeyFields: la_dgKeyFields, la_gsKeyFields: la_gsKeyFields};
    }

    async insertCondIntoTmpCUD(tmpRf, dgKeyFields, gsKeyFields) {
        return await Promise.all([
            this.execInsertCond(tmpRf, dgKeyFields, gsKeyFields, "createData"),
            this.execInsertCond(tmpRf, dgKeyFields, gsKeyFields, "updateData"),
            this.execInsertCond(tmpRf, dgKeyFields, gsKeyFields, "deleteData")
        ])
    }

    async execInsertCond(tmpRf, dgKeyFields, gsKeyFields, dataType) {
        let la_tmpCudData = this.params[dataType];
        if (la_tmpCudData.length > 0) {
            try {
                _.each(la_tmpCudData, lo_tmpCudData => {
                    let ls_template_id = _.findWhere(tmpRf, {
                        page_id: lo_tmpCudData.page_id,
                        tab_page_id: lo_tmpCudData.tab_page_id
                    }).template_id;

                    if (ls_template_id.toLocaleLowerCase() == "special") {
                        let ls_rule_func_name = `${this.params.prg_id}_templateRf`;
                        ls_template_id = ruleAgent[ls_rule_func_name](lo_tmpCudData.page_id, lo_tmpCudData.tab_page_id);
                    }
                    let la_fields = ls_template_id.toLocaleLowerCase() == "datagrid" ? dgKeyFields : gsKeyFields;

                    let la_filterKeyFieldsByPageIdTabPageId = _.where(la_fields, {
                        page_id: lo_tmpCudData.page_id,
                        tab_page_id: lo_tmpCudData.tab_page_id
                    });
                    lo_tmpCudData.condition = {};
                    _.each(la_filterKeyFieldsByPageIdTabPageId, lo_keyField => {
                        if (!_.isUndefined(lo_tmpCudData[lo_keyField.ui_field_name])) {
                            lo_tmpCudData.condition[lo_keyField.ui_field_name] = lo_tmpCudData[lo_keyField.ui_field_name];
                        }
                    });
                });
                return {};
            }
            catch (err) {
                throw new Error(err);
            }
        }
        else{
            return {};
        }
    }

    async formatData() {
        await Promise.all([
            this.convCreateData(),
            this.convDeleteData(),
            this.convUpdateData()
        ]);
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

    async convCreateData() {
        _.each(this.params.createData, (lo_createData, index) => {
            this.params.createData[index].action = "C";
        });
    }

    async convDeleteData() {
        _.each(this.params.deleteData, (lo_deleteData, index) => {
            this.params.deleteData[index].action = "D";
        });
    }

    async convUpdateData() {
        _.each(this.params.updateData, (lo_updateData, index) => {
            this.params.updateData[index].action = "U";
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
            event_time: "",
            mac: "",
            page_data: {}
        }
    }
}

module.exports = saveDataAdapter;