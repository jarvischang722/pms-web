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
                                               v-model="singleData[field.ui_field_name]" type="checkbox"
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
                                                :field="field"
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
                                    <template v-if="field.ui_type == 'tree'">
                                        <el-cascader
                                                :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                v-model="areaCodSelectedOption"
                                                expand-trigger="hover"
                                                :options="field.selectData"
                                                class="numStyle-none"
                                                size="small"></el-cascader>
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
                                                                       v-model="singleData[field.ui_field_name]" type="checkbox"
                                                                       :required="field.requirable == 'Y'" :maxlength="field.ui_field_length"
                                                                       :disabled="field.modificable == 'N'||(field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus) "
                                                                       @change="chkContractSta">
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
                                                                   class="text-right"
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
                                                                             :data="field.selectData.selectData" :field="field"
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
                                    <button class="btn btn-primary btn-white btn-white btn-defaultWidth purview_btn"
                                            role="button" @click="doChangeCreditLimit" data-purview_func_id="PMS0610020-1030">
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
                go_funcPurview: [],
                i18nLang: go_i18nLang,
                userInfo: {},
                isLoading: false,
                isCreateStatus: false,
                isEditStatus: false,
                singleData: {},
                oriSingleData: {},
                fieldsData: [],
                oriFieldsData: [],
                pageTwoFieldsData: [],
                oriPageTwoFieldsData: [],
                //欄位area_cod(tree格式)
                areaCodSelectData: [],
                areaCodSelectedOption: []
            };
        },
        mounted() {
            this.fetchUserInfo();
        },
        watch: {
            isRelatedSetting(val) {
                if (val) {
                    this.go_funcPurview = (new FuncPurview("PMS0610020")).getFuncPurvs();
                    this.initData();
                    this.fetchFieldData();
                }
            },
            singleData: {
                handler: function (val) {
                    if (!_.isEmpty(val)) {
                        let lo_singleData = JSON.parse(JSON.stringify(val));
                        let lo_oriSingleData = JSON.parse(JSON.stringify(this.oriSingleData));

                        if (this.$store.state.gb_isCreateStatus) {
                            val.ins_dat = moment(new Date(val.ins_dat)).format("YYYY/MM/DD HH:mm:ss");
                            val.ins_usr = this.userInfo.usr_id
                        }
                        else {
                            val.ins_dat = _.isUndefined(val.ins_dat) ? null : val.ins_dat;
                        }

                        this.$eventHub.$emit('getRelatedSettingData', {
                            relatedSettingSingleData: lo_singleData,
                            relatedSettingOriSingleData: lo_oriSingleData
                        });

                        //將相關設定資料放至Vuex
                        this.$store.dispatch("setRsSingleData", {
                            go_rsSingleData: val,
                            go_rsOriSingleData: this.oriSingleData
                        });
                    }
                },
                deep: true
            },
            areaCodSelectedOption: {
                handler(val) {
                    this.singleData.area_cod = val[val.length - 1];
                },
                deep: true
            }
        },
        methods: {
            fetchUserInfo() {
                var self = this;
                $.post('/api/getUserInfo', function (result) {
                    if (result.success) {
                        self.userInfo = result.userInfo;
                    }
                });
            },
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
                BacUtils.doHttpPostAgent("/api/fetchOnlySinglePageFieldData", {
                    prg_id: "PMS0610020",
                    page_id: 1,
                    tab_page_id: 1,
                    template_id: 'gridsingledt'
                }, function (result) {
                    self.oriFieldsData = result.gsFieldsData;
                    self.fieldsData = _.values(_.groupBy(_.sortBy(self.oriFieldsData, "col_seq"), "row_seq"));
                    self.areaCodSelectData = _.findWhere(self.oriFieldsData, {ui_field_name: "area_cod"}).selectData;
                    self.fetchRowData();
                });
            },
            fetchRowData() {
                var self = this;
                //第一次載入相關設定
                if (_.isEmpty(this.$store.state.go_allData.go_rsSingleData)) {
                    if (this.isCreateStatus) {
                        let la_typeCodSelectData = _.findWhere(self.oriFieldsData, {ui_field_name: 'type_cod'});
                        la_typeCodSelectData = _.isUndefined(la_typeCodSelectData) ? [] : la_typeCodSelectData.selectData;
                        let la_businessCodSelectData = _.findWhere(self.oriFieldsData, {ui_field_name: 'business_cod'});
                        la_businessCodSelectData = _.isUndefined(la_businessCodSelectData) ? [] : la_businessCodSelectData.selectData;

                        this.singleData = {
                            hoffice_cod: self.$store.state.gs_custCod,
                            dm_flag: 'Y',
                            cust_idx_ar_amt: 0,
                            cust_idx_credit_amt: 0,
                            business_cod: _.first(la_businessCodSelectData).value,
                            type_cod: _.first(la_typeCodSelectData).value,
                            area_cod: null
                        };
                        this.oriSingleData = JSON.parse(JSON.stringify(this.singleData));
                        this.isLoading = false;
                    }
                    else if (this.isEditStatus) {
                        var self = this;
                        $.post("/api/fetchSinglePageFieldData", {
                            prg_id: "PMS0610020",
                            page_id: 1,
                            tab_page_id: 1,
                            template_id: "gridsingledt",
                            searchCond: {cust_cod: this.rowData.cust_mn_cust_cod}
                        }).then(result => {
                            this.singleData = result.gsMnData.rowData[0];
                            this.oriSingleData = JSON.parse(JSON.stringify(result.gsMnData.rowData[0]));

                            if (!_.isNull(this.singleData.area_cod)) {
                                //找樹狀parent node
                                findByValue(this.areaCodSelectData, this.singleData.area_cod);

                                //攤平資料(陣列扁平化)
                                var list = [];
                                flattenArray(go_rtnResult, list);

                                this.areaCodSelectedOption = [];
                                var groupList = _.groupBy(list, "parent_cod");
                                groupList = _.toArray(groupList).reverse();
                                var ls_parent_cod = "";

                                _.each(groupList, function (la_list) {
                                    var lo_data;
                                    if (ls_parent_cod == "") {
                                        lo_data = _.findWhere(la_list, {value: self.singleData.area_cod});
                                    }
                                    else {
                                        lo_data = _.findWhere(la_list, {value: ls_parent_cod});
                                    }
                                    if (!_.isUndefined(lo_data)) {
                                        self.areaCodSelectedOption.push(lo_data.value);
                                        ls_parent_cod = lo_data.parent_cod;
                                    }
                                });
                                this.areaCodSelectedOption = this.areaCodSelectedOption.reverse();
                            }

                            this.isLoading = false;
                        });
                    }
                }
                else {
                    this.singleData = this.$store.state.go_allData.go_rsSingleData;
                    this.oriSingleData = this.$store.state.go_allOriData.go_rsSingleData;
                    this.isLoading = false;
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
                    BacUtils.doHttpPostAgent('/api/chkFieldRule', postData, function (result) {

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
                                        BacUtils.doHttpPostAgent(result.ajaxURL, postData, function (result) {

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
            //可簽帳時，目前簽帳金額可改變
            chkContractSta(item) {
                if (item.target.checked) {
                    this.pageTwoFieldsData[1][0].modificable = 'Y';
                    this.pageTwoFieldsData[2][0].modificable = 'Y';
                }
                else {
                    this.pageTwoFieldsData[1][0].modificable = 'N';
                    this.pageTwoFieldsData[2][0].modificable = 'N';
                }
            },
            computeAmt(val, field) {
                let ls_ruleVal = field.format_func_name.rule_val;
                let lb_isModify = true;
                let ls_creditAmt = _.isUndefined(this.singleData['cust_idx_credit_amt']) ?
                    "" : go_formatDisplayClass.removeAmtFormat(this.singleData['cust_idx_credit_amt'].toString());
                let ls_arAmt = _.isUndefined(this.singleData['cust_idx_ar_amt']) ?
                    "" : go_formatDisplayClass.removeAmtFormat(this.singleData['cust_idx_ar_amt'].toString());
                let ln_balance = 0;

                for (let i = 0; i < ls_creditAmt.length; i++) {
                    if (ls_creditAmt.charCodeAt(i) < 48 || ls_creditAmt.charCodeAt(i) > 57) {
                        lb_isModify = false;
                        break;
                    }
                }
                for (let i = 0; i < ls_arAmt.length; i++) {
                    if (ls_arAmt.charCodeAt(i) < 48 || ls_arAmt.charCodeAt(i) > 57) {
                        lb_isModify = false;
                        break;
                    }
                }

                if (lb_isModify) {
                    ln_balance = Number(ls_creditAmt) - Number(ls_arAmt);

                    this.singleData["cust_idx_credit_amt"] = go_formatDisplayClass.amtFormat(ls_creditAmt, ls_ruleVal);
                    this.singleData["cust_idx_ar_amt"] = go_formatDisplayClass.amtFormat(ls_arAmt, ls_ruleVal);
                    this.singleData['balance'] = go_formatDisplayClass.amtFormat(ln_balance, ls_ruleVal);
                }
                else {
                    this.singleData["cust_idx_credit_amt"] = 0;
                    this.singleData["cust_idx_ar_amt"] = 0;
                    this.singleData['balance'] = 0;
                }
            },
            //信用額度變更
            async doChangeCreditLimit() {
                if (this.oriPageTwoFieldsData.length <= 0) {
                    await $.post("/api/fetchOnlySinglePageFieldData", {
                        prg_id: "PMS0610020",
                        page_id: 2,
                        tab_page_id: 1030
                    }).then(result => {
                        this.oriPageTwoFieldsData = result.gsFieldsData;
                        this.pageTwoFieldsData = _.values(_.groupBy(_.sortBy(result.gsFieldsData, "col_seq"), "row_seq"));
                        this.pageTwoFieldsData[1][0].modificable = this.singleData.cust_idx_credit_sta ? 'Y' : 'N';
                        this.pageTwoFieldsData[2][0].modificable = this.singleData.cust_idx_credit_sta ? 'Y' : 'N';
                    });
                }

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
            },
        }
    }

    var go_rtnResult = [];

    function findByValue(obj, id) {
        var result;
        for (var p in obj) {
            if (obj.value === id) {
                return obj;
            }
            if (typeof obj[p] === 'object') {
                result = findByValue(obj[p], id);

                if (result) {
                    go_rtnResult = [];
                    go_rtnResult.push(obj[p]);
                    return result;
                }
            }

        }
        return result;
    }

    function flattenArray(array, la_list) {
        _.each(array, function (object) {
            if (!_.isUndefined(object.children)) {
                la_list.push(object);
                flattenArray(object.children, la_list);
            }
            else {
                la_list.push(object);
                return;
            }
        });
    }


</script>