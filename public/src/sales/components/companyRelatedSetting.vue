<template>
    <div v-loading="isLoading" element-loading-text="Loading...">
        <div class="col-xs-12 col-sm-12">
            <div class="row">
                <div class="col-xs-11 col-sm-11">
                    <div class="row no-margin-right">
                        <div class="billInfo content borderFrame">
                            <div class="grid" v-for="fields in fieldsData">
                                <div class="grid-item" v-for="field in fields">
                                    <!--checkbox-->
                                    <div v-if="field.visiable == 'Y' && field.ui_type == 'checkbox'" style="margin-left: 87px;">
                                        <input style="margin-top: 5px;"
                                               v-model="rowData[field.ui_field_name]" type="checkbox"
                                               :required="field.requirable == 'Y'" :maxlength="field.ui_field_length"
                                               :disabled="field.modificable == 'N'||
                                                (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus) "
                                               @click="chkFieldRule(field.ui_field_name,field.rule_func_name)">
                                        <label style="width:auto" v-if="field.visiable == 'Y' && field.ui_type == 'checkbox'">
                                            <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                            <span>{{ field.ui_display_name }}</span>
                                        </label>
                                    </div>

                                    <label v-if="field.visiable == 'Y' && field.ui_type != 'checkbox'"
                                           :style="{width:field.label_width + 'px' , height:field.height + 'px'}">
                                        <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                        <span>{{ field.ui_display_name }}</span>
                                    </label>

                                    <input type="text" v-model="singleData[field.ui_field_name]"
                                           v-if="field.visiable == 'Y' &&  field.ui_type == 'text'"
                                           :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                           :required="field.requirable == 'Y'" min="0"
                                           :maxlength="field.ui_field_length"
                                           :class="{'input_sta_required' : field.requirable == 'Y'}"
                                           :disabled="field.modificable == 'N'||
                                            (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">

                                    <!--  textarea -->
                                    <textarea v-if="field.visiable == 'Y' && field.ui_type == 'textarea'"
                                              v-model="singleData[field.ui_field_name]"
                                              class="numStyle-none" rows="4"
                                              :style="{width:field.width + 'px'}" style="resize: none;"
                                              :required="field.requirable == 'Y'"
                                              :maxlength="field.ui_field_length"
                                              :disabled="field.modificable == 'N'||
                                              (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                              @click="chkFieldRule(field.ui_field_name,field.rule_func_name)">
                                    </textarea>

                                    <bac-select v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                v-model="singleData[field.ui_field_name]" :data="field.selectData"
                                                is-qry-src-before="Y" value-field="value" text-field="display"
                                                @update:v-model="val => singleData[field.ui_field_name] = val"
                                                :default-val="singleData[field.ui_field_name] || field.defaultVal"
                                                :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                    </bac-select>

                                    <!--number 金額顯示format-->
                                    <input type="text" v-model="singleData[field.ui_field_name]"
                                           v-if="field.visiable == 'Y' && field.ui_type == 'number'"
                                           :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                           :class="{'input_sta_required' : field.requirable == 'Y', 'text-right' : field.ui_type == 'number'}"
                                           :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">

                                    <!-- 日期時間選擇器 -->
                                    <el-date-picker v-if="field.visiable == 'Y' && field.ui_type == 'datetime'"
                                                    v-model="singleData[field.ui_field_name]" type="datetime"
                                                    change="chkFieldRule(field.ui_field_name,field.rule_func_name)"
                                                    :disabled="field.modificable == 'N'||
                                                    (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                                    size="small" format="yyyy/MM/dd HH:mm:ss"
                                                    :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                    @change="chkFieldRule(field.ui_field_name,field.rule_func_name)">
                                    </el-date-picker>

                                    <!--multi Tree-->
                                    <template v-if="field.ui_type == 'multitree'">
                                        <treeselect
                                                :style="{width:field.width + 'px'}"
                                                v-model="singleData[field.ui_field_name]"
                                                :multiple="true"
                                                :options="field.selectData"
                                        />
                                    </template>

                                </div>
                            </div>
                            <!--信用額度變更-->
                            <div id="changeCreditLimit" class="hide padding-5">
                                <div class="businessCompanyData">
                                    <div class="col-sm-12 col-xs-12">
                                        <div class="row">
                                            <div class="col-sm-10 col-xs-10">
                                                <div class="row billInfo main-content-data" v-for="fields in pageTwoFieldsData">
                                                    <div class="grid">
                                                        <div class="grid-item" v-for="field in fields">
                                                            <!--checkbox-->
                                                            <div v-if="field.visiable == 'Y' && field.ui_type == 'checkbox'" style="margin-left: 87px;">
                                                                <input style="margin-top: 5px;"
                                                                       v-model="rowData[field.ui_field_name]" type="checkbox"
                                                                       :required="field.requirable == 'Y'" :maxlength="field.ui_field_length"
                                                                       :disabled="field.modificable == 'N'||(field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus) "
                                                                       @click="chkFieldRule(field.ui_field_name,field.rule_func_name)">
                                                                <label style="width:auto" v-if="field.visiable == 'Y' && field.ui_type == 'checkbox'">
                                                                    <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                                                    <span>{{ field.ui_display_name }}</span>
                                                                </label>
                                                            </div>

                                                            <label v-if="field.visiable == 'Y' && field.ui_type != 'checkbox'"
                                                                   :style="{width:field.label_width + 'px' , height:field.height + 'px'}">
                                                                <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                                                <span>{{ field.ui_display_name }}</span>
                                                            </label>

                                                            <input type="text" v-model="singleData[field.ui_field_name]"
                                                                   v-if="field.visiable == 'Y' &&  field.ui_type == 'text'"
                                                                   :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                   :required="field.requirable == 'Y'" min="0"
                                                                   :maxlength="field.ui_field_length"
                                                                   :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                   :disabled="field.modificable == 'N'||
                                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">

                                                            <!--number 金額顯示format-->
                                                            <input type="text" v-model="singleData[field.ui_field_name]"
                                                                   v-if="field.visiable == 'Y' && field.ui_type == 'number'"
                                                                   :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                   :class="{'input_sta_required' : field.requirable == 'Y', 'text-right' : field.ui_type == 'number'}"
                                                                   :disabled="field.modificable == 'N'||
                                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                                                   @keyup="computeAmt(singleData[field.ui_field_name], field)">

                                                            <bac-select-grid v-if="field.visiable == 'Y' && field.ui_type == 'selectgrid'"
                                                                             :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                             :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                             v-model="singleData[field.ui_field_name]"
                                                                             :columns="field.selectData.columns"
                                                                             :data="field.selectData.selectData"
                                                                             :is-qry-src-before="field.selectData.isQrySrcBefore"
                                                                             :id-field="field.selectData.value" :text-field="field.selectData.display"
                                                                             @update:v-model="val => singleData[field.ui_field_name] = val"
                                                                             :default-val="singleData[field.ui_field_name]"
                                                                             :disabled="field.modificable == 'N'||
                                                                             (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                            </bac-select-grid>
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
                                                                        @click="doCloseChangeCreditLimitDialog" role="button">
                                                                    {{i18nLang.SystemCommon.Leave}}
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
                            </div>
                            <!--/.信用額度變更-->
                        </div>
                    </div>
                </div>
                <div class="col-xs-1 col-sm-1">
                    <div class="row">
                        <div class="right-menu-co">
                            <ul>
                                <li>
                                    <button class="btn btn-primary btn-white btn-white btn-defaultWidth "
                                            role="button" @click="doChangeCreditLimit">
                                        {{i18nLang.program.PMS0610020.change_credit_limit}}
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
</template>

<script>
    import Treeselect from '@riophae/vue-treeselect';

    export default {
        name: 'related-setting',
        props: ["rowData", "isRelatedSetting"],
        components: {Treeselect},
        data() {
            return {
                i18nLang: go_i18nLang,
                isLoading: false,
                isCreateStatus: false,
                isEditStatus: false,
                singleData: {},
                oriSingleData: {},
                fieldsData: [],
                oriFieldsData: [],
                pageTwoFieldsData: [],
                oriPageTwoFieldsData: []
            };
        },
        watch: {
            isRelatedSetting(val) {
                if (val) {
                    this.initData();
                    this.fetchFieldData();
                }
            }
        },
        methods: {
            initData() {
                this.isCreateStatus = this.$store.state.gb_isCreateStatus;
                this.isEditStatus = this.$store.state.gb_isEditStatus;
                this.singleData = {};
                this.oriSingleData = {};
                this.fieldsData = [];
                this.oriFieldsData = [];
            },
            fetchFieldData() {
                this.isLoading = true;
                var self = this;
                $.post("/api/fetchOnlySinglePageFieldData", {
                    prg_id: "PMS0610020",
                    page_id: 1,
                    tab_page_id: 1,
                    template_id: 'gridsingledt'
                }, function (result) {
                    self.oriFieldsData = result.gsFieldsData;
                    self.fieldsData = _.values(_.groupBy(_.sortBy(self.oriFieldsData, "col_seq"), "row_seq"));
                    self.fetchRowData();
                });
            },
            fetchRowData() {
                var self = this;
                if (this.isCreateStatus) {
                    this.singleData = {
                        hoffice_cod: self.$store.state.gs_custCod,
                        dm_flag: 'Y',
                        cust_idx_ar_amt: 0,
                        business_cod: '01  ',
                        type_cod: '01  '
                    };
                    this.oriSingleData = JSON.parse(JSON.stringify(this.singleData));
                    this.isLoading = false;
                }
                else if (this.isEditStatus) {
                    $.post("/api/fetchSinglePageFieldData", {
                        prg_id: "PMS0610020",
                        page_id: 1,
                        tab_page_id: 1,
                        template_id: "gridsingledt",
                        searchCond: {cust_cod: this.rowData.cust_mn_cust_cod}
                    }).then(result => {
                        this.singleData = result.gsMnData.rowData[0];
                        this.oriSingleData = JSON.parse(JSON.stringify(result.gsMnData.rowData[0]));
                        this.isLoading = false;
                    });
                }

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
                        prg_id: "PMS0610020",
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
            computeAmt(val, field) {
                var ls_ruleVal = field.format_func_name.rule_val;

                var ln_creditAmt = this.singleData['cust_idx_credit_amt'].toString();
                var ln_arAmt = this.singleData['cust_idx_ar_amt'].toString();
                var ln_balance =
                    Number(go_formatDisplayClass.removeAmtFormat(ln_creditAmt)) - Number(go_formatDisplayClass.removeAmtFormat(ln_arAmt));

                this.singleData[field.ui_field_name] = go_formatDisplayClass.amtFormat(ln_creditAmt, ls_ruleVal);
                this.singleData['balance'] = go_formatDisplayClass.amtFormat(ln_balance, ls_ruleVal);
            },
            //信用額度變更
            async doChangeCreditLimit() {
                await $.post("/api/fetchOnlySinglePageFieldData", {
                    prg_id: "PMS0610020",
                    page_id: 2,
                    tab_page_id: 1030
                }).then(result => {
                    this.oriPageTwoFieldsData = result.gsFieldsData;
                    this.pageTwoFieldsData = _.values(_.groupBy(_.sortBy(result.gsFieldsData, "col_seq"), "row_seq"));
                });

                var dialog = $("#changeCreditLimit").removeClass('hide').dialog({
                    modal: true,
                    title: go_i18nLang["program"]["PMS0610020"].change_credit_limit,
                    title_html: true,
                    width: 500,
                    maxwidth: 1920,
                    dialogClass: "test",
                    resizable: true
                });

            },
            doCloseChangeCreditLimitDialog() {
                $("#changeCreditLimit").dialog('close');
            }
        }
    }

    function searchValue(la_children, ls_selectData) {
        _.each(la_children, function (lo_children) {
            if (_.isUndefined(lo_children.value)) {
                searchValue(lo_children.children, ls_selectData);
            }
            else {
                ls_selectData.push(lo_children.value);
                return;
            }
        });
    }

    function searchOptions(la_options, ls_value, la_selectData) {
        _.each(la_options, function (lo_option) {
            var lo_childrenOptions = _.findWhere(lo_option.children, {id: ls_value});
            if (_.isUndefined(lo_childrenOptions)) {
                searchOptions(lo_option.children, ls_value, la_selectData);
            }
            else if (_.isUndefined(lo_childrenOptions.value)) {
                searchValue(lo_childrenOptions.children, la_selectData);
            }
            else {
                la_selectData.push(lo_childrenOptions.value);
                return;
            }
        });
    }
</script>