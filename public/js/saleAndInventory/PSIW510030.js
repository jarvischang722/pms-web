/**
 * Created by a16009 on 2017/10/11.
 * 程式編號: PSIW510030
 * 程式名稱: 門市WEB訂單作業
 */

//ps. Row Lock 要傳的參數其中 table_name跟key_code寫反了(參照ERP的寫法)

var prg_id = "PSIW510030";

var go_funcPurview = (new FuncPurview(prg_id)).getFuncPurvs();

//rowLock
g_socket.on('checkTableLock', function (result) {
    if (!result.success) {
        alert(result.errorMsg);
    } else {
        PSIW510030.buttonAfterLockDoFunc();
    }
});

//多筆
/** DatagridRmSingleGridClass ***/
function DatagridRmSingleGridClass() {
}

DatagridRmSingleGridClass.prototype = new DatagridBaseClass();
DatagridRmSingleGridClass.prototype.onClickCell = function (idx, row) {
};

DatagridRmSingleGridClass.prototype.onClickRow = function (idx, row) {
    if (!PSIW510030.createStatus && !PSIW510030.editStatus) {

        PSIW510030.fetchSingleData(row.order_nos);

        PSIW510030.addEnable = true;
        PSIW510030.editEnable = true;
        PSIW510030.deleteEnable = true;
        PSIW510030.cnfirmEnable = true;
        PSIW510030.cancelEnable = true;
        PSIW510030.saveEnable = false;
        PSIW510030.dropEnable = false;
        PSIW510030.printEnable = true;

        PSIW510030.isModificable = false;
        PSIW510030.isModificableFormat = false;
    }
};
/*** Class End  ***/

//單筆DT
/** DatagridRmSingleGridClass ***/
function DatagridRmSingleDTGridClass() {
}

DatagridRmSingleDTGridClass.prototype = new DatagridBaseClass();

var go_currentField;
var go_currentIndex;

DatagridRmSingleDTGridClass.prototype.endEditing = function () {
    if (go_currentIndex == undefined) {
        return true;
    }
    if ($('#PSIW510030_dt').datagrid('validateRow', go_currentIndex)) {
        $('#PSIW510030_dt').datagrid('endEdit', go_currentIndex);
        go_currentIndex = undefined;
        return true;
    }
    return false;
};

DatagridRmSingleDTGridClass.prototype.onClickCell = function (index, field) {
    if (PSIW510030.isModificable) {
        if (DatagridRmSingleDTGridClass.prototype.endEditing()) {
            if (go_currentIndex != index) {
                $('#PSIW510030_dt').datagrid('selectRow', index).datagrid('beginEdit', index);
                var ed = $('#PSIW510030_dt').datagrid('getEditor', {index: index, field: field});
                if (ed) {
                    ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).select();
                }
                go_currentIndex = index;
                go_currentField = ed;

                $("span.numberbox").find("input").css("text-align", "right");
            }
        }
    }
};

var gb_isbind = false;
//擴充上下左右操控
$.extend($('#PSIW510030_dt').datagrid.methods, {
    keyCtr: function (jq) {
        return jq.each(function () {
            var grid = $(this);
            if (!gb_isbind) {
                grid.datagrid('getPanel').panel('panel').attr('tabindex', 1).bind('keydown', function (e) {

                    if (PSIW510030.isModificable) {
                        switch (e.keyCode) {
                            // Up
                            case 38:
                                e.preventDefault();

                                var index = go_currentIndex;

                                if (index > 0) {
                                    if (DatagridRmSingleDTGridClass.prototype.endEditing()) {
                                        grid.datagrid('selectRow', index - 1).datagrid('beginEdit', index - 1);

                                        var field = 'item_qnt';

                                        if (!_.isUndefined(go_currentField)) {
                                            field = go_currentField.field;
                                        }

                                        var ed = grid.datagrid('getEditor', {index: index - 1, field: field});
                                        if (ed) {
                                            ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).select();
                                        }
                                        go_currentField = ed;
                                        go_currentIndex = index - 1;

                                        $("span.numberbox").find("input").css("text-align", "right");
                                    }
                                }
                                break;
                            // Down
                            case 40:
                                e.preventDefault();

                                var index = go_currentIndex;
                                var rows = grid.datagrid('getRows');

                                if (index < rows.length - 1) {
                                    if (DatagridRmSingleDTGridClass.prototype.endEditing()) {
                                        grid.datagrid('selectRow', index + 1).datagrid('beginEdit', index + 1);

                                        var field = 'order_rmk';

                                        if (!_.isUndefined(go_currentField)) {
                                            field = go_currentField.field;
                                        }

                                        var ed = grid.datagrid('getEditor', {index: index + 1, field: field});

                                        if (ed) {
                                            ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).select();
                                        }
                                        go_currentField = ed;
                                        go_currentIndex = index + 1;

                                        $("span.numberbox").find("input").css("text-align", "right");
                                    }
                                }
                                break;
                            // Left
                            case 37:
                                e.preventDefault();

                                var ed = grid.datagrid('getEditor', {index: go_currentIndex, field: 'item_qnt'});
                                if (ed) {
                                    ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).select();
                                }
                                go_currentField = ed;

                                break;
                            // Right
                            case 39:
                                e.preventDefault();

                                var ed = grid.datagrid('getEditor', {index: go_currentIndex, field: 'order_rmk'});
                                if (ed) {
                                    ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).select();
                                }
                                go_currentField = ed;

                                break;
                        }
                    }
                });
                gb_isbind = true;
            }
        });
    }
});

/*** Class End  ***/

