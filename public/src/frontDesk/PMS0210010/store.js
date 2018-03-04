// import Vue from 'vue';
import Vuex from 'vuex';
import _ from "underscore";

Vue.use(Vuex);

const state = {
    gb_isCreateStatus: false,
    gb_isEditStatus: false,

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
        var err = null;
        var lo_tmpCUD = {
            createData: [],
            updateData: [],
            deleteData: [],
            oriData: []
        };

        if (state.gb_isCreateStatus) {
            lo_tmpCUD.createData = state.go_profileSingleData;
        }
        else if (state.gb_isEditStatus) {
            lo_tmpCUD.updateData = state.go_profileSingleData;
            lo_tmpCUD.oriData = state.go_oriProfileSingleData;
        }

        // console.log(lo_tmpCUD);
        return lo_tmpCUD;

        // return await $.post('/api/doOperationSave', {
        //     prg_id: 'PMS0210011',
        //     page_id: 1,
        //     func_id: lo_tmpCUD.createData.length > 0 ? "0200" : "0400",
        //     trans_cod: 'PMS0210011',
        //     tmpCUD: lo_tmpCUD
        // }).then(result => {
        //     return (result);
        // });
    },
    //儲存其他聯絡資料
    async doSaveOtherContactData({commit, dispatch, state}) {
        var err = null;
        var lo_tmpCUD = {
            dt_updateData: [],
            dt_oriData: []
        };

        _.each(state.go_emailTmpCUD.updateData, function (lo_updateData) {
            lo_tmpCUD.dt_updateData.push(lo_updateData);
        });
        _.each(state.go_contactTmpCUD.updateData, function (lo_updateData) {
            lo_tmpCUD.dt_updateData.push(lo_updateData);
        });
        _.each(state.go_addressTmpCUD.updateData, function (lo_updateData) {
            lo_tmpCUD.dt_updateData.push(lo_updateData);
        });
        _.each(state.go_emailTmpCUD.oriData, function (lo_oriData) {
            lo_tmpCUD.dt_oriData.push(lo_oriData);
        });
        _.each(state.go_contactTmpCUD.oriData, function (lo_oriData) {
            lo_tmpCUD.dt_oriData.push(lo_oriData);
        });
        _.each(state.go_addressTmpCUD.oriData, function (lo_oriData) {
            lo_tmpCUD.dt_oriData.push(lo_oriData);
        });

        return lo_tmpCUD;
        // return await $.post('/api/doOperationSave', {
        //     prg_id: 'PMS0210011',
        //     page_id: 1040,
        //     func_id: '0400',
        //     trans_cod: 'PMS0210011',
        //     tmpCUD: lo_tmpCUD
        // }).then(result => {
        //     return (result);
        // });
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