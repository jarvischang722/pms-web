/**
 * Created by Jun on 2017/2/23.
 * 程式編號: PMS0810020
 * 程式名稱: 房型設定檔
 */
waitingDialog.hide();
var prg_id = $("#prg_id").val();
var vmHub = new Vue;

/** DatagridRmSingleGridClass ***/
function DatagridRmSingleGridClass() {
}
DatagridRmSingleGridClass.prototype = new DatagridBaseClass();
DatagridRmSingleGridClass.prototype.onClickCell = function (idx, row) {
    //
};
DatagridRmSingleGridClass.prototype.onClickRow = function (idx, row) {
    vm.editingRow = row;
    vm.editStatus = true;
    vm.fetchSingleData(row, function (success) {
        vm.showSingleGridDialog();
    });
};
/*** Class End  ***/

/** 欄位多語系Dialog **/
Vue.component("field-multi-lang-dialog-tmp", {
    template: '#fieldMultiLangDialogTmp',
    props: ['sys_locales', 'singleData'],
    data: function () {
        return {
            editingLangField: "",
            multiLangContentList: [],
            fieldMultiLang: {}
        };
    },
    created: function () {
        var self = this;
        vmHub.$on('editFieldMultiLang', function (fieldInfo) {
            self.getFieldMultiLangContent(fieldInfo);
        });
    },
    methods: {
        getFieldMultiLangContent: function (fieldInfo) {
            this.editingLangField = fieldInfo.ui_field_name;
            var self = this;
            var params = {
                rowData: this.singleData,
                prg_id: fieldInfo.prg_id,
                page_id: 2,
                ui_field_name: fieldInfo.ui_field_name
            };

            $.post("/api/fieldAllLocaleContent", params, function (result) {
                self.multiLangContentList = result.multiLangContentList;
                self.openFieldMultiLangDialog(fieldInfo.ui_display_name);
                // console.table(JSON.parse(JSON.stringify(self.multiLangContentList)));
            });
        },
        openFieldMultiLangDialog: function (fieldName) {
            var width = 300;
            var height = (this.sys_locales.length + 1) * 40 + 100;
            var dialog = $("#fieldMultiLangTmpDialog").dialog({
                autoOpen: false,
                modal: true,
                title: fieldName,
                height: height,
                width: width,
                resizable: false,
                buttons: "#fieldMultiDialogBtns"
            });

            dialog.dialog("open");
        },
        closeFieldMultiLangDialog: function () {
            $("#fieldMultiLangTmpDialog").dialog("close");
        },
        saveFieldMultiLang: function () {

            var multiLang = [];
            //TODO 暫時用jquery 取資料
            $(".multi_lang_input").each(function () {
                var tmpObj = {};
                tmpObj['locale'] = $(this).data("locale");
                tmpObj[$(this).attr("id")] = $(this).val();
                if (!_.isEmpty($(this).val())) {
                    multiLang.push(tmpObj);
                }
            });

            this.singleData["multiLang"] = multiLang;
            this.closeFieldMultiLangDialog();
        }
    }

});

