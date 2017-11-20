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
            oriFieldsData: [],
            isFirstData: false,
            isLastData: false,
            BTN_action: false,
            isLoadingDialog: false,
            loadingText: ""
        };
    },
    mounted: function () {
        this.isLoadingDialog = true;
        this.loadingText = "Loading...";
    },
    watch: {
        rowData: function (val) {
            this.initData();
            this.fetchFieldData();

            var nowDatagridRowIndex = $("#PMS0620050_dg").datagrid('getRowIndex', val);

            $("#PMS0620050_dg").datagrid('selectRow', nowDatagridRowIndex);

            if ($("#PMS0620050_dg").datagrid('getRowIndex', val) == 0) {
                //已經到第一筆
                this.isFirstData = true;
                this.isLastData = false;
                if ($("#PMS0620050_dg").datagrid('getRowIndex', val) == vm.pageOneDataGridRows.length - 1) {
                    this.isLastData = true;
                }

            } else if ($("#PMS0620050_dg").datagrid('getRowIndex', val) == vm.pageOneDataGridRows.length - 1) {
                //已經到最後一筆
                this.isFirstData = false;
                this.isLastData = true;
            } else {

                this.isFirstData = false;
                this.isLastData = false;
            }
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
                if (result.success) {
                    self.oriFieldsData = result.fieldData;
                    self.fieldsData = _.values(_.groupBy(_.sortBy(result.fieldData, "row_seq"), "row_seq"));
                    self.fetchRowData(self.rowData);
                }
            });
        },
        fetchRowData: function (editingRow) {
            var self = this;
            editingRow = _.extend(editingRow, {prg_id: gs_prgId});
            this.isLoadingDialog = false;

            $.post('/api/singlePageRowDataQuery', editingRow, function (result) {
                if (result.success) {
                    self.singleData = result.rowData;
                    self.oriSingleData = _.clone(result.rowData);
                } else {
                    console.error(result.errorMsg);
                }
            });
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
                    prg_id: "PMS0620050",
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
        toFirstData: function () {
            this.isFirstData = true;
            this.isLastData = false;
            this.rowData = _.first(vm.pageOneDataGridRows);
        },
        toPreData: function () {
            var nowRowIndex = $("#PMS0620050_dg").datagrid('getRowIndex', this.rowData);
            this.rowData = vm.pageOneDataGridRows[nowRowIndex - 1];
        },
        toNextData: function () {
            var nowRowIndex = $("#PMS0620050_dg").datagrid('getRowIndex', this.rowData);
            this.rowData = vm.pageOneDataGridRows[nowRowIndex + 1];
        },
        toLastData: function () {
            this.isFirstData = false;
            this.isLastData = true;
            this.rowData = _.last(vm.pageOneDataGridRows);
        },
        doDelGrid: function () {
            var self = this;
            var q = confirm(go_i18nLang["SystemCommon"].check_delete);
            if (q) {
                //刪除前檢查
                $.post("/api/deleteFuncRule", {
                    page_id: 2,
                    prg_id: gs_prgId,
                    deleteData: [self.singleData]
                }, function (result) {
                    if (result.success) {
                        vm.tmpCUD.deleteData = [self.singleData];
                        vm.tmpCUD.oriData = [self.oriSingleData];
                        vm.doSaveCUD("PMS0620050", 1, function (result) {
                            vm.initTmpCUD();
                            self.doCloseDialog();
                        });

                    } else {
                        alert(result.errorMsg);
                    }
                });
            }
        },
        dataValidate: function () {
            var self = this;
            var lo_checkResult;

            // 單筆資料檢查
            for (var i = 0; i < this.oriFieldsData.length; i++) {
                var lo_field = this.oriFieldsData[i];
                //必填
                if (lo_field.requirable == "Y" && lo_field.modificable != "N" && lo_field.ui_type != "checkbox") {
                    lo_checkResult = go_validateClass.required(self.singleData[lo_field.ui_field_name], lo_field.ui_display_name);
                    if (lo_checkResult.success == false) {
                        break;
                    }
                }

                //有format
                if (lo_field.format_func_name != "") {
                    lo_checkResult = go_validateClass[lo_field.format_func_name](self.singleData[lo_field.ui_field_name], lo_field.ui_display_name);
                    if (lo_checkResult.success == false) {
                        break;
                    }
                }

            }

            return lo_checkResult;
        },
        doSaveGrid: function () {
            var self = this;
            this.isLoadingDialog = true;
            this.loadingText = "Saving...";

            var lo_chkResult = this.dataValidate();

            if (lo_chkResult.success == false && vm.tmpCUD.deleteData.length == 0) {
                alert(lo_chkResult.msg);
                this.isLoadingDialog = false;
            } else {
                var postRowData = _.clone(this.singleData);

                postRowData["avisit_dat"] = moment(new Date(postRowData["avisit_dat"])).format("YYYY/MM/DD");
                postRowData["visit_dat"] = moment(new Date(postRowData["visit_dat"])).format("YYYY/MM/DD");
                postRowData["tab_page_id"] = 1;
                postRowData["event_time"] = moment().format("YYYY/MM/DD HH:mm:ss");

                vm.tmpCUD.updateData = [postRowData];
                vm.tmpCUD.oriData = [this.oriSingleData];

                vm.doSaveCUD("PMS0620050", 2, function (result) {
                    if (result.success) {
                        alert(go_i18nLang["program"]["PMS0620020"].saveSuccess);
                        self.doCloseDialog();
                    }
                    else {
                        alert(result.errorMsg);
                    }
                    self.isLoadingDialog = false;
                    vm.initTmpCUD();
                });
            }
        },
        doCloseDialog: function () {
            vm.initTmpCUD();
            vm.editingRow = {};
            $("#singleGridPMS0620050").dialog('close');
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
            deleteData: [],
            oriData: []
        },
        userInfo: {},
        pageOneDataGridRows: [],
        pageOneFieldData: [],
        searchFields: [],
        searchCond: {
            show_cod: "",
            cust_nam: "",
            status_cos: "",
            type_cod: [],
            contract_sta: [],
            sales_cod: [],
            business_cod: [],
            area_cod: [],
            visit_sta: "",
            visit_typ: "",
            visit_dat: "",
            avisit_dat: "",
            purport_rmk: "",
            remark: ""
        },
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
                deleteData: [],
                oriData: []
            };
        },
        loadDataGridByPrgID: function () {
            var lo_searchCond =_.clone(this.searchCond);

            delete lo_searchCond["business_rmk"];
            delete lo_searchCond["cust_nam"];
            delete lo_searchCond["sales_nam"];

            lo_searchCond["avisit_dat"] = (lo_searchCond["avisit_dat"] == "")? "" :
                moment(new Date(lo_searchCond["avisit_dat"])).format("YYYY/MM/DD");
            lo_searchCond["visit_dat"] = (lo_searchCond["visit_dat"] == "")? "" :
                moment(new Date(lo_searchCond["visit_dat"])).format("YYYY/MM/DD");
            lo_searchCond["area_cod"] = (lo_searchCond["area_cod"] == "")? "" :
                lo_searchCond["area_cod"][lo_searchCond["area_cod"].length -1];

            lo_searchCond = _.pick(lo_searchCond, function(val){
                return val != "";
            });

            var lo_params = {
                prg_id: "PMS0620050",
                serchCod: lo_searchCond,
                pag_id: 1
            };

            $.post("/api/fetchDataGridFieldData",lo_params, function (result) {
                vm.searchFields = result.searchFields;
                vm.pageOneDataGridRows = result.dgRowData;
                vm.pageOneFieldData = result.dgFieldsData;
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
            } else {
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
        },
        doSaveCUD: function (prg_id, page_id, callback) {
            var self = this;
            var lo_params = {
                prg_id: prg_id,
                page_id: page_id,
                tmpCUD: this.tmpCUD
            };

            $.post("/api/doOperationSave", lo_params, function (result) {
                self.loadDataGridByPrgID();
                callback(result);
            });
        }
    },
    components: {
        "search-comp": go_searchComp
    }
});