<template>
    <div>
        <div class="col-xs-12">
            <search-comp
                    :search-fields="searchFields"
                    :search-cond.sync="searchCond"
                    :fetch-data="loadDataGridByPrgID"
            ></search-comp>
            <!--<div class="search-content">-->
                <!--<div class="search-co">-->
                    <!--<div class="search-co-h">-->
                        <!--<i class="ace-icon fa fa-search search-icon"></i>-->
                        <!--<span>Search</span>-->
                        <!--<div class="row search-right-btn">-->
                            <!--<div class="right-btn-menu-co">-->
                                <!--<ul>-->
                                    <!--<li>-->
                                        <!--<i class="fa fa-chevron-down show-search-detail"></i>-->
                                    <!--</li>-->
                                <!--</ul>-->
                            <!--</div>-->
                        <!--</div>-->
                    <!--</div>-->
                    <!--<div class="row">-->
                        <!--<div class="search-co-content col-xs-12">-->
                            <!--<div class="col-sm-4">-->

                            <!--</div>-->
                            <!--<div class="col-sm-4">-->

                            <!--</div>-->
                            <!--<div class="col-sm-4">-->

                            <!--</div>-->
                        <!--</div>-->
                        <!--<div class="search-co-content col-xs-12 rece-search-detail"-->
                             <!--style="display: none;">-->
                            <!--<div class="row search-footer-btn">-->
                                <!--<div class="footer-btn-menu-co">-->
                                    <!--<ul>-->
                                        <!--<li>-->
                                            <!--<div class="" data-rel="tooltip"-->
                                                 <!--data-placement="bottom"-->
                                                 <!--title="查詢">-->
                                                <!--<div class="icon-reStyle icon-co-14"></div>-->
                                            <!--</div>-->
                                        <!--</li>-->
                                        <!--<li>-->
                                            <!--<div class="" data-rel="tooltip"-->
                                                 <!--data-placement="bottom"-->
                                                 <!--title="清除">-->
                                                <!--<div class="icon-reStyle icon-co-11"></div>-->
                                            <!--</div>-->
                                        <!--</li>-->
                                    <!--</ul>-->
                                <!--</div>  &lt;!&ndash; /.footer-btn-menu-co &ndash;&gt;-->
                            <!--</div> &lt;!&ndash; /.search-footer-btn &ndash;&gt;-->
                            <!--<div class="width-95">-->
                                <!--<div class="grid">-->
                                    <!--<div class="grid-item">-->
                                        <!--<label>房價名稱</label>-->
                                        <!--<input type="text" class="input-medium medium-c1"/>-->
                                    <!--</div>-->
                                    <!--<div class="grid-item">-->
                                        <!--<label>設定類別</label>-->
                                        <!--<select class="input-medium medium-c1">-->
                                            <!--<option value="DR">DR:Daily</option>-->
                                            <!--<option value="PKG">PKG:Package</option>-->
                                            <!--<option value="HU">HU:House use</option>-->
                                            <!--<option value="ENT">CMP:Complimentary</option>-->
                                            <!--&lt;!&ndash;<option value="HR">HR:Hourly</option>&ndash;&gt;-->
                                            <!--&lt;!&ndash;<option value="MR">MR:Monthly</option>&ndash;&gt;-->
                                        <!--</select>-->
                                    <!--</div>-->
                                    <!--<div class="grid-item">-->
                                        <!--<label>房價分類</label>-->
                                        <!--<input type="text" class="input-medium medium-c1"/>-->
                                    <!--</div>-->
                                <!--</div>-->
                                <!--<div class="grid">-->
                                    <!--<div class="grid-item">-->
                                        <!--<label>房價代號</label>-->
                                        <!--<input type="text" class="input-medium medium-c1"/>-->
                                    <!--</div>-->
                                    <!--<div class="grid-item">-->
                                        <!--<label>市場類別</label>-->
                                        <!--<select class="input-medium medium-c1">-->
                                            <!--<option value="lof">LOF:一般散客</option>-->
                                        <!--</select>-->
                                    <!--</div>-->
                                    <!--<div class="grid-item">-->
                                        <!--<label>訂房來源</label>-->
                                        <!--<select class="input-medium medium-c1">-->
                                            <!--<option value="tel">1.電話訂房</option>-->
                                            <!--&lt;!&ndash;<option value="web">2.官網訂房</option>&ndash;&gt;-->
                                            <!--&lt;!&ndash;<option value="app">3.app訂房</option>&ndash;&gt;-->
                                        <!--</select>-->
                                    <!--</div>-->
                                <!--</div>-->
                                <!--<div class="grid">-->
                                    <!--<div class="grid-item">-->
                                        <!--<label>MENU選單</label>-->
                                        <!--<input type="text" class="input-medium medium-c1"/>-->
                                    <!--</div>-->
                                    <!--<div class="grid-item">-->
                                        <!--<label>預設顯示</label>-->
                                        <!--<select class="input-medium medium-c1">-->
                                            <!--<option value="disYes">是</option>-->
                                            <!--<option value="disNo">否</option>-->
                                            <!--<option value="disAll">全部</option>-->
                                        <!--</select>-->
                                    <!--</div>-->
                                    <!--<div class="grid-item">-->
                                        <!--<label>可使用日期</label>-->
                                        <!--<input type="date" class="input-medium medium-c1"/>-->
                                    <!--</div>-->
                                <!--</div>-->
                                <!--<div class="grid">-->
                                    <!--<div class="grid-item">-->
                                        <!--<label>屬性</label>-->
                                        <!--<select class="input-medium medium-c1">-->
                                            <!--<option value="att1">Base Rate</option>-->
                                            <!--<option value="att2">Dependant Rate</option>-->
                                            <!--<option value="att3">Independant Rate</option>-->
                                        <!--</select>-->
                                    <!--</div>-->
                                <!--</div>-->
                            <!--</div>-->
                            <!--<div class="clearfix"></div>-->
                        <!--</div>-->
                    <!--</div> &lt;!&ndash; row&ndash;&gt;-->
                <!--</div> &lt;!&ndash; /.search-co &ndash;&gt;-->
            <!--</div> &lt;!&ndash; /.row  search-content&ndash;&gt;-->
        </div> <!-- /.col-sm-12 -->
        <div class="clearfix"></div>
        <div class="col-xs-12">
            <div class="col-sm-11 col-xs-11">
                <div class="row no-margin-right">
                    <div class="tableHt">
                        <!-- rateCode-查詢結果 dataGrid -->
                        <table id="setRateCode-table" class="gridTableHt" style="width: 100%;max-width: 100%;"></table>
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

                    self.searchFields = result.searchFields;
                    self.pageOneDataGridRows = result.dataGridRows;
                    self.pageOneFieldData = result.fieldData;
                    console.log(result);
