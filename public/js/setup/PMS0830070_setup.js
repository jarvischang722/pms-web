/**
 * Created by a14020 on 2017/8/9.
 */
function DatagridSingleGridClass() {
    
}
DatagridSingleGridClass.prototype = new DatagridBaseClass();
DatagridSingleGridClass.prototype.onClickRow = function (index, row) {

    PMS0830070VM.editingRow = row;
    PMS0830070VM.isEditStatus = true;
    PMS0830070VM.fetchSingleData(row);
};

var Pms0830070Comp = Vue.extend({
   template:'#PMS0830070Tmp',
    props:["editingRow"],
    created:{

    }
});

var PMS0830070VM = new Vue({
    el: '#PMS0830070App',
    props:["editingRow"],
    components: {Pms0830070Comp},
    data: {
        prg_id: gs_prg_id,
        pageOneDataGridRows: [],
        pageOneFieldData: [],
        editingRow: {},
        isEditStatus: false,
        isCreateStatus: false,
        routeDtList: [],
        activeAccount:1,
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
        this.$on("updateTmpCUD",function (data) {
            this.tmpCUD = data.tmpCUD;
        })
    },
    mounted: function () {
        this.getRouteData();
    },
    watch: {
        pageOneFieldData: function () {
            this.initDataGrid();
            this.dgIns.loadDgData(this.pageOneDataGridRows);
        },
        editingRow:{
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
                    console.log(response);
                    PMS0830070VM.pageOneDataGridRows = response.dataGridRows;
                    PMS0830070VM.pageOneFieldData = response.fieldData;
                })
                .fail(function (error) {
                    console.log(error);
                });
        },
        addRoute: function () {

            this.editingRow = {adjfolio_cod: '', adjfolio_rmk: ''};
            this.isCreateStatus = true;
            this.isEditStatus = false;
            this.openRouteDialog();
        },
        delRoutes :function(){
            this.tmpCUD.deleteData = $("#PMS0830070_dg").datagrid("getChecked");
            this.doSave();
        },
        initTmpCUD:function () {
            this.tmpCUD = {
                createData: [],
                updateData: [],
                deleteData: [],
                dt_createData: [],
                dt_updateData: [],
                dt_deleteData: []
            };
        },
        //撈單筆
        fetchSingleData:function () {
            this.isCreateStatus = false;
            this.isEditStatus = true;
            $.post('/api/qryPMS0830070SingleMn', {adjfolio_cod: this.editingRow.adjfolio_cod})
                .done(function (response) {
                    //PMS0830070VM.routeDtList = response.routeDtList;
                    console.log("//////////");
                    console.log(response);
                });

            this.openRouteDialog();
        },
        openRouteDialog:function () {
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
        }
    }

});