var gs_prgId = "PMS0610010";

DatagridSingleGridClass.prototype = new DatagridBaseClass();

DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    //
};
DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {

};

var vm = new Vue({
    el: "#PMS0610010App",
    mounted: function () {
        this.initTmpCUD();
        this.fetchUserInfo();
        this.loadDataGridByPrgID();
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
        isModifiable: true,
        isCreateStatus: false,
        isEditStatus: false
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

            $.post("//api/fetchDataGridFieldData", lo_params, function (result) {
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
        },
        editRow: function () {
        },
        converToFiles: function () {
        },
        editSales: function () {
        },
        editVistPlan: function () {
        }
    }
});