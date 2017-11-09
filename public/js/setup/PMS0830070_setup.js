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
    PMS0830070VM.fetchSingleData(row);
    PMS0830070VM.dgIns.editIndex = index;
    PMS0830070VM.isEditStatus = true;
};

var Pms0830070Comp = Vue.extend({
    template: '#PMS0830070Tmp',
    props: ['editingRow', 'singleData', "tmpCUD", 'singleDataDt', 'dt2ItemNosDataList'],
    data: function () {
        return {
            dialogServiceItemVisible: false,
            deleteDtTmp: [],
            dt2ShowList: [],
            dtShowList: [],
            dtSelItemNosShowList: [],
            dt2SelectedItemNos: [],              //dt2已選擇項目
            dt2DisableItemNos: [],               //dt2禁用項目
            itemNosCheckedTemp: []               //服務項目dtSelItemNosShowList勾選暫存(優先權高)
        };
    },
    created: function () {
        var self = this;
        vmHub.$on("clearItemNosCheckedTemp", function () {
            self.itemNosCheckedTemp = [];
            self.oriItemNosChecked = [];
            self.dtSelItemNosShowList = [];
        });
    },
    methods: {
        //點擊明細跳窗
        openDt2: function (item) {
            var ls_itemName = item.item_nam;
            var ls_seq_nos = item.seq_nos;
            if (ls_itemName == "" || _.isNull(ls_itemName)) {
                alert("請輸入帳單明細");
                return;
            }

            var self = this;
            var lo_singleData = PMS0830070VM.singleData;
            lo_singleData.seq_nos = ls_seq_nos;
            self.qrySelectedItemNos(item);
            $.post('/api/qryDt2SelectedItemNos', lo_singleData, function (response) {
                self.qryDt2DisableItemNos(lo_singleData, function (result) {
                    if (!_.isUndefined(item.createRow)) {
                        self.dt2SelectedItemNos = [];
                    }
                    else {
                        self.dt2SelectedItemNos = response.selectedData;
                    }

                    self.chkItemNosStatus(item);
                    self.dialogServiceItemVisible = true;
                });
            });
        },

        //查詢dt2禁用項目
        qryDt2DisableItemNos: function (lo_singleData, callback) {
            var self = this;
            $.post("/api/qryDt2DisableItemNos", lo_singleData, function (result) {
                self.dt2DisableItemNos = result.dt2DisableItemNos;
                callback(result.success);
            });
        },

        //驗證此筆服務項目狀態
        chkItemNosStatus: function (item) {
            var self = this;
            this.dt2ShowList = [];
            _.each(this.dt2ItemNosDataList, function (lo_data) {
                    //原始資料驗證
                    var ln_sel_item_nos = _.findIndex(self.dt2SelectedItemNos, {item_nos: lo_data.item_nos});
                    var ln_dis_item_nos = _.findIndex(self.dt2DisableItemNos, {item_nos: lo_data.item_nos});

                    lo_data.checked = (ln_sel_item_nos != -1 || ln_dis_item_nos != -1) ? true : false;
                    lo_data.disabled = (ln_dis_item_nos != -1) ? true : false;

                    _.each(PMS0830070VM.tmpCUD.dt_deleteData, function (lo_dtDelData) {
                        var ln_delNosItem = _.findIndex(self.dt2DisableItemNos, {
                            seq_nos: lo_dtDelData.seq_nos,
                            item_nos: lo_data.item_nos
                        });
                        if (ln_delNosItem != -1) {
                            lo_data.checked = false;
                            lo_data.disabled = false;
                        }
                    });

                    //暂存驗證
                    if (self.itemNosCheckedTemp.length > 0) {
                        var lo_temp = _.findWhere(self.itemNosCheckedTemp, {item_nos: lo_data.item_nos});
                        if (!_.isUndefined(lo_temp)) {
                            if (lo_temp.seq_nos != PMS0830070VM.singleData.seq_nos && lo_temp.checked == true) {
                                lo_data.disabled = true;
                            }
                            else {
                                lo_data.disabled = false;
                            }
                            lo_data.checked = lo_temp.checked;
                        }
                    }

                    if (!_.isUndefined(item.createRow)) {
                        _.each(self.dt2SelectedItemNos, function (lo_selItemNos) {
                            if (lo_selItemNos.item_nos == lo_data.item_nos) {
                                lo_data.checked = false;
                                lo_data.disabled = false;
                            }
                        });
                    }
                    self.dt2ShowList.push(lo_data);
                }
            );
        },

        //dt2服務項目資料暫存更新
        updateCheckData: function (item, index) {
            this.dt2ShowList[index].checked = (this.dt2ShowList[index].checked) ? false : true;
            var lo_temp = _.findIndex(this.itemNosCheckedTemp, {item_nos: this.dt2ShowList[index].item_nos});
            if (lo_temp == -1) {
                this.itemNosCheckedTemp.push({
                    seq_nos: PMS0830070VM.singleData.seq_nos,
                    item_sna: this.dt2ShowList[index].item_sna,
                    item_nos: this.dt2ShowList[index].item_nos,
                    checked: this.dt2ShowList[index].checked
                });
            }
            else {
                this.itemNosCheckedTemp[lo_temp].seq_nos = PMS0830070VM.singleData.seq_nos;
                this.itemNosCheckedTemp[lo_temp].item_sna = this.dt2ShowList[index].item_sna;
                this.itemNosCheckedTemp[lo_temp].item_nos = this.dt2ShowList[index].item_nos;
                this.itemNosCheckedTemp[lo_temp].checked = this.dt2ShowList[index].checked;
            }
            this.changeDtItemNosShowList(item);
            this.insertDt2TmpCUD(index);
        },

        // 新增資料進tmpCUD
        insertDt2TmpCUD: function (dt2ListIndex) {
            var lo_itemNos = this.dt2ShowList[dt2ListIndex];
            var ln_selIsExist = _.findIndex(this.dt2SelectedItemNos, {item_nos: lo_itemNos.item_nos});
            var lo_singleData = PMS0830070VM.singleData;
            var ls_tmpCUD_type = "";
            var lo_tmpCUD = PMS0830070VM.tmpCUD;
            var lo_params = {
                seq_nos: lo_singleData.seq_nos,
                item_nos: lo_itemNos.item_nos
            };

            if (ln_selIsExist == -1) {
                if (lo_itemNos.checked == true) {
                    ls_tmpCUD_type = "dt2_createData";
                }
            }
            else {
                if (lo_itemNos.checked == false) {
                    ls_tmpCUD_type = "dt2_deleteData";
                }
            }

            var ln_tmpCudDt2CreateIsExist = _.findIndex(PMS0830070VM.tmpCUD.dt2_createData, lo_params);
            // 清除dt2_createData重複
            if (ln_tmpCudDt2CreateIsExist != -1) {
                PMS0830070VM.tmpCUD.dt2_createData = _.without(lo_tmpCUD[ls_tmpCUD_type], PMS0830070VM.tmpCUD.dt2_createData[ln_tmpCudDt2CreateIsExist]);
            }

            var ln_tmpCudDt2DeleteIsExist = _.findIndex(PMS0830070VM.tmpCUD.dt2_deleteData, lo_params);
            // 清除dt2_deleteData重複
            if (ln_tmpCudDt2DeleteIsExist != -1) {
                PMS0830070VM.tmpCUD.dt2_deleteData = _.without(lo_tmpCUD[ls_tmpCUD_type], PMS0830070VM.tmpCUD.dt2_deleteData[ln_tmpCudDt2DeleteIsExist]);
            }

            if (ls_tmpCUD_type != "") {
                lo_tmpCUD[ls_tmpCUD_type].push({
                    adjfolio_cod: lo_singleData.adjfolio_cod,
                    seq_nos: lo_singleData.seq_nos,
                    item_nos: lo_itemNos.item_nos
                });
            }
        },

        //查詢此筆dt2資料
        qrySelectedItemNos: function (item) {
            var self = this;
            var params = {
                seq_nos: item.seq_nos,
                adjfolio_cod: this.singleData.adjfolio_cod
            };

            console.log(item.createRow);
            $.post('/api/qryDt2SelectedItemNos', params, function (response) {
                if(!_.isUndefined(item.createRow)){
                    self.dt2SelectedItemNos = [];
                }
                else{
                    self.dt2SelectedItemNos = response.selectedData;
                }
                self.changeDtItemNosShowList(item);
            });
        },

        //dt的服務項目顯示更新
        changeDtItemNosShowList: function (item) {
            var self = this;
            if (!_.isUndefined(item.createRow)) {
                this.dtSelItemNosShowList = [];
            }
            else {
                this.dtSelItemNosShowList = _.clone(this.dt2SelectedItemNos);
                var la_itemNosTemp = _.where(self.itemNosCheckedTemp, {seq_nos: PMS0830070VM.singleData.seq_nos});
                _.each(la_itemNosTemp, function (lo_itemNosTemp) {
                    var lo_selItemNos = _.findWhere(self.dtSelItemNosShowList, {item_nos: lo_itemNosTemp.item_nos});
                    if (!_.isUndefined(lo_selItemNos)) {
                        if (lo_itemNosTemp.checked == false) {
                            self.dtSelItemNosShowList = _.without(self.dtSelItemNosShowList, lo_selItemNos);
                        }
                    }
                    else {
                        self.dtSelItemNosShowList.push(lo_itemNosTemp);
                    }
                });
            }

        },

        //新增明細
        btnAddDtDetail: function () {
            if (PMS0830070VM.singleData.adjfolio_cod.trim() == "") {
                alert("請填入代號");
                return;
            }
            var singleData = PMS0830070VM.singleData;
            var seqNosTmp = 1;
            if (PMS0830070VM.singleDataDt.length != 0) {
                seqNosTmp = PMS0830070VM.singleDataDt[PMS0830070VM.singleDataDt.length - 1].seq_nos;
            }
            if (singleData.adjfolio_cod != "") {
                var singleDataDtInfo = PMS0830070VM.singleDataDt;

                var row = {
                    createRow: "Y",
                    adjfolio_cod: singleData.adjfolio_cod,
                    athena_id: singleData.athena_id,
                    hotel_cod: singleData.hotel_cod,
                    seq_nos: singleDataDtInfo.length == 0 ? 1 : seqNosTmp + 1,
                    item_nam: ""
                };

                PMS0830070VM.singleDataDt.push(row);
                PMS0830070VM.tmpCUD.dt_createData.push(row);
                this.dtSelItemNosShowList = [];
            }
            else {
                alert("請輸入代號");
            }
        },

        //刪除明細
        btnDeleteDtDetail: function (lo_delDtTmp) {
            var self = this;
            var lo_tmpCUD = PMS0830070VM.tmpCUD;
            var lo_singleDataDt = _.findWhere(PMS0830070VM.singleDataDt, {seq_nos: lo_delDtTmp});

            //移除dt_createData重複資料
            var ln_dtCreateIsExist = _.findIndex(lo_tmpCUD.dt_createData, {seq_nos: lo_delDtTmp});
            if (ln_dtCreateIsExist != -1) {
                lo_tmpCUD.dt_createData = _.without(lo_tmpCUD.dt_createData, lo_tmpCUD.dt_createData[ln_dtCreateIsExist]);
            }

            //移除dt_updateData重複資料
            var ln_dtUpdateIsExist = _.findIndex(lo_tmpCUD.dt_updateData, {seq_nos: lo_delDtTmp});
            if (ln_dtUpdateIsExist != -1) {
                lo_tmpCUD.dt_updateData = _.without(lo_tmpCUD.dt_updateData, lo_tmpCUD.dt_updateData[ln_dtUpdateIsExist]);
            }

            //移除dt_deleteData重複資料
            var ln_dtDeleteIsExist = _.findIndex(lo_tmpCUD.dt_deleteData, {seq_nos: lo_delDtTmp});
            if (ln_dtDeleteIsExist != -1) {
                lo_tmpCUD.dt_deleteData = _.without(lo_tmpCUD.dt_deleteData, lo_tmpCUD.dt_deleteData[ln_dtDeleteIsExist]);
            }

            var la_delData = _.where(self.itemNosCheckedTemp, {seq_nos: lo_delDtTmp});
            if (!_.isUndefined(lo_singleDataDt)) {
                //刪除原始資料
                if (_.isUndefined(lo_singleDataDt.createRow)) {
                    lo_tmpCUD.dt_deleteData.push(lo_singleDataDt);
                }
                //刪除新增
                else {
                    _.each(PMS0830070VM.tmpCUD.dt2_createData, function (lo_createData) {
                        if (lo_createData.seq_nos == lo_delDtTmp) {
                            PMS0830070VM.tmpCUD.dt2_createData = _.without(PMS0830070VM.tmpCUD.dt2_createData, lo_createData);
                        }
                    });
                    //
                    //     _.each(PMS0830070VM.tmpCUD.dt2_deleteData, function (lo_deleteData) {
                    //         if (lo_deleteData.seq_nos == lo_delDtTmp) {
                    //             PMS0830070VM.tmpCUD.dt2_deleteData = _.without(PMS0830070VM.tmpCUD.dt2_deleteData, lo_deleteData);
                    //         }
                    //     });
                }
                PMS0830070VM.singleDataDt = _.without(PMS0830070VM.singleDataDt, lo_singleDataDt);
            }

            _.each(la_delData, function (lo_delData) {
                self.itemNosCheckedTemp = _.without(self.itemNosCheckedTemp, lo_delData);
            });
            // this.itemNosCheckedTemp = [];
            this.dtSelItemNosShowList = [];
        },

        updateDtData: function (item) {
            var lo_seq_nos = item.seq_nos;
            var lo_tmpCUD = PMS0830070VM.tmpCUD;

            //移除dt_createData重複資料
            var ln_dtCreateIsExist = _.findIndex(lo_tmpCUD.dt_createData, {seq_nos: lo_seq_nos});
            if (!_.isUndefined(item.createRow) && item.createRow == "Y") {
                lo_tmpCUD.dt_createData[ln_dtCreateIsExist].item_nam = item.item_nam;
            }
            else {
                if (ln_dtCreateIsExist != -1) {
                    lo_tmpCUD.dt_createData = _.without(lo_tmpCUD.dt_createData, lo_tmpCUD.dt_createData[ln_dtCreateIsExist]);
                }
                //移除dt_updateData重複資料
                var ln_dtUpdateIsExist = _.findIndex(lo_tmpCUD.dt_updateData, {seq_nos: lo_seq_nos});
                if (ln_dtUpdateIsExist != -1) {
                    lo_tmpCUD.dt_updateData = _.without(lo_tmpCUD.dt_updateData, lo_tmpCUD.dt_updateData[ln_dtUpdateIsExist]);
                }
                lo_tmpCUD.dt_updateData.push(item);
            }
        },

        doSaveGrid: function () {
            var self = this;
            if (PMS0830070VM.singleData.adjfolio_rmk.trim() == "") {
                alert("請填入名稱");
                return;
            }
            if (!_.isUndefined(PMS0830070VM.singleData.createRow) && PMS0830070VM.singleData.createRow == "Y") {
                PMS0830070VM.tmpCUD.createData = PMS0830070VM.singleData;
            }
            else {
                PMS0830070VM.tmpCUD.updateData = PMS0830070VM.singleData;
            }

            PMS0830070VM.doSave(function (result) {
                PMS0830070VM.initTmpCUD();
                $.post('/api/qryPMS0830070SingleData', self.singleData)
                    .done(function (response) {
                        PMS0830070VM.singleData = response.mnData;
                        PMS0830070VM.singleDataDt = response.dtData;
                        PMS0830070VM.oriSingleDataDt = _.clone(response.dtData);
                        PMS0830070VM.dt2ItemNosDataList = response.dt2ItemNosDataList;
                        self.itemNosCheckedTemp = [];
                    });
                // PMS0830070VM.oriSingleDataDt = _.clone(PMS0830070VM.singleData);
            });

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
        activeAccount: 1,
        singleData: {},
        singleDataDt: {},
        oriSingleDataDt: {},
        dt2ItemNosDataList: [],             //dt2所有服務項目
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
        searchCond: {},   //搜尋條件
        isEditStatus: true
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

            if (_.isUndefined(callback)) {
                callback = function () {
                };
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
            PMS0830070VM.singleData = {adjfolio_cod: '', adjfolio_rmk: '', createRow: "Y"};
            PMS0830070VM.singleDataDt = [];
            PMS0830070VM.oriSingleDataDt = {};
            PMS0830070VM.isEditStatus = false;

            $.post('/api/qryDt2ItemNosList', PMS0830070VM.singleData)
                .done(function (response) {
                    PMS0830070VM.dt2ItemNosDataList = response.dt2ItemNosDataList;
                    self.openRouteDialog();
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
        },

        //取得單筆
        fetchSingleData: function (editingRow) {
            var self = this;
            $.post('/api/qryPMS0830070SingleData', editingRow)
                .done(function (response) {
                    PMS0830070VM.singleData = response.mnData;
                    PMS0830070VM.singleDataDt = response.dtData;
                    PMS0830070VM.oriSingleDataDt = _.clone(response.dtData);
                    PMS0830070VM.dt2ItemNosDataList = response.dt2ItemNosDataList;
                    self.openRouteDialog();
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
                width: 800,
                maxwidth: 1920,
                height: $(window).height() - 200,
                dialogClass: "test",
                resizable: true
            });
            vmHub.$emit("clearItemNosCheckedTemp");
        },

        closeGridDialog: function () {
            PMS0830070VM.editingRow = {};
            PMS0830070VM.singleData = {};
            PMS0830070VM.singleDataDt = {};
            PMS0830070VM.oriSingleDataDt = {};
            PMS0830070VM.initTmpCUD();
            $("#PMS0830070Dialog").dialog('close');
            this.dgIns.endEditing();
        },

        doSave: function (callback) {
            var self = this;
            if (_.isUndefined(callback)) {
                callback = function () {
                };
            }
            waitingDialog.show('Saving...');
            var params = _.extend({prg_id: gs_prg_id}, this.tmpCUD);

            $.post("/api/doSavePMS0830070", params, function (result) {
                callback(result.success);
                if (result.success) {
                    PMS0830070VM.initTmpCUD();
                    PMS0830070VM.loadDataGridByPrgID(function (success) {
                    });

                    alert('save success!');
                    waitingDialog.hide();

                } else {
                    waitingDialog.hide();
                    alert(result.errorMsg);
                }
            });

        }
    }
});