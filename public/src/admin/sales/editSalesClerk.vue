<template>
    <el-dialog :close-on-click-modal="true" :show-close="false"
               :visible.sync="isEditSalesClerk">
        <div class="businessCompanyData">
            <div class="col-sm-12 col-xs-12">
                <div class="row">
                    <div class="col-sm-10 col-xs-10">
                        <div class="row billInfo" v-for="fields in fieldsData">
                            <div class="content">
                                <div class="space-custom-5"></div>
                                <div class="grid-item" v-for="field in fields">
                                    <input v-if="field.visiable == 'Y' && field.ui_type == 'checkbox'"
                                           v-model="singleData[field.ui_field_name]" type="checkbox"
                                           :required="field.requirable == 'Y'" :maxlength="field.ui_field_length"
                                           :disabled="field.modificable == 'N'|| (field.modificable == 'I') || (field.modificable == 'E')"
                                           @click="chkFieldRule(field.ui_field_name,field.rule_func_name.validate)">

                                    <label style="width:auto" class="clerkCheckbox"
                                           v-if="field.visiable == 'Y' && field.ui_type == 'checkbox'">
                                        <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                        <span>{{ field.ui_display_name }}</span>
                                    </label>

                                    <label v-if="field.visiable == 'Y' && field.ui_type != 'checkbox'">
                                        <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                        <span>{{ field.ui_display_name }}</span>
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col-sm-2 col-xs-2">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doEditSales">{{i18nLang.SystemCommon.OK}}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="clearfix"></div>
    </el-dialog>
</template>

<script>
    export default {
        name: 'edit-sales-clerk',
        props: ["editRows", "isEditSalesClerk"],
        mounted() {
            this.isLoadingDialog = true;
            this.loadingText = "Loading...";
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                isLoadingDialog: false,
                loadingText: "",
                singleData: {},
                oriSingleData: {},
                fieldsData: [],
                oriFieldsData: [],
            };
        },
        watch: {
            isEditSalesClerk(val) {
                if (val) {
                    this.initData();
                    this.fetchSingleGridFieldData();
                }
            }
        },
        methods: {
            initData() {
                this.singleData = {};
                this.fieldData = [];
                console.log(this.editRows);
            },
            fetchSingleGridFieldData() {
                var self = this;
                var lo_params = {
                    prg_id: "PMS0620030",
                    page_id: 1
                };

                $.post("/api/fetchOnlySinglePageFieldData", lo_params, function (result) {
                    self.oriFieldsData = result.gsFieldsData;
                    self.fieldsData = _.values(_.groupBy(_.sortBy(self.oriFieldsData, "col_seq"), "row_seq"));
                    self.fetchRowData();
                    self.isLoadingDialog = false;
                });
            },
            fetchRowData() {
                this.singleData = {
                    upd_order_mn: false
                };
                this.oriSingleData = _.clone(this.singleData);
            },
            chkFieldRule(ui_field_name, rule_func_name) {
                if (rule_func_name === "") {
                    return;
                }
                var self = this;
                var la_originData = [this.oriSingleData];
                var la_singleData = [this.singleData];
                var la_diff = _.difference(la_originData, la_singleData);

                // 判斷資料是否有異動
                if (la_diff.length != 0) {
                    this.isUpdate = true;
                }

                if (!_.isEmpty(rule_func_name.trim())) {
                    var postData = {
                        prg_id: "PMS0620030",
                        rule_func_name: rule_func_name,
                        validateField: ui_field_name,
                        singleRowData: JSON.parse(JSON.stringify(this.singleData)),
                        oriSingleData: this.oriSingleData
                    };
                    $.post('/api/chkFieldRule', postData, function (result) {

                        if (result.success) {
                            //是否要show出訊息
                            if (result.showAlert) {
                                alert(result.alertMsg);
                            }

                            //是否要show出詢問視窗
                            if (result.showConfirm) {
                                if (confirm(result.confirmMsg)) {

                                } else {
                                    //有沒有要再打一次ajax到後端
                                    if (result.isGoPostAjax && !_.isEmpty(result.ajaxURL)) {
                                        $.post(result.ajaxURL, postData, function (result) {

                                            if (!result.success) {
                                                alert(result.errorMsg);
                                            } else {

                                                if (!_.isUndefined(result.effectValues) && _.size(result.effectValues) > 0) {
                                                    self.singleData = _.extend(self.singleData, result.effectValues);
                                                }

                                            }
                                        });
                                    }
                                }
                            }

                        } else {
                            alert(result.errorMsg);
                        }

                        //連動帶回的值
                        if (!_.isUndefined(result.effectValues) && _.size(result.effectValues) > 0) {
                            self.singleData = _.extend(self.singleData, result.effectValues);
                        }

                    });
                }
            },
            doEditSales() {
                this.isEditSalesClerk = false;
            }
        }
    }
</script>