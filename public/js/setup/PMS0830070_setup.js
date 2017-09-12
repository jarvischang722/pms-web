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
            this.getSingleDtAll2();
            this.getSingleDt2(index);
            this.openDetail4Detail(index);
        },
        openDetail4Detail: function (index) {
            var self = this;
            var singleData = PMS0830070VM.singleData;
            //SAM:為了判斷值是否有被選過做disable
            $.post('/api/qryPMS0830070SingleDt4Dt', singleData, function (response) {
                //取得所有項目
                _.each(response.routeDtList, function (dt4DtRow, dt4DtIndex) {
                    response.routeDtList[dt4DtIndex]["seq_nos"] = index;
                    //取得此代號的項目
                    _.each(self.singleDataAll2, function (allDtRow, idx) {
                        if (dt4DtRow["item_nos"] == allDtRow["item_nos"]) {
                            response.routeDtList[dt4DtIndex]["checked"] = "true";
                            if (self.singleDataDt2.length > 0) {
                                var isSame = false;
                                //取得此代號+序號項目
                                _.each(self.singleDataDt2, function (row) {
                                    if (!isSame) {
                                        if (allDtRow["item_nos"] == row["item_nos"]) {
                                            response.routeDtList[dt4DtIndex]["disabled"] = "false";
                                            isSame = true;
                                        } else {
                                            response.routeDtList[dt4DtIndex]["disabled"] = "true";
                                        }
                                    }
                                });
                            } else {
                                response.routeDtList[dt4DtIndex]["disabled"] = "true";
                            }
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
        changeDtInfo: function (data) {
            alert(data);
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
                seq_nos: index,
                adjfolio_cod: self.singleData.adjfolio_cod
            };

            $.post('/api/qryPMS0830070SingleDt2', params, function (response) {
                if (PMS0830070VM.singleData4DetialTmp.length > 0) {
                    _.each(PMS0830070VM.singleData4DetialTmp, function (row, detailIndex) {
                        if (row.seq_nos == index)
                            response.routeDtList.push(row);
                    });
                }
                self.singleDataDt2 = response.routeDtList;
            });
        },

        //點擊Dt"..."需撈取所有detail資料
        getSingleDtAll2: function () {
            var self = this;
            var params = {
                athena_id: self.singleData.athena_id,
                hotel_cod: self.singleData.hotel_cod,
                adjfolio_cod: self.singleData.adjfolio_cod
            };

            $.post('/api/qryPMS0830070SingleAllDt2', params, function (response) {
                _.each(PMS0830070VM.singleData4DetialTmp, function (row, detailIndex) {
                    response.routeDtList.push(row);
                });
                self.singleDataAll2 = response.routeDtList;
            });
        },
        //新增明細
        btnAddDtDetail: function () {
            var singleData = PMS0830070VM.singleData;

            if (singleData.adjfolio_cod != "") {
                var singleDataDtInfo = PMS0830070VM.singleDataDt;
                var row =
                    {
                        adjfolio_cod: singleData.adjfolio_cod,
                        athena_id: singleData.athena_id,
                        hotel_cod: singleData.hotel_cod,
                        seq_nos: singleDataDtInfo.length == 0 ? 1 : singleDataDtInfo.length + 1,
                        item_nam: ""
                    };
                PMS0830070VM.singleDataDt.push(row);
            } else {
                alert("請輸入代號");
            }
        },
        //刪除明細(明天問看看要不要做)
        btnDeleteDtDetail: function () {
            var singleData = PMS0830070VM.singleData;

            if (singleData.adjfolio_cod != "") {
                var singleDataDtInfo = PMS0830070VM.singleDataDt;
                var row =
                    {
                        adjfolio_cod: singleData.adjfolio_cod,
                        athena_id: singleData.athena_id,
                        hotel_cod: singleData.hotel_cod,
                        seq_nos: singleDataDtInfo.length == 0 ? 1 : singleDataDtInfo.length + 1,
                        item_nam: ""
                    };
                PMS0830070VM.singleDataDt.push(row);
            } else {
                alert("請輸入代號");
            }
        },
        //勾選後暫存
        chkAdjfolioData: function (index, status) {
            this.adjfolioDataItem[index]["check"] = status == "true" ? "false" : "true";
        },
        //勾選的選項暫存
        saveDt2Dt: function () {
            var saveItemDataTmp = this.adjfolioDataItem;
            var savedItemData = PMS0830070VM.singleData4DetialTmp;

            //看哪些有被打勾
            _.each(saveItemDataTmp, function (row, index) {
                if (row["check"] == "true" && row["disabled"] == "false") {
                    if(savedItemData.length > 0) {
                        _.each(savedItemData, function (savedRow, savedIndex) {
                            if (savedRow["item_nos"] != row["item_nos"]) {
                                PMS0830070VM.singleData4DetialTmp.push(row);
                            }
                        });
                    }else {
                        PMS0830070VM.singleData4DetialTmp.push(row);
                    }
                }
            });

            this.adjfolioDataItem = {};
            this.dialogServiceItemVisible = false;
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

            var self = this;
            self.singleData = {adjfolio_cod: '', adjfolio_rmk: ''};
            self.singleDataDt = [];
            self.isCreateStatus = true;
            self.isEditStatus = false;
            self.openRouteDialog();
            $.post("/api/addFuncRule", {prg_id: gs_prg_id, page_id: 1}, function (result) {
                if (result.success) {
                    self.singleData = result.defaultValues;
                } else {
                    alert(result.errorMsg);
                }
            });
        },
        delRoutes: function () {
            this.tmpCUD.deleteData = $("#PMS0830070_dg").datagrid("getChecked");
            this.doSave();
        },
        doSave: function () {
            var self = this;
            if (self.tmpCUD.deleteData.length == 0) {
                return;
            }
            self.combineSQLData();
            self.isSaving = true;
            $.post("/api/doSavePMS0830070", this.tmpCUD, function (result) {
                self.isSaving = false;
                if (result.success) {
                    PMS0830070VM.initTmpCUD();
                    if (PMS0830070VM.isCreateStatus) {
                        PMS0830070VM.closeRouteDialog();
                    }
                    alert("save success!");
                    self.getRouteData();
                } else {
                    alert("save error!");
                }

            });

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
            PMS0830070VM.singleDataDt = {};
            PMS0830070VM.singleData4DetialTmp = [];
            PMS0830070VM.initTmpCUD();
            $("#PMS0830070Dialog").dialog('close');
        },
        doSaveGrid: function (callback) {
            var self = this;

            if (self.isCreateStatus) {
                PMS0830070VM.tmpCUD.createData = self.singleData;
                PMS0830070VM.tmpCUD.dt_createData = self.singleDataDt;
                PMS0830070VM.tmpCUD.dt2_createData = self.singleData4DetialTmp;
            }else if(self.isEditStatus){
                PMS0830070VM.tmpCUD.updateData = self.singleData;
                PMS0830070VM.tmpCUD.dt_updateData = self.singleDataDt;
                PMS0830070VM.tmpCUD.dt2_updateData = self.singleData4DetialTmp;
            }

            console.log(self.singleDataDt);
            waitingDialog.show('Saving...');
            var params = _.extend({prg_id: prg_id}, PMS0830070VM.tmpCUD);

            $.post("/api/doSavePMS0830070", params, function (result) {
                if (result.success) {

                    PMS0830070VM.initTmpCUD();
                    PMS0830070VM.loadDataGridByPrgID(function (success) {
                        callback(success);
                    });
                    alert('save success!');
                    waitingDialog.hide();

                } else {
                    waitingDialog.hide();
                    alert(result.errorMsg);
                }
            });
        },
        //抓取顯示資料
        loadDataGridByPrgID: function (callback) {
            $.post("/api/prgDataGridDataQuery", {prg_id: gs_prg_id}, function (result) {
                waitingDialog.hide();
                PMS0830070VM.pageOneDataGridRows = result.dataGridRows;
                PMS0830070VM.pageOneFieldData = result.fieldData;
                callback(result.success);
            });
        }
    }
});