/**
 * Created by a16009 on 2017/11/10.
 * 程式編號: RS0W212010
 * 程式名稱: 定席作業
 */

var vmHub = new Vue;
var prg_id = "RS0W212010";

var go_funcPurview = (new FuncPurview(prg_id)).getFuncPurvs();

//rowLocK
g_socket.on('checkTableLock', function (result) {
    if(!result.success){
        alert(result.errorMsg);
        vmHub.$emit("setReadonly");
    }
    else {
        vmHub.$emit("UnReadonly");
    }
});

var go_currentIndex = undefined;

//region //DTGridClass

function DTGridClass() {}

DTGridClass.prototype = new DatagridBaseClass();
DTGridClass.prototype.onClickRow = function () {};
DTGridClass.prototype.endEditing = function () {
    console.log(go_currentIndex);
    if (go_currentIndex == undefined) {
        return true;
    }
    if ($('#RS0W212010_dt').datagrid('validateRow', go_currentIndex)) {
        $('#RS0W212010_dt').datagrid('endEdit', go_currentIndex);
        go_currentIndex = undefined;
        return true;
    }
    return false;
};
DTGridClass.prototype.onClickCell = function (index, field) {
    if(!RS00202010VM.readonly){
        if (DTGridClass.prototype.endEditing()) {
            if (go_currentIndex != index) {
                $('#RS0W212010_dt').datagrid('selectRow', index).datagrid('beginEdit', index);
                var ed = $('#RS0W212010_dt').datagrid('getEditor', {index: index, field: field});
                if (ed) {
                    ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
                }
                go_currentIndex = index;
            }

        }
    }
};

//endregion

