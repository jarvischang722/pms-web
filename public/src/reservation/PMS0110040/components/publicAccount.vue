<template>
    <div id="publicAccount_dialog" class="hide padding-5" style="">
        <div class="businessCompanyData">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <!--欄位-->
                    <div class="col-xs-10 col-sm-10">
                        <div class="main-content-data borderFrame">
                            <!--單筆資料-->
                            <div class="grid" v-for="fields in fieldsData">
                                <div class="grid-item" v-for="field in fields">
                                    <div v-if="field.ui_type!='text'">
                                        <label class="pull-left">
                                            <span v-if=" field.requirable == 'Y' "
                                                  style="color: red;">*</span>
                                            <span>{{ field.ui_display_name }}</span>
                                        </label>
                                        <div class="popCheckbox pull-left">
                                    <span class="radio">
                                      <label class="checkbox-width">
                                          <input name="form-field-radio"
                                                 type="radio"
                                                 class="ace"
                                                 value="Y"
                                                 v-model="singleData[field.ui_field_name]"
                                          >
                                          <span class="lbl">
                                            <span class="txt">有</span>
                                          </span>
                                      </label>
                                    </span>
                                        </div>
                                        <div class="popCheckbox pull-left">
                                            <span class="radio">
                                      <label class="checkbox-width">
                                          <input name="form-field-radio"
                                                 type="radio"
                                                 class="ace"
                                                 value="N"
                                                 v-model="singleData[field.ui_field_name]"
                                          >
                                          <span class="lbl">
                                            <span class="txt">無</span>
                                          </span>
                                      </label>
                                    </span>
                                        </div>
                                    </div>

                                    <label v-else>
                                        <span v-if=" field.requirable == 'Y' "
                                              style="color: red;">*</span>
                                        <span>{{ field.ui_display_name }}</span>
                                    </label>
                                    <input v-if="field.ui_type=='text'"
                                           type="text" class="input-medium resvCard"
                                           v-model="singleData[field.ui_field_name]"
                                           disabled/>
                                </div>
                            </div>
                            <!--/.單筆資料-->
                            <div class="clearfix"></div>
                            <!--按鈕-->
                            <div class="row">
                                <div class="col-xs-4 col-xs-offset-3">
                                    <button class="btn btn-primary btn-white btn-defaultWidth"
                                            role="button" @click="autoSelect">自動選取
                                    </button>
                                </div>
                                <div class="col-xs-4">
                                    <button class="btn btn-primary btn-white btn-defaultWidth"
                                            role="button" @click="manualSelect">手動選取
                                    </button>
                                </div>
                            </div>
                            <!--/.按鈕-->
                        </div><!--main-content-data-->
                        <div class="clearfix"></div>
                    </div>
                    <!--/.欄位-->
                    <!--按鈕-->
                    <div class="col-xs-2 col-sm-2">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doCloseDialog">確定
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doCloseDialog">離開
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--/.按鈕-->
                </div>
                <div class="clearfix"></div>
            </div>
            <div class="clearfix"></div>
        </div>
        <div id="selectManually_dialog" class="hide padding-5" style="top: 20px;">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-10 col-sm-10">
                        <div class="row no-margin-right main-content-data">
                            <table class="fancyTable themeTable treeControl custom-table"
                                   id="masterNosTable" cellpadding="0" cellspacing="0"
                                   style="width: 100%; height: 150px;">
                                <thead>
                                <tr>
                                    <th class="ca-headerTitle height-fntThead rp-first-th">
                                        {{i18n_Lang.program.PMS0110041.master_nos}}
                                    </th>
                                    <th class="ca-headerTitle height-fntThead">
                                        {{i18n_Lang.program.PMS0110041.master_sta}}
                                    </th>
                                    <th class="ca-headerTitle height-fntThead">
                                        {{i18n_Lang.program.PMS0110041.master_typ}}
                                    </th>
                                    <th class="ca-headerTitle height-fntThead">
                                        {{i18n_Lang.program.PMS0110041.show_cod}}
                                    </th>
                                    <th class="ca-headerTitle height-fntThead">
                                        {{i18n_Lang.program.PMS0110041.cust_nam}}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr v-for="data in tableRowsData" class="defHt" @click="selectedData = data">
                                    <td>{{data.master_nos}}</td>
                                    <td>{{data.master_sta}}</td>
                                    <td>{{data.master_typ}}</td>
                                    <td>{{data.show_cod}}</td>
                                    <td>{{data.cust_nam}}</td>
                                </tr>
                                </tbody>
                            </table>
                        </div><!--main-content-data-->
                        <div class="clearfix"></div>
                    </div>
                    <div class="col-xs-2 col-sm-2">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doConfirmSelectData">確定
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doCloseSelectDataDialog">離開
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "publicAccount",
        props: ["rowData"],
        mounted() {
            this.fetchFieldsData();
        },
        updated() {
            $("#masterNosTable").tableHeadFixer({"left": 1});
        },
        data() {
            return {
                i18n_Lang: go_i18nLang,
                fieldsData: [],
                oriFieldsData: [],
                singleData: {},
                oriSingleData: {},
                tableRowsData: [],
                selectedData: {}
            }
        },
        watch: {
            rowData(val) {
                if (!_.isEmpty(val)) {
                    this.initData();
                    this.fetchMaterNosSelectData();
                    this.fetchRowData();
                }
            },
            "singleData.master_sta"(val) {
                if (val == 'N') {
                    this.singleData.master_nos = "";
                }
            }
        },
        methods: {
            initData() {
                this.singleData = {};
                this.oriSingleData = {};
            },
            fetchMaterNosSelectData() {
                BacUtils.doHttpPostAgent("/api/chkFieldRule", {
                    rule_func_name: 'fetchMasterNosSelectData',
                    rowData: this.rowData
                }, (result) => {
                    if (result.success) {
                        this.tableRowsData = result.selectOptions;
                    }
                    else {
                        alert(result.errorMsg);
                    }
                });
            },
            fetchFieldsData() {
                BacUtils.doHttpPostAgent("/api/fetchOnlySinglePageFieldData", {
                    prg_id: "PMS0110041",
                    page_id: 1140,
                    tab_page_id: 1
                }, (result) => {
                    if (result.success) {
                        this.fieldsData = _.values(_.groupBy(_.sortBy(result.gsFieldsData, "col_seq"), "row_seq"));
                        this.oriFieldsData = JSON.parse(JSON.stringify(result.gsFieldsData));

                    }
                });
            },
            fetchRowData() {
                this.singleData = this.rowData;
                this.oriSingleData = JSON.parse(JSON.stringify(this.rowData));
            },
            autoSelect() {
                if (this.singleData.master_sta == 'Y') {
                    BacUtils.doHttpPostAgent("/api/chkFieldRule", {
                        rule_func_name: 'r_1141',
                    }, (result) => {
                        if (result.success) {
                            this.singleData.master_nos = result.effectValues.master_nos;
                        }
                        else {
                            alert(result.errorMsg);
                        }
                    });
                }
            },
            manualSelect() {
                //todo 高度在問晉瑋
                let dialog = $("#selectManually_dialog").removeClass('hide').dialog({
                    modal: true,
                    title: "手動選取",
                    title_html: true,
                    width: 450,
                    maxwidth: 1920,
                    dialogClass: "test",
                    resizable: true
                });
            },
            doCloseDialog() {
                $("#publicAccount_dialog").dialog('close');
            },
            doConfirmSelectData() {
                this.singleData.master_nos = this.selectedData.master_nos;
                this.doCloseSelectDataDialog();
            },
            doCloseSelectDataDialog() {
                $("#selectManually_dialog").dialog('close');
            }
        }
    }
</script>

<style scoped>

</style>