/**
 * Created by a16009 on 2017/10/11.
 * 程式編號: PSIW500030
 * 程式名稱: 門市WEB訂單作業
 */

var prg_id = $("#prg_id").val();

var go_userid;  //員工編號

//多筆
/** DatagridRmSingleGridClass ***/
function DatagridRmSingleGridClass() {
}

DatagridRmSingleGridClass.prototype = new DatagridBaseClass();
DatagridRmSingleGridClass.prototype.onClickCell = function (idx, row) {};

DatagridRmSingleGridClass.prototype.onClickRow = function (idx, row) {
    if(!PSIW500030.createStatus && !PSIW500030.editStatus) {
        PSIW500030.fetchSingleData(row);

        //region//修改UI狀態
        PSIW500030.isModificable = false;
        PSIW500030.isModificableFormat = false;

        PSIW500030.addEnable = true;
        PSIW500030.editEnable = true;
        PSIW500030.deleteEnable = true;
        PSIW500030.cnfirmEnable = true;
        PSIW500030.cancelEnable = true;
        PSIW500030.saveEnable = false;
        PSIW500030.dropEnable = false;
        PSIW500030.downloadEnable = true;

        //endregion
    }
    else {
        //提醒是否儲存目前資料
    }

    // vm.editingRow = row;
    // vm.editStatus = true;
    // vm.fetchSingleData(row, function (success) {
    //     vm.showSingleGridDialog();
    //});
};
/*** Class End  ***/

//DT
/** DatagridRmSingleGridClass ***/
function SingleDatagridDT() {
}

SingleDatagridDT.prototype = new DatagridBaseClass();
SingleDatagridDT.prototype.onClickCell = function (idx, row) {};

SingleDatagridDT.prototype.onClickRow = function (idx, row) {
    console.log(row);
    //PSIW500030.fetchSingleData(row);
    //撈select data


    // vm.editingRow = row;
    // vm.editStatus = true;
    // vm.fetchSingleData(row, function (success) {
    //     vm.showSingleGridDialog();
    //});
};
/*** Class End  ***/

