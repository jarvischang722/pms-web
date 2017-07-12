/**
 * Created by Jun on 2017/2/23.
 */
var prg_id = gs_prg_id;
var vmHub = new Vue;
var gb_isUserEdit = true;

Vue.component("multi-lang-dialog-tmp", {
    template: '#multiLangDialogTmp',
    props: ['sys_locales', 'prgFieldDataAttr', 'updateMultiLangDG', 'endMultiLangEditing', 'tempExecData'],
    data: function () {
        return {};

    },
    created: function () {
        var self = this;
        vmHub.$on('getRowMultiLangContent', function (data) {
            self.getRowMultiLangContent(data.rowIdx);
        });
    },
    methods: {
        getRowMultiLangContent: function (rowIdx) {
            var self = this;
            var rowData = $('#prg_dg').datagrid("getRows")[rowIdx];
            var params = {
                rowData: rowData,
                prg_id: prg_id,
                page_id: 1
            };

            if (!_.isUndefined(rowData.createRow) && _.isEqual(rowData.createRow, "Y")) {
                var multiLangContent = [];
                _.each(this.sys_locales, function (locale) {
                    multiLangContent.push({
                        locale: locale.lang,
                        display_locale: locale.name
                    });
                });
                self.$emit('update-multi-lang-dg', {multiLangContent: multiLangContent});
                return;
            }

            $.post("/api/multiLangFieldContentByKey", params, function (result) {
                self.$emit('update-multi-lang-dg', result);
            });
        },
        closeMultiLangDialog: function () {
            $("#multiLangDialog").dialog("close");
        },
        //寫入此筆編輯Row
        saveMultiLang: function () {
            if (this.$emit('end-multi-lang-editing')) {
                var selectIndex = $('#prg_dg').datagrid("getRowIndex", $('#prg_dg').datagrid("getSelected"));
                var multiLang = $("#multiLangDG").datagrid("getRows");
                var updateRow = $('#prg_dg').datagrid("getSelected");
                updateRow["multiLang"] = multiLang;
                console.log(multiLang);
                $('#prg_dg').datagrid('updateRow', {
                    index: selectIndex,
                    row: updateRow
                });
                this.$emit('temp-exec-data', $('#prg_dg').datagrid("getSelected"));
                this.closeMultiLangDialog();
            }
        }
    }

});

