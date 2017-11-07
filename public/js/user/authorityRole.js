/**
 *
 *  程式編號:
 *  程式名稱: 權限設定
 */


var authVM = new Vue({
    el: "#auth-app",
    mounted: function () {
        // this.createAccountTree();
        this.getAllRoles();
        this.getCompGrp();
    },
    data: {
        role_id: "",
        ga_roles: [],
        ga_roleOfAccount: [],
        ga_compGrpList: [],
        compGrpList4Tree: []
    },
    watch: {
        ga_compGrpList: function (newValue) {
            this.compGrpList4Tree = [{"id": newValue[0].cmp_id, "parent": "#", "text": newValue[0].cmp_name}];
            console.log(this.compGrpList4Tree);

            console.log(_.groupBy(newValue, "grp_name"));
            this.createAccountTree();
            _.each(_.groupBy(newValue, "grp_name"), function (la_accounts, grp_nam) {
                authVM.compGrpList4Tree.push({
                    id: la_accounts[0].grp_id,
                    parent: la_accounts[0].cmp_id,
                    text: la_accounts[0].grp_name
                });

                _.each(la_accounts, function (account) {
                    authVM.compGrpList4Tree.push({
                        id: account.usr_id,
                        parent: account.grp_id,
                        text: account.usr_cname
                    });
                });
            });


            $('#authAccountTree').jstree(true).settings.core.data = authVM.compGrpList4Tree;
            $('#authAccountTree').jstree(true).refresh();

        }
    },
    methods: {
        getAllRoles: function () {
            $.post("/api/getAllRoles", function (result) {
                authVM.ga_roles = result.roles;
            });
        },
        changeRoleEvent: function (role_id) {
            this.getRoleOfAccounts(role_id);
        },
        getRoleOfAccounts: function (role_id) {
            $.post("/api/getRoleOfAccounts", {role_id: role_id}, function (result) {
                console.log(result);
                authVM.ga_roleOfAccount = result.accounts;
            });
        },
        getCompGrp: function () {
            $.post("/api/getCompGrp", function (result) {
                authVM.ga_compGrpList = result.compGrpList;
            });
        },
        createAccountTree: function () {
            $('#authAccountTree').jstree({
                "core": {
                    "animation": 0,
                    "themes": {"stripes": true},
                    "multiple": false,                  //不可多選
                    "check_callback": true,
                    "data": authVM.compGrpList4Tree
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
                "plugins": ["dnd", "search", "state", "types", "wholerow", "checkbox"]
            });
        }
    }
});
