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
        deleteData: [],
        oriData: []
    };
    this.dgName = "";
    this.prg_id = "";
    this.page_id = 1;
    this.fieldsData = [];
    this.editIndex = undefined;
    this.mnRowData = {};
    this.dtOriRowData = [];

    /**
     * datagrid 初始化
     * @param prg_id {String} : 程式編號
     * @param dgName {String} : datagrid Table name
     * @param columns {Array} : 給datagrid讀取的欄位
     * @param fieldsData {Array} : 程式所有欄位資訊
     * @param options {Object} : 選項
     */
    this.init = function (prg_id, dgName, columns, fieldsData, options) {
        self.prg_id = prg_id;
        self.dgName = dgName;
        self.columns = columns;
        self.fieldsData = fieldsData;

        if (!options) {
            options = {};
        }
        $('#' + dgName).datagrid({
            columns: [columns],
            remoteSort: false,
            singleSelect: !_.isUndefined(options.singleSelect) ? options.singleSelect : true,
            selectOnCheck: !_.isUndefined(options.selectOnCheck) ? options.singleSelect : true,
            checkOnSelect: !_.isUndefined(options.checkOnSelect) ? options.singleSelect : true,
            //width: "100%", // error:左側打開後table會擠壓到右側欄位
            onClickCell: this.onClickCell,
            onClickRow: this.onClickRow,
            onEndEdit: this.onEndEdit,
            onDropColumn: this.doSaveColumnFields,    //當移動順序欄位時
            onResizeColumn: this.doSaveColumnFields,  //當欄位時寬度異動時
            onSortColumn: this.doSortColumn,
            onSelect: this.onSelect
        }).datagrid('columnMoving');

    };


    /**
     * 新刪修暫存容器 初始化
     */
    this.initTmpCUD = function () {
        self.tmpCUD = {
            createData: [],
            updateData: [],
            deleteData: [],
            oriData: []
        };
    };

    /**
     * 讀取資料到datagrid 顯示
     * @param dataGridRows{Array} : 資料集
     */
    this.loadDgData = function (dataGridRows) {
        var dgData = {total: dataGridRows.length, rows: dataGridRows};
        $('#' + this.dgName).datagrid("loadData", dgData);
    };

    /**
     * 按下一個Row
     * @param index
     * @param field
     */
    this.onClickCell = function (index, field) {
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
     * 勾起一個Row
     * @param index
     * @param field
     */
    this.onSelect = function (index, field) {
    };

    //結束編輯
    this.onEndEdit = function (index, row, changes) {
        /** 讓子類別實作這個方法 interface 概念 **/
        self.editIndex = index;
        row = self.filterRowData(row);
        self.doTmpExecData(row, index);
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
     * 排序觸發事件
     */
    this.doSortColumn = function () {
    };

    /**
     * 按下Row 事件
     * @param index {Number}
     * @param row  {Object}
     */
    this.onClickRow = function (index, row) {

        var la_timeField = _.where(self.fieldsData, {ui_type: "time"});
        _.each(la_timeField, function (lo_timeField) {
            var ls_field_name = String(row[lo_timeField.ui_field_name]) || "";
            if (ls_field_name != "") {

                if (ls_field_name.indexOf(":") == -1) {
                    var hour = ls_field_name.substring(0, 2);
                    var min = ls_field_name.substring(2, 4);

                    ls_field_name = hour + ":" + min;
                }
            }
            var editors = $('#' + self.dgName).datagrid('getEditors', index);
            var lo_editor = _.findWhere(editors, {field: lo_timeField.ui_field_name});

            if (!_.isUndefined(lo_editor)) {
                $(lo_editor.target).textbox('setValue', ls_field_name);
            }

        });
    };

    /**
     * 新增一個Row
     */
    this.appendRow = function (callback) {
        if (_.isUndefined(callback)) {
            callback = function (result) {
            };
        }
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
                callback(true);
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
            alert(go_i18nLang["SystemCommon"].SelectData);
        }

        delRow = _.extend(delRow, self.mnRowData);
        delRow = this.insertKeyRowData(delRow);

        if (delRow.createRow != 'Y') {
            self.tmpCUD.deleteData.push(delRow);
        }
        else if (delRow.createRow == 'Y') {

            var keyVals = _.pluck(_.where(this.fieldsData, {keyable: 'Y'}), "ui_field_name");
            var condKey = {};
            _.each(keyVals, function (field_name) {
                condKey[field_name] = delRow[field_name] || "";
            });

            //判斷資料有無在暫存裡, 如果有先刪掉再新增新的
            var existIdx = _.findIndex(self.tmpCUD.createData, condKey);

            if (existIdx > -1) {
                this.tmpCUD.createData.splice(existIdx, 1);
            }
        }

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
            var lo_currentColumOption = JSON.parse(JSON.stringify(currentColumOption));
            lo_currentColumOption.col_seq = fIdx;
            delete lo_currentColumOption._id;

            //因前檯小數關係，format_func_name可能是object，存進mongo前的前置處理
            if (typeof lo_currentColumOption.format_func_name === "object") {
                lo_currentColumOption.format_func_name = lo_currentColumOption.format_func_name.rule_name;
            }

            saveField.push(_.extend(lo_currentColumOption));
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
    this.doTmpExecData = function (rowData, index) {

        var lo_chkKeyRowData = JSON.parse(JSON.stringify(rowData));

        lo_chkKeyRowData = _.extend(lo_chkKeyRowData, this.mnRowData);
        // rowData = _.extend(rowData, this.mnRowData);

        var dataType = _.isUndefined(lo_chkKeyRowData.createRow) || lo_chkKeyRowData.createRow != "Y" ?
            "updateData" : "createData";

        var keyVals = _.pluck(_.where(this.fieldsData, {keyable: 'Y'}), "ui_field_name");
        var condKey = {};
        _.each(keyVals, function (field_name) {
            condKey[field_name] = lo_chkKeyRowData[field_name] || "";
        });

        //判斷資料有無在暫存裡, 如果有先刪掉
        var existIdx = _.findIndex(self.tmpCUD[dataType], condKey);
        if (existIdx > -1) {
            if (this.dtOriRowData.length != 0) {
                self.tmpCUD.oriData.splice(existIdx, 1);
            }
            this.tmpCUD[dataType].splice(existIdx, 1);
        }

        // 作業才需要判斷舊值
        if (this.dtOriRowData.length != 0) {
            //判斷資料有無跟原始資料重複
            var existOriIdx = _.findIndex(self.dtOriRowData, condKey);
            if (dataType == "updateData") {
                if (existOriIdx > -1 && existIdx == -1) {
                    self.tmpCUD.oriData.splice(existOriIdx, 1);
                    this.tmpCUD[dataType].splice(existOriIdx, 1);
                }
                lo_chkKeyRowData = this.insertKeyRowData(lo_chkKeyRowData);
                self.tmpCUD[dataType].splice(existOriIdx, 0, lo_chkKeyRowData);
                self.tmpCUD.oriData.splice(existOriIdx, 0, self.dtOriRowData[index]);
                $("#gridEdit").val(self.tmpCUD);
            }
            else if (dataType == "createData") {
                if (existOriIdx == -1) {
                    lo_chkKeyRowData = this.insertKeyRowData(lo_chkKeyRowData);
                    self.tmpCUD[dataType].push(lo_chkKeyRowData);
                    self.tmpCUD.oriData.push(self.dtOriRowData[index]);
                    $("#gridEdit").val(self.tmpCUD);
                }
            }
        }
        // 設定檔
        else {
            self.tmpCUD[dataType].push(lo_chkKeyRowData);
            $("#gridEdit").val(self.tmpCUD);
        }

    };

    this.insertKeyRowData = function (lo_chkKeyRowData) {
        lo_chkKeyRowData["mnRowData"] = this.mnRowData;
        lo_chkKeyRowData["tab_page_id"] = this.fieldsData[0].tab_page_id;
        lo_chkKeyRowData["event_time"] = moment().format("YYYY/MM/DD HH:mm:ss");
        return lo_chkKeyRowData;
    };

    /**
     * 取得
     * @param rowData: mn 單筆資料
     */
    this.updateMnRowData = function (rowData) {
        this.mnRowData = rowData;
    };

    /**
     * 取得
     * @param dtRowData: dt 原始資料
     */
    this.getOriDtRowData = function (dtRowData) {
        this.dtOriRowData = dtRowData;
    };

    /**
     * 更暫存裡
     * @param rowData: mn 單筆資料
     */
    this.updateTmpDtOfMnData = function (rowData) {
        _.each(self.tmpCUD.createData, function (cData, cIdx) {
            self.tmpCUD.createData[cIdx] = _.extend(cData, rowData);
            self.tmpCUD.createData[cIdx]["mnRowData"] = rowData;
        });
        _.each(self.tmpCUD.updateData, function (uData, uIdx) {
            self.tmpCUD.updateData[uIdx] = _.extend(uData, rowData);
            self.tmpCUD.updateData[uIdx]["mnRowData"] = rowData;
        });
        _.each(self.tmpCUD.deleteData, function (dData, dIdx) {
            self.tmpCUD.deleteData[dIdx] = _.extend(dData, rowData);
            self.tmpCUD.deleteData[dIdx]["mnRowData"] = rowData;
        });
    };


}