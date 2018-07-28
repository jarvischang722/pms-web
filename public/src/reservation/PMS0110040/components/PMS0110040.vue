<template>
    <div>
        <div class="page-header"></div><!-- /.page-header -->
        <!-- 訂房卡(Bookings) Page-->
        <div class="pageMain" v-loading="isLoading">
            <div class="col-xs-12">
                <search-comp
                        :search-fields="searchFields"
                        :search-cond.sync="searchCond"
                        :fetch-data="fetchDgFieldsRowDataByTabPageId"
                ></search-comp>
            </div>
            <div class="clearfix"></div>
            <div class="col-xs-12">
                <!--<div class="blockSetting-heading">查詢結果</div>-->
                <div class="col-sm-11 col-xs-11">
                    <div class="row no-margin-right">
                        <template>
                            <el-tabs v-model="activeName" type="card">
                                <el-tab-pane label="訂房多筆" name="mnDg"></el-tab-pane>
                                <el-tab-pane label="訂房明細" name="dtDg"></el-tab-pane>
                            </el-tabs>
                        </template>
                        <div>
                            <div class="easyui-panel" v-show="activeName=='mnDg'">
                                <table id="PMS0110040_mnDg" class="gridTableHt"></table>
                            </div>
                            <div class="easyui-panel" v-show="activeName=='dtDg'">
                                <table id="PMS0110040_dtDg" class="gridTableHt"></table>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-xs-1 col-sm-1">
                    <div class="row">
                        <div class="right-menu-co">
                            <ul>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth"
                                            role="button" @click="appendRow">新增
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth"
                                            role="button" @click="editRow">修改
                                    </button>
                                </li>
                                <li>
                                    <button class="btn btn-primary btn-white btn-defaultWidth  resv-view"
                                            role="button" @click="browsRow">瀏覽
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div class="clearfix"></div>
            </div>
            <pms0110041-lite
                    :row-data="editingRow"
                    :is-modifiable="isModifiable"
                    :is-create-status="isCreateStatus"
                    :is-edit-status="isEditStatus"
            ></pms0110041-lite>
        </div>
    </div>
</template>

