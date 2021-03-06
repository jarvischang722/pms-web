/**
 * Created by Jun on 2017/2/25.
 * EasyUI 對應page field 欄位屬性相關方法
 * moment套件(必須)
 */
var isUserEdit = true; //是否為修改或是連動修改
var ga_colorAry = [];  //
var isChange = true;

/**
 * datagrid 轉接器與call
 * @param vm
 * @constructor
 * TODO 這個Class 之後要搬到另一個檔案 2017/07/26
 */
var DatagridAdapter = function (vm) {
    if (_.isUndefined(vm.tempExecData)) {
        console.error(new Error("method 'tempExecData' not defined."));
    }
    this.tempExecData = vm.tempExecData;
};


var DatagridFieldAdapter = {
    //根據欄位屬性組Datagrid屬性資料
    combineFieldOption: function (fieldData, dgName) {
        var columnsData = [];
        _.each(fieldData, function (field) {
            //決定欄位是否顯示
            if (field.visiable == "Y") {
                columnsData.push(DatagridFieldAdapter.fieldConvEzAttr(field, dgName));
            }
        });

        return columnsData;
    },
    /** Page Field 轉換　easyUI datagrid欄位屬性**/
    fieldConvEzAttr: function (fieldAttrObj, dgName) {
        var dataType = "";
        if (fieldAttrObj.ui_type == "text") {
            dataType = 'textbox';
        }
        else if (fieldAttrObj.ui_type == "number" || fieldAttrObj.ui_type == "percent") {
            dataType = 'numberbox';
        }
        else if (fieldAttrObj.ui_type == "date") {
            dataType = 'datebox';
        }
        else if (fieldAttrObj.ui_type == "datetime") {
            dataType = 'datetimebox';
        }
        else if (fieldAttrObj.ui_type == "select" || fieldAttrObj.ui_type == "multiselect") {
            dataType = 'combobox';
        }
        else if (fieldAttrObj.ui_type == "checkbox") {
            dataType = 'checkbox';
        }
        else if (fieldAttrObj.ui_type == "color") {
            dataType = 'color';
        }
        else if (fieldAttrObj.ui_type == "time") {
            dataType = "textbox";
            // dataType = 'timespinner';
        }
        else if (fieldAttrObj.ui_type == "selectgrid") {
            dataType = 'combogrid';
        }
        else {
            dataType = 'textbox';
        }

        var tmpFieldObj = fieldAttrObj;

        tmpFieldObj.field = fieldAttrObj.ui_field_name.toLowerCase();
        tmpFieldObj.title = '<span title="' + fieldAttrObj.ui_hint + '">' + fieldAttrObj.ui_display_name + '</span>';
        tmpFieldObj.sortable = true;

        if (typeof fieldAttrObj.format_func_name === "object") {
            tmpFieldObj.editor = {
                type: dataType,
                options: {
                    required: fieldAttrObj.requirable == "Y",
                    readonly: fieldAttrObj.modificable == "N",
                    validType: fieldAttrObj.format_func_name.validate != "" ? fieldAttrObj.format_func_name.validate.split(",") : []
                }
            };
        }
        else {
            tmpFieldObj.editor = {
                type: dataType,
                options: {
                    required: fieldAttrObj.requirable == "Y",
                    readonly: fieldAttrObj.modificable == "N",
                    validType: fieldAttrObj.format_func_name != "" ? fieldAttrObj.format_func_name.split(",") : []
                }
            };
        }

        /** 長度限制  **/
        var mixLength = fieldAttrObj.requirable == "Y" ? '1' : '0';
        var maxLength = fieldAttrObj.ui_field_length;
        if (fieldAttrObj.ui_type != "select" && fieldAttrObj.ui_type != "selectgrid") {   //combobox因text內容有長有短，所以排除此長度驗證
            tmpFieldObj.editor.options.validType.push('ChkLength[' + mixLength + ',' + maxLength + ']');
        }

        //checkbox
        if (fieldAttrObj.ui_type == "checkbox") {
            tmpFieldObj.editor.options = fieldAttrObj.selectData[0];
        }

        /** 必填欄位需更換背景顏色**/
        tmpFieldObj.styler = function () {
            if (fieldAttrObj.requirable == "Y") {
                return 'background-color:rgb(198, 242, 217);';
            }
        };

        /** 將不能修改的日期改成textbox，因textbox的editor.format沒作用，所以利用onChange轉型**/
        if ((fieldAttrObj.ui_type == "datebox" || fieldAttrObj.ui_type == "datetime") && fieldAttrObj.modificable == "N") {
            tmpFieldObj.editor.type = "textbox";
            tmpFieldObj.editor.options.onChange = function (newValue, oldValue) {
                if (newValue != "" && !_.isUndefined(newValue)) {
                    var ls_dgName = $(this).closest(".datagrid-view").children("table").attr("id");
                    var ls_date = moment(newValue).format("YYYY/MM/DD HH:mm:ss");
                    var li_rowIndex = parseInt($(this).closest('tr.datagrid-row').attr("datagrid-row-index"));

                    var lo_editor = $('#' + ls_dgName).datagrid('getEditor', {
                        index: li_rowIndex,
                        field: fieldAttrObj.ui_field_name
                    });
                    $(lo_editor.target).textbox("setValue", ls_date);
                }
            };
        }

        /** Formatter 顯示  **/
        if (dataType == "datebox") {
            var dateFunc = function (date) {
                if (date != "" && !_.isUndefined(date) && !_.isNull(date)) {
                    return moment(date).format("YYYY/MM/DD");
                }

                return moment().format("YYYY/MM/DD");
            };

            var dateParserFunc = function (date) {
                if (date != "" && !_.isUndefined(date) && !_.isNull(date)) {
                    return new Date(Date.parse(date));
                }
                return new Date();
            };

            var notEditorFunc = function (date) {
                if (date != "" && !_.isUndefined(date) && !_.isNull(date)) {
                    return moment(date).format("YYYY/MM/DD");
                }
                return "";
            };

            tmpFieldObj.formatter = notEditorFunc;
            tmpFieldObj.editor.options.editable = false;
            tmpFieldObj.editor.options.parser = dateParserFunc;
            tmpFieldObj.editor.options.formatter = dateFunc;

            //combobox連動
            if (fieldAttrObj.rule_func_name != "") {
                tmpFieldObj.editor.options.onChange = function (newValue, oldValue) {
                    var ls_dgName = $(this).closest(".datagrid-view").children("table").attr("id");
                    if (isUserEdit) {
                        onChangeAction(fieldAttrObj, oldValue, newValue, ls_dgName);
                    }
                };
            }

        }
        else if (dataType == "datetimebox") {

            var datetimeFunc = function (date) {
                if (date != "" && !_.isUndefined(date)) {
                    return moment(date).format("YYYY/MM/DD HH:mm:ss");
                }
                return moment().format("YYYY/MM/DD HH:mm:ss");

            };

            var datetimeFuncParser = function (date) {
                if (date != "" && !_.isUndefined(date)) {
                    return new Date(Date.parse(date));
                }
                return new Date();
            };
            tmpFieldObj.formatter = datetimeFunc;
            tmpFieldObj.editor.options.parser = datetimeFuncParser;
            tmpFieldObj.editor.options.formatter = datetimeFunc;

        }
        else if (dataType == "combobox") {
            tmpFieldObj.editor.type = dataType;
            tmpFieldObj.editor.options.valueField = 'value';
            tmpFieldObj.editor.options.textField = 'display';
            tmpFieldObj.editor.options.data = fieldAttrObj.selectDataDisplay;
            tmpFieldObj.editor.options.editable = false;
            tmpFieldObj.formatter = function (val, row, index) {
                if (val != null) {
                    var datas = val.split(",");
                    var allValues = "";
                    _.each(datas, function (field) {
                        if (_.findIndex(fieldAttrObj.selectDataDisplay, {value: field}) > -1) {
                            var valueName = _.findWhere(fieldAttrObj.selectDataDisplay, {value: field}).display;
                            allValues += "," + valueName;
                        }
                    });
                    allValues = allValues.replace(",", "");
                    return allValues;
                }
            };

            if (fieldAttrObj.ui_type == "multiselect") {
                tmpFieldObj.editor.options.multiple = true;
                tmpFieldObj.editor.options.multiline = true;
            }
            //combobox連動
            if (fieldAttrObj.rule_func_name != "") {
                tmpFieldObj.editor.options.onChange = function (newValue, oldValue) {
                    var ls_dgName = $(this).closest(".datagrid-view").children("table").attr("id");
                    if (!_.isUndefined(newValue)) {
                        if (fieldAttrObj.modificable == "I") {
                            var li_rowIndex = parseInt($(this).closest('tr.datagrid-row').attr("datagrid-row-index"));

                            var rowData = $('#' + ls_dgName).datagrid('getRows')[li_rowIndex];
                            var lo_editor = $('#' + ls_dgName).datagrid('getEditor', {
                                index: li_rowIndex,
                                field: fieldAttrObj.ui_field_name
                            });
                            if (!rowData.createRow) {
                                $(lo_editor.target).textbox("readonly", true);
                            }
                        }
                    }

                    if (isUserEdit) {
                        onChangeAction(fieldAttrObj, oldValue, newValue, ls_dgName);
                    }
                };
                tmpFieldObj.editor.options.onShowPanel = function () {
                    var ls_dgName = $(this).closest(".datagrid-view").children("table").attr("id");
                    if (!_.isUndefined(ls_dgName)) {
                        onSelectClickAction(fieldAttrObj, ls_dgName);
                    }
                };
            }
        }
        else if (dataType == "checkbox") {

            tmpFieldObj.formatter = function (val, row, index) {
                var lo_checkboxVal = fieldAttrObj.selectData[1];
                if (_.isUndefined(lo_checkboxVal)) {
                    lo_checkboxVal = {
                        Y: '<input type="checkbox" checked>',
                        N: '<input type="checkbox" >'
                    };
                }
                return val == 'Y' ? lo_checkboxVal.Y : lo_checkboxVal.N;
            };
        }
        else if (dataType == "color") {
            var lf_colorFormatter = function (color_cod, row, index) {

                if (_.isUndefined(index)) {
                    return;
                }

                var color_val = "#" + String(colorTool.colorCodToHex(color_cod));
                var disabled = fieldAttrObj.modificable == "N" ? "disabled" : ""; //判斷可否修改
                var colorAry_index = _.findIndex(ga_colorAry, function (colorObj) {
                    return colorObj.index == index;
                });

                if (colorAry_index == -1) {
                    ga_colorAry.push({
                        index: index,
                        color: color_val,
                        disabled: disabled
                    });
                }
                else {
                    ga_colorAry[index].color = color_val;
                }

                return "<input type='color' " + ga_colorAry.disabled + " data-field='" + tmpFieldObj.field + "' data-dgname='" + dgName + "' id='colorWell' class='dg_colorPicker_class spectrumColor' style='width:100%' value='" + ga_colorAry[index].color + "'> <input type='hidden' class='textbox-value'  value='" + ga_colorAry[index].color + "'>";
            };
            tmpFieldObj.formatter = lf_colorFormatter;
        }
        else if (dataType == "textbox") {
            function timeFormater(val) {
                if (tmpFieldObj.ui_type == "time") {
                    if (!_.isNull(val)) {
                        var lo_val = String(val);
                        if (lo_val.indexOf(":") == "-1") {
                            var hour = lo_val.substring(0, 2);
                            var min = lo_val.substring(2, 4);

                            return hour + ":" + min;
                        }
                        return val;
                    }
                    return "";
                }
                return val;

            }

            tmpFieldObj.editor.type = dataType;
            tmpFieldObj.editor.options.onChange = function (newValue, oldValue) {
                var ls_dgName = $(this).closest(".datagrid-view").children("table").attr("id");
                if (!_.isUndefined(newValue)) {
                    if (fieldAttrObj.modificable == "I") {
                        var li_rowIndex = parseInt($(this).closest('tr.datagrid-row').attr("datagrid-row-index"));

                        var rowData = $('#' + ls_dgName).datagrid('getRows')[li_rowIndex];
                        var lo_editor = $('#' + ls_dgName).datagrid('getEditor', {
                            index: li_rowIndex,
                            field: fieldAttrObj.ui_field_name
                        });
                        if (!rowData.createRow) {
                            $(lo_editor.target).textbox("readonly", true);
                        }
                    }
                }

                if (fieldAttrObj.rule_func_name != "") {
                    if (isUserEdit) {
                        onChangeAction(fieldAttrObj, oldValue, newValue, ls_dgName);
                    }
                }
            };
            tmpFieldObj.formatter = timeFormater;
            // tmpFieldObj.editor.options.formatter = timeFormater;


        }
        else if (dataType == "numberbox") {

            tmpFieldObj.editor.options.precision = fieldAttrObj.ui_field_num_point;
            if (fieldAttrObj.ui_type == "percent") {
                tmpFieldObj.formatter = function (val, row, index) {
                    var fieldName = parseFloat(val) * 100 + "%";
                    return fieldName;
                };
            }

            tmpFieldObj.formatter = function (val) {
                if (_.isNull(val) || _.isUndefined(val)) {
                    return val;
                }
                val = val.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
                if (typeof fieldAttrObj.format_func_name === "object") {
                    val = go_formatDisplayClass.amtFormat(val || "0", fieldAttrObj.format_func_name.rule_val);
                }
                return val;
            };
            tmpFieldObj.editor.options.formatter = function (val) {
                if (_.isNull(val) || _.isUndefined(val)) {
                    return val;
                }
                val = val.toString().replace(/,/g, "");
                if (typeof fieldAttrObj.format_func_name === "object") {
                    val = go_formatDisplayClass.amtFormat(val || "0", fieldAttrObj.format_func_name.rule_val);
                }
                return val;
            };

            tmpFieldObj.editor.options.onChange = function (newValue, oldValue) {
                var ls_dgName = $(this).closest(".datagrid-view").children("table").attr("id");
                onChangeAction(fieldAttrObj, oldValue, newValue, ls_dgName);
            };

        }
        else if (dataType == "timespinner") {
            tmpFieldObj.formatter = function (val, row, index) {
                if (!_.isNull(val)) {
                    var lo_val = String(val);
                    if (lo_val.indexOf(":") == "-1") {
                        var hour = lo_val.substring(0, 2);
                        var min = lo_val.substring(2, 4);

                        return hour + ":" + min;
                    }
                    return val;
                }

                return "";
            };
        }
        else if (dataType == "combogrid") {
            var ln_panelWidth = 0;
            if (!_.isUndefined(fieldAttrObj.selectData.columns)) {
                _.each(fieldAttrObj.selectData.columns, function (lo_column) {
                    ln_panelWidth = ln_panelWidth + Number(lo_column.width);
                });
            }
            //參數設定於各對照擋的Rule
            tmpFieldObj.editor.options.panelWidth = !_.isUndefined(fieldAttrObj.selectGridOptions) ?
                fieldAttrObj.selectGridOptions.panelWidth : ln_panelWidth;
            tmpFieldObj.editor.options.idField = !_.isUndefined(fieldAttrObj.selectGridOptions) ?
                fieldAttrObj.selectGridOptions.idField : fieldAttrObj.selectData.value;
            tmpFieldObj.editor.options.textField = !_.isUndefined(fieldAttrObj.selectGridOptions) ?
                fieldAttrObj.selectGridOptions.textField : fieldAttrObj.selectData.display;
            tmpFieldObj.editor.options.columns = !_.isUndefined(fieldAttrObj.selectGridOptions) ?
                fieldAttrObj.selectGridOptions.columns : [fieldAttrObj.selectData.columns];
            tmpFieldObj.editor.options.data = !_.isUndefined(fieldAttrObj.selectGridOptions) ?
                fieldAttrObj.selectData : (fieldAttrObj.selectData.selectData.length > 200 ?
                    fieldAttrObj.selectData.selectData.slice(0, 200) : fieldAttrObj.selectData.selectData.length);
            tmpFieldObj.editor.options.onChange = function (newValue, oldValue) {
                var ls_dgName = $(this).closest(".datagrid-view").children("table").attr("id");
                onChangeAction(fieldAttrObj, oldValue, newValue, ls_dgName);
            };
            tmpFieldObj.editor.options.keyHandler = {
                enter: function (e) {
                    var ls_dgName = $(this).closest(".datagrid-view").children("table").attr("id");
                    onQryAction(fieldAttrObj, e.target.value, ls_dgName);
                },
                query: function () {
                }
            };
        }

        return tmpFieldObj;
    },
    setIsChange: function () {
        isChange = false;
    }
};


