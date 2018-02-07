<template>
    <div class="author-navbar">
        <div class="float-right author-nav-btn">

            <div class="btn-group mr-10 pull-left" style="display: none;">
                <button class="btn btn-primary btn-white btn-defaultWidth" style="height: 30px;"
                        role="button">特別權限</button>
            </div>
            <div class="btn-group pull-left" v-if="permissionModel == 'authByRole'">
                <button class="btn btn-primary btn-white btn-sm" style="height: 30px;" @click="authUpdate">
                    <i class="fa fa-pencil"></i> 修改
                </button>
                <button class="btn btn-danger delete btn-sm" style="height: 30px;" @click="authDelete">
                    <i class="fa fa-minus"></i> 刪除
                </button>
                <button class="btn btn-success btn-white btn-sm" style="height: 30px;" @click="authCreate">
                    <i class="fa fa-plus"></i> 新增
                </button>
            </div>
            <div class="btn-group pull-left">
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
        computed: {
            permissionModel: {
                get() {
                    return this.$store.state.gs_permissionModel;
                },
                set(newValue) {
                    this.$store.commit("setPermissionModel", newValue);
                }
            }
        },
        methods: {
            authUpdate() {
                this.$store.commit("setIsDialogShow", true);
                this.$store.commit("setIsAuthUpdate", true);
            },
            authDelete() {
                this.$store.commit("setIsAuthDelete", true);
            },
            authCreate() {
                this.$store.commit("setIsDialogShow", true);
                this.$store.commit("setIsAuthCreate", true);
            }
        }
    }
</script>

<!--<style scoped>-->

<!--</style>-->