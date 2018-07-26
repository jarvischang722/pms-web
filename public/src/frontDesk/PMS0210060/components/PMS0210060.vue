<template>
    <div>
        <!--搜尋-->
        <div class="col-xs-12">
            <search-comp
                    :search-fields="searchFields"
                    :search-cond.sync="searchCond"
                    :fetch-data="fetchOrderDtValueData"
            ></search-comp>
        </div>
        <!--/.搜尋-->
        <div class="clearfix"></div>
        <!--table-->
        <div class="col-xs-12">
            <div class="col-sm-11 col-xs-11">
                <div class="row no-margin-right">
                    <!--order dt-->
                    <div class="pull-left width-75">
                        <table id="orderDtTable" class="gridTableHt"></table>
                    </div>
                    <!--/.order dt-->
                    <!--guest mn-->
                    <div class="pull-left width-24 ml-1-percent">
                        <table id="guestMnTable"></table>
                    </div>
                    <!--guest mn-->
                </div>
            </div>
            <div class="col-xs-1 col-sm-1">
                <div class="row">
                    <div class="right-menu-co">
                        <ul>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                        role="button" @click="checkIn">入住
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                        role="button" @click="clFdCheckIn">取消入住
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <!--/.table-->
        <div class="clearfix"></div>

        <pms0210060-dialog
                :row-data="editingRow"
                :is-check-in="isCheckIn"
        ></pms0210060-dialog>
    </div>
</template>

