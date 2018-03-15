<template>
    <div>
        <div class="col-xs-12">
            <search-comp
                    :search-fields="searchFields"
                    :search-cond.sync="searchCond"
                    :fetch-data="loadDataGridByPrgID"
            ></search-comp>
        </div> <!-- /.col-sm-12 -->
        <div class="clearfix"></div>
        <div class="col-xs-12">
            <div class="col-sm-11 col-xs-11">
                <div class="row no-margin-right">
                    <div class="tableHt">
                        <!-- rateCode-查詢結果 dataGrid -->
                        <!--<table id="setRateCode-table" class="gridTableHt" style="width: 100%;max-width: 100%;"></table>-->
                        <table id="PMS0810230_dg" class="gridTableHt" style="width: 100%;max-width: 100%;"></table>
                    </div>
                </div>
            </div>
            <div class="col-xs-1 col-sm-1">
                <div class="row">
                    <div class="right-menu-co">
                        <ul>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth setRateCode-add"
                                        role="button">Add
                                </button>
                            </li>

                            <li>
                                <button class="btn btn-danger btn-white btn-defaultWidth rateCode_timeRule"
                                        role="button">Delete
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth setRateCode-add"
                                        role="button">Edit
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
    let gs_prgId = "PMS0810230";

    /** DatagridRmSingleGridClass **/
    function DatagridSingleGridClass() {
    }
    DatagridSingleGridClass.prototype = new DatagridBaseClass();
    DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    };
    DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
    };
    /*** Class End  ***/

    export default {
        name: 'pms0810230',
        mounted(){
            this.fetchUserInfo();
            this.loadDataGridByPrgID();
        },
        data(){
            return{
                i18nLang: go_i18nLang,//多語系資料
                go_funcPurview: [],//按鈕權限
                userInfo: {},//使用者資訊
                pageOneDataGridRows: [],//多筆資料
                pageOneFieldData: [],//多筆欄位資料
                searchFields: [],//搜尋欄位資料
                searchCond: {},//搜尋資料
                dgIns: {},//dataGrid 實體
                isLoading: false,//是否載入成功
                isCreateStatus: false,//是否為新增狀態
                isEditStatus: false, //是否為編輯狀態
                isModifiable: true
            }
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
                let self = this;
                let lo_searchCond = _.clone(this.searchCond);
                let lo_params = {
                    prg_id: gs_prgId,
                    searchCond: lo_searchCond
                };

                $.post("/api/prgDataGridDataQuery", lo_params, function (result) {
                    if(self.searchFields.length <= 0){
                        self.searchFields = result.searchFields;
                    }
                    self.pageOneDataGridRows = result.dataGridRows;
                    self.pageOneFieldData = result.fieldData;
                    self.showDataGrid();
                });
            },
            showDataGrid() {
                let self = this;
                this.isLoading = false;
                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init("PMS0810230", "PMS0810230_dg", DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0810230_dg'));
                this.dgIns.loadDgData(this.pageOneDataGridRows);

            },
            appendRow() {
                this.isLoading = true;
                this.isCreateStatus = true;
                this.isEditStatus = false;
                this.editingRow = {};

                this.showSingleGridDialog();
                this.isLoading = false;
            },
            editRow() {
                this.isLoading = true;
                this.isCreateStatus = false;
                this.isEditStatus = true;
                this.editingRow = {};

                var lo_editRow = $('#PMS0210010_dg').datagrid('getSelected');

                if (!lo_editRow) {
                    alert(go_i18nLang["SystemCommon"].SelectOneData);
                }
                else {
                    this.editingRow = lo_editRow;
                    this.showSingleGridDialog();
                }
                this.isLoading = false;
            },
            showSingleGridDialog() {
                let self = this;

                let dialog = $('#PMS0210011_dialog').removeClass('hide').dialog({
                    modal: true,
                    title: "Rate code",
                    title_html: true,
                    width: 1000,
                    maxwidth: 1920,
//                autoOpen: true,
                    dialogClass: "test",
                    resizable: true,
                    onBeforeClose() {
                        self.editingRow = {};
                        self.isEditStatus = false;
                        self.isCreateStatus = false;
                        self.loadDataGridByPrgID();
                    }
                }).dialog('open');
            },
        }
    }
</script>