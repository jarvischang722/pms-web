<template>
    <div id="dataPopUpGridDialog" v-show="false">
        <div class="col-sm-12 col-xs-12 singleGridContent padding-5">
            <div class="row">
                <div class="col-sm-12 col-xs-12 ">
                    <!--顯示內容-->
                    <form id="searchDataForm" method="post">
                        <div id="textGridDiv" class=" grid">
                            <div class="row">
                                <div class="col-sm-4">
                                    <select id="cbSelect" style="width: 100%;" class="easyui-combobox defHt">
                                        <option v-for="option in fieldNameConditionTmp" :value="option.value">
                                            {{option.display}}
                                        </option>
                                    </select>
                                </div>

                                <div class="col-sm-6">
                                    <input type="text" style="width: 100%;" id="txtSelectCondition" class="numStyle-none defHt" @keyup="txtSearchChangeText">
                                </div>
                                <div class="col-sm-2">
                                    <button type="button"
                                            style="width: 100%"
                                            class="btn RoomNum-modal01-btn btn90px btn-primary btn-white btn-defaultWidth"
                                            @click="chooseDataBackGridSingle">
                                        {{i18nLang.SystemCommon.OK}}
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div class="clearfix"></div>
                        <div class="space-4"></div>
                        <div class="row">
                            <div class="col-sm-12">
                                <table class="easyui-datagrid" id="chooseGrid"
                                       style="width: 100%;height: auto;"></table>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default{
        name: 'select-grid-dialog-comp',
        data(){
            return{
                i18nLang : {}
            };
        },
        created(){
            var self = this;
            this.$eventHub.$on('showPopUpDataGrid', function (result) {
                self.showPopUpDataGrid(result);
            });
        },
        mounted(){
            this.i18nLang = go_i18nLang;
        },
        methods:{
            //顯示點選popupgrid跳出來的視窗
            showPopUpDataGrid(result){
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
            //將選擇到的資料帶回原本頁面
            chooseDataBackGridSingle(){
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

                this.$eventHub.$emit('updateBackSelectData', chooseData);
                $("#dataPopUpGridDialog").dialog('close');
            },
            txtSearchChangeText(keyContent){
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
    }
</script>