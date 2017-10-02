/**
 * Created by a16010 on 2017/7/31.
 * 程式編號: PMS0820020
 * 程式名稱: 逾時計價相關設定
 */

var prg_id = $("#prg_id").val();
var vmHub = new Vue;

var go_Field_Data_Tmp;

/** DatagridRmSingleGridClass ***/
function DatagridRmSingleGridClass() {
}

DatagridRmSingleGridClass.prototype = new DatagridBaseClass();
DatagridRmSingleGridClass.prototype.onClickRow = function (idx, row) {
    PMS0820020VM.editingRow = row;
    PMS0820020VM.editStatus = true;
    PMS0820020VM.fetchSingleData(row, function (success) {
        PMS0820020VM.pageTwoFieldData = _.values(_.groupBy(_.sortBy(go_Field_Data_Tmp, "row_seq"), "row_seq"));
        PMS0820020VM.oriPageTwoFieldData = go_Field_Data_Tmp;
        PMS0820020VM.showSingleGridDialog();
    });
};
/*** Class End  ***/

/** 欄位多語系Dialog **/
Vue.component("field-multi-lang-dialog-tmp", {
    template: '#fieldMultiLangDialogTmp',
    props: ['sys_locales', 'singleData'],
    data: function () {
        return {
            editingMultiLangFieldName: '',
            showMultiLangDialog: false,
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
                dataType: 'gridsingle',
                rowData: this.singleData,
                prg_id: fieldInfo.prg_id,
                page_id: 2,
                ui_field_name: fieldInfo.ui_field_name
            };

            $.post("/api/fieldAllLocaleContent", params, function (result) {
                self.multiLangContentList = result.multiLangContentList;
                self.editingMultiLangFieldName = fieldInfo.ui_display_name;
                self.openFieldMultiLangDialog(fieldInfo.ui_display_name);
            });
        },
        openFieldMultiLangDialog: function () {
            this.showMultiLangDialog = true;
        },
        closeFieldMultiLangDialog: function () {
            this.showMultiLangDialog = false;
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
        },
        filterLocaleContent: function (langContent, locale, field_name) {
            var m_lang_val = "";
            var fIdx = _.findIndex(langContent, {locale: locale});
            if (fIdx > -1) {
                m_lang_val = langContent[fIdx][field_name] || "";
            }

            return m_lang_val;
        }
    }

});

/** 編輯新增Dialog Component **/
Vue.component('single-grid-pms0820020-tmp', {
    template: '#sigleGridPMS0820020Tmp',
    props: ['editStatus', 'createStatus', 'deleteStatus', 'editingRow', 'pageOneDataGridRows', 'pageTwoDataGridFieldData',
        'singleData', 'pageTwoFieldData', 'tmpCud', 'modificableForData'],
    data: function () {
        return {
            tmpCUD: {},
            isFistData: false,
            isLastData: false,
            dtDataGridIsCreate: false
        };
    },
    created: function () {
    },

    watch: {},
    methods: {
        //到第一筆
        toFirstData: function () {
            this.isFistData = true;
            this.isLastData = false;
            this.editingRow = _.first(this.pageOneDataGridRows);
            this.emitFetchSingleData();
        },

        //上一筆
        toPreData: function () {
            var nowRowIndex = $("#PMS0820020_dg").datagrid('getRowIndex', this.editingRow);
            this.editingRow = this.pageOneDataGridRows[nowRowIndex - 1];
            this.emitFetchSingleData();

        },

        //下一筆
        toNextData: function () {
            var nowRowIndex = $("#PMS0820020_dg").datagrid('getRowIndex', this.editingRow);
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
            var q = confirm("Are you sure delete those data?");
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

        },

        //關閉
        emitCloseGridDialog: function () {
            this.dtEditIndex = undefined;
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

        },

        //檢查欄位規則，在離開欄位時
        chkFieldRule: function (ui_field_name, rule_func_name) {

        }
    }
});