var PSIW510030 = new Vue({
    el: '#MainApp2',
    mounted: function () {
        this.initSelect();
        this.initSearchComp();
        this.getSystemParam();
        this.fetchUserInfo();

    },
    data: {
        userid: "", //員工編號

        isVerify: false, //驗證畫面切換
        isLoading: false, //Loading畫面切換

        userInfo: {}, //登入的使用者資料

        createStatus: false, //新增狀態
        editStatus: false, //編輯狀態
        deleteStatus: false, //刪除狀態

        isModificable: false, //決定是否可以修改資料
        isModificableFormat: false, //決定是否可以修改訂單格式

        addEnable: true,
        editEnable: false,
        deleteEnable: false,
        cnfirmEnable: false,
        cancelEnable: false,
        saveEnable: false,
        dropEnable: false,
        orderDownloadEnable: true,
        changeLogEnable: true,
        printEnable: false,

        buttonCase: "",

        isRowLock: false,

        dgIns: {},
        dgInsDT: {},

        DataGridRows: [], //多筆資料

        originData: {}, //原始單筆資料
        singleData: {}, //單筆資料
        singleDataTemp: {}, //單筆資料暫存

        singleDataGridRows: [], //單筆 DT 資料
        oriSingleDataGridRows: [], //單筆 DT 原始資料

        custSelectData: [], //客戶代號下拉
        orderSelectData: [], //訂單格式下拉
        unitSelectData: [], //單位下拉

        searchOrderSelectData: [], //訂單格式(查詢用)
        searchCustSelectData: [], //客戶代號(查詢用)

        statusSelectData: [{value: 'N', display: 'N:待核'}, {value: 'C', display: 'C:核准'}, {
            value: 'O',
            display: 'O:出貨中'
        }, {value: 'S', display: 'S:結清'}, {value: 'H', display: 'H:保留'}, {value: 'X', display: 'X:出貨完畢'}], //狀態下拉

        searchFields: [], //搜尋的欄位
        searchCond: {atten_nam: "", cust_cod: "", format_sta: "", order_dat: "", order_nos: "", order_sta: ""}, //搜尋條件

        //空白表單下載用
        allOrderSelectData: [], //全部訂單格式下拉
        select_format_sta: "",
        select_quote_rmk: "",
        select_order_time: "",
        pageNum: "",
        order_data: [],

        //表單列印用
        print_quote_rmk: "",
        print_pageNum: "",
        print_order_data: [],

        ship_mn_round_nos: "", //(系統參數)單據主檔金額小數位數
        ship_dt_round_nos: "", //(系統參數)單據明細小計小數位數
        order_dat_change_time: "", //(系統參數)訂貨日期切換的時間參數

        //異動Log
        openChangeLogDialog: false,
        allChangeLogList: [],

        //參數
        dataPointRound: 3
    },
    watch: {

        singleData: {
            handler: function (after, before) {

                var self = this;

                self.print_order_data = [];
                var li_page_num = 0;
                var temp = [];

                var lo_temp_singleDataGridRows = [];
                for (var i = 0; i < self.singleDataGridRows.length; i++) {
                    if (self.singleDataGridRows[i].item_qnt != 0) {
                        lo_temp_singleDataGridRows.push(self.singleDataGridRows[i]);
                    }
                }

                for (var i = 0; i < lo_temp_singleDataGridRows.length; i++) {
                    //50 = 一頁幾筆明細
                    if (i % 60 == 0) {
                        self.print_order_data.push(temp);
                        li_page_num += 1;
                        temp = [];
                    }

                    temp.push(lo_temp_singleDataGridRows[i]);

                    if (i == lo_temp_singleDataGridRows.length - 1) {
                        self.print_order_data.push(temp);
                    }
                }
                self.print_pageNum = li_page_num;

                _.each(self.print_order_data, function (array) {
                    _.each(array, function (item) {
                        //找單位名稱
                        var unit = _.find(self.unitSelectData, {value: item.unit_typ});
                        item.goods_unit = unit.display;
                    });
                });

                //取quote_rmk, order_time
                _.each(self.allOrderSelectData, function (value) {
                    if (value.format_sta == self.singleData.format_sta) {

                        self.print_quote_rmk = value.quote_rmk.trim() || '';
                    }
                });

            },
            deep: true
        },

        //region//按鈕如沒權限, 則不能Enable
        addEnable: function () {
            var purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "0200";
            });
            if (purview == -1) {
                this.addEnable = false;
            }
        },
        editEnable: function () {
            var purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "0400";
            });
            if (purview == -1) {
                this.editEnable = false;
            }
        },
        deleteEnable: function () {
            var purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "0300";
            });
            if (purview == -1) {
                this.deleteEnable = false;
            }
        },
        cnfirmEnable: function () {
            var purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "1010";
            });
            if (purview == -1) {
                this.cnfirmEnable = false;
            }
        },
        cancelEnable: function () {
            var purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "1020";
            });
            if (purview == -1) {
                this.cancelEnable = false;
            }
        },
        changeLogEnable: function () {
            var purview = _.findIndex(go_funcPurview, function (value) {
                return value.func_id == "0800";
            });
            if (purview == -1) {
                this.changeLogEnable = false;
            }
        }
        //endregion
    },
    methods: {

        /**
         * 初始化下拉選單
         */
        initSelect: function () {

            var self = this;
            //客戶代號
            var lo_params = {
                func: "getShowCodSelect"
            };
            this.isLoading = true;
            BacUtils.doHttpPostAgent("/api/getQueryResult", lo_params, function (result) {
                self.isLoading = false;

                if (result.error != null) {
                    alert(result.error);
                }
                else {
                    self.custSelectData = result.data;
                }
            });

            //單位
            lo_params = {
                func: "getUnitSelect"
            };
            this.isLoading = true;
            BacUtils.doHttpPostAgent("/api/getQueryResult", lo_params, function (result) {
                self.isLoading = false;

                if (result.error != null) {
                    alert(result.error);
                }
                else {
                    self.unitSelectData = result.data;
                    self.initDataGridField();
                }
            });

        },

        /**
         * 初始化Search
         */
        initSearchComp: function () {
            var self = this;

            self.isLoading = true;
            async.parallel([
                //訂單格式(查詢用)
                function (cb) {
                    lo_params = {
                        func: "getSearchFormatSta"
                    };
                    BacUtils.doHttpPostAgent("/api/getQueryResult", lo_params, function (result) {

                        if (result.error != null) {
                            alert(result.error);
                        }
                        else {
                            self.searchOrderSelectData = result.data;
                        }

                        cb(result.error, result.data);
                    });
                },
                //客戶代號(查詢用)
                function (cb) {

                    lo_params = {
                        func: "getSearchShowCod"
                    };
                    self.isLoading = true;
                    BacUtils.doHttpPostAgent("/api/getQueryResult", lo_params, function (result) {
                        self.isLoading = false;

                        if (result.error != null) {
                            alert(result.error);
                        }
                        else {
                            self.searchCustSelectData = result.data;
                        }

                        cb(result.error, result.data);
                    });
                }
            ], function (err, result) {
                if (!err) {
                    self.searchFields = [
                        {
                            ui_field_name: "order_nos",
                            ui_type: "text",
                            row_seq: 1,
                            col_seq: 1,
                            width: 200,
                            ui_display_name: "訂單編號"
                        },
                        {
                            ui_field_name: "order_dat",
                            ui_type: "daterange",
                            row_seq: 1,
                            col_seq: 1,
                            width: 150,
                            ui_display_name: "訂單日期"
                        },
                        {
                            ui_field_name: "cust_cod",
                            ui_type: "multiselectgrid",
                            row_seq: 1,
                            col_seq: 1,
                            width: 200,
                            selectData:{
                                selectData: self.searchCustSelectData,
                                columns: [
                                    {
                                        field: "cust_nam",
                                        title: "客戶代號/名稱",
                                        width: 200
                                    }
                                ],
                                display: "cust_nam",
                                value: "cust_cod"
                            },
                            ui_display_name: "客戶代號"
                        },
                        {
                            ui_field_name: "format_sta",
                            ui_type: "multiselect",
                            row_seq: 1,
                            col_seq: 1,
                            width: 200,
                            selectData: self.searchOrderSelectData,
                            ui_display_name: "訂單格式"
                        },
                        {
                            ui_field_name: "atten_nam",
                            ui_type: "text",
                            row_seq: 1,
                            col_seq: 1,
                            width: 200,
                            ui_display_name: "訂貨人姓名"
                        },
                        {
                            ui_field_name: "order_sta",
                            ui_type: "multiselect",
                            row_seq: 1,
                            col_seq: 1,
                            width: 200,
                            selectData: [{"value": "N", "display": "N:待准"}, {
                                "value": "C",
                                "display": "C:核准"
                            }, {"value": "O", "display": "O:出貨中"}, {"value": "S", "display": "S:結清"}, {
                                "value": "H",
                                "display": "H:保留"
                            }, {"value": "X", "display": "X:出貨完畢"}],
                            ui_display_name: "訂單狀態"
                        }
                    ];

                    self.isLoading = false;
                }
            });
        },

        /**
         * 取系統參數
         */
        getSystemParam: function () {
            var self = this;

            //訂貨日期切換的時間
            var lo_params = {
                func: "getSystemParam",
                paramName: "ship_mn_round_nos"
            };
            BacUtils.doHttpPostAgent("/api/getQueryResult", lo_params, function (result) {
                if (result.error != null) {
                    alert(result.error);
                }
                else {
                    self.ship_mn_round_nos = result.data.ship_mn_round_nos;
                }
            });

            //訂貨日期切換的時間
            lo_params = {
                func: "getSystemParam",
                paramName: "ship_dt_round_nos"
            };
            BacUtils.doHttpPostAgent("/api/getQueryResult", lo_params, function (result) {
                if (result.error != null) {
                    alert(result.error);
                }
                else {
                    self.ship_dt_round_nos = result.data.ship_dt_round_nos;
                }
            });

            //訂貨日期切換的時間
            lo_params = {
                func: "getSystemParam",
                paramName: "order_dat_change_time"
            };
            BacUtils.doHttpPostAgent("/api/getQueryResult", lo_params, function (result) {
                if (result.error != null) {
                    alert(result.error);
                }
                else {
                    self.order_dat_change_time = result.data.order_dat_change_time;
                }
            });

            //取得所有訂單格式
            lo_params = {
                func: "getAllFormatSta"
            };
            BacUtils.doHttpPostAgent("/api/getQueryResult", lo_params, function (result) {
                self.isLoading = false;

                if (result.error != null) {
                    alert(result.error);
                }
                else {
                    self.allOrderSelectData = result.data;
                }
            });

        },

        /**
         * 初始化DataGrid
         */
        initDataGridField: function () {
            var self = this;

            self.dgIns = new DatagridRmSingleGridClass();
            self.dgIns.init(prg_id, 'PSIW510030_dg', DatagridFieldAdapter.combineFieldOption(self.bindingFieldData(), 'PSIW510030_dg'), self.bindingFieldData(), {
                pagination: true,
                rownumbers: true,
                pageSize: 20
            });

            self.dgInsDT = new DatagridRmSingleDTGridClass();
            self.dgInsDT.init(prg_id, 'PSIW510030_dt', DatagridFieldAdapter.combineFieldOption(self.bindingDTFieldData(), 'PSIW510030_dt'));
            $("#PSIW510030_dt").datagrid({}).datagrid("keyCtr");
        },

        /**
         * 驗證人員編號
         */
        verify: function () {

            if (this.userid.trim().length == 8) {
                this.isVerify = true;
            }
            else {
                alert("員工編號應為8碼!");
            }
        },

        /**
         * 取得使用者資料
         */
        fetchUserInfo: function () {
            var self = this;
            BacUtils.doHttpPostAgent('/api/getUserInfo', function (result) {
                if (result.success) {
                    self.userInfo = result.userInfo;
                }
            });
        },

        /**
         * 組多筆的欄位(未來可能改用Mongo)
         */
        bindingFieldData: function () {
            var lo_fieldData = [
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "order_nos",
                    ui_type: "text",
                    ui_field_length: 20,
                    ui_field_num_point: 0,
                    col_seq: 0,
                    width: 80,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_mn",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "訂單編號"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "order_dat",
                    ui_type: "date",
                    ui_field_length: 20,
                    ui_field_num_point: 0,
                    col_seq: 2,
                    width: 80,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_mn",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "訂單日期"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "order_sta",
                    ui_type: "text",
                    ui_field_length: 1,
                    ui_field_num_point: 0,
                    col_seq: 4,
                    width: 50,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_mn",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "狀態"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "format_sta",
                    ui_type: "text",
                    ui_field_length: 4,
                    ui_field_num_point: 0,
                    col_seq: 5,
                    width: 80,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_mn",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "訂單格式"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "show_cod",
                    ui_type: "text",
                    ui_field_length: 20,
                    ui_field_num_point: 0,
                    col_seq: 6,
                    width: 80,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_mn",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "客戶代號"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "cust_nam",
                    ui_type: "text",
                    ui_field_length: 20,
                    ui_field_num_point: 0,
                    col_seq: 7,
                    width: 100,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_mn",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "客戶名稱"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "atten_nam",
                    ui_type: "text",
                    ui_field_length: 20,
                    ui_field_num_point: 0,
                    col_seq: 7,
                    width: 100,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_mn",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "訂貨人姓名"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "order_rmk",
                    ui_type: "text",
                    ui_field_length: 20,
                    ui_field_num_point: 0,
                    col_seq: 8,
                    width: 80,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_mn",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "訂單備註"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "ins_usr",
                    ui_type: "text",
                    ui_field_length: 10,
                    ui_field_num_point: 0,
                    col_seq: 9,
                    width: 80,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_mn",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "輸入者"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "upd_usr",
                    ui_type: "text",
                    ui_field_length: 10,
                    ui_field_num_point: 0,
                    col_seq: 10,
                    width: 100,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_mn",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "最後異動者"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "cnfirm_cod",
                    ui_type: "text",
                    ui_field_length: 10,
                    ui_field_num_point: 0,
                    col_seq: 11,
                    width: 80,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_mn",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "核准者"
                }
            ];
            return lo_fieldData;
        },

        /**
         * 組單筆的DT欄位(未來可能改用Mongo)
         */
        bindingDTFieldData: function () {

            var lo_fieldData = [
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "order_ser",
                    ui_type: "number",
                    ui_field_length: 5,
                    ui_field_num_point: 0,
                    col_seq: 0,
                    width: 35,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_dt",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "序號",
                    align: "center"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "goods_cod",
                    ui_type: "text",
                    ui_field_length: 15,
                    ui_field_num_point: 0,
                    col_seq: 1,
                    width: 70,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_dt",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "貨號",
                    align: "center"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "goods_rmk",
                    ui_type: "text",
                    ui_field_length: 100,
                    ui_field_num_point: 0,
                    col_seq: 2,
                    width: 200,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_dt",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "貨品簡稱"//2018/03/06, #186419 客戶要求　貨品描述　→　貨品簡稱　
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "stock_qnt",
                    ui_type: "number",
                    ui_field_length: 15,
                    ui_field_num_point: this.dataPointRound,
                    col_seq: 4,
                    width: 60,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_dt",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    align: "right",
                    ui_display_name: "庫存量"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "thu_qty",
                    ui_type: "number",
                    ui_field_length: 15,
                    ui_field_num_point: this.dataPointRound,
                    col_seq: 4,
                    width: 60,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_dt",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    align: "right",
                    ui_display_name: "萬元用量"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "stock_unit",
                    ui_type: "select",
                    ui_field_length: 10,
                    ui_field_num_point: 0,
                    col_seq: 4,
                    width: 65,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_dt",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "庫存單位",
                    selectData: this.unitSelectData,
                    align: "center"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "order_qnt",
                    ui_type: "number",
                    ui_field_length: 15,
                    ui_field_num_point: this.dataPointRound,
                    col_seq: 5,
                    width: 75,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_dt",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    align: "right",
                    ui_display_name: "建議訂購量"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "item_qnt",
                    ui_type: "text",
                    ui_field_length: 15,
                    ui_field_num_point: 0,
                    col_seq: 6,
                    width: 60,
                    visiable: "Y",
                    modificable: "Y",
                    requirable: "Y",
                    grid_field_name: "psi_quote_dt",
                    keyable: "",
                    format_func_name: "ChkGteZeroNum",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    align: "right",
                    ui_display_name: "訂購量"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "unit_typ",
                    ui_type: "select",
                    ui_field_length: 10,
                    ui_field_num_point: 0,
                    col_seq: 3,
                    width: 65,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_dt",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "訂購單位",
                    selectData: this.unitSelectData,
                    align: "center"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "ship_dat",
                    ui_type: "date",
                    ui_field_length: 10,
                    ui_field_num_point: 0,
                    col_seq: 4,
                    width: 80,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_dt",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "預計到貨日",
                    align: "center"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "nship_dat",
                    ui_type: "date",
                    ui_field_length: 10,
                    ui_field_num_point: 0,
                    col_seq: 4,
                    width: 100,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_dt",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "預計下次到貨日",
                    align: "center"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "safe_day",
                    ui_type: "number",
                    ui_field_length: 10,
                    ui_field_num_point: 0,
                    col_seq: 4,
                    width: 60,
                    visiable: "Y",
                    modificable: "N",
                    requirable: "N",
                    grid_field_name: "psi_quote_dt",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    align: "right",
                    ui_display_name: "安全天數"
                },
                {
                    athena_id: "",
                    user_id: "",
                    prg_id: "PSIW510030",
                    ui_field_name: "order_rmk",
                    ui_type: "text",
                    ui_field_length: 100,
                    ui_field_num_point: 0,
                    col_seq: 7,
                    width: 200,
                    visiable: "Y",
                    modificable: "Y",
                    requirable: "N",
                    grid_field_name: "psi_quote_dt",
                    keyable: "",
                    format_func_name: "",
                    rule_func_name: "",
                    user_athena_id: "",
                    multi_lang_table: "",
                    page_id: 1,
                    ui_display_name: "備註"
                }
            ];
            return lo_fieldData;
        },

        /**
         * 取得多筆資料
         */
        loadDataGrid: function () {
            var self = this;

            var lo_params = {
                prg_id: prg_id,
                func: "getDataGridRows",
                searchCond: this.searchCond
            };

            self.isLoading = true;
            //撈多筆資料
            BacUtils.doHttpPostAgent("/api/getQueryResult", lo_params, function (result) {
                self.isLoading = false;

                if (result.error != null) {
                    alert(result.error);
                }
                else {
                    self.DataGridRows = result.data;

                    self.dgIns.loadPageDgData(self.DataGridRows);
                }
            });
        },

        /**
         * 取得單筆資料
         */
        fetchSingleData: function (order_nos) {

            var self = this;

            //撈單筆MN
            var lo_params = {
                func: "getSingleDataMN",
                order_nos: order_nos
            };

            self.isLoading = true;
            BacUtils.doHttpPostAgent("/api/getQueryResult", lo_params, function (result) {
                self.isLoading = false;

                if (result.error != null) {
                    alert(result.error.errorMsg);
                }
                else {

                    self.singleDataTemp = result.data;

                    self.singleDataTemp.order_dat = moment(new Date(self.singleDataTemp.order_dat)).format("YYYY/MM/DD");
                    self.singleDataTemp.ship_dat = moment(new Date(self.singleDataTemp.ship_dat)).format("YYYY/MM/DD");

                    self.singleDataTemp.ins_dat = moment(new Date(self.singleDataTemp.ins_dat)).format("YYYY/MM/DD HH:mm:ss");
                    self.singleDataTemp.upd_dat = moment(new Date(self.singleDataTemp.upd_dat)).format("YYYY/MM/DD HH:mm:ss");

                    if (self.singleDataTemp.cnfirm_dat != null) {
                        self.singleDataTemp.cnfirm_dat = moment(new Date(self.singleDataTemp.cnfirm_dat)).format("YYYY/MM/DD HH:mm:ss");
                    }


                    if (self.singleDataTemp.ship1_add != null && self.singleDataTemp.ship1_add.toString().length > 60) {
                        self.singleDataTemp.ship2_add = self.singleDataTemp.ship1_add.toString().substr(60);
                        self.singleDataTemp.ship1_add = self.singleDataTemp.ship1_add.toString().substr(0, 60);
                    }

                    //撈客戶名稱(cust_nam)
                    _.each(self.custSelectData, function (value, index) {
                        if (value.cust_cod == self.singleDataTemp.cust_cod) {
                            self.singleDataTemp.cust_nam = value.cust_nam;
                            self.singleDataTemp.show_cod = value.show_cod;
                        }
                    });

                    self.oriSingleData = _.clone(self.singleDataTemp);
                    self.initOrderSelect();
                }
            });

            //撈單筆DT
            lo_params = {
                func: "getSingleDataDT",
                order_nos: order_nos
            };

            self.isLoading = true;
            BacUtils.doHttpPostAgent("/api/getQueryResult", lo_params, function (result) {
                self.isLoading = false;

                if (result.error != null) {
                    alert(result.error);
                }
                else {
                    _.each(result.data, function (value) {
                        //小數欄位format
                        value.item_qnt = go_MathTool.formatFloat(value.item_qnt, 0); //客戶要求訂購量整數
                        value.order_qnt = go_MathTool.formatFloat(value.order_qnt, self.dataPointRound).toFixed(self.dataPointRound);
                        value.thu_qty = go_MathTool.formatFloat(value.thu_qty, self.dataPointRound).toFixed(self.dataPointRound);
                        value.stock_qnt = go_MathTool.formatFloat(value.stock_qnt, self.dataPointRound).toFixed(self.dataPointRound);

                        //日期格式format
                        value.ship_dat = moment(value.ship_dat).format('YYYY/MM/DD');
                        value.nship_dat = moment(value.nship_dat).format('YYYY/MM/DD');

                        value.stock_unit = value.stock_unit.trim();
                        value.unit_typ = value.unit_typ.trim();
                    });

                    self.singleDataGridRows = result.data;
                    self.dgInsDT.loadDgData(self.singleDataGridRows);

                    //保留原始資料, 供放棄使用
                    self.oriSingleDataGridRows = _.clone(self.singleDataGridRows);
                }
            });
        },

        /**
         * 新增按鈕 Event
         */
        addData: function () {
            this.defaultValue();
            this.createStatus = true;

            //region//修改UI狀態

            this.isModificable = true;
            this.isModificableFormat = true;

            this.addEnable = false;
            this.editEnable = false;
            this.deleteEnable = false;
            this.cnfirmEnable = false;
            this.cancelEnable = false;
            this.saveEnable = true;
            this.dropEnable = true;
            this.printEnable = false;

            //endregion
        },

        /**
         * 新增資料預設值
         */
        defaultValue: function () {

            //region //塞預設值

            //初始化主檔MN

            //判斷系統參數, 看訂單日是否為前一天
            this.singleData.order_dat = moment().format('YYYY/MM/DD');
            if (this.order_dat_change_time != null) {
                paramDate = new Date();
                paramDate.setHours(this.order_dat_change_time.toString().substr(0, 2), this.order_dat_change_time.toString().substr(2, 2));
                if (moment().format('HHmm') < moment(paramDate).format('HHmm')) {
                    this.singleData.order_dat = moment().add(-1, 'day').format('YYYY/MM/DD');
                }
            }

            this.singleData.order_nos = "";
            this.singleData.comp_cod = this.userInfo.cmp_id;

            this.singleData.order_sta = "";
            this.singleData.cust_cod = "";
            this.singleData.show_cod = "";
            this.singleData.cust_nam = "";
            this.singleData.atten_nam = "";
            this.singleData.ship1_add = "";
            this.singleData.ship2_add = "";
            this.singleData.ship_dat = moment(this.singleData.order_dat).add(1, 'day').format('YYYY/MM/DD');
            this.singleData.ins_usr = "";
            this.singleData.ins_dat = "";
            this.singleData.upd_usr = "";
            this.singleData.upd_dat = "";
            this.singleData.cnfirm_cod = "";
            this.singleData.cnfirm_dat = "";
            this.singleData.order_rmk = "";
            this.singleData.format_sta = "";
            this.singleData.hotel_cod = "";
            this.singleData.tax_typ = "";
            this.singleData.order_amt = 0;
            this.singleData.order_tax = 0;
            this.singleData.order_tot = 0;
            this.singleData.gen_cod = "W";
            this.singleData.chn_compcod = "";
            this.singleData.chn_purchnos = "";
            this.singleData.hotelcod = "";
            this.singleData.close_sta = "";
            this.singleData.close_dat = "";
            this.singleData.close_cod = "";
            this.singleData.conv_typ = "S";
            this.singleData.suply_sta = "";
            this.singleData.trans_typ = "";
            this.singleData.doc_cod = "2100";

            this.orderSelectData = [];

            //Week 格式代號用
            var day;
            switch (new Date(this.singleData.order_dat).getDay()) {
                case 0:
                    day = 'D7';
                    break;
                case 1:
                    day = 'D1';
                    break;
                case 2:
                    day = 'D2';
                    break;
                case 3:
                    day = 'D3';
                    break;
                case 4:
                    day = 'D4';
                    break;
                case 5:
                    day = 'D5';
                    break;
                case 6:
                    day = 'D6';
                    break;
            }

            this.singleData.week = day;

            //初始化明細DT
            this.singleDataGridRows = [];
            this.dgInsDT.loadDgData(this.singleDataGridRows);

            //endregion

            //如果客戶代號只有一種, 直接選定
            if (this.custSelectData.length == 1) {
                this.singleData.cust_cod = this.custSelectData[0].cust_cod;
                this.singleData.cust_nam = this.custSelectData[0].cust_nam;
                this.custSelectChange();
            }

        },

        /**
         * 初始化訂單格式下拉選單
         */
        initOrderSelect: function () {

            var self = this;
            //期別
            var lo_params = {
                func: "getPeriod",
                singleData: self.singleDataTemp
            };

            self.isLoading = true;

            BacUtils.doHttpPostAgent("/api/getQueryResult", lo_params, function (result) {
                self.isLoading = false;

                if (result.error != null) {
                    alert(result.error);
                }
                else {
                    var lo_period = result.data.period_cod.split(",");
                    self.singleDataTemp.period_cod = lo_period[0];
                    self.singleDataTemp.PXW1_start_dat = lo_period[1];
                    self.singleDataTemp.PXW1_end_dat = lo_period[2];

                    //Week 格式代號用
                    var day;
                    switch (new Date(self.singleDataTemp.order_dat).getDay()) {
                        case 0:
                            day = 'D7';
                            break;
                        case 1:
                            day = 'D1';
                            break;
                        case 2:
                            day = 'D2';
                            break;
                        case 3:
                            day = 'D3';
                            break;
                        case 4:
                            day = 'D4';
                            break;
                        case 5:
                            day = 'D5';
                            break;
                        case 6:
                            day = 'D6';
                            break;
                    }

                    self.singleDataTemp.week = day;

                    //訂單格式
                    var lo_params2 = {
                        func: "getFormatSta",
                        singleData: self.singleDataTemp
                    };
                    self.isLoading = true;
                    BacUtils.doHttpPostAgent("/api/getQueryResult", lo_params2, function (result) {
                        self.isLoading = false;

                        self.orderSelectData = result.data;
                        self.singleData = self.singleDataTemp;

                        if (result.error) {
                            alert(result.error);
                        }
                    });
                }

            });
        },

        /**
         * 客戶代號  Select Change Event
         */
        custSelectChange: function () {

            if (_.isUndefined(this.singleData.cust_cod)) {
                return;
            }

            var self = this;

            self.isLoading = true;

            //撈客戶名稱(cust_nam)
            _.each(this.custSelectData, function (value, index) {
                if (value.cust_cod == self.singleData.cust_cod) {
                    self.singleData.cust_nam = value.cust_nam;
                    self.singleData.show_cod = value.show_cod;
                }
            });

            //撈客戶資料(accunt_sta, accunt_nos, ship_typ, sales_cod)
            //撈送貨地點(ship1_Add, ship2_Add)
            //撈客戶電話(cust_tel)
            lo_params = {
                func: "getCustInfo",
                singleData: self.singleData
            };
            BacUtils.doHttpPostAgent("/api/getQueryResult", lo_params, function (result) {
                self.isLoading = false;
                if (result.error == null) {
                    self.singleData.accunt_sta = result.data.accunt_sta;
                    self.singleData.accunt_nos = result.data.accunt_nos;
                    self.singleData.ship_typ = result.data.ship_typ;
                    self.singleData.sales_cod = result.data.sales_cod;

                    if (result.data.cust_tel == null) {
                        self.singleData.cust_tel = "";
                    }
                    else {
                        self.singleData.cust_tel = result.data.cust_tel;
                    }

                    if (result.data.address == null) {
                        self.singleData.ship1_add = "";
                        self.singleData.ship2_add = "";
                    }
                    else {
                        if (result.data.address.toString().length > 60) {
                            self.singleData.ship1_add = result.data.address.toString().substr(0, 60);
                            self.singleData.ship2_add = result.data.address.toString().substr(60);
                        }
                        else {
                            self.singleData.ship1_add = result.data.address;
                            self.singleData.ship2_add = "";
                        }
                    }

                    self.singleDataTemp = self.singleData;
                    self.initOrderSelect();
                }
                else {
                    alert(result.error);
                }
            });
        },

        /**
         * 訂單格式 Select Change Event
         */
        orderFormatVerify: function () {
            if (!this.createStatus) {
                return;
            }
            if (_.isUndefined(this.singleData.format_sta) || this.singleData.format_sta == "") {
                return;
            }
            if (_.isUndefined(this.singleData.cust_cod) || this.singleData.cust_cod == "") {
                return;
            }

            var self = this;

            //取order_time
            _.each(self.orderSelectData, function (value, index) {
                if (value.format_sta == self.singleData.format_sta) {
                    self.singleData.order_time = value.order_time;
                }
            });

            //檢查可否選用訂單格式，看『可否選用訂單格式sql』
            var lo_params = {
                func: "chkFormatSta",
                singleData: self.singleData
            };

            BacUtils.doHttpPostAgent("/api/getQueryResult", lo_params, function (result) {
                self.isLoading = false;
                if (!_.isUndefined(result.data)) {
                    if (result.error) {
                        alert(result.data.errorMsg);
                    }
                    //檢查有過
                    else {
                        //特殊三種情況不檔, 但要Show訊息
                        if (!_.isUndefined(result.data.errorMsg)) {
                            alert(result.data.errorMsg);
                        }

                        if (self.singleData.order_time != null && self.singleData.order_time.trim().substr(0, 1) == "P") {
                            self.singleData.order_sta = "N";
                        }
                        else {
                            self.singleData.order_sta = "C";
                        }

                        //Call貨品API
                        self.callOrderAPI();
                    }
                } else {
                    alert(result.data.errorMsg);
                }
            });
        },

        /**
         * 修改按鈕 Event
         */
        editData: function () {
            this.buttonCase = "edit";
            this.doRowLock();
        },

        /**
         * 刪除按鈕 Event
         */
        deleteData: function () {
            this.buttonCase = "delete";
            this.doRowLock();
        },

        /**
         * 核准 Event
         */
        approved: function () {
            this.buttonCase = "approved";
            this.doRowLock();
        },

        /**
         * 取消核准 Event
         */
        cancel: function () {
            this.buttonCase = "cancel";
            this.doRowLock();
        },

        /**
         * 儲存按鈕 Event
         */
        save: function () {
            var self = this;

            if (!self.dgInsDT.endEditing()) {
                alert("貨品明細尚未完成");
                return;
            }

            if (_.isUndefined(self.singleData.format_sta) || self.singleData.format_sta == "") {
                alert("請選擇訂單格式");
                return;
            }

            if (_.isUndefined(self.singleData.atten_nam) || self.singleData.atten_nam == "") {
                alert("請輸入員工姓名");
                return;
            }

            //region//組資料

            self.singleData.order_amt = 0;
            self.singleData.order_tax = 0;

            _.each(self.singleDataGridRows, function (value, index) {
                value.order_nos = self.singleData.order_nos;
                value.disc_rat = 0;
                value.gift_flag = 'N';
                value.trans_nos = '';
                value.trans_typ = '';

                value.sorder_amt = go_MathTool.formatFloat(value.sale_amt * Number(value.item_qnt), self.ship_dt_round_nos) || 0; // 小計 = 售價 * 數量(訂購量) (取單據明細小計小數位數)
                value.sorder_tax = go_MathTool.formatFloat(value.sorder_amt * value.tax_rat, 2) || 0; // 稅額 = 小計 * 稅率 (取小數第二位)
                value.remain_qnt = Number(value.item_qnt) * value.unit_nos || 0; // 未出貨量 = 數量(訂購量) * 單位轉換率

                self.singleData.order_amt += value.sorder_amt;
                self.singleData.order_tax += value.sorder_tax;
            });

            var lf_temp_amt = self.singleData.order_amt;
            var lf_temp_tax = self.singleData.order_tax;

            self.singleData.order_amt = go_MathTool.formatFloat(self.singleData.order_amt, self.ship_mn_round_nos) || 0;
            self.singleData.order_tax = go_MathTool.formatFloat(self.singleData.order_tax, self.ship_mn_round_nos) || 0;
            self.singleData.order_tot = self.singleData.order_amt + self.singleData.order_tax;

            var lf_div_amt = self.singleData.order_amt - lf_temp_amt;
            var lf_div_tax = self.singleData.order_tax - lf_temp_tax;

            //找最後一筆有稅額的明細
            var index = _.findLastIndex(this.singleDataGridRows, function (value) {
                return parseFloat(value.sorder_tax) != 0;
            });

            if (index != -1) {
                self.singleDataGridRows[index].sorder_amt = go_MathTool.formatFloat(self.singleDataGridRows[index].sorder_amt + lf_div_amt, self.ship_dt_round_nos);
                self.singleDataGridRows[index].sorder_tax = go_MathTool.formatFloat(self.singleDataGridRows[index].sorder_tax + lf_div_tax, 2);
            }

            //endregion

            if (self.singleData.order_sta == "C") {
                self.singleData.cnfirm_cod = self.userid;
                self.singleData.cnfirm_dat = moment().format('YYYY/MM/DD HH:mm:ss');
            }

            self.singleData.ins_usr = self.userid;
            self.singleData.upd_usr = self.userid;
            self.singleData.ins_dat = moment().format('YYYY/MM/DD HH:mm:ss');
            self.singleData.upd_dat = moment().format('YYYY/MM/DD HH:mm:ss');

            var prg_id;
            if (self.createStatus) {
                prg_id = "PSIW5100300520";
            }
            else {
                prg_id = "PSIW5100300540";
            }

            this.callSaveAPI(prg_id, function (data) {

                if (self.createStatus) { //新增狀態，多筆重撈
                    self.singleData.order_nos = data.order_nos;
                    self.loadDataGrid();
                    self.fetchSingleData(self.singleData.order_nos);
                }
                else { //修改狀態，單筆重撈
                    self.fetchSingleData(self.singleData.order_nos);
                    self.doRowUnLock();
                }
                self.createStatus = false;
                self.editStatus = false;

                //region//修改UI狀態
                self.isModificable = false;
                self.isModificableFormat = false;

                self.addEnable = true;
                self.editEnable = true;
                self.deleteEnable = true;
                self.cnfirmEnable = true;
                self.cancelEnable = true;
                self.saveEnable = false;
                self.dropEnable = false;
                self.printEnable = true;
                //endregion
            });
        },

        /**
         * 按放棄按鈕 Event
         */
        drop: function () {
            var self = this;
            //新增，清空頁面資料
            if (self.createStatus) {
                self.singleData = {};
                self.singleDataGridRows = [];
                self.orderSelectData = [];
                self.dgInsDT.loadDgData(this.singleDataGridRows);

                //region//修改UI狀態
                self.isModificable = false;
                self.isModificableFormat = false;

                self.addEnable = true;
                self.editEnable = false;
                self.deleteEnable = false;
                self.cnfirmEnable = false;
                self.cancelEnable = false;
                self.saveEnable = false;
                self.dropEnable = false;
                self.printEnable = false;

                //endregion

                self.createStatus = false;
                self.editStatus = false;
            }
            //修改
            else {
                self.ModifyDrop();
            }
        },

        /**
         * 放棄修改
         */
        ModifyDrop: function () {

            //修改狀態才需要打API
            if (this.editStatus) {

                //無order_nos不做
                if (_.isUndefined(this.singleData.order_nos) || this.singleData.order_nos === null || this.singleData.order_nos === "") {
                    return;
                }

                var self = this;
                self.callAPI('PSIW5100302010', function () {
                    self.singleData = self.oriSingleData;
                    self.dgInsDT.loadDgData(self.oriSingleDataGridRows);

                    //region//修改UI狀態

                    self.isModificable = false;
                    self.isModificableFormat = false;

                    self.addEnable = true;
                    self.editEnable = true;
                    self.deleteEnable = true;
                    self.cnfirmEnable = true;
                    self.cancelEnable = true;
                    self.saveEnable = false;
                    self.dropEnable = false;
                    self.printEnable = true;

                    //endregion

                    self.createStatus = false;
                    self.editStatus = false;

                    self.doRowUnLock();
                });
            }
        },

        /**
         * Event after RowLock
         */
        buttonAfterLockDoFunc: function () {
            var self = this;
            switch (self.buttonCase) {
                case "edit":
                    self.callAPI('PSIW5100300400', function () {
                        self.editStatus = true;

                        //region//修改UI狀態
                        self.isModificable = true;
                        self.isModificableFormat = false;

                        self.addEnable = false;
                        self.editEnable = false;
                        self.deleteEnable = false;
                        self.cnfirmEnable = false;
                        self.cancelEnable = false;
                        self.saveEnable = true;
                        self.dropEnable = true;
                        self.printEnable = false;

                        //endregion
                    });
                    break;
                case "delete":
                    self.callAPI('PSIW5100300530', function () {
                        alert('刪除成功!');
                        self.loadDataGrid();
                        self.singleData = {};
                        self.singleDataGridRows = [];
                        self.orderSelectData = [];
                        self.dgInsDT.loadDgData(self.singleDataGridRows);

                        //region//修改UI狀態

                        self.isModificable = false;
                        self.isModificableFormat = false;

                        self.addEnable = true;
                        self.editEnable = false;
                        self.deleteEnable = false;
                        self.cnfirmEnable = false;
                        self.cancelEnable = false;
                        self.saveEnable = false;
                        self.dropEnable = false;
                        self.printEnable = false;

                        //endregion

                        self.createStatus = false;
                        self.editStatus = false;

                        self.doRowUnLock();
                    });
                    break;
                case "approved":
                    self.callAPI('PSIW5100301010', function () {
                        alert('核准成功!');
                        self.fetchSingleData(self.singleData.order_nos);
                        self.doRowUnLock();
                    });
                    break;
                case "cancel":
                    self.callAPI('PSIW5100301020', function () {
                        alert('取消核准成功!');
                        self.fetchSingleData(self.singleData.order_nos);
                        self.doRowUnLock();
                    });
                    break;
            }
        },

        /**
         * 空白訂貨表單下載按鈕
         */
        orderSearch: function () {
            var self = this;
            var dialog = $("#PSIW510030-down").removeClass('hide').dialog({
                modal: true,
                title: "空白訂貨表單下載",
                title_html: true,
                width: 500,
                maxwidth: 1920,
                dialogClass: "test",
                resizable: true
            });

        },

        /**
         * 空白訂單下拉 Event
         */
        orderSelectOnChange: function () {

            var self = this;

            //取得貨品資料
            var lo_params = {
                func: "getGoodsData",
                select_format_sta: self.select_format_sta
            };
            BacUtils.doHttpPostAgent("/api/getQueryResult", lo_params, function (result) {
                self.isLoading = false;

                if (result.error != null) {
                    alert(result.error);
                }
                else {
                    self.order_data = [];
                    var li_page_num = 0;
                    var temp = [];

                    for (var i = 0; i < result.data.length; i++) {
                        //30 = 一頁幾筆明細
                        if (i % 60 == 0) {
                            self.order_data.push(temp);
                            li_page_num += 1;
                            temp = [];
                        }
                        temp.push(result.data[i]);

                        if (i == result.data.length - 1) {
                            self.order_data.push(temp);
                        }
                    }
                    self.pageNum = li_page_num;

                    //取quote_rmk, order_time
                    _.each(self.allOrderSelectData, function (value, index) {
                        if (value.format_sta == self.select_format_sta) {
                            self.select_quote_rmk = value.quote_rmk + '-空白訂單下載' || '';
                            self.select_order_time = value.order_time || '';
                        }
                    });
                }
            });
        },

        /**
         * call Save API
         * @param trans_cod {String}
         * @param callback {Function}
         */
        callSaveAPI: function (trans_cod, callback) {
            var self = this;

            self.isLoading = true;
            var lo_params = {
                REVE_CODE: trans_cod,
                prg_id: prg_id,
                singleData: self.singleData,
                singleDataGridRows: self.singleDataGridRows
            };

            BacUtils.doHttpPostAgent("/api/callSaveAPI", lo_params, function (result) {
                self.isLoading = false;
                if (result.success) {
                    alert('儲存成功!');
                    callback(result.data);
                }
                if (result.errorMsg != "") {
                    alert(result.errorMsg);
                }
            });
        },

        /**
         * call API
         * @param trans_cod {String}
         * @param callback {Function}
         */
        callAPI: function (trans_cod, callback) {

            var self = this;
            self.isLoading = true;

            var lo_params = {
                REVE_CODE: trans_cod,
                prg_id: prg_id,
                order_nos: self.singleData.order_nos
            };

            BacUtils.doHttpPostAgent("/api/callAPI", lo_params, function (result) {
                self.isLoading = false;
                if (result.success) {
                    callback();
                }

                if (!_.isUndefined(result.errorMsg) && result.errorMsg != "") {
                    alert(result.errorMsg);
                }
            });
        },

        /**
         * call 貨品 API
         */
        callOrderAPI: function () {

            var self = this;
            self.isLoading = true;
            var lo_params = {
                REVE_CODE: "PSIW5100302020",
                singleData: self.singleData
            };

            BacUtils.doHttpPostAgent("/api/callOrderAPI", lo_params, function (result) {
                self.isLoading = false;

                if (result.success) {
                    self.singleDataGridRows = result.data.psi_tmp_order_dt.tmp_order_dt;

                    //轉格式和防空白
                    _.each(self.singleDataGridRows, function (value) {
                        if (value.ship_dat == null) {
                            value.ship_dat = self.singleData.ship_dat;
                        }
                        else {
                            value.ship_dat = moment(value.ship_dat).format('YYYY/MM/DD');
                        }
                        if (value.nship_dat == null) {
                            value.nship_dat = self.singleData.ship_dat;
                        }
                        else {
                            value.nship_dat = moment(value.nship_dat).format('YYYY/MM/DD');
                        }

                        value.stock_unit = value.stock_unit.trim();
                        value.unit_typ = value.unit_typ.trim();

                        //小數欄位format
                        value.item_qnt = go_MathTool.formatFloat(value.item_qnt, 0); //客戶要求訂購量整數
                        value.order_qnt = go_MathTool.formatFloat(value.order_qnt, self.dataPointRound).toFixed(self.dataPointRound);
                        value.thu_qty = go_MathTool.formatFloat(value.thu_qty, self.dataPointRound).toFixed(self.dataPointRound);
                        value.stock_qnt = go_MathTool.formatFloat(value.stock_qnt, self.dataPointRound).toFixed(self.dataPointRound);
                    });

                    self.dgInsDT.loadDgData(self.singleDataGridRows);
                }
                if (result.errorMsg != "") {
                    alert(result.errorMsg);
                }
            });

        },

        //tempExecData
        tempExecData: function (row) {
        },

        /**
         * RowLock
         */
        doRowLock: function () {
            var lo_param = {
                prg_id: prg_id,
                table_name: this.userInfo.cmp_id + this.singleData.order_nos,
                lock_type: "R",
                key_cod: "psi_quote_mn"
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

        /**
         * ChangeLog
         */
        loadChangeLog: function () {
            var self = this;
            self.openChangeLogDialog = true;
            BacUtils.doHttpPostAgent("/api/getSetupPrgChangeLog", {prg_id: prg_id}, function (result) {
                self.allChangeLogList = result.allChangeLogList;
                self.allChangeLogList = _.filter(result.allChangeLogList, function (data) {
                    var order_nos = _.find(data.desc_mn, function (field) {
                        return field.field_name.trim() == "order_nos";
                    });
                    return _.isEqual(self.singleData.order_nos, order_nos.newVal);
                });
            });
        }
    }

});

