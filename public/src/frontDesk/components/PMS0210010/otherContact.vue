<template>
    <div id="otherContact" class="hide padding-5" style="top: 0 !important;">
        <div class="businessCompanyData" >
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
                                                            <td class="css_td width-70" >
                                                                <input type="text" class="input-medium medium-c1 width-100"
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
                                                <p class="billInfo-title">{{i18nLang.program.PMS0210011.contact_method}}</p>
                                            </div>
                                        </div>
                                        <div class="col-xs-12 col-sm-12">
                                            <div class="row no-margin-right">
                                                <div class="content">
                                                    <table class="css_table">
                                                        <thead class="css_thead">
                                                        <tr class="css_tr">
                                                            <template v-for="field in contactFieldsData">
                                                                <th v-if="field.ui_field_name=='contact_dt.contact_nam'"
                                                                    class="css_th width-15">
                                                                    {{field.ui_display_name}}
                                                                </th>
                                                                <th v-else-if="field.ui_field_name=='contact_dt.contact_rmk'"
                                                                    class="css_th width-70">
                                                                    {{field.ui_display_name}}
                                                                </th>
                                                            </template>
                                                        </tr>
                                                        </thead>
                                                        <tbody class="css_tbody">
                                                        <tr v-for="data in contactDataGridRows" class="css_tr">
                                                            <td class="css_td">{{ data["contact_rf.contact_nam"]}}</td>
                                                            <td class="css_td">
                                                                <input type="text" class="input-medium medium-c1 width-100"
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

                                                                <bac-select v-model="data['address_dt.zip_cod']" :data="zipCodSelectData"
                                                                            is-qry-src-before="Y" value-field="value" text-field="display"
                                                                            @update:v-model="val => data['address_dt.zip_cod'] = val"
                                                                            :default-val="data['address_dt.zip_cod']">
                                                                </bac-select>

                                                            </td>
                                                            <td class="css_td">
                                                                <input type="text" class="input-medium medium-c1 width-100"
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
                    this.isLoadingDialog = true;
                    this.initData();
                    this.fetchEmailData();
                }
            },
            emailDataGridRows: {
                handler(val){
                    if(!_.isEmpty(val)){

                    }
                },
                deep: true
            },
            contactDataGridRows: {
                handler(val){
                    if(!_.isEmpty(val)){

                    }
                },
                deep: true
            },
            addressDataGridRows: {
                handler(val){
                    if(!_.isEmpty(val)){

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
                this.contactDataGridRows = [];
                this.oriContactDataGridRows = [];
                this.addressFieldsData = [];
                this.addressDataGridRows = [];
                this.oriAddressDataGridRows = [];
            },
            fetchEmailData() {
                $.post("/api/fetchDataGridFieldData", {
                    prg_id: "PMS0210011",
                    page_id: 1040,
                    tab_page_id: 1,
                    searchCond: {cust_cod: this.$store.state.gs_gcustCod}
                }).then(result => {
                    this.emailFieldsData = result.dgFieldsData;
                    this.emailDataGridRows = result.dgRowData;
                    this.oriEmailDataGridRows = JSON.parse(JSON.stringify(result.dgRowData));
                    this.fetchContactData()
                });
            },
            fetchContactData() {
                $.post("/api/fetchDataGridFieldData", {
                    prg_id: "PMS0210011",
                    page_id: 1040,
                    tab_page_id: 2,
                    searchCond: {cust_cod: this.$store.state.gs_gcustCod}
                }).then(result => {
                    this.contactFieldsData = result.dgFieldsData;
                    this.contactDataGridRows = result.dgRowData;
                    this.oriContactDataGridRows = JSON.parse(JSON.stringify(result.dgRowData));
                    this.fetchAddressData();
                });
            },
            fetchAddressData() {
                $.post("/api/fetchDataGridFieldData", {
                    prg_id: "PMS0210011",
                    page_id: 1040,
                    tab_page_id: 3,
                    searchCond: {cust_cod: this.$store.state.gs_gcustCod}
                }).then(result => {
                    this.addressFieldsData = result.dgFieldsData;
                    this.addressDataGridRows = result.dgRowData;
                    this.oriAddressDataGridRows = JSON.parse(JSON.stringify(result.dgRowData));
                    _.each(this.addressFieldsData, (lo_addressFieldData)=>{
                        if(lo_addressFieldData.ui_field_name == 'address_dt.zip_cod'){
                            this.zipCodSelectData = lo_addressFieldData.selectData;
                        }
                    })
                    this.isLoadingDialog = false;
                });
            },
            doCloseDialog(){
                this.initData();
                $("#otherContact").dialog('close');
            }
        }
    }
</script>