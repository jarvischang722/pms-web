/**
 * Created by Jun on 2017/7/28.
 * PMS0830080: 分帳規則設定
 */
/** DatagridRmSingleGridClass ***/
function DatagridSingleGridClass() {
}
DatagridSingleGridClass.prototype = new DatagridBaseClass();
DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    //
};
DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {

    PMS0830080VM.editingRow = row;
    PMS0830080VM.isEditStatus = true;
    PMS0830080VM.fetchSingleData();
};
/*** Class End  ***/

var Pms0830080Comp = Vue.extend({
    template: '#PMS0830080Tmp',
    props: ["accounts", "tmpCUD", "editingRow"],
    mounted: function () {
        this.getStypeRf();
    },
    data: function () {
        return {
            stypeRfList: [],
            activeSmallTyp: ""   //被選中的小分類

        };
    },
    methods: {
        //取得中小分類
        getStypeRf: function () {
            var _this = this;
            $.post('/api/getStypeRf', function (result) {
                _this.stypeRfList = result.stypeList;
            });
        },
        checkMasterAccStatus: function (small_typ) {

            var activeAccount = String(this.$parent.activeAccount);
            var account = _.findIndex(this.accounts["account" + activeAccount], {
                small_typ: small_typ.trim(),
                master_sta: 'Y'
            });
            if (account > -1) {
                return true;
            } 
                return false;
            

        },
        checkSmallTyp: function (small_typ) {
            var activeAccount = String(this.$parent.activeAccount);
            var account = _.findIndex(this.accounts["account" + activeAccount], {small_typ: small_typ.trim()});
            if (account > -1) {
                return true;
            } 
                return false;
            

        },
        toggleMasterAcc: function () {

            if (_.isEmpty(this.activeSmallTyp)) {
                alert("Please select a small type.");
                return;
            }
            this.checkRouteCodAndName();
            var selectedAcc = this.checkOtherAccSelected(this.activeSmallTyp.trim());
            var activeAccount = String(this.$parent.activeAccount);
            var accountIdx = _.findIndex(this.accounts["account" + activeAccount], {small_typ: this.activeSmallTyp.trim()});
            if (accountIdx > -1) {
                var account = "account" + String(accountIdx);
                console.log(this.accounts["account" + activeAccount]);
                this.accounts["account" + activeAccount][accountIdx].master_sta = this.accounts["account" + activeAccount][accountIdx].master_sta == "Y" ? "N" : "Y";

            } else {
                this.accounts["account" + activeAccount].push({
                    folio_nos: this.$parent.activeAccount,
                    master_sta: "Y",
                    route_cod: this.editingRow.route_cod,
                    small_typ: this.activeSmallTyp.trim()
                });
            }
        },
        toggleAccount: function (small_typ, master_sta) {

            this.checkRouteCodAndName();
            this.activeSmallTyp = small_typ;
            var selectedAcc = this.checkOtherAccSelected(small_typ);
            var activeAccount = String(this.$parent.activeAccount);
            var accountIdx = _.findIndex(this.accounts["account" + activeAccount], {small_typ: small_typ.trim()});

            if (accountIdx == -1) {
                //判斷此小分類有無在其他賬夾, 如果有的話刪掉原本帳夾
                if (selectedAcc != -1) {
                    this.accounts[selectedAcc].splice(_.findIndex(this.accounts[selectedAcc], {small_typ: small_typ.trim()}), 1);
                }
                this.accounts["account" + activeAccount].push({
                    folio_nos: this.$parent.activeAccount,
                    master_sta: master_sta || "N",
                    route_cod: this.editingRow.route_cod.trim(),
                    small_typ: small_typ.trim()
                });
            }
        },
        checkOtherAccSelected: function (small_typ) {
            var activeAccount = String(this.$parent.activeAccount);
            var selectedAcc = -1;
            _.each(this.accounts, function (data, account) {
                if (selectedAcc == -1 && account != "account" + activeAccount) {
                    selectedAcc = _.findIndex(data, {small_typ: small_typ.trim()}) > -1 ? account : -1;
                }
            });
            return selectedAcc;
        },
        checkRouteCodAndName: function () {
            if (_.isEmpty(this.editingRow.route_cod)) {
                alert("請先輸入規則代號!");
                return;
            }
            if (_.isEmpty(this.editingRow.route_nam)) {
                alert("請先輸入規則名稱!");
                return;
            }
        }


    }
});

