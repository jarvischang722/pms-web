<template>
    <div id="selectRateCod_dialog" class="hide padding-5" style="top: 20px;">
        <div class="col-xs-12 col-sm-12">
            <div class="row">
                <div class="col-xs-10 col-sm-10">
                    <div class="row no-margin-right main-content-data">
                        <div class="grid">
                            <div class="grid-item">
                                <label class="width-auto">來源</label>
                                <template>
                                    <el-cascader expand-trigger="hover" :options="options" v-model="selectedOptions2"
                                                 @change="handleChange" class="el-cascader-s1 input-medium medium-c1">
                                    </el-cascader>
                                </template>
                            </div>
                        </div>
                        <template>
                            <v-table
                                    :width="350"
                                    :height="300"
                                    :columns="columns"
                                    :table-data="tableData"
                                    :column-cell-class-name="columnCellClass"
                                    row-hover-color="#eee"
                                    row-click-color="#edf7ff">
                            </v-table>
                        </template>
                    </div><!--main-content-data-->
                    <div class="clearfix"></div>
                </div>
                <div class="col-xs-2 col-sm-2">
                    <div class="row">
                        <div class="right-menu-co">
                            <ul>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth"
                                            role="button">離開
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    export default {
        name: "selectRateCod",
        mounted() {
        },
        data() {
            return {}
        },
        watch: {},
        methods: {}
    }
</script>

<style scoped>

</style>