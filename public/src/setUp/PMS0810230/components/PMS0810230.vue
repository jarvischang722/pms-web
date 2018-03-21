<template>
    <div v-loading="isLoading" element-loading-text="Loading...">
        <div class="col-xs-12">
            <search-comp
                    :search-fields="searchFields"
                    :search-cond.sync="searchCond"
                    :fetch-data="loadDataGridByPrgID"
            ></search-comp>
        </div> <!-- /.col-sm-12 -->
        <div class="clearfix"></div>
        <div class="col-xs-12">
            <div class="col-sm-11 col-xs-11">
                <div class="row no-margin-right">
                    <div class="tableHt">
                        <!-- rateCode-查詢結果 dataGrid -->
                        <!--<table id="setRateCode-table" class="gridTableHt" style="width: 100%;max-width: 100%;"></table>-->
                        <table id="PMS0810230_dg" class=""></table>
                    </div>
                </div>
            </div>
            <!--按鈕-->
            <div class="col-xs-1 col-sm-1">
                <div class="row">
                    <div class="right-menu-co">
                        <ul>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                        role="button" @click="appendRow">{{i18nLang.program.PMS0810230.add}}
                                </button>
                            </li>

                            <li>
                                <button class="btn btn-danger btn-white btn-defaultWidth rateCode_timeRule"
                                        role="button">{{i18nLang.program.PMS0810230.delete}}
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                        role="button" @click="editRow">{{i18nLang.program.PMS0810230.edit}}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!--/. 按鈕-->
        </div> <!-- /.col-sm-12 -->
        <div class="clearfix"></div>
        <pms0810230-single-grid
                :row-data="editingRow"
                :is-modifiable="isModifiable"
                :is-create-status="isCreateStatus"
                :is-edit-status="isEditStatus"
        ></pms0810230-single-grid>
        <!--房型使用的日期規則-->
        <el-dialog
                :close-on-click-modal="true" :show-close="false" :title="i18nLang.program.PMS0810230.company_status"
                :visible.sync="isOpenTimeRule" :before-close="doCloseTimeRuleDialog">
            <div>
                <div class="businessCompanyData">
                    <div class="col-xs-12 col-sm-12">
                        <div class="row">
                            <div class="col-xs-10 col-sm-10">
                                <div class="row no-margin-right">
                                    <div class="borderFrame">
                                        <!--開始結束日期設定-->
                                        <div class="block">
                                            <span class="demonstration">{{i18nLang.program.PMS0810230.from}}</span>
                                            <el-date-picker
                                                    v-model="timeRuleSingleData['begin_dat']"
                                                    type="date"
                                                    placeholder="選擇日期">
                                            </el-date-picker>
                                            <!--<br>-->
                                            <span class="demonstration">{{i18nLang.program.PMS0810230.to}}</span>
                                            <el-date-picker
                                                    v-model="timeRuleSingleData['end_dat']"
                                                    type="date"
                                                    placeholder="選擇日期">
                                            </el-date-picker>
                                        </div>
                                        <!--/.開始結束日期設定-->
                                        <div class="space-6"></div>
                                        <!--tabPage-->
                                        <el-tabs v-model="timeRuleSingleData['command_cod']" type="card">
                                            <el-tab-pane :label="i18nLang.program.PMS0810230.evertDay" name="D">
                                                <div class="ml-5">
                                                    <div class="space-6"></div>
                                                    <span>每一天</span>
                                                    <div class="space-6"></div>
                                                </div>
                                            </el-tab-pane>
                                            <el-tab-pane :label="i18nLang.program.PMS0810230.holiday" name="H">
                                                <div class="ml-5">
                                                    <div class="space-6"></div>
                                                    <bac-select
                                                            v-model="commandHVal" :default-val="commandHVal"
                                                            @update:v-model="val => commandHVal = val"
                                                            :data="commandOptionSelectOption.selectData" multiple="true"
                                                            is-qry-src-before="Y" value-field="value" text-field="display">
                                                    </bac-select>
                                                    <div class="space-6"></div>
                                                </div>
                                            </el-tab-pane>
                                            <el-tab-pane :label="i18nLang.program.PMS0810230.week" name="W">
                                                <div class="space-6"></div>
                                                <div class="grid ml-5">
                                                    <div class="grid-item">
                                                            <span class="checkbox no-margin">
                                                              <label class="checkbox-width">
                                                                  <input name="form-field-checkbox" type="checkbox"
                                                                         class="ace" v-model="commandVal" value="W2">
                                                                  <span class="lbl">{{i18nLang.program.PMS0810230.monday}}</span>
                                                              </label>
                                                            </span>
                                                    </div>
                                                    <div class="grid-item">
                                                            <span class="checkbox no-margin">
                                                              <label class="checkbox-width">
                                                                  <input name="form-field-checkbox" type="checkbox"
                                                                         class="ace" v-model="commandVal" value="W3">
                                                                  <span class="lbl">{{i18nLang.program.PMS0810230.tuesday}}</span>
                                                              </label>
                                                            </span>
                                                    </div>
                                                    <div class="grid-item">
                                                            <span class="checkbox no-margin">
                                                              <label class="checkbox-width">
                                                                  <input name="form-field-checkbox" type="checkbox"
                                                                         class="ace" v-model="commandVal" value="W4">
                                                                  <span class="lbl">{{i18nLang.program.PMS0810230.wednesday}}</span>
                                                              </label>
                                                            </span>
                                                    </div>
                                                    <div class="grid-item">
                                                            <span class="checkbox no-margin">
                                                              <label class="checkbox-width">
                                                                  <input name="form-field-checkbox" type="checkbox"
                                                                         class="ace" v-model="commandVal" value="W5">
                                                                  <span class="lbl">{{i18nLang.program.PMS0810230.thursday}}</span>
                                                              </label>
                                                            </span>
                                                    </div>
                                                    <div class="grid-item">
                                                            <span class="checkbox no-margin">
                                                              <label class="checkbox-width">
                                                                  <input name="form-field-checkbox" type="checkbox"
                                                                         class="ace" v-model="commandVal" value="W6">
                                                                  <span class="lbl">{{i18nLang.program.PMS0810230.friday}}</span>
                                                              </label>
                                                            </span>
                                                    </div>
                                                    <div class="grid-item">
                                                            <span class="checkbox no-margin">
                                                              <label class="checkbox-width">
                                                                  <input name="form-field-checkbox" type="checkbox"
                                                                         class="ace" v-model="commandVal" value="W7">
                                                                  <span class="lbl">{{i18nLang.program.PMS0810230.saturday}}</span>
                                                              </label>
                                                            </span>
                                                    </div>
                                                    <div class="grid-item">
                                                            <span class="checkbox no-margin">
                                                              <label class="checkbox-width">
                                                                  <input name="form-field-checkbox" type="checkbox"
                                                                         class="ace" v-model="commandVal" value="W1">
                                                                  <span class="lbl">{{i18nLang.program.PMS0810230.sunday}}</span>
                                                              </label>
                                                            </span>
                                                    </div>
                                                </div>
                                                <div class="space-6"></div>
                                            </el-tab-pane>
                                        </el-tabs>
                                        <!--/.tabPage-->
                                    </div><!--main-content-data-->
                                </div>
                            </div>
                            <div class="col-xs-2 col-sm-2">
                                <div class="row">
                                    <div class="right-menu-co">
                                        <ul>
                                            <li>
                                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                                        role="button" @click="chkTimeRule">
                                                    {{i18nLang.program.PMS0810230.OK}}
                                                </button>
                                            </li>
                                            <li>
                                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                                        role="button" @click="doCloseTimeRuleDialog">
                                                    {{i18nLang.program.PMS0810230.cancel}}
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import pms0810230SingleGrid from './PMS0810230SingleGrid.vue';

    let gs_prgId = "PMS0810230";

    Vue.prototype.$eventHub = new Vue();

    /** DatagridRmSingleGridClass **/
    function DatagridSingleGridClass() {
    }

    DatagridSingleGridClass.prototype = new DatagridBaseClass();
    DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    };
    DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
    };
    /*** Class End  ***/

    export default {
        name: 'pms0810230',
        created() {
            var self = this;
            this.$eventHub.$on('getTimeRuleData', (timeRuleData) => {
                this.isOpenTimeRule = timeRuleData.openTimeRule;
                this.commandOptionSelectOption = JSON.parse(JSON.stringify(timeRuleData.commandOptionSelectOption));
                _.each(this.commandOptionSelectOption.selectData, (lo_select, idx) => {
                    this.commandOptionSelectOption.selectData[idx].value = 'H' + lo_select.value;
                });
                if (!_.isEmpty(timeRuleData.singleData)) {
                    this.timeRuleSingleData = _.extend(this.timeRuleSingleData, timeRuleData.singleData);
                    this.timeRuleSingleData.begin_dat = timeRuleData.singleData.startDat;
                    this.timeRuleSingleData.end_dat = timeRuleData.singleData.endDat;
                    this.timeRuleSingleData.command_cod = timeRuleData.singleData.command_cod;
                    if (this.timeRuleSingleData.command_cod == 'H') {
                        let la_commandOption = timeRuleData.singleData.command_option.split(',');
                        if (la_commandOption.length > 1) {
                            _.each(la_commandOption, (ls_commandOption) => {
                                self.commandHVal.push(ls_commandOption)
                            });
                        }
                        else {
                            this.commandHVal.push(timeRuleData.singleData.command_option)
                        }
                    }
                    else if (this.timeRuleSingleData.command_cod == 'W') {
                        let la_commandOption = timeRuleData.singleData.command_option.split(',');
                        if (la_commandOption.length > 1) {
                            _.each(la_commandOption, (ls_commandOption) => {
                                self.commandVal.push(ls_commandOption)
                            });
                        }
                        else {
                            this.commandVal.push(timeRuleData.singleData.command_option)
                        }
                    }
                }
            });
        },
        mounted() {
            this.fetchUserInfo();
            this.loadDataGridByPrgID();
        },
        components: {
            pms0810230SingleGrid
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
                isModifiable: true,
                //日期規則
                isOpenTimeRule: false, //是否開起日期規則
                timeRuleTabName: "D",
                commandOptionSelectOption: [], //依假日類別下拉選單
                commandVal: [],//依星期別
                commandHVal: [],//依假日類別
                timeRuleSingleData: {
                    command_cod: 'D',
                    command_option: '',
                    begin_dat: '',
                    end_dat: ''
                }
            }
        },
        watch: {
            isOpenTimeRule(val) {
                if (!val) {
                    this.timeRuleSingleData = {
                        command_cod: 'D',
                        command_option: '',
                        begin_dat: '',
                        end_dat: ''
                    };
                    this.commandHVal = [];
                    this.commandVal = [];
                }
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
            loadDataGridByPrgID() {
                let self = this;
                let lo_searchCond = _.clone(this.searchCond);
                let lo_params = {
                    prg_id: gs_prgId,
                    searchCond: lo_searchCond
                };

                $.post("/api/prgDataGridDataQuery", lo_params, function (result) {
                    if (self.searchFields.length <= 0) {
                        self.searchFields = result.searchFields;
                    }
                    self.pageOneDataGridRows = result.dataGridRows;
                    self.pageOneFieldData = result.fieldData;
                    self.showDataGrid();
                });
            },
            showDataGrid() {
                let self = this;
                this.isLoading = false;
                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init("PMS0810230", "PMS0810230_dg", DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0810230_dg'));
                this.dgIns.loadDgData(this.pageOneDataGridRows);

            },
            appendRow() {
                this.isLoading = true;
                this.isCreateStatus = true;
                this.isEditStatus = false;
                this.editingRow = {rate_cod: "", rate_prop: ""};

                this.showSingleGridDialog();
                this.isLoading = false;
            },
            editRow() {
                this.isLoading = true;
                this.isCreateStatus = false;
                this.isEditStatus = true;
                this.editingRow = {};

                var lo_editRow = $('#PMS0810230_dg').datagrid('getSelected');

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

                let dialog = $('#PMS0810230SingleGrid').removeClass('hide').dialog({
                    modal: true,
                    title: "Rate code",
                    title_html: true,
                    width: 1000,
                    maxwidth: 1920,
                    dialogClass: "test",
                    resizable: true,
                    onBeforeClose() {
                        self.editingRow = {};
                        self.isEditStatus = false;
                        self.isCreateStatus = false;
                        self.$eventHub.$emit('setTabName', {tabName: ""});
                    }
                }).dialog('open');
            },
            //房型使用期間 日期規則
            chkTimeRule() {
                let ls_commandCod = this.timeRuleSingleData.command_cod;
                if (ls_commandCod == 'D') {
                    this.timeRuleSingleData.command_option = 'D1'
                }
                else if (ls_commandCod == 'H') {
                    _.each(this.commandHVal, (ls_val) => {
                        this.timeRuleSingleData.command_option = this.timeRuleSingleData.command_option + ls_val + ',';
                    });
                }
                else if (ls_commandCod == 'W') {
                    _.each(this.commandVal, (ls_val) => {
                        this.timeRuleSingleData.command_option = this.timeRuleSingleData.command_option + ls_val + ',';
                    });
                }
                this.timeRuleSingleData.command_option =
                    this.timeRuleSingleData.command_option.substring(0, this.timeRuleSingleData.command_option.length - 1);

                this.$eventHub.$emit('setTimeRule', {
                    singleData: this.timeRuleSingleData
                });
                this.isOpenTimeRule = false;
            },
            doCloseTimeRuleDialog() {
                this.isOpenTimeRule = false;
            }
        }
    }
</script>