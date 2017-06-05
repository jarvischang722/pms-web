/**
 * Created by Jun on 2017/5/23.
 */
var gs_prg_id = gs_prg_id;
var vueMain = new Vue({
    el: '#app',
    ready: function () {
        waitingDialog.hide();
        this.fetchDgFieldData();
    },
    data: {
        gs_active: "pickup",    //正在使用 pickup 接機 | dropoff 送機
        prgFieldDataAttr: [],   //這隻程式的欄位屬性
        multiLangField: [],   //多語系欄位
        editIndex: undefined,
        tmpCUD: {},
        saving: false,
        sys_locales: JSON.parse(decodeURIComponent(getCookie("sys_locales")).replace("j:", "")),
        dgInsPickUp: {}, //接機的dg
        dgInsDropOff: {},  //送機的dg
        dgIns: {},       //目前在作業的dg 從dgInsPickUp or dgInsDropOff 取得
        trafficData: {}, //交通接駁資料
    },
    watch: {
        gs_active: function (active) {
            if (active == 'pickup') {
                this.dgIns = this.dgInsPickUp;
            } else {
                this.dgIns = this.dgInsDropOff;
            }
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
                vueMain.createDatagrid(result.fieldData);
                vueMain.fetchTrafficData();
            });
        },
        //抓取資料
        fetchTrafficData: function () {
            $.post("/api/getTrafficData", {prg_id: gs_prg_id, page_id: 1}, function (result) {
                vueMain.trafficData = result.trafficData;
            });
        },
        //顯示資料
        createDatagrid: function (fieldData) {

            var columns = EZfieldClass.combineFieldOption(fieldData);
            _.each(columns, function (field, fIdx) {
                if (field.ui_type == 'checkbox') {
                    if (_.isUndefined(columns[fIdx].editor)) {
                        field.editor = {};
                    }
                    field.editor.options = {off: 'N', on: 'Y'};
                    field.formatter = function (val, row, index) {
                        var checked = val == 'Y' ? "checked" : "";
                        return "<input type='checkbox' " + checked + ">";
                    }
                }
            });
            var pickupField = _.where(columns, {"grid_field_name": 'hfd_arrive_rf'});
            var dropoffField = _.where(columns, {"grid_field_name": 'hfd_leave_rf'});

            //接機
            this.dgInsPickUp = new DatagridBaseClass();
            this.dgInsPickUp.init(gs_prg_id, 'pick_off_dg', pickupField);

            //送機
            this.dgInsDropOff = new DatagridBaseClass();
            this.dgInsDropOff.init(gs_prg_id, 'drop_off_dg', dropoffField);

            //將接機instance 指向dgIns
            this.dgIns = this.dgInsPickUp;

        },
        //新增一個Row
        doAppendRow: function () {
            this.dgIns.appendRow();
        },
        //刪除選定的Row
        doRemoveRow: function removeRow() {
            this.dgIns.removeRow()
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
                //  console.log(params);
                axios.post('/api/execSQLProcess', params)
                    .then(function (response) {
                        vueMain.saving = false;
                        waitingDialog.hide();
                        if (response.data.success) {
                            self.dgIns.initTmpCUD();
                            $("#gridEdit").val(null);
                            alert('save success!');
                        } else {
                            alert(response.data.errorMsg);
                        }
                    })
                    .catch(function (error) {
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
                vueMain.gs_active = 'pickup'
            } else {
                vueMain.gs_active = 'dropoff'
            }
        }
    });

});




