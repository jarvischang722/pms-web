/**
 * Created by Jun on 2017/6/14.
 */

/** DatagridRmSingleGridClass ***/
function DatagridSingleGridClass() {
}
DatagridSingleGridClass.prototype = new DatagridBaseClass();
DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    //
};
DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
    vm.editingRow = row;
    vm.editStatus = true;
    vm.fetchSingleData(row, function (success) {
        vm.showSingleGridDialog();
    });
};
/*** Class End  ***/

Vue.component('single-grid-pms0810190-tmp', {
    template: '#singleGridPMS0810190Tmp',
    data () {
        return {
            editStatus: false,
            createStatus: true,
        };
    }
});

let vm = new Vue({
    el: '#PMS0810190App',
    data: {
        dgIns:{},
        prg_id:gs_prg_id,
        isSaving: false,
        singleData: {},
        pageOneFieldData :[]
    },
    mounted: function () {
        waitingDialog.hide();
        this.getOrderConfirm();
    },
    watch:{
        pageOneFieldData(){
            this.initDataGrid();
        }
    },
    methods: {
        initDataGrid(){
            this.dgIns = new DatagridSingleGridClass();
            this.dgIns.init(this.prg_id, 'PMS0810190_dg', EZfieldClass.combineFieldOption(this.pageOneFieldData));
        },
        getOrderConfirm(){
            axios.post('/api/prgDataGridDataQuery', {prg_id:this.prg_id})
                .then(function (response) {
                    let result = response.data;
                    vm.pageOneFieldData = result.fieldData;
                    console.log(vm.pageOneFieldData);
                    //vm.pageOneDataGridRows = result.dataGridRows;
                })
                .catch(function (error) {
                    console.log(error);
                });
        },
        addData: function () {
            // this.showSingleGridDialog();
        },
        removeData: function () {

        },
        doSave: function () {

        },
        showSingleGridDialog: function () {
            this.dialogVisible = true;
            var maxHeight = document.documentElement.clientHeight - 60; //browser 高度 - 70功能列
            var height = 400; // 預設一個row 高度
            var dialog = $("#singleGridPMS0810190").dialog({
                autoOpen: false,
                modal: true,
                height: _.min([maxHeight, height]),
                title: gs_prg_id,
                minWidth: 750,
                maxHeight: maxHeight,
                resizable: true

            });
            console.log($("#singleGridPMS0810190").html());
            dialog.dialog("open");
            // 給 dialog "內容"高 值
            $(".singleGridContent").css("height", _.min([maxHeight, height]) + 20);
        },
        //關閉單檔dialog
        closeSingleGridDialog: function () {
            vm.editingRow = {};
            vm.singleData = {};
            vm.initTmpCUD();
            $("#singleGridPMS0810190").dialog('close');
        }
    },
});