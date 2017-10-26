var prg_id = "PMS0620020";
var vmHub = new Vue();

/** DatagridRmSingleGridClass **/
function DatagridSingleGridClass(){
}

DatagridSingleGridClass.prototype = new DatagridBaseClass();

DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    //
};
DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
    // vm.editingRow = row;
    // vm.editStatus = true;
    // vm.fetchSingleData(row, function (success) {
    //     vm.showSingleGridDialog();
    // });
};

var vm = new Vue({
    el:"#PMS0620020App",
    mounted: function(){
        this.initTmpCUD();
        this.fetchUserInfo();
        this.loadSingleGridPageField();
        loadSalesClerkSGL();
    },
    data: {
        tmpCud:{
            createData: [],
            editData: [],
            deleteData: [],
            dt_createData: [],
            dt_editData: [],
            dt_deleteData: []
        },
        userInfo: {},
        editingRow: {

        },
        oriPageOneFieldData: [],
        pageOneFieldData: [],
        tabPageOneDataGridFieldData: [],
        tabPageTwoDataGridFieldData: [],
        dtMultiLangField: []
    },
    methods: {
        initTmpCUD: function(){
            this.tmpCud = {
                createData: [],
                editData: [],
                deleteData: [],
                dt_createData: [],
                dt_editData: [],
                dt_deleteData: []
            };
        },
        fetchUserInfo: function(){
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    vm.userInfo = result.userInfo;
                }
            });
        },
        loadSingleGridPageField: function(){
            var lo_params = {
                prg_id: prg_id,
                singleRowData: vm.editingRow
            }
            $.post("/api/singleGridPageFieldQuery", lo_params, function(result){
                var fieldData = result.fieldData;
                vm.oriPageOneFieldData = fieldData;
                vm.pageOneFieldData = _.values(_.groupBy(_.sortBy(fieldData, "row_seq"), "row_seq"));

                // //page2  datagrid 欄位屬性
                // if (_.findIndex(fieldData, {ui_type: 'grid'}) > -1) {
                //     vm.pageOneDataGridFieldData = fieldData[_.findIndex(fieldData, {ui_type: 'grid'})].datagridFields || [];
                //     vm.dtMultiLangField = _.filter(vm.pageOneDataGridFieldData, function (field) {
                //         return field.multi_lang_table != "";
                //     });
                //
                // }
                console.log("test: ");
                console.log(_.groupBy(_.sortBy(fieldData, "row_seq"), "row_seq"));
                console.log(fieldData);
            });
        }
    }

});

function loadSalesClerkSGL(){
    $('#sales_clerkSGL-table').datagrid({
        singleSelect: true,
        collapsible: true,
        // 從json 撈
        url: '/jsonData/sales/sales_clerkSGL.json',
        method: 'get',
        columns: [[
            {field: 'classCod', title: 'Team', width: 100},
            {field: 'startDat', title: 'Start Date', width: 100},
            {field: 'endDat', title: 'End Date', width: 100},
            {field: 'insDat', title: 'Add Date', width: 130},
            {field: 'insUsr', title: 'Add By', width: 100},
            {field: 'updDat', title: 'Upd Date', width: 130},
            {field: 'updUsr', title: 'Upd By', width: 100}
        ]]

    });
}