<template>
    <div>
        <div class="page-header"></div><!-- /.page-header -->
        <!-- 訂房卡(Bookings) Page-->
        <div class="pageMain">
            <div class="col-xs-12">
                <search-comp
                        :search-fields="searchFields"
                        :search-cond.sync="searchCond"
                        :fetch-data="fetchDgRowData"
                ></search-comp>
            </div>
            <div class="clearfix"></div>
            <div class="col-xs-12">
                <!--<div class="blockSetting-heading">查詢結果</div>-->
                <div class="col-sm-11 col-xs-11">
                    <div class="row no-margin-right">
                        <div>
                            <!-- gProfile 多筆 dataGrid -->
                            <table id="PMS0110040_dg" class=""></table>
                            <!--<table id="resv_gProfile-table" class="gridTableHt"></table>-->
                        </div>
                    </div>
                </div>
                <div class="col-xs-1 col-sm-1">
                    <div class="row">
                        <div class="right-menu-co">
                            <ul>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth reservationDialog-1"
                                            role="button">新增
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth reservationDialog-1"
                                            role="button">修改
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth reservationDialog-1 resv-view"
                                            role="button">瀏覽
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div> <!-- /.col-sm-12 -->
            <div class="clearfix"></div>

        </div>
    </div>
</template>

<script>

    /** DatagridRmSingleGridClass **/
    function DatagridSingleGridClass() {
    }

    DatagridSingleGridClass.prototype = new DatagridBaseClass();
    DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    };
    DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
    };

    export default {
        name: "p-m-s0110040",
        data() {
            return {
                prg_id: "PMS0110040",
                userInfo: {},               //使用者資訊
                searchFields: [],           //搜尋欄位資料
                searchCond: {},             //搜尋資料
                pageOneDataGridRows: [],    //多筆資料
                pageOneFieldData: []        //多筆欄位資料
            }
        },
        mounted() {
            this.fetchUserInfo();
            this.loadDataGridByPrgID();
        },
        methods: {
            fetchUserInfo() {
                this.isLoading = true;
                let self = this;
                $.post('/api/getUserInfo', function (result) {
                    if (result.success) {
                        self.userInfo = result.userInfo;
                    }
                });
            },
            loadDataGridByPrgID() {
                let lo_searchCond = _.clone(this.searchCond);

                let lo_params = {
                    prg_id: this.prg_id,
                    page_id: 1,
                    searchCond: lo_searchCond
                };

                $.post("/api/fetchDataGridFieldData", lo_params, result => {
                    console.log(result);
                    if (this.searchFields.length <= 0) {
                        this.searchFields = result.searchFields;
                    }
                    this.pageOneFieldData = result.dgFieldsData;
                    this.pageOneDataGridRows = result.dgRowData;
                    this.showDataGrid();
                });
            },
            showDataGrid() {
                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init(this.prg_id, "PMS0110040_dg", DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0110040_dg'), this.pageOneFieldData, {
                    pagination: true,
                    rownumbers: true
                });

                this.dgIns.loadPageDgData(this.pageOneDataGridRows);

                this.isLoading = false;
            },
            fetchDgRowData() {

            }
        }
    }
</script>

<style scoped>

</style>