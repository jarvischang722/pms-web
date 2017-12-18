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
        name: "auth-func-comp.vue",
        data() {
            return {
                funcsOfRole: [],
                treeIns: null,
                isLoading: false
            }
        },
        created() {
            this.watchFuncsOfRole();
        },
        mounted() {
            // this.qryFuncList();
        },
        methods: {
            watchFuncsOfRole() {
                let self = this;
                this.$store.watch(
                    (state) => {
                        return state.funcsOfRole
                    },
                    (newValue, oldValue) => {
                        self.funcsOfRole = newValue;
                        self.updateFuncChkedTree();
                    }
                )
            },
            qryFuncList(cb) {
                let self = this;
                if (this.treeIns == null) {
                    this.$store.dispatch("qryFuncList").then((la_funcList4Tree) => {
                        self.createFuncListTree(la_funcList4Tree);
                        cb(null, "");
                    });
                }
                else {
                    cb(null, "");
                }
            },
            createFuncListTree(la_funcList4Tree) {
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
                        "keep_selected_style": true,
                        "whole_node": false,
                        "tie_selection": false               // 選取時，false只會選到父節點，不會選到子結點
                    },
                    "plugins": ["search", "state", "types", "wholerow", "checkbox"]
                });
                this.treeIns = $("#permissionFuncTree").jstree(true);
            },
            updateFuncChkedTree() {
                let la_funcsOfRole = this.funcsOfRole;
                let self = this;
                let la_allRoles = this.$store.state.allRoles;
                this.isLoading = true;
                async.waterfall([
                    function (cb) {
                        self.qryFuncList(cb)
                    },
                    function (data, cb) {
                        setTimeout(function () {
                            if (la_allRoles.length > 0) {
                                self.treeIns.uncheck_all();
                                _.each(la_funcsOfRole, function (lo_func) {
                                    self.treeIns.check_node("#" + lo_func.current_id);
                                });
                            }
                            self.isLoading = false;
                        }, 100);

                        cb(null, "");
                    }
                ], function (err, result) {
                });


            }
        }
    }
</script>

<style scoped>

</style>