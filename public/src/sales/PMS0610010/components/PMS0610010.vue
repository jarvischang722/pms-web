<template>
    <div v-loading="isLoading" element-loading-text="Loading...">
        <div>
            <div class="page-header"></div><!-- /.page-header -->
            <!-- 商務公司(Accounts) Page-->
            <div class="pageMain">
                <div class="col-xs-12">
                    <search-comp
                            :search-fields="searchFields"
                            :search-cond.sync="searchCond"
                            :fetch-data="fetchDgRowData"
                    ></search-comp>
                </div>
                <div class="clearfix"></div>
                <div class="col-xs-12 col-sm-12 businessCompanyData">
                    <!--多筆 商務公司 dataGrid -->
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right">
                            <div>
                                <table id="PMS0610010_dg" class="gridTableHt" style="height: 560px;"></table>
                            </div>
                        </div>
                    </div>
                    <!--/.多筆 商務公司 dataGrid -->
                    <!--按鈕-->
                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth sales-AccountMain purview_btn"
                                                role="button" @click="appendRow" v-if="prgEditionOptions.funcList['0200'] != undefined"
                                                data-purview_func_id="PMS0610010-0200">
                                            {{i18nLang.SystemCommon.Add}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth sales-AccountMain purview_btn"
                                                role="button" @click="editRow" v-if="prgEditionOptions.funcList['0400'] != undefined"
                                                data-purview_func_id="PMS0610010-0400">
                                            {{i18nLang.SystemCommon.Modify}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth btn-skin"
                                                role="button">
                                            {{i18nLang.program.PMS0610010.save_as}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth purview_btn"
                                                role="button" @click="doEditSalesClerk"
                                                v-if="prgEditionOptions.funcList['1010'] != undefined"
                                                data-purview_func_id="PMS0610010-1010">
                                            {{i18nLang.program.PMS0610010.sales_assign}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth purview_btn"
                                                role="button" @click="addVisitPlan"
                                                v-if="prgEditionOptions.funcList['1020'] != undefined"
                                                data-purview_func_id="PMS0610010-1020">
                                            {{i18nLang.program.PMS0610010.visit_plan}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth purview_btn"
                                                role="button" @click="browsRow"
                                                v-if="prgEditionOptions.funcList['1030'] != undefined"
                                                data-purview_func_id="PMS0610010-1030">
                                            {{i18nLang.program.PMS0610010['1030']}}
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
        <!--商務公司資料編輯-->
        <pms0610020
                :row-data="editingRow"
                :is-modifiable="isModifiable"
                :is-create-status="isCreateStatus"
                :is-edit-status="isEditStatus"
        ></pms0610020>
        <!--Status chg-->
        <el-dialog
                :close-on-click-modal="true" :show-close="false" :title=" i18nLang.program.PMS0610020.company_status "
                :visible.sync="isOpenCompSta" style="width: 43%; left: 30%;"
                :before-close="doCloseCompStaDialog">
            <div class="businessCompanyData" v-loading="isLoadingDialog" element-loading-text="saving...">
                <div class="col-sm-12 col-xs-12">
                    <div class="row">
                        <div class="col-sm-10 col-xs-10">
                            <div class="row billInfo no-margin-right" v-for="fields in compStaFieldData">
                                <div class="content">
                                    <div class="space-6"></div>
                                    <div class="grid-item" v-for="field in fields">
                                        <label v-if="field.visiable == 'Y' && field.ui_type != 'checkbox'">
                                            <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                            <span>{{ field.ui_display_name }}</span>
                                        </label>
                                        <bac-select v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                    :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                    v-model="compStaSingleData[field.ui_field_name]" :data="field.selectData"
                                                    is-qry-src-before="Y" value-field="value" text-field="display"
                                                    :field="field"
                                                    @update:v-model="val => compStaSingleData[field.ui_field_name] = val"
                                                    :default-val="field.defaultVal"
                                                    :disabled="field.modificable == 'N'">
                                        </bac-select>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                        </div>
                        <div class="col-sm-2 col-xs-2">
                            <div class="row">
                                <div class="right-menu-co">
                                    <ul>
                                        <li>
                                            <button class="btn btn-primary btn-white btn-defaultWidth"
                                                    role="button" @click="doSaveCompSta">
                                                {{i18nLang.SystemCommon.Save}}
                                            </button>
                                        </li>
                                        <li>
                                            <button class="btn btn-danger btn-white btn-defaultWidth"
                                                    role="button" @click="doCloseCompStaDialog">
                                                {{i18nLang.SystemCommon.Leave}}
                                            </button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
        </el-dialog>
        <!--/.Status chg -->
        <!--合約狀態變更-->
        <div>
            <el-dialog
                    :close-on-click-modal="true" :show-close="false" :title="i18nLang.program.PMS0610020.contract_status"
                    :visible.sync="isOpenContractStatus" style="width: 53%; left: 25%;"
                    :before-close="doCloseContractStatusDialog">
                <div class="businessCompanyData">
                    <div class="col-sm-12 col-xs-12" v-loading="isLoadingDialog" element-loading-text="saving...">
                        <div class="row">
                            <div class="col-sm-10 col-xs-10">
                                <div class="row billInfo no-margin-right">
                                    <div class="grid-item">
                                        <label v-if="contractStaMnFieldData.visiable == 'Y' && contractStaMnFieldData.ui_type != 'checkbox'">
                                            <span v-if=" contractStaMnFieldData.requirable == 'Y' " style="color: red;">*</span>
                                            <span>{{ contractStaMnFieldData.ui_display_name }}</span>
                                        </label>
                                        <bac-select :style="{width:contractStaMnFieldData.width + 'px' , height:contractStaMnFieldData.height + 'px'}"
                                                    v-model="contractStaMnSingleData[contractStaMnFieldData.ui_field_name]"
                                                    :data="contractStaMnFieldData.selectData"
                                                    :field="field"
                                                    is-qry-src-before="Y" value-field="value" text-field="display"
                                                    @update:v-model="val => contractStaMnSingleData[contractStaMnFieldData.ui_field_name] = val"
                                                    :default-val="contractStaMnSingleData[contractStaMnFieldData.ui_field_name]"
                                                    :disabled="contractStaMnFieldData.modificable == 'N'|| (contractStaMnFieldData.modificable == 'I' && isEditStatus) || (contractStaMnFieldData.modificable == 'E' && isCreateStatus)">
                                        </bac-select>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="space-6"></div>
                                    <div class="main-content-data borderFrame">
                                        <div class="fixHeadTable">
                                            <div class="tbl-header02">
                                                <table class=" custab">
                                                    <thead class="custab-head">
                                                    <tr>
                                                        <th class="width-15 text-center" v-for="field in contractStaDtFieldData">
                                                            {{field.ui_display_name}}
                                                        </th>
                                                    </tr>
                                                    </thead>
                                                </table>
                                            </div>
                                            <div class="tbl-content02" style="height: 300px;">
                                                <table class="custab">
                                                    <tbody class="custab-body" style="height: 250px; overflow-y: auto;">
                                                    <tr v-for="contractData in contractStaDtRowsData">
                                                        <td class="width-15">{{contractData.status_desc}}</td>
                                                        <td class="width-15">{{contractData.ins_dat}}</td>
                                                        <td class="width-15">{{contractData.ins_usr}}</td>
                                                    </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="col-sm-2 col-xs-2">
                                <div class="row">
                                    <div class="right-menu-co">
                                        <ul>
                                            <li>
                                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                                        role="button" @click="doSaveContractStatus">
                                                    {{i18nLang.SystemCommon.Save}}
                                                </button>
                                            </li>
                                            <li>
                                                <button class="btn btn-danger btn-white btn-defaultWidth"
                                                        role="button" @click="doCloseContractStatusDialog">
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
            </el-dialog>
        </div>
        <!--合約狀態變更-->
        <!--/.商務公司資料編輯-->
        <!--業務員指派-->
        <edit-sales-clerk
                :edit-rows="editRows"
                :is-edit-sales-clerk="isEditSalesClerk"
                :is-create-status="isCreateStatus"
                :is-edit-status="isEditStatus"
        ></edit-sales-clerk>
        <!--/.業務員指派-->
        <!--拜訪計畫-->
        <visit-plan
                :edit-rows="editRows"
                :is-visit-plan="isVisitPlan"
        ></visit-plan>
        <!--/.拜訪計畫-->
        <!--異動紀錄-->
        <el-dialog
                :title="i18nLang.SystemCommon.ChangeLog" :close-on-click-modal="true" :show-close="false"
                :visible.sync="openChangeLogDialog" size="large" class="openChangeLogDialog">
            <div class="col-xs-12">
                <div class="col-sm-12 col-xs-12">
                    <div class="row">
                        <div class="fixHeadTable">
                            <div class="tbl-header02">
                                <table class=" custab">
                                    <thead class="custab-head">
                                    <tr>
                                        <th class="width-15 text-center">{{i18nLang.SystemCommon.Time}}</th>
                                        <th class="width-20 text-center">{{i18nLang.SystemCommon.User}}</th>
                                        <th class="width-20 text-center">{{i18nLang.SystemCommon.Action_type}}</th>
                                        <th class="width-25 text-center">{{i18nLang.SystemCommon.Desciption_Mn}}</th>
                                        <th class="width-20 text-center">{{i18nLang.SystemCommon.Desciption_Dt}}</th>
                                    </tr>
                                    </thead>
                                </table>
                            </div>
                            <div class="tbl-content02" style="height: 300px;">
                                <table class="custab">
                                    <tbody class="custab-body" style="height: 250px; overflow-y: auto;">
                                    <tr v-for="logData in allChangeLogList">
                                        <td class="width-15">{{logData.event_time}}</td>
                                        <td class="width-20">{{logData.user}}</td>
                                        <td class="width-20">
                                            <span v-for="keyData in logData.keys">{{keyData}}<br></span>
                                        </td>
                                        <td class="width-25">
                                            <div class="blue bold" style="text-transform: capitalize;">
                                                {{logData.action}}
                                            </div>
                                            <span v-for="mnData in logData.desc_mn">
                                                {{mnData.field_name}} :
                                                {{mnData.oldVal}}
                                                <span v-if="logData.action == 'update'"> →  </span>
                                                {{mnData.newVal}}
                                                <br>
                                            </span>
                                        </td>
                                        <td class="width-20">
                                            <div v-for="dtData in logData.desc_dt">
                                                <div class="blue bold" style="text-transform: capitalize;">
                                                    {{dtData.action}}
                                                </div>
                                                <span v-for="dtChange in dtData.changes">
                                                    {{dtChange.field_name}} :
                                                    {{dtChange.oldVal}}
                                                    <span v-if="dtData.action == 'update'"> →  </span>
                                                    {{dtChange.newVal}}
                                                    <br>
                                                </span>
                                            </div>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                </div>
            </div> <!-- /.col-sm-12 -->
            <div class="clearfix"></div>
            <span slot="footer" class="dialog-footer">
             <el-button @click="openChangeLogDialog = false">{{i18nLang.SystemCommon.OK}}</el-button>
        </span>
        </el-dialog>
        <!--/.異動紀錄-->
    </div>
</template>
<script>
    import visitPlan from './visitPlan.vue';
    import editSalesClerk from './editSalesClerk.vue';
    import pms0610020 from './PMS0610020.vue';
    import async from 'async';

    Vue.prototype.$eventHub = new Vue();

    var gs_prgId = "PMS0610010";
    var vmHub = new Vue();

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
        name: 'pms0610010',
        el: "#PMS0610010App",
        created() {
            //取得版本資料
            BacchusMainVM.doGetVersionData("PMS0610010");
            this.prgEditionOptions = BacchusMainVM.prgEditionOptions;

            var self = this;
            vmHub.$on("doUnLock", function () {
                self.doRowUnLock();
            });
            //change log dialog
            this.$eventHub.$on('getChangeLogData', function (changeLogData) {
                self.openChangeLogDialog = changeLogData.openChangeLogDialog;
                self.allChangeLogList = changeLogData.allChangeLogList;
            });
            //status chg. dialog
            this.$eventHub.$on('getCompanyStatusData', function (companyStatusData) {
                self.isOpenCompSta = companyStatusData.openCompanyStatus;
            });
            //合約狀態變更 dialog
            this.$eventHub.$on('getContractStatusData', function (contractStatusData) {
                self.isOpenContractStatus = contractStatusData.openContractStatus;
                self.contractStaMnSingleData = contractStatusData.singleData;
                self.contractStaMnFieldData = contractStatusData.fieldData;
            });
            //業務員指派dialog
            this.$eventHub.$on('doEditSalesClerk', function (editSalesClerkData) {
                self.isEditSalesClerk = editSalesClerkData.isEditSalesClerk;
                self.editRows = editSalesClerkData.editRows;
                self.isEditStatus = editSalesClerkData.isEditStatus;
                self.isCreateStatus = editSalesClerkData.isCreateStatus;
                self.doEditSalesClerk();
            });
            //關閉業務員指派dialog
            this.$eventHub.$on('doCloseEditSalesClerk', function (editSalesClerkData) {
                self.isEditSalesClerk = editSalesClerkData.isEditSalesClerk;
                self.isEditStatus = editSalesClerkData.isEditStatus;
                self.isCreateStatus = editSalesClerkData.isCreateStatus;
                self.isLoading = false;
                self.editRows = [];
                self.fetchDgRowData();
            });
        },
        mounted() {
//            this.go_funcPurview = (new FuncPurview(gs_prgId)).getFuncPurvs();
            this.isLoading = true;
            this.fetchUserInfo();
            this.setSearchCond();
            this.loadDataGridByPrgID();
        },
        components: {visitPlan, editSalesClerk, pms0610020},
        data() {
            return {
                i18nLang: go_i18nLang,
                go_funcPurview: [],
                prgEditionOptions: {},
                userInfo: {},
                dataGridHeight: 60, //DataGrid 高度
                pageOneDataGridRows: [],
                pageOneFieldData: [],
                searchFields: [],
                searchCond: {},
                dgIns: {},
                isLoading: false,
                isLoadingDialog: false,
                editingRow: {},
                editRows: [],
                isAddEnable: false,
                isModifiable: true,
                isCreateStatus: false,
                isEditStatus: false,
                isEditSalesClerk: false,//業務員指派
                isOpenCompSta: false,
                isOpenContractStatus: false,
                isVisitPlan: false, //拜訪計畫
                openChangeLogDialog: false,
                allChangeLogList: {},
                compStaSingleData: {},
                compStaFieldData: [],
                dgContractStaIns: {},
                contractStaMnSingleData: {},
                contractStaMnFieldData: [],
                contractStaDtRowsData: [],
                contractStaDtFieldData: []
            };
        },
        watch: {
            openChangeLogDialog(val) {
                if (!val) {
                    this.$eventHub.$emit('getCloseChangeLogData', {isOpenChangeLog: val});
                }
            },
            isEditStatus(val) {
                if (!val) {
//                    this.go_funcPurview = (new FuncPurview(gs_prgId)).getFuncPurvs();
                }
            },
            isCreateStatus(val) {
                if (!val) {
//                    this.go_funcPurview = (new FuncPurview(gs_prgId)).getFuncPurvs();
                }
            },
            isVisitPlan(val) {
                if (!val) {
//                    this.go_funcPurview = (new FuncPurview(gs_prgId)).getFuncPurvs();
                }
            },
            isOpenCompSta(val) {
                if (val) {
                    BacUtils.doHttpPostAgent("/api/fetchOnlySinglePageFieldData", {
                        prg_id: "PMS0610020",
                        page_id: 2,
                        tab_page_id: 1010,
                        template_id: "gridsingle"
                    }, (result) => {
                        if (result) {
                            this.compStaFieldData = _.values(_.groupBy(_.sortBy(result.gsFieldsData, "col_seq"), "row_seq"));
                        }
                    });
                }
            },
            isOpenContractStatus(val) {
                if (val) {
                    BacUtils.doHttpPostAgent("/api/fetchDataGridFieldData", {
                        prg_id: "PMS0610020",
                        page_id: 2,
                        tab_page_id: 1020,
                        searchCond: {cust_cod: this.contractStaMnSingleData.cust_cod}
                    }, result => {
                        this.contractStaDtFieldData = result.dgFieldsData;
                        this.contractStaDtRowsData = result.dgRowData;
                    });
                }
            },
            contractStaDtRowsData: {
                handler(val) {
                    if (val.length > 0) {
                        _.each(val, function (lo_val, idx) {
                            val[idx].ins_dat = moment(new Date(lo_val.ins_dat)).format("YYYY/MM/DD");
                        });
                    }
                },
                deep: true
            }
        },
        methods: {
            fetchUserInfo() {
                var self = this;
                BacUtils.doHttpPostAgent('/api/getUserInfo', function (result) {
                    if (result.success) {
                        self.userInfo = result.userInfo;
                    }
                });
            },
            setSearchCond() {
                this.searchCond = {
                    ar_amt: "",
                    credit_amt: "",
                    area_cod: [],
                    business_cod: [],
                    contract_sta: [],
                    cust_nam: "",
                    ins_dat: "",
                    rank_nos: "",
                    sales_cod: [],
                    cust_mn_show_cod: "",
                    status_cod: "",
                    type_cod: [],
                    hoffice_cust_idx_show_cod: "",
                    pcust_idx_show_cod: ""
                };
            },
            fetchSearchFields() {
                BacUtils.doHttpPostAgent('/api/fetchOnlySearchFieldsData', {prg_id: 'PMS0610010'}, (result) => {
                    if (result.success) {
                        this.searchFields = result.searchFieldsData;
                    }
                });
            },
            loadDataGridByPrgID() {
                var self = this;
                var lo_searchCond = _.clone(this.searchCond);

                var lo_params = {
                    prg_id: gs_prgId,
                    page_id: 1,
                    searchCond: lo_searchCond
                };
                BacUtils.doHttpPostAgent("/api/fetchDataGridFieldData", lo_params, function (result) {
                    self.pageOneFieldData = result.dgFieldsData;
                    if (self.searchFields.length <= 0) {
                        self.searchFields = result.searchFields;
                    }
                    self.isLoading = false;
                    self.showDataGrid();
                });
            },
            fetchDgRowData() {
                var lo_searchCond = _.clone(this.searchCond);

                var lo_params = {
                    prg_id: gs_prgId,
                    page_id: 1,
                    searchCond: lo_searchCond
                };

                BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", lo_params).then(result => {
                    this.pageOneDataGridRows = result.dgRowData;
                    this.showDataGrid();
                }, err => {
                    throw Error(err);
                })
            },
            showDataGrid() {
                var colOption = [{field: 'ck', checkbox: true}];
                colOption = _.union(colOption, DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0610010_dg'));

                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init(gs_prgId, "PMS0610010_dg", colOption, this.pageOneFieldData, {
                    singleSelect: false,
                    pagination: true,
                    rownumbers: true,
                    pageSize: 20 //一開始只載入20筆資料
                });

                this.dgIns.loadPageDgData(this.pageOneDataGridRows);

                this.isLoading = false;
            },
            appendRow() {
                this.isLoading = true;
                this.isCreateStatus = true;
                this.isEditStatus = false;
                this.isEditSalesClerk = false;
                this.isVisitPlan = false;
                this.isModifiable = true;
                this.editingRow = {cust_mn_cust_cod: ""};

                this.showSingleGridDialog();
                this.isLoading = false;
            },
            editRow() {
                var self = this;

                this.isLoading = true;
                this.isCreateStatus = false;
                this.isEditStatus = true;
                this.isEditSalesClerk = false;
                this.isVisitPlan = false;
                this.isModifiable = true;
                this.editingRow = {};

                var lo_editRow = $('#PMS0610010_dg').datagrid('getSelected');
                var la_editRows = $('#PMS0610010_dg').datagrid('getSelections');

                if (!lo_editRow) {
                    alert(go_i18nLang["SystemCommon"].SelectData);
                }
                else if (la_editRows.length > 1 || lo_editRow != la_editRows[0]) {
                    alert(go_i18nLang["program"].PMS0610010.selectOneData);
                }
                else
                    {
                    this.editingRow = lo_editRow;
                    this.showSingleGridDialog();
                }
                this.isLoading = false;
            },
            browsRow() {
                this.isLoading = true;
                this.isCreateStatus = false;
                this.isEditStatus = true;
                this.isEditSalesClerk = false;
                this.isVisitPlan = false;
                this.isModifiable = false;
                this.editingRow = {};

                var lo_editRow = $('#PMS0610010_dg').datagrid('getSelected');
                var la_editRows = $('#PMS0610010_dg').datagrid('getSelections');

                if (!lo_editRow) {
                    alert(go_i18nLang["SystemCommon"].SelectData);
                }
                else if (la_editRows.length > 1 || lo_editRow != la_editRows[0]) {
                    alert(go_i18nLang["program"].PMS0610010.selectOneData);
                }
                else {
                    this.editingRow = lo_editRow;
                    this.showSingleGridDialog();
                }
                this.isLoading = false;
            },
            showSingleGridDialog() {
                var self = this;
                this.$store.dispatch("custMnModule/setAllDataClear");

                var dialog = $('#PMS0610020').removeClass('hide').dialog({
                    autoOpen: false,
                    modal: true,
                    title: go_i18nLang["program"]["PMS0610020"].company_maintain,
                    width: 1000,
                    maxHeight: 1920,
                    resizable: true,
                    onBeforeClose() {
                        self.editingRow = {};
                        self.isEditStatus = false;
                        self.isCreateStatus = false;
                        self.$eventHub.$emit('setTabName', {
                            tabName: ""
                        });
                        //資料是否有異動
                        self.$store.dispatch("custMnModule/qryAllDataIsChange").then(result => {
                            if (result.success) {
                                if (result.isChange) {
                                    let lb_confirm = confirm(go_i18nLang.Validation.Formatter.chkDataChang);
                                    if (lb_confirm) {
                                        self.$eventHub.$emit('saveSingleData');
                                    }
                                }
                            }
                        });

                        self.fetchSearchFields();
                        // self.doRowUnLock();
                    }
                }).dialog('open');
            },
            //單筆 ststus chg.(公司狀態)
            doSaveCompSta() {
                var self = this;
                this.isLoadingDialog = true;
                var rule_func_name = this.compStaFieldData[0][0].rule_func_name;
                this.compStaSingleData = _.extend(this.compStaSingleData, {cust_cod: this.$store.state.custMnModule.gs_custCod});
                var postData = {
                    prg_id: "PMS0610020",
                    rule_func_name: rule_func_name,
                    validateField: this.compStaFieldData[0][0].ui_field_name,
                    singleRowData: JSON.parse(JSON.stringify(this.compStaSingleData)),
                    oriSingleData: this.$store.state.custMnModule.go_allData.go_mnSingleData.status_cod,
                    isFirst: true
                };

                this.chkCompStat(function (result) {
                    if (result) {
                        BacUtils.doHttpPostAgent('/api/sales/doCompState', postData, function (res) {
                            if (res.success) {
                                if (res.showConfirm) {
                                    if (confirm(res.confirmMsg)) {
                                        postData.isFirst = false;
                                        BacUtils.doHttpPostAgent(res.ajaxURL, postData, function (res2) {
                                            //傳公司狀態回商務公司資料編輯
                                            self.$eventHub.$emit("compStateData", {
                                                singleData: self.compStaSingleData
                                            });
                                            self.isOpenCompSta = false;
                                            self.isLoadingDialog = false;
                                        });
                                    }
                                }
                                else {
                                    //傳公司狀態回商務公司資料編輯
                                    self.$eventHub.$emit("compStateData", {
                                        singleData: self.compStaSingleData
                                    });
                                    self.isLoadingDialog = false;
                                    self.isOpenCompSta = false;
                                }
                            }
                            else {
                                self.isLoadingDialog = false;
                                self.isOpenCompSta = true;
                                alert(res.errorMsg);
                            }
                        })
                    }
                });
            },
            chkCompStat(callback) {
                var self = this;
                var rule_func_name = this.compStaFieldData[0][0].rule_func_name;
                this.compStaSingleData = _.extend(this.compStaSingleData, {cust_cod: this.$store.state.custMnModule.gs_custCod});

                if (!_.isEmpty(rule_func_name.trim())) {
                    var postData = {
                        prg_id: "PMS0610020",
                        validateField: this.compStaFieldData[0][0].ui_field_name,
                        singleRowData: JSON.parse(JSON.stringify(this.compStaSingleData)),
                        oriSingleData: this.$store.state.custMnModule.go_allData.go_mnSingleData.status_cod
                    };

                    BacUtils.doHttpPostAgent('/api/chkFieldRule', postData, function (result) {
                        if (result.success) {
                            callback(true);
                        }
                        else {
                            self.isOpenCompSta = true;
                            alert(result.errorMsg);
                            callback(false)
                        }
                    });
                }

            },
            doCloseCompStaDialog() {
                this.compStaSingleData = {};
                this.compStaFieldData = [];
                this.isOpenCompSta = false;
            },
            //單筆 合約狀態變更
            doSaveContractStatus() {
                var self = this;
                this.isLoadingDialog = true;
                var ln_statusDescIdx = _.findIndex(this.contractStaMnFieldData.selectData, {value: this.contractStaMnSingleData.contract_sta});
                var ls_statusDesc = this.contractStaMnFieldData.selectData[ln_statusDescIdx].display.split(":")[1].trim();
                this.contractStaMnSingleData = _.extend(this.contractStaMnSingleData, {status_desc: ls_statusDesc});
                var postData = {
                    prg_id: "PMS0610020",
                    validateField: this.contractStaMnFieldData.ui_field_name,
                    singleRowData: JSON.parse(JSON.stringify(this.contractStaMnSingleData)),
                    oriSingleData: this.$store.state.custMnModule.go_allData.go_mnSingleData.contract_sta
                };

                BacUtils.doHttpPostAgent('/api/sales/doContractState', postData, function (result) {
                    if (result.success) {
                        self.$eventHub.$emit("contractStateData", {
                            singleData: self.contractStaMnSingleData
                        });
                        self.isOpenContractStatus = false;
                    }
                    else {
                        self.isOpenContractStatus = true;
                        alert(result.errorMsg);
                    }
                    self.isLoadingDialog = false;
                });

            },
            doCloseContractStatusDialog() {
                this.isOpenContractStatus = false;
            },
            //業務員指派
            doEditSalesClerk() {
                var self = this;

                var ln_count = 0;
                var la_editRow = $('#PMS0610010_dg').datagrid('getSelections');

                if (la_editRow.length == 0 && this.editRows.length == 0) {
                    alert(go_i18nLang["SystemCommon"].SelectData);
                }
                else {
                    this.isEditStatus = true;
                    this.isCreateStatus = false;
                    this.editRows = this.editRows.length == 0 ? la_editRow : this.editRows;
                    _.each(this.editRows, function (lo_editRow) {
                        self.doRowLock("PMS0620030", lo_editRow.cust_mn_cust_cod, function (result) {
                            if (result) {
                                ln_count++;
                            }
                        });
                    });
                    if (ln_count == this.editRows.length) {
                        this.isEditSalesClerk = true;
                        this.isVisitPlan = false;
                    }
                }
            },
            //新增拜訪計畫
            addVisitPlan() {
                var self = this;
                var ln_count = 0;
                this.isLoading = true;
                this.isEditSalesClerk = false;
                this.isVisitPlan = false;

                var la_editRow = $('#PMS0610010_dg').datagrid('getSelections');

                if (la_editRow.length == 0) {
                    alert(go_i18nLang["SystemCommon"].SelectData);
                }
                else {
                    this.editRows = la_editRow;

                    _.each(this.editRows, function (lo_editRow) {
                        self.doRowLock("PMS0620050", lo_editRow.cust_mn_cust_cod, function (result) {
                            if (result) {
                                ln_count++;
                            }
                        });
                    });
                    if (ln_count == this.editRows.length) {
                        this.isVisitPlan = true;

                        var dialog = $("#addVisitPlan").removeClass('hide').dialog({
                            modal: true,
                            title: go_i18nLang["program"]["PMS0610010"].add_visit_plan,
                            title_html: true,
                            width: 1015,
                            maxwidth: 1920,
                            dialogClass: "test",
                            zIndex: 9999,
                            resizable: true,
                            onBeforeClose: function () {
                                self.editRows = [];
                                self.isVisitPlan = false;
                                self.doRowUnLock();
                            }
                        });
                    }
                }
                this.isLoading = false;
            },
            doRowLock: function (prg_id, cust_cod, callback) {
                var lo_param = {
                    prg_id: prg_id,
                    table_name: "cust_mn",
                    lock_type: "R",
                    key_cod: cust_cod.trim()
                };
                g_socket.emit('handleTableLock', lo_param);
                callback(true);
            },
            doRowUnLock() {
                var lo_param = {
                    prg_id: ""
                };
                g_socket.emit('handleTableUnlock', lo_param);
            }
        }
    }

    //關掉瀏覽器時unlock
    $(window).on('beforeunload', function () {
        vmHub.$emit("doUnLock");
    });
</script>