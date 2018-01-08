import visitPlan from './visitPlan.vue';
import searchComp from '../../common/searchComp.vue';
import editSalesClerk from './editSalesClerk.vue';
import pms0610020 from './PMS0610020.vue';

Vue.prototype.$eventHub = new Vue();

var gs_prgId = "PMS0610010";
var vmHub = new Vue();

// var go_funcPurview = (new FuncPurview(gs_prgId)).getFuncPurvs();

var vm = new Vue({
    el: "#PMS0610010App",
    created() {
        var self = this;

        vmHub.$on("doUnLock", function () {
            self.doRowUnLock();
        });
        //change log dialog
        this.$eventHub.$on('getChangeLogData', function (changeLogData) {
            self.openChangeLogDialog = changeLogData.openChangeLogDialog;
            self.allChangeLogList = changeLogData.allChangeLogList;
        });
        //業務員指派dialog
        this.$eventHub.$on('doEditSalesClerk', function (editSalesClerkData) {
            self.isEditSalesClerk = editSalesClerkData.isEditSalesClerk;
            self.editRows = editSalesClerkData.editRows;
            self.isEditStatus = editSalesClerkData.isEditStatus;
            self.isCreateStatus = editSalesClerkData.isCreateStatus;
            self.doEditSalesClerk();
        });
        this.$eventHub.$on('doCloseEditSalesClerk', function (editSalesClerkData) {
            self.isEditSalesClerk = editSalesClerkData.isEditSalesClerk;
            self.isEditStatus = editSalesClerkData.isEditStatus;
            self.isCreateStatus = editSalesClerkData.isCreateStatus;
            self.isLoading = false;
            self.editRows = [];
        });
        //status chg. dialog
        this.$eventHub.$on('getCompanyStatusData', function (companyStatusData) {
            self.isOpenCompanyStatus = companyStatusData.openCompanyStatus;
        });
        //合約狀態變更 dialog
        this.$eventHub.$on('getContractStatusData', function (contractStatusData) {
            self.isOpenContractStatus = contractStatusData.openContractStatus;
        });
    },
    mounted() {
        this.initTmpCUD();
        this.fetchUserInfo();
        this.setSearchCond();
        this.loadDataGridByPrgID();
    },
    components: {visitPlan, searchComp, editSalesClerk, pms0610020},
    data() {
        return {
            userInfo: {},
            tmpCUD: {
                createData: [],
                updateData: [],
                deleteData: [],
                oriData: [],
                dt_createData: [],
                dt_updateData: [],
                dt_deleteData: [],
                dt_oriData: []
            },
            pageOneDataGridRows: [],
            pageOneFieldData: [],
            searchFields: [],
            searchCond: {},
            dgIns: {},
            isLoading: true,
            editingRow: {},
            editRows: [],
            isModifiable: true,
            isCreateStatus: false,
            isEditStatus: false,
            isEditSalesClerk: false,
            isOpenCompanyStatus: false,
            isOpenContractStatus: false,
            isVisitPlan: false, //拜訪紀錄為新增多筆、單筆
            fetchDataParams: {}, //拜訪紀錄所需參數
            openChangeLogDialog: false,
            allChangeLogList: {}
        };
    },
    watch: {
        openChangeLogDialog(val) {
            if (!val) {
                this.$eventHub.$emit('getCloseChangeLogData', {isOpenChangeLog: val});
            }
        }
    },
    methods: {
        initTmpCUD() {
            this.tmpCUD = {
                createData: [],
                updateData: [],
                deleteData: [],
                oriData: [],
                dt_createData: [],
                dt_updateData: [],
                dt_deleteData: [],
                dt_oriData: []
            };
        },
        fetchUserInfo() {
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    vm.userInfo = result.userInfo;
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
        loadDataGridByPrgID() {
            var lo_searchCond = _.clone(this.searchCond);

            var lo_params = {
                prg_id: gs_prgId,
                page_id: 1,
                searchCond: lo_searchCond
            };

            $.post("/api/fetchDataGridFieldData", lo_params, function (result) {
                vm.searchFields = result.searchFields;
                vm.pageOneFieldData = result.dgFieldsData;
                vm.pageOneDataGridRows = result.dgRowData;
                vm.showDataGrid();
            });
        },
        setVisitRecordParams() {
            this.fetchDataParams = {
                settingGrid: {
                    prg_id: "PMS0610010",
                    page_id: 1020
                },
                dataGrid: {
                    prg_id: "PMS0610010",
                    page_id: 1020
                },
                singleGrid: {
                    prg_id: "PMS0620050",
                    page_id: 2
                }
            };
        },
        showDataGrid() {
            var self = this;

            var colOption = [{field: 'ck', checkbox: true}];
            colOption = _.union(colOption, DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0610010_dg'));

            //一開始只載入10筆資料
            var la_showDataRows = this.pageOneDataGridRows.slice(0, 10);

            $('#PMS0610010_dg').datagrid({
                fitColumns: "true",
                columns: [colOption],
                pagination: true,
                rownumbers: true,
                pageSize: 10,
                data: la_showDataRows
            });

            var pager = $('#PMS0610010_dg').datagrid('getPager');
            pager.pagination({
                total: self.pageOneDataGridRows.length,
                onSelectPage: function (pageNo, pageSize) {
                    var start = (pageNo - 1) * pageSize;
                    var end = start + pageSize;
                    $("#PMS0610010_dg").datagrid("loadData", self.pageOneDataGridRows.slice(start, end));
                    pager.pagination('refresh', {
                        total: self.pageOneDataGridRows.length,
                        pageNumber: pageNo
                    });
                },
                pageNumber: 1,
                pageList: [10, 20, 50],
                showPageList: true,
                beforePageText: go_i18nLang.SystemCommon.dataGridBeforePageText,
                afterPageText: go_i18nLang.SystemCommon.dataGridAfterPageText,
                displayMsg: go_i18nLang.SystemCommon.dataGridDisplayMsg
            });
            this.isLoading = false;
        },
        appendRow() {
            this.isLoading = true;
            this.isCreateStatus = true;
            this.isEditStatus = false;
            this.isEditSalesClerk = false;
            this.isVisitPlan = false;
            this.editingRow = {cust_mn_cust_cod: ""};
            this.initTmpCUD();

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
            this.editingRow = {};
            this.initTmpCUD();

            var lo_editRow = $('#PMS0610010_dg').datagrid('getSelected');
            var la_editRows = $('#PMS0610010_dg').datagrid('getSelections');

            if (!lo_editRow) {
                alert(go_i18nLang["SystemCommon"].SelectOneData);
            }
            else if (la_editRows.length > 1 || lo_editRow != la_editRows[0]) {
                alert(go_i18nLang["SystemCommon"].SelectOneData);
            }
            else {
                this.editingRow = lo_editRow;
                this.showSingleGridDialog();
                // this.doRowLock(lo_editRow.cust_mn_cust_cod, function(result){
                //     self.showSingleGridDialog();
                // });
            }
            this.isLoading = false;
        },
        showSingleGridDialog() {
            var self = this;

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
                    // self.doRowUnLock();
                }
            }).dialog('open');
        },
        //單筆 ststus chg.(公司狀態)
        doSaveCompanyStatus() {
            this.isOpenCompanyStatus = false;
        },
        doCloseCompanyStatusDialog() {
            this.isOpenCompanyStatus = false;
        },
        //單筆 合約狀態變更
        doSaveContractStatus() {
            this.isOpenContractStatus = false;
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
});

//關掉瀏覽器時unlock
$(window).on('beforeunload', function () {
    return vmHub.$emit("doUnLock");
});