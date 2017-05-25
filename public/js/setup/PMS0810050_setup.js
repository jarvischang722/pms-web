/**
 * Created by Jun on 2017/5/23.
 */
waitingDialog.hide();
var prg_id = gs_prg_id;
var vueMain = new Vue({
    el: '#app',
    ready: function () {
        this.initTmpCUD();
        this.fetchDataGridData();
    },
    data: {
        gs_active: "pickup_tab",
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
                return field.multi_lang_table != ""
            })
        }
    },
    methods: {
        //
        initTmpCUD: function () {
            this.tmpCUD = {
                createData: [],
                updateData: [],
                deleteData: []
            }
        },
        //儲存欄位屬性
        doSaveColumnFields: function () {

            var saveField = [];
            var allField = $('#'+this.dgName).datagrid("getColumnFields");

            //過濾不用存的欄位
            allField = _.filter(allField, function (field) {
                return field != 'langAction'
            })

            _.each(allField, function (field, fIdx) {
                var currentColumOption = $('#'+this.dgName).datagrid("getColumnOption", field);
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
                // console.log(result);
                waitingDialog.hide();
                vueMain.prgFieldDataAttr = result.fieldData;
                vueMain.showDataGrid(result.fieldData, result.dataGridRows)
            });
        },
        //顯示資料
        showDataGrid: function (fieldData, dataGridRows) {
            var columnsData = EZfieldClass.combineFieldOption(fieldData);
            var dgData = {total: dataGridRows.length, rows: dataGridRows};
            var dgIns = new DatagridIns("pick_off_dg", fieldData);

            dgIns.dgIns();
            dgIns.initAttr();
            dgIns.updateDgData([{ins_usr:'a12222'}]);


            var dgIns2 = new DatagridIns("see_off_dg", fieldData);

            dgIns2.dgIns();
            dgIns2.initAttr();
            dgIns2.updateDgData([{ins_usr:'a5566'}]);
            //dgIns.updateDgData([{"arrive_cod": '1234'}]);


        },
        //按下一個Row
        onClickCell: function (index, field) {
            if (this.editIndex != index) {
                if (this.endEditing()) {
                    $('#'+this.dgName).datagrid('selectRow', index)
                        .datagrid('beginEdit', index);
                    var ed = $('#'+this.dgName).datagrid('getEditor', {index: index, field: field});
                    if (ed) {
                        ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
                    }
                    this.editIndex = index;
                } else {
                    setTimeout(function () {
                        $('#'+this.dgName).datagrid('selectRow', this.editIndex);
                    }, 0);
                }
            }


        },
        //結束編輯
        onEndEdit: function (index, row, changes) {
            this.tempExecData(row);
        },
        endEditing: function () {

            if (this.editIndex == undefined) {
                return true
            }
            if ($('#'+this.dgName).datagrid('validateRow', this.editIndex)) {
                $('#'+this.dgName).datagrid('endEdit', this.editIndex);
                this.editIndex = undefined;
                return true;
            } else {
                return false;
            }
        },
        //新增一個Row
        appendRow: function () {
            var dataCount = $("#prg_dg").datagrid("getData").total;    //SAM 20170418 因新增時可能需要帶預設值且是由目前資料來判斷取得值，所以需取得所有資料
            if (this.endEditing()) {
                $.post("/api/handleDataGridAddEventRule", {prg_id: prg_id}, function (result) {
                    var prgDefaultObj = {createRow: 'Y'};
                    if (result.success) {
                        prgDefaultObj = result.prgDefaultObj;
                    }
                    $('#'+this.dgName).datagrid('appendRow', prgDefaultObj);
                    this.editIndex = $('#'+this.dgName).datagrid('getRows').length - 1;
                    $('#'+this.dgName).datagrid('selectRow', this.editIndex)
                        .datagrid('beginEdit', this.editIndex);
                })
                $("#gridEdit").val(vueMain.tmpCUD);
            }
        },
        //刪除選定的Row
        removeRow: function removeRow() {
            var delRow = $('#'+this.dgName).datagrid('getSelected');
            if (!delRow) {
                alert("請選擇要刪除的資料");
            }

            vueMain.tmpCUD.deleteData.push(delRow);
            $("#gridEdit").val(vueMain.tmpCUD);

            $.post("/api/handleDataGridDeleteEventRule", {
                prg_id: prg_id,
                deleteData: vueMain.tmpCUD.deleteData
            }, function (result) {
                if (result.success) {
                    $('#'+this.dgName).datagrid('deleteRow', $('#'+this.dgName).datagrid('getRowIndex', delRow));
                } else {
                    vueMain.tmpCUD.deleteData = _.without(vueMain.tmpCUD.deleteData, delRow);  //刪除在裡面的暫存
                    vueMain.endEditing();
                    alert(result.errorMsg);
                }

            })

        },
        //儲存
        doSave: function () {
            if (this.endEditing()) {

                var params = {
                    prg_id: prg_id,
                    deleteData: vueMain.tmpCUD.deleteData,
                    createData: vueMain.tmpCUD.createData,
                    updateData: vueMain.tmpCUD.updateData
                }
                vueMain.saving = true;
                waitingDialog.show('Saving...');
                $.post("/api/saveDataRow", params, function (result) {
                    vueMain.saving = false;
                    waitingDialog.hide();
                    if (result.success) {
                        $('#'+this.dgName).datagrid('acceptChanges');
                        vueMain.initTmpCUD();
                        $("#gridEdit").val(null);
                        alert('save success!');
                    } else {
                        alert(result.errorMsg);
                    }
                })

            }
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
                buttons: "#multiDialogBtns"

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

            columnsData = _.union(columnsData, EZfieldClass.combineFieldOption(this.multiLangField));

            var widtd = 10;
            _.each(columnsData, function (column) {
                widtd += Number(column.width);
            })
            $('#multiLangDG').datagrid({
                columns: [columnsData],
                remoteSort: false,
                singleSelect: true,
                selectOnCheck: true,
                checkOnSelect: true,
                width: widtd,
                data: multiLangDgData,
                onClickCell: function (index, field) {
                    if (vueMain.multiLangEditIndex != index) {
                        if (vueMain.endMultiLangEditing()) {
                            $('#multiLangDG').datagrid('selectRow', index).datagrid('beginEdit', index);
                            var ed = $('#multiLangDG').datagrid('getEditor', {index: index, field: field});
                            if (ed) {
                                ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
                            }
                            vueMain.multiLangEditIndex = index;
                        }
                    }

                }
            })
        },
        endMultiLangEditing: function () {
            if (this.multiLangEditIndex == undefined) {
                return true
            }
            if ($('#multiLangDG').datagrid('validateRow', vueMain.multiLangEditIndex)) {
                $('#multiLangDG').datagrid('endEdit', vueMain.multiLangEditIndex);
                vueMain.multiLangEditIndex = undefined;
                return true;
            } else {
                return false;
            }
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


$(function () {

    $('#traffic_tab').tabs({
        border: true,
        onSelect: function (title, index) {
            if (index == 0) {
                gs_active = 'pickup_tab'
            } else {
                gs_active = 'seeup_tab'
            }
        }
    });

    // 交通接駁設定-接 dataGrid
    $('#trafficConnect-get-table').datagrid({
        singleSelect: true,
        collapsible: true,
        // 從json 撈
        url: '/jsonData/trafficConnection-get.json',
        method: 'get',
        columns: [[
            {field: 'code', title: '代號', width: 100},
            {field: 'connectPlace', title: '接駁地點', width: 100},
            {field: 'connectTime', title: '接駁時間', width: 100},
            {field: 'Mon', title: 'Mon', width: 50},
            {field: 'Tue', title: 'Tue', width: 50},
            {field: 'Wed', title: 'Wed', width: 50},
            {field: 'Thu', title: 'Thu', width: 50},
            {field: 'Fri', title: 'Fri', width: 50},
            {field: 'Sat', title: 'Sat', width: 50},
            {field: 'Sun', title: 'Sun', width: 50},
            {field: 'companyRemark', title: '公司備註', width: 300},
            {field: 'remark', title: '備註', width: 300}
        ]]

    });

    // 交通接駁設定-送 dataGrid
    $('#trafficConnect-giveAway-table').datagrid({
        singleSelect: true,
        collapsible: true,
        // 從json 撈
        url: '/jsonData/trafficConnection-giveAway.json',
        method: 'get',
        columns: [[
            {field: 'code', title: '代號', width: 100},
            {field: 'startPlace', title: '出發地點', width: 100},
            {field: 'startTime', title: '出發時間', width: 100},
            {field: 'arrivePlace', title: '抵達地點', width: 100},
            {field: 'arriveTime', title: '抵達時間', width: 100},
            {field: 'Mon', title: 'Mon', width: 50},
            {field: 'Tue', title: 'Tue', width: 50},
            {field: 'Wed', title: 'Wed', width: 50},
            {field: 'Thu', title: 'Thu', width: 50},
            {field: 'Fri', title: 'Fri', width: 50},
            {field: 'Sat', title: 'Sat', width: 50},
            {field: 'Sun', title: 'Sun', width: 50},
            {field: 'companyRemark', title: '公司備註', width: 300},
            {field: 'remark', title: '備註', width: 300}
        ]]

    });

});


var DatagridIns = function (dgName, fieldData) {
    var self = this;
    this.dgName = dgName;

    this.fieldData = fieldData;

    this.editIndex = undefined;

    this.dgIns = function (){
       return $('#'+dgName).datagrid()
    };
    this.initAttr = function(){
          this.dgIns().datagrid({
            columns: [EZfieldClass.combineFieldOption(this.fieldData)],
            remoteSort: false,
            singleSelect: true,
            selectOnCheck: true,
            checkOnSelect: true,
            width: "100%",
            onClickCell:  self.onClickCell
            // onEndEdit: this.onEndEdit,
            // onDropColumn: this.doSaveColumnFields, //當移動順序欄位時
            // onResizeColumn: this.doSaveColumnFields,  //當欄位時寬度異動時
            // onSortColumn: function () {
            //     $("#dgCheckbox").datagrid('uncheckAll');
            // }
        }).datagrid('columnMoving');
    }

    //按下一個Row
    this.onClickCell = function (index, field) {

        if (this.editIndex != index) {
            if (self.endEditing()) {
                $('#'+self.dgName).datagrid('selectRow', index)
                    .datagrid('beginEdit', index);
                var ed = $('#'+self.dgName).datagrid('getEditor', {index: index, field: field});
                if (ed) {
                    ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
                }
                self.editIndex = index;
            } else {
                setTimeout(function () {
                    $('#'+self.dgName).datagrid('selectRow', self.editIndex);
                }, 0);
            }
        }


    };
    //結束編輯
    this.onEndEdit = function (index, row, changes) {
       // this.tempExecData(row);
    };
    // 確認是否可以結束編輯
    this.endEditing = function () {

        if (self.editIndex == undefined) {
            return true
        }
        if ($('#'+self.dgName).datagrid('validateRow', self.editIndex)) {
            $('#'+self.dgName).datagrid('endEdit', self.editIndex);
            self.editIndex = undefined;
            return true;
        } else {
            return false;
        }
    };
    //新增一個Row
    this.appendRow = function () {
        var dataCount = $('#'+this.dgName).datagrid("getData").total;    //SAM 20170418 因新增時可能需要帶預設值且是由目前資料來判斷取得值，所以需取得所有資料
        if (this.endEditing()) {
            $.post("/api/handleDataGridAddEventRule", {prg_id: prg_id}, function (result) {
                var prgDefaultObj = {createRow: 'Y'};
                if (result.success) {
                    prgDefaultObj = result.prgDefaultObj;
                }
                $('#'+this.dgName).datagrid('appendRow', prgDefaultObj);
                this.editIndex = $('#'+this.dgName).datagrid('getRows').length - 1;
                $('#'+this.dgName).datagrid('selectRow', this.editIndex)
                    .datagrid('beginEdit', this.editIndex);
            })
            // $("#gridEdit").val(vueMain.tmpCUD);
        }
    };
    //刪除選定的Row
    this.removeRow = function removeRow() {
        var delRow = $('#'+this.dgName).datagrid('getSelected');
        if (!delRow) {
            alert("請選擇要刪除的資料");
        }

        vueMain.tmpCUD.deleteData.push(delRow);
        $("#gridEdit").val(vueMain.tmpCUD);

        $.post("/api/handleDataGridDeleteEventRule", {
            prg_id: prg_id,
            deleteData: vueMain.tmpCUD.deleteData
        }, function (result) {
            if (result.success) {
                $('#'+self.dgName).datagrid('deleteRow', $('#'+self.dgName).datagrid('getRowIndex', delRow));
            } else {
                vueMain.tmpCUD.deleteData = _.without(vueMain.tmpCUD.deleteData, delRow);  //刪除在裡面的暫存
                vueMain.endEditing();
                alert(result.errorMsg);
            }

        })

    };

    this.updateDgData = function (dataGridRows) {
        var dgData = {total: dataGridRows.length, rows: dataGridRows};
        $('#' + this.dgName).datagrid("loadData", dgData)
    };



};