var PSIW500030 = new Vue({
    el: '#MainApp',
    mounted: function () {
        if(this.verify()){
            this.initTmpCUD();
            this.fetchUserInfo();
            this.loadDataGrid();
            this.initCustSelect();
        }else{
            //導回首頁
        }
    },
    data: {
        createStatus: false,    //新增狀態
        editStatus: false,      //編輯狀態
        deleteStatus: false,    //刪除狀態

        isModificable: false,   //決定是否可以修改資料
        isModificableFormat:false,  //決定是否可以修改訂單格式

        addEnable: true,
        editEnable: false,
        deleteEnable: false,
        cnfirmEnable: false,
        cancelEnable: false,
        saveEnable: false,
        dropEnable: false,
        downloadEnable: false,

        pageOneDataGridRows: [],//page_id 1 的 datagrid資料
        pageOneFieldData: [],   //page_id 1 datagird欄位
        pageTwoFieldData: [],   //page_id 2 欄位
        oriPageTwoFieldData: [],   //page_id 2 原始欄位資料
        pageTwoDataGridFieldData: [],   //page_id 2 datagird欄位
        pageTwoDataGridDTRows: [],//page_id 2 的 DT資料
        oripageTwoDataGridDTRows: [], //page_id 2 的 DT2原始資料
        pageTwoDTFieldData: [],   //page_id 2 DT欄位
        editingRow: {},         //編輯中的資料
        userInfo: {},            //登入的使用者資料
        tmpCud: {               //新刪修暫存
            createData: [],
            editData: [],
            deleteData: [],
            dt_createData: [],
            dt_editData: [],
            dt_deleteData: []
        },
        originData: {},         //原始資料
        singleData: {},         //單檔資訊
        singleDataTemp: {},     //單檔資訊暫存

        custSelectData:[],      //客戶代號下拉
        orderSelectData:[],     //訂單格式下拉
        statusSelectData:[{value:'N', display:'N:待核'}, {value:'C', display:'C:核准'}, {value:'O', display:'O:出貨中'}, {value:'S', display:'S:結清'}, {value:'H', display:'H:保留'}, {value:'X', display:'X:出貨完畢'}],    //狀態下拉

        dgIns: {},
        dgInsDT :{},
        labelPosition: 'right',
        searchFields: [], //搜尋的欄位
        searchCond: {},   //搜尋條件

        //系統參數
        order_dat_change_time:""    //訂貨日期切換的時間參數
    },
    methods: {

        //驗證人員編號
        verify: function() {
            return true;    //暫時
            var lo_check = false;

            while(true) {
                if(str = prompt("請輸入員工編號","")) {
                    if(str.trim().length != 8){
                        alert("員工編號應為8碼!");
                        continue;
                    }
                    else{
                        go_userid = str.trim();
                        lo_check = true;
                    }
                }
                break;
            }

            return(lo_check);

        },

        //Init CUD
        initTmpCUD: function () {
            this.tmpCud = {
                createData: [],
                editData: [],
                deleteData: [],
                dt_createData: [],
                dt_editData: [],
                dt_deleteData: []
            };
        },

        //取得使用者資料
        fetchUserInfo: function () {
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    PSIW500030.userInfo = result.userInfo;
                }
            });
        },

        //tempExecData
        tempExecData: function(row){

        },

        //組多筆的欄位
        bindingFieldData: function () {
            var lo_fieldData = [
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "order_nos",
                    ui_type : "text",
                    ui_field_length : 20,
                    ui_field_num_point : 0,
                    col_seq : 0,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_mn",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"訂單編號"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "sales_cod",
                    ui_type : "text",
                    ui_field_length : 20,
                    ui_field_num_point : 0,
                    col_seq : 1,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_mn",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"員工編號"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "order_dat",
                    ui_type : "date",
                    ui_field_length : 20,
                    ui_field_num_point : 0,
                    col_seq : 2,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_mn",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"訂單日期"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "ship_dat",
                    ui_type : "date",
                    ui_field_length : 20,
                    ui_field_num_point : 0,
                    col_seq : 3,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_mn",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"交貨日期"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "order_sta",
                    ui_type : "text",
                    ui_field_length : 1,
                    ui_field_num_point : 0,
                    col_seq : 4,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_mn",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"狀態"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "format_sta",
                    ui_type : "text",
                    ui_field_length : 4,
                    ui_field_num_point : 0,
                    col_seq : 5,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_mn",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"訂單格式"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "show_cod",
                    ui_type : "text",
                    ui_field_length : 20,
                    ui_field_num_point : 0,
                    col_seq : 6,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_mn",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"客戶代號"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "cust_nam",
                    ui_type : "text",
                    ui_field_length : 20,
                    ui_field_num_point : 0,
                    col_seq : 7,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_mn",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"客戶名稱"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "order_rmk",
                    ui_type : "text",
                    ui_field_length : 20,
                    ui_field_num_point : 0,
                    col_seq : 8,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_mn",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"訂單備註"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "ins_usr",
                    ui_type : "text",
                    ui_field_length : 10,
                    ui_field_num_point : 0,
                    col_seq : 9,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_mn",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"輸入者"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "upd_usr",
                    ui_type : "text",
                    ui_field_length : 10,
                    ui_field_num_point : 0,
                    col_seq : 10,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_mn",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"異動者"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "cnfirm_cod",
                    ui_type : "text",
                    ui_field_length : 10,
                    ui_field_num_point : 0,
                    col_seq : 11,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_mn",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"核准者"
                },
            ];
            return lo_fieldData;
        },

        //組單筆的DT欄位
        bindingDTFieldData: function () {
            var lo_fieldData = [
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "order_ser",
                    ui_type : "number",
                    ui_field_length : 5,
                    ui_field_num_point : 0,
                    col_seq : 0,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_dt",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"序號"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "goods_cod",
                    ui_type : "text",
                    ui_field_length : 15,
                    ui_field_num_point : 0,
                    col_seq : 1,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_dt",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"貨號"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "describe",
                    ui_type : "text",
                    ui_field_length : 20,
                    ui_field_num_point : 0,
                    col_seq : 2,
                    width : 100,
                    visiable : "Y",
                    modificable : "Y",
                    requirable : "Y",
                    grid_field_name : "psi_quote_dt",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"貨品描述"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "unit_typ",
                    ui_type : "text",
                    ui_field_length : 4,
                    ui_field_num_point : 0,
                    col_seq : 3,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_dt",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"單位"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "stock_qnt",
                    ui_type : "text",
                    ui_field_length : 1,
                    ui_field_num_point : 0,
                    col_seq : 4,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_dt",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"庫存量"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "order_qnt",
                    ui_type : "number",
                    ui_field_length : 15,
                    ui_field_num_point : 3,
                    col_seq : 5,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_dt",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"建議訂購量"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "item_qnt",
                    ui_type : "number",
                    ui_field_length : 15,
                    ui_field_num_point : 3,
                    col_seq : 6,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_dt",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"訂購量"
                },
                {
                    athena_id : "",
                    user_id : "",
                    prg_id : "PSIW500030",
                    ui_field_name : "order_rmk",
                    ui_type : "text",
                    ui_field_length : 100,
                    ui_field_num_point : 0,
                    col_seq : 7,
                    width : 100,
                    visiable : "Y",
                    modificable : "N",
                    requirable : "Y",
                    grid_field_name : "psi_quote_dt",
                    keyable : "",
                    format_func_name : "",
                    rule_func_name : "",
                    user_athena_id : "",
                    multi_lang_table : "",
                    page_id : 1,
                    ui_display_name:"備註"
                }
            ];
            return lo_fieldData;
        },

        //抓取多筆資料
        loadDataGrid: function () {

            var lo_params = {
                func : "getDataGridRows"
            };
            var self = this;
            //撈多筆資料
            $.post("/api/getQueryResult", lo_params, function (result) {
                if (!_.isUndefined(result.data)) {
                    self.pageOneDataGridRows = result.data;
                    self.pageOneFieldData = self.bindingFieldData();
                    self.dgIns = new DatagridRmSingleGridClass();
                    self.dgIns.init(prg_id, 'PSIW500030_dg', EZfieldClass.combineFieldOption(self.pageOneFieldData, 'PSIW500030_dg'));
                    self.dgIns.loadDgData(self.pageOneDataGridRows);

                    self.pageTwoDTFieldData = self.bindingDTFieldData();    //組DT欄位
                    self.dgInsDT = new SingleDatagridDT();
                    self.dgInsDT.init(prg_id, 'PSIW500030_dt', EZfieldClass.combineFieldOption(self.pageTwoDTFieldData, 'PSIW500030_dt'));
                } else {
                    alert(result.error.errorMsg);
                }
            });
        },

        //取得單筆資料
        fetchSingleData: function (editingRow, callback) {

            //撈單筆MN
            var lo_params = {
                func : "getSingleDataMN",
                postData: editingRow
            };
            var self = this;
            waitingDialog.show('Loading...');
            $.post("/api/getQueryResult", lo_params, function (result) {

                if (!_.isUndefined(result.data)) {

                    self.singleDataTemp = result.data;

                    self.singleDataTemp.order_dat = moment(new Date(self.singleDataTemp.order_dat)).format("YYYY-MM-DD");
                    self.singleDataTemp.ship_dat = moment(new Date(self.singleDataTemp.ship_dat)).format("YYYY/MM/DD");

                    self.singleDataTemp.ins_dat = moment(new Date(self.singleDataTemp.ins_dat)).format("YYYY/MM/DD HH:mm:ss");
                    self.singleDataTemp.upd_dat = moment(new Date(self.singleDataTemp.upd_dat)).format("YYYY/MM/DD HH:mm:ss");
                    self.singleDataTemp.cnfirm_dat = moment(new Date(self.singleDataTemp.cnfirm_dat)).format("YYYY/MM/DD HH:mm:ss");

                    self.oriSingleData = _.clone(self.singleDataTemp);
                    self.initOrderSelect();

                } else {
                    alert(result.error.errorMsg);
                }
            });

            //撈單筆DT
            lo_params = {
                func : "getSingleDataDT",
                postData: editingRow
            };
            $.post("/api/getQueryResult", lo_params, function (result) {
                waitingDialog.hide();
                if (!_.isUndefined(result.data)) {
                    self.pageTwoDataGridDTRows = result.data;
                    self.dgInsDT.loadDgData(self.pageTwoDataGridDTRows);

                    //保留原始資料, 供放棄使用
                    self.oripageTwoDataGridDTRows = _.clone(self.pageTwoDataGridDTRows);
                } else {
                    alert(result.error.errorMsg);
                }
            });
        },

        //按新增按鈕
        addData: function() {
            var self = this;
            //取系統參數
            var lo_params = {
                func : "getSystemParam",
                paramName: "order_dat_change_time"
            };
            $.post("/api/getQueryResult", lo_params, function (result) {
                if (!_.isUndefined(result.data)) {
                    self.order_dat_change_time = result.data;
                    self.defaultValue();

                    self.createStatus = true;

                    //region//修改UI狀態
                    self.isModificable = true;
                    self.isModificableFormat = true;

                    self.addEnable = false;
                    self.editEnable = false;
                    self.deleteEnable = false;
                    self.cnfirmEnable = false;
                    self.cancelEnable = false;
                    self.saveEnable = true;
                    self.dropEnable = true;
                    self.downloadEnable = false;

                    //endregion
                } else {
                    alert(result.error.errorMsg);
                }
            });
        },

        //新增資料預設值
        defaultValue: function() {
            
            //region //塞預設值

            //初始化主檔MN

            // TODO:Session如何取
            //this.singleData.comp_cod = Session.user.comp_id;
            this.singleData.order_nos = "";
            //TODO: 訂單時間要照系統參數判斷
            //if(moment(this.order_dat_change_time))
            //console.log(this.order_dat_change_time);

            this.singleData.order_dat = moment().format('YYYY-MM-DD');
            this.singleData.order_sta = "N";
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
            this.singleData.gen_cod = "S";
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
            this.singleData.doc_nos = "";   //TODO: 須詢問是API在入還是我要先call

            //Week 格式代號用
            var day;
            switch (new Date('2017/10/24').getDay()){
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
            this.pageTwoDataGridDTRows = [];
            this.dgInsDT.loadDgData(this.pageTwoDataGridDTRows);

            //endregion

            //如果客戶代號只有一種, 直接選定
            if(this.custSelectData.length == 1){
                this.singleData.cust_cod = this.custSelectData[0].cust_cod;
                this.singleData.cust_nam = this.custSelectData[0].cust_nam;
                this.custSelectChange();
            }

        },

        //初始化客戶代號下拉選單
        initCustSelect: function () {
            var self = this;
            var lo_params = {
                func : "getShowCodSelect"
            };
            waitingDialog.show('Loading...');
            $.post("/api/getQueryResult", lo_params, function (result) {
                waitingDialog.hide();
                if (!_.isUndefined(result.data)) {
                    //result.data.push({cust_cod:"123", show_cod:"321", cust_nam:"asd"});
                    self.custSelectData = result.data;
                } else {
                    alert(result.error.errorMsg);
                }
            });
        },

        //初始化訂單格式下拉選單
        initOrderSelect: function () {

            var self = this;
            //期別
            var lo_params = {
                func : "getPeriod",
                singleData : self.singleDataTemp
            };

            waitingDialog.show('Loading...');
            $.post("/api/getQueryResult", lo_params, function (result) {

                self.singleDataTemp.period_cod = result.data;
                //訂單格式
                var lo_params2 = {
                    func : "getFormatSta",
                    singleData : self.singleDataTemp
                };

                $.post("/api/getQueryResult", lo_params2, function (result) {
                    waitingDialog.hide();
                    if (!_.isUndefined(result.data)) {
                        self.orderSelectData = result.data;
                    } else {
                        alert(result.error.errorMsg);
                    }
                    self.singleData = self.singleDataTemp;
                });
            });
        },

        //按修改按鈕
        editData: function() {
            this.editStatus = true;

            //region//修改UI狀態
            this.isModificable = true;
            this.isModificableFormat = false;

            this.addEnable = false;
            this.editEnable = false;
            this.deleteEnable = false;
            this.cnfirmEnable = false;
            this.cancelEnable = false;
            this.saveEnable = true;
            this.dropEnable = true;
            this.downloadEnable = false;

            //endregion

            //TODO
            //call 『修改API』檢查資料可否修改,
            //如不能修改,則mndt畫面要readonly,儲存button不能按
            //如可修改『訂單格式』、『客戶代號』欄位改成readonly
        },

        //按刪除按鈕
        deleteData: function() {
            //TODO
            //在多筆刪除資料
            //組資料
            //call 『刪除API』
        },

        //核准
        approved: function() {
            //TODO
            //組資料
            //call『核准API』
            //接收回傳訊息更新狀態
        },

        //取消核准
        cancel: function() {
            //TODO
            //組資料
            //call『取消核准API』
            //接收回傳訊息更新狀態
        },

        //按儲存按鈕
        save: function() {
            //TODO
            //判斷是新增還是修改

            //將dt貨號空白的貨品清除,這些不需要透過API入到DB
            //主檔稅額與明細稅額合計的差異數，調到最後一筆計稅明細的稅額
            //換句話說『將差額調到psi_quote_dt.SORDER_TAX最後一筆有值的明細』

            //region//組資料



            //endreigon

            if(this.singleData.format_sta == "C"){
                this.singleData.cnfirm_cod = go_userid;
                this.singleData.cnfirm_dat = moment().format('MMMM/DD/YYYY hh:mm:ss');
            }

            this.singleData.ins_usr = go_userid;
            this.singleData.upd_usr = go_userid;
            this.singleData.ins_dat = moment().format('YYYY/MM/DD hh:mm:ss');
            this.singleData.upd_dat = moment().format('YYYY/MM/DD hh:mm:ss');

            console.log(this.singleData);

            var prg_id;
            if(this.createStatus) prg_id = "PSIW5100300520";
            else prg_id = "PSIW5100300540";

            this.callSaveAPI(prg_id);

            this.createStatus = false;
            this.editStatus = false;

            //region//修改UI狀態
            this.isModificable = false;
            this.isModificableFormat = false;

            this.addEnable = true;
            this.editEnable = false;
            this.deleteEnable = false;
            this.cnfirmEnable = false;
            this.cancelEnable = false;
            this.saveEnable = false;
            this.dropEnable = false;
            this.downloadEnable = false;

            //endregion
        },

        //按放棄按鈕
        drop: function() {
            //TODO

            //如果是新增情況下，需清空頁面資料
            if(this.createStatus){
                this.singleData = {};
                this.pageTwoDataGridDTRows = [];
                this.dgInsDT.loadDgData(this.pageTwoDataGridDTRows);

                //region//修改UI狀態
                this.isModificable = false;
                this.isModificableFormat = false;

                this.addEnable = true;
                this.editEnable = false;
                this.deleteEnable = false;
                this.cnfirmEnable = false;
                this.cancelEnable = false;
                this.saveEnable = false;
                this.dropEnable = false;
                this.downloadEnable = false;

                //endregion
            }
            //修改狀況
            else{
                this.singleData = this.oriSingleData;
                this.dgInsDT.loadDgData(this.oripageTwoDataGridDTRows);

                //region//修改UI狀態
                PSIW500030.isModificable = false;
                PSIW500030.isModificableFormat = false;

                PSIW500030.addEnable = true;
                PSIW500030.editEnable = true;
                PSIW500030.deleteEnable = true;
                PSIW500030.cnfirmEnable = true;
                PSIW500030.cancelEnable = true;
                PSIW500030.saveEnable = false;
                PSIW500030.dropEnable = false;
                PSIW500030.downloadEnable = true;

                //endregion
            }

            this.createStatus = false;
            this.editStatus = false;

            //改DB狀態
        },

        //客戶代號Change event
        custSelectChange: function () {
            if(_.isUndefined(this.singleData.cust_cod)) return;

            var self = this;

            //撈客戶名稱(cust_nam)
            _.each(this.custSelectData, function (value, index) {
                if(value.cust_cod == self.singleData.cust_cod){
                    self.singleData.cust_nam = value.cust_nam;
                }
            });

            async.parallel([
                //撈客戶資料(accunt_sta, accunt_nos, ship_typ, sales_cod)
                function(cb){

                    lo_params = {
                        func : "getCustInfo",
                        singleData: self.singleData
                    };
                    $.post("/api/getQueryResult", lo_params, function (result) {
                        if (!_.isUndefined(result.data)) {
                            self.singleData.accunt_sta = result.data.accunt_sta;
                            self.singleData.accunt_nos = result.data.accunt_nos;
                            self.singleData.ship_typ = result.data.ship_typ;
                            self.singleData.sales_cod = result.data.sales_cod;
                            cb(null, result.data);
                        }
                        else {
                            alert(result.error.errorMsg);
                            cb(result.error.errorMsg, "");
                        }
                    });
                },
                //撈送貨地點(ship1_Add, ship2_Add)
                function(cb){

                    lo_params = {
                        func : "getCustAdd",
                        singleData: self.singleData
                    };
                    $.post("/api/getQueryResult", lo_params, function (result) {
                        if (!_.isUndefined(result.data)) {
                            //不知道怎麼切
                            self.singleData.ship1_add = result.data;
                            cb(null, result.data);
                        } else {
                            alert(result.error.errorMsg);
                            cb(result.error.errorMsg, "");
                        }
                    });
                },
                //撈客戶電話(cust_tel)
                function(cb){

                    lo_params = {
                        func : "getCustContact",
                        singleData: self.singleData
                    }
                    $.post("/api/getQueryResult", lo_params, function (result) {
                        if (!_.isUndefined(result.data)) {
                            self.singleData.cust_tel = result.data;
                            cb(null, result.data);
                        } else {
                            alert(result.error.errorMsg);
                            cb(result.error.errorMsg, "");
                        }
                    });
                }
            ], function(err, result){
                if(!err) {
                    self.singleDataTemp = self.singleData;
                    self.initOrderSelect();
                }
            });
        },

        //訂單格式 (select change event)
        orderFormatVerify: function() {
            if(!this.createStatus) return;
            if(_.isUndefined(this.singleData.format_sta) || this.singleData.format_sta == "") return;
            if(_.isUndefined(this.singleData.cust_cod) || this.singleData.cust_cod == "") return;

            var self = this;

            //取order_time
            _.each(self.orderSelectData, function (value, index) {
                if(value.format_sta == self.singleData.format_sta){
                    self.singleData.order_time = value.order_time;
                }
            });

            //檢查可否選用訂單格式，看『可否選用訂單格式sql』
            var lo_params = {
                func : "chkFormatSta",
                singleData : self.singleData
            };

            $.post("/api/getQueryResult", lo_params, function (result) {
                waitingDialog.hide();
                if (!_.isUndefined(result.data)) {
                    if(result.error){
                        alert(result.data.errorMsg);
                    }
                    //檢查有過
                    else {
                        //畫面沒切換，待查原因
                        if(self.singleData.order_time != null && self.singleData.order_time.trim() == "PXW1")
                            self.singleData.order_sta = "C";
                        else
                            self.singleData.order_sta = "C";
                        // console.log(self.singleData.order_sta);

                        //通過檢查後call訂單格式API,回傳dt的貨品,依貨號當做dt的序號排序
                        //return;
                        self.callOrderAPI();
                    }
                } else {
                    alert(result.data.errorMsg);
                }
            });




        },

        //資料驗證
        dataValidate: function () {
            var self = this;
            var lo_chkResult;

            for (var i = 0; i < this.oriPageTwoFieldData.length; i++) {
                var lo_field = this.oriPageTwoFieldData[i];
                //必填
                if (lo_field.requirable == "Y" && lo_field.modificable == "Y") {
                    lo_chkResult = go_validateClass.required(self.singleData[lo_field.ui_field_name], lo_field.ui_display_name);
                    if (lo_chkResult.success == false) {
                        break;
                    }
                }

                //有format

                if (lo_field.format_func_name != "") {
                    lo_chkResult = go_validateClass[lo_field.format_func_name](self.singleData[lo_field.ui_field_name], lo_field.ui_display_name);
                    if (lo_chkResult.success == false) {
                        break;
                    }
                }
            }
            return lo_chkResult;

        },

        //call Save API
        callSaveAPI: function (prg_id) {

            var self = this;
            waitingDialog.show('Saving...');

            var lo_params = {
                REVE_CODE : prg_id,
                singleData: self.singleData,
                pageTwoDataGridDTRows: self.pageTwoDataGridDTRows
            };

            $.post("/api/callSaveAPI", lo_params, function (result) {
                waitingDialog.hide();
                if (result.success) {
                    //TODO:儲存後reload頁面
                    self.loadDataGrid(function (success) {
                        callback(success);
                    });
                    alert('save success!');
                } else {
                    alert(result.error.errorMsg);
                }

            });

        },

        //call API
        callAPI: function (prg_id) {

            var self = this;
            waitingDialog.show('Loading...');

            var lo_params = {
                REVE_CODE : prg_id,
                ORDER_NOS: this.singleData.order_nos
            };

            $.post("/api/callAPI", lo_params, function (result) {
                waitingDialog.hide();
                if (result) {
                    console.log(result);
                } else {
                    alert(result.error.errorMsg);
                    callback(result);
                }
            });

        },


        //call 貨品 API
        callOrderAPI: function () {

            var self = this;
            waitingDialog.show('Loading...');
            //var params = _.extend({prg_id: prg_id}, self.tmpCud); //留著儲存用
            var lo_params = {
                REVE_CODE : "PSIW5100302020",
                singleData: this.singleData
            };

            $.post("/api/callOrderAPI", lo_params, function (result) {
                waitingDialog.hide();
                if (result) {
                    self.pageTwoDataGridDTRows = result.data.psi_tmp_order_dt.tmp_order_dt;
                    self.dgInsDT.loadDgData(self.pageTwoDataGridDTRows);

                } else {
                    alert(result.error.errorMsg);
                    callback(result);
                }
            });

        },

    }

});

