// import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'underscore';

Vue.use(Vuex);

const state = {
    gb_isCreateStatus: false,
    gb_isEditStatus: false,

    gs_custCod: "",

    go_mnSingleData: {},
    go_mnOriSingleData: {},
    go_rsSingleData: {},
    go_rsOriSingleData: {},
    ga_rpDataGridRowsData: [],
    go_rpOriDataGridRowsData: [],
    ga_ccDataGridRowsData: [],
    ga_ccOriDataGridRowsData: [],
    ga_remarkDataGridRowsData: [],
    ga_remarkOriDataGridRowsData: [],
    ga_vrDataGridRowsData: [],
    ga_vrOriDataGridRowsData: [],

    tmpCUD: {
        createData: [],
        updateData: [],
        deleteData: [],
        dt_createData: [],
        dt_updateData: [],
        dt_deleteData: []
    }
};

const mutations = {
    //設定狀態(新增或編輯)
    setStatus(state, payload) {
        state.gb_isCreateStatus = payload.gb_isCreateStatus;
        state.gb_isEditStatus = payload.gb_isEditStatus;
    },
    //設定公司編號
    setCustCod(state, ls_custCod) {
        state.gs_custCod = ls_custCod;
    },
    //設定主檔資料
    setMnSingleData(state, payload) {
        state.go_mnSingleData = payload.go_mnSingleData;
        state.go_mnOriSingleData = payload.go_mnOriSingleData;
    },
    //設定相關設定資料
    setRsSingleData(state, payload) {
        state.go_rsSingleData = payload.go_rsSingleData;
        state.go_rsOriSingleData = payload.go_rsOriSingleData;
    },
    //設定相關人員資料
    setRpDataGridRowsData(state, payload) {
        state.ga_rpDataGridRowsData = payload.ga_rpDataGridRowsData;
        state.ga_rpOriDataGridRowsData = payload.ga_rpOriDataGridRowsData;
    },
    //設定合約內容資料
    setCcDataGridRowsData(state, payload) {
        state.ga_ccDataGridRowsData = payload.ga_ccDataGridRowsData;
        state.go_ccOriDataGridRowsData = payload.go_ccOriDataGridRowsData;
    },
    //設定業務備註資料
    setRemarkDataGridRowsData(state, payload) {
        state.ga_remarkDataGridRowsData = payload.ga_remarkDataGridRowsData;
        state.go_remarkOriDataGridRowsData = payload.go_remarkOriDataGridRowsData;
    },
    //設定拜訪紀錄資料
    setVrDataGridRowsData(state, payload) {
        state.ga_vrDataGridRowsData = payload.ga_vrDataGridRowsData;
        state.ga_vrOriDataGridRowsData = payload.ga_vrOriDataGridRowsData;
    }
};

const actions = {
    //設定狀態(新增或編輯)
    setStatus({commit}, payload) {
        commit("setStatus", payload);
    },
    //設定公司編號
    setCustCod({commit}, ls_custCod) {
        commit("setCustCod", ls_custCod);
    },
    //設定主檔資料
    setMnSingleData({commit}, payload) {
        commit("setMnSingleData", payload);
    },
    //設定相關設定資料
    setRsSingleData({commit}, payload) {
        commit("setRsSingleData", payload);
    },
    //設定相關人員資料
    setRpDataGridRowsData({commit}, payload) {
        commit("setRpDataGridRowsData", payload);
    },
    //設定合約內容資料
    setCcDataGridRowsData({commit}, payload) {
        commit("setCcDataGridRowsData", payload);
    },
    //設定業務備註資料
    setRemarkDataGridRowsData({commit}, payload) {
        commit("setRemarkDataGridRowsData", payload);
    },
    //設定拜訪紀錄資料
    setVrDataGridRowsData({commit}, payload) {
        commit("setVrDataGridRowsData", payload);
    },
    //取得所有資料
    qryAllData({commit, dispatch, state}){
        return {success: true, funcList4Tree: state.go_mnSingleData};
    }
};

const getters = {};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});


