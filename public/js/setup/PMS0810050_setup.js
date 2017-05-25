/**
 * Created by Jun on 2017/5/23.
 */

/******** 繼承Base的類別 constructor **********/

function DatagridExtClass(){
    console.log("DatagridExtClass constructor");
}
DatagridExtClass.prototype = new DatagridBaseClass();

/******** END **********/


var prg_id = gs_prg_id;
var vueMain = new Vue({
    el: '#app',
    ready: function () {
        waitingDialog.hide();
        this.fetchDataGridData();
    },

    data: {
        gs_active: "pickup",    //正在使用 pickup 接機 | seeup 送機
        prgFieldDataAttr: [],   //這隻程式的欄位屬性
        multiLangField: [],   //多語系欄位
        isTableLock: false,
        tableLockMsg: "",
        editIndex: undefined,
        multiLangEditIndex: undefined,
        tmpCUD: {},
        saving: false,
        sys_locales: JSON.parse(decodeURIComponent(getCookie("sys_locales")).replace("j:", "")),
        dgInsPickUp : {}, //接機的dg
        dgInsSeeUp : {},  //送機的dg
        dgIns :{}         //目前在作業的dg 從dgInsPickUp or dgInsSeeUp 取得
    },
    watch:{
        gs_active:function(newVal,oldVal){
            if(newVal == 'pickup'){
                this.dgIns = this.dgInsPickUp;
            }else{
                this.dgIns = this.dgInsSeeUp;
            }
            console.log(this.dgIns.editIndex);
        }
    },
    methods: {

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


            this.dgInsPickUp  = new DatagridExtClass();
            this.dgInsPickUp.init(prg_id,'pick_off_dg', fieldData);
            this.dgInsPickUp.loadDgData([{arrive_cod: 'a12211122'}, {arrive_cod: '55555'}, {arrive_cod: '444444'}]);
            this.dgIns = this.dgInsPickUp;

            this.dgInsSeeUp  = new DatagridBaseClass("see_off_dg", fieldData);
            this.dgInsSeeUp.init(prg_id,'see_off_dg', fieldData);
            this.dgInsSeeUp.loadDgData([{arrive_cod: '1111'}, {arrive_cod: '2222'}, {arrive_cod: '3333'}]);


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




