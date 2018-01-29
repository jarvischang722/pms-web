<template>
    <div id="PMS0610020" class="hide padding-5" style="top: 0 !important; z-index: 1">
        <div class="businessCompanyData" v-loading="isLoadingDialog" :element-loading-text="loadingText">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right">
                            <!-------- 單筆 -------->
                            <div class="main-content-data borderFrame">
                                <div v-for="fields in fieldsData">
                                    <div class="grid">
                                        <div class="grid-item" v-for="field in fields">
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

                                            <bac-select v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                        :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                        v-model="singleData[field.ui_field_name]" :data="field.selectData"
                                                        is-qry-src-before="Y" value-field="value" text-field="display"
                                                        @update:v-model="val => singleData[field.ui_field_name] = val"
                                                        :default-val="singleData[field.ui_field_name]"
                                                        :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                            </bac-select>

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
                            </div><!--main-content-data-->
                            <div class="clearfix"></div>
                            <div class="space-6"></div>
                            <!--------/.單筆 -------->
                            <!-------- tabPage -------->
                            <el-tabs v-model="tabName" type="card" @tab_click="doChangeTab">
                                <el-tab-pane :label="i18nLang.program.PMS0610020.related_set" name="set">
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0610020.related_personnel" name="personnel">
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0610020.sales" name="sales">
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0610020.contract_content" name="contract">
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0610020.visit_record" name="visit">
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0610020.other_remark" name="remark">
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0610020.historical_consumption" name="historical">
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0610020.contribution" name="contribution" disabled>
                                </el-tab-pane>
                            </el-tabs>
                            <div class="easyui-tabs easyUi-custom1 borderFrame"
                                 style="min-height: 0; height: 380px !important; overflow-y: auto;">
                                <div id="setPanel" v-show="tabName=='set'" class="padding-tabs">
                                    <related-setting
                                            :rowData="rowData"
                                            :is-related-setting="tabStatus.isSet"
                                    ></related-setting>
                                </div>
                                <div id="personnelPanel" v-show="tabName=='personnel'" class="padding-tabs">
                                    <related-personnel
                                            :rowData="rowData"
                                            :is-related-personnel="tabStatus.isPersonnel"
                                    ></related-personnel>
                                </div>
                                <div id="salesPanel" v-show="tabName=='sales'" class="padding-tabs">
                                    <sales-clerk
                                            :row-data="rowData"
                                            :is-sales-clerk="tabStatus.isSales"
                                            :is-create-status="isCreateStatus"
                                            :is-edit-status="isEditStatus"
                                    ></sales-clerk>
                                </div>
                                <div id="contractPanel" v-show="tabName=='contract'" class="padding-tabs">
                                    <contract-content
                                            :row-data="rowData"
                                            :is-contract-content="tabStatus.isContract"
                                    ></contract-content>
                                </div>
                                <div id="visitPanel" v-show="tabName=='visit'" class="padding-tabs">
                                    <company-visit-record
                                            :row-data="rowData"
                                            :is-visit-record="tabStatus.isVisit"
                                    ></company-visit-record>
                                </div>
                                <div id="remarkPanel" v-show="tabName=='remark'" class="padding-tabs">
                                    <other-remark
                                            :row-data="rowData"
                                            :is-other-remark="tabStatus.isRemark"
                                    ></other-remark>
                                </div>
                                <div id="historicalPanel" v-show="tabName=='historical'" class="padding-tabs">
                                    <historical-consumption
                                            :row-data="rowData"
                                            :is-historical-consumption="tabStatus.isHistorical"
                                    ></historical-consumption>
                                </div>
                                <div id="contributionPanel" v-show="tabName=='contribution'" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <div class="col-xs-11 col-sm-11">
                                                <div class="row no-margin-right">
                                                    <div class="col-xs-6 col-sm-6">
                                                        <div class="bs-contribution-content">
                                                            <div class="billInfo grid">
                                                                <div class="col-xs-12 col-sm-12">
                                                                    <div class="row billInfo-head">
                                                                        <p class="billInfo-title">交易資訊</p>
                                                                    </div>
                                                                </div>
                                                                <div class="content">
                                                                    <div class="grid">
                                                                        <div class="tab-block">
                                                                            <label>首次交易日</label>
                                                                            <span>：</span>
                                                                            <span class="tab-block-content">2016/3/4</span>
                                                                        </div>
                                                                        <div class="tab-block">
                                                                            <label>最近交易日</label>
                                                                            <span>：</span>
                                                                            <span class="tab-block-content">2016/4/15</span>
                                                                        </div>
                                                                        <div class="tab-block">
                                                                            <label>本月用房數</label>
                                                                            <span>：</span>
                                                                            <span class="tab-block-content">5</span>
                                                                        </div>
                                                                        <div class="tab-block">
                                                                            <label>本月房租消費</label>
                                                                            <span>：</span>
                                                                            <span class="tab-block-content">2350</span>
                                                                        </div>
                                                                        <div class="tab-block">
                                                                            <label>本月餐飲消費</label>
                                                                            <span>：</span>
                                                                            <span class="tab-block-content">750</span>
                                                                        </div>
                                                                        <div class="tab-block">
                                                                            <label>本月其他消費</label>
                                                                            <span>：</span>
                                                                            <span class="tab-block-content">0</span>
                                                                        </div>
                                                                        <div class="tab-block">
                                                                            <label>本月消費合計</label>
                                                                            <span>：</span>
                                                                            <span class="tab-block-content">3100</span>
                                                                        </div>
                                                                        <div class="tab-block">
                                                                            <label>本月平均房價</label>
                                                                            <span>：</span>
                                                                            <span class="tab-block-content">2350</span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="col-xs-6 col-sm-6">
                                                        <div class="row">
                                                            <!-- 貢獻度 dataGrid -->
                                                            <table id="contribution-table"
                                                                   style="height: 310px;"></table>
                                                        </div>
                                                    </div>

                                                    <div class="clearfix"></div>
                                                </div>
                                            </div>
                                            <div class="col-xs-1 col-sm-1">
                                                <div class="row">
                                                    <div class="right-menu-co">
                                                        <ul>
                                                            <li>
                                                                <button class="btn btn-primary btn-white btn-defaultWidth sales_displayMonth"
                                                                        role="button">顯示月份明細
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
                            <!--------/. tabPage -------->
                        </div>
                    </div>
                    <!--按鈕-->
                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doSaveGrid">{{i18nLang.SystemCommon.Save}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doCloseDialog">{{i18nLang.SystemCommon.Leave}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-gray btn-defaultWidth"
                                                role="button">{{i18nLang.program.PMS0610020.company_related_diagram}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth sales_statusChg"
                                                role="button" :disabled="isCreateStatus" @click="doSetCompanyStatus">
                                            {{i18nLang.program.PMS0610020.company_status}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth sales_stateChange"
                                                role="button" :disabled="isCreateStatus" @click="doSetContractStatus">
                                            {{i18nLang.program.PMS0610020.contract_status}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth sales_changeRecord"
                                                role="button" :disabled="isOpenChangeLog" @click="loadChangeLog">
                                            {{i18nLang.SystemCommon.ChangeLog}}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--/.按鈕-->

                </div>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>
    import _s from 'underscore.string';
    import relatedSetting from './companyRelatedSetting.vue';
    import relatedPersonnel from './companyRelatedPersonnel.vue';
    import salesClerk from './companySalesClerk.vue';
    import contractContent from './companyContract.vue';
    import companyVisitRecord from './companyVisitRecord.vue';
    import otherRemark from './companyRemark.vue';
    import historicalConsumption from './companyHistoricalConsumption.vue';

    export default {
        name: 'pms0610020',
        props: ["rowData", "isCreateStatus", "isEditStatus", "isModifiable"],
        components: {
            relatedSetting,
            relatedPersonnel,
            salesClerk,
            contractContent,
            companyVisitRecord,
            otherRemark,
            historicalConsumption
        },
        created() {
            var self = this;
            this.$eventHub.$on('setTabName', function (tabNameData) {
                self.tabName = tabNameData.tabName;
            });
            this.$eventHub.$on('getCloseChangeLogData', function (closeChangeLogData) {
                self.isOpenChangeLog = closeChangeLogData.isOpenChangeLog;
            });
            //取得相關設定資料
            this.$eventHub.$on('getRelatedSettingData', function (relatedSettingData) {
                self.relatedSettingSingleData = relatedSettingData.relatedSettingSingleData;
                self.relatedSettingOriSingleData = relatedSettingData.relatedSettingOriSingleData;
            });
            //業務員指派
            this.$eventHub.$on('doEditSalesClerk', function (result) {
                if (result.success) {
                    self.fetchFieldData();
                }
            });
            //取得商務公司狀態資料
            this.$eventHub.$on('compStateData', function (compStateData) {
                self.singleData = _.extend(self.singleData, compStateData.singleData);
            });
            //取得合約狀態資料
            this.$eventHub.$on('contractStateData', function (contractStateData) {
                self.singleData = _.extend(self.singleData, contractStateData.singleData);
            });

        },
        mounted() {
            this.panelName = ["setPanel", "personnelPanel", "salesPanel", "contractPanel",
                "visitPanel", "remarkPanel", "historicalPanel", "contributionPanel"];
            this.isLoadingDialog = true;
            this.loadingText = "Loading...";
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                BTN_action: false,
                isLoadingDialog: false,
                loadingText: "",
                isOpenChangeLog: false,
                isOpenCompanyStatus: false,
                isOpenContractStatus: false,
                singleData: {},
                oriSingleData: {},
                relatedSettingSingleData: {},
                relatedSettingOriSingleData: {},
                fieldsData: [],
                oriFieldsData: [],
                tabPageId: 1,
                tabName: "",
                panelName: [],
                tabStatus: {
                    isSet: false,
                    isPersonnel: false,
                    isSales: false,
                    isContract: false,
                    isVisit: false,
                    isRemark: false,
                    isHistorical: false,
                    isContribution: false
                }
            };
        },
        watch: {
            tabName(val) {
                this.setTabStatus(val);
            },
            rowData(val) {
                if (!_.isEmpty(val)) {
                    this.initData();
                    this.fetchFieldData();
                }
            },
            singleData: {
                handler: function (val) {
                    //將主檔資料放至Vuex
                    this.$store.dispatch("setMnSingleData", {
                        go_mnSingleData: val,
                        go_mnOriSingleData: this.oriSingleData
                    });
                    //自動將郵遞區號對應之地址資料帶至地址欄位
                    var lo_singleData = JSON.parse(JSON.stringify(val));
                    lo_singleData.cust_idx_zip_cod =
                        _.isUndefined(lo_singleData.cust_idx_zip_cod) || _.isNull(lo_singleData.cust_idx_zip_cod)? "" : lo_singleData.cust_idx_zip_cod;
                    if (lo_singleData.cust_idx_zip_cod != "" && (lo_singleData.cust_idx_add_rmk == "" || _.isNull(lo_singleData.cust_idx_add_rmk) ) ){
                        var ln_zipCodIdx = _.findIndex(this.oriFieldsData, {ui_field_name: 'cust_idx_zip_cod'})
                        var ln_zipNamIdx = _.findIndex(this.oriFieldsData[ln_zipCodIdx].selectData, {value: lo_singleData.cust_idx_zip_cod})
                        this.singleData.cust_idx_add_rmk = this.oriFieldsData[ln_zipCodIdx].selectData[ln_zipNamIdx].display.split(":")[1];
                    }
                },
                deep: true
            }
        },
        methods: {
            initData() {
                this.singleData = {};
                this.oriSingleData = {};
                this.fieldsData = [];
                this.oriFieldsData = [];
                this.setGlobalStatus();
            },
            setGlobalStatus() {
                this.$store.dispatch("setStatus", {
                    gb_isCreateStatus: this.isCreateStatus,
                    gb_isEditStatus: this.isEditStatus
                });
            },
            setGlobalCustCod() {
                this.$store.dispatch("setCustCod", this.singleData.cust_mn_cust_cod);
            },
            setTabStatus(tabName) {
                var self = this;

                _.each(this.tabStatus, function (val, key) {
                    self.tabStatus[key] = false;
                });

                var ls_tabNae = _s.capitalize(tabName);
                this.tabStatus["is" + ls_tabNae] = true;

                this.showTabContent(tabName);
            },
            showTabContent(tabName) {
                var la_panelName = this.panelName;
                var ls_showPanelName = tabName + "Panel";
                _.each(la_panelName, function (ls_panelName) {
                    $("#" + ls_panelName).hide();
                });

                $("#" + ls_showPanelName).show();
            },
            fetchFieldData() {
                this.isLoadingDialog = true;
                var self = this;
                $.post("/api/fetchOnlySinglePageFieldData", {
                    prg_id: "PMS0610020",
                    page_id: 1,
                    tab_page_id: 1,
                    template_id: 'gridsingle'
                }, function (result) {
                    self.oriFieldsData = result.gsFieldsData;
                    self.fieldsData = _.values(_.groupBy(_.sortBy(self.oriFieldsData, "col_seq"), "row_seq"));
                    self.fetchRowData();
                });
            },
            fetchRowData() {
                var self = this;
                if (this.isCreateStatus) {
                    $.post("/api/fetchDefaultSingleRowData", {
                        prg_id: "PMS0610020",
                        page_id: 1,
                        tab_page_id: 1
                    }).then(result => {
                        this.singleData = result.gsDefaultData;
                        this.oriSingleData = JSON.parse(JSON.stringify(result.gsDefaultData));
                        this.isLoadingDialog = false;
                        this.setGlobalCustCod();
                        this.tabName = "set";
                    });
                }
                else if (this.isEditStatus) {
                    $.post("/api/fetchSinglePageFieldData", {
                        prg_id: "PMS0610020",
                        page_id: 1,
                        tab_page_id: 1,
                        template_id: "gridsingle",
                        searchCond: {cust_cod: this.rowData.cust_mn_cust_cod}
                    }).then(result => {
                        this.singleData = result.gsMnData.rowData[0];
                        this.oriSingleData = JSON.parse(JSON.stringify(result.gsMnData.rowData[0]));
                        this.isLoadingDialog = false;
                        this.setGlobalCustCod();
                        this.tabName = "set";
                    });
                }
            },
            doSaveGrid() {
                this.isLoadingDialog = true;
                this.loadingText = "saving";
                this.$store.dispatch("doSaveAllData").then(result=>{
                    if(result.success){
                        alert("save success");
                        $("#PMS0610020").dialog('close');
                        // this.doCloseDialog();
                    }
                    else{
                        alert(result.errorMsg);
                    }
                    this.isLoadingDialog = false;
                })
            },
            doCloseDialog() {
                this.initData();
                this.rowData = {};
                $("#PMS0610020").dialog('close');
            },
            //ststus chg.(公司狀態)
            doSetCompanyStatus() {
                var self = this;
                if (this.isEditStatus) {
                    this.$store.dispatch("qryAllDataIsChange").then(result =>{
                        if(result.success){
                            if(!result.isChange){
                                this.isOpenCompanyStatus = true;
                                this.$eventHub.$emit('getCompanyStatusData', {
                                    openCompanyStatus: self.isOpenCompanyStatus
                                });
                            }
                            else {
                                alert("請先儲存主檔資料及相關資料");
                            }
                        }
                    });
                }
            },
            //合約狀態變更
            doSetContractStatus() {
                var self = this;
                var la_contractStaFieldData = JSON.parse(JSON.stringify(_.findWhere(self.oriFieldsData, {ui_field_name: "cust_mn_contract_sta"})));
                la_contractStaFieldData.modificable = 'Y';
                if (this.isEditStatus) {
                    this.$store.dispatch("qryAllDataIsChange").then(result =>{
                        if(result.success){
                            if(!result.isChange){
                                this.isOpenContractStatus = true;
                                this.$eventHub.$emit('getContractStatusData', {
                                    openContractStatus: self.isOpenContractStatus,
                                    singleData: JSON.parse(JSON.stringify(self.singleData)),
                                    fieldData: la_contractStaFieldData
                                });
                            }
                            else {
                                alert("請先儲存主檔資料及相關資料");
                            }
                        }
                    });
                }
            },
            //異動紀錄(change log)
            loadChangeLog() {
                var self = this;
                this.isOpenChangeLog = true;
                $.post("/api/getSetupPrgChangeLog", {prg_id: "PMS0610020"}, function (result) {
                    if (result.success) {
                        self.$eventHub.$emit('getChangeLogData', {
                            openChangeLogDialog: self.isOpenChangeLog,
                            allChangeLogList: result.allChangeLogList
                        });
                    }
                });
            }
        }
    }
</script>