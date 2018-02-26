<template>
    <div class="pageMain">
        <div class="col-xs-12">
            <div class="search-content">
                <div class="search-co">
                    <div class="row">
                        <div class="col-xs-12 search-co-content search-S2">
                            <div class="width-95 searchMain-S2">
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>姓名</label>
                                        <input type="text" class="input-medium medium-c1"/>
                                    </div>
                                    <div class="grid-item">
                                        <label classs="">國籍</label>
                                        <input type="text" class="input-medium medium-c1"/>
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


                                <div class="grid">
                                    <div class="grid-item">
                                        <label>歷史編號</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="">
                                    </div>
                                    <div class="grid-item">
                                        <label>狀態</label>
                                        <select class="input-medium medium-c1">
                                            <option value="1">VIP</option>
                                            <option value="2">黑名單</option>
                                            <option value="3">一般</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>身分證字號</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="">
                                    </div>
                                    <div class="grid-item">
                                        <label>Mobile</label>
                                        <input type="text" class="input-medium medium-c1"/>
                                    </div>
                                </div>

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>出生月份</label>
                                        <input type="month" class="input-medium medium-c1" placeholder="">
                                    </div>
                                    <div class="grid-item">
                                        <label>C/I日期</label>
                                        <input type="date" class="input-medium medium-c1" placeholder="">
                                    </div>
                                </div>

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>來訪次數</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="">
                                    </div>
                                    <div class="grid-item">
                                        <label>來訪天數</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="">
                                    </div>
                                </div>

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>消費總額</label>
                                        <input type="text" class="input-medium medium-c1 text-right" placeholder="">
                                    </div>

                                    <div class="grid-item">
                                        <label>是否收取DM</label>
                                        <select class="input-medium medium-c1">
                                            <option value="y">Y</option>
                                            <option value="n">N</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>訂房公司</label>
                                        <input type="text" class="input-medium medium-c1-col2v2" placeholder="">
                                    </div>
                                </div>

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>公司名稱</label>
                                        <input type="text" class="input-medium medium-c1-col2v2" placeholder="">
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                    </div> <!-- row-->

                </div> <!-- /.search-co -->
            </div> <!-- /.row  search-content-->
        </div> <!-- /.col-sm-12 -->
        <div class="clearfix"></div>
        <div class="col-xs-12">
            <!--<div class="blockSetting-heading">查詢結果</div>-->
            <div class="col-sm-11 col-xs-11">
                <div class="row no-margin-right">
                    <div>
                        <!-- gProfile 多筆 dataGrid -->
                        <table id="resv_gProfile-table" class="gridTableHt"></table>
                    </div>
                </div>
            </div>
            <div class="col-xs-1 col-sm-1">
                <div class="row">
                    <div class="right-menu-co">
                        <ul>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth reservationDialog-2"
                                        role="button">Add
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth reservationDialog-2"
                                        role="button">Edit
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-gray btn-defaultWidth resv_merge"
                                        role="button">Merge
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                        role="button">Save As
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div> <!-- /.col-sm-12 -->
        <div class="clearfix"></div>
    </div>
</template>
<script>

    var gs_prgId = "PMS0210010";

    export default {
        name: 'pms0210010',
        mounted() {
            this.loadDataGridByPrgID();
        },
        components: {},
        data() {
            return{
                i18nLang: go_i18nLang,//多語系資料
                go_funcPurview: [],//按鈕權限
                userInfo: {},//使用者資訊
                pageOneDataGridRows: [],//多筆資料
                pageOneFieldData: [],//多筆欄位資料
                searchFields: [],//搜尋欄位資料
                searchCond: {},//搜巡資料
                dgIns: {},//dataGrid 實體
                isLoading: false,//是否載入成功
            }
        },
        methods: {
            fetchUserInfo() {
                var self = this;
                $.post('/api/getUserInfo', function (result) {
                    if (result.success) {
                        self.userInfo = result.userInfo;
                    }
                });
            },
            setSearchCond(){
                this.searchCond = {};
            },
            loadDataGridByPrgID() {
                var self = this;
                var lo_searchCond = _.clone(this.searchCond);

                var lo_params = {
                    prg_id: gs_prgId,
                    page_id: 1,
                    searchCond: lo_searchCond
                };

                $.post("/api/fetchDataGridFieldData", lo_params, function (result) {
                    self.searchFields = result.searchFields;
                    self.pageOneFieldData = result.dgFieldsData;
                    self.pageOneDataGridRows = result.dgRowData;
                    self.showDataGrid();
                });
            },
            showDataGrid() {
                console.log(this.pageOneFieldData);
            }
        }
    }
</script>
