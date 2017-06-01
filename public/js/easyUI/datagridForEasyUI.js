/**
 * Created by Jun on 2017/2/25.
 * EasyUI 對應page field 欄位屬性相關方法
 * moment套件(必須)
 */

var gb_onceEffectFlag = true;
var EZfieldClass = {
    //根據欄位屬性組Datagrid屬性資料
    combineFieldOption: function (fieldData) {
        var columnsData = [];

        _.each(fieldData, function (field) {
            //決定欄位是否顯示
            if (field.visiable == "Y") {
                columnsData.push(EZfieldClass.fieldConvEzAttr(field));
            }
        });


        return columnsData;
    },
    /** Page Field 轉換　easyUI datagrid欄位屬性**/
    fieldConvEzAttr: function (fieldAttrObj) {

        var dataType = "";
        if (fieldAttrObj.ui_type == "text") {
            dataType = 'textbox';
        } else if (fieldAttrObj.ui_type == "number") {
            dataType = 'numberbox';
        } else if (fieldAttrObj.ui_type == "date") {
            dataType = 'datebox';
        } else if (fieldAttrObj.ui_type == "datetime") {
            dataType = 'datetimebox';
        } else if (fieldAttrObj.ui_type == "select" || fieldAttrObj.ui_type == "multiselect") {
            dataType = 'combobox';
        } else if (fieldAttrObj.ui_type == "checkbox") {
            dataType = 'checkbox';
        } else if (fieldAttrObj.ui_type == "color") {
            dataType = 'color';
        } else if (fieldAttrObj.ui_type == "time") {
            dataType = 'timespinner';
        }

        var tmpFieldObj = {
            field: fieldAttrObj.ui_field_name.toLowerCase(),
            title: fieldAttrObj.ui_display_name,
            page_id: fieldAttrObj.page_id,
            width: fieldAttrObj.width,
            sortable: true
        };

        tmpFieldObj.editor = {
            type: dataType,
            options: {
                required: fieldAttrObj.requirable == "Y",
                readonly: fieldAttrObj.modificable == "N",
                validType: fieldAttrObj.format_func_name != "" ? fieldAttrObj.format_func_name.split(",") : []
            },
        };

        //長度
        var mixLength = fieldAttrObj.requirable == "Y" ? '0' : '1';
        var maxLength = fieldAttrObj.ui_field_length;
        if (fieldAttrObj.ui_type != "select") {   //combobox因text內容有長有短，所以排除此長度驗證
            tmpFieldObj.editor.options.validType.push('ChkLength[' + mixLength + ',' + maxLength + ']');
        }
        //checkbox
        if (fieldAttrObj.ui_type == "checkbox") {
            tmpFieldObj.editor.options = fieldAttrObj.selectData;
            // tmpFieldObj.editor.options =  {off:'N',on:'Y'};
        }

        tmpFieldObj.ui_type = fieldAttrObj.ui_type;
        tmpFieldObj.ui_field_length = fieldAttrObj.ui_field_length;
        tmpFieldObj.ui_field_num_point = fieldAttrObj.ui_field_num_point;
        tmpFieldObj.visiable = fieldAttrObj.visiable;
        tmpFieldObj.modificable = fieldAttrObj.modificable;
        tmpFieldObj.requirable = fieldAttrObj.requirable;
        tmpFieldObj.keyable = fieldAttrObj.keyable;
        tmpFieldObj.rule_func_name = fieldAttrObj.rule_func_name;
        tmpFieldObj.format_func_name = fieldAttrObj.format_func_name;
        tmpFieldObj.grid_field_name = fieldAttrObj.grid_field_name;
        tmpFieldObj.multi_lang_table = fieldAttrObj.multi_lang_table;
        tmpFieldObj.styler = function () {
            if (fieldAttrObj.requirable == "Y") {
                return 'background-color:rgb(198, 242, 217);';
            }

        };

        // Formatter 顯示資料
        if (dataType == "datebox") {
            tmpFieldObj.formatter = function (date, row, index) {
                return moment(date).format("YYYY/MM/DD");
            }
        } else if (dataType == "datetimebox") {
            var datetimeFunc = function (date) {
                return moment(date).format("YYYY/MM/DD HH:mm:ss");
            };
            tmpFieldObj.formatter = datetimeFunc;
            //tmpFieldObj.editor.options.formatter = datetimeFunc;
        } else if (dataType == "combobox") {
            tmpFieldObj.editor.type = dataType;
            tmpFieldObj.editor.options.valueField = 'value';
            tmpFieldObj.editor.options.textField = 'display';
            tmpFieldObj.editor.options.data = fieldAttrObj.selectData;
            tmpFieldObj.editor.options.editable = false;
            tmpFieldObj.formatter = function (val, row, index) {
                if (val != null) {
                    var datas = val.split(",");
                    var allValues = "";
                    _.each(datas, function (field) {
                        if (_.findIndex(fieldAttrObj.selectData, {value: field}) > -1) {
                            var valueName = _.findWhere(fieldAttrObj.selectData, {value: field}).display;
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
                    if (oldValue == "") return false;
                    onChange_Action(fieldAttrObj, oldValue, newValue);
                }
            }
        } else if (dataType == "checkbox") {
            tmpFieldObj.formatter = function (val, row, index) {
                //TODO 值不可寫死
                var fieldName = val == 'Y' ? "使用" : "不使用";
                return fieldName;
            }
        } else if (fieldAttrObj.ui_type == "color") {
            var lf_colorFormatter = function (color_cod, row, index) {
                var color_val = "#" + String(colorTool.colorCodToHex(color_cod));
                var disabled = fieldAttrObj.modificable == "N" ? "disabled" : ""; //判斷可否修改
                return "<input type='color' " + disabled + " onchange=ColorFunc.selectEvent('" + tmpFieldObj.field + "'," + index + ",this) class='dg_colorPicker_class spectrumColor'  value='" + color_val + "'  />";
            };
            tmpFieldObj.formatter = lf_colorFormatter;
        }
        else if (fieldAttrObj.ui_type == "text") {
            if (fieldAttrObj.rule_func_name != "") {
                tmpFieldObj.editor.type = dataType;
                tmpFieldObj.editor.options.onChange = function (newValue, oldValue) {
                    if (oldValue == "") return false;
                    onChange_Action(fieldAttrObj, oldValue, newValue);
                }
            }
        }
        return tmpFieldObj;
    }

};

// onchange執行時，檢查規則
function onChange_Action(fieldAttrObj, oldValue, newValue) {
    if (newValue != oldValue) {
        var selectDataRow = $('#prg_dg').datagrid('getSelected');
        var postData = {
            prg_id: fieldAttrObj.prg_id,
            rule_func_name: fieldAttrObj.rule_func_name,
            validateField: fieldAttrObj.ui_field_name,
            rowData: JSON.parse(JSON.stringify(selectDataRow)),
            newValue: newValue,
            oldValue: oldValue
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
                        //有沒有要再打一次ajax到後端
                        if (result.isGoPostAjax) {
                            $.post(result.ajaxURL, postData, function (ajaxResult) {
                                if (!ajaxResult.success) {
                                    alert(ajaxResult.errorMsg);
                                }
                            })
                        }
                    }
                }
            }
            else {
                alert(result.errorMsg);
            }

            //連動帶回的值
            if (!_.isUndefined(result.effectValues)) {
                var effectValues = result.effectValues;
                var indexRow = $('#prg_dg').datagrid('getRowIndex', selectDataRow);

                $('#prg_dg').datagrid('endEdit', indexRow);
                $('#prg_dg').datagrid('updateRow', {
                    index: indexRow,
                    row: effectValues
                });

                $('#prg_dg').datagrid('beginEdit', indexRow);
            }
        });
    }
}

var ColorFunc = {
    //選擇顏色事件
    selectEvent: function (field_name, rowIdx, _this) {
        var dataGridName = "prg_dg";
        var updateRow = {};
        var color_cod = colorTool.hexToColorCod(_this.value);
        updateRow[field_name] = color_cod;
        vm.tempExecData($('#' + dataGridName).datagrid('getRows')[rowIdx]);
        vm.endEditing();
        $('#' + dataGridName).datagrid('updateRow', {
            index: rowIdx,
            row: updateRow
        });
    }
};


$(function () {

    // $(document).on("input", ".dg_colorPicker_class", function () {
    //     var dataGridName = "prg_dg";
    //     var dataIdx = $(this).data("index");
    //     var color_cod = $(this).val();
    //     var field_name = $(this).data("field_name");
    //     var updateRow = {};
    //     console.log("===color_cod===");
    //     console.log(color_cod);
    //     updateRow[field_name] = color_cod;
    //     $('#' + dataGridName).datagrid('updateRow', {
    //         index: dataIdx,
    //         row: updateRow
    //     });
    //
    //
    // })
})


