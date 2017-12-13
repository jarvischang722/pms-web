// import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'underscore';

Vue.use(Vuex);

// root state object.
// each Vuex instance is just a single state tree.
const state = {
    allRoles: [],
    selRole: "",
    staffOfRole: [],
    compGrpList: [],
    compGrpList4Tree: []
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
    setCompGrpList(state, la_compGrpList) {
        state.compGrpList = la_compGrpList;
    },
    pushCompGrpList4Tree(state, lo_compGrpList) {
        state.compGrpList4Tree.push(lo_compGrpList);
    },
    setStaffOfRole(state, la_staffOfRole) {
        state.staffOfRole = la_staffOfRole;
    },
    updateStaffOfRole(state, ls_user_id) {
        console.log(ls_user_id);
        let userExist = _.findIndex(state.staffOfRole, {user_id: ls_user_id});
        if (userExist == -1) {
            state.staffOfRole.push(ls_user_id);
        }
        else {
            state.staffOfRole.splice(userExist, 0);
        }
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
    async qryRoleOfAccounts({commit}, role_id) {
        await $.post("/api/getRoleOfAccounts", {role_id: role_id}).then((result) => {
            commit("setStaffOfRole", result.accounts);
        });
    },
    //撈取公司組別
    async qryCompGrp({dispatch, commit, state}) {
        await $.post("/api/getCompGrp").then((result) => {
            commit("setCompGrpList", result.compGrpList);
            dispatch("combineCompGrpTree", result.compGrpList);
        });
        return state.compGrpList4Tree;
    },

    //組合tree的格式給tree
    combineCompGrpTree({commit}, la_compGrpList) {
        let lo_treeData = {
            id: la_compGrpList[0].cmp_id,
            parent: "#",
            text: la_compGrpList[0].cmp_name
        };
        commit("pushCompGrpList4Tree", lo_treeData);
        _.each(_.groupBy(la_compGrpList, "grp_name"), function (la_accounts, grp_nam) {

            lo_treeData = {
                id: la_accounts[0].grp_id,
                parent: la_accounts[0].cmp_id,
                text: la_accounts[0].grp_name
            }
            commit("pushCompGrpList4Tree", lo_treeData);

            _.each(la_accounts, function (account) {
                lo_treeData = {
                    id: account.usr_id,
                    parent: account.grp_id,
                    text: account.usr_cname + "(" + account.usr_id + ")"
                }
                commit("pushCompGrpList4Tree", lo_treeData);
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
