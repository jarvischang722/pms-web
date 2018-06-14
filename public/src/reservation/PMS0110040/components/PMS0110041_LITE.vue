<template>
    <div id="PMS0110041Lite" class="hide padding-5" style="top: 50px !important;">
        <div class="businessCompanyData">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right">
                            <!-------- tabPage -------->
                            <div style="position: relative;">
                                <div class="resvTabs-topTxt">
                                    <div class="resvTabs-content">
                                        <template v-for="(fields,key) in fieldsDataLeft" v-if="key == 0">
                                            <template v-for="field in fields">
                                                <span class="subT">{{field.ui_display_name}}:</span>
                                                <template v-if="field.ui_type=='select'">
                                                    <!-- 下拉選單 -->
                                                    <bac-select v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                                class="input-medium resvCard-xs"
                                                                :style="{width:field.width + 'px'}"
                                                                v-model="orderMnSingleData[field.ui_field_name]"
                                                                :data-display="field.selectDataDisplay "
                                                                :data="field.selectData"
                                                                is-qry-src-before="Y" value-field="value" text-field="display"
                                                                @update:v-model="val => orderMnSingleData[field.ui_field_name] = val"
                                                                :default-val="orderMnSingleData[field.ui_field_name]" :field="field"
                                                                :disabled="field.modificable == 'N'|| !isModifiable ||
                                                    (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                    </bac-select>
                                                </template>
                                                <template v-else>
                                                    <span class="subCon">{{orderMnSingleData[field.ui_field_name]}}</span>
                                                </template>
                                            </template>
                                        </template>
                                    </div>
                                </div>
                            </div>
                            <!--order mn&guest mn 單筆-->
                            <div class="easyui-tabs easyUi-custom1 guestHoliday" style="overflow-y: auto; width: 100%;">
                                <div title="Reservation" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <div class="main-content-data">
                                                <!-- left block -->
                                                <div class="pull-left">
                                                    <template v-for="(fields,key) in fieldsDataLeft" v-if="key > 0">
                                                        <div class="grid">
                                                            <div class="grid-item" v-for="field in fields">
                                                                <label v-if="field.visiable == 'Y' && field.ui_type != 'button'  && field.ui_type != 'checkbox'"
                                                                       :style="{width:field.label_width + 'px' , height:field.height + 'px'}">
                                                                    <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                                                    <span>{{ field.ui_display_name }}</span>
                                                                </label>
                                                                <template v-if="key <= 3">
                                                                    <input type="text" v-model="guestMnRowsData4Single[field.ui_field_name]"
                                                                           v-if="field.visiable == 'Y' &&  field.ui_type == 'text'"
                                                                           :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                           :required="field.requirable == 'Y'" min="0"
                                                                           :maxlength="field.ui_field_length"
                                                                           :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                           :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">

                                                                    <!-- 下拉選單 -->
                                                                    <bac-select v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                                                :class="{'input_sta_required' : field.requirable == 'Y' }"
                                                                                :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                                v-model="guestMnRowsData4Single[field.ui_field_name]"
                                                                                :data-display="field.selectDataDisplay "
                                                                                :data="field.selectData"
                                                                                is-qry-src-before="Y" value-field="value" text-field="display"
                                                                                @update:v-model="val => guestMnRowsData4Single[field.ui_field_name] = val"
                                                                                :default-val="guestMnRowsData4Single[field.ui_field_name]" :field="field"
                                                                    >
                                                                    </bac-select>

                                                                    <!--selectgrid-->
                                                                    <bac-select-grid v-if="field.visiable == 'Y' && field.ui_type == 'selectgrid'"
                                                                                     :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                                     :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                                     v-model="guestMnRowsData4Single[field.ui_field_name]"
                                                                                     :columns="field.selectData.columns"
                                                                                     :data="field.selectData.selectData" :field="field"
                                                                                     :is-qry-src-before="field.selectData.isQrySrcBefore"
                                                                                     :id-field="field.selectData.value"
                                                                                     :text-field="field.selectData.display"
                                                                                     @update:v-model="val => guestMnRowsData4Single[field.ui_field_name] = val"
                                                                                     :default-val="guestMnRowsData4Single[field.ui_field_name]"
                                                                                     :disabled="field.modificable == 'N'|| !isModifiable ||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                    </bac-select-grid>

                                                                    <!--按鈕-->
                                                                    <button @click="buttonFunction(field)"
                                                                            class="btn btn-sm btn-primary btn-white btn-sm-font2"
                                                                            v-if="field.visiable == 'Y' && field.ui_type == 'button'">
                                                                        {{field.ui_display_name}}
                                                                    </button>
                                                                </template>
                                                                <template v-else>
                                                                    <!--checkbox-->
                                                                    <div v-if="field.visiable == 'Y' && field.ui_type == 'checkbox'" style="margin-left: 87px;">
                                                                        <input style="margin-top: 5px;"
                                                                               v-model="orderMnSingleData[field.ui_field_name]" type="checkbox"
                                                                               :required="field.requirable == 'Y'" :maxlength="field.ui_field_length"
                                                                               :disabled="field.modificable == 'N'|| !isModifiable ||
                                                (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus) ">
                                                                        <label style="width:auto" v-if="field.visiable == 'Y' && field.ui_type == 'checkbox'">
                                                                            <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                                                            <span>{{ field.ui_display_name }}</span>
                                                                        </label>
                                                                    </div>
                                                                    <!-- 下拉選單 -->
                                                                    <bac-select v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                                                :class="{'input_sta_required' : field.requirable == 'Y' }"
                                                                                :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                                v-model="orderMnSingleData[field.ui_field_name]"
                                                                                :data-display="field.selectDataDisplay "
                                                                                :data="field.selectData"
                                                                                is-qry-src-before="Y" value-field="value" text-field="display"
                                                                                @update:v-model="val => orderMnSingleData[field.ui_field_name] = val"
                                                                                :default-val="orderMnSingleData[field.ui_field_name]" :field="field"
                                                                                :disabled="field.modificable == 'N'|| !isModifiable ||
                                                      (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                    </bac-select>

                                                                    <!--  textarea -->
                                                                    <textarea v-if="field.visiable == 'Y' && field.ui_type == 'textarea'"
                                                                              v-model="orderMnSingleData[field.ui_field_name]"
                                                                              class="numStyle-none" rows="4"
                                                                              :style="{width:field.width + 'px'}" style="resize: none;"
                                                                              :required="field.requirable == 'Y'"
                                                                              :maxlength="field.ui_field_length"
                                                                              :disabled="field.modificable == 'N'|| !isModifiable ||
                                                      (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                    </textarea>
                                                                </template>
                                                            </div>
                                                        </div>
                                                        <div class="border-double1" v-if="key == 3"></div>
                                                    </template>
                                                </div>
                                                <!-- right block -->
                                                <div class="pull-left">
                                                    <template v-for="(fields,key) in fieldsDataRight">
                                                        <div class="grid">
                                                            <div class="grid-item" v-for="field in fields">
                                                                <label v-if="field.visiable == 'Y' && field.ui_type != 'checkbox'"
                                                                       :style="{width:field.label_width + 'px' , height:field.height + 'px'}">
                                                                    <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                                                    <span>{{ field.ui_display_name }}</span>
                                                                </label>

                                                                <!-- 下拉選單 -->
                                                                <bac-select v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                                            :class="{'input_sta_required' : field.requirable == 'Y' }"
                                                                            :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                            v-model="orderMnSingleData[field.ui_field_name]"
                                                                            :data-display="field.selectDataDisplay "
                                                                            :data="field.selectData"
                                                                            is-qry-src-before="Y" value-field="value" text-field="display"
                                                                            @update:v-model="val => orderMnSingleData[field.ui_field_name] = val"
                                                                            :default-val="orderMnSingleData[field.ui_field_name]" :field="field">
                                                                </bac-select>

                                                                <!--selectgrid-->
                                                                <bac-select-grid v-if="field.visiable == 'Y' && field.ui_type == 'selectgrid'"
                                                                                 :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                                 :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                                 v-model="orderMnSingleData[field.ui_field_name]"
                                                                                 :columns="field.selectData.columns"
                                                                                 :data="field.selectData.selectData" :field="field"
                                                                                 :is-qry-src-before="field.selectData.isQrySrcBefore"
                                                                                 :id-field="field.selectData.value"
                                                                                 :text-field="field.selectData.display"
                                                                                 @update:v-model="val => orderMnSingleData[field.ui_field_name] = val"
                                                                                 :default-val="orderMnSingleData[field.ui_field_name]"
                                                                                 :disabled="field.modificable == 'N'|| !isModifiable ||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                </bac-select-grid>

                                                                <!--按鈕-->
                                                                <div class="pull-left" v-if="field.visiable == 'Y' && field.ui_type == 'button'">
                                                                    <i class="moreClick fa fa-ellipsis-h"
                                                                       @click="buttonFunction(field)"></i>
                                                                </div>

                                                                <input type="text" v-model="orderMnSingleData[field.ui_field_name]"
                                                                       v-if="field.visiable == 'Y' &&  field.ui_type == 'text'"
                                                                       :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                       :class="{'input_sta_required' : field.requirable == 'Y', 'text-right' : field.ui_type == 'number'}"
                                                                       :required="field.requirable == 'Y'" min="0"
                                                                       :maxlength="field.ui_field_length"
                                                                       :disabled="field.modificable == 'N'|| (field.modificable == 'I') || (field.modificable == 'E')">
                                                            </div>
                                                        </div>
                                                        <div class="border-double1" v-if="key == 3"></div>
                                                    </template>
                                                </div>
                                            </div><!--main-content-data-->
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                            <!--/.order mn&guest mn 單筆-->
                            <!-------- /.tabPage -------->
                            <div class="space-6"></div>
                            <!--order dt 多筆&單筆-->
                            <div>
                                <!--多筆-->
                                <div class="col-xs-12 col-sm-12">
                                    <div class="row">
                                        <div class="main-content-data">
                                            <div>
                                                <!--訂房卡資料table-->
                                                <div class="container_12 divider">
                                                    <div class="grid_12 fixed-table-container" style="height: 132px;">
                                                        <table class="fancyTable themeTable treeControl custom-table"
                                                               id="resvSingleTable" cellpadding="0" cellspacing="0">
                                                            <thead>
                                                            <tr>
                                                                <th class="text-center ca-headerTitle height-fntThead rp-first-th">
                                                                    <i class="fa fa-plus green" @click="appendRow"></i>
                                                                </th>
                                                                <template v-for="field in orderDtFieldsData4table">
                                                                    <th v-if="field.visiable == 'Y'"
                                                                        :style="{width: field.width + 'px'}">
                                                                        {{field.ui_display_name}}
                                                                    </th>
                                                                </template>
                                                            </tr>
                                                            </thead>
                                                            <tbody>
                                                            <template v-for="values in orderDtRowsData4table">
                                                                <tr v-for="singleData in values">
                                                                    <td class="text-center">
                                                                        <i class="fa fa-minus red" @click="removeRow"></i>
                                                                    </td>
                                                                    <template v-for="field in orderDtFieldsData4table">
                                                                        <td class="text-left input-noEdit" :style="{width:field.width + 'px'}"
                                                                            v-if="field.visiable == 'Y' && field.ui_type=='label'">
                                                                            {{singleData[field.ui_field_name]}}
                                                                        </td>
                                                                        <td class="text-left" v-if="field.visiable == 'Y' && field.ui_type=='text'">
                                                                            <input type="text" v-model="singleData[field.ui_field_name]"
                                                                                   :style="{width:field.width + 'px'}"
                                                                                   :required="field.requirable == 'Y'" min="0"
                                                                                   :maxlength="field.ui_field_length" class="selectHt"
                                                                                   :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                                   :disabled="field.modificable == 'N'|| !isModifiable ||
                                                            (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                        </td>
                                                                        <td class="text-left" v-if="field.visiable == 'Y' && field.ui_type=='select'">
                                                                            <bac-select :field="field" :style="{width:field.width + 'px'}"
                                                                                        v-model="singleData[field.ui_field_name]" :data="field.selectData"
                                                                                        is-qry-src-before="Y" value-field="value" text-field="display"
                                                                                        @update:v-model="val => singleData[field.ui_field_name] = val"
                                                                                        :default-val="singleData[field.ui_field_name] || field.defaultVal"
                                                                                        class="el-select-ht selectHt" style="height: 25px;"
                                                                                        :disabled="field.modificable == 'N'|| !isModifiable ||
                                                            (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                            </bac-select>
                                                                        </td>
                                                                        <td class="text-left" v-if="field.visiable == 'Y' && field.ui_type=='date'">
                                                                            <!-- 日期時間選擇器 -->
                                                                            <el-date-picker v-model="singleData[field.ui_field_name]" type="date"
                                                                                            :disabled="field.modificable == 'N'|| !isModifiable ||
                                                            (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                                                                            class="date-wt input_sta_required" format="yyyy/MM/dd"
                                                                                            :style="{width:field.width + 'px'}"
                                                                                            :editable="false" :clearable="false"
                                                                            >
                                                                            </el-date-picker>
                                                                        </td>
                                                                        <td class="text-left" v-if="field.visiable == 'Y' && field.ui_type=='number'">
                                                                            <!--number 金額顯示format-->
                                                                            <input type="text" v-model="singleData[field.ui_field_name]"
                                                                                   :style="{width:field.width + 'px'}" class="text-right selectHt"
                                                                                   :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                                   :disabled="field.modificable == 'N'|| !isModifiable ||
                                                            (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                        </td>
                                                                        <td class="text-left td-more" style="height: 26px;"
                                                                            v-if="field.visiable == 'Y' && field.ui_type=='button'">
                                                                            <input type="text" v-model="singleData[field.ui_field_name]"
                                                                                   :style="{width:field.width + 'px'}"
                                                                                   :required="field.requirable == 'Y'" min="0"
                                                                                   :maxlength="field.ui_field_length"
                                                                                   :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                                   class="selectHt pull-left wt-input"
                                                                                   :disabled="field.modificable == 'N'|| !isModifiable ||
                                                            (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                                                            >
                                                                            <i class="moreClick fa fa-ellipsis-h choiceRmPrice pull-left"></i>
                                                                        </td>
                                                                    </template>
                                                                </tr>
                                                            </template>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                                <!--/訂房卡資料table-->
                                            </div>
                                            <!--房價總額-->
                                            <div class="resvCard-data">
                                                <div class="pull-right">
                                                    <template v-for="(fields, index) in orderDtFieldsData">
                                                        <template v-if="index == 0">
                                                            <template v-for="field in fields">
                                                                <span>{{field.ui_display_name}}:<span class="font-lg">{{orderDtRowsData4Single[field.ui_field_name]}}</span></span>
                                                            </template>
                                                        </template>
                                                    </template>
                                                </div>
                                            </div>
                                            <!--/.房價總額-->
                                        </div><!--main-content-data-->
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                                <!--/.多筆-->
                                <div class="space-4"></div>
                                <!--單筆-->
                                <div class="col-xs-12 col-sm-12">
                                    <div class="row">
                                        <div class="main-content-data borderFrame">
                                            <template v-for="(fields, index) in orderDtFieldsData">
                                                <div v-if="index > 0" class="grid">
                                                    <div v-for="field in fields" class="grid-item">
                                                        <label v-if="field.visiable == 'Y'"
                                                               :style="{width:field.label_width + 'px' , height:field.height + 'px'}">
                                                            <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                                            <span>{{ field.ui_display_name }}</span>
                                                        </label>

                                                        <input type="text" v-model="orderDtRowsData4Single[field.ui_field_name]"
                                                               v-if="field.visiable == 'Y' && field.label_width != 0 && field.ui_type == 'text'"
                                                               :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                               :required="field.requirable == 'Y'" min="0"
                                                               :maxlength="field.ui_field_length"
                                                               :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                               :disabled="field.modificable == 'N'|| !isModifiable ||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                        <input type="text" style="margin-left: -12px;"
                                                               v-else-if="field.visiable == 'Y' && field.label_width == 0 && field.ui_type == 'text'"
                                                               :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                               :required="field.requirable == 'Y'" min="0"
                                                               :maxlength="field.ui_field_length"
                                                               :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                               :disabled="field.modificable == 'N'|| !isModifiable ||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">

                                                        <bac-select v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                                    :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                    v-model="orderDtRowsData4Single[field.ui_field_name]"
                                                                    :data="field.selectData"
                                                                    is-qry-src-before="Y" value-field="value" text-field="display"
                                                                    @update:v-model="val => orderDtRowsData4Single[field.ui_field_name] = val"
                                                                    :default-val="orderDtRowsData4Single[field.ui_field_name]" :field="field"
                                                                    :disabled="field.modificable == 'N'|| !isModifiable ||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                        </bac-select>
                                                    </div>
                                                </div>
                                            </template>
                                        </div>
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                                <!--/.單筆-->
                            </div>
                            <!--/.order dt 多筆&單筆-->
                        </div>
                    </div>
                    <!--按鈕-->
                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <!-- id ="resv_changeTxt" 訂房卡button 文字轉換 -->
                                        <!--<button id ="resv_changeTxt" class="btn btn-primary btn-white padding-lg btn-defaultWidth"-->
                                        <!--role="button">Waiting</button>-->
                                        <div class="btn-group btn-defaultWidth  chgText-effect">
                                            <button data-toggle="dropdown"
                                                    class="btn btn-primary btn-white btn-defaultWidth dropdown-toggle"
                                                    aria-expanded="false">

                                                <span class="dpShowValue" style="font-weight: normal;">Waiting</span>
                                                <span class="ace-icon fa fa-angle-down icon-on-right"></span>
                                            </button>

                                            <ul class="dropdown-menu dropdown-info dropdown-menu-right dpUIList">
                                                <li><a href="#">等待</a></li>
                                                <li class="cancelRm"><a href="#">取消</a></li>
                                                <li><a href="#">訂房</a></li>
                                                <li><a href="#">詢價</a></li>
                                            </ul>
                                        </div> <!-- /.btn-group -->
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth is-save"
                                                role="button">儲存
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">新增
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">複製
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth resv_deposits"
                                                role="button">訂金資料
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth resvOption"
                                                role="button">其他選項
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth resv_rateDetail"
                                                role="button">費用列表
                                        </button>
                                    </li>

                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth foCnt_roomAssign"
                                                role="button">排房
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth resv_guestDetail"
                                                role="button">訂房資料
                                        </button>
                                    </li>

                                    <li>
                                        <button class="btn btn-primary btn-defaultWidth resvPickUp-btn border-width-1"
                                                role="button">接送機
                                            <i class="fa fa-check white"></i>
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
                    <!--/.按鈕-->
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>
    const gs_prgId = 'PMS0110041';

    export default {
        name: 'pms0110041-lite',
        props: ["rowData", "isCreateStatus", "isEditStatus", "isModifiable"],
        updated() {
            $("#resvSingleTable").tableHeadFixer({"left": 1});
        },
        data() {
            return {
                fieldsDataLeft: [],               //頁面顯示欄位資料
                fieldsDataRight: [],              //頁面顯示欄位資料
                oriOrderMnFieldsData: [],         //原始order mn 欄位資料
                orderMnSingleData: {},              //order mn 資料
                oriOrderMnRowsData: {},           //單筆 原始order mn 欄位資料
                orderDtFieldsData: [],            //單筆 order dt 欄位資料
                oriOrderDtFieldsData: [],         //單筆 原始order dt 欄位資料
                orderDtRowsData4Single: {},       //單筆 order dt 資料
                orderDtFieldsData4table: [],      //多筆 order dt 欄位資料
                orderDtRowsData4table: [],        //多筆 order dt 資料
                oriOrderMDtRowsData4table: [],    //多筆 原始order dt 資料
                oriGuestMnFieldsData: [],         //原始guest mn 欄位資料
                guestMnRowsData: [],              //guest mn 資料
                oriGuestMnRowsData: [],           //原始guest mn 欄位資料
                guestMnRowsData4Single: {},       //單筆 guest mn 資料
                isLoadingDialog: false,           //是否載入完畢
            }
        },
        watch: {
            rowData(val) {
                if (!_.isEmpty(val)) {
                    this.initTmpCUD();
                    this.isLoadingDialog = true;
                    this.fetchFieldsData();
                }
            }
        },
        methods: {
            initTmpCUD() {
                this.fieldsDataLeft = [];
                this.fieldsDataRight = [];
                this.oriOrderMnFieldsData = [];
                this.orderMnSingleData = {};
                this.oriOrderMnRowsData = {};
                this.orderDtFieldsData = [];
                this.oriOrderDtFieldsData = [];
                this.orderDtRowsData4Single = {};
                this.orderDtFieldsData4table = [];
                this.orderDtRowsData4table = [];
                this.oriOrderMDtRowsData4table = [];
                this.oriGuestMnFieldsData = [];
                this.guestMnRowsData = [];
                this.oriGuestMnRowsData = [];
                this.guestMnRowsData4Single = {};
            },
            async fetchFieldsData() {
                this.isLoadingDialog = true;
                try {
                    //取單筆orderMn欄位資料
                    let lo_orderMnFieldsData = await new Promise((resolve, reject) => {
                        BacUtils.doHttpPostAgent("/api/fetchOnlySinglePageFieldData", {
                            prg_id: gs_prgId,
                            page_id: 1,
                            tab_page_id: 12
                        }, (result) => {
                            resolve(result);
                        });
                    });
                    this.oriOrderMnFieldsData = lo_orderMnFieldsData.gsFieldsData;
                    //取單筆orderDt欄位資料
                    let lo_orderDtFieldsData = await new Promise((resolve, reject) => {
                        BacUtils.doHttpPostAgent("/api/fetchOnlySinglePageFieldData", {
                            prg_id: gs_prgId,
                            page_id: 1,
                            tab_page_id: 13
                        }, (result) => {
                            resolve(result);
                        });
                    });
                    this.oriOrderDtFieldsData = lo_orderDtFieldsData.gsFieldsData;
                    //取單筆guestMn欄位資料
                    let lo_guestMnFieldsData = await new Promise((resolve, reject) => {
                        BacUtils.doHttpPostAgent("/api/fetchOnlySinglePageFieldData", {
                            prg_id: gs_prgId,
                            page_id: 1,
                            tab_page_id: 11
                        }, (result) => {
                            resolve(result);
                        });
                    });
                    this.oriGuestMnFieldsData = lo_guestMnFieldsData.gsFieldsData;
                    //取多筆orderDt欄位資料
                    let lo_orderDtDgFieldsData = await new Promise((resolve, reject) => {
                        BacUtils.doHttpPostAgent("/api/fetchOnlyDataGridFieldData", {
                            prg_id: gs_prgId,
                            page_id: 1,
                            tab_page_id: 1
                        }, (result) => {
                            resolve(result);
                        });
                    });
                    this.orderDtFieldsData4table = _.sortBy(lo_orderDtDgFieldsData.dgFieldsData, "col_seq");

                    //將單筆orderMn、guestMn欄位資料組成頁面上顯示
                    this.fieldsDataLeft = _.values(_.groupBy(_.sortBy(_.filter(_.union(this.oriOrderMnFieldsData, this.oriGuestMnFieldsData), (lo_fieldsData) => {
                        if (_.isUndefined(lo_fieldsData['col_seq'])) {
                            return;
                        }
                        else {
                            return lo_fieldsData['col_seq'].toString().substring(0, 1) == "1"
                        }
                    }), "col_seq"), "row_seq"));
                    this.fieldsDataRight = _.values(_.groupBy(_.sortBy(_.filter(_.union(this.oriOrderMnFieldsData, this.oriGuestMnFieldsData), (lo_fieldsData) => {
                        if (_.isUndefined(lo_fieldsData['col_seq'])) {
                            return;
                        }
                        else {
                            return lo_fieldsData['col_seq'].toString().substring(0, 1) == "2"
                        }
                    }), "col_seq"), "row_seq"));
                    this.orderDtFieldsData = _.values(_.groupBy(_.sortBy(this.oriOrderDtFieldsData, "col_seq"), "row_seq"));
                    await this.fetchRowData();
                }
                catch (err) {
                    console.log(err)
                }
            },
            async fetchRowData() {
                let ls_apiUrl = "";
                let lo_params = {};
                let lo_fetchSingleData = {};
                let lo_fetchOderDtData = {};
                //取 order mn 資料
                if (this.isCreateStatus) {
                    ls_apiUrl = "/api/fetchDefaultSingleRowData";
                    lo_params = {
                        prg_id: gs_prgId,
                        page_id: 1,
                        tab_page_id: 12
                    };
                }
                else if (this.isEditStatus) {
                    ls_apiUrl = "/api/fetchSinglePageFieldData";
                    lo_params = {
                        prg_id: gs_prgId,
                        page_id: 1,
                        tab_page_id: 12,
                        template_id: "gridsingle",
                        searchCond: {ikey: this.rowData.ikey}
                    };
                }

                lo_fetchSingleData = await new Promise((resolve, reject) => {
                    BacUtils.doHttpPostAgent(ls_apiUrl, lo_params, (result) => {
                        resolve(result);
                    });
                });
                if (lo_fetchSingleData.success) {
                    if (lo_fetchSingleData.gsMnData.rowData.length > 0) {
                        this.orderMnSingleData = lo_fetchSingleData.gsMnData.rowData[0];
                        this.oriOrderMnRowsData = JSON.parse(JSON.stringify(lo_fetchSingleData.gsMnData.rowData[0]));
                    }
                }
                else {
                    alert(lo_fetchSingleData.errorMsg);
                    return;
                }

                //取order dt 資料
                if (this.isEditStatus) {
                    let lo_doDefault = await new Promise((resolve, reject) => {
                        BacUtils.doHttpPostAgent("/api/chkFieldRule", {
                            rule_func_name: 'convert_oder_appraise_to_tmp',
                            ikey: this.rowData.ikey
                        }, (result) => {
                            resolve(result);
                        });
                    });

                    ls_apiUrl = "/api/fetchDgRowData";
                    lo_params = {
                        prg_id: gs_prgId,
                        page_id: 1,
                        tab_page_id: 1,
                        searchCond: {ikey: this.rowData.ikey}
                    };
                    lo_fetchOderDtData = await new Promise((resolve, reject) => {
                        BacUtils.doHttpPostAgent(ls_apiUrl, lo_params, (result) => {
                            resolve(result);
                        });
                    });
                    if (lo_fetchSingleData.success) {
                        this.oriOrderMDtRowsData4table = JSON.parse(JSON.stringify(lo_fetchOderDtData.dgRowData));
                        this.orderDtRowsData4table = _.groupBy(lo_fetchOderDtData.dgRowData, (lo_dgRowData) => {
                            return lo_dgRowData.order_sta && lo_dgRowData.days && lo_dgRowData.ci_dat && lo_dgRowData.co_dat && lo_dgRowData.rate_cod && lo_dgRowData.use_cod && lo_dgRowData.room_cod && lo_dgRowData.order_qnt;
                        });
                        this.orderDtRowsData4Single = _.first(this.orderDtRowsData4table[Object.keys(this.orderDtRowsData4table)[0]])
                        console.log(this.orderDtRowsData4Single);
                    }
                    else {
                        alert(lo_fetchOderDtData.errorMsg);
                    }
                }
            },
            buttonFunction(fieldData) {
                console.log(fieldData);
            },
            appendRow() {
            },
            removeRow() {
            }
        }
    }
</script>

<style>

</style>