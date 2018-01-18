<template>
    <div v-loading="isLoading" element-loading-text="Loading...">
        <div class="col-xs-12 col-sm-12">
            <div class="row">
                <!--多筆 其他備註 dataGrid-->
                <div class="col-xs-11 col-sm-11">
                    <div class="row no-margin-right">
                        <table id="otherRemark_dg" style="height: 310px;"></table>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <!--/.多筆 其他備註 dataGrid-->
                <!--按鈕-->
                <div class="col-xs-1 col-sm-1">
                    <div class="row">
                        <div class="right-menu-co">
                            <ul>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth sales_editOtherRemark"
                                            role="button" :disabled="BTN_action" @click="appendRow">
                                        {{i18nLang.program.PMS0610020.append_remark}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth sales_editOtherRemark"
                                            role="button" :disabled="BTN_action" @click="editRow">
                                        {{i18nLang.program.PMS0610020.update_remark}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-danger btn-white btn-defaultWidth"
                                            role="button" :disabled="BTN_action" @click="removeRow">
                                        {{i18nLang.program.PMS0610020.remove_remark}}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!--/.按鈕-->
                <!-- 單筆其他備註 gridSingle 彈出視窗 -->
                <div id="singleGridOtherRemark" class="hide padding-5">
                    <div class="businessCompanyData">
                        <div class="col-sm-12 col-xs-12">
                            <div class="row">
                                <!--單筆欄位-->
                                <div class="col-sm-11 col-xs-11">
                                    <div class="row no-margin-right">
                                        <div class="bs-otherRemark-content borderFrame">
                                            <div class="billInfo grid">
                                                <div class="content">
                                                    <div class="row" v-for="fields in gridSingleFieldsData">
                                                        <div class="'grid">
                                                            <div class="grid-item" v-for="field in fields">
                                                                <label>{{ field.ui_display_name }}</label>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <!--<div class="grid">-->
                                                        <!--<div class="grid-item">-->
                                                            <!--<label>備註類別</label>-->
                                                            <!--<input type="text" class="input-medium medium-c1" placeholder="客房備註"/>-->
                                                        <!--</div>-->
                                                    <!--</div>-->
                                                    <!--<div class="grid">-->
                                                        <!--<div class="grid-item">-->
                                                            <!--<label>備註內容</label>-->
                                                            <!--&lt;!&ndash;<input type="text" class="input-medium medium-c1" />&ndash;&gt;-->
                                                            <!--<textarea class="input-medium medium-c1-colv2 height-auto rzNone"-->
                                                                      <!--style="width: 434px; max-width: 100%;" rows="4"-->
                                                                      <!--placeholder="黃董事長住宿一定要高樓層並要有兩顆硬枕頭，夫人不要女用浴袍要換成男用"></textarea>-->
                                                        <!--</div>-->
                                                        <!--<div class="clearfix"></div>-->
                                                    <!--</div>-->
                                                    <!--<div class="space-6"></div>-->
                                                    <!--<div class="grid">-->
                                                        <!--<div class="grid-item">-->
                                                            <!--<label>新增日</label>-->
                                                            <!--<input type="text" class="input-medium medium-c1"-->
                                                                   <!--placeholder="2000/01/01 12:30:00" disabled="disabled"/>-->
                                                        <!--</div>-->
                                                        <!--<div class="grid-item">-->
                                                            <!--<label>新增者</label>-->
                                                            <!--<input type="text" class="input-medium medium-c1" placeholder="cio"-->
                                                                   <!--disabled="disabled"/>-->
                                                        <!--</div>-->
                                                        <!--<div class="grid-item">-->
                                                            <!--<label>最後異動日</label>-->
                                                            <!--<input type="text" class="input-medium medium-c1"-->
                                                                   <!--placeholder="2000/01/01 12:30:00" disabled="disabled"/>-->
                                                        <!--</div>-->
                                                        <!--<div class="grid-item">-->
                                                            <!--<label>最後異動者</label>-->
                                                            <!--<input type="text" class="input-medium medium-c1" placeholder="cio"-->
                                                                   <!--disabled="disabled"/>-->
                                                        <!--</div>-->
                                                    <!--</div>-->
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <!--/.單筆欄位-->
                                <!--按鈕-->
                                <div class="col-sm-1 col-xs-1">
                                    <div class="row">
                                        <div class="right-menu-co">
                                            <ul>
                                                <li>
                                                    <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                                            v-if="isEditStatus" :disabled="BTN_action || isFirstData" @click="toFirstData">
                                                        {{i18nLang.SystemCommon.First}}
                                                    </button>
                                                </li>
                                                <li>
                                                    <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                                            v-if="isEditStatus" :disabled="BTN_action || isFirstData" @click="toPreData">
                                                        {{i18nLang.SystemCommon.Previous}}
                                                    </button>
                                                </li>
                                                <li>
                                                    <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                                            v-if="isEditStatus" :disabled="BTN_action || isLastData" @click="toNextData">
                                                        {{i18nLang.SystemCommon.Next}}
                                                    </button>
                                                </li>
                                                <li>
                                                    <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                                            v-if="isEditStatus" :disabled="BTN_action || isLastData" @click="toLastData">
                                                        {{i18nLang.SystemCommon.Last}}
                                                    </button>
                                                </li>
                                                <li>
                                                    <button class="btn btn-danger btn-white btn-defaultWidth"
                                                            role="button" @click="doDelGrid">
                                                        {{i18nLang.SystemCommon.Delete}}
                                                    </button>
                                                </li>
                                                <li>
                                                    <button class="btn btn-primary btn-white btn-defaultWidth"
                                                            role="button" @click="doLeaveGrid">
                                                        {{i18nLang.SystemCommon.Leave}}
                                                    </button>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>
                                <!--/.按鈕-->
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <!-- /.單筆 其他備註 gridSingle 彈出視窗 -->
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

    export default {
        name: 'other-remark',
        props: ["rowData", "isOtherRemark"],
        data() {
            return {
                i18nLang: go_i18nLang,
                isLoading: false,
                BTN_action: false,
                isCreateStatus: false,
                isEditStatus: false,
                isModificable: false,
                tmpCUD: {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                },
                dataGridRowsData: [],       //多筆資料
                oriDataGridRowsData: [],
                dataGridFieldsData: [],     //多筆欄位資料
                oriDataGridFieldsData: [],
                dgIns: {},
                editingRow: {},             //所選擇的單一(多筆)資料
                isFirstData: false,
                isLastData: false,
                singleData: {},             //單筆資料
                oriSingleData: {},
                gridSingleFieldsData: [],   //單筆欄位資料
                oriGridSingleFieldsData: []
            };
        },
        watch: {
            isOtherRemark(val) {
                if (val) {
                    this.initDataGridData();
                    this.fetchDataGridFieldData();
                }
            },
            editingRow(val) {
                if (!_.isEmpty(val)) {
                    var self = this;

                    this.initGridSingleData();
                    self.fetchGridSingleRowData(val);

                    var nowDatagridRowIndex = $("#otherRemark_dg").datagrid('getRowIndex', val);

                    $("#otherRemark_dg").datagrid('selectRow', nowDatagridRowIndex);

                    if ($("#otherRemark_dg").datagrid('getRowIndex', val) == 0) {
                        //已經到第一筆
                        this.isFirstData = true;
                        this.isLastData = false;
                        if ($("#otherRemark_dg").datagrid('getRowIndex', val) == self.dataGridRowsData.length - 1) {
                            this.isLastData = true;
                        }

                    }
                    else if ($("#otherRemark_dg").datagrid('getRowIndex', val) == self.dataGridRowsData.length - 1) {
                        //已經到最後一筆
                        this.isFirstData = false;
                        this.isLastData = true;
                    }
                    else {

                        this.isFirstData = false;
                        this.isLastData = false;
                    }
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
            initDataGridData() {
                this.dataGridRowsData = [];
                this.oriDataGridRowsData = [];
                this.dataGridFieldsData = [];
                this.oriDataGridFieldsData = [];
                this.dgIns = {};
            },
            initGridSingleData() {
                this.singleData = {};
                this.oriSingleData = {};
                this.gridSingleFieldsData = [];
                this.oriGridSingleFieldsData = [];
            },
            fetchDataGridFieldData() {
                this.isLoading = true;
                $.post("/api/fetchDataGridFieldData", {
                    prg_id: "PMS0610020",
                    tab_page_id: 6,
                    searchCond: {cust_cod: this.$store.state.gs_custCod}
                }).then(result => {
                    this.searchFields = result.searchFields;
                    this.dataGridFieldsData = result.dgFieldsData;
                    this.dataGridRowsData = result.dgRowData;
                    this.oriDataGridRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                    this.showDataGrid();
                    this.fetchGridSingleFieldData();
                });
            },
            fetchGridSingleFieldData() {
                $.post("/api/fetchOnlySinglePageFieldData", {
                    prg_id: "PMS0610020",
                    page_id: 2,
                    tab_page_id: 1120
                }).then(result => {
                    this.oriGridSingleFieldsData = result.gsFieldsData;
                    this.gridSingleFieldsData = _.values(_.groupBy(_.sortBy(result.gsFieldsData, "col_seq"), "row_seq"));
                    console.log(this.gridSingleFieldsData);
                });
            },
            fetchGridSingleRowData(editingRowOfRemark) {
                var self = this;
            },
            showDataGrid() {
                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init("PMS0610020", "otherRemark_dg", DatagridFieldAdapter.combineFieldOption(this.dataGridFieldsData, 'otherRemark_dg'), this.dataGridFieldsData);
                this.dgIns.loadDgData(this.dataGridRowsData);
                this.dgIns.getOriDtRowData(this.oriDataGridRowsData);
                this.isLoading = false;
            },
            appendRow() {
//                this.BTN_action = true;
                this.isCreateStatus = true;
                this.isEditStatus = false;
                this.editingRow = {};
                this.initTmpCUD();
                this.showSingleGridDialog();
            },
            editRow() {
                this.isCreateStatus = false;
                this.isEditStatus = true;
                this.editingRow = {};
                this.initTmpCUD();

                var lo_editRow = $('#otherRemark_dg').datagrid('getSelected');

                if (!lo_editRow) {
                    alert(go_i18nLang["SystemCommon"].SelectData);
                }
                else {
                    this.editingRow = lo_editRow;
                    this.showSingleGridDialog();
                }
            },
            removeRow() {
                var lo_delRow = $('#otherRemark_dg').datagrid("getSelected");

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

                var dialog = $("#singleGridOtherRemark").removeClass('hide').dialog({
                    modal: true,
                    title: go_i18nLang["program"]["PMS0620050"].other_remark,
                    title_html: true,
                    width: 800,
                    maxwidth: 1920,
                    dialogClass: "test",
                    resizable: true,
                    onBeforeClose: function () {
                        self.isCreateStatus = false;
                        self.isEditStatus = false;
                        self.editingRow = {};
                        self.initTmpCUD();
                    }
                });
            },
            //單筆 業務備註 事件
            toFirstData() {
                this.isFirstData = true;
                this.isLastData = false;
                this.editingRow = _.first(this.dataGridRowsData);
            },
            toPreData() {
                var nowRowIndex = $("#otherRemark_dg").datagrid('getRowIndex', this.rowData);
                this.editingRow = this.dataGridRowsData[nowRowIndex - 1];
            },
            toNextData() {
                var nowRowIndex = $("#otherRemark_dg").datagrid('getRowIndex', this.rowData);
                this.editingRow = this.dataGridRowsData[nowRowIndex + 1];
            },
            toLastData() {
                this.isFirstData = false;
                this.isLastData = true;
                this.editingRow = _.last(this.dataGridRowsData);
            },
            doDelGrid() {
                var self = this;
                var q = confirm(go_i18nLang["SystemCommon"].check_delete);
                if (q) {
                    //刪除前檢查
                }
            },
            doLeaveGrid() {
                var self = this;
                $("#singleGridOtherRemark").dialog('close');
            }
        }
    }
</script>