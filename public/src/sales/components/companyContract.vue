<template>
    <div class="col-xs-12 col-sm-12" v-loading="isLoading" element-loading-text="Loading...">
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
    import moment from 'moment';
    import alasql from 'alasql';

    export default {
        name: 'contract-content',
        props: ["rowData", "isContractContent"],
        data() {
            return {
                i18nLang: go_i18nLang,
                isLoading: false,
                BTN_action: false,
                isHideExpire: true,
                dataGridRowsData: [],
                dataGridRowsDataOfExpire: [],
                dataGridRowsDataOfRateCode: [],
                oriDataGridRowsData: [],
                fieldsData: [],
                oriFieldsData: [],
                dgIns: {},
                rentDatHq: ""       //訂房中心滾房租日
            };
        },
        watch: {
            isContractContent(val) {
                if (val) {
                    this.initData();
                    this.fetchDefaultData();
                }
            }
        },
        methods: {
            fetchDefaultData() {
                $.post("/api/fetchDefaultSingleRowData", {
                    prg_id: "PMS0610020",
                    page_id: 1,
                    tab_page_id: 4,
                    template_id: "datagrid"
                }).then(result => {
                    this.rentDatHq = result.gsDefaultData.rent_dat_hq.toString();
                    this.fetchFieldData();
                });
            },
            initData() {
                this.dataGridRowsData = [];
                this.oriDataGridRowsData = [];
                this.fieldsData = [];
                this.oriFieldsData = [];
                this.dgIns = {};
            },
            fetchFieldData() {
                this.isLoading = true;
                $.post("/api/fetchDataGridFieldData", {
                    prg_id: "PMS0610020",
                    tab_page_id: 4,
                    searchCond: {cust_cod: this.$store.state.gs_custCod}
                }).then(result => {
                    this.searchFields = result.searchFields;
                    this.fieldsData = result.dgFieldsData;
                    this.dataGridRowsData = _.filter(result.dgRowData, lo_dgRowData => {
                        return moment(new Date(lo_dgRowData.end_dat)).diff(moment(this.rentDatHq), "days") >= 0
                    });
                    this.oriDataGridRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                    console.log(this.oriDataGridRowsData);
                    this.showDataGrid(this.dataGridRowsData);
                });
            },
            showDataGrid(dataGridRowsData) {
                this.dgIns = new DatagridBaseClass();
                this.dgIns.init("PMS0610020", "contractContent_dg", DatagridFieldAdapter.combineFieldOption(this.fieldsData, 'relatedPerson_dg'), this.fieldsData);
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
                var lo_delRow = $('#contractContent_dg').datagrid("getSelected");

                if (!lo_delRow) {
                    alert(go_i18nLang["SystemCommon"].SelectOneData);
                }
                else {
                    console.log("delete this row");
                    this.dgIns.removeRow();
                }
            },
            doHideExpire() {
                var lb_isHide = this.isHideExpire;
                if (lb_isHide) {
                    this.showDataGrid(this.oriDataGridRowsData);
                }
                else{
                    this.showDataGrid(this.dataGridRowsData);
                }
            }
        }
    }
</script>