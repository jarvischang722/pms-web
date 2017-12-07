// import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

// root state object.
// each Vuex instance is just a single state tree.
const state = {
    allRoles: [],
    selRole: ""
}

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
    setAllRoles(state, allRoles) {
        state.allRoles = allRoles;
    },
    setSelRole(state, selRole) {
        state.selRole = selRole;
    }
}

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
    //取全部角色
    qryAllRoles({commit}) {
        return new Promise((resolve, reject) => {
            $.post("/api/getAllRoles", function (result) {
                commit("setAllRoles", result.roles);
                commit("setSelRole", result.roles[0].role_id);
                resolve();
            });
        });
    }
}

// getters are functions
const getters = {
    allRoles: state => state.allRoles,
    selRole: state => state.selRole
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});
