<template>
    <div class="col-xs-12 col-sm-12">
        <div class="row">
            <!--多筆 歷史消費 dataGrid -->
            <div class="col-xs-11 col-sm-11">
                <div class="row no-margin-right">
                    <table id="historicalConsumption_dg" style="height: 310px;"></table>
                </div>
            </div>
            <!--/.多筆 歷史消費 dataGrid -->
            <!--按鈕-->
            <div class="col-xs-1 col-sm-1">
                <div class="row">
                    <div class="right-menu-co">
                        <ul>
                            <li>
                                <button class="btn btn-gray btn-defaultWidth"
                                        role="button">
                                    {{i18nLang.program.PMS0610020.appear_consumption_dt}}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!--按鈕-->
        </div>
    </div>
</template>

<script>
    export default {
        name: 'historical-consumption',
        props: ["rowData", "isHistoricalConsumption"],
        data() {
            return {
                i18nLang: go_i18nLang,
                dataGridRowsData: [],
                oriDataGridRowsData: [],
                fieldsData: [],
                oriFieldsData: [],
                dgIns: {}
            };
        },
        watch: {
            isHistoricalConsumption(val) {
                if (val) {
                    this.initData();
                    this.fetchFieldData(this.rowData);
                }
            }
        },
        methods: {
            initData() {
                this.dataGridRowsData = [];
                this.oriDataGridRowsData = [];
                this.fieldsData = [];
                this.oriFieldsData = [];
                this.dgIns = {};
            },
            fetchFieldData(rowData) {
                var self = this;

                self.fetchRowData(rowData);
            },
            fetchRowData(rowData) {
                var self = this;

                this.showDataGrid();
            },
            showDataGrid() {
//                this.dgIns = new DatagridBaseClass();
//                this.dgIns.init("PMS0610020", "historicalConsumption_dg", DatagridFieldAdapter.combineFieldOption(this.fieldsData, 'historicalConsumption_dg'), this.fieldsData);
//                this.dgIns.loadDgData(this.dataGridRowsData);

                $('#historicalConsumption_dg').datagrid({
                    singleSelect: true,
                    collapsible: true,
                    // 從json 撈
                    url: '/jsonData/sales/bsCompany_historyConsumption.json',
                    method: 'get',
                    columns: [[
                        {field: 'consumeDate', title: '消費日期', width: 80},
                        {field: 'serialNum', title: '序號', width: 40},
                        {field: 'consumeHall', title: '消費館別', width: 80},
                        {field: 'consumePlace', title: '消費地點', width: 80},
                        {field: 'consumePrice', title: '消費金額', width: 80, align: 'right'},
                        {field: 'subPay', title: '代支', width: 80, align: 'right'},
                        {field: 'consumeDescription', title: '消費說明', width: 80},
                        {field: 'consumeTip', title: '小費', width: 80, align: 'right'},
                        {field: 'uniformNum', title: '統一編號', width: 80},
                        {field: 'invoiceNum', title: '發票號碼', width: 80}
                    ]]
                });
            }
        }
    }
</script>