var vmHub = new Vue();
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
    created: function () {
        var self = this;
        vmHub.$on('doSaveModifyData', function (res) {
            if (vm.isOnlyClose) {
                self.doSaveModifyData(function (result) {
                    if (result) {
                        vm.isAction = true;
                        vm.editingRow = {};
                        vm.isLoading = true;
                        vm.initTmpCUD();
                        vm.loadDataGridByPrgID();
                    }
                });
            }
            else {
                vm.isAction = true;
                vm.editingRow = {};
                vm.isLoading = true;
                vm.initTmpCUD();
                vm.loadDataGridByPrgID();
            }
        });
    },
    mounted: function () {
        this.isLoadingDialog = true;
        this.loadingText = "Loading...";
    },
    watch: {
        rowData: function (val) {
            if (!_.isEmpty(val)) {
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

            }
            else if ($("#PMS0620050_dg").datagrid('getRowIndex', val) == vm.pageOneDataGridRows.length - 1) {
                //已經到最後一筆
                this.isFirstData = false;
                this.isLastData = true;
            }
            else {

                    this.isFirstData = false;
                    this.isLastData = false;
                }
            }
        },
        singleData: function (val) {
            if (!_.isEmpty(val)) {
                var ln_amtValue = _.clone(val['traffic_amt']);
                var lo_amtField = {};

                _.each(this.oriFieldsData, function (lo_field) {
                    if (lo_field.ui_field_name == 'traffic_amt') {
                        lo_amtField = lo_field;
                    }
                });

                this.formatAmt(ln_amtValue, lo_amtField);
            }
        }
    },
    methods: {
        initData: function () {
            this.isLoadingDialog = true;
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

            $.post('/api/singlePageRowDataQuery', editingRow, function (result) {
                if (result.success) {
                    self.singleData = result.rowData;
                    self.oriSingleData = _.clone(result.rowData);
                    self.singleData["avisit_dat"] = _.isNull(self.singleData["avisit_dat"]) ? "" : moment(new Date(self.singleData["avisit_dat"])).format("YYYY/MM/DD");
                    self.oriSingleData["avisit_dat"] = _.isNull(self.oriSingleData["avisit_dat"]) ? "" : moment(new Date(self.oriSingleData["avisit_dat"])).format("YYYY/MM/DD");
                } else {
                    console.error(result.errorMsg);
                }
                self.isLoadingDialog = false;
            });

            editingRow.visit_dat = moment(new Date(editingRow.visit_dat)).format("YYYY/MM/DD");
            editingRow.avisit_dat = moment(new Date(editingRow.avisit_dat)).format("YYYY/MM/DD");
            $.post("/api/fetchSinglePageFieldData", {
                prg_id: gs_prgId,
                page_id: 2,
                searchCond: editingRow
            }, function (result) {

            });
        },
        formatAmt: function (amtValue, field) {
            var ls_amtValue = _.clone(amtValue).toString();
            var ls_oriAmtValue = '';

            if (ls_amtValue.indexOf(',') > -1) {
                var la_splitAmtValue = ls_amtValue.split(',');
                _.each(la_splitAmtValue, function (ls_splitAmtValue) {
                    ls_oriAmtValue = ls_oriAmtValue + ls_splitAmtValue;
                });
            }
            else {
                ls_oriAmtValue = ls_amtValue;
            }

            ls_oriAmtValue = Number(ls_oriAmtValue);

            var patternValue = field.format_func_name;

            var patternLength = patternValue.indexOf('.') > -1 ?
                patternValue.slice(0, patternValue.indexOf('.')).length - 1 : patternValue.length - 1;

            //幾位小數
            var numberOfDecimals = patternValue.indexOf('.') > -1 ?
                patternValue.slice(patternValue.indexOf('.') + 1, patternValue.length).length : 0;
            //幾位數一個逗號
            var commaPosition = patternLength - patternValue.lastIndexOf(',');

            var reStr = '\\d(?=(\\d{' + (commaPosition || 3) + '})+' + (numberOfDecimals > 0 ? '\\.' : '$') + ')';

            ls_oriAmtValue = ls_oriAmtValue.toFixed(numberOfDecimals).toString().replace(new RegExp(reStr, 'g'), '$&,');

            this.singleData[field.ui_field_name] = ls_oriAmtValue;
        },
        chkClickPopUpGrid: function (field) {
            var self = this;
            if (field.ui_type == "popupgrid" || field.ui_type == "multipopupgrid") {
                var params = {
                    prg_id: "PMS0620050",
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
            var self = this;
            this.doSaveModifyData(function (res) {
                if (res) {
                    self.isFirstData = true;
                    self.isLastData = false;
                    self.isLoadingDialog = true;
                    self.rowData = _.first(vm.pageOneDataGridRows);
                }
            });
        },
        toPreData: function () {
            var self = this;
            this.doSaveModifyData(function (res) {
                if (res) {
                    self.isLoadingDialog = true;
                    var nowRowIndex = $("#PMS0620050_dg").datagrid('getRowIndex', self.rowData);
                    self.rowData = vm.pageOneDataGridRows[nowRowIndex - 1];
                }
            });
        },
        toNextData: function () {
            var self = this;
            this.doSaveModifyData(function (res) {
                if (res) {
                    self.isLoadingDialog = true;
                    var nowRowIndex = $("#PMS0620050_dg").datagrid('getRowIndex', self.rowData);
                    self.rowData = vm.pageOneDataGridRows[nowRowIndex + 1];
                }
            });
        },
        toLastData: function () {
            var self = this;
            this.doSaveModifyData(function (res) {
                if (res) {
                    self.isFirstData = false;
                    self.isLastData = true;
                    self.isLoadingDialog = true;
                    self.rowData = _.last(vm.pageOneDataGridRows);
                }
            });
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
                            alert(go_i18nLang["SystemCommon"].delSuccess);
                            vm.initTmpCUD();
                            vm.isOnlyClose = false;
                            self.doCloseDialog();
                        });

                    } else {
                        alert(result.errorMsg);
                    }
                });
            }
        },
        doSaveModifyData(callback) {
            var self = this;
            var lb_isDataChang = false;
            var lo_checkRowData = JSON.parse(JSON.stringify(this.singleData));

            //將欄位traffic_amt的值從有format轉回原本number
            var ls_trafficAmt = "";

            if (lo_checkRowData["traffic_amt"].indexOf(',') > -1) {
                var la_splitAmtValue = lo_checkRowData["traffic_amt"].split(',');
                _.each(la_splitAmtValue, function (ls_splitAmtValue) {
                    ls_trafficAmt = ls_trafficAmt + ls_splitAmtValue;
                });
            }
            else {
                ls_trafficAmt = lo_checkRowData["traffic_amt"];
            }

            lo_checkRowData["traffic_amt"] = Number(ls_trafficAmt);
            lo_checkRowData["avisit_dat"] = moment(new Date(lo_checkRowData["avisit_dat"])).format("YYYY/MM/DD");
            lo_checkRowData["visit_dat"] = moment(new Date(lo_checkRowData["visit_dat"])).format("YYYY/MM/DD");
            self.oriSingleData["avisit_dat"] = moment(new Date(self.oriSingleData["avisit_dat"])).format("YYYY/MM/DD");

            _.each(lo_checkRowData, function (val, key) {
                if (self.oriSingleData[key] != val) {
                    lb_isDataChang = true;
                    return;
                }
            });

            if (lb_isDataChang) {
                var q = confirm(go_i18nLang["SystemCommon"].Save_changed_data);

                if (q) {
                    this.isLoadingDialog = true;
                    this.loadingText = "Saving...";

                    var lo_chkResult = this.dataValidate();

                    if (lo_chkResult.success == false && vm.tmpCUD.deleteData.length == 0) {
                        alert(lo_chkResult.msg);
                        this.isLoadingDialog = false;
                    }
                    else {
                        lo_checkRowData["tab_page_id"] = 1;
                        lo_checkRowData["event_time"] = moment().format("YYYY/MM/DD HH:mm:ss");

                        vm.tmpCUD.updateData = [lo_checkRowData];
                        vm.tmpCUD.oriData = [this.oriSingleData];

                        var lo_params = {
                            prg_id: "PMS0620050",
                            page_id: 2,
                            tmpCUD: vm.tmpCUD
                        };

                        $.post("/api/doOperationSave", lo_params, function (result) {
                            if (result.success) {
                                alert(go_i18nLang["program"]["PMS0620020"].saveSuccess);
                            }
                            else {
                                alert(result.errorMsg);
                            }
                            self.isLoadingDialog = false;
                            vm.initTmpCUD();
                            callback(true);
                        });
                    }
                }
                else {
                    callback(true);
                }
            }
            else {
                callback(true);
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
                if (lo_field.format_func_name != "" && !_.isUndefined(go_validateClass[lo_field.format_func_name])) {
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
            }
            else {
                var postRowData = _.clone(this.singleData);

                //將欄位traffic_amt的值從有format轉回原本number
                var ls_trafficAmt = "";

                if (postRowData["traffic_amt"].indexOf(',') > -1) {
                    var la_splitAmtValue = postRowData["traffic_amt"].split(',');
                    _.each(la_splitAmtValue, function (ls_splitAmtValue) {
                        ls_trafficAmt = ls_trafficAmt + ls_splitAmtValue;
                    });
                }
                else {
                    ls_trafficAmt = postRowData["traffic_amt"];
                }

                postRowData["traffic_amt"] = Number(ls_trafficAmt);
                postRowData["avisit_dat"] = moment(new Date(postRowData["avisit_dat"])).format("YYYY/MM/DD");
                postRowData["visit_dat"] = moment(new Date(postRowData["visit_dat"])).format("YYYY/MM/DD");
                postRowData["tab_page_id"] = 1;
                postRowData["event_time"] = moment().format("YYYY/MM/DD HH:mm:ss");

                vm.tmpCUD.updateData = [postRowData];
                vm.tmpCUD.oriData = [this.oriSingleData];

                vm.doSaveCUD("PMS0620050", 2, function (result) {
                    if (result.success) {
                        alert(go_i18nLang["program"]["PMS0620020"].saveSuccess);
                        vm.isOnlyClose = false;
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
            var self = this;
            $("#singleGridPMS0620050").dialog('close');
            vm.isOnlyClose = true;
        }
    }
});

var vm = new Vue({
    el: "#PMS0620050App",
    components: {
        "search-comp": go_searchComp
    },
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
            visit_sta: [],
            visit_typ: "",
            visit_dat: "",
            avisit_dat: "",
            purport_rmk: "",
            remark: ""
        },
        dgIns: {},
        isLoading: true,
        editingRow: {},
        isModifiable: true,
        isAction: false,
        isOnlyClose: true
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
            var lo_searchCond = _.clone(this.searchCond);

            lo_searchCond["avisit_dat"] = lo_searchCond["avisit_dat"] == "" || _.isUndefined(lo_searchCond["avisit_dat"]) ? "" :
                moment(new Date(lo_searchCond["avisit_dat"])).format("YYYY/MM/DD");
            lo_searchCond["visit_dat"] = lo_searchCond["visit_dat"] == "" || _.isUndefined(lo_searchCond["visit_dat"]) ? "" :
                moment(new Date(lo_searchCond["visit_dat"])).format("YYYY/MM/DD");
            if (this.searchFields.length != 0) {
                if (lo_searchCond["area_cod"].length != 0) {
                    let la_options = [];
                    let la_areaCodVal = _.clone(lo_searchCond["area_cod"]);
                    lo_searchCond["area_cod"] = [];

                    _.each(this.searchFields, function (lo_searchField) {
                        if (lo_searchField.ui_field_name == 'area_cod') {
                            la_options = lo_searchField.selectData;
                        }
                    });

                    _.each(la_areaCodVal, function (ls_value) {
                        var lo_selectData = _.findWhere(la_options, {id: ls_value});
                        if (_.isUndefined(lo_selectData)) {
                            searchOptions(la_options, ls_value, lo_searchCond["area_cod"]);
                        }
                        else if (_.isUndefined(lo_selectData.value)) {
                            searchValue(lo_selectData.children, lo_searchCond["area_cod"]);
                        }
                        else {
                            lo_searchCond["area_cod"].push(lo_selectData.value);
                        }
                    });
                }
            }

            var lo_params = {
                prg_id: "PMS0620050",
                searchCond: lo_searchCond,
                pag_id: 1
            };

            $.post("/api/fetchDataGridFieldData", lo_params, function (result) {
                vm.searchFields = result.searchFields;
                vm.pageOneDataGridRows = result.dgRowData;
                vm.pageOneFieldData = result.dgFieldsData;
                vm.showDataGrid();
            });
        },
        showDataGrid: function () {
            this.isLoading = false;
            this.dgIns = new DatagridSingleGridClass();
            this.dgIns.init(gs_prgId, "PMS0620050_dg", DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0620050_dg'), this.pageOneFieldData);
            this.dgIns.loadDgData(this.pageOneDataGridRows);
            this.isAction = false;
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

            this.isLoading = false;
        },
        showSingleGridDialog: function () {
            var self = this;
            var dialog = $('#singleGridPMS0620050').removeClass('hide').dialog({
                autoOpen: false,
                modal: true,
                title: go_i18nLang["program"]["PMS0620050"].edit_vist_mn,
                width: 700,
                maxHeight: 1920,
                resizable: true,
                onBeforeClose: function () {
                    vmHub.$emit('doSaveModifyData');
                }
            }).dialog('open');
            this.isLoading = false;
        },
        doSaveCUD: function (prg_id, page_id, callback) {
            var lo_params = {
                prg_id: prg_id,
                page_id: page_id,
                tmpCUD: this.tmpCUD
            };

            $.post("/api/doOperationSave", lo_params, function (result) {
                callback(result);
            });
        }
    }
});

function searchValue(la_children, ls_selectData) {
    _.each(la_children, function (lo_children) {
        if (_.isUndefined(lo_children.value)) {
            searchValue(lo_children.children, ls_selectData);
        }
        else {
            ls_selectData.push(lo_children.value);
            return;
        }
    });
}

function searchOptions(la_options, ls_value, la_selectData) {
    _.each(la_options, function (lo_option) {
        var lo_childrenOptions = _.findWhere(lo_option.children, {id: ls_value});
        if (_.isUndefined(lo_childrenOptions)) {
            searchOptions(lo_option.children, ls_value, la_selectData);
        }
        else if (_.isUndefined(lo_childrenOptions.value)) {
            searchValue(lo_childrenOptions.children, la_selectData);
        }
        else {
            la_selectData.push(lo_childrenOptions.value);
            return;
        }
    });
}