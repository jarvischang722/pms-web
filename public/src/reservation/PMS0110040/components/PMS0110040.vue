<template>
    <div>
        <div class="page-header"></div><!-- /.page-header -->
        <!-- 訂房卡(Bookings) Page-->
        <div class="pageMain">
            <div class="col-xs-12">
                <div class="search-content">
                    <div class="search-co">
                        <div class="row">
                            <div class="search-co-content col-xs-12 search-S2">
                                <div class="width-95 searchMain-S2">
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>Full Name</label>
                                            <input type="text" class="input-medium medium-c1-sc2" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>速查</label>
                                            <input type="text" class="input-medium medium-c1-sc2" placeholder="">
                                        </div>
                                    </div>
                                </div>
                                <div class="row search-footer-btn">
                                    <div class="footer-btn-menu-co">
                                        <ul>
                                            <li>
                                                <div class="" data-rel="tooltip" data-placement="bottom"
                                                     title="查詢">
                                                    <div class="icon-reStyle icon-co-14"></div>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="" data-rel="tooltip" data-placement="bottom"
                                                     title="清除">
                                                    <div class="icon-reStyle icon-co-11"></div>
                                                </div>
                                            </li>
                                            <li>
                                                <div class="icon-moreSearch show-search-detail">
                                                    <i class="fa fa-chevron-down"></i>
                                                </div>
                                            </li>
                                        </ul>
                                    </div>  <!-- /.footer-btn-menu-co -->
                                </div> <!-- /.search-footer-btn -->
                            </div>

                            <div class="search-co-content col-xs-12 search-S2-con rece-search-detail"
                                 style="display: none;">
                                <div class="width-95">
                                    <!--1-->
                                    <!--2-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>訂房卡號</label>
                                            <input type="text" class="input-medium medium-c1-sc2" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>官網/聯訂中心</label>
                                            <input type="text" class="input-medium medium-c1-sc2" placeholder="">
                                        </div>
                                    </div>
                                    <!--3-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>Ｃ/I日期</label>
                                            <input type="date" class="input-medium medium-c1-sc2" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>訂房卡狀態</label>
                                            <input type="text" class="input-medium medium-c1-sc2" placeholder="有效訂房">
                                        </div>
                                    </div>
                                    <!--4-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>Ｃ/O日期</label>
                                            <input type="date" class="input-medium medium-c1-sc2" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>種類</label>
                                            <input type="text" class="input-medium medium-c1-sc2" placeholder="全部">
                                        </div>
                                    </div>
                                    <!--5-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>房價代號</label>
                                            <input type="text" class="input-medium medium-c1-sc2Rm" placeholder="">
                                            <i class="moreClick fa fa-ellipsis-h"></i>
                                        </div>
                                        <div class="grid-item">
                                            <label>訂房公司</label>
                                            <input type="text" class="input-medium medium-c1-sc2" placeholder="">
                                        </div>
                                    </div>
                                    <!--6-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>計價房種</label>
                                            <input type="text" class="input-medium medium-c1-sc2Rm" placeholder="">
                                            <i class="moreClick fa fa-ellipsis-h"></i>
                                        </div>
                                        <div class="grid-item">
                                            <label>公司名稱</label>
                                            <input type="text" class="input-medium medium-c1-sc2" placeholder="">
                                        </div>
                                    </div>
                                    <!--7-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>使用房種</label>
                                            <input type="text" class="input-medium medium-c1-sc2Rm" placeholder="">
                                            <i class="moreClick fa fa-ellipsis-h"></i>
                                        </div>
                                        <div class="grid-item">
                                            <label>聯絡人</label>
                                            <input type="text" class="input-medium medium-c1-sc2" placeholder="">
                                        </div>
                                    </div>
                                    <!--8-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>公帳號</label>
                                            <input type="text" class="input-medium medium-c1-sc2Rm" placeholder="">
                                            <i class="moreClick fa fa-ellipsis-h"></i>
                                        </div>
                                        <div class="grid-item">
                                            <label>鍵控代號</label>
                                            <input type="text" class="input-medium medium-c1-sc2Rm" placeholder="">
                                            <i class="moreClick fa fa-ellipsis-h"></i>
                                        </div>
                                    </div>
                                    <!--9-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>聯絡電話</label>
                                            <input type="text" class="input-medium medium-c1-sc2" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>團號</label>
                                            <input type="text" class="input-medium medium-c1-sc2 text-right"
                                                   placeholder="">
                                        </div>
                                    </div>
                                    <!--10-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>Source</label>
                                            <input type="text" class="input-medium medium-c1-sc2" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>市場類別</label>
                                            <input type="text" class="input-medium medium-c1-sc2" placeholder="">
                                        </div>
                                    </div>
                                    <!--11-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>訂房備註</label>
                                            <input type="text" class="input-medium medium-c1-sc3" placeholder="">
                                        </div>
                                    </div>
                                    <!--12-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>是否確認</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>保留日期</label>
                                            <input type="date" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>新增/修改者</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                    </div>
                                    <!--13-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>確認者</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>取消者</label>
                                            <input type="date" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>新增日期</label>
                                            <input type="date" class="input-medium medium-c1" placeholder="">
                                        </div>
                                    </div>
                                    <!--14-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>確認日期</label>
                                            <input type="date" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>取消日期</label>
                                            <input type="date" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>修改日期</label>
                                            <input type="date" class="input-medium medium-c1" placeholder="">
                                        </div>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                        </div> <!-- row-->
                    </div> <!-- /.search-co -->
                </div> <!-- /.row  search-content-->
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
            }
        }
    }
</script>

<style scoped>

</style>