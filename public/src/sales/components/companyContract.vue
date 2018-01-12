<template>
    <div class="col-xs-12 col-sm-12">
        <div class="row">
            <div class="col-xs-11 col-sm-11">
                <div class="row no-margin-right">
                    <div class="dealContent-select">
                        <div class="float-left">
                            <select class="input-medium">
                                <option value="-1">房價代號</option>
                                <option value="1">101</option>
                                <option value="2">102</option>
                                <option value="3">103</option>
                                <option value="4">104</option>
                                <option value="5">105</option>
                            </select>
                        </div>
                        <div class="float-left">
                            <span class="checkbox">
                              <label class="checkbox-width">
                                  <input name="form-field-checkbox" type="checkbox"
                                         class="ace" v-model="isHideExpire" @click="doHideExpire">
                                  <span class="lbl"><span
                                          class="txt">{{i18nLang.program.PMS0610020.hide_expired}}</span></span>
                              </label>
                            </span>
                            <!--<input type="checkbox" disabled="disabled"/>-->
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <!--多筆 合約內容 dataGrid-->
                    <table id="contractContent_dg" style="height: 280px;"></table>
                    <!--/.多筆 合約內容 dataGrid-->
                </div>
            </div>
            <!--按鈕-->
            <div class="col-xs-1 col-sm-1">
                <div class="row">
                    <div class="right-menu-co">
                        <ul>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                        role="button" :disabled="BTN_action" @click="appendRow">
                                    {{i18nLang.program.PMS0610020.append_contract}}
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-danger btn-white btn-defaultWidth"
                                        role="button" :disabled="BTN_action" @click="removeRow">
                                    {{i18nLang.program.PMS0610020.remove_contract}}
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-gray btn-defaultWidth"
                                        role="button">{{i18nLang.program.PMS0610020.special_contract}}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <!--/.按鈕-->
        </div>
    </div>
</template>

<script>
    export default {
        name: 'contract-content',
        props: ["rowData", "isContractContent"],
        data(){
            return{
                i18nLang: go_i18nLang,
                BTN_action: false,
                isHideExpire: false,
                dataGridRowsData: [],
                oriDataGridRowsData: [],
                fieldsData: [],
                oriFieldsData: [],
                dgIns: {}
            };
        },
        watch: {
            isContractContent(val){
                if(val){
                    this.initData();
                    this.fetchFieldData(this.rowData);
                }
            }
        },
        methods: {
            initData() {
                this.dataGridRowsData = [];
                this.oriDataGridRowsData = [];
                this.fieldsData = [];
                this.oriFieldsData = [];
                this.dgIns = {};
            },
            fetchFieldData(rowData) {
                var self = this;

                self.fetchRowData(rowData);
            },
            fetchRowData(rowData) {
                var self = this;

                this.showDataGrid();
            },
            showDataGrid() {
//                this.dgIns = new DatagridBaseClass();
//                this.dgIns.init("PMS0610020", "contractContent_dg", DatagridFieldAdapter.combineFieldOption(this.fieldsData, 'relatedPerson_dg'), this.fieldsData);
//                this.dgIns.loadDgData(this.dataGridRowsData);

                $('#contractContent_dg').datagrid({
                    singleSelect:true,
                    collapsible:true,
                    // 從json 撈
                    url:'/jsonData/sales/bsCompany_dealContent.json',
                    method:'get',
                    columns:[[
                        {field:'dealNum',title:'合約編號',width:100},
                        {field:'dealStartDate',title:'合約起始日',width:100},
                        {field:'dealEndDate',title:'合約終止日',width:100},
                        {field:'dealCompany',title:'館別',width:100},
                        {field:'referPriceCode',title:'參考房價代號',width:100},
                        {field:'housePriceName',title:'房價名稱',width:100},
                        {field:'referDiscount',title:'參考餐廳折扣',width:100},
                        {field:'remarks1',title:'備註1',width:100},
                        {field:'remarks2',title:'備註2',width:100},
                        {field:'addNewDate',title:'新增日',width:100},
                        {field:'addNewParson',title:'新增者',width:100},
                        {field:'lastChangeDate',title:'最後異動日',width:100},
                        {field:'lastChangePerson',title:'最後異動者',width:100}
                    ]]
                });
            },
            appendRow() {
//                var self = this;
//                this.BTN_action = true;
//                this.dgIns.appendRow(function (result) {
//                   if(result){
//                       self.BTN_action = false;
//                   }
//                });
            },
            removeRow() {
                var lo_delRow = $('#contractContent_dg').datagrid("getSelected");

                if (!lo_delRow) {
                    alert(go_i18nLang["SystemCommon"].SelectOneData);
                }
                else {
                    console.log("delete this row");
//                    this.dgIns.removeRow();
                }
            },
            doHideExpire() {
                var lb_isHide = this.isHideExpire;
                if (lb_isHide) {
                    console.log("hidding the expired");
                }
            }
        }
    }
</script>