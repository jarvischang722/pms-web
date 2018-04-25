<template>
    <div>
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
                                    <button class="btn btn-primary btn-white btn-defaultWidth sales_editOtherRemark purview_btn"
                                            role="button" :disabled="BTN_action" @click="appendRow" data-purview_func_id="PMS0610020-1120">
                                        {{i18nLang.program.PMS0610020.append_remark}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth sales_editOtherRemark purview_btn"
                                            role="button" :disabled="BTN_action" @click="editRow" data-purview_func_id="PMS0610020-1130">
                                        {{i18nLang.program.PMS0610020.update_remark}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-danger btn-white btn-defaultWidth purview_btn"
                                            role="button" :disabled="BTN_action" @click="removeRow" data-purview_func_id="PMS0610020-1140">
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
                                                                          :disabled="field.modificable == 'N'|| (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                </textarea>

                                                                <!--select-->
                                                                <bac-select v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                                            :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                            v-model="singleData[field.ui_field_name]" :data="field.selectData"
                                                                            is-qry-src-before="Y" value-field="value" text-field="display"
                                                                            @update:v-model="val => singleData[field.ui_field_name] = val"
                                                                            :default-val="singleData[field.ui_field_name]"
                                                                            :field="field"
                                                                            :disabled="field.modificable == 'N'||(field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
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
    /*** Class End  ***/

    export default {
        name: 'other-remark',
        props: ["rowData", "isOtherRemark"],
        data() {
            return {
                go_funcPurview: [],
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
                    //第一次載入業務備註
                    if(_.isEmpty(this.$store.state.go_allData.ga_remarkDataGridRowsData)){
                        this.initDataGridData();
                        this.initTmpCUD();
                    }
                    this.fetchDataGridFieldData();
                    this.go_funcPurview = (new FuncPurview("PMS0610020")).getFuncPurvs();
                }
            },
            editingRow(val) {
                if (!_.isEmpty(val)) {
                    let self = this;

                    this.fetchGridSingleFieldData(val);

                    let nowDatagridRowIndex = $("#otherRemark_dg").datagrid('getRowIndex', val);

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
            },
            dataGridRowsData: {
                handler: function (val) {
                    if(!_.isEmpty(val)){
                        //將業務備註資料放至Vuex
                        this.$store.dispatch("setRemarkDataGridRowsData", {
                            ga_remarkDataGridRowsData: val,
                            ga_remarkOriDataGridRowsData: this.oriDataGridRowsData,
                            go_remarkTmpCUD: this.tmpCUD
                        });
                    }
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

                    if(_.isEmpty(this.$store.state.go_allData.ga_remarkDataGridRowsData)){
                        this.dataGridRowsData = result.dgRowData;
                        this.oriDataGridRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                    }
                    else{
                        this.dataGridRowsData = this.$store.state.go_allData.ga_remarkDataGridRowsData;
                        this.oriDataGridRowsData = this.$store.state.go_allOriData.ga_remarkDataGridRowsData;
                    }

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
                this.editingRow = {remark_typ: '01' ,createIndex: this.tmpCUD.createData.length};
                this.showSingleGridDialog();
            },
            editRow() {
                this.isCreateStatus = false;
                this.isEditStatus = true;
                this.editingRow = {};

                let lo_editRow = $('#otherRemark_dg').datagrid('getSelected');
                let ln_editIndex = $('#otherRemark_dg').datagrid('getRowIndex', lo_editRow);

                if (!lo_editRow) {
                    alert(go_i18nLang["SystemCommon"].SelectData);
                }
                else {
                    this.editingRow = _.extend(this.dataGridRowsData[ln_editIndex],{index: ln_editIndex});
                    this.showSingleGridDialog();
                }
            },
            removeRow() {
                let lo_delRow = $('#otherRemark_dg').datagrid('getSelected');
                let ln_delIndex = $('#otherRemark_dg').datagrid('getRowIndex', lo_delRow);
                if (!lo_delRow) {
                    alert(go_i18nLang["SystemCommon"].SelectOneData);
                }
                else {
                    //刪除新增的資料
                    if(!_.isUndefined(this.dataGridRowsData[ln_delIndex].createIndex)){
                        let ln_createIdx = this.dataGridRowsData[ln_delIndex].createIndex;
                        this.tmpCUD.createData.splice(ln_createIdx, 1)
                    }
                    else{
                        //刪除編輯的資料
                        if(!_.isUndefined(lo_delRow.index) ){
                            let ln_editIndex = _.findIndex(this.tmpCUD.updateData, {index: lo_delRow.index})
                            this.tmpCUD.updateData.splice(ln_editIndex, 1);
                            this.tmpCUD.oriData.splice(ln_editIndex,1);
                        }
                        this.tmpCUD.oriData.push(this.oriDataGridRowsData[ln_delIndex]);
                        this.tmpCUD.deleteData.push(this.dataGridRowsData[ln_delIndex]);
                    }
                    this.dgIns.removeRow();

                }
            },
            showSingleGridDialog() {
                let self = this;
                this.BTN_action = false;
                this.isLoadingDialog = true;

                let dialog = $("#singleGridOtherRemark").removeClass('hide').dialog({
                    modal: true,
                    title: go_i18nLang["program"]["PMS0620050"].other_remark,
                    title_html: true,
                    width: 800,
                    maxwidth: 1920,
                    dialogClass: "test",
                    resizable: true,
                    onBeforeClose: function () {
                        self.setNewDataGridRowsData();//更新dataGridRowsData
                        self.isCreateStatus = false;
                        self.isEditStatus = false;
                        self.editingRow = {};
                    }
                });
            },
            //單筆 業務備註 事件
            chkFieldRule(ui_field_name, rule_func_name) {
                if (rule_func_name === "") {
                    return;
                }
                let self = this;
                let la_originData = [this.oriSingleData];
                let la_singleData = [this.singleData];
                let la_diff = _.difference(la_originData, la_singleData);

                // 判斷資料是否有異動
                if (la_diff.length != 0) {
                    this.isUpdate = true;
                }

                if (!_.isEmpty(rule_func_name.trim())) {
                    let postData = {
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
                let nowRowIndex = $("#otherRemark_dg").datagrid('getRowIndex', this.rowData);
                this.editingRow = this.dataGridRowsData[nowRowIndex - 1];
            },
            toNextData() {
                let nowRowIndex = $("#otherRemark_dg").datagrid('getRowIndex', this.rowData);
                this.editingRow = this.dataGridRowsData[nowRowIndex + 1];
            },
            toLastData() {
                this.isFirstData = false;
                this.isLastData = true;
                this.editingRow = _.last(this.dataGridRowsData);
            },
            dataValidate(){
                let self = this;
                let lo_checkResult;

                for (let i = 0; i < this.oriGridSingleFieldsData.length; i++) {
                    let lo_field = this.oriGridSingleFieldsData[i];
                    //必填
                    if (lo_field.requirable == "Y" && lo_field.modificable != "N" && lo_field.ui_type != "checkbox") {
                        lo_checkResult = go_validateClass.required(self.singleData[lo_field.ui_field_name], lo_field.ui_display_name);
                        if (lo_checkResult.success == false) {
                            break;
                        }
                    }

                }

                return lo_checkResult;
            },
            doLeaveGrid() {
                $("#singleGridOtherRemark").dialog('close');
            },
            setNewDataGridRowsData(){
                let lo_chkResult = this.dataValidate();

                if (lo_chkResult.success == false) {
                    alert(lo_chkResult.msg);
                }
                else{
                    this.singleData = _.extend(this.singleData, {
                        tab_page_id: 6,
                        event_time: moment().format("YYYY/MM/DD HH:mm:ss"),
                        cust_cod: this.$store.state.gs_custCod
                    });
                    let ln_editIdx = _.isUndefined(this.singleData.index)? -1: this.singleData.index;
                    if(ln_editIdx > -1){
                        if(!_.isUndefined(this.singleData.createIndex)){
                            let createIndex = this.singleData.createIndex;
                            this.tmpCUD.createData[createIndex] = this.singleData;
                        }
                        else{
                            this.tmpCUD.updateData.push(this.singleData);
                            this.tmpCUD.oriData.push(this.oriSingleData);
                        }
                        this.dataGridRowsData[ln_editIdx] = this.singleData;
                    }
                    else{
                        this.tmpCUD.createData.push(this.singleData);
                        this.dataGridRowsData.push(this.singleData);
                    }
                    this.showDataGrid();
                }
            }
        }
    }
</script>