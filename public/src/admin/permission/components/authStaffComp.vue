<template>
    <div v-loading="isLoading">
        <p class="topTitle">人員權限</p>
        <div class="easyui-panel tree-body ">
            <ul id="permissionAccountTree" class="easyui-tree  authHt" :style="authHt"></ul>
        </div>

        <template>
            <el-dialog title="新增人員" :visible.sync="isStaffDialogShow" size="tiny">
                <div>
                    <label for="usr_id">人員代碼</label>
                    <input type="text" id="usr_id" style="width:80%" v-model="usr_id">
                    <div class="space-6"></div>
                    <label for="usr_cname">人員名稱</label>
                    <input type="text" id="usr_cname" style="width:80%" v-model="usr_cname">
                    <div class="space-6"></div>
                    <label for="usr_pwd">人員密碼</label>
                    <input type="password" id="usr_pwd" style="width:80%" v-model="usr_pwd">
                    <div class="space-6"></div>
                    <label for="usr_pwdChk">確認密碼</label>
                    <input type="password" id="usr_pwdChk" style="width:80%" v-model="usr_pwdChk">
                </div>
                <div class="space-4"></div>
                <div slot="footer" class="dialog-footer" style="text-align: center;">
                    <el-button @click="closeDialog(false)">取 消</el-button>
                    <el-button type="primary" @click="addStaff">确 定</el-button>
                </div>
            </el-dialog>
        </template>
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
                authHt: {},
                isTreeAddNode: false,
                isTreeDelNode: false,
                isStaffDialogShow: false,
                isInitChecked: true,
                isNodeCreate: false
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
                return this.$store.state.gb_isAuthCreate;
            },
            gb_isAuthDelete() {
                this.delete_node(this.$store.state.gb_isAuthDelete, true);
                return this.$store.state.gb_isAuthDelete;
            },
            gb_isDialogShow() {
                let gb_isDialogShow = this.$store.state.gb_isDialogShow;
                if (gb_isDialogShow && this.$store.state.gs_permissionModel == "authByStaff") {
                    this.isStaffDialogShow = true;
                }
                return this.$store.state.gb_isDialogShow;
            }
        },
        watch: {
            ga_staffOfRole() {
            },
            gb_isAuthUpdate() {
            },
            gb_isAuthCreate() {
            },
            gb_isAuthDelete() {
            },
            gb_isDialogShow() {
            }
        },
        methods: {
            //創立一棵Tree
            createStaffTree() {
                let self = this;
                this.isLoading = true;

                async.waterfall([
                    //取公司角色資料
                    function (cb) {
                        if (self.treeIns == null) {
                            self.qryCompGrpList(cb);
                        }
                        else{
                            cb(null, "");
                        }
                    },
                    self.initTree           //初始化tree
                ], function (err, result) {
                    self.isLoading = false;
                });
            },

            //取公司角色資料
            qryCompGrpList(cb) {
                this.$store.dispatch("qryCompGrp").then((la_compGrpList4Tree) => {
                    cb(null, la_compGrpList4Tree);
                })
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
                    self.$store.commit("setStaffTreeIns", self.treeIns);

                    // 以人員為主
                    if (self.$store.state.gs_permissionModel == "authByStaff") {
                        $("#permissionAccountTree").on("select_node.jstree", function (e, data) {
                            self.selectedNode = data.node;
                            self.$store.commit("setSelectedUserID", self.selectedNode.id);
                            self.checkedRoleByUserID(self.selectedNode.id);
                        })
                    }

                    cb(null, "");
                }, 100);

            },

            //勾選有此角色的人員
            checkedTreeNodeByStaffOfRole() {
                let self = this;
                let la_allRoles = this.$store.state.ga_allRoles;
                let la_staffOfRole = this.$store.state.ga_staffOfRole;

                if (this.$store.state.gs_permissionModel == "authByStaff" || la_allRoles.length <= 0 || this.treeIns == null) {
                    return;
                }
                // if(la_staffOfRole.length == 0){
                //     this.treeIns.uncheck_all();
                //     return;
                // }

                this.isLoading = true;
                this.isInitChecked = true;
                setTimeout(function () {
                    self.treeIns.uncheck_all();
                    _.each(la_staffOfRole, function (account) {
                        let lo_node = self.treeIns.get_node(account.user_id);
                        if (lo_node != null && !_.isUndefined(lo_node.children) && lo_node.children.length == 0) {
                            self.treeIns.check_node("#" + account.user_id);
                        }
                    });
                    self.isLoading = false;
                    self.isInitChecked = false;
                }, 300);
            },

            //勾選有此人員的角色
            checkedRoleByUserID(user_id) {
                this.$store.dispatch("qryRoleByUserID", user_id);
            },

            //新增人員
            addStaff() {
                if (this.usr_pwd != this.usr_pwdChk) {
                    alert("密碼確認有誤");
                    return;
                }

                if (_.isUndefined(this.usr_cname) || _.isUndefined(this.usr_id) || _.isUndefined(this.usr_pwd) || _.isUndefined(this.usr_pwdChk) ||
                    this.usr_cname.trim() == "" || this.usr_id.trim() == "" || this.usr_pwd.trim() == "" || this.usr_pwdChk.trim() == "") {
                    alert("尚有欄位未填寫");
                    return;
                }

                let lo_params = {
                    usr_id: this.usr_id,
                    usr_cname: this.usr_cname,
                    usr_pwd: this.usr_pwd
                };
                this.create_node(this.$store.state.gb_isAuthCreate);
                lo_params.grp_id = this.selectedNode.parent;
                let self = this;
                $.post("/api/addStaff", lo_params).then(
                    result => {
                        if (result.success) {
                            self.qryCompGrpList(function (err, la_compGrpList4Tree) {
                                if(!err){
                                    self.treeIns.settings.core.data = la_compGrpList4Tree;
                                    self.treeIns.refresh();
                                    alert("save success");
                                }
                                else{
                                    alert("reolad data error");
                                }

                            });
                        }
                        else {
                            alert(result.errorMsg);
                        }
                    },
                    err => {
                        alert(err);
                    }
                )
            },

            closeDialog(ln_isDelNode) {
                this.isStaffDialogShow = false;
                this.delete_node(true, ln_isDelNode);
                this.$store.commit("setIsDialogShow", false);
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
                let self = this;
                if (lb_isAuthCreate && this.$store.state.gs_permissionModel == "authByStaff") {
                    this.treeIns.create_node(this.selectedNode, null, "last", function (node) {
                        this.deselect_node(self.selectedNode);
                        this.select_node(node);
                        this.set_text(node, self.usr_cname);
                        this.set_id(node, self.usr_id);
                        self.closeDialog(false);
                    });
                    this.$store.commit("setIsAuthCreate", false);
                }
            },

            delete_node(lb_isAuthDelete, ln_isDelNode) {
                if (lb_isAuthDelete && this.$store.state.gs_permissionModel == "authByStaff" && ln_isDelNode) {
                    let ls_parent_id = this.selectedNode.parent;
                    this.treeIns.delete_node(this.selectedNode);
                    this.treeIns.select_node(ls_parent_id);
                    this.$store.commit("setIsAuthDelete", false);
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
        overflow-y: auto;
    }
</style>