/**
 * Created by a16009 on 2017/11/10.
 * 程式編號: RS0W202010
 * 程式名稱: 定席作業
 */

var vmHub = new Vue;
var prg_id = "RS0W202010";

//跳窗將資料選回去單筆欄位
Vue.component('text-select-grid-dialog-tmp', {
    template: "#chooseDataDialogTmp",
    data: function () {
        return {
            fieldNameConditionTmp: [],
            gridColumns: [],
            updateFieldNameTmp: [],
            gridData: [],
            isFistData: false,
            isLastData: false,
            dtEditIndex: undefined
        };
    },
    created: function () {
        var self = this;
        vmHub.$on('showPopUpDataGrid', function (result) {
            self.showPopUpDataGrid(result);
        });
    },
    methods: {

        //顯示點選popupgrid跳出來的視窗
        showPopUpDataGrid: function (result) {
            var self = this;
            var textDataGrid = result.showDataGrid;
            var updateFieldName = result.updateFieldNameTmp;
            var fieldNameChangeLanguage = result.fieldNameChangeLanguageTmp;
            this.fieldNameConditionTmp = [];
            this.fieldConditionTmp = [];
            this.gridData = [];
            delete textDataGrid ['errorMsg'];
            var columnsData = [];
            var textDataGridArray = Object.keys(textDataGrid).map(function (key) {
                return textDataGrid[key];
            });
            for (var col in textDataGrid[0]) {
                _.each(fieldNameChangeLanguage, function (name, field) {
                    if (col == field) {
                        columnsData.push({
                            type: 'textbox',
                            field: col,
                            title: name,
                            width: 150,
                            align: "left"
                        });
                        self.fieldNameConditionTmp.push({value: field, display: name});
                        self.fieldConditionTmp.push({value: field});
                    }
                });
            }

            self.gridData = textDataGridArray;
            var height = document.documentElement.clientHeight - 160;
            var width = document.documentElement.clientWidth / 2 - 25;    //browser 寬度 - 200功能列
            $('#chooseGrid').datagrid({
                columns: [columnsData],
                singleSelect: true,
                data: textDataGridArray,
                height: height,
                width: width,
            }).datagrid('columnMoving');
            self.updateFieldNameTmp = updateFieldName;
        },

        //將選擇到的資料帶回Page2
        chooseDataBackGridSingle: function () {
            var self = this;
            var selectTable = $('#chooseGrid').datagrid('getSelected');
            var chooseData = self.updateFieldNameTmp;
            var updateFieldName = self.updateFieldNameTmp;

            if (selectTable != null) {
                _.each(selectTable, function (selectValue, selectField) {
                    _.each(updateFieldName, function (updateValue, updateField) {
                        if (selectField == updateValue) {
                            chooseData[updateField] = selectValue;
                        }
                    });
                });
            }else {
                _.each(chooseData, function (chooseValue, chooseField) {
                    chooseData[chooseField] = "";  //SAM20170930
                });
            }
            vmHub.$emit('updateBackSelectData', chooseData);
            $("#dataPopUpGridDialog").dialog('close');
        },
        txtSearchChangeText: function (keyContent) {
            var allData = this.gridData;
            var selectFieldName = $('#cbSelect').val();
            var selectCondition = $('#txtSelectCondition').val();

            var dataGrid = _.filter(allData, function (row) {
                if (row[selectFieldName].includes(selectCondition))
                    return row;
            });
            $('#chooseGrid').datagrid('loadData', dataGrid);

        }
    }
});


