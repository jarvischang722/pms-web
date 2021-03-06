/**
 * Created by Jun on 2017/2/23.
 */
waitingDialog.hide();
let prg_id = $("#prg_id").val();
let vmHub = new Vue;

/** DatagridRmSingleGridClass **/
function DatagridSingleGridClass() {
}

DatagridSingleGridClass.prototype = new DatagridBaseClass();
DatagridSingleGridClass.prototype.onClickCell = function (index, row) {
};
DatagridSingleGridClass.prototype.onClickRow = function (index, row) {
    vm.fetchSingleData(row, function (success) {
        vm.showSingleGridDialog();
    });
    vm.dgIns.editIndex = index;
};

/*** Class End  ***/

//Dt 多語編輯
Vue.component("multiLang-dialog-tmp", {
    template: "#multiLangDialogTmp",
    props: ["sys_locales", "dtMultiLangField", "endMultiLangEditing"],
    data: function () {
        return {
            dtMultiLangEditIndex: undefined
        };
    },
    created: function () {

        let self = this;
        vmHub.$on("editDtMultiLang", function (data) {
            self.editDtMultiLang(data.rowIdx);
        });
        vmHub.$on("updateDtMultiLangField", function (data) {
            self.dtMultiLangField = data.dtMultiLangField;
            self.initDtMultiLangDg(self.dtMultiLangField);
        });


    },
    methods: {
        initDtMultiLangDg: function (dtMultiLangField) {
            let self = this;
            let columnsData = [{
                type: "textbox",
                title: "Locale",
                field: "display_locale",
                width: 70,
                editor: {
                    options: {
                        readonly: true
                    }
                }
            }];
            columnsData = _.union(columnsData, DatagridFieldAdapter.combineFieldOption(dtMultiLangField, "multiLangDG"));
            let width = 10;
            _.each(columnsData, function (column) {
                width += Number(column.width);
            });
            $("#multiLangDG").datagrid({
                columns: [columnsData],
                remoteSort: false,
                singleSelect: true,
                selectOnCheck: true,
                checkOnSelect: true,
                width: width,
                onClickCell: function (index, field) {
                    if (self.dtMultiLangEditIndex != index) {
                        if (self.endMultiLangEditing()) {
                            $("#multiLangDG").datagrid("selectRow", index).datagrid("beginEdit", index);
                            let ed = $("#multiLangDG").datagrid("getEditor", {index: index, field: field});
                            if (ed) {
                                ($(ed.target).data("textbox") ? $(ed.target).textbox("textbox") : $(ed.target)).focus();
                            }
                            self.dtMultiLangEditIndex = index;
                        }
                    }

                }
            });

        },
        endMultiLangEditing: function () {
            if (this.dtMultiLangEditIndex == undefined) {
                return true;
            }
            if ($("#multiLangDG").datagrid("validateRow", this.dtMultiLangEditIndex)) {
                $("#multiLangDG").datagrid("endEdit", this.dtMultiLangEditIndex);
                this.multiLangEditIndex = undefined;
                return true;
            }
            return false;

        },
        //更新Dt多語內容
        updateDtMultiLangData: function (gridData) {
            $("#multiLangDG").datagrid("loadData", {total: gridData.length, rows: gridData});
        },
        getRowMultiLangContent: function (rowIdx) {
            let self = this;
            let rowData = $("#dt_dg").datagrid("getRows")[rowIdx];
            let params = {
                rowData: rowData,
                prg_id: prg_id,
                page_id: 2
            };

            if (!_.isUndefined(rowData.createRow) && _.isEqual(rowData.createRow, "Y")) {
                let multiLangContent = [];
                _.each(this.sys_locales, function (locale) {
                    multiLangContent.push({
                        locale: locale.lang,
                        display_locale: locale.name
                    });
                });
                self.updateDtMultiLangData(multiLangContent);
                return;
            }

            BacUtils.doHttpPostAgent("/api/multiLangFieldContentByKey", params, function (result) {
                self.updateDtMultiLangData(result.multiLangContent);
            });
        },
        closeMultiLangDialog: function () {
            $("#multiLangDialog").dialog("close");
        },
        //寫入此筆編輯Row
        saveMultiLang: function () {
            if (this.endMultiLangEditing()) {
                let selectIndex = $("#dt_dg").datagrid("getRowIndex", $("#dt_dg").datagrid("getSelected"));
                let multiLang = $("#multiLangDG").datagrid("getRows");
                let updateRow = $("#dt_dg").datagrid("getSelected");
                updateRow["multiLang"] = multiLang;

                $("#dt_dg").datagrid("updateRow", {
                    index: selectIndex,
                    row: updateRow
                });

                vmHub.$emit("tempExecData", $("#dt_dg").datagrid("getSelected"));
                this.closeMultiLangDialog();
            }
        },
        //打開Dt 多語編輯視窗
        openDtMultiLangDiaolg: function () {
            let width = 500;
            let maxWidth = 500;
            let dialog = $("#multiLangDialog").dialog({
                autoOpen: false,
                modal: true,
                title: "Multi Language",
                height: 250,
                width: 750,
                maxWidth: _.min([width, maxWidth]),
                resizable: true,
                buttons: "#multiDialogBtns"
            });

            dialog.dialog("open");
        },
        //Dt多語編輯
        editDtMultiLang: function (rowIdx) {
            this.getRowMultiLangContent(rowIdx);
            this.openDtMultiLangDiaolg();
        }
    }

});