// Vue.filter("showDropdownDisplayName", function (val) {
// });

var adpterDg = new AdapterDatagrid(PSIW500030);

//監測div寬度套件
(function($,window,undefined){
    '$:nomunge'; // Used by YUI compressor.

    // A jQuery object containing all non-window elements to which the resize
    // event is bound.
    var elems = $([]),

        // Extend $.resize if it already exists, otherwise create it.
        jq_resize = $.resize = $.extend( $.resize, {} ),

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

    jq_resize[ str_delay ] = 250;

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

    jq_resize[ str_throttle ] = true;

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

    $.event.special[ str_resize ] = {

        // Called only when the first 'resize' event callback is bound per element.
        setup: function() {
            // Since window has its own native 'resize' event, return false so that
            // jQuery will bind the event using DOM methods. Since only 'window'
            // objects have a .setTimeout method, this should be a sufficient test.
            // Unless, of course, we're throttling the 'resize' event for window.
            if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }

            var elem = $(this);

            // Add this element to the list of internal elements to monitor.
            elems = elems.add( elem );

            // Initialize data store on the element.
            $.data( this, str_data, { w: elem.width(), h: elem.height() } );

            // If this is the first element added, start the polling loop.
            if ( elems.length === 1 ) {
                loopy();
            }
        },

        // Called only when the last 'resize' event callback is unbound per element.
        teardown: function() {
            // Since window has its own native 'resize' event, return false so that
            // jQuery will unbind the event using DOM methods. Since only 'window'
            // objects have a .setTimeout method, this should be a sufficient test.
            // Unless, of course, we're throttling the 'resize' event for window.
            if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }

            var elem = $(this);

            // Remove this element from the list of internal elements to monitor.
            elems = elems.not( elem );

            // Remove any data stored on the element.
            elem.removeData( str_data );

            // If this is the last element removed, stop the polling loop.
            if ( !elems.length ) {
                clearTimeout( timeout_id );
            }
        },

        // Called every time a 'resize' event callback is bound per element (new in
        // jQuery 1.4).
        add: function( handleObj ) {
            // Since window has its own native 'resize' event, return false so that
            // jQuery doesn't modify the event object. Unless, of course, we're
            // throttling the 'resize' event for window.
            if ( !jq_resize[ str_throttle ] && this[ str_setTimeout ] ) { return false; }

            var old_handler;

            // The new_handler function is executed every time the event is triggered.
            // This is used to update the internal element data store with the width
            // and height when the event is triggered manually, to avoid double-firing
            // of the event callback. See the "Double firing issue in jQuery 1.3.2"
            // comments above for more information.

            function new_handler( e, w, h ) {
                var elem = $(this),
                    data = $.data( this, str_data );

                // If called from the polling loop, w and h will be passed in as
                // arguments. If called manually, via .trigger( 'resize' ) or .resize(),
                // those values will need to be computed.
                data.w = w !== undefined ? w : elem.width();
                data.h = h !== undefined ? h : elem.height();

                old_handler.apply( this, arguments );
            };

            // This may seem a little complicated, but it normalizes the special event
            // .add method between jQuery 1.4/1.4.1 and 1.4.2+
            if ( $.isFunction( handleObj ) ) {
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
        timeout_id = window[ str_setTimeout ](function(){

            // Iterate over all elements to which the 'resize' event is bound.
            elems.each(function(){
                var elem = $(this),
                    width = elem.width(),
                    height = elem.height(),
                    data = $.data( this, str_data );

                // If element size has changed since the last time, update the element
                // data store and trigger the 'resize' event.
                if ( width !== data.w || height !== data.h ) {
                    elem.trigger( str_resize, [ data.w = width, data.h = height ] );
                }

            });

            // Loop.
            loopy();

        }, jq_resize[ str_delay ] );

    };

})(jQuery,this);