//                    vm.showDataGrid();
                });
            },
            showDataGrid() {
                let self = this;

                //一開始只載入10筆資料
                let la_showDataRows = this.pageOneDataGridRows.slice(0, 10);

                $('#PMS0210010_dg').datagrid({
                    fitColumns: "true",
                    columns: [DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0210010_dg')],
                    pagination: true,
                    rownumbers: true,
                    pageSize: 10,
                    data: la_showDataRows,
                    singleSelect: true
                });

                let pager = $('#PMS0210010_dg').datagrid('getPager');
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
            },
            appendRow() {
                this.isLoading = true;
                this.isCreateStatus = true;
                this.isEditStatus = false;
                this.editingRow = {gcust_cod: ""};

                this.showSingleGridDialog();
                this.isLoading = false;
            },
            editRow() {
                var self = this;

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

                let dialog = $('#PMS0210011').removeClass('hide').dialog({
                    autoOpen: false,
                    modal: true,
                    title: "住客歷史",
                    width: 1000,
                    maxwidth: 1920,
                    minheight: 800,
                    dialogClass: "test",
                    resizable: true,
                    onBeforeClose() {
                        self.editingRow = {};
                        self.isEditStatus = false;
                        self.isCreateStatus = false;
                        self.$store.dispatch("setAllDataClear");
                        self.loadDataGridByPrgID();
                    }
                }).dialog('open');
            },
        }
    }
</script>