/** 欄位多語系Dialog **/
Vue.component("field-multi-lang-dialog-tmp", {
    template: "#fieldMultiLangDialogTmp",
    props: ["sys_locales", "singleData"],
    data: function () {
        return {
            editingLangField: "",
            multiLangContentList: [],
            fieldMultiLang: {},
            showMultiLangDialog: false
        };
    },
    created: function () {
        let self = this;
        vmHub.$on("editFieldMultiLang", function (fieldInfo) {
            self.getFieldMultiLangContent(fieldInfo);
        });
    },
    methods: {
        getFieldMultiLangContent: function (fieldInfo) {
            this.editingLangField = fieldInfo.ui_field_name;
            let self = this;
            let params = {
                rowData: this.singleData,
                prg_id: fieldInfo.prg_id,
                page_id: 2,
                ui_field_name: fieldInfo.ui_field_name
            };

            BacUtils.doHttpPostAgent("/api/fieldAllLocaleContent", params, function (result) {
                self.multiLangContentList = result.multiLangContentList;
                self.openFieldMultiLangDialog(fieldInfo.ui_display_name);
            });
        },
        openFieldMultiLangDialog: function (fieldName) {
            let width = 300;
            let height = (this.sys_locales.length + 1) * 40 + 100;
            let dialog = $("#fieldMultiLangTmpDialog").dialog({
                autoOpen: false,
                modal: true,
                title: fieldName,
                height: height,
                width: width,
                resizable: false,
                buttons: "#fieldMultiDialogBtns"
            });

            dialog.dialog("open");
        },
        closeFieldMultiLangDialog: function () {
            $("#fieldMultiLangTmpDialog").dialog("close");
        },
        saveFieldMultiLang: function () {

            let multiLang = [];
            //TODO 暫時用jquery 取資料
            $(".multi_lang_input").each(function () {
                let tmpObj = {};
                tmpObj["locale"] = $(this).data("locale");
                tmpObj[$(this).attr("id")] = $(this).val();
                if (!_.isEmpty($(this).val())) {
                    multiLang.push(tmpObj);
                }
            });

            this.singleData["multiLang"] = multiLang;
            this.closeFieldMultiLangDialog();
        }
    }

});

//跳窗將資料選回去單筆欄位
Vue.component("text-select-grid-dialog-tmp", {
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
        vmHub.$on("showPopUpDataGrid", function (result) {
            self.showPopUpDataGrid(result);
        });
    },
    methods: {
        //顯示點選popupgrid跳出來的視窗
        showPopUpDataGrid: function (result) {
            $("#txtSelectCondition").val("");
            let self = this;
            let textDataGrid = result.showDataGrid;
            let updateFieldName = result.updateFieldNameTmp;
            let fieldNameChangeLanguage = result.fieldNameChangeLanguageTmp;
            this.fieldNameConditionTmp = [];
            this.fieldConditionTmp = [];
            this.gridData = [];
            delete textDataGrid ["errorMsg"];
            let columnsData = [];
            let textDataGridArray = Object.keys(textDataGrid).map(function (key) {
                return textDataGrid[key];
            });
            for (var col in textDataGrid[0]) {
                _.each(fieldNameChangeLanguage, function (name, field) {
                    if (col == field) {
                        columnsData.push({
                            type: "textbox",
                            field: col,
                            title: name,
                            width: 200,
                            align: "left"
                        });
                        self.fieldNameConditionTmp.push({value: field, display: name});
                        self.fieldConditionTmp.push({value: field});
                    }
                });
            }

            self.gridData = textDataGridArray;
            $("#chooseGrid").datagrid({
                columns: [columnsData],
                singleSelect: true,
                data: textDataGridArray,
                width: 500
            }).datagrid("columnMoving");
            self.updateFieldNameTmp = updateFieldName;
        },
        //將選擇到的資料帶回Page2
        chooseDataBackGridSingle: function () {
            let self = this;
            let selectTable = $("#chooseGrid").datagrid("getSelected");
            let chooseData = self.updateFieldNameTmp;
            let updateFieldName = this.updateFieldNameTmp;

            if (selectTable != null) {
                _.each(selectTable, function (selectValue, selectField) {
                    _.each(updateFieldName, function (updateValue, updateField) {
                        if (selectField == updateValue) {
                            chooseData[updateField] = selectValue;
                        }
                    });
                });
            } else {
                if (prg_id == "PMS0840030") {
                    _.each(chooseData, function (chooseValue, chooseField) {
                        chooseData[chooseField] = chooseField == "inv_sta" ? "N" : ""; //SAM20170930 目前沒招了，先寫死在這for PMS0840030
                    });
                }
                _.each(chooseData, function (val, key) {
                    chooseData[key] = "";
                });

            }
            vm.singleData = _.extend(vm.singleData, chooseData);
            vm.isRuleComplete = true;
            $("#dataPopUpGridDialog").dialog("close");
        },

        txtSearchChangeText: function (keyContent) {
            let allData = this.gridData;
            let selectFieldName = $("#cbSelect").val();
            let selectCondition = $("#txtSelectCondition").val();

            let dataGrid = _.filter(allData, function (row) {
                if (row[selectFieldName].includes(selectCondition)) {
                    return row;
                }
            });
            $("#chooseGrid").datagrid("loadData", dataGrid);

        }
    }
});

