/**
 * Created by a14020 on 2017/8/9.
 */
var vmHub = new Vue;
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
            dt2AllData: {},
            deleteDtTmp: []
        };
    },
    created: function () {
        var self = this;
        vmHub.$on('updateDetail2', function () {
            self.singleDataDt2 = {};
        });
    },
    methods: {
        //點擊明細跳窗
        openDt2: function (index, itemName) {

            if (itemName != "") {
            //     this.getSingleDtAll2();
            //     this.getSingleDt2(index);
            //     this.openDetail4Detail(index);
            //     this.showDialogServerItem();
            }
            else {
                alert("請輸入帳單明細");
            }
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
                    _.each(self.dt2AllData, function (allDtRow, idx) {
                        if (dt4DtRow["item_nos"] == allDtRow["item_nos"]) {
                            response.routeDtList[dt4DtIndex]["checked"] = "true";
                            response.routeDtList[dt4DtIndex]["checking"] = "true";
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
            });
        },

        //Show Dt的Dt
        showDialogServerItem: function () {
            this.dialogServiceItemVisible = true;
        },

        changeDtInfo: function (data) {
            alert(data);
        },

        //查詢此筆dt2資料
        qrySingleDt2: function (index) {
            var self = this;
            var params = {
                seq_nos: index,
                adjfolio_cod: this.singleData.adjfolio_cod
            };

            $.post('/api/qryPMS0830070SingleDt2', params, function (response) {
                // if (PMS0830070VM.singleData4DetialTmp.length > 0) {
                //     _.each(PMS0830070VM.singleData4DetialTmp, function (row, detailIndex) {
                //         if (typeof row != "undefined") {
                //             if (row.seq_nos == index && row.checking == "true") {
                //                 response.routeDtList.push(row);
                //             } else if (row.seq_nos == index && row.checking == "false" && row.checked == "true") {
                //                 response.routeDtList.splice(detailIndex, 1);
                //             }
                //         }
                //     });
                // }
                self.singleDataDt2 = response.dt2Data;
            });
        },

        //新增明細
        btnAddDtDetail: function () {
            var singleData = PMS0830070VM.singleData;
            var seqNosTmp = 0;
            if (singleData.adjfolio_cod != "") {
                var singleDataDtInfo = PMS0830070VM.singleDataDt;

                _.each(singleDataDtInfo, function (row, index) {
                    if (seqNosTmp < row.seq_nos) {
                        seqNosTmp = row.seq_nos;
                    }
                });

                var row =
                    {
                        adjfolio_cod: singleData.adjfolio_cod,
                        athena_id: singleData.athena_id,
                        hotel_cod: singleData.hotel_cod,
                        seq_nos: singleDataDtInfo.length == 0 ? 1 : seqNosTmp + 1,
                        item_nam: "",
                        created: "true",
                        edited: "false",
                        deleted: "false"
                    };
                PMS0830070VM.singleDataDt.push(row);
            } else {
                alert("請輸入代號");
            }
        },

        clickDeleteDt: function () {
            console.log(this.deleteDtTmp);
            // var singleDataDtInfo = PMS0830070VM.singleDataDt;
            // _.each(singleDataDtInfo,function (row,index) {
            //     if(typeof row.deleted == "false" || typeof row.deleted == "undefined") {
            //         if (row.seq_nos == deleteIndex && row.edited == "true") {
            //             PMS0830070VM.singleDataDt[index].deleted = "true";
            //             PMS0830070VM.singleDataDt[index].created = "false";
            //             PMS0830070VM.singleDataDt[index].edited = "true";
            //         } else if (row.seq_nos == deleteIndex && row.created == "true") {
            //             PMS0830070VM.singleDataDt[index].deleted = "true";
            //             PMS0830070VM.singleDataDt[index].created = "true";
            //             PMS0830070VM.singleDataDt[index].edited = "false";
            //         }
            //     }else{
            //         if (row.seq_nos == deleteIndex && row.edited == "true") {
            //             PMS0830070VM.singleDataDt[index].deleted = "false";
            //             PMS0830070VM.singleDataDt[index].created = "false";
            //             PMS0830070VM.singleDataDt[index].edited = "true";
            //         } else if (row.seq_nos == deleteIndex && row.created == "true") {
            //             PMS0830070VM.singleDataDt[index].deleted = "false";
            //             PMS0830070VM.singleDataDt[index].created = "true";
            //             PMS0830070VM.singleDataDt[index].edited = "false";
            //         }
            //     }
            // });
        },

        //刪除明細
        btnDeleteDtDetail: function () {
            var singleData = PMS0830070VM.singleData;
            var self = this;
            //刪除明細也要將detail有的刪除

            if (this.deleteDtTmp.length != 0) {
                _.each(this.deleteDtTmp, function (lo_delDtTmp) {
                    var lo_singleDataDt = _.findWhere(PMS0830070VM.singleDataDt, {seq_nos: lo_delDtTmp});
                    if (lo_singleDataDt.createRow == "Y") {
                        PMS0830070VM.singleDataDt = _.without(PMS0830070VM.singleDataDt, {seq_nos: lo_delDtTmp});
                    }
                    else {
                        PMS0830070VM.tmpCUD.dt_deleteData.push(lo_singleDataDt);
                    }
                });
            }

            console.log(PMS0830070VM.tmpCUD.dt_deleteData);

            return;
            if (singleData.adjfolio_cod != "") {
                var singleDataDtInfo = PMS0830070VM.singleDataDt;
                _.each(singleDataDtInfo, function (row, index) {

                    if (typeof row != "undefined") {
                        if (row.deleted == "true" && row.created == "true") {
                            _.each(PMS0830070VM.singleData4DetialTmp, function (detailRow, detailIndex) {
                                if (detailRow.seq_nos != "undefined") {
                                    if (row.seq_nos == detailRow.seq_nos) {
                                        PMS0830070VM.singleData4DetialTmp = _.without(PMS0830070VM.singleData4DetialTmp, detailRow);
                                    }
                                }
                            });
                            PMS0830070VM.singleDataDt = _.without(PMS0830070VM.singleDataDt, row);
                            self.singleDataDt2 = {};
                        } else if (row.deleted == "true" && row.edited == "true") {
                            _.each(PMS0830070VM.singleData4DetialTmp, function (detailRow, detailIndex) {
                                if (detailRow.seq_nos != "undefined") {
                                    if (row.seq_nos == detailRow.seq_nos) {
                                        PMS0830070VM.singleData4DetialTmp = _.without(PMS0830070VM.singleData4DetialTmp, detailRow);
                                    }
                                }
                            });

                            PMS0830070VM.singleDataDtEdit4DeleteTmp.push(row);
                            PMS0830070VM.singleDataDt = _.without(PMS0830070VM.singleDataDt, row);
                            self.singleDataDt2 = {};
                        }
                    }
                });
            }
            else {
                alert("請輸入代號");
            }
        },

        doSaveGrid: function () {
            var self = this;

            if (self.isCreateStatus) {
                PMS0830070VM.tmpCUD.createData = self.singleData;
                PMS0830070VM.tmpCUD.dt_createData = self.singleDataDt;
                PMS0830070VM.tmpCUD.dt2_createData = self.singleData4DetialTmp;
            } else if (self.isEditStatus) {
                PMS0830070VM.tmpCUD.updateData = self.singleData;
                PMS0830070VM.tmpCUD.dt_updateData = self.singleDataDt.concat(self.singleDataDtEdit4DeleteTmp);
                PMS0830070VM.tmpCUD.dt2_updateData = self.singleData4DetialTmp;
            }

            waitingDialog.show('Saving...');
            var params = _.extend({prg_id: gs_prg_id}, PMS0830070VM.tmpCUD);

            $.post("/api/doSavePMS0830070", params, function (result) {
                if (result.success) {

                    PMS0830070VM.initTmpCUD();
                    PMS0830070VM.loadDataGridByPrgID(function (success) {

                    });
                    alert('save success!');
                    PMS0830070VM.isCreateStatus = false;
                    PMS0830070VM.isEditStatus = true;
                    waitingDialog.hide();

                } else {
                    waitingDialog.hide();
                    alert(result.errorMsg);
                }
            });
        },

        //勾選後暫存
        chkAdjfolioData: function (index, status) {
            this.adjfolioDataItem[index]["checking"] = status == "false" ? "true" : "false";
        },

        //勾選的選項暫存
        saveDt2Dt: function () {

            var saveItemDataTmp = this.adjfolioDataItem;
            var savedItemData = PMS0830070VM.singleData4DetialTmp;

            var singleData4ShowDt = [];
            var isInclude = false;
            //看哪些有被打勾
            _.each(saveItemDataTmp, function (row, index) {

                //新勾選以及取消原本的勾選都寫入到暫存
                if (row["checking"] == "true" && row["checked"] == "false" && row["disabled"] == "false") {
                    if (savedItemData.length > 0) {
                        _.each(savedItemData, function (savedRow, savedIndex) {
                            if (savedRow["item_nos"] != row["item_nos"] && (PMS0830070VM.singleData4DetialTmp.indexOf(row) == -1)) {
                                PMS0830070VM.singleData4DetialTmp.push(row);
                                singleData4ShowDt.push(row);
                            }
                        });
                    } else {
                        PMS0830070VM.singleData4DetialTmp.push(row);
                        singleData4ShowDt.push(row);
                    }
                } else if (row["checking"] == "false" && row["checked"] == "true" && row["disabled"] == "false") {
                    PMS0830070VM.singleData4DetialTmp.push(row);
                } else if (row["checking"] == "false" && row["checked"] == "false" && row["disabled"] == "false") {
                    delete PMS0830070VM.singleData4DetialTmp[row];
                } else if (row["checking"] == "true" && row["checked"] == "true" && row["disabled"] == "false") {
                    singleData4ShowDt.push(row);
                }
            });

            this.singleDataDt2 = singleData4ShowDt;
            this.adjfolioDataItem = {};
            this.dialogServiceItemVisible = false;
        }
    }
});

