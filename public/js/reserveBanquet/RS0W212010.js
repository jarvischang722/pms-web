/**
 * Created by a16009 on 2017/11/10.
 * 程式編號: RS0W212010
 * 程式名稱: 定席作業
 */

let vmHub = new Vue;
let prg_id = "RS0W212010";

let go_funcPurview = (new FuncPurview(prg_id)).getFuncPurvs();

//rowLocK
g_socket.on('checkTableLock', function (result) {
    if (!result.success) {
        alert(result.errorMsg);
        vmHub.$emit("setReadonly");
    }
});

let go_currentIndex = undefined;

//region //DTGridClass

function DTGridClass() {
}

DTGridClass.prototype = new DatagridBaseClass();
DTGridClass.prototype.onClickRow = function () {
};
DTGridClass.prototype.endEditing = function () {
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
    if (!RS00202010VM.readonly) {
        if (DTGridClass.prototype.endEditing()) {
            if (go_currentIndex != index) {
                $('#RS0W212010_dt').datagrid('selectRow', index).datagrid('beginEdit', index);
                let ed = $('#RS0W212010_dt').datagrid('getEditor', {index: index, field: field});
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
let singlePage = Vue.extend({
    template: "#RS0W212010Tmp",
    created: function () {
        let self = this;
        vmHub.$on("showReserve", function (PostData) {
            RS00202010VM.isLoading = true;

            self.singleData = {};
            self.oriSingleData = {};
            self.dataGridRows = [];
            self.oriDataGridRows = [];
            self.initTmpCUD();
            vmHub.$emit("UnReadonly");

            if (PostData.bquet_nos != "") {
                self.isFirstChangeAltNam = true;
                self.isFirstChangeAttenNam = true;
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
                self.defaultValue(PostData);
            }
            self.initPurview();
            self.showReserve();
            self.fetchDataGridData(PostData);

        });

        vmHub.$on('updateBackSelectData', function (chooseData) {

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

            let isSame = false;
            _.each(self.dataGridRows, function (value) {
                if (value.place_cod == chooseData["place_cod"]) {
                    isSame = true;
                }
            });

            if (!isSame) {
                self.dataGridRows.push(chooseData);
                self.dgIns.loadDgData(self.dataGridRows);

                $('#RS0W212010_dt').datagrid('selectRow', self.dataGridRows.length - 1)
                    .datagrid('beginEdit', self.dataGridRows.length - 1);
                go_currentIndex = self.dataGridRows.length - 1;
            }

        });
    },
    mounted: function () {
        let self = this;
        this.getSystemParam();
        this.loadField();
        this.fetchUserInfo();
        this.initTmpCUD();

        vmHub.$on("setReadonly", function () {
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
        vmHub.$on("UnReadonly", function () {
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
        vmHub.$on("doUnLock", function () {
            self.doRowUnLock();
        });
    },
    watch: {
        dataGridRows: {
            handler: function (after, before) {
                let tot_amt = 0;

                _.each(this.dataGridRows, function (value) {
                    tot_amt += Number(value.special_amt || 0);
                });

                //依參數『前檯金額格式』顯示
                if (!_.isUndefined(this.mask_hfd)) {
                    this.singleData.place_amt = go_formatDisplayClass.amtFormat(tot_amt, this.mask_hfd);
                }

                try {
                    this.singleData.desk_qnt = this.dataGridRows[0].desk_qnt;
                    this.singleData.pmdesk_qnt = this.dataGridRows[0].desk_qnt;
                }
                catch (ex) {
                }

            },
            deep: true
        },
        //region//按鈕如沒權限, 則不能Enable
        cancelEnable: function () {
            let purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "1010";
            });
            if (purview == -1) {
                this.cancelEnable = false;
            }
        },
        reserveEnable: function () {
            let purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "1020";
            });
            if (purview == -1) {
                this.reserveEnable = false;
            }
        },
        waitEnable: function () {
            let purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "1030";
            });
            if (purview == -1) {
                this.waitEnable = false;
            }
        },
        inquiryEnable: function () {
            let purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "1040";
            });
            if (purview == -1) {
                this.inquiryEnable = false;
            }
        },
        modifyEnable: function () {
            let purview;
            if (this.createStatus) {
                purview = _.findIndex(go_funcPurview, function (value) {
                    return value.func_id == "0200";
                });
                if (purview == -1) {
                    this.modifyEnable = false;
                }
            }
            else {
                purview = _.findIndex(go_funcPurview, function (value) {
                    return value.func_id == "0400";
                });
                if (purview == -1) {
                    this.modifyEnable = false;
                }
            }
        },
        saveEnable: function () {
            let purview;
            if (this.createStatus) {
                purview = _.findIndex(go_funcPurview, function (value) {
                    return value.func_id == "0200";
                });
                if (purview == -1) {
                    this.saveEnable = false;
                }
            }
            else {
                purview = _.findIndex(go_funcPurview, function (value) {
                    return value.func_id == "0400";
                });
                if (purview == -1) {
                    this.saveEnable = false;
                }
            }
        }
        //endregion
    },
    data: function () {
        return {
            userInfo: {}, //登入的使用者資料

            //系統參數
            mask_hfd: "", //前檯金額格式
            round_hfd: "", //前檯進位小數位數
            rent_cal_dat: "", //滾房租日期
            required_bride_nam: "", //新郎、新娘是否為必Key
            default_use_typ_common: "", //使用類別預設值
            default_bquet_order_sta: "",//訂席狀態預設值
            default_meal_typ: "", //餐別預設值
            default_expire_dat: "", //保留期限天數預設值
            default_adult_qnt: "", //預定人數預設值
            default_proc_sta: "", //預約處理預設值

            tmpCud: { //新刪修暫存
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
            selectgridOptions: {alt_nam: {columns: []}},

            selectPopUpGridData: [],

            createStatus: false, //新增狀態

            isModificable: true, //決定是否可以修改資料
            readonly: false,

            cancelEnable: true,
            reserveEnable: true,
            waitEnable: true,
            inquiryEnable: true,
            modifyEnable: true,
            saveEnable: true,

            isShowReserve: true,

            isFirstChangeAltNam: false,
            isFirstChangeAttenNam: false,

            dgIns: {},
            dtFieldData: [],
            dataGridRows: [],
            oriDataGridRows: [],

            startTime: "",
            endTime: ""
        };
    },
    methods: {

        /**
         * 功能權限初始化
         */
        initPurview: function () {
            let purview;
            purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "1010";
            });
            if (purview == -1) {
                this.cancelEnable = false;
            }

            purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "1020";
            });
            if (purview == -1) {
                this.reserveEnable = false;
            }

            purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "1030";
            });
            if (purview == -1) {
                this.waitEnable = false;
            }

            purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "1040";
            });
            if (purview == -1) {
                this.inquiryEnable = false;
            }

            if (this.createStatus) {

                purview = _.findIndex(go_funcPurview, function (value) {
                    return value.func_id == "0200";
                });

                if (purview == -1) {
                    this.saveEnable = false;
                    this.modifyEnable = false;
                }
            }
            else {
                purview = _.findIndex(go_funcPurview, function (value) {
                    return value.func_id == "0400";
                });
                if (purview == -1) {
                    this.saveEnable = false;
                    this.modifyEnable = false;
                }
            }
        },

        /**
         * 取系統參數 and 預設值
         */
        getSystemParam: function () {
            let self = this;

            //前檯金額格式
            let lo_params = {
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
                paramName: "pg_ais_rent_cal_dat"
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

            //預約處理
            $.post("/reserveBanquet/def_proc_sta", {}, function (result) {
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
            let self = this;
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    self.userInfo = result.userInfo;
                }
            });
        },

        /**
         * init CUD
         */
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
        loadField: function () {
            let self = this;
            $.post("/api/singleGridPageFieldQuery", {
                prg_id: prg_id,
                page_id: 2,
                singleRowData: self.editingRow
            }, function (result) {
                //MN FieldData
                self.singleField = result.fieldData;

                //組SelectFieldOption
                _.each(result.fieldData, function (value) {
                    self.singleDataEmpty[value.ui_field_name] = "";
                    if (value.ui_type == "select") {
                        self.selectOption[value.ui_field_name] = value.selectData;
                    }
                    if (value.ui_type == "selectgrid") {
                        self.selectgridOptions[value.ui_field_name] = value.selectGridOptions;
                        self.selectgridOptions[value.ui_field_name].selectData = value.selectData;
                    }
                });

                //hpdpst_amt、place_amt 依前檯進位小數位數
                _.each(self.singleField, function (value) {
                    if (value.ui_field_name == "hpdpst_amt" || value.ui_field_name == "place_amt") {
                        value.ui_field_num_point = self.round_hfd;
                    }
                });

                //DT FieldData
                self.dtFieldData = result.fieldData[_.findIndex(result.fieldData, {ui_type: 'grid'})].datagridFields || [];

                //special_amt 依前檯進位小數位數
                _.each(self.dtFieldData, function (value) {
                    if (value.ui_field_name == "special_amt") {
                        value.ui_field_num_point = self.round_hfd;
                    }
                });

            });
        },

        /**
         * 撈取MN資料
         * @param bquet_nos {String} : 訂席單號
         */
        fetchSingleData: function (bquet_nos) {
            let self = this;

            $.post("/reserveBanquet/qryPageTwoData", {bquet_nos}, function (result) {
                if (!_.isUndefined(result.data)) {

                    //Time format
                    if (result.data.begin_tim.trim() != "") {
                        result.data.begin_tim = result.data.begin_tim.substring(0, 2) + ":" + result.data.begin_tim.substring(2, 4);
                    }

                    if (result.data.end_tim.trim() != "") {
                        result.data.end_tim = result.data.end_tim.substring(0, 2) + ":" + result.data.end_tim.substring(2, 4);
                    }

                    if (result.data.ins_tim.trim() != "") {
                        result.data.ins_tim = result.data.ins_tim.substring(0, 2) + ":" + result.data.ins_tim.substring(2, 4);
                    }

                    if (result.data.upd_tim.trim() != "") {
                        result.data.upd_tim = result.data.upd_tim.substring(0, 2) + ":" + result.data.upd_tim.substring(2, 4);
                    }

                    result.data.ins_dat = moment(result.data.ins_dat).format("YYYY/MM/DD");
                    result.data.upd_dat = moment(result.data.upd_dat).format("YYYY/MM/DD");

                    result.data.begin_dat = moment(result.data.begin_dat).format("YYYY/MM/DD");
                    result.data.expire_dat = moment(result.data.expire_dat).format("YYYY/MM/DD");

                    //訂單狀態切換預約處理欄位
                    if (result.data.order_sta == "N") {
                        self.isShowReserve = true;
                    }
                    else {
                        self.isShowReserve = false;
                    }

                    self.cancelEnable = true;

                    //依參數『前檯金額格式』顯示
                    _.each(self.singleField, function (value) {
                        if (value.format_func_name == "QRY_MASK_HFD") {
                            result.data[value.ui_field_name] = go_formatDisplayClass.amtFormat(result.data[value.ui_field_name] || "0", self.mask_hfd);
                        }
                    });

                    self.singleData = result.data;

                    //已付訂金預設值
                    $.post("/reserveBanquet/def_banlance_amt", {bquet_nos: self.singleData.bquet_nos}, function (result) {
                        if (!_.isUndefined(result.data)) {
                            self.singleData.deposit_amt = result.data.banlance_amt || 0;

                            self.singleData.deposit_amt = go_formatDisplayClass.amtFormat(self.singleData.deposit_amt || "0", self.mask_hfd);
                        } else {
                            alert(result.error.errorMsg);
                        }
                    });

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
        fetchDataGridData: function (postData) {
            let self = this;
            $.post("/api/singlePageRowDataQuery", {
                prg_id: prg_id,
                page_id: 2,
                singleRowData: self.editingRow,
                bquet_nos: postData.bquet_nos
            }, function (result) {

                //依參數『前檯金額格式』顯示, 因取欄位資料的方式不是用作業的方式，所以要自己塞format_func_name.rule_val
                _.each(self.dtFieldData, function (value) {
                    if (value.format_func_name == "QRY_MASK_HFD") {
                        let object = {
                            validate: value.format_func_name,
                            rule_name: value.format_func_name,
                            rule_val: self.mask_hfd
                        };
                        value.format_func_name = object;
                    }
                });

                self.dataGridRows = result.dtData || [];
                self.oriDataGridRows = _.clone(self.dataGridRows);

                self.dgIns = new DTGridClass();
                self.dgIns.init(prg_id, 'RS0W212010_dt', DatagridFieldAdapter.combineFieldOption(self.dtFieldData, 'RS0W212010_dt'), self.dtFieldData);
                self.dgIns.initTmpCUD();
                self.dgIns.tmpCUD.oriData = self.oriDataGridRows;

                //新增模式時，如有預設值，直接將預設值帶入明細
                if (self.createStatus && postData.begin_tim != "") {
                    let defaultData = {};
                    $.post("/reserveBanquet/getPlaceUnitAmt", {place_cod: postData.place_cod}, function (result) {
                        if (!_.isUndefined(result.data)) {

                            defaultData["bquet_nos"] = "";
                            defaultData["seq_nos"] = "";
                            defaultData["rspt_cod"] = postData.rspt_cod;
                            defaultData["place_cod"] = postData.place_cod;
                            defaultData["begin_tim"] = postData.begin_tim;
                            defaultData["end_tim"] = postData.end_tim;
                            defaultData["desk_qnt"] = postData.desk_qnt;
                            defaultData["is_allplace"] = 'Y';
                            defaultData["inv_qnt"] = postData.desk_qnt;
                            defaultData["createRow"] = "Y";
                            defaultData["unit_amt"] = result.data.unit_amt;

                            //計算價格
                            defaultData["begin_tim"] = defaultData["begin_tim"].toString().replace(":", "");
                            defaultData["end_tim"] = defaultData["end_tim"].toString().replace(":", "");

                            let begin_hour = Number(defaultData["begin_tim"].toString().substr(0, 2));
                            let begin_min = Number(defaultData["begin_tim"].toString().substr(2, 2));
                            let end_hour = Number(defaultData["end_tim"].toString().substr(0, 2));
                            let end_min = Number(defaultData["end_tim"].toString().substr(2, 2));

                            if (end_hour < begin_hour) {
                                end_hour += 24;
                            }

                            let div_hour = end_hour - begin_hour;
                            let div_min = end_min - begin_min;

                            let total_min = div_hour * 60 + div_min;

                            defaultData["order_qnt"] = go_MathTool.formatFloat(total_min / 60, 1);
                            defaultData["place_amt"] = go_MathTool.formatFloat(defaultData["unit_amt"] * defaultData["order_qnt"], self.round_hfd);
                            defaultData["special_amt"] = defaultData["place_amt"];

                            let disc_amt = go_MathTool.formatFloat(defaultData["place_amt"] - defaultData["special_amt"], self.round_hfd);

                            if (disc_amt < 0) {
                                disc_amt = 0;
                            }

                            defaultData["disc_amt"] = disc_amt;

                            self.dataGridRows.push(defaultData);
                            self.dgIns.loadDgData(self.dataGridRows);

                        } else {
                            alert(result.error.errorMsg);
                        }
                    });
                }
                else {
                    self.dgIns.loadDgData(self.dataGridRows);
                    self.dgIns.tmpCUD.oriData = self.oriDataGridRows;
                }
                RS00202010VM.isLoading = false;
            });
        },

        /**
         * 塞預設值
         */
        defaultValue: function (postData) {

            this.singleData.use_typ = this.default_use_typ_common;
            this.useTypeOnChange();
            this.singleData.order_sta = this.default_bquet_order_sta;

            if (this.singleData.order_sta == "N") {
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
            this.singleData.begin_dat = moment(RS00202010VM.searchDate).format("YYYY/MM/DD");

            //保留日計算
            this.singleData.expire_dat = moment(this.rent_cal_dat).add(this.default_expire_dat, 'day').format("YYYY/MM/DD");

            if (moment(this.singleData.begin_dat) <= moment(this.rent_cal_dat)) {
                this.singleData.expire_dat = this.rent_cal_dat;
            }
            else if (moment(this.singleData.begin_dat) > moment(this.rent_cal_dat) && moment(this.singleData.begin_dat) <= moment(this.singleData.expire_dat)) {
                this.singleData.expire_dat = moment(this.singleData.begin_dat).add(-1, 'day').format("YYYY/MM/DD");
            }

            this.singleData.desk_qnt = "0";
            this.singleData.pmdesk_qnt = "0";

            this.singleData.adult_qnt = this.default_adult_qnt;
            this.singleData.poadult_qnt = this.default_adult_qnt;

            this.singleData.hpdpst_amt = "0";
            this.singleData.deposit_amt = "0";

            this.singleData.cal_serv = "Y";
            this.singleData.hotel_cod = this.userInfo.hotel_cod;

            this.singleData.proc_sta = this.default_proc_sta;

            this.singleData.place_amt = "0";

            //帶地圖的預設值過來
            if (postData.begin_tim != null) {
                this.singleData.rspt_cod = postData.rspt_cod;
                this.singleData.begin_tim = postData.begin_tim;
                this.singleData.end_tim = postData.end_tim;
                this.singleData.desk_qnt = postData.desk_qnt;
                this.singleData.pmdesk_qnt = postData.desk_qnt;
            }

        },

        /**
         * 開窗
         */
        showReserve: function () {
            let self = this;
            self.isLoading = true;
            let dialog = $("#gs-order-page").removeClass('hide').dialog({
                modal: true,
                title: "查詢訂席",
                title_html: true,
                width: 1000,
                height: 700,
                maxwidth: 1920,
                dialogClass: "test",
                resizable: true,
                onClose: function () {
                    if (!self.createStatus) {
                        self.doRowUnLock();
                    }
                    location.reload();
                }
            });
        },

        /**
         * 跳窗選擇多欄位
         */
        chkClickPopUpGrid: function () {
            if (this.dgIns.endEditing()) {
                let lo_field;
                let self = this;

                _.each(this.singleField, function (value) {
                    if (value.ui_field_name == fieldName) {
                        lo_field = value;
                    }
                });

                this.changeEditingForFieldRule(lo_field.rule_func_name);
                if (lo_field.ui_type == "popupgrid") {
                    let params = {
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

        /**
         * 改成編輯中
         */
        changeEditingForFieldRule: function (rule_func_name) {
            if (!_.isUndefined(rule_func_name) && !_.isEmpty(rule_func_name)) {
                this.isEditingForFieldRule = true;
            }
        },

        /**
         * 顯示textgrid跳窗訊息
         */
        showPopUpGridDialog: function () {
            this.dialogVisible = true;
            let height = document.documentElement.clientHeight - 60; //browser 高度 - 60功能列
            let width = document.documentElement.clientWidth / 2; //browser 寬度 - 200功能列

            let dialog = $("#dataPopUpGridDialog").dialog({
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
            let self = this;
            let lo_params = {
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
         * 客戶姓名 Change Event
         */
        altNamOnChange: function () {
            let self = this;

            if(self.isFirstChangeAltNam){
                self.isFirstChangeAltNam = false;
                return;
            }

            let lo_selectItem = _.find(self.selectgridOptions.alt_nam.selectData, {alt_nam: self.singleData.alt_nam});
            $.post("/reserveBanquet/qry_bqcust_mn", {cust_cod: lo_selectItem.cust_cod}, function (result) {

                //帶回前先將舊值清掉
                self.singleData.cust_cod = "";
                self.singleData.first_nam = "";
                self.singleData.last_nam = "";
                self.singleData.uni_cod = "";
                self.singleData.uni_title = "";
                self.singleData.atten_nam = "";
                self.singleData.sales_cod = "";
                self.singleData.contact1_cod = "";
                self.singleData.contact2_cod = "";
                self.singleData.contact1_rmk = "";
                self.singleData.contact2_rmk = "";

                self.singleData = _.extend(self.singleData, result.data);
                self.singleData = _.extend(self.singleData, lo_selectItem);

                if (self.singleData.title_nam.toString().trim() == "") {
                    self.singleData.title_nam = self.singleData.alt_nam;
                }

                if (self.singleData.atten_nam.toString().trim() == "") {
                    self.singleData.atten_nam = self.singleData.alt_nam;
                }
            });
        },

        /**
         * 聯絡人 Change Event
         */
        attenNamOnChange: function () {
            let self = this;

            if(self.isFirstChangeAttenNam){
                self.isFirstChangeAttenNam = false;
                return;
            }

            let lo_selectItem = _.find(self.selectgridOptions.atten_nam.selectData, {atten_nam: self.singleData.atten_nam});
            self.singleData = _.extend(self.singleData, lo_selectItem);
        },

        /**
         * 將資料塞到tmp_cud
         */
        saveToTmpCud: function () {
            let self = this;

            //存檔時將宴會開始時間更新為場地明細的時間
            let earliest = "2359";
            let latest = "0000";

            _.each(self.dataGridRows, function (value) {
                let ls_begin_tim = value.begin_tim;
                let ls_end_tim = value.end_tim;

                if (Number(ls_end_tim) < Number(ls_begin_tim)) {
                    ls_end_tim = (Number(ls_end_tim) + 2400).toString();
                }

                if (Number(ls_begin_tim) < Number(earliest)) {
                    earliest = ls_begin_tim;
                }
                if (Number(ls_end_tim) > Number(latest)) {
                    latest = ls_end_tim;
                }
            });

            if (Number(latest) > 2359) {
                latest = (Number(latest) - 2400).toString();
                latest = padLeft(latest, 4);
            }

            self.singleData.begin_tim = earliest.substring(0, 2) + ":" + earliest.substring(2, 4);
            self.singleData.end_tim = latest.substring(0, 2) + ":" + latest.substring(2, 4);

            self.singleData.ins_tim = moment(new Date()).format('HH:mm');
            self.singleData.upd_tim = moment(new Date()).format('HH:mm');


            //rmk格式轉換
            if (!_.isUndefined(self.singleData.bquet_rmk) && self.singleData.bquet_rmk != null && self.singleData.bquet_rmk != "") {
                self.singleData.bquet_rmk = self.singleData.bquet_rmk.replace(/\n/g, "\r\n");
            }

            let tempSingleData = _.clone(self.singleData);

            _.each(Object.keys(tempSingleData), function (objKey) {
                if (_.isUndefined(tempSingleData[objKey]) || tempSingleData[objKey] == null) {
                    tempSingleData[objKey] = "";
                }
            });

            if (_.isUndefined(tempSingleData.bquet_rmk)) {
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
                if (value.format_func_name == "QRY_MASK_HFD") {
                    tempSingleData[value.ui_field_name] = go_formatDisplayClass.removeAmtFormat(tempSingleData[value.ui_field_name]);
                }
            });

            if (self.createStatus) {
                self.tmpCud.createData = [tempSingleData];
            }
            else {
                self.tmpCud.updateData = [tempSingleData];
            }

            self.tmpCud.dt_createData = [];

            //新增
            _.each(self.dataGridRows, function (value) {
                if (value.createRow == "Y") {
                    self.tmpCud.dt_createData.push(value);
                }
            });

            self.tmpCud.dt_updateData = _.clone(self.dgIns.tmpCUD.updateData);

            //將update中有delete的清除
            _.each(self.tmpCud.dt_deleteData, function (value) {
                let keyVals = _.pluck(_.where(self.dtFieldData, {keyable: 'Y'}), "ui_field_name");
                let condKey = {};
                _.each(keyVals, function (field_name) {
                    condKey[field_name] = value[field_name] || "";
                });

                //判斷資料有無在updateData裡, 如果有先刪掉再新增新的
                let existIdx = _.findIndex(self.tmpCud.dt_updateData, condKey);

                if (existIdx > -1) {
                    self.tmpCud.dt_updateData.splice(existIdx, 1);
                }
            });


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
                if (value.format_func_name == "QRY_MASK_HFD") {

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

        },

        /**
         * 存檔按鈕
         */
        save: function () {
            let self = this;

            let isPass = self.beforeSave();

            if (isPass) {
                let func_id = self.createStatus ? '0200' : '0400';
                self.saveToTmpCud();
                self.callBeforeSaveAPI('2030', function (result) {
                    if (result) {
                        self.callSaveAPI(func_id);
                    }
                });
            }
        },

        /**
         * 儲存前驗證
         */
        beforeSave: function () {
            let self = this;

            if (self.dataGridRows.length == 0) {
                alert('場地明細無資料！');
                return false;
            }

            if (!self.dgIns.endEditing()) {
                alert('場地明細尚未編輯完成！');
                return false;
            }

            if (self.singleData.wait_seq === null || self.singleData.wait_seq === "") {
                alert("等待為必填！");
                return false;
            }

            if (self.singleData.contact1_rmk != null && self.singleData.contact1_rmk != "" && (self.singleData.contact1_cod == null || self.singleData.contact1_cod === "")) {
                alert('聯絡方式1的種類未選擇!');
                return false;
            }

            if (self.singleData.contact2_rmk != null && self.singleData.contact2_rmk != "" && (self.singleData.contact2_cod == null || self.singleData.contact2_cod === "")) {
                alert('聯絡方式2的種類未選擇!');
                return false;
            }

            if (self.singleData.inter_cod == "MARRY" && required_bride_nam == "Y") {
                if (self.singleData.groom_nam === null || self.singleData.groom_nam === "") {
                    alert("新郎為必填!");
                }
                if (self.singleData.bride_nam === null || self.singleData.bride_nam === "") {
                    alert("新娘為必填!");
                }
                return false;
            }

            if (self.singleData.alt_nam === null || self.singleData.alt_nam === "") {
                alert("客戶姓名為必填！");
                return false;
            }

            if (self.singleData.title_nam === null || self.singleData.title_nam === "") {
                alert("宴會名稱為必填！");
                return false;
            }

            if (self.singleData.atten_nam === null || self.singleData.atten_nam === "") {
                alert("聯絡人為必填！");
                return false;
            }

            if (self.singleData.desk_qnt === null || self.singleData.desk_qnt === "") {
                alert("預訂桌數為必填！");
                return false;
            }

            if (self.singleData.pmdesk_qnt === null || self.singleData.pmdesk_qnt === "") {
                alert("保證桌數為必填！");
                return false;
            }

            if (self.singleData.adult_qnt === null || self.singleData.adult_qnt === "") {
                alert("預訂人數為必填！");
                return false;
            }

            if (self.singleData.poadult_qnt === null || self.singleData.poadult_qnt === "") {
                alert("保證人數為必填！");
                return false;
            }

            if (self.singleData.hpdpst_amt === null || self.singleData.hpdpst_amt === "") {
                alert("應付訂金為必填！");
                return false;
            }

            if (self.singleData.deposit_amt === null || self.singleData.deposit_amt === "") {
                alert("已付訂金為必填！");
                return false;
            }

            if (self.singleData.rspt_cod === null || self.singleData.rspt_cod === "") {
                alert("廳別為必填！");
                return false;
            }

            if (self.singleData.place_amt === null || self.singleData.place_amt === "") {
                alert("場地金額為必填！");
                return false;
            }

            return true;
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
            let self = this;

            if (self.singleData.order_sta == newStatus) {
                return;
            }

            if (self.createStatus) {
                if (newStatus == "N") {
                    self.isShowReserve = true;
                }
                else {
                    self.isShowReserve = false;
                }
                self.singleData.order_sta = newStatus;
            }
            else {

                //判斷是否有異動過資料

                let isMNEqual = isObjectValueEqual(self.oriSingleData, self.singleData);

                let isDTEqual = isObjectArrayEqual(self.oriDataGridRows, self.dataGridRows);

                if (!isMNEqual || !isDTEqual) {

                    if (confirm("已異動過資料，需先存檔！\r\n請問是否要存檔?")) {
                        self.save();
                    }
                    return;
                }

                RS00202010VM.isLoading = true;

                let lo_params = {
                    REVE_CODE: prg_id,
                    prg_id: prg_id,
                    func_id: "1010",
                    bquet_nos: self.singleData.bquet_nos,
                    old_sta: self.singleData.order_sta,
                    new_sta: newStatus,
                    upd_usr: self.userInfo.usr_id
                };

                $.post("/reserveBanquet/chgOrderStaAPI", lo_params, function (result) {
                    RS00202010VM.isLoading = false;

                    if (result.success) {
                        alert("異動成功！");
                        self.fetchSingleData(self.singleData.bquet_nos);
                        RS00202010VM.qryPageOneData();
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
            let self = this;

            if (_.isUndefined(go_currentIndex)) {
                alert("請選擇要刪除的資料");
                return;
            }

            let delRow = $("#RS0W212010_dt").datagrid('getSelected');
            delRow.Upd_dat = moment(new Date()).format("YYYY/MM/DD HH:mm:ss");
            delRow.Upd_usr = self.userInfo.usr_id;

            if (delRow.createRow != "Y") {
                self.tmpCud.dt_deleteData.push(delRow);
            }

            $("#RS0W212010_dt").datagrid('deleteRow', go_currentIndex);
        },

        /**
         * 庫存檢查
         */
        checkInventory: function () {
            if (this.dataGridRows.length == 0) {
                alert('場地明細無資料！');
                return;
            }
            if (this.dgIns.endEditing()) {
                this.saveToTmpCud();
                this.callchkInventoryAPI('2030');
            }
            else {
                alert('場地明細尚未編輯完成！');
            }
        },

        /**
         * 更新庫存數
         */
        updateInventory: function (data, callback) {
            let self = this;

            _.each(self.dataGridRows, function (value) {
                if (value.is_allplace == "Y") {
                    let item = _.find(data.check_dt, function (field) {
                        return field.place_cod == value.place_cod.trim();
                    });
                    value.inv_qnt = item.inv_qnt;
                }
                else {
                    value.inv_qnt = value.desk_qnt;
                }
            });

            self.dgIns.loadDgData(self.dataGridRows);
            callback();
        },

        /**
         * call儲存前的庫存檢查API
         */
        callBeforeSaveAPI: function (func_id, callback) {
            let self = this;

            let lo_params = {
                trans_cod: prg_id,
                prg_id: prg_id,
                page_id: 2,
                func_id: func_id,
                tmpCUD: self.tmpCud
            };

            RS00202010VM.isLoading = true;

            $.post("/api/doOperationSave", lo_params, function (result) {
                RS00202010VM.isLoading = false;
                if (result.success) {
                    self.updateInventory(result.data, function () {
                        callback(true);
                    });
                }
                if (result.errorMsg != "") {
                    alert(result.errorMsg);
                    callback(false);
                }
            });
        },

        /**
         * call庫存檢查API
         */
        callchkInventoryAPI: function (func_id) {
            let self = this;

            let lo_params = {
                trans_cod: prg_id,
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
                    self.updateInventory(result.data, function () {
                    });
                }
                if (result.errorMsg != "") {
                    alert(result.errorMsg);
                }
            });
        },

        /**
         * call儲存的API
         */
        callSaveAPI: function (func_id) {
            let self = this;

            let lo_params = {
                trans_cod: prg_id,
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
                if (result.errorMsg != "") {
                    alert(result.errorMsg);
                }
            });
        },

        /**
         * RowLock
         */
        doRowLock: function (bquet_nos) {
            let lo_param = {
                prg_id: prg_id,
                table_name: "NULLbquet_mn",
                lock_type: "R",
                key_cod: bquet_nos.trim()
            };
            g_socket.emit('handleTableLock', lo_param);
        },

        /**
         * RowUnLock
         */
        doRowUnLock: function () {
            let lo_param = {
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
        let self = this;
        vmHub.$on('showPopUpDataGrid', function (result) {
            self.showPopUpDataGrid(result);
        });
    },
    methods: {

        //顯示點選popupgrid跳出來的視窗
        showPopUpDataGrid: function (result) {
            let self = this;
            let textDataGrid = result.showDataGrid;
            let updateFieldName = result.updateFieldNameTmp;
            let fieldNameChangeLanguage = result.fieldNameChangeLanguageTmp;
            this.fieldNameConditionTmp = [];
            this.fieldConditionTmp = [];
            this.gridData = [];
            delete textDataGrid ['errorMsg'];
            let columnsData = [];
            let textDataGridArray = Object.keys(textDataGrid).map(function (key) {
                return textDataGrid[key];
            });
            for (let col in textDataGrid[0]) {
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
                        if (field != "cust_cod" && field != "unit_amt") {
                            self.fieldNameConditionTmp.push({value: field, display: name});
                            self.fieldConditionTmp.push({value: field});
                        }

                    }
                });
            }

            self.gridData = textDataGridArray;
            let height = document.documentElement.clientHeight - 160;
            let width = document.documentElement.clientWidth / 2 - 25; //browser 寬度 - 200功能列
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
            let self = this;
            let selectTable = $('#chooseGrid').datagrid('getSelected');
            let chooseData = self.updateFieldNameTmp;
            let updateFieldName = self.updateFieldNameTmp;

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
                    chooseData[chooseField] = ""; //SAM20170930
                });
            }
            vmHub.$emit('updateBackSelectData', chooseData);
            $("#dataPopUpGridDialog").dialog('close');
        },
        txtSearchChangeText: function (keyContent) {
            let allData = this.gridData;
            let selectFieldName = $('#cbSelect').val();
            let selectCondition = $('#txtSelectCondition').val();

            let dataGrid = _.filter(allData, function (row) {
                if (row[selectFieldName].includes(selectCondition)) {
                    return row;
                }
            });
            $('#chooseGrid').datagrid('loadData', dataGrid);

        }
    }
});

//page.1 平面圖
let RS00202010VM = new Vue({
    el: "#RS00202010Main",
    components: {
        singlePage
    },
    data: {
        nowDate: moment(new Date()).format("YYYY/MM/DD"),
        searchDate: moment(new Date()).format("YYYY/MM/DD"),
        pageOneData: {},

        //鎖單筆DT用(RowLock)
        readonly: false,
        isLoading: false,
        isFirst: true
    },
    watch: {
        searchDate: function () {
            let ls_searchDate = getCookie("searchDate");
            if (_.isUndefined(ls_searchDate) || _.isNull(ls_searchDate) || ls_searchDate == "") {
                this.searchDate = moment(new Date()).format("YYYY/MM/DD");
                setupCookie("searchDate", this.searchDate, "/", 3600000); //預設一小時
                location.reload();
            }
            if (this.searchDate != ls_searchDate) {
                setupCookie("searchDate", this.searchDate, "/", 3600000); //預設一小時
                location.reload();
            }
        }
    },
    mounted: function () {
        window.onbeforeunload = function () {
        };
        let ls_searchDate = getCookie("searchDate");
        if (ls_searchDate == null) {
            ls_searchDate = moment().format("YYYY/MM/DD");
            setupCookie("searchDate", ls_searchDate, "/", 3600000); //預設一小時
        }
        this.nowDate = moment(ls_searchDate).format("YYYY/MM/DD");
        this.searchDate = ls_searchDate;
        this.qryPageOneData();
    },
    updated: function () {
        if (this.isFirst == true && this.isLoading == false) {
            $("table.treeControl").agikiTreeTable({
                persist: false,
                persistStoreName: "files",
                initialState: "expanded"
            });
            $("#gs-fixTable").tableHeadFixer({"left": 1});
            this.isFirst = false;
        }
    },
    methods: {
        qryPageOneData: function () {
            let self = this;
            let lo_params = {use_dat: this.searchDate};
            this.isLoading = true;
            $.post("/reserveBanquet/qryPageOneData", lo_params, function (result) {
                self.isLoading = false;
                if (result.success) {
                    self.pageOneData = result.pageOneData;
                }
                else {
                    alert(result.errorMsg);
                }
            });
        },

        addReserve: function () {
            let self = this;
            let ln_td;
            let rspt_cod;
            let place_cod;

            let ls_beginTimeByAdd;

            let ln_desk_qnt;
            let lo_mtimeData;

            if (arguments.length != 0) {
                click_beg_tim = arguments[0];
                ln_td = arguments[1];
                rspt_cod = arguments[2];
                place_cod = arguments[3];

                /**
                 * 取新增時間點
                 * ls_beginTimeByAdd    {string} 開始時間
                 * ls_endTimeByAdd      {string} 結束時間
                 */

                ls_beginTimeByAdd = moment(click_beg_tim, "HH:mm").add(ln_td * 30, "m").format("HH:mm");

                /**
                 * 取新增餐期
                 * @type {{name: string 餐期名稱, mtime_cod: string 餐期代碼}}
                 */
                let lo_rspt = _.findWhere(this.pageOneData.rowData, {datatype: "RSPT", rspt_cod: rspt_cod});
                _.some(lo_rspt.banquet_dt, function (lo_mtime, index) {
                    // 餐期
                    if (lo_mtime.name != "") {
                        lo_mtimeData = self.chkMtime(lo_mtime, ls_beginTimeByAdd);

                        if (!_.isEmpty(lo_mtimeData)) {
                            return true;
                        }
                    }
                    // 空白餐期
                    else {
                        let ls_index = index + 1;
                        if (ls_index >= lo_rspt.banquet_dt.length) {
                            ls_index = 0;
                        }
                        lo_mtimeData = self.chkMtime(lo_rspt.banquet_dt[ls_index], ls_beginTimeByAdd);
                        if (!_.isEmpty(lo_mtimeData)) {
                            return true;
                        }
                    }
                });
                if (_.isEmpty(lo_mtimeData)) {
                    let la_mtime = _.filter(lo_rspt.banquet_dt, function (lo_dt) {
                        return lo_dt.name.trim() != "";
                    });
                    lo_mtimeData = la_mtime[0];
                }

                // 取新增桌數
                ln_desk_qnt = _.findWhere(this.pageOneData.rowData, {datatype: "PLACE", place_cod: place_cod}).desk_qnt;
            }

            let beg_tim = "";
            let end_tim = "";
            if (!_.isUndefined(lo_mtimeData)) {
                beg_tim = lo_mtimeData.beg_tim;
                end_tim = lo_mtimeData.end_tim;
            }

            vmHub.$emit("showReserve", {
                bquet_nos: "",
                begin_tim: beg_tim,
                end_tim: end_tim,
                place_cod: place_cod,
                desk_qnt: ln_desk_qnt,
                rspt_cod: rspt_cod
            });
        },

        chkMtime: function (lo_mtime, ls_beginTimeByAdd) {
            let lo_mtimeByAdd = {};
            let la_mtime_beg_ary = lo_mtime.beg_tim.split(":");
            let la_mtime_end_ary = lo_mtime.end_tim.split(":");
            let la_beginTimeByAdd_ary = ls_beginTimeByAdd.split(":");

            //轉換為分鐘數，且小於開始營業時間 + 1天
            let ln_mtime_beg_min = this.chkTimeAdd24Min(parseInt(la_mtime_beg_ary[0]) * 60 + parseInt(la_mtime_beg_ary[1]));
            let ln_mtime_end_min = this.chkTimeAdd24Min(parseInt(la_mtime_end_ary[0]) * 60 + parseInt(la_mtime_end_ary[1]));
            let ln_beginTimeByAdd_min = this.chkTimeAdd24Min(parseInt(la_beginTimeByAdd_ary[0]) * 60 + parseInt(la_beginTimeByAdd_ary[1]));

            let lb_isBetween = false;
            let lb_isAfter = false;
            //點在餐期區間內
            if (ln_beginTimeByAdd_min >= ln_mtime_beg_min && ln_beginTimeByAdd_min < ln_mtime_end_min) {
                lb_isBetween = true;
            }
            //點在餐期開始時間前，算此餐期
            if (ln_beginTimeByAdd_min <= ln_mtime_beg_min) {
                lb_isAfter = true;
            }

            if (lb_isBetween || lb_isAfter) {
                lo_mtimeByAdd = {
                    name: lo_mtime.name,
                    mtime_cod: lo_mtime.mtime_cod,
                    beg_tim: lo_mtime.beg_tim,
                    end_tim: lo_mtime.end_tim
                };
            }

            return lo_mtimeByAdd;
        },

        chkTimeAdd24Min(ln_tim) {
            let la_day_beg_tim = this.pageOneData.time_range[0].split(":");
            let ln_day_beg_tim_min = parseInt(la_day_beg_tim[0]) * 60 + parseInt(la_day_beg_tim[1]);
            let ln_day_min = 24 * 60;
            if (ln_tim < ln_day_beg_tim_min) {
                ln_tim += ln_day_min;
            }
            return ln_tim;
        },

        showReserve: function (bquet_nos) {
            vmHub.$emit("showReserve", {bquet_nos: bquet_nos});
        },

        initToday: function () {
            this.searchDate = moment().format("YYYY/MM/DD");
            this.qryPageOneData();
        }
    }
});

function isObjectArrayEqual(a, b) {

    let isEqual = true;

    if (a.length != b.length) {
        return false;
    }

    for (i = 0; i < a.length; i++) {
        if (!isObjectValueEqual(a[i], b[i])) {
            isEqual = false;
        }
    }
    return isEqual;
}

function isObjectValueEqual(a, b) {
    // Of course, we can do it use for in
    // Create arrays of property names
    let aProps = Object.getOwnPropertyNames(a);
    let bProps = Object.getOwnPropertyNames(b);

    // If number of properties is different,
    // objects are not equivalent
    if (aProps.length != bProps.length) {
        return false;
    }

    for (let i = 0; i < aProps.length - 1; i++) {
        let propName = aProps[i];

        // If values of same property are not equal,
        // objects are not equivalent
        if (a[propName] !== b[propName]) {
            if (a[propName] == null || a[propName] == "" || a[propName].toString().trim() == "") {
                if (b[propName] == null || _.isUndefined(b[propName]) || b[propName] == "" || b[propName].toString().trim() == "") {
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

function padLeft(str, lenght) {
    if (str.length >= lenght) {
        return str;
    }
    else {
        return padLeft("0" + str, lenght);
    }
}

$('.easyUi-custom1').tabs({});

$(window).on('beforeunload', function () {
    vmHub.$emit("doUnLock");
});