<template>
    <div class="col-xs-12 col-sm-12" v-loading="isLoading" element-loading-text="Loading...">
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
    var adpterDg = undefined;

    export default {
        name: 'related-personnel',
        props: ["rowData", "isRelatedPersonnel"],
        data() {
            return {
                i18nLang: go_i18nLang,
                isLoading: false,
                BTN_action: false,
                isHideLeavingStaff: false,
                dataGridRowsData: [],
                dataGridRowsDataOfStaff: [],
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
                    this.fetchFieldData();
                }
            },
            dataGridRowsData: {
                handler: function (val) {

                    //更新dataGridRowsDataOfStaff
                    this.dataGridRowsDataOfStaff = _.filter(JSON.parse(JSON.stringify(val)), lo_dgRowData => {return lo_dgRowData.job_sta !='Q'});
                },
                deep: true
            }
        },
        methods: {
            initData() {
                this.dataGridRowsData = [];
                this.dataGridRowsDataOfStaff = [];
                this.oriDataGridRowsData = [];
                this.fieldsData = [];
                this.oriFieldsData = [];
                this.dgIns = {};
            },
            fetchFieldData() {
                this.isLoading = true;
                $.post("/api/fetchDataGridFieldData", {
                    prg_id: "PMS0610020",
                    tab_page_id: 2,
                    searchCond: {cust_cod: this.$store.state.gs_custCod}
                }).then(result => {
                    //取得主要聯絡人資料
                    var lo_mnSingleData = this.$store.state.go_mnSingleData;
                    var ln_primaryIndex = _.findIndex(result.dgRowData, {seq_nos: lo_mnSingleData.cust_mn_atten_cod});
                    if(ln_primaryIndex > -1){
                        result.dgRowData[ln_primaryIndex].primary_pers = 'Y';
                    }
                    this.searchFields = result.searchFields;
                    this.fieldsData = result.dgFieldsData;
                    this.dataGridRowsData = result.dgRowData;
                    this.dataGridRowsDataOfStaff = _.filter(result.dgRowData, lo_dgRowData => {return lo_dgRowData.job_sta !='Q'});
                    this.oriDataGridRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                    this.showDataGrid(this.dataGridRowsData);
                });
            },
            showDataGrid(dataGridRowsData) {
                this.dgIns = new DatagridBaseClass();
                this.dgIns.init("PMS0610020", "relatedPerson_dg", DatagridFieldAdapter.combineFieldOption(this.fieldsData, 'relatedPerson_dg'), this.fieldsData);
                this.dgIns.loadDgData(dataGridRowsData);
                this.dgIns.getOriDtRowData(this.oriDataGridRowsData);
                this.isLoading = false;

            },
            appendRow() {
                var self = this;
                this.BTN_action = true;
                this.dgIns.appendRow(function (result) {
                    if (result) {
                        self.BTN_action = false;
                    }
                });
            },
            removeRow() {
                var lo_delRow = $('#relatedPerson_dg').datagrid("getSelected");

                if (!lo_delRow) {
                    alert(go_i18nLang["SystemCommon"].SelectOneData);
                }
                else {
                    console.log("delete this row");
                    this.dgIns.removeRow();
                }
            },
            doHideLeavingStaff() {
                var lb_isHide = !this.isHideLeavingStaff;
                if (lb_isHide) {
                    this.showDataGrid(this.dataGridRowsDataOfStaff);
                }
                else{
                    this.showDataGrid(this.dataGridRowsData);
                }
            }
        }
    }
</script>