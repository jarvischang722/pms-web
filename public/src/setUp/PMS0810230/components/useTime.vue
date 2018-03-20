<template>
    <div id="useTimeDialog" class="hide padding-5" style="">
        <div class="businessCompanyData">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <!-------- 多筆 -------->
                    <div class="col-xs-10 col-sm-10">
                        <div class="row no-margin-right">
                            <div class="main-content-data">
                                <v-table
                                        row-hover-color="#eee"
                                        row-click-color="#edf7ff"
                                        is-horizontal-resize
                                        style="width:100%"
                                        :columns="useTimeColumns"
                                        :table-data="useTimeData"
                                        :error-content="errorContent"
                                        :column-cell-class-name="useTimeColumnCellClass"
                                        :title-click="appendRow"
                                        :row-click="getRowData"
                                        @on-custom-comp="customCompFunc"
                                >
                                </v-table>
                            </div>
                        </div>
                    </div>
                    <!--------/. 多筆 -------->
                    <!-------- 按鈕 -------->
                    <div class="col-xs-2 col-sm-2">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="showTimeRuleDialog">日期規則
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="closeDialog">離開
                                        </button>
                                    </li>
                                    <li>
                                        <span class="checkbox">
                                              <label class="checkbox-width">
                                                  <input name="form-field-checkbox" type="checkbox" class="ace">
                                                  <span class="lbl font-btn">過期顯示</span>
                                              </label>
                                          </span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--------/. 按鈕 -------->
                </div>
                <div class="clearfix"></div>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    import moment from 'moment';

    // 自定义列组件
    Vue.component('table-operation', {
        template: '<span class="column-cell-class-delete" @click.stop.prevent="deleteRow(rowData,index)">▬</span>',
        props: {
            rowData: {
                type: Object
            },
            field: {
                type: String
            },
            index: {
                type: Number
            }
        },
        methods: {
            deleteRow() {
                // 参数根据业务场景随意构造
                let params = {type: 'delete', index: this.index};
                this.$emit('on-custom-comp', params);
            }
        }
    });

    export default {
        name: 'useTime',
        props: ["rowData", "isUseTime"],
        mounted() {
        },
        data() {
            return {
                fieldsData: [],
                dataGridRowsData: [],
                oriDataGridRowsData: [],
                //v-table 顯示時所需資料(轉換過)
                useTimeColumns: [],
                useTimeData: [],
                errorContent: "",
                //是否開啟日期規則
                isOpenTimeRule: false
            }
        },
        watch: {
            isUseTime(val) {
                if (val) {
                    this.initData();
                    this.fetchData();
                }
            }
        },
        methods: {
            initData() {
                this.fieldsData = [];
                this.dataGridRowsData = [];
                this.oriDataGridRowsData = [];
                this.useTimeColumns = [];
                this.useTimeData = [];
            },
            //取使用期間欄位、多筆資料
            fetchData() {
                let lo_params = {
                    prg_id: 'PMS0810230',
                    page_id: 1010,
                    tab_page_id: 1,
                    searchCond: {rate_cod: this.$store.state.gs_rateCod}
                };

                $.post("/api/fetchDataGridFieldData", lo_params, (result) => {
                    if (result.success) {
                        this.fieldsData = result.dgFieldsData;
                        this.dataGridRowsData = result.dgRowData;
                        this.oriDataGridRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                        this.showTable();
                    }
                    else {
                        alert(result.errorMsg);
                    }
                });
            },
            showTable() {
                this.useTimeColumns = [
                    {
                        field: 'control',
                        title: '<i class="fa fa-plus green pointer"></i>',
                        width: 40,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        componentName: 'table-operation',
                        isResize: true
                    },
                    {
                        field: 'startDat',
                        title: 'Start date',
                        width: 135,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true,
                    },
                    {
                        field: 'endDat',
                        title: 'End date',
                        width: 135,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true,
                    },
                    {
                        field: 'datRule',
                        title: 'Date rule',
                        width: 135,
                        titleAlign: 'center',
                        columnAlign: 'center',
                        isResize: true,
                    }
                ];
                if (this.dataGridRowsData.length > 0) {
                    _.each(this.dataGridRowsData, (lo_dataGridRowsData) => {
                        this.useTimeData.push({
                            "startDat": moment( lo_dataGridRowsData.begin_dat).format("YYYY/MM/DD"),
                            "endDat": moment(lo_dataGridRowsData.end_dat).format("YYYY/MM/DD") ,
                            "datRule": lo_dataGridRowsData.command_option
                        });
                    });
                }
                else {
                    this.useTimeData = [{}];
                    setTimeout(() => {
                        this.customCompFunc({type: "delete", index: 0});
                    }, 0.1);
                }

            },
            //v-table function
            useTimeColumnCellClass(rowIndex, columnName, rowData) {
                if (columnName == 'control') {
                    return 'column-cell-class-delete';
                }
            },
            getRowData(rowIndex, rowData, column){

            },
            appendRow(title, field) {
                if (field == "control") {
                    this.showTimeRuleDialog();
                }
            },
            customCompFunc(params) {
                this.$delete(this.useTimeData, params.index);
            },
            //日期規則
            showTimeRuleDialog(){
                this.isOpenTimeRule = true;
                this.$eventHub.$emit('getTimeRuleData', {
                    openTimeRule: this.isOpenTimeRule
                });
            },
            closeDialog(){}
        }
    }
</script>