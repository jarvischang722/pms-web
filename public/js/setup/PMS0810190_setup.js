/**
 * Created by Jun on 2017/6/14.
 */

var gs_dgName = "PMS0810190_dg";

/** DatagridRmSingleGridClass ***/
function DatagridSingleGridClass() {
}

DatagridSingleGridClass.prototype = new DatagridBaseClass();
DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    //
};
DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
    vm.editingRow = row;
    vm.isEditStatus = true;
    vm.fetchSingleData();
};
/*** Class End  ***/


Vue.component('single-grid-pms0810190-tmp', {
    template: '#singleGridPMS0810190Tmp',
    props: ['isEditStatus', 'isCreateStatus', 'singleData', 'useCodList', 'pageOneDataGridRows', 'editingRow', 'lo_formatError'],
    watch: {
        editingRow: function (newRow) {

            this.$parent.editingRow = newRow;
            var nowDatagridRowIndex = $("#" + gs_dgName).datagrid('getRowIndex', newRow);
            $("#" + gs_dgName).datagrid('selectRow', nowDatagridRowIndex);

            if ($("#" + gs_dgName).datagrid('getRowIndex', newRow) == 0) {
                //已經到第一筆
                this.isFistData = true;
                this.isLastData = false;
            } else if ($("#" + gs_dgName).datagrid('getRowIndex', newRow) == this.pageOneDataGridRows.length - 1) {
                //已經到最後一筆
                this.isFistData = false;
                this.isLastData = true;
            } else {
                this.isFistData = false;
                this.isLastData = false;
            }

        }
    },
    data: function () {
        return {
            isFistData: false,
            isLastData: false,
            isSubjectFormatError: false,
            isContentFormatError: false,
            lo_curForTextArea: {},  //textArea 游標Object
            currentType: ''  // subject | content
        };
    },
    methods: {
        //到第一筆
        toFirstData: function () {
            this.isFistData = true;
            this.isLastData = false;
            this.$parent.editingRow = _.first(this.pageOneDataGridRows);
            this.$parent.fetchSingleData();
        },
        //上一筆
        toPreData: function () {
            var nowRowIndex = $("#" + gs_dgName).datagrid('getRowIndex', this.editingRow);
            this.$parent.editingRow = this.pageOneDataGridRows[nowRowIndex - 1];
            this.$parent.fetchSingleData();
        },

        //下一筆
        toNextData: function () {
            var nowRowIndex = $("#" + gs_dgName).datagrid('getRowIndex', this.editingRow);
            this.$parent.editingRow = this.pageOneDataGridRows[nowRowIndex + 1];
            this.$parent.fetchSingleData();
        },
        //最後一筆
        toLastData: function () {
            this.isFistData = false;
            this.isLastData = true;
            this.$parent.editingRow = _.last(this.pageOneDataGridRows);
            this.$parent.fetchSingleData();
        },
        checkContentFormat: function () {
            this.$parent.doCheckContentFormat();
        },
        keyUpContent: function (type, e) {
            this.currentType = type;
            this.lo_curForTextArea = new cursor(e);
        },
        mouseUpContent: function (type, e) {
            this.currentType = type;
            this.lo_curForTextArea = new cursor(e);
        },
        insertFormatCont: function (content) {
            this.lo_curForTextArea.insertTextInCursor(content);
            this.singleData[this.currentType] = this.lo_curForTextArea.e.value;
        },
        showSelectDisplay: function (_use_cod) {
            var useCodIdx = _.findIndex(this.useCodList, {value: _use_cod});
            return useCodIdx > -1 ? this.useCodList[useCodIdx].display : "";
        }

    }
});

