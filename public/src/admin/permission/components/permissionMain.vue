<template>
    <div id="permissionMain">
        <div class="col-xs-12 col-sm-12" v-loading="isLoading" element-loading-text="Saving">
            <auth-by-role></auth-by-role>
            <!--<auth-staff v-show="false"></auth-staff>-->
            <!--<auth-func v-show="false"></auth-func>-->
        </div>
    </div>
</template>

<script>
    import authByRole from './authByRole';
    // import authByStaff from 'authByStaff';
    // import authByFunc from 'authByFunc';

    export default {
        name: "permission-main",
        components: {
            authByRole
            // authByStaff,
            // authByFunc
        }
    }
</script>

<style scoped>

</style>