var PMS0820020VM = new Vue({
    el: '#GSApp',
    mounted: function () {
        this.initTmpCUD();
        this.fetchUserInfo();
        this.loadDataGridByPrgID(function (success) {
        });
        this.loadSingleGridPageField();
    },
    components: {
        "search-comp": go_searchComp
    },
    data: {
        isDatepickerInit: false,
        sys_locales: JSON.parse(decodeURIComponent(getCookie("sys_locales")).replace("j:", "")),
        createStatus: false,    //新增狀態
        editStatus: false,      //編輯狀態
        deleteStatus: false,    //刪除狀態
        isbatchAdd: false,      //是否為批次新增
        pageOneDataGridRows: [],//page_id 1 的 datagrid資料
        pageOneFieldData: [],   //page_id 1 datagird欄位
        pageTwoFieldData: [],   //page_id 2 欄位
        oriPageTwoFieldData: [],   //page_id 2 原始欄位資料
        pageTwoDataGridFieldData: [],   //page_id 2 datagird欄位
        editingRow: {},         //編輯中的資料
        userInfo: {},            //登入的使用者資料
        tmpCud: {               //新刪修暫存
            createData: [],
            editData: [],
            deleteData: []
        },
        originData: {},         //原始資料
        singleData: {},         //單檔資訊
        modificableForData: true,       //決定是否可以修改資料
        dgIns: {},
        labelPosition: 'right',
        searchFields: [], //搜尋的欄位
        searchCond: {}   //搜尋條件
    },
    methods: {
        //Init CUD
        initTmpCUD: function () {
            this.tmpCud = {
                createData: [],
                editData: [],
                deleteData: [],
                dt_createData: [],
                dt_editData: [],
                dt_deleteData: []
            };
        },
        //抓取顯示資料
        loadDataGridByPrgID: function (callback) {
            $.post("/api/prgDataGridDataQuery", {prg_id: prg_id, searchCond: this.searchCond}, function (result) {
                PMS0820020VM.searchFields = result.searchFields;
                PMS0820020VM.pageOneDataGridRows = result.dataGridRows;
                PMS0820020VM.pageOneFieldData = result.fieldData;
                PMS0820020VM.showCheckboxDG();
                PMS0820020VM.showDataGrid();
                callback(result.success);
            });
        },

        //顯示DataGrid
        showDataGrid: function () {

            this.dgIns = new DatagridRmSingleGridClass();
            this.dgIns.init(prg_id, 'PMS0820020_dg', EZfieldClass.combineFieldOption(this.pageOneFieldData, 'PMS0820020_dg'));
            this.dgIns.loadDgData(this.pageOneDataGridRows);
            // PMS0820020VM.pageOneDataGridRows = $("#dgCheckbox").datagrid('getRows');
        },

        //取得使用者資料
        fetchUserInfo: function () {
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    PMS0820020VM.userInfo = result.userInfo;
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

        //新增按鈕Event
        appendRow: function () {
            PMS0820020VM.initTmpCUD();
            PMS0820020VM.createStatus = true;
            PMS0820020VM.editStatus = false;
            PMS0820020VM.isbatchAdd = false;
            PMS0820020VM.singleData = {};
            PMS0820020VM.modificableForData = true;
            PMS0820020VM.pageTwoFieldData = _.values(_.groupBy(_.sortBy(go_Field_Data_Tmp, "row_seq"), "row_seq"));
            PMS0820020VM.oriPageTwoFieldData = go_Field_Data_Tmp;

            $.post("/api/addFuncRule", {prg_id: prg_id, page_id: 1}, function (result) {
                if (result.success) {
                    PMS0820020VM.singleData = result.defaultValues;
                    PMS0820020VM.showSingleGridDialog();
                } else {
                    alert(result.errorMsg);
                }
            });
        },

        //批次新增按鈕Event
        batchappendRow: function () {
            PMS0820020VM.initTmpCUD();
            PMS0820020VM.createStatus = true;
            PMS0820020VM.editStatus = false;
            PMS0820020VM.isbatchAdd = true;
            //PMS0820020VM.singleData = {account_length: 4, prefix : 'A', master_typ : 'A', cust_cod : '', show_cod : '', cust_nam : '', deposit_nos: '', deposit_nam: ''};  //改SA，先保留
            PMS0820020VM.singleData = {account_length: 4, prefix: 'A'};

            //塞欄位
            var fieldData = this.fetchBatchFieldData();

            PMS0820020VM.pageTwoFieldData = _.values(_.groupBy(_.sortBy(fieldData, "row_seq"), "row_seq"));
            PMS0820020VM.oriPageTwoFieldData = fieldData;

            PMS0820020VM.showSingleGridDialog();
        },

        //dg row刪除
        removeRow: function () {
            PMS0820020VM.tmpCud.deleteData = [];
            var checkRows = $('#dgCheckbox').datagrid('getSelections');
            if (checkRows == 0) {
                alert("Warning", 'Check at least one item');
                return;
            }
            var q = confirm("Are you sure delete those data?");
            if (q) {
                //刪除前檢查

                _.each(checkRows, function (row) {
                    PMS0820020VM.tmpCud.deleteData.push(row);
                });

                $.post("/api/deleteFuncRule", {
                    page_id: 1,
                    prg_id: prg_id,
                    deleteData: PMS0820020VM.tmpCud.deleteData
                }, function (result) {
                    if (result.success) {
                        //刪除Row
                        _.each(checkRows, function (row) {
                            var DelIndex = $('#PMS0820020_dg').datagrid('getRowIndex', row);
                            $('#PMS0820020_dg').datagrid('deleteRow', DelIndex);
                        });
                        PMS0820020VM.showCheckboxDG($("#PMS0820020_dg").datagrid("getRows"));
                        PMS0820020VM.doSaveCUD();
                    } else {
                        alert(result.errorMsg);
                    }

                });

            }

        },

        //資料驗證
        dataValidate: function () {
            var self = this;
            var lo_chkResult;

            for (var i = 0; i < this.oriPageTwoFieldData.length; i++) {
                var lo_field = this.oriPageTwoFieldData[i];
                //必填
                if (lo_field.requirable == "Y" && lo_field.modificable == "Y") {
                    lo_chkResult = go_validateClass.required(self.singleData[lo_field.ui_field_name], lo_field.ui_display_name);
                    if (lo_chkResult.success == false) {
                        break;
                    }
                }

                //有format
                if (lo_field.format_func_name != "") {
                    lo_chkResult = go_validateClass[lo_field.format_func_name](self.singleData[lo_field.ui_field_name], lo_field.ui_display_name);
                    if (lo_chkResult.success == false) {
                        break;
                    }
                }
            }
            return lo_chkResult;

        },
        //資料儲存
        doSaveCUD: function (callback) {
            if (PMS0820020VM.isbatchAdd) {
                var lo_chkResult = this.dataValidate();
                if (lo_chkResult.success == false && PMS0820020VM.tmpCud.deleteData.length == 0) {
                    alert(lo_chkResult.msg);
                    return;
                }
            }

            var self = this;
            waitingDialog.show('Saving...');

            var params = _.extend({prg_id: prg_id}, PMS0820020VM.tmpCud);
            $.post("/api/saveGridSingleData", params, function (result) {
                if (result.success) {
                    PMS0820020VM.initTmpCUD();
                    PMS0820020VM.loadDataGridByPrgID(function (success) {
                        callback(success);
                    });
                    alert('save success!');
                    waitingDialog.hide();

                } else {
                    waitingDialog.hide();
                    alert(result.errorMsg);
                }

            });

        },

        tempExecData: function (rowData) {
            vmHub.$emit("tempExecData", rowData);
        },

        //抓取page_id 2 單頁顯示欄位
        loadSingleGridPageField: function () {
            var self = this;
            $.post("/api/singleGridPageFieldQuery", {prg_id: prg_id, page_id: 2}, function (result) {
                var fieldData = _.clone(result.fieldData);
                go_Field_Data_Tmp = _.clone(result.fieldData);

                self.pageTwoFieldData = _.values(_.groupBy(_.sortBy(fieldData, "row_seq"), "row_seq"));

            });
        },

        //取得單筆資料
        fetchSingleData: function (editingRow, callback) {
            PMS0820020VM.initTmpCUD();
            PMS0820020VM.editStatus = true;
            PMS0820020VM.editingRow = editingRow;
            editingRow["prg_id"] = prg_id;
            $.post('/api/singlePageRowDataQuery', editingRow, function (result) {
                if (result.success) {
                    PMS0820020VM.singleData = result.rowData;
                    PMS0820020VM.originData = _.clone(result.rowData);
                    PMS0820020VM.modificableForData = result.isModifiable;
                    callback(true);

                } else {
                    PMS0820020VM.singleData = {};
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
            // this.initDatePicker();
            console.log(this.pageTwoFieldData);
            this.dialogVisible = true;
            var maxHeight = document.documentElement.clientHeight - 70; //browser 高度 - 70功能列
            var height = 10 * 50; // 預設一個row 高度
            var dialog = $("#sigleGridPMS0820020").dialog({
                autoOpen: false,
                modal: true,
                title: prg_id,
                minWidth: 1000,
                resizable: true,
                buttons: "#dialogBtns"
            });

            dialog.dialog("open");
            // 給 dialog "內容"高 值
           $(".singleGridContent").css("height", _.min([maxHeight, height]) + 20);
        },

        //關閉單檔dialog
        closeSingleGridDialog: function () {
            PMS0820020VM.editingRow = {};
            PMS0820020VM.singleData = {};
            PMS0820020VM.editStatus = false;
            PMS0820020VM.initTmpCUD();

            $("#sigleGridPMS0820020").dialog('close');
        }
    }

});

function editDtMultiLang(rowIdx) {
    vmHub.$emit('editDtMultiLang', {rowIdx: rowIdx});
}

Vue.filter("showDropdownDisplayName", function (val) {
});

var adpterDg = new AdapterDatagrid(PMS0820020VM);


function padLeft(str, lenght) {
    if (str.length >= lenght)
        return str;
    else
        return padLeft("0" + str, lenght);
}