// import Vue from 'vue';
import Vuex from 'vuex';
import _ from "underscore";

Vue.use(Vuex);

const state = {
    gb_isCreateStatus: false,
    gb_isEditStatus: false,
    gb_isDeleteStatus: false,

    gs_gcustCod: "",

    go_profileSingleData: {},
    go_oriProfileSingleData: {},

    ga_shopInfoFieldsData: [],
    ga_shopInfoRows: [],
    ga_visitHistoryFieldsData: [],
    ga_visitHistoryRows: [],

    ga_emailFieldsData: [],
    ga_contactFieldsData: [],
    ga_addressFieldsData: [],
    ga_emailDataGridRowsData: [],
    ga_contactDataGridRowsData: [],
    ga_addressDataGridRowsData: [],
    ga_oriEmailDataGridRowsData: [],
    ga_oriContactDataGridRowsData: [],
    ga_oriAddressDataGridRowsData: [],
    go_emailTmpCUD: {},
    go_contactTmpCUD: {},
    go_addressTmpCUD: {}
};

const mutations = {
    //清除所有資料
    setAllDataClear(state) {
        state.gb_isCreateStatus = false;
        state.gb_isEditStatus = false;
        state.gb_isDeleteStatus = false;
        state.gs_gcustCod = "";
        state.go_profileSingleData = {};
        state.go_oriProfileSingleData = {};
        state.ga_shopInfoFieldsData = [];
        state.ga_shopInfoRows = [];
        state.ga_visitHistoryFieldsData = [];
        state.ga_visitHistoryRows = [];
        state.ga_emailFieldsData = [];
        state.ga_contactFieldsData = [];
        state.ga_addressFieldsData = [];
        state.ga_emailDataGridRowsData = [];
        state.ga_contactDataGridRowsData = [];
        state.ga_addressDataGridRowsData = [];
        state.ga_oriEmailDataGridRowsData = [];
        state.ga_oriContactDataGridRowsData = [];
        state.ga_oriAddressDataGridRowsData = [];
        state.go_emailTmpCUD = {};
        state.go_contactTmpCUD = {};
        state.go_addressTmpCUD = {};
    },
    //設定狀態(新增或編輯)
    setStatus(state, payload) {
        state.gb_isCreateStatus = payload.gb_isCreateStatus;
        state.gb_isEditStatus = payload.gb_isEditStatus;
    },
    //設定住客歷史系統編號
    setGcustCod(state, ls_gcustCod) {
        state.gs_gcustCod = ls_gcustCod;
    },
    //設定刪除狀態
    setDeleteStatus(state, payload) {
        state.gb_isDeleteStatus = payload.gb_isDeleteStatus;
    },
    //設定基本資料
    setProfileData(state, payload) {
        state.go_profileSingleData = payload.go_profileSingleData;
        state.go_oriProfileSingleData = payload.go_oriProfileSingleData;
    },
    //設定來館資料
    setVisitsData(state, payload) {
        state.ga_shopInfoFieldsData = payload.ga_shopInfoFieldsData;
        state.ga_shopInfoRows = payload.ga_shopInfoRows;
        state.ga_visitHistoryFieldsData = payload.ga_visitHistoryFieldsData;
        state.ga_visitHistoryRows = payload.ga_visitHistoryRows;
    },
    //設定其他聯絡欄位資料
    setOtherContactFieldsData(state, payload) {
        state.ga_emailFieldsData = payload.ga_emailFieldsData;
        state.ga_contactFieldsData = payload.ga_contactFieldsData;
        state.ga_addressFieldsData = payload.ga_addressFieldsData;
    },
    //設定email資料
    setEmailDataGridRowsData(state, payload) {
        state.ga_emailDataGridRowsData = payload.ga_emailDataGridRowsData;
        state.ga_oriEmailDataGridRowsData = payload.ga_oriEmailDataGridRowsData;
        state.go_emailTmpCUD = payload.go_emailTmpCUD;
    },
    //設定聯絡資料
    setContactDataGridRowsData(state, payload) {
        state.ga_contactDataGridRowsData = payload.ga_contactDataGridRowsData;
        state.ga_oriContactDataGridRowsData = payload.ga_oriContactDataGridRowsData;
        state.go_contactTmpCUD = payload.go_contactTmpCUD;
    },
    //設定地址資料
    setAddressDataGridRowsData(state, payload) {
        state.ga_addressDataGridRowsData = payload.ga_addressDataGridRowsData;
        state.ga_oriAddressDataGridRowsData = payload.ga_oriAddressDataGridRowsData;
        state.go_addressTmpCUD = payload.go_addressTmpCUD;
    }
};