//啟動拖拉
$(".dominos-inventory-left").resizable({
    handleSelector: ".splitter",
    resizeHeight: false
});

//右邊被拉小時，維持右邊欄位版面整齊
$('.dominos-inventory-right').resize(function(){
    var elem = $(this);
    var inventoryRightW = elem.width();
    console.log(inventoryRightW);
    if(inventoryRightW < 614){
        $(".w510px").css("margin-left","92px");
    }else{
        $(".w510px").css("margin-left","0");
    }

    if(inventoryRightW < 611) {
        $(".address-second").css("margin-left","93px");
        $(".input-second-2").css("margin-left","93px");
    }else{
        $(".address-second").css("margin-left","0");
        $(".input-second-2").css("margin-left","0");
    }

    if(inventoryRightW < 355) {
        $(".address-frist").css("margin-left","93px");
    }else{
        $(".address-frist").css("margin-left","0");
    }

    if(inventoryRightW < 306) {
        $(".w510px").css("margin-left","0");
        $(".address-frist").css("margin-left","0");
        $(".input-second-2").css("margin-left","0");
        $(".address-second").css("margin-left","0");
        $(".w510px").css("margin-left","0");
    }
});


// 彈出 空白訂單下載
$(document).on('click', ".PSIW500030-down", function (e) {
    e.preventDefault();
    var dialog = $("#PSIW500030-down").removeClass('hide').dialog({
        modal: true,
        title: "空白訂貨表單下載",
        title_html: true,
        width: 500,
        maxwidth: 1920,
//                height: $(window).height(),
//                autoOpen: true,
        dialogClass: "test",
        resizable: true
    });
});