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
                role_id: "",
                staffOfRole: [],
                isLoading: true,
                permissionModel: ""
            }
        },
        created() {
            this.watchStaffOfRole();
        },
        mounted() {
            // this.qryCompGrpList();
        },
        // computed: {
        //     staffOfRole: {
        //         get() {
        //             this.la_staffOfRole = this.$store.state.staffOfRole;
        //             this.updateAccountChkedTree(this.$store.state.staffOfRole);
        //             return this.$store.state.staffOfRole;
        //         },
        //         set(value) {
        //             this.$store.commit("updateStaffOfRole", value);
        //         }
        //     }
        // },

        methods: {
            watchStaffOfRole() {
                let self = this;
                this.$store.watch(
                    (state) => {
                        return state.staffOfRole;
                    },
                    (newValue, oldValue) => {
                        self.staffOfRole = newValue;
                        self.permissionModel = this.$store.state.permissionModel;
                        self.updateAccountChkedTree();
                    }
                )
            },

            qryCompGrpList(cb) {
                let self = this;
                if (this.treeIns == null) {
                    this.$store.dispatch("qryCompGrp").then((la_compGrpList4Tree) => {
                        self.createAccountTree(la_compGrpList4Tree);
                        cb(null, "");
                    })
                }
                else {
                    cb(null, "");
                }

            },

            //創立一棵Tree
            createAccountTree(la_compGrpList4Tree) {
                let la_plugin = ["search", "state", "types", "wholerow", "checkbox"];
                console.log(this.permissionModel, la_plugin);
                if (this.permissionModel == "authByStaff") {
                    la_plugin.splice(4,1);
                }
                console.log(la_plugin);

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
                        "tie_selection": false               // 選取時，false只會選到父節點，不會選到子結點
                    },
                    "plugins": la_plugin
                });
                this.treeIns = $("#permissionAccountTree").jstree(true);
            },

            //更新目標角色對應的帳號標示在Tree上
            updateAccountChkedTree() {
                let la_staffOfRole = this.staffOfRole;
                let self = this;
                let la_allRoles = this.$store.state.allRoles;
                this.isLoading = true;
                async.waterfall([
                    function (cb) {
                        self.qryCompGrpList(cb);
                    },
                    function (data, cb) {
                        setTimeout(function () {
                            // self.treeIns.uncheck_all();
                            if (la_allRoles.length > 0) {
                                self.role_id = la_allRoles[0].role_id;
                                _.each(la_staffOfRole, function (account) {
                                    // self.treeIns.check_node("#" + account.user_id);
                                });
                            }
                            self.isLoading = false;
                        }, 100);
                        cb(null, "");
                    }
                ], function (err, result) {

                })


            },
        }
    }
</script>

<style scoped>

</style>