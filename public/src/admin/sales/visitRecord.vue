<template>
    <div id="visitRecord" class="hide padding-5">
        <div class="businessCompanyData">
            <div class="col-sm-12 col-xs-12">
                <div class="row">
                    <!--單筆 拜訪紀錄-->
                    <div class="col-sm-10 col-xs-10">
                        <div class="row no-margin-right">
                            <div class="main-content-data borderFrame">
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>拜訪方式</label>
                                        <select class="input-medium medium-c1">
                                            <option value="1">1.親訪</option>
                                            <option value="2">2.電訪</option>
                                        </select>
                                    </div>
                                    <div class="grid-item">
                                        <label>預定拜訪日</label>
                                        <!--<input class="easyui-datebox input-medium medium-c1">-->
                                        <input format-date="YYYY/MM/DD" format-datetime="YYYY/MM/DD HH:mm:ss"
                                               class="input-medium medium-c1 dateClass" type="date" required="">
                                    </div>
                                </div>
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>拜訪狀態</label>
                                        <select class="input-medium medium-c1">
                                            <option value="Y">Y:已拜訪</option>
                                            <option value="N">N:未拜訪</option>
                                        </select>
                                    </div>
                                    <div class="grid-item">
                                        <label>實際拜訪日</label>
                                        <input format-date="YYYY/MM/DD" format-datetime="YYYY/MM/DD HH:mm:ss"
                                               class="input-medium medium-c1 dateClass" type="date" required="">
                                    </div>
                                </div>
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>交通費</label>
                                        <input type="text" class="input-medium medium-c1 text-right" placeholder="435"/>
                                    </div>
                                </div>
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>主旨</label>
                                        <input type="text" class="input-medium input-spc-1" placeholder="初談合約"/>
                                    </div>
                                </div>

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>內容</label>
                                        <textarea class="input-medium input-spc-1 height-auto rzNone" style="width: 434px; max-width: 100%;"
                                                  rows="4" placeholder="談合約其貢獻度數字以及房價等級定義"></textarea>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>

                                <div class="space-6"></div>
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>新增日</label>
                                        <input type="text" class="input-medium medium-c1"
                                               placeholder="2000/01/01 12:30:00" disabled="disabled"/>
                                    </div>
                                    <div class="grid-item">
                                        <label>新增者</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="cio"
                                               disabled="disabled"/>
                                    </div>
                                </div>
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>最後異動日</label>
                                        <input type="text" class="input-medium medium-c1"
                                               placeholder="2000/01/01 12:30:00" disabled="disabled"/>
                                    </div>
                                    <div class="grid-item">
                                        <label>最後異動者</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="cio"
                                               disabled="disabled"/>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <!--/.單筆 拜訪紀錄-->
                    <!--按鈕-->
                    <div class="col-sm-2 col-xs-2">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                                :disabled="BTN_action || isFirstData" v-if="isEditStatus" @click="toFirstData">
                                            {{i18nLang.SystemCommon.First}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                                :disabled="BTN_action || isFirstData" v-if="isEditStatus" @click="toPreData">
                                            {{i18nLang.SystemCommon.Previous}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                                :disabled="BTN_action || isLastData" v-if="isEditStatus" @click="toNextData">
                                            {{i18nLang.SystemCommon.Next}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                                :disabled="BTN_action || isLastData" v-if="isEditStatus" @click="toLastData">
                                            {{i18nLang.SystemCommon.Last}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-danger btn-white btn-defaultWidth" role="button" @click="doRemoveRow">
                                            {{i18nLang.SystemCommon.Delete}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth" role="button" @click="doCloseDialog">
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
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    export default {
        name: 'visit-record',
        props: ["rowData", "paramsData", "isCreateStatus", "isEditStatus"],
        data() {
            return {
                i18nLang: go_i18nLang,
                isFirstData: false,
                isLastData: false,
                BTN_action: false,
                isLoadingDialog: false,
                loadingText: "",
                tmpCUD: {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                },
                singleData: {},
                oriSingleData: {},
                fieldsData: [],
                oriFieldsData: []
            };
        },
        mounted() {
            this.isLoadingDialog = true;
            this.loadingText = "Loading...";
        },
        watch: {
            rowData(val) {
                if (!_.isEmpty(val)) {
                    this.initData();
                    this.fetchFieldData();

                    var nowDatagridRowIndex = $("#" + this.paramsData.dgId).datagrid('getRowIndex', val);

                    $("#" + this.paramsData.dgId).datagrid('selectRow', nowDatagridRowIndex);

                    if ($("#" + this.paramsData.dgId).datagrid('getRowIndex', val) == 0) {
                        //已經到第一筆
                        this.isFirstData = true;
                        this.isLastData = false;
                        if ($("#" + this.paramsData.dgId).datagrid('getRowIndex', val) == this.paramsData.pageOneDataGridRows.length - 1) {
                            this.isLastData = true;
                        }

                    }
                    else if ($("#" + this.paramsData.dgId).datagrid('getRowIndex', val) == this.paramsData.pageOneDataGridRows.length - 1) {
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
            initData() {
                this.singleData = {};
                this.oriSingleData = {};
                this.fieldsData = [];
                this.oriFieldsData = [];
            },
            fetchFieldData() {
                var self = this;
//                $.post("", {
//                    prg_id: self.paramsData.gridSinglePrgId,
//                    page_id: self.paramsData.gridSinglePageId,
//                    singleRowData: self.rowData
//                }, function (result) {
//                    if (result.success) {
//                        self.oriFieldsData = result.fieldData;
//                        self.fieldsData = _.values(_.groupBy(_.sortBy(result.fieldData, "row_seq"), "row_seq"));
//                        self.fetchRowData(self.rowData);
//                    }
//                });
            },
            fetchRowData(editingRow) {
//                editingRow.visit_dat = moment(new Date(editingRow.visit_dat)).format("YYYY/MM/DD");
//                editingRow.avisit_dat = moment(new Date(editingRow.avisit_dat)).format("YYYY/MM/DD");
//                $.post("/api/fetchSinglePageFieldData", {
//                    prg_id: self.paramsData.gridSinglePrgId,
//                    page_id: self.paramsData.gridSinglePageId,
//                    searchCond: editingRow
//                }, function (result) {
//
//                });
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
            toFirstData() {
                this.isFirstData = true;
                this.isLastData = false;
                this.rowData = _.first(this.paramsData.pageOneDataGridRows);
            },
            toPreData() {
                var nowRowIndex = $("#visitPlan_dg").datagrid('getRowIndex', this.rowData);
                this.rowData = this.paramsData.pageOneDataGridRows[nowRowIndex - 1];
            },
            toNextData() {
                var nowRowIndex = $("#visitPlan_dg").datagrid('getRowIndex', this.rowData);
                this.rowData = this.paramsData.pageOneDataGridRows[nowRowIndex + 1];
            },
            toLastData() {
                this.isFirstData = false;
                this.isLastData = true;
                this.rowData = _.last(this.paramsData.pageOneDataGridRows);
            },
            doRemoveRow() {
                var self = this;
                var q = confirm(go_i18nLang["SystemCommon"].check_delete);
                if (q) {

                }
            },
            doCloseDialog() {
                this.initData();
                this.rowData = {};
                $("#visitRecord").dialog('close');
            }
        }
    }
</script>