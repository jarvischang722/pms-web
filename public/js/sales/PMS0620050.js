var gs_prgId = "PMS0620050";

/** DatagridRmSingleGridClass **/
function DatagridSingleGridClass() {
}

DatagridSingleGridClass.prototype = new DatagridBaseClass();

DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    //
};

DatagridSingleGridClass.prototype.doSaveColumnFields = function () {

};

/*** Class End  ***/

Vue.component('single-grid-pms0620050-tmp', {
    template: '#singleGridPMS0620050Tmp',
    props: ['rowData', 'isModifiable'],
    data: function () {
        return {
            singleData: {},
            oriSingleData: {},
            fieldsData: [],
            oriFieldsData: []
        };
    },
    watch: {
        rowData: function (val) {
            this.initData();
            this.fetchFieldData();
        }
    },
    methods: {
        initData: function () {
            this.singleData = {};
            this.oriSingleData = {};
            this.fieldsData = [];
            this.oriFieldsData = [];
        },
        fetchFieldData: function () {
            var self = this;
            $.post("/api/singleGridPageFieldQuery", {
                prg_id: gs_prgId,
                page_id: 2,
                singleRowData: self.rowData
            }, function (result) {
                if(result.success){
                    self.oriFieldsData = result.fieldData;
                    self.fieldsData =_.values(_.groupBy(_.sortBy(result.fieldData, "row_seq"), "row_seq"));
                    self.fetchRowData(self.rowData);
                }
            });
        },
        fetchRowData: function(editingRow){
            var self = this;
            editingRow = _.extend(editingRow, {prg_id: gs_prgId});

            $.post('/api/singlePageRowDataQuery', editingRow, function(result){
                if(result.success){
                    self.singleData = result.rowData;
                    self.oriSingleData = _.clone(result.rowData);
                }
                else {
                    console.error(result.errorMsg);
                }
            });
        },
        chkFieldRule: function (ui_field_name, rule_func_name) {
            if (rule_func_name === "" || !this.$parent.isModifiable) {
                return;
            }
            var self = this;
            var la_originData = [this.$parent.originData];
            var la_singleData = [this.rowData];
            var la_diff = _.difference(la_originData, la_singleData);

            // 判斷資料是否有異動
            if (la_diff.length != 0) {
                this.isUpdate = true;
            }

            if (!_.isEmpty(rule_func_name.trim())) {
                var postData = {
                    prg_id: "PMS0620020",
                    rule_func_name: rule_func_name,
                    validateField: ui_field_name,
                    singleRowData: this.rowData,
                    oriSingleData: vm.originData
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
                                                self.rowData = _.extend(self.rowData, result.effectValues);
                                            }

                                        }
                                    });
                                }
                            }
                        }

                    }
                    else {
                        alert(result.errorMsg);
                    }

                    //連動帶回的值
                    if (!_.isUndefined(result.effectValues) && _.size(result.effectValues) > 0) {
                        self.rowData = _.extend(self.rowData, result.effectValues);
                    }

                });
            }
        },
        showDropdownDisplayName: function (val, selectData) {
            if (_.findIndex(selectData, {value: val}) > -1) {
                return _.findWhere(selectData, {value: val}).display;
            }
            return val + ":";

        }
    }
});

var vm = new Vue({
    el: "#PMS0620050App",
    mounted: function () {
        this.fetchUserInfo();
        this.initTmpCUD();
        this.loadDataGridByPrgID();
    },
    data: {
        tmpCUD: {
            createData: [],
            updateData: [],
            deleteData: []
        },
        userInfo: {},
        pageOneDataGridRows: [],
        pageOneFieldData: [],
        searchCond: {},
        dgIns: {},
        isLoading: true,
        editingRow: {},
        isModifiable: true
    },
    methods: {
        fetchUserInfo: function () {
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    vm.userInfo = result.userInfo;
                }
            });
        },
        initTmpCUD: function () {
            this.tmpCUD = {
                createData: [],
                updateData: [],
                deleteData: []
            };
        },
        loadDataGridByPrgID: function () {

            $.post("/api/prgDataGridDataQuery", {prg_id: "PMS0620050"}, function (result) {
                vm.searchFields = result.searchFields;
                vm.pageOneDataGridRows = result.dataGridRows;
                vm.pageOneFieldData = result.fieldData;
                vm.showDataGrid();
            });
        },
        showDataGrid: function () {
            this.isLoading = false;
            vm.dgIns = new DatagridSingleGridClass();
            vm.dgIns.init(gs_prgId, "PMS0620050_dg", DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0620050_dg'), this.pageOneFieldData);
            vm.dgIns.loadDgData(this.pageOneDataGridRows);
        },
        editRow: function () {
            this.initTmpCUD();
            this.isLoading = true;
            this.editingRow = {};
            this.isModificable = true;

            var editRow = $('#PMS0620050_dg').datagrid('getSelected');

            if (!editRow) {
                alert(go_i18nLang["SystemCommon"].SelectData);
            }
            else {
                this.editingRow = editRow;
                this.showSingleGridDialog();
            }
        },
        showSingleGridDialog: function () {
            var dialog = $('#singleGridPMS0620050').removeClass('hide').dialog({
                autoOpen: false,
                modal: true,
                title: "修改拜訪記錄",
                width: 700,
                maxHeight: 1920,
                resizable: true
            }).dialog('open');
        }
    }
});