/**
 *onchange執行時，檢查規則
 * @param fieldAttrObj
 * @param oldValue
 * @param newValue
 * @param dgName
 */
var ga_readonlyFields = [];


/**
 * onchange 事件
 * @param fieldAttrObj
 * @param oldValue
 * @param newValue
 * @param dgName
 */
function onChangeAction(fieldAttrObj, oldValue, newValue, dgName) {
    if (newValue != oldValue && !_.isUndefined(newValue) && !_.isUndefined(oldValue) && isUserEdit && isChange) {
        var allDataRow = _.clone($('#' + dgName).datagrid('getRows'));
        var selectDataRow = $('#' + dgName).datagrid('getSelected');
        var indexRow = $('#' + dgName).datagrid('getRowIndex', selectDataRow);
        var editRowData = $("#" + dgName).datagrid('getEditingRowData');

        var postData = {
            prg_id: fieldAttrObj.prg_id,
            rule_func_name: fieldAttrObj.rule_func_name.trim(),
            validateField: fieldAttrObj.ui_field_name,
            rowIndex: indexRow,
            rowData: selectDataRow,
            editRowData: editRowData,
            allRowData: JSON.parse(JSON.stringify(allDataRow)),
            newValue: newValue,
            oldValue: oldValue
        };

        isUserEdit = false;

        BacUtils.doHttpPostAgent('/api/chkFieldRule', postData, function (result) {
            if (result.success) {
                //是否要show出訊息
                if (result.showAlert) {
                    alert(result.alertMsg);
                }

                //是否要show出詢問視窗
                if (result.showConfirm) {
                    if (confirm(result.confirmMsg)) {
                        //有沒有要再打一次ajax到後端
                        if (result.isGoPostAjax) {
                            BacUtils.doHttpPostAgent(result.ajaxURL, postData, function (ajaxResult) {
                                if (!ajaxResult.success) {
                                    alert(ajaxResult.errorMsg);
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
            if (!_.isUndefined(result.effectValues) && !_.isEmpty(result.effectValues)) {

                var effectValues = result.effectValues;
                if (!_.isArray(effectValues) && _.size(effectValues) > 0) {
                    $('#' + dgName).datagrid('updateRow', {
                        index: _.isUndefined(effectValues.effectIndex) ? indexRow : effectValues.effectIndex,
                        row: effectValues
                    });
                    if (!_.isUndefined(effectValues.effectIndex)) {
                        if (effectValues.effectIndex != indexRow) {
                            $('#' + dgName).datagrid('beginEdit', effectValues.effectIndex);
                            $('#' + dgName).datagrid('endEdit', effectValues.effectIndex);
                        }
                    }

                    if (!_.isUndefined(effectValues.day_sta_color)) {
                        var col = $("#" + dgName).datagrid('getColumnOption', 'day_sta');
                        col.styler = function () {
                            return 'background-color:' + effectValues.day_sta_color;
                        };
                    }

                    //確認現在datagrid的editIndex為何
                    var lo_nowIndexRow = $('#' + dgName).datagrid('getRowIndex', $('#' + dgName).datagrid('getSelected'));
                    if (lo_nowIndexRow != indexRow) {
                        $('#' + dgName).datagrid('unselectRow', lo_nowIndexRow);
                        $('#' + dgName).datagrid('endEdit', lo_nowIndexRow);
                    }

                    //現在datagrid的editIndex已經不是indexRow，切換editIndex為indexRow\
                    $('#' + dgName).datagrid('selectRow', indexRow);
                    $('#' + dgName).datagrid('beginEdit', indexRow);
                    $('#' + dgName).datagrid('endEdit', indexRow);

                    //將連動欄位的那列打開編輯
                    $('#' + dgName).datagrid('beginEdit', indexRow);
                    $('#' + dgName).datagrid('selectRow', indexRow);
                }
                else {
                    _.each(effectValues, function (item, index) {
                        var indexRow = $('#' + dgName).datagrid('getRowIndex', allDataRow[item.rowindex]);
                        $('#' + dgName).datagrid('updateRow', {
                            index: indexRow,
                            row: item
                        });
                        adpterDg.tempExecData(item);    //SAM20170727 寫進暫存
                    });

                }

            }

            if (!result.isModifiable) {
                ga_readonlyFields = _.uniq(result.readonlyFields);
                _.each(ga_readonlyFields, function (field) {
                    var lo_editor = $('#' + dgName).datagrid('getEditor', {
                        index: indexRow,
                        field: field
                    });
                    $(lo_editor.target).textbox("readonly", true);
                });
            }
            else {
                _.each(ga_readonlyFields, function (field) {
                    var lo_editor = $('#' + dgName).datagrid('getEditor', {
                        index: indexRow,
                        field: field
                    });
                    $(lo_editor.target).textbox("readonly", true);
                });
            }

            // 動態產生下拉資料
            if (result.selectField.length > 0) {
                //單一欄位下拉資料
                if (result.selectField.length == 1) {
                    var lo_editor = $('#' + dgName).datagrid('getEditor', {
                        index: indexRow,
                        field: result.selectField
                    });
                    $(lo_editor.target).combobox("loadData", result.selectOptions);
                }
                //多個欄位
                else {
                    _.each(result.selectField, function (ls_field) {
                        var lo_editor = $('#' + dgName).datagrid('getEditor', {
                            index: indexRow,
                            field: ls_field
                        });
                        $(lo_editor.target).combobox("loadData", result.multiSelectOptions[ls_field]);
                    });
                }
            }

            isUserEdit = true;
        });

    }
    isChange = true;

}

/**
 * select click 事件
 * @param fieldAttrObj
 * @param dgName
 */
function onSelectClickAction(fieldAttrObj, dgName) {
    var la_allDataRow = _.clone($('#' + dgName).datagrid('getRows'));
    var lo_selectDataRow = $('#' + dgName).datagrid('getSelected');
    var ln_indexRow = $('#' + dgName).datagrid('getRowIndex', lo_selectDataRow);
    var lo_editRowData = $("#" + dgName).datagrid('getEditingRowData');

    var postData = {
        prg_id: fieldAttrObj.prg_id,
        rule_func_name: fieldAttrObj.rule_func_name.trim() + '_dgSelectClick',
        validateField: fieldAttrObj.ui_field_name,
        rowIndex: ln_indexRow,
        rowData: lo_selectDataRow,
        editRowData: lo_editRowData,
        allRowData: JSON.parse(JSON.stringify(la_allDataRow))
    };

    BacUtils.doHttpPostAgent('/api/chkDgSelectClickRule', postData, function (result) {
        if (result.success) {
            //是否要show出訊息
            if (result.showAlert) {
                alert(result.alertMsg);
            }

            //是否要show出詢問視窗
            if (result.showConfirm) {
                if (confirm(result.confirmMsg)) {
                    //有沒有要再打一次ajax到後端
                    if (result.isGoPostAjax) {
                        BacUtils.doHttpPostAgent(result.ajaxURL, postData, function (ajaxResult) {
                            if (!ajaxResult.success) {
                                alert(ajaxResult.errorMsg);
                            }
                        });
                    }
                }
            }
        }
        else {
            alert(result.errorMsg);
        }

        // 動態產生下拉資料
        if (result.selectField.length > 0) {
            //單一欄位下拉資料
            if (result.selectField.length == 1) {
                var lo_editor = $('#' + dgName).datagrid('getEditor', {
                    index: ln_indexRow,
                    field: result.selectField
                });
                if (fieldAttrObj.ui_field_name == 'select') {
                    $(lo_editor.target).combobox("loadData", result.selectOptions);
                }
                else if (fieldAttrObj.ui_field_name == 'selectgrid') {
                    $(lo_editor.target).combogrid("grid").datagrid("loadData", result.selectOptions);
                }
            }
            //多個欄位
            else {
                _.each(result.selectField, function (ls_field) {
                    var lo_editor = $('#' + dgName).datagrid('getEditor', {
                        index: ln_indexRow,
                        field: ls_field
                    });
                    $(lo_editor.target).combobox("loadData", result.multiSelectOptions[ls_field]);
                });
            }
        }
    });
};

/**
 * selectgrid 搜尋事件
 * @param fieldAttrObj
 * @param qryValue
 * @param dgName
 */
function onQryAction(fieldAttrObj, qryValue, dgName) {
    var la_allDataRow = _.clone($('#' + dgName).datagrid('getRows'));
    var lo_selectDataRow = $('#' + dgName).datagrid('getSelected');
    var ln_indexRow = $('#' + dgName).datagrid('getRowIndex', lo_selectDataRow);
    var lo_editRowData = $("#" + dgName).datagrid('getEditingRowData');

    var lo_postData = {
        prg_id: fieldAttrObj.prg_id,
        rule_func_name: fieldAttrObj.rule_func_name.trim() + "_dgSelectgridQry",
        validateField: fieldAttrObj.ui_field_name,
        rowIndex: ln_indexRow,
        rowData: lo_selectDataRow,
        editRowData: lo_editRowData,
        allRowData: JSON.parse(JSON.stringify(la_allDataRow)),
        qryValue: qryValue
    };
    BacUtils.doHttpPostAgent('/api/chkDgSelectgridQryRule', lo_postData, function (result) {
        if (result.success) {
            //是否要show出訊息
            if (result.showAlert) {
                alert(result.alertMsg);
            }

            //是否要show出詢問視窗
            if (result.showConfirm) {
                if (confirm(result.confirmMsg)) {
                    //有沒有要再打一次ajax到後端
                    if (result.isGoPostAjax) {
                        BacUtils.doHttpPostAgent(result.ajaxURL, postData, function (ajaxResult) {
                            if (!ajaxResult.success) {
                                alert(ajaxResult.errorMsg);
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
        // if (!_.isUndefined(result.effectValues) && !_.isEmpty(result.effectValues)) {
        //     var effectValues = result.effectValues;
        //     if (!_.isArray(effectValues) && _.size(effectValues) > 0) {
        //         $('#' + dgName).datagrid('updateRow', {
        //             index: _.isUndefined(effectValues.effectIndex) ? ln_indexRow : effectValues.effectIndex,
        //             row: effectValues
        //         });
        //         if (!_.isUndefined(effectValues.effectIndex)) {
        //             if (effectValues.effectIndex != ln_indexRow) {
        //                 $('#' + dgName).datagrid('beginEdit', effectValues.effectIndex);
        //                 $('#' + dgName).datagrid('endEdit', effectValues.effectIndex);
        //             }
        //         }
        //
        //         if (!_.isUndefined(effectValues.day_sta_color)) {
        //             var col = $("#" + dgName).datagrid('getColumnOption', 'day_sta');
        //             col.styler = function () {
        //                 return 'background-color:' + effectValues.day_sta_color;
        //             };
        //         }
        //
        //         //確認現在datagrid的editIndex為何
        //         var lo_nowIndexRow = $('#' + dgName).datagrid('getRowIndex', $('#' + dgName).datagrid('getSelected'));
        //         if (lo_nowIndexRow != ln_indexRow) {
        //             $('#' + dgName).datagrid('unselectRow', lo_nowIndexRow);
        //             $('#' + dgName).datagrid('endEdit', lo_nowIndexRow);
        //         }
        //
        //         //現在datagrid的editIndex已經不是indexRow，切換editIndex為indexRow
        //         $('#' + dgName).datagrid('beginEdit', ln_indexRow);
        //         $('#' + dgName).datagrid('endEdit', ln_indexRow);
        //
        //         //將連動欄位的那列打開編輯
        //         $('#' + dgName).datagrid('beginEdit', ln_indexRow);
        //         $('#' + dgName).datagrid('selectRow', ln_indexRow);
        //     }
        //     else {
        //         _.each(effectValues, function (item, index) {
        //             var indexRow = $('#' + dgName).datagrid('getRowIndex', la_allDataRow[item.rowindex]);
        //             $('#' + dgName).datagrid('updateRow', {
        //                 index: indexRow,
        //                 row: item
        //             });
        //         });
        //
        //     }
        //
        // }

        //動態產生下拉資料
        if (result.selectField.length == 1) {
            var lo_editor = $('#' + dgName).datagrid('getEditor', {
                index: ln_indexRow,
                field: fieldAttrObj.ui_field_name
            });
            //動態產生下拉資料
            if (result.selectField.length == 1) {
                var lo_editor = $('#' + dgName).datagrid('getEditor', {
                    index: ln_indexRow,
                    field: fieldAttrObj.ui_field_name
                });
                // $(lo_editor.target).combogrid("hidePanel");
                //將原本的下拉資料改為規則帶回的下拉資料
                $(lo_editor.target).combogrid("grid").datagrid("loadData", result.selectOptions);
                _.each(result.selectOptions, (lo_selectOption) => {
                    fieldAttrObj.selectData.selectData.push(lo_selectOption);
                });
                //將datagrid 的text 改為所查詢的值
                isChange = false;
                $(lo_editor.target).combogrid("setText", qryValue);
                $(lo_editor.target).combogrid("setValue", qryValue);

            }
        }
    });
}

/** 組件事件綁定 **/

//顏色選擇器
$(document).on("change", "#colorWell", function (event) {
    var updateRow = {};
    var li_index = $(this).closest("tr").attr("datagrid-row-index");
    var ls_field_name = $(this).data("field");
    var ls_dgName = $(this).data("dgname");
    var color_cod = colorTool.hexToColorCod(event.target.value);
    ga_colorAry[li_index].color = event.target.value;
    updateRow[ls_field_name] = color_cod;
    var lo_row = $('#' + ls_dgName).datagrid('getRows')[li_index];
    lo_row.color_num = color_cod;
    /** 有用到這隻的必須要 new Adapter 實體讓這隻程式與原本的js 串接 **/

    //adpterDg.tempExecData(lo_row); //此部分會造成顏色切換一次就塞一次暫存的Array，造成違反唯一鍵值 韻仁 2017/08/03
});

//Checkbox onchange事件
$(document).on('change', ".dg-checkbox-change", function (event) {
    var li_index = $(this).parents("tr[id^='datagrid']").attr("datagrid-row-index");
    var ls_dgName = $(this).closest(".panel").find('.datagrid-f').attr('id');
    var lo_rowData = $("#" + ls_dgName).datagrid('getEditingRowData');
    var ui_field_name = "";
    $(this).parents("td").each(function () {
        if ($(this).attr("field") && $(this).attr("field") != "") {
            ui_field_name = $(this).attr("field");
        }
    });
    var lo_columnOption = $("#" + ls_dgName).datagrid("getColumnOption", ui_field_name);
    var selectData = lo_columnOption.selectData || [];
    var oldVal = $(this).val();
    var newVal = "";
    _.each(selectData[0], function (val) {
        if (val != oldVal) {
            newVal = val;
        }
    });
    var updateData = {};
    updateData[ui_field_name] = newVal;
    $('#' + ls_dgName).datagrid('updateRow', {
        index: li_index,
        row: updateData
    });
    $('#' + ls_dgName).datagrid('beginEdit', li_index);
    onChangeAction(lo_columnOption, oldVal, newVal, ls_dgName);

});

/** 套件組件覆寫 **/
$.extend($.fn.datagrid.methods, {
    /**
     * 獲取目前編輯中Row的資料，雖datagrid 有'getSelected' method 可用
     * 但是還未送出新的值有些會不取到，故寫這個方法獲取
     * @return rowData {Object} : 回傳編輯中的Row
     */
    getEditingRowData: function (event) {

        var dgName = $(event[0].outerHTML).attr("id");
        var editingIdx = $('#' + dgName).datagrid('getRowIndex', $('#' + dgName).datagrid('getSelected'));
        var cols = $("#" + dgName).datagrid("getColumnFields");
        var rowData = $('#' + dgName).datagrid('getSelected');
        var $row = $("table[class='datagrid-btable']").find("tr[datagrid-row-index='" + editingIdx + "']");
        _.each(cols, function (field_name) {
                var $td = $row.find("td[field='" + field_name + "']").length == 1 ? $row.find("td[field='" + field_name + "']") : $row.find("td[field='" + field_name + "']")[1];
                var $textbox = $(".textbox-value", $td);
                var $checkbox = $(".dg-checkbox-change", $td);

                if ($textbox.length > 0) {
                    if ($textbox.val().trim() != "") {
                        rowData[field_name] = $textbox.val().trim();
                    }
                    else if ($checkbox.length > 0) {
                        if ($checkbox.val().trim() != "") {
                            rowData[field_name] = $checkbox.val().trim();
                        }
                    }
                }
            }
        );
        return rowData;
    }
});

$.extend($.fn.datagrid.defaults.editors, {
    checkbox: {
        init: function (container, options) {
            var ls_dgName = $(container).closest(".panel").find('.datagrid-f').attr('id');
            var li_index = $("#" + ls_dgName).datagrid("getRowIndex", $("#" + ls_dgName).datagrid("getSelected"));
            if (li_index == -1) {
                return;
            }
            var lo_rowData = $("#" + ls_dgName).datagrid("getRows")[li_index];
            var ls_field_name = $(container.context.outerHTML).attr("field");
            var val = lo_rowData[ls_field_name];
            var checked = options.on == val ? 'checked' : '';
            var input = $('<input type="checkbox" class="dg-checkbox-change"  ' + checked + '>').appendTo(container);
            return input;
        },
        destroy: function (target) {
            $(target).remove();
        },
        getValue: function (target) {
            return $(target).val();
        },
        setValue: function (target, value) {
            $(target).val(value);
        },
        resize: function (target, width) {
            $(target)._outerWidth(width);
        }
    }
});