var singlePage = Vue.extend({
    template: "#RS0W202010Tmp",
    data: function () {
        return {
            userInfo: {},               //登入的使用者資料

            //系統參數
            mask_hfd: "",               //前檯金額格式
            round_hfd: "",              //前檯進位小數位數
            rent_cal_dat: "",           //滾房租日期
            required_bride_nam: "",     //新郎、新娘是否為必Key

            singleData: {},
            singleField: {},
            singleDataEmpty : {},

            selectOption: {},

            selectPopUpGridData: [],

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
        vmHub.$on("showReserve", function (PostData) {

            self.loadSingleGridPageField(function () {
                if(PostData.bquet_nos != "") {
                    self.fetchSingleData(PostData.bquet_nos);
                }
                else {
                    //self.fetchSingleData('0600006');
                    self.singleData = _.clone(self.singleDataEmpty);
                }

                self.showReserve();
            });
        });

        vmHub.$on('updateBackSelectData', function (chooseData) {
            self.singleData = _.extend(self.singleData, chooseData);
        });
    },
    mounted: function () {
        this.getSystemParam();
        this.fetchUserInfo();
        this.fetchDataGridData();
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
         * 取得使用者資料
         */
        fetchUserInfo: function () {
            var self = this;
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    self.userInfo = result.userInfo;
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
                    }
                    else {
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

                self.singleField = result.fieldData;

                _.each(result.fieldData, function (value) {

                    self.singleDataEmpty[value.ui_field_name] = "";

                    if(value.ui_type == "select") {
                        self.selectOption[value.ui_field_name] = value.selectData;
                    }
                });

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
        },

        //跳窗選擇多欄位
        chkClickPopUpGrid: function (fieldName) {

            var lo_field;
            var self = this;

            _.each(this.singleField, function (value) {
                if(value.ui_field_name == fieldName)
                    lo_field = value;
            });

            this.changeEditingForFieldRule(lo_field.rule_func_name);
            if (lo_field.ui_type == "popupgrid") {
                var params = {
                    prg_id: prg_id,
                    fields: lo_field,
                    singleRowData: JSON.parse(JSON.stringify(this.singleData))
                };

                $.post("/api/popUpGridData", params, function (result) {
                    if (result != null) {
                        self.selectPopUpGridData = result.showDataGrid;
                        vmHub.$emit('showPopUpDataGrid', result);
                        self.showPopUpGridDialog();
                    }
                });
            }
        },

        //改成編輯中
        changeEditingForFieldRule: function (rule_func_name) {
            if (!_.isUndefined(rule_func_name) && !_.isEmpty(rule_func_name)) {
                this.isEditingForFieldRule = true;
            }
        },

        //顯示textgrid跳窗訊息
        showPopUpGridDialog: function () {
            this.dialogVisible = true;
            var height = document.documentElement.clientHeight - 60; //browser 高度 - 60功能列
            var width = document.documentElement.clientWidth / 2;    //browser 寬度 - 200功能列

            var dialog = $("#dataPopUpGridDialog").dialog({
                autoOpen: false,
                modal: true,
                height: height,
                width: width,
                title: prg_id,
                resizable: true
            });
            dialog.dialog("open");

            // 給 dialog "內容"高 值
            //$(".singleGridContent").css("height", _.min([maxHeight, height]) + 20);
        },

        /**
         * 離開按鈕
         */
        exit: function () {
            $("#gs-order-page").dialog('close');
        },

        /**
         * 存檔按鈕
         */
        save: function () {
            var self = this;
            self.isLoading = true;

            var trans_cod = "";

            if(self.createStatus){
                trans_cod = 'RS0W2020100520';
            }
            else {
                trans_cod = 'RS0W2020100540';
            }

            var lo_params = {
                REVE_CODE : trans_cod,
                prg_id: prg_id,
                bquet_nos: self.singleData.bquet_nos,
                old_sta: self.singleData.order_sta,
                new_sta: newStatus,
                upd_usr: this.userInfo.usr_id
            };

            $.post("/api/callAPI", lo_params, function (result) {
                self.isLoading = false;
                if (result.success) {
                    callback();
                }
                if(result.errorMsg != "") alert(result.errorMsg);
            });
        },

        /**
         * 異動訂席單
         */
        ModifyStatus: function (newStatus) {
            var self = this;
            self.isLoading = true;

            var lo_params = {
                REVE_CODE : 'RS0W2020101010',
                prg_id: prg_id,
                bquet_nos: self.singleData.bquet_nos,
                old_sta: self.singleData.order_sta,
                new_sta: newStatus,
                upd_usr: this.userInfo.usr_id
            };

            $.post("/api/callAPI", lo_params, function (result) {
                self.isLoading = false;
                if (result.success) {
                    callback();
                }
                if(result.errorMsg != "") alert(result.errorMsg);
            });
        }
    }
});

//page.1 平面圖
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