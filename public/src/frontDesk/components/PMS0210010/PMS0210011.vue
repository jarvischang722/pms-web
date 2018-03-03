<template>
    <div id="PMS0210011" class="hide padding-5" style="top: 0 !important;">
        <div class="businessCompanyData" v-loading="isLoadingDialog" :element-loading-text="loadingText">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <!--tab pages-->
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right">
                            <!-------- tabPage -------->
                            <el-tabs v-model="tabName" type="card">
                                <el-tab-pane :label="i18nLang.program.PMS0210011.Profile" name="profile">
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0210011.Visits" name="visits">
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0210011.Reference" name="reference" disabled>
                                </el-tab-pane>
                            </el-tabs>
                            <div class="easyui-tabs borderFrame" style="min-height: 0;">
                                <div id="profilePanel" v-show="tabName=='profile'" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <!--content-col-4-->
                                            <div class="main-content-data">
                                                <div class="grid" v-for="fields in profileFieldData">
                                                    <div class="grid-item" v-for="field in fields">
                                                        <label v-if="field.visiable == 'Y' && field.ui_type != 'checkbox'"
                                                               :style="{width:field.label_width + 'px' , height:field.height + 'px'}">
                                                            <span v-if=" field.requirable == 'Y' "
                                                                  style="color: red;">*</span>
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

                                                        <bac-select
                                                                v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                                :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                v-model="singleData[field.ui_field_name]"
                                                                :data="field.selectData"
                                                                is-qry-src-before="Y" value-field="value"
                                                                text-field="display"
                                                                @update:v-model="val => singleData[field.ui_field_name] = val"
                                                                :default-val="singleData[field.ui_field_name] || field.defaultVal"
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

                                                        <input type="text" v-model="singleData[field.ui_field_name]"
                                                               v-if="field.visiable == 'Y' && field.ui_type == 'number'"
                                                               :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                               :class="{'input_sta_required' : field.requirable == 'Y', 'text-right' : field.ui_type == 'number'}"
                                                               :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">

                                                        <!-- 日期時間選擇器 -->
                                                        <el-date-picker
                                                                v-if="field.visiable == 'Y' && field.ui_type == 'date'"
                                                                v-model="singleData[field.ui_field_name]"
                                                                type="datetime"
                                                                change="chkFieldRule(field.ui_field_name,field.rule_func_name)"
                                                                :disabled="field.modificable == 'N'||
                                                    (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                                                size="small" format="yyyy/MM/dd HH:mm:ss"
                                                                :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                @change="chkFieldRule(field.ui_field_name,field.rule_func_name)">
                                                        </el-date-picker>

                                                        <!-- 日期時間選擇器 -->

                                                        <el-date-picker
                                                                v-if="field.visiable == 'Y' && field.ui_type == 'datetime'"
                                                                v-model="singleData[field.ui_field_name]"
                                                                type="date"
                                                                size="small"
                                                                :disabled="field.modificable == 'N'||
                                                    (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                                                format="yyyy/MM/dd"
                                                                :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                @change="chkFieldRule(field.ui_field_name,field.rule_func_name)">
                                                        </el-date-picker>

                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                                <div id="visitsPanel" v-show="tabName=='visits'" class="">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <div class="reserveShopInfo">
                                                <visits-panel
                                                        :row-data="rowData"
                                                        :is-visits-panel="tabName=='visits'"
                                                ></visits-panel>
                                            </div>
                                            <div class="clearfix"></div>

                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                                <div id="referencePanel" v-show="tabName=='reference'" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <div class="css_table">
                                                <div class="css_thead">
                                                    <div class="css_tr center">
                                                        <div class="css_th width-20">Group</div>
                                                        <div class="css_th width-10">Alert</div>
                                                        <div class="css_th width-70">Description</div>
                                                    </div>
                                                </div>
                                                <div class="css_tbody">
                                                    <div class="css_tr">
                                                        <div class="css_td">Food</div>
                                                        <div class="css_td center">
                                                            <div class="popCheckbox">
                                                                <span class="checkbox">
                                                                      <label class="checkbox-width">
                                                                          <input name="form-field-checkbox"
                                                                                 type="checkbox"
                                                                                 class="ace" checked>
                                                                          <span class="lbl">
                                                                            <span class="txt"></span>
                                                                          </span>
                                                                      </label>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="css_td">
                                                            <i class="moreClick fa fa-ellipsis-h"></i>
                                                        </div>
                                                    </div>
                                                    <div class="css_tr">
                                                        <div class="css_td">Drink</div>
                                                        <div class="css_td center">
                                                            <div class="popCheckbox">
                                                                <span class="checkbox">
                                                                      <label class="checkbox-width">
                                                                          <input name="form-field-checkbox"
                                                                                 type="checkbox"
                                                                                 class="ace"
                                                                                 checked>
                                                                          <span class="lbl">
                                                                            <span class="txt"></span>
                                                                          </span>
                                                                      </label>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="css_td">
                                                            <i class="moreClick fa fa-ellipsis-h"></i>
                                                        </div>
                                                    </div>
                                                    <div class="css_tr">
                                                        <div class="css_td">Hobby</div>
                                                        <div class="css_td center">
                                                            <div class="popCheckbox">
                                                                <span class="checkbox">
                                                                      <label class="checkbox-width">
                                                                          <input name="form-field-checkbox"
                                                                                 type="checkbox"
                                                                                 class="ace">
                                                                          <span class="lbl">
                                                                            <span class="txt"></span>
                                                                          </span>
                                                                      </label>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="css_td">
                                                            <i class="moreClick fa fa-ellipsis-h"></i>
                                                        </div>
                                                    </div>
                                                    <div class="css_tr">
                                                        <div class="css_td">Smoke</div>
                                                        <div class="css_td center">
                                                            <div class="popCheckbox">
                                                                <span class="checkbox">
                                                                      <label class="checkbox-width">
                                                                          <input name="form-field-checkbox"
                                                                                 type="checkbox"
                                                                                 class="ace">
                                                                          <span class="lbl">
                                                                            <span class="txt"></span>
                                                                          </span>
                                                                      </label>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="css_td">
                                                            <i class="moreClick fa fa-ellipsis-h"></i>
                                                        </div>
                                                    </div>
                                                    <div class="css_tr">
                                                        <div class="css_td">SPA</div>
                                                        <div class="css_td center">
                                                            <div class="popCheckbox">
                                                                <span class="checkbox">
                                                                      <label class="checkbox-width">
                                                                          <input name="form-field-checkbox"
                                                                                 type="checkbox"
                                                                                 class="ace">
                                                                          <span class="lbl">
                                                                            <span class="txt"></span>
                                                                          </span>
                                                                      </label>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="css_td">
                                                            <i class="moreClick fa fa-ellipsis-h"></i>
                                                        </div>
                                                    </div>
                                                    <div class="css_tr">
                                                        <div class="css_td">Newspaper</div>
                                                        <div class="css_td center">
                                                            <div class="popCheckbox">
                                                                <span class="checkbox">
                                                                      <label class="checkbox-width">
                                                                          <input name="form-field-checkbox"
                                                                                 type="checkbox"
                                                                                 class="ace"
                                                                                 checked>
                                                                          <span class="lbl">
                                                                            <span class="txt"></span>
                                                                          </span>
                                                                      </label>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="css_td">
                                                            <i class="moreClick fa fa-ellipsis-h"></i>
                                                        </div>
                                                    </div>
                                                    <div class="css_tr">
                                                        <div class="css_td">RM Amenities</div>
                                                        <div class="css_td center">
                                                            <div class="popCheckbox">
                                                                <span class="checkbox">
                                                                      <label class="checkbox-width">
                                                                          <input name="form-field-checkbox"
                                                                                 type="checkbox"
                                                                                 class="ace">
                                                                          <span class="lbl">
                                                                            <span class="txt"></span>
                                                                          </span>
                                                                      </label>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="css_td">
                                                            <i class="moreClick fa fa-ellipsis-h"></i>
                                                        </div>
                                                    </div>
                                                    <div class="css_tr">
                                                        <div class="css_td">Medical history</div>
                                                        <div class="css_td center">
                                                            <div class="popCheckbox">
                                                                <span class="checkbox">
                                                                      <label class="checkbox-width">
                                                                          <input name="form-field-checkbox"
                                                                                 type="checkbox"
                                                                                 class="ace">
                                                                          <span class="lbl">
                                                                            <span class="txt"></span>
                                                                          </span>
                                                                      </label>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="css_td">
                                                            <i class="moreClick fa fa-ellipsis-h"></i>
                                                        </div>
                                                    </div>
                                                    <div class="css_tr">
                                                        <div class="css_td">Others</div>
                                                        <div class="css_td center">
                                                            <div class="popCheckbox">
                                                                <span class="checkbox">
                                                                      <label class="checkbox-width">
                                                                          <input name="form-field-checkbox"
                                                                                 type="checkbox"
                                                                                 class="ace">
                                                                          <span class="lbl">
                                                                            <span class="txt"></span>
                                                                          </span>
                                                                      </label>
                                                                </span>
                                                            </div>
                                                        </div>
                                                        <div class="css_td">
                                                            <i class="moreClick fa fa-ellipsis-h"></i>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-------- /.tabPage -------->
                        </div>
                    </div>
                    <!--/.tab pages-->
                    <!--按鈕-->
                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" :disabled="isOtherContact">{{i18nLang.SystemCommon.Add}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" :disabled="isOtherContact">{{i18nLang.SystemCommon.Save}}
                                        </button>
                                    </li>
                                    <!--btn 有間距class:segement-->

                                    <li>
                                        <button class="btn btn-danger btn-white btn-defaultWidth"
                                                role="button" :disabled="isOtherContact">{{i18nLang.SystemCommon.Delete}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-gray btn-defaultWidth classified-btn"
                                                role="button" disabled>{{i18nLang.program.PMS0210011.Classified}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-skin btn-defaultWidth ghist-sign-pic-btn"
                                                role="button" disabled>{{i18nLang.program.PMS0210011.Gst_pic}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-gray btn-defaultWidth"
                                                role="button" disabled> {{i18nLang.program.PMS0210011.ID_Scanning}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doOpenOtherContact">{{i18nLang.program.PMS0210011.Other_contact}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-gray btn-defaultWidth message-btn"
                                                role="button" disabled>{{i18nLang.program.PMS0210011.Message}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doOpenLostFound" disabled>{{i18nLang.program.PMS0210011.LostAndFound}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-gray btn-defaultWidth suggestion-btn"
                                                role="button" disabled>{{i18nLang.program.PMS0210011.Suggestion}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-gray btn-defaultWidth resvAnniversary"
                                                role="button" disabled>{{i18nLang.program.PMS0210011.Anniversary}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doCloseDialog" :disabled="isOtherContact">
                                            {{i18nLang.SystemCommon.Leave}}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--/按鈕-->
                </div>
                <other-contact
                        :is-other-contact="isOtherContact"
                ></other-contact>
                <lost-and-found
                        :is-lost-and-found="isLostAndFound"
                ></lost-and-found>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
</template>
<script>
    import otherContact from './otherContact';
    import lostAndFound from './lostAndFound';
    import visitsPanel from './visitsPanel';
    import _s from 'underscore.string';
    import moment from 'moment';

    /** DatagridRmSingleGridClass **/
    function DataGridSingleGridClass() {
    }

    DataGridSingleGridClass.prototype = new DatagridBaseClass();
    DataGridSingleGridClass.prototype.onClickRow = function (idx, row) {
    };
    DataGridSingleGridClass.prototype.onClickCell = function (idx, row) {
    };
    DataGridSingleGridClass.prototype.doSaveColumnFields = function () {
    };
    /*** Class End  ***/

    export default {
        name: 'pms0210011',
        props: ["rowData", "isCreateStatus", "isEditStatus", "isModifiable"],
        components: {otherContact, lostAndFound, visitsPanel},
        mounted() {
            this.isLoadingDialog = true;
            this.loadingText = "Loading...";
        },
        data() {
            return {
                i18nLang: go_i18nLang,//多語系資料
                isLoadingDialog: false,//是否載入成功
                loadingText: "",//載入的提示文字
                singleData: {}, //基本資料 單筆資料
                oriSingleData: {}, //基本資料 原始單筆資料
                profileFieldData: [], //基本資料 欄位資料
                profileOriFieldsData: [], //基本資料 原始欄位資料
                tabPageId: 1,
                tabName: "", //頁籤名稱
                panelName: ["profilePanel", "visitsPanel", "referencePanel"], //頁籤內容名稱
                tabStatus: {isProfile: false, isVisits: false, isReference: false}, //現在頁籤狀況
                isOtherContact: false, //是否開啟other contact
                isLostAndFound: false  //是否開啟lost&found
            }
        },
        watch: {
            tabName(val) {
                this.setTabStatus(val);
            },
            rowData(val) {
                this.isLoadingDialog = true;
                if (!_.isEmpty(val)) {
                    this.initData();
                    this.fetchProfileFieldData();
                    this.tabName = "profile";
                }
            },
        },
        methods: {
            initData() {
                this.singleData = {};
                this.oriSingleData = {};
                this.profileFieldData = [];
                this.profileOriFieldsData = [];
                this.setGlobalStatus();
            },
            setGlobalStatus() {
                this.$store.dispatch("setStatus", {
                    gb_isCreateStatus: this.isCreateStatus,
                    gb_isEditStatus: this.isEditStatus
                });
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
            setGlobalGcustCod() {
                this.$store.dispatch("setGcustCod", this.singleData.gcust_cod);
            },
            showTabContent(tabName) {
                var la_panelName = this.panelName;
                var ls_showPanelName = tabName + "Panel";
                _.each(la_panelName, function (ls_panelName) {
                    $("#" + ls_panelName).hide();
                });

                $("#" + ls_showPanelName).show();
            },
            fetchProfileFieldData() {
                this.isLoadingDialog = true;
                var self = this;
                $.post("/api/fetchOnlySinglePageFieldData", {
                    prg_id: "PMS0210011",
                    page_id: 1,
                    tab_page_id: 1,
                    template_id: 'gridsingle'
                }, function (result) {
                    self.profileOriFieldsData = result.gsFieldsData;
                    self.profileFieldData = _.values(_.groupBy(_.sortBy(self.profileOriFieldsData, "col_seq"), "row_seq"));
                    self.fetchProfileRowData();
                });
            },
            fetchProfileRowData() {
                if (this.isCreateStatus) {
                    $.post("/api/fetchDefaultSingleRowData", {
                        prg_id: "PMS0210011",
                        page_id: 1,
                        tab_page_id: 1
                    }).then(result => {
                        this.singleData = result.gsDefaultData;
                        this.oriSingleData = JSON.parse(JSON.stringify(result.gsDefaultData));
                        this.setGlobalGcustCod();
                        this.isLoadingDialog = false;
                    });
                }
                else if (this.isEditStatus) {
                    $.post("/api/fetchSinglePageFieldData", {
                        prg_id: "PMS0210011",
                        page_id: 1,
                        tab_page_id: 1,
                        template_id: "gridsingle",
                        searchCond: {gcust_cod: this.rowData.gcust_cod}
                    }).then(result => {
                        this.singleData = result.gsMnData.rowData[0];
                        this.oriSingleData = JSON.parse(JSON.stringify(result.gsMnData.rowData[0]));
                        this.setGlobalGcustCod();
                        this.isLoadingDialog = false;
                    });
                }
            },
            //開啟other contact 跳窗
            doOpenOtherContact() {
                let self = this;
                this.isOtherContact = true;

                if(this.isOtherContact){
                    var dialog = $("#otherContact").removeClass('hide').dialog({
                        modal: true,
                        title: "其他聯絡方式",
                        title_html: true,
                        width: 800,
                        maxwidth: 1920,
                        height: 500,
                        dialogClass: "test",
                        resizable: true,
                        onBeforeClose() {
                            self.isOtherContact = false;
                        }
                    });
                }
            },
            //開啟lost&found 跳窗
            doOpenLostFound() {
                let self = this;
                this.isLostAndFound = true;

                var dialog = $("#lostFoundDialog").removeClass('hide').dialog({
                    modal: true,
                    title: "Lost&Found",
                    title_html: true,
                    width: 1000,
                    maxwidth: 1920,
                    height: $(window).height(),
                    dialogClass: "test",
                    resizable: true,
                    onBeforeClose() {
                        self.isLostAndFound = false;
                    }
                });
            },
            doCloseDialog() {
                this.initData();
                this.rowData = {};
                $("#PMS0210011").dialog('close');
            },
        }
    }
</script>