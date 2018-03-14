/**
 * Created by 柏浩 on 2017/10/11.
 * 程式編號: PMS0620010
 * 程式名稱: 業務員作業
 */
let vmHub = new Vue();

/** DatagridRmSingleGridClass **/
function DatagridSingleGridClass() {
}

DatagridSingleGridClass.prototype = new DatagridBaseClass();

DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    //
};
DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {

};

/*** Class End  ***/


let PMS0620020App = Vue.extend({
    template: '#singleGridPMS0620020Tmp',
    props: ["singleData", "isModifiable", "editStatus", "createStatus"],
    data: function () {
        return {
            go_funcPurview: [],
            dgHoatelDt: {},
            dgClassHs: {},
            gs_active: "", //正在使用 hotelDt(館別)| classHs(組別異動紀錄),
            isSaving: false,
            testChk: false,
            postRowData: {},
            originRowData: {},
            rowData: {},
            fieldData: [],
            originFieldData: [],
            hotelDtRowData: [],
            oriHotelDtRowData: [],
            hotelDtFieldData: [],
            classHsRowData: [],
            classHsFieldData: [],
            dtEditIndex: undefined,
            classCodSelectData: [],
            classCodSelectedOption: [],
            loadingText: "",
            isLoadingDialog: "",
            BTN_action: false,
            isAction: false,
            hotelDtRow: 0
        };
    },
    created: function () {
        let self = this;
        vmHub.$on('updateBackSelectData', function (chooseData) {
            if (chooseData["user_nos"] != "" && chooseData["user_cname"] != "") {
                chooseData["user_nos"] = chooseData["user_nos"] + ": " + chooseData["user_cname"];
            }

            self.rowData = _.extend(self.rowData, chooseData);
        });
    },
    mounted: function () {
        this.gs_active = "hotelDt";
        this.loadingText = "Loading...";
    },
    watch: {
        gs_active: function (active) {
            if (active == 'hotelDt') {
                $("#hotelDtPanel").show();
                $("#classHsPanel").hide();
            }
            else {
                $("#classHsPanel").show();
                $("#hotelDtPanel").hide();
            }

            this.showDtDataGrid();
        },
        singleData: function (val) {
            this.isLoadingDialog = true;
            this.BTN_action = false;
            this.initData();
            this.fetchFieldData();
        },
        rowData: {
            handler: function (val) {
                val = _.extend(val, {athena_id: 1});
                this.dgHoatelDt.updateMnRowData(val);
                this.dgHoatelDt.updateTmpDtOfMnData(val);
            },
            deep: true
        },
        editStatus: function(val){
            if(val){
                this.go_funcPurview = (new FuncPurview("PMS0620020")).getFuncPurvs();
            }
        },
        createStatus: function(val){
            if(val){
                this.go_funcPurview = (new FuncPurview("PMS0620020")).getFuncPurvs();
            }
        }
    },
    methods: {
        showDropdownDisplayName: function (val, selectData) {
            if (_.findIndex(selectData, {value: val}) > -1) {
                return _.findWhere(selectData, {value: val}).display;
            }
            return val + ":";

        },
        chkFieldRule: function (ui_field_name, rule_func_name) {
            if (rule_func_name === "" || !this.$parent.isModifiable) {
                return;
            }
            let self = this;
            let la_originData = [this.$parent.originData];
            let la_singleData = [this.rowData];
            let la_diff = _.difference(la_originData, la_singleData);

            // 判斷資料是否有異動
            if (la_diff.length != 0) {
                this.isUpdate = true;
            }

            if (!_.isEmpty(rule_func_name.trim())) {
                let postData = {
                    prg_id: "PMS0620020",
                    rule_func_name: rule_func_name,
                    validateField: ui_field_name,
                    singleRowData: this.rowData,
                    oriSingleData: vm.originData
                };
                $.post('/api/chkFieldRule', postData, function (result) {

                    if (result.success) {
                        //是否要show出訊息
                        if (result.showAlert) {
                            alert(result.alertMsg);
                        }

                        //是否要show出詢問視窗
                        if (result.showConfirm) {
                            if (confirm(result.confirmMsg)) {

                            } else {
                                //有沒有要再打一次ajax到後端
                                if (result.isGoPostAjax && !_.isEmpty(result.ajaxURL)) {
                                    $.post(result.ajaxURL, postData, function (result) {

                                        if (!result.success) {
                                            alert(result.errorMsg);
                                        } else {

                                            if (!_.isUndefined(result.effectValues) && _.size(result.effectValues) > 0) {
                                                self.rowData = _.extend(self.rowData, result.effectValues);
                                            }

                                        }
                                    });
                                }
                            }
                        }

                    }
                    else {
                        alert(result.errorMsg);
                    }

                    //連動帶回的值
                    if (!_.isUndefined(result.effectValues) && _.size(result.effectValues) > 0) {
                        self.rowData = _.extend(self.rowData, result.effectValues);
                    }

                });
            }
        },
        initData: function () {
            this.rowData = {};
            this.originRowData = {};
            this.hotelDtRowData.length = 0;
            this.classHsRowData.length = 0;
        },
        fetchFieldData: function () {
            let self = this;
            $.post("/api/sales/qrySingleGridFieldData_PM0620020", {prg_id: "PMS0620020"}, function (result) {
                self.originFieldData = result.salesMnField;
                self.fieldData = _.values(_.groupBy(_.sortBy(self.originFieldData, "row_seq"), "row_seq"));
                self.hotelDtFieldData = result.hotelDtField;
                self.classHsFieldData = result.classHsField;
                self.classCodSelectData = _.findWhere(self.originFieldData, {ui_field_name: "class_cod"}).selectData;
                self.fetchRowData(self.singleData);
            });
        },
        fetchRowData: function (singleData) {
            let self = this;

            //新增的狀況
            if (Object.keys(this.singleData).length == 0) {
                $.post("/api/sales/addFuncRule_PMS0620020", {prg_id: "PMS0620020", page_id: 1}, function (result) {
                    if (result.success) {
                        self.rowData = result.defaultValues;
                    } else {
                        alert(result.errorMsg);
                    }
                    self.isLoadingDialog = false;
                    self.showDtDataGrid();

                });
                $.post("/api/fetchDefaultSingleRowData", {prg_id: "PMS0620020", page_id: 1}, function (result) {

                });
            }
            //編輯的狀況
            else {
                $.post("/api/sales/qrySalesMn_PM0620020", singleData, function (result) {
                    if (result.success) {
                        self.originRowData = JSON.parse(JSON.stringify(result.rtnObject[0]['rowData']));
                        vm.tmpCud.oriData.push(self.originRowData);
                        self.rowData = result.rtnObject[0]['rowData'];
                        if (_.isNull(self.rowData.user_nos)) {
                            self.rowData.user_nos = "";
                        }
                        else {
                            self.rowData.user_nos = self.rowData.user_nos + ": " + self.rowData.usr_cname;
                        }
                        self.oriHotelDtRowData = JSON.parse(JSON.stringify(result.rtnObject[1]['dataGridDataHotelDT']['dataGridRows']));
                        _.each(self.oriHotelDtRowData, function (data) {
                            data = _.extend(data, self.originRowData);
                            data = _.extend(data, {athena_id: vm.userInfo.athena_id});
                            if (!_.isNull(data["nouse_dat"])) {
                                data["nouse_dat"] = data["nouse_dat"].substring(0, 4) + "/" +
                                    data["nouse_dat"].substring(4, data["nouse_dat"].length);
                            }
                        });
                        self.hotelDtRowData = result.rtnObject[1]['dataGridDataHotelDT']['dataGridRows'];
                        _.each(self.hotelDtRowData, function (data) {
                            if (!_.isNull(data["nouse_dat"])) {
                                data["nouse_dat"] = data["nouse_dat"].substring(0, 4) + "/" +
                                    data["nouse_dat"].substring(4, data["nouse_dat"].length);
                            }
                        });
                        self.classHsRowData = result.rtnObject[2]['dataGridDataClassHs']['dataGridRows'];
                    }
                    else {
                        console.log(result.errorMsg);
                    }
                    //找樹狀parent node
                    findByValue(self.classCodSelectData, self.rowData.class_cod);

                    //攤平資料(陣列扁平化)
                    let list = [];
                    flattenArray(go_rtnResult, list);

                    self.classCodSelectedOption = [];
                    let groupList = _.groupBy(list, "parent_cod");
                    groupList = _.toArray(groupList).reverse();
                    let ls_parent_cod = "";

                    _.each(groupList, function (la_list) {
                        let lo_data;
                        if (ls_parent_cod == "") {
                            lo_data = _.findWhere(la_list, {value: self.rowData.class_cod});
                        }
                        else {
                            lo_data = _.findWhere(la_list, {value: ls_parent_cod});
                        }
                        if (!_.isUndefined(lo_data)) {
                            self.classCodSelectedOption.push(lo_data.value);
                            ls_parent_cod = lo_data.parent_cod;
                        }
                    });
                    self.classCodSelectedOption = self.classCodSelectedOption.reverse();
                    self.isLoadingDialog = false;
                    self.showDtDataGrid();
                });
                $.post("/api/fetchSinglePageFieldData", {
                    prg_id: "PMS0620020",
                    page_id: 1,
                    tab_page_id: 1,
                    searchCond: singleData
                }, function (result) {

                });
            }

        },
        showDtDataGrid: function () {
            this.dgHoatelDt = new DatagridBaseClass();
            this.dgHoatelDt.init("PMS0620020", "hotelDt_dg", DatagridFieldAdapter.combineFieldOption(this.hotelDtFieldData, 'hotelDt_dg'), this.hotelDtFieldData);
            this.dgHoatelDt.loadDgData(this.hotelDtRowData);
            this.dgHoatelDt.getOriDtRowData(this.oriHotelDtRowData);
            this.hotelDtRow = this.oriHotelDtRowData.length;

            this.dgClassHs = new DatagridSingleGridClass();
            this.dgClassHs.init("PMS0620020", "classHs_dg", DatagridFieldAdapter.combineFieldOption(this.classHsFieldData, 'classHs_dg'));
            this.dgClassHs.loadDgData(this.classHsRowData);

        },
        appendDtRow: function (event) {
            let self = this;
            //壤使用者操作紀錄可執行
            setTimeout(function(){
                self.BTN_action = true;
                self.dgHoatelDt.appendRow(function (result) {
                    if (result) {
                        self.BTN_action = false;
                    }
                });
            }, 100);

        },
        removeDtRow: function () {
            this.dgHoatelDt.removeRow();
        },
        doChangeTraff: function (tab, event) {
            this.gs_active = tab.name;
        },
        loadChangeLog: function () {
            $('#salesChangelogDialog').removeClass('hide');
            $.post("/api/getSetupPrgChangeLog", {prg_id: "PMS0620020"}, function (result) {
                if (result.success) {
                    vm.openChangeLogDialog = true;
                    vm.allChangeLogList = result.allChangeLogList;
                }
            });
        },
        closeSingleGridDialog: function () {
            vm.editingRow = {};
            vm.pageOneSingleGridRowData = {};
            vm.initTmpCUD();
            this.dgHoatelDt.initTmpCUD();
            this.hotelDtRowData.length = 0;

            $("#singleGridPMS0620020").dialog('close');
        },
        //mn資料檢查
        mnDataValidate: function () {
            let self = this;
            let lo_checkResult;

            // 欄位驗證
            for (let i = 0; i < this.originFieldData.length; i++) {
                let lo_field = this.originFieldData[i];
                //必填
                if (lo_field.requirable == "Y" && lo_field.modificable != "N" && lo_field.ui_type != "checkbox") {
                    lo_checkResult = go_validateClass.required(self.rowData[lo_field.ui_field_name], lo_field.ui_display_name);
                    if (lo_checkResult.success == false) {
                        break;
                    }
                }

                //有format
                if (lo_field.format_func_name != "") {
                    lo_checkResult = go_validateClass[lo_field.format_func_name](self.rowData[lo_field.ui_field_name], lo_field.ui_display_name);
                    if (lo_checkResult.success == false) {
                        break;
                    }
                }

            }

            return lo_checkResult;
        },
        // dt資料檢查
        dtDataValidate: function () {
            let self = this;
            let lo_checkResult = {
                success: true
            };

            let la_checkHotelDtRowData = _.clone(this.hotelDtRowData);
            _.each(la_checkHotelDtRowData, function (hotelData) {
                return _.extend(hotelData, self.rowData);
            });

            for (let j = 0; j < this.hotelDtRowData.length; j++) {
                // 檢查館別代號是否重複
                var lo_checkValue = _.extend(_.clone(this.hotelDtRowData[j]), _.clone(this.rowData));
                let la_keyVals = ["hotel_cod", "sales_cod"];
                var condKey = {};
                _.each(la_keyVals, function (field_name) {
                    condKey[field_name] = lo_checkValue[field_name] || "";
                });
                for (let k = 0; k < j; k++) {
                    if (_.findIndex([la_checkHotelDtRowData[k]], condKey) > -1) {
                        lo_checkResult.success = false;
                        lo_checkResult.msg = go_i18nLang["program"]["PMS0620020"].hotel_cod_repeat;
                        break;
                    }
                }
            }
            return lo_checkResult;
        },
        doSave: function () {
            this.rowData.class_cod = this.classCodSelectedOption[this.classCodSelectedOption.length - 1];

            let self = this;

            if (this.dgHoatelDt.endEditing()) {
                this.isLoadingDialog = true;
                this.loadingText = "Saving...";

                let lo_mnChkResult = this.mnDataValidate();
                let lo_dtChkResult = this.dtDataValidate();

                if (lo_mnChkResult.success == false && vm.tmpCud.deleteData.length == 0) {
                    alert(lo_mnChkResult.msg);
                    this.isLoadingDialog = false;
                }
                else if (lo_dtChkResult.success == false) {
                    alert(lo_dtChkResult.msg);
                    this.isLoadingDialog = false;
                }
                else {

                    let postRowData = this.convertChkVal(this.originFieldData, this.rowData);
                    postRowData.user_nos = postRowData.user_nos.split(":")[0];

                    postRowData["tab_page_id"] = 1;
                    postRowData["event_time"] = moment().format("YYYY/MM/DD HH:mm:ss");

                    _.each(this.dgHoatelDt.tmpCUD.createData, function (data) {
                        data["status_cod"] = data["status_cod1"];
                        if (data["nouse_dat"] != "") {
                            data["nouse_dat"] = data["nouse_dat"].split("/")[0] + data["nouse_dat"].split("/")[1];
                        }
                    });
                    _.each(this.dgHoatelDt.tmpCUD.updateData, function (data) {
                        data["status_cod"] = data["status_cod1"];
                        if (data["nouse_dat"] != "" && data["nouse_dat"].length == 7) {
                            data["nouse_dat"] = data["nouse_dat"].split("/")[0] + data["nouse_dat"].split("/")[1];
                        }
                    });

                    if (this.createStatus) {
                        vm.tmpCud.createData = [postRowData];
                        vm.tmpCud.dt_createData = this.dgHoatelDt.tmpCUD.createData;
                        vm.tmpCud.dt_updateData = this.dgHoatelDt.tmpCUD.updateData;
                        vm.tmpCud.dt_deleteData = this.dgHoatelDt.tmpCUD.deleteData;
                    }
                    else if (this.editStatus) {
                        vm.tmpCud.updateData = [postRowData];
                        vm.tmpCud.dt_createData = this.dgHoatelDt.tmpCUD.createData;
                        vm.tmpCud.dt_updateData = this.dgHoatelDt.tmpCUD.updateData;
                        vm.tmpCud.dt_deleteData = this.dgHoatelDt.tmpCUD.deleteData;
                        vm.tmpCud.dt_oriData = this.dgHoatelDt.tmpCUD.oriData;
                    }

                    vm.doSaveCud("PMS0620020", 1, function (result) {
                        if (result.success) {
                            alert(go_i18nLang["program"]["PMS0620020"].saveSuccess);
                            self.closeSingleGridDialog();
                            vm.initTmpCUD();
                        }
                        else {
                            alert(result.errorMsg);
                        }
                        self.isLoadingDialog = false;
                        self.dgHoatelDt.initTmpCUD();
                    });
                }
            }

        },
        //轉換checkbox值
        convertChkVal: function (pageField, singleData) {
            let lo_SingleData = _.clone(singleData);

            for (let i = 0; i < pageField.length; i++) {
                let lo_field = pageField[i];

                if (lo_field.ui_type == "checkbox") {
                    if (lo_SingleData[lo_field.ui_field_name] == "" || lo_SingleData[lo_field.ui_field_name] == false) {
                        lo_SingleData[lo_field.ui_field_name] = "N";
                    }
                    else {
                        lo_SingleData[lo_field.ui_field_name] = "Y";
                    }
                }
            }

            return lo_SingleData;
        }
    }
});

