<template>
    <div v-loading="isLoading">
        <p class="topTitle">人員權限</p>
        <div class="easyui-panel tree-body" style="width: 100%;">
            <ul id="permissionAccountTree" class="easyui-tree"></ul>
        </div>
    </div>
</template>

<script>
    // import {mapState, mapGetters} from 'vuex';
    import _ from 'underscore';
    import async from 'async';

    export default {
        name: "auth-staff-comp",
        data() {
            return {
                treeIns: null,
                staffOfRole: [],
                isLoading: false,
                ls_permissionModel: ""
            }
        },
        computed: {
            permissionModel: {
                get() {
                    this.treeIns = null;
                    this.ls_permissionModel = this.$store.state.gs_permissionModel;
                    this.createStaffTree();
                    return this.$store.state.gs_permissionModel;
                }
            }
            // ga_staffOfRole: {
            //     get() {
            //         this.checkedTreeNodeByStaffOfRole(this.$store.state.ga_staffOfRole);
            //         return this.$store.state.ga_staffOfRole;
            //     }
            // }
        },
        watch:{
            permissionModel(){}
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
                console.log(this.treeIns);
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
                //
                let ls_tie_selection = false;
                if (this.permissionModel == "authByStaff") {
                    ls_tie_selection = true;
                }

                if(la_compGrpList4Tree == ""){
                    return cb(null, "");
                }

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
                        "keep_selected_style": false,
                        "whole_node": true,
                        "tie_selection": ls_tie_selection   // 選取時，false只會選到父節點，不會選到子結點
                    },
                    "plugins": ["search", "state", "types", "wholerow", "checkbox"]
                });
                // this.treeIns = $("#permissionAccountTree").jstree(true);
                console.log(this.treeIns);
                cb(null, "");
            },

            //勾選此角色人員權限
            checkedTreeNodeByStaffOfRole(la_staffOfRole) {
                console.log(la_staffOfRole);
                // let self = this;
                // let la_allRoles = this.$store.state.ga_allRoles;
                // this.isLoading = true;
                // async.waterfall([
                //     function (cb) {
                //         self.qryCompGrpList(cb);
                //     },
                //     function (data, cb) {
                //         setTimeout(function () {
                //             // self.treeIns.uncheck_all();
                //             if (la_allRoles.length > 0) {
                //                 self.role_id = la_allRoles[0].role_id;
                //                 _.each(la_staffOfRole, function (account) {
                //                     // self.treeIns.check_node("#" + account.user_id);
                //                 });
                //             }
                //             self.isLoading = false;
                //         }, 100);
                //         cb(null, "");
                //     }
                // ], function (err, result) {
                //
                // })
            },

            selectedNode(e, data) {
                var i, j, r = [];
                for (i = 0, j = data.selected.length; i < j; i++) {
                    r.push(data.instance.get_node(data.selected[i]).text);
                }
                console.log(r);
            }
        }
    }
</script>

<style scoped>

</style>