var vm = new Vue({
    el: '#DGApp',
    mounted: function () {
        this.initTmpCUD();
        this.fetchDataGridData();
    },
    data: {
        prgFieldDataAttr: [],   //這隻程式的欄位屬性
        multiLangField: [],   //多語系欄位
        isTableLock: false,
        tableLockMsg: "",
        editIndex: undefined,
        multiLangEditIndex: undefined,
        tmpCUD: {},
        saving: false,
        sys_locales: JSON.parse(decodeURIComponent(getCookie("sys_locales")).replace("j:", ""))
    },
    watch: {
        prgFieldDataAttr: function (newVal) {
            this.multiLangField = _.filter(this.prgFieldDataAttr, function (field) {
                return field.multi_lang_table != "";
            });
        }
    },
    methods: {
        //
        initTmpCUD: function () {
            this.tmpCUD = {
                createData: [],
                updateData: [],
                deleteData: []
            };
        },
        //儲存欄位屬性
        doSaveColumnFields: function () {

            var saveField = [];
            var allField = $('#prg_dg').datagrid("getColumnFields");

            //過濾不用存的欄位
            allField = _.filter(allField, function (field) {
                return field != 'langAction';
            });

            _.each(allField, function (field, fIdx) {
                var currentColumOption = $('#prg_dg').datagrid("getColumnOption", field);
                var ui_type = currentColumOption.ui_type;
                var columnOption = {
                    "prg_id": prg_id,
                    "ui_field_name": field,
                    "ui_type": ui_type,
                    "col_seq": fIdx,
                    "visiable": "Y"
                };
                columnOption = _.extend(columnOption, currentColumOption);
                saveField.push(columnOption);
            });

            $.post("/api/saveFieldOptionByUser", {
                prg_id: prg_id,
                page_id: 1,
                fieldOptions: saveField
            });
        },
        //抓取顯示資料
        fetchDataGridData: function () {
            // waitingDialog.show();
            $.post("/api/prgDataGridDataQuery", {prg_id: prg_id}, function (result) {
                waitingDialog.hide();
                vm.prgFieldDataAttr = result.fieldData;
                vm.showDataGrid(result.fieldData, result.dataGridRows);
            });
        },
        //顯示資料
        showDataGrid: function (fieldData, dataGridRows) {
            var columnsData = EZfieldClass.combineFieldOption(fieldData,'prg_dg');
            var hasMultiLangField = _.filter(fieldData, function (field) {
                return field.multi_lang_table != "";
            }).length > 0 ? true : false;
            if (hasMultiLangField) {
                columnsData.push({
                    type: 'textbox',
                    title: "Multi Lang",
                    field: "langAction",
                    align: "center",
                    width: 100,
                    formatter: function (value, row, index) {
                        return '<a  href="javascript:void(0)" onclick="editFieldMultiLang(' + index + ')">Edit</a>';
                    }

                });
            }
            var dgData = {total: dataGridRows.length, rows: dataGridRows};
            $('#prg_dg').datagrid({
                columns: [columnsData],
                remoteSort: false,
                singleSelect: true,
                selectOnCheck: true,
                checkOnSelect: true,
                width: "100%",
                data: dgData,
                onClickCell: vm.onClickCell,
                onEndEdit: vm.onEndEdit,
                onDropColumn: vm.doSaveColumnFields, //當移動順序欄位時
                onResizeColumn: vm.doSaveColumnFields,  //當欄位時寬度異動時
                onSortColumn: function () {
                    $("#dgCheckbox").datagrid('uncheckAll');
                }

            }).datagrid('columnMoving');


        },
        //按下一個Row
        onClickCell: function (index, field) {

            if(gb_isUserEdit) {
                if (vm.editIndex != index) {
                    if (this.endEditing()) {
                        gb_isUserEdit =false;
                        $('#prg_dg').datagrid('selectRow', index)
                            .datagrid('beginEdit', index);
                        var ed = $('#prg_dg').datagrid('getEditor', {index: index, field: field});
                        if (ed) {
                            ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
                        }

                        vm.editIndex = index;
                    } else {
                        setTimeout(function () {
                            $('#prg_dg').datagrid('selectRow', vm.editIndex);
                        }, 0);
                    }
                }
                gb_isUserEdit =true;
            }
        },
        //結束編輯
        onEndEdit: function (index, row, changes) {
            this.tempExecData(row);
        },
        endEditing: function () {

            if (vm.editIndex == undefined) {
                return true;
            }
            if ($('#prg_dg').datagrid('validateRow', vm.editIndex)) {
                $('#prg_dg').datagrid('endEdit', vm.editIndex);
                vm.editIndex = undefined;
                return true;
            }
            return false;

        },
        //新增一個Row
        appendRow: function () {
            var gridDataInfo = $("#prg_dg").datagrid("getData");    //SAM 20170418 因新增時可能需要帶預設值且是由目前資料來判斷取得值，所以需取得所有資料
            if (this.endEditing()) {
                $.post("/api/handleDataGridAddEventRule", {
                    prg_id: prg_id,
                    gridDataInfo: gridDataInfo
                }, function (result) {
                    var prgDefaultObj = {createRow: 'Y'};
                    if (result.success) {
                        prgDefaultObj = result.prgDefaultObj;
                    }

                    $('#prg_dg').datagrid('appendRow', prgDefaultObj);
                    vm.editIndex = $('#prg_dg').datagrid('getRows').length - 1;
                    $('#prg_dg').datagrid('selectRow', vm.editIndex)
                        .datagrid('beginEdit', vm.editIndex);
                });
                $("#gridEdit").val(vm.tmpCUD);
            }
        },
        //刪除選定的Row
        removeRow: function removeRow() {
            var delRow = $('#prg_dg').datagrid('getSelected');
            if (!delRow) {
                alert("請選擇要刪除的資料");
            }

            vm.tmpCUD.deleteData.push(delRow);
            $("#gridEdit").val(vm.tmpCUD);

            $.post("/api/handleDataGridDeleteEventRule", {
                prg_id: prg_id,
                deleteData: vm.tmpCUD.deleteData
            }, function (result) {
                if (result.success) {
                    $('#prg_dg').datagrid('deleteRow', $('#prg_dg').datagrid('getRowIndex', delRow));
                } else {
                    vm.tmpCUD.deleteData = _.without(vm.tmpCUD.deleteData, delRow);  //刪除在裡面的暫存
                    vm.endEditing();
                    alert(result.errorMsg);
                }

            });

        },
        //儲存
        doSave: function () {
            if (this.endEditing()) {

                var params = {
                    prg_id: prg_id,
                    deleteData: vm.tmpCUD.deleteData,
                    createData: vm.tmpCUD.createData,
                    updateData: vm.tmpCUD.updateData
                };
                vm.saving = true;
                waitingDialog.show('Saving...');
                $.post("/api/saveDataRow", params, function (result) {
                    vm.saving = false;
                    waitingDialog.hide();
                    if (result.success) {
                        $('#prg_dg').datagrid('acceptChanges');
                        vm.initTmpCUD();
                        $("#gridEdit").val(null);
                        alert('save success!');
                        $("#prgContentDiv").load('/mainSetUp/' + prg_id + "?_r=" + Math.floor((Math.random() * 10000000000) + 1));
                    } else {
                        alert(result.errorMsg);
                    }
                });

            }
        },
        //回復
        reject: function () {
            $('#prg_dg').datagrid('rejectChanges');
            this.editIndex = undefined;
        },
        //獲取改變的Row
        getChanges: function () {
            var rows = $('#prg_dg').datagrid('getChanges');
        },
        //多語系編輯
        editFieldMultiLang: function (rowIdx) {
            vmHub.$emit("getRowMultiLangContent", {rowIdx: rowIdx});
            this.openMultiLangDialog();
        },
        //打開多語系編輯Dialog
        openMultiLangDialog: function () {
            var width = 500;
            var maxWidth = 700;
            var dialog = $("#multiLangDialog").dialog({
                autoOpen: false,
                modal: true,
                title: "Multi Language",
                height: 250,
                width: 750,
                maxWidth: _.min([width, maxWidth]),
                resizable: true,
                buttons: "#multiDialogBtns",
                zIndex: 1000

            });

            dialog.dialog("open");
        },
        updateMultiLangDG: function (data) {

            var multiLangDgData = _.uniq(data.multiLangContent);
            var columnsData = [{
                type: 'textbox',
                title: "Locale",
                field: "display_locale",
                width: 70,
                editor: {
                    options: {
                        readonly: true
                    }
                }
            }];

            columnsData = _.union(columnsData, EZfieldClass.combineFieldOption(this.multiLangField,'multiLangDG'));

            var widtd = 10;
            _.each(columnsData, function (column) {
                widtd += Number(column.width);
            });
            $('#multiLangDG').datagrid({
                columns: [columnsData],
                remoteSort: false,
                singleSelect: true,
                selectOnCheck: true,
                checkOnSelect: true,
                width: widtd,
                data: multiLangDgData,
                onClickCell: function (index, field) {
                    if (vm.multiLangEditIndex != index) {
                        if (vm.endMultiLangEditing()) {
                            $('#multiLangDG').datagrid('selectRow', index).datagrid('beginEdit', index);
                            var ed = $('#multiLangDG').datagrid('getEditor', {index: index, field: field});
                            if (ed) {
                                ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
                            }
                            vm.multiLangEditIndex = index;
                        }
                    }

                }
            });
        },
        endMultiLangEditing: function () {
            if (this.multiLangEditIndex == undefined) {
                return true;
            }
            if ($('#multiLangDG').datagrid('validateRow', vm.multiLangEditIndex)) {
                $('#multiLangDG').datagrid('endEdit', vm.multiLangEditIndex);
                vm.multiLangEditIndex = undefined;
                return true;
            }
            return false;

        },
        //將資料放入暫存
        tempExecData: function (rowData) {
            var dataType = rowData.createRow == 'Y'
                ? "createData" : "updateData";  //判斷此筆是新增或更新
            var keyVals = _.pluck(_.where(this.prgFieldDataAttr, {keyable: 'Y'}), "ui_field_name");
            var condKey = {};
            _.each(keyVals, function (field_name) {
                condKey[field_name] = rowData[field_name] || "";
            });
            //判斷資料有無在暫存裡, 如果有先刪掉再新增新的
            var existIdx = _.findIndex(this.tmpCUD[dataType], condKey);
            if (existIdx > -1) {
                this.tmpCUD[dataType].splice(existIdx, 1);
            }

            this.tmpCUD[dataType].push(rowData);
            $("#gridEdit").val(this.tmpCUD);
        }


    }
});

//打開多語視窗
function editFieldMultiLang(rowIdx) {
    vm.editFieldMultiLang(rowIdx);
}
