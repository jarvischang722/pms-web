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
                                        role="button" :disabled="BTN_action || !isModifiable" @click="appendRow"
                                        v-if="$parent.prgEditionOptions.funcList['1070'] != undefined"
                                        data-purview_func_id="PMS0610020-1070">
                                    {{i18nLang.program.PMS0610020.append_contract}}


                                </button>
                            </li>
                            <li>
                                <button class="btn btn-danger btn-white btn-defaultWidth purview_btn"
                                        role="button" :disabled="BTN_action || !isModifiable" @click="removeRow"
                                        v-if="$parent.prgEditionOptions.funcList['1080'] != undefined"
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
    /** DatagridRmSingleGridClass **/
    function DatagridSingleGridClass() {
    }

    DatagridSingleGridClass.prototype = new DatagridBaseClass();
    DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
    };
    DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    };
    DatagridSingleGridClass.prototype.doSaveColumnFields = function () {
    };
    /*** Class End  ***/

    import moment from 'moment';
    import alasql from 'alasql';

    export default {
        name: 'contract-content',
        props: ["rowData", "isContractContent", "isModifiable"],
        created() {
            this.$eventHub.$on("endContractEdit", (data) => {
                if (!_.isEmpty(this.dgIns)) {
                    data.doValidate(this.dgIns.endEditing());
                }
                else {
                    data.doValidate(true);
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
                dataGridRowsDataOfRateCode: [],
                oriDataGridRowsDataOfRateCod: [],
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
                    if (_.isEmpty(this.$store.state.custMnModule.go_allData.ga_ccDataGridRowsData)) {
                        this.initData();
                    }
                    this.fetchDefaultData();
                }
                else {
                    this.searchCondOfRate = "";
                    this.isHideExpire = true;
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
            dataGridRowsDataOfRateCode: {
                handler(val) {
                    if (!_.isEmpty(val)) {
                        let la_addToDataGridRowsData = _.where(val, {createRow: 'Y'});
                        let lo_extendData = {
                            cust_cod: this.$store.state.custMnModule.gs_custCod,
                            tab_page_id: 4
                        };
                        _.each(la_addToDataGridRowsData, (lo_addToDataGridRowsData) => {
                            if (_.findIndex(this.dataGridRowsData, {uniKey: lo_addToDataGridRowsData.uniKey}) == -1) {
                                this.dataGridRowsData.push(_.extend(lo_addToDataGridRowsData, lo_extendData));
                            }
                        });

                        _.each(val, (lo_val) => {
                            let ln_editIndex = _.findIndex(this.dataGridRowsData, {uniKey: lo_val.uniKey});
                            if (ln_editIndex > -1) {
                                this.dataGridRowsData.splice(ln_editIndex, 1);
                            }
                            this.dataGridRowsData.push(lo_val);
                        });
                    }
                },
                deep: true
            },
            isHideExpire(val) {
                if (!_.isEmpty(this.dgIns)) {
                    this.dgIns.endEditing();
                }

                if (val) {
                    this.dataGridRowsDataOfRateCode =
                        alasql("select * from ? where rate_cod like '" + this.searchCondOfRate + "%' or ratecod_nam like '" + this.searchCondOfRate + "%'", [_.filter(this.dataGridRowsData, lo_dgRowData => {
                            return moment(new Date(lo_dgRowData.end_dat)).diff(moment(new Date(this.rentDatHq)), "days") >= 0
                        })]);
                    this.oriDataGridRowsDataOfRateCode = alasql("select * from ? where rate_cod like '" + this.searchCondOfRate + "%' or ratecod_nam like '" + this.searchCondOfRate + "%'", [_.filter(this.oriDataGridRowsData, lo_dgRowData => {
                        return moment(new Date(lo_dgRowData.end_dat)).diff(moment(new Date(this.rentDatHq)), "days") >= 0
                    })]);
                }
                else {
                    this.dataGridRowsDataOfRateCode =
                        alasql("select * from ? where rate_cod like '" + this.searchCondOfRate + "%' or ratecod_nam like '" + this.searchCondOfRate + "%'", [this.dataGridRowsData]);
                    this.oriDataGridRowsDataOfRateCode =
                        alasql("select * from ? where rate_cod like '" + this.searchCondOfRate + "%' or ratecod_nam like '" + this.searchCondOfRate + "%'", [this.oriDataGridRowsData]);
                }
                this.dgIns.loadDgData(this.dataGridRowsDataOfRateCode);
                this.dgIns.getOriDtRowData(this.oriDataGridRowsDataOfRateCode);
            }
        },
        methods: {
            insertCustCodIntoTmpCUD(rowData) {
                let lo_extendData = {
                    cust_cod: this.$store.state.custMnModule.gs_custCod,
                    tab_page_id: 4
                };
                //將cust_cod放置tmpCUD中
                _.each(this.dgIns.tmpCUD, (la_cudData, key) => {
                    _.each(la_cudData, lo_data => {
                        la_cudData[key] = _.extend(lo_data, lo_extendData);
                    })
                });

                //將合約內容資料放至Vuex
                this.$store.dispatch("custMnModule/setCcDataGridRowsData", {
                    ga_ccDataGridRowsData: this.dataGridRowsData,
                    go_ccOriDataGridRowsData: this.oriDataGridRowsData,
                    go_ccTmpCUD: this.dgIns.tmpCUD
                });
            },
            fetchDefaultData() {
                BacUtils.doHttpPostAgent("/api/fetchDefaultSingleRowData", {
                    prg_id: "PMS0610020",
                    page_id: 1,
                    tab_page_id: 4,
                    template_id: "datagrid"
                }, result => {
                    this.rentDatHq = moment(result.gsDefaultData.rent_dat_hq).format("YYYY/MM/DD").toString();
                    this.fetchFieldData();
                });
            },
            initData() {
                this.dataGridRowsData = [];
                this.oriDataGridRowsData = [];
                this.dataGridRowsDataOfRateCode = [];
                this.fieldsData = [];
                this.oriFieldsData = [];
                this.searchCondOfRate = "";
                this.isHideExpire = true;
            },
            fetchFieldData() {
                this.isLoading = true;
                BacUtils.doHttpPostAgent("/api/fetchDataGridFieldData", {
                    prg_id: "PMS0610020",
                    tab_page_id: 4,
                    searchCond: {cust_cod: this.$store.state.custMnModule.gs_custCod}
                }, result => {
                    //TODO 欄位排序 => 改資料庫的 col_seq
                    this.fieldsData = _.sortBy(result.dgFieldsData, "col_seq");
                    //第一次載入合約內容
                    if (_.isEmpty(this.$store.state.custMnModule.go_allData.ga_ccDataGridRowsData)) {
                        _.each(result.dgRowData, (lo_dgRowData) => {
                            lo_dgRowData.begin_dat = moment(lo_dgRowData.begin_dat).format("YYYY/MM/DD");
                            lo_dgRowData.end_dat = moment(lo_dgRowData.end_dat).format("YYYY/MM/DD");
                            lo_dgRowData.uniKey = Math.floor(Math.random() * (99999999999999999999));
                        });
                        this.dataGridRowsData = result.dgRowData;
                        this.oriDataGridRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                        this.dataGridRowsDataOfRateCode = alasql("select * from ? where rate_cod like '" + this.searchCondOfRate + "%' or ratecod_nam like '" + this.searchCondOfRate + "%'", [_.filter(this.dataGridRowsData, lo_dgRowData => {
                            return moment(new Date(lo_dgRowData.end_dat)).diff(moment(new Date(this.rentDatHq)), "days") >= 0
                        })]);
                        this.oriDataGridRowsDataOfRateCode = alasql("select * from ? where rate_cod like '" + this.searchCondOfRate + "%' or ratecod_nam like '" + this.searchCondOfRate + "%'", [_.filter(this.oriDataGridRowsData, lo_dgRowData => {
                            return moment(new Date(lo_dgRowData.end_dat)).diff(moment(new Date(this.rentDatHq)), "days") >= 0
                        })]);

                        this.showDataGrid();
                    }
                    else {
                        this.dataGridRowsData = this.$store.state.custMnModule.go_allData.ga_ccDataGridRowsData;
                        this.oriDataGridRowsData = this.$store.state.custMnModule.go_allOriData.ga_ccDataGridRowsData;
                        this.dataGridRowsDataOfRateCode = alasql("select * from ? where rate_cod like '" + this.searchCondOfRate + "%' or ratecod_nam like '" + this.searchCondOfRate + "%'", [_.filter(this.dataGridRowsData, lo_dgRowData => {
                            return moment(new Date(lo_dgRowData.end_dat)).diff(moment(new Date(this.rentDatHq)), "days") >= 0
                        })]);
                        this.oriDataGridRowsDataOfRateCode = alasql("select * from ? where rate_cod like '" + this.searchCondOfRate + "%' or ratecod_nam like '" + this.searchCondOfRate + "%'", [_.filter(this.oriDataGridRowsData, lo_dgRowData => {
                            return moment(new Date(lo_dgRowData.end_dat)).diff(moment(new Date(this.rentDatHq)), "days") >= 0
                        })]);
                        this.dgIns.loadDgData(this.dataGridRowsDataOfRateCode);
                        this.isLoading = false;
                    }
                });
            },
            showDataGrid() {
                this.dgIns = this.isModifiable ? new DatagridBaseClass() : new DatagridSingleGridClass();
                this.dgIns.init("PMS0610020", "contractContent_dg", DatagridFieldAdapter.combineFieldOption(this.fieldsData, 'contractContent_dg'), this.fieldsData);
                this.dgIns.loadDgData(this.dataGridRowsDataOfRateCode);
                this.dgIns.getOriDtRowData(this.oriDataGridRowsDataOfRateCode);
                this.dgIns.updateMnRowData(this.$store.state.custMnModule.go_allData.go_mnSingleData);

                this.isLoading = false;

            },
            doChangeRowData() {
                if (this.isHideExpire) {
                    this.dataGridRowsDataOfRateCode =
                        alasql("select * from ? where rate_cod like '" + this.searchCondOfRate + "%' or ratecod_nam like '" + this.searchCondOfRate + "%'", [_.filter(this.dataGridRowsData, lo_dgRowData => {
                            return moment(new Date(lo_dgRowData.end_dat)).diff(moment(new Date(this.rentDatHq)), "days") >= 0
                        })]);
                }
                else {
                    this.dataGridRowsDataOfRateCode =
                        alasql("select * from ? where rate_cod like '" + this.searchCondOfRate + "%' or ratecod_nam like '" + this.searchCondOfRate + "%'", [this.dataGridRowsData])
                }
                this.dgIns.loadDgData(this.dataGridRowsDataOfRateCode);
            },
            appendRow() {
                var self = this;
                this.BTN_action = true;
                this.dgIns.appendRow(function (result) {
                    self.BTN_action = false;
                });
            },
            removeRow() {
                var lo_delRow = $('#contractContent_dg').datagrid("getSelected");

                if (!lo_delRow) {
                    alert(go_i18nLang["SystemCommon"].SelectOneData);
                }
                else {
                    let ln_delIndex = _.findIndex(this.dataGridRowsData, {uniKey: lo_delRow.uniKey});
                    if (ln_delIndex > -1) {
                        this.dataGridRowsData.splice(ln_delIndex, 1);
                    }
                    this.dgIns.removeRow();
                }
            }
        }
    }

</script>