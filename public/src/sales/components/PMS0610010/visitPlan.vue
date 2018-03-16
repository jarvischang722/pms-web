<template>
    <div id="addVisitPlan" class="padding-5 hide">
        <div class="col-sm-12 newVisitRecord-wrap" v-loading="isVisitPlanLoading" :element-loading-text="visitPlanLoadingText">
            <!--共同設定-->
            <div class="row">
                <div class="borderFrame">
                    <!--欄位-->
                    <div class="col-sm-11 col-xs-11">
                        <div class="row" v-for="fields in settingGridFieldsData">
                            <div class="grid">
                                <div class="grid-item" v-for="field in fields">
                                    <label v-if="field.visiable == 'Y' && field.ui_type != 'checkbox'">
                                        <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                        <span>{{ field.ui_display_name }}</span>
                                    </label>

                                    <!--下拉選單-->
                                    <bac-select v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                :class="{'input_sta_required' : field.requirable == 'Y' }"
                                                :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                v-model="settingGridRowData[field.ui_field_name]" :data="field.selectData"
                                                is-qry-src-before="Y" value-field="value" text-field="display"
                                                @update:v-model="val => settingGridRowData[field.ui_field_name] = val"
                                                :default-val="settingGridRowData[field.ui_field_name]"
                                                :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                    </bac-select>



                                    <input type="text" v-model="settingGridRowData[field.ui_field_name]"
                                           v-if="field.visiable == 'Y' && field.ui_type == 'text'"
                                           class="numStyle-none"
                                           :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                           :class="{'input_sta_required' : field.requirable == 'Y', 'text-right' : field.ui_type == 'number'}"
                                           :required="field.requirable == 'Y'" min="0"
                                           :maxlength="field.ui_field_length"
                                           :disabled=" field.modificable == 'N'|| (field.modificable == 'I') || (field.modificable == 'E')">

                                    <!-- 日期選擇器 -->
                                    <el-date-picker v-if="field.visiable == 'Y' && field.ui_type == 'date'"
                                                    v-model="settingGridRowData[field.ui_field_name]"
                                                    type="date" size="small" format="yyyy/MM/dd"
                                                    :disabled="field.modificable == 'N' || (field.modificable == 'I') || (field.modificable == 'E')"
                                                    :style="{width:field.width + 'px' , height:field.height + 'px'}">
                                    </el-date-picker>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--/.欄位-->
                    <!--按鈕-->
                    <div class="col-sm-1 col-xs-1">
                        <div class="row no-margin-right">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                                @click="doSetting">
                                            {{i18nLang.SystemCommon.Setting}}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--/.按鈕-->
                    <div class="clearfix"></div>
                </div>
            </div>
            <!--/.共同設定-->
            <div class="space-6"></div>
            <div class="clearfix"></div>
            <div class="row">
                <div class="col-sm-11 col-xs-11">
                    <div class="row">
                        <!--多筆拜訪紀錄-->
                        <div class="col-sm-5 col-xs-5">
                            <div class="row">
                                <table id="visitPlan_dg" style="height: 350px;"></table>
                            </div>
                        </div>
                        <!--單筆拜訪紀錄-->
                        <div class="col-sm-7 col-xs-7">
                            <div class="row" v-for="fields in fieldsData">
                                <div class="grid">
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
                                               :disabled="field.modificable == 'N'|| (field.modificable == 'I') || (field.modificable == 'E')">

                                        <!--number 金額顯示format-->
                                        <input type="text" v-model="singleData[field.ui_field_name]"
                                               v-if="field.visiable == 'Y' && field.ui_type == 'number'"
                                               :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                               :class="{'input_sta_required' : field.requirable == 'Y', 'text-right' : field.ui_type == 'number'}"
                                               @keyup="formatAmt(singleData[field.ui_field_name], field)">

                                        <!-- 日期選擇器 -->
                                        <el-date-picker v-if="field.visiable == 'Y' && field.ui_type == 'date'"
                                                        v-model="singleData[field.ui_field_name]"
                                                        type="date" size="small"
                                                        :disabled="field.modificable == 'N' || (field.modificable == 'I') || (field.modificable == 'E')"
                                                        format="yyyy/MM/dd"
                                                        :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                        @change="chkFieldRule(field.ui_field_name,field.rule_func_name)">
                                        </el-date-picker>

                                        <!-- 日期時間選擇器 -->
                                        <el-date-picker v-if="field.visiable == 'Y' && field.ui_type == 'datetime'"
                                                        v-model="singleData[field.ui_field_name]" type="datetime"
                                                        change="chkFieldRule(field.ui_field_name,field.rule_func_name)"
                                                        :disabled="field.modificable == 'N'|| (field.modificable == 'I') || (field.modificable == 'E')"
                                                        size="small" format="yyyy/MM/dd HH:mm:ss"
                                                        :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                        @change="chkFieldRule(field.ui_field_name,field.rule_func_name)">
                                        </el-date-picker>

                                        <!-- 下拉選單 -->
                                        <!--下拉選單-->
                                        <bac-select v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                    :class="{'input_sta_required' : field.requirable == 'Y' }"
                                                    :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                    v-model="singleData[field.ui_field_name]" :data="field.selectData"
                                                    is-qry-src-before="Y" value-field="value" text-field="display"
                                                    @update:v-model="val => singleData[field.ui_field_name] = val"
                                                    :default-val="singleData[field.ui_field_name]"
                                                    :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                        </bac-select>

                                        <!--  textarea -->
                                        <textarea v-if="field.visiable == 'Y' && field.ui_type == 'textarea'"
                                                  v-model="singleData[field.ui_field_name]"
                                                  class="numStyle-none" rows="4"
                                                  :style="{width:field.width + 'px'}" style="resize: none;"
                                                  :required="field.requirable == 'Y'"
                                                  :maxlength="field.ui_field_length"
                                                  :disabled="field.modificable == 'N'|| (field.modificable == 'I') || (field.modificable == 'E')"
                                                  @click="chkFieldRule(field.ui_field_name,field.rule_func_name)">
                                        </textarea>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <!--按鈕-->
                <div class="col-sm-1 col-xs-1">
                    <div class="row no-margin-right">
                        <div class="right-menu-co">
                            <ul>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                            :disabled="BTN_action || isFirstData" @click="toFirstData">
                                        {{i18nLang.SystemCommon.First}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                            :disabled="BTN_action || isFirstData" @click="toPreData">
                                        {{i18nLang.SystemCommon.Previous}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                            :disabled="BTN_action || isLastData" @click="toNextData">
                                        {{i18nLang.SystemCommon.Next}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                            :disabled="BTN_action || isLastData" @click="toLastData">
                                        {{i18nLang.SystemCommon.Last}}
                                    </button>
                                </li>
                            </ul>
                            <ul class="newVisitOther-btn">
                                <li>
                                    <button class="btn btn-danger btn-white btn-defaultWidth " role="button"
                                            @click="doRemoveRow">
                                        {{i18nLang.SystemCommon.Delete}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth purview_btn" role="button"
                                            data-purview_func_id="PMS0620050-0500" @click="doSaveRow">
                                        {{i18nLang.SystemCommon.Save}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-danger btn-white btn-defaultWidth" role="button" @click="doCloseDialog">
                                        {{i18nLang.SystemCommon.Leave}}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>

    var vmHub = new Vue();

    var go_funcPurview;

    /** DatagridRmSingleGridClass **/
    function DataGridSingleGridClass() {
    }

    DataGridSingleGridClass.prototype = new DatagridBaseClass();
    DataGridSingleGridClass.prototype.onClickRow = function (idx, row) {
        vmHub.$emit("selectDataGridRow", {row: row, index: idx});
    };
    DataGridSingleGridClass.prototype.onClickCell = function (idx, row) {
    };
    /*** Class End  ***/

    export default {
        name: 'visit-plan',
        props: ["editRows", "isVisitPlan"],
        created() {
            var self = this;
            vmHub.$on("selectDataGridRow", function (data) {
                // self.dgVisitPlanIns.onSelect(data.index, data.row);
                self.rowData = data.row;
            });
        },
        mounted() {
            this.isVisitPlanLoading = true;
            this.visitPlanLoadingText = "Loading...";
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                isFirstData: false,
                isLastData: false,
                BTN_action: false,
                isVisitPlanLoading: false,
                visitPlanLoadingText: "",
                tmpCUD: {
                    createData: []
                },
                go_funcPurview: [],
                settingGridFieldsData: [],
                settingGridRowData: {},
                dataGridFieldsData: [],
                rowData: {},                       //多筆的每一列資料
                singleData: {},                    //單筆的每一筆資料
                changedSingleData: {},
                fieldsData: [],
                oriFieldsData: [],
                dgVisitPlanIns: {},
                tmpRowsData: [],                   //多筆與單筆所對應的資料
                editRowsChangedNum: 0              //editRows變化次數
            };
        },
        watch: {
            isVisitPlan(val) {
                if (val) {
                    this.isVisitPlanLoading = true;
                    this.visitPlanLoadingText = "Loading...";
                    this.initData();
                    this.setTmpRowData();
                    this.fetchSingleGridFieldData();
                    this.go_funcPurview= (new FuncPurview("PMS0620050")).getFuncPurvs();
                    this.initPurview();
                }
            },
            rowData(val) {
                if (!_.isEmpty(val)) {
                    this.changedSingleData = JSON.parse(JSON.stringify(this.singleData));
                    if (!_.isEmpty(this.changedSingleData)) {
                        this.setEditRowsContent(this.changedSingleData);
                    }
                    this.fetchRowDataContent(val);
                }
            }
        },
        methods: {
            initPurview() {
                var purview = _.findIndex(this.go_funcPurview, function (value) {
                    return value.func_id == "0500";
                });
                if (purview == -1) {
                    this.isSaveEnable = true;
                }
            },
            initData() {
                this.settingGridFieldsData = [];
                this.settingGridRowData = {};
                this.dataGridFieldsData = [];
                this.rowData = {};
                this.singleData = {};
                this.fieldsData = [];
                this.oriFieldsData = [];
            },
            setTmpRowData() {
                var self = this;
                this.tmpRowsData = [];
                var ln_count = 0;
                _.each(this.editRows, function (lo_editRow) {
                    ln_count++;
                    var lo_editRowContent = {
                        show_cod: lo_editRow.cust_mn_show_cod,
                        cust_cod: lo_editRow.cust_mn_cust_cod,
                        cust_nam: lo_editRow.cust_mn_cust_nam,
                        status_cod: lo_editRow.cust_mn_status_cod,
                        status_desc: lo_editRow.contract_status_rf_status_desc,
                        visit_typ: '1',
                        visit_sta: 'N',
                        visit_dat: '',
                        avisit_dat: '',
                        traffic_amt: 0,
                        purport_rmk: '',
                        remark: null
                    };

                    self.tmpRowsData.push(lo_editRowContent);
                });
                if (ln_count == this.editRows.length) {
                    this.fetchSingleGridFieldData();
                }
            },
            fetchSingleGridFieldData() {
                var self = this;
                var lo_params = {
                    prg_id: "PMS0620050",
                    page_id: 2
                };

                $.post("/api/fetchOnlySinglePageFieldData", lo_params, function (result) {
                    self.oriFieldsData = result.gsFieldsData;
                    self.fieldsData = _.values(_.groupBy(_.sortBy(self.oriFieldsData, "col_seq"), "row_seq"));
                    self.loadSettingGrid();
                });
            },
            loadSettingGrid() {
                var self = this;
                var lo_params = {
                    prg_id: "PMS0610010",
                    page_id: 1020
                };

                //取欄位資料
                $.post("/api/fetchOnlySinglePageFieldData", lo_params, function (result) {
                    self.settingGridFieldsData = _.values(_.groupBy(_.sortBy(result.gsFieldsData, "col_seq"), "row_seq"));
                    self.settingGridRowData = {
                        purport_rmk: "",
                        visit_dat: moment(new Date()).format("YYYY/MM/DD"),
                        visit_sta: 'N',
                        visit_typ: '1'
                    };
                    self.loadDataGridByPrgID();
                });
            },
            loadDataGridByPrgID() {
                var self = this;
                var lo_params = {
                    prg_id: "PMS0610010",
                    page_id: 1020
                };

                $.post("/api/fetchOnlyDataGridFieldData", lo_params, function (result) {
                    self.dataGridFieldsData = result.dgFieldsData;
                    self.rowData = self.editRows[0];
                });
            },
            fetchRowDataContent(editingRow) {
                var existIdx = _.findIndex(this.tmpRowsData, {cust_cod: editingRow.cust_mn_cust_cod});
                if (existIdx > -1) {
                    this.singleData = this.tmpRowsData[existIdx];
                }
                else {
                    this.singleData = {
                        show_cod: editingRow.cust_mn_show_cod,
                        cust_cod: editingRow.cust_mn_cust_cod,
                        cust_nam: editingRow.cust_mn_cust_nam,
                        status_cod: editingRow.cust_mn_status_cod,
                        status_desc: editingRow.contract_status_rf_status_desc,
                        visit_typ: '1',
                        visit_sta: 'N',
                        visit_dat: '',
                        avisit_dat: '',
                        traffic_amt: 0,
                        purport_rmk: '',
                        remark: null
                    };
                }

                this.showDataGrid(editingRow);
            },
            setEditRowsContent(changedSingleData) {
                changedSingleData.visit_dat =
                    changedSingleData.visit_dat == "" || _.isUndefined(changedSingleData.visit_dat) ? "" : moment(new Date(changedSingleData.visit_dat)).format("YYYY/MM/DD");
                changedSingleData.avisit_dat =
                    changedSingleData.avisit_dat == "" || _.isUndefined(changedSingleData.avisit_dat) ? "" : moment(new Date(changedSingleData.avisit_dat)).format("YYYY/MM/DD");

                //先將預設在tmpRowsData的先刪除，再改過的資料加回至原本的位置
                var existIdx = _.findIndex(this.tmpRowsData, {cust_cod: changedSingleData.cust_cod});
                if (existIdx > -1) {
                    this.tmpRowsData.splice(existIdx, 1);
                }
                this.tmpRowsData.splice(existIdx, 0, changedSingleData);
            },
            showDataGrid(editingRow) {
                var colOption = [{field: 'ck', checkbox: true}];
                colOption = _.union(colOption, DatagridFieldAdapter.combineFieldOption(this.dataGridFieldsData, 'visitPlan_dg'));
                this.dgVisitPlanIns = new DataGridSingleGridClass();
                this.dgVisitPlanIns.init("PMS0610010", "visitPlan_dg", colOption, this.dataGridFieldsData, {
                    singleSelect: false
                });
                this.dgVisitPlanIns.loadDgData(this.editRows);

                this.setIndexData(editingRow);
            },
            setIndexData(editingRow) {
                var nowDatagridRowIndex = $("#visitPlan_dg").datagrid('getRowIndex', editingRow);

                $("#visitPlan_dg").datagrid('selectRow', nowDatagridRowIndex);

                if ($("#visitPlan_dg").datagrid('getRowIndex', editingRow) == 0) {
                    //已經到第一筆
                    this.isFirstData = true;
                    this.isLastData = false;
                    if ($("#visitPlan_dg").datagrid('getRowIndex', editingRow) == this.editRows.length - 1) {
                        this.isLastData = true;
                    }

                }
                else if ($("#visitPlan_dg").datagrid('getRowIndex', editingRow) == this.editRows.length - 1) {
                    //已經到最後一筆
                    this.isFirstData = false;
                    this.isLastData = true;
                }
                else {
                    this.isFirstData = false;
                    this.isLastData = false;
                }
                this.isVisitPlanLoading = false;
            },
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
            showDropdownDisplayName(val, selectData) {
                if (_.findIndex(selectData, {value: val}) > -1) {
                    return _.findWhere(selectData, {value: val}).display;
                }
                return val + ":";

            },
            formatAmt(val, field) {
                var ls_amtValue = val;
                var ls_ruleVal = field.format_func_name.rule_val;
                ls_ruleVal = "###,###,##0";

                if (ls_ruleVal != "") {
                    this.singleData[field.ui_field_name] = go_formatDisplayClass.amtFormat(ls_amtValue, ls_ruleVal);
                }
                else {
                    this.singleData[field.ui_field_name] = ls_amtValue;
                }
            },
            doSetting() {
                var self = this;
                var la_settingRows = $('#visitPlan_dg').datagrid('getSelections');

                this.settingGridRowData.visit_dat = moment(new Date(this.settingGridRowData.visit_dat)).format("YYYY/MM/DD");

                _.each(la_settingRows, function (lo_settingRows, idx) {
                    let existIdx = _.findIndex(self.tmpRowsData, {cust_cod: lo_settingRows.cust_mn_cust_cod});
                    if (existIdx > -1) {
                        self.tmpRowsData[idx] = _.extend(self.tmpRowsData[idx], self.settingGridRowData);
                    }
                });
            },
            toFirstData() {
                this.isFirstData = true;
                this.isLastData = false;
                this.rowData = _.first(this.editRows);
            },
            toPreData() {
                var nowRowIndex = $("#visitPlan_dg").datagrid('getRowIndex', this.rowData);
                this.rowData = this.editRows[nowRowIndex - 1];
            },
            toNextData() {
                var nowRowIndex = $("#visitPlan_dg").datagrid('getRowIndex', this.rowData);
                this.rowData = this.editRows[nowRowIndex + 1];
            },
            toLastData() {
                this.isFirstData = false;
                this.isLastData = true;
                this.rowData = _.last(this.editRows);
            },
            doRemoveRow() {
                var delRow = $('#visitPlan_dg').datagrid('getSelected');

                if (!delRow) {
                    alert(go_i18nLang["SystemCommon"].SelectData);
                }
                else {
                    var existIdx = _.findIndex(this.tmpRowsData, {cust_cod: delRow.cust_mn_cust_cod});
                    if (existIdx > -1) {
                        this.tmpRowsData.splice(existIdx, 1);
                    }
                    this.dgVisitPlanIns.removeRow();
                }
            },
            dataValidate(saveData) {
                var lo_checkResult;

                for (var i = 0; i < saveData.length; i++) {
                    var lo_saveData = saveData[i];

                    for (var j = 0; j < this.oriFieldsData.length; j++) {
                        var lo_field = this.oriFieldsData[j];
                        //必填
                        if (lo_field.requirable == "Y" && lo_field.modificable != "N" && lo_field.ui_type != "checkbox") {
                            lo_checkResult = go_validateClass.required(lo_saveData[lo_field.ui_field_name], lo_field.ui_display_name);
                            if (lo_checkResult.success == false) {
                                break;
                            }
                        }

                        //有format
                        if (lo_field.format_func_name != "" && !_.isUndefined(go_validateClass[lo_field.format_func_name])) {
                            lo_checkResult = go_validateClass[lo_field.format_func_name](lo_saveData[lo_field.ui_field_name], lo_field.ui_display_name);
                            if (lo_checkResult.success == false) {
                                break;
                            }
                        }

                    }
                }

                return lo_checkResult;

            },
            doSaveRow() {
                var self = this;
                this.isVisitPlanLoading = true;
                this.loadingText = "Saving...";

                var la_saveData = JSON.parse(JSON.stringify(this.tmpRowsData));
                _.each(la_saveData, function (lo_saveData, index) {
                    la_saveData[index].visit_dat =
                        lo_saveData.visit_dat == "" || _.isUndefined(lo_saveData.visit_dat) ? "" : moment(new Date(lo_saveData.visit_dat)).format("YYYY/MM/DD");
                    la_saveData[index].avisit_dat =
                        lo_saveData.avisit_dat == "" || _.isUndefined(lo_saveData.avisit_dat) ? "" : moment(new Date(lo_saveData.avisit_dat)).format("YYYY/MM/DD");
                    la_saveData[index].traffic_amt = lo_saveData.traffic_amt == 0 ? 0 : Number(go_formatDisplayClass.removeAmtFormat(lo_saveData.traffic_amt));
                    la_saveData[index].event_time = moment().format("YYYY/MM/DD HH:mm:ss");
                });

                var lo_chkResult = this.dataValidate(la_saveData);

                if (lo_chkResult.success == false) {
                    alert(lo_chkResult.msg);
                    this.isLoadingDialog = false;
                }
                else {
                    this.tmpCUD.createData = la_saveData;

                    var lo_params = {
                        prg_id: "PMS0620050",
                        page_id: 2,
                        tmpCUD: this.tmpCUD
                    };

                    $.post("/api/doOperationSave", lo_params, function (result) {
                        if (result.success) {
                            self.tmpCUD.createData = [];
                            alert(go_i18nLang["program"]["PMS0620020"].saveSuccess);
                            self.doCloseDialog();
                        }
                        else {
                            alert(result.errorMsg);
                            self.isVisitPlanLoading = false;
                        }
                    });
                }
            },
            doCloseDialog() {
                $("#addVisitPlan").dialog('close');
            }
        }
    }
</script>

<style scoped>

</style>