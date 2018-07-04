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
                                <button class="btn btn-primary btn-white btn-defaultWidth purview_btn"
                                        role="button" :disabled="BTN_action || !isModifiable" @click="appendRow"
                                        v-if="$parent.prgEditionOptions.funcList['1040'] != undefined"
                                        data-purview_func_id="PMS0610020-1040">
                                    {{i18nLang.program.PMS0610020.append_contact_person}}
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-danger btn-white btn-defaultWidth purview_btn"
                                        role="button" :disabled="BTN_action || !isModifiable" @click="removeRow"
                                        v-if="$parent.prgEditionOptions.funcList['1050'] != undefined"
                                        data-purview_func_id="PMS0610020-1050">
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
                                      <input name="form-field-checkbox" type="checkbox" :disabled="!isModifiable"
                                             class="ace" v-model="isHideLeavingStaff">
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
    /** DatagridRmSingleGridClass **/
    function DatagridSingleGridClass() {
    }

    DatagridSingleGridClass.prototype = new DatagridBaseClass();
    DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
    };
    DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    };
    /*** Class End  ***/

    export default {
        name: 'related-personnel',
        props: ["rowData", "isRelatedPersonnel", "isModifiable"],
        created() {
            this.$eventHub.$on("endRpEdit", () => {
                if (!_.isEmpty(this.dgIns)) {
                    this.dgIns.endEditing();
                    //確認tmpCUD 的cust_cod
                    _.each(this.dgIns.tmpCUD, (value, key) => {
                        _.each(value, (lo_value, idx) => {
                            this.dgIns.tmpCUD[key][idx] = _.extend(lo_value, {cust_cod: this.$store.state.custMnModule.gs_custCod});
                        });
                    });
                }
            });
        },
        data() {
            return {
                go_funcPurview: [],
                i18nLang: go_i18nLang,
                isLoading: false,
                BTN_action: false,
                isHideLeavingStaff: false,
                dataGridRowsData: [],
                dataGridRowsDataOfStaff: [],
                oriDataGridRowsData: [],
                chgDataGridRowsData: [],
                fieldsData: [],
                oriFieldsData: [],
                dgIns: {}
            };
        },
        watch: {
            isRelatedPersonnel(val) {
                if (val) {
                    //第一次載入相關人員
                    if (_.isEmpty(this.$store.state.custMnModule.go_allData.ga_rpDataGridRowsData)) {
                        this.initData();
                    }
                    this.fetchFieldData();
                }
            },
            dataGridRowsData: {
                handler: function (val) {
                    if (!_.isEmpty(val)) {
                        this.$eventHub.$emit("chgRelatedPersonData");
                        //將相關人員資料放至Vuex
                        this.$store.dispatch("custMnModule/setRpDataGridRowsData", {
                            ga_rpDataGridRowsData: val,
                            ga_rpOriDataGridRowsData: this.oriDataGridRowsData,
                            go_rpTmpCUD: this.dgIns.tmpCUD
                        });
                        //更新dataGridRowsDataOfStaff
                        this.dataGridRowsDataOfStaff = _.filter((val), lo_dgRowData => {
                            return lo_dgRowData.job_sta != 'Q'
                        });
                    }
                },
                deep: true
            },
            dataGridRowsDataOfStaff: {
                handler(val) {
                    if (this.dgIns.endEditing()) {
                        this.BTN_action = false;
                    }
                    if (this.isHideLeavingStaff) {
                        if (!_.isUndefined(this.dgIns.editIndex)) {
                            let ln_editStaffIndex = this.dgIns.editIndex;
                            let ln_editIndex = _.findIndex(this.dataGridRowsData, {uniKey: val[ln_editStaffIndex].uniKey});
                            if (ln_editIndex > -1) {
                                this.dataGridRowsData[ln_editIndex] = val[ln_editStaffIndex];
                            }
                        }
                    }
                },
                deep: true
            },
            isHideLeavingStaff(val) {
                if (!_.isEmpty(this.dgIns)) {
                    this.dgIns.endEditing();
                }

                if (val) {
                    this.dgIns.loadDgData(this.dataGridRowsDataOfStaff);
                }
                else {
                    this.dgIns.loadDgData(this.dataGridRowsData);
                }
            }
        },
        methods: {
            initData() {
                this.dataGridRowsData = [];
                this.dataGridRowsDataOfStaff = [];
                this.oriDataGridRowsData = [];
                this.chgDataGridRowsData = [];
                this.fieldsData = [];
                this.oriFieldsData = [];
                this.dgIns = {};
            },
            fetchFieldData() {
                this.isLoading = true;
                BacUtils.doHttpPostAgent("/api/fetchDataGridFieldData", {
                    prg_id: "PMS0610020",
                    tab_page_id: 2,
                    searchCond: {cust_cod: this.$store.state.custMnModule.gs_custCod}
                }, result => {
                    //取得主要聯絡人資料
                    var lo_mnSingleData = this.$store.state.custMnModule.go_allData.go_mnSingleData;
                    var ln_primaryIndex = _.findIndex(result.dgRowData, {seq_nos: lo_mnSingleData.atten_cod});
                    if (ln_primaryIndex > -1) {
                        result.dgRowData[ln_primaryIndex].primary_pers = 'Y';
                    }
                    //調整主要聯絡人值
                    _.each(result.dgRowData, (lo_dgRowData) => {
                        lo_dgRowData.primary_pers = lo_dgRowData.primary_pers == 'n' ? 'N' : lo_dgRowData.primary_pers;
                        lo_dgRowData.uniKey = Math.floor(Math.random() * (99999999999999999999));
                    });

                    this.fieldsData = result.dgFieldsData;
                    //第一次載入此頁面
                    if (_.isEmpty(this.$store.state.custMnModule.go_allData.ga_rpDataGridRowsData)) {
                        this.dataGridRowsData = result.dgRowData;
                        this.dataGridRowsDataOfStaff = _.filter(result.dgRowData, lo_dgRowData => {
                            return lo_dgRowData.job_sta != 'Q'
                        });
                        this.oriDataGridRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                        this.showDataGrid(this.dataGridRowsData);
                    }
                    else {
                        this.dataGridRowsData = this.$store.state.custMnModule.go_allData.ga_rpDataGridRowsData;
                        this.dataGridRowsDataOfStaff = _.filter(this.$store.state.custMnModule.go_allData.ga_rpDataGridRowsData, lo_dgRowData => {
                            return lo_dgRowData.job_sta != 'Q'
                        });
                        this.oriDataGridRowsData = this.$store.state.custMnModule.go_allOriData.ga_rpDataGridRowsData;
                        this.dgIns.loadDgData(this.dataGridRowsData);
                        this.isLoading = false;
                    }
                });
            },
            showDataGrid(dataGridRowsData) {
                this.dgIns = this.isModifiable ? new DatagridBaseClass() : new DatagridSingleGridClass();
                this.dgIns.init("PMS0610020", "relatedPerson_dg", DatagridFieldAdapter.combineFieldOption(this.fieldsData, 'relatedPerson_dg'), this.fieldsData);
                this.dgIns.loadDgData(dataGridRowsData);
                this.dgIns.updateMnRowData(this.$store.state.custMnModule.go_allData.go_mnSingleData);
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
                    this.dgIns.removeRow();
                }
            }
        }
    }
</script>