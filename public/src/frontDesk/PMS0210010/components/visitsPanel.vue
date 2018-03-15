<template>
    <div v-loading="isLoadingDialog" :element-loading-text="loadingText">
        <p class="title">{{i18nLang.program.PMS0210011.reserveShopInfo}}</p>
        <!--預約來館資料table-->
        <table id="reserveShopInfo_dg" style="height: 200px; width: 100%;"></table>

        <p class="title">{{i18nLang.program.PMS0210011.guestVisitHistory}}</p>
        <!--住客歷史來訪table-->
        <table id="guestVisitHistory_dg" style="height: 200px; width: 100%;"></table>
    </div>
</template>

<script>
    /** DatagridRmSingleGridClass **/
    function DataGridSingleGridClass() {
    }
    DataGridSingleGridClass.prototype = new DatagridBaseClass();
    DataGridSingleGridClass.prototype.onClickRow = function (idx, row) {
    };
    DataGridSingleGridClass.prototype.onClickCell = function (idx, row) {
    };
    /*** Class End  ***/

    export default {
        name: 'visitsPanel',
        props: ["isVisitsPanel", "rowData"],
        mounted() {
            this.fetchRentCalDat();
            this.isLoadingDialog = true;
            this.loadingText = "Loading...";
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                rentCalDat: "",//滾房租日
                isLoadingDialog: false,
                loadingText: "",
                shopInfoRows: [], //來館資料 預約來館資料
                shopInfoFieldsData: [], //來館資料 預約來館欄位資料
                shopInfoDgIns: {},
                visitHistoryRows: [], //來館資料 住客來訪歷史資料
                visitHistoryFieldsData: [], //來館資料 住客來訪歷史欄位資料
                visitHistoryDgIns: {}
            }
        },
        watch: {
            isVisitsPanel(val) {
                if (val) {
                    if(this.$store.state.ga_shopInfoFieldsData.length != 0){
                        this.shopInfoFieldsData = this.$store.state.ga_shopInfoFieldsData;
                        this.shopInfoRows = this.$store.state.ga_shopInfoRows;
                        this.visitHistoryFieldsData = this.$store.state.ga_visitHistoryFieldsData;
                        this.visitHistoryRows = this.$store.state.ga_visitHistoryRows;
                    }
                    else{
                        this.isLoadingDialog = true;
                        this.initData();
                        this.fetchShopInfoFieldData();
                    }
                }
            }
        },
        methods: {
            initData(){
                this.shopInfoRows = [];
                this.shopInfoFieldsData = [];
                this.visitHistoryRows = [];
                this.visitHistoryFieldsData = [];
                this.shopInfoDgIns = [];
                this.visitHistoryDgIns = [];
            },
            fetchRentCalDat() {
                $.post('/api/qryRentCalDat', {}, (result) => {
                    this.rentCalDat = moment(result.rent_cal_dat).format("YYYY/MM/DD");
                });
            },
            fetchShopInfoFieldData() {
                $.post("/api/fetchDataGridFieldData", {
                    prg_id: "PMS0210011",
                    tab_page_id: 21,
                    searchCond: {gcust_cod: this.$store.state.gs_gcustCod, rent_cal_dat: this.rentCalDat}
                }).then(result => {
                    this.shopInfoFieldsData = result.dgFieldsData;
                    this.shopInfoRows = result.dgRowData;
                    this.fetchVisitHistoryFieldData();

                });
            },
            fetchVisitHistoryFieldData() {
                $.post("/api/fetchDataGridFieldData", {
                    prg_id: "PMS0210011",
                    tab_page_id: 22,
                    searchCond: {gcust_cod: this.$store.state.gs_gcustCod}
                }).then(result => {
                    this.visitHistoryFieldsData = result.dgFieldsData;
                    this.visitHistoryRows = result.dgRowData;
                    this.showShopInfoDataGrid();
                    this.setVisitsData();
                });
            },
            //將來管資料放進vuex
            setVisitsData(){
                this.$store.dispatch("setVisitsData", {
                    ga_shopInfoFieldsData: this.shopInfoFieldsData,
                    ga_shopInfoRows: this.shopInfoRows,
                    ga_visitHistoryFieldsData: this.visitHistoryFieldsData,
                    ga_visitHistoryRows: this.visitHistoryRows
                });
            },
            showShopInfoDataGrid() {
                this.shopInfoDgIns = new DataGridSingleGridClass();
                this.shopInfoDgIns.init("PMS0210011", "reserveShopInfo_dg", DatagridFieldAdapter.combineFieldOption(this.shopInfoFieldsData, "reserveShopInfo_dg"), this.shopInfoFieldsData);
                this.shopInfoDgIns.loadDgData(this.shopInfoRows);
                this.showVisitHistoryDataGrid();
            },
            showVisitHistoryDataGrid() {
                this.visitHistoryDgIns = new DataGridSingleGridClass();
                this.visitHistoryDgIns.init("PMS0210011", "guestVisitHistory_dg", DatagridFieldAdapter.combineFieldOption(this.visitHistoryFieldsData, "guestVisitHistory_dg"), this.visitHistoryFieldsData);
                this.visitHistoryDgIns.loadDgData(this.visitHistoryRows);
                this.isLoadingDialog = false;
            },
        }

    }
</script>