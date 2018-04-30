<template>
    <div>
        <div class="pageMain" v-loading="isLoading" element-loading-text="Loading...">
            <div class="col-xs-12">
                <search-comp
                        :search-fields="searchFields"
                        :search-cond.sync="searchCond"
                        :fetch-data="fetchDgRowData"
                ></search-comp>
            </div> <!-- /.col-sm-12 -->
            <div class="clearfix"></div>
            <div class="col-xs-12">
                <!--單筆-->
                <div class="col-sm-11 col-xs-11">
                    <div class="row no-margin-right">
                        <div>
                            <table id="PMS0210010_dg" class=""></table>
                            <!-- gProfile 多筆 dataGrid -->
                            <!--<table id="resv_gProfile-table" class="gridTableHt"></table>-->
                        </div>
                    </div>
                </div>
                <!--/.單筆-->
                <!--按鈕-->
                <div class="col-xs-1 col-sm-1">
                    <div class="row">
                        <div class="right-menu-co">
                            <ul>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth"
                                            role="button" @click="appendRow">{{i18nLang.SystemCommon.Add}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth"
                                            role="button" @click="editRow">{{i18nLang.SystemCommon.Modify}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-gray btn-defaultWidth resv_merge"
                                            role="button">{{i18nLang.program.PMS0210010.merge}}
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth btn-skin"
                                            role="button">{{i18nLang.program.PMS0610010.save_as}}
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <!--/.按鈕-->
            </div> <!-- /.col-sm-12 -->
            <div class="clearfix"></div>
        </div>
        <pms0210011
                :row-data="editingRow"
                :is-modifiable="isModifiable"
                :is-create-status="isCreateStatus"
                :is-edit-status="isEditStatus"
        ></pms0210011>
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
    import pms0210011 from './PMS0210011.vue';

    Vue.prototype.$eventHub = new Vue();

    let gs_prgId = "PMS0210010";

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
        name: 'pms0210010',
        components: {pms0210011},
        created() {
            var self = this;
            this.$eventHub.$on('addNewData', function () {
                setTimeout(() => {
                    self.appendRow();
                }, 100);
            });
            //change log dialog
            this.$eventHub.$on('getChangeLogData', function (changeLogData) {
                self.openChangeLogDialog = changeLogData.openChangeLogDialog;
                self.allChangeLogList = changeLogData.allChangeLogList;
            });
        },
        mounted() {
            this.fetchUserInfo();
            this.loadDataGridByPrgID();
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
                openChangeLogDialog: false
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
                    page_id: 1,
                    searchCond: lo_searchCond
                };

                $.post("/api/fetchDataGridFieldData", lo_params, function (result) {
                    if(self.searchFields.length <= 0){
                        self.searchFields = result.searchFields;
                    }
                    self.pageOneFieldData = result.dgFieldsData;
                    self.pageOneDataGridRows = result.dgRowData;
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
                $.post('/api/fetchDgRowData', lo_params, (result) => {
                    this.pageOneDataGridRows = result.dgRowData;
                    this.dgIns.loadPageDgData(this.pageOneDataGridRows);
                });
            },
            showDataGrid() {
                let self = this;

                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init(gs_prgId, "PMS0210010_dg", DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0210010_dg'), this.pageOneFieldData, {
                    pagination: true,
                    rownumbers: true
                });

                this.dgIns.loadPageDgData(this.pageOneDataGridRows);

                this.isLoading = false;
            },
            appendRow() {
                this.isLoading = true;
                this.isCreateStatus = true;
                this.isEditStatus = false;
                this.editingRow = {gcust_cod: ""};

                this.showSingleGridDialog();
                this.isLoading = false;
            },
            editRow() {
                var self = this;

                this.isLoading = true;
                this.isCreateStatus = false;
                this.isEditStatus = true;
                this.editingRow = {};

                var lo_editRow = $('#PMS0210010_dg').datagrid('getSelected');

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
                this.$store.dispatch("setAllDataClear");
                let self = this;
                let dialog = $('#PMS0210011').removeClass('hide').dialog({
                    autoOpen: false,
                    modal: true,
                    title: "住客歷史",
                    width: 1000,
                    maxwidth: 1920,
                    minheight: 800,
                    dialogClass: "test",
                    resizable: true,
                    onBeforeClose() {
                        self.editingRow = {};
                        self.isEditStatus = false;
                        self.isCreateStatus = false;
                        self.$eventHub.$emit("doSaveModifyData");
                        self.fetchDgRowData();
                    }
                }).dialog('open');
            },
        }
    }
</script>
