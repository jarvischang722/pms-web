// import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'underscore';

Vue.use(Vuex);

const state = {
    gb_isCreateStatus: false,
    gb_isEditStatus: false,

    gs_custCod: "",

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
    }
};

const getters = {};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});


