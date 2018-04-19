<template>
    <div id="visitRecord" class="hide padding-5">
        <div class="businessCompanyData">
            <div class="col-sm-12 col-xs-12" v-loading="isLoadingDialog" :element-loading-text="loadingText">
                <div class="row">
                    <!--單筆 拜訪紀錄-->
                    <div class="col-sm-10 col-xs-10">
                        <div class="row no-margin-right">
                            <div class="main-content-data borderFrame">
                                <div v-for="fields in fieldsData">
                                    <div class="grid">
                                        <div class="grid-item" v-for="field in fields">
                                            <label v-if="field.visiable == 'Y' && field.ui_type != 'checkbox'">
                                                <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                                <span>{{ field.ui_display_name }}</span>
                                            </label>

                                            <input type="text" v-model="singleData[field.ui_field_name]"
                                                   v-if="field.visiable == 'Y' &&  field.ui_type == 'text'"
                                                   :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                   :class="{'input_sta_required' : field.requirable == 'Y', 'text-right' : field.ui_type == 'number'}"
                                                   :required="field.requirable == 'Y'" min="0"
                                                   :maxlength="field.ui_field_length"
                                                   :disabled="field.modificable == 'N'|| (field.modificable == 'I') || (field.modificable == 'E')">

                                            <!--number 金額顯示format-->
                                            <input type="text" v-model="singleData[field.ui_field_name]"
                                                   v-if="field.visiable == 'Y' && field.ui_type == 'number'"
                                                   :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                   :class="{'input_sta_required' : field.requirable == 'Y', 'text-right' : field.ui_type == 'number'}"
                                                   @keyup="formatAmt(singleData[field.ui_field_name], field)">

                                            <!-- 日期選擇器 -->
                                            <el-date-picker v-if="field.visiable == 'Y' && field.ui_type == 'date'"
                                                            v-model="singleData[field.ui_field_name]"
                                                            type="date" size="small"
                                                            :disabled="field.modificable == 'N' || (field.modificable == 'I') || (field.modificable == 'E')"
                                                            format="yyyy/MM/dd"
                                                            :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                            @change="chkFieldRule(field.ui_field_name,field.rule_func_name)">
                                            </el-date-picker>

                                            <!-- 日期時間選擇器 -->
                                            <el-date-picker v-if="field.visiable == 'Y' && field.ui_type == 'datetime'"
                                                            v-model="singleData[field.ui_field_name]" type="datetime"
                                                            change="chkFieldRule(field.ui_field_name,field.rule_func_name)"
                                                            :disabled="field.modificable == 'N'|| (field.modificable == 'I') || (field.modificable == 'E')"
                                                            size="small" format="yyyy/MM/dd HH:mm:ss"
                                                            :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                            @change="chkFieldRule(field.ui_field_name,field.rule_func_name)">
                                            </el-date-picker>


                                            <!--  textarea -->
                                            <textarea v-if="field.visiable == 'Y' && field.ui_type == 'textarea'"
                                                      v-model="singleData[field.ui_field_name]"
                                                      class="numStyle-none" rows="4"
                                                      :style="{width:field.width + 'px'}" style="resize: none;"
                                                      :required="field.requirable == 'Y'"
                                                      :maxlength="field.ui_field_length"
                                                      :disabled="field.modificable == 'N'|| (field.modificable == 'I') || (field.modificable == 'E')"
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
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>
                    <!--/.單筆 拜訪紀錄-->
                    <!--按鈕-->
                    <div class="col-sm-2 col-xs-2">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                                :disabled="BTN_action || isFirstData" v-if="isEditStatus"
                                                @click="toFirstData">
                                            {{i18nLang.SystemCommon.First}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                                :disabled="BTN_action || isFirstData" v-if="isEditStatus"
                                                @click="toPreData">
                                            {{i18nLang.SystemCommon.Previous}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                                :disabled="BTN_action || isLastData" v-if="isEditStatus"
                                                @click="toNextData">
                                            {{i18nLang.SystemCommon.Next}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                                :disabled="BTN_action || isLastData" v-if="isEditStatus"
                                                @click="toLastData">
                                            {{i18nLang.SystemCommon.Last}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth" role="button"
                                                @click="doCloseDialog">
                                            {{i18nLang.SystemCommon.Leave}}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--/.按鈕-->
                </div>
            </div>
        </div>
        <div class="clearfix"></div>
    </div>
</template>

<script>
    export default {
        name: 'visit-record',
        props: ["rowData", "pageOneDataGridRows", "isSingleVisitRecord", "isCreateStatus", "isEditStatus"],
        data() {
            return {
                i18nLang: go_i18nLang,
                isFirstData: false,
                isLastData: false,
                BTN_action: false,
                isLoadingDialog: false,
                loadingText: "",
                tmpCUD: {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                },
                singleData: {},
                oriSingleData: {},
                fieldsData: [],
                oriFieldsData: []
            };
        },
        mounted() {
            this.isLoadingDialog = true;
            this.loadingText = "Loading...";
        },
        watch: {
            isSingleVisitRecord(val) {
                if (val) {
                    this.initData();
                    this.fetchFieldData();
                }
            },
            rowData(val) {
                if (!_.isEmpty(val)) {
                    this.fetchFieldData();

                    var nowDatagridRowIndex = $("#companyVisitRecord_dg").datagrid('getRowIndex', val);

                    $("#companyVisitRecord_dg").datagrid('selectRow', nowDatagridRowIndex);

                    if ($("#companyVisitRecord_dg").datagrid('getRowIndex', val) == 0) {
                        //已經到第一筆
                        this.isFirstData = true;
                        this.isLastData = false;
                        if ($("#companyVisitRecord_dg").datagrid('getRowIndex', val) == this.pageOneDataGridRows.length - 1) {
                            this.isLastData = true;
                        }

                    }
                    else if ($("#companyVisitRecord_dg").datagrid('getRowIndex', val) == this.pageOneDataGridRows.length - 1) {
                        //已經到最後一筆
                        this.isFirstData = false;
                        this.isLastData = true;
                    }
                    else {
                        this.isFirstData = false;
                        this.isLastData = false;
                    }
                }
            },
            singleData: {
                handler: function (val) {
                    if (!_.isEmpty(val)) {
                        var self = this;
                        this.$eventHub.$emit("getVisitRecordSingleData", {
                            singleData: val,
                            oriSingleData: this.oriSingleData,
                            fieldsData: this.oriFieldsData
                        });
                    }
                },
                deep: true
            }
        },
        methods: {
            initTmpCUD() {
                this.tmpCUD = {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                }
            },
            initData() {
                this.singleData = {};
                this.oriSingleData = {};
                this.fieldsData = [];
                this.oriFieldsData = [];
            },
            fetchFieldData() {
                this.isLoadingDialog = true;
                $.post("/api/fetchOnlySinglePageFieldData", {
                    prg_id: "PMS0610020",
                    page_id: 2,
                    tab_page_id: 1100
                }).then(result => {
                    this.fieldsData = _.values(_.groupBy(_.sortBy(result.gsFieldsData, "col_seq"), "row_seq"));
                    this.oriFieldsData = JSON.parse(JSON.stringify(result.gsFieldsData));
                    this.fetchRowData();
                });
            },
            fetchRowData() {
                this.singleData = JSON.parse(JSON.stringify(this.rowData));
                this.oriSingleData = JSON.parse(JSON.stringify(this.singleData));
                this.isLoadingDialog = false;
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
            formatAmt(val, field) {
                let ls_amtValue = go_formatDisplayClass.removeAmtFormat(JSON.parse(JSON.stringify(val)).toString());
                let ls_ruleVal = field.format_func_name.rule_val;
                let lb_isModify = true;
                let la_amtValue = ls_amtValue.split("");

                if (la_amtValue.length == 0) {
                    return;
                }
                for (let i = 0; i < la_amtValue.length; i++) {
                    if (ls_amtValue.charCodeAt(i) < 48 || ls_amtValue.charCodeAt(i) > 57) {
                        lb_isModify = false;
                        break;
                    }
                }

                if(lb_isModify){
                    if (ls_ruleVal != "") {
                        this.singleData[field.ui_field_name] = go_formatDisplayClass.amtFormat(ls_amtValue, ls_ruleVal);
                    }
                    else {
                        this.singleData[field.ui_field_name] = ls_amtValue;
                    }
                }
                else{
                    this.singleData[field.ui_field_name] = 0;
                }
            },
            toFirstData() {
                this.isFirstData = true;
                this.isLastData = false;
                this.rowData = _.first(this.pageOneDataGridRows);
                $("#visitRecord").dialog('close');
                this.$eventHub.$emit("getOtherRowData", {
                    rowData: _.first(this.pageOneDataGridRows),
                    rowIndex: 0
                });
            },
            toPreData() {
                var nowRowIndex = $("#companyVisitRecord_dg").datagrid('getRowIndex', this.rowData);
                this.rowData = this.pageOneDataGridRows[nowRowIndex - 1];
                $("#visitRecord").dialog('close');
                this.$eventHub.$emit("getOtherRowData", {
                    rowData: this.pageOneDataGridRows[nowRowIndex - 1],
                    rowIndex: nowRowIndex - 1
                });
            },
            toNextData() {
                var nowRowIndex = $("#companyVisitRecord_dg").datagrid('getRowIndex', this.rowData);
                this.rowData = this.pageOneDataGridRows[nowRowIndex + 1];
                $("#visitRecord").dialog('close');
                this.$eventHub.$emit("getOtherRowData", {
                    rowData: this.pageOneDataGridRows[nowRowIndex + 1],
                    rowIndex: nowRowIndex + 1
                });
            },
            toLastData() {
                this.isFirstData = false;
                this.isLastData = true;
                this.rowData = _.last(this.pageOneDataGridRows);
                $("#visitRecord").dialog('close');
                this.$eventHub.$emit("getOtherRowData", {
                    rowData: _.last(this.pageOneDataGridRows),
                    rowIndex: this.pageOneDataGridRows.length - 1
                });
            },
            doCloseDialog() {
                this.initData();
                this.rowData = {};
                $("#visitRecord").dialog('close');
            }
        }
    }
</script>