BacchusMainVM.setPrgVueIns(PSIW510030);
BacchusMainVM.setLeaveAfterExecFuncsNam(["ModifyDrop"]);

var adpterDg = new DatagridAdapter(PSIW510030);

//region//套件

//監測div寬度套件
(function ($, window, undefined) {
    '$:nomunge'; // Used by YUI compressor.

    // A jQuery object containing all non-window elements to which the resize
    // event is bound.
    var elems = $([]),

        // Extend $.resize if it already exists, otherwise create it.
        jq_resize = $.resize = $.extend($.resize, {}),

        timeout_id,

        // Reused strings.
        str_setTimeout = 'setTimeout',
        str_resize = 'resize',
        str_data = str_resize + '-special-event',
        str_delay = 'delay',
        str_throttle = 'throttleWindow';

    // Property: jQuery.resize.delay
    //
    // The numeric interval (in milliseconds) at which the resize event polling
    // loop executes. Defaults to 250.

    jq_resize[str_delay] = 250;

    // Property: jQuery.resize.throttleWindow
    //
    // Throttle the native window object resize event to fire no more than once
    // every <jQuery.resize.delay> milliseconds. Defaults to true.
    //
    // Because the window object has its own resize event, it doesn't need to be
    // provided by this plugin, and its execution can be left entirely up to the
    // browser. However, since certain browsers fire the resize event continuously
    // while others do not, enabling this will throttle the window resize event,
    // making event behavior consistent across all elements in all browsers.
    //
    // While setting this property to false will disable window object resize
    // event throttling, please note that this property must be changed before any
    // window object resize event callbacks are bound.

    jq_resize[str_throttle] = true;

    // Event: resize event
    //
    // Fired when an element's width or height changes. Because browsers only
    // provide this event for the window element, for other elements a polling
    // loop is initialized, running every <jQuery.resize.delay> milliseconds
    // to see if elements' dimensions have changed. You may bind with either
    // .resize( fn ) or .bind( "resize", fn ), and unbind with .unbind( "resize" ).
    //
    // Usage:
    //
    // > jQuery('selector').bind( 'resize', function(e) {
    // >   // element's width or height has changed!
    // >   ...
    // > });
    //
    // Additional Notes:
    //
    // * The polling loop is not created until at least one callback is actually
    //   bound to the 'resize' event, and this single polling loop is shared
    //   across all elements.
    //
    // Double firing issue in jQuery 1.3.2:
    //
    // While this plugin works in jQuery 1.3.2, if an element's event callbacks
    // are manually triggered via .trigger( 'resize' ) or .resize() those
    // callbacks may double-fire, due to limitations in the jQuery 1.3.2 special
    // events system. This is not an issue when using jQuery 1.4+.
    //
    // > // While this works in jQuery 1.4+
    // > $(elem).css({ width: new_w, height: new_h }).resize();
    // >
    // > // In jQuery 1.3.2, you need to do this:
    // > var elem = $(elem);
    // > elem.css({ width: new_w, height: new_h });
    // > elem.data( 'resize-special-event', { width: elem.width(), height: elem.height() } );
    // > elem.resize();

    $.event.special[str_resize] = {

        // Called only when the first 'resize' event callback is bound per element.
        setup: function () {
            // Since window has its own native 'resize' event, return false so that
            // jQuery will bind the event using DOM methods. Since only 'window'
            // objects have a .setTimeout method, this should be a sufficient test.
            // Unless, of course, we're throttling the 'resize' event for window.
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }

            var elem = $(this);

            // Add this element to the list of internal elements to monitor.
            elems = elems.add(elem);

            // Initialize data store on the element.
            $.data(this, str_data, {w: elem.width(), h: elem.height()});

            // If this is the first element added, start the polling loop.
            if (elems.length === 1) {
                loopy();
            }
        },

        // Called only when the last 'resize' event callback is unbound per element.
        teardown: function () {
            // Since window has its own native 'resize' event, return false so that
            // jQuery will unbind the event using DOM methods. Since only 'window'
            // objects have a .setTimeout method, this should be a sufficient test.
            // Unless, of course, we're throttling the 'resize' event for window.
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }

            var elem = $(this);

            // Remove this element from the list of internal elements to monitor.
            elems = elems.not(elem);

            // Remove any data stored on the element.
            elem.removeData(str_data);

            // If this is the last element removed, stop the polling loop.
            if (!elems.length) {
                clearTimeout(timeout_id);
            }
        },

        // Called every time a 'resize' event callback is bound per element (new in
        // jQuery 1.4).
        add: function (handleObj) {
            // Since window has its own native 'resize' event, return false so that
            // jQuery doesn't modify the event object. Unless, of course, we're
            // throttling the 'resize' event for window.
            if (!jq_resize[str_throttle] && this[str_setTimeout]) {
                return false;
            }

            var old_handler;

            // The new_handler function is executed every time the event is triggered.
            // This is used to update the internal element data store with the width
            // and height when the event is triggered manually, to avoid double-firing
            // of the event callback. See the "Double firing issue in jQuery 1.3.2"
            // comments above for more information.

            function new_handler(e, w, h) {
                var elem = $(this),
                    data = $.data(this, str_data);

                // If called from the polling loop, w and h will be passed in as
                // arguments. If called manually, via .trigger( 'resize' ) or .resize(),
                // those values will need to be computed.
                data.w = w !== undefined ? w : elem.width();
                data.h = h !== undefined ? h : elem.height();

                old_handler.apply(this, arguments);
            }

            // This may seem a little complicated, but it normalizes the special event
            // .add method between jQuery 1.4/1.4.1 and 1.4.2+
            if ($.isFunction(handleObj)) {
                // 1.4, 1.4.1
                old_handler = handleObj;
                return new_handler;
            } else {
                // 1.4.2+
                old_handler = handleObj.handler;
                handleObj.handler = new_handler;
            }
        }

    };

    function loopy() {

        // Start the polling loop, asynchronously.
        timeout_id = window[str_setTimeout](function () {

            // Iterate over all elements to which the 'resize' event is bound.
            elems.each(function () {
                var elem = $(this),
                    width = elem.width(),
                    height = elem.height(),
                    data = $.data(this, str_data);

                // If element size has changed since the last time, update the element
                // data store and trigger the 'resize' event.
                if (width !== data.w || height !== data.h) {
                    elem.trigger(str_resize, [data.w = width, data.h = height]);
                }

            });

            // Loop.
            loopy();

        }, jq_resize[str_delay]);

    }

})(jQuery, this);