var vm = new Vue({
    el: '#PMS0810190App',
    data: {
        dgIns: {},
        prg_id: gs_prg_id,
        isSaving: false,
        singleData: {},
        modificableForRow: true, //此筆資料可否編輯
        pageOneDataGridRows: [],
        pageOneFieldData: [],
        pageTwoFieldData: [],
        useCodList: [],
        isCreateStatus: false,  //新增狀態
        isEditStatus: false,     //編輯狀態
        isDeleteStatus: false,     //刪除狀態
        isAddAfterSave: false,   //新增後繼續修增
        isLeaveAfterSave: false, //儲存後關閉視窗
        isContentFormatOK: true,// 內容格式是否正確
        lo_formatError: {
            subject: false,
            content: false
        },
        tmpCUD: {
            createData: [],
            editData: [],
            deleteData: []
        },
        editingRow: {}, //編輯中的那筆RowData
        editingIdx: -1

    },
    mounted: function () {
        waitingDialog.hide();
        this.initSingleData();
        this.getOrderConfirm();
        this.getSingleGridPageField();
    },
    watch: {
        pageOneFieldData: function () {
            this.initDataGrid();
            this.dgIns.loadDgData(this.pageOneDataGridRows);
        },
        editingRow: function (editingRow) {
            this.editIndex = $("#" + gs_dgName).datagrid('getRowIndex', editingRow);
        }

    },
    computed: {},
    methods: {
        initSingleData: function () {
            this.singleData = {
                confirm_cod: "",
                subject: "",
                content: "",
                use_cod: "",
                ins_dat: "",
                ins_usr: "",
                upd_dat: "",
                upd_usr: ""
            };
        },
        initDataGrid: function () {
            var colOption = [{field: 'ck', checkbox: true}];
            colOption = _.union(colOption, DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0810190_dg'));
            this.dgIns = new DatagridSingleGridClass();
            this.dgIns.init(this.prg_id, gs_dgName, colOption, this.pageOneFieldData, {singleSelect: false});
        },
        getSingleGridPageField: function () {
            BacUtils.doHttpPostAgent('/api/singleGridPageFieldQuery', {
                prg_id: this.prg_id,
                page_id: 2
            }, function (response) {
                var result = response;
                vm.pageTwoFieldData = result.fieldData;
                vm.useCodList = _.findWhere(vm.pageTwoFieldData, {ui_field_name: 'use_cod'}).selectData;
            });
        },
        getOrderConfirm: function () {
            BacUtils.doHttpPostAgent('/api/prgDataGridDataQuery', {prg_id: this.prg_id}, function (response) {
                var result = response;
                vm.pageOneDataGridRows = result.dataGridRows;
                vm.pageOneFieldData = result.fieldData;
            });
        },

        fetchSingleData: function () {
            vm.initTmpCUD();
            vm.isEditStatus = true;
            vm.isCreateStatus = false;
            vm.isDeleteStatus = false;
            vm.editingRow["prg_id"] = gs_prg_id;
            BacUtils.doHttpPostAgent('/api/singlePageRowDataQuery', vm.editingRow, function (result) {
                if (result.success) {
                    vm.showSingleGridDialog();
                    vm.singleData = result.rowData;
                    vm.modificableForRow = result.modificable || true;
                    if (!vm.modificableForRow) {
                        alert("此筆資料不可編輯！");
                    }
                } else {
                    vm.singleData = {};
                }

            });
        },
        addData: function () {
            this.initSingleData();
            this.isCreateStatus = true;
            this.isEditStatus = false;
            this.isDeleteStatus = false;
            this.showSingleGridDialog();
        },
        removeData: function () {
            this.isDeleteStatus = true;
            this.tmpCUD.deleteData = [this.singleData];
            this.doSave();
        },
        removeMultiData: function () {
            var checkRows = $('#PMS0810190_dg').datagrid('getChecked');
            if (checkRows == 0) {
                alert('Check at least one item.');
                return;
            }
            if (confirm("Are you sure delete those data?")) {
                //刪除前檢查
                _.each(checkRows, function (row) {
                    var DelIndex = $('#' + gs_dgName).datagrid('getRowIndex', row);
                    $('#' + gs_dgName).datagrid('deleteRow', DelIndex);
                    vm.tmpCUD.deleteData.push(row);
                });
                if (vm.tmpCUD.deleteData.length > 0) {
                    vm.isDeleteStatus = true;
                }
                vm.doSave();
            }
        },
        toAddAfterSave: function () {
            this.isAddAfterSave = true;
            this.doSave();
        },
        toLeaveAfterSave: function () {
            this.isLeaveAfterSave = true;
            this.doSave();
        },
        //檢查內容格式是否有[[%%xxxx%%]] 對稱
        doCheckContentFormat: function () {
            var _this = this;
            _.each(this.lo_formatError, function (errStatus, currentType) {
                var valContent = _this.singleData[currentType] || "";
                var openReg = new RegExp(/\[\[\%\%/, "g");
                var closeReg = new RegExp(/\%\%\]\]/, "g");
                var openMatchNum = valContent.match(openReg) ? valContent.match(openReg).length : 0;
                var closeMatchNum = valContent.match(closeReg) ? valContent.match(closeReg).length : 0;
                var reg = new RegExp(/\[\[\%\%(ReservationNo|ContactMan|FullName|CompName|ReservationComp)\%\%\]\]/, "g");
                var regNum = valContent.match(reg) ? valContent.match(reg).length : 0;

                if (openMatchNum == closeMatchNum && regNum == openMatchNum) {
                    _this.lo_formatError[currentType] = false;
                } else {
                    _this.lo_formatError[currentType] = true;
                }
            });
            this.isContentFormatOK = !this.lo_formatError.subject && !this.lo_formatError.content;
        },
        doVerify: function () {
            var isContFmtOK = true;
            var checkField = ["confirm_cod", "subject", "content", "use_cod"];
            _.each(checkField, function (fieldName) {

                if (isContFmtOK && (_.isUndefined(vm.singleData[fieldName]) || _.isEmpty(vm.singleData[fieldName].trim()))) {
                    var field = _.findWhere(vm.pageTwoFieldData, {ui_field_name: fieldName});
                    alert("[ " + field.ui_display_name + " ] is requirable !");
                    isContFmtOK = false;
                }
            });

            //格式檢查
            if (!this.isContentFormatOK) {
                alert("格式錯誤，請重新檢查");
                isContFmtOK = false;
            }
            return isContFmtOK;
        },
        doSave: function () {

            if (!this.isDeleteStatus && !this.doVerify()) {
                return;
            }

            if (!this.isDeleteStatus) {
                if (this.isCreateStatus) {
                    this.tmpCUD.createData = [this.singleData];
                } else if (this.isEditStatus) {
                    this.tmpCUD.editData = [this.singleData];
                }
            } else {
                this.isCreateStatus = false;
                this.isEditStatus = false;
            }


            BacUtils.doHttpPostAgent('/api/saveGridSingleData', _.extend({prg_id: this.prg_id}, this.tmpCUD), function (response) {
                if (response.success) {
                    vm.getOrderConfirm();
                    if (vm.isCreateStatus) {
                        if (vm.isAddAfterSave) {
                            vm.addData();
                        } else {
                            vm.isCreateStatus = false;
                            vm.isEditStatus = true;
                            vm.editingRow = vm.singleData;
                            vm.fetchSingleData();
                        }
                    } else if (vm.isLeaveAfterSave) {
                        vm.closeSingleGridDialog();
                    }
                    //判斷刪除完下一筆要抓哪一筆顯示
                    if (vm.isDeleteStatus) {

                        vm.closeSingleGridDialog();
                    }

                    vm.getOrderConfirm();
                    vm.initTmpCUD();
                    alert(go_i18nLang.SystemCommon.saveSuccess);

                } else {
                    alert(response.errorMsg);
                }
            });
        },
        showSingleGridDialog: function () {
            this.isAddAfterSave = false;
            this.isLeaveAfterSave = false;
            this.dialogVisible = true;
            var maxHeight = document.documentElement.clientHeight - 30; //browser 高度 - 70功能列
            var height = 550; // 預設一個row 高度
            var dialog = $("#singleGridPMS0810190").dialog({
                autoOpen: false,
                modal: true,
                height: _.min([maxHeight, height]),
                title: gs_prg_id,
                minWidth: 850,
                maxHeight: maxHeight,
                resizable: true,
                buttons: "#dialogBtns"

            });
            dialog.dialog("open");
            $(".singleGridContent").css("height", _.min([maxHeight, height]) + 20);
        },
        //關閉單檔dialog
        closeSingleGridDialog: function () {
            vm.editingRow = {};
            vm.isCreateStatus = false;
            vm.isEditStatus = false;
            vm.isDeleteStatus = false;
            vm.initSingleData();
            vm.initTmpCUD();
            $("#singleGridPMS0810190").dialog('close');
        },
        initTmpCUD: function () {
            this.tmpCUD = {
                createData: [],
                editData: [],
                deleteData: []
            };
        }
    }
});


