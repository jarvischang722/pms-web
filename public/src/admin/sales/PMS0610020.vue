<template>
    <div id="PMS0610020" class="hide padding-5" style="top: 0 !important; z-index: 1">
        <div class="businessCompanyData">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right">
                            <!-------- 單筆 -------->
                            <div class="main-content-data borderFrame">
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>公司編號</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="23598233"/>
                                    </div>

                                    <div class="grid-item">
                                        <label>合約狀態</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="已簽約" disabled/>
                                    </div>
                                    <div class="grid-item">
                                        <label>狀態</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="正常" disabled/>
                                    </div>
                                </div>
                                <!--<div class="space-custom-5"></div>-->

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>負責人</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="黃先生"/>
                                    </div>
                                    <div class="grid-item">
                                        <label>公司名稱</label>
                                        <input type="text" class="input-medium medium-c1-col2v2"
                                               placeholder="德安資訊國際股份有限公司台北分公司"/>
                                    </div>
                                </div>

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>統一編號</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="2358233"/>
                                    </div>
                                    <div class="grid-item">
                                        <label>發票抬頭</label>
                                        <input type="text" class="input-medium medium-c1-col2v2"
                                               placeholder="德安資訊國際股份有限公司台北分公司"/>
                                    </div>
                                </div>

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>業務員</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="陳瑞克" disabled/>
                                    </div>
                                    <div class="grid-item">
                                        <label>總公司</label>
                                        <input type="text" class="input-medium medium-c1-col2v2"
                                               placeholder="23598231 德安資訊國際股份有限公司"/>
                                        <!--<span class="mainData-tip">(顯示公司編號:公司名稱)</span>-->
                                    </div>
                                </div>

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>公司電話</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="02-21766066"/>
                                    </div>
                                    <div class="grid-item">
                                        <label>分帳規則</label>
                                        <select class="input-medium medium-c1">
                                            <option value="1">01:團體</option>
                                            <option value="2">02:個人</option>
                                        </select>
                                    </div>
                                    <div class="grid-item">
                                        <label>等級</label>
                                        <select class="input-medium medium-c1">
                                            <option value="0">0</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                        </select>
                                    </div>
                                </div>

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>傳真電話</label>
                                        <input type="text" class="input-medium medium-c1" placeholder="02-25170886"/>
                                    </div>
                                    <div class="grid-item">
                                        <label>地址</label>
                                        <input type="text" class="input-medium postalCode"
                                               placeholder="10411"/>
                                        <input type="text" class="input-medium postaladdress ml-2"
                                               placeholder="台北市松江路309號8樓"/>
                                        <i class="moreClick fa fa-ellipsis-h sales_addressMore btn-skin"></i>
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
                                                role="button" @click="doSetCompanyStatus">
                                            {{i18nLang.program.PMS0610020.company_status}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth sales_stateChange"
                                                role="button" @click="doSetContractStatus">
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
            this.$eventHub.$on('getCloseChangeLogData', function (closeChangeLogData) {
                self.isOpenChangeLog = closeChangeLogData.isOpenChangeLog;
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
                this.showTabContent(val);
            },
            rowData(val) {
                if (!_.isEmpty(val)) {
                    this.initData();
                    this.fetchFieldData(val);
                }
            }
        },
        methods: {
            initData() {
                this.tabName = "set";
                this.singleData = {};
                this.oriSingleData = {};
                this.fieldsData = [];
                this.oriFieldsData = [];
            },
            setTabStatus(tabName) {
                var self = this;

                _.each(this.tabStatus, function (val, key) {
                    self.tabStatus[key] = false;
                });

                var ls_tabNae = _s.capitalize(tabName);
                this.tabStatus["is" + ls_tabNae] = true;
            },
            showTabContent(tabName) {
                var la_panelName = this.panelName;
                var ls_showPanelName = tabName + "Panel";
                _.each(la_panelName, function (ls_panelName) {
                    $("#" + ls_panelName).hide();
                });

                $("#" + ls_showPanelName).show();

                // this.showDtDataGrid();
            },
            fetchFieldData(val) {
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
                    console.log(self.fieldsData);
                });
            },
            fetchRowData() {
                var self = this;
                console.log(this.isCreateStatus);
                if (this.isCreateStatus) {
                    $.post("/api/fetchDefaultSingleRowData", {
                        prg_id: "PMS0610020",
                        page_id: 1,
                        tab_page_id: 1
                    }, function (result) {
                        console.log(result);
                    });
                }
            },
            doSaveGrid() {
            },
            doCloseDialog() {
                this.initData();
                this.rowData = {};
                $("#PMS0610020").dialog('close');
            },
            //ststus chg.(公司狀態)
            doSetCompanyStatus() {
                var self = this;
                this.isOpenCompanyStatus = true;
                this.$eventHub.$emit('getCompanyStatusData', {
                    openCompanyStatus: self.isOpenCompanyStatus
                });
            },
            //合約狀態變更
            doSetContractStatus() {
                var self = this;
                this.isOpenContractStatus = true;
                this.$eventHub.$emit('getContractStatusData', {
                    openContractStatus: self.isOpenContractStatus
                });
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