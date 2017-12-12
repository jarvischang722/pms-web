// import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'underscore';

Vue.use(Vuex);

// root state object.
// each Vuex instance is just a single state tree.
const state = {
    allRoles: [],
    selRole: "",
    allStaff: []
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
    },
    setAllStaff(state, treeData) {
        state.allStaff = treeData;
    },
    updateStaffOfRole(state, la_staffOfRole){
        state.allStaff = la_staffOfRole;
    }
}

// actions are functions that cause side effects and can involve
// asynchronous operations.
const actions = {
    //取全部角色
    qryAllRoles({dispatch, commit}) {
        $.post("/api/getAllRoles", function (result) {
            commit("setAllRoles", result.roles);
            commit("setSelRole", result.roles[0].role_id);
            dispatch("qryRoleOfAccounts", result.roles[0].role_id);
        });
    },
    //選擇角色觸發Event
    changeRoleEvent({dispatch, commit}, role_id) {
        commit("setSelRole", role_id);
        dispatch("qryRoleOfAccounts", role_id);
    },
    //取得角色對應之全部帳號
    qryRoleOfAccounts({commit}, role_id) {
        $.post("/api/getRoleOfAccounts", {role_id: role_id}, function (result) {
            commit("setAllStaff", result.accounts);
        });
    }
}

// getters are functions
const getters = {
    allRoles: state => state.allRoles,
    selRole: state => state.selRole,
    staffOfRole: state => {
        let staffOfRole = [];

        _.each(state.allStaff, function (eachStaff) {
            if (eachStaff.role_id == state.selRole) {
                staffOfRole.push(eachStaff.user_id);
            }
        });

        return staffOfRole;
    }
}

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});
