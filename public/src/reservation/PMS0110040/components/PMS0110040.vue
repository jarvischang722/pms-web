<template>
    <div>
        <div class="page-header"></div><!-- /.page-header -->
        <!-- 訂房卡(Bookings) Page-->
        <div class="pageMain" v-loading="isLoading">
            <div class="col-xs-12">
                <!--<search-comp-->
                <!--:search-fields="searchFields"-->
                <!--:search-cond.sync="searchCond"-->
                <!--:fetch-data="fetchDgRowData"-->
                <!--&gt;</search-comp>-->

                <!--靜態-->
                <div class="search-content" id="search-con">
                    <div class="search-co">
                        <div class="row">
                            <div class="search-co-content col-xs-12 search-S2">
                                <div class="width-95 searchMain-S2">
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>住客姓名</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>入住日期</label>
                                            <template>
                                                <el-date-picker v-model="ciDate1" type="date"
                                                                placeholder="入住日期"
                                                                class="date-wt input-medium medium-c1">
                                                </el-date-picker>
                                            </template>
                                        </div>
                                        <div class="grid-item">
                                            <label>速查</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
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
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>訂房卡號</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>退房日期</label>
                                            <template>
                                                <el-date-picker v-model="coDate1" type="date"
                                                                placeholder="退房日期"
                                                                class="date-wt input-medium medium-c1">
                                                </el-date-picker>
                                            </template>
                                        </div>
                                        <div class="grid-item">
                                            <label>訂房卡狀態</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                    </div>
                                    <!--2-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>網訂編號</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>

                                        <div class="grid-item">
                                            <label>房價代號</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>

                                        <div class="grid-item">
                                            <label>種類</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                    </div>
                                    <!--3-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>團號</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>計價房型</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>訂房來源</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                    </div>
                                    <!--4-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>訂房公司</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>使用房型</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>市場類別</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                    </div>
                                    <!--5-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>公司名稱</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>聯絡人</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                    </div>
                                    <!--6-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>業務員</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>聯絡電話</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                    </div>
                                    <!--7-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>公帳號</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>訂房備註</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                    </div>
                                    <!--8-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>是否確認</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>保留日期</label>
                                            <template>
                                                <el-date-picker v-model="retentionDate" type="date"
                                                                placeholder="保留日期"
                                                                class="date-wt input-medium medium-c1">
                                                </el-date-picker>
                                            </template>
                                        </div>
                                        <div class="grid-item">
                                            <label>新增/修改者</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                    </div>
                                    <!--9-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>確認者</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>取消者</label>
                                            <input type="text" class="input-medium medium-c1" placeholder="">
                                        </div>
                                        <div class="grid-item">
                                            <label>新增日期</label>
                                            <template>
                                                <el-date-picker v-model="newDate" type="date"
                                                                placeholder="新增日期"
                                                                class="date-wt input-medium medium-c1">
                                                </el-date-picker>
                                            </template>
                                        </div>
                                    </div>
                                    <!--10-->
                                    <div class="grid">
                                        <div class="grid-item">
                                            <label>確認日期</label>
                                            <template>
                                                <el-date-picker v-model="checkDate" type="date"
                                                                placeholder="確認日期"
                                                                class="date-wt input-medium medium-c1">
                                                </el-date-picker>
                                            </template>
                                        </div>
                                        <div class="grid-item">
                                            <label>取消日期</label>
                                            <template>
                                                <el-date-picker v-model="cancelDate" type="date"
                                                                placeholder="取消日期"
                                                                class="date-wt input-medium medium-c1">
                                                </el-date-picker>
                                            </template>
                                        </div>
                                        <div class="grid-item">
                                            <label>修改日期</label>
                                            <template>
                                                <el-date-picker v-model="editDate" type="date"
                                                                placeholder="修改日期"
                                                                class="date-wt input-medium medium-c1">
                                                </el-date-picker>
                                            </template>
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

                        <!--<table id="PMS0110040_dg" class=""></table>-->

                        <template>
                            <el-tabs v-model="activeName" type="card">
                                <el-tab-pane label="訂房多筆" name="first"></el-tab-pane>
                                <el-tab-pane label="訂房明細" name="second"></el-tab-pane>
                            </el-tabs>
                        </template>
                        <div>
                            <div id="bookings01" class="easyui-panel" v-show="activeName=='first'">
                                <table id="resv_bookings01-table" class="gridTableHt"></table>
                            </div>
                            <div id="bookings02" class="easyui-panel" v-show="activeName=='second'">
                                <table id="resv_bookings02-table" class="gridTableHt"></table>
                            </div>
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
        <pms0110041-lite
                :row-data="editingRow"
                :is-modifiable="isModifiable"
                :is-create-status="isCreateStatus"
                :is-edit-status="isEditStatus"
        ></pms0110041-lite>
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
                /**
                 * 靜態所綁的資料
                 */
                ciDate1: new Date(),
                coDate1: new Date(),
                newDate: new Date(),
                retentionDate: new Date(),
                checkDate: new Date(),
                cancelDate: new Date(),
                editDate: new Date(),
                activeName: 'mnDg',
                dtIns: null,
                mnIns: null,

                prg_id: "PMS0110040",
                userInfo: {},               //使用者資訊
                searchFields: [],           //搜尋欄位資料
                searchCond: {},             //搜尋資料
                mnDgRowsData: [],           //多筆資料
                mnDgFieldsData: [],         //多筆欄位資料
                dtDgRowsData: [],           //訂房明細資料
                dtDgFieldsData: [],         //訂房明細欄位資料
                dgIns: null,

                pageOneDataGridRows: [],    //多筆資料
                pageOneFieldData: [],        //多筆欄位資料
                editingRow: {},
                isCreateStatus: false,
                isEditStatus: false,
                isModifiable: true,
            }
        },
        watch: {
            activeName(val) {
                if (val == "dtDg" && this.dtIns == null) {
                    this.fetchDgFieldsRowDataByTabPageId(2);
                }
            }
        },
        mounted() {
            this.fetchUserInfo();
            this.fetchDgFieldsRowDataByTabPageId(1);
        },
        methods: {
            fetchUserInfo() {
                BacUtils.doHttpPromisePostProxy('/api/getUserInfo').then((result) => {
                    if (result.success) {
                        this.userInfo = result.userInfo;
                    }
                });
            },

            /**
             * 透過tab_page_id取多筆欄位資訊和資料
             * @param tab_page_id {number} 分頁
             */
            fetchDgFieldsRowDataByTabPageId(tab_page_id) {
                let lo_params = {
                    prg_id: this.prg_id,
                    page_id: 1,
                    tab_page_id: tab_page_id,
                    searchCond: this.searchCond
                };

                BacUtils.doHttpPromisePostProxy("/api/fetchDataGridFieldData", lo_params).then(result => {
                    if (result.success) {
                        if (this.searchFields.length <= 0) {
                            this.searchFields = result.searchFields;
                            console.log(_.findWhere(this.searchFields, {ui_type: "multiselectgrid"}));
                        }

                        if (tab_page_id == 1) {
                            this.mnDgFieldsData = result.dgFieldsData;
                            this.mnDgRowsData = result.dgRowData;
                        }
                        else {
                            this.dtDgFieldsData = result.dgFieldsData;
                            this.dtDgRowsData = result.dgRowData;
                        }

                        this.showDataGrid(tab_page_id);
                    }
                    else {
                        console.error(result.errorMsg);
                    }

                });
            },
            showDataGrid(tab_page_id) {
                let ls_dgId;
                let la_dgFieldsData;
                let la_dgRowsData;
                if (tab_page_id == 1) {
                    ls_dgId = "PMS0110040_mnDg";
                    la_dgFieldsData = this.mnDgFieldsData;
                    la_dgRowsData = this.mnDgRowsData;
                }
                else {
                    ls_dgId = "PMS0110040_dtDg";
                    la_dgFieldsData = this.dtDgFieldsData;
                    la_dgRowsData = this.dtDgRowsData;
                }

                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init(this.prg_id, ls_dgId, DatagridFieldAdapter.combineFieldOption(la_dgFieldsData, ls_dgId), la_dgFieldsData, {
                    pagination: true,
                    rownumbers: true
                });
                this.dgIns.loadPageDgData(la_dgRowsData);
            },
            fetchDgRowData() {
                let lo_params = {
                    prg_id: this.prg_id,
                    page_id: 1,
                    searchCond: this.searchCond
                };
                BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", lo_params).then(result => {
                    console.log(result);
                    this.mnDgRowsData = result.dgRowData;
                    this.dgIns.loadPageDgData(this.mnDgRowsData);
                });
            },
            appendRow() {
                this.isEditStatus = true;
                this.isCreateStatus = false;
                this.editingRow = {ikey: "00000050"};

                this.showSingleGridDialog();
            },
            showSingleGridDialog() {
                let self = this;
                let dialog = $('#PMS0110041Lite').removeClass('hide').dialog({
                    autoOpen: false,
                    modal: true,
                    title: '訂房卡',
                    width: 1000,
                    maxHeight: 1920,
                    resizable: true,
                    onBeforeClose() {
                        self.editingRow = {};
                        self.isEditStatus = false;
                        self.isCreateStatus = false;
                    }
                });
                dialog.dialog('open');
            }
        }
    }

</script>

<style scoped>

</style>