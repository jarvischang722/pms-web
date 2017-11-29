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
            userInfo: {},               //登入的使用者資料

            //系統參數
            mask_hfd: "",               //前檯金額格式
            round_hfd: "",              //前檯進位小數位數
            rent_cal_dat: "",           //滾房租日期
            required_bride_nam: "",     //新郎、新娘是否為必Key
            default_use_typ_common: "", //使用類別預設值
            default_bquet_order_sta: "",//訂席狀態預設值
            default_meal_typ: "",       //餐別預設值
            default_expire_dat: "",     //保留期限天數預設值
            default_adult_qnt: "",      //預定人數預設值
            default_poadult_qnt: "",    //保證人數預設值
            default_proc_sta: "",       //預約處理預設值

            singleData: {},
            singleField: {},
            singleDataEmpty: {},

            selectOption: {},

            selectPopUpGridData: [],
            popupFieldName: "",         //哪一個field觸發popup

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
            dataGridRows: [],

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
                    //新增模式
                    //self.fetchSingleData('0600006');
                    self.singleData = _.clone(self.singleDataEmpty);
                    self.defaultValue();

                }

                self.showReserve();
                self.fetchDataGridData();
            });
        });

        vmHub.$on('updateBackSelectData', function (chooseData) {

            if(self.popupFieldName == "alt_nam"){

                var lo_params = {
                    cust_cod: chooseData["cust_cod"]
                };
                $.post("/reserveBanquet/qry_bqcust_mn", lo_params, function (result) {
                    if (!_.isUndefined(result.data)) {
                        if(self.singleData.title_nam.toString().trim() == ""){
                            result.data["title_nam"] = result.data.alt_nam;
                        }
                        self.singleData = _.extend(self.singleData, result.data);
                    }
                    else {
                        alert(result.error.errorMsg);
                    }
                });
            }
            else if(self.popupFieldName == "place_cod_button"){

                //帶入預設值

                chooseData["begin_tim"] = "";
                chooseData["end_tim"] = "";
                chooseData["desk_qnt"] = "0";
                chooseData["order_qnt"] = "0";
                chooseData["is_allplace"] = "N";
                chooseData["inv_qnt"] = "0";
console.log(chooseData);

                self.dataGridRows.push(chooseData);
                self.dgIns.loadDgData(self.dataGridRows);
            }
            else {
                self.singleData = _.extend(self.singleData, chooseData);
            }

        });

    },
    mounted: function () {
        this.getSystemParam();
        this.fetchUserInfo();

    },
    methods: {

        /**
         * 取系統參數 and 預設值
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

            //使用類別預設值
            lo_params = {
                paramName: "default_use_typ_common"
            };
            $.post("/reserveBanquet/qrySystemParam", lo_params, function (result) {
                self.isLoading = false;
                if (!_.isUndefined(result.data)) {
                    self.default_use_typ_common = result.data.default_use_typ_common;
                } else {
                    alert(result.error.errorMsg);
                }
            });

            //訂席狀態預設值
            lo_params = {
                paramName: "default_bquet_order_sta"
            };
            $.post("/reserveBanquet/qrySystemParam", lo_params, function (result) {
                self.isLoading = false;
                if (!_.isUndefined(result.data)) {
                    self.default_bquet_order_sta = result.data.default_bquet_order_sta;
                } else {
                    alert(result.error.errorMsg);
                }
            });

            //餐別預設值
            lo_params = {
                paramName: "default_meal_typ"
            };
            $.post("/reserveBanquet/qrySystemParam", lo_params, function (result) {
                self.isLoading = false;
                if (!_.isUndefined(result.data)) {
                    self.default_meal_typ = result.data.default_meal_typ;
                } else {
                    alert(result.error.errorMsg);
                }
            });

            //保留期限天數
            lo_params = {
                paramName: "default_expire_dat"
            };
            $.post("/reserveBanquet/qrySystemParam", lo_params, function (result) {
                self.isLoading = false;
                if (!_.isUndefined(result.data)) {
                    self.default_expire_dat = result.data.default_expire_dat;
                } else {
                    alert(result.error.errorMsg);
                }
            });

            //預定人數
            lo_params = {
                paramName: "default_adult_qnt"
            };
            $.post("/reserveBanquet/qrySystemParam", lo_params, function (result) {
                self.isLoading = false;
                if (!_.isUndefined(result.data)) {
                    self.default_adult_qnt = result.data.default_adult_qnt;
                } else {
                    alert(result.error.errorMsg);
                }
            });

            //保證人數
            lo_params = {
                paramName: "default_poadult_qnt"
            };
            $.post("/reserveBanquet/qrySystemParam", lo_params, function (result) {
                self.isLoading = false;
                if (!_.isUndefined(result.data)) {
                    self.default_poadult_qnt = result.data.default_poadult_qnt;
                } else {
                    alert(result.error.errorMsg);
                }
            });

            //預約處理
            $.post("/reserveBanquet/def_proc_sta", lo_params, function (result) {
                self.isLoading = false;
                if (!_.isUndefined(result.data)) {
                    self.default_proc_sta= result.data.proc_sta;
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
         * 塞預設值
         */
        defaultValue: function () {
            this.singleData.use_typ = this.default_use_typ_common;
            this.useTypeOnChange();
            this.singleData.order_sta = this.default_bquet_order_sta;
            this.singleData.meal_typ = this.default_meal_typ;
            this.singleData.confirm_sta = "N";
            this.singleData.wait_seq = "0";
            this.singleData.begin_tim = "00:00";
            this.singleData.end_tim = "23:59";
            this.singleData.begin_dat = RS00202010VM.searchDate;

            //保留日計算
            this.singleData.expire_dat = moment(this.rent_cal_dat).add(this.default_expire_dat, 'day');

            if(moment(this.singleData.begin_dat) <= moment(this.rent_cal_dat)){
                this.singleData.expire_dat = this.rent_cal_dat;
            }
            else if(moment(this.singleData.begin_dat) > moment(this.rent_cal_dat) && moment(this.singleData.begin_dat) <= moment(this.singleData.expire_dat)){
                this.singleData.expire_dat = moment(this.singleData.begin_dat).add(-1, 'day');
        }

            this.singleData.desk_qnt = "0";
            this.singleData.pmdesk_qnt = "0";

            this.singleData.adult_qnt = this.default_adult_qnt;
            this.singleData.poadult_qnt = this.default_poadult_qnt;

            this.singleData.hpdpst_amt = "0";
            this.singleData.deposit_amt = "0";

            this.singleData.cal_serv = "Y";
            this.singleData.hotel_cod = this.userInfo.hotel_cod;

            this.singleData.proc_sta = this.default_proc_sta;

            this.singleData.place_amt = "0";

        },

        /**
         * 取DT欄位及資料
         */
        fetchDataGridData: function () {
            var self = this;

            $.post("/api/prgDataGridDataQuery", {prg_id: prg_id, searchCond: {bquet_nos: self.singleData.bquet_nos}}, function (result) {
                self.prgFieldDataAttr = result.fieldData;
                self.dataGridRows = result.dataGridRows;

                self.dgIns = new DatagridBaseClass();
                self.dgIns.init(prg_id, 'RS0W202010_dt', DatagridFieldAdapter.combineFieldOption(result.fieldData, 'RS0W202010_dt'));
                self.dgIns.loadDgData(self.dataGridRows);
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
            this.popupFieldName = fieldName;
            var lo_field;
            var self = this;

            _.each(this.singleField, function (value) {
                if(value.ui_field_name == fieldName){
                    lo_field = value;
                }
            });
            console.log(lo_field);
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
         * 使用類別onChange
         */
        useTypeOnChange: function () {
            if(_.isUndefined(this.singleData.use_typ)) return;
            var self = this;
            var lo_params = {
                use_typ: self.singleData.use_typ
            };
            $.post("/reserveBanquet/chk_use_typ", lo_params, function (result) {
                if (!_.isUndefined(result.data)) {
                    self.singleData.inter_cod = result.data.inter_cod;
                }
                else {
                    alert(result.error.errorMsg);
                }
            });
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
                            align: "left",
                            hidden: (field == "cust_cod" || field == "unit_amt") ? true : false
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

//page.1 平面圖
var RS00202010VM = new Vue({
    el: "#RS00202010Main",
    components: {
        singlePage
    },
    data: {
        searchDate: moment(new Date()).format("YYYY/MM/DD"),
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