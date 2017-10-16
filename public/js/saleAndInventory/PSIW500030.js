/**
 * Created by a16009 on 2017/10/11.
 * 程式編號: PSIW500030
 * 程式名稱: 門市WEB訂單作業
 */

var prg_id = $("#prg_id").val();

var go_userid;  //員工編號
var go_saveData;

/** DatagridRmSingleGridClass ***/
function DatagridRmSingleGridClass() {
}

DatagridRmSingleGridClass.prototype = new DatagridBaseClass();
DatagridRmSingleGridClass.prototype.onClickCell = function (idx, row) {};

DatagridRmSingleGridClass.prototype.onClickRow = function (idx, row) {
    alert(idx);
    //vm.editingRow = row;
    //vm.editStatus = true;
    // vm.fetchSingleData(row, function (success) {
    //     vm.showSingleGridDialog();
    // });
};
/*** Class End  ***/

//頁面初始化
$(function(){
    // if(verify())
    // {
    //     initDataGrid();
    // }
    // else{
    //
    // }
    initDataGrid();
});


//初始化DataGrid
function initDataGrid() {
    var dgIns = {};
    dgIns = new DatagridRmSingleGridClass();
    dgIns.init(prg_id, 'PSIW500030_dg', EZfieldClass.combineFieldOption(bindingFieldData(), 'PSIW500030_dg'));

    var lo_params = {
        func : "getDataGridRows",
        comp_cod: "1",
        key_cod1: "a16009"
    };

    //撈多筆資料
    //waitingDialog.show('Loading...');
    $.post("/api/getQueryResult", lo_params, function (result) {
        //waitingDialog.hide();
        if (result.data) {
            dgIns.loadDgData(result.data);
        } else {
            alert(result.errorMsg);
        }
    });
}

function bindingFieldData() {
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
}

function verify() {     //驗證人員編號

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

}

function addData() {     //新增資料
    defaultValue();


    //TODO
    //帶入訂單日期order_dat、交貨日期ship_dat、客戶代號show_cod(虛擬欄位)、訂貨人attnd_nam
    //用『客戶代號show_cod』到客戶代號sql：帶回『客戶流水號cust_cod』、『客戶名稱cust_nam』、『送貨地點ship1_add、ship2_add』、『電話cust_tel』
    //訂單格式下拉內容、
}

function defaultValue() {     //新增資料預設值

    //訂單日期
    var order_dat = moment().format('YYYY-MM-DD');
    $("#order_dat").val(order_dat);
    var ship_dat = moment().add(1, 'day').format('YYYY/MM/DD');
    $("#ship_dat").val(ship_dat);

}

function editData() {    //修改資料
    //TODO
    //call 『修改API』檢查資料可否修改,
    //如不能修改,則mndt畫面要readonly,儲存button不能按
    //如可修改『訂單格式』、『客戶代號』欄位改成readonly
}

function deleteData() {  //刪除資料
    //TODO
    //在多筆刪除資料
    //組資料
    //call 『刪除API』
}

function approved() {    //核准
    //TODO
    //組資料
    //call『核准API』
    //接收回傳訊息更新狀態
}

function cancel() {      //取消核准
    //TODO
    //組資料
    //call『取消核准API』
    //接收回傳訊息更新狀態
}

function save() {        //儲存
    //TODO
    //判斷是新增還是修改
    //判斷狀態為待核或核准
    bindingData();                  //組資料
    //JSON.stringify(go_saveData);  //轉json
    //console.log(go_saveData);

    //將dt貨號空白的貨品清除,這些不需要透過API入到DB
    //主檔稅額與明細稅額合計的差異數，調到最後一筆計稅明細的稅額
    //換句話說『將差額調到psi_quote_dt.SORDER_TAX最後一筆有值的明細』
    //如果狀態是C,填入『核准日、核准者』
    //填入『新增日、新增者、最後異動日、最後異動者』
    //call『新增儲存API』
}

function orderFormatVerify() {      //訂單格式檢查 (select change event)
    //TODO
    //檢查可否選用訂單格式，看『可否選用訂單格式sql』

    //通過檢查後call訂單格式API,回傳dt的貨品,依貨號當做dt的序號排序
}

