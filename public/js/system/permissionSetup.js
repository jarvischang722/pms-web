/**
 *
 *  程式編號:
 *  程式名稱: 權限設定
 */
var PermissionVM = new Vue({
    el: "#permission-app",
    mounted: function () {
        this.getAllRoles();
        this.getCompGrp();
    },
    data: {
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
    },
    watch: {
        role_id: function (newRoleId) {
            this.changeRoleEvent(newRoleId);
        }
    },
    methods: {
        initTemCUD: function () {
            this.tmpCUD = {
                createData: [],
                updateData: [],
                deleteData: []
            };
        },
        //取全部角色
        getAllRoles: function () {
            $.post("/api/getAllRoles", function (result) {
                PermissionVM.ga_roles = result.roles;

            });
        },
        //撈取公司組別
        getCompGrp: function () {
            $.post("/api/getCompGrp", function (result) {
                PermissionVM.ga_compGrpList = result.compGrpList;
                PermissionVM.combineCompGrpTree();
                PermissionVM.createAccountTree();
                console.log(result);
            });
        },
        //選擇角色觸發Event
        changeRoleEvent: function (role_id) {
            this.getRoleOfAccounts(role_id, function () {
                PermissionVM.updateAccountChkedTree();
            });
        },
        //取得角色對應之全部帳號
        getRoleOfAccounts: function (role_id, cb) {
            $.post("/api/getRoleOfAccounts", {role_id: role_id}, function (result) {
                PermissionVM.ga_roleOfAccount = result.accounts;
                cb();
            });
        },
        //更新目標角色對應的帳號標示在Tree上
        updateAccountChkedTree: function () {
            this.treeIns.uncheck_all();

            _.each(this.ga_roleOfAccount, function (account) {
                PermissionVM.treeIns.check_node("#" + account.user_id);
            });
        },
        //組合tree的格式給tree
        combineCompGrpTree: function () {
            this.compGrpList4Tree = [{
                "id": this.ga_compGrpList[0].cmp_id,
                "parent": "#",
                "text": this.ga_compGrpList[0].cmp_name
            }];
            _.each(_.groupBy(this.ga_compGrpList, "grp_name"), function (la_accounts, grp_nam) {
                PermissionVM.compGrpList4Tree.push({
                    id: la_accounts[0].grp_id,
                    parent: la_accounts[0].cmp_id,
                    text: la_accounts[0].grp_name
                });

                _.each(la_accounts, function (account) {
                    PermissionVM.compGrpList4Tree.push({
                        id: account.usr_id,
                        parent: account.grp_id,
                        text: account.usr_cname
                    });
                });
            });


        },
        //創立一棵Tree
        createAccountTree: function () {
            $('#permissionAccountTree').jstree({
                "core": {
                    "animation": 0,
                    "themes": {"stripes": true},
                    "multiple": false,                  //不可多選
                    "check_callback": true,
                    "data": PermissionVM.compGrpList4Tree
                },
                "types": {
                    "#": {
                        "icon": "glyphicon glyphicon-file",
                        "max_children": 1,
                        "max_depth": 4,
                        "valid_children": ["root"]
                    },
                    "root": {
                        "icon": "glyphicon glyphicon-file",
                        "valid_children": ["default"]
                    },
                    "default": {
                        "valid_children": ["default", "file"]
                    },
                    "file": {
                        "icon": "glyphicon glyphicon-file",
                        "valid_children": []
                    }
                },
                "checkbox": {
                    "keep_selected_style": true,
                    "whole_node": false,
                    "tie_selection": false               // 選取時，false只會選到父節點，不會選到子結點
                },
                "plugins": ["search", "state", "types", "wholerow", "checkbox"]
            });
            this.treeIns = $("#permissionAccountTree").jstree(true);
            setTimeout(function () {
                PermissionVM.treeIns.uncheck_all();
                if (PermissionVM.ga_roles.length > 0) {
                    PermissionVM.role_id = PermissionVM.ga_roles[0].role_id;
                }
            }, 100);

        },
        doSave: function () {
            this.compareUpdAccount();
            $.post('/api/execSQLProcess',params,function(){
                //TODO 成功後更新樹
                // PermissionVM.getRoleOfAccounts(PermissionVM.role_id, function () {
                //     PermissionVM.updateAccountChkedTree();
                //     PermissionVM.initTemCUD();
                // });
            });


        },
        compareUpdAccount: function () {
            var checkedAccounts = this.treeIns.get_checked(true);
            var oriRoleOfAccount = this.ga_roleOfAccount;
            console.log(checkedAccounts);
            console.log(oriRoleOfAccount);
            checkedAccounts = _.filter(checkedAccounts, function (account) {
                return account.children.length == 0;
            });

            //判斷新增
            _.each(checkedAccounts, function (account) {
                var chkExistIdx = _.findIndex(oriRoleOfAccount, {user_id: account.id});
                if (chkExistIdx == -1) {
                    PermissionVM.tmpCUD.createData.push({
                        ROLE_ATHENA_ID: '',
                        ROLE_COMP_COD: '',
                        ROLE_ID: '',
                        USER_ATHENA_ID: '',
                        USER_COMP_COD: '',
                        USER_ID: ''
                    });
                    console.log("員工:" + account.text + ",加入" + account.parent + "部門");
                }
            });

            //判斷刪除權限
            _.each(oriRoleOfAccount, function (account) {
                var chkExistIdx = _.findIndex(checkedAccounts, {id: account.user_id});
                if (chkExistIdx == -1) {
                    PermissionVM.tmpCUD.deleteData.push();
                    console.log("員工:" + account.user_id + ",離開" + account.role_id + "角色");
                }
            });

        },
        //取得被選中的
        getChecked: function () {
            console.log(this.treeIns.get_checked(true));
        }
    }
});
