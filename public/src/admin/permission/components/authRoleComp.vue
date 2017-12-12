<template>
    <!--跳頁-->
    <!--<a>-->
    <!--<p class="topTitle">角色權限</p>-->
    <!--</a>-->
    <!--<div class="easyui-panel tree-body">-->
    <!--<ul id="tt" class="easyui-tree"-->
    <!--data-options="url:'../../../jsonData/authorRole_dataCheck.json',method:'get',animate:true,checkbox:true,lines:true"></ul>-->
    <!--</div>-->
    <div>
        <select class="form-control authorSelect" v-model="selRole">
            <option v-for="role in allRoles" :value="role.role_id">{{role.role_nam}}</option>
        </select>
        <div>{{selRole}}</div>
    </div>
    <!--<select>-->
    <!--<option>請選擇</option>-->
    <!--</select>-->
</template>

<script>
    import {mapGetters, mapActions} from 'vuex';

    export default {
        name: "auth-role-comp",
        mounted: function () {
            this.qryAllRoles();
        },
        computed: {
            allRoles: {
                get() {
                    return this.$store.getters.allRoles
                },
            },
            selRole: {
                get() {
                    return this.$store.getters.selRole
                },
                set(role_id) {
                    this.$store.dispatch("changeRoleEvent", role_id).then(() => {});
                }
            }
        },
        // computed: mapGetters([
        //     'allRoles',
        //     'selRole'
        // ]),
        methods: mapActions([
            "qryAllRoles"
            // "changeRoleEvent"
        ])
    }
</script>

<!--<style scoped>-->

<!--</style>-->