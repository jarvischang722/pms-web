<template>
    <div id="PMS0810230SingleGrid" class="hide padding-5" style="top: 0 !important;">
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
                                                <!--<a @click="editFieldMultiLang(field)"-->
                                                   <!--v-if="field.multi_lang_table != ''">-->
                                                    <!--{{field.ui_display_name}}-->
                                                <!--</a>-->
                                                <span>{{ field.ui_display_name }}</span>

                                            </label>

                                            <input type="text" v-model="singleData[field.ui_field_name]"
                                                   v-if="field.visiable == 'Y' &&  field.ui_type == 'text'"
                                                   :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                   :required="field.requirable == 'Y'" min="0"
                                                   :maxlength="field.ui_field_length"
                                                   :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                   :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                                   @change="chkFieldRule(field.ui_field_name,field.rule_func_name)">

                                            <input type="text" v-model="singleData[field.ui_field_name]"
                                                   v-if="field.visiable == 'Y' && field.ui_type == 'number'"
                                                   :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                   :class="{'input_sta_required' : field.requirable == 'Y', 'text-right' : field.ui_type == 'number'}"
                                            >

                                            <el-date-picker v-if="field.visiable == 'Y' && field.ui_type == 'date'"
                                                            v-model="singleData[field.ui_field_name]"
                                                            type="date" size="small" format="yyyy/MM/dd"
                                                            :disabled="!isModifiable || field.modificable == 'N' ||
                                                            (field.modificable == 'I') || (field.modificable == 'E')"
                                                            :style="{width:field.width + 'px' , height:field.height + 'px'}">
                                            </el-date-picker>

                                            <el-date-picker v-if="field.visiable == 'Y' && field.ui_type == 'datetime'"
                                                            v-model="singleData[field.ui_field_name]"
                                                            type="datetime" size="small"
                                                            change="chkFieldRule(field.ui_field_name,field.rule_func_name)"
                                                            :disabled="!isModifiable || field.modificable == 'N'||
                                                            (field.modificable == 'I') || (field.modificable == 'E')"
                                                            :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                            format="yyyy/MM/dd HH:mm:ss">
                                            </el-date-picker>

                                            <!-- 下拉選單 -->
                                            <bac-select v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                        :class="{'input_sta_required' : field.requirable == 'Y' }"
                                                        :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                        v-model="singleData[field.ui_field_name]"
                                                        :data-display="field.selectDataDisplay " :data="field.selectData"
                                                        is-qry-src-before="Y" value-field="value" text-field="display"
                                                        @update:v-model="val => singleData[field.ui_field_name] = val"
                                                        :default-val="singleData[field.ui_field_name]" :field="field"
                                                        :disabled="field.modificable == 'N'|| !isModifiable ||
                                                      (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                                        @change="chkFieldRule(field.ui_field_name,field.rule_func_name)">
                                            </bac-select>

                                            <!--  textarea -->
                                            <textarea v-model="singleData[field.ui_field_name]"
                                                      v-if="field.visiable == 'Y' && field.ui_type == 'textarea'"
                                                      class="numStyle-none" rows="4" style="resize: none;"
                                                      :style="{width:field.width + 'px'}"
                                                      :required="field.requirable == 'Y'"
                                                      :maxlength="field.ui_field_length"
                                                      :disabled="field.modificable == 'N'|| !isModifiable ||
                                                      (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                                      @change="chkFieldRule(field.ui_field_name,field.rule_func_name)">
                                            </textarea>

                                        </div>
                                    </div>
                                </div>
                            </div><!--main-content-data-->
                            <!--------/.單筆 -------->
                            <div class="space-6"></div>
                            <!-------- tabPage -------->
                            <el-tabs v-model="tabName" type="card">
                                <el-tab-pane :label="i18nLang.program.PMS0810230.roomTyp" name="roomTyp">
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0810230.limitSet" name="limitSet" disabled>
                                </el-tab-pane>
                                <el-tab-pane :label="i18nLang.program.PMS0810230.promoteSet" name="promoteSet" disabled>
                                </el-tab-pane>
                            </el-tabs>
                            <div class="easyui-tabs borderFrame"
                                 style="min-height: 0;!important; overflow-y: auto;">
                                <div id="roomTypPanel" v-show="tabName=='roomTyp'" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <room-typ
                                                :row-data="rowData"
                                                :is-room-type="tabName=='roomTyp'"
                                        ></room-typ>
                                        <div class="clearfix"></div>
                                        <div class="space-12"></div>
                                    </div>
                                </div>
                                <div id="limitSetPanel" v-show="tabName=='limitSet'" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">

                                            <table class="css_table">
                                                <tbody class="css_tbody">
                                                <!--1-->
                                                <tr class="css_tr">
                                                    <td class="css_td padding-top width-50">
                                                        <div class="grid">
                                                            <div class="grid-item">
                                                                <label>最少住宿天數</label>
                                                                <input type="text"
                                                                       class="input-medium rateCode-s2"
                                                                       placeholder="1"/>
                                                                <span>天</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="css_td padding-top width-50">
                                                        <div class="grid">
                                                            <div class="grid-item no-margin-right">
                                                                <div class="popCheckbox">
                                                                        <span class="checkbox">
                                                                              <label class="checkbox-width">
                                                                                  <input name="form-field-checkbox"
                                                                                         type="checkbox"
                                                                                         class="ace">
                                                                                  <span class="lbl">
                                                                                      <span class="subtxt">早鳥規則</span>
                                                                                  </span>
                                                                              </label>
                                                                        </span>
                                                                </div>
                                                            </div>
                                                            <div class="grid-item">
                                                                <input type="text"
                                                                       class="input-medium rateCode-s2"
                                                                       placeholder="90"/>
                                                                <span class="ml-4 subtxt">天前至</span>
                                                                <input type="text"
                                                                       class="input-medium rateCode-s2 ml-4"
                                                                       placeholder="60"/>
                                                                <span class="ml-4 subtxt">天前</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <!--2-->
                                                <tr class="css_tr">
                                                    <td class="css_td padding-top width-50">
                                                        <div class="grid">
                                                            <div class="grid-item popCheckbox">

                                                                <span class="checkbox">
                                                                  <label class="checkbox-width">
                                                                      <input name="form-field-checkbox"
                                                                             type="checkbox"
                                                                             class="ace">
                                                                      <span class="lbl">
                                                                        <span class="txt">會員優惠</span>
                                                                      </span>
                                                                  </label>
                                                                </span>
                                                            </div>
                                                            <div class="grid-item">
                                                                <span class="moreClick moreHtAuto">會員類別</span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="css_td padding-top width-50">
                                                        <div class="grid">

                                                            <div class="grid-item popCheckbox">
                                                                <span class="checkbox">
                                                                  <label class="checkbox-width">
                                                                      <input name="form-field-checkbox"
                                                                             type="checkbox"
                                                                             class="ace">
                                                                      <span class="lbl">
                                                                        <span class="subtxt">依住房率</span>
                                                                        <input type="text"
                                                                               class="input-medium rateCode-s2"
                                                                               placeholder="30"/>
                                                                        <span class="subtxt ml-4">%至</span>
                                                                        <input type="text"
                                                                               class="input-medium rateCode-s2"
                                                                               placeholder="45"/>
                                                                        <span class="subtxt ml-4">%</span>
                                                                      </span>
                                                                  </label>
                                                                </span>
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <!--3-->
                                                <tr class="css_tr">
                                                    <td class="css_td padding-top width-50">
                                                        <div class="grid">
                                                            <div class="grid-item popCheckbox">
                                                                <span class="checkbox">
                                                                  <label class="checkbox-width width-auto">
                                                                      <input name="form-field-checkbox"
                                                                             type="checkbox"
                                                                             class="ace">
                                                                      <span class="lbl">
                                                                        <span>上架期間功能</span>
                                                                      </span>
                                                                  </label>
                                                                </span>
                                                            </div>
                                                            <div class="grid-item">
                                                                <div style="display: block;">


                                                                    <label>上架日期</label>
                                                                    <input type="date"
                                                                           class="input-medium rateCode-s3"
                                                                           placeholder="2016/01/01"/>
                                                                </div>
                                                                <div style="display: block;">

                                                                    <label>下架日期</label>
                                                                    <input type="date"
                                                                           class="input-medium rateCode-s3"
                                                                           placeholder="2016/01/01"/>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td class="css_td padding-top width-50">

                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="clearfix"></div>
                                    </div>
                                </div>
                                <div id="promoteSetPanel" v-show="tabName=='promoteSet'" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <table class="css_table">
                                                <tbody class="css_tbody">
                                                <!--1-->
                                                <tr class="css_tr">
                                                    <td class="css_td padding-top width-100">
                                                        <div class="grid">
                                                            <div class="grid-item popCheckbox">
                                                                <span class="checkbox">
                                                                  <label class="checkbox-width">
                                                                      <input name="form-field-checkbox"
                                                                             type="checkbox"
                                                                             class="ace">
                                                                      <span class="lbl">
                                                                            <span class="subtxt">多</span>
                                                                            <input type="text"
                                                                                   class="input-medium rateCode-s2 ml-4"
                                                                                   placeholder="30"/>
                                                                            <span class="subtxt ml-4">$ / 送</span>
                                                                            <input type="text"
                                                                                   class="input-medium rateCode-s2 ml-4"
                                                                                   placeholder="45"/>
                                                                            <span class="subtxt ml-4">晚</span>
                                                                      </span>
                                                                  </label>
                                                                </span>
                                                            </div>

                                                            <div class="grid-item">
                                                                <span class="moreClick moreHtAuto  moreAbso-t10">贈送規則</span>
                                                            </div>
                                                        </div>
                                                        <div class="clearfix"></div>
                                                        <div class="grid">

                                                            <div class="grid-item popCheckbox">
                                                                <span class="checkbox">
                                                                  <label class="checkbox-width">
                                                                      <input name="form-field-checkbox"
                                                                             type="checkbox"
                                                                             class="ace">
                                                                      <span class="lbl">
                                                                        <span class="subtxt">住</span>
                                                                        <input type="text"
                                                                               class="input-medium rateCode-s2 ml-4"
                                                                               placeholder="30"/>
                                                                        <span class="subtxt ml-4">晚 / 送</span>
                                                                        <input type="text"
                                                                               class="input-medium rateCode-s2 ml-4"
                                                                               placeholder="45"/>
                                                                        <span class="subtxt ml-4">晚</span>
                                                                      </span>
                                                                  </label>
                                                                </span>
                                                            </div>


                                                            <div class="grid-item">

                                                                <span class="moreClick moreHtAuto">贈送規則</span>
                                                            </div>

                                                            <div class="clearfix"></div>
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <div class="clearfix"></div>
                                    </div>
                                </div>
                            </div>
                            <!-------- /.tabPage -------->
                        </div>
                    </div>
                    <!--按鈕-->
                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doSaveGrid">{{i18nLang.program.PMS0810230.save}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doOpenUseTime">
                                            {{i18nLang.program.PMS0810230.useTime}}
                                        </button>
                                    </li>
                                    <li>
                                        <!--等SA-->
                                        <button class="btn btn-primary btn-white btn-defaultWidth resv_priceTrial"
                                                role="button">{{i18nLang.program.PMS0810230.priceTrial}}(等SA)
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doOpenRateList">
                                            {{i18nLang.program.PMS0810230.rateList}}
                                        </button>
                                    </li>
                                    <li class="depDateLi">
                                        <button class="btn btn-primary btn-white btn-defaultWidth rateCode_dependantRate" disabled
                                                role="button">{{i18nLang.program.PMS0810230.depRate}}
                                        </button>
                                    </li>
                                    <li class="baseDateLi">
                                        <button class="btn btn-primary btn-white btn-defaultWidth rateCode_baseDate" disabled
                                                role="button">{{i18nLang.program.PMS0810230.baseRate}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth rateCode_addPpl" disabled
                                                role="button">{{i18nLang.program.PMS0810230.addPol}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doCloseDialog">{{i18nLang.program.PMS0810230.leave}}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--/.按鈕-->
                </div>
                <div class="space-6"></div>
                <!--複製部分-->
                <div class="row hide">
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right">
                            <div class="horizTable-outer">
                                <table class="css_table horizTable width-100">
                                    <thead class="css_thead">
                                    <tr class="css_tr">
                                        <th class="css_th width-5">
                                            <i class="fa fa-plus green pointer"></i>
                                        </th>
                                        <th class="css_th width-20">服務項目</th>
                                        <th class="css_th width-10">單價</th>
                                        <th class="css_th width-15">計算規則</th>
                                        <th class="css_th width-15">服務方式</th>
                                        <th class="css_th width-10">服務規則</th>
                                        <th class="css_th width-10">收費方式</th>
                                        <th class="css_th width-15">併入方式</th>
                                    </tr>
                                    </thead>
                                    <tbody class="css_tbody">
                                    <tr class="css_tr">
                                        <td class="css_td">
                                            <i class="fa fa-minus red pointer"></i>
                                        </td>
                                        <td class="css_td">201A-早餐</td>
                                        <td class="css_td text-right">200</td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="1">依大人數</option>
                                                <option value="2">依小孩數</option>
                                                <option value="3">依房間</option>
                                            </select>
                                        </td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="1">D:每天</option>
                                                <option value="2">F:第一天</option>
                                                <option value="3">C:自訂規則</option>
                                                <option value="4">L:最後一天</option>
                                            </select>
                                        </td>
                                        <td class="css_td">旺日</td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="inside">I:內拆</option>
                                                <option value="outside">Q:外加</option>
                                            </select>
                                        </td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="addRent">1:加入至房租</option>
                                                <option value="addTip">2:加入至服務費</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr class="css_tr">
                                        <td class="css_td">
                                            <i class="fa fa-minus red pointer"></i>
                                        </td>
                                        <td class="css_td">218A-迎賓飲料</td>
                                        <td class="css_td text-right">100</td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="1">依大人數</option>
                                                <option value="2">依小孩數</option>
                                                <option value="3">依房間</option>
                                            </select>
                                        </td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="1">D:每天</option>
                                                <option value="2">F:第一天</option>
                                                <option value="3">C:自訂規則</option>
                                                <option value="4">L:最後一天</option>
                                            </select>
                                        </td>
                                        <td class="css_td">平日</td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="outside">Q:外加</option>
                                                <option value="inside">I:內拆</option>
                                            </select>
                                        </td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="addRent">1:加入至房租</option>
                                                <option value="addTip">2:加入至服務費</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr class="css_tr">
                                        <td class="css_td">
                                            <i class="fa fa-minus red pointer"></i>
                                        </td>
                                        <td class="css_td">219A-水果</td>
                                        <td class="css_td text-right">100</td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="1">依大人數</option>
                                                <option value="2">依小孩數</option>
                                                <option value="3">依房間</option>
                                            </select>
                                        </td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="1">D:每天</option>
                                                <option value="2">F:第一天</option>
                                                <option value="3">C:自訂規則</option>
                                                <option value="4">L:最後一天</option>
                                            </select>
                                        </td>
                                        <td class="css_td">平日</td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="outside">Q:外加</option>
                                                <option value="inside">I:內拆</option>
                                            </select>
                                        </td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="addRent">1:加入至房租</option>
                                                <option value="addTip">2:加入至服務費</option>
                                            </select>
                                        </td>
                                    </tr>
                                    <tr class="css_tr">
                                        <td class="css_td">
                                            <i class="fa fa-minus red pointer"></i>
                                        </td>
                                        <td class="css_td">510C-門票</td>
                                        <td class="css_td text-right">200</td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="1">依大人數</option>
                                                <option value="2">依小孩數</option>
                                                <option value="3">依房間</option>
                                            </select>
                                        </td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="1">D:每天</option>
                                                <option value="2">F:第一天</option>
                                                <option value="3">C:自訂規則</option>
                                                <option value="4">L:最後一天</option>
                                            </select>
                                        </td>
                                        <td class="css_td">平日</td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="outside">Q:外加</option>
                                                <option value="inside">I:內拆</option>
                                            </select>
                                        </td>
                                        <td class="css_td">
                                            <select class="selectHt">
                                                <option value="addRent">1:加入至房租</option>
                                                <option value="addTip">2:加入至服務費</option>
                                            </select>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth rateCode_duplicate"
                                                role="button">複製
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <!--/. 複製部分-->
            </div>
            <div class="clearfix"></div>
        </div>
        <use-time
                :row-data="rowData"
                :is-use-time="isUseTime"
        ></use-time>
        <rate-list
                :row-data="rowData"
        ></rate-list>
    </div>
</template>

<script>
    import _s from 'underscore.string';
    import moment from 'moment';
    import roomTyp from './roomTyp';
    import useTime from './useTime';
    import rateList from './rateList';


    export default {
        name: 'pms0810230SingleGrid',
        props: ["rowData", "isCreateStatus", "isEditStatus", "isModifiable"],
        components: {roomTyp, useTime, rateList},
        created() {
            this.$eventHub.$on('setTabName', (tabNameData) => {
                this.tabName = tabNameData.tabName;
            });
            this.$eventHub.$on("setMultiLangSingleData", (data) => {
                let ls_noeLocale = getCookie('locale');
                let lo_edit = _.findWhere(this.singleData.multiLang, {locale: ls_noeLocale});
                this.singleData[lo_edit.field] = lo_edit.value;
                this.singleData = _.extend(this.singleData, data);
            });
        },
        mounted() {
            this.isLoadingDialog = true;
            this.loadingText = "Loading...";
        },
        data() {
            return {
                i18nLang: go_i18nLang, //多語系資料
                isLoadingDialog: false,//是否載入成功
                loadingText: "",//載入的提示文字
                singleData: {}, //單筆資料
                chgSingleData: {}, //改變前的單筆資料
                oriSingleData: {}, //原始單筆資料
                fieldsData: [], //欄位資料
                oriFieldsData: [], //原始欄位資料
                tabPageId: 1,
                tabName: "", //頁籤名稱
                panelName: ["roomTypPanel", "limitSetPanel", "limitSetPanel"], //頁籤內容名稱
                tabStatus: {isRoomTyp: false}, //現在頁籤狀況
                isUseTime: false, //是否開啟使用期間
            }
        },
        watch: {
            tabName(val) {
                this.setTabStatus(val);
            },
            rowData(val) {
                this.isLoadingDialog = true;
                if (!_.isEmpty(val)) {
                    this.setGlobalStatus();
                    this.initData();
                    this.fetchFieldData();
                    this.loadingText = "Loading...";
                }
            },
            isUseTime(val) {
                if (!val) {
                    this.$eventHub.$emit("getUseTimeData", {
                        useTimeData: this.$store.state.go_allData.ga_utDataGridRowsData
                    });
                }
            },
            singleData: {
                handler(val, oldVal) {
                    this.setGlobalRateCod();
                    if (!_.isUndefined(val.rate_cod) && val.rate_cod != oldVal.rate_cod) {
                        this.$eventHub.$emit("setRoomTypRateCod", {
                            rateCod: val.rate_cod
                        });
                        this.$eventHub.$emit("setUseTimeRateCod", {
                            rateCod: val.rate_cod
                        });
                    }
                },
                deep: true
            }
        },
        methods: {
            //打開單欄多語編輯
            editFieldMultiLang(fieldInfo) {
                this.$eventHub.$emit('openMultiLang', {
                    isOpenFieldMultiLang: true,
                    fieldInfo: fieldInfo,
                    singleData: this.singleData
                });
            },
            initData() {
                this.singleData = {};
                this.oriSingleData = {};
                this.fieldsData = [];
                this.oriFieldsData = [];
            },
            setGlobalStatus() {
                this.$store.dispatch("setStatus", {
                    gb_isCreateStatus: this.isCreateStatus,
                    gb_isEditStatus: this.isEditStatus
                });
            },
            setGlobalRateCod() {
                this.$store.dispatch("setRateCod", {
                    gs_rateCod: this.singleData.rate_cod,
                    gs_oriRateCod: this.oriSingleData.rate_cod
                });
            },
            setTabStatus(tabName) {
                let self = this;

                _.each(this.tabStatus, function (val, key) {
                    self.tabStatus[key] = false;
                });

                if (tabName != "") {
                    let ls_tabNae = _s.capitalize(tabName);
                    this.tabStatus["is" + ls_tabNae] = true;

                    this.showTabContent(tabName);
                }
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
                    prg_id: "PMS0810230",
                    page_id: 2,
                    tab_page_id: 1,
                    template_id: 'gridsingle'
                }, function (result) {
                    self.oriFieldsData = result.gsFieldsData;
                    self.fieldsData = _.values(_.groupBy(_.sortBy(self.oriFieldsData, "col_seq"), "row_seq"));
                    self.fetchRowData();
                });
            },
            fetchRowData() {
                let ls_apiUrl = "";
                let lo_params = {};
                if (this.isCreateStatus) {
                    ls_apiUrl = "/api/fetchDefaultSingleRowData";
                    lo_params = {
                        prg_id: "PMS0810230",
                        page_id: 2,
                        tab_page_id: 1
                    };
                }
                else if (this.isEditStatus) {
                    ls_apiUrl = "/api/fetchSinglePageFieldData";
                    lo_params = {
                        prg_id: "PMS0810230",
                        page_id: 2,
                        tab_page_id: 1,
                        template_id: "gridsingle",
                        searchCond: {rate_cod: this.rowData.rate_cod}
                    };
                }
                $.post(ls_apiUrl, lo_params).then(result => {
                    this.singleData = this.isCreateStatus ? result.gsDefaultData : result.gsMnData.rowData[0];
                    this.oriSingleData = this.isCreateStatus ? JSON.parse(JSON.stringify(result.gsDefaultData)) : JSON.parse(JSON.stringify(result.gsMnData.rowData[0]));
                    this.isLoadingDialog = false;
                    this.setGlobalRateCod();
                    this.tabName = "roomTyp";
                    this.isUseTime = true;
                    this.isUseTime = false;
                });
            },
            chkFieldRule(ui_field_name, rule_func_name) {
                if (rule_func_name === "" || !this.$parent.isModifiable) {
                    return;
                }
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

                if (!_.isEmpty(rule_func_name.trim())) {
                    let postData = {
                        prg_id: "PMS0810230",
                        rule_func_name: rule_func_name,
                        validateField: ui_field_name,
                        singleRowData: la_singleData,
                        oriSingleData: la_oriSingleData
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
                                            }
                                            else {
                                                if (!_.isUndefined(result.effectValues) && _.size(result.effectValues) > 0) {
                                                    self.singleData = _.extend(self.singleData, result.effectValues);
                                                }
                                            }
                                        });
                                    }
                                }
                            }
                        }
                        else {
                            alert(result.errorMsg);
                        }
                        //連動帶回的值
                        if (!_.isUndefined(result.effectValues) && _.size(result.effectValues) > 0) {
                            self.singleData = _.extend(self.singleData, result.effectValues);
                            self.chgSingleData = JSON.parse(JSON.stringify(self.singleData));
                        }
                    });
                }
            },
            doConvertData() {
                let lo_params = {
                    page_id: this.oriFieldsData[0].page_id,
                    tab_page_id: this.oriFieldsData[0].tab_page_id,
                    event_time: moment().format()
                }
                this.singleData = _.extend(this.singleData, lo_params);
                this.oriSingleData = _.extend(this.oriSingleData, lo_params);
                //將主檔資料放至Vuex
                this.$store.dispatch("setMnSingleData", {
                    go_mnSingleData: this.singleData,
                    go_mnOriSingleData: this.oriSingleData
                });
            },
            dataValidate() {
                var self = this;
                var lo_checkResult = true;

                // 單筆資料檢查
                for (let i = 0; i < this.oriFieldsData.length; i++) {
                    let lo_field = this.oriFieldsData[i];
                    //必填
                    if (lo_field.requirable == "Y" && lo_field.modificable != "N" && lo_field.ui_type != "checkbox") {
                        lo_checkResult = go_validateClass.required(self.singleData[lo_field.ui_field_name], lo_field.ui_display_name);
                        if (lo_checkResult.success == false) {
                            break;
                        }
                    }
                    //有format
                    if (lo_field.format_func_name.validate != "" && !_.isUndefined(go_validateClass[lo_field.format_func_name.validate])) {
                        lo_checkResult = go_validateClass[lo_field.format_func_name.validate](self.singleData[lo_field.ui_field_name], lo_field.ui_display_name);
                        if (lo_checkResult.success == false) {
                            break;
                        }
                    }

                }

                return lo_checkResult;
            },
            doSaveGrid() {
                let self = this;
                this.isLoadingDialog = true;
                this.loadingText = "saving";
                this.doConvertData();

                var lo_chkResult = this.dataValidate();
                if (lo_chkResult.success == false) {
                    alert(lo_chkResult.msg);
                    this.isLoadingDialog = false;
                }
                else {
                    try {
                        this.$store.dispatch("doSaveAllData").then(result => {
                            if (result.success) {
                                this.isLoadingDialog = false;
                                alert("save success");
                                $("#PMS0810230SingleGrid").dialog('close');
                            }
                            else {
                                this.isLoadingDialog = false;
                                alert(result.errorMsg);
                            }
                        }, err => {
                            this.isLoadingDialog = false;
                            alert(err)
                        });
                    }
                    catch (err) {
                        alert(err);
                        this.isLoadingDialog = false;
                    }
                }
            },
            doOpenUseTime() {
                let self = this;
                this.isUseTime = true;
                var dialog = $("#useTimeDialog").removeClass('hide').dialog({
                    modal: true,
                    title: go_i18nLang.program.PMS0810230.useTime,
                    title_html: true,
                    width: 700,
                    maxwidth: 1920,
                    dialogClass: "test",
                    resizable: true,
                    onBeforeClose() {
                        self.isUseTime = false;
                    }
                });
            },
            doOpenRateList() {
                var dialog = $("#rateListDialog").removeClass('hide').dialog({
                    modal: true,
                    title: "期間一覽表",
                    title_html: true,
                    width: 1000,
                    maxwidth: 1920,
                    height: 750,
//                autoOpen: true,
                    dialogClass: "test",
                    resizable: true
                });
            },
            doCloseDialog() {
                this.initData();
                this.rowData = {};
                this.tabName = "";
                $("#PMS0810230SingleGrid").dialog('close');
            }
        }
    }
</script>