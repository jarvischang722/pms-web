import visitRecord from './visitRecord.vue';
import searchComp from '../../common/searchComp.vue';
import editSalesClerk from './editSalesClerk.vue';
import pms0610020 from './PMS0610020.vue';

Vue.prototype.$eventHub = new Vue();

var gs_prgId = "PMS0610010";

var vm = new Vue({
    el: "#PMS0610010App",
    created() {
        var self = this;
        this.$eventHub.$on('getChangeLogData', function (changeLogData) {
            self.openChangeLogDialog = changeLogData.openChangeLogDialog;
            self.allChangeLogList = changeLogData.allChangeLogList;
        });

        this.$eventHub.$on('doEditSalesClerk',function(editSalesClerkData) {
            self.isEditSalesClerk = editSalesClerkData.isEditSalesClerk;
            self.editRows = editSalesClerkData.editRows;
            self.doEditSalesClerk();
        });
    },
    mounted() {
        this.initTmpCUD();
        this.fetchUserInfo();
        this.setSearchCond();
        this.loadDataGridByPrgID();
    },
    components: {visitRecord, searchComp, editSalesClerk, pms0610020},
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
            isOnlySingleVisitRecord: false, //拜訪紀錄為新增多筆、單筆
            fetchDataParams: {}, //拜訪紀錄所需參數
            openChangeLogDialog: false,
            allChangeLogList: {}
        };
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
                beforePageText: '第',
                afterPageText: "頁,共{pages}頁",
                displayMsg: "顯示{from}到{to}筆資料, 共{total}筆資料"
            });
            this.isLoading = false;
        },
        appendRow() {
            this.isLoading = true;
            this.isCreateStatus = true;
            this.isEditStatus = false;
            this.isEditSalesClerk = false;
            this.isOnlySingleVisitRecord = false;
            this.editingRow = {};
            this.initTmpCUD();

            this.showSingleGridDialog();
            this.isLoading = false;
        },
        editRow() {
            this.isLoading = true;
            this.isCreateStatus = false;
            this.isEditStatus = true;
            this.isEditSalesClerk = false;
            this.isOnlySingleVisitRecord = false;
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
            }
            this.isLoading = false;
        },
        showSingleGridDialog() {
            var dialog = $('#PMS0610020').removeClass('hide').dialog({
                autoOpen: false,
                modal: true,
                title: go_i18nLang["program"]["PMS0610020"].compamy_maintain,
                width: 1000,
                maxHeight: 1920,
                resizable: true
            }).dialog('open');
        },
        doEditSalesClerk() {
            this.isLoading = true;
            var la_editRow = $('#PMS0610010_dg').datagrid('getSelections');

            if (la_editRow.length == 0) {
                alert(go_i18nLang["SystemCommon"].SelectData);
            }
            else {
                this.isEditSalesClerk = true;
                this.editRows = this.editRow.length == 0? la_editRow: this.editRows;
            }
            this.isLoading = false;
        },
        addVisitPlan() {
            var self = this;
            this.isLoading = true;
            var la_editRow = $('#PMS0610010_dg').datagrid('getSelections');

            if (la_editRow.length == 0) {
                alert(go_i18nLang["SystemCommon"].SelectData);
            }
            else {
                this.editRows = la_editRow;
                this.isCreateStatus = true;
                this.isEditStatus = false;
                this.isEditSalesClerk = false;
                this.isOnlySingleVisitRecord = false;

                this.setVisitRecordParams();

                var dialog = $("#visitRecord").removeClass('hide').dialog({
                    modal: true,
                    title: go_i18nLang["program"]["PMS0610010"].add_visit_plan,
                    title_html: true,
                    width: 1000,
                    maxwidth: 1920,
                    dialogClass: "test",
                    zIndex: 9999,
                    resizable: true,
                    onBeforeClose: function () {
                        self.editRows = [];
                        self.fetchDataParams = {};
                    }
                });
            }
            this.isLoading = false;
        }
    }
});