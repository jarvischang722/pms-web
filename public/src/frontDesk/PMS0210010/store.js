// import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    gb_isCreateStatus: false,
    gb_isEditStatus: false,
    gs_gcustCod: ""
};

const mutations = {
    //設定狀態(新增或編輯)
    setStatus(state, payload) {
        state.gb_isCreateStatus = payload.gb_isCreateStatus;
        state.gb_isEditStatus = payload.gb_isEditStatus;
    },
    //設定住客歷史系統編號
    setGcustCod(state, ls_gcustCod) {
        state.gs_gcustCod = ls_gcustCod;
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
    }
};

const getters = {};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});