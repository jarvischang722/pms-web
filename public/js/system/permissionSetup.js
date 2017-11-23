/**
 *  程式編號: SYS0110010
 *  程式名稱: 權限設定
 */

var authorNavbar = Vue.extend({
    template: "#authorNavbarTmp"
});

var authStaff = Vue.extend({
    template: "#authStaffTmp",
    components: {
        authorNavbar
    }
});

var authFunc = Vue.extend({
    template: "#authFuncTmp",
    components: {
        authorNavbar
    }
});

var authRole = Vue.extend({
    template: "#authRoleTmp",
    components: {
        authorNavbar
    }
});

var PermissionVM = new Vue({
    el: "#permission-app",
    components: {
        authStaff,
        authFunc,
        authRole
    },
    mounted: function () {
        // this.getAllRoles();
        // this.getCompGrp();
        // this.fetchUserInfo();
    },
    data: {
        isLoading: false,
        prg_id: "SYS0110010",
        userInfo: {},
        role_id: "",
        ga_roles: [],
        ga_roleOfAccount: [],
        ga_compGrpList: [],
        compGrpList4Tree: [],
        treeIns: {},
        tmpCUD: {
            createData: [],
            updateData: [],
            deleteData: []
        }
    }
    // watch: {
    //     role_id: function (newRoleId) {
    //         this.changeRoleEvent(newRoleId);
    //     }
    // },
    // methods: {
    //     //取得使用者資料
    //     fetchUserInfo: function () {
    //         $.post('/api/getUserInfo', function (result) {
    //             if (result.success) {
    //                 PermissionVM.userInfo = result.userInfo;
    //             }
    //         });
    //     },
    //     initTemCUD: function () {
    //         this.tmpCUD = {
    //             createData: [],
    //             updateData: [],
    //             deleteData: []
    //         };
    //     },
    //     //取全部角色
    //     getAllRoles: function () {
    //         $.post("/api/getAllRoles", function (result) {
    //             PermissionVM.ga_roles = result.roles;
    //
    //         });
    //     },
    //     //撈取公司組別
    //     getCompGrp: function () {
    //         $.post("/api/getCompGrp", function (result) {
    //             PermissionVM.ga_compGrpList = result.compGrpList;
    //             PermissionVM.combineCompGrpTree();
    //             PermissionVM.createAccountTree();
    //         });
    //     },
    //     //選擇角色觸發Event
    //     changeRoleEvent: function (role_id) {
    //         this.getRoleOfAccounts(role_id, function () {
    //             PermissionVM.updateAccountChkedTree();
    //         });
    //     },
    //     //取得角色對應之全部帳號
    //     getRoleOfAccounts: function (role_id, cb) {
    //         $.post("/api/getRoleOfAccounts", {role_id: role_id}, function (result) {
    //             PermissionVM.ga_roleOfAccount = result.accounts;
    //             cb();
    //         });
    //     },
    //     //更新目標角色對應的帳號標示在Tree上
    //     updateAccountChkedTree: function () {
    //         this.treeIns.uncheck_all();
    //         _.each(this.ga_roleOfAccount, function (account) {
    //             PermissionVM.treeIns.check_node("#" + account.user_id);
    //         });
    //     },
    //     //組合tree的格式給tree
    //     combineCompGrpTree: function () {
    //         this.compGrpList4Tree = [{
    //             "id": this.ga_compGrpList[0].cmp_id,
    //             "parent": "#",
    //             "text": this.ga_compGrpList[0].cmp_name
    //         }];
    //         _.each(_.groupBy(this.ga_compGrpList, "grp_name"), function (la_accounts, grp_nam) {
    //             PermissionVM.compGrpList4Tree.push({
    //                 id: la_accounts[0].grp_id,
    //                 parent: la_accounts[0].cmp_id,
    //                 text: la_accounts[0].grp_name
    //             });
    //
    //             _.each(la_accounts, function (account) {
    //                 PermissionVM.compGrpList4Tree.push({
    //                     id: account.usr_id,
    //                     parent: account.grp_id,
    //                     text: account.usr_cname+"("+account.usr_id+")"
    //                 });
    //             });
    //         });
    //
    //
    //     },
    //     //創立一棵Tree
    //     createAccountTree: function () {
    //         $('#permissionAccountTree').jstree({
    //             "core": {
    //                 "animation": 0,
    //                 "themes": {"stripes": true},
    //                 "multiple": false,                  //不可多選
    //                 "check_callback": true,
    //                 "data": PermissionVM.compGrpList4Tree
    //             },
    //             "types": {
    //                 "#": {
    //                     "icon": "glyphicon glyphicon-file",
    //                     "max_children": 1,
    //                     "max_depth": 4,
    //                     "valid_children": ["root"]
    //                 },
    //                 "root": {
    //                     "icon": "glyphicon glyphicon-file",
    //                     "valid_children": ["default"]
    //                 },
    //                 "default": {
    //                     "valid_children": ["default", "file"]
    //                 },
    //                 "file": {
    //                     "icon": "glyphicon glyphicon-file",
    //                     "valid_children": []
    //                 }
    //             },
    //             "checkbox": {
    //                 "keep_selected_style": true,
    //                 "whole_node": false,
    //                 "tie_selection": false               // 選取時，false只會選到父節點，不會選到子結點
    //             },
    //             "plugins": ["search", "state", "types", "wholerow", "checkbox"]
    //         });
    //         this.treeIns = $("#permissionAccountTree").jstree(true);
    //         setTimeout(function () {
    //             PermissionVM.treeIns.uncheck_all();
    //             if (PermissionVM.ga_roles.length > 0) {
    //                 PermissionVM.role_id = PermissionVM.ga_roles[0].role_id;
    //             }
    //         }, 100);
    //
    //     },
    //     doSave: function () {
    //         this.compareUpdAccount();
    //         var params = {
    //             prg_id: this.prg_id,
    //             mainTableName: "bac_role_user",
    //             fieldData: [{ui_field_name: "role_athena_id", keyable: 'Y'},
    //                 {ui_field_name: "role_id", keyable: 'Y'},
    //                 {ui_field_name: "role_comp_cod", keyable: 'Y'},
    //                 {ui_field_name: "user_athena_id", keyable: 'Y'},
    //                 {ui_field_name: "user_comp_cod", keyable: 'Y'},
    //                 {ui_field_name: "user_id", keyable: 'Y'}],
    //             tmpCUD: this.tmpCUD
    //         };
    //         this.isLoading = true;
    //         $.post('/api/execSQLProcess', params, function (result) {
    //             PermissionVM.isLoading = false;
    //             if (result.success) {
    //                 PermissionVM.getRoleOfAccounts(PermissionVM.role_id, function () {
    //                     PermissionVM.updateAccountChkedTree();
    //                     PermissionVM.initTemCUD();
    //                 });
    //                 alert("儲存成功");
    //             } else {
    //                 alert(result.errorMsg);
    //             }
    //         });
    //
    //
    //     },
    //     compareUpdAccount: function () {
    //         var checkedAccounts = this.treeIns.get_checked(true);
    //         var oriRoleOfAccount = this.ga_roleOfAccount;
    //         checkedAccounts = _.filter(checkedAccounts, function (account) {
    //             return account.children.length == 0;
    //         });
    //
    //         //判斷新增
    //         _.each(checkedAccounts, function (account) {
    //             var chkExistIdx = _.findIndex(oriRoleOfAccount, {user_id: account.id});
    //             if (chkExistIdx == -1) {
    //                 PermissionVM.tmpCUD.createData.push({
    //                     role_athena_id: PermissionVM.userInfo.athena_id,
    //                     role_comp_cod: oriRoleOfAccount[0].role_comp_cod,
    //                     role_id: PermissionVM.role_id,
    //                     user_athena_id: PermissionVM.userInfo.athena_id,
    //                     user_comp_cod: oriRoleOfAccount[0].role_comp_cod,
    //                     user_id: account.id
    //                 });
    //             }
    //         });
    //
    //         //判斷刪除權限
    //         _.each(oriRoleOfAccount, function (account) {
    //             var chkExistIdx = _.findIndex(checkedAccounts, {id: account.user_id});
    //             if (chkExistIdx == -1) {
    //                 PermissionVM.tmpCUD.deleteData.push({
    //                     role_athena_id: PermissionVM.userInfo.athena_id,
    //                     role_comp_cod: account.role_comp_cod,
    //                     role_id: PermissionVM.role_id,
    //                     user_athena_id: PermissionVM.userInfo.athena_id,
    //                     user_comp_cod: account.role_comp_cod,
    //                     user_id: account.user_id
    //                 });
    //             }
    //         });
    //
    //     }
    // }
});
