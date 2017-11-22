var vmHub = new Vue;
var prg_id = "RS0W202010";
var singlePage = Vue.extend({
    template: "#RS0W202010Tmp",
    data: function () {
        return {
            singleData: {},

            createStatus: false,        //新增狀態
            editStatus: false,          //編輯狀態
            deleteStatus: false,        //刪除狀態

            isModificable: false,       //決定是否可以修改資料
            isModificableFormat: false,  //決定是否可以修改訂單格式

            addEnable: true,
            editEnable: false,
            deleteEnable: false,
            cnfirmEnable: false,
            cancelEnable: false,
            saveEnable: false,
            dropEnable: false,

            dgIns: {},

            startTime: "",
            endTime: ""
        };
    },
    created: function () {
        var self = this;
        vmHub.$on("showReserve", function (bquet_nos) {
            self.fetchSingleData('0600006');
            //self.fetchDataGridData();
        });


    },
    mounted: function () {

    },
    methods: {
        showReserve: function () {
            var dialog = $("#gs-order-page").removeClass('hide').dialog({
                modal: true,
                title: "查詢訂席",
                title_html: true,
                width: 1000,
                height: 700,
                maxwidth: 1920,
                dialogClass: "test",
                resizable: true
            });
        },

        fetchSingleData: function (bquet_nos) {
            var self = this;
            var lo_params =
                {
                    bquet_nos: bquet_nos
                };
            $.post("/reserveBanquet/qryPageTwoData", lo_params, function (result) {
                if (!_.isUndefined(result.data)) {
                    self.singleData = result.data;
                    console.log(self.singleData);
                    self.showReserve();　
                } else {
                    alert(result.error.errorMsg);
                }
            });
        },

        //抓取顯示資料
        fetchDataGridData: function () {
            var self = this;
            $.post("/api/prgDataGridDataQuery", {prg_id: prg_id}, function (result) {
                self.prgFieldDataAttr = result.fieldData;
                self.showDataGrid(result.fieldData, result.dataGridRows);
            });
        },
        //顯示資料
        showDataGrid: function (fieldData, dataGridRows) {
            // var self = this;
            // var columnsData = DatagridFieldAdapter.combineFieldOption(fieldData, 'RS00202010_dt');
            // var hasMultiLangField = _.filter(fieldData, function (field) {
            //     return field.multi_lang_table != "";
            // }).length > 0 ? true : false;
            // if (hasMultiLangField) {
            //     columnsData.unshift({
            //         type: 'textbox',
            //         title: "Multi Lang",
            //         field: "langAction",
            //         align: "center",
            //         width: 100,
            //         formatter: function (value, row, index) {
            //             return '<a  href="javascript:void(0)" onclick="editFieldMultiLang(' + index + ')">Edit</a>';
            //         }
            //
            //     });
            // }
            // var dgData = {total: dataGridRows.length, rows: dataGridRows};
            // $('#RS00202010_dt').datagrid({
            //     columns: [columnsData],
            //     remoteSort: false,
            //     singleSelect: true,
            //     selectOnCheck: true,
            //     checkOnSelect: true,
            //     // width: "100%", // error:左側打開後table會擠壓到右側欄位
            //     data: dgData,
            //     onClickCell: self.onClickCell,
            //     onEndEdit: self.onEndEdit,
            //     onDropColumn: self.doSaveColumnFields, //當移動順序欄位時
            //     onResizeColumn: self.doSaveColumnFields,  //當欄位時寬度異動時
            //     onSortColumn: function () {
            //         $("#dgCheckbox").datagrid('uncheckAll');
            //     }
            //
            // }).datagrid('columnMoving');
        }
    }
});

var RS00202010VM = new Vue({
    el: "#RS00202010Main",
    components: {
        singlePage
    },
    data: {
        searchDate: new Date(),
        pageOneData: {}
    },
    mounted: function () {
        //啟用fixTable
        $("#gs-fixTable").tableHeadFixer({"left": 1});
        $("table.treeControl").agikiTreeTable({persist: true, persistStoreName: "files"});
        this.qryPageOneData();
    },
    methods: {
        doSearch: function () {
            this.qryPageOneData();
        },
        qryPageOneData: function () {
            var self = this;
            var lo_params = {use_dat: this.searchDate};
            $.post("/reserveBanquet/qryPageOneData", lo_params, function (result) {
                if (result.success) {
                    self.pageOneData = result.pageOneData;
                }
            });
        },
        addReserve: function () {
            vmHub.$emit("showReserve", {bquet_nos: ""});
        },

        showReserve: function (bquet_nos) {
            vmHub.$emit("showReserve", {bquet_nos: bquet_nos});
        },

        initToday: function () {
            this.searchDate = new Date();
        }
    }
});