var gs_prgId = "PMS0610010";

/** DatagridRmSingleGridClass **/
function DatagridSingleGridClass() {
}

DatagridSingleGridClass.prototype = new DatagridBaseClass();

DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
};
DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
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
            gs_active: "",
            tabName: "",
            panelName: []
        };
    },
    mounted: function () {
        this.tabName = "set";
        this.panelName = ["setPanel", "personnelPanel", "salesPanel", "contractPanel",
            "visitPanel", "businessPanel", "historicalPanel", "contributionPanel"];
    },
    watch: {
        tabName: function (val) {
            this.setTabShow(val);
        }
    },
    methods: {
        doChangeTab: function (tab, event) {
            this.tabName = tab.name;
        },
        setTabShow: function (tabName) {
            var la_panelName = this.panelName;
            var ls_showPanelName = tabName + "Panel";
            _.each(la_panelName, function (ls_panelName) {
                $("#" + ls_panelName).hide();
            });

            $("#" + ls_showPanelName).show();
        }
    }
});


var vm = new Vue({
    el: "#PMS0610010App",
    mounted: function () {
        this.initTmpCUD();
        this.fetchUserInfo();
        // this.loadDataGridByPrgID();
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
            this.isLoading = false;

            var colOption = [{field: 'ck', checkbox: true}];
            colOption = _.union(colOption, DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0610010_dg'));
            this.dgIns = new DatagridSingleGridClass();
            this.dgIns.init(gs_prgId, "PMS0610010_dg", colOption, this.pageOneFieldData, {
                singleSelect: false
            });
            vm.dgIns.loadDgData(this.pageOneDataGridRows);
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