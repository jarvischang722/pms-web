<template>
    <div class="author-navbar">
        <p class="topTitle float-left">{{navbarName}}</p>
        <div class="float-right author-nav-btn">

            <div class="btn-group" v-if="permissionModel == 'authByStaff'">
                <button class="btn btn-primary btn-white btn-sm" @click="authUpdate">
                    <i class="fa fa-pencil"></i> 修改
                </button>
                <button class="btn btn-danger btn-sm delete" @click="authDelete">
                    <i class="fa fa-minus"></i> 刪除
                </button>
                <button class="btn btn-success btn-white btn-sm" @click="authCreate">
                    <i class="fa fa-plus"></i> 新增
                </button>
            </div>
            <div class="btn-group">
                <el-select placeholder="選擇權限" size="small" v-model="permissionModel">
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
        data() {
            return {
                navbarName: ""
            }
        },
        computed: {
            permissionModel: {
                get() {
                    let ls_permissionModel = this.$store.state.gs_permissionModel;
                    if (ls_permissionModel == "authByRole") {
                        this.navbarName = "新增角色權限";
                    }
                    else if (ls_permissionModel == "authByStaff") {
                        this.navbarName = "新增人員權限";
                    }
                    else {
                        this.navbarName = "新增功能權限";
                    }
                    return this.$store.state.gs_permissionModel;
                },
                set(newValue) {
                    this.$store.commit("setPermissionModel", newValue);
                }
            }
        },
        methods: {
            authUpdate() {
                this.$store.commit("setIsAuthUpdate", true);
            },
            authDelete() {
                this.$store.commit("setIsAuthDelete", true);
            },
            authCreate() {
                this.$store.commit("setIsAuthCreate", true);
            }
        }
    }
</script>

<!--<style scoped>-->

<!--</style>-->