var PMS0830070VM = new Vue({
    el: '#PMS0830070App',
    components: {
        Pms0830070Comp,
        "search-comp": go_searchComp
    },
    data: {
        // prg_id: gs_prg_id,
        pageOneDataGridRows: [],
        pageOneFieldData: [],
        editingRow: {},
        isEditStatus: false,
        isCreateStatus: false,
        activeAccount: 1,
        singleData: {},
        singleDataDt: {},
        singleDataDtEdit4DeleteTmp: [],
        singleData4DetialTmp: [],
        dt2AllData: [],
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
            dt2_deleteData: []
        },
        searchFields: [], //搜尋的欄位
        searchCond: {}   //搜尋條件
    },
    mounted: function () {
        this.loadDataGridByPrgID();
    },
    watch: {
        pageOneFieldData: function () {
            this.initDataGrid();
            this.dgIns.loadDgData(this.pageOneDataGridRows);
        }
    },
    methods: {
        initDataGrid: function () {
            var colOption = [{field: 'ck', checkbox: true}];
            colOption = _.union(colOption, EZfieldClass.combineFieldOption(this.pageOneFieldData, 'PMS0830070_dg'));
            this.dgIns = new DatagridSingleGridClass();
            this.dgIns.init(this.p, "PMS0830070_dg", colOption, this.pageOneFieldData, {singleSelect: false});
        },

        //抓取顯示資料
        loadDataGridByPrgID: function (callback) {

            if(_.isUndefined(callback)){
                callback = function(){};
            }

            $.post("/api/prgDataGridDataQuery", {prg_id: gs_prg_id, searchCond: this.searchCond}, function (result) {
                waitingDialog.hide();
                PMS0830070VM.searchFields = result.searchFields;
                PMS0830070VM.pageOneDataGridRows = result.dataGridRows;
                PMS0830070VM.pageOneFieldData = result.fieldData;
                callback(result.success);
            });
        },

        //新增單筆
        addRoute: function () {
            var self = this;
            self.singleData = {adjfolio_cod: '', adjfolio_rmk: '', createRow: "Y"};
            self.singleDataDt = [];
            self.isCreateStatus = true;
            self.isEditStatus = false;
            vmHub.$emit('updateDetail2');
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

        initTmpCUD: function () {
            this.tmpCUD = {
                createData: {},
                updateData: {},
                deleteData: [],
                dt_createData: [],
                dt_updateData: [],
                dt_deleteData: [],
                dt2_createData: [],
                dt2_updateData: [],
                dt2_deleteData: []
            };
            PMS0830070VM.singleData4DetialTmp = [];
        },

        //取得單筆
        fetchSingleData: function (editingRow) {
            var self = this;
            this.isCreateStatus = false;
            this.isEditStatus = true;
            $.post('/api/qryPMS0830070SingleData', editingRow)
                .done(function (response) {
                    PMS0830070VM.singleData = response.mnData;
                    PMS0830070VM.singleDataDt = response.dtData;
                    self.openRouteDialog();
                });
        },

        //點擊Dt"..."需撈取所有dt2資料
        qryDt2AllData: function () {
            var self = this;
            var params = {
                adjfolio_cod: this.singleData.adjfolio_cod
            };

            $.post('/api/qryPMS0830070SingleAllDt2', params, function (response) {
                // _.each(PMS0830070VM.singleData4DetialTmp, function (row, detailIndex) {
                //     response.routeDtList.push(row);
                // });
                self.dt2AllData = response.dt2Data;
            });
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
            PMS0830070VM.singleDataDtEdit4DeleteTmp = [];
            PMS0830070VM.initTmpCUD();
            $("#PMS0830070Dialog").dialog('close');
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
                    self.loadDataGridByPrgID();
                } else {
                    alert("save error!");
                }

            });

        },

        combineSQLData: function () {
            var la_oriRouteDtList = this.routeDtList;
            var allAccData = [];
            if (this.tmpCUD.deleteData.length == 0) {
                this.tmpCUD.dt_createData = [];
                this.tmpCUD.dt_updateData = [];
                _.each(this.accounts, function (accData) {
                    if (accData.length > 0) {
                        allAccData = _.union(allAccData, accData);
                    }
                });
                _.each(allAccData, function (type) {
                    var existIdx = _.findIndex(la_oriRouteDtList, {small_typ: type.small_typ.trim()});
                    if (existIdx == -1) {
                        PMS0830080VM.tmpCUD.dt_createData.push(type);
                    } else {
                        //判斷無效先拿掉，type與la_oriRouteDtList都一樣。
                        if (type.folio_nos != la_oriRouteDtList[existIdx].folio_nos || type.master_sta != la_oriRouteDtList[existIdx].master_sta) {
                            PMS0830080VM.tmpCUD.dt_updateData.push(type);
                        }

                    }
                });
            } else {
                var tmpDeleteData = this.tmpCUD.deleteData;
                this.initTmpCUD();
                this.tmpCUD.deleteData = tmpDeleteData;
            }
        }
    }
});