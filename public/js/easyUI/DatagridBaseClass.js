/**
 * Created by Jun Chang on 2017/5/26.
 * 基本的Datagrid新增刪除修改
 * Base on EasyUI
 * Dependency package : underscore.js
 *
 */

function DatagridBaseClass() {
    var self = this;

    this.tmpCUD = {
        createData: [],
        updateData: [],
        deleteData: []
    };
    this.dgName = "";
    this.prg_id = "";
    this.page_id = 1;
    this.fieldData = [];
    this.editIndex = undefined;

    //datagrid 初始化
    this.init = function (prg_id, dgName, columns) {
        self.prg_id = prg_id;
        self.dgName = dgName;
        self.columns = columns;
        $('#' + dgName).datagrid({
            columns: [columns],
            remoteSort: false,
            singleSelect: true,
            selectOnCheck: true,
            checkOnSelect: true,
            width: "100%",
            onClickCell: this.onClickCell,
            onClickRow: this.onClickRow,
            onEndEdit: this.onEndEdit,
            onDropColumn: this.doSaveColumnFields,    //當移動順序欄位時
            onResizeColumn: this.doSaveColumnFields,  //當欄位時寬度異動時
            onSortColumn: this.doSortColumn
        }).datagrid('columnMoving');
    };




    /**
     * 新刪修暫存容器 初始化
     */
    this.initTmpCUD = function () {
        self.tmpCUD = {
            createData: [],
            updateData: [],
            deleteData: []
        };
    };
    /**
     * 按下一個Row
     * @param index
     * @param field
     */
    this.onClickCell = function (index, field) {
        console.log(self.dgName);
        if (self.editIndex != index) {
            if (self.endEditing()) {
                $('#' + self.dgName).datagrid('selectRow', index)
                    .datagrid('beginEdit', index);
                var ed = $('#' + self.dgName).datagrid('getEditor', {index: index, field: field});
                if (ed) {
                    ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
                }

                self.editIndex = index;
            } else {
                setTimeout(function () {
                    $('#' + self.dgName).datagrid('selectRow', self.editIndex);
                }, 0);
            }
        }


    };
    /**
     * 讀取資料到datagrid 顯示
     * @param dataGridRows{Array} : 資料集
     */
    this.loadDgData = function (dataGridRows) {
        var dgData = {total: dataGridRows.length, rows: dataGridRows};
        $('#' + this.dgName).datagrid("loadData", dgData);
    };

//結束編輯
    this.onEndEdit = function (index, row, changes) {
        /** 讓子類別實作這個方法 interface 概念 **/
        row = self.filterRowData(row);
        self.doTmpExecData(row);

    };

    /**
     * 過濾一筆資料
     * @param rowData {Object} : 每一筆資料
     * @return rowData
     */
    this.filterRowData = function (rowData) {
        var lao_columns = self.columns;
        _.each(rowData, function (val, key) {
            if (_.findIndex(lao_columns, {field: key}) > -1
                && _.findWhere(lao_columns, {field: key}).ui_type == 'time') {
                rowData[key] = val.replace(":", "");
            }
        });
        return rowData;
    };
    /**
     * 確認是否可以結束編輯
     * @return {boolean}
     */
    this.endEditing = function () {
        if (this.editIndex == undefined) {
            return true;
        }
        if ($('#' + this.dgName).datagrid('validateRow', this.editIndex)) {
            $('#' + this.dgName).datagrid('endEdit', this.editIndex);
            this.editIndex = undefined;
            return true;
        }
        return false;

    };

    /**
     * 排序觸發事件
     */
    this.doSortColumn = function () {
    };

    /**
     * 按下Row 事件
     * @param index {Number}
     * @param row  {Object}
     */
    this.onClickRow = function (index, row) {};


    /**
     * 新增一個Row
     */
    this.appendRow = function () {
        if (self.endEditing()) {
            $.post("/api/handleDataGridAddEventRule", {prg_id: self.prg_id}, function (result) {
                var prgDefaultObj = {createRow: 'Y'};
                if (result.success) {
                    prgDefaultObj = result.prgDefaultObj;
                }
                $('#' + self.dgName).datagrid('appendRow', prgDefaultObj);
                self.editIndex = $('#' + self.dgName).datagrid('getRows').length - 1;
                $('#' + self.dgName).datagrid('selectRow', self.editIndex)
                    .datagrid('beginEdit', self.editIndex);
            });
            // $("#gridEdit").val(self.tmpCUD);
        }
    };
    /**
     * 刪除選定的Row
     */
    this.removeRow = function removeRow() {
        var delRow = $('#' + this.dgName).datagrid('getSelected');
        if (!delRow) {
            alert("請選擇要刪除的資料");
        }

        self.tmpCUD.deleteData.push(delRow);
        $("#gridEdit").val(self.tmpCUD);

        $.post("/api/handleDataGridDeleteEventRule", {
            prg_id: self.prg_id,
            deleteData: self.tmpCUD.deleteData
        }, function (result) {
            if (result.success) {
                $('#' + self.dgName).datagrid('deleteRow', $('#' + self.dgName).datagrid('getRowIndex', delRow));
            } else {
                self.tmpCUD.deleteData = _.without(self.tmpCUD.deleteData, delRow);  //刪除在裡面的暫存
                vueMain.endEditing();
                alert(result.errorMsg);
            }

        });

    };


    /**
     * 儲存個人化欄位屬性
     */
    this.doSaveColumnFields = function () {

        var saveField = [];
        var allField = $('#' + self.dgName).datagrid("getColumnFields");

        //過濾不用存的欄位
        allField = _.filter(allField, function (field) {
            return field != 'langAction';
        });

        _.each(allField, function (field, fIdx) {
            var currentColumOption = $('#' + self.dgName).datagrid("getColumnOption", field);
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
            prg_id: self.prg_id,
            page_id: self.page_id,
            fieldOptions: saveField
        });
    };

    /**
     * 將資料放入暫存
     * @param rowData 要處理的那筆資料
     */
    this.doTmpExecData = function (rowData) {
        var dataType = rowData.createRow == 'Y'
            ? "createData" : "updateData";  //判斷此筆是新增或更新
        var keyVals = _.pluck(_.where(this.columns, {keyable: 'Y'}), "field");
        var condKey = {};
        _.each(keyVals, function (field_name) {
            condKey[field_name] = rowData[field_name] || "";
        });
        //判斷資料有無在暫存裡, 如果有先刪掉再新增新的
        var existIdx = _.findIndex(self.tmpCUD[dataType], condKey);
        if (existIdx > -1) {
            this.tmpCUD[dataType].splice(existIdx, 1);
        }
        self.tmpCUD[dataType].push(rowData);
        $("#gridEdit").val(self.tmpCUD);
    };
}