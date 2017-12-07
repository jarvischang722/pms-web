/**
 * Created by a17017 on 2017/12/07
 */

var go_salesVisitRecord = Vue.extend({
    template: "#salesVisitRecordTmp",
    props: ["isCreateStatus", "isEditStatus", "isOnlySingleGrid", "editRows"],
    data: function(){
        return{
            isFirstData: false,
            isLastData: false,
            BTN_action: false,
            isLoadingDialog: false,
            loadingText: "",
            singleData:{},
            oriSingleData: {},
            fieldsData: [],
            oriFieldsData: []
        };
    },
    mounted: function(){
        if(!this.isOnlySingleGrid){
            this.loadDataGridByPrgID();
        }
    },
    watch: {
        rowData: function(val){
            this.initData();
            this.fetchSingleGridFieldData();

            var nowDatagridRowIndex = $("#visitRecord_dg").datagrid('getRowIndex', val);

            $("#visitRecord_dg").datagrid('selectRow', nowDatagridRowIndex);

            if ($("#visitRecord_dg").datagrid('getRowIndex', val) == 0) {
                //已經到第一筆
                this.isFirstData = true;
                this.isLastData = false;
                if ($("#PMS0620050_dg").datagrid('getRowIndex', val) == vm.pageOneDataGridRows.length - 1) {
                    this.isLastData = true;
                }

            }
            else if ($("#visitRecord_dg").datagrid('getRowIndex', val) == vm.pageOneDataGridRows.length - 1) {
                //已經到最後一筆
                this.isFirstData = false;
                this.isLastData = true;
            }
            else {

                this.isFirstData = false;
                this.isLastData = false;
            }
        }
    },
    methods:{
        loadDataGridByPrgID: function(){},
        initData: function(){},
        fetchSingleGridFieldData: function(){},
        fetchSingleGridRowData: function(){}
    }
});