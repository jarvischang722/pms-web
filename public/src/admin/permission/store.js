// import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'underscore';

Vue.use(Vuex);

// root state object.
// each Vuex instance is just a single state tree.
const state = {
    permissionModel: "authByStaff",
    allRoles: [],
    selRole: "",
    staffOfRole: [],
    funcsOfRole: [],
    compGrpList: [],
    compGrpList4Tree: [],
    funcList: [],
    funcList4Tree: []
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
    setCompGrpList4Tree(state, la_compGrpList) {
        state.compGrpList4Tree = la_compGrpList;
    },
    setFuncList4Tree(state, la_funcList4Tree) {
        state.funcList4Tree = la_funcList4Tree
    },
    setStaffOfRole(state, la_staffOfRole) {
        state.staffOfRole = la_staffOfRole;
    },
    setFuncsOfRole(state, la_funcsOfRole){
        state.funcsOfRole = la_funcsOfRole;
    },
    setAllModules(state, la_funcList) {
        state.funcList = la_funcList;
    },
    setPermissionModel(state, ls_permissionModel){
        state.permissionModel = ls_permissionModel;
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
            dispatch("qryRoleOfFuncs", result.roles[0].role_id);
        });
    },

    /**
     * 取全部功能權限
     * @param commit
     */
    async qryFuncList({commit, dispatch, state}) {
        await $.post("/api/getAllFuncs").then((result) => {
            commit("setAllModules", result.funcList);
        });
        dispatch("combineFuncListTree");
        return state.funcList4Tree;
    },

    //選擇角色觸發Event
    changeRoleEvent({dispatch, commit}, role_id) {
        commit("setSelRole", role_id);
        dispatch("qryRoleOfAccounts", role_id);
        dispatch("qryRoleOfFuncs", role_id);
    },

    //取得角色對應之全部帳號
    async qryRoleOfAccounts({commit}, role_id) {
        await $.post("/api/getRoleOfAccounts", {role_id: role_id}).then((result) => {
            commit("setStaffOfRole", result.accounts);
        });
    },

    //抓取單一角色對應的功能權限
    async qryRoleOfFuncs({commit}, role_id) {
        await $.post("/api/getFuncsOfRole", {role_id: role_id}).then((result) => {
            commit("setFuncsOfRole", result.funcsOfRole);
        })
    },

    //撈取公司組別
    async qryCompGrp({dispatch, commit, state}) {
        await $.post("/api/getCompGrp").then((result) => {
            commit("setCompGrpList", result.compGrpList);
        });
        dispatch("combineCompGrpTree");
        return state.compGrpList4Tree;
    },

    //組合tree的格式給compGrpList4Tree
    combineCompGrpTree({commit, state}) {
        let la_compGrpList = state.compGrpList;
        let la_compGrpList4Tree = [];
        let lo_treeData = {
            id: la_compGrpList[0].cmp_id,
            parent: "#",
            text: la_compGrpList[0].cmp_name
        };
        la_compGrpList4Tree.push(lo_treeData);
        _.each(_.groupBy(la_compGrpList, "grp_name"), function (la_accounts, grp_nam) {

            lo_treeData = {
                id: la_accounts[0].grp_id,
                parent: la_accounts[0].cmp_id,
                text: la_accounts[0].grp_name
            }
            la_compGrpList4Tree.push(lo_treeData);

            _.each(la_accounts, function (account) {
                lo_treeData = {
                    id: account.usr_id,
                    parent: account.grp_id,
                    text: account.usr_cname + "(" + account.usr_id + ")"
                }
                la_compGrpList4Tree.push(lo_treeData);
            });
        });
        commit("setCompGrpList4Tree", la_compGrpList4Tree);
    },

    //組合tree的格式給funcList4Tree
    combineFuncListTree({commit, state}) {
        let la_funcList = state.funcList;
        let la_funcList4Tree = [];
        let ls_node_text = "";

        //system
        _.each(la_funcList, function (lo_funcList) {
            la_funcList4Tree.push(treeDataObj(lo_funcList.sys_id, "#", lo_funcList["sys_name_" + gs_locale]));

            //subSystem
            _.each(lo_funcList.subSys, function (lo_subSys) {
                ls_node_text = (lo_subSys["subsys_nam_" + gs_locale] == "") ? "(" + gs_locale + ")" + lo_subSys.subsys_nam : lo_subSys["subsys_nam_" + gs_locale];
                la_funcList4Tree.push(treeDataObj(lo_subSys.subsys_id, lo_subSys.sys_id, ls_node_text));

                //module
                _.each(lo_subSys.mdlMenu, function (lo_mdlMenu) {
                    la_funcList4Tree.push(treeDataObj(lo_mdlMenu.mdl_id, lo_subSys.subsys_id, lo_mdlMenu["mdl_name_" + gs_locale]));

                    //process
                    _.each(lo_mdlMenu.processMenu, function (lo_processMenu) {
                        la_funcList4Tree.push(treeDataObj(lo_processMenu.pro_id, lo_processMenu.mdl_id, lo_processMenu["pro_name_" + gs_locale]));
                    })

                })
            })
        });
        commit("setFuncList4Tree", la_funcList4Tree);
    }
}

function treeDataObj(id, parent, text) {
    let lo_treeData = {
        id: id,
        parent: parent,
        text: text
    };
    return lo_treeData;
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
