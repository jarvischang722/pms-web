import Vuex from 'vuex';

Vue.use(Vuex);

const state = {
    gs_openModule: ""
};
const mutations = {
    setOpenModule(state, payload) {
        state.gs_openModule = payload.openModule;
    }
};
const actions = {
//設定使用者資訊
    setOpenModule({commit}, payload) {
        commit("setOpenModule", payload);
    }
};
const getters = {};

export const orderMnModule = {
    namespaced: true,
    state: state,
    mutations: mutations,
    actions: actions,
    getters: getters
};