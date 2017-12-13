<template>
    <div>
        <p class="topTitle">人員權限</p>
        {{staffOfRole}}
        <div class="easyui-panel tree-body" style="width: 100%;">
            <ul id="permissionAccountTree" class="easyui-tree"></ul>
        </div>

    </div>
</template>

<script>
    import {mapState, mapGetters} from 'vuex';

    export default {
        name: "auth-staff-comp",
        data() {
            return {
                treeIns: null
            }
        },
        mounted() {
            this.qryCompGrpList();
        },
        computed: {
            staffOfRole: {
                get() {
                    this.updateAccountChkedTree(this.$store.state.staffOfRole);
                    return this.$store.state.staffOfRole;
                },
                set(value) {
                    this.$store.commit("updateStaffOfRole", value);
                }
            }
        },
        methods: {
            qryCompGrpList() {
                let self = this;
                this.$store.dispatch("qryCompGrp").then((la_compGrpList4Tree) => {
                    self.createAccountTree(la_compGrpList4Tree);
                })
            },
            //創立一棵Tree
            createAccountTree: function (la_compGrpList4Tree) {
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
                    "plugins": ["search", "state", "types", "wholerow", "checkbox"]
                });
                this.treeIns = $("#permissionAccountTree").jstree(true);
                // setTimeout(function () {
                //     self.treeIns.uncheck_all();
                //     if (self.allRoles.length > 0) {
                //         self.role_id = self.allRoles[0].role_id;
                //     }
                // }, 100);

            },
            //更新目標角色對應的帳號標示在Tree上
            updateAccountChkedTree: function () {
                this.treeIns.uncheck_all();
                _.each(this.ga_roleOfAccount, function (account) {
                    PermissionVM.treeIns.check_node("#" + account.user_id);
                });
            },
        }
    }
</script>

<style scoped>

</style>