/** 編輯新增Dialog Component **/
Vue.component('single-grid-pms0810020-tmp', {
    template: '#sigleGridPMS0810020Tmp',
    props: ['editStatus', 'createStatus', 'deleteStatus', 'editingRow', 'pageOneDataGridRows', 'pageTwoDataGridFieldData',
        'singleData', 'pageTwoFieldData', 'tmpCud', 'modificableForData', 'dialogVisible'],
    data () {
        return {
            isFistData: false,
            isLastData: false,
        };
    },
    watch: {
        editingRow: function (newRow, oldRow) {

            this.$parent.editingRow = newRow;
            var nowDatagridRowIndex = $("#PMS0810020_dg").datagrid('getRowIndex', newRow);
            $("#PMS0810020_dg").datagrid('selectRow', nowDatagridRowIndex);

            if ($("#PMS0810020_dg").datagrid('getRowIndex', newRow) == 0) {
                //已經到第一筆
                this.isFistData = true;
                this.isLastData = false;
            } else if ($("#PMS0810020_dg").datagrid('getRowIndex', newRow) == this.pageOneDataGridRows.length - 1) {
                //已經到最後一筆
                this.isFistData = false;
                this.isLastData = true;
            } else {

                this.isFistData = false;
                this.isLastData = false;
            }

        }
    },
    created () {

        var self = this;
        vmHub.$on('tempExecData', function (row) {
            self.tempExecData(row);
        });

    },
    methods: {

        //打開單欄多語編輯
        editFieldMultiLang: function (fieldInfo) {
            vmHub.$emit('editFieldMultiLang', fieldInfo);
        }
        ,
        //檢查欄位規則，在離開欄位時
        chkFieldRule: function (ui_field_name, rule_func_name) {
            var self = this;
            if (!_.isEmpty(rule_func_name.trim())) {
                var postData = {
                    prg_id: prg_id,
                    rule_func_name: rule_func_name,
                    validateField: ui_field_name,
                    singleRowData: JSON.parse(JSON.stringify(this.singleData))
                };
                $.post('/api/chkFieldRule', postData, function (result) {
                    if (result.success) {
                        //連動帶回的值
                        if (!_.isUndefined(result.effectValues)) {
                            var effectValues = result.effectValues;
                            _.each(Object.keys(effectValues), function (key) {
                                self.singleData[key] = effectValues[key] || "";
                            });
                        }

                        //是否要show出訊息
                        if (result.showAlert) {
                            alert(result.alertMsg);
                        }

                        //是否要show出詢問視窗
                        if (result.showConfirm) {
                            if (confirm(result.confirmMsg)) {
                                //有沒有要再打一次ajax到後端
                                if (result.isGoPostAjax) {
                                    $.post(result.ajaxURL, postData, function (result) {
                                        if (!result.success) {
                                            alert(result.errorMsg);
                                        }
                                    });
                                }
                            }
                        }


                    } else {
                        alert(result.errorMsg);
                    }

                });
            }
        },

        //到第一筆
        toFirstData: function () {
            this.isFistData = true;
            this.isLastData = false;
            this.editingRow = _.first(this.pageOneDataGridRows);
            this.emitFetchSingleData();
        },

        //上一筆
        toPreData: function () {
            var nowRowIndex = $("#PMS0810020_dg").datagrid('getRowIndex', this.editingRow);
            this.editingRow = this.pageOneDataGridRows[nowRowIndex - 1];
            this.emitFetchSingleData();

        },

        //下一筆
        toNextData: function () {
            var nowRowIndex = $("#PMS0810020_dg").datagrid('getRowIndex', this.editingRow);
            this.editingRow = this.pageOneDataGridRows[nowRowIndex + 1];
            this.emitFetchSingleData();

        },
        //最後一筆
        toLastData: function () {
            this.isFistData = false;
            this.isLastData = true;
            this.editingRow = _.last(this.pageOneDataGridRows);
            this.emitFetchSingleData();
        },
        //刪除單筆EVENT
        handleDeleteSingleData: function () {
            var self = this;
            $.messager.confirm("Delete", "Are you sure delete those data?", function (q) {
                if (q) {
                    //刪除前檢查
                    $.post("/api/deleteFuncRule", {
                        page_id: 2,
                        prg_id: prg_id,
                        deleteData: [self.singleData]
                    }, function (result) {
                        if (result.success) {
                            self.deleteStatue = true;
                            self.tmpCud.deleteData = [self.singleData];
                            self.doSaveGrid();
                            if (result.showAlert) {
                                alert(result.alertMsg);
                            }
                        } else {
                            alert(result.errorMsg);
                        }
                    });
                }
            });
        }
        ,
        //關閉
        emitCloseGridDialog: function () {
            this.$emit('close-single-grid-dialog');
        },
        //抓取單筆資料
        emitFetchSingleData: function () {
            var params = this.editingRow;
            this.$emit('fetch-single-data', params, function (success) {
            });
        },
        //新增
        emitAppendRow: function () {
            this.$emit('append-row');
        },
        //儲存新增或修改資料
        doSaveGrid: function (saveAfterAction) {

            var self = this;
            var targetRowAfterDelete = {}; //刪除後要指向的資料
            if (this.deleteStatue) {
                var rowsNum = $("#PMS0810020_dg").datagrid('getRows').length;
                var currentRowIdx = $("#PMS0810020_dg").datagrid('getRowIndex', self.editingRow); //目前索引
                if (currentRowIdx == rowsNum - 1) {
                    //刪除的資料已經是最後一筆 就取datagrid最末筆
                    targetRowAfterDelete = self.pageOneDataGridRows[currentRowIdx - 1];

                } else {
                    //取下一筆
                    targetRowAfterDelete = self.pageOneDataGridRows[currentRowIdx + 1];
                }
            }

            if (this.createStatus) {
                this.tmpCud.createData = [this.singleData];
            } else if (this.editStatus) {
                this.tmpCud.editData = [this.singleData];
            }


            //先驗證有無欄位沒驗證過的
            this.$emit('do-save-cud', function (success) {
                if (success) {
                    //儲存後離開
                    if (saveAfterAction == "closeDialog") {
                        self.singleData = {};
                        self.emitCloseGridDialog();
                    }
                    //新增完再新增另一筆
                    else if (saveAfterAction == "addOther") {
                        self.singleData = {};
                        self.emitAppendRow();
                    }

                    if (self.deleteStatue) {
                        /**
                         * 刪除成功
                         * 1.取下一筆
                         * 2.無下一筆時取datagrid 最後一筆
                         * 3.連一筆都沒有關掉dialog 回多筆
                         **/
                        if ($("#PMS0810020_dg").datagrid('getRows').length > 0) {
                            self.editingRow = targetRowAfterDelete;
                            self.emitFetchSingleData();
                        } else {
                            //連一筆都沒有就關掉視窗
                            self.emitCloseGridDialog();
                        }

                    }


                }
            });


        },
        appendDtRow(){
        },
        removeDtRow(){
        }

    }
});