function bindingData() {      //組資料

    //dt
    var lo_dt = [];
    var lo_object = {};
    lo_object.a = "1";
    lo_object.b = "2";
    lo_dt.push(lo_object);

    var lo_saveData = {
        lang : "zh_TW",
        testLog : "Y",
        //mn
        mn : {
            comp_dod : "asd",                       //TODO 預設登入的公司別代號
            order_nos : $("#order_nos").val(),
            order_dat : $("#order_dat").val(),
            order_sta : $("#order_sta").val(),       //
            sales_cod : "asd",                       //TODO psi_cust_mn.sales_cod
            order_format : $("#order_format").val(), //
            cust_cod : $("#show_cod").val(),         //TODO 要帶內碼
            atten_nam : $("#atten_nam").val(),
            cust_tel :  "asd",                       //看『新增用的電話sql』
            hotel_cod : "",
            ship1_add : $("#ship1_add").val(),
            ship2_add : $("#ship2_add").val(),
            ship_dat : $("#ship_dat").val(),
            account_sta : "asd",                     //看『新增用客戶代號sql』
            account_nos : "asd",                     //看『新增用客戶代號sql』
            tax_typ : "",
            order_amt : "asd",                       //明細小計的加總
            order_tax : "asd",                       //明細稅額的加總
            order_tot : "asd",                       //明細小計 + 稅額的加總
            ins_usr : $("#ins_usr").val(),
            ins_dat : $("#ins_dat").val(),
            upd_usr : $("#upd_usr").val(),
            upd_dat : $("#upd_dat").val(),
            cnfirm_cod : $("#cnfirm_cod").val(),
            cnfirm_dat : $("#cnfirm_dat").val(),
            order_rmk : $("#order_rmk").val(),
            gen_cod : "S",
            ship_typ : "asd",                         //看『新增用客戶代號sql』
            chn_compcod : "",
            chn_purchnos : "",
            chn_hotelcod : "",
            format_sta  : "asd",                      //看不懂
            close_sta : "",
            close_dat : "",
            close_cod : "",
            conv_typ : "S",
            suply_sta : "",
            trans_typ : "",
            doc_cod : "2100",
            doc_nos : "asd"                           //看不懂
        },
        dt : lo_dt　
    };

    go_saveData = lo_saveData;

}

