<template>
    <div class="pageMain">
        <div class="col-xs-12">
            <search-comp
                    :search-fields="searchFields"
                    :search-cond.sync="searchCond"
                    :fetch-data="loadDataGridByPrgID"
            ></search-comp>
        </div> <!-- /.col-sm-12 -->
        <div class="clearfix"></div>
        <div class="col-xs-12">
            <!--<div class="blockSetting-heading">查詢結果</div>-->
            <div class="col-sm-11 col-xs-11">
                <div class="row no-margin-right">
                    <div>
                        <table id="PMS0210010_dg" class=""></table>
                        <!-- gProfile 多筆 dataGrid -->
                        <!--<table id="resv_gProfile-table" class="gridTableHt"></table>-->
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

        data() {
            return {
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
                let self = this;
                $.post('/api/getUserInfo', function (result) {
                    if (result.success) {
                        self.userInfo = result.userInfo;
                    }
                });
            },
            setSearchCond() {
                this.searchCond = {};
            },
            loadDataGridByPrgID() {
                let self = this;
                let lo_searchCond = _.clone(this.searchCond);

                let lo_params = {
                    prg_id: gs_prgId,
                    page_id: 1,
                    searchCond: lo_searchCond
                };

                $.post("/api/fetchDataGridFieldData", lo_params, function (result) {
                    console.log(result);
                    self.searchFields = result.searchFields;
                    self.pageOneFieldData = result.dgFieldsData;
                    self.pageOneDataGridRows = result.dgRowData;
                    self.showDataGrid();
                });
            },
            showDataGrid() {
                var self = this;

                //一開始只載入10筆資料
                var la_showDataRows = this.pageOneDataGridRows.slice(0, 10);

                $('#PMS0210010_dg').datagrid({
                    fitColumns: "true",
                    columns: [DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0210010_dg')],
                    pagination: true,
                    rownumbers: true,
                    pageSize: 10,
                    data: la_showDataRows,
                    singleSelect: true
                });

                var pager = $('#PMS0210010_dg').datagrid('getPager');
                pager.pagination({
                    total: self.pageOneDataGridRows.length,
                    onSelectPage: function (pageNo, pageSize) {
                        var start = (pageNo - 1) * pageSize;
                        var end = start + pageSize;
                        $("#PMS0210010_dg").datagrid("loadData", self.pageOneDataGridRows.slice(start, end));
                        pager.pagination('refresh', {
                            total: self.pageOneDataGridRows.length,
                            pageNumber: pageNo
                        });
                    },
                    pageNumber: 1,
                    pageList: [10, 20, 50],
                    showPageList: true,
                    beforePageText: go_i18nLang.SystemCommon.dataGridBeforePageText,
                    afterPageText: go_i18nLang.SystemCommon.dataGridAfterPageText,
                    displayMsg: go_i18nLang.SystemCommon.dataGridDisplayMsg
                });
                this.isLoading = false;
            }
        }
    }
</script>
