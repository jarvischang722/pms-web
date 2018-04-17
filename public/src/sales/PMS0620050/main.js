let vmHub = new Vue();
let gs_prgId = "PMS0620050";

let go_funcPurview = (new FuncPurview(gs_prgId)).getFuncPurvs();

/** DatagridRmSingleGridClass **/
function DatagridSingleGridClass() {
}

DatagridSingleGridClass.prototype = new DatagridBaseClass();
DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    //
};
DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
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
            isSaveEnable: false,
            isDelEnable: false,
            isLoadingDialog: false,
            loadingText: ""
        };
    },
    created: function () {
        let self = this;
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
        this.initPurview();
    },
    mounted: function () {
        this.isLoadingDialog = true;
        this.loadingText = "Loading...";
    },
    watch: {
        rowData: function (val) {
            if (!_.isEmpty(val)) {
                this.loadingText = "Loading...";
                this.initData();
                this.fetchFieldData();

                let nowDatagridRowIndex = $("#PMS0620050_dg").datagrid('getRowIndex', val);

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
        singleData: {
            handler(val, oldVal) {
                if (!_.isEmpty(val)) {
                    let ln_amtValue = _.clone(val['traffic_amt']);
                    let lo_amtField = _.findWhere(this.oriFieldsData, {ui_field_name: 'traffic_amt'});
                    this.formatAmt(ln_amtValue, lo_amtField);
                }
            },
            deep: true
        },
        isSaveEnable: function (val) {
            let purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "0500";
            });
            if (purview == -1) {
                this.isSaveEnable = true;
            }
        },
        isDelEnable: function (val) {
            let purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "0300";
            });
            if (purview == -1) {
                this.isDelEnable = true;
            }
        }
    },
    methods: {
        initPurview: function () {
            let purview;
            purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "0500";
            });
            if (purview == -1) {
                this.isSaveEnable = true;
            }

            purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "0300";
            });
            if (purview == -1) {
                this.isDelEnable = true;
            }
        },
        initData: function () {
            this.isLoadingDialog = true;
            this.singleData = {};
            this.oriSingleData = {};
            this.fieldsData = [];
            this.oriFieldsData = [];
        },
        fetchFieldData: function () {
            let self = this;
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
            let self = this;
            editingRow = _.extend(editingRow, {prg_id: gs_prgId});

            $.post('/api/singlePageRowDataQuery', editingRow, function (result) {
                if (result.success) {
                    result.rowData["avisit_dat"] = _.isNull(self.singleData["avisit_dat"]) ? "" : moment(new Date(self.singleData["avisit_dat"])).format("YYYY/MM/DD");
                    result.rowData["remark"] = _.isNull(result.rowData["remark"]) ? "" : result.rowData["remark"];
                    self.singleData = result.rowData;
                    self.oriSingleData = _.clone(result.rowData);
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
            let lb_isModify = true;
            let ls_amtValue = _.isUndefined(amtValue) ? '' : _.clone(amtValue).toString();
            let ls_oriAmtValue = '';

            if (ls_amtValue.indexOf(',') > -1) {
                let la_splitAmtValue = ls_amtValue.split(',');
                _.each(la_splitAmtValue, function (ls_splitAmtValue) {
                    ls_oriAmtValue = ls_oriAmtValue + ls_splitAmtValue;
                });
            }
            else {
                ls_oriAmtValue = ls_amtValue;
            }

            let la_amtValue = ls_oriAmtValue.split("");

            for (let i = 0; i < la_amtValue.length; i++) {
                if (ls_oriAmtValue.charCodeAt(i) < 48 || ls_oriAmtValue.charCodeAt(i) > 57) {
                    lb_isModify = false;
                    break;
                }
            }

            if (lb_isModify) {
                ls_oriAmtValue = Number(ls_oriAmtValue);

                let patternValue = field.format_func_name;

                let patternLength = patternValue.indexOf('.') > -1 ?
                    patternValue.slice(0, patternValue.indexOf('.')).length - 1 : patternValue.length - 1;

                //幾位小數
                let numberOfDecimals = patternValue.indexOf('.') > -1 ?
                    patternValue.slice(patternValue.indexOf('.') + 1, patternValue.length).length : 0;
                //幾位數一個逗號
                let commaPosition = patternLength - patternValue.lastIndexOf(',');

                let reStr = '\\d(?=(\\d{' + (commaPosition || 3) + '})+' + (numberOfDecimals > 0 ? '\\.' : '$') + ')';

                ls_oriAmtValue = ls_oriAmtValue.toFixed(numberOfDecimals).toString().replace(new RegExp(reStr, 'g'), '$&,');

                this.singleData[field.ui_field_name] = ls_oriAmtValue;
            }
            else {
                this.singleData[field.ui_field_name] = 0;
            }
        },
        chkClickPopUpGrid: function (field) {
            let self = this;
            if (field.ui_type == "popupgrid" || field.ui_type == "multipopupgrid") {
                let params = {
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
            let self = this;
            let la_originData = [this.oriSingleData];
            let la_singleData = [this.singleData];
            let la_diff = _.difference(la_originData, la_singleData);

            // 判斷資料是否有異動
            if (la_diff.length != 0) {
                this.isUpdate = true;
            }

            if (!_.isEmpty(rule_func_name.trim())) {
                let postData = {
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
            let self = this;
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
            let self = this;
            this.doSaveModifyData(function (res) {
                if (res) {
                    self.isLoadingDialog = true;
                    let nowRowIndex = $("#PMS0620050_dg").datagrid('getRowIndex', self.rowData);
                    self.rowData = vm.pageOneDataGridRows[nowRowIndex - 1];
                }
            });
        },
        toNextData: function () {
            let self = this;
            this.doSaveModifyData(function (res) {
                if (res) {
                    self.isLoadingDialog = true;
                    let nowRowIndex = $("#PMS0620050_dg").datagrid('getRowIndex', self.rowData);
                    self.rowData = vm.pageOneDataGridRows[nowRowIndex + 1];
                }
            });
        },
        toLastData: function () {
            let self = this;
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
            let self = this;
            let q = confirm(go_i18nLang["SystemCommon"].check_delete);
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
            let self = this;
            let lb_isDataChang = false;
            let lo_checkRowData = JSON.parse(JSON.stringify(this.singleData));

            //將欄位traffic_amt的值從有format轉回原本number
            let ls_trafficAmt = "";

            if (lo_checkRowData["traffic_amt"].indexOf(',') > -1) {
                let la_splitAmtValue = lo_checkRowData["traffic_amt"].split(',');
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
                let q = confirm(go_i18nLang["SystemCommon"].Save_changed_data);

                if (q) {
                    this.isLoadingDialog = true;
                    this.loadingText = "Saving...";

                    let lo_chkResult = this.dataValidate();

                    if (lo_chkResult.success == false && vm.tmpCUD.deleteData.length == 0) {
                        alert(lo_chkResult.msg);
                        this.isLoadingDialog = false;
                    }
                    else {
                        lo_checkRowData["tab_page_id"] = 1;
                        lo_checkRowData["event_time"] = moment().format("YYYY/MM/DD HH:mm:ss");

                        vm.tmpCUD.updateData = [lo_checkRowData];
                        vm.tmpCUD.oriData = [this.oriSingleData];

                        let lo_params = {
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
            let self = this;
            let lo_checkResult;

            // 單筆資料檢查
            for (let i = 0; i < this.oriFieldsData.length; i++) {
                let lo_field = this.oriFieldsData[i];
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
            let self = this;
            this.isLoadingDialog = true;
            this.loadingText = "Saving...";

            let lo_chkResult = this.dataValidate();

            if (lo_chkResult.success == false && vm.tmpCUD.deleteData.length == 0) {
                alert(lo_chkResult.msg);
                this.isLoadingDialog = false;
            }
            else {
                let postRowData = _.clone(this.singleData);

                //將欄位traffic_amt的值從有format轉回原本number
                let ls_trafficAmt = "";

                if (postRowData["traffic_amt"].indexOf(',') > -1) {
                    let la_splitAmtValue = postRowData["traffic_amt"].split(',');
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
            let self = this;
            $("#singleGridPMS0620050").dialog('close');
            vm.isOnlyClose = true;
        }
    }
});

let vm = new Vue({
    el: "#PMS0620050App",
    mounted: function () {
        this.fetchUserInfo();
        this.initTmpCUD();
        this.loadDataGridByPrgID();
        this.fetchSingleWidth();
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
        isEditEnable: false,
        isOnlyClose: true,
        maxWidth: 0
    },
    watch: {
        isEditEnable(val) {
            let purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "0400";
            });
            if (purview == -1) {
                this.isEditEnable = true;
            }
        }
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
            let lo_searchCond = _.clone(this.searchCond);

            let lo_params = {
                prg_id: "PMS0620050",
                searchCond: lo_searchCond,
                pag_id: 1
            };

            $.post("/api/fetchDataGridFieldData", lo_params, function (result) {
                if (vm.searchFields.length <= 0) {
                    vm.searchFields = result.searchFields;
                }
                vm.pageOneDataGridRows = result.dgRowData;
                vm.pageOneFieldData = result.dgFieldsData;
                vm.showDataGrid();
            });
        },
        showDataGrid: function () {
            let la_colOption = DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0620050_dg');
            let ln_pageSize = 10;//一開始只載入10筆資料

            this.isLoading = false;
            this.dgIns = new DatagridSingleGridClass();

            this.dgIns.init(gs_prgId, "PMS0620050_dg", la_colOption, this.pageOneFieldData, {
                singleSelect: false,
                pagination: true,
                rownumbers: true,
                pageSize: ln_pageSize
            });
            this.dgIns.loadPageDgData(this.pageOneDataGridRows);
            this.isAction = false;
        },
        editRow: function () {
            this.initTmpCUD();
            this.isLoading = true;
            this.editingRow = {};
            this.isModificable = true;

            let editRow = $('#PMS0620050_dg').datagrid('getSelected');

            if (!editRow) {
                alert(go_i18nLang["SystemCommon"].SelectData);
            } else {
                this.editingRow = editRow;
                this.showSingleGridDialog();
            }

            this.isLoading = false;
        },
        fetchSingleWidth: function () {
            let self = this;
            $.post("/api/singleGridPageFieldQuery", {
                prg_id: gs_prgId,
                page_id: 2
            }, function (result) {
                if (result.success) {

                    let fieldsData = _.values(_.groupBy(_.sortBy(result.fieldData, "row_seq"), "row_seq"));
                    // 算最小寬度 && 最大行數
                    let maxField = fieldsData[0];
                    _.each(maxField, function (lo_maxField, index) {

                        let width = parseInt(lo_maxField.width) || 35; //90
                        let label_width = parseInt(lo_maxField.label_width) || 50; //165
                        self.maxWidth += width + label_width + 100;
                        //todo 此單筆最後一排有超過五個以上的grid-item 會錯誤
                        // if(index >= 2) return true;
                    });
                }
            });

        },
        showSingleGridDialog: function () {
            let maxHeight = document.documentElement.clientHeight - 70; //browser 高度 - 70功能列
            // gridWt = $('.singleGridContent .grid-item label').width() + $('.singleGridContent .grid-item input').width() +14;
            let dialogWt = this.maxWidth + 120;
            let height = 10 * 50; // 預設一個row 高度
            let dialog = $('#singleGridPMS0620050').removeClass('hide').dialog({
                autoOpen: false,
                modal: true,
                title: go_i18nLang["program"]["PMS0620050"].edit_vist_mn,
                minWidth: _.min([dialogWt, 1000]),
                width: _.min([dialogWt, 1000]),
                maxHeight: maxHeight,
                resizable: true,
                onBeforeClose: function () {
                    vmHub.$emit('doSaveModifyData');
                }
            }).dialog('open');
            this.isLoading = false;
            $("#singleGridPMS0620050").css("height", _.min([maxHeight, height]) + 20);
        },
        doSaveCUD: function (prg_id, page_id, callback) {
            let lo_params = {
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
        let lo_childrenOptions = _.findWhere(lo_option.children, {id: ls_value});
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