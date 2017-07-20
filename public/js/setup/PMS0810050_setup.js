/**
 * Created by Jun on 2017/5/23.
 */
waitingDialog.hide();
var gs_prg_id = gs_prg_id;
var vueMain = new Vue({
    el: '#app-PMS0810050',
    mounted: function () {
        waitingDialog.hide();
        this.fetchDgFieldData();
    },
    data: {
        gs_active: "pickup",    //正在使用 pickup 接機 | dropoff 送機
        prgFieldDataAttr: [],   //這隻程式的欄位屬性
        multiLangField: [],   //多語系欄位
        tmpCUD: {},
        saving: false,
        sys_locales: JSON.parse(decodeURIComponent(getCookie("sys_locales")).replace("j:", "")),
        dgInsPickUp: {}, //接機的dg
        dgInsDropOff: {},  //送機的dg
        dgIns: {},       //目前在作業的dg 從dgInsPickUp or dgInsDropOff 取得
        trafficData: {}, //交通接駁資料
        pickUpFields: [],
        dropOffFields: []
    },
    watch: {
        gs_active: function (active) {

            if (active == 'pickup') {
                this.dgIns = this.dgInsPickUp;
            } else {
                this.dgIns = this.dgInsDropOff;
            }
            waitingDialog.hide();
        },
        trafficData: function (newObj) {
            this.dgInsPickUp.loadDgData(newObj.arrive_rf);
            this.dgInsDropOff.loadDgData(newObj.leave_rf);
        }
    },
    methods: {

        //抓取欄位顯示資料
        fetchDgFieldData: function () {
            $.post("/api/prgDataGridDataQuery", {prg_id: gs_prg_id, page_id: 1}, function (result) {
                vueMain.prgFieldDataAttr = result.fieldData;
                vueMain.combineFieldAttr(result.fieldData);
                vueMain.createDatagrid();
                vueMain.fetchTrafficData();
                waitingDialog.hide();
            });
        },
        //抓取資料
        fetchTrafficData: function () {
            $.post("/api/getTrafficData", {prg_id: gs_prg_id, page_id: 1}, function (result) {
                vueMain.trafficData = result.trafficData;
            });
        },
        combineFieldAttr: function (fieldData) {
            var _this = this;
            this.pickUpFields = EZfieldClass.combineFieldOption(_.where(fieldData, {"grid_field_name": 'hfd_arrive_rf'}), 'pick_up_dg');
            this.dropOffFields = EZfieldClass.combineFieldOption(_.where(fieldData, {"grid_field_name": 'hfd_leave_rf'}), 'drop_off_dg');

            _.each(_this.pickUpFields, function (field, fIdx) {
                if (field.ui_type == 'checkbox') {
                    if (_.isUndefined(_this.pickUpFields [fIdx].editor)) {
                        field.editor = {};
                    }
                    field.editor.options = {off: 'N', on: 'Y'};
                    field.formatter = function (val, row, index) {
                        var checked = val == 'Y' ? "checked" : "";
                        return "<input type='checkbox' " + checked + ">";
                    };
                }
            });
            _.each(_this.dropOffFields, function (field, fIdx) {
                if (field.ui_type == 'checkbox') {
                    if (_.isUndefined(_this.dropOffFields[fIdx].editor)) {
                        field.editor = {};
                    }
                    field.editor.options = {off: 'N', on: 'Y'};
                    field.formatter = function (val, row, index) {
                        var checked = val == 'Y' ? "checked" : "";
                        return "<input type='checkbox' " + checked + ">";
                    };
                }
            });
        },
        //顯示資料
        createDatagrid: function () {
            this.dgInsPickUp = new DatagridBaseClass();
            this.dgInsPickUp.init(gs_prg_id, 'pick_up_dg', this.pickUpFields);
            this.dgInsDropOff = new DatagridBaseClass();
            this.dgInsDropOff.init(gs_prg_id, 'drop_off_dg', this.dropOffFields);
            this.dgIns = this.dgInsPickUp;

        },
        //新增一個Row
        doAppendRow: function () {
            this.dgIns.appendRow();
        },
        //刪除選定的Row
        doRemoveRow: function removeRow() {
            this.dgIns.removeRow();
        },
        //儲存
        doSave: function () {
            var self = this;
            var fieldData = this.gs_active == 'pickup'
                ? _.where(this.prgFieldDataAttr, {grid_field_name: 'hfd_arrive_rf'})
                : _.where(this.prgFieldDataAttr, {grid_field_name: 'hfd_leave_rf'});
            var mainTableName = this.gs_active == 'pickup' ? 'hfd_arrive_rf' : 'hfd_leave_rf';
            if (this.dgIns.endEditing()) {
                var params = {
                    prg_id: gs_prg_id,
                    tmpCUD: this.dgIns.tmpCUD,
                    fieldData: fieldData,
                    mainTableName: mainTableName
                };
                vueMain.saving = true;
                waitingDialog.show('Saving...');
                // console.log("===== 儲存資料 =====");
                // console.log(params);
                $.post('/api/execSQLProcess', params)
                    .done(function (response) {
                        vueMain.saving = false;
                        waitingDialog.hide();
                        if (response.success) {
                            self.dgIns.initTmpCUD();
                            $("#gridEdit").val(null);
                            alert('save success!');
                        } else {
                            alert(response.errorMsg);
                        }
                    })
                    .fail(function (error) {
                        vueMain.saving = false;
                        waitingDialog.hide();
                        console.log(error);
                    });

            }
        }
    }
});


$(function () {
    //tab 切換事件
    $('#traffic_tab').tabs({
        border: true,
        onSelect: function (title, index) {
            if (index == 0) {
                vueMain.gs_active = 'pickup';
            } else {
                vueMain.gs_active = 'dropoff';

            }
        }
    });

});




