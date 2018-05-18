/**
 * Created by Jun on 2017/5/23.
 */

var PMS0820030VM = new Vue({
    el: '#app-PMS0820030',
    mounted: function () {
        waitingDialog.hide();
        this.fetchDgFieldData();
    },
    data: {
        prgFieldDataAttr: [],   //這隻程式的欄位屬性
        prgColumnsOption: [],   //datagrid 所要的欄位屬性
        tmpCUD: {
            createData: [],
            updateData: [],
            deleteData: []
        },
        saving: false,
        dgIns: {},
        colorClipboard: "" //顏色剪貼板
    },
    watch: {},
    methods: {
        //抓取欄位顯示資料
        fetchDgFieldData: function () {
            BacUtils.doHttpPostAgent("/api/prgDataGridDataQuery", {prg_id: gs_prg_id, page_id: 1}, function (result) {
                PMS0820030VM.prgFieldDataAttr = result.fieldData;
                PMS0820030VM.prgColumnsOption = DatagridFieldAdapter.combineFieldOption(result.fieldData, 'PMS0820030_prg_dg');
                PMS0820030VM.createDatagrid();
                PMS0820030VM.dgIns.loadDgData(result.dataGridRows);
            });
        },
        //顯示資料
        createDatagrid: function () {
            this.dgIns = new DatagridBaseClass();
            this.dgIns.init(gs_prg_id, 'PMS0820030_prg_dg', this.prgColumnsOption, this.prgFieldDataAttr);
        },
        //新增一個Row
        doAppendRow: function () {
            this.dgIns.appendRow();
        },
        //刪除選定的Row
        doRemoveRow: function removeRow() {
            this.dgIns.removeRow();
        },
        //將資料放入暫存
        tempExecData: function (rowData) {
            var dataType = rowData.createRow == 'Y' ? "createData" : "updateData";  //判斷此筆是新增或更新
            var existIdx = this.chkTmpCudExistData(rowData, dataType);
            if (existIdx > -1) {
                this.dgIns.tmpCUD[dataType].splice(existIdx, 1);
            }

            this.dgIns.tmpCUD[dataType].push(rowData);
            $("#gridEdit").val(this.dgIns.tmpCUD);
        },
        // 檢查暫存是否有資料
        chkTmpCudExistData: function (rowData, dataType) {
            var keyVals = _.pluck(_.where(this.prgFieldDataAttr, {keyable: 'Y'}), "ui_field_name");
            var condKey = {};
            _.each(keyVals, function (field_name) {
                condKey[field_name] = rowData[field_name] || "";
            });
            //判斷資料有無在暫存裡, 如果有先刪掉再新增新的
            var existIdx = _.findIndex(this.dgIns.tmpCUD[dataType], condKey);
            return existIdx;
        },
        //讀取顏色設定
        loadDefaultColor: function () {
            var defaultData = [
                {pro_typ: "ASI", status_cod: "FONT", color_num: "16777215"},
                {pro_typ: "ASI", status_cod: "NA", color_num: "11750841"},
                {pro_typ: "ASI", status_cod: "R", color_num: "9539985"},
                {pro_typ: "ASI", status_cod: "CA", color_num: "4019872"},
                {pro_typ: "ASI", status_cod: "X", color_num: "5554"},
                {pro_typ: "ASI", status_cod: "T", color_num: "48573"},
                {pro_typ: "ASI", status_cod: "DO", color_num: "4019872"},
                {pro_typ: "RM", status_cod: "FONT", color_num: "16777215"},
                {pro_typ: "RM", status_cod: "OC", color_num: "11750841"},
                {pro_typ: "RM", status_cod: "OD", color_num: "11750841"},
                {pro_typ: "RM", status_cod: "VC", color_num: "2133395"},
                {pro_typ: "RM", status_cod: "VD", color_num: "2133395"},
                {pro_typ: "RM", status_cod: "DOC", color_num: "4755784"},
                {pro_typ: "RM", status_cod: "DOD", color_num: "4755784"},
                {pro_typ: "RM", status_cod: "OOO", color_num: "4019872"},
                {pro_typ: "RM", status_cod: "OOS", color_num: "3107669"},
                {pro_typ: "RM", status_cod: "S", color_num: "11228758"},
                {pro_typ: "HK", status_cod: "FONT", color_num: "16777215"},
                {pro_typ: "HK", status_cod: "OC", color_num: "11750841"},
                {pro_typ: "HK", status_cod: "OD", color_num: "11750841"},
                {pro_typ: "HK", status_cod: "VC", color_num: "2133395"},
                {pro_typ: "HK", status_cod: "VD", color_num: "2133395"},
                {pro_typ: "HK", status_cod: "DOC", color_num: "4755784"},
                {pro_typ: "RM", status_cod: "DOD", color_num: "4755784"},
                {pro_typ: "HK", status_cod: "OOO", color_num: "4019872"},
                {pro_typ: "HK", status_cod: "OOS", color_num: "3107669"},
                {pro_typ: "HK", status_cod: "S", color_num: "11228758"}
            ];
            _.each(defaultData, function (obj) {
                var tmpIdx = _.findIndex($("#PMS0820030_prg_dg").datagrid("getRows"), {
                    pro_typ: obj.pro_typ,
                    status_cod: obj.status_cod
                });
                var rowData = $("#PMS0820030_prg_dg").datagrid("getRows")[tmpIdx];
                if (tmpIdx > -1 && !_.isUndefined(rowData) && rowData.color_num != obj.color_num) {
                    $("#PMS0820030_prg_dg").datagrid("updateRow", {
                        index: tmpIdx,
                        row: obj
                    });

                    PMS0820030VM.dgIns.doTmpExecData(_.extend(rowData, obj));
                }
            });
        },
        //複製顏色
        copyColor: function () {
            if (_.isUndefined(this.dgIns.editIndex)) {
                alert("Please choice one item.");
                return;
            }
            var rowData = $("#PMS0820030_prg_dg").datagrid("getRows")[this.dgIns.editIndex];
            this.colorClipboard = rowData.color_num;
        },
        //貼上顏色
        pasteColor: function () {

            if (_.isUndefined(this.dgIns.editIndex)) {
                alert("Please choice one item.");
                return;
            }

            if (!_.isNaN(this.colorClipboard)) {
                var rowData = $("#PMS0820030_prg_dg").datagrid("getRows")[this.dgIns.editIndex];
                var updateData = {color_num: this.colorClipboard};
                $("#PMS0820030_prg_dg").datagrid("updateRow", {
                    index: this.dgIns.editIndex,
                    row: updateData
                });

                PMS0820030VM.dgIns.doTmpExecData(_.extend(rowData, updateData));
            }


        },
        //儲存
        doSave: function () {
            var self = this;
            var mainTableName = 'hfd_room_color_rf';

            if (this.dgIns.endEditing()) {
                var params = {
                    prg_id: gs_prg_id,
                    tmpCUD: this.dgIns.tmpCUD,
                    fieldData: this.prgFieldDataAttr,
                    mainTableName: mainTableName
                };
                PMS0820030VM.saving = true;
                waitingDialog.show('Saving...');
                console.log(this.dgIns.tmpCUD);
                // console.log("===== 儲存資料 =====");
                // console.log(params);
                BacUtils.doHttpPostAgent('/api/execSQLProcess', params, function (response) {
                    PMS0820030VM.saving = false;
                    waitingDialog.hide();
                    if (response.success) {
                        self.dgIns.initTmpCUD();
                        $("#gridEdit").val(null);
                        alert(go_i18nLang.SystemCommon.saveSuccess);
                    } else {
                        alert(response.errorMsg);
                    }
                });


            }
        }
    }
});


var adpterDg = new DatagridAdapter(PMS0820030VM);
