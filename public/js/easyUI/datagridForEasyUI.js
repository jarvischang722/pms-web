/**
 * Created by Jun on 2017/2/25.
 * EasyUI 對應page field 欄位屬性相關方法
 * moment套件(必須)
 */
var isUserEdit = true; //是否為修改或是連動修改
var ga_colorAry = [];  //
/**
 * datagrid 轉接器與call
 * @param vm
 * @constructor
 * TODO 這個Class 之後要搬到另一個檔案 2017/07/26
 */
var AdapterDatagrid = function (vm) {
    if (_.isUndefined(vm.tempExecData)) {
        console.error(new Error("method 'tempExecData' not defined."));
    }
    this.tempExecData = vm.tempExecData;
};


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
        if (fieldAttrObj.ui_type == "text" ) {
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
        } else {
            dataType = 'textbox';
        }

        var tmpFieldObj = fieldAttrObj;

        tmpFieldObj.field = fieldAttrObj.ui_field_name.toLowerCase();
        tmpFieldObj.title = fieldAttrObj.ui_display_name;
        tmpFieldObj.sortable = true;


        tmpFieldObj.editor = {
            type: dataType,
            options: {
                required: fieldAttrObj.requirable == "Y",
                readonly: fieldAttrObj.modificable == "N",
                validType: fieldAttrObj.format_func_name != "" ? fieldAttrObj.format_func_name.split(",") : []
            }
        };

        /** 長度限制  **/
        var mixLength = fieldAttrObj.requirable == "Y" ? '0' : '1';
        var maxLength = fieldAttrObj.ui_field_length;
        if (fieldAttrObj.ui_type != "select") {   //combobox因text內容有長有短，所以排除此長度驗證
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

        /** Formatter 顯示  **/
        if (dataType == "datebox") {
            var dateFunc = function (date) {
                if (date != "" && !_.isUndefined(date)) {
                    return moment(date).format("YYYY/MM/DD");
                }

                return new moment().format("YYYY/MM/DD");


            };

            var dateParserFunc = function (date) {
                if (date != "" && !_.isUndefined(date)) {
                    return new Date(Date.parse(date));
                }

                return new Date();

            };

            tmpFieldObj.formatter = dateFunc;
            tmpFieldObj.editor.options.parser = dateParserFunc;
            tmpFieldObj.editor.options.formatter = dateFunc;

            //combobox連動
            if (fieldAttrObj.rule_func_name != "") {
                tmpFieldObj.editor.options.onSelect = function (date) {
                    var ls_dgName = $(this).closest(".datagrid-view").children("table").attr("id");
                    onChangeAction(fieldAttrObj, "", date, ls_dgName);
                };
            }

        } else if (dataType == "datetimebox") {

            var datetimeFunc = function (date, row) {
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
                    var ls_dgName = $(this).closest(".datagrid-view").children("table").attr("id");
                    if (isUserEdit) {
                        onChangeAction(fieldAttrObj, oldValue, newValue, ls_dgName);
                    }
                };
            }
        } else if (fieldAttrObj.ui_type == "checkbox") {

            tmpFieldObj.formatter = function (val, row, index) {
                var lo_checkboxVal = fieldAttrObj.selectData[1];
                if (_.isUndefined(lo_checkboxVal)) {
                    lo_checkboxVal = {
                        Y: 'Y',
                        N: 'N'
                    };
                }
                var fieldName = val == 'Y' ? lo_checkboxVal.Y : lo_checkboxVal.N;
                return fieldName;
            };

        } else if (fieldAttrObj.ui_type == "color") {
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
        else if (fieldAttrObj.ui_type == "text") {
            var isTextTouchEvent = true;
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
                if(!_.isNull(val)){
                    var lo_val = String(val);
                    if (lo_val.indexOf(":") == "-1") {
                        var hour = lo_val.substring(0, 2);
                        var min = lo_val.substring(2, 4);

                        return hour + ":" + min;
                    }
                    return val;
                }
                else{
                    return "";
                }

            };
        } else if (dataType == "combogrid") {
            //參數設定於各對照擋的Rule
            tmpFieldObj.editor.options.panelWidth = fieldAttrObj.selectGridOptions.panelWidth;
            tmpFieldObj.editor.options.idField = fieldAttrObj.selectGridOptions.idField;
            tmpFieldObj.editor.options.textField = fieldAttrObj.selectGridOptions.textField;
            tmpFieldObj.editor.options.columns = fieldAttrObj.selectGridOptions.columns;
            tmpFieldObj.editor.options.data = fieldAttrObj.selectData;
        }
        return tmpFieldObj;
    }
};


