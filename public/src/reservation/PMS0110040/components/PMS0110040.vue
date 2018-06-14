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
                                    <button class="btn btn-primary btn-white btn-defaultWidth"
                                            role="button" @click="appendRow">新增
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
    import pms0110041Lite from './PMS0110041_LITE.vue';

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
        components: {pms0110041Lite},
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
                activeName: '',

                prg_id: "PMS0110040",
                userInfo: {},               //使用者資訊
                searchFields: [],           //搜尋欄位資料
                searchCond: {},             //搜尋資料
                pageOneDataGridRows: [],    //多筆資料
                pageOneFieldData: [],        //多筆欄位資料
                editingRow: {},
                isCreateStatus: false,
                isEditStatus: false,
                isModifiable: true,
            }
        },
        watch: {
            /**
             * 靜態所綁的資料
             */
            activeName(val) {
                if (val == 'first') {
                    $('#bookings02').hide();
                    $('#bookings01').show();
                    $('#resv_bookings01-table').datagrid({
                        singleSelect: true,
                        collapsible: true,
                        url: '/jsonData/reservation/resv_bookings01.json',
                        method: 'get',
                        columns: [[
                            {field: 'resvCardNum', title: '訂房卡號', width: 80},
                            {field: 'status', title: '狀態', width: 60},
                            {field: 'ciDate', title: '入住日期', width: 80},
                            {field: 'coDate', title: '退房日期', width: 80},
                            {field: 'dateNum', title: '天數', width: 40},
                            {field: 'roomPriceCode', title: '房價代號', width: 150},
                            {field: 'roomKindAcc', title: '計價房型', width: 65},
                            {field: 'useHousing', title: '使用房型', width: 65},
                            {field: 'resv', title: '訂房', width: 50, align: "right"},
                            {field: 'assignRoom', title: '排房', width: 50, align: "right"},
                            {field: 'ci', title: 'C/I', width: 50, align: "right"},
                            {field: 'uniPrice', title: '單價', width: 70, align: "right"},
                            {field: 'serPrice', title: '服務費', width: 70, align: "right"},
                            {field: 'groupNum', title: '團號', width: 60},
                            {field: 'companyName', title: '訂房公司', width: 130},
                            {field: 'connection', title: '聯絡人', width: 110},
                            {field: 'sales', title: '業務員', width: 110},
                            {field: 'onlineBookNum', title: '網訂編號', width: 90}
                        ]]
                    });
                }
                else {
                    $('#bookings01').hide();
                    $('#bookings02').show();
                    $('#resv_bookings02-table').datagrid({
                        singleSelect: true,
                        reload: true,
                        collapsible: true,
                        url: '/jsonData/reservation/resv_bookings02.json',
                        method: 'get',
                        columns: [[
                            {field: 'resvCardNum', title: '訂房卡號', width: 80},
                            {field: 'sort', title: '序號', width: 40},
                            {field: 'room', title: '房號', width: 40},
                            {field: 'name', title: '住客姓名', width: 80},
                            {field: 'status', title: '狀態', width: 60},
                            {field: 'ciDate', title: '入住日期', width: 80},
                            {field: 'coDate', title: '退房日期', width: 80},
                            {field: 'dateNum', title: '天數', width: 40},
                            {field: 'roomPriceCode', title: '房價代號', width: 150},
                            {field: 'roomKindAcc', title: '計價房型', width: 65},
                            {field: 'useHousing', title: '使用房型', width: 65},
                            {field: 'resv', title: '訂房', width: 50, align: "right"},
                            {field: 'assignRoom', title: '排房', width: 50, align: "right"},
                            {field: 'ci', title: 'C/I', width: 50, align: "right"},
                            {field: 'uniPrice', title: '單價', width: 60, align: "right"},
                            {field: 'serPrice', title: '服務費', width: 60, align: "right"},
                            {field: 'groupNum', title: '團號', width: 40},
                            {field: 'companyName', title: '訂房公司', width: 100},
                            {field: 'connection', title: '聯絡人', width: 80},
                            {field: 'sales', title: '業務員', width: 80},
                            {field: 'resvSource', title: '訂房來源', width: 80},
                            {field: 'marketCategory', title: '市場類別', width: 100},
                            {field: 'onlineBookNum', title: '網訂編號', width: 80}
                        ]]
                    });

                }
            }
        },
        mounted() {
            this.fetchUserInfo();

            this.activeName = 'first';

//            this.fetchDgFieldsRowData();
        },
        methods: {
            /**
             * 靜態所綁的資料
             */
            handleClick(tab, event) {
            },
            fetchUserInfo() {
                let self = this;
                BacUtils.doHttpPostAgent('/api/getUserInfo', function (result) {
                    if (result.success) {
                        self.userInfo = result.userInfo;
                    }
                });
            },
            fetchDgFieldsRowData() {
                let lo_searchCond = _.clone(this.searchCond);

                let lo_params = {
                    prg_id: this.prg_id,
                    page_id: 1,
                    searchCond: lo_searchCond
                };
                // this.isLoading = true;
                BacUtils.doHttpPostAgent("/api/fetchDataGridFieldData", lo_params, result => {
                    if (this.searchFields.length <= 0) {
                        this.searchFields = result.searchFields;
                    }
                    this.pageOneFieldData = result.dgFieldsData;
                    this.pageOneDataGridRows = result.dgRowData;
                    this.showDataGrid();
                    // this.isLoading = false;
                });
            },
            showDataGrid() {
                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init(this.prg_id, "PMS0110040_dg", DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0110040_dg'), this.pageOneFieldData, {
                    pagination: true,
                    rownumbers: true
                });
                this.dgIns.loadPageDgData(this.pageOneDataGridRows);
            },
            fetchDgRowData() {
                let lo_params = {
                    prg_id: this.prg_id,
                    page_id: 1,
                    searchCond: this.searchCond
                };
                BacUtils.doHttpPostAgent("/api/fetchDgRowData", lo_params, result => {
                    this.pageOneDataGridRows = result.dgRowData;
                    this.dgIns.loadPageDgData(this.pageOneDataGridRows);
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