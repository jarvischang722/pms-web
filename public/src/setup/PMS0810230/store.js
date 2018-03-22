import Vuex from 'vuex';
import _ from 'underscore';

Vue.use(Vuex);

const state = {
    gb_isCreateStatus: false,
    gb_isEditStatus: false,

    gs_rateCod: "",

    //欄位資料
    ga_utFieldsData: [],

    //所有資料
    go_allData: {
        ga_utDataGridRowsData: []
    },
    //所有原始資料
    go_allOriData: {
        ga_utDataGridRowsData: []
    },

    go_utTmpCUD: {}
};

const mutations = {
    //設定狀態(新增或編輯)
    setStatus(state, payload) {
        state.gb_isCreateStatus = payload.gb_isCreateStatus;
        state.gb_isEditStatus = payload.gb_isEditStatus;
    },
    //設定房價編號
    setRateCod(state, ls_rateCod) {
        state.gs_rateCod = ls_rateCod;
    },
    //設定使用期間資料
    setUseTimeData(state, payload) {
        state.ga_utFieldsData = payload.ga_utFieldsData;
        state.go_allData.ga_utDataGridRowsData = payload.ga_utDataGridRowsData;
        state.go_allOriData.ga_utDataGridRowsData = payload.ga_utOriDataGridRowsData;
        state.go_utTmpCUD = payload.go_utTmpCUD;
    }
};

const actions = {
    //設定狀態(新增或編輯)
    setStatus({commit}, payload) {
        commit("setStatus", payload);
    },
    //設定房價編號
    setRateCod({commit}, ls_rateCod) {
        commit("setRateCod", ls_rateCod);
    },
    //設定使用期間資料
    setUseTimeData({commit}, payload) {
        commit("setUseTimeData", payload);
    },
    //清除所有資料
    setAllDataClear({dispatch}) {
        dispatch("setUseTimeData", {
            ga_utFieldsData: [],
            ga_utDataGridRowsData: [],
            ga_utOriDataGridRowsData: [],
            go_utTmpCUD: {}
        });
    }
};

const getters = {};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});