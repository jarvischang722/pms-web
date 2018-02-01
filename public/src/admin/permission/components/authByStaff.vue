<template>
    <div class="authorityTree" v-isLoading="gb_isLoading">
        <div class="page-header">
        </div><!-- /.page-header -->
        <div class="row">
            <div class="col-xs-12 col-sm-12">
                <div class="authorityTree">
                    <div class="col-xs-12">
                        <div class="row">
                            <auth-navbar></auth-navbar>
                            <auth-staff-comp></auth-staff-comp>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                    <div class="col-xs-12">
                        <div class="row">
                            <div class="col-xs-6">
                                <div class="row no-margin-right">
                                    <auth-role-comp></auth-role-comp>
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
                    <div class="space-6"></div>
                    <div class="col-xs-12">
                        <div class="row center">
                            <button class="btn btn-primary btn-sm" @click="doSaveByStaff">
                                儲存
                            </button>
                        </div>
                    </div>
                    <!-- button -->
                </div> <!-- authorityTree -->
            </div>
        </div>

        <!--<template>-->
            <!--<el-dialog title="新增人員" :visible.sync="isStaffDialogShow" size="tiny">-->
                <!--<div>-->
                    <!--<label for="usr_id">人員代碼</label>-->
                    <!--<input type="text" id="usr_id" style="width:80%" v-model="usr_id">-->
                    <!--<div class="space-6"></div>-->
                    <!--<label for="usr_cname">人員名稱</label>-->
                    <!--<input type="text" id="usr_cname" style="width:80%" v-model="usr_cname">-->
                    <!--<div class="space-6"></div>-->
                    <!--<label for="usr_pwd">人員密碼</label>-->
                    <!--<input type="password" id="usr_pwd" style="width:80%" v-model="usr_pwd">-->
                <!--</div>-->
                <!--<div class="space-4"></div>-->
                <!--<div slot="footer" class="dialog-footer" style="text-align: center;">-->
                    <!--<el-button @click="closeDialog">取 消</el-button>-->
                    <!--<el-button type="primary" @click="addStaff">确 定</el-button>-->
                <!--</div>-->
            <!--</el-dialog>-->
        <!--</template>-->
    </div><!-- /.roomNumPlanPage -->
</template>

<script>

    import {mapActions} from 'vuex';
    import authNavbar from './authNavbar';
    import authRoleComp from './authRoleComp';
    import authStaffComp from './authStaffComp';
    import authFuncComp from './authFuncComp';

    export default {
        name: "auth-by-staff",
        data(){
            return {
                isStaffDialogShow: false,
                usr_id: "",
                usr_cname: "",
                usr_pwd: ""
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
            }
        },
        methods: {
            ...mapActions([
                "qryAllRoles",
                "doSaveByStaff"
            ])
        }
    }
</script>

<style scoped>

</style>