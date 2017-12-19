<template>
    <div class="col-xs-12 col-sm-12">
        <div class="row">
            <!--多筆 相關人員資料 dataGrid-->
            <div class="col-xs-11 col-sm-11">
                <div class="row no-margin-right">
                    <table id="relatedPerson_dg" style="height: 310px;"></table>
                </div>
            </div>
            <!--/.多筆 相關人員資料 dataGrid-->
            <!--按鈕-->
            <div class="col-xs-1 col-sm-1">
                <div class="row">
                    <div class="right-menu-co">
                        <ul>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                        role="button" :disabled="BTN_action" @click="appendRow">
                                    {{i18nLang.program.PMS0610020.append_contact_person}}
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-danger btn-white btn-defaultWidth"
                                        role="button" :disabled="BTN_action" @click="removeRow">
                                    {{i18nLang.program.PMS0610020.remove_contact_person}}
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-gray btn-defaultWidth"
                                        role="button">加入秘書積點
                                </button>
                            </li>
                            <li>
                                <span class="checkbox">
                                  <label class="checkbox-width">
                                      <input name="form-field-checkbox" type="checkbox"
                                             class="ace" @click="doHideLeavingStaff" v-model="isHideLeavingStaff">
                                      <span class="lbl font-btn">{{i18nLang.program.PMS0610020.hide_leaving_staff}}</span>
                                  </label>
                                </span>
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
        name: 'related-personnel',
        props: ["rowData", "isRelatedPersonnel"],
        data() {
            return {
                i18nLang: go_i18nLang,
                BTN_action: false,
                isHideLeavingStaff: false,
                dataGridRowsData: [],
                oriDataGridRowsData: [],
                fieldsData: [],
                oriFieldsData: [],
                dgIns: {}
            };
        },
        watch: {
            isRelatedPersonnel(val) {
                if (val) {
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
//                this.dgIns.init("PMS0610020", "relatedPerson_dg", DatagridFieldAdapter.combineFieldOption(this.fieldsData, 'relatedPerson_dg'), this.fieldsData);
//                this.dgIns.loadDgData(this.dataGridRowsData);

                $('#relatedPerson_dg').datagrid({
                    singleSelect: true,
                    collapsible: true,
                    url: '/jsonData/sales/bsCompany_relatedMan.json',
                    method: 'get',
                    columns:[[
                            {field: 'mainContact', title: '主要聯絡人', width: 100},
                            {field: 'name', title: '姓名', width: 80},
                            {field: 'department', title: '部門', width: 80},
                            {field: 'jobTitle', title: '職稱', width: 80},
                            {field: 'status', title: '狀態', width: 80},
                            {field: 'telphone', title: '行動電話', width: 80},
                            {field: 'companyPhone', title: '公司電話', width: 80},
                            {field: 'homePhone', title: '住家電話', width: 80},
                            {field: 'fax', title: '傳真電話', width: 80},
                            {field: 'email', title: '電子郵件', width: 80},
                            {field: 'remark', title: '備註', width: 80},
                            {field: 'endDate', title: '離職日', width: 80},
                            {field: 'sex', title: '性別', width: 80},
                            {field: 'birth', title: '生日', width: 80},
                            {field: 'pointNum', title: '<span class="grayDisable">秘書積點會員編號</span>', width: 120}
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
                var lo_delRow = $('#relatedPerson_dg').datagrid("getSelected");

                if (!lo_delRow) {
                    alert(go_i18nLang["SystemCommon"].SelectOneData);
                }
                else {
                    console.log("delete this row");
//                    this.dgIns.removeRow();
                }
            },
            doHideLeavingStaff() {
                var lb_isHide = this.isHideLeavingStaff;
                if (lb_isHide) {
                    console.log("hidding thie leaving staff");
                }
            }
        }
    }
</script>