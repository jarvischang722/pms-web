<template>
    <div class="col-xs-12 col-sm-12" v-loading="isLoading" element-loading-text="Loading...">
        <div class="row">
            <div class="col-xs-11 col-sm-11">
                <div class="row no-margin-right">
                    <div class="dealContent-select">
                        <div class="float-left">
                            <input type="text" v-model="searchCondOfRate"
                                   :placeholder="i18nLang.program.PMS0610020.rate"
                                   @keyup="doChangeRowData">
                        </div>
                        <div class="float-left">
                            <span class="checkbox">
                              <label class="checkbox-width">
                                  <input name="form-field-checkbox" type="checkbox"
                                         class="ace" v-model="isHideExpire">
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
                                <button class="btn btn-primary btn-white btn-defaultWidth purview_btn"
                                        role="button" :disabled="BTN_action" @click="appendRow"
                                        data-purview_func_id="PMS0610020-1070">
                                    {{i18nLang.program.PMS0610020.append_contract}}
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-danger btn-white btn-defaultWidth purview_btn"
                                        role="button" :disabled="BTN_action" @click="removeRow"
                                        data-purview_func_id="PMS0610020-1080">
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
        created() {
            this.$eventHub.$on("endContractEdit", () => {
                if (!_.isEmpty(this.dgIns)) {
                    this.dgIns.endEditing();
                }
            });
        },
        data() {
            return {
                go_funcPurview: [],
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
                rentDatHq: "",       //訂房中心滾房租日
                searchCondOfRate: ""
            };
        },
        watch: {
            isContractContent(val) {
                if (val) {
                    //第一次載入合約內容
                    if (_.isEmpty(this.$store.state.go_allData.ga_ccDataGridRowsData)) {
                        this.initData();
                    }
                    this.fetchDefaultData();
                    this.go_funcPurview = (new FuncPurview("PMS0610020")).getFuncPurvs();
                }
            },
            dataGridRowsData: {
                handler(val) {
                    if (!_.isEmpty(val)) {
                        this.insertCustCodIntoTmpCUD(val);
                    }
                },
                deep: true
            },
            dataGridRowsDataOfExpire: {
                handler(val) {
                    if (!_.isEmpty(val)) {
                        this.insertCustCodIntoTmpCUD(val);
                    }
                },
                deep: true
            },
            dataGridRowsDataOfRateCode: {
                handler(val) {
                    if (!_.isEmpty(val)) {
                        this.insertCustCodIntoTmpCUD(val);
                    }
                },
                deep: true
            },
            isHideExpire(val) {
                if (val) {
                    this.dgIns.loadDgData(this.dataGridRowsDataOfExpire);
                }
                else {
                    this.dgIns.loadDgData(this.dataGridRowsData);
                }
            }
        },
        methods: {
            insertCustCodIntoTmpCUD(rowData) {
                let lo_extendData = {
                    cust_cod: this.$store.state.gs_custCod,
                    tab_page_id: 4
                };
                //將cust_cod放置tmpCUD中
                _.each(this.dgIns.tmpCUD, (la_cudData, key) => {
                    _.each(la_cudData, lo_data => {
                        la_cudData[key] = _.extend(lo_data, lo_extendData);
                    })
                });

                // return;
                //將合約內容資料放至Vuex
                this.$store.dispatch("setCcDataGridRowsData", {
                    ga_ccDataGridRowsData: rowData,
                    go_ccOriDataGridRowsData: this.oriDataGridRowsData,
                    go_ccTmpCUD: this.dgIns.tmpCUD
                });
            },
            fetchDefaultData() {
                $.post("/api/fetchDefaultSingleRowData", {
                    prg_id: "PMS0610020",
                    page_id: 1,
                    tab_page_id: 4,
                    template_id: "datagrid"
                }).then(result => {
                    this.rentDatHq = moment(result.gsDefaultData.rent_dat_hq).format("YYYY/MM/DD").toString();
                    this.fetchFieldData();
                });
            },
            initData() {
                this.dataGridRowsData = [];
                this.oriDataGridRowsData = [];
                this.fieldsData = [];
                this.oriFieldsData = [];
                this.searchCondOfRate = "";
                this.isHideExpire = true;
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
                    //第一次載入合約內容
                    if (_.isEmpty(this.$store.state.go_allData.ga_ccDataGridRowsData)) {
                        this.dataGridRowsData = result.dgRowData;
                        this.dataGridRowsDataOfExpire = _.filter(JSON.parse(JSON.stringify(result.dgRowData)), lo_dgRowData => {
                            return moment(new Date(lo_dgRowData.end_dat)).diff(moment(new Date(this.rentDatHq)), "days") >= 0
                        });
                        this.oriDataGridRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                        this.showDataGrid(this.dataGridRowsDataOfExpire);
                    }
                    else {
                        this.dataGridRowsData = this.$store.state.go_allData.ga_ccDataGridRowsData;
                        this.dataGridRowsDataOfStaff = _.filter(JSON.parse(JSON.stringify(this.dataGridRowsData)), lo_dgRowData => {
                            return moment(new Date(lo_dgRowData.end_dat)).diff(moment(new Date(this.rentDatHq)), "days") >= 0
                        });
                        this.oriDataGridRowsData = this.$store.state.go_allOriData.ga_ccDataGridRowsData;
                        this.dgIns.loadDgData(this.dataGridRowsDataOfStaff);
                        this.isLoading = false;
                    }
                });
            },
            showDataGrid(dataGridRowsData) {
                this.dgIns = new DatagridBaseClass();
                this.dgIns.init("PMS0610020", "contractContent_dg", DatagridFieldAdapter.combineFieldOption(this.fieldsData, 'contractContent_dg'), this.fieldsData);
                this.dgIns.loadDgData(dataGridRowsData);
                this.dgIns.getOriDtRowData(this.oriDataGridRowsData);
                this.dgIns.updateMnRowData(this.$store.state.go_allData.go_mnSingleData);

                this.isLoading = false;

            },
            doChangeRowData() {
                if (this.isHideExpire) {
                    this.dataGridRowsDataOfRateCode =
                        alasql("select * from ? where rate_cod like '" + this.searchCondOfRate + "%' or ratecod_nam like '" + this.searchCondOfRate + "%'", [this.dataGridRowsDataOfExpire])
                }
                else {
                    this.dataGridRowsDataOfRateCode =
                        alasql("select * from ? where rate_cod like '" + this.searchCondOfRate + "%' or ratecod_nam like '" + this.searchCondOfRate + "%'", [this.dataGridRowsData])
                }
                this.showDataGrid(this.dataGridRowsDataOfRateCode);
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
                    this.dgIns.removeRow();
                }
            }
        }
    }

</script>