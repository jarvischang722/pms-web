/**
 * Created by a16010 on 2017/9/11.
 * Modified by a17017 on 2017/11/11.
 */
var vmHub = new Vue();

var ga_selectGridDialogComp = Vue.extend({
    template: "#chooseDataDialogTmp",
    data: function () {
        return {
            fieldNameConditionTmp: [],
            gridColumns: [],
            updateFieldNameTmp: [],
            gridData: [],
            isFistData: false,
            isLastData: false,
            dtEditIndex: undefined,
            fieldData:{}
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
            this.fieldData = result.fieldData;
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
                singleSelect: (self.fieldData.ui_type == 'popupgrid')? true : false ,
                data: textDataGridArray,
                height: height,
                width: width
            }).datagrid('columnMoving');
            self.updateFieldNameTmp = updateFieldName;
        },
        //將選擇到的資料帶回Page2
        chooseDataBackGridSingle: function () {
            var self = this;
            var selectTable = {};
            var chooseData = self.updateFieldNameTmp;
            var updateFieldName = self.updateFieldNameTmp;

            if(this.fieldData.ui_type == 'popupgrid'){
                selectTable = $('#chooseGrid').datagrid('getSelected');

                if (selectTable != null) {
                    _.each(selectTable, function (selectValue, selectField) {
                        _.each(updateFieldName, function (updateValue, updateField) {
                            if (selectField == updateValue) {
                                chooseData[updateField] = selectValue;
                            }
                        });
                    });
                }
                else {
                    _.each(chooseData, function (chooseValue, chooseField) {
                        chooseData[chooseField] = "";  //SAM20170930
                    });
                }
            }
            else{
                selectTable = $('#chooseGrid').datagrid('getSelections');

                _.each(updateFieldName, function (updateValue, updateField) {
                    chooseData[updateField] = [];
                });

                _.each(updateFieldName, function (updateValue, updateField) {
                    _.each(selectTable, function (lo_selectTable) {
                        chooseData[updateField].push(lo_selectTable[updateField]);
                    });
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
                if (row[selectFieldName].includes(selectCondition)) {
                    return row;
                }
            });
            $('#chooseGrid').datagrid('loadData', dataGrid);

        }
    }
});
var go_searchComp = Vue.extend({
    template: "#searchTmp",
    props: ["searchFields", "searchCond", "fetchData"],
    components: {
        "text-select-grid-dialog-tmp": ga_selectGridDialogComp,
        Treeselect: VueTreeselect.Treeselect
    },
    data: function () {
        return {
            searchFieldsByRow: [],
            selectPopUpGridData: [],
            titleName: ""
        };
    },
    created: function () {
        var self = this;
        vmHub.$on('updateBackSelectData', function (chooseData) {
            self.searchCond = _.extend(self.searchCond, chooseData);
        });
    },
    watch: {
        searchFields: function (newFields) {
            this.searchFieldsByRow = _.values(_.groupBy(_.sortBy(newFields, "row_seq"), "row_seq"));
        }
    },
    methods: {
        doSearch: function () {
            var la_searchFields = JSON.parse(JSON.stringify(this.searchFields));
            var lo_searchCond =  JSON.parse(JSON.stringify(this.searchCond));

            _.each(la_searchFields, function (lo_searchField) {
                if(lo_searchField.ui_type == "number"){
                    if(lo_searchField.format_func_name.rule_val != ""){
                        lo_searchCond[lo_searchField.ui_field_name] =
                            go_formatDisplayClass.removeAmtFormat(lo_searchCond[lo_searchField.ui_field_name]);
                    }
                }
                else if(lo_searchField.ui_type == "multitree"){
                    if(lo_searchCond[lo_searchField.ui_field_name].length != 0){
                        let la_options = lo_searchField.selectData;
                        let la_fieldMultitreeVal = JSON.parse(JSON.stringify(lo_searchCond[lo_searchField.ui_field_name]));
                        lo_searchCond[lo_searchField.ui_field_name] = [];

                        _.each(la_fieldMultitreeVal, function(ls_value){
                            let lo_selectData = _.findWhere(la_options, {id: ls_value});
                            if (_.isUndefined(lo_selectData)) {
                                searchOptions(la_options, ls_value, lo_searchCond[lo_searchField.ui_field_name]);
                            }
                            else if (_.isUndefined(lo_selectData.value)) {
                                searchValue(lo_selectData.children, lo_searchCond[lo_searchField.ui_field_name]);
                            }
                            else {
                                lo_searchCond[lo_searchField.ui_field_name].push(lo_selectData.value);
                            }
                        });
                    }
                }
                else if(lo_searchField.ui_type == "tree"){
                    var ln_dataLen = lo_searchCond[lo_searchField.ui_field_name].length;
                    lo_searchCond[lo_searchField.ui_field_name] = lo_searchCond[lo_searchField.ui_field_name][ln_dataLen] - 1;
                }
                else if(lo_searchField.ui_type == "date"){
                    if(lo_searchCond[lo_searchField.ui_field_name] != ""){
                        lo_searchCond[lo_searchField.ui_field_name] =
                            moment(new Date(lo_searchCond[lo_searchField.ui_field_name])).format("YYYY/MM/DD");
                    }
                }
                else if(lo_searchField.ui_type == "datetime"){
                    if(lo_searchCond[lo_searchField.ui_field_name] != ""){
                        lo_searchCond[lo_searchField.ui_field_name] =
                            moment(new Date(lo_searchCond[lo_searchField.ui_field_name])).format("YYYY/MM/DD HH:mm:ss");
                    }
                }
            });

            this.$parent.searchCond = lo_searchCond;
            this.fetchData();
        },
        doClear: function(){
            var self = this;
            var lo_searchCond =  JSON.parse(JSON.stringify(this.searchCond));

            _.each(lo_searchCond, function(val, key){
                if(typeof val === "string"){
                    self.searchCond[key] = "";
                }
                else if (Array.isArray(val)){
                    self.searchCond[key] = [];
                }
            });
        },
        chkClickPopUpGrid: function (field) {
            var self = this;
            this.titleName = field.prg_id;

            if (field.ui_type == "popupgrid" || field.ui_type == "multipopupgrid") {
                var params = {
                    prg_id: field.prg_id,
                    fields: field
                };

                $.post("/api/popUpGridData", params, function (result) {
                    if (result != null) {
                        self.selectPopUpGridData = result.showDataGrid;
                        result.fieldData = field;
                        vmHub.$emit('showPopUpDataGrid', result);
                        self.showPopUpGridDialog();
                    }
                });
            }
        },
        showPopUpGridDialog: function () {
            var self = this;
            this.dialogVisible = true;
            var height = document.documentElement.clientHeight - 60; //browser 高度 - 60功能列
            var width = document.documentElement.clientWidth / 2;    //browser 寬度 - 200功能列

            var dialog = $("#dataPopUpGridDialog").dialog({
                autoOpen: false,
                modal: true,
                height: height,
                width: width,
                title: self.titleName,
                resizable: true
            });
            dialog.dialog("open");
        },
        //金額顯示format
        formatAmt: function(val, field){
            var ls_amtValue = val;
            var ls_ruleVal = field.format_func_name.rule_val;

            if(ls_ruleVal != ""){
                this.searchCond[field.ui_field_name] = go_formatDisplayClass.amtFormat(ls_amtValue, ls_ruleVal);
            }
            else{
                this.searchCond[field.ui_field_name] = ls_amtValue;
            }
        }
    }
});

function searchValue(la_children, ls_selectData) {
    _.each(la_children, function (lo_children) {
        if (_.isUndefined(lo_children.value)) {
            searchValue(lo_children.children, ls_selectData);
        }
        else {
            ls_selectData.push(lo_children.value);
            return;
        }
    });
}

function searchOptions(la_options, ls_value, la_selectData) {
    _.each(la_options, function (lo_option) {
        var lo_childrenOptions = _.findWhere(lo_option.children, {id: ls_value});
        if (_.isUndefined(lo_childrenOptions)) {
            searchOptions(lo_option.children, ls_value, la_selectData);
        }
        else if (_.isUndefined(lo_childrenOptions.value)) {
            searchValue(lo_childrenOptions.children, la_selectData);
        }
        else {
            la_selectData.push(lo_childrenOptions.value);
            return;
        }
    });
}



