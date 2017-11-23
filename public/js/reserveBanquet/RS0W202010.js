/**
 * Created by a16009 on 2017/11/10.
 * 程式編號: RS0W202010
 * 程式名稱: 定席作業
 */

var vmHub = new Vue;
var prg_id = "RS0W202010";
var singlePage = Vue.extend({
    template: "#RS0W202010Tmp",
    data: function () {
        return {
            //系統參數
            mask_hfd: "",               //前檯金額格式
            round_hfd: "",              //前檯進位小數位數
            rent_cal_dat: "",           //滾房租日期
            required_bride_nam: "",     //新郎、新娘是否為必Key

            singleData: {},
            singleField: {},
            custSelectData: [],
            selectOption: {},

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

            self.loadSingleGridPageField(function () {
                //self.fetchSingleData(bquet_nos);
                self.fetchSingleData('0600006');
            });
        });
    },
    mounted: function () {
        this.getSystemParam();
    },
    methods: {

        /**
         * 取系統參數
         */
        getSystemParam: function () {
            var self = this;

            //訂貨日期切換的時間
            var lo_params = {
                paramName: "mask_hfd"
            };
            $.post("/reserveBanquet/qrySystemParam", lo_params, function (result) {
                if (!_.isUndefined(result.data)) {
                    self.mask_hfd = result.data.mask_hfd;
                } else {
                    alert(result.error.errorMsg);
                }
            });

            //訂貨日期切換的時間
            lo_params = {
                paramName: "round_hfd"
            };
            $.post("/reserveBanquet/qrySystemParam", lo_params, function (result) {
                if (!_.isUndefined(result.data)) {
                    self.round_hfd = result.data.round_hfd;
                } else {
                    alert(result.error.errorMsg);
                }
            });

            //訂貨日期切換的時間
            lo_params = {
                paramName: "rent_cal_dat"
            };
            $.post("/reserveBanquet/qrySystemParam", lo_params, function (result) {
                if (!_.isUndefined(result.data)) {
                    self.rent_cal_dat = result.data.rent_cal_dat;
                } else {
                    alert(result.error.errorMsg);
                }
            });

            //取得所有訂單格式
            lo_params = {
                paramName: "required_bride_nam"
            };
            $.post("/reserveBanquet/qrySystemParam", lo_params, function (result) {
                self.isLoading = false;
                if (!_.isUndefined(result.data)) {
                    self.required_bride_nam = result.data.required_bride_nam;
                } else {
                    alert(result.error.errorMsg);
                }
            });

        },

        /**
         * 撈取單筆資料
         * @param bquet_nos {String} : 訂席單號
         */
        fetchSingleData: function (bquet_nos) {
            var self = this;
            var lo_params = {
                    bquet_nos: bquet_nos
                };
            $.post("/reserveBanquet/qryPageTwoData", lo_params, function (result) {
                if (!_.isUndefined(result.data)) {
                    self.singleData = result.data;
                    self.fetchDataGridData();
                } else {
                    alert(result.error.errorMsg);
                }
            });
        },

        /**
         * 抓取page_id 2 單頁顯示欄位
         */
        loadSingleGridPageField: function (callback) {
            if (_.isUndefined(callback) || _.isNull(callback)) {
                callback = function () {
                };
            }
            var self = this;
            $.post("/api/singleGridPageFieldQuery", {
                prg_id: prg_id,
                page_id: 2,
                singleRowData: self.editingRow
            }, function (result) {
                var fieldData = result.fieldData;

                _.each(result.fieldData, function (value) {
                    if(value.ui_type == "select") {
                        self.selectOption[value.ui_field_name] = value.selectData;
                    }
                });

                self.singleField = fieldData;
                //self.pageTwoFieldData = _.values(_.groupBy(_.sortBy(fieldData, "row_seq"), "row_seq"));
                //page2  datagrid 欄位屬性
                // if (_.findIndex(fieldData, {ui_type: 'grid'}) > -1) {
                //     $("#dt_dg_DIV").show();
                //     vm.pageTwoDataGridFieldData = fieldData[_.findIndex(fieldData, {ui_type: 'grid'})].datagridFields || [];
                //     vm.dtMultiLangField = _.filter(vm.pageTwoDataGridFieldData, function (field) {
                //         return field.multi_lang_table != "";
                //     });
                //
                //     vmHub.$emit("updateDtMultiLangField", {dtMultiLangField: vm.dtMultiLangField});
                // }
                callback(result);
            });

        },

        /**
         * 取DT欄位及資料
         */
        fetchDataGridData: function () {
            var self = this;
            $.post("/api/prgDataGridDataQuery", {prg_id: prg_id, searchCond: {bquet_nos: self.singleData.bquet_nos}}, function (result) {
                self.prgFieldDataAttr = result.fieldData;

                self.dgIns = new DatagridBaseClass();
                self.dgIns.init(prg_id, 'RS0W202010_dt', DatagridFieldAdapter.combineFieldOption(result.fieldData, 'RS0W202010_dt'));
                self.dgIns.loadDgData(result.dataGridRows);

                self.showReserve();
            });
        },

        /**
         * 開窗
         */
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

$('.easyUi-custom1').tabs({
});