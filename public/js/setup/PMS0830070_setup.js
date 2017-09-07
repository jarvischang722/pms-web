/**
 * Created by a14020 on 2017/8/9.
 */
waitingDialog.hide();
function DatagridSingleGridClass() {
}
DatagridSingleGridClass.prototype = new DatagridBaseClass();
DatagridSingleGridClass.prototype.onClickRow = function (index, row) {

    PMS0830070VM.editingRow = row;
    PMS0830070VM.isEditStatus = true;
    PMS0830070VM.fetchSingleData(row);
};

var Pms0830070Comp = Vue.extend({
    template: '#PMS0830070Tmp',
    props: ['editingRow', 'singleData', "tmpCUD", 'singleDataDt', 'singleData4DetialTmp'],
    data: function () {
        return {
            dialogServiceItemVisible: false,
            adjfolioDataItem: {},
            singleDataDt2: {},
            singleDataAll2: {}
        };
    },
    created: {},
    methods: {
        //點擊明細跳窗
        btnDt4Dt: function (index) {
            this.openDetail4Detail(index);
        },
        openDetail4Detail: function (index) {
            var self = this;
            var singleData = PMS0830070VM.singleData;

            this.getSingleDtAll2();
            this.getSingleDt2(index);

            $.post('/api/qryPMS0830070SingleDt4Dt', singleData, function (response) {

                _.each(response.routeDtList, function (dt4DtRow, dt4DtIndex) {
                    response.routeDtList[dt4DtIndex]["detailIndex"] = index;
                    _.each(self.singleDataAll2, function (allDtRow, idx) {
                        if (dt4DtRow["item_nos"] == allDtRow["item_nos"]) {
                            response.routeDtList[dt4DtIndex]["checked"] = "true";
                            _.each(self.singleDataDt2, function (row, index) {
                                response.routeDtList[dt4DtIndex]["disabled"] = allDtRow["item_nos"] == row["item_nos"] ? "false" : "true";
                            });
                        }
                    });
                });
                self.adjfolioDataItem = response.routeDtList;
                self.showDialogServerItem();
            });
        },
        //Show Dt的Dt
        showDialogServerItem: function () {
            this.dialogServiceItemVisible = true;
        },
        //點擊Dt
        clickDt: function (index) {
            this.getSingleDt2(index);
        },
        //點擊Dt跳Dt2
        getSingleDt2: function (index) {
            var self = this;
            var params = {
                athena_id: self.singleData.athena_id,
                hotel_cod: self.singleData.hotel_cod,
                seq_nos: index
            };

            $.post('/api/qryPMS0830070SingleDt2', params, function (response) {
                self.singleDataDt2 = response.routeDtList;
            });
        },

        //點擊Dt"..."需撈取所有detail資料
        getSingleDtAll2: function () {
            var self = this;
            var params = {
                athena_id: self.singleData.athena_id,
                hotel_cod: self.singleData.hotel_cod
            };

            $.post('/api/qryPMS0830070SingleAllDt2', params, function (response) {
                self.singleDataAll2 = response.routeDtList;
            });
        },
        //新增明細
        btnAddDtDetail: function () {

            var singleDataDtInfo = PMS0830070VM.singleDataDt;
            var singleData = PMS0830070VM.singleData;
            var row = [
                {
                    adjfolio_cod: "",
                    athena_id: singleData.athena_id,
                    hotel_cod: singleData.hotel_cod,
                    seq_nos: singleDataDtInfo.length == 0 ? 1 : singleDataDtInfo.length + 1
                }
            ];

            singleDataDtInfo.push(row);
        },
        //勾選後暫存
        chkAdjfolioData: function (index, status) {
            this.adjfolioDataItem[index]["checked"] = status == "true" ? "false" : "true";
        },
        //勾選的選項暫存
        saveDt2Dt: function () {
            var saveItemDataTmp = this.adjfolioDataItem;
            _.each(saveItemDataTmp, function (row, index) {

                if (row["checked"] == "true" && row["disabled"] == "false") {
                    PMS0830070VM.singleData4DetialTmp.push(row);
                }
            });

            this.dialogServiceItemVisible=false;
        }
    }
});

