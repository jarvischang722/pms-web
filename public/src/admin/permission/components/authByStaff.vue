<template>
    <div class="authorityTree">
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
                    <div class="space-6"></div>
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
                        <div class="row">
                            <div class="col-xs-6">
                                <div class="row no-margin-right">
                                    <p class="topTitle">
                                        <i class="fa fa-plus green smaller-90"></i>
                                        新增功能
                                    </p>
                                    <div class="authorWall">
                                        <p>依房型訂房</p>
                                        <p>團體清單</p>
                                    </div>
                                </div>
                            </div>
                            <div class="col-xs-6">
                                <div class="row">
                                    <p class="topTitle">
                                        <i class="fa fa-minus red smaller-90"></i>
                                        排除功能
                                    </p>
                                    <div class="authorWall">
                                        <p>綜合櫃檯</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                    <div class="space-12"></div>
                    <div class="col-xs-12">
                        <div class="row center">
                            <button class="btn btn-primary btn-sm">
                                儲存
                            </button>
                        </div>
                    </div>
                    <!-- button -->
                </div> <!-- authorityTree -->
            </div>
        </div>
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
        components: {
            authNavbar,
            authRoleComp,
            authStaffComp,
            authFuncComp
        },
        methods: mapActions([
            "qryAllRoles"
        ])
    }
</script>

<style scoped>

</style>