/** 欄位多語系Dialog **/
Vue.component("field-multi-lang-dialog-tmp", {
    template: '#fieldMultiLangDialogTmp',
    props: ['sys_locales', 'singleData'],
    data: function () {
        return {
            editingMultiLangFieldName: '',
            showMultiLangDialog: false,
            editingLangField: "",
            multiLangContentList: [],
            fieldMultiLang: {}
        };
    },
    created: function () {
        var self = this;
        vmHub.$on('editFieldMultiLang', function (fieldInfo) {
            self.getFieldMultiLangContent(fieldInfo);
        });
    },
    methods: {
        getFieldMultiLangContent: function (fieldInfo) {
            this.editingLangField = fieldInfo.ui_field_name;
            var self = this;
            var params = {
                dataType: 'gridsingle',
                rowData: this.singleData,
                prg_id: fieldInfo.prg_id,
                page_id: 2,
                ui_field_name: fieldInfo.ui_field_name
            };

            $.post("/api/fieldAllLocaleContent", params, function (result) {
                self.multiLangContentList = result.multiLangContentList;
                self.editingMultiLangFieldName = fieldInfo.ui_display_name;
                self.openFieldMultiLangDialog(fieldInfo.ui_display_name);
            });
        },
        openFieldMultiLangDialog: function () {
            this.showMultiLangDialog = true;
        },
        closeFieldMultiLangDialog: function () {
            this.showMultiLangDialog = false;
        },
        saveFieldMultiLang: function () {

            var multiLang = [];
            //TODO 暫時用jquery 取資料
            $(".multi_lang_input").each(function () {
                var tmpObj = {};
                tmpObj['locale'] = $(this).data("locale");
                tmpObj[$(this).attr("id")] = $(this).val();
                if (!_.isEmpty($(this).val())) {
                    multiLang.push(tmpObj);
                }
            });

            this.singleData["multiLang"] = multiLang;
            this.closeFieldMultiLangDialog();
        },
        filterLocaleContent: function (langContent, locale, field_name) {
            var m_lang_val = "";
            var fIdx = _.findIndex(langContent, {locale: locale});
            if (fIdx > -1) {
                m_lang_val = langContent[fIdx][field_name] || "";
            }

            return m_lang_val;
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

/** 編輯新增Dialog Component **/
Vue.component('single-grid-pms0830090-tmp', {
    template: '#sigleGridPMS0830090Tmp',
    props: ['editStatus', 'createStatus', 'deleteStatus', 'editingRow', 'pageOneDataGridRows', 'pageTwoDataGridFieldData',
        'singleData', 'pageTwoFieldData', 'tmpCud', 'modificableForData', 'selectPopUpGridData', 'updateBackSelectData'],
    data: function () {
        return {
            tmpCUD: {},
            isFistData: false,
            isLastData: false,
            dtDataGridIsCreate: false
        };
    },
    created: function () {
        var self = this;
        vmHub.$on('showDtDataGrid', function (dtDataGridRows) {
            self.showDtDataGrid(dtDataGridRows);
        });
        vmHub.$on('tempExecData', function (row) {
            self.tempExecData(row);
        });
        vmHub.$on('updateBackSelectData', function (chooseData) {
            self.singleData = _.extend(self.singleData, chooseData);
        });
    },

    watch: {
        editingRow: function (newRow, oldRow) {

            this.$parent.editingRow = newRow;
            var nowDatagridRowIndex = $("#PMS0830090_dg").datagrid('getRowIndex', newRow);
            $("#PMS0830090_dg").datagrid('selectRow', nowDatagridRowIndex);

            if ($("#PMS0830090_dg").datagrid('getRowIndex', newRow) == 0) {
                //已經到第一筆
                this.isFistData = true;
                this.isLastData = false;
            } else if ($("#PMS0830090_dg").datagrid('getRowIndex', newRow) == this.pageOneDataGridRows.length - 1) {
                //已經到最後一筆
                this.isFistData = false;
                this.isLastData = true;
            } else {

                this.isFistData = false;
                this.isLastData = false;
            }

        }
    },
    methods: {
        //打開單欄多語編輯
        editFieldMultiLang: function (fieldInfo) {
            vmHub.$emit('editFieldMultiLang', fieldInfo);
        },

        showDropdownDisplayName: function (val, selectData) {
            if (_.findIndex(selectData, {value: val}) > -1) {
                return _.findWhere(selectData, {value: val}).display;
            } else {
                return val;
            }
        },
        //改成編輯中
        changeEditingForFieldRule: function (rule_func_name) {
            if (!_.isUndefined(rule_func_name) && !_.isEmpty(rule_func_name)) {
                this.isEditingForFieldRule = true;
            }
        },
        //跳窗選擇多欄位
        chkClickPopUpGrid: function (field) {
            this.changeEditingForFieldRule(field.rule_func_name);
            if (field.ui_type == "popupgrid") {
                var params = {
                    prg_id: prg_id,
                    fields: field,
                    singleRowData: JSON.parse(JSON.stringify(this.singleData))
                };
                $.post("/api/popUpGridData", params, function (result) {
                    if (result != null) {
                        PMS0830090VM.selectPopUpGridData = result.showDataGrid;
                        vmHub.$emit('showPopUpDataGrid', result);
                        PMS0830090VM.showPopUpGridDialog();
                    }
                });
            }
        },

        //檢查欄位規則，在離開欄位時
        chkFieldRule: function (ui_field_name, rule_func_name) {
            var self = this;
            var lo_singleData = this.singleData;

            if (!_.isEmpty(rule_func_name.trim())) {
                var postData = {
                    prg_id: prg_id,
                    rule_func_name: rule_func_name,
                    validateField: ui_field_name,
                    singleRowData: lo_singleData,
                    oriSingleRowData: PMS0830090VM.originData
                };
                $.post('/api/chkFieldRule', postData, function (result) {
                    if (result.success) {
                        PMS0830090VM.originData = _.clone(lo_singleData);
                        //是否要show出訊息
                        if (result.showAlert) {
                            alert(result.alertMsg);
                        }

                        //是否要show出詢問視窗
                        if (result.showConfirm) {
                            if (confirm(result.confirmMsg)) {
                                //是: 清空欄位cust_cod、show_cod、cust_nam
                                PMS0830090VM.singleData.cust_cod = '';
                                PMS0830090VM.singleData.show_cod = '';
                                PMS0830090VM.singleData.cust_nam = '';
                            }
                            else{
                                //否: 不可異動
                                alert(result.alertMsg);
                                PMS0830090VM.singleData.master_typ = "N";
                            }
                        }
                    } else {
                        alert(result.errorMsg);
                    }

                });
            }
        },

        onClickDtRow: function (index, field) {
            if (this.dtEditIndex != index) {
                if (this.endDtEditing()) {
                    $("#dt_dg").datagrid('selectRow', index).datagrid('beginEdit', index);
                    this.dtEditIndex = index;
                } else {
                    setTimeout(function () {
                        $("#dt_dg").datagrid('selectRow', this.dtEditIndex);
                    }, 0);
                }
            }
        },

        //結束編輯dt
        endDtEditing: function () {
            if (this.dtEditIndex == undefined) {
                return true;
            }
            if ($("#dt_dg").datagrid('validateRow', this.dtEditIndex)) {
                $("#dt_dg").datagrid('endEdit', this.dtEditIndex);
                this.dtEditIndex = undefined;
                return true;
            }
            return false;

        },

        //到第一筆
        toFirstData: function () {
            this.isFistData = true;
            this.isLastData = false;
            this.editingRow = _.first(this.pageOneDataGridRows);
            this.emitFetchSingleData();
        },

        //上一筆
        toPreData: function () {
            var nowRowIndex = $("#PMS0830090_dg").datagrid('getRowIndex', this.editingRow);
            this.editingRow = this.pageOneDataGridRows[nowRowIndex - 1];
            this.emitFetchSingleData();

        },

        //下一筆
        toNextData: function () {
            var nowRowIndex = $("#PMS0830090_dg").datagrid('getRowIndex', this.editingRow);
            this.editingRow = this.pageOneDataGridRows[nowRowIndex + 1];
            this.emitFetchSingleData();

        },

        //最後一筆
        toLastData: function () {
            this.isFistData = false;
            this.isLastData = true;
            this.editingRow = _.last(this.pageOneDataGridRows);
            this.emitFetchSingleData();
        },

        //刪除單筆EVENT
        handleDeleteSingleData: function () {
            var self = this;
            var q = confirm("Are you sure delete those data?");
            if (q) {
                //刪除前檢查
                $.post("/api/deleteFuncRule", {
                    page_id: 2,
                    prg_id: prg_id,
                    deleteData: [self.singleData]
                }, function (result) {
                    if (result.success) {
                        self.deleteStatue = true;
                        self.tmpCud.deleteData = [self.singleData];
                        self.doSaveGrid();
                        if (result.showAlert) {
                            alert(result.alertMsg);
                        }
                    } else {
                        alert(result.errorMsg);
                    }
                });
            }

        },

        //關閉
        emitCloseGridDialog: function () {
            this.dtEditIndex = undefined;
            this.$emit('close-single-grid-dialog');
        },

        //抓取單筆資料
        emitFetchSingleData: function () {
            var params = this.editingRow;
            this.$emit('fetch-single-data', params, function (success) {
            });
        },

        //新增
        emitAppendRow: function () {
            this.$emit('append-row');
        },

        //儲存新增或修改資料
        doSaveGrid: function (saveAfterAction) {
            if (this.endDtEditing()) {
                var self = this;
                var targetRowAfterDelete = {}; //刪除後要指向的資料
                if (this.deleteStatue) {
                    var rowsNum = $("#PMS0830090_dg").datagrid('getRows').length;
                    var currentRowIdx = $("#PMS0830090_dg").datagrid('getRowIndex', self.editingRow); //目前索引
                    if (currentRowIdx == rowsNum - 1) {
                        //刪除的資料已經是最後一筆 就取datagrid最末筆
                        targetRowAfterDelete = self.pageOneDataGridRows[currentRowIdx - 1];

                    } else {
                        //取下一筆
                        targetRowAfterDelete = self.pageOneDataGridRows[currentRowIdx + 1];
                    }
                }

                if (this.createStatus) {
                    if(PMS0830090VM.isbatchAdd){    //判斷是否為批次新增

                        if(Number(this.singleData.start_num) > Number(this.singleData.end_num)){
                            alert("起始編號要小於結尾編號!");
                            return;
                        }

                        var lo_tmpCud = [];

                        for(i = Number(this.singleData.start_num); i <= Number(this.singleData.end_num); i++){

                            var account = padLeft(i.toString(), this.singleData.account_length - 1);
                            account = this.singleData.prefix + account;

                            //判斷是否已經存在
                            var existIdx =  _.findIndex(this.pageOneDataGridRows, function(lo_rows){
                                return lo_rows.master_nos.trim() == account.trim();
                            });

                            if (existIdx != -1)
                                continue;

                            lo_tmpCud.push({
                                "master_nos": account,
                                "master_typ": this.singleData.master_typ,
                                "master_sta": "N",
                                // "cust_cod": this.singleData.cust_cod,
                                // "cust_nam": this.singleData.cust_nam,
                                // "deposit_nos": this.singleData.deposit_nos
                            });
                        }
                        this.tmpCud.createData = lo_tmpCud;
                        //return;
                    }
                    else {
                        this.tmpCud.createData = [this.singleData];
                    }
                } else if (this.editStatus) {
                    this.tmpCud.editData = [this.singleData];
                }

                //先驗證有無欄位沒驗證過的
                this.$emit('do-save-cud', function (success) {
                    if (success) {
                        //儲存後離開
                        if (saveAfterAction == "closeDialog") {
                            self.singleData = {};
                            self.emitCloseGridDialog();
                        }
                        //新增完再新增另一筆
                        else if (saveAfterAction == "addOther") {
                            self.singleData = {};
                            self.emitAppendRow();
                        }

                        if (self.deleteStatue) {
                            /**
                             * 刪除成功
                             * 1.取下一筆
                             * 2.無下一筆時取datagrid 最後一筆
                             * 3.連一筆都沒有關掉dialog 回多筆
                             **/
                            if ($("#PMS0830090_dg").datagrid('getRows').length > 0) {
                                self.editingRow = targetRowAfterDelete;
                                self.emitFetchSingleData();
                            } else {
                                //連一筆都沒有就關掉視窗
                                self.emitCloseGridDialog();
                            }

                        }


                    }
                });
            }
        },

        //DT datagrid資料放入暫存
        tempExecData: function (rowData) {
            var self = this;

            if (!_.isUndefined(rowData.day_sta_color)) {

                var lo_day_sta = $('#dt_dg').datagrid('getSelected').day_sta;

                delete rowData["day_sta_color"];
            }

            rowData["mnRowData"] = this.singleData;
            //判斷此筆是新增或更新
            var dataType = rowData.createRow == 'Y'
                ? "dt_createData" : "dt_editData";
            var fieldDataList = this.pageTwoDataGridFieldData;
            var keyVals = _.pluck(_.where(fieldDataList, {keyable: 'Y'}), "ui_field_name");
            var condKey = {};
            _.each(keyVals, function (field_name) {
                condKey[field_name] = rowData[field_name] || "";
            });

            //判斷資料有無在暫存裡, 如果有先刪掉再新增新的
            var existIdx = _.findIndex(this.tmpCud[dataType], condKey);
            if (existIdx > -1) {
                this.tmpCud[dataType].splice(existIdx, 1);
            }
            rowData.key_nos = this.key_nos;
            this.tmpCud[dataType].push(rowData);
        },

        //新增一個Dt Row
        appendDtRow: function () {
            alert("asd");
            // var self = this;
            // if (this.endDtEditing()) {
            //     $.post("/api/handleDataGridAddEventRule", {prg_id: prg_id, page_id: 2}, function (result) {
            //         var prgDefaultObj = {createRow: 'Y'};
            //         if (result.success) {
            //             prgDefaultObj = _.extend(prgDefaultObj, result.prgDefaultObj);
            //         }
            //         $("#dt_dg").datagrid('appendRow', prgDefaultObj);
            //         self.dtEditIndex = $("#dt_dg").datagrid('getRows').length - 1;
            //         $("#dt_dg").datagrid('selectRow', self.dtEditIndex)
            //             .datagrid('beginEdit', self.dtEditIndex);
            //     });
            //
            // }
        },

        //刪除選定Dt的Row
        removeDtRow: function () {
            var self = this;
            var delRow = $("#dt_dg").datagrid('getSelected');
            if (!delRow) {
                alert("請選擇要刪除的資料");
            }
            delRow["mnRowData"] = this.singleData;  //存放此筆DT 對應mn 的資料

            PMS0830090VM.tmpCud.dt_deleteData.push(delRow);

            $.post("/api/handleDataGridDeleteEventRule", {
                prg_id: prg_id,
                page_id: 2,
                deleteData: PMS0830090VM.tmpCud.dt_deleteData
            }, function (result) {
                if (result.success) {
                    $("#dt_dg").datagrid('deleteRow', $("#dt_dg").datagrid('getRowIndex', delRow));
                } else {
                    PMS0830090VM.tmpCud.deleteData = _.without(PMS0830090VM.tmpCud.deleteData, delRow);  //刪除在裡面的暫存
                    PMS0830090VM.tmpCud.dt_deleteData = _.without(PMS0830090VM.tmpCud.dt_deleteData, delRow);  //刪除在裡面的暫存
                    self.endDtEditing();
                    alert(result.errorMsg);
                }

            });
        }
    }
});


var PMS0830090VM = new Vue({
    el: '#GSApp',
    mounted: function () {
        var self = this;
        this.initTmpCUD();
        this.fetchUserInfo();
        this.loadDataGridByPrgID(function (success) {
        });
        this.loadSingleGridPageField();
    },
    components: {
        "search-comp": go_searchComp
    },
    data: {
        isDatepickerInit: false,
        sys_locales: JSON.parse(decodeURIComponent(getCookie("sys_locales")).replace("j:", "")),
        createStatus: false,    //新增狀態
        editStatus: false,      //編輯狀態
        deleteStatus: false,    //刪除狀態
        isbatchAdd: false,      //是否為批次新增
        pageOneDataGridRows: [],//page_id 1 的 datagrid資料
        pageOneFieldData: [],   //page_id 1 datagird欄位
        pageTwoFieldData: [],   //page_id 2 欄位
        oriPageTwoFieldData: [],   //page_id 2 原始欄位資料
        pageTwoDataGridFieldData: [],   //page_id 2 datagird欄位
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
        modificableForData: true,       //決定是否可以修改資料
        dgIns: {},
        labelPosition: 'right',
        searchFields: [], //搜尋的欄位
        searchCond: {}   //搜尋條件
    },
    methods: {
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
        //抓取顯示資料
        loadDataGridByPrgID: function (callback) {
            $.post("/api/prgDataGridDataQuery", {prg_id: prg_id, searchCond: this.searchCond}, function (result) {
                waitingDialog.hide();
                PMS0830090VM.searchFields = result.searchFields;
                PMS0830090VM.pageOneDataGridRows = result.dataGridRows;
                PMS0830090VM.pageOneFieldData = result.fieldData;
                PMS0830090VM.showCheckboxDG();
                PMS0830090VM.showDataGrid();
                callback(result.success);
            });
        },

        //顯示DataGrid
        showDataGrid: function () {

            this.dgIns = new DatagridRmSingleGridClass();
            this.dgIns.init(prg_id, 'PMS0830090_dg', EZfieldClass.combineFieldOption(this.pageOneFieldData, 'PMS0830090_dg'));
            this.dgIns.loadDgData(this.pageOneDataGridRows);
            // PMS0830090VM.pageOneDataGridRows = $("#dgCheckbox").datagrid('getRows');
        },

        //取得使用者資料
        fetchUserInfo: function () {
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    PMS0830090VM.userInfo = result.userInfo;
                }
            });
        },

        //Show Checkbox
        showCheckboxDG: function () {
            var dgData = {total: this.pageOneDataGridRows.length, rows: this.pageOneDataGridRows};
            $('#dgCheckbox').datagrid({
                columns: [
                    [
                        {
                            field: 'ck',
                            checkbox: true
                        }
                    ]
                ],
                singleSelect: false,
                data: dgData
            });
        },

        //新增按鈕Event
        appendRow: function () {
            PMS0830090VM.initTmpCUD();
            PMS0830090VM.createStatus = true;
            PMS0830090VM.editStatus = false;
            PMS0830090VM.isbatchAdd = false;
            PMS0830090VM.singleData = {};
            PMS0830090VM.modificableForData = true;
            PMS0830090VM.pageTwoFieldData = _.values(_.groupBy(_.sortBy(go_Field_Data_Tmp, "row_seq"), "row_seq"));
            PMS0830090VM.oriPageTwoFieldData = go_Field_Data_Tmp;

            $.post("/api/addFuncRule", {prg_id: prg_id, page_id: 1}, function (result) {
                if (result.success) {
                    PMS0830090VM.singleData = result.defaultValues;
                    PMS0830090VM.showSingleGridDialog();
                } else {
                    alert(result.errorMsg);
                }
            });
        },

        //批次新增按鈕Event
        batchappendRow: function () {
            PMS0830090VM.initTmpCUD();
            PMS0830090VM.createStatus = true;
            PMS0830090VM.editStatus = false;
            PMS0830090VM.isbatchAdd = true;
            //PMS0830090VM.singleData = {account_length: 4, prefix : 'A', master_typ : 'A', cust_cod : '', show_cod : '', cust_nam : '', deposit_nos: '', deposit_nam: ''};  //改SA，先保留
            PMS0830090VM.singleData = {account_length: 4, prefix : 'A'};

            //塞欄位
            var fieldData = this.fetchBatchFieldData();

            PMS0830090VM.pageTwoFieldData = _.values(_.groupBy(_.sortBy(fieldData, "row_seq"), "row_seq"));
            PMS0830090VM.oriPageTwoFieldData = fieldData;

            PMS0830090VM.showSingleGridDialog();
        },

        //dg row刪除
        removeRow: function () {
            PMS0830090VM.tmpCud.deleteData = [];
            var checkRows = $('#dgCheckbox').datagrid('getSelections');
            if (checkRows == 0) {
                alert("Warning", 'Check at least one item');
                return;
            }
            var q = confirm("Are you sure delete those data?");
            if (q) {
                //刪除前檢查

                _.each(checkRows, function (row) {
                    PMS0830090VM.tmpCud.deleteData.push(row);
                });

                $.post("/api/deleteFuncRule", {
                    page_id: 1,
                    prg_id: prg_id,
                    deleteData: PMS0830090VM.tmpCud.deleteData
                }, function (result) {
                    if (result.success) {
                        //刪除Row
                        _.each(checkRows, function (row) {
                            var DelIndex = $('#PMS0830090_dg').datagrid('getRowIndex', row);
                            $('#PMS0830090_dg').datagrid('deleteRow', DelIndex);
                        });
                        PMS0830090VM.showCheckboxDG($("#PMS0830090_dg").datagrid("getRows"));
                        PMS0830090VM.doSaveCUD();
                    } else {
                        alert(result.errorMsg);
                    }

                });

            }

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
        //資料儲存
        doSaveCUD: function (callback) {
            if(PMS0830090VM.isbatchAdd){
                var lo_chkResult = this.dataValidate();
                if (lo_chkResult.success == false && PMS0830090VM.tmpCud.deleteData.length == 0) {
                    alert(lo_chkResult.msg);
                    return;
                }
            }

            var self = this;
            waitingDialog.show('Saving...');

            var params = _.extend({prg_id: prg_id}, PMS0830090VM.tmpCud);
            $.post("/api/saveGridSingleData", params, function (result) {
                if (result.success) {
                    PMS0830090VM.initTmpCUD();
                    PMS0830090VM.loadDataGridByPrgID(function (success) {
                        callback(success);
                    });
                    alert('save success!');
                    waitingDialog.hide();

                } else {
                    waitingDialog.hide();
                    alert(result.errorMsg);
                }

            });

        },

        tempExecData: function (rowData) {
            vmHub.$emit("tempExecData", rowData);
        },

        //抓取page_id 2 單頁顯示欄位
        loadSingleGridPageField: function () {
            $.post("/api/singleGridPageFieldQuery", {prg_id: prg_id, page_id: 2}, function (result) {
                var fieldData = _.clone(result.fieldData);
                go_Field_Data_Tmp = _.clone(result.fieldData);

                PMS0830090VM.pageTwoFieldData = _.values(_.groupBy(_.sortBy(fieldData, "row_seq"), "row_seq"));

            });
        },

        //取得單筆資料
        fetchSingleData: function (editingRow, callback) {
            PMS0830090VM.initTmpCUD();
            PMS0830090VM.editStatus = true;
            PMS0830090VM.editingRow = editingRow;
            editingRow["prg_id"] = prg_id;
            $.post('/api/singlePageRowDataQuery', editingRow, function (result) {
                if (result.success) {
                    PMS0830090VM.singleData = result.rowData;
                    PMS0830090VM.originData = _.clone(result.rowData);
                    PMS0830090VM.modificableForData = result.isModifiable;

                    //如果為可修改，不可將狀態改成使用中
                    if(PMS0830090VM.modificableForData){
                        PMS0830090VM.pageTwoFieldData[0][1].selectData = [
                            {
                                value: "N",
                                display:"N : 未使用"
                            },
                            {
                                value: "P",
                                display:"P : 暫停使用"
                            }
                        ];
                    }
                    else{
                        PMS0830090VM.pageTwoFieldData[0][1].selectData = [
                            {
                                value: "Y",
                                display:"Y : 使用中"
                            }
                        ];
                    }

                    callback(true);

                } else {
                    PMS0830090VM.singleData = {};
                    callback(false);
                }

            });
        },

        //init datepicker
        initDatePicker: function () {
            if (!this.isDatepickerInit) {
                this.isDatepickerInit = true;
                $('.date_picker').datepicker({
                    autoclose: true,
                    format: 'yyyy/mm/dd'
                }).on("changeDate", function (e) {
                });

                $('.date_timepicker').datetimepicker({
                    format: 'YYYY/MM/DD hh:mm:ss ',//use this option to display seconds
                    icons: {
                        time: 'fa fa-clock-o',
                        date: 'fa fa-calendar',
                        up: 'fa fa-chevron-up',
                        down: 'fa fa-chevron-down',
                        previous: 'fa fa-chevron-left',
                        next: 'fa fa-chevron-right',
                        today: 'fa fa-arrows ',
                        clear: 'fa fa-trash',
                        close: 'fa fa-times'
                    }

                });
            }
        },

        //打開單檔dialog
        showSingleGridDialog: function () {
            this.initDatePicker();
            var maxHeight = document.documentElement.clientHeight - 70; //browser 高度 - 70功能列
            var height = 10 * 50; // 預設一個row 高度
            var dialog = $("#singleGridPMS0830090").dialog({
                autoOpen: false,
                modal: true,
                height: _.min([maxHeight, height]),
                title: prg_id,
                minWidth: 750,
                maxHeight: maxHeight,
                resizable: true,
                buttons: "#dialogBtns"
            });
            dialog.dialog("open");
            // 給 dialog "內容"高 值
            $(".singleGridContent").css("height", _.min([maxHeight, height]) + 20);
        },

        //關閉單檔dialog
        closeSingleGridDialog: function () {
            PMS0830090VM.editingRow = {};
            PMS0830090VM.singleData = {};
            PMS0830090VM.editStatus = false;
            PMS0830090VM.initTmpCUD();

            $("#singleGridPMS0830090").dialog('close');
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
        }
    }

});

function editDtMultiLang(rowIdx) {
    vmHub.$emit('editDtMultiLang', {rowIdx: rowIdx});
}

Vue.filter("showDropdownDisplayName", function (val) {
});

var adpterDg = new AdapterDatagrid(PMS0830090VM);


function padLeft(str,lenght){
    if(str.length >= lenght)
        return str;
    else
        return padLeft("0" + str,lenght);
}