var PMS0830070VM = new Vue({
    el: '#PMS0830070App',
    components: {Pms0830070Comp},
    data: {
        prg_id: gs_prg_id,
        pageOneDataGridRows: [],
        pageOneFieldData: [],
        editingRow: {},
        isEditStatus: false,
        isCreateStatus: false,
        activeAccount: 1,
        singleData: {},
        singleDataDt: {},
        singleData4DetialTmp: [],
        dgIns: {},
        tmpCUD: {
            createData: {},
            updateData: {},
            deleteData: [],
            dt_createData: [],
            dt_updateData: [],
            dt_deleteData: [],
            dt2_createData: [],
            dt2_updateData: [],
            dt2_deleteData: [],
        }
    },
    created: function () {
        // this.$on("updateTmpCUD", function (data) {
        //     this.tmpCUD = data.tmpCUD;
        // })
    },
    mounted: function () {
        this.getRouteData();
    },
    watch: {
        pageOneFieldData: function () {
            this.initDataGrid();
            this.dgIns.loadDgData(this.pageOneDataGridRows);
        },
        editingRow: {
            handler(val){
                if (this.isCreateStatus) {
                    this.tmpCUD.createData = val;
                    this.tmpCUD.updateData = {};
                } else if (this.isEditStatus) {
                    this.tmpCUD.updateData = val;
                    this.tmpCUD.createData = {};
                }
            },
            deep: true
        }
    },
    methods: {
        initDataGrid: function () {
            var colOption = [{field: 'ck', checkbox: true}];
            colOption = _.union(colOption, EZfieldClass.combineFieldOption(this.pageOneFieldData, 'PMS0830070_dg'));
            this.dgIns = new DatagridSingleGridClass();
            this.dgIns.init(this.p, "PMS0830070_dg", colOption, this.pageOneFieldData, {singleSelect: false});
        },
        //撈多筆
        getRouteData: function () {
            $.post('/api/prgDataGridDataQuery', {prg_id: this.prg_id})
                .done(function (response) {
                    PMS0830070VM.pageOneDataGridRows = response.dataGridRows;
                    PMS0830070VM.pageOneFieldData = response.fieldData;
                });
        },
        addRoute: function () {
            this.singleData = {adjfolio_cod: '', adjfolio_rmk: ''};
            this.singleDataDt = [];
            this.isCreateStatus = true;
            this.isEditStatus = false;
            this.openRouteDialog();
        },
        delRoutes: function () {
            this.tmpCUD.deleteData = $("#PMS0830070_dg").datagrid("getChecked");
            this.doSave();
        },
        initTmpCUD: function () {
            this.tmpCUD = {
                createData: [],
                updateData: [],
                deleteData: [],
                dt_createData: [],
                dt_updateData: [],
                dt_deleteData: []
            };
        },
        //取得單筆
        fetchSingleData: function (editingRow) {
            this.isCreateStatus = false;
            this.isEditStatus = true;
            this.editingRow["prg_id"] = prg_id;
            $.post('/api/qryPMS0830070SingleMn', editingRow)
                .done(function (response) {
                    PMS0830070VM.singleData = response.routeDt;
                });

            this.getSingleGridData(editingRow);
        },
        //取得單筆Dt
        getSingleGridData: function (editingRow) {
            $.post('/api/qryPMS0830070SingleDt', editingRow)
                .done(function (response) {
                    PMS0830070VM.singleDataDt = response.routeDtList;
                });

            //this.getSingleGridData2(editingRow);
            this.openRouteDialog();
        },
        //開起單筆頁
        openRouteDialog: function () {
            this.initTmpCUD();
            this.activeAccount = 1;
            var dialog = $("#PMS0830070Dialog").removeClass('hide').dialog({
                modal: true,
                title: "虛擬帳單",
                title_html: true,
                width: 1000,
                maxwidth: 1920,
                height: $(window).height(),
                dialogClass: "test",
                resizable: true
            });
        },
        closeGridDialog: function () {
            PMS0830070VM.editingRow = {};
            PMS0830070VM.singleData = {};
            PMS0830070VM.initTmpCUD();
            $("#PMS0830070Dialog").dialog('close');
        },
        doSaveGrid: function () {
            var self = this;
            console.log(self.isCreateStatus);
            if(self.isCreateStatus){
                PMS0830070VM.tmpCud.createData =  self.singleData;
                //PMS0830070VM.tmpCud.dt_createData  =

            }
            console.log(self.singleData);
            waitingDialog.show('Saving...');
            var params = _.extend({prg_id: prg_id}, PMS0830070VM.tmpCud);

            // $.post("/api/saveGridSingleData", params, function (result) {
            //     if (result.success) {
            //
            //         if (self.uploadFileList.length != 0) {
            //             self.uploadAction(callback);
            //         }
            //         else {
            //             vm.initTmpCUD();
            //             vm.loadDataGridByPrgID(function (success) {
            //                 callback(success);
            //             });
            //             alert('save success!');
            //             waitingDialog.hide();
            //         }
            //
            //     } else {
            //         waitingDialog.hide();
            //         alert(result.errorMsg);
            //     }
            // });
        }
    }
});