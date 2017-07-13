/**
 * Created by Jun on 2017/2/25.
 * EasyUI 對應page field 欄位屬性相關方法
 * moment套件(必須)
 */
var isUserEdit = true;
var gb_onceEffectFlag = true;
var EZfieldClass = {
    //根據欄位屬性組Datagrid屬性資料
    combineFieldOption: function (fieldData, dgName) {
        var columnsData = [];
        _.each(fieldData, function (field) {
            //決定欄位是否顯示
            if (field.visiable == "Y") {
                columnsData.push(EZfieldClass.fieldConvEzAttr(field, dgName));
            }
        });

        return columnsData;
    },
    /** Page Field 轉換　easyUI datagrid欄位屬性**/
    fieldConvEzAttr: function (fieldAttrObj, dgName) {

        var dataType = "";
        if (fieldAttrObj.ui_type == "text") {
            dataType = 'textbox';
        } else if (fieldAttrObj.ui_type == "number" || fieldAttrObj.ui_type == "percent") {
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
        } else if (fieldAttrObj.ui_type == "selectgrid") {
            dataType = 'combogrid';
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
            }
        };

        //長度
        var mixLength = fieldAttrObj.requirable == "Y" ? '0' : '1';
        var maxLength = fieldAttrObj.ui_field_length;
        if (fieldAttrObj.ui_type != "select") {   //combobox因text內容有長有短，所以排除此長度驗證
            tmpFieldObj.editor.options.validType.push('ChkLength[' + mixLength + ',' + maxLength + ']');
        }
        //checkbox
        if (fieldAttrObj.ui_type == "checkbox") {
            tmpFieldObj.editor.options = fieldAttrObj.selectData[0];
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
            var dateFunc = function (date) {
                return moment(date).format("YYYY/MM/DD");
            };

            var dateParserFunc = function (date) {
                if(date != "") {
                    return new Date(Date.parse(date));
                }
                else{
                    return "";
                }
            };

            tmpFieldObj.formatter = dateFunc;
            tmpFieldObj.editor.options.parser = dateParserFunc;
            tmpFieldObj.editor.options.formatter = dateFunc;

            //combobox連動
            if (fieldAttrObj.rule_func_name != "") {
                tmpFieldObj.editor.options.onSelect = function (date) {
                    onChange_Action(fieldAttrObj, "", date, dgName);
                };
            }

        } else if (dataType == "datetimebox") {

            var datetimeFunc = function (date, row) {
                return moment(date).format("YYYY/MM/DD HH:mm:ss");
            };

            var datetimeFuncParser = function (date) {
                return new Date(Date.parse(date));
            };
            tmpFieldObj.formatter = datetimeFunc;
            tmpFieldObj.editor.options.parser = datetimeFuncParser;
            tmpFieldObj.editor.options.formatter = datetimeFunc;

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
                    if (isUserEdit) {
                        onChange_Action(fieldAttrObj, oldValue, newValue, dgName);
                    }
                };
            }
        } else if (dataType == "checkbox") {
            tmpFieldObj.formatter = function (val, row, index) {
                var displayName = fieldAttrObj.selectData[1];
                var fieldName = val == 'Y' ? displayName.Y : displayName.N;
                return fieldName;
            };
        } else if (fieldAttrObj.ui_type == "color") {
            var lf_colorFormatter = function (color_cod, row, index) {
                var color_val = "#" + String(colorTool.colorCodToHex(color_cod));
                var disabled = fieldAttrObj.modificable == "N" ? "disabled" : ""; //判斷可否修改
                return "<input type='color' " + disabled + " onchange=ColorFunc.selectEvent('" + tmpFieldObj.field + "'," + index + ",this,dgName) class='dg_colorPicker_class spectrumColor'  value='" + color_val + "'  />";
            };
            tmpFieldObj.formatter = lf_colorFormatter;
        }
        else if (fieldAttrObj.ui_type == "text") {
            var isTextTouchEvent = true;
            tmpFieldObj.editor.type = dataType;
            tmpFieldObj.editor.options.onChange = function (newValue, oldValue) {

                if (!_.isUndefined(newValue)) {
                    if (fieldAttrObj.modificable == "I") {
                        var li_rowIndex = parseInt($(this).closest('tr.datagrid-row').attr("datagrid-row-index"));
                        var rowData = $('#' + dgName).datagrid('getRows')[li_rowIndex];

                        var lo_editor = $('#' + dgName).datagrid('getEditor', {
                            index: li_rowIndex,
                            field: fieldAttrObj.ui_field_name
                        });
                        if (!rowData.createRow) {
                            $(lo_editor.target).textbox("readonly", true);
                        }
                    }
                }

                if (isUserEdit) {
                    if (fieldAttrObj.rule_func_name != "") {
                        onChange_Action(fieldAttrObj, oldValue, newValue, dgName);
                    }
                }
            };

        } else if (dataType == "numberbox") {
            tmpFieldObj.editor.options.precision = fieldAttrObj.ui_field_num_point;

            if (fieldAttrObj.ui_type == "percent") {
                tmpFieldObj.formatter = function (val, row, index) {
                    var fieldName = parseFloat(val) * 100 + "%";
                    return fieldName;
                };
            }
        } else if (dataType == "timespinner") {
            tmpFieldObj.formatter = function (val, row, index) {
                var lo_val = String(val);
                if (lo_val.indexOf(":") == "-1") {
                    var hour = lo_val.substring(0, 2);
                    var min = lo_val.substring(2, 4);
                    return hour + ":" + min;
                }
                else {
                    return val;
                }
            };
        } else if (dataType == "combogrid") {  //SAM:目前正在實做中，目前都沒用到
            tmpFieldObj.editor.options.idField = 'field';
            tmpFieldObj.editor.options.textField = 'title';
            tmpFieldObj.editor.options.columns = fieldAttrObj.selectData;
        }

        return tmpFieldObj;
    }

};

// onchange執行時，檢查規則
function onChange_Action(fieldAttrObj, oldValue, newValue, dgName) {
    if (newValue != oldValue) {
        var selectDataRow = $('#' + dgName).datagrid('getSelected');
        var postData = {
            prg_id: fieldAttrObj.prg_id,
            rule_func_name: fieldAttrObj.rule_func_name.trim(),
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
                            });
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
                var indexRow = $('#' + dgName).datagrid('getRowIndex', selectDataRow);
                isUserEdit = false;
                $('#' + dgName).datagrid('endEdit', indexRow);
                $('#' + dgName).datagrid('updateRow', {
                    index: indexRow,
                    row: effectValues
                });

                $('#' + dgName).datagrid('beginEdit', indexRow);
                isUserEdit = true;
            }
        });
    }
}

var ColorFunc = {
    //選擇顏色事件
    selectEvent: function (field_name, rowIdx, _this, dgName) {
        console.log(dgName);
        var dataGridName = dgName;
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


