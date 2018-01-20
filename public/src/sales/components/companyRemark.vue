<template>
    <div >
        <div class="col-xs-12 col-sm-12" v-loading="isLoading" element-loading-text="Loading...">
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
                        <div class="col-sm-12 col-xs-12" v-loading="isLoadingDialog" element-loading-text="Loading...">
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
                                                                <label v-if="field.visiable == 'Y' && field.ui_type != 'checkbox'">
                                                                    <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                                                    <span>{{ field.ui_display_name }}</span>
                                                                </label>

                                                                <input type="text" v-model="singleData[field.ui_field_name]"
                                                                       v-if="field.visiable == 'Y' &&  field.ui_type == 'text'"
                                                                       :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                       :class="{'input_sta_required' : field.requirable == 'Y', 'text-right' : field.ui_type == 'number'}"
                                                                       :required="field.requirable == 'Y'" min="0"
                                                                       :maxlength="field.ui_field_length"
                                                                       :disabled="field.modificable == 'N'|| (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">

                                                                <!--  textarea -->
                                                                <textarea v-if="field.visiable == 'Y' && field.ui_type == 'textarea'"
                                                                          v-model="singleData[field.ui_field_name]"
                                                                          class="numStyle-none" rows="4"
                                                                          :style="{width:field.width + 'px'}" style="resize: none;"
                                                                          :required="field.requirable == 'Y'"
                                                                          :maxlength="field.ui_field_length"
                                                                          :disabled="field.modificable == 'N'||
                                                                          (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                        </textarea>

                                                                <!--select-->
                                                                <bac-select v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                                            :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                            v-model="singleData[field.ui_field_name]" :data="field.selectData"
                                                                            is-qry-src-before="Y" value-field="value" text-field="display"
                                                                            @update:v-model="val => singleData[field.ui_field_name] = val"
                                                                            :default-val="singleData[field.ui_field_name]"
                                                                            :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                </bac-select>

                                                                <el-date-picker v-if="field.visiable == 'Y' && field.ui_type == 'datetime'"
                                                                                v-model="singleData[field.ui_field_name]" type="datetime"
                                                                                change="chkFieldRule(field.ui_field_name,field.rule_func_name)"
                                                                                :disabled="field.modificable == 'N'|| (field.modificable == 'I') || (field.modificable == 'E')"
                                                                                size="small" format="yyyy/MM/dd HH:mm:ss"
                                                                                :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                                @change="chkFieldRule(field.ui_field_name,field.rule_func_name)">
                                                                </el-date-picker>

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
                isLoadingDialog: false,
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

                    this.fetchGridSingleFieldData(val);

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
                });
            },
            showDataGrid() {
                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init("PMS0610020", "otherRemark_dg", DatagridFieldAdapter.combineFieldOption(this.dataGridFieldsData, 'otherRemark_dg'), this.dataGridFieldsData);
                this.dgIns.loadDgData(this.dataGridRowsData);
                this.dgIns.getOriDtRowData(this.oriDataGridRowsData);
                this.isLoading = false;
            },
            fetchGridSingleFieldData(val) {
                $.post("/api/fetchOnlySinglePageFieldData", {
                    prg_id: "PMS0610020",
                    page_id: 2,
                    tab_page_id: 1120
                }).then(result => {
                    this.oriGridSingleFieldsData = result.gsFieldsData;
                    this.gridSingleFieldsData = _.values(_.groupBy(_.sortBy(result.gsFieldsData, "col_seq"), "row_seq"));
                    this.fetchGridSingleRowData(val);
                });
            },
            fetchGridSingleRowData(editingRowOfRemark) {
                this.singleData = editingRowOfRemark;
                this.oriSingleData = JSON.parse(JSON.stringify(editingRowOfRemark));
                this.isLoadingDialog = false;

            },
            appendRow() {
                this.isCreateStatus = true;
                this.isEditStatus = false;
                this.editingRow = {remark_typ: '01'};

                this.initTmpCUD();
                this.showSingleGridDialog();
            },
            editRow() {
                this.isCreateStatus = false;
                this.isEditStatus = true;
                this.editingRow = {};

                this.initTmpCUD();

                var lo_editRow = $('#otherRemark_dg').datagrid('getSelected');
                var ln_editIndex = $('#otherRemark_dg').datagrid('getRowIndex', lo_editRow);

                if (!lo_editRow) {
                    alert(go_i18nLang["SystemCommon"].SelectData);
                }
                else {
                    this.editingRow = this.dataGridRowsData[ln_editIndex];
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
                    this.dgIns.removeRow();
                }
            },
            showSingleGridDialog() {
                var self = this;
                this.BTN_action = false;
                this.isLoadingDialog = true;

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
            chkFieldRule(ui_field_name, rule_func_name) {
                if (rule_func_name === "") {
                    return;
                }
                var self = this;
                var la_originData = [this.oriSingleData];
                var la_singleData = [this.singleData];
                var la_diff = _.difference(la_originData, la_singleData);

                // 判斷資料是否有異動
                if (la_diff.length != 0) {
                    this.isUpdate = true;
                }

                if (!_.isEmpty(rule_func_name.trim())) {
                    var postData = {
                        prg_id: "PMS0620050",
                        rule_func_name: rule_func_name,
                        validateField: ui_field_name,
                        singleRowData: JSON.parse(JSON.stringify(this.singleData)),
                        oriSingleData: this.oriSingleData
                    };
                    $.post('/api/chkFieldRule', postData, function (result) {

                        if (result.success) {
                            //是否要show出訊息
                            if (result.showAlert) {
                                alert(result.alertMsg);
                            }

                            //是否要show出詢問視窗
                            if (result.showConfirm) {
                                if (confirm(result.confirmMsg)) {

                                } else {
                                    //有沒有要再打一次ajax到後端
                                    if (result.isGoPostAjax && !_.isEmpty(result.ajaxURL)) {
                                        $.post(result.ajaxURL, postData, function (result) {

                                            if (!result.success) {
                                                alert(result.errorMsg);
                                            } else {

                                                if (!_.isUndefined(result.effectValues) && _.size(result.effectValues) > 0) {
                                                    self.singleData = _.extend(self.singleData, result.effectValues);
                                                }

                                            }
                                        });
                                    }
                                }
                            }

                        } else {
                            alert(result.errorMsg);
                        }

                        //連動帶回的值
                        if (!_.isUndefined(result.effectValues) && _.size(result.effectValues) > 0) {
                            self.singleData = _.extend(self.singleData, result.effectValues);
                        }

                    });
                }
            },
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