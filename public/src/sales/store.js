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
    setStatus(state, payload){
        state.gb_isCreateStatus = payload.gb_isCreateStatus;
        state.gb_isEditStatus = payload.gb_isEditStatus;
    },
    //設定公司編號
    setCustCod(state, ls_custCod){
        state.gs_custCod = ls_custCod;
    },
    //設定主檔資料
    setMnSingleData(state, payload){
        state.go_mnSingleData = payload.go_mnSingleData;
        state.go_mnOriSingleData = payload.go_mnOriSingleData;
    },
    //設定主檔資料
    setRelatedSettingSingleData(state, payload){
        state.go_mnSingleData = payload.go_mnSingleData;
        state.go_mnOriSingleData = payload.go_mnOriSingleData;
    }

};

const actions = {
    //設定狀態(新增或編輯)
    setStatus({commit}, payload){
        commit("setStatus", payload);
    },

    //設定公司編號
    setCustCod({commit}, ls_custCod){
        commit("setCustCod", ls_custCod);
    },

    //設定主檔資料
    setMnSingleData({commit}, payload){
        commit("setMnSingleData", payload);
    }
};

const getters = {};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});


