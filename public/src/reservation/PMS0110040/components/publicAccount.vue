<template>
    <div id="publicAccount_dialog" class="hide padding-5" style="">
        <div class="businessCompanyData">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-10 col-sm-10">
                        <div class="main-content-data borderFrame">
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
                            <div class="clearfix"></div>
                            <div class="row">
                                <div class="col-xs-4 col-xs-offset-3">
                                    <button class="btn btn-primary btn-white btn-defaultWidth"
                                            role="button">自動選取
                                    </button>
                                </div>
                                <div class="col-xs-4">
                                    <button class="btn btn-primary btn-white btn-defaultWidth selectManually"
                                            role="button">手動選取
                                    </button>
                                </div>
                            </div>
                        </div><!--main-content-data-->
                        <div class="clearfix"></div>
                    </div>
                    <div class="col-xs-2 col-sm-2">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">確定
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">離開
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="clearfix"></div>
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
        data() {
            return {
                fieldsData: [],
                oriFieldsData: [],
                singleData: {},
                oriSingleData: {}
            }
        },
        watch: {
            rowData(val) {
                if (!_.isEmpty(val)) {
                    this.initData();
                    this.fetchRowData();
                }
            }
        },
        methods: {
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
            initData() {
                this.singleData = {};
                this.oriSingleData = {};
            },
            fetchRowData() {
                this.singleData = this.rowData;
                this.oriSingleData = JSON.parse(JSON.stringify(this.rowData));
            }
        }
    }
</script>

<style scoped>

</style>