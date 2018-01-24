<template>
    <div v-loading="isLoading" element-loading-text="Loading...">
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
                        :page-one-data-grid-rows="dataGridRowsData"
                        :is-single-visit-record="isSingleVisitRecord"
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
        created(){
            var self = this;
            this.$eventHub.$on("getVisitRecordSingleData",function(visitRecordSingleData){
                self.visitRecordSingleFieldsData = visitRecordSingleData.fieldsData;
                self.visitRecordSingleData = visitRecordSingleData.singleData;
            });
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                isLoading: false,
                BTN_action: false,
                isCreateStatus: false,
                isEditStatus: false,
                isSingleVisitRecord: false,
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
                visitRecordSingleFieldsData: [],
                visitRecordSingleData: {}
            };
        },
        watch: {
            isVisitRecord(val) {
                if (val) {
                    this.initData();
                    this.fetchFieldData();
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
                this.isCreateStatus = this.$store.state.gb_isCreateStatus;
                this.isEditStatus = this.$store.state.gb_isEditStatus;
                this.dataGridRowsData = [];
                this.oriDataGridRowsData = [];
                this.fieldsData = [];
                this.oriFieldsData = [];
                this.dgIns = {};
                this.editingRow = {};
            },
            fetchFieldData() {
                this.isLoading = true;
                $.post("/api/fetchDataGridFieldData", {
                    prg_id: "PMS0610020",
                    tab_page_id: 5,
                    searchCond: {cust_cod: this.$store.state.gs_custCod}
                }).then(result => {
                    this.searchFields = result.searchFields;
                    this.fieldsData = result.dgFieldsData;
                    this.dataGridRowsData = result.dgRowData;
                    this.oriDataGridRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                    this.showDataGrid();
                });
            },
            showDataGrid() {
                this.isLoading = false;
                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init("PMS0610020", "companyVisitRecord_dg", DatagridFieldAdapter.combineFieldOption(this.fieldsData, 'companyVisitRecord_dg'), this.fieldsData);
                this.dgIns.loadDgData(this.dataGridRowsData);
            },
            appendRow() {
                this.initTmpCUD();
                this.isCreateStatus = true;
                this.isEditStatus = false;
                this.editingRow = {
                    avisit_dat: "",
                    cust_cod: "",
                    visit_typ: '1',
                    visit_sta: 'N'
                };

                this.showSingleGridDialog();
            },
            editRow() {
                this.initTmpCUD();
                this.isCreateStatus = false;
                this.isEditStatus = true;

                var lo_editRow = $('#companyVisitRecord_dg').datagrid('getSelected');
                var ln_editIndex = $('#companyVisitRecord_dg').datagrid('getRowIndex', lo_editRow);

                if (!lo_editRow) {
                    alert(go_i18nLang["SystemCommon"].SelectData);
                }
                else {
                    this.editingRow = _.extend(lo_editRow,{index: ln_editIndex});
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
                    this.dgIns.removeRow();
                }
            },
            showSingleGridDialog() {
                var self = this;
                this.BTN_action = false;
                this.isSingleVisitRecord = true;

                var dialog = $("#visitRecord").removeClass('hide').dialog({
                    modal: true,
                    title: go_i18nLang["program"]["PMS0610010"].add_visit_plan,
                    title_html: true,
                    width: 800,
                    maxwidth: 1920,
                    dialogClass: "test",
                    resizable: true,
                    onBeforeClose: function () {
                        self.setNewDataGridRowsData();
                        self.editingRow = {};
                        self.isSingleVisitRecord = false;
                    }
                });
            },
            dataValidate(){
                var self = this;
                var lo_checkResult;

                for (var i = 0; i < this.visitRecordSingleFieldsData.length; i++) {
                    var lo_field = this.visitRecordSingleFieldsData[i];
                    //必填
                    if (lo_field.requirable == "Y" && lo_field.modificable != "N" && lo_field.ui_type != "checkbox") {
                        lo_checkResult = go_validateClass.required(self.visitRecordSingleData[lo_field.ui_field_name], lo_field.ui_display_name);
                        if (lo_checkResult.success == false) {
                            break;
                        }
                    }

                }

                return lo_checkResult
            },
            setNewDataGridRowsData(){
                var lo_chkResult = this.dataValidate();
                if (lo_chkResult.success == false) {
                    alert(lo_chkResult.msg);
                }
                else{
                    var ln_editIdx = _.isUndefined(this.visitRecordSingleData.index)? -1:this.visitRecordSingleData.index;
                    if(ln_editIdx > -1){
                        this.dataGridRowsData[ln_editIdx] = this.visitRecordSingleData;
                    }
                    else{
                        this.dataGridRowsData.push(this.visitRecordSingleData);
                    }
                    this.showDataGrid();
                }
            }
        }
    }
</script>