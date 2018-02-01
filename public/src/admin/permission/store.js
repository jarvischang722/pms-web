// import Vue from 'vue';
import Vuex from 'vuex';
import _ from 'underscore';

Vue.use(Vuex);

// root state object.
// each Vuex instance is just a single state tree.
const state = {
    gs_permissionModel: "authByRole",

    ga_allRoles: [],
    gs_selRole: "",
    ga_checkedRoleList: [],
    ga_oriCheckedRoleList: [],

    ga_compGrpList: [],
    ga_compGrpList4Tree: [],
    ga_staffOfRole: [],
    gs_selectedUserId: null,
    go_staffTreeIns: null,

    ga_oriFuncList: [],
    ga_funcList: [],
    ga_funcList4Tree: [],
    ga_funcsOfRole: [],
    ga_funcChecked: [],
    ga_funcUnChecked: [],
    gs_selectedCurrentId: null,
    go_funcTreeIns: null,

    gb_isAuthUpdate: false,
    gb_isAuthCreate: false,
    gb_isAuthDelete: false,
    gb_isLoading: false,
    gb_isDialogShow: false,

    tmpCUD: {
        createData: [],
        updateData: [],
        deleteData: []
    }
};

// mutations are operations that actually mutates the state.
// each mutation handler gets the entire state tree as the
// first argument, followed by additional payload arguments.
// mutations must be synchronous and can be recorded by plugins
// for debugging purposes.
const mutations = {
    setAllRoles(state, ga_allRoles) {
        state.ga_allRoles = ga_allRoles;
    },
    setSelRole(state, gs_selRole) {
        state.gs_selRole = gs_selRole;
    },
    setCompGrpList(state, la_compGrpList) {
        state.ga_compGrpList = la_compGrpList;
    },
    setCompGrpList4Tree(state, la_compGrpList) {
        state.ga_compGrpList4Tree = la_compGrpList;
    },
    setFuncList4Tree(state, la_funcList4Tree) {
        state.ga_funcList4Tree = la_funcList4Tree
    },
    setStaffOfRole(state, la_staffOfRole) {
        state.ga_staffOfRole = la_staffOfRole;
    },
    setFuncsOfRole(state, la_funcsOfRole) {
        state.ga_funcsOfRole = la_funcsOfRole;
    },
    setAllModules(state, la_funcList) {
        state.ga_funcList = la_funcList;
    },
    setOriFuncList(state, la_oriFuncList){
        state.ga_oriFuncList = la_oriFuncList;
    },
    setPermissionModel(state, ls_permissionModel) {
        state.gs_permissionModel = ls_permissionModel;
    },
    setIsDialogShow(state, lb_isDialogShow) {
        state.gb_isDialogShow = lb_isDialogShow;
    },
    setStaffTreeIns(state, lo_staffTreeIns) {
        state.go_staffTreeIns = lo_staffTreeIns;
    },
    setFuncTreeIns(state, lo_funcTreeIns){
        state.go_funcTreeIns = lo_funcTreeIns;
    },
    // updFuncChecked(state, la_funcChecked) {
    //     state.ga_funcChecked = la_funcChecked;
    // },
    // updFuncUnChecked(state, la_funcUnChecked) {
    //     state.ga_funcUnChecked = la_funcUnChecked;
    // },
    checkedRoleList(state, la_checkedRoleList) {
        state.ga_checkedRoleList = la_checkedRoleList;
    },
    checkedOriRoleList(state, la_checkedRoleList) {
        state.ga_oriCheckedRoleList = la_checkedRoleList;
    },
    setSelectedUserID(state, ls_user_id) {
        state.gs_selectedUserId = ls_user_id;
    },
    setSelectedCurrentID(state, ls_current_id) {
        state.gs_selectedCurrentId = ls_current_id;
    },
    setIsAuthUpdate(state, lb_isAuthUpdate) {
        state.gb_isAuthUpdate = lb_isAuthUpdate;
    },
    setIsAuthCreate(state, lb_isAuthCreate) {
        state.gb_isAuthCreate = lb_isAuthCreate;
    },
    setIsAuthDelete(state, lb_isAuthDelete) {
        state.gb_isAuthDelete = lb_isAuthDelete;
    },
    setTmpCre(state, lo_createData) {
        state.tmpCUD.createData.push(lo_createData);
    },
    setTmpUpd(state, lo_updateData) {
        state.tmpCUD.updateData.push(lo_updateData);
    },
    setTmpDel(state, lo_deleteData) {
        state.tmpCUD.deleteData.push(lo_deleteData);
    },
    setIsLoading(state, lb_isLoading) {
        state.gb_isLoading = lb_isLoading;
    }
};

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
        return await $.post("/api/getAllFuncs").then(
            (result) => {
                if (result.success) {
                    commit("setOriFuncList", result.funcList);
                    commit("setAllModules", result.funcTreeData);
                    dispatch("combineFuncListTree");
                    return {success: true, funcList4Tree: state.ga_funcList4Tree};
                }
                else {
                    return {success: false, errMsg: result.errMsg};
                }
            },
            (err) => {
                return {success: false, errMsg: err};
            });
    },

    //選擇角色觸發Event
    async changeRoleEvent({dispatch, commit}, role_id) {
        commit("setSelRole", role_id);
        commit("setIsLoading", true);
        await dispatch("qryRoleOfAccounts", role_id);
        await dispatch("qryRoleOfFuncs", role_id);
        commit("setIsLoading", false);
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
        return state.ga_compGrpList4Tree;
    },

    qryRoleByUserID({commit, state}, user_id) {
        $.post("/api/qryRoleByUserID", {user_id: user_id}).then(
            result => {
                let la_checkedRole = [];
                _.each(result.roleList, function (lo_roleList) {
                    la_checkedRole.push(lo_roleList.role_id);
                });
                commit("checkedRoleList", la_checkedRole);
                commit("checkedOriRoleList", la_checkedRole);
            }
        )
    },

    qryRoleByCurrentID({commit}, lo_selectedNode) {
        $.post("/api/qryRoleByCurrentID", {current_id: lo_selectedNode.id, pre_id: lo_selectedNode.parent}).then(
            result => {
                commit("checkedRoleList", result.roleList);
                commit("checkedOriRoleList", result.roleList);
            },
            err => {
                alert(err);
                console.log(err);
            }
        )
    },

    //組合tree的格式給compGrpList4Tree
    combineCompGrpTree({commit, state}) {
        let la_compGrpList = state.ga_compGrpList;
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
            };
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
        let la_funcList = state.ga_funcList;
        let la_funcList4Tree = [];
        let ls_node_text = "";

        //system
        _.each(la_funcList, function (lo_funcList) {
            la_funcList4Tree.push(treeDataObj(lo_funcList.current_id, "#", lo_funcList["sys_name_" + gs_locale]));

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
                        //function
                        _.each(lo_processMenu.functionList, function (lo_functionList) {
                            let ls_id = lo_functionList.pre_id + "_" + lo_functionList.current_id;
                            la_funcList4Tree.push(treeDataObj(ls_id, lo_functionList.pre_id, lo_functionList["func_name_" + gs_locale]));
                        })
                    })

                })
            })
        });
        commit("setFuncList4Tree", la_funcList4Tree);
    },

    doSaveByRole({state, commit, dispatch}) {
        let la_staffAllChecked = state.go_staffTreeIns.get_checked();
        let la_funcAllChecked = state.go_funcTreeIns.get_checked();
        let la_funcList = state.ga_oriFuncList;
        let la_staffChecked = [];
        let la_staffUnChecked = [];

        console.log(la_funcList);
        return;

        //新增人員
        _.each(la_staffAllChecked, function (lo_staffAllChecked) {
            let ln_isOriExist = _.findIndex(state.ga_staffOfRole, function (lo_staffOfRole) {
                return lo_staffOfRole.user_id == lo_staffAllChecked;
            });

            if (ln_isOriExist == -1) {
                let lo_node = state.go_staffTreeIns.get_node(lo_staffAllChecked);
                if (lo_node.children.length == 0) {
                    console.log(lo_node.id);
                    la_staffChecked.push(lo_node);
                }
            }
        });
        //移除人員
        _.each(state.ga_staffOfRole, function (lo_staffOfRole) {
            let ln_isOriExist = _.findIndex(la_staffAllChecked, function (lo_staffAllChecked) {
                return lo_staffOfRole.user_id == lo_staffAllChecked;
            });

            if (ln_isOriExist == -1) {
                let lo_node = state.go_staffTreeIns.get_node(lo_staffOfRole.user_id);
                if (lo_node.children.length == 0) {
                    console.log(lo_node.id);
                    la_staffUnChecked.push(state.go_staffTreeIns.get_node(lo_staffOfRole.user_id));
                }
            }
        });



        let lo_params = {
            staffList: state.ga_compGrpList,
            staffChecked: la_staffChecked,
            staffUnChecked: la_staffUnChecked,
            funcChecked: state.ga_funcChecked,
            funcUnChecked: state.ga_funcUnChecked,
            selRole: state.gs_selRole
        };

        commit("setIsLoading", true);
        $.post("/api/saveAuthByRole", lo_params).then(
            result => {
                commit("setIsLoading", false);
                if (result.success) {
                    dispatch("changeRoleEvent", state.role_id);
                    alert("save success");
                }
                else {
                    alert(result.errMsg);
                }
            },
            err => {
                commit("setIsLoading", false);
                console.log(err);
            }
        );
    },

    doSaveByStaff({state, commit}) {
        let lo_params = {
            user_id: state.gs_selectedUserId,
            checkedRoleList: state.ga_checkedRoleList,
            oriCheckedRoleList: state.ga_oriCheckedRoleList,
            staffList: state.ga_compGrpList
        };
        $.post("/api/saveAuthByStaff", lo_params).then(
            result => {
                alert("save success");
            }
        )
    },

    doSaveByFunc({state, commit}) {
        let ls_id = state.gs_selectedCurrentId.id.indexOf("_") != -1 ? state.gs_selectedCurrentId.id.split("_")[1] : state.gs_selectedCurrentId.id;
        let lo_params = {
            pre_id: state.gs_selectedCurrentId.parent,
            current_id: ls_id,
            checkedRoleList: state.ga_checkedRoleList,
            oriCheckedRoleList: state.ga_oriCheckedRoleList
        };

        $.post("/api/saveAuthByFunc", lo_params).then(
            result => {
                alert("save success");
            }
        )
    }
};

function treeDataObj(id, parent, text) {
    let lo_treeData = {
        id: id,
        parent: parent,
        text: text
    };
    return lo_treeData;
}

// getters are functions
const getters = {};

// A Vuex instance is created by combining the state, mutations, actions,
// and getters.
export default new Vuex.Store({
    state,
    getters,
    actions,
    mutations
});
