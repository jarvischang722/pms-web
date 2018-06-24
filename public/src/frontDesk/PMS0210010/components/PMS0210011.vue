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

                                                        <input type="text"
                                                               v-model.trim="singleData[field.ui_field_name]"
                                                               v-if="field.visiable == 'Y' &&  field.ui_type == 'text'"
                                                               :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                               :required="field.requirable == 'Y'" min="0"
                                                               :maxlength="field.ui_field_length"
                                                               :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                               :disabled="field.modificable == 'N'||(field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                                               @change="chkFieldRule(field.ui_field_name,field.rule_func_name)">

                                                        <bac-select
                                                                v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                                :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                v-model="singleData[field.ui_field_name]"
                                                                :data="field.selectData" :field="field"
                                                                is-qry-src-before="Y" value-field="value"
                                                                text-field="display"
                                                                @change="chkFieldRule(field.ui_field_name,field.rule_func_name)"
                                                                @update:v-model="val => singleData[field.ui_field_name] = val"
                                                                :default-val="singleData[field.ui_field_name] || field.defaultVal"
                                                                :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                        </bac-select>

                                                        <bac-select-grid
                                                                v-if="field.visiable == 'Y' && field.ui_type == 'selectgrid'"
                                                                :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                v-model="singleData[field.ui_field_name]"
                                                                :columns="field.selectData.columns"
                                                                :data="field.selectData.selectData" :field="field"
                                                                :is-qry-src-before="field.selectData.isQrySrcBefore"
                                                                :id-field="field.selectData.value"
                                                                :text-field="field.selectData.display"
                                                                @change="chkFieldRule(field.ui_field_name,field.rule_func_name)"
                                                                @update:v-model="val => singleData[field.ui_field_name] = val"
                                                                :default-val="singleData[field.ui_field_name]"
                                                                :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                        </bac-select-grid>

                                                        <input type="number"
                                                               v-model.trim="singleData[field.ui_field_name]"
                                                               v-if="field.visiable == 'Y' && field.ui_type == 'number'"
                                                               :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                               :class="{'input_sta_required' : field.requirable == 'Y', 'text-right' : field.ui_type == 'number'}"
                                                               :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">

                                                        <!-- 日期時間選擇器 -->
                                                        <el-date-picker
                                                                v-if="field.visiable == 'Y' && field.ui_type == 'date'"
                                                                v-model="singleData[field.ui_field_name]"
                                                                type="date"
                                                                change="chkFieldRule(field.ui_field_name,field.rule_func_name)"
                                                                :disabled="field.modificable == 'N'||
                                                    (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                                                size="small" :format="field.ui_format"
                                                                :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                @change="chkFieldRule(field.ui_field_name,field.rule_func_name)">
                                                        </el-date-picker>

                                                        <!-- 日期時間選擇器 -->

                                                        <el-date-picker
                                                                v-if="field.visiable == 'Y' && field.ui_type == 'datetime'"
                                                                v-model="singleData[field.ui_field_name]"
                                                                type="datetime"
                                                                size="small"
                                                                :disabled="field.modificable == 'N'||
                                                    (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                                                :format="field.ui_format"
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
                                                role="button" :disabled="isOtherContact" @click="doaAddData">
                                            {{i18nLang.SystemCommon.Add}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" :disabled="isOtherContact" @click="doSaveData">
                                            {{i18nLang.SystemCommon.Save}}
                                        </button>
                                    </li>
                                    <!--btn 有間距class:segement-->
                                    <li>
                                        <button class="btn btn-danger btn-white btn-defaultWidth"
                                                role="button" :disabled="isOtherContact" @click="doDeleteData">
                                            {{i18nLang.SystemCommon.Delete}}
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
                                                role="button" @click="doOpenOtherContact">
                                            {{i18nLang.program.PMS0210011.Other_contact}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-gray btn-defaultWidth message-btn"
                                                role="button" disabled>{{i18nLang.program.PMS0210011.Message}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doOpenLostFound" disabled>
                                            {{i18nLang.program.PMS0210011.LostAndFound}}
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
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" :disabled="isOpenChangeLog" @click="loadChangeLog">
                                            {{i18nLang.SystemCommon.ChangeLog}}
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
    /*** Class End  ***/

    export default {
        name: 'pms0210011',
        props: ["rowData", "isCreateStatus", "isEditStatus", "isModifiable"],
        components: {otherContact, lostAndFound, visitsPanel},
        created() {
            let store = this.$store.state.ghistMnModule.ghistMnModule;
            this.$eventHub.$on("doSaveModifyData", () => {
                if (!this.isDeleteStatus) {
                    _.each(this.$store.state.ghistMnModule.go_profileSingleData, (val, key) => {
                        if (_.isUndefined(val) || _.isUndefined(this.$store.state.ghistMnModule.go_oriProfileSingleData[key])) {
                            this.$store.state.ghistMnModule.go_profileSingleData[key] = null;
                            this.$store.state.ghistMnModule.go_oriProfileSingleData[key] = null;
                        }
                    });
                    let lo_allData = {
                        singleData: this.$store.state.ghistMnModule.go_profileSingleData,
                        emailData: this.$store.state.ghistMnModule.ga_emailDataGridRowsData,
                        contactData: this.$store.state.ghistMnModule.ga_contactDataGridRowsData,
                        addressData: this.$store.state.ghistMnModule.ga_addressDataGridRowsData
                    };
                    let lo_oriAllData = {
                        singleData: this.$store.state.ghistMnModule.go_oriProfileSingleData,
                        emailData: this.$store.state.ghistMnModule.ga_oriEmailDataGridRowsData,
                        contactData: this.$store.state.ghistMnModule.ga_oriContactDataGridRowsData,
                        addressData: this.$store.state.ghistMnModule.ga_oriAddressDataGridRowsData
                    };

                    _.each(lo_oriAllData["emailData"], (lo_emailData, idx) => {
                        lo_oriAllData["emailData"][idx] = _.extend(lo_emailData, {
                            cust_cod: this.$store.state.ghistMnModule.gs_gcustCod,
                            athena_id: lo_allData["emailData"][idx]["athena_id"]
                        });
                    });
                    _.each(lo_oriAllData["contactData"], (lo_contactData, idx) => {
                        lo_oriAllData["contactData"][idx]["contact_dt.athena_id"] = lo_allData["contactData"][idx]["contact_dt.athena_id"];
                        lo_oriAllData["contactData"][idx]["contact_dt.cust_cod"] = this.$store.state.ghistMnModule.gs_gcustCod;

                    });
                    _.each(lo_oriAllData["addressData"], (lo_addressData, idx) => {
                        lo_oriAllData["addressData"][idx]["address_dt.athena_id"] = lo_allData["addressData"][idx]["address_dt.athena_id"];
                        lo_oriAllData["addressData"][idx]["address_dt.cust_cod"] = this.$store.state.ghistMnModule.gs_gcustCod;
                    });

                    let lo_isModify = go_validateClass.chkDataChang(lo_allData, lo_oriAllData);

                    if (!lo_isModify.success) {
                        let lb_confirm = confirm(lo_isModify.msg);
                        if (lb_confirm) {
                            this.doSaveData();
                        }
                    }
                }
                this.isDeleteStatus = false;
            });
            this.$eventHub.$on('getCloseChangeLogData', (closeChangeLogData) => {
                this.isOpenChangeLog = closeChangeLogData.isOpenChangeLog;
            });
        },
        mounted() {
            this.isLoadingDialog = true;
            this.loadingText = "Loading...";
        },
        data() {
            return {
                chgSingleData: {},
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
                isOtherContact: false,  //是否開啟other contact
                isLostAndFound: false,  //是否開啟lost&found
                isDeleteStatus: false,  //是否為刪除
                isOpenChangeLog: false,
                isEffectFromRule: true     //是否要連動
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
                    this.tabName = "profile";
                    this.fetchProfileFieldData();
                    this.loadingText = "Loading...";
                }
            },
            singleData: {
                handler(val) {
                    //國籍
                    this.oriSingleData.live_cod = this.oriSingleData.live_cod == "" ? val.live_cod : this.oriSingleData.live_cod;

                    //姓名
                    val.first_nam = val["cust_idx.first_nam"];
                    val.last_nam = val["cust_idx.last_nam"];

                    //公司名稱
                    val["cust_idx.comp_nam"] = val.ccust_nam;

                    //性別
                    this.oriSingleData["cust_idx.sex_typ"] = _.isNull(this.oriSingleData["cust_idx.sex_typ"]) ? val["cust_idx.sex_typ"] : this.oriSingleData["cust_idx.sex_typ"];
                    val.sex_typ = val["cust_idx.sex_typ"];

                    //生日
                    val["cust_idx.birth_dat"] = val["cust_idx.birth_dat"] == "" ? "" : moment(val["cust_idx.birth_dat"]).format("YYYY/MM/DD");
                    val.birth_dat = val["cust_idx.birth_dat"];
                    this.$store.dispatch("ghistMnModule/setProfileData", {
                        go_profileSingleData: this.singleData,
                        go_oriProfileSingleData: this.oriSingleData
                    });
                },
                deep: true
            },
            //訂房公司影響統一編號,發票抬頭
            "singleData.acust_cod": function (newVal, oldVal) {
                if (!_.isNull(newVal) && !_.isUndefined(newVal)) {
                    if (newVal.trim() != "") {
                        let lo_compCodSelectData = _.findWhere(this.profileOriFieldsData, {ui_field_name: "acust_cod"}).selectData.selectData;
                        let ls_uniCod = "";
                        let ls_uniTitle = "";
                        try {
                            ls_uniCod = _.findWhere(lo_compCodSelectData, {cust_cod: newVal}).uni_cod;
                            ls_uniTitle = _.findWhere(lo_compCodSelectData, {cust_cod: newVal}).uni_title;
                        }
                        catch (err) {
                        }

                        this.singleData["cust_idx.uni_cod"] = this.singleData["cust_idx.uni_cod"] || "";
                        this.singleData["cust_idx.uni_title"] = this.singleData["cust_idx.uni_title"] || "";
                        this.singleData["cust_idx.uni_cod"] = this.singleData["cust_idx.uni_cod"] == "" ? ls_uniCod : this.singleData["cust_idx.uni_cod"];
                        this.singleData["cust_idx.uni_title"] = this.singleData["cust_idx.uni_title"] == "" ? ls_uniTitle : this.singleData["cust_idx.uni_title"];
                    }
                }
            }
        },
        methods: {
            initData() {
                this.singleData = {};
                this.oriSingleData = {};
                this.profileFieldData = [];
                this.profileOriFieldsData = [];
                this.setGlobalStatus();
                this.chgSingleData = {};
            },
            setGlobalStatus() {
                this.$store.dispatch("ghistMnModule/setStatus", {
                    gb_isCreateStatus: this.isCreateStatus,
                    gb_isEditStatus: this.isEditStatus
                });
            },
            setTabStatus(tabName) {
                let self = this;

                _.each(this.tabStatus, function (val, key) {
                    self.tabStatus[key] = false;
                });

                let ls_tabNae = _s.capitalize(tabName);
                this.tabStatus["is" + ls_tabNae] = true;

                this.showTabContent(tabName);
            },
            setGlobalGcustCod() {
                this.$store.dispatch("ghistMnModule/setGcustCod", this.singleData.gcust_cod);
            },
            showTabContent(tabName) {
                var la_panelName = this.panelName;
                var ls_showPanelName = tabName + "Panel";
                _.each(la_panelName, function (ls_panelName) {
                    $("#" + ls_panelName).hide();
                });

                $("#" + ls_showPanelName).show();
            },
            chkFieldRule(ui_field_name, rule_func_name) {
                var self = this;
                if (_.isEmpty(this.chgSingleData)) {
                    this.chgSingleData = this.oriSingleData;
                }
                let la_oriSingleData = [this.chgSingleData];
                let la_singleData = [this.singleData];
                let la_diff = _.difference(la_oriSingleData, la_singleData);
                // 判斷資料是否有異動
                if (la_diff.length != 0) {
                    this.isUpdate = true;
                }

                if (rule_func_name === "" || !this.$parent.isModifiable || !this.isEffectFromRule) {
                    this.isEffectFromRule = true;
                    return;
                }

                if (!_.isEmpty(rule_func_name.trim())) {
                    let postData = {
                        prg_id: "PMS0210011",
                        rule_func_name: rule_func_name,
                        validateField: ui_field_name,
                        singleRowData: la_singleData,
                        oriSingleData: la_oriSingleData
                    };
                    $.post('/api/chkFieldRule', postData, function (result) {

                        if (result.success) {

                            //連動帶回的值
                            if (!_.isUndefined(result.effectValues) && _.size(result.effectValues) > 0) {
                                self.singleData = _.extend(self.singleData, result.effectValues);

                                self.isEffectFromRule = result.isEffectFromRule;
                            }

                            //是否要show出訊息
                            if (result.showAlert) {
                                alert(result.alertMsg);
                            }

                            //是否要show出詢問視窗
                            if (result.showConfirm) {
                                if (confirm(result.confirmMsg)) {
                                    self.chgSingleData = _.extend(self.singleData, result.effectValues);
                                    self.singleData = _.extend(self.singleData, result.effectValues);
                                }
                                else {
                                    //有沒有要再打一次ajax到後端
                                    if (result.isGoPostAjax && !_.isEmpty(result.ajaxURL)) {
                                        $.post(result.ajaxURL, postData, function (result) {
                                            if (!result.success) {
                                                alert(result.errorMsg);
                                            }
                                            else {
                                                if (!_.isUndefined(result.effectValues) && _.size(result.effectValues) > 0) {
                                                    self.chgSingleData = _.extend(self.singleData, result.effectValues);
                                                    self.singleData = _.extend(self.singleData, result.effectValues);
                                                    self.isEffectFromRule = result.isEffectFromRule;
                                                }
                                            }
                                        });
                                    }
                                    else {
                                        self.singleData = self.chgSingleData
                                    }
                                }
                            }
                            self.chgSingleData = JSON.parse(JSON.stringify(self.singleData));

                        }
                        else {
                            alert(result.errorMsg);
                        }
                    });
                }
            },
            fetchProfileFieldData() {
                this.isLoadingDialog = true;
                let self = this;
                $.post("/api/fetchOnlySinglePageFieldData", {
                    prg_id: "PMS0210011",
                    page_id: 1,
                    tab_page_id: 1,
                    template_id: 'gridsingle'
                }, function (result) {
                    _.each(result.gsFieldsData, (lo_gsFieldsData) => {
                        if (lo_gsFieldsData.ui_field_name == "expira_dat") {
                            lo_gsFieldsData.ui_format = "MM/yy";
                        }
                        else if (lo_gsFieldsData.ui_type == "date") {
                            lo_gsFieldsData.ui_format = "yyyy/MM/dd";
                        }
                        else if (lo_gsFieldsData.ui_type == "datetime") {
                            lo_gsFieldsData.ui_format = "yyyy/MM/dd HH:mm:ss";
                        }
                    });
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
                        let ls_birth_dat = result.gsMnData.rowData[0]["cust_idx.birth_dat"] || "";
                        result.gsMnData.rowData[0]["cust_idx.birth_dat"] = ls_birth_dat == "" ? "" : moment(ls_birth_dat).format("YYYY/MM/DD");

                        this.singleData = result.gsMnData.rowData[0];
                        this.oriSingleData = JSON.parse(JSON.stringify(result.gsMnData.rowData[0]));
                        this.setGlobalGcustCod();
                        this.isLoadingDialog = false;
                        this.$eventHub.$emit("getGhistMnDataToOrder", {
                            ghistMnData: this.singleData
                        });
                    });
                }
            },
            setFieldsData() {
                //將業務備註資料放至Vuex
                this.$store.dispatch("ghistMnModule/setOtherContactFieldsData", {
                    ga_emailFieldsData: this.emailFieldsData,
                    ga_contactFieldsData: this.contactFieldsData,
                    ga_addressFieldsData: this.addressFieldsData
                });
            },
            //增加資料
            doaAddData() {
                this.doCloseDialog();
                this.$eventHub.$emit('addNewData', {});
            },
            dataValidate() {
                let self = this;
                let lo_checkResult;

                for (let i = 0; i < this.profileOriFieldsData.length; i++) {
                    let lo_field = this.profileOriFieldsData[i];
                    //必填
                    if (lo_field.requirable == "Y" && lo_field.modificable != "N" && lo_field.ui_type != "checkbox") {
                        lo_checkResult = go_validateClass.required(self.singleData[lo_field.ui_field_name], lo_field.ui_display_name);
                        if (lo_checkResult.success == false) {
                            break;
                        }
                    }

                    //有format
                    if (lo_field.format_func_name.validate != "") {
                        lo_checkResult = go_validateClass[lo_field.format_func_name.validate](self.singleData[lo_field.ui_field_name], lo_field.ui_display_name);
                        if (lo_checkResult.success == false) {
                            break;
                        }
                    }

                }

                return lo_checkResult;
            },
            //儲存資料
            async doSaveData() {

                // console.log(this.rowData);
                // return;

                this.isLoadingDialog = true;
                this.loadingText = "saving";
                let lo_chkResult = this.dataValidate();

                if (lo_chkResult.success == false) {
                    alert(lo_chkResult.msg);
                    this.isLoadingDialog = false;
                }
                else {
                    try {
                        let lo_saveProfileDataRes = await this.$store.dispatch("ghistMnModule/doSaveProfileData");
                        if (lo_saveProfileDataRes.success) {
                            let lo_saveOtherContactDataRes = await this.$store.dispatch("ghistMnModule/doSaveOtherContactData");

                            if (lo_saveOtherContactDataRes.success) {
                                this.$eventHub.$emit("getGhistMnDataToOrder", {
                                    ghistMnData: this.singleData
                                });
                                alert(go_i18nLang.SystemCommon.saveSuccess);

                                let lo_cloneRowData = _.extend(JSON.parse(JSON.stringify(this.rowData)),);
                                lo_cloneRowData = _.extend(lo_cloneRowData, {gcust_cod: this.$store.state.ghistMnModule.gs_gcustCod});

                                this.isEditStatus = true;
                                this.isCreateStatus = false;

                                this.rowData = {};
                                this.rowData = lo_cloneRowData;
                                this.$store.dispatch("ghistMnModule/setAllDataClear");
                            }
                            else {
                                alert(lo_saveOtherContactDataRes.errorMsg)
                            }
                        }
                        else {
                            alert(lo_saveProfileDataRes.errorMsg)
                        }
                    }
                    catch (err) {

                    }
                    this.isLoadingDialog = false;

                }
            },
            async doDeleteData() {
                this.isDeleteStatus = true;
                this.isLoadingDialog = true;

                if (this.$store.state.ghistMnModule.gb_isEditStatus) {
                    this.$store.dispatch("ghistMnModule/setDeleteStatus", {
                        gb_isDeleteStatus: this.isDeleteStatus
                    });

                    let lo_saveProfileDataRes = await this.$store.dispatch("ghistMnModule/doSaveProfileData");
                    if (lo_saveProfileDataRes.success) {
                        alert(go_i18nLang.SystemCommon.delSuccess);
                        this.doCloseDialog();
                    }
                    else {
                        alert(lo_saveProfileDataRes.errorMsg)
                    }
                    this.isLoadingDialog = false;
                }
                else {
                    this.doCloseDialog();
                }
            },
            //開啟other contact 跳窗
            doOpenOtherContact() {
                let self = this;
                this.isOtherContact = true;

                if (this.isOtherContact) {
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
            loadChangeLog() {
                this.isOpenChangeLog = true;
                $.post("/api/getSetupPrgChangeLog", {prg_id: "PMS0210011"}, (result) => {
                    if (result.success) {
                        this.$eventHub.$emit('getChangeLogData', {
                            openChangeLogDialog: this.isOpenChangeLog,
                            allChangeLogList: result.allChangeLogList
                        });
                    }
                });
            }
        }
    }
</script>