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
        // created() {
        //     this.watchFuncsOfRole();
        // },
        computed: {
            permissionModel: {
                get() {
                    // this.createFuncTree();
                    return this.$store.state.gs_permissionModel;
                }
            }
        },
        watch: {
            permissionModel(){}
        },
        methods: {
            createFuncTree() {
                let self = this;
                this.isLoading = true;
                async.waterfall([
                    self.qryFuncList,
                    self.initTree
                ], function(err, result){
                    self.isLoading = false;
                });
            },

            qryFuncList(cb) {
                if (this.treeIns == null) {
                    this.$store.dispatch("qryFuncList").then((la_funcList4Tree) => {
                        cb(null, la_funcList4Tree);
                    });
                }
                else {
                    cb(null, "");
                }
            },

            initTree(la_funcList4Tree, cb){
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
                cb(null, "");
            }
        }
    }
</script>

<style scoped>

</style>