const actions = {
    //設定狀態(新增或編輯)
    setStatus({commit}, payload) {
        commit("setStatus", payload);
    },
    //設定住客歷史系統編號
    setGcustCod({commit}, ls_gcustCod) {
        commit("setGcustCod", ls_gcustCod);
    },
    //設定刪除狀態
    setDeleteStatus({commit}, payload) {
        commit("setDeleteStatus", payload);
    },
    //設定基本資料
    setProfileData({commit}, payload) {
        commit("setProfileData", payload);
    },
    //設定來館資料
    setVisitsData({commit}, payload) {
        commit("setVisitsData", payload);
    },
    //設定其他聯絡欄位資料
    setOtherContactFieldsData({commit}, payload) {
        commit("setOtherContactFieldsData", payload);
    },
    //設定其email資料
    setEmailDataGridRowsData({commit}, payload) {
        commit("setEmailDataGridRowsData", payload);
    },
    //設定其聯絡資料
    setContactDataGridRowsData({commit}, payload) {
        commit("setContactDataGridRowsData", payload);
    },
    //設定其地址資料
    setAddressDataGridRowsData({commit}, payload) {
        commit("setAddressDataGridRowsData", payload);
    },
    //儲存基本資料
    async doSaveProfileData({commit, dispatch, state}) {
        let err = null;
        let lo_tmpCUD = {
            createData: [],
            updateData: [],
            deleteData: [],
            oriData: []
        };
        let ls_funcId = "";
        let lo_saveData = JSON.parse(JSON.stringify(state.go_profileSingleData));

        lo_saveData["cust_idx.birth_dat"] = _.isUndefined(lo_saveData["cust_idx.birth_dat"]) || _.isNull(lo_saveData["cust_idx.birth_dat"]) ? "" : moment(lo_saveData["cust_idx.birth_dat"]).format("YYYY/MM/DD");
        lo_saveData["sex_typ"] = _.isNull(lo_saveData["sex_typ"]) ? lo_saveData["cust_idx.sex_typ"] : lo_saveData["sex_typ"];
        lo_saveData = _.extend(lo_saveData, {tab_page_id: 1});

        if (state.gb_isCreateStatus) {
            lo_tmpCUD.createData.push(lo_saveData);
            ls_funcId = "0200";
        }
        else if (state.gb_isEditStatus) {
            if (state.gb_isDeleteStatus) {
                lo_tmpCUD.deleteData.push(lo_saveData);
                ls_funcId = "0300";
            }
            else {
                lo_tmpCUD.updateData.push(lo_saveData);
                lo_tmpCUD.oriData.push(_.extend(state.go_oriProfileSingleData, {tab_page_id: 1}));
                ls_funcId = "0400";
            }
        }

        console.log(lo_tmpCUD);
        // return {success: true};
        return await $.post('/api/doOperationSave', {
            prg_id: 'PMS0210011',
            page_id: 1,
            func_id: ls_funcId,
            trans_cod: 'PMS0210011',
            tmpCUD: lo_tmpCUD
        }).then(result => {
            return (result);
        });
    },
    //儲存其他聯絡資料
    async doSaveOtherContactData({commit, dispatch, state}) {
        let err = null;
        let lo_tmpCUD = {
            dt_createData: [],
            dt_updateData: [],
            dt_deleteData: [],
            dt_oriData: []
        };
        let ls_funcId = "";

        if (state.gb_isCreateStatus) {
            ls_funcId = "0200";
            _.each(state.go_emailTmpCUD.createData, function (lo_createData) {
                lo_tmpCUD.dt_createData.push(lo_createData);
            });
            _.each(state.go_contactTmpCUD.createData, function (lo_createData) {
                let lo_saveCreateData = JSON.parse(JSON.stringify(lo_createData));
                _.each(lo_saveCreateData, (val, key) => {
                    let la_keySplit = key.split(".");
                    let ls_field_name = la_keySplit[1];
                    if (!_.isUndefined(ls_field_name)) {
                        lo_saveCreateData[ls_field_name] = val;
                        delete lo_saveCreateData[key];
                    }
                });
                lo_tmpCUD.dt_createData.push(lo_saveCreateData);
            });
            _.each(state.go_addressTmpCUD.createData, function (lo_createData) {
                let lo_saveCreateData = JSON.parse(JSON.stringify(lo_createData));
                _.each(lo_saveCreateData, (val, key) => {
                    let la_keySplit = key.split(".");
                    let ls_field_name = la_keySplit[1];
                    if (!_.isUndefined(ls_field_name)) {
                        lo_saveCreateData[ls_field_name] = val;
                        delete lo_saveCreateData[key];
                    }
                });
                lo_tmpCUD.dt_createData.push(lo_saveCreateData);
            });
        }
        else if (state.gb_isEditStatus) {
            if (!state.gb_isDeleteStatus) {
                ls_funcId = "0400";
                _.each(state.go_emailTmpCUD.createData, function (lo_createData) {
                    lo_tmpCUD.dt_createData.push(lo_createData);
                });
                _.each(state.go_contactTmpCUD.createData, function (lo_createData) {
                    let lo_saveCreateData = JSON.parse(JSON.stringify(lo_createData));
                    _.each(lo_saveCreateData, (val, key) => {
                        let la_keySplit = key.split(".");
                        let ls_field_name = la_keySplit[1];
                        if (!_.isUndefined(ls_field_name)) {
                            lo_saveCreateData[ls_field_name] = val;
                            delete lo_saveCreateData[key];
                        }
                    });
                    lo_tmpCUD.dt_createData.push(lo_saveCreateData);
                });
                _.each(state.go_addressTmpCUD.createData, function (lo_createData) {
                    let lo_saveCreateData = JSON.parse(JSON.stringify(lo_createData));
                    _.each(lo_saveCreateData, (val, key) => {
                        let la_keySplit = key.split(".");
                        let ls_field_name = la_keySplit[1];
                        if (!_.isUndefined(ls_field_name)) {
                            lo_saveCreateData[ls_field_name] = val;
                            delete lo_saveCreateData[key];
                        }
                    });
                    lo_tmpCUD.dt_createData.push(lo_saveCreateData);
                });

                _.each(state.go_emailTmpCUD.updateData, function (lo_updateData) {
                    lo_tmpCUD.dt_updateData.push(lo_updateData);
                });
                _.each(state.go_contactTmpCUD.updateData, function (lo_updateData) {
                    let lo_saveUpdateData = JSON.parse(JSON.stringify(lo_updateData));
                    _.each(lo_saveUpdateData, (val, key) => {
                        let la_keySplit = key.split(".");
                        let ls_field_name = la_keySplit[1];
                        if (!_.isUndefined(ls_field_name)) {
                            lo_saveUpdateData[ls_field_name] = val;
                            delete lo_saveUpdateData[key];
                        }
                    });
                    lo_tmpCUD.dt_updateData.push(lo_saveUpdateData);
                });
                _.each(state.go_addressTmpCUD.updateData, function (lo_updateData) {
                    let lo_saveUpdateData = JSON.parse(JSON.stringify(lo_updateData));
                    _.each(lo_saveUpdateData, (val, key) => {
                        let la_keySplit = key.split(".");
                        let ls_field_name = la_keySplit[1];
                        if (!_.isUndefined(ls_field_name)) {
                            lo_saveUpdateData[ls_field_name] = val;
                            delete lo_saveUpdateData[key];
                        }
                    });
                    lo_tmpCUD.dt_updateData.push(lo_saveUpdateData);
                });
                _.each(state.go_emailTmpCUD.oriData, function (lo_oriData) {
                    lo_tmpCUD.dt_oriData.push(lo_oriData);
                });
                _.each(state.go_contactTmpCUD.oriData, function (lo_oriData) {
                    let lo_saveOriData = JSON.parse(JSON.stringify(lo_oriData));
                    _.each(lo_saveOriData, (val, key) => {
                        let la_keySplit = key.split(".");
                        let ls_field_name = la_keySplit[1];
                        if (!_.isUndefined(ls_field_name)) {
                            lo_saveOriData[ls_field_name] = val;
                            delete lo_saveOriData[key];
                        }
                    });
                    lo_tmpCUD.dt_oriData.push(lo_saveOriData);
                });
                _.each(state.go_addressTmpCUD.oriData, function (lo_oriData) {
                    let lo_saveOriData = JSON.parse(JSON.stringify(lo_oriData));
                    _.each(lo_saveOriData, (val, key) => {
                        let la_keySplit = key.split(".");
                        let ls_field_name = la_keySplit[1];
                        if (!_.isUndefined(ls_field_name)) {
                            lo_saveOriData[ls_field_name] = val;
                            delete lo_saveOriData[key];
                        }
                    });
                    lo_tmpCUD.dt_oriData.push(lo_saveOriData);
                });
            }
        }

        // console.log(lo_tmpCUD);
        // return {success: true};
        return await $.post('/api/doOperationSave', {
            prg_id: 'PMS0210011',
            page_id: 1040,
            func_id: ls_funcId,
            trans_cod: 'PMS0210011',
            tmpCUD: lo_tmpCUD
        }).then(result => {
            return (result);
        });
    },
    //清除所有資料
    setAllDataClear({commit}) {
        commit("setAllDataClear");
    }
};

const getters = {};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});