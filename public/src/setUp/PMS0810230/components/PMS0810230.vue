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
                                            <span class="demonstration">從</span>
                                            <el-date-picker
                                                    v-model="value1"
                                                    type="date"
                                                    placeholder="選擇日期">
                                            </el-date-picker>
                                            <!--<br>-->
                                            <span class="demonstration">到</span>
                                            <el-date-picker
                                                    v-model="value2"
                                                    type="date"
                                                    placeholder="選擇日期">
                                            </el-date-picker>
                                        </div>
                                        <!--/.開始結束日期設定-->
                                        <div class="space-6"></div>
                                        <!--tabPage-->
                                        <el-tabs v-model="activeName2" type="card" @tab-click="handleClick">
                                            <el-tab-pane label="每天" name="first">
                                                <div class="ml-5">
                                                    <div class="space-6"></div>
                                                    <span>每一天</span>
                                                    <div class="space-6"></div>
                                                </div>
                                            </el-tab-pane>
                                            <el-tab-pane label="依假日類別" name="second">
                                                <div class="ml-5">
                                                    <div class="space-6"></div>
                                                    <select class="input-medium popWindow-s1">
                                                        <option value="">1.七夕情人節</option>
                                                        <option value="">2.中秋節</option>
                                                        <option value="">3.清明節</option>
                                                        <option value="">4.暑假旺日</option>
                                                        <option value="">5.暑假</option>
                                                        <option value="">C.農曆春節</option>
                                                        <option value="">D.旺日</option>
                                                        <option value="">H.假日</option>
                                                        <option value="">N.平日</option>
                                                    </select>
                                                    <div class="space-6"></div>
                                                </div>
                                            </el-tab-pane>
                                            <el-tab-pane label="依星期別" name="third">
                                                <div class="space-6"></div>
                                                <div class="grid ml-5">
                                                    <div class="grid-item">
                                                            <span class="checkbox no-margin">
                                                              <label class="checkbox-width">
                                                                  <input name="form-field-checkbox" type="checkbox"
                                                                         class="ace">
                                                                  <span class="lbl">星期一</span>
                                                              </label>
                                                            </span>
                                                    </div>
                                                    <div class="grid-item">
                                                            <span class="checkbox no-margin">
                                                              <label class="checkbox-width">
                                                                  <input name="form-field-checkbox" type="checkbox"
                                                                         class="ace">
                                                                  <span class="lbl">星期二</span>
                                                              </label>
                                                            </span>
                                                    </div>
                                                    <div class="grid-item">
                                                            <span class="checkbox no-margin">
                                                              <label class="checkbox-width">
                                                                  <input name="form-field-checkbox" type="checkbox"
                                                                         class="ace">
                                                                  <span class="lbl">星期三</span>
                                                              </label>
                                                            </span>
                                                    </div>
                                                    <div class="grid-item">
                                                            <span class="checkbox no-margin">
                                                              <label class="checkbox-width">
                                                                  <input name="form-field-checkbox" type="checkbox"
                                                                         class="ace">
                                                                  <span class="lbl">星期四</span>
                                                              </label>
                                                            </span>
                                                    </div>
                                                    <div class="grid-item">
                                                            <span class="checkbox no-margin">
                                                              <label class="checkbox-width">
                                                                  <input name="form-field-checkbox" type="checkbox"
                                                                         class="ace">
                                                                  <span class="lbl">星期五</span>
                                                              </label>
                                                            </span>
                                                    </div>
                                                    <div class="grid-item">
                                                            <span class="checkbox no-margin">
                                                              <label class="checkbox-width">
                                                                  <input name="form-field-checkbox" type="checkbox"
                                                                         class="ace">
                                                                  <span class="lbl">星期六</span>
                                                              </label>
                                                            </span>
                                                    </div>
                                                    <div class="grid-item">
                                                            <span class="checkbox no-margin">
                                                              <label class="checkbox-width">
                                                                  <input name="form-field-checkbox" type="checkbox"
                                                                         class="ace">
                                                                  <span class="lbl">星期日</span>
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
                                                        role="button" @click="chkTimeRule">確定
                                                </button>
                                            </li>
                                            <li>
                                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                                        role="button" @click="doCloseTimeRuleDialog">取消
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
    import ElDialog from "../../../../../node_modules/element-ui/packages/dialog/src/component.vue";

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
            this.$eventHub.$on('getTimeRuleData', (timeRuleData) => {
                this.isOpenTimeRule = timeRuleData.openTimeRule;
            });
        },
        mounted() {
            this.fetchUserInfo();
            this.loadDataGridByPrgID();
        },
        components: {
            ElDialog,
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
                isOpenTimeRule: false //是否開起日期規則
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
            chkTimeRule(){
                this.isOpenTimeRule = false;
            },
            doCloseTimeRuleDialog() {
                this.isOpenTimeRule = false;
            }
        }
    }
</script>