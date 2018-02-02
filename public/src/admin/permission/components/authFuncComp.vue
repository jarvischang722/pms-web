<template>
    <div v-loading="isLoading">
        <p class="topTitle">功能權限</p>
        <div class="easyui-panel tree-body ">
            <ul id="permissionFuncTree" class="easyui-tree authHt" :style="authHt"></ul>
        </div>
    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex';
    import _ from 'underscore';
    import async from 'async';

    export default {
        name: "auth-func-comp",
        data() {
            return {
                treeIns: null,
                isLoading: false,
                authHt: {},
                isInitChecked: true
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
                    this.createFuncTree();
                    return this.$store.state.gs_permissionModel;
                }
            },
            ga_funcsOfRole: {
                get() {
                    if (this.treeIns != null) {
                        this.checkedTreeNodeByFuncsOfRole();
                    }
                    return this.$store.state.ga_funcsOfRole;
                }
            }
        },
        watch: {
            ga_funcsOfRole() {
            }
        },
        methods: {
            createFuncTree() {
                let self = this;
                this.isLoading = true;
                async.waterfall([
                    self.qryFuncList,
                    self.initTree
                ], function (err, result) {
                    if (err) {
                        console.error(err);
                    }
                    self.isLoading = false;
                });
            },

            qryFuncList(cb) {
                if (this.treeIns == null) {
                    this.$store.dispatch("qryFuncList").then((result) => {
                        if (result.success) {
                            cb(null, result.funcList4Tree);
                        }
                        else {
                            cb(result.errMsg, null);
                        }
                    }, (err) => {
                        cb(err, null);
                    });
                }
                else {
                    cb(null, []);
                }
            },

            initTree(la_funcList4Tree, cb) {
                let self = this;
                let la_plugins = ["search", "state", "types", "wholerow", "checkbox"];
                if (this.$store.state.gs_permissionModel == "authByFunc") {
                    la_plugins.splice(4, 1);
                }

                $('#permissionFuncTree').jstree({
                    "core": {
                        "animation": 0,
                        "themes": {"stripes": true},
                        "multiple": false,                  //不可多選
                        "check_callback": true,
                        "data": la_funcList4Tree
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
                        "three_state": true,
                        "keep_selected_style": true,
                        "whole_node": false,
                        "tie_selection": false   // 選取時，false只會選到父節點，不會選到子結點
                    },
                    "plugins": la_plugins
                });
                this.treeIns = $("#permissionFuncTree").jstree(true);
                this.$store.commit("setFuncTreeIns", this.treeIns);

                if (this.$store.state.gs_permissionModel == "authByFunc") {
                    $("#permissionFuncTree").on("select_node.jstree", function (e, data) {
                        let lo_funcSelected = data.node;
                        self.$store.commit("setSelectedCurrentID", lo_funcSelected);
                        self.checkedRoleByCurrentID(lo_funcSelected);
                    })
                }
                cb(null, "");
            },

            checkedTreeNodeByFuncsOfRole() {
                let self = this;
                let la_allRoles = this.$store.state.ga_allRoles;
                let la_funcsOfRole = this.$store.state.ga_funcsOfRole;
                if (la_funcsOfRole.length == 0 || this.$store.state.gs_permissionModel == "authByFunc" || la_allRoles.length <= 0 || this.treeIns == null) {
                    return;
                }

                this.isLoading = true;
                this.treeIns.uncheck_all();
                setTimeout(function () {
                    let ls_node_id = "";
                    let ls_node = null;
                    _.each(la_funcsOfRole, function (func) {
                        ls_node_id = func.current_id.length <= 4 ? func.pre_id + "_" + func.current_id : func.current_id;
                        ls_node = self.treeIns.get_node(ls_node_id);
                        if (ls_node != null && !_.isUndefined(ls_node.children) && ls_node.children.length == 0) {
                            self.treeIns.check_node("#" + ls_node_id);
                        }
                    });

                    self.isInitChecked = false;
                    self.isLoading = false;
                }, 200);
            },

            checkedRoleByCurrentID(lo_selectedNode) {
                this.$store.dispatch("qryRoleByCurrentID", lo_selectedNode);
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
        overflow-y: auto;
    }
</style>