<script>
    import pms0210060Dialog from './PMS0210060_dialog';

    const gs_prgId = "PMS0210060";
    const vmHub = new Vue();

    /** DatagridRmSingleGridClass **/
    function DatagridSingleGridClass() {
    }

    DatagridSingleGridClass.prototype = new DatagridBaseClass();
    DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {

    };
    DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
        vmHub.$emit("getGuestMnData", {
            orderDtRows: row
        });
    };

    export default {
        name: "PMS0210060",
        components: {pms0210060Dialog},
        created() {
            vmHub.$on("getGuestMnData", async (data) => {
                this.editingRow = data.orderDtRows;
                await this.fetchGuestMnValueData();
                this.showGuestMnDataGrid();
            });
        },
        async mounted() {
            this.isLoading = true;
            //取滾房租日
            await this.fetchRentCalDat();
            //取搜尋欄位資料
            await this.fetchSearchFieldData();
            //取order dt 欄位資料
            await this.fetchOrderDtFieldData();
            //取guest mn  欄位資料
            await this.fetchGuestMnFieldData();
            // //預設入住日期為滾房租日
            // this.searchCond.ci_dat = moment(this.rentCalDat).format("YYYY/MM/DD");
            // //收尋資料
            // await this.fetchOrderDtValueData();
            this.showOrderDtDataGrid();
            this.showGuestMnDataGrid();
            this.isLoading = false;
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                rentCalDat: "",         //滾房租日
                isLoading: false,       //是否載入成功

                orderDtFieldData: [],
                orderDtValueData: [],
                guestMnFieldData: [],
                guestMnValueData: [],
                searchFields: [],       //搜尋欄位資料
                searchCond: {},         //搜尋資料

                orderDtDgIns: {},              // order dt dataGrid 實體
                guestMnDgIns: {},              //guest mn dataGrid 實體

                editingRow: {},         //正在點擊的order dt
                isCheckIn: undefined
            }
        },
        watch: {},
        methods: {
            async fetchRentCalDat() {
                let lo_fetchRentDat = await BacUtils.doHttpPromisePostProxy("/api/qryRentCalDat", {}).then((result) => {
                    return result;
                }).catch(err => {
                    return {success: false, errMsg: err};
                });
                if (lo_fetchRentDat.success) {
                    this.rentCalDat = lo_fetchRentDat.rent_cal_dat
                }
                else {
                    alert(lo_fetchRentDat.errorMsg);
                }
            },
            async fetchSearchFieldData() {
                let lo_searchFieldData = await BacUtils.doHttpPromisePostProxy("/api/fetchOnlySearchFieldsData", {
                    prg_id: gs_prgId
                }).then((result) => {
                    console.log(result);
                    return result;
                }).catch(err => {
                    return {success: false, errorMsg: err};
                });
                if (lo_searchFieldData.success) {
                    this.searchFields = lo_searchFieldData.searchFieldsData;
                } else {
                    alert(lo_searchFieldData.errorMsg);
                }
            },
            async fetchOrderDtFieldData() {
                let lo_orderDtFieldData = await BacUtils.doHttpPromisePostProxy("/api/fetchOnlyDataGridFieldData", {
                    prg_id: gs_prgId,
                    page_id: 1,
                    tab_page_id: 11,
                }).then((result) => {
                    console.log(result);
                    return result;
                }).catch(err => {
                    return {success: false, errorMsg: err};
                });
                if (lo_orderDtFieldData.success) {
                    this.orderDtFieldData = lo_orderDtFieldData.dgFieldsData;
                } else {
                    alert(lo_orderDtFieldData.errorMsg);
                }
            },
            async fetchOrderDtValueData() {
                let lo_orderDtValueData = await BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", {
                    prg_id: gs_prgId,
                    page_id: 1,
                    tab_page_id: 11,
                    searchCond: this.searchCond
                }).then((result) => {
                    return result;
                }).catch(err => {
                    return {success: false, errMsg: err};
                });
                if (lo_orderDtValueData.success) {
                    _.each(lo_orderDtValueData.dgRowData, (lo_data, ln_idx) => {
                        let lo_orderDtData = {
                            "ci_dat": moment(lo_data.ci_dat).format("YYYY/MM/DD"),
                            "co_dat": moment(lo_data.co_dat).format("YYYY/MM/DD"),
                            "ratecod_mn.ratecod_nam": lo_data.ratecod_nam,
                            "order_mn.acust_nam": lo_data.acust_nam,
                            "order_mn.attnd_nam": lo_data.atten_nam
                        };
                        lo_orderDtValueData.dgRowData[ln_idx] = _.extend(lo_orderDtValueData.dgRowData[ln_idx], lo_orderDtData);
                    });
                    this.orderDtValueData = lo_orderDtValueData.dgRowData;
                    console.log(this.orderDtValueData);
                    this.showOrderDtDataGrid();
                } else {
                    alert(lo_orderDtValueData.errorMsg)
                }
            },
            async fetchGuestMnFieldData() {
                let lo_guestMnFieldData = await BacUtils.doHttpPromisePostProxy("/api/fetchOnlyDataGridFieldData", {
                    prg_id: gs_prgId,
                    page_id: 1,
                    tab_page_id: 12,
                }).then((result) => {
                    console.log(result);
                    return result;
                }).catch(err => {
                    return {success: false, errorMsg: err};
                });
                if (lo_guestMnFieldData.success) {
                    this.guestMnFieldData = lo_guestMnFieldData.dgFieldsData;
                } else {
                    alert(lo_guestMnFieldData.errorMsg);
                }
            },
            async fetchGuestMnValueData() {
                let lo_guestMnValueData = await BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", {
                    prg_id: gs_prgId,
                    page_id: 1,
                    tab_page_id: 12,
                    searchCond: this.editingRow
                }).then((result) => {
                    return result;
                }).catch(err => {
                    return {success: false, errMsg: err};
                });
                if (lo_guestMnValueData.success) {
                    _.each(lo_guestMnValueData.dgRowData, (lo_data, ln_idx) => {
                        let lo_guestMnData = {
                            "guest_mn.guest_sta": lo_data.guest_sta,
                            "order_dt.ikey_seq_nos": lo_data.ikey_seq_nos,
                            "order_dt.room_nos": lo_data.room_nos,
                            "guest_mn.alt_nam": lo_data.alt_nam
                        };
                        lo_guestMnValueData.dgRowData[ln_idx] = lo_guestMnData;
                    });
                    this.guestMnValueData = lo_guestMnValueData.dgRowData;
                    console.log(this.guestMnValueData);
                } else {
                    alert(lo_guestMnValueData.errorMsg)
                }
            },
            showOrderDtDataGrid() {
                this.orderDtDgIns = new DatagridSingleGridClass();
                this.orderDtDgIns.init(gs_prgId, "orderDtTable", DatagridFieldAdapter.combineFieldOption(this.orderDtFieldData, "orderDtTable"), this.orderDtFieldData);
                this.orderDtDgIns.loadDgData(this.orderDtValueData);
            },
            showGuestMnDataGrid() {
                this.guestMnDgIns = new DatagridSingleGridClass();
                this.guestMnDgIns.init(gs_prgId, "guestMnTable", DatagridFieldAdapter.combineFieldOption(this.guestMnFieldData, "guestMnTable"), this.guestMnFieldData);
                this.guestMnDgIns.loadDgData(this.guestMnValueData);
            },
            checkIn() {
                this.isCheckIn = true;
                this.showSingleGridDialog();
            },
            clFdCheckIn() {
                this.isCheckIn = false;
                this.showSingleGridDialog();
            },
            showSingleGridDialog() {
                let self = this;
                this.editingRow = {};
                let lo_editingRow = $('#orderDtTable').datagrid('getSelected');
                if (!lo_editingRow) {
                    alert(go_i18nLang["SystemCommon"].SelectOneData);
                }
                else {
                    this.editingRow = lo_editingRow;
                    let dialog = $('#PMS0210060_dialog').removeClass('hide').dialog({
                        autoOpen: false,
                        modal: true,
                        title: this.isCheckIn ? "Check In" : "取消入住",
                        width: 1000,
                        maxwidth: 1920,
                        minheight: 800,
                        dialogClass: "test",
                        resizable: true,
                        onBeforeClose() {
                            self.editingRow = {};
                            self.isCheckIn = undefined;
                            self.fetchGuestMnFieldData();
                        }
                    }).dialog('open');
                }
            }
        }
    }
</script>

<style scoped>

</style>