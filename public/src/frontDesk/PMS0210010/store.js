// import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    gb_isCreateStatus: false,
    gb_isEditStatus: false
};

const mutations = {
    //設定狀態(新增或編輯)
    setStatus(state, payload) {
        state.gb_isCreateStatus = payload.gb_isCreateStatus;
        state.gb_isEditStatus = payload.gb_isEditStatus;
    }
};

const actions = {
    //設定狀態(新增或編輯)
    setStatus({commit}, payload) {
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