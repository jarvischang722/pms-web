/**
 * Created by a16010 on 2017/9/11.
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
        "text-select-grid-dialog-tmp": ga_selectGridDialogComp
    },
    data: function () {
        return {
            searchFieldsByRow: [],
            selectPopUpGridData: []
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
            this.$parent.searchCond = this.searchCond;
            this.fetchData();
        },
        chkClickPopUpGrid: function (field) {
            var self = this;
            if (field.ui_type == "popupgrid" || field.ui_type == "multipopupgrid") {
                var params = {
                    prg_id: "PMS0620050",
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
            this.dialogVisible = true;
            var height = document.documentElement.clientHeight - 60; //browser 高度 - 60功能列
            var width = document.documentElement.clientWidth / 2;    //browser 寬度 - 200功能列

            var dialog = $("#dataPopUpGridDialog").dialog({
                autoOpen: false,
                modal: true,
                height: height,
                width: width,
                title: "PMS0620050",
                resizable: true
            });
            dialog.dialog("open");
        }
    }
});



