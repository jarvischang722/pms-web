/**
 * Created by Jun on 2017/5/23.
 */
var gs_prg_id = "PMS0810050";
var vueMain = new Vue({
    el: '#app-PMS0810050',
    mounted: function () {
        $("#pickupPanel").show();
        $("#dropoffPanel").hide();
        this.fetchDgFieldData();
    },
    data: {
        isLoading: false,
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
        dropOffFields: [],
        fieldsData: []
    },
    watch: {
        gs_active: function (active) {

            if (active == 'pickup') {
                this.dgIns = this.dgInsPickUp;
                $("#pickupPanel").show();
                $("#dropoffPanel").hide();
            } else {
                this.dgIns = this.dgInsDropOff;
                $("#dropoffPanel").show();
                $("#pickupPanel").hide();
            }
            $("#" + this.dgIns.dgName).datagrid("reload").datagrid("resize");
        },
        trafficData: function (newObj) {
            this.dgInsPickUp.loadPageDgData(newObj.arrive_rf);
            this.dgInsDropOff.loadPageDgData(newObj.leave_rf);
        }
    },
    methods: {

        //抓取欄位顯示資料
        fetchDgFieldData: function () {
            this.isLoading = true;
            $.post("/api/prgDataGridDataQuery", {prg_id: gs_prg_id, page_id: 1}, function (result) {
                vueMain.isLoading = false;
                vueMain.prgFieldDataAttr = result.fieldData;
                vueMain.combineFieldAttr(result.fieldData);
                vueMain.createDatagrid();
                vueMain.fetchTrafficData();
                waitingDialog.hide();
            });
        },
        //抓取資料
        fetchTrafficData: function () {
            this.isLoading = true;
            $.post("/api/getTrafficData", {prg_id: gs_prg_id, page_id: 1}, function (result) {
                vueMain.isLoading = false;
                vueMain.trafficData = result.trafficData;
            });
        },
        combineFieldAttr: function (fieldData) {
            this.pickUpFields = DatagridFieldAdapter.combineFieldOption(_.where(fieldData, {"grid_field_name": 'hfd_arrive_rf'}), 'pick_up_dg');
            this.dropOffFields = DatagridFieldAdapter.combineFieldOption(_.where(fieldData, {"grid_field_name": 'hfd_leave_rf'}), 'drop_off_dg');

        },
        createDatagrid: function () {
            this.dgInsPickUp = new DatagridBaseClass();
            this.dgInsPickUp.init(gs_prg_id, 'pick_up_dg', this.pickUpFields, _.where(this.prgFieldDataAttr, {"grid_field_name": 'hfd_arrive_rf'}), {
                pagination: true,
                rownumbers: true,
                pageSize: 10
            });
            this.dgInsDropOff = new DatagridBaseClass();
            this.dgInsDropOff.init(gs_prg_id, 'drop_off_dg', this.dropOffFields, _.where(this.prgFieldDataAttr, {"grid_field_name": 'hfd_leave_rf'}), {
                pagination: true,
                rownumbers: true,
                pageSize: 10
            });
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
                            self.fetchTrafficData();
                            //self.fetchDgFieldData();
                            alert(go_i18nLang.SystemCommon.saveSuccess);
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
        },
        doChangeTraff: function (tab, event) {
            this.gs_active = tab.name;
        }
    }
});





