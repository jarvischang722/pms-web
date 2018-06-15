<template>
    <div id="otherContact" class="hide padding-5" style="top: 0 !important;">
        <div class="businessCompanyData">
            <div class="col-xs-12 col-sm-12" v-loading="isLoadingDialog" :element-loading-text="loadingText">
                <div class="row">
                    <div class="col-xs-11 col-sm-11">
                        <div class="main-content-data">
                            <!--電子郵件-->
                            <div class="col-xs-12 col-sm-12 otherContact-box">
                                <div class="row">
                                    <div class="billInfo grid">
                                        <div class="col-xs-12 col-sm-12">
                                            <div class="row billInfo-head">
                                                <p class="billInfo-title">{{i18nLang.program.PMS0210011.email}}</p>
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-12">
                                            <div class="row no-margin-right">
                                                <div class="content">
                                                    <table class="css_table">
                                                        <tbody class="css_tbody">
                                                        <tr class="css_tr">
                                                        <tr v-for="data in emailDataGridRows" class="css_tr">
                                                            <th class="css_th width-15">{{data['add_nam']}}</th>
                                                            <td class="css_td width-70">
                                                                <input type="text"
                                                                       class="input-medium medium-c1 width-100"
                                                                       v-model="data['add_rmk']">
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                            <!--聯絡方式-->
                            <div class="col-xs-12 col-sm-12 otherContact-box">
                                <div class="row">
                                    <div class="billInfo grid">
                                        <div class="col-xs-12 col-sm-12">
                                            <div class="row billInfo-head">
                                                <p class="billInfo-title">
                                                    {{i18nLang.program.PMS0210011.contact_method}}</p>
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-12">
                                            <div class="row no-margin-right">
                                                <div class="content">
                                                    <table class="css_table">
                                                        <thead class="css_thead">
                                                        <tr class="css_tr">
                                                            <th class="css_th width-15">
                                                                {{contactFieldOneData.ui_display_name}}
                                                            </th>
                                                            <th class="css_th width-70">
                                                                {{contactFieldTwoData.ui_display_name}}
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody class="css_tbody">
                                                        <tr v-for="data in contactDataGridRows" class="css_tr">
                                                            <td class="css_td">{{ data['contact_rf.contact_nam']}}</td>
                                                            <td class="css_td">
                                                                <input type="text"
                                                                       class="input-medium medium-c1 width-100"
                                                                       v-model="data['contact_dt.contact_rmk']">
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                            <!--地址-->
                            <div class="col-xs-12 col-sm-12 otherContact-box">
                                <div class="row">
                                    <div class="billInfo grid">
                                        <div class="col-xs-12 col-sm-12">
                                            <div class="row billInfo-head">
                                                <p class="billInfo-title">{{i18nLang.program.PMS0210011.address}}</p>
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-12">
                                            <div class="row no-margin-right">
                                                <div class="content">
                                                    <table class="css_table">
                                                        <thead class="css_thead">
                                                        <template v-for="field in addressFieldsData">
                                                            <th v-if="field.ui_field_name=='address_dt.add_nam'"
                                                                class="css_th width-15">
                                                                {{field.ui_display_name}}
                                                            </th>
                                                            <th v-else-if="field.ui_field_name=='address_dt.zip_cod'"
                                                                class="css_th width-15">
                                                                {{field.ui_display_name}}
                                                            </th>
                                                            <th v-else-if="field.ui_field_name=='address_dt.add_rmk'"
                                                                class="css_th width-70">
                                                                {{field.ui_display_name}}
                                                            </th>
                                                        </template>
                                                        </thead>
                                                        <tbody class="css_tbody">
                                                        <tr v-for="data in addressDataGridRows" class="css_tr">
                                                            <td class="css_td">{{ data["address_rf.add_nam"]}}</td>
                                                            <td class="css_td">

                                                                <bac-select v-model="data['address_dt.zip_cod']"
                                                                            :data="zipCodSelectData"
                                                                            is-qry-src-before="Y" value-field="value"
                                                                            text-field="display"
                                                                            @update:v-model="val => data['address_dt.zip_cod'] = val"
                                                                            :default-val="data['address_dt.zip_cod']"
                                                                            field="{}">
                                                                </bac-select>

                                                            </td>
                                                            <td class="css_td">
                                                                <input type="text"
                                                                       class="input-medium medium-c1 width-100"
                                                                       v-model="data['address_dt.add_rmk']">
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="clearfix"></div>
                        </div><!--main-content-data-->
                        <div class="clearfix"></div>
                    </div>
                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth otherContact-insideBtn"
                                                role="button" @click="doCloseDialog">{{i18nLang.SystemCommon.Leave}}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="clearfix"></div>
            </div>
        </div>
    </div>
