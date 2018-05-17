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
                                    <button class="btn btn-primary btn-white btn-defaultWidth purview_btn"
                                            role="button" :disabled="BTN_action" @click="appendRow"
                                            data-purview_func_id="PMS0610020-1090">
                                        {{i18nLang.program.PMS0620050.add_visit_mn}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth purview_btn"
                                            role="button" :disabled="BTN_action" @click="editRow({}, -1)"
                                            data-purview_func_id="PMS0610020-1100">
                                        {{i18nLang.program.PMS0620050.edit_vist_mn}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-danger btn-white btn-defaultWidth purview_btn"
                                            role="button" :disabled="BTN_action" @click="removeRow"
                                            data-purview_func_id="PMS0610020-1110">
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
    /*** Class End  ***/

    import visitRecord from './visitRecord.vue';

    export default {
        name: 'company-visit-record',
        props: ["rowData", "isVisitRecord"],
        components: {visitRecord},
        created() {
            var self = this;
            this.$eventHub.$on("getVisitRecordSingleData", function (visitRecordSingleData) {
                self.visitRecordSingleFieldsData = visitRecordSingleData.fieldsData;
                self.visitRecordSingleData = visitRecordSingleData.singleData;
                self.visitRecordOriSingleData = visitRecordSingleData.oriSingleData;
                self.setNewDataGridRowsData();
            });
            this.$eventHub.$on("getOtherRowData", (data) => {
                this.editRow(data.rowData, data.rowIndex);
            });
        },
        data() {
            return {
                go_funcPurview: [],
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
                visitRecordSingleData: {},
                visitRecordOriSingleData: {}
            };
        },
        watch: {
            isVisitRecord(val) {
                if (val) {
                    if (_.isEmpty(this.$store.state.go_allData.ga_vrDataGridRowsData)) {
                        this.initTmpCUD();
                        this.initData();
                    }
                    this.fetchFieldData();
                    this.go_funcPurview = (new FuncPurview("PMS0610020")).getFuncPurvs();
                }
            },
            dataGridRowsData: {
                handler: function (val) {
                    if (!_.isEmpty(val)) {
                        this.$store.dispatch("setVrDataGridRowsData", {
                            ga_vrDataGridRowsData: val,
                            ga_vrOriDataGridRowsData: this.oriDataGridRowsData,
                            go_vrTmpCUD: this.tmpCUD
                        });
                    }
                    //將業務備註資料放至Vuex
                },
                deep: true
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
                BacUtils.doHttpPostAgent("/api/fetchDataGridFieldData", {
                    prg_id: "PMS0610020",
                    tab_page_id: 5,
                    searchCond: {cust_cod: this.$store.state.gs_custCod}
                }, result => {
                    this.searchFields = result.searchFields;
                    this.fieldsData = result.dgFieldsData;
                    if (_.isEmpty(this.$store.state.go_allData.ga_vrDataGridRowsData)) {
                        this.dataGridRowsData = result.dgRowData;
                        this.oriDataGridRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                    }
                    else {
                        this.dataGridRowsData = this.$store.state.go_allData.ga_vrDataGridRowsData;
                        this.oriDataGridRowsData = this.$store.state.go_allOriData.ga_vrDataGridRowsData;
                    }

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
                this.isCreateStatus = true;
                this.isEditStatus = false;
                this.editingRow = {
                    avisit_dat: "",
                    cust_cod: "",
                    visit_typ: '1',
                    visit_sta: 'N',
                    createIndex: this.tmpCUD.createData.length
                };

                this.showSingleGridDialog();
            },
            editRow(rowData, rowIndex) {
                this.isCreateStatus = false;
                this.isEditStatus = true;
                this.editingRow = {};

                let lo_editRow = {};
                let ln_editIndex = -1;

                if (_.isEmpty(rowData)) {
                    lo_editRow = $('#companyVisitRecord_dg').datagrid('getSelected');
                    ln_editIndex = $('#companyVisitRecord_dg').datagrid('getRowIndex', lo_editRow);
                }
                else {
                    lo_editRow = rowData;
                    ln_editIndex = rowIndex;
                }

                //轉換原始資料時間格式
                this.visitRecordOriSingleData["visit_dat"] =
                    _.isNull(this.visitRecordOriSingleData["visit_dat"]) ? "" : moment(new Date(this.visitRecordSingleData["visit_dat"])).format("YYYY/MM/DD");
                this.visitRecordOriSingleData["avisit_dat"] =
                    _.isNull(this.visitRecordOriSingleData["avisit_dat"]) ? "" : moment(new Date(this.visitRecordSingleData["avisit_dat"])).format("YYYY/MM/DD");

                if (!lo_editRow) {
                    alert(go_i18nLang["SystemCommon"].SelectData);
                }
                else {
                    this.editingRow = _.extend(lo_editRow, {index: ln_editIndex});
                    this.showSingleGridDialog();
                }
            },
            removeRow() {
                var lo_delRow = $('#companyVisitRecord_dg').datagrid('getSelected');
                var ln_delIndex = $('#companyVisitRecord_dg').datagrid('getRowIndex', lo_delRow);

                if (!lo_delRow) {
                    alert(go_i18nLang["SystemCommon"].SelectOneData);
                }
                else {
                    //刪除新增的資料
                    if (!_.isUndefined(this.dataGridRowsData[ln_delIndex].createIndex)) {
                        var createIdx = this.dataGridRowsData[ln_delIndex].createIndex;
                        this.tmpCUD.createData.splice(createIdx, 1)
                    }
                    else {
                        //刪除編輯的資料
                        if (!_.isUndefined(lo_delRow.index)) {
                            var ln_editIndex = _.findIndex(this.tmpCUD.updateData, {index: lo_delRow.index})
                            this.tmpCUD.updateData.splice(ln_editIndex, 1);
                            this.tmpCUD.oriData.splice(ln_editIndex, 1);
                        }

                        //轉換日期格式
                        this.oriDataGridRowsData[ln_delIndex]["visit_dat"] =
                            _.isNull(this.oriDataGridRowsData[ln_delIndex]["visit_dat"]) ? "" : moment(new Date(this.oriDataGridRowsData[ln_delIndex]["visit_dat"])).format("YYYY/MM/DD");
                        this.oriDataGridRowsData[ln_delIndex]["avisit_dat"] =
                            _.isNull(this.oriDataGridRowsData[ln_delIndex]["avisit_dat"]) ? "" : moment(new Date(this.oriDataGridRowsData[ln_delIndex]["avisit_dat"])).format("YYYY/MM/DD");
                        this.dataGridRowsData[ln_delIndex]["visit_dat"] =
                            _.isNull(this.dataGridRowsData[ln_delIndex]["visit_dat"]) ? "" : moment(new Date(this.dataGridRowsData[ln_delIndex]["visit_dat"])).format("YYYY/MM/DD");
                        this.dataGridRowsData[ln_delIndex]["avisit_dat"] =
                            _.isNull(this.oriDataGridRowsData[ln_delIndex]["avisit_dat"]) ? "" : moment(new Date(this.dataGridRowsData[ln_delIndex]["avisit_dat"])).format("YYYY/MM/DD");

                        this.tmpCUD.oriData.push(this.oriDataGridRowsData[ln_delIndex]);
                        this.tmpCUD.deleteData.push(this.dataGridRowsData[ln_delIndex]);
                    }
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
                        self.editingRow = {};
                        self.isSingleVisitRecord = false;
                    }
                });
            },
            dataValidate() {
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
            setNewDataGridRowsData() {
                let lo_chkResult = this.dataValidate();
                if (lo_chkResult.success == false) {
                    alert(lo_chkResult.msg);
                }
                else {
                    this.visitRecordSingleData = _.extend(this.visitRecordSingleData, {
                        tab_page_id: 5,
                        event_time: moment().format("YYYY/MM/DD HH:mm:ss"),
                        cust_cod: this.$store.state.gs_custCod
                    });
                    //轉換資料時間格式
                    this.visitRecordSingleData["avisit_dat"] = this.visitRecordSingleData["avisit_dat"] || "";
                    this.visitRecordOriSingleData["avisit_dat"] = this.visitRecordOriSingleData["avisit_dat"] || "";

                    this.visitRecordSingleData["visit_dat"] = moment(new Date(this.visitRecordSingleData["visit_dat"])).format("YYYY/MM/DD");
                    this.visitRecordSingleData["avisit_dat"] =
                        this.visitRecordSingleData["avisit_dat"] == "" ? "" : moment(new Date(this.visitRecordSingleData["avisit_dat"])).format("YYYY/MM/DD");
                    //轉換原始資料時間格式
                    this.visitRecordOriSingleData["visit_dat"] = moment(new Date(this.visitRecordSingleData["visit_dat"])).format("YYYY/MM/DD");
                    this.visitRecordOriSingleData["avisit_dat"] =
                        this.visitRecordOriSingleData["avisit_dat"] == "" ? "" : moment(new Date(this.visitRecordSingleData["avisit_dat"])).format("YYYY/MM/DD");
                    this.visitRecordOriSingleData["traffic_amt"] = this.visitRecordOriSingleData["traffic_amt"] != "" ?
                        go_formatDisplayClass.removeAmtFormat(this.visitRecordOriSingleData["traffic_amt"]) : 0;

                    let lo_saveData = JSON.parse(JSON.stringify(this.visitRecordSingleData));
                    lo_saveData["traffic_amt"] = lo_saveData["traffic_amt"] != "" ? go_formatDisplayClass.removeAmtFormat(lo_saveData["traffic_amt"]) : 0;

                    let ln_editIdx = _.isUndefined(this.visitRecordSingleData.index) ? -1 : this.visitRecordSingleData.index;

                    if (ln_editIdx > -1) {
                        if (!_.isUndefined(this.visitRecordSingleData.createIndex)) {
                            let createIndex = this.visitRecordSingleData.createIndex;
                            this.tmpCUD.createData[createIndex] = lo_saveData;
                        }
                        else {
                            this.tmpCUD.updateData.push(lo_saveData);
                            this.tmpCUD.oriData.push(lo_saveData);
                        }

                        this.dataGridRowsData[ln_editIdx] = this.visitRecordSingleData;
                    }
                    else {
                        this.tmpCUD.createData.push(lo_saveData);
                        this.dataGridRowsData.push(this.visitRecordSingleData);
                    }
                    this.showDataGrid();
                }
            }
        }
    }
</script>