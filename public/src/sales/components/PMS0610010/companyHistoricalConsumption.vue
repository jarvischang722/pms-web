<template>
    <div class="col-xs-12 col-sm-12" v-loading="isLoading" element-loading-text="Loading...">
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
    /** DatagridRmSingleGridClass **/
    function DatagridSingleGridClass() {
    }

    DatagridSingleGridClass.prototype = new DatagridBaseClass();
    DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
    };
    DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    };
    DatagridSingleGridClass.prototype.doSaveColumnFields = function () {
    };
    /*** Class End  ***/

    export default {
        name: 'historical-consumption',
        props: ["rowData", "isHistoricalConsumption"],
        data() {
            return {
                i18nLang: go_i18nLang,
                isLoading: false,
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
            fetchFieldData() {
                this.isLoading = true;
                $.post("/api/fetchDataGridFieldData", {
                    prg_id: "PMS0610020",
                    tab_page_id: 7,
                    searchCond: {cust_cod: this.$store.state.gs_custCod}
                }).then(result => {
                    this.searchFields = result.searchFields;
                    this.fieldsData = result.dgFieldsData;
                    this.dataGridRowsData = result.dgRowData;
                    this.showDataGrid();
                });
            },
            showDataGrid() {
                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init("PMS0610020", "historicalConsumption_dg", DatagridFieldAdapter.combineFieldOption(this.fieldsData, 'historicalConsumption_dg'), this.fieldsData);
                this.dgIns.loadDgData(this.dataGridRowsData);
                this.isLoading = false;
            }
        }
    }
</script>