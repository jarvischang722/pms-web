<template>
    <div>
        <div class="col-xs-12 col-sm-12">
            <div class="row">
                <!-- 多筆 拜訪紀錄 dataGrid -->
                <div class="col-xs-11 col-sm-11">
                    <div class="row no-margin-right">
                        <table id="companyVisitRecord_dg" style="height: 310px;"></table>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <!--/.多筆 拜訪紀錄 dataGrid -->
                <!--按鈕-->
                <div class="col-xs-1 col-sm-1">
                    <div class="row">
                        <div class="right-menu-co">
                            <ul>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth "
                                            role="button" :disabled="BTN_action" @click="appendRow">
                                        {{i18nLang.program.PMS0620050.add_visit_mn}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth "
                                            role="button" :disabled="BTN_action" @click="editRow">
                                        {{i18nLang.program.PMS0620050.edit_vist_mn}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-danger btn-white btn-defaultWidth"
                                            role="button" :disabled="BTN_action" @click="removeRow">
                                        {{i18nLang.program.PMS0620050.remove_visit_mn}}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!--/.按鈕-->
                <!--單筆 拜訪紀錄-->
                <visit-record
                        :row-data="editingRow"
                        :params-data="paramsData"
                        :is-create-status="isCreateStatus"
                        :is-edit-status="isEditStatus"
                ></visit-record>
                <!--/.單筆 拜訪紀錄-->
            </div>
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>

    /** DatagridRmSingleGridClass **/
    function DatagridSingleGridClass() {
    }

    DatagridSingleGridClass.prototype = new DatagridBaseClass();
    DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
    };
    DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    };
    DatagridSingleGridClass.prototype.doSaveColumnFields = function () {
    };
    /*** Class End  ***/

    import visitRecord from './visitRecord.vue';

    export default {
        name: 'company-visit-record',
        props: ["rowData", "isVisitRecord"],
        components: {visitRecord},
        data() {
            return {
                i18nLang: go_i18nLang,
                BTN_action: false,
                isCreateStatus: false,
                isEditStatus: false,
                tmpCUD: {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                },
                dataGridRowsData: [],
                oriDataGridRowsData: [],
                fieldsData: [],
                oriFieldsData: [],
                dgIns: {},
                editingRow: {},
                paramsData: {}
            };
        },
        watch: {
            isVisitRecord(val) {
                if (val) {
                    this.initData();
                    this.fetchFieldData(this.rowData);
                }
            }
        },
        methods: {
            initTmpCUD() {
                this.tmpCUD = {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                }
            },
            initData() {
                this.dataGridRowsData = [];
                this.oriDataGridRowsData = [];
                this.fieldsData = [];
                this.oriFieldsData = [];
                this.dgIns = {};
                this.editingRow = {};
            },
            fetchFieldData(rowData) {
                var self = this;

                self.fetchRowData(rowData);
            },
            fetchRowData(rowData) {
                var self = this;

                this.showDataGrid();
            },
            showDataGrid() {
//                this.dgIns = new DatagridSingleGridClass();
//                this.dgIns.init("PMS0610020", "companyVisitRecord_dg", DatagridFieldAdapter.combineFieldOption(this.fieldsData, 'companyVisitRecord_dg'), this.fieldsData);
//                this.dgIns.loadDgData(this.dataGridRowsData);

                $('#companyVisitRecord_dg').datagrid({
                    singleSelect: true,
                    collapsible: true,
                    // 從json 撈
                    url: '/jsonData/sales/bsCompany_visitRecord.json',
                    method: 'get',
                    columns: [[
                        {field: 'visitWay', title: '拜訪方式', width: 70},
                        {field: 'visitDate', title: '預定拜訪日', width: 100},
                        {field: 'visitStatus', title: '拜訪狀態', width: 70},
                        {field: 'subject', title: '主旨', width: 100},
                        {field: 'contentSum', title: '內容(摘要)', width: 170},
                        {field: 'realVisitDate', title: '實際拜訪日', width: 100},
                        {field: 'traffic', title: '交通費', width: 70, align: 'right'}
                    ]]
                });
            },
            setParamsData() {
                var self = this;

                this.paramsData = {
                    dgId: "companyVisitRecord_dg",
                    pageOneDataGridRows: self.dataGridRowsData,
                    gridSinglePrgId: "PMS0610020",
                    gridSinglePageId: 3
                };
            },
            appendRow() {
//                this.BTN_action = true;
                this.initTmpCUD();
                this.setParamsData();
                this.isCreateStatus = true;
                this.isEditStatus = false;
                this.editingRow = {
                    avisit_dat: "",
                    cust_cod: ""
                };

                this.showSingleGridDialog();
            },
            editRow() {
                this.initTmpCUD();
                this.setParamsData();
//                this.BTN_action = true;
                this.isCreateStatus = false;
                this.isEditStatus = true;

                var lo_editRow = $('#companyVisitRecord_dg').datagrid('getSelected');

                if (!lo_editRow) {
                    alert(go_i18nLang["SystemCommon"].SelectData);
                }
                else {
                    this.editingRow = lo_editRow;
                    this.showSingleGridDialog();
                }
            },
            removeRow() {
                var lo_delRow = $('#companyVisitRecord_dg').datagrid("getSelected");

                if (!lo_delRow) {
                    alert(go_i18nLang["SystemCommon"].SelectOneData);
                }
                else {
                    console.log("delete this row");
//                    this.dgIns.removeRow();
                }
            },
            showSingleGridDialog() {
                var self = this;
                this.BTN_action = false;

                var dialog = $("#visitRecord").removeClass('hide').dialog({
                    modal: true,
                    title: go_i18nLang["program"]["PMS0610010"].add_visit_plan,
                    title_html: true,
                    width: 800,
                    maxwidth: 1920,
                    dialogClass: "test",
                    zIndex: 9999,
                    resizable: true,
                    onBeforeClose: function () {
                        self.editRows = [];
                        self.fetchDataParams = {};
                    }
                });
            }
        }
    }
</script>