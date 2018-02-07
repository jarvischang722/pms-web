<template>
    <div>
        <p class="topTitle">角色權限</p>
        <div :style="authHt">
            <select class="form-control authorSelect" v-model="selRole" v-if="gs_permissionModel=='authByRole'">
                <option v-for="role in allRoles" :value="role.role_id">{{role.role_id}} : {{role.role_nam}}</option>
            </select>

            <template v-for="role in allRoles" v-else>
                <input type="checkbox" :id="role.role_id" :value="role.role_id" v-model="checkedRole">
                <label :for="role.role_id">{{role.role_nam}}</label><br>
            </template>
        </div>

        <el-dialog title="新增角色" :visible.sync="lb_isRoleDialogShow" size="tiny">
            <div>
                <label for="role_id">角色代碼</label>
                <input type="text" id="role_id" style="width:80%" v-model="role_id">
                <div class="space-6"></div>
                <label for="role_nam">角色名稱</label>
                <input type="text" id="role_nam" style="width:80%" v-model="role_name">
            </div>
            <div class="space-4"></div>
            <div slot="footer" class="dialog-footer" style="text-align: center;">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="saveRole">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';

    export default {
        name: "auth-role-comp",
        data() {
            return {
                authHt: {},
                lb_isRoleDialogShow: false,
                role_id: "",
                role_name: "",
                ori_role_id: ""
            }
        },
        created() {
            this.qryAllRoles();
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
        watch: {
            gb_isAuthDelete(lb_isRoleDel) {
                if (lb_isRoleDel && this.$store.state.gs_permissionModel == "authByRole") {
                    this.delRole();
                }
            },
            gb_isDialogShow() {
            }
        },
        computed: {
            selRole: {
                get() {
                    return this.$store.state.gs_selRole
                },
                set(role_id) {
                    if (this.$store.state.gs_permissionModel == "authByRole") {
                        this.$store.dispatch("changeRoleEvent", role_id);
                    }
                }
            },
            checkedRole: {
                get() {
                    return this.$store.state.ga_checkedRoleList;
                },
                set(la_role_id) {
                    this.$store.dispatch("changeRoleEvent", la_role_id[la_role_id.length - 1]);
                    this.$store.commit("checkedRoleList", la_role_id);
                }
            },
            gb_isAuthDelete() {
                return this.$store.state.gb_isAuthDelete;
            },
            gb_isDialogShow() {
                let gb_isDialogShow = this.$store.state.gb_isDialogShow;
                if (gb_isDialogShow && this.$store.state.gs_permissionModel == "authByRole") {
                    if (this.$store.state.gb_isAuthUpdate) {
                        let lo_role = _.findWhere(this.allRoles, {role_id: this.selRole});
                        if (!_.isUndefined(lo_role)) {
                            this.ori_role_id = lo_role.role_id;
                            this.role_id = lo_role.role_id;
                            this.role_name = lo_role.role_nam;
                        }
                    }
                    this.lb_isRoleDialogShow = true;
                }
                else {
                    this.lb_isRoleDialogShow = false;
                }
                return gb_isDialogShow;
            },
            ...mapState({
                allRoles: "ga_allRoles",
                gs_permissionModel: "gs_permissionModel",
                ga_checkedRoleList: "ga_checkedRoleList"
            })
        },
        methods: {
            closeDialog() {
                this.lb_isRoleDialogShow = false;
                this.$store.commit("setIsAuthCreate", false);
                this.$store.commit("setIsAuthUpdate", false);
                this.$store.commit("setIsDialogShow", false);
            },
            saveRole() {
                let self = this;
                if (this.$store.state.gb_isAuthCreate && this.gs_permissionModel == "authByRole") {
                    this.$store.commit("setIsLoading", true);
                    $.post("/api/addRole", {role_id: this.role_id, role_name: this.role_name}).then(
                        result => {
                            if (result.success) {
                                self.qryAllRoles();
                                alert("save success");
                            }
                            else {
                                alert(result.errorMsg);
                            }
                        },
                        err => {
                            console.error(err.responseText);
                        }
                    ).always(() => {
                        this.$store.commit("setIsLoading", false);
                        this.$store.commit("setIsAuthCreate", false);
                        this.$store.commit("setIsDialogShow", false);
                    });
                }
                else if (this.$store.state.gb_isAuthUpdate && this.gs_permissionModel == "authByRole") {
                    this.$store.commit("setIsLoading", true);
                    $.post("/api/updRole", {role_id: this.role_id, role_name: this.role_name, ori_role_id: this.ori_role_id}).then(
                        result => {
                            if (result.success) {
                                self.qryAllRoles();
                                alert("save success");
                            }
                            else {
                                alert(result.errorMsg);
                            }
                        },
                        err => {
                            console.error(err.responseText);
                        }
                    ).always(() => {
                        this.$store.commit("setIsLoading", false);
                        this.$store.commit("setIsAuthUpdate", false);
                        this.$store.commit("setIsDialogShow", false);
                    });
                }

            },
            delRole() {
                let self = this;
                if (confirm(go_i18nLang.SystemCommon.check_delete)) {
                    this.$store.commit("setIsLoading", true);
                    $.post("/api/delRole", {role_id: this.selRole}).then(
                        result => {
                            if (result.success) {
                                self.qryAllRoles();
                                alert("save success");
                            }
                            else {
                                alert(result.errorMsg);
                            }
                        },
                        err => {
                            console.error(err.responseText);
                        }
                    ).always(()=>{
                        self.$store.commit("setIsLoading", false);
                        self.$store.commit("setIsAuthDelete", false);
                    })
                }
                else{
                    this.$store.commit("setIsAuthDelete", false);
                }

            },
            ...mapActions([
                "qryAllRoles"
            ])
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