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
                            <auth-func-comp></auth-func-comp>
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
                                    <auth-staff-comp></auth-staff-comp>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                    <div class="space-6"></div>
                    <div class="col-xs-12">
                        <div class="row center">
                            <button class="btn btn-primary btn-sm" @click="doSaveByFunc">
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
        name: "auth-by-func",
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
        methods: mapActions([
            "qryAllRoles",
            "doSaveByFunc"
        ])
    }
</script>

<style scoped>

</style>