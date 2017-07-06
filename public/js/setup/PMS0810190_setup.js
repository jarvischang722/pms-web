/**
 * Created by Jun on 2017/6/14.
 */
Vue.use(VeeValidate);
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
    vm.editingRow = row;
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
            currentType: '',  // subject | content
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
            this.lo_curForTextArea = new cursor(e)
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

let vm = new Vue({
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
        isEditStatus: true,     //編輯狀態
        isDeleteStatus: true,     //刪除狀態
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
        editingRow: {} //編輯中的那筆RowData

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
            this.dgIns = new DatagridSingleGridClass();
            this.dgIns.init(this.prg_id, gs_dgName, EZfieldClass.combineFieldOption(this.pageOneFieldData,'PMS0810190_dg'));
        },
        getSingleGridPageField: function () {
            axios.post('/api/singleGridPageFieldQuery', {prg_id: this.prg_id, page_id: 2})
                .then(function (response) {
                    let result = response.data;
                    vm.pageTwoFieldData = result.fieldData;
                    vm.useCodList = _.findWhere(vm.pageTwoFieldData, {ui_field_name: 'use_cod'}).selectData;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        getOrderConfirm: function () {
            axios.post('/api/prgDataGridDataQuery', {prg_id: this.prg_id})
                .then(function (response) {
                    console.log(response.data);
                    let result = response.data;
                    vm.pageOneDataGridRows = result.dataGridRows;
                    vm.pageOneFieldData = result.fieldData;
                    vm.showCheckboxDG();
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        //Show Checkbox
        showCheckboxDG: function () {
            var dgData = {total: this.pageOneDataGridRows.length, rows: this.pageOneDataGridRows};
            $('#dgCheckbox').datagrid({
                columns: [
                    [
                        {
                            field: 'ck',
                            checkbox: true
                        }
                    ]
                ],
                singleSelect: false,
                data: dgData
            });
        },
        fetchSingleData: function () {
            vm.initTmpCUD();
            vm.isEditStatus = true;
            vm.isCreateStatus = false;
            vm.isDeleteStatus = false;
            vm.editingRow["prg_id"] = vm.prg_id;
            $.post('/api/singlePageRowDataQuery', vm.editingRow, function (result) {
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
            var checkRows = $('#dgCheckbox').datagrid('getSelections');
            if (checkRows == 0) {
                $.messager.alert("Warning", 'Check at least one item');
                return;
            }
            $.messager.confirm("Delete", "Are you sure delete those data?", function (q) {
                if (q) {
                    //刪除前檢查
                    _.each(checkRows, function (row) {
                        var DelIndex = $('#' + gs_dgName).datagrid('getRowIndex', row);
                        $('#' + gs_dgName).datagrid('deleteRow', DelIndex);
                        vm.tmpCUD.deleteData.push(row);
                    });
                    vm.doSave();
                }
            });
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
                let valContent = _this.singleData[currentType] || "";
                let openReg = new RegExp(/\[\[\%\%/, "g");
                let closeReg = new RegExp(/\%\%\]\]/, "g");
                let openMatchNum = valContent.match(openReg) ? valContent.match(openReg).length : 0;
                let closeMatchNum = valContent.match(closeReg) ? valContent.match(closeReg).length : 0;
                let reg = new RegExp(/\[\[\%\%(訂房卡號|聯絡人|Full Name|公司名稱|訂房公司)\%\%\]\]/, "g");
                let regNum = valContent.match(reg) ? valContent.match(reg).length : 0;

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
            let checkField = ["confirm_cod", "subject", "content", "use_cod"];
            _.each(checkField, function (fieldName) {
                if (isContFmtOK && (_.isUndefined(vm.singleData[fieldName]) || _.isEmpty(vm.singleData[fieldName].trim()))) {
                    var field = _.findWhere(vm.pageTwoFieldData, {ui_field_name: fieldName});
                    alert("[ " + field.ui_display_name + " ] is requirable !");
                    isContFmtOK = false;
                }
            })

            //格式檢查
            if (!this.isContentFormatOK) {
                alert("格式錯誤，請重新檢查");
                isContFmtOK = false;
            }
            return isContFmtOK;
        },
        doSave: function () {

            if (!this.doVerify()) {
                return;
            }
            if (this.isCreateStatus) {
                this.tmpCUD.createData = [this.singleData];
            } else if (this.isEditStatus) {
                this.tmpCUD.editData = [this.singleData];
            }

            axios.post('/api/saveGridSingleData', _.extend({prg_id: this.prg_id}, this.tmpCUD))
                .then(function (response) {
                    if (response.data.success) {
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

                            var nowRowIndex = $("#" + gs_dgName).datagrid('getRowIndex', vm.editingRow);
                            vm.pageOneDataGridRows.splice(nowRowIndex, 1); //刪除暫存
                            if (vm.pageOneDataGridRows.length == 0) {
                                vm.closeSingleGridDialog();
                            } else {

                                var nextIndex = vm.pageOneDataGridRows.length - 1 == nowRowIndex
                                    ? vm.pageOneDataGridRows.length - 1
                                    : nowRowIndex;
                                vm.editingRow = vm.pageOneDataGridRows[nextIndex];
                                vm.fetchSingleData();
                            }

                        }

                        vm.getOrderConfirm();
                        vm.initTmpCUD();
                        alert("save success!");

                    } else {
                        alert(response.data.errorMsg);
                    }
                });
        },
        showSingleGridDialog: function () {
            this.isAddAfterSave = false;
            this.isLeaveAfterSave = false;
            this.dialogVisible = true;
            let maxHeight = document.documentElement.clientHeight - 30; //browser 高度 - 70功能列
            let height = 550; // 預設一個row 高度
            let dialog = $("#singleGridPMS0810190").dialog({
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
        },
    },
});


