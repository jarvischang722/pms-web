/**
 * Created by Jun on 2017/2/23.
 */
var prg_id = $("#prg_Id").data("prg_id");
var vmHub = new Vue;
var gb_isUserEdit4ClickCell = true;
var gb_isUserEdit4EndEdit = true;
var gb_isUserEdit4tempExecData = true;
var go_FuncPur = new FuncPurview(prg_id);


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


            //新增欄位，預設多語系欄位
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

            var existIdx = this.$parent.chkTmpCudExistData(rowData, "updateData");
            var lb_getFromAPI = true;
            try {
                if (_.isUndefined(vm.tmpCUD.updateData[existIdx].multiLang)) {
                    lb_getFromAPI = true;
                }
                else {
                    lb_getFromAPI = false;
                }
            }
            catch (err) {
                lb_getFromAPI = true;
            }
            if (lb_getFromAPI) {
                // 取多語系資料
                $.post("/api/multiLangFieldContentByKey", params, function (result) {
                    self.$emit('update-multi-lang-dg', result);
                });
            }
            // 有資料，顯示暫存資料
            else {
                self.$emit('update-multi-lang-dg', {multiLangContent: self.$parent.tmpCUD.updateData[existIdx].multiLang});

            }
        },
        closeMultiLangDialog: function () {
            this.$parent.multiLangDialogVisible = false;
        },
        //寫入此筆編輯Row
        saveMultiLang: function () {
            if (this.$emit('end-multi-lang-editing')) {
                var selectIndex = $('#prg_dg').datagrid("getRowIndex", $('#prg_dg').datagrid("getSelected"));
                var multiLang = $("#multiLangDG").datagrid("getRows");
                var updateRow = $('#prg_dg').datagrid("getSelected");

                updateRow["multiLang"] = multiLang;
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
    el: '#datagridApp',
    mounted: function () {
        this.initTmpCUD();
        this.fetchDataGridData();
    },
    components: {
        "search-comp": go_searchComp
    },
    data: {
        prgFieldDataAttr: [],   //這隻程式的欄位屬性
        multiLangField: [],   //多語系欄位
        isTableLock: false,
        tableLockMsg: "",
        editIndex: undefined,
        multiLangEditIndex: undefined,
        tmpCUD: {},
        sys_locales: JSON.parse(decodeURIComponent(getCookie("sys_locales")).replace("j:", "")),
        openChangeLogDialog: false,
        allChangeLogList: [],
        searchFields: [], //搜尋的欄位
        searchCond: {},   //搜尋條件
        multiLangDialogVisible: false,
        isLoading: false,
        dataGridRows: []
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
                currentColumOption.col_seq = fIdx;
                saveField.push(_.extend(currentColumOption));
            });

            $.post("/api/saveFieldOptionByUser", {
                prg_id: prg_id,
                page_id: 1,
                fieldOptions: saveField
            });
        },

        //抓取顯示資料
        fetchDataGridData: function () {
            $.post("/api/prgDataGridDataQuery", {prg_id: prg_id, searchCond: this.searchCond}, function (result) {
                vm.searchFields = result.searchFields;
                vm.prgFieldDataAttr = result.fieldData;
                vm.dataGridRows = JSON.parse(JSON.stringify(result.dataGridRows));
                vm.showDataGrid(result.fieldData, result.dataGridRows);
            });
        },
        //顯示資料
        showDataGrid: function (fieldData, dataGridRows) {
            var columnsData = DatagridFieldAdapter.combineFieldOption(fieldData, 'prg_dg');
            var hasMultiLangField = _.filter(fieldData, function (field) {
                return field.multi_lang_table != "";
            }).length > 0 ? true : false;
            if (hasMultiLangField) {
                columnsData.unshift({
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
                // width: "100%", // error:左側打開後table會擠壓到右側欄位
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
            if (vm.editIndex != index) {

                if (this.endEditing() && gb_isUserEdit4ClickCell) {

                    gb_isUserEdit4ClickCell = false;
                    gb_isUserEdit4EndEdit = true;


                    $('#prg_dg').datagrid('selectRow', index).datagrid('beginEdit', index);
                    var ed = $('#prg_dg').datagrid('getEditor', {index: index, field: field});
                    if (ed) {
                        ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
                    }
                    vm.editIndex = index;
                } else {
                    gb_isUserEdit4ClickCell = false;
                    gb_isUserEdit4EndEdit = true;

                    setTimeout(function () {
                        $('#prg_dg').datagrid('selectRow', vm.editIndex);
                    }, 0);
                }
                gb_isUserEdit4ClickCell = true;
            }
        },
        //結束編輯
        onEndEdit: function (index, row, changes) {
            this.dataGridRows[index].ins_dat = moment(this.dataGridRows[index].ins_dat).format("YYYY/MM/DD HH:mm:ss");
            this.dataGridRows[index].upd_dat = moment(this.dataGridRows[index].upd_dat).format("YYYY/MM/DD HH:mm:ss");
            if (!_.isMatch(this.dataGridRows[index], row)) {
                if (gb_isUserEdit4EndEdit) {
                    gb_isUserEdit4EndEdit = false;
                    var dataType = row.createRow == 'Y'
                        ? "createData" : "updateData";  //判斷此筆是新增或更新
                    if (dataType != "createData") {
                        var tmpCUD_index = this.chkTmpCudExistData(row, dataType);  // 檢查是否有暫存
                        var lb_multiLangExist = true;                               // 是否有多語系
                        var la_multiLangTmp = [];

                        try {
                            var chkMultiLang = this.tmpCUD[dataType][tmpCUD_index].multiLang;
                            lb_multiLangExist = true;
                        }
                        catch (err) {
                            lb_multiLangExist = false;
                        }

                        // 產生所有語系資料
                        _.each(this.sys_locales, function (locales) {
                            la_multiLangTmp.push({
                                display_locale: locales.name,
                                locale: locales.lang
                            });
                        });

                        // dataGrid 多語系欄位有修改 且 暫存沒有多語系資料
                        // 則一起儲存進多語系
                        _.each(this.multiLangField, function (multiLangField) {
                            if (!_.isUndefined(changes[multiLangField.ui_field_name]) && !lb_multiLangExist) {
                                _.each(la_multiLangTmp, function (tmpLang) {
                                    if (tmpLang.locale == gs_locale) {
                                        tmpLang[multiLangField.ui_field_name] = changes[multiLangField.ui_field_name];
                                    }
                                });
                                row.multiLang = la_multiLangTmp;
                                self.dataGridRows.multiLang = la_multiLangTmp;
                            }
                        });
                    }
                    gb_isUserEdit4EndEdit = true;
                    this.tempExecData(row);
                }
            }
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
                    var prgDefaultObj = {};
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
        removeRow: function () {
            var delRow = $('#prg_dg').datagrid('getSelected');
            if (!delRow) {
                alert("請選擇要刪除的資料");
            }

            if (delRow.createRow == 'Y') {    //如果刪除此次新建的資料，則直接刪除即可。
                $('#prg_dg').datagrid('deleteRow', $('#prg_dg').datagrid('getRowIndex', delRow));
                vm.tmpCUD.createData = _.without(vm.tmpCUD.createData, delRow);  //SAM 20170805刪除新增資料
                vm.endEditing();
                vm.editIndex = undefined;
            }
            else {
                vm.tmpCUD.deleteData.push(delRow);
                $("#gridEdit").val(vm.tmpCUD);

                $.post("/api/handleDataGridDeleteEventRule", {
                    prg_id: prg_id,
                    deleteData: vm.tmpCUD.deleteData
                }, function (result) {
                    if (result.success) {
                        $('#prg_dg').datagrid('deleteRow', $('#prg_dg').datagrid('getRowIndex', delRow));
                        vm.editIndex = undefined;//SAM
                    } else {
                        vm.tmpCUD.deleteData = _.without(vm.tmpCUD.deleteData, delRow);  //刪除在裡面的暫存
                        vm.endEditing();
                        alert(result.errorMsg);
                    }

                });
            }
        },
        //儲存
        doSave: function () {
            var self = this;
            if (this.endEditing()) {
                var params = {
                    prg_id: prg_id,
                    deleteData: vm.tmpCUD.deleteData,
                    createData: vm.tmpCUD.createData,
                    updateData: vm.tmpCUD.updateData
                };
                this.isLoading = true;
                $.post("/api/saveDataRow", params, function (result) {
                    self.isLoading = false;
                    if (result.success) {
                        $('#prg_dg').datagrid('acceptChanges');
                        vm.initTmpCUD();
                        self.fetchDataGridData();
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
            this.multiLangDialogVisible = true;
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

            columnsData = _.union(columnsData, DatagridFieldAdapter.combineFieldOption(this.multiLangField, 'multiLangDG'));

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
            if (gb_isUserEdit4tempExecData) {
                gb_isUserEdit4tempExecData = false;
                var dataType = rowData.createRow == 'Y'
                    ? "createData" : "updateData";  //判斷此筆是新增或更新
                var existIdx = this.chkTmpCudExistData(rowData, dataType);
                if (existIdx > -1) {
                    this.tmpCUD[dataType].splice(existIdx, 1);
                }

                this.tmpCUD[dataType].push(rowData);
                $("#gridEdit").val(this.tmpCUD);

                gb_isUserEdit4ClickCell = true;
                gb_isUserEdit4tempExecData = true;
            }
        },
        // 檢查暫存是否有資料
        chkTmpCudExistData: function (rowData, dataType) {


            gb_isUserEdit4tempExecData = true;
            var keyVals = _.pluck(_.where(this.prgFieldDataAttr, {keyable: 'Y'}), "ui_field_name");
            var condKey = {};
            _.each(keyVals, function (field_name) {
                condKey[field_name] = rowData[field_name] || "";
            });
            //判斷資料有無在暫存裡, 如果有先刪掉再新增新的
            var existIdx = _.findIndex(this.tmpCUD[dataType], condKey);
            return existIdx;

        },
        loadChangeLog: function () {
            this.openChangeLogDialog = true;
            $.post("/api/getSetupPrgChangeLog", {prg_id: prg_id}, function (result) {
                vm.allChangeLogList = result.allChangeLogList;
            });
        }

    }

});

//打開多語視窗
function editFieldMultiLang(rowIdx) {
    vm.editFieldMultiLang(rowIdx);
}

var adpterDg = new DatagridAdapter(vm);

/**
 * 某種情況下datagrid裡驗證格式錯誤的tip會卡住不動
 * 站無解決辦法，故寫一個interval每五秒去關掉所有tips
 */
if (prg_id == 'PMS0810030') {
    setInterval(function () {
        $(".tooltip-right").remove();
    }, 5000);
}