</template>

<script>
    import _ from 'underscore';

    export default {
        name: 'otherContact',
        props: ["isOtherContact"],
        mounted() {
            this.isLoadingDialog = true;
            this.loadingText = "Loading...";
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                isLoadingDialog: false,
                loadingText: "",
                emailFieldsData: [],
                emailDataGridRows: [],
                oriEmailDataGridRows: [],
                contactFieldsData: [],
                contactFieldOneData: {}, //聯絡類別
                contactFieldTwoData: {}, //聯絡內容
                contactDataGridRows: [],
                oriContactDataGridRows: [],
                addressFieldsData: [],
                addressDataGridRows: [],
                oriAddressDataGridRows: [],
                zipCodSelectData: [] //郵遞區號下拉資料
            }
        },
        watch: {
            isOtherContact(val) {
                if (val) {
                    if (this.$store.state.ghistMnModule.ga_emailDataGridRowsData.length != 0) {
                        this.emailFieldsData = this.$store.state.ghistMnModule.ga_emailFieldsData;
                        this.contactFieldsData = this.$store.state.ghistMnModule.ga_contactFieldsData;
                        this.contactFieldOneData = _.findWhere(this.contactFieldsData, {ui_field_name: 'contact_dt.contact_nam'});
                        this.contactFieldTwoData = _.findWhere(this.contactFieldsData, {ui_field_name: 'contact_dt.contact_rmk'});
                        this.addressFieldsData = this.$store.state.ghistMnModule.ga_addressFieldsData;
                        this.emailDataGridRows = this.$store.state.ghistMnModule.ga_emailDataGridRowsData;
                        this.oriEmailDataGridRows = this.$store.state.ghistMnModule.ga_oriEmailDataGridRowsData;
                        this.contactDataGridRows = this.$store.state.ghistMnModule.ga_contactDataGridRowsData;
                        this.oriContactDataGridRows = this.$store.state.ghistMnModule.ga_oriContactDataGridRowsData;
                        this.addressDataGridRows = this.$store.state.ghistMnModule.ga_addressDataGridRowsData;
                        this.oriAddressDataGridRows = this.$store.state.ghistMnModule.ga_oriAddressDataGridRowsData;
                    }
                    else {
                        this.isLoadingDialog = true;
                        this.initData();
                        this.fetchEmailData();
                    }
                }
            },
            emailDataGridRows: {
                handler: function (val) {
                    if (!_.isEmpty(val)) {
                        let lo_emailTmpCUD = {
                            createData: [],
                            updateData: [],
                            oriData: []
                        };

                        _.each(this.oriEmailDataGridRows, (lo_oriEmailDataGridRows) => {
                            if (_.isNull(lo_oriEmailDataGridRows.cust_cod)) {
                                lo_emailTmpCUD.createData = val;
                            }
                            else {
                                lo_emailTmpCUD.updateData = val;
                                lo_emailTmpCUD.oriData = this.oriEmailDataGridRows;
                            }
                        });

                        //將email資料放至Vuex
                        this.$store.dispatch("ghistMnModule/setEmailDataGridRowsData", {
                            ga_emailDataGridRowsData: val,
                            ga_oriEmailDataGridRowsData: this.oriEmailDataGridRows,
                            go_emailTmpCUD: lo_emailTmpCUD
                        });
                    }
                },
                deep: true
            },
            contactDataGridRows: {
                handler: function (val) {
                    if (!_.isEmpty(val)) {
                        let lo_contactTmpCUD = {
                            createData: [],
                            updateData: [],
                            oriData: []
                        };

                        _.each(this.oriContactDataGridRows, (lo_oriContactDataGridRows, idx) => {
                            if (_.isNull(lo_oriContactDataGridRows["contact_dt.cust_cod"])) {
                                lo_contactTmpCUD.createData.push(val[idx]);
                            }
                            else {
                                lo_contactTmpCUD.updateData.push(val[idx]);
                                lo_contactTmpCUD.oriData.push(lo_oriContactDataGridRows);
                            }
                        });

                        //將聯絡資料放至Vuex
                        this.$store.dispatch("ghistMnModule/setContactDataGridRowsData", {
                            ga_contactDataGridRowsData: val,
                            ga_oriContactDataGridRowsData: this.oriContactDataGridRows,
                            go_contactTmpCUD: lo_contactTmpCUD
                        });
                    }
                },
                deep: true
            },
            addressDataGridRows: {
                handler: function (val) {
                    if (!_.isEmpty(val)) {
                        _.each(val, (lo_addressDataGridRows, idx) => {
                            if (!_.isNull(lo_addressDataGridRows["address_dt.zip_cod"])) {
                                if (_.isNull(lo_addressDataGridRows["address_dt.add_rmk"])) {
                                    let ls_zipCod = _.findWhere(this.zipCodSelectData, {value: lo_addressDataGridRows["address_dt.zip_cod"]})["display"];
                                    val[idx]["address_dt.add_rmk"] = ls_zipCod.split(":")[1]
                                }
                                else if (lo_addressDataGridRows["address_dt.add_rmk"].trim() == "") {
                                    let ls_zipCod = _.findWhere(this.zipCodSelectData, {value: lo_addressDataGridRows["address_dt.zip_cod"]});
                                    val[idx]["address_dt.add_rmk"] = ls_zipCod.split(":")[1]
                                }
                            }
                        });

                        let lo_addressTmpCUD = {
                            createData: [],
                            updateData: [],
                            oriData: []
                        };

                        _.each(this.oriAddressDataGridRows, (lo_oriAddressDataGridRows, idx) => {
                            if (_.isNull(lo_oriAddressDataGridRows["address_dt.cust_cod"])) {
                                lo_addressTmpCUD.createData.push(val[idx])
                            }
                            else {
                                lo_addressTmpCUD.updateData.push(val[idx]);
                                lo_addressTmpCUD.oriData.push(lo_oriAddressDataGridRows);
                            }
                        });
                        //將聯絡資料放至Vuex
                        this.$store.dispatch("ghistMnModule/setAddressDataGridRowsData", {
                            ga_addressDataGridRowsData: val,
                            ga_oriAddressDataGridRowsData: this.oriAddressDataGridRows,
                            go_addressTmpCUD: lo_addressTmpCUD
                        });
                    }
                },
                deep: true
            }
        },
        methods: {
            initData() {
                this.emailFieldsData = [];
                this.emailDataGridRows = [];
                this.oriEmailDataGridRows = [];
                this.contactFieldsData = [];
                this.contactFieldOneData = {};
                this.contactFieldTwoData = {};
                this.contactDataGridRows = [];
                this.oriContactDataGridRows = [];
                this.addressFieldsData = [];
                this.addressDataGridRows = [];
                this.oriAddressDataGridRows = [];
            },
            fetchEmailData() {
                BacUtils.doHttpPostAgent("/api/fetchDataGridFieldData", {
                    prg_id: "PMS0210011",
                    page_id: 1040,
                    tab_page_id: 1,
                    searchCond: {cust_cod: this.$store.state.ghistMnModule.gs_gcustCod}
                }, result => {
                    this.emailFieldsData = result.dgFieldsData;
                    this.emailDataGridRows = result.dgRowData;
                    this.oriEmailDataGridRows = JSON.parse(JSON.stringify(result.dgRowData));
                    _.each(this.emailDataGridRows, (lo_emailDataGridRows, idx) => {
                        this.emailDataGridRows[idx]["cust_cod"] = this.$store.state.ghistMnModule.gs_gcustCod;
                        this.emailDataGridRows[idx]["athena_id"] = getCookie("athena_id");
                        this.emailDataGridRows[idx] = _.extend(lo_emailDataGridRows, {tab_page_id: 1,});
                    });
                    _.each(this.oriEmailDataGridRows, (lo_emailDataGridRows, idx) => {
                        this.oriEmailDataGridRows[idx] = _.extend(lo_emailDataGridRows, {tab_page_id: 1});
                    });
                    this.fetchContactData()
                });
            },
            fetchContactData() {
                BacUtils.doHttpPostAgent("/api/fetchDataGridFieldData", {
                    prg_id: "PMS0210011",
                    page_id: 1040,
                    tab_page_id: 2,
                    searchCond: {cust_cod: this.$store.state.ghistMnModule.gs_gcustCod}
                }, result => {
                    this.contactFieldsData = result.dgFieldsData;
                    this.contactFieldOneData = _.findWhere(this.contactFieldsData, {ui_field_name: 'contact_dt.contact_nam'});
                    this.contactFieldTwoData = _.findWhere(this.contactFieldsData, {ui_field_name: 'contact_dt.contact_rmk'});
                    this.contactDataGridRows = result.dgRowData;
                    this.oriContactDataGridRows = JSON.parse(JSON.stringify(result.dgRowData));
                    _.each(this.contactDataGridRows, (lo_contactDataGridRows, idx) => {
                        this.contactDataGridRows[idx]["contact_dt.athena_id"] = getCookie("athena_id");
                        this.contactDataGridRows[idx]["contact_dt.cust_cod"] = this.$store.state.ghistMnModule.gs_gcustCod;
                        this.contactDataGridRows[idx] = _.extend(lo_contactDataGridRows, {tab_page_id: 2});
                    });
                    _.each(this.oriContactDataGridRows, (lo_contactDataGridRows, idx) => {
                        this.oriContactDataGridRows[idx] = _.extend(lo_contactDataGridRows, {tab_page_id: 2});
                    });
                    this.fetchAddressData();
                });
            },
            fetchAddressData() {
                BacUtils.doHttpPostAgent("/api/fetchDataGridFieldData", {
                    prg_id: "PMS0210011",
                    page_id: 1040,
                    tab_page_id: 3,
                    searchCond: {cust_cod: this.$store.state.ghistMnModule.gs_gcustCod}
                }, result => {
                    this.addressFieldsData = result.dgFieldsData;
                    this.addressDataGridRows = result.dgRowData;
                    this.oriAddressDataGridRows = JSON.parse(JSON.stringify(result.dgRowData));

                    //取得郵遞區號下拉資料
                    _.each(this.addressFieldsData, (lo_addressFieldData) => {
                        if (lo_addressFieldData.ui_field_name == 'address_dt.zip_cod') {
                            this.zipCodSelectData = lo_addressFieldData.selectData;
                        }
                    });

                    _.each(this.addressDataGridRows, (lo_addressDataGridRows, idx) => {
                        this.addressDataGridRows[idx]["address_dt.athena_id"] = getCookie("athena_id");
                        this.addressDataGridRows[idx]["address_dt.cust_cod"] = this.$store.state.ghistMnModule.gs_gcustCod;
                        this.addressDataGridRows[idx] = _.extend(lo_addressDataGridRows, {tab_page_id: 3});
                    });
                    _.each(this.oriAddressDataGridRows, (lo_addressDataGridRows, idx) => {
                        this.oriAddressDataGridRows[idx] = _.extend(lo_addressDataGridRows, {tab_page_id: 3});
                    });

                    this.isLoadingDialog = false;
                    this.setFieldsData();//把欄位資料放進vuex中
                });
            },
            setFieldsData() {
                //將其他聯絡欄位資料放至Vuex
                this.$store.dispatch("ghistMnModule/setOtherContactFieldsData", {
                    ga_emailFieldsData: this.emailFieldsData,
                    ga_contactFieldsData: this.contactFieldsData,
                    ga_addressFieldsData: this.addressFieldsData
                });
            },
            doCloseDialog() {
                this.initData();
                $("#otherContact").dialog('close');
            }
        }
    }
</script>