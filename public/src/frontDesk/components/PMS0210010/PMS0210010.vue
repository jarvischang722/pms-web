<template>
    <div>
        <div class="pageMain" v-loading="isLoading" element-loading-text="Loading...">
            <div class="col-xs-12">
                <search-comp
                        :search-fields="searchFields"
                        :search-cond.sync="searchCond"
                        :fetch-data="loadDataGridByPrgID"
                ></search-comp>
            </div> <!-- /.col-sm-12 -->
            <div class="clearfix"></div>
            <div class="col-xs-12">
                <!--單筆-->
                <div class="col-sm-11 col-xs-11">
                    <div class="row no-margin-right">
                        <div>
                            <table id="PMS0210010_dg" class=""></table>
                            <!-- gProfile 多筆 dataGrid -->
                            <!--<table id="resv_gProfile-table" class="gridTableHt"></table>-->
                        </div>
                    </div>
                </div>
                <!--/.單筆-->
                <!--按鈕-->
                <div class="col-xs-1 col-sm-1">
                    <div class="row">
                        <div class="right-menu-co">
                            <ul>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth"
                                            role="button" @click="appendRow">{{i18nLang.SystemCommon.Add}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth"
                                            role="button" @click="editRow">{{i18nLang.SystemCommon.Modify}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-gray btn-defaultWidth resv_merge"
                                            role="button">{{i18nLang.program.PMS0210010.merge}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth btn-skin"
                                            role="button">{{i18nLang.program.PMS0610010.save_as}}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!--/.按鈕-->
            </div> <!-- /.col-sm-12 -->
            <div class="clearfix"></div>
        </div>
        <pms0210011
                :row-data="editingRow"
                :is-modifiable="isModifiable"
                :is-create-status="isCreateStatus"
                :is-edit-status="isEditStatus"
        ></pms0210011>
    </div>
</template>
<script>
    import pms0210011 from './PMS0210011.vue';

    Vue.prototype.$eventHub = new Vue();

    let gs_prgId = "PMS0210010";

    export default {
        name: 'pms0210010',
        components: {pms0210011},
        created(){
            var self = this;
            this.$eventHub.$on('addNewData', function () {
                setTimeout(()=>{
                    self.appendRow();
                }, 100);
            });
        },
        mounted() {
            this.fetchUserInfo();
            this.setSearchCond();
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
            setSearchCond() {
                this.searchCond = {
                    agent_idx_show_cod:[],
                    ccust_nam:"",
                    contry_cod:[],
                    dm_flag:[],
                    id_cod:"",
                    mobile_nos:"",
                    show_cod:[],
                    status_cod:"",
                    trans_tot:"",
                    visit_days:"",
                    visit_nos:"",
                    birth_dat:[],
                    ci_dat:'',
                    name: ""
                };
            },
            loadDataGridByPrgID() {
                let self = this;
                let lo_searchCond = _.clone(this.searchCond);

                lo_searchCond.ci_dat = lo_searchCond.ci_dat!=""? moment(lo_searchCond.ci_dat).format("YYYY/MM/DD"): lo_searchCond.ci_dat;

                let lo_params = {
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
                    }
                }).dialog('open');
            },
        }
    }
</script>
