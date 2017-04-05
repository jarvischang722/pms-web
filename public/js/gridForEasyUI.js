/**
 * Created by Jun on 2017/2/25.
 * EasyUI 對應page field 欄位屬性相關方法
 * moment套件(必須)
 */

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
        }else if(fieldAttrObj.ui_type == "select"){
            dataType = 'combobox';
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
        tmpFieldObj.editor.options.validType.push('length[' + mixLength + ',' + maxLength + ']');


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



        // format 顯示資料
        if (dataType == "datebox") {
            tmpFieldObj.formatter = function (date, row, index) {
                return moment(date).format("YYYY/MM/DD");
            }
        } else if (dataType == "datetimebox") {
            var datetimeFunc = function (date) {
                return moment(date).format("YYYY/MM/DD HH:mm:ss");
            };
            tmpFieldObj.formatter = datetimeFunc;
            tmpFieldObj.editor.options.formatter = datetimeFunc;
        }else if(dataType == "combobox"){
            tmpFieldObj.editor.type = dataType;
            tmpFieldObj.editor.options.valueField = 'value';
            tmpFieldObj.editor.options.textField = 'display';
            tmpFieldObj.editor.options.data  =  fieldAttrObj.selectData;
            tmpFieldObj.editor.options.required = true;

        }

        return tmpFieldObj;
    },
    /** 欄位屬性轉換成EZ UI Form 屬性**/
    fieldConvEzFormOption: function (fieldAttrObj) {

        var tmpOptions = {
            required: fieldAttrObj.requirable == "Y",
            readonly: fieldAttrObj.modificable == "N",
            validType: fieldAttrObj.format_func_name != "" ? [fieldAttrObj.format_func_name] : [],
            width: fieldAttrObj.width,
            field: fieldAttrObj.ui_field_name.toLowerCase()
        };

        //長度
        var mixLength = fieldAttrObj.requirable == "Y" ? '0' : '1';
        var maxLength = fieldAttrObj.ui_field_length;
        if (!_.isNull(maxLength) && !_.isNull(maxLength)) {
            tmpOptions.validType.push('length[' + mixLength + ',' + maxLength + ']');
        }

        // format 顯示資料
        if (fieldAttrObj.ui_type == "date") {
            tmpOptions.formatter = function (date, row, index) {
                return moment(date).format("YYYY/MM/DD");
            }
        } else if (fieldAttrObj.ui_type == "datetimebox") {

            tmpOptions.formatter = function (date) {
                return moment(date).format("YYYY/MM/DD HH:mm:ss");
            };
        }

        return tmpOptions;
    },
    //產生easyUI html
    pageTwoFieldOptionsActive: function (fieldData) {

        _.each(fieldData, function (field) {
            var inputFieldID = "singleGrid_" + field.ui_field_name;   //form input 的ID
            var dataType = "text";   //input 種類
            if (field.ui_type == "text") {
                dataType = 'textbox';
            } else if (field.ui_type == "number") {
                dataType = 'numberbox';
            } else if (field.ui_type == "date") {
                dataType = 'datebox';
            } else if (field.ui_type == "datetime") {
                dataType = 'datetimebox';
            }
            var dataOpts = EZfieldClass.fieldConvEzFormOption(field);
            var ui_display_name = field.ui_display_name;

            if (field.visiable == "Y") {
                // 初始化屬性
                $('#' + inputFieldID)[dataType](dataOpts);
            }

        })
    }

};