<template>
    <div class="author-navbar">
        <p class="topTitle float-left">新增角色權限</p>
        <div class="float-right author-nav-btn">

            <div class="btn-group">
                <button class="btn btn-primary btn-white btn-sm">
                    <i class="fa fa-pencil"></i> 修改
                </button>
                <button class="btn btn-danger btn-sm delete">
                    <i class="fa fa-minus"></i> 刪除
                </button>
                <button class="btn btn-success btn-white btn-sm">
                    <i class="fa fa-plus"></i> 新增
                </button>
            </div>
            <div class="btn-group">
                <el-select clearable placeholder="選擇權限" size="small" v-model="permissionModel">
                    <el-option value="authByRole" label="角色權限">角色權限</el-option>
                    <el-option value="authByFunc" label="功能權限">功能權限</el-option>
                    <el-option value="authByStaff" label="人員權限">人員權限</el-option>
                </el-select>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>

    export default {
        name: "auth-navbar",
        computed: {
            permissionModel: {
                get(){
                    return this.$store.state.permissionModel;
                },
                set(newValue){
                    this.$store.commit("setPermissionModel", newValue);
                }
            }
        },
        methods: {
        }
    }
</script>

<!--<style scoped>-->

<!--</style>-->