/**
 *onchange執行時，檢查規則
 * @param fieldAttrObj
 * @param oldValue
 * @param newValue
 * @param dgName
 */
function onChangeAction(fieldAttrObj, oldValue, newValue, dgName) {

    return false;
    if (newValue != oldValue && !_.isUndefined(newValue) && isUserEdit) {
        var allDataRow = $('#' + dgName).datagrid('getRows');
        var selectDataRow = $('#' + dgName).datagrid('getSelected');
        var indexRow = $('#' + dgName).datagrid('getRowIndex', selectDataRow);
        var editRowData = $("#" + dgName).datagrid('getEditingRowData');

        // if (selectDataRow.createRow == "Y") {
        //     selectDataRow[fieldAttrObj.ui_field_name] = newValue;
        // }

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
                isUserEdit = false;
                if (!_.isArray(effectValues) && _.size(result.effectValues) > 0) {

                    $('#' + dgName).datagrid('endEdit', indexRow);
                    $('#' + dgName).datagrid('updateRow', {
                        index: indexRow,
                        row: effectValues
                    });

                    if(!_.isUndefined(effectValues.day_sta_color)) {
                        var col = $("#" + dgName).datagrid('getColumnOption','day_sta');
                        col.styler = function(){
                            return 'background-color:' + effectValues.day_sta_color;
                        };
                    }

                    $('#' + dgName).datagrid('beginEdit', indexRow);

                } else {
                    _.each(effectValues, function (item, index) {
                        var indexRow = $('#' + dgName).datagrid('getRowIndex', allDataRow[item.rowindex]);
                        $('#' + dgName).datagrid('updateRow', {
                            index: indexRow,
                            row: item
                        });
                        adpterDg.tempExecData(item);    //SAM20170727 寫進暫存
                    });

                }

                isUserEdit = true;
            }

            if (!result.isModifiable) {
                var la_readonlyFields = _.uniq(result.readonlyFields);
                _.each(la_readonlyFields, function (field) {
                    var lo_editor = $('#' + dgName).datagrid('getEditor', {
                        index: indexRow,
                        field: field
                    });
                    $(lo_editor.target).textbox("readonly", true);
                });
            }
        });
    }
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
    var ls_dgName = $('.datagrid-f').attr('id');
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
            if ($row.find("td[field='" + field_name + "']").length == 1) {
                if ($row.find("td[field='" + field_name + "']").find(".textbox-value").length > 0) {
                    if( $row.find("td[field='" + field_name + "']").find(".textbox-value").val().trim() != ""){
                        rowData[field_name] = $row.find("td[field='" + field_name + "']").find(".textbox-value").val().trim();
                    }
                } else if ($row.find("td[field='" + field_name + "']").find(".dg-checkbox-change").length > 0) {
                    if( $row.find("td[field='" + field_name + "']").find(".dg-checkbox-change").val().trim() != ""){
                        rowData[field_name] = $row.find("td[field='" + field_name + "']").find(".dg-checkbox-change").val().trim();
                    }
                }
            }
        });

        return rowData;
    }
});

$.extend($.fn.datagrid.defaults.editors, {
    checkbox: {
        init: function (container, options) {
            var ls_dgName = $('.datagrid-f').attr('id');
            var li_index = $("#" + ls_dgName).datagrid("getRowIndex", $("#" + ls_dgName).datagrid("getSelected"));
            var rowData = $("#" + ls_dgName).datagrid("getRows")[li_index];
            var field_name = $(container.context.outerHTML).attr("field");
            var val = rowData[field_name];
            var checked = options.on == val ? 'checked' : '';
            var input = $('<input type="checkbox" class="dg-checkbox-change"  ' + checked + ' onchange="">').appendTo(container);
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


