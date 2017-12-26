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
                isLoading: false
            }
        },
        created() {
            this.permissionModel;
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
            }
        },
        watch: {
            ga_staffOfRole() {
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
                    la_plugins.splice(4,1);
                }

                if (la_compGrpList4Tree == "") {
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
                        "tie_selection": false   // 選取時，false只會選到父節點，不會選到子結點
                    },
                    "plugins": la_plugins
                });

                this.treeIns = $("#permissionAccountTree").jstree(true);

                if (this.$store.state.gs_permissionModel != "authByStaff") {
                    $("#permissionAccountTree").on("check_node.jstree uncheck_node.jstree", function (e, data) {
                        let la_staffChecked = self.treeIns.get_checked();
                        self.$store.commit("updStaffChecked", la_staffChecked);
                    });
                }

                cb(null, "");
            },

            //勾選此角色人員權限
            checkedTreeNodeByStaffOfRole() {
                let self = this;
                let la_allRoles = this.$store.state.ga_allRoles;
                let la_staffOfRole = this.$store.state.ga_staffOfRole;
                if (la_staffOfRole.length == 0 || this.$store.state.gs_permissionModel == "authByStaff" || la_allRoles.length <= 0 || this.treeIns == null) {
                    return;
                }

                this.isLoading = true;
                this.treeIns.uncheck_all();
                setTimeout(function(){
                    _.each(la_staffOfRole, function (account) {
                        self.treeIns.check_node("#" + account.user_id);
                    });
                    self.isLoading = false;
                }, 100);
            }
        }
    }
</script>

<style scoped>

</style>