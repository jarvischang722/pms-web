<template>
    <div>
        <p class="topTitle">角色權限</p>
        <select class="form-control authorSelect" v-model="selRole" v-if="gs_permissionModel=='authByRole'">
            <option v-for="role in allRoles" :value="role.role_id">{{role.role_id}} : {{role.role_nam}}</option>
        </select>

        <template v-for="role in allRoles" v-else>
            <input type="checkbox" :id="role.role_id" :value="role.role_id">
            <label :for="role.role_id">{{role.role_nam}}</label><br>
        </template>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';

    export default {
        name: "auth-role-comp",
        mounted: function () {
            this.qryAllRoles();
        },
        computed: {
            allRoles: {
                get() {
                    return this.$store.state.ga_allRoles;
                }
            },
            selRole: {
                get() {
                    return this.$store.state.gs_selRole
                },
                set(role_id) {
                    if (this.$store.state.permissionModel == "authByRole") {
                        this.$store.dispatch("changeRoleEvent", role_id).then(() => {
                        });
                    }
                }
            },
            ...mapState([
                "gs_permissionModel"
            ])
        },
        methods: mapActions([
            "qryAllRoles"
        ])
    }
</script>

<!--<style scoped>-->

<!--</style>-->