var vm = new Vue({
    el: '#GSApp',
    mounted: function () {
        this.initTmpCUD();
        this.fetchUserInfo();
        this.loadDataGridByPrgID(function (success) {
        });
        this.loadSingleGridPageField();
    },
    data: {
        isDatepickerInit: false,
        sys_locales: JSON.parse(decodeURIComponent(getCookie("sys_locales")).replace("j:", "")),
        createStatus: false,    //新增狀態
        editStatus: false,      //編輯狀態
        deleteStatus: false,    //刪除狀態
        pageOneDataGridRows: [],//page_id 1 的 datagrid資料
        pageOneFieldData: [],   //page_id 1 datagird欄位
        pageTwoFieldData: [],   //page_id 2 欄位
        pageTwoDataGridFieldData: [],   //page_id 2 datagird欄位
        editingRow: {},         //編輯中的資料
        userInfo: {},            //登入的使用者資料
        tmpCud: {               //新刪修暫存
            createData: [],
            editData: [],
            deleteData: []
        },
        singleData: {},         //單檔資訊
        modificableForData: true,       //決定是否可以修改資料
        dialogVisible: false,
        dgIns: {}
    },
    watch: {
        editStatus: function (newVal) {
            if (newVal) {
                vm.createStatus = false;
                vm.deleteStatue = false;
            }
        },
        createStatus: function (newVal) {
            if (newVal) {
                vm.editStatus = false;
                vm.deleteStatue = false;
            }
        },
        deleteStatus: function (newVal) {
            if (newVal) {
                vm.editStatus = false;
                vm.createStatus = false;
            }
        }
    },
    methods: {
        //Init CUD
        initTmpCUD: function () {
            this.tmpCud = {
                createData: [],
                editData: [],
                deleteData: [],
            };
        },
        //抓取顯示資料
        loadDataGridByPrgID: function (callback) {
            $.post("/api/prgDataGridDataQuery", {prg_id: prg_id}, function (result) {
                waitingDialog.hide();
                vm.pageOneDataGridRows = result.dataGridRows;
                vm.pageOneFieldData = result.fieldData;
                vm.showCheckboxDG();
                vm.showDataGrid();
                callback(result.success);
            });
        },
        //抓取page_id 2 單頁顯示欄位
        loadSingleGridPageField: function () {
            $.post("/api/singleGridPageFieldQuery", {prg_id: prg_id, page_id: 2}, function (result) {
                var fieldData = result.fieldData;
                vm.pageTwoFieldData = _.values(_.groupBy(_.sortBy(fieldData, "row_seq"), "row_seq"));
            });
        },
        //取得使用者資料
        fetchUserInfo: function () {
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    vm.userInfo = result.userInfo;
                }
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
        //顯示DataGrid
        showDataGrid: function () {

            this.dgIns = new DatagridRmSingleGridClass();
            this.dgIns.init(prg_id, 'PMS0810020_dg', EZfieldClass.combineFieldOption(this.pageOneFieldData));
            this.dgIns.loadDgData(this.pageOneDataGridRows);
            vm.pageOneDataGridRows = $("#dgCheckbox").datagrid('getRows');
        },
        //dg row刪除
        removeRow: function () {
            vm.tmpCud.deleteData = [];
            var checkRows = $('#dgCheckbox').datagrid('getSelections');
            if (checkRows == 0) {
                $.messager.alert("Warning", 'Check at least one item');
                return;
            }
            $.messager.confirm("Delete", "Are you sure delete those data?", function (q) {
                if (q) {
                    //刪除前檢查

                    _.each(checkRows, function (row) {
                        vm.tmpCud.deleteData.push(row);
                    });

                    $.post("/api/deleteFuncRule", {
                        page_id: 1,
                        prg_id: prg_id,
                        deleteData: vm.tmpCud.deleteData
                    }, function (result) {
                        if (result.success) {
                            //刪除Row
                            _.each(checkRows, function (row) {
                                var DelIndex = $('#PMS0810020_dg').datagrid('getRowIndex', row);
                                $('#PMS0810020_dg').datagrid('deleteRow', DelIndex);
                            });
                            vm.showCheckboxDG($("#PMS0810020_dg").datagrid("getRows"));
                            vm.doSaveCUD();
                        } else {
                            alert(result.errorMsg);
                        }

                    });

                }
            });
        },
        //資料儲存
        doSaveCUD: function (callback) {
            waitingDialog.show('Saving...');
            var params = _.extend({prg_id: prg_id}, vm.tmpCud);
            // console.log("===Save params===");
            // console.log(params);
            $.post("/api/saveGridSingleData", params, function (result) {
                waitingDialog.hide();
                if (result.success) {
                    vm.initTmpCUD();
                    vm.loadDataGridByPrgID(function (success) {
                        callback(success);
                    });
                    alert('save success!');
                } else {
                    alert(result.errorMsg);
                }

            });

        },
        //新增按鈕Event
        appendRow: function () {
            vm.initTmpCUD();
            vm.createStatus = true;
            vm.singleData = {};
            $.post("/api/addFuncRule", {prg_id: prg_id}, function (result) {
                if (result.success) {
                    vm.singleData = result.defaultValues;
                    vm.showSingleGridDialog();
                } else {
                    alert(result.errorMsg);
                }

            });

        },
        //取得單筆資料
        fetchSingleData: function (editingRow, callback) {

            vm.initTmpCUD();
            vm.editStatus = true;
            vm.editingRow = editingRow;
            editingRow["prg_id"] = prg_id;
            $.post('/api/singlePageRowDataQuery', editingRow, function (result) {
                if (result.success) {
                    vm.singleData = result.rowData;
                    vm.modificableForData = result.modificable || true;
                    callback(true);
                } else {
                    vm.singleData = {};
                    callback(false);
                }

            });
        },
        //init datepicker
        initDatePicker: function () {
            if (!this.isDatepickerInit) {
                this.isDatepickerInit = true;
                $('.date_picker').datepicker({
                    autoclose: true,
                    format: 'yyyy/mm/dd'
                }).on("changeDate", function (e) {
                });

                $('.date_timepicker').datetimepicker({
                    format: 'YYYY/MM/DD hh:mm:ss ',//use this option to display seconds
                    icons: {
                        time: 'fa fa-clock-o',
                        date: 'fa fa-calendar',
                        up: 'fa fa-chevron-up',
                        down: 'fa fa-chevron-down',
                        previous: 'fa fa-chevron-left',
                        next: 'fa fa-chevron-right',
                        today: 'fa fa-arrows ',
                        clear: 'fa fa-trash',
                        close: 'fa fa-times'
                    }

                });
            }
        },
        //打開單檔dialog
        showSingleGridDialog: function () {
            this.initDatePicker();
            this.dialogVisible = true;
            var maxHeight = document.documentElement.clientHeight - 60; //browser 高度 - 70功能列
            var height = this.pageTwoFieldData.length * 50; // 預設一個row 高度
            var dialog = $("#singleGridPMS0810020").dialog({
                autoOpen: false,
                modal: true,
                height: _.min([maxHeight, height]),
                title: prg_id,
                minWidth: 750,
                maxHeight: maxHeight,
                resizable: true,
                buttons: "#dialogBtns"
            });
            dialog.dialog("open");
            // 給 dialog "內容"高 值
            $(".singleGridContent").css("height", _.min([maxHeight, height]) + 20);
        },
        //關閉單檔dialog
        closeSingleGridDialog: function () {
            vm.editingRow = {};
            vm.singleData = {};
            vm.initTmpCUD();
            $("#singleGridPMS0810020").dialog('close');
        }


    }

});

/** 過濾Function **/
Vue.filter("filterLocaleContent", function (langContent, locale, field_name) {

    var m_lang_val = "";
    var fIdx = _.findIndex(langContent, {locale: locale});
    if (fIdx > -1) {
        m_lang_val = langContent[fIdx][field_name] || "";
    }

    return m_lang_val;
});