<script>
    import pms0110041Lite from './PMS0110041_LITE.vue';

    Vue.prototype.$eventHub = new Vue();

    /** DatagridRmSingleGridClass **/
    function DatagridSingleGridClass() {
    }

    DatagridSingleGridClass.prototype = new DatagridBaseClass();
    DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    };
    DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
    };

    export default {
        name: "p-m-s0110040",
        components: {pms0110041Lite},
        data() {
            return {
                /**
                 * 靜態所綁的資料
                 */
                ciDate1: new Date(),
                coDate1: new Date(),
                newDate: new Date(),
                retentionDate: new Date(),
                checkDate: new Date(),
                cancelDate: new Date(),
                editDate: new Date(),
                activeName: 'mnDg',
                dtIns: null,
                mnIns: null,
                prg_id: "PMS0110040",
                userInfo: {},               //使用者資訊
                searchFields: [],           //搜尋欄位資料
                searchCond: {},             //搜尋資料
                mnDgRowsData: [],           //多筆資料
                mnDgFieldsData: [],         //多筆欄位資料
                dtDgRowsData: [],           //訂房明細資料
                dtDgFieldsData: [],         //訂房明細欄位資料
                dgIns: null,
                editingRow: {},
                isCreateStatus: false,
                isEditStatus: false,
                isModifiable: true,
            }
        },
        watch: {
            activeName(val) {
                if (val == "dtDg" && this.dtIns == null) {
                    this.fetchDgFieldsRowDataByTabPageId();
                }
            }
        },
        mounted() {
            this.fetchUserInfo();
            this.fetchDgFieldsRowDataByTabPageId(1);
        },
        methods: {
            fetchUserInfo() {
                BacUtils.doHttpPromisePostProxy('/api/getUserInfo').then((result) => {
                    if (result.success) {
                        this.userInfo = result.userInfo;
                    }
                });
            },
            /**
             * 透過tab_page_id取多筆欄位資訊和資料
             * @param tab_page_id {number} 分頁
             */
            fetchDgFieldsRowDataByTabPageId() {
                const ln_tab_page_id = this.activeName == "dtDg" ? 2 : 1;
                let lo_params = {
                    prg_id: this.prg_id,
                    page_id: 1,
                    tab_page_id: ln_tab_page_id,
                    searchCond: this.searchCond
                };

                BacUtils.doHttpPromisePostProxy("/api/fetchDataGridFieldData", lo_params).then(result => {
                    if (result.success) {
                        if (this.searchFields.length <= 0) {
                            this.searchFields = result.searchFields;
                        }

                        if (ln_tab_page_id == 1) {
                            this.mnDgFieldsData = result.dgFieldsData;
                            this.mnDgRowsData = result.dgRowData;
                        }
                        else {
                            this.dtDgFieldsData = result.dgFieldsData;
                            this.dtDgRowsData = result.dgRowData;
                        }

                        this.showDataGrid(ln_tab_page_id);
                    }
                    else {
                        console.error(result.errorMsg);
                    }

                });
            },
            showDataGrid(tab_page_id) {
                let ls_dgId;
                let la_dgFieldsData;
                let la_dgRowsData;
                if (tab_page_id == 1) {
                    ls_dgId = "PMS0110040_mnDg";
                    la_dgFieldsData = this.mnDgFieldsData;
                    la_dgRowsData = this.mnDgRowsData;
                }
                else {
                    ls_dgId = "PMS0110040_dtDg";
                    la_dgFieldsData = this.dtDgFieldsData;
                    la_dgRowsData = this.dtDgRowsData;
                }

                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init(this.prg_id, ls_dgId, DatagridFieldAdapter.combineFieldOption(la_dgFieldsData, ls_dgId), la_dgFieldsData, {
                    pagination: true,
                    rownumbers: true
                });
                this.dgIns.loadPageDgData(la_dgRowsData);
            },
            appendRow() {
                this.isEditStatus = false;
                this.isCreateStatus = true;
                this.editingRow = {ikey: ""};

                this.showSingleGridDialog();
            },
            editRow() {
                this.isLoading = true;
                this.isCreateStatus = false;
                this.isEditStatus = true;
                this.isModifiable = true;
                this.editingRow = {};

                let ls_dgName = this.activeName == 'mnDg' ? "PMS0110040_mnDg" : "PMS0110040_dtDg";
                let lo_editRow = $('#' + ls_dgName).datagrid('getSelected');
                if (!lo_editRow) {
                    alert(go_i18nLang["SystemCommon"].SelectData);
                }
                else {
                    this.editingRow = lo_editRow;
                    this.showSingleGridDialog();
                }
                this.isLoading = false;
            },
            browsRow() {
                this.isLoading = true;
                this.isCreateStatus = false;
                this.isEditStatus = true;
                this.isModifiable = false;
                this.editingRow = {};

                let ls_dgName = this.activeName == 'mnDg' ? "PMS0110040_mnDg" : "PMS0110040_dtDg";
                let lo_editRow = $('#' + ls_dgName).datagrid('getSelected');
                if (!lo_editRow) {
                    alert(go_i18nLang["SystemCommon"].SelectData);
                }
                else {
                    this.editingRow = lo_editRow;
                    this.showSingleGridDialog();
                }
                this.isLoading = false;
            },
            showSingleGridDialog() {
                let self = this;
                let dialog = $('#PMS0110041Lite').removeClass('hide').dialog({
                    autoOpen: false,
                    modal: true,
                    title: '訂房卡',
                    width: 1000,
                    maxHeight: 1920,
                    resizable: true,
                    onBeforeClose() {
                        let ln_fetchParam = this.activeName == 'dtDg' ? 2 : 1;
                        self.fetchDgFieldsRowDataByTabPageId(ln_fetchParam);
                        self.editingRow = {};
                        self.isEditStatus = false;
                        self.isCreateStatus = false;
                        self.$eventHub.$emit("clearData");
                    }
                });
                dialog.dialog('open');
            }
        }
    }

</script>

<style scoped>

</style>