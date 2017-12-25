<template>
    <div v-loading="isLoading">
        <p class="topTitle">功能權限</p>
        <div class="easyui-panel tree-body" style="width: 100%;">
            <ul id="permissionFuncTree" class="easyui-tree"></ul>
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
                isLoading: false
            }
        },
        mounted() {
            this.permissionModel;
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
                    this.checkedTreeNodeByFuncsOfRole();
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
                    if(err){
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
                let la_plugins = ["search", "state", "types", "wholerow", "checkbox"];
                if (this.$store.state.gs_permissionModel == "authByFunc") {
                    la_plugins.splice(4,1);
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
                        "keep_selected_style": false,
                        "whole_node": true,
                        "tie_selection": false   // 選取時，false只會選到父節點，不會選到子結點
                    },
                    "plugins": la_plugins
                });
                this.treeIns = $("#permissionFuncTree").jstree(true);
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
                    _.each(la_funcsOfRole, function (func) {
                        self.treeIns.check_node("#" + func.current_id);
                    });
                    self.isLoading = false;
                }, 100);
            }
        }
    }
</script>

<style scoped>

</style>