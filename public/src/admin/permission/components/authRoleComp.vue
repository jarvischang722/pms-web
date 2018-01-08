<template>
    <div>
        <p class="topTitle">角色權限</p>
        <select class="form-control authorSelect" v-model="selRole" v-if="gs_permissionModel=='authByRole'">
            <option v-for="role in allRoles" :value="role.role_id">{{role.role_id}} : {{role.role_nam}}</option>
        </select>

        <template v-for="role in allRoles" v-else>
            <input type="checkbox" :id="role.role_id" :value="role.role_id" v-model="checkedRole">
            <label :for="role.role_id">{{role.role_nam}}</label><br>
        </template>
    </div>
</template>

<script>
    import {mapState, mapActions} from 'vuex';

    export default {
        name: "auth-role-comp",
        created() {
            this.qryAllRoles();
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
            ...mapState({
                allRoles: "ga_allRoles",
                gs_permissionModel: "gs_permissionModel",
                ga_checkedRoleList: "ga_checkedRoleList"
            })
        },
        methods: mapActions([
            "qryAllRoles"
        ])
    }
</script>

<!--<style scoped>-->

<!--</style>-->