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
DatagridSingleGridClass.prototype.doSaveColumnFields = function () {

};
/*** Class End  ***/

/**
 * 商務公司維護
 */
Vue.component('single-grid-pms0610010-tmp', {
    template: "#singleGridPMS0610010Tmp",
    props: ["rowData", "isCreateStatus", "isEditStatus", "isModifiable"],
    data: function () {
        return {
            tabPageId: 1,
            tabName: "",
            panelName: [],
            dtDgIns: {},
            singleData: {},
            oriSingleData: {},
            mnFieldsData: [],
            oriMnFieldsData: [],
            dtRowData: [],
            oriDtRowData: [],
            dtFieldsData: [],
            oriDtFieldsData: [],
            loadingText: "",
            isLoadingDialog: false,
            BTN_action: false
        };
    },
    mounted: function () {
        this.tabName = "set";
        this.panelName = ["setPanel", "personnelPanel", "salesPanel", "contractPanel",
            "visitPanel", "businessPanel", "historicalPanel", "contributionPanel"];

        this.isLoadingDialog = true;
        this.loadingText = "Loading...";
    },
    watch: {
        tabName: function (val) {
            this.getTabPageId(val);
            this.setTabContent();
            this.showTabContent(val);
        },
        rowData: function (val) {
            this.initData();
            // this.fetchFieldData();
        }
    },
    methods: {
        initData: function () {
            this.singleData = {};
            this.oriSingleData = {};
            this.mnFieldsData = [];
            this.oriMnFieldsData = [];
            this.dtRowData = [];
            this.oriDtRowData = [];
            this.dtFieldsData = [];
            this.oriDtFieldsData = [];
        },
        fetchFieldData: function () {
            var self = this;
            $.post("", {prg_id: gs_prgId, page_id: 2}, function (result) {
                if (result.success) {
                    // self.oriMnFieldsData = result.fieldData;
                    // self.mnFieldsData = _.values(_.groupBy(_.sortBy(result.fieldData, "row_seq"), "row_seq"));
                    self.fetchRowData(self.rowData);
                }
            });
        },
        fetchRowData: function (editingRow) {
            var self = this;
            $.post("", {prg_id: gs_prgId, page_id: 2, searchCond: editingRow}, function (result) {
                if (result.success) {
                    self.singleData = result.rowData;
                    self.oriSingleData = _.clone(result.rowData);
                }
                else {
                    console.error(result.errorMsg);
                }
            });
        },
        chkClickPopUpGrid: function (field) {
            var self = this;
            if (field.ui_type == "popupgrid" || field.ui_type == "multipopupgrid") {
                var params = {
                    prg_id: gs_prgId,
                    fields: field
                };

                $.post("/api/popUpGridData", params, function (result) {
                    if (result != null) {
                        self.selectPopUpGridData = result.showDataGrid;
                        result.fieldData = field;
                        vmHub.$emit('showPopUpDataGrid', result);
                        self.showPopUpGridDialog();
                    }
                });
            }
        },
        chkFieldRule: function (ui_field_name, rule_func_name) {
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
                    prg_id: gs_prgId,
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
        showDropdownDisplayName: function (val, selectData) {
            if (_.findIndex(selectData, {value: val}) > -1) {
                return _.findWhere(selectData, {value: val}).display;
            }
            return val + ":";

        },
        doChangeTab: function (tab, event) {
            this.tabName = tab.name;
        },
        getTabPageId: function (tabName) {
            var self = this;
            switch (tabName) {
                case 'set':
                    self.tabPageId = 1;
                    break;
                case 'personnel':
                    self.tabPageId = 2;
                    break;
                case 'sales':
                    self.tabPageId = 3;
                    break;
                case 'contract':
                    self.tabPageId = 4;
                    break;
                case 'visit':
                    self.tabPageId = 5;
                    break;
                case 'business':
                    self.tabPageId = 6;
                    break;
                case 'historical':
                    self.tabPageId = 7;
                    break;
                case 'contribution':
                    self.tabPageId = 8;
                    break;
                default:
                    console.error("tab name is not defined");
                    break;
            }
        },
        setTabContent: function () {
            var self = this;
            var ln_tabPageId = this.tabPageId;

            // $.post("", {prg_id: gs_prgId, page_id: 2, tab_page_id: ln_tabPageId}, function (result) {
            //     if (result.success) {
            //         self.dtRowData = result.rowData;
            //         self.oriDtRowData = _.clone(result.rowData);
            //     }
            // });
        },
        showTabContent: function (tabName) {
            var la_panelName = this.panelName;
            var ls_showPanelName = tabName + "Panel";
            _.each(la_panelName, function (ls_panelName) {
                $("#" + ls_panelName).hide();
            });

            $("#" + ls_showPanelName).show();

            // this.showDtDataGrid();
        },
        showDtDataGrid: function (tabName) {
            var ls_dgName = tabName + "Dt_dg";

            this.dtDgIns = new DatagridBaseClass();
            this.dgHoatelDt.init(gs_prgId, ls_dgName, DatagridFieldAdapter.combineFieldOption(this.dtFieldsData, ls_dgName), this.dtFieldsData);
            this.dgHoatelDt.loadDgData(this.dtRowData);
            this.dgHoatelDt.getOriDtRowData(this.oriDtRowData);
        }
    }
});


var vm = new Vue({
    el: "#PMS0610010App",
    mounted: function () {
        this.initTmpCUD();
        this.fetchUserInfo();
        this.setSearchCond();
        this.loadDataGridByPrgID();
    },
    components: {
        "sales-edit-clerk-comp": go_salesEditClerkComp,
        "sales-edit-visit-record": go_salesVisitRecord,
        "search-comp": go_searchComp
    },
    data: {
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
        isOnlySingleGrid: false
    },
    methods: {
        initTmpCUD: function () {
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
        fetchUserInfo: function () {
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    vm.userInfo = result.userInfo;
                }
            });
        },
        setSearchCond: function () {
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
        loadDataGridByPrgID: function () {
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
        showDataGrid: function () {
            var self = this;
            this.isLoading = false;

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
        },
        appendRow: function () {
            this.isLoading = true;
            this.isCreateStatus = true;
            this.isEditStatus = false;
            this.editingRow = {};
            this.initTmpCUD();

            this.showSingleGridDialog();
        },
        editRow: function () {
            this.isLoading = true;
            this.isCreateStatus = false;
            this.isEditStatus = true;
            this.editingRow = {};
            this.initTmpCUD();

            var lo_editRow = $('#PMS0610010_dg').datagrid('getSelected');

            if (!lo_editRow) {
                alert(go_i18nLang["SystemCommon"].selectData);
            }
            else {
                this.editingRow = lo_editRow;
                this.showSingleGridDialog();
            }
        },
        showSingleGridDialog: function () {
            var dialog = $('#singleGridPMS0610010').removeClass('hide').dialog({
                autoOpen: false,
                modal: true,
                title: go_i18nLang["program"]["PMS0610010"].compamy_maintain,
                width: 1000,
                maxHeight: 1920,
                resizable: true
            }).dialog('open');
        },
        editSalesClerk: function () {
            // var la_editRow = $('#PMS0610010_dg').datagrid('getSelected');

            var la_editRow = [1];//測試用

            if (la_editRow.length == 0) {
                alert(go_i18nLang["SystemCommon"].SelectData);
            }
            else {
                this.editRows = la_editRow;
                var dialog = $("#salesEditClerk").removeClass('hide').dialog({
                    modal: true,
                    title: "修改業務員",
                    title_html: true,
                    width: 500,
                    maxwidth: 1920,
                    // autoOpen: true,
                    dialogClass: "test",
                    resizable: true
                });
            }

        },
        editVistPlan: function () {
            // var la_editRow = $('#PMS0610010_dg').datagrid('getSelected');

            var la_editRow = [1];//測試用

            if (la_editRow.length == 0) {
                alert(go_i18nLang["SystemCommon"].SelectData);
            }
            else {
                this.editRows = la_editRow;
                var dialog = $("#salesVisitRecord").removeClass('hide').dialog({
                    modal: true,
                    title: "新增拜訪記錄",
                    title_html: true,
                    width: 1000,
                    maxwidth: 1920,
                    // autoOpen: true,
                    dialogClass: "test",
                    resizable: true
                });
            }
        }
    }
});