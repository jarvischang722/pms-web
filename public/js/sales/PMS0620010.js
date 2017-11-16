/**
 * Created by 柏浩 on 2017/10/11.
 * 程式編號: PMS0620010
 * 程式名稱: 業務員作業
 */
var vmHub = new Vue();

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


Vue.component('single-grid-pms0620020-tmp', {
    template: '#singleGridPMS0620020Tmp',
    props: ["singleData", "isModifiable", "editStatus", "createStatus"],
    data: function () {
        return {
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
            classCodSelectedOption: []
        };
    },
    created: function () {
        var self = this;
        vmHub.$on('updateBackSelectData', function (chooseData) {
            self.rowData = _.extend(self.rowData, chooseData);
        });
    },
    mounted: function () {
        this.gs_active = "hotelDt";
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
            var self = this;
            var la_originData = [this.$parent.originData];
            var la_singleData = [this.rowData];
            var la_diff = _.difference(la_originData, la_singleData);

            // 判斷資料是否有異動
            if (la_diff.length != 0) {
                this.isUpdate = true;
            }

            if (!_.isEmpty(rule_func_name.trim())) {
                var postData = {
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
        chkClickPopUpGrid: function (field) {
            if (field.ui_type == "popupgrid") {
                var params = {
                    prg_id: "PMS0620020",
                    fields: field,
                    singleRowData: JSON.parse(JSON.stringify(this.rowData))
                };

                $.post("/api/popUpGridData", params, function (result) {
                    if (result != null) {
                        vm.selectPopUpGridData = result.showDataGrid;
                        vmHub.$emit('showPopUpDataGrid', result);
                        vm.showPopUpGridDialog();
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
            var self = this;
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
            var self = this;

            //新增的狀況
            if (Object.keys(this.singleData).length == 0) {
                $.post("/api/sales/addFuncRule_PMS0620020", {prg_id: "PMS0620020", page_id: 1}, function (result) {
                    if (result.success) {
                        self.rowData = result.defaultValues;
                    } else {
                        alert(result.errorMsg);
                    }
                    self.showDtDataGrid();
                });
            }
            //編輯的狀況
            else {
                $.post("/api/sales/qrySalesMn_PM0620020", singleData, function (result) {
                    if (result.success) {
                        self.originRowData = _.clone(result.rtnObject[0]['rowData']);
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

                    //攤平資料(將資料降維成二維)
                    var list = _(go_rtnResult).chain()
                        .zip(_(go_rtnResult).pluck('children'))
                        .flatten()
                        .compact()
                        .value();

                    self.classCodSelectedOption = [];
                    var groupList = _.groupBy(list, "parent_cod");
                    groupList = _.toArray(groupList).reverse();
                    var ls_parent_cod = "";

                    _.each(groupList, function (la_list) {
                        var lo_data;
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
                    self.showDtDataGrid();
                });
            }

        },
        showDtDataGrid: function () {
            this.dgHoatelDt = new DatagridBaseClass();
            this.dgHoatelDt.init("PMS0620020", "hotelDt_dg", DatagridFieldAdapter.combineFieldOption(this.hotelDtFieldData, 'hotelDt_dg'), this.hotelDtFieldData);
            this.dgHoatelDt.loadDgData(this.hotelDtRowData);
            this.dgHoatelDt.getOriDtRowData(this.oriHotelDtRowData);

            this.dgClassHs = new DatagridSingleGridClass();
            this.dgClassHs.init("PMS0620020", "classHs_dg", DatagridFieldAdapter.combineFieldOption(this.classHsFieldData, 'classHs_dg'));
            this.dgClassHs.loadDgData(this.classHsRowData);

        },
        appendDtRow: function () {
            this.dgHoatelDt.appendRow();
        },
        removeDtRow: function () {
            this.dgHoatelDt.removeRow();
        },
        doChangeTraff: function (tab, event) {
            this.gs_active = tab.name;
        },
        loadChangeLog: function () {
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
        //檢查欄位
        dataValidate: function () {
            var self = this;
            var lo_checkResult;

            // 單筆資料檢查
            for (var i = 0; i < this.originFieldData.length; i++) {
                var lo_field = this.originFieldData[i];
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

            // dt資料檢查
            var lo_checkHotelDtRowData = _.clone(this.hotelDtRowData);
            _.each(lo_checkHotelDtRowData, function (hotelData) {
                return _.extend(hotelData, self.rowData);
            });
            // 檢查館別代號是否重複
            for (var j = 0; j < this.hotelDtRowData.length; j++) {
                var lo_checkValue = _.extend(_.clone(this.hotelDtRowData[j]), _.clone(this.rowData));
                var la_keyVals = ["hotel_cod", "sales_cod"];
                var condKey = {};
                _.each(la_keyVals, function (field_name) {
                    condKey[field_name] = lo_checkValue[field_name] || "";
                });
                for (var k = 0; k < j; k++) {
                    if (_.findIndex([lo_checkHotelDtRowData[k]], condKey) > -1) {
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
            var self = this;
            this.isSaving = true;

            if (this.dgHoatelDt.endEditing()) {
                var lo_chkResult = this.dataValidate();
                if (lo_chkResult.success == false && vm.tmpCud.deleteData.length == 0) {
                    alert(lo_chkResult.msg);
                    this.isSaving = false;
                }
                else {
                    var postRowData = this.convertChkVal(this.originFieldData, this.rowData);
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
                        vm.tmpCud.dt_oriUpdateData = this.dgHoatelDt.tmpCUD.oriUpdateData;
                    }

                    vm.doSaveCud("PMS0620020", 1, function (result) {
                        if (result.success) {
                            alert(go_i18nLang["program"]["PMS0620020"].saveSuccess);
                            self.closeSingleGridDialog();
                        }
                        else {
                            alert(result.errorMsg);
                        }

                        vm.initTmpCUD();
                    });
                }
            }


        },
        //轉換checkbox值
        convertChkVal: function (pageField, singleData) {
            var lo_SingleData = _.clone(singleData);

            for (var i = 0; i < pageField.length; i++) {
                var lo_field = pageField[i];

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

            chooseData["user_nos"] = chooseData["user_nos"] + ": " + chooseData["user_cname"];
            vmHub.$emit('updateBackSelectData', chooseData);
            $("#dataPopUpGridDialog").dialog('close');
        },
        txtSearchChangeText: function (keyContent) {
            var allData = this.gridData;
            var selectFieldName = $('#cbSelect').val();
            var selectCondition = $('#txtSelectCondition').val();

            var dataGrid = _.filter(allData, function (row) {
                if (row[selectFieldName].includes(selectCondition))
                    {return row;}
            });
            $('#chooseGrid').datagrid('loadData', dataGrid);

        }
    }
});


var vm = new Vue({
    el: "#PMS0620010App",
    mounted: function () {
        this.initTmpCUD();
        this.fetchUserInfo();
        this.loadDataGridByPrgID();
        this.loadSingleGridPageField();
    },
    data: {
        userInfo: {},
        tmpCud: {
            createData: [],
            updateData: [],
            deleteData: [],
            dt_createData: [],
            dt_updateData: [],
            dt_deleteData: [],
            dt_ori_updateData: []
        },
        pageOneDataGridRows: [],
        pageOneFieldData: [],
        pageOneSingleGridFieldData: [],     // PMS0620020 業務員(單筆)欄位
        pageOneSingleGridRowData: {},       // PMS0620020 業務員(單筆)資料
        oriSingleData: [],
        oriSingleGridFieldData: [],
        hotelDTDataGridRows: [],            // PMS0620020 Property(多筆)欄位
        hotelDTFieldData: [],               // PMS0620020 Property(多筆)資料
        classHSDataGridRows: [],            // PMS0620020 組別異動紀錄(多筆)欄位
        classHSFieldData: [],               // PMS0620020 組別異動紀錄(多筆)資料
        searchFields: [],
        searchCond: {
            sales_cod: "",
            sales_nam: "",
            class_cod: "",
            hotel_sales: "all",
            bq_sales: "all",
            member_sales: "all",
            status_cod: "N"
        },
        dialogVisible: false,
        dgIns: {},
        editingRow: {},
        isCreateStatus: false,    //新增狀態
        isEditStatus: false,      //編輯狀態
        isDeleteStatus: false,    //刪除狀態
        isLoading: true,
        isModifiable: true,       //決定是否可以修改
        openChangeLogDialog: false,
        allChangeLogList: []

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
                dt_createData: [],
                dt_updateData: [],
                dt_deleteData: [],
                dt_oriUpdateData: []
            };
        },
        loadDataGridByPrgID: function () {

            $.post("/api/prgDataGridDataQuery", {prg_id: "PMS0620010"}, function (result) {
                vm.searchFields = result.searchFields;
                vm.pageOneDataGridRows = result.dataGridRows;
                vm.pageOneFieldData = result.fieldData;
                vm.showDataGrid();
            });
        },
        loadSingleGridPageField: function () {
            $.post("/api/sales/qrySingleGridFieldData_PM0620020", {prg_id: "PMS0620020"}, function (result) {
                var lo_fieldData = result.salesMnField;
                vm.oriSingleGridFieldData = lo_fieldData;
                vm.pageOneSingleGridFieldData = _.values(_.groupBy(_.sortBy(lo_fieldData, "row_seq"), "row_seq"));
                vm.hotelDTFieldData = result.hotelDtField;
                vm.classHSFieldData = result.classHsField;

            });
        },
        fetchSingleData: function (editingRow, callback) {
            this.initTmpCUD();
            this.editingRow = editingRow;

            editingRow["prg_id"] = "PMS0620020";
            $.post("/api/sales/qrySalesMn_PM0620020", editingRow, function (result) {
                if (result.success) {
                    vm.isModifiable = result.rtnObject[0]['isModifiable'];
                    vm.originData = _.clone(result.rtnObject[0]['rowData']);
                    vm.pageOneSingleGridRowData = result.rtnObject[0]['rowData'];
                    vm.hotelDTDataGridRows = result.rtnObject[1]['dataGridDataHotelDT']['dataGridRows'];
                    vm.classHSDataGridRows = result.rtnObject[2]['dataGridDataClassHs']['dataGridRows'];

                    callback(true);
                }
                else {
                    callback(false);
                    console.log(result.errorMsg);
                }
            });

        },
        showDataGrid: function () {
            this.isLoading = false;
            vm.dgIns = new DatagridSingleGridClass();
            vm.dgIns.init("PMS0620010", "PMS0620010_dg", DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, 'PMS0620010_dg'));
            vm.dgIns.loadDgData(this.pageOneDataGridRows);
        },
        doSearch: function () {
            var lo_searcgCond = _.clone(this.searchCond);

            lo_searcgCond = _.pick(lo_searcgCond, function (val) {
                return val != "all";
            });

            lo_searcgCond = _.pick(lo_searcgCond, function (val) {
                return val != "";
            });

            $.post("/api/prgDataGridDataQuery", {prg_id: "PMS0620010", searchCond: lo_searcgCond}, function (result) {
                vm.searchFields = result.searchFields;
                vm.pageOneDataGridRows = result.dataGridRows;
                vm.pageOneFieldData = result.fieldData;
                vm.showDataGrid();
            });

        },
        doClear: function () {
            this.searchCond = {
                sales_cod: "",
                sales_nam: "",
                class_cod: "",
                hotel_sales: "all",
                bq_sales: "all",
                member_sales: "all",
                status_cod: "all"
            };
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
            var self = this;
            var delRow = $('#PMS0620010_dg').datagrid('getSelected');

            if (!delRow) {
                alert(go_i18nLang["SystemCommon"].SelectData);
            }
            else {

                var chkDelRow = confirm(go_i18nLang["SystemCommon"].check_delete);
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

            var editRow = $('#PMS0620010_dg').datagrid('getSelected');

            if (!editRow) {
                alert(go_i18nLang["SystemCommon"].SelectData);
            }
            else {
                vm.fetchSingleData(editRow, function (result) {
                    if (result) {
                        vm.showSingleGridDialog();
                    }
                    else {
                        alert("error");
                    }
                });
            }
        },
        showSingleGridDialog: function () {
            this.dialogVisible = true;
            var maxHeight = document.documentElement.clientHeight - 70; //browser 高度 - 70功能列
            var height = 10 * 50; // 預設一個row 高度
            var dialog = $("#singleGridPMS0620020").removeClass('hide').dialog({
                autoOpen: true,
                modal: true,
                height: _.min([maxHeight, height]),
                title: "PMS0620020",
                minWidth: 1000,
                maxHeight: maxHeight,
                resizable: true,
                buttons: "#dialogBtns"
            });
            dialog.dialog("open");

            $(".singleGridContent").css("height", _.min([maxHeight, height]) + 20);
        },
        showPopUpGridDialog: function () {
            this.dialogVisible = true;
            var height = document.documentElement.clientHeight - 60; //browser 高度 - 60功能列
            var width = document.documentElement.clientWidth / 2;    //browser 寬度 - 200功能列

            var dialog = $("#dataPopUpGridDialog").dialog({
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
            var self = this;
            var lo_params = {
                prg_id: prg_id,
                page_id: page_id,
                tmpCUD: this.tmpCud
            };

            $.post("/api/gateway/doOperationSave", lo_params, function (result) {
                self.loadDataGridByPrgID();
                callback(result);
            });
        }
    }
});

var go_rtnResult = [];

function findByValue(obj, id) {
    var result;
    for (var p in obj) {
        if (obj.value === id) {
            return obj;
        } else {
            if (typeof obj[p] === 'object') {
                result = findByValue(obj[p], id);

                if (result) {
                    go_rtnResult = [];
                    go_rtnResult.push(obj[p]);
                    return result;
                }
            }
        }
    }
    return result;
}