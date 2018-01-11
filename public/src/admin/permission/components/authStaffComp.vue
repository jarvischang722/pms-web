<template>
    <div v-loading="isLoading">
        <p class="topTitle">人員權限</p>
        <div class="easyui-panel tree-body ">
            <ul id="permissionAccountTree" class="easyui-tree  authHt" :style="authHt"></ul>
        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import _ from 'underscore';
    import async from 'async';

    export default {
        name: "auth-staff-comp",
        data() {
            return {
                treeIns: null,
                isLoading: false,
                selectedNode: null,
                authHt: {}
            }
        },
        mounted() {
            this.permissionModel;
            // 藍色系統列
            let navHt = $(".navbar-container").height();
            // quickMenus + 搜尋欄位
            let menuHt = $(".top-sec-ul").height() + 30 + $(".page-header").height();//padding-top: 5px

            let titleSaveHt = 80 * 2;

            let authHt = 0;
            this.authHt.maxHeight = ($(window).height() - navHt - menuHt - titleSaveHt) / 2;
            this.authHt.maxHeight += "px";
        },
        computed: {
            permissionModel: {
                get() {
                    this.treeIns = null;
                    this.createStaffTree();
                    return this.$store.state.gs_permissionModel;
                }
            },
            ga_staffOfRole: {
                get() {
                    this.checkedTreeNodeByStaffOfRole();
                    return this.$store.state.ga_staffOfRole;
                }
            },
            gb_isAuthUpdate() {
                this.rename_node(this.$store.state.gb_isAuthUpdate);
                return this.$store.state.gb_isAuthUpdate;
            },
            gb_isAuthCreate() {
                this.create_node(this.$store.state.gb_isAuthCreate);
                return this.$store.state.gb_isAuthCreate;
            },
            gb_isAuthDelete() {
                this.delete_node(this.$store.state.gb_isAuthDelete);
                return this.$store.state.gb_isAuthDelete;
            }
        },
        watch: {
            ga_staffOfRole() {
            },
            gb_isAuthUpdate() {
            },
            gb_isAuthCreate() {
            }
        },
        methods: {
            //創立一棵Tree
            createStaffTree() {
                let self = this;
                this.isLoading = true;

                async.waterfall([
                    self.qryCompGrpList,    //取公司角色資料
                    self.initTree           //初始化tree
                ], function (err, result) {
                    self.isLoading = false;
                });
            },

            //取公司角色資料
            qryCompGrpList(cb) {
                if (this.treeIns == null) {
                    this.$store.dispatch("qryCompGrp").then((la_compGrpList4Tree) => {
                        cb(null, la_compGrpList4Tree);
                    })
                }
                else {
                    cb(null, "");
                }
            },

            //初始化tree
            initTree(la_compGrpList4Tree, cb) {
                let self = this;
                let la_plugins = ["search", "state", "types", "wholerow", "checkbox"];
                if (this.$store.state.gs_permissionModel == "authByStaff") {
                    la_plugins.splice(4, 1);
                }

                if (la_compGrpList4Tree == "") {
                    return cb(null, "");
                }

                //包setTimeout，為了延遲jstree，以防jstree套件相衝或抓不到套件
                setTimeout(function () {
                    $('#permissionAccountTree').jstree({
                        "core": {
                            "animation": 0,
                            "themes": {"stripes": true},
                            "multiple": false,                  //不可多選
                            "check_callback": true,
                            "data": la_compGrpList4Tree
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
                            "tie_selection": false   // 選取時，false只會選到父節點，不會選到子結點
                        },
                        "plugins": la_plugins
                    });

                    self.treeIns = $("#permissionAccountTree").jstree(true);

                    if (self.$store.state.gs_permissionModel != "authByStaff") {
                        $("#permissionAccountTree").on("check_node.jstree uncheck_node.jstree", function (e, data) {
                            let la_staffChecked = self.treeIns.get_checked();
                            self.$store.commit("updStaffChecked", la_staffChecked);
                        });
                    }
                    // 以人員為主
                    else {
                        $("#permissionAccountTree").on("select_node.jstree", function (e, data) {
                            self.selectedNode = data.node;
                            self.$store.commit("setSelectedUserID", self.selectedNode.id);
                            self.checkedRoleByUserID(self.selectedNode.id);
                        })
                    }

                    cb(null, "");
                }, 200);

            },

            //勾選有此角色的人員
            checkedTreeNodeByStaffOfRole() {
                let self = this;
                let la_allRoles = this.$store.state.ga_allRoles;
                let la_staffOfRole = this.$store.state.ga_staffOfRole;
                if (la_staffOfRole.length == 0 || this.$store.state.gs_permissionModel == "authByStaff" || la_allRoles.length <= 0 || this.treeIns == null) {
                    return;
                }

                this.isLoading = true;
                this.treeIns.uncheck_all();
                setTimeout(function () {
                    _.each(la_staffOfRole, function (account) {
                        self.treeIns.check_node("#" + account.user_id);
                    });
                    self.isLoading = false;
                }, 100);
            },

            //勾選有此人員的角色
            checkedRoleByUserID(user_id) {
                this.$store.dispatch("qryRoleByUserID", user_id);
            },

            rename_node(lb_isAuthUpdate) {
                if (lb_isAuthUpdate) {
                    $("#permissionAccountTree").jstree("edit", this.selectedNode, null, function (node) {

                        // this.$store.commit("setTmpUpd", node.text);
                        this.$store.commit("setIsAuthUpdate", false);
                    });
                }
            },

            create_node(lb_isAuthCreate) {
                if (lb_isAuthCreate) {
                    $("#permissionAccountTree").jstree("create_node", this.selectedNode, null, "last", function (node) {
                        this.edit(node);
                    });
                    this.$store.commit("setIsAuthCreate", false);
                }
            },

            delete_node(lb_isAuthDelete) {
                if (lb_isAuthDelete) {
                }
            }
        }
    }
</script>

<style scoped>
    ul.authHt {
        margin-bottom: 0;
        margin-left: 0;
    }

    .authHt {
        overflow-y: scroll;
    }
</style>