//啟動拖拉
$(".dominos-inventory-left").resizable({
    handleSelector: ".splitter",
    resizeHeight: false
});

//右邊被拉小時，維持右邊欄位版面整齊
$('.dominos-inventory-right').resize(function () {
    var elem = $(this);
    var inventoryRightW = elem.width();

    if (inventoryRightW < 750) {
        $(".order-down").css("float", "none");
    } else {
        $(".order-down").css("float", "right");
    }

    if (inventoryRightW < 614) {
        $(".w510px").css("margin-left", "92px");
    } else {
        $(".w510px").css("margin-left", "0");
    }

    if (inventoryRightW < 611) {
        $(".address-second").css("margin-left", "93px");
        $(".input-second-2").css("margin-left", "93px");
    } else {
        $(".address-second").css("margin-left", "0");
        $(".input-second-2").css("margin-left", "0");
    }

    if (inventoryRightW < 355) {
        $(".address-frist").css("margin-left", "93px");
    } else {
        $(".address-frist").css("margin-left", "0");
    }

    if (inventoryRightW < 306) {
        $(".w510px").css("margin-left", "0");
        $(".address-frist").css("margin-left", "0");
        $(".input-second-2").css("margin-left", "0");
        $(".address-second").css("margin-left", "0");
        $(".w510px").css("margin-left", "0");
    }
});

//endregion