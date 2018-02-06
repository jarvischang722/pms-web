<template>
    <div id="permissionMain">
        <div class="col-xs-12 col-sm-12" v-loading="false" element-loading-text="Saving" style="">
            <auth-by-role v-if="gs_permissionModel == 'authByRole'"></auth-by-role>
            <auth-by-func v-else-if="gs_permissionModel == 'authByFunc'"></auth-by-func>
            <auth-by-staff v-else-if="gs_permissionModel == 'authByStaff'"></auth-by-staff>
            <!--<auth-by-staff v-show="true"></auth-by-staff>-->

        </div>
    </div>
</template>

<script>
    import {mapState} from 'vuex';
    import authByRole from './authByRole';
    import authByStaff from './authByStaff';
    import authByFunc from './authByFunc';

    export default {
        name: "permission-main",
        components: {
            authByRole,
            authByStaff,
            authByFunc
        },
        computed: mapState([
            "gs_permissionModel"
        ])
    }
</script>

<style scoped>

</style>