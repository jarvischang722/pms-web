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
                                    <el-cascader expand-trigger="hover" :options="options" v-model="selectedOption"
                                                 @change="handleChange" class="el-cascader-s1 input-medium medium-c1">
                                    </el-cascader>
                                </template>
                            </div>
                        </div>
                        <div class="container_12 divider">
                            <div class="grid_12 fixed-table-container">
                                <table class="fancyTable themeTable treeControl custom-table click-effect"
                                       id="rateCodTable" cellpadding="0" cellspacing="0" style="width: 100%;">
                                    <thead>
                                    <tr>
                                        <th class="ca-headerTitle height-fntThead rp-first-th">
                                            {{i18n_Lang.program.PMS0110041.rate_cod}}
                                        </th>
                                        <th class="ca-headerTitle height-fntThead">
                                            {{i18n_Lang.program.PMS0110041.rate_nam}}
                                        </th>
                                        <th class="ca-headerTitle height-fntThead">
                                            {{i18n_Lang.program.PMS0110041.remark}}
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    <tr v-for="data in tableRowsData" class="defHt" @click="selectedData = data">
                                        <td>{{data.rate_cod}}</td>
                                        <td>{{data.ratecod_nam}}</td>
                                        <td>{{data.remark1}}</td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div><!--main-content-data-->
                    <div class="clearfix"></div>
                </div>
                <div class="col-xs-2 col-sm-2">
                    <div class="row">
                        <div class="right-menu-co">
                            <ul>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth"
                                            role="button" @click="confirmData">確定
                                    </button>
                                </li>
                            </ul>
                            <ul>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth"
                                            role="button" @click="closeDialog">離開
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
        props: ["rowData"],
        mounted() {
        },
        updated() {
            $("#rateCodTable").tableHeadFixer({"left": 1});
        },
        data() {
            return {
                i18n_Lang: go_i18nLang, //多語系
                options: [],            //樹狀下拉資料
                selectedOption: [],     //樹狀下拉所選的資料
                tableRowsData: [],      //多筆資料
                selectedData: {},       //選到的rate cod
            }
        },
        watch: {
            rowData(val) {
                if (!_.isEmpty(val)) {
                    this.initData();
                    this.fetchSelectData();
                }
            },
            selectedValue(val) {
                if (val != "") {
                    this.fetchRowData();
                }
            }
        },
        methods: {
            initData() {
                this.options = [];
                this.selectedOption = [];
                this.selectedValue = "";
                this.tableRowsData = [];
            },
            fetchSelectData() {
                BacUtils.doHttpPostAgent("/api/chkFieldRule", {
                    rule_func_name: 'sel_order_dt_rate_cod_data_for_tree_select',
                    rowData: this.rowData
                }, (result) => {
                    if (result.success) {
                        this.options = result.selectOptions;
                        this.selectedOption[0] = this.options[0].value;
                        this.selectedOption[1] = this.options[0].children[0].value;
                        this.handleChange();
                    }
                    else {
                        alert(result.errorMsg);
                    }
                });
            },
            handleChange() {
                BacUtils.doHttpPostAgent("/api/chkFieldRule", {
                    rule_func_name: 'sel_order_dt_rate_cod_data',
                    rowData: this.rowData,
                    selectedData: this.selectedOption
                }, (result) => {
                    if (result.success) {
                        console.log(result.selectOptions);
                        this.tableRowsData = result.selectOptions;
                    }
                    else {
                        alert(result.errorMsg);
                    }
                });
            },
            confirmData() {
                this.$eventHub.$emit('getOrderDtRateCod', {
                    rowData: this.rowData,
                    rateCodData: this.selectedData
                });
                $("#selectRateCod_dialog").dialog('close');
            },
            closeDialog() {
                $("#selectRateCod_dialog").dialog('close');
            }
        }
    }
</script>

<style scoped>

</style>