<template>
    <div class="authorityTree" v-loading="gb_isLoading">
        <div class="page-header">
        </div><!-- /.page-header -->
        <div class="row">
            <div class="col-xs-12 col-sm-12">
                <div class="authorityTree">
                    <div class="col-xs-12">
                        <div class="row">
                            <auth-navbar></auth-navbar>
                            <auth-role-comp></auth-role-comp>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                    <div class="space-6"></div>
                    <div class="col-xs-12">
                        <div class="row">
                            <div class="col-xs-6">
                                <div class="row no-margin-right">
                                    <auth-staff-comp></auth-staff-comp>
                                </div>
                            </div>
                            <div class="col-xs-6">
                                <div class="row">
                                    <auth-func-comp></auth-func-comp>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                    <div class="col-xs-12">
                        <div class="row center">
                            <button class="btn btn-primary btn-sm" @click="doSaveByRole">
                                儲存
                            </button>
                        </div>
                    </div>
                    <!-- button -->
                </div> <!-- authorityTree -->
            </div>
        </div>

        <template>
            <el-dialog title="新增角色" :visible.sync="gb_isDialogShow" size="tiny">
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
                    <el-button type="primary" @click="addRole">确 定</el-button>
                </div>
            </el-dialog>
        </template>
    </div><!-- /.roomNumPlanPage -->
</template>

<script>
    import {mapActions} from 'vuex';
    import authNavbar from './authNavbar';
    import authRoleComp from './authRoleComp';
    import authStaffComp from './authStaffComp';
    import authFuncComp from './authFuncComp';

    export default {
        name: "auth-by-role",
        data() {
            return {
                isRoleDialogShow: false,
                isRole: false,
                role_id: "",
                role_name: ""
            }
        },
        components: {
            authNavbar,
            authRoleComp,
            authStaffComp,
            authFuncComp
        },
        computed: {
            gb_isLoading() {
                return this.$store.state.gb_isLoading;
            },
            gb_isDialogShow() {

                return this.$store.state.gb_isDialogShow;
            }
        },
        methods: {
            closeDialog() {
                this.$store.commit("setIsDialogShow", false);
            },
            addRole() {
                $.post("/api/addRole",)
                console.log(this.role_id, this.role_name);
            },
            ...mapActions([
                "doSaveByRole"
            ])
        }
    }
</script>

<style scoped>

</style>