// import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'underscore';

Vue.use(Vuex);

const state = {
    gb_isCreateStatus: false,
    gb_isEditStatus: false,
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
    //設定狀態
    setStatus(state, payload){
        state.gb_isCreateStatus = payload.gb_isCreateStatus;
        state.gb_isEditStatus = payload.gb_isEditStatus;
    }
};

const actions = {
    //設定狀態
    setStatus({commit}, payload){
        commit("setStatus", payload);
    }
};

const getters = {};

export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});


