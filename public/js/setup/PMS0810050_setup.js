/**
 * Created by Jun on 2017/5/23.
 */
var prg_id = gs_prg_id;

/******** 繼承Base的類別 constructor **********/

function DatagridExtClass(){
    console.log("DatagridExtClass constructor");
}
DatagridExtClass.prototype = new DatagridBaseClass();

/******** END **********/


var vueMain = new Vue({
    el: '#app',
    ready: function () {
        waitingDialog.hide();
        this.fetchDgFieldData();

    },

    data: {
        gs_active: "pickup",    //正在使用 pickup 接機 | seeup 送機
        prgFieldDataAttr: [],   //這隻程式的欄位屬性
        multiLangField: [],   //多語系欄位
        editIndex: undefined,
        tmpCUD: {},
        saving: false,
        sys_locales: JSON.parse(decodeURIComponent(getCookie("sys_locales")).replace("j:", "")),
        dgInsPickUp : {}, //接機的dg
        dgInsSeeUp : {},  //送機的dg
        dgIns :{},         //目前在作業的dg 從dgInsPickUp or dgInsSeeUp 取得
        trafficData: {},  //交通接駁資料
    },
    watch:{
        gs_active:function(newVal,oldVal){
            if(newVal == 'pickup'){
                this.dgIns = this.dgInsPickUp;
            }else{
                this.dgIns = this.dgInsSeeUp;
            }
        },
        trafficData:function(newObj){
            console.log(newObj);
            this.dgInsPickUp.loadDgData(newObj.arrive_rf);
            this.dgInsSeeUp.loadDgData(newObj.leave_rf);
        }
    },
    methods: {

        //抓取欄位顯示資料
        fetchDgFieldData: function () {
            $.post("/api/prgDataGridDataQuery", {prg_id: prg_id,page_id:1}, function (result) {
                vueMain.createDatagrid(result.fieldData);
                vueMain.fetchTrafficData();
            });
        },
        //抓取資料
        fetchTrafficData : function(){

            $.post("/api/getTrafficData", {prg_id: prg_id,page_id:1}, function (result) {
                vueMain.trafficData = result.trafficData;
            });
        },
        //顯示資料
        createDatagrid: function (fieldData) {
            var pickupField = _.where(fieldData,{"grid_field_name":'hfd_arrive_rf'});
            var seeupField = _.where(fieldData,{"grid_field_name":'hfd_leave_rf'});

            this.dgInsPickUp  = new DatagridExtClass();
            this.dgInsPickUp.init(prg_id,'pick_off_dg', pickupField);
            this.dgIns = this.dgInsPickUp;

            this.dgInsSeeUp  = new DatagridBaseClass();
            this.dgInsSeeUp.init(prg_id,'see_off_dg', seeupField);
            this.dgInsSeeUp.loadDgData([{leave_spot: 10}, {leave_spot: 2}, {leave_spot: 20}]);

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
            if (this.dgIns.endEditing()) {

                var params = {
                    prg_id: prg_id,
                    deleteData: this.dgIns.tmpCUD.deleteData,
                    createData: this.dgIns.tmpCUD.createData,
                    updateData: this.dgIns.tmpCUD.updateData
                };
                vueMain.saving = true;
                //waitingDialog.show('Saving...');
                console.log("===== 儲存資料 =====");
                console.log(params);
                // $.post("/api/saveDataRow", params, function (result) {
                //     vueMain.saving = false;
                //     waitingDialog.hide();
                //     if (result.success) {
                //         $('#' + this.dgName).datagrid('acceptChanges');
                //         vueMain.initTmpCUD();
                //         $("#gridEdit").val(null);
                //         alert('save success!');
                //     } else {
                //         alert(result.errorMsg);
                //     }
                // })

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
                vueMain.gs_active = 'seeup'
            }
        }
    });

});