//page.2 單筆跳窗
var singlePage = Vue.extend({
    template: "#RS0W212010Tmp",
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

            tmpCud: {               //新刪修暫存
                createData: [],
                updateData: [],
                deleteData: [],
                oriData: [],
                dt_createData: [],
                dt_updateData: [],
                dt_deleteData: [],
                dt_oriData: []
            },

            oriSingleData: {},
            singleData: {},
            singleField: {},
            singleDataEmpty: {},

            selectOption: {},

            selectPopUpGridData: [],
            popupFieldName: "",         //哪一個field觸發popup

            createStatus: false,        //新增狀態

            isModificable: true,       //決定是否可以修改資料
            readonly: false,

            saveEnable: true,

            cancelEnable: true,
            reserveEnable: true,
            waitEnable: true,
            inquiryEnable: true,
            modifyEnable: true,

            isShowReserve: true,

            canSave: true,

            dgIns: {},
            dtFieldData: [],
            dataGridRows: [],
            oriDataGridRows: [],

            startTime: "",
            endTime: ""
        };
    },
    created: function () {
        var self = this;
        vmHub.$on("showReserve", function (PostData) {
            self.singleData = {};
            self.oriSingleData = {};
            self.dataGridRows = [];
            self.oriDataGridRows = [];
            self.initTmpCUD();

            self.loadField(function () {
                if(PostData.bquet_nos != "") {
                    self.doRowLock(PostData.bquet_nos);
                    self.createStatus = false;
                    self.isModificable = false;
                    self.fetchSingleData(PostData.bquet_nos);
                }
                else {
                    //新增模式
                    self.createStatus = true;
                    self.cancelEnable = false;
                    self.isModificable = true;

                    self.dataGridRows = [];

                    self.singleData = _.clone(self.singleDataEmpty);
                    self.defaultValue();
                }

                self.showReserve();
                self.fetchDataGridData(PostData.bquet_nos);
            });
        });

        vmHub.$on('updateBackSelectData', function (chooseData) {

            if (self.popupFieldName == "alt_nam") {

                var lo_params = {
                    cust_cod: chooseData["cust_cod"]
                };
                $.post("/reserveBanquet/qry_bqcust_mn", lo_params, function (result) {
                    if (!_.isUndefined(result.data)) {
                        if (self.singleData.title_nam.toString().trim() == "") {
                            result.data["title_nam"] = result.data.alt_nam;
                        }
                        self.singleData = _.extend(self.singleData, result.data);
                    }
                    else {
                        alert(result.error.errorMsg);
                    }
                });
            }
            else if (self.popupFieldName == "place_cod_button") {

                //帶入預設值
                chooseData["bquet_nos"] = "";
                chooseData["seq_nos"] = "";

                chooseData["begin_tim"] = "";
                chooseData["end_tim"] = "";
                chooseData["desk_qnt"] = "0";
                chooseData["order_qnt"] = "0";

                chooseData["place_amt"] = "0";
                chooseData["special_amt"] = "0";
                chooseData["disc_amt"] = "0";

                chooseData["is_allplace"] = 'N';
                chooseData["inv_qnt"] = "0";
                chooseData["createRow"] = "Y";

                var isSame = false;
                _.each(self.dataGridRows, function (value) {
                    if(value.place_cod == chooseData["place_cod"]){
                        isSame = true;
                    }
                });

                if(!isSame){
                    self.dataGridRows.push(chooseData);
                    self.dgIns.loadDgData(self.dataGridRows);

                    $('#RS0W212010_dt').datagrid('selectRow', self.dataGridRows.length - 1)
                        .datagrid('beginEdit', self.dataGridRows.length - 1);
                    go_currentIndex = self.dataGridRows.length - 1;

                    // $('#RS0W212010_dt').datagrid('appendRow', chooseData);
                    // self.dgIns.editIndex = $('#RS0W212010_dt').datagrid('getRows').length - 1;
                    // $('#RS0W212010_dt').datagrid('selectRow', self.dgIns.editIndex)
                    //     .datagrid('beginEdit', self.dgIns.editIndex);
                }
            }
            else {
                self.singleData = _.extend(self.singleData, chooseData);
            }

        });
    },
    mounted: function () {
        var self = this;
        this.getSystemParam();
        this.fetchUserInfo();
        this.initTmpCUD();
        this.initPurview();

        vmHub.$on("setReadonly", function(){
            self.readonly = true;
            RS00202010VM.readonly = true;
            self.isModificable = false;
            self.cancelEnable = false;
            self.reserveEnable = false;
            self.waitEnable = false;
            self.inquiryEnable = false;
            self.modifyEnable = false;
            self.saveEnable = false;
        });
        vmHub.$on("UnReadonly", function(){
            self.readonly = false;
            RS00202010VM.readonly = false;
            self.isModificable = true;
            self.cancelEnable = true;
            self.reserveEnable = true;
            self.waitEnable = true;
            self.inquiryEnable = true;
            self.modifyEnable = true;
            self.saveEnable = true;
        });
        vmHub.$on("doUnLock", function(){
            self.doRowUnLock();
        });
    },
     watch: {
         dataGridRows: {
             handler: function(after, before) {
                 var tot_amt = 0;

                 _.each(this.dataGridRows, function (value) {
                     tot_amt += Number(value.special_amt || 0);
                 });

                 //依參數『前檯金額格式』顯示
                 if(!_.isUndefined(this.mask_hfd)){
                     this.singleData.place_amt = go_formatDisplayClass.amtFormat(tot_amt, this.mask_hfd);
                 }

                 this.canSave = false;
             },
             deep: true
         },
        //region//按鈕如沒權限, 則不能Enable
         cancelEnable: function () {
             var purview = _.findIndex(go_funcPurview, function (value) {
                 return value.func_id == "1010";
             });
             if(purview == -1){
                 this.cancelEnable = false;
             }
         },
         reserveEnable: function () {
            var purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "1020";
            });
            if(purview == -1){
                this.reserveEnable = false;
            }
        },
         waitEnable: function () {
            var purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "1030";
            });
            if(purview == -1){
                this.waitEnable = false;
            }
        },
         inquiryEnable: function () {
            var purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "1040";
            });
            if(purview == -1){
                this.inquiryEnable = false;
            }
        },
         modifyEnable: function () {
             var purview;
             if(this.createStatus){
                 purview = _.findIndex(go_funcPurview, function (value) {
                     return value.func_id == "0200";
                 });
                 if(purview == -1){
                     this.modifyEnable = true;
                 }
             }
             else{
                 purview = _.findIndex(go_funcPurview, function (value) {
                     return value.func_id == "0400";
                 });
                 if(purview == -1){
                     this.modifyEnable = false;
                 }
             }
         },
         saveEnable: function () {
             var purview;
             if(this.createStatus){
                 purview = _.findIndex(go_funcPurview, function (value) {
                     return value.func_id == "0200";
                 });
                 if(purview == -1){
                     this.saveEnable = false;
                 }
             }
             else{
                 purview = _.findIndex(go_funcPurview, function (value) {
                     return value.func_id == "0400";
                 });
                 if(purview == -1){
                     this.saveEnable = false;
                 }
             }
         }
        //endregion
     },
    methods: {

        initPurview: function () {
            this.cancelEnable = false;
            this.reserveEnable = false;
            this.waitEnable = false;
            this.inquiryEnable = false;
            this.modifyEnable = false;
            this.saveEnable = false;
        },

        /**
         * 取系統參數 and 預設值
         */
        getSystemParam: function () {
            var self = this;

            //前檯金額格式
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

            //前檯進位小數位數
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

            //滾房租日期
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

            //新郎、新娘是否為必Key
            lo_params = {
                paramName: "required_bride_nam"
            };
            $.post("/reserveBanquet/qrySystemParam", lo_params, function (result) {
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
                if (!_.isUndefined(result.data)) {
                    self.default_poadult_qnt = result.data.default_poadult_qnt;
                } else {
                    alert(result.error.errorMsg);
                }
            });

            //預約處理
            $.post("/reserveBanquet/def_proc_sta", lo_params, function (result) {
                if (!_.isUndefined(result.data)) {
                    self.default_proc_sta = result.data.proc_sta;
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

        //init CUD
        initTmpCUD: function () {
            this.tmpCud = {
                createData: [],
                updateData: [],
                deleteData: [],
                oriData: [],
                dt_createData: [],
                dt_updateData: [],
                dt_deleteData: [],
                dt_oriData: []
            };
        },

        /**
         * 撈取MN和DT的欄位
         */
        loadField: function (callback) {
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

                //MN FieldData
                self.singleField = result.fieldData;

                //組SelectFieldOption
                _.each(result.fieldData, function (value) {

                    if(value.format_func_name != ""){
                        //console.log(value);
                    }

                    self.singleDataEmpty[value.ui_field_name] = "";

                    if (value.ui_type == "select") {
                        self.selectOption[value.ui_field_name] = value.selectData;
                    }

                });

                //hpdpst_amt、place_amt 依前檯進位小數位數
                _.each(self.singleField, function (value) {
                    if(value.ui_field_name == "hpdpst_amt" || value.ui_field_name == "place_amt"){
                        value.ui_field_num_point = self.round_hfd;
                    }
                });

                //DT FieldData
                self.dtFieldData = result.fieldData[_.findIndex(result.fieldData, {ui_type: 'grid'})].datagridFields || [];

                //special_amt 依前檯進位小數位數
                _.each(self.dtFieldData, function (value) {
                    if(value.ui_field_name == "special_amt"){
                        value.ui_field_num_point = self.round_hfd;
                    }
                });

                callback(result);
            });
        },

        /**
         * 撈取MN資料
         * @param bquet_nos {String} : 訂席單號
         */
        fetchSingleData: function (bquet_nos) {
            var self = this;
            var lo_params = {
                bquet_nos: bquet_nos
            };
            $.post("/reserveBanquet/qryPageTwoData", lo_params, function (result) {
                if (!_.isUndefined(result.data)) {

                    //Time format
                    if(result.data.begin_tim.trim() != ""){
                        result.data.begin_tim = result.data.begin_tim.substring(0, 2) + ":" + result.data.begin_tim.substring(2, 4);
                    }

                    if(result.data.end_tim.trim() != ""){
                        result.data.end_tim = result.data.end_tim.substring(0, 2) + ":" + result.data.end_tim.substring(2, 4);
                    }

                    if(result.data.ins_tim.trim() != ""){
                        result.data.ins_tim = result.data.ins_tim.substring(0, 2) + ":" + result.data.ins_tim.substring(2, 4);
                    }

                    if(result.data.upd_tim.trim() != ""){
                        result.data.upd_tim = result.data.upd_tim.substring(0, 2) + ":" + result.data.upd_tim.substring(2, 4);
                    }

                    result.data.ins_dat = moment(result.data.ins_dat).format("YYYY/MM/DD");
                    result.data.upd_dat = moment(result.data.upd_dat).format("YYYY/MM/DD");

                    result.data.begin_dat = moment(result.data.begin_dat).format("YYYY/MM/DD");
                    result.data.expire_dat = moment(result.data.expire_dat).format("YYYY/MM/DD");

                    //訂單狀態切換預約處理欄位
                    if(result.data.order_sta == "N"){
                        self.isShowReserve = true;
                    }
                    else {
                        self.isShowReserve = false;
                    }

                    self.cancelEnable = true;

                    //依參數『前檯金額格式』顯示
                    _.each(self.singleField, function (value) {
                        if(value.format_func_name == "QRY_MASK_HFD"){
                            result.data[value.ui_field_name] = go_formatDisplayClass.amtFormat(result.data[value.ui_field_name] || "0", self.mask_hfd);
                        }
                    });

                    self.singleData = result.data;
                    self.oriSingleData = _.clone(self.singleData);
                    self.tmpCud.oriData = [self.oriSingleData];
                }
                else {
                    alert(result.error.errorMsg);
                }
            });
        },

        /**
         * 取DT資料
         */
        fetchDataGridData: function (bquet_nos) {
            var self = this;
            $.post("/api/singlePageRowDataQuery", {
                prg_id: prg_id,
                page_id: 2,
                singleRowData: self.editingRow,
                bquet_nos: bquet_nos
            }, function (result) {

                //依參數『前檯金額格式』顯示, 因取欄位資料的方式不是用作業的方式，所以要自己塞format_func_name.rule_val
                _.each(self.dtFieldData, function (value) {
                    if(value.format_func_name == "QRY_MASK_HFD") {
                        var object = {validate: value.format_func_name, rule_name: value.format_func_name, rule_val: self.mask_hfd};
                        value.format_func_name = object;
                    }
                });

                self.dataGridRows = result.dtData || [];
                self.oriDataGridRows = _.clone(self.dataGridRows);

                self.dgIns = new DTGridClass();
                self.dgIns.init(prg_id, 'RS0W212010_dt', DatagridFieldAdapter.combineFieldOption(self.dtFieldData, 'RS0W212010_dt'), self.dtFieldData);
                self.dgIns.initTmpCUD();
                self.dgIns.loadDgData(self.dataGridRows);
                self.dgIns.tmpCUD.oriData = self.oriDataGridRows;
            });
        },

        /**
         * 塞預設值
         */
        defaultValue: function () {

            this.singleData.use_typ = this.default_use_typ_common;
            this.useTypeOnChange();
            this.singleData.order_sta = this.default_bquet_order_sta;

            if(this.singleData.order_sta == "N"){
                self.isShowReserve = true;
            }
            else {
                self.isShowReserve = false;
            }

            this.singleData.meal_typ = this.default_meal_typ;
            this.singleData.confirm_sta = "N";
            this.singleData.wait_seq = "0";
            this.singleData.begin_tim = "00:00";
            this.singleData.end_tim = "23:59";
            this.singleData.begin_dat = RS00202010VM.searchDate;

            //保留日計算
            this.singleData.expire_dat = (moment(this.rent_cal_dat).add(this.default_expire_dat, 'day')).format("YYYY/MM/DD");

            if (moment(this.singleData.begin_dat) <= moment(this.rent_cal_dat)) {
                this.singleData.expire_dat = this.rent_cal_dat;
            }
            else if (moment(this.singleData.begin_dat) > moment(this.rent_cal_dat) && moment(this.singleData.begin_dat) <= moment(this.singleData.expire_dat)) {
                this.singleData.expire_dat = (moment(this.singleData.begin_dat).add(-1, 'day')).format("YYYY/MM/DD");
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
         * 開窗
         */
        showReserve: function () {
            var self = this;
            var dialog = $("#gs-order-page").removeClass('hide').dialog({
                modal: true,
                title: "查詢訂席",
                title_html: true,
                width: 1000,
                height: 700,
                maxwidth: 1920,
                dialogClass: "test",
                resizable: true,
                onClose:function(){
                    if(!self.createStatus){
                        self.doRowUnLock();
                    }
                }
            });
        },

        //跳窗選擇多欄位
        chkClickPopUpGrid: function (fieldName) {
            if(this.dgIns.endEditing()){
                this.popupFieldName = fieldName;
                var lo_field;
                var self = this;

                _.each(this.singleField, function (value) {
                    if (value.ui_field_name == fieldName) {
                        lo_field = value;
                    }
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
        },

        /**
         * 使用類別onChange
         */
        useTypeOnChange: function () {
            if (_.isUndefined(this.singleData.use_typ)) {
                return;
            }
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
         * 將資料塞到tmp_cud
         */
        saveToTmpCud: function () {
            var self = this;

            //存檔時將宴會開始時間更新為場地明細的時間
            var earliest = "2359";
            var latest = "0000";

            _.each(self.dataGridRows, function (value) {
                if(Number(value.begin_tim) < Number(earliest)){
                    earliest = value.begin_tim;
                }
                if(Number(value.end_tim) > Number(latest)){
                    latest = value.end_tim;
                }
            });

            self.singleData.begin_tim = earliest.substring(0, 2) + ":" + earliest.substring(2, 4);
            self.singleData.end_tim = latest.substring(0, 2) + ":" + latest.substring(2, 4);

            var tempSingleData = _.clone(self.singleData);

            _.each(Object.keys(tempSingleData), function (objKey) {
                if (_.isUndefined(tempSingleData[objKey]) || tempSingleData[objKey] == null) {
                    tempSingleData[objKey] = "";
                }
            });

            if(_.isUndefined(tempSingleData.bquet_rmk)){
                tempSingleData.bquet_rmk = "";
            }

            //Time format
            tempSingleData.begin_tim = tempSingleData.begin_tim.replace(":", "");
            tempSingleData.end_tim = tempSingleData.end_tim.replace(":", "");

            tempSingleData.ins_tim = tempSingleData.ins_tim.replace(":", "");
            tempSingleData.upd_tim = tempSingleData.upd_tim.replace(":", "");

            tempSingleData.begin_dat = moment(tempSingleData.begin_dat).format("YYYY/MM/DD");
            tempSingleData.expire_dat = moment(tempSingleData.expire_dat).format("YYYY/MM/DD");

            //解除MN『前檯金額格式』
            _.each(self.singleField, function (value) {
                if(value.format_func_name == "QRY_MASK_HFD"){
                    tempSingleData[value.ui_field_name] = go_formatDisplayClass.removeAmtFormat(tempSingleData[value.ui_field_name]);
                }
            });

            if(self.createStatus){
                self.tmpCud.createData = [tempSingleData];
            }
            else {
                self.tmpCud.updateData = [tempSingleData];
            }

            self.tmpCud.dt_createData = [];

            //新增
            _.each(self.dataGridRows, function (value) {
                if(value.createRow == "Y"){
                    self.tmpCud.dt_createData.push(value);
                }
            });

            self.tmpCud.dt_updateData = self.dgIns.tmpCUD.updateData;
            
            //DT 加入use_dat，API要用
            _.each(self.tmpCud.dt_createData, function (value) {
                value["use_dat"] = self.singleData.begin_dat;
            });

            _.each(self.tmpCud.dt_updateData, function (value) {
               value["use_dat"] = self.singleData.begin_dat;
            });

            _.each(self.tmpCud.dt_deleteData, function (value) {
                value["use_dat"] = self.singleData.begin_dat;
            });

            self.tmpCud.dt_oriData = self.dgIns.tmpCUD.oriData;

            //解除DT『前檯金額格式』
            _.each(self.dtFieldData, function (value) {
                if(value.format_func_name == "QRY_MASK_HFD"){

                    _.each(self.tmpCud.dt_createData, function (dtvalue) {
                        dtvalue[value.ui_field_name] = go_formatDisplayClass.removeAmtFormat(dtvalue[value.ui_field_name]);
                    });

                    _.each(self.tmpCud.dt_updateData, function (dtvalue) {
                        dtvalue[value.ui_field_name] = go_formatDisplayClass.removeAmtFormat(dtvalue[value.ui_field_name]);
                    });

                    _.each(self.tmpCud.dt_deleteData, function (dtvalue) {
                        dtvalue[value.ui_field_name] = go_formatDisplayClass.removeAmtFormat(dtvalue[value.ui_field_name]);
                    });

                    _.each(self.tmpCud.dt_oriData, function (dtvalue) {
                        dtvalue[value.ui_field_name] = go_formatDisplayClass.removeAmtFormat(dtvalue[value.ui_field_name]);
                    });
                }

            });

            console.log(self.tmpCud);
        },

        /**
         * 存檔按鈕
         */
        save: function () {
            var self = this;

            if(!self.canSave){
                alert('必須先通過庫存檢查！');
                return;
            }

            if(self.dgIns.endEditing()) {

                if(self.singleData.contact1_cod != null && (self.singleData.contact1_rmk == null || self.singleData.contact1_rmk == "")){
                    alert('聯絡方式1未輸入!');
                    return;
                }

                if(self.singleData.contact2_cod != null && (self.singleData.contact2_rmk == null || self.singleData.contact2_rmk == "")){
                    alert('聯絡方式2未輸入!');
                    return;
                }

                if(self.singleData.inter_cod == "MARRY" && required_bride_nam == "Y"){
                    if(self.singleData.groom_nam == null || self.singleData.groom_nam == ""){
                        alert("新郎為必填!");
                    }
                    if(self.singleData.bride_nam == null || self.singleData.bride_nam == ""){
                        alert("新娘為必填!");
                    }
                    return;
                }

                var func_id = self.createStatus ? '0200' : '0400';

                self.saveToTmpCud();
                self.callSaveAPI(func_id);
            }
            else {
                alert('場地明細尚未編輯完成！');
            }
        },

        /**
         * 離開按鈕
         */
        exit: function () {
            $("#gs-order-page").dialog('close');
        },

        /**
         * 異動訂席單
         */
        ModifyStatus: function (newStatus) {
            var self = this;

            if(self.singleData.order_sta == newStatus){
                return;
            }

            if(self.createStatus) {
                if(newStatus == "N"){
                    self.isShowReserve = true;
                }
                else{
                    self.isShowReserve = false;
                }
                self.singleData.order_sta = newStatus;
            }
            else{

                //判斷是否有異動過資料

                var isMNEqual = isObjectValueEqual(self.oriSingleData, self.singleData);

                var isDTEqual = isObjectArrayEqual(self.oriDataGridRows, self.dataGridRows);

                if(!isMNEqual || !isDTEqual){

                    if(confirm("已異動過資料，需先存檔！\r\n請問是否要存檔?")){
                        self.save();
                    }
                    return;
                }

                RS00202010VM.isLoading = true;

                var lo_params = {
                    REVE_CODE : prg_id,
                    prg_id: prg_id,
                    func_id: "1010",
                    bquet_nos: self.singleData.bquet_nos,
                    old_sta: self.singleData.order_sta,
                    new_sta: newStatus,
                    upd_usr: this.userInfo.usr_id
                };

                $.post("/reserveBanquet/chgOrderStaAPI", lo_params, function (result) {
                    RS00202010VM.isLoading = false;

                    if (result.success) {
                        alert("異動成功！");
                        self.fetchSingleData(self.singleData.bquet_nos);
                    }
                    if (result.msg != "") {
                        alert(result.msg);
                    }
                });
            }

        },

        /**
         * 刪除場地
         */
        delPlace: function () {
            var self = this;

            if (_.isUndefined(go_currentIndex)) {
                alert("請選擇要刪除的資料");
                return;
            }

            var delRow = $("#RS0W212010_dt").datagrid('getSelected');
            delRow.Upd_dat = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
            delRow.Upd_usr = self.userInfo.usr_id;

            if(delRow.createRow != "Y"){
                self.tmpCud.dt_deleteData.push(delRow);
            }

            $("#RS0W212010_dt").datagrid('deleteRow', go_currentIndex);
        },

        /**
         * 庫存檢查
         */
        CheckInventory: function () {
            if(this.dataGridRows.length == 0){
                alert('請先新增明細！');
                return;
            }
            if(this.dgIns.endEditing()) {
                this.saveToTmpCud();
                this.callAPI('2030');
            }
            else {
                alert('場地明細尚未編輯完成！');
            }
        },

        updateInventory: function (data) {
            var self = this;
            self.canSave = true;

            _.each(self.dataGridRows, function (value) {
                if(value.is_allplace == "Y"){
                    var item = _.find(data.check_dt, function (field) {
                        return field.place_cod == value.place_cod.trim();
                    });
                    value.inv_qnt = item.inv_qnt;
                }
                else {
                    value.inv_qnt = value.desk_qnt;
                }
            });

            self.dgIns.loadDgData(self.dataGridRows);
        },

        callAPI: function (func_id) {
            var self = this;

            var lo_params = {
                trans_cod:  prg_id,
                prg_id: prg_id,
                page_id: 2,
                func_id: func_id,
                tmpCUD: self.tmpCud
            };

            RS00202010VM.isLoading = true;

            $.post("/api/doOperationSave", lo_params, function (result) {
                RS00202010VM.isLoading = false;
                if (result.success) {
                    alert("檢查通過！");
                    self.updateInventory(result.data);
                }
                if (result.msg != "") {
                    alert(result.msg);
                }
            });
        },

        callSaveAPI: function(func_id){
            var self = this;

            var lo_params = {
                trans_cod:  prg_id,
                prg_id: prg_id,
                page_id: 2,
                func_id: func_id,
                tmpCUD: self.tmpCud
            };
            RS00202010VM.isLoading = true;
            $.post("/api/doOperationSave", lo_params, function (result) {
                RS00202010VM.isLoading = false;
                if (result.success) {
                    self.singleData.bquet_nos = result.data.bquet_nos;
                    alert("儲存成功！");
                    RS00202010VM.qryPageOneData();
                    $("#gs-order-page").dialog("close");
                    vmHub.$emit("showReserve", {bquet_nos: self.singleData.bquet_nos});
                }
                if (result.msg != "") {
                    alert(result.msg);
                }
            });
        },

        /**
         * RowLock
         */
        doRowLock: function (bquet_nos) {
            var lo_param = {
                prg_id: prg_id,
                table_name: "NULLbquet_mn",
                lock_type : "R",
                key_cod: bquet_nos.trim()
            };
            g_socket.emit('handleTableLock', lo_param);
        },

        /**
         * RowUnLock
         */
        doRowUnLock: function () {
            var lo_param = {
                prg_id: prg_id
            };
            g_socket.emit('handleTableUnlock', lo_param);
        },

        formatAmt: function (field) {
            this.singleData[field] = go_formatDisplayClass.amtFormat(this.singleData[field] || "0", this.mask_hfd);
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
                            hidden: field == "cust_cod" || field == "unit_amt" ? true : false
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
                width: width
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
            } else {
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
                if (row[selectFieldName].includes(selectCondition)) {
                    return row;
                }
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
        nowDate: moment(new Date()).format("YYYY/MM/DD"),
        searchDate: moment(new Date()).format("YYYY/MM/DD"),
        pageOneData: {},

        isLoading: false
    },
    watch:{
        searchDate: function () {
            this.searchDate = moment(this.searchDate).format("YYYY/MM/DD");
        }
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
            self.nowDate = self.searchDate;
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
        },

        readonly: false
    }
});

function isObjectArrayEqual(a, b) {

    var isEqual = true;

    if(a.length != b.length){
        return false;
    }

    for(i = 0; i < a.length; i++){
        if(!isObjectValueEqual(a[i], b[i])){
            isEqual = false;
        }
    }
    return isEqual;
}

function isObjectValueEqual(a, b) {
    // Of course, we can do it use for in
    // Create arrays of property names
    var aProps = Object.getOwnPropertyNames(a);
    var bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (var i = 0; i < aProps.length - 1; i++) {
        var propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            if(a[propName] == null || a[propName] == "" || a[propName].toString().trim() == ""){
                if(b[propName] == null || _.isUndefined(b[propName]) || b[propName] == "" || b[propName].toString().trim()){
                    continue;
                }
            }
            return false;
        }
    }

    // If we made it this far, objects
    // are considered equivalent
    return true;
}

$('.easyUi-custom1').tabs({});

$(window).on('beforeunload', function () {
    return vmHub.$emit("doUnLock");
});