/** 編輯新增Dialog Component **/
Vue.component("sigle-grid-dialog-tmp", {
    template: "#sigleGridDialogTmp",
    props: ["editStatus", "createStatus", "deleteStatus", "editingRow", "pageOneDataGridRows", "pageTwoDataGridFieldData",
        "singleData", "pageTwoFieldData", "tmpCud", "isModifiable", "dialogVisible", "selectPopUpGridData", "updateBackSelectData"],
    data: function () {
        return {
            isFistData: false,
            isLastData: false,
            dtEditIndex: undefined,
            key_nos: 0,
            isEditingForFieldRule: false,
            isVerified: true,
            fieldChecking: false, //是否在檢查欄位中
            BTN_action: false,
            timer: null
        };
    },
    watch: {
        editingRow: function (newRow, oldRow) {
            this.$parent.editingRow = newRow;
            let nowDatagridRowIndex = $("#dg").datagrid("getRowIndex", newRow);
            $("#dg").datagrid("selectRow", nowDatagridRowIndex);

            if ($("#dg").datagrid("getRowIndex", newRow) == 0) {
                //已經到第一筆
                this.isFistData = true;
                this.isLastData = false;
                if ($("#dg").datagrid("getRowIndex", newRow) == this.pageOneDataGridRows.length - 1) {
                    this.isLastData = true;
                }

            }
            else if ($("#dg").datagrid("getRowIndex", newRow) == this.pageOneDataGridRows.length - 1) {
                //已經到最後一筆
                this.isFistData = false;
                this.isLastData = true;
            }
            else {

                this.isFistData = false;
                this.isLastData = false;
            }

        }
    },
    created: function () {
        let self = this;
        vmHub.$on("showDtDataGrid", function (dtDataGridRows) {
            self.showDtDataGrid(dtDataGridRows);
        });
        vmHub.$on("tempExecData", function (row) {
            self.tempExecData(row);
        });
    },
    methods: {
        //打開單欄多語編輯
        editFieldMultiLang: function (fieldInfo) {
            vmHub.$emit("editFieldMultiLang", fieldInfo);
        },
        //改成編輯中
        changeEditingForFieldRule: function (rule_func_name) {
            if (!_.isUndefined(rule_func_name) && !_.isEmpty(rule_func_name)) {
                this.isEditingForFieldRule = true;
            }
        },
        //檢查欄位規則，在離開欄位時
        chkFieldRule: function (ui_field_name, rule_func_name) {
            let self = this;

            if (vm.isRuleComplete == false) {
                if (this.timer == null) {
                    this.timer = setInterval(function () {
                        self.chkFieldRule(ui_field_name, rule_func_name);
                    }, 1000);
                }
                return;
            }

            clearInterval(this.timer);
            this.timer = null;
            if (this.isVerified == false) {
                return;
            }

            if (!_.isEmpty(rule_func_name.trim())) {
                _.each(this.singleData, function (value, key) {
                    if (_.isUndefined(value)) {
                        self.singleData[key] = "";
                    }
                });

                let postData = {
                    prg_id: prg_id,
                    rule_func_name: rule_func_name,
                    validateField: ui_field_name,
                    singleRowData: JSON.parse(JSON.stringify(vm.singleData)),
                    oriSingleRowData: this.$parent.oriSingleData
                };

                BacUtils.doHttpPostAgent("/api/chkFieldRule", postData, function (result) {
                    self.isEditingForFieldRule = false;
                    vm.isRuleComplete = true;
                    if (result.success) {
                        self.isVerified = true;
                    } else {
                        self.isVerified = false;
                        alert(result.errorMsg);
                    }

                    //連動帶回的值
                    if (!_.isUndefined(result.effectValues)) {
                        self.singleData = _.extend(self.singleData, result.effectValues);
                        self.isVerified = true;
                    }
                    //是否要show出訊息
                    if (result.showAlert) {
                        alert(result.alertMsg);
                    }

                    //是否要show出詢問視窗
                    if (result.showConfirm) {
                        if (confirm(result.confirmMsg)) {
                            //有沒有要再打一次ajax到後端
                            if (result.isGoPostAjax) {
                                BacUtils.doHttpPostAgent(result.ajaxURL, postData, function (result) {
                                    if (!result.success) {
                                        alert(result.errorMsg);
                                    }
                                });
                            }
                        }
                    }

                });
            }
        },
        //跳窗選擇多欄位
        chkClickPopUpGrid: function (field) {
            this.changeEditingForFieldRule(field.rule_func_name);
            if (field.ui_type == "popupgrid") {
                let params = {
                    prg_id: prg_id,
                    fields: field,
                    singleRowData: JSON.parse(JSON.stringify(this.singleData))
                };

                BacUtils.doHttpPostAgent("/api/popUpGridData", params, function (result) {
                    if (result != null) {
                        vm.selectPopUpGridData = result.showDataGrid;
                        vmHub.$emit("showPopUpDataGrid", result);
                        vm.showPopUpGridDialog();
                    }
                });
            }
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
            let nowRowIndex = $("#dg").datagrid("getRowIndex", this.editingRow);
            this.editingRow = this.pageOneDataGridRows[nowRowIndex - 1];
            this.emitFetchSingleData();

        },
        //下一筆
        toNextData: function () {
            let nowRowIndex = $("#dg").datagrid("getRowIndex", this.editingRow);
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
            let self = this;
            let q = confirm("Are you sure delete those data?");
            if (q) {
                //刪除前檢查
                BacUtils.doHttpPostAgent("/api/deleteFuncRule", {
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
            this.$emit("close-single-grid-dialog");
        },
        //抓取單筆資料
        emitFetchSingleData: function () {
            let params = this.editingRow;
            this.$emit("fetch-single-data", params, function (success) {
            });
        },
        //新增模式
        emitAppendRow: function () {
            this.$emit("append-row");
        },

        initRuleComplete: function (ui_field_name, rule_func_name) {
            if (!_.isEmpty(rule_func_name.trim())) {
                vm.isRuleComplete = false;
            }
        },

        //儲存新增或修改資料
        doSaveGrid: function (saveAfterAction) {
            let self = this;
            if (vm.isRuleComplete == false) {
                if (this.timer == null) {
                    this.timer = setInterval(function () {
                        self.doSaveGrid(saveAfterAction);
                    }, 1000);
                }
                return;
            }

            clearInterval(this.timer);
            this.timer = null;
            if (this.isVerified == false) {
                return;
            }

            if (!this.isEditingForFieldRule && this.isVerified && this.endDtEditing()) {
                let targetRowAfterDelete = {}; //刪除後要指向的資料
                if (this.deleteStatue) {
                    let rowsNum = $("#dg").datagrid("getRows").length;
                    let currentRowIdx = $("#dg").datagrid("getRowIndex", self.editingRow); //目前索引
                    if (currentRowIdx == rowsNum - 1) {
                        //刪除的資料已經是最後一筆 就取datagrid最末筆
                        targetRowAfterDelete = self.pageOneDataGridRows[currentRowIdx - 1];

                    } else {
                        //取下一筆
                        targetRowAfterDelete = self.pageOneDataGridRows[currentRowIdx + 1];
                    }
                    this.editingRow = targetRowAfterDelete;
                }

                if (this.createStatus) {
                    this.editingRow = this.pageOneDataGridRows[0];
                    this.tmpCud.createData = [this.singleData];
                }
                else if (this.editStatus) {
                    this.tmpCud.editData = [this.singleData];
                }
                this.BTN_action = true;
                this.$emit("do-save-cud", function (success) {
                    self.BTN_action = false;
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
                            if ($("#dg").datagrid("getRows").length > 0) {
                                self.emitFetchSingleData(); //做完操作，重load單筆
                            } else {
                                //連一筆都沒有就關掉視窗
                                self.emitCloseGridDialog();
                            }
                            self.deleteStatue = false;
                        }
                    }
                });
            }

        },

        /**  DT Data grid event**/
        //page2 顯示dt的datagrid欄位屬性與資料
        showDtDataGrid: function (dtDataGridRows) {

            let self = this;
            let columnsData = [];
            this.$emit("combine-field", this.pageTwoDataGridFieldData, function (columns) {
                columnsData = columns;
            });
            let hasMultiLangField = _.filter(this.pageTwoDataGridFieldData, function (field) {
                return field.multi_lang_table != "";
            }).length > 0 ? true : false;

            if (hasMultiLangField) {
                columnsData.unshift({
                    type: "textbox",
                    title: "Multi Lang",
                    field: "langAction",
                    align: "center",
                    width: 70,
                    formatter: function (value, row, index) {
                        return '<a  href="javascript:void(0)" onclick="editDtMultiLang(' + index + ')">Edit</a>';
                    }

                });
            }

            $("#dt_dg").datagrid({
                toolbar: "#tb",
                columns: [columnsData],
                collapsible: true,
                remoteSort: false,
                singleSelect: true,
                selectOnCheck: true,
                checkOnSelect: true,
                data: dtDataGridRows,
                onEndEdit: function (index, row, changes) {
                    self.tempExecData(row);
                },
                onDropColumn: function () {
                    //當移動順序欄位時
                    self.doSaveColumnFields();
                },
                onResizeColumn: function () {
                    //當欄位時寬度異動時
                    self.doSaveColumnFields();
                },
                onClickCell: self.onClickDtCell,

                onClickRow: self.onClickDtRow


            }).datagrid("columnMoving");
        },

        onClickDtCell: function (index, field) {
            if (this.dtEditIndex != index) {
                if (this.endDtEditing()) {
                    $("#dt_dg").datagrid("selectRow", index).datagrid("beginEdit", index);

                    let ed = $("#dt_dg").datagrid("getEditor", {index: index, field: field});
                    if (ed) {
                        ($(ed.target).data("textbox") ? $(ed.target).textbox("textbox") : $(ed.target)).focus();
                    }
                    this.dtEditIndex = index;
                } else {
                    $("#dt_dg").datagrid("selectRow", this.dtEditIndex);
                }
            }
        },

        onClickDtRow: function (index, dtRow) {
            if (this.dtEditIndex != index) {
                if (this.endDtEditing()) {
                    let lo_params = {
                        dtField: this.pageTwoDataGridFieldData,
                        rowData: dtRow
                    };

                    let li_index = _.findIndex(this.tmpCud.dt_createData, dtRow);
                    if (li_index > -1) {
                        this.tmpCud.dt_createData.splice(li_index, 1);
                    }

                    li_index = _.findIndex(this.tmpCud.dt_updateData, dtRow);
                    if (li_index > -1) {
                        this.tmpCud.dt_updateData.splice(li_index, 1);
                    }
                    let self = this;
                    BacUtils.doHttpPostAgent("/api/chkDtFieldRule", lo_params, function (chkResult) {
                        if (chkResult.success) {
                            //是否要show出訊息
                            if (chkResult.showAlert) {
                                alert(chkResult.alertMsg);
                            }

                            //是否要show出詢問視窗
                            if (chkResult.showConfirm) {
                                if (confirm(chkResult.confirmMsg)) {
                                    //有沒有要再打一次ajax到後端
                                    if (chkResult.isGoPostAjax) {
                                        BacUtils.doHttpPostAgent(chkResult.ajaxURL, postData, function (ajaxResult) {
                                            if (!ajaxResult.success) {
                                                alert(ajaxResult.errorMsg);
                                            }
                                        });
                                    }
                                }
                            }
                        }
                        else {
                            alert(chkResult.errorMsg);
                        }
                    });
                    this.dtEditIndex = index;
                }
                else {
                    $("#dt_dg").datagrid("selectRow", this.dtEditIndex);
                }
            }
        },

        //結束編輯dt
        endDtEditing: function () {
            if (this.dtEditIndex == undefined) {
                return true;
            }
            if ($("#dt_dg").datagrid("validateRow", this.dtEditIndex)) {
                $("#dt_dg").datagrid("endEdit", this.dtEditIndex);
                this.dtEditIndex = undefined;
                return true;
            }
            return false;
        },

        //儲存page2 datagrid欄位屬性
        doSaveColumnFields: function () {

            let saveField = [];
            let allField = $("#dt_dg").datagrid("getColumnFields");

            _.each(allField, function (field, fIdx) {
                let currentColumOption = $("#dt_dg").datagrid("getColumnOption", field);
                currentColumOption.col_seq = fIdx;
                delete currentColumOption._id; //mongo key值 _id會重複
                saveField.push(_.extend(currentColumOption));
            });

            BacUtils.doHttpPostAgent("/api/saveFieldOptionByUser", {
                prg_id: prg_id,
                page_id: 2,
                fieldOptions: saveField
            });
        },

        //新增一個Dt Row
        appendDtRow: function () {
            let self = this;
            let la_allRow = $("#dt_dg").datagrid("getRows");
            if (this.endDtEditing()) {
                BacUtils.doHttpPostAgent("/api/handleDataGridAddEventRule", {
                    prg_id: prg_id,
                    page_id: 2,
                    allRows: la_allRow
                }, function (result) {
                    let prgDefaultObj = {createRow: "Y"};
                    if (result.success) {
                        prgDefaultObj = _.extend(prgDefaultObj, result.prgDefaultObj);
                    }

                    $("#dt_dg").datagrid("appendRow", prgDefaultObj);
                    self.dtEditIndex = $("#dt_dg").datagrid("getRows").length - 1;
                    $("#dt_dg").datagrid("selectRow", self.dtEditIndex)
                        .datagrid("beginEdit", self.dtEditIndex);
                });
            }
        },

        //刪除選定Dt的Row
        removeDtRow: function () {
            let self = this;
            let delRow = $("#dt_dg").datagrid("getSelected");
            if (!delRow) {
                alert("請選擇要刪除的資料");
                return;
            }

            delRow["mnRowData"] = this.singleData; //存放此筆DT 對應mn 的資料
            delRow = _.extend(delRow, this.singleData);
            delRow = _.extend(delRow, {delRow: "Y"});

            if (delRow.createRow != "Y") {
                vm.tmpCud.dt_deleteData.push(delRow);
            }

            //檢查dt_editData、dt_createData裡的資料是否跟要刪除的資料重複
            this.examineTmpData(delRow, vm.tmpCud);

            BacUtils.doHttpPostAgent("/api/handleDataGridDeleteEventRule", {
                prg_id: prg_id,
                page_id: 2,
                deleteData: vm.tmpCud.dt_deleteData
            }, function (result) {
                if (result.success) {
                    $("#dt_dg").datagrid("deleteRow", $("#dt_dg").datagrid("getRowIndex", delRow));
                } else {
                    vm.tmpCud.deleteData = _.without(vm.tmpCud.deleteData, delRow); //刪除在裡面的暫存
                    vm.tmpCud.dt_deleteData = _.without(vm.tmpCud.dt_deleteData, delRow); //刪除在裡面的暫存
                    self.endDtEditing();
                    alert(result.errorMsg);
                }

            });

        },

        //DT datagrid資料放入暫存
        tempExecData: function (rowData) {
            rowData["mnRowData"] = JSON.parse(JSON.stringify(this.singleData));
            rowData = _.extend(JSON.parse(JSON.stringify(this.singleData)), rowData);

            //檢查資料是否有重複
            this.examineTmpData(rowData, vm.tmpCud);
        },

        //檢查tmpCud裡的資料是否重複
        examineTmpData: function (rowData, tmpCud) {
            let isDelRow = rowData.delRow == "Y" ? true : false;
            let dataType = rowData.createRow == "Y"
                ? "dt_createData" : "dt_editData";
            let fieldDataList = this.pageTwoDataGridFieldData;
            let keyVals = _.pluck(_.where(fieldDataList, {keyable: "Y"}), "ui_field_name");
            let condKey = {};
            _.each(keyVals, function (field_name) {
                condKey[field_name] = rowData[field_name] || "";
            });

            //判斷資料有無在暫存裡, 如果有先刪掉
            let existIdx = _.findIndex(tmpCud[dataType], condKey);
            if (existIdx > -1) {
                tmpCud[dataType].splice(existIdx, 1);
            }
            //判斷是否為要刪除的資料，如果不是的話就再新增
            if (!isDelRow) {
                this.tmpCud[dataType].push(rowData);
            }
        },

        filterLocaleContent: function (langContent, locale, field_name) {
            let m_lang_val = "";
            let fIdx = _.findIndex(langContent, {locale: locale});
            if (fIdx > -1) {
                m_lang_val = langContent[fIdx][field_name] || "";
            }

            return m_lang_val;
        }
    }
});


var vm = new Vue({
    el: "#GSApp",
    mounted: function () {
        this.initTmpCUD();
        this.fetchUserInfo();
        this.loadDataGridByPrgID();
        this.loadSingleGridPageField();
    },
    components: {
        "search-comp": go_searchComp
    },
    data: {
        isDatepickerInit: false,
        sys_locales: JSON.parse(decodeURIComponent(getCookie("sys_locales")).replace("j:", "")),
        createStatus: false, //新增狀態
        editStatus: false, //編輯狀態
        deleteStatus: false, //刪除狀態
        pageOneDataGridRows: [],//page_id 1 的 datagrid資料
        pageOneFieldData: [], //page_id 1 datagird欄位
        pageTwoFieldData: [], //page_id 2 欄位
        oriPageTwoFieldData: [], //page_id 2 原始欄位資料
        pageTwoDataGridFieldData: [], //page_id 2 datagird欄位
        editingRow: {}, //編輯中的資料
        userInfo: {}, //登入的使用者資料
        tmpCud: { //新刪修暫存
            createData: [],
            editData: [],
            deleteData: [],
            dt_createData: [],
            dt_editData: [],
            dt_deleteData: []
        },
        singleData: {}, //單檔資訊
        oriSingleData: {}, //單黨資訊原始檔
        isModifiable: true, //決定是否可以修改資料
        dtData: [],
        dtMultiLangField: [], //Dt 多語編輯欄位
        dialogVisible: false,
        searchFields: [], //搜尋的欄位
        searchCond: {}, //搜尋條件
        isInitShowGrid: true,
        openChangeLogDialog: false,
        allChangeLogList: [],
        isSaving: false,
        isRuleComplete: true,
        maxWidth: 0
    },
    watch: {
        editStatus: function (newVal) {
            if (newVal) {
                vm.createStatus = false;
                vm.deleteStatue = false;
            }
        },
        createStatus: function (newVal) {
            if (newVal) {
                vm.editStatus = false;
                vm.deleteStatue = false;
            }
        },
        deleteStatus: function (newVal) {
            if (newVal) {
                vm.editStatus = false;
                vm.createStatus = false;
            }
        },
        searchFields: function (newFields) {
            this.searchFieldsByRow = _.values(_.groupBy(_.sortBy(newFields, "row_seq"), "row_seq"));
        },
        editingRow: function (val) {
            this.dgIns.clearSelection();
        }
    },
    methods: {
        //init CUD
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
            let self = this;
            if (_.isUndefined(callback) || _.isNull(callback)) {
                callback = function () {
                };
            }
            BacUtils.doHttpPostAgent("/api/prgDataGridDataQuery", {
                prg_id: prg_id,
                searchCond: this.searchCond
            }, function (result) {
                waitingDialog.hide();
                vm.pageOneFieldData = result.fieldData;
                if (vm.isInitShowGrid) {
                    vm.searchFields = result.searchFields;

                }else {
                    vm.pageOneDataGridRows = result.dataGridRows;
                }
                vm.isInitShowGrid = false;
                vm.showDataGrid();
                callback(result.success);
            });
        },
        //抓取page_id 2 單頁顯示欄位
        loadSingleGridPageField: function (callback) {
            vm.maxWidth = 0;
            if (_.isUndefined(callback) || _.isNull(callback)) {
                callback = function () {
                };
            }
            BacUtils.doHttpPostAgent("/api/singleGridPageFieldQuery", {
                prg_id: prg_id,
                page_id: 2,
                singleRowData: vm.editingRow
            }, function (result) {
                let fieldData = result.fieldData;
                vm.oriPageTwoFieldData = fieldData;
                vm.pageTwoFieldData = _.values(_.groupBy(_.sortBy(fieldData, "row_seq"), "row_seq"));

                // 算最小寬度 && 最大行數
                let maxField = _.max(vm.pageTwoFieldData, function (lo_pageTwoField) {
                    return lo_pageTwoField.length;
                });
                _.each(maxField, function (lo_maxField, index) {
                    let width = parseInt(lo_maxField.width) || 35; //90
                    let label_width = parseInt(lo_maxField.label_width) || 50; //165
                    vm.maxWidth += width + label_width + 14;
                    //todo 此單筆最後一排有超過五個以上的grid-item 會錯誤
                    // if(index >= 2) return true;
                });

                //page2  datagrid 欄位屬性
                if (_.findIndex(fieldData, {ui_type: "grid"}) > -1) {
                    $("#dt_dg_DIV").show();
                    vm.pageTwoDataGridFieldData = fieldData[_.findIndex(fieldData, {ui_type: "grid"})].datagridFields || [];
                    vm.dtMultiLangField = _.filter(vm.pageTwoDataGridFieldData, function (field) {
                        return field.multi_lang_table != "";
                    });

                    vmHub.$emit("updateDtMultiLangField", {dtMultiLangField: vm.dtMultiLangField});
                }
                callback(result);
            });

        },
        //取得使用者資料
        fetchUserInfo: function () {
            BacUtils.doHttpPostAgent("/api/getUserInfo", function (result) {
                if (result.success) {
                    vm.userInfo = result.userInfo;
                }
            });
        },

        //顯示資料
        showDataGrid: function () {
            let colOption = [{field: "ck", checkbox: true}];
            colOption = _.union(colOption, DatagridFieldAdapter.combineFieldOption(this.pageOneFieldData, "dg"));
            this.dgIns = new DatagridSingleGridClass();
            this.dgIns.init(prg_id, "dg", colOption, this.pageOneFieldData, {
                singleSelect: false
            });
            //** 計算網頁高度 **//
            // 藍色系統列
            let navHt = $(".navbar-container").height();
            // quickMenus + 搜尋欄位
            let menuHt = $(".top-sec-ul").height() + 30 + $(".page-header").height();//padding-top: 5px
            // 高度 margin或padding 的差距
            let menuHt3 = 70;
            let searchHt = $(".search-content").height() + 5;

            function allHt() {
                prg_dgHtSingle = $(window).height() - navHt - menuHt - menuHt3 - searchHt; // PMS0810020
            }

            allHt();

            $(".prg_dgHtSingle").datagrid("resize", {
                height: prg_dgHtSingle
            });
            // $(".prg_dgHt").css("height", prg_dgHt); // PMS0810020

            $(window).resize(function () {
                allHt();
                // $('.prg_dgHt').datagrid('resize',{
                //     height:prg_dgHt
                // });
            });
            //** End.計算網頁高度 **//
            this.dgIns.loadDgData(this.pageOneDataGridRows);
        },

        //根據欄位屬性組資料
        combineField: function (fieldData, callback) {
            callback(DatagridFieldAdapter.combineFieldOption(fieldData, "dg"));
        },
        //dg row刪除
        removeRow: function () {
            vm.tmpCud.deleteData = [];
            let checkRows = $("#dg").datagrid("getChecked");
            if (checkRows == 0) {
                alert("Check at least one item");
                return;
            }
            let q = confirm("Are you sure delete those data?");

            if (q) {
                //刪除前檢查
                _.each(checkRows, function (row) {
                    vm.tmpCud.deleteData.push(row);
                });

                BacUtils.doHttpPostAgent("/api/deleteFuncRule", {
                    page_id: 1,
                    prg_id: prg_id,
                    deleteData: vm.tmpCud.deleteData
                }, function (result) {
                    if (result.success) {
                        //刪除Row
                        _.each(checkRows, function (row) {
                            $("#dg").datagrid("deleteRow", $("#dg").datagrid("getRowIndex", row));
                        });

                        vm.doSaveCUD();
                    } else {
                        alert(result.errorMsg);
                        _.each(checkRows, function (row) {
                            _.without(vm.tmpCud.deleteData, row);
                        });
                    }

                });

            }
        },

        //資料驗證
        dataValidate: function () {
            let self = this;
            let lo_chkResult;
            for (let i = 0; i < this.oriPageTwoFieldData.length; i++) {
                let lo_field = this.oriPageTwoFieldData[i];
                //必填
                if (lo_field.requirable == "Y" && lo_field.modificable != "N" && lo_field.ui_type != "checkbox") {
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
            this.isSaving = true;
            if (_.isUndefined(callback)) {
                callback = function () {
                };
            }

            let lo_chkResult = this.dataValidate();
            if (lo_chkResult.success == false && vm.tmpCud.deleteData.length == 0) {
                alert(lo_chkResult.msg);
                vm.isSaving = false;
                return callback(false);
            }

            let params = _.extend({prg_id: prg_id}, vm.tmpCud);

            BacUtils.doHttpPostAgent("/api/saveGridSingleData", params, function (result) {
                vm.isSaving = false;
                if (result.success) {
                    vm.initTmpCUD();
                    vm.loadDataGridByPrgID(function (success) {
                        vm.fetchSingleData(vm.editingRow, function (success) {
                            _.each(vm.dtData, function (lo_dtData) {
                                if (!_.isUndefined(lo_dtData.createRow)) {
                                    delete lo_dtData["createRow"];
                                }
                            });
                            alert(go_i18nLang.SystemCommon.saveSuccess);
                            callback(success);
                        });
                    });

                } else {
                    alert(result.errorMsg);
                    callback(false);
                }
            });

        },
        //新增按鈕Event
        appendRow: function () {
            vm.initTmpCUD();
            vm.dtData = [];
            vm.createStatus = true;
            vm.singleData = {};
            vm.isModifiable = true;
            vm.editStatus = false;
            this.loadSingleGridPageField(function (success) {
                BacUtils.doHttpPostAgent("/api/addFuncRule", {prg_id: prg_id, page_id: 1}, function (result) {
                    if (result.success) {
                        vm.singleData = result.defaultValues;
                        vmHub.$emit("showDtDataGrid", vm.dtData);
                        vm.showSingleGridDialog();
                    } else {
                        alert(result.errorMsg);
                    }
                });
            });
        },
        //取得單筆資料
        fetchSingleData: function (editingRow, callback) {
            vm.initTmpCUD();
            vm.createStatus = false;
            vm.editStatus = true;
            vm.editingRow = editingRow;
            this.loadSingleGridPageField(function (result) {
                editingRow["prg_id"] = prg_id;
                BacUtils.doHttpPostAgent("/api/singlePageRowDataQuery", editingRow, function (result) {
                    let dtData = result.dtData || [];
                    if (result.success) {
                        vm.oriSingleData = $.extend({}, result.rowData);
                        vm.singleData = result.rowData;
                        vm.isModifiable = result.isModifiable || true;
                        vm.dtData = dtData;

                        vmHub.$emit("showDtDataGrid", dtData);
                        callback(true);
                    } else {
                        vm.singleData = {};
                        callback(false);
                    }

                });
            });
        },
        //init datepicker
        initDatePicker: function () {
            if (!this.isDatepickerInit) {
                try {
                    this.isDatepickerInit = true;
                    $(".date_picker").datepicker({
                        autoclose: true,
                        format: "yyyy/mm/dd"
                    }).on("changeDate", function (e) {
                    });

                    $(".date_timepicker").datetimepicker({
                        format: "YYYY/MM/DD hh:mm:ss ",//use this option to display seconds
                        icons: {
                            time: "fa fa-clock-o",
                            date: "fa fa-calendar",
                            up: "fa fa-chevron-up",
                            down: "fa fa-chevron-down",
                            previous: "fa fa-chevron-left",
                            next: "fa fa-chevron-right",
                            today: "fa fa-arrows ",
                            clear: "fa fa-trash",
                            close: "fa fa-times"
                        }

                    });
                }
                catch (ex) {

                }
            }
        },
        //打開單檔dialog
        showSingleGridDialog: function () {
            this.initDatePicker();
            this.dialogVisible = true;
            let height = this.pageTwoFieldData.length * 50 + 130; // 預設一個row 高度
            let maxHeight = document.documentElement.clientHeight - 70; //browser 高度 - 70功能列
            let btnWt = $(".right-menu-co").outerWidth();
            let dialogWt = this.maxWidth + btnWt;

            // if (this.pageTwoDataGridFieldData.length > 0) {
            //     //加上 dt 高度
            //     height += this.dtData.length * 35 + 130;
            // }
            let dialog = $("#singleGridDialog").dialog({
                autoOpen: false,
                modal: true,
                height: _.min([maxHeight, height]),
                title: prg_id,
                minWidth: _.min([dialogWt, 1000]),
                width: _.min([dialogWt, 1000]),
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
            vm.editingRow = {};
            vm.singleData = {};
            vm.initTmpCUD();
            $("#singleGridDialog").dialog("close");
        },

        //儲存page1 datagrid欄位屬性
        doSaveColumnFields: function () {

            let saveField = [];
            let allField = $("#dg").datagrid("getColumnFields");

            _.each(allField, function (field, fIdx) {
                let currentColumOption = $("#dg").datagrid("getColumnOption", field);
                currentColumOption.col_seq = fIdx;
                delete currentColumOption._id; //mongo key值 _id會重複
                saveField.push(_.extend(currentColumOption));
            });

            BacUtils.doHttpPostAgent("/api/saveFieldOptionByUser", {
                prg_id: prg_id,
                page_id: 1,
                fieldOptions: saveField
            });
        },
        //顯示textgrid跳窗訊息
        showPopUpGridDialog: function () {
            this.dialogVisible = true;
            let maxHeight = document.documentElement.clientHeight - 60; //browser 高度 - 70功能列
            let height = this.pageTwoFieldData.length * 50; // 預設一個row 高度
            if (this.pageTwoDataGridFieldData.length > 0) {
                //加上 dt 高度
                height += this.dtData.length * 35 + 130;
            }
            let dialog = $("#dataPopUpGridDialog").dialog({
                autoOpen: false,
                modal: true,
                height: _.min([maxHeight, height]),
                title: prg_id,
                minWidth: 750,
                maxHeight: maxHeight,
                resizable: true
            });
            dialog.dialog("open");
            // 給 dialog "內容"高 值
            //$(".singleGridContent").css("height", _.min([maxHeight, height]) + 20);
        },
        loadChangeLog: function () {
            this.openChangeLogDialog = true;
            BacUtils.doHttpPostAgent("/api/getSetupPrgChangeLog", {prg_id: prg_id}, function (result) {
                vm.allChangeLogList = result.allChangeLogList;
            });
            // 給裡面table的高 值
            let chooseGridH = $("#dataPopUpGridDialog").height() - 40;
            $("#chooseGrid").datagrid({height: chooseGridH});

        }
    }
});


function editDtMultiLang(rowIdx) {
    vmHub.$emit("editDtMultiLang", {rowIdx: rowIdx});
}

/** 過濾Function **/
Vue.filter("filterLocaleContent", function (langContent, locale, field_name) {

    let m_lang_val = "";
    let fIdx = _.findIndex(langContent, {locale: locale});
    if (fIdx > -1) {
        m_lang_val = langContent[fIdx][field_name] || "";
    }

    return m_lang_val;
});