var PMS0830080VM = new Vue({
    el: '#PMS0830080App',
    components: {Pms0830080Comp},
    data: {
        prg_id: gs_prg_id,
        pageOneDataGridRows: [],
        pageOneFieldData: [],
        editingRow: {},
        isEditStatus: false,
        isCreateStatus: false,
        routeDtList: [],
        accounts: {
            account1: [],
            account2: [],
            account3: [],
            account4: [],
            account5: [],
            account6: [],
            account7: [],
            account8: [],
            account9: []
        },
        activeAccount: 1,
        tmpCUD: {
            createData: {},
            updateData: {},
            deleteData: [],
            dt_createData: [],
            dt_updateData: [],
            dt_deleteData: []
        }

    },
    created: function () {
        //子組件更新的暫存
        this.$on("updateTmpCUD", function (data) {
            this.tmpCUD = data.tmpCUD;
        });

    },
    mounted: function () {

        this.getRouteData();
    },
    watch: {
        pageOneFieldData: function () {
            this.initDataGrid();
            this.dgIns.loadDgData(this.pageOneDataGridRows);
        },
        routeDtList: function (routeDtData) {
            this.accounts = {
                account1: _.where(routeDtData, {folio_nos: 1}),
                account2: _.where(routeDtData, {folio_nos: 2}),
                account3: _.where(routeDtData, {folio_nos: 3}),
                account4: _.where(routeDtData, {folio_nos: 4}),
                account5: _.where(routeDtData, {folio_nos: 5}),
                account6: _.where(routeDtData, {folio_nos: 6}),
                account7: _.where(routeDtData, {folio_nos: 7}),
                account8: _.where(routeDtData, {folio_nos: 8}),
                account9: _.where(routeDtData, {folio_nos: 9})
            };
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
            var colsOption =  [ { field:'ck',checkbox:true }];
            colsOption = _.union(colsOption,EZfieldClass.combineFieldOption(this.pageOneFieldData, 'PMS0830080_dg'));
            this.dgIns = new DatagridSingleGridClass();
            this.dgIns.init(this.prg_id, "PMS0830080_dg", colsOption,this.pageOneFieldData, {singleSelect:false} );
        },
        initAccounts: function () {
            this.accounts = {
                account1: [],
                account2: [],
                account3: [],
                account4: [],
                account5: [],
                account6: [],
                account7: [],
                account8: [],
                account9: []
            };
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
        getRouteData: function () {
            $.post('/api/prgDataGridDataQuery', {prg_id: this.prg_id})
                .done(function (response) {
                    console.log(response);
                    PMS0830080VM.pageOneDataGridRows = response.dataGridRows;
                    PMS0830080VM.pageOneFieldData = response.fieldData;
                })
                .fail(function (error) {
                    console.log(error);
                });
        },
        addRoute: function () {

            this.editingRow = {route_cod: '', route_nam: ''};
            this.isCreateStatus = true;
            this.isEditStatus = false;
            this.initAccounts();
            this.openRouteDialog();
        },
        delRoutes :function(){
            this.tmpCUD.deleteData = $("#PMS0830080_dg").datagrid("getChecked");
            this.doSave();
        },
        fetchSingleData: function () {

            this.isCreateStatus = false;
            this.isEditStatus = true;
            $.post('/api/getRouteDtByRouteCod', {route_cod: this.editingRow.route_cod})
                .done(function (response) {
                    PMS0830080VM.routeDtList = response.routeDtList;
                });

            this.openRouteDialog();
        },
        openRouteDialog: function () {
            this.initTmpCUD();
            this.activeAccount = 1;
            var dialog = $("#PMS0830080Dialog").removeClass('hide').dialog({
                modal: true,
                title: "公帳號",
                title_html: true,
                width: 1000,
                maxwidth: 1920,
                height: $(window).height(),
                dialogClass: "test",
                resizable: true
            });
        },
        closeRouteDialog: function () {
            this.isCreateStatus = false;
            this.isEditStatus = false;
            $("#PMS0830080Dialog").dialog('close');
        },
        doSave: function () {

            this.combineSQLData();
            console.log(this.tmpCUD);
            $.post("/api/doSavePMS0830080",this.tmpCUD,function(result){
                if(result.success){
                    PMS0830080VM.initTmpCUD();
                    alert("save success!");
                }else{
                    alert("save error!");
                }

            });

        },
        combineSQLData: function(){
            var la_oriRouteDtList = this.routeDtList;
            var allAccData = [];
            if(this.tmpCUD.deleteData.length == 0){
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
                        if (type.folio_nos != la_oriRouteDtList[existIdx].folio_nos || type.master_sta != la_oriRouteDtList[existIdx].master_sta) {
                            PMS0830080VM.tmpCUD.dt_updateData.push(type);
                        }

                    }
                });
            }else{
                var tmpDeleteData = this.tmpCUD.deleteData;
                this.initTmpCUD();
                this.tmpCUD.deleteData = tmpDeleteData;
            }
        }




    }
});