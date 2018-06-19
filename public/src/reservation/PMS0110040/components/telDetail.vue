<template>
    <div id="telDetail_dialog" class="hide padding-5" style="">
        <div class="businessCompanyData">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-10 col-sm-10">
                        <div class="row no-margin-right main-content-data borderFrame">
                            <div class="grid" v-for="fields in fieldsData">
                                <div class="grid-item" v-for="field in fields">
                                    <label :style="{width:field.label_width + 'px' , height:field.height + 'px'}">
                                        <span v-if=" field.requirable == 'Y' "
                                              style="color: red;">*</span>
                                        <span>{{ field.ui_display_name }}</span>
                                    </label>
                                    <input type="text"
                                           v-model="singleData[field.ui_field_name]"
                                           :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                           :required="field.requirable == 'Y'" min="0"
                                           :maxlength="field.ui_field_length"
                                           :class="{'input_sta_required' : field.requirable == 'Y'}"
                                           :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                </div>
                            </div>
                            <div class="clearfix"></div>
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
        name: "telDetail",
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
                    page_id: 1150,
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