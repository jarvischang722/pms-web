<template>
    <div>
        <p class="topTitle">人員權限</p>
        <!--<div class="easyui-panel tree-body" style="width: 100%;">-->
            <!--<ul id="staffTree" class="easyui-tree">{{ staffTreeData }}</ul>-->
        <!--</div>-->
        <template v-for="staff in allStaff">
            <input type="checkbox" :value="staff.user_id" v-model="staffOfRole">{{staff.user_id}}<br>
        </template>
        {{staffOfRole}}

    </div>
</template>

<script>
    import {mapGetters} from 'vuex';

    export default {
        name: "auth-staff-comp",
        mounted() {
            // this.initTree();
        },
        computed: {
            allStaff(){
                return this.$store.state.allStaff;
            },
            staffOfRole: {
                get(){
                    return this.$store.state.staffOfRole;
                },
                set(value){
                    console.log(value);
                    // this.$store.commit("updateStaffOfRole", value);
                }
            }
        },
        methods: {
            // initTree(){
            //     let self = this;
            //     $("#staffTree").tree({
            //         data: self.staffTreeData
            //     });
            // }
        }
    }
</script>

<style scoped>

</style>