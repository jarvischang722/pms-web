/**
 * Created by Jun on 2017/2/23.
 */
waitingDialog.hide();
var prg_id = $("#prg_id").val();
var vmHub = new Vue;

//Dt 多語編輯
Vue.component("multiLang-dialog-tmp", {
    template: '#multiLangDialogTmp',
    props: ['sys_locales', 'dtMultiLangField', 'endMultiLangEditing'],
    data: function () {
        return {
            dtMultiLangEditIndex: undefined
        };
    },
    created: function () {

        var self = this;
        vmHub.$on('editDtMultiLang', function (data) {
            self.editDtMultiLang(data.rowIdx);
        });
        vmHub.$on('updateDtMultiLangField', function (data) {
            self.dtMultiLangField = data.dtMultiLangField;
            self.initDtMultiLangDg(self.dtMultiLangField);
        });


    },
    methods: {
        initDtMultiLangDg: function (dtMultiLangField) {
            var self = this;
            var columnsData = [{
                type: 'textbox',
                title: "Locale",
                field: "display_locale",
                width: 70,
                editor: {
                    options: {
                        readonly: true
                    }
                }
            }];
            columnsData = _.union(columnsData, EZfieldClass.combineFieldOption(dtMultiLangField, 'multiLangDG'));
            var width = 10;
            _.each(columnsData, function (column) {
                width += Number(column.width);
            });
            $('#multiLangDG').datagrid({
                columns: [columnsData],
                remoteSort: false,
                singleSelect: true,
                selectOnCheck: true,
                checkOnSelect: true,
                width: width,
                onClickCell: function (index, field) {
                    if (self.dtMultiLangEditIndex != index) {
                        if (self.endMultiLangEditing()) {
                            $('#multiLangDG').datagrid('selectRow', index).datagrid('beginEdit', index);
                            var ed = $('#multiLangDG').datagrid('getEditor', {index: index, field: field});
                            if (ed) {
                                ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
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
            if ($('#multiLangDG').datagrid('validateRow', this.dtMultiLangEditIndex)) {
                $('#multiLangDG').datagrid('endEdit', this.dtMultiLangEditIndex);
                this.multiLangEditIndex = undefined;
                return true;
            }
            return false;

        },
        //更新Dt多語內容
        updateDtMultiLangData: function (gridData) {
            $('#multiLangDG').datagrid("loadData", {total: gridData.length, rows: gridData});
        },
        getRowMultiLangContent: function (rowIdx) {
            var self = this;
            var rowData = $('#dt_dg').datagrid("getRows")[rowIdx];
            var params = {
                rowData: rowData,
                prg_id: prg_id,
                page_id: 2
            };

            if (!_.isUndefined(rowData.createRow) && _.isEqual(rowData.createRow, "Y")) {
                var multiLangContent = [];
                _.each(this.sys_locales, function (locale) {
                    multiLangContent.push({
                        locale: locale.lang,
                        display_locale: locale.name
                    });
                });
                self.updateDtMultiLangData(multiLangContent);
                return;
            }

            $.post("/api/multiLangFieldContentByKey", params, function (result) {
                self.updateDtMultiLangData(result.multiLangContent);
            });
        },
        closeMultiLangDialog: function () {
            $("#multiLangDialog").dialog("close");
        },
        //寫入此筆編輯Row
        saveMultiLang: function () {
            if (this.endMultiLangEditing()) {
                var selectIndex = $('#dt_dg').datagrid("getRowIndex", $('#dt_dg').datagrid("getSelected"));
                var multiLang = $("#multiLangDG").datagrid("getRows");
                var updateRow = $('#dt_dg').datagrid("getSelected");
                updateRow["multiLang"] = multiLang;

                $('#dt_dg').datagrid('updateRow', {
                    index: selectIndex,
                    row: updateRow
                });

                vmHub.$emit('tempExecData', $('#dt_dg').datagrid("getSelected"));
                this.closeMultiLangDialog();
            }
        },
        //打開Dt 多語編輯視窗
        openDtMultiLangDiaolg: function () {
            var width = 500;
            var maxWidth = 500;
            var dialog = $("#multiLangDialog").dialog({
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
    template: '#fieldMultiLangDialogTmp',
    props: ['sys_locales', 'singleData'],
    data: function () {
        return {
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
                rowData: this.singleData,
                prg_id: fieldInfo.prg_id,
                page_id: 2,
                ui_field_name: fieldInfo.ui_field_name
            };

            $.post("/api/fieldAllLocaleContent", params, function (result) {
                self.multiLangContentList = result.multiLangContentList;
                self.openFieldMultiLangDialog(fieldInfo.ui_display_name);
                // console.table(JSON.parse(JSON.stringify(self.multiLangContentList)));
            });
        },
        openFieldMultiLangDialog: function (fieldName) {
            var width = 300;
            var height = (this.sys_locales.length + 1) * 40 + 100;
            var dialog = $("#fieldMultiLangTmpDialog").dialog({
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
        }
    }

});

Vue.component('text-select-grid-dialog-tmp', {
    template: "#chooseDataDialogTmp",
    data: function () {
        return {
            fieldNameConditionTmp: [],
            updateFieldNameTmp: [],
            isFistData: false,
            isLastData: false,
            dtEditIndex: undefined
        };
    },
    created: function () {
        var self = this;
        vmHub.$on('showTextDataGrid', function (result) {
            self.showTextDataGrid(result);
        });
    },
    methods: {
        //顯示點選textgrid跳出來的視窗
        showTextDataGrid: function (result) {
            var self = this;
            var textDataGrid = result.showDataGrid;
            var updateFieldName = result.updateFieldNameTmp;
            var fieldNameChangeLanguage = result.fieldNameChangeLanguageTmp;
            this.fieldNameConditionTmp = [];

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
                            width: 200,
                            align: "left"
                        });
                        self.fieldNameConditionTmp.push({value: field, display: name});
                    }
                });
            }

            $('#chooseGrid').datagrid({
                columns: [columnsData],
                singleSelect: true,
                data: textDataGridArray,
                width: 500
            }).datagrid('columnMoving');
            self.updateFieldNameTmp = updateFieldName;
        },
        //將選擇到的資料帶回Page2
        chooseDataBackGridSingle: function () {
            var self = this;
            var selectTable = $('#chooseGrid').datagrid('getSelected');
            var chooseData = self.updateFieldNameTmp;
            var updateFieldName = self.updateFieldNameTmp;

            _.each(selectTable, function (selectValue, selectField) {
                _.each(updateFieldName, function (updateValue, updateField) {
                    if (selectField == updateValue) {
                        chooseData[updateField] = selectValue;
                    }
                });
            });
            vmHub.$emit('updateBackSelectData', chooseData);
            $("#dataTextGridDialog").dialog('close');
        },
        txtSearchChangeText: function (keyContent) {
            var allData = $('#chooseGrid').datagrid('getData');
            var selectFieldName = $('#cbSelect').val();
            var dataGrid = _.filter(allData.rows, function (row) {
                return row;
            });
        }
    }
});

/** 編輯新增Dialog Component **/
Vue.component('sigle-grid-dialog-tmp', {
    template: '#sigleGridDialogTmp',
    props: ['editStatus', 'createStatus', 'deleteStatus', 'editingRow', 'pageOneDataGridRows', 'pageTwoDataGridFieldData',
        'singleData', 'pageTwoFieldData', 'tmpCud', 'modificableForData', 'dialogVisible', 'selectTextGridData', 'updateBackSelectData'],
    data: function () {
        return {
            isFistData: false,
            isLastData: false,
            dtEditIndex: undefined,
            key_nos: 0
        };
    },
    watch: {

        editingRow: function (newRow, oldRow) {
            this.$parent.editingRow = newRow;
            var nowDatagridRowIndex = $("#dg").datagrid('getRowIndex', newRow);
            $("#dg").datagrid('selectRow', nowDatagridRowIndex);

            if ($("#dg").datagrid('getRowIndex', newRow) == 0) {
                //已經到第一筆
                this.isFistData = true;
                this.isLastData = false;
                if ($("#dg").datagrid('getRowIndex', newRow) == this.pageOneDataGridRows.length - 1)
                    {this.isLastData = true;}

            } else if ($("#dg").datagrid('getRowIndex', newRow) == this.pageOneDataGridRows.length - 1) {
                //已經到最後一筆
                this.isFistData = false;
                this.isLastData = true;
            } else {

                this.isFistData = false;
                this.isLastData = false;
            }

        }
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
            console.log(chooseData);
            console.log(self.singleData);
            _.each(Object.keys(chooseData), function (key) {

                self.singleData[key] = chooseData[key] || "";
            });
        });
    },

    methods: {
        //打開單欄多語編輯
        editFieldMultiLang: function (fieldInfo) {
            vmHub.$emit('editFieldMultiLang', fieldInfo);
        },

        //檢查欄位規則，在離開欄位時
        chkFieldRule: function (ui_field_name, rule_func_name) {
            var self = this;
            if (!_.isEmpty(rule_func_name.trim())) {
                var postData = {
                    prg_id: prg_id,
                    rule_func_name: rule_func_name,
                    validateField: ui_field_name,
                    singleRowData: JSON.parse(JSON.stringify(this.singleData)),
                    oriSingleRowData: this.$parent.oriSingleData
                };
                $.post('/api/chkFieldRule', postData, function (result) {
                    if (result.success) {
                        //連動帶回的值
                        if (!_.isUndefined(result.effectValues)) {
                            var effectValues = result.effectValues;
                            _.each(Object.keys(effectValues), function (key) {
                                self.singleData[key] = effectValues[key] || "";

                            });
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
                                    $.post(result.ajaxURL, postData, function (result) {
                                        if (!result.success) {
                                            alert(result.errorMsg);
                                        }
                                    });
                                }
                            }
                        }


                    } else {
                        alert(result.errorMsg);
                    }

                });
            }
        },
        //跳窗選擇多欄位
        chkClickTextGrid: function (fields) {
            if (fields.ui_type == "textgrid") {
                var params = {
                    prg_id: prg_id,
                    fields: fields,
                    singleRowData: JSON.parse(JSON.stringify(this.singleData))
                };

                $.post("/api/selectGridData", params, function (result) {
                    if (result != null) {
                        vm.selectTextGridData = result.showDataGrid;
                        vmHub.$emit('showTextDataGrid', result);
                        vm.showTextGridDialog();
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
            var nowRowIndex = $("#dg").datagrid('getRowIndex', this.editingRow);
            this.editingRow = this.pageOneDataGridRows[nowRowIndex - 1];
            this.emitFetchSingleData();

        },

        //下一筆
        toNextData: function () {
            var nowRowIndex = $("#dg").datagrid('getRowIndex', this.editingRow);
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
            $.messager.confirm("Delete", "Are you sure delete those data?", function (q) {
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
            });
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

        //新增模式
        emitAppendRow: function () {
            this.$emit('append-row');
        },

        //儲存新增或修改資料
        doSaveGrid: function (saveAfterAction) {

            if (this.endDtEditing()) {
                var self = this;
                var targetRowAfterDelete = {}; //刪除後要指向的資料
                if (this.deleteStatue) {
                    var rowsNum = $("#dg").datagrid('getRows').length;
                    var currentRowIdx = $("#dg").datagrid('getRowIndex', self.editingRow); //目前索引
                    if (currentRowIdx == rowsNum - 1) {
                        //刪除的資料已經是最後一筆 就取datagrid最末筆
                        targetRowAfterDelete = self.pageOneDataGridRows[currentRowIdx - 1];

                    } else {
                        //取下一筆
                        targetRowAfterDelete = self.pageOneDataGridRows[currentRowIdx + 1];
                    }
                }

                if (this.createStatus) {
                    this.tmpCud.createData = [this.singleData];
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
                            if ($("#dg").datagrid('getRows').length > 0) {
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

        /**  DT Data grid event**/
        //page2 顯示dt的datagrid欄位屬性與資料
        showDtDataGrid: function (dtDataGridRows) {

            var self = this;
            var columnsData = [];
            this.$emit("combine-field", this.pageTwoDataGridFieldData, function (columns) {
                columnsData = columns;
            });
            var hasMultiLangField = _.filter(this.pageTwoDataGridFieldData, function (field) {
                return field.multi_lang_table != "";
            }).length > 0 ? true : false;

            if (hasMultiLangField) {
                columnsData.push({
                    type: 'textbox',
                    title: "Multi Lang",
                    field: "langAction",
                    align: "center",
                    width: 70,
                    formatter: function (value, row, index) {
                        return '<a  href="javascript:void(0)" onclick="editDtMultiLang(' + index + ')">Edit</a>';
                    }

                });
            }
            //TODO: 小良Rule完成後可刪
            if (prg_id == "PMS0820050") {
                $.post("/api/getKeyNos", function (getResult) {
                    if (getResult) {
                        self.key_nos = getResult.defaultValues.key_nos;
                    }
                });
            }

            $('#dt_dg').datagrid({
                toolbar: '#tb',
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


            }).datagrid('columnMoving');
        },

        onClickDtCell: function (index, field) {
            if (this.dtEditIndex != index) {
                if (this.endDtEditing()) {
                    $("#dt_dg").datagrid('selectRow', index).datagrid('beginEdit', index);

                    var ed = $("#dt_dg").datagrid('getEditor', {index: index, field: field});
                    if (ed) {
                        ($(ed.target).data('textbox') ? $(ed.target).textbox('textbox') : $(ed.target)).focus();
                    }
                    this.dtEditIndex = index;
                } else {
                    setTimeout(function () {
                        $("#dt_dg").datagrid('selectRow', this.dtEditIndex);
                    }, 0);
                }
            }
        },

        onClickDtRow: function (index, dtRow) {
            var lo_params = {
                dtField: this.pageTwoDataGridFieldData,
                rowData: dtRow
            };
            $.post('/api/chkDtFieldRule', lo_params, function (chkResult) {
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
                                $.post(chkResult.ajaxURL, postData, function (ajaxResult) {
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
                    if (!chkResult.isModifiable) {
                        var la_readonlyFields = _.uniq(chkResult.readonlyFields);
                        _.each(la_readonlyFields, function (field) {
                            var lo_editor = $('#dt_dg').datagrid('getEditor', {
                                index: index,
                                field: field
                            });
                            $(lo_editor.target).textbox("readonly", true);
                        });
                    }
                }
            });
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

        //儲存page2 datagrid欄位屬性
        doSaveColumnFields: function () {

            var saveField = [];
            var allField = $('#dt_dg').datagrid("getColumnFields");

            //過濾不用存的欄位
            allField = _.filter(allField, function (field) {
                return field != 'langAction';
            });

            _.each(allField, function (field, fIdx) {
                var currentColumOption = $('#dt_dg').datagrid("getColumnOption", field);
                currentColumOption.col_seq = fIdx;
                saveField.push(_.extend(currentColumOption));
            });

            $.post("/api/saveFieldOptionByUser", {
                prg_id: prg_id,
                page_id: 2,
                fieldOptions: saveField
            });
        },

        //新增一個Dt Row
        appendDtRow: function () {
            var self = this;
            if (this.endDtEditing()) {
                $.post("/api/handleDataGridAddEventRule", {prg_id: prg_id, page_id: 2}, function (result) {
                    var prgDefaultObj = {createRow: 'Y'};
                    if (result.success) {
                        prgDefaultObj = _.extend(prgDefaultObj, result.prgDefaultObj);
                    }
                    $("#dt_dg").datagrid('appendRow', prgDefaultObj);
                    self.dtEditIndex = $("#dt_dg").datagrid('getRows').length - 1;
                    $("#dt_dg").datagrid('selectRow', self.dtEditIndex)
                        .datagrid('beginEdit', self.dtEditIndex);
                });

            }
        },

        //刪除選定Dt的Row
        removeDtRow: function () {
            var self = this;
            var delRow = $("#dt_dg").datagrid('getSelected');
            if (!delRow) {
                alert("請選擇要刪除的資料");
            }
            delRow["mnRowData"] = this.singleData;  //存放此筆DT 對應mn 的資料

            vm.tmpCud.dt_deleteData.push(delRow);

            $.post("/api/handleDataGridDeleteEventRule", {
                prg_id: prg_id,
                page_id: 2,
                deleteData: vm.tmpCud.dt_deleteData
            }, function (result) {
                if (result.success) {
                    $("#dt_dg").datagrid('deleteRow', $("#dt_dg").datagrid('getRowIndex', delRow));
                } else {
                    vm.tmpCud.deleteData = _.without(vm.tmpCud.deleteData, delRow);  //刪除在裡面的暫存
                    vm.tmpCud.dt_deleteData = _.without(vm.tmpCud.dt_deleteData, delRow);  //刪除在裡面的暫存
                    self.endDtEditing();
                    alert(result.errorMsg);
                }

            });

        },

        //DT datagrid資料放入暫存
        tempExecData: function (rowData) {
            var self = this;
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

var vm = new Vue({
    el: '#GSApp',
    compiled: function () {

    },
    mounted: function () {
        this.initTmpCUD();
        this.fetchUserInfo();
        this.loadDataGridByPrgID(function (success) {
        });
    },
    data: {
        isDatepickerInit: false,
        sys_locales: JSON.parse(decodeURIComponent(getCookie("sys_locales")).replace("j:", "")),
        createStatus: false,    //新增狀態
        editStatus: false,      //編輯狀態
        deleteStatus: false,    //刪除狀態
        pageOneDataGridRows: [],//page_id 1 的 datagrid資料
        pageOneFieldData: [],   //page_id 1 datagird欄位
        pageTwoFieldData: [],   //page_id 2 欄位
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
        singleData: {},         //單檔資訊
        oriSingleData: {},      //單黨資訊原始檔
        modificableForData: true,       //決定是否可以修改資料
        dtData: [],
        dtMultiLangField: [],  //Dt 多語編輯欄位
        dialogVisible: false
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
            //waitingDialog.show("Loading...");
            $.post("/api/prgDataGridDataQuery", {prg_id: prg_id}, function (result) {
                waitingDialog.hide();
                vm.pageOneDataGridRows = result.dataGridRows;
                vm.pageOneFieldData = result.fieldData;
                vm.showCheckboxDG();
                vm.showDataGrid();
                console.log(result);
                callback(result.success);
            });
        },
        //抓取page_id 2 單頁顯示欄位
        loadSingleGridPageField: function (callback) {

            $.post("/api/singleGridPageFieldQuery", {
                prg_id: prg_id,
                page_id: 2,
                singleRowData: vm.editingRow
            }, function (result) {

                var fieldData = result.fieldData;

                vm.pageTwoFieldData = _.values(_.groupBy(_.sortBy(fieldData, "row_seq"), "row_seq"));

                //page2  datagrid 欄位屬性
                if (_.findIndex(fieldData, {ui_type: 'grid'}) > -1) {
                    $("#dt_dg_DIV").show();
                    vm.pageTwoDataGridFieldData = fieldData[_.findIndex(fieldData, {ui_type: 'grid'})].datagridFields || [];
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
            $.post('/api/getUserInfo', function (result) {
                if (result.success) {
                    vm.userInfo = result.userInfo;
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
        //顯示資料
        showDataGrid: function () {

            var columnsData = [];
            this.combineField(this.pageOneFieldData, function (columns) {
                columnsData = columns;
            });
            var dgData = {total: this.pageOneDataGridRows.length, rows: this.pageOneDataGridRows};
            var dg = $('#dg').datagrid({
                columns: [columnsData],
                remoteSort: false,
                singleSelect: true,
                selectOnCheck: true,
                checkOnSelect: true,
                data: dgData,
                // onEndEdit: onEndEdit,
                onDropColumn: function () {
                    //當移動順序欄位時
                    vm.doSaveColumnFields();
                },
                onResizeColumn: function () {
                    //當欄位時寬度異動時
                    vm.doSaveColumnFields();
                },
                onSortColumn: function () {
                    vm.pageOneDataGridRows = $("#dgCheckbox").datagrid('getRows');
                    $("#dgCheckbox").datagrid('uncheckAll');
                },
                onClickRow: function (index, row) {

                    vm.editingRow = row;
                    vm.editStatus = true;
                    vm.fetchSingleData(row, function (success) {
                        vm.showSingleGridDialog();
                    });

                }
            }).datagrid('columnMoving');

            vm.pageOneDataGridRows = $("#dgCheckbox").datagrid('getRows');
        },

        //根據欄位屬性組資料
        combineField: function (fieldData, callback) {
            callback(EZfieldClass.combineFieldOption(fieldData, 'dg'));
        },
        //dg row刪除
        removeRow: function () {
            vm.tmpCud.deleteData = [];
            var checkRows = $('#dgCheckbox').datagrid('getSelections');
            if (checkRows == 0) {
                $.messager.alert("Warning", 'Check at least one item');
                return;
            }
            $.messager.confirm("Delete", "Are you sure delete those data?", function (q) {
                if (q) {
                    //刪除前檢查

                    _.each(checkRows, function (row) {
                        vm.tmpCud.deleteData.push(row);
                    });

                    $.post("/api/deleteFuncRule", {
                        page_id: 1,
                        prg_id: prg_id,
                        deleteData: vm.tmpCud.deleteData
                    }, function (result) {
                        if (result.success) {

                            //刪除Row
                            _.each(checkRows, function (row) {
                                var DelIndex = $('#dg').datagrid('getRowIndex', row);
                                $('#dg').datagrid('deleteRow', DelIndex);
                            });
                            vm.showCheckboxDG($("#dg").datagrid("getRows"));
                            vm.doSaveCUD();
                        } else {
                            alert(result.errorMsg);
                            _.each(checkRows, function (row) {
                                _.without(vm.tmpCud.deleteData, row);
                            });
                        }

                    });

                }
            });
        },
        //資料儲存
        doSaveCUD: function (callback) {
            waitingDialog.show('Saving...');
            var params = _.extend({prg_id: prg_id}, vm.tmpCud);
            $.post("/api/saveGridSingleData", params, function (result) {
                waitingDialog.hide();
                if (result.success) {
                    vm.initTmpCUD();
                    vm.loadDataGridByPrgID(function (success) {
                        callback(success);
                    });
                    alert('save success!');
                } else {
                    alert(result.errorMsg);
                }

            });

        },
        //新增按鈕Event
        appendRow: function () {
            vm.initTmpCUD();
            vm.createStatus = true;
            vm.singleData = {};
            this.loadSingleGridPageField(function (success) {
                $.post("/api/addFuncRule", {prg_id: prg_id, page_id: 1}, function (result) {
                    if (result.success) {
                        vm.singleData = result.defaultValues;
                        vm.showSingleGridDialog();
                        vmHub.$emit('showDtDataGrid', []);
                    } else {
                        alert(result.errorMsg);
                    }
                });
            });
        },
        //取得單筆資料
        fetchSingleData: function (editingRow, callback) {
            vm.initTmpCUD();
            vm.editStatus = true;
            vm.editingRow = editingRow;
            this.loadSingleGridPageField(function (result) {
                editingRow["prg_id"] = prg_id;
                $.post('/api/singlePageRowDataQuery', editingRow, function (result) {
                    var dtData = result.dtData || [];
                    if (result.success) {
                        vm.oriSingleData = $.extend({}, result.rowData);
                        vm.singleData = result.rowData;
                        vm.modificableForData = result.modificable || true;
                        vm.dtData = dtData;
                        vmHub.$emit('showDtDataGrid', dtData);
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
            this.dialogVisible = true;
            var maxHeight = document.documentElement.clientHeight - 60; //browser 高度 - 70功能列
            var height = this.pageTwoFieldData.length * 50; // 預設一個row 高度
            if (this.pageTwoDataGridFieldData.length > 0) {
                //加上 dt 高度
                height += this.dtData.length * 35 + 130;
            }
            var dialog = $("#singleGridDialog").dialog({
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
            vm.editingRow = {};
            vm.singleData = {};
            vm.initTmpCUD();
            $("#singleGridDialog").dialog('close');
        },
        //儲存page1 datagrid欄位屬性
        doSaveColumnFields: function () {

            var saveField = [];
            var allField = $("#dg").datagrid("getColumnFields");

            _.each(allField, function (field, fIdx) {
                var currentColumOption = $("#dg").datagrid("getColumnOption", field);
                currentColumOption.col_seq = fIdx;
                saveField.push(_.extend(currentColumOption));
            });

            $.post("/api/saveFieldOptionByUser", {
                prg_id: prg_id,
                page_id: 1,
                fieldOptions: saveField
            });
        },
        //顯示textgrid跳窗訊息
        showTextGridDialog: function () {
            this.dialogVisible = true;
            var maxHeight = document.documentElement.clientHeight - 60; //browser 高度 - 70功能列
            var height = this.pageTwoFieldData.length * 50; // 預設一個row 高度
            if (this.pageTwoDataGridFieldData.length > 0) {
                //加上 dt 高度
                height += this.dtData.length * 35 + 130;
            }
            var dialog = $("#dataTextGridDialog").dialog({
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
        }


    }

});


function editDtMultiLang(rowIdx) {
    vmHub.$emit('editDtMultiLang', {rowIdx: rowIdx});
}

/** 過濾Function **/
Vue.filter("filterLocaleContent", function (langContent, locale, field_name) {

    var m_lang_val = "";
    var fIdx = _.findIndex(langContent, {locale: locale});
    if (fIdx > -1) {
        m_lang_val = langContent[fIdx][field_name] || "";
    }

    return m_lang_val;
});

