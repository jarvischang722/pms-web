<template>
    <div class="padding-5">
        <div class="col-sm-12 newVisitRecord-wrap" v-loading="isLoadingDialog" :element-loading-text="loadingText">
            <div class="row">
                <div class="borderFrame">
                    <div class="col-sm-11 col-xs-11">
                        <div class="row" v-for="fields in settingGridFieldsData">
                            <div class="grid">
                                <div class="grid-item" v-for="field in fields">
                                    <label v-if="field.visiable == 'Y' && field.ui_type != 'checkbox'">
                                        <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                        <span>{{ field.ui_display_name }}</span>
                                    </label>

                                    <!--下拉選單-->
                                    <span class="dropdown margin-adjust" align="left"
                                          :class="{'input_sta_required' : field.requirable == 'Y' }"
                                          v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                          :style="{width:field.width + 'px' , height:field.height + 'px'}">
                                        <button :disabled="field.modificable == 'N' || (field.modificable == 'I') || (field.modificable == 'E')"
                                                class="btn btn-default btn-white dropdown-toggle btn-height"
                                                style="text-align: left!important;"
                                                type="button" data-toggle="dropdown"
                                                :style="{width:field.width + 'px' , height:field.height + 'px'}">
                                            {{ showDropdownDisplayName(settingGridRowData[field.ui_field_name], field.selectData)}}
                                            <span class="caret" style="text-align: right"></span>
                                        </button>
                                        <ul class="dropdown-menu dropdown-h" role="menu" aria-labelledby="menu1">
                                            <li role="presentation" v-for="opt in field.selectData">
                                                <a @click.prevent="settingGridRowData[field.ui_field_name] = opt.value">
                                                    {{opt.display}}
                                                </a>
                                            </li>
                                        </ul>
                                    </span>


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
                    <div class="col-sm-1 col-xs-1">
                        <div class="row no-margin-right">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth" role="button" @click="doSetting">
                                            {{i18nLang.SystemCommon.Setting}}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <div class="clearfix"></div>
                </div>
            </div>
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
                                               v-if="field.visiable == 'Y' &&   (field.ui_type == 'text' || field.ui_type == 'popupgrid')"
                                               class="numStyle-none"
                                               :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                               :class="{'input_sta_required' : field.requirable == 'Y', 'text-right' : field.ui_type == 'number'}"
                                               :required="field.requirable == 'Y'" min="0"
                                               :maxlength="field.ui_field_length"
                                               :disabled="field.modificable == 'N'|| (field.modificable == 'I') || (field.modificable == 'E')"
                                               @click="chkClickPopUpGrid(field)">

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
                                                        @change="chkFieldRule(field.ui_field_name,field.rule_func_name.validate)">
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
                                        <span v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                              class="dropdown margin-adjust" align="left"
                                              :class="{'input_sta_required' : field.requirable == 'Y' }"
                                              :style="{width:field.width + 'px' , height:field.height + 'px'}">
                                            <button :disabled=" field.modificable == 'N' || (field.modificable == 'I') || (field.modificable == 'E')"
                                                    class="btn btn-default btn-white dropdown-toggle btn-height"
                                                    style="text-align: left!important;"
                                                    type="button" data-toggle="dropdown"
                                                    :style="{width:field.width + 'px' , height:field.height + 'px'}">
                                                    {{ showDropdownDisplayName(singleData[field.ui_field_name], field.selectData)}}
                                                <span class="caret" style="text-align: right"></span>
                                            </button>
                                            <ul class="dropdown-menu dropdown-h" role="menu" aria-labelledby="menu1">
                                                <li role="presentation" v-for="opt in field.selectData"
                                                    @click="chkFieldRule(field.ui_field_name,field.rule_func_name.validate)">
                                                    <a @click.prevent="singleData[field.ui_field_name] = opt.value">
                                                        {{opt.display}}
                                                    </a>
                                                </li>
                                            </ul>
                                        </span>

                                        <!--  textarea -->
                                        <textarea v-if="field.visiable == 'Y' && field.ui_type == 'textarea'"
                                                  v-model="singleData[field.ui_field_name]"
                                                  class="numStyle-none" rows="4"
                                                  :style="{width:field.width + 'px'}" style="resize: none;"
                                                  :required="field.requirable == 'Y'"
                                                  :maxlength="field.ui_field_length"
                                                  :disabled="field.modificable == 'N'|| (field.modificable == 'I') || (field.modificable == 'E')"
                                                  @click="chkFieldRule(field.ui_field_name,field.rule_func_name.validate)">
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
                                    <button class="btn btn-danger btn-white btn-defaultWidth" role="button" @click="doRemoveRow">
                                        {{i18nLang.SystemCommon.Delete}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth" role="button" @click="doSaveRow">
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

    /** DatagridRmSingleGridClass **/
    function DatagridSingleGridClass() {
    }

    DatagridSingleGridClass.prototype = new DatagridBaseClass();
    DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
        vmHub.$emit("selectDataGridRow", {row: row, index: idx});
    };
    DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    };
    DatagridSingleGridClass.prototype.doSaveColumnFields = function () {
    };
    /*** Class End  ***/

    export default {
        name: 'visit-plan',
        props: ["editRows"],
        created() {
            var self = this;
            vmHub.$on("selectDataGridRow", function (data) {
                self.dgVisitPlanIns.onSelect(data.index, data.row);
                self.rowData = data.row;
            });
        },
        mounted() {
            this.isLoadingDialog = true;
            this.loadingText = "Loading...";
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                isFirstData: false,
                isLastData: false,
                BTN_action: false,
                isLoadingDialog: false,
                loadingText: "",
                tmpCUD: {
                    createData: []
                },
                settingGridFieldsData: [],
                settingGridRowData: {},
                dataGridFieldsData: [],
                rowData: {},                //多筆的每一列資料
                singleData: {},             //單筆的每一筆資料
                oriSingleData: {},
                fieldsData: [],
                oriFieldsData: [],
                dgVisitPlanIns: {},
                tmpRowsData: []             //多筆與單筆所對應的資料
            };
        },
        watch: {
            editRows(val) {
                if (!_.isEmpty(val)) {
                    this.isLoadingDialog = true;
                    this.initData();
                    this.fetchSingleGridFieldData();
                }
            },
            rowData(val) {
                if (!_.isEmpty(val)) {
                    this.setSingleData(val);
                    this.fetchRowData(val);
                }
            }
        },
        methods: {
            initData() {
                this.settingGridFieldsData = [];
                this.settingGridRowData = {};
                this.dataGridFieldsData = [];
                this.rowData = {};                  //多筆資料(一筆)
                this.singleData = {};               //單筆資料
                this.oriSingleData = {};
                this.fieldsData = [];
                this.oriFieldsData = [];
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
                    self.setSingleData(self.editRows[0]);
                });
            },
            setSingleData(editingRow) {
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
                    remark: ''
                };
                this.rowData = editingRow;

                this.showDataGrid();
            },
            showDataGrid() {
                var colOption = [{field: 'ck', checkbox: true}];
                colOption = _.union(colOption, DatagridFieldAdapter.combineFieldOption(this.dataGridFieldsData, 'visitPlan_dg'));
                this.dgVisitPlanIns = new DatagridSingleGridClass();
                this.dgVisitPlanIns.init("PMS0610010", "visitPlan_dg", colOption, this.dataGridFieldsData, {
                    singleSelect: false
                });
                this.dgVisitPlanIns.loadDgData(this.editRows);
                this.setIndexData(this.rowData);
            },
            fetchRowData(editingRow){
                var self = this;
                _.each(this.singleData, function(val, key){
                    editingRow[key] = val;
                });
                //重複的先刪除再新增
                var existIdx = _.findIndex(this.tmpRowsData, {cust_cod: this.singleData.cust_cod});
                if(existIdx > -1){
                    this.tmpRowsData.splice(existIdx, 1);
                }

                this.tmpRowsData.push(editingRow);
            },
            setIndexData(val) {
                var nowDatagridRowIndex = $("#visitPlan_dg").datagrid('getRowIndex', val);

                $("#visitPlan_dg").datagrid('selectRow', nowDatagridRowIndex);

                if ($("#visitPlan_dg").datagrid('getRowIndex', val) == 0) {
                    //已經到第一筆
                    this.isFirstData = true;
                    this.isLastData = false;
                    if ($("#visitPlan_dg").datagrid('getRowIndex', val) == this.editRows.length - 1) {
                        this.isLastData = true;
                    }

                }
                else if ($("#visitPlan_dg").datagrid('getRowIndex', val) == this.editRows.length - 1) {
                    //已經到最後一筆
                    this.isFirstData = false;
                    this.isLastData = true;
                }
                else {
                    this.isFirstData = false;
                    this.isLastData = false;
                }

                this.isLoadingDialog = false;
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
                var la_editRows = JSON.parse(JSON.stringify($("#visitPlan_dg").datagrid('getSelections'))) ;
                var lo_editRowSingleData = JSON.parse(JSON.stringify(self.singleData));
                delete lo_editRowSingleData[""]
                this.settingGridRowData.visit_dat = moment(new Date(this.settingGridRowData.visit_dat)).format("YYYY/MM/DD");

                _.each(this.settingGridRowData, function(val, key){
                    lo_editRowSingleData[key] = val;
                })

                _.each(la_editRows, function(lo_editRow, idx){
                    la_editRows[idx]["cust_nam"] = _.clone(lo_editRow["cust_mn_cust_nam"]);
                    la_editRows[idx]["show_cod"] = _.clone(lo_editRow["cust_mn_show_cod"]);
                    la_editRows[idx]["cust_cod"] = _.clone(lo_editRow["cust_mn_cust_cod"]);

                    delete lo_editRow["cust_mn_cust_nam"];
                    delete lo_editRow["cust_mn_show_cod"];
                    delete lo_editRow["cust_mn_cust_cod"];

                    la_editRows[idx] = _.extend(lo_editRow, lo_editRowSingleData);
                });

                console.log(la_editRows);
//                _.each(la_editRows, function(lo_editRow, idx){
//
//                });
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
                this.dgVisitPlanIns.removeRow();
            },
            doSaveRow() {
                var lo_editRow = $("#visitPlan_dg").datagrid('getSelected');
                console.log(this.tmpRowsData);
            },
            doCloseDialog() {
                this.initData();
                this.editRows = [];
                $("#addVisitPlan").dialog('close');
            }
        }
    }
</script>

<style scoped>

</style>