let vm = new Vue({
    el: "#PMS0620010App",
    components: {
        "single-grid-pms0620020-tmp": PMS0620020App
    },
    mounted: function () {
        this.go_funcPurview = (new FuncPurview("PMS0620010")).getFuncPurvs();
        this.initTmpCUD();
        this.fetchUserInfo();
        this.loadDataGridByPrgID();
    },
    data: {
        go_funcPurview: [],
        userInfo: {},
        tmpCud: {
            createData: [],
            updateData: [],
            deleteData: [],
            oriData: [],
            dt_createData: [],
            dt_updateData: [],
            dt_deleteData: [],
            dt_oriData: []
        },
        pageOneDataGridRows: [],
        pageOneFieldData: [],
        pageOneSingleGridFieldData: [], // PMS0620020 業務員(單筆)欄位
        pageOneSingleGridRowData: {}, // PMS0620020 業務員(單筆)資料
        oriSingleData: [],
        oriSingleGridFieldData: [],
        hotelDTDataGridRows: [], // PMS0620020 Property(多筆)欄位
        hotelDTFieldData: [], // PMS0620020 Property(多筆)資料
        classHSDataGridRows: [], // PMS0620020 組別異動紀錄(多筆)欄位
        classHSFieldData: [], // PMS0620020 組別異動紀錄(多筆)資料
        searchFields: [],
        searchCond: {},
        dialogVisible: false,
        dgIns: {},
        editingRow: {},
        isCreateStatus: false, //新增狀態
        isEditStatus: false, //編輯狀態
        isDeleteStatus: false, //刪除狀態
        isLoading: true,
        isModifiable: true, //決定是否可以修改
        openChangeLogDialog: false,
        allChangeLogList: [],
        BTN_action: false

    },
    watch: {
        editingRow: function(val){
            if(_.isEmpty(val)){
                this.go_funcPurview = (new FuncPurview("PMS0620010")).getFuncPurvs();
            }
        }
    },
    methods: {
        fetchUserInfo: function () {
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    vm.userInfo = result.userInfo;
                }
            });
        },
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
        loadDataGridByPrgID: function () {
            let self = this;
            let lo_searchCond = _.clone(this.searchCond);

            let lo_params = {
                prg_id: "PMS0620010",
                page_id: 1,
                searchCond: lo_searchCond
            };

            $.post("/api/fetchDataGridFieldData", lo_params, function (result) {
                if(self.searchFields.length <= 0){
                    vm.searchFields = result.searchFields;
                }
                vm.pageOneDataGridRows = result.dgRowData;
                vm.pageOneFieldData = JSON.parse(JSON.stringify(result.dgFieldsData));
                vm.showDataGrid();
            });
        },
        showDataGrid: function () {
            this.isLoading = false;
            vm.dgIns = new DatagridSingleGridClass();
            vm.dgIns.init("PMS0620010", "PMS0620010_dg", DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0620010_dg'));
            vm.dgIns.loadDgData(this.pageOneDataGridRows);
        },
        appendRow: function () {
            this.initTmpCUD();
            this.hotelDTDataGridRows.length = 0;
            this.classHSDataGridRows.length = 0;
            this.isCreateStatus = true;
            this.isEditStatus = false;
            this.editingRow = {};

            $.post("/api/sales/addFuncRule_PMS0620020", {prg_id: "PMS0620020", page_id: 1}, function (result) {
                if (result.success) {
                    vm.pageOneSingleGridRowData = result.defaultValues;
                    vm.showSingleGridDialog();
                } else {
                    alert(result.errorMsg);
                }
            });
        },
        removeRow: function () {
            this.BTN_action = true;
            let self = this;
            let delRow = $('#PMS0620010_dg').datagrid('getSelected');

            if (!delRow) {
                alert(go_i18nLang["SystemCommon"].SelectData);
                this.BTN_action = false;
            }
            else {

                let chkDelRow = confirm(go_i18nLang["SystemCommon"].check_delete);
                if (chkDelRow) {
                    delRow["tab_page_id"] = 1;
                    delRow["event_time"] = moment().format("YYYY/MM/DD HH:mm:ss");
                    vm.tmpCud.deleteData.push(delRow);

                    $("#gridEdit").val(vm.tmpCUD);

                    self.doSaveCud("PMS0620020", 1, function (result) {
                        if (result.success) {
                            alert(go_i18nLang["program"]["PMS0620020"].delSuccess);
                            $('#PMS0620010_dg').datagrid('deleteRow', $('#PMS0620010_dg').datagrid('getRowIndex', delRow));
                        }
                        else {
                            alert(result.errorMsg);
                            _.without(vm.tmpCud.deleteData, delRow);
                        }
                    });
                    vm.initTmpCUD();
                    vm.BTN_action = false;
                }
            }

        },
        editRow: function () {
            this.initTmpCUD();
            this.hotelDTDataGridRows.length = 0;
            this.classHSDataGridRows.length = 0;
            this.isCreateStatus = false;
            this.isEditStatus = true;
            this.editingRow = {};

            let editRow = $('#PMS0620010_dg').datagrid('getSelected');

            if (!editRow) {
                alert(go_i18nLang["SystemCommon"].SelectData);
            }
            else {
                editRow["prg_id"] = "PMS0620020";
                this.editingRow = editRow;
                vm.showSingleGridDialog();
            }
        },
        showSingleGridDialog: function () {
            let self = this;
            this.dialogVisible = true;
            let maxHeight = document.documentElement.clientHeight - 70; //browser 高度 - 70功能列
            let gridWt = $('.grid-item label').width() + $('.grid-item input').width() + 14; // 抓不到width
            let dialogWt = gridWt * 2 + 250;
            let height = 10 * 50; // 預設一個row 高度
            let dialog = $("#singleGridPMS0620020").removeClass('hide').dialog({
                autoOpen: true,
                modal: true,
                height: _.min([maxHeight, height]),
                title: "PMS0620020",
                minWidth: _.min([dialogWt, 1000]),
                // width: _.min([dialogWt, 1000]),
                maxHeight: maxHeight,
                resizable: true,
                buttons: "#dialogBtns",
                onBeforeClose: function () {
                    self.editingRow = {};
                    self.isEditStatus = false;
                    self.isCreateStatus = false;
                }
            });
            dialog.dialog("open");

            $(".singleGridContent").css("height", _.min([maxHeight, height]) + 20);
        },
        showPopUpGridDialog: function () {
            this.dialogVisible = true;
            let height = document.documentElement.clientHeight - 60; //browser 高度 - 60功能列
            let width = document.documentElement.clientWidth / 2; //browser 寬度 - 200功能列

            let dialog = $("#dataPopUpGridDialog").dialog({
                autoOpen: false,
                modal: true,
                height: height,
                width: width,
                title: "PMS0620020",
                resizable: true
            });
            dialog.dialog("open");
        },
        doSaveCud: function (prg_id, page_id, callback) {
            let self = this;
            let lo_params = {
                prg_id: prg_id,
                page_id: page_id,
                tmpCUD: this.tmpCud
            };

            $.post("/api/doOperationSave", lo_params, function (result) {
                self.loadDataGridByPrgID();
                callback(result);
            });
        }
    }
});

var go_rtnResult = [];

function findByValue(obj, id) {
    let result;
    for (let p in obj) {
        if (obj.value === id) {
            return obj;
        }
        if (typeof obj[p] === 'object') {
            result = findByValue(obj[p], id);

            if (result) {
                go_rtnResult = [];
                go_rtnResult.push(obj[p]);
                return result;
            }
        }

    }
    return result;
}

function flattenArray(array, la_list) {
    _.each(array, function (object) {
        if (!_.isUndefined(object.children)) {
            la_list.push(object);
            flattenArray(object.children, la_list);
        }
        else {
            la_list.push(object);
            return;
        }
    });
}