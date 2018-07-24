<template>
    <div id="PMS0110041Lite" class="hide padding-5" style="top: 50px !important;">
        <div class="businessCompanyData" v-loading="isLoadingDialog" :element-loading-text="loadingText">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right">
                            <!-------- tabPage -------->
                            <!--欄位官網號碼, 訂房卡號, 確認狀態-->
                            <div style="position: relative;">
                                <div class="resvTabs-topTxt">
                                    <div class="resvTabs-content">
                                        <template v-for="(fields,key) in fieldsDataLeft" v-if="key == 0">
                                            <template v-for="field in fields">
                                                <span class="subT">{{field.ui_display_name}}:</span>
                                                <template v-if="field.ui_type=='select'">
                                                    <!-- 下拉選單 -->
                                                    <bac-select
                                                            v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                            class="input-medium resvCard-xs"
                                                            :style="{width:field.width + 'px'}"
                                                            v-model="orderMnSingleData[field.ui_field_name]"
                                                            :data-display="field.selectDataDisplay "
                                                            :data="field.selectData"
                                                            is-qry-src-before="Y" value-field="value"
                                                            text-field="display" :field="field"
                                                            @update:v-model="val => orderMnSingleData[field.ui_field_name] = val"
                                                            :default-val="orderMnSingleData[field.ui_field_name]"
                                                            @change="chkOrderMnFieldRule(field.ui_field_name,field.rule_func_name)"
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
                            <!--/.欄位官網號碼, 訂房卡號, 確認狀態-->
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
                                                                    <span v-if=" field.requirable == 'Y' "
                                                                          style="color: red;">*</span>
                                                                    <span>{{ field.ui_display_name }}</span>
                                                                </label>
                                                                <template v-if="key <= 3">
                                                                    <input type="text"
                                                                           v-model="guestMnRowsData4Single[field.ui_field_name]"
                                                                           v-if="field.visiable == 'Y' &&  field.ui_type == 'text'"
                                                                           :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                           :required="field.requirable == 'Y'" min="0"
                                                                           :maxlength="field.ui_field_length"
                                                                           :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                           @change="chkGuestMnFieldRule(field.ui_field_name,field.rule_func_name)"
                                                                           :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">

                                                                    <!-- 下拉選單 -->
                                                                    <bac-select
                                                                            v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                                            :class="{'input_sta_required' : field.requirable == 'Y' }"
                                                                            :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                            v-model="guestMnRowsData4Single[field.ui_field_name]"
                                                                            :data-display="field.selectDataDisplay "
                                                                            :data="field.selectData" :field="field"
                                                                            is-qry-src-before="Y" value-field="value"
                                                                            text-field="display"
                                                                            @update:v-model="val => guestMnRowsData4Single[field.ui_field_name] = val"
                                                                            :default-val="guestMnRowsData4Single[field.ui_field_name]"
                                                                            @change="chkGuestMnFieldRule(field.ui_field_name,field.rule_func_name)"
                                                                            :disabled="field.modificable == 'N'||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                                                    >
                                                                    </bac-select>

                                                                    <!--selectgrid-->
                                                                    <bac-select-grid
                                                                            v-if="field.visiable == 'Y' && field.ui_type == 'selectgrid'"
                                                                            :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                            :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                            v-model="guestMnRowsData4Single[field.ui_field_name]"
                                                                            :columns="field.selectData.columns"
                                                                            :data="field.selectData.selectData"
                                                                            :field="field"
                                                                            :is-qry-src-before="field.selectData.isQrySrcBefore"
                                                                            :id-field="field.selectData.value"
                                                                            :text-field="field.selectData.display"
                                                                            @update:v-model="val => guestMnRowsData4Single[field.ui_field_name] = val"
                                                                            :default-val="guestMnRowsData4Single[field.ui_field_name]"
                                                                            @change="chkGuestMnFieldRule(field.ui_field_name,field.rule_func_name)"
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
                                                                    <div v-if="field.visiable == 'Y' && field.ui_type == 'checkbox'"
                                                                         style="margin-left: 78px;">
                                                                        <input style="margin-top: 5px;"
                                                                               v-model="orderMnSingleData[field.ui_field_name]"
                                                                               type="checkbox"
                                                                               :required="field.requirable == 'Y'"
                                                                               :maxlength="field.ui_field_length"
                                                                               @change="chkOrderMnFieldRule(field.ui_field_name,field.rule_func_name)"
                                                                               :disabled="field.modificable == 'N'|| !isModifiable ||
                                                (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus) ">
                                                                        <label style="width:auto"
                                                                               v-if="field.visiable == 'Y' && field.ui_type == 'checkbox'">
                                                                            <span v-if=" field.requirable == 'Y' "
                                                                                  style="color: red;">*</span>
                                                                            <span>{{ field.ui_display_name }}</span>
                                                                        </label>
                                                                    </div>
                                                                    <!-- 下拉選單 -->
                                                                    <bac-select
                                                                            v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                                            :class="{'input_sta_required' : field.requirable == 'Y' }"
                                                                            :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                            v-model="orderMnSingleData[field.ui_field_name]"
                                                                            :data-display="field.selectDataDisplay "
                                                                            :data="field.selectData"
                                                                            is-qry-src-before="Y" value-field="value"
                                                                            text-field="display" :field="field"
                                                                            @update:v-model="val => orderMnSingleData[field.ui_field_name] = val"
                                                                            :default-val="orderMnSingleData[field.ui_field_name]"
                                                                            @change="chkOrderMnFieldRule(field.ui_field_name,field.rule_func_name)"
                                                                            :disabled="field.modificable == 'N'|| !isModifiable ||
                                                      (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                    </bac-select>

                                                                    <!--  textarea -->
                                                                    <textarea
                                                                            v-if="field.visiable == 'Y' && field.ui_type == 'textarea'"
                                                                            v-model="orderMnSingleData[field.ui_field_name]"
                                                                            class="numStyle-none" rows="4"
                                                                            :style="{width:field.width + 'px'}"
                                                                            style="resize: none;"
                                                                            :required="field.requirable == 'Y'"
                                                                            :maxlength="field.ui_field_length"
                                                                            @change="chkOrderMnFieldRule(field.ui_field_name,field.rule_func_name)"
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
                                                                    <span v-if=" field.requirable == 'Y' "
                                                                          style="color: red;">*</span>
                                                                    <span>{{ field.ui_display_name }}</span>
                                                                </label>

                                                                <!-- 下拉選單 -->
                                                                <bac-select
                                                                        v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                                        :class="{'input_sta_required' : field.requirable == 'Y' }"
                                                                        :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                        v-model="orderMnSingleData[field.ui_field_name]"
                                                                        :data-display="field.selectDataDisplay "
                                                                        :data="field.selectData"
                                                                        is-qry-src-before="Y" value-field="value"
                                                                        text-field="display" :field="field"
                                                                        @update:v-model="val => orderMnSingleData[field.ui_field_name] = val"
                                                                        :default-val="orderMnSingleData[field.ui_field_name]"
                                                                        @change="chkOrderMnFieldRule(field.ui_field_name,field.rule_func_name)"
                                                                        :disabled="field.modificable == 'N'|| !isModifiable ||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                </bac-select>

                                                                <!--selectgrid-->
                                                                <bac-select-grid
                                                                        v-if="field.visiable == 'Y' && field.ui_type == 'selectgrid'"
                                                                        :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                        :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                        v-model="orderMnSingleData[field.ui_field_name]"
                                                                        :columns="field.selectData.columns"
                                                                        :data="field.selectData.selectData"
                                                                        :field="field"
                                                                        :is-qry-src-before="field.selectData.isQrySrcBefore"
                                                                        :id-field="field.selectData.value"
                                                                        :text-field="field.selectData.display"
                                                                        @update:v-model="val => orderMnSingleData[field.ui_field_name] = val"
                                                                        :default-val="orderMnSingleData[field.ui_field_name]"
                                                                        @change="chkOrderMnFieldRule(field.ui_field_name,field.rule_func_name)"
                                                                        :disabled="field.modificable == 'N'|| !isModifiable ||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                </bac-select-grid>

                                                                <!--按鈕-->
                                                                <div class="pull-left"
                                                                     v-if="field.visiable == 'Y' && field.ui_type == 'button'">
                                                                    <i class="moreClick fa fa-ellipsis-h"
                                                                       @click="buttonFunction(field)"></i>
                                                                </div>

                                                                <input type="text"
                                                                       v-model="orderMnSingleData[field.ui_field_name]"
                                                                       v-if="field.visiable == 'Y' &&  field.ui_type == 'text'"
                                                                       :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                       :class="{'input_sta_required' : field.requirable == 'Y', 'text-right' : field.ui_type == 'number'}"
                                                                       :required="field.requirable == 'Y'" min="0"
                                                                       :maxlength="field.ui_field_length"
                                                                       @change="chkOrderMnFieldRule(field.ui_field_name,field.rule_func_name)"
                                                                       :disabled="field.modificable == 'N'|| !isModifiable ||
                                                                        (field.modificable == 'I') || (field.modificable == 'E')">
                                                            </div>
                                                        </div>
                                                        <div class="border-double1" v-if="key == 3"></div>
                                                    </template>
                                                </div>
                                            </div>
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
                                            <!--訂房卡資料table-->
                                            <div>
                                                <div class="container_12 divider">
                                                    <div class="grid_12 fixed-table-container"
                                                         :style="{height: tableHeight+'px'}">
                                                        <table class="fancyTable themeTable treeControl custom-table"
                                                               id="resvSingleTable" cellpadding="0" cellspacing="0">
                                                            <thead>
                                                            <tr>
                                                                <th class="text-center ca-headerTitle height-fntThead rp-first-th">
                                                                    <i class="fa fa-plus green"
                                                                       :class="{'pointer': isModifiable}"
                                                                       @click="appendRow"></i>
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
                                                            <template
                                                                    v-for="(singleData, idx) in orderDtRowsData4table">
                                                                <tr>
                                                                    <td class="text-center">
                                                                        <i class="fa fa-minus red"
                                                                           :class="{'pointer': isModifiable}"
                                                                           @click="removeRow(idx)"></i>
                                                                    </td>
                                                                    <template v-for="field in orderDtFieldsData4table">
                                                                        <td class="text-left input-noEdit"
                                                                            :style="{width:field.width + 'px'}"
                                                                            v-if="field.visiable == 'Y' && field.ui_type=='label'"
                                                                            @click="editingOrderDtIdx = idx">
                                                                            {{singleData[field.ui_field_name]}}
                                                                        </td>
                                                                        <td class="text-left"
                                                                            @click="editingOrderDtIdx = idx"
                                                                            v-if="field.visiable == 'Y' && field.ui_type=='text'">
                                                                            <input type="number"
                                                                                   v-model="singleData[field.ui_field_name]"
                                                                                   :style="{width:field.width + 'px'}"
                                                                                   :required="field.requirable == 'Y'"
                                                                                   :maxlength="field.ui_field_length"
                                                                                   class="selectHt"
                                                                                   :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                                   @change="chkDgFieldRule(field.ui_field_name, field.rule_func_name)"
                                                                                   :disabled="field.modificable == 'N'|| !isModifiable ||
                                                                    (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                        </td>
                                                                        <td class="text-left"
                                                                            @click="editingOrderDtIdx = idx"
                                                                            v-if="field.visiable == 'Y' && field.ui_type=='select'">
                                                                            <bac-select :field="field"
                                                                                        :style="{width:field.width + 'px'}"
                                                                                        v-model="singleData[field.ui_field_name]"
                                                                                        :data="field.selectData"
                                                                                        is-qry-src-before="Y"
                                                                                        value-field="value"
                                                                                        text-field="display"
                                                                                        @update:v-model="val => singleData[field.ui_field_name] = val"
                                                                                        :default-val="singleData[field.ui_field_name] || field.defaultVal"
                                                                                        class="el-select-ht selectHt"
                                                                                        style="height: 25px;"
                                                                                        @change="chkDgFieldRule(field.ui_field_name, field.rule_func_name)"
                                                                                        :disabled="field.modificable == 'N'|| !isModifiable ||
                                                                    (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                            </bac-select>
                                                                        </td>
                                                                        <td class="text-left"
                                                                            @click="editingOrderDtIdx = idx"
                                                                            v-if="field.visiable == 'Y' && field.ui_type=='date'">
                                                                            <!-- 日期時間選擇器 -->
                                                                            <el-date-picker
                                                                                    v-model="singleData[field.ui_field_name]"
                                                                                    type="date"
                                                                                    :disabled="field.modificable == 'N'|| !isModifiable ||
                                                                    (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                                                                    class="date-wt input_sta_required"
                                                                                    format="yyyy/MM/dd"
                                                                                    :style="{width:field.width + 'px'}"
                                                                                    :editable="false" :clearable="false"
                                                                                    @change="chkDgFieldRule(field.ui_field_name, field.rule_func_name)"
                                                                            >
                                                                            </el-date-picker>
                                                                        </td>
                                                                        <td class="text-left"
                                                                            @click="editingOrderDtIdx = idx"
                                                                            v-if="field.visiable == 'Y' && field.ui_type=='number'">
                                                                            <!--number 金額顯示format-->
                                                                            <input type="text"
                                                                                   v-model="singleData[field.ui_field_name]"
                                                                                   :style="{width:field.width + 'px'}"
                                                                                   class="text-right selectHt"
                                                                                   :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                                   @change="chkDgFieldRule(field.ui_field_name, field.rule_func_name)"
                                                                                   :disabled="field.modificable == 'N'|| !isModifiable ||
                                                                    (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                        </td>
                                                                        <td class="text-left td-more"
                                                                            style="height: 26px;"
                                                                            @click="editingOrderDtIdx = idx"
                                                                            v-if="field.visiable == 'Y' && field.ui_type=='button'">
                                                                            <input type="text"
                                                                                   v-model="singleData[field.ui_field_name]"
                                                                                   :style="{width:field.width + 'px'}"
                                                                                   :required="field.requirable == 'Y'"
                                                                                   min="0"
                                                                                   :maxlength="field.ui_field_length"
                                                                                   :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                                   class="selectHt pull-left wt-input"
                                                                                   @change="chkDgFieldRule(field.ui_field_name, field.rule_func_name)"
                                                                                   :disabled="field.modificable == 'N'|| !isModifiable ||
                                                                    (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                            <i class="moreClick fa fa-ellipsis-h pull-left"
                                                                               @click="setSelectRateCodData()"></i>
                                                                        </td>
                                                                    </template>
                                                                </tr>
                                                            </template>
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                </div>
                                            </div>
                                            <!--/訂房卡資料table-->
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
                                                            <span v-if=" field.requirable == 'Y' "
                                                                  style="color: red;">*</span>
                                                            <span>{{ field.ui_display_name }}</span>
                                                        </label>

                                                        <input type="text"
                                                               v-model="orderDtRowsData4Single[field.ui_field_name]"
                                                               v-if="field.visiable == 'Y' && field.label_width != 0 && field.ui_type == 'text'"
                                                               :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                               :required="field.requirable == 'Y'" min="0"
                                                               :maxlength="field.ui_field_length"
                                                               :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                               @change="chkDgFieldRule(field.ui_field_name, field.rule_func_name)"
                                                               :disabled="field.modificable == 'N'|| !isModifiable ||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                        <input type="text" style="margin-left: -12px;"
                                                               v-model="orderDtRowsData4Single[field.ui_field_name]"
                                                               v-else-if="field.visiable == 'Y' && field.label_width == 0 && field.ui_type == 'text'"
                                                               :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                               :required="field.requirable == 'Y'" min="0"
                                                               :maxlength="field.ui_field_length"
                                                               :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                               @change="chkDgFieldRule(field.ui_field_name, field.rule_func_name)"
                                                               :disabled="field.modificable == 'N'|| !isModifiable ||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">

                                                        <bac-select
                                                                v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                                :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                v-model="orderDtRowsData4Single[field.ui_field_name]"
                                                                :data="field.selectData"
                                                                is-qry-src-before="Y" value-field="value"
                                                                text-field="display"
                                                                @update:v-model="val => orderDtRowsData4Single[field.ui_field_name] = val"
                                                                :default-val="orderDtRowsData4Single[field.ui_field_name]"
                                                                :field="field"
                                                                @change="chkDgFieldRule(field.ui_field_name, field.rule_func_name)"
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
                                        <!--todo 詢問晉偉如何使用-->
                                        <div class="btn-group btn-defaultWidth  chgText-effect">
                                            <button data-toggle="dropdown"
                                                    class="btn btn-primary btn-white btn-defaultWidth dropdown-toggle"
                                                    aria-expanded="false">
                                                <span class="dpShowValue" style="font-weight: normal;">
                                                    {{i18n_Lang.program.PMS0110041.changeOrderStatus}}
                                                </span>
                                                <span class="ace-icon fa fa-angle-down icon-on-right"></span>
                                            </button>

                                            <ul class="dropdown-menu dropdown-info dropdown-menu-right dpUIList">
                                                <li v-for="data in orderStatusSelectData">
                                                    <a @click="changeOrderSta(data)">{{data.display}}</a>
                                                </li>
                                            </ul>
                                        </div> <!-- /.btn-group -->
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth is-save"
                                                role="button" @click="doSave">儲存
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
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="doShowGuestDetail">訂房資料
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
                                                role="button" @click="doCloseDialog">離開
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
        <!--住客姓名-->
        <pms0210011
                :row-data="editingGuestMnData"
                :is-modifiable="isModifiable4GuestMn"
                :is-create-status="isCreate4GuestMn"
                :is-edit-status="isEdit4GuestMn"
        ></pms0210011>
        <!--/.住客姓名-->
        <!--訂房公司-->
        <pms0610020
                :row-data="editingCustMnData"
                :is-modifiable="isModifiable4CustMn"
                :is-create-status="isCreate4CustMn"
                :is-edit-status="isEdit4CustMn"
        ></pms0610020>
        <!--/.訂房公司-->
        <!-- 公帳號-->
        <public-account
                :row-data="orderMnSingleData"
        ></public-account>
        <!-- /.公帳號 -->
        <!-- 其他聯絡方式-->
        <tel-detail
                :row-data="orderMnSingleData"
        ></tel-detail>
        <!-- /.其他聯絡方式 -->
        <!--選擇房價-->
        <select-rate-cod
                :row-data="editingGroupOrderDtData"
                :open-module="openModule"
        ></select-rate-cod>
        <!--/.選擇房價-->
        <!--訂房資料-->
        <guest-detail
                :is-guest-detail="isOpenGuestDetail"
                :row-data="orderMnSingleData"
                :is-modifiable="isModifiable"
                :is-create-status="isCreateStatus"
                :is-edit-status="isEditStatus"
        ></guest-detail>
        <!--/.訂房資料-->
        <!--取消訂房原因-->
        <div id="cancelRm_dialog" class="hide padding-5" style="top: 20px;">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-10 col-sm-10">
                        <div class="row no-margin-right main-content-data">
                            <div class="grid">
                                <div class="grid-item">
                                    <label>取消原因代號</label>
                                    <select class="input-medium medium-c3-col2">
                                        <option value="1">0001/TYPHOON 颱風:天候因素/Y:是</option>
                                        <option value="2">0002/DOUBLE BOOKING 重複訂房TEST/N:否</option>
                                        <option value="2">0003/CHANGE SCHEDULE 改行程/N:否</option>
                                        <option value="2">0004/BOOKED OTHER HOTEL 訂了別的飯店/N:否</option>
                                        <option value="2">0005/家裡有事取消/Y:是</option>
                                        <option value="2">0006/價格因素/Y:是</option>
                                        <option value="2">0007/NoShow/N:否</option>
                                    </select>
                                </div>
                                <div class="grid-item">
                                    <label>說明</label>
                                    <input type="text" class="input-medium medium-c3-col2" disabled/>
                                </div>
                            </div>
                        </div><!--main-content-data-->
                        <div class="clearfix"></div>
                    </div>
                    <div class="col-xs-2 col-sm-2">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">離開
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
        <!--/.取消訂房原因-->
    </div>
</template>

<script>
    import alasql from 'alasql';
    import _s from 'underscore.string';

    import pms0210011 from '../../../frontDesk/PMS0210010/components/PMS0210011.vue';
    import pms0610020 from '../../../sales/PMS0610010/components/PMS0610020';
    import publicAccount from './publicAccount';
    import telDetail from './telDetail';
    import selectRateCod from './selectRateCod.vue';
    import guestDetail from './guestDetail';

    const gs_prgId = 'PMS0110041';

    export default {
        name: 'pms0110041-lite',
        components: {pms0210011, pms0610020, publicAccount, telDetail, selectRateCod, guestDetail},
        props: ["rowData", "isCreateStatus", "isEditStatus", "isModifiable"],
        created() {
            this.$eventHub.$on('clearData', (data) => {
                this.editingOrderDtIdx = undefined;
            });
            //取得order dt 房價資料
            this.$eventHub.$on('getOrderDtRateCod', (data) => {
                this.orderDtRowsData4table[this.editingOrderDtIdx].rate_cod = data.rateCodData.rate_cod;
                let lo_rateCodFiled = _.findWhere(this.orderDtFieldsData4table, {ui_field_name: 'rate_cod'});
                if (!_.isUndefined(lo_rateCodFiled)) {
                    this.chkDgFieldRule(lo_rateCodFiled.ui_field_name, lo_rateCodFiled.rule_func_name);
                }
            });
            //取得guest mn 資料
            this.$eventHub.$on("getGhistMnDataToOrder", (data) => {
                if (!_.isUndefined(this.guestMnRowsData4Single) && this.$store.state.orderMnModule.gs_openModule == "pms0110041_lite") {
                    let lo_cloneGuestMnData = JSON.parse(JSON.stringify(this.guestMnRowsData4Single));
                    let lo_ghistMnData = data.ghistMnData;
                    let lo_extendParam = {};
                    if (this.isCreate4GuestMn) {
                        lo_extendParam = {
                            airline_cod: lo_ghistMnData.airline_cod,
                            airmb_nos: lo_ghistMnData.airmb_nos,
                            alt_nam: lo_ghistMnData.gcust_cod + ":" + lo_ghistMnData.alt_nam,
                            athena_id: lo_ghistMnData.athena_id,
                            assign_sta: 'N',
                            car_nos: lo_ghistMnData.car_nos,
                            ccust_nam: lo_ghistMnData.ccust_nam,
                            ci_ser: 0,//todo  資料檔取得系統編號程式=>get_ci_ser
                            contry_cod: lo_ghistMnData.contry_cod,
                            createRow: 'Y',
                            first_nam: lo_ghistMnData.first_nam,
                            gcust_cod: lo_ghistMnData.gcust_cod,
                            guest_sta: 'E',
                            hotel_cod: userInfo.hotel_cod,
                            ikey: this.orderDtRowsData4Single.ikey,
                            ikey_seq_nos: this.orderDtRowsData4Single.ikey_seq_nos,
                            last_nam: lo_ghistMnData.last_nam,
                            master_sta: 'G',
                            precredit_amt: 0,
                            psngr_nos: 0,//todo 訂房時依訂房卡+psngr_nos捉最大值，由1開始
                            rent_amt: 0,
                            requst_rmk: lo_ghistMnData.requst_rmk,
                            role_cod: lo_ghistMnData.role_cod,
                            salute_cod: lo_ghistMnData.salute_cod,
                            serv_amt: 0,
                            system_typ: "HFD"
                        };
                    }
                    else {
                        lo_extendParam = {
                            airmb_nos: lo_ghistMnData.airmb_nos,
                            airline_cod: lo_ghistMnData.airline_cod,
                            alt_nam: lo_ghistMnData.gcust_cod + ":" + lo_ghistMnData.alt_nam,
                            car_nos: lo_ghistMnData.car_nos,
                            ccust_nam: lo_ghistMnData.ccust_nam,
                            contry_cod: lo_ghistMnData.contry_cod,
                            first_nam: lo_ghistMnData.first_nam,
                            last_nam: lo_ghistMnData.last_nam,
                            requst_rmk: lo_ghistMnData.requst_rmk,
                            role_cod: lo_ghistMnData.role_cod,
                            salute_cod: lo_ghistMnData.salute_cod,
                            vip_sta: lo_ghistMnData.vip_sta
                        };
                    }
                    this.guestMnRowsData4Single = _.extend(lo_cloneGuestMnData, lo_extendParam);
                }
            });
            //訂房明細開啟選擇rate cod頁面
            this.$eventHub.$on("setSelectRateCodData", (data) => {
                this.editingGroupOrderDtData = data.rowData;
                this.openModule = data.openModule;
                this.showRateCodDialog();
            });

            this.$eventHub.$on("setSelectGuestMnAltData", (data) => {
                let ls_gcustCod = data.rowData.gcust_cod || "";
                if (ls_gcustCod != "") {
                    this.editingGuestMnData = JSON.parse(JSON.stringify(data.rowData));
                    this.isCreate4GuestMn = false;
                    this.isEdit4GuestMn = true;
                }
                else {
                    this.editingGuestMnData = JSON.parse(JSON.stringify(data.rowData));
                    this.editingGuestMnData.gcust_cod = "";
                    this.isCreate4GuestMn = true;
                    this.isEdit4GuestMn = false;
                }
                this.showGhistMnDialog();
            });
        },
        mounted() {
            this.fetchUserInfo();
            this.loadingText = "Loading...";
            this.selectedOrderStatus = go_i18nLang.program.PMS0110041.orderStaN;
            this.orderStatusSelectData = [
                {display: go_i18nLang.program.PMS0110041.orderStaN, value: 'N'},
                {display: go_i18nLang.program.PMS0110041.orderStaW, value: 'W'},
                {display: go_i18nLang.program.PMS0110041.orderStaD, value: 'D'},
                {display: go_i18nLang.program.PMS0110041.orderStaT, value: 'T'}
            ];
        },
        updated() {
            $("#resvSingleTable").tableHeadFixer({"left": 1});
        },
        data() {
            return {
                i18n_Lang: go_i18nLang,                 //多語系
                userInfo: {},                           //使用者資訊
                isLoadingDialog: false,                 //是否正在載入
                loadingText: '',                        //載入的提示文字
                keyNos: '',                             //tmp_order_appraise key值
                isEffectFromRule: true,                 //是否由規則改變欄位資料

                oriOrderMnFieldsData: [],               //原始order mn 欄位資料
                oriGuestMnFieldsData: [],               //原始guest mn 欄位資料
                fieldsDataLeft: [],                     //頁面顯示欄位資料
                fieldsDataRight: [],                    //頁面顯示欄位資料
                orderDtFieldsData4table: [],            //多筆 order dt 欄位資料
                orderDtFieldsData: [],                  //單筆 order dt 欄位資料
                oriOrderDtFieldsData: [],               //單筆 原始order dt 欄位資料

                orderMnSingleData: {},                  //單筆order mn 資料
                oriOrderMnSingleData: {},               //單筆 原始order mn 資料
                beforeOrderMnSingleData: {},            //單筆 改變前order mn 資料

                orderDtRowsData4Single: {},             //單筆 order dt 資料
                orderDtRowsData: [],                    //多筆 order dt 資料
                oriOrderDtRowsData: [],                 //多筆 原始order dt 資料
                orderDtRowsData4table: [],              //多筆 order dt 資料(顯示)
                beforeOrderDtRowsData4Table: [],        //多筆 改變前order dt 資料
                groupOrderDtData: [],                   //group 的order dt 資料

                guestMnRowsData: [],                    //guest mn 資料
                oriGuestMnRowsData: [],                 //原始guest mn 資料
                guestMnRowsData4Single: {alt_nam: ""},  //單筆 guest mn 資料
                beforeGuestMnRowsData4Single: {},       //單筆 改變前guest mn 資料

                tableHeight: 34,                        //多筆table高度
                orderStatus: 'N',                       //訂房狀態
                orderStatusSelectData: [],              //訂房狀態選項
                editingOrderDtIdx: undefined,           //現在正在編輯的orderDt index

                editingGuestMnData: {},                 //正在編輯的 guest mn 資料
                isCreate4GuestMn: false,                //guest mn 中的alt name 是否為新增
                isEdit4GuestMn: false,                  //guest mn 中的alt name 是否為修改
                isModifiable4GuestMn: false,            //guest mn 中的alt name 是否可修改

                editingCustMnData: {},                  //正在編輯資料的acust_cod
                isCreate4CustMn: false,                 //guest mn 中的alt name 是否為新增
                isEdit4CustMn: false,                   //guest mn 中的alt name 是否為修改
                isModifiable4CustMn: false,             //guest mn 中的alt name 是否可修改

                editingGroupOrderDtData: {},            //正在編輯的多筆order dt 資料

                tmpCUD: {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                },
                openModule: "",                   //rate cod開啟選擇
                isOpenGuestDetail: false          //是否開啟訂房明細
            }
        },
        watch: {
            async rowData(val) {
                if (!_.isEmpty(val) && !_.isUndefined(val.ikey)) {
                    this.isLoadingDialog = true;
                    //清空資料
                    this.initData();
                    this.initTmpCUD();
                    //取單筆guest mn, 單筆order mn, 單筆order dt, 多筆order dt 欄位資料
                    await this.fetchAllFieldsData();
                    //取guest mn, order mn, order dt 資料
                    await this.fetchAllRowData();
                    this.isLoadingDialog = false;
                }
            },
            async editingOrderDtIdx(newVal, oldVal) {
                try {
                    this.orderDtRowsData4table[newVal] = this.orderDtRowsData4table[newVal] || {};
                    if (!_.isUndefined(newVal) && !_.isEmpty(this.orderDtRowsData4table[newVal])) {
                        //取得使用房型及計價房型下拉
                        await this.getRoomTypSelectData(this.orderDtRowsData4table[newVal]);

                        //處理guestMn 資料
                        if (!_.isUndefined(this.orderDtRowsData4table[newVal].ikey_seq_nos)) {
                            await this.getGuestMnData4single(this.orderDtRowsData4table[newVal].ikey_seq_nos);
                        }

                        //傭金欄位是否唯獨
                        await this.getCommisRateFiled(this.orderDtRowsData4table[newVal]);
                    }
                    if (newVal != oldVal && !_.isUndefined(oldVal) && !_.isUndefined(newVal)) {
                        let lo_editingRow = JSON.parse(JSON.stringify(this.orderDtRowsData4table[oldVal]));

                        //改變orderDtRowsData資料，除了間數以外的屬性，並重新group資料
                        this.setOrderDtRowData(lo_editingRow);

                        //計算group data所有的房價
                        await this.computeGroupOrderDtPrice(lo_editingRow);
                    }
                }
                catch (err) {
                    console.log(err)
                }
                //重新group orderDtRowsData
                this.convertDtDataToSingleAndTable(newVal, oldVal);
            },
            "orderMnSingleData.acust_nam"(val) {
                if (val != "") {
                    this.orderMnSingleData.acust_cod = val;
                }
            },
            orderDtRowsData4table: {
                async handler(val) {
                    if (!_.isUndefined(this.editingOrderDtIdx)) {
                        this.orderDtRowsData4Single = _.extend(this.orderDtRowsData4Single, val[this.editingOrderDtIdx]);
                        this.orderDtRowsData4Single.serv_tot = Number(val[this.editingOrderDtIdx].serv_amt) * val[this.editingOrderDtIdx].order_qnt;
                        this.orderDtRowsData4Single.rent_tot = Number(val[this.editingOrderDtIdx].rent_amt) * val[this.editingOrderDtIdx].order_qnt;
                        this.orderDtRowsData4Single.other_tot = Number(val[this.editingOrderDtIdx].other_tot) * val[this.editingOrderDtIdx].order_qnt;
                        this.orderDtRowsData4Single.sub_tot = Number(this.orderDtRowsData4Single.other_tot) + Number(this.orderDtRowsData4Single.serv_tot) + Number(this.orderDtRowsData4Single.rent_tot);

                        this.tableHeight = _.size(this.orderDtRowsData4table) > 4 ? 132 : 38 + 30 * _.size(this.orderDtRowsData4table);
                    }
                },
                deep: true
            },
            orderDtRowsData4Single: {
                handler(val) {
                    _.each(this.groupOrderDtData, (lo_groupData) => {
                        let ln_editIndex = _.findIndex(this.orderDtRowsData, {ikey_seq_nos: lo_groupData.ikey_seq_nos});
                        if (ln_editIndex > -1) {
                            this.orderDtRowsData[ln_editIndex] = _.extend(this.orderDtRowsData[ln_editIndex], {
                                source_typ: val.source_typ,
                                guest_typ: val.guest_typ,
                                commis_rat: val.commis_rat
                            });
                        }
                    });
                },
                deep: true
            },
            orderDtRowsData: {
                handler(val) {
                    let la_allRowData = JSON.parse(JSON.stringify(val));
                    _.each(la_allRowData, (lo_data) => {
                        if (lo_data.order === 'X') {
                            let ln_editIdx = _.findIndex(this.guestMnRowsData, {ikey_seq_nos: lo_data.ikey_seq_nos});
                            if (ln_editIdx > -1) {
                                this.guestMnRowsData[ln_editIdx].guest_sta = 'X';
                            }
                        }
                        else {
                            let ln_editIdx = _.findIndex(this.guestMnRowsData, {ikey_seq_nos: lo_data.ikey_seq_nos});
                            if (ln_editIdx > -1) {
                                this.guestMnRowsData[ln_editIdx].guest_sta = 'E';
                            }
                        }
                    });
                },
                deep: true
            }
        },
        methods: {
            fetchUserInfo() {
                BacUtils.doHttpPostAgent('/api/getUserInfo', (result) => {
                    if (result.success) {
                        this.userInfo = result.userInfo;
                    }
                });
            },
            initData() {
                this.editingOrderDtIdx = undefined;
                this.fieldsDataLeft = [];
                this.fieldsDataRight = [];
                this.oriOrderMnFieldsData = [];
                this.orderMnSingleData = {};
                this.oriOrderMnSingleData = {};
                this.beforeOrderMnSingleData = {};
                this.orderDtFieldsData = [];
                this.oriOrderDtFieldsData = [];
                this.orderDtRowsData4Single = {};
                this.orderDtFieldsData4table = [];
                this.orderDtRowsData4table = [];
                this.oriOrderDtRowsData = [];
                this.orderDtRowsData = [];
                this.oriGuestMnFieldsData = [];
                this.guestMnRowsData = [];
                this.oriGuestMnRowsData = [];
                this.guestMnRowsData4Single = {alt_nam: ""};
                this.isOpenGuestDetail = false;
                this.openModule = "";
            },
            initTmpCUD() {
                this.tmpCUD = {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                };
            },
            //取欄位資料
            async fetchFieldsData(apiUrl, param) {
                try {
                    return await BacUtils.doHttpPromisePostProxy(apiUrl, param).then((result) => {
                        return result;
                    }).catch(err => {
                        return {success: false, errMsg: err};
                    });
                }
                catch (err) {
                    console.log(err)
                }
            },
            async fetchAllFieldsData() {
                const ls_singleGridUrl = "/api/fetchOnlySinglePageFieldData";
                const ls_dataGridUrl = "/api/fetchOnlyDataGridFieldData";

                let [lo_guestMnFieldsData, lo_orderMnFieldsData, lo_orderDtFieldsData, lo_orderDtDgFieldsData] = await Promise.all([
                    this.fetchFieldsData(ls_singleGridUrl, {prg_id: gs_prgId, page_id: 1, tab_page_id: 11}),
                    this.fetchFieldsData(ls_singleGridUrl, {prg_id: gs_prgId, page_id: 1, tab_page_id: 12}),
                    this.fetchFieldsData(ls_singleGridUrl, {prg_id: gs_prgId, page_id: 1, tab_page_id: 13}),
                    this.fetchFieldsData(ls_dataGridUrl, {prg_id: gs_prgId, page_id: 1, tab_page_id: 1})
                ]);

                //取單筆guest mn, 單筆order mn, 單筆order dt, 多筆order dt 欄位資料
                this.oriGuestMnFieldsData = lo_guestMnFieldsData.gsFieldsData;
                this.oriOrderMnFieldsData = lo_orderMnFieldsData.gsFieldsData;
                this.oriOrderDtFieldsData = lo_orderDtFieldsData.gsFieldsData;
                _.each(lo_orderDtFieldsData.dgFieldsData, (lo_data, ln_idx) => {
                    lo_orderDtFieldsData.dgFieldsData[ln_idx].col_seq = Number(lo_data.col_seq);
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
            },
            async fetchDgRowData(param) {
                return await BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", param)
                    .then((result) => {
                        return result;
                    }).catch(err => {
                        return {success: false, errMsg: err};
                    });
            },
            async fetchAllRowData() {
                let ls_apiUrl = "";
                let lo_params = {};
                let lo_fetchSingleData = {};
                try {
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

                        //TODO 取單筆資料並沒有可以額外在做規則的流程, 因此直接在這做額外的規則(將order_appraise 轉到tmp_order_appraise)
                        let lo_doDefault = await BacUtils.doHttpPromisePostProxy("/api/chkFieldRule", {
                            rule_func_name: 'convert_oder_appraise_to_tmp',
                            ikey: this.rowData.ikey
                        }).then((result) => {
                            return result;
                        }).catch(err => {
                            return {success: false, errMsg: err};
                        });
                        if (lo_doDefault.success) {
                            this.keyNos = lo_doDefault.defaultValues.key_nos;
                        }
                        else {
                            alert(lo_doDefault.errorMsg);
                        }
                    }
                    lo_fetchSingleData = await await BacUtils.doHttpPromisePostProxy(ls_apiUrl, lo_params)
                        .then((result) => {
                            return result;
                        })
                        .catch(err => {
                            return {success: false, errMsg: err};
                        });
                    if (lo_fetchSingleData.success) {
                        if (this.isCreateStatus) {
                            this.orderMnSingleData = lo_fetchSingleData.gsDefaultData;
                            this.oriOrderMnSingleData = JSON.parse(JSON.stringify(lo_fetchSingleData.gsDefaultData));
                            this.keyNos = lo_fetchSingleData.gsDefaultData.key_nos;
                        }
                        else if (this.isEditStatus) {
                            if (lo_fetchSingleData.gsMnData.rowData.length > 0) {
                                lo_fetchSingleData.gsMnData.rowData[0].acust_nam = lo_fetchSingleData.gsMnData.rowData[0].acust_cod;
                                this.orderMnSingleData = lo_fetchSingleData.gsMnData.rowData[0];
                                this.oriOrderMnSingleData = JSON.parse(JSON.stringify(lo_fetchSingleData.gsMnData.rowData[0]));
                            }
                        }
                    }
                    else {
                        alert(lo_fetchSingleData.errorMsg);
                        return;
                    }

                    //取order dt 和guest mn 資料

                    if (this.isCreateStatus) {
                        //預設一筆order dt
                        this.appendRow();
                    }
                    else if (this.isEditStatus) {
                        //取所有此ikey的 guestMn、orderDt資料
                        let [lo_fetchGuestMnData, lo_fetchOrderDtData] = await Promise.all([
                            this.fetchDgRowData({
                                prg_id: gs_prgId,
                                page_id: 1,
                                tab_page_id: 11,
                                searchCond: {ikey: this.rowData.ikey}
                            }),
                            this.fetchDgRowData({
                                prg_id: gs_prgId,
                                page_id: 1,
                                tab_page_id: 1,
                                searchCond: {ikey: this.rowData.ikey}
                            })
                        ]);
                        //取guest mn資料
                        if (lo_fetchGuestMnData.success) {
                            _.each(lo_fetchGuestMnData.dgRowData, (lo_dgRowData, ln_idx) => {
                                let ls_altNam = JSON.parse(JSON.stringify(lo_dgRowData.alt_nam));
                                let ls_gcustCod = JSON.parse(JSON.stringify(lo_dgRowData.gcust_cod));
                                lo_fetchGuestMnData.dgRowData[ln_idx].alt_nam = ls_gcustCod + ":" + ls_altNam;
                                lo_fetchGuestMnData.dgRowData[ln_idx].page_id = 1;
                                lo_fetchGuestMnData.dgRowData[ln_idx].tab_page_id = 11;
                            });
                            this.guestMnRowsData = lo_fetchGuestMnData.dgRowData;
                            this.oriGuestMnRowsData = JSON.parse(JSON.stringify(lo_fetchGuestMnData.dgRowData));
                        }
                        else {
                            alert(lo_fetchGuestMnData.errorMsg);
                        }

                        //取order dt 資料
                        if (lo_fetchOrderDtData.success) {
                            _.each(lo_fetchOrderDtData.dgRowData, (lo_dgRowData) => {
                                lo_dgRowData.ci_dat = moment(lo_dgRowData.ci_dat).format("YYYY/MM/DD");
                                lo_dgRowData.co_dat = moment(lo_dgRowData.co_dat).format("YYYY/MM/DD");
                                lo_dgRowData.ci_dat_week = moment(lo_dgRowData.ci_dat).format('ddd');
                                lo_dgRowData.co_dat_week = moment(lo_dgRowData.co_dat).format('ddd');
                            });
                            this.oriOrderDtRowsData = JSON.parse(JSON.stringify(lo_fetchOrderDtData.dgRowData));
                            //所有的order dt 資料
                            this.orderDtRowsData = lo_fetchOrderDtData.dgRowData;

                            //將資料轉換成多筆和單筆的格式
                            if (this.orderDtRowsData.length > 0) {
                                this.editingOrderDtIdx = 0;
                                this.convertDtDataToSingleAndTable(this.editingOrderDtIdx, undefined);
                            }

                        }
                        else {
                            alert(lo_fetchOderDtData.errorMsg);
                        }
                    }
                    this.orderMnSingleData = _.extend(this.orderMnSingleData, {key_nos: this.keyNos});
                }
                catch (err) {
                    console.log(err)
                }
            },

            /**
             * 按鈕規則檢查
             * @param params {object} 欄位資料
             **/
            async chkPrgFuncRule(params) {
                return await BacUtils.doHttpPromisePostProxy("/api/chkPrgFuncRule", params)
                    .then(result => {
                        if (result.success) {
                            return result;
                        }
                        else {
                            throw result;
                        }
                    })
                    .catch(err => {
                        throw err;
                    });
            },
            //將order dt 分組並呈現在頁面上
            convertDtDataToSingleAndTable(newIndex, oldIndex) {
                if (this.orderDtRowsData.length > 0) {
                    //顯示在多筆的order dt資料
                    if (alasql("select * from ? where order_sta <> 'X'", [this.orderDtRowsData]).length != 0) {
                        let ls_groupStatement =
                            "select *, count(*) as order_qnt from ? where order_sta <> 'X' group by rate_cod,order_sta,days,ci_dat,co_dat,use_cod,room_cod,rent_amt,serv_amt,block_cod";
                        this.orderDtRowsData4table = alasql(ls_groupStatement, [this.orderDtRowsData]);
                        this.beforeOrderDtRowsData4Table = JSON.parse(JSON.stringify(this.orderDtRowsData4table));

                        //顯示在單筆的order dt資料
                        if (newIndex < this.orderDtRowsData4table.length) {
                            let la_orderDtRowsData4table = JSON.parse(JSON.stringify(this.orderDtRowsData4table));
                            this.orderDtRowsData4Single = _.isUndefined(newIndex) ? _.first(la_orderDtRowsData4table) : la_orderDtRowsData4table[newIndex];
                            this.orderDtRowsData4Single.sub_tot =
                                Number(this.orderDtRowsData4Single.other_tot) + Number(this.orderDtRowsData4Single.serv_tot) + Number(this.orderDtRowsData4Single.rent_tot);
                            let lo_qutParams = {
                                sum_adult_qnt: 0,
                                sum_baby_qnt: 0,
                                sum_child_qnt: 0,
                                sum_other_tot: 0,
                                sum_rent_tot: 0,
                                sum_serv_tot: 0,
                                general_tot: 0
                            };
                            _.each(this.orderDtRowsData, (lo_value, ln_idx) => {
                                lo_qutParams.sum_adult_qnt += Number(lo_value.adult_qnt * lo_value.order_qnt);
                                lo_qutParams.sum_baby_qnt += Number(lo_value.baby_qnt * lo_value.order_qnt);
                                lo_qutParams.sum_child_qnt += Number(lo_value.child_qnt * lo_value.order_qnt);
                                lo_qutParams.sum_other_tot += Number(lo_value.other_tot);
                                lo_qutParams.sum_rent_tot += Number(lo_value.rent_tot);
                                lo_qutParams.sum_serv_tot += Number(lo_value.serv_tot);
                            });
                            lo_qutParams.general_tot = lo_qutParams.sum_other_tot + lo_qutParams.sum_serv_tot + lo_qutParams.sum_rent_tot;
                            this.orderDtRowsData4Single = _.extend(this.orderDtRowsData4Single, lo_qutParams);

                            //所group 的資料
                            let lo_groupParams = {
                                rate_cod: this.orderDtRowsData4Single.rate_cod,
                                order_sta: this.orderDtRowsData4Single.order_sta,
                                days: this.orderDtRowsData4Single.days,
                                ci_dat: this.orderDtRowsData4Single.ci_dat,
                                co_dat: this.orderDtRowsData4Single.co_dat,
                                use_cod: this.orderDtRowsData4Single.use_cod,
                                room_cod: this.orderDtRowsData4Single.room_cod,
                                rent_amt: this.orderDtRowsData4Single.rent_amt,
                                serv_amt: this.orderDtRowsData4Single.serv_amt,
                                block_cod: this.orderDtRowsData4Single.block_cod
                            };
                            this.groupOrderDtData = _.where(this.orderDtRowsData, lo_groupParams);
                        }
                    }
                }
            },
            //取得當筆order dt 房型下拉資料
            async getRoomTypSelectData(singleData) {
                let ln_roomCodIndex = _.findIndex(this.orderDtFieldsData4table, {ui_field_name: 'room_cod'});
                let ln_useCodIndex = _.findIndex(this.orderDtFieldsData4table, {ui_field_name: 'use_cod'});

                if (ln_roomCodIndex > -1 && ln_useCodIndex > -1) {
                    let lo_roomCodParam = {
                        prg_id: gs_prgId,
                        page_id: 1,
                        tab_page_id: 1,
                        ui_field_name: this.orderDtFieldsData4table[ln_roomCodIndex].ui_field_name,
                        singleRowData: [singleData]
                    };
                    let lo_useCodParam = {
                        prg_id: gs_prgId,
                        page_id: 1,
                        tab_page_id: 1,
                        ui_field_name: this.orderDtFieldsData4table[ln_useCodIndex].ui_field_name,
                        singleRowData: [singleData]
                    };
                    let [lo_fetchRoomCod, lo_fetchUseCod] = await Promise.all([
                        BacUtils.doHttpPromisePostProxy("/api/chkSelectOptionRule", lo_roomCodParam)
                            .then(result => {
                                return result;
                            }).catch(err => {
                            return {success: false, errorMsg: err};
                        }),
                        BacUtils.doHttpPromisePostProxy("/api/chkSelectOptionRule", lo_useCodParam)
                            .then(result => {
                                return result;
                            }).catch(err => {
                            return {success: false, errorMsg: err};
                        })
                    ]);
                    if (lo_fetchRoomCod.success) {
                        this.orderDtFieldsData4table[ln_roomCodIndex].selectData = lo_fetchRoomCod.selectOptions;
                        this.orderDtFieldsData4table[ln_roomCodIndex].selectDataDisplay = lo_fetchRoomCod.selectOptions;
                    }
                    else {
                        alert(lo_fetchRoomCod.errorMsg);
                    }
                    if (lo_fetchUseCod.success) {
                        this.orderDtFieldsData4table[ln_useCodIndex].selectData = lo_fetchUseCod.selectOptions;
                        this.orderDtFieldsData4table[ln_useCodIndex].selectDataDisplay = lo_fetchUseCod.selectOptions;
                    }
                    else {
                        alert(lo_fetchRoomCod.errorMsg);
                    }
                }
            },
            //將guest mn 資料呈現在頁面上
            async getGuestMnData4single(ikey_seq_nos) {
                this.guestMnRowsData4Single = {};
                this.beforeGuestMnRowsData4Single = {};

                let lo_selectGuestMnData = _.findWhere(this.guestMnRowsData, {ikey_seq_nos: ikey_seq_nos});
                //此筆order dt 已經有guest mn
                if (!_.isUndefined(lo_selectGuestMnData)) {
                    this.guestMnRowsData4Single = lo_selectGuestMnData;
                    this.beforeGuestMnRowsData4Single = JSON.parse(JSON.stringify(lo_selectGuestMnData));
                }
                //此筆order dt 還沒有guest mn， 新增此筆order dt 的 guest mn 資料
                else {
                    let lo_params = {
                        alt_nam: "",
                        createRow: 'Y',
                        gcust_cod: "",
                        ikey: this.orderMnSingleData.ikey,
                        ikey_seq_nos: ikey_seq_nos
                    };
                    this.guestMnRowsData4Single = _.extend(this.guestMnRowsData4Single, lo_params);
                    let lo_fetchDefault = await  BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', {
                        rule_func_name: 'get_guest_mn_default_data'
                    }).then(result => {
                        return result;
                    }).catch(err => {
                        return {success: false, errorMsg: err};
                    });

                    if (lo_fetchDefault.success) {
                        this.guestMnRowsData4Single = _.extend(this.guestMnRowsData4Single, lo_fetchDefault.defaultValues);
                    }
                    else {
                        alert(lo_fetchDefault.errorMsg);
                    }
                    this.beforeGuestMnRowsData4Single = JSON.parse(JSON.stringify(this.guestMnRowsData4Single));
                }
            },
            //決定當筆order dt 傭金欄位是否可修改(因為資料沒有改變，因此無法使用chkDgFieldRule去決定當筆order dt 傭金欄位是否可修改)
            async getCommisRateFiled(singleData) {
                let lo_commisRatField = _.findIndex(this.oriOrderDtFieldsData, {ui_field_name: "commis_rat"});
                if (!_.isUndefined(lo_commisRatField)) {
                    let lo_postData = {
                        prg_id: gs_prgId,
                        rule_func_name: lo_commisRatField.rule_func_name,
                        validateField: lo_commisRatField.ui_field_name,
                        singleRowData: [singleData],
                        oriSingleData: [singleData],
                        allRowData: this.orderDtRowsData
                    };
                    try {
                        let lo_doChkFiledRule = await BacUtils.doHttpPromisePostProxy("/api/chkFieldRule", lo_postData).then(result => {
                            return result
                        }).catch(err => {
                            return {success: false, errorMsg: err}
                        });
                        if (lo_doChkFiledRule.success) {
                            //欄位是否唯獨
                            if (lo_doChkFiledRule.readonlyFields.length > 0) {
                                _.each(lo_doChkFiledRule.readonlyFields, (ls_field) => {
                                    let ln_changOriFieldIndex = _.findIndex(this.oriOrderDtFieldsData, {ui_field_name: ls_field});
                                    if (ln_changOriFieldIndex > -1) {
                                        this.oriOrderDtFieldsData[ln_changOriFieldIndex].modificable = 'N';
                                        _.each(this.orderDtFieldsData, (la_data, ls_key) => {
                                            let changeFieldIndex = _.findIndex(la_data, {ui_field_name: ls_field});
                                            if (changeFieldIndex > -1) {
                                                this.orderDtFieldsData[ls_key][changeFieldIndex].modificable = 'N';
                                            }
                                        });
                                    }
                                });
                            }
                            //欄位是否可修改
                            if (lo_doChkFiledRule.unReadonlyFields.length > 0) {
                                _.each(lo_doChkFiledRule.unReadonlyFields, (ls_field) => {
                                    let ln_changOriFieldIndex = _.findIndex(this.oriOrderDtFieldsData, {ui_field_name: ls_field});
                                    if (ln_changOriFieldIndex > -1) {
                                        this.oriOrderDtFieldsData[ln_changOriFieldIndex].modificable = 'Y';
                                        _.each(this.orderDtFieldsData, (la_data, ls_key) => {
                                            let changeFieldIndex = _.findIndex(la_data, {ui_field_name: ls_field});
                                            if (changeFieldIndex > -1) {
                                                this.orderDtFieldsData[ls_key][changeFieldIndex].modificable = 'Y';
                                            }
                                        });
                                    }
                                });
                            }
                        }
                        else {
                            alert(lo_doChkFiledRule.errorMsg);
                        }
                    }
                    catch (err) {
                        console.log(err);
                        alert(err);
                    }
                }
            },
            //設定多筆guest mn 資料
            setGuestMnRowData(singleData) {
                let ln_editIndex = _.findIndex(this.guestMnRowsData, {
                    ikey_seq_nos: singleData["ikey_seq_nos"],
                });
                if (ln_editIndex > -1) {
                    this.guestMnRowsData[ln_editIndex] = singleData;
                }
                else {
                    this.guestMnRowsData.push(singleData);
                }
            },
            //設定多筆order dt 資料
            setOrderDtRowData(singleData) {
                _.each(this.orderDtRowsData, (lo_data, idx) => {
                    this.orderDtRowsData[idx].days = lo_data.days.toString();
                    this.orderDtRowsData[idx].rent_amt = lo_data.rent_amt.toString();
                    this.orderDtRowsData[idx].serv_amt = lo_data.serv_amt.toString();
                });
                let lo_orderParams = {
                    block_cod: singleData.block_cod,
                    ci_dat: singleData.ci_dat,
                    co_dat: singleData.co_dat,
                    days: singleData.days.toString(),
                    order_sta: singleData.order_sta,
                    rate_cod: singleData.rate_cod,
                    rent_amt: singleData.rent_amt.toString(),
                    room_cod: singleData.room_cod,
                    serv_amt: singleData.serv_amt.toString(),
                    use_cod: singleData.use_cod
                };
                let lo_groupingData = this.groupOrderDtData[0];
                let lo_groupParams = {
                    block_cod: lo_groupingData.block_cod,
                    ci_dat: lo_groupingData.ci_dat,
                    co_dat: lo_groupingData.co_dat,
                    days: lo_groupingData.days.toString(),
                    order_sta: lo_groupingData.order_sta,
                    rate_cod: lo_groupingData.rate_cod,
                    rent_amt: lo_groupingData.rent_amt.toString(),
                    room_cod: lo_groupingData.room_cod,
                    serv_amt: lo_groupingData.serv_amt.toString(),
                    use_cod: lo_groupingData.use_cod
                };
                _.each(this.orderDtRowsData, () => {
                    let ln_editIdx = _.findIndex(this.orderDtRowsData, lo_groupParams);
                    if (ln_editIdx > -1) {
                        this.orderDtRowsData[ln_editIdx] = _.extend(this.orderDtRowsData[ln_editIdx], lo_orderParams);
                    }
                });
                console.log(this.orderDtRowsData);
                this.groupOrderDtData = _.where(this.orderDtRowsData, lo_orderParams);
                console.log(this.groupOrderDtData);
            },
            //計算此群組order dt的房價
            async computeGroupOrderDtPrice(singleData) {
                if (this.groupOrderDtData.length > 0) {
                    if (this.groupOrderDtData[0].rate_cod != "") {
                        let lo_params = {
                            rule_func_name: 'compute_oder_dt_price',
                            allRowData: this.groupOrderDtData,
                            key_nos: this.keyNos,
                            acust_cod: this.orderMnSingleData.acust_cod
                        };

                        let lo_doComputePrice = await BacUtils.doHttpPromisePostProxy("/api/queryDataByRule", lo_params).then(result => {
                            return result;
                        }).catch(err => {
                            return {success: false, errorMsg: err};
                        });

                        if (lo_doComputePrice.success) {
                            _.each(this.groupOrderDtData, () => {
                                let lo_param = {
                                    rate_cod: singleData.rate_cod,
                                    days: singleData.days,
                                    ci_dat: singleData.ci_dat,
                                    co_dat: singleData.co_dat,
                                    use_cod: singleData.use_cod,
                                    room_cod: singleData.room_cod,
                                    rent_amt: singleData.rent_amt,
                                    serv_amt: singleData.serv_amt
                                };
                                let ln_editIndex = _.findIndex(this.orderDtRowsData, lo_param);
                                if (ln_editIndex > -1) {
                                    this.orderDtRowsData[ln_editIndex] = _.extend(this.orderDtRowsData[ln_editIndex], lo_doComputePrice.effectValues);
                                    let lo_editParam = {
                                        other_tot: lo_doComputePrice.effectValues.other_amt * this.orderDtRowsData[ln_editIndex].order_qnt,
                                        rent_tot: lo_doComputePrice.effectValues.rent_amt * this.orderDtRowsData[ln_editIndex].order_qnt,
                                        serv_tot: lo_doComputePrice.effectValues.serv_amt * this.orderDtRowsData[ln_editIndex].order_qnt,
                                    };
                                    this.orderDtRowsData[ln_editIndex] = _.extend(this.orderDtRowsData[ln_editIndex], lo_editParam);
                                }
                            });
                        }
                        else {
                            alert(lo_doComputePrice.errorMsg);
                        }
                    }
                }
            },
            //單筆guest mn欄位規則檢查
            async chkGuestMnFieldRule(ui_field_name, rule_func_name) {
                let la_nowData = [this.guestMnRowsData4Single];
                let la_beforeData = [this.beforeGuestMnRowsData4Single];
                let la_diff = _.difference(la_beforeData, la_nowData);

                if (la_diff.length === 0) {
                    return;
                }
                if (rule_func_name === "") {
                    return;
                }

                try {
                    let lo_postData = {
                        prg_id: gs_prgId,
                        rule_func_name: rule_func_name,
                        validateField: ui_field_name,
                        singleRowData: la_nowData,
                        oriSingleData: la_beforeData,
                        allRowData: this.guestMnRowsData
                    };
                    let lo_doChkFiledRule = await BacUtils.doHttpPromisePostProxy("/api/chkFieldRule", lo_postData)
                        .then((result) => {
                            return result;
                        }).catch((err) => {
                            return {success: false, errorMsg}
                        });

                    if (lo_doChkFiledRule.success) {
                        //帶回來的預設值
                        if (!_.isEmpty(lo_doChkFiledRule.defaultValues)) {
                            let lo_guestMnData = _.extend(this.guestMnRowsData4Single, lo_doChkFiledRule.defaultValues);
                            this.guestMnRowsData4Single = JSON.parse(JSON.stringify(lo_guestMnData));
                        }
                        //連動帶回的值
                        if (!_.isUndefined(lo_doChkFiledRule.effectValues) && _.size(lo_doChkFiledRule.effectValues) > 0) {
                            this.guestMnRowsData4Single = _.extend(this.guestMnRowsData4Single, lo_doChkFiledRule.effectValues);

                            this.isEffectFromRule = lo_doChkFiledRule.isEffectFromRule;
                        }
                        //改變前資料改為現在資料
                        this.beforeGuestMnRowsData4Single = JSON.parse(JSON.stringify(this.guestMnRowsData4Single));

                        this.setGuestMnRowData(this.guestMnRowsData4Single);
                    }
                    else {
                        this.guestMnRowsData4Single = _.extend(this.guestMnRowsData4Single, this.beforeGuestMnRowsData4Single);
                        alert(lo_doChkFiledRule.errorMsg);
                    }
                }
                catch (err) {
                    console.log(err);
                    alert(err);
                }
            },
            //單筆order mn欄位規則檢查
            async chkOrderMnFieldRule(ui_field_name, rule_func_name) {
                if (_.isEmpty(this.beforeOrderMnSingleData)) {
                    this.beforeOrderMnSingleData = this.oriOrderMnSingleData;
                }
                let la_beforeData = [this.orderMnSingleData];
                let la_orderData = [this.beforeOrderMnSingleData];
                let la_diff = _.difference(la_beforeData, la_orderData);

                if (la_diff.length == 0) {
                    return;
                }
                if (rule_func_name == "") {
                    return;
                }

                try {
                    let lo_postData = {
                        prg_id: gs_prgId,
                        rule_func_name: rule_func_name,
                        validateField: ui_field_name,
                        singleRowData: la_orderData,
                        oriSingleData: la_beforeData,
                    };
                    let lo_doChkFiledRule = await BacUtils.doHttpPromisePostProxy("/api/chkFieldRule", lo_postData)
                        .then((result) => {
                            return result;
                        }).catch((err) => {
                            return {success: false, errorMsg}
                        });
                    if (lo_doChkFiledRule.success) {
                        //連動帶回的值
                        if (!_.isUndefined(lo_doChkFiledRule.effectValues) && _.size(lo_doChkFiledRule.effectValues) > 0) {
                            this.orderMnSingleData = _.extend(this.orderMnSingleData, lo_doChkFiledRule.effectValues);

                            this.isEffectFromRule = lo_doChkFiledRule.isEffectFromRule;
                        }
                        //是否要show出訊息
                        if (lo_doChkFiledRule.showAlert) {
                            alert(lo_doChkFiledRule.alertMsg);
                        }
                        //改變前資料改為現在資料
                        this.beforeOrderMnSingleData = JSON.parse(JSON.stringify(this.orderMnSingleData));
                    }
                    else {
                        this.orderMnSingleData = _.extend(this.orderMnSingleData, this.beforeOrderMnSingleData);
                        alert(lo_doChkFiledRule.errorMsg);
                    }
                }
                catch (err) {
                    console.log(err);
                }

            },

            /**
             * 欄位型態為button
             **/
            buttonFunction(fieldData) {
                if (this.isModifiable) {
                    if (!_.isUndefined(this[fieldData.rule_func_name])) {
                        this[fieldData.rule_func_name]();
                    }
                }
            },
            //多筆order dt欄位規則檢查
            async chkDgFieldRule(ui_field_name, rule_func_name) {
                if (_.isUndefined(this.editingOrderDtIdx)) {
                    return;
                }
                let lo_param = {
                    key_nos: this.keyNos,
                    acust_cod: this.orderMnSingleData.acust_cod
                };
                let la_nowData = [_.extend(this.orderDtRowsData4table[this.editingOrderDtIdx], lo_param)];
                let la_beforeData = [this.beforeOrderDtRowsData4Table[this.editingOrderDtIdx]];
                let la_diff = _.difference(la_nowData, la_beforeData);
                if (la_diff.length == 0) {
                    return;
                }
                if (rule_func_name === "" || !this.isEffectFromRule) {
                    this.isEffectFromRule = true;
                    return;
                }

                try {
                    this.isLoadingDialog = true;
                    let lo_postData = {
                        prg_id: gs_prgId,
                        rule_func_name: rule_func_name,
                        validateField: ui_field_name,
                        singleRowData: la_nowData,
                        oriSingleData: la_beforeData,
                        allRowData: this.orderDtRowsData
                    };
                    let lo_doChkFiledRule = await BacUtils.doHttpPromisePostProxy("/api/chkFieldRule", lo_postData).then(result => {
                        return result
                    }).catch(err => {
                        return {success: false, errorMsg: err}
                    });
                    if (lo_doChkFiledRule.success) {
                        //連動帶回的值
                        if (!_.isUndefined(lo_doChkFiledRule.effectValues) && _.size(lo_doChkFiledRule.effectValues) > 0) {
                            let la_effectValuesKey = Object.keys(lo_doChkFiledRule.effectValues);
                            if (la_effectValuesKey.indexOf("allRowData") > -1) {
                                let la_allRowData = JSON.parse(JSON.stringify(lo_doChkFiledRule.effectValues["allRowData"]));
                                this.orderDtRowsData = la_allRowData;
                                console.log(this.orderDtRowsData);
                            }
                            else {
                                this.orderDtRowsData4table[this.editingOrderDtIdx] =
                                    _.extend(this.orderDtRowsData4table[this.editingOrderDtIdx], lo_doChkFiledRule.effectValues);
                            }
                            this.isEffectFromRule = lo_doChkFiledRule.isEffectFromRule;
                        }
                        //是否要show出訊息
                        if (lo_doChkFiledRule.showAlert) {
                            alert(lo_doChkFiledRule.alertMsg);
                        }
                        //欄位是否唯獨
                        if (lo_doChkFiledRule.readonlyFields.length > 0) {
                            _.each(lo_doChkFiledRule.readonlyFields, (ls_field) => {
                                let ln_changOriFieldIndex = _.findIndex(this.oriOrderDtFieldsData, {ui_field_name: ls_field});
                                if (ln_changOriFieldIndex > -1) {
                                    this.oriOrderDtFieldsData[ln_changOriFieldIndex].modificable = 'N';
                                    _.each(this.orderDtFieldsData, (la_data, ls_key) => {
                                        let changeFieldIndex = _.findIndex(la_data, {ui_field_name: ls_field});
                                        if (changeFieldIndex > -1) {
                                            this.orderDtFieldsData[ls_key][changeFieldIndex].modificable = 'N';
                                        }
                                    });
                                }
                            });
                        }
                        //欄位是否可修改
                        if (lo_doChkFiledRule.unReadonlyFields.length > 0) {
                            _.each(lo_doChkFiledRule.unReadonlyFields, (ls_field) => {
                                let ln_changOriFieldIndex = _.findIndex(this.oriOrderDtFieldsData, {ui_field_name: ls_field});
                                if (ln_changOriFieldIndex > -1) {
                                    this.oriOrderDtFieldsData[ln_changOriFieldIndex].modificable = 'Y';
                                    _.each(this.orderDtFieldsData, (la_data, ls_key) => {
                                        let changeFieldIndex = _.findIndex(la_data, {ui_field_name: ls_field});
                                        if (changeFieldIndex > -1) {
                                            this.orderDtFieldsData[ls_key][changeFieldIndex].modificable = 'Y';
                                        }
                                    });
                                }
                            });
                        }
                        //欄位下拉資料
                        if (lo_doChkFiledRule.selectField.length > 0) {
                            _.each(lo_doChkFiledRule.selectField, (ls_field) => {
                                let ln_changFieldIndex = _.findIndex(this.orderDtFieldsData4table, {ui_field_name: ls_field});
                                if (ln_changFieldIndex > -1) {
                                    this.orderDtFieldsData4table[ln_changFieldIndex].selectData = lo_doChkFiledRule.multiSelectOptions[ls_field];
                                    this.orderDtFieldsData4table[ln_changFieldIndex].selectDataDisplay = lo_doChkFiledRule.multiSelectOptions[ls_field];
                                }
                            });
                        }
                        //改變前資料改為現在資料
                        this.beforeOrderDtRowsData4Table = JSON.parse(JSON.stringify(this.orderDtRowsData4table));
                    }
                    else {
                        this.orderDtRowsData4table[this.editingOrderDtIdx] =
                            _.extend(this.orderDtRowsData4table[this.editingOrderDtIdx], this.beforeOrderDtRowsData4Table[this.editingOrderDtIdx]);
                        // this.isEffectFromRule = false;
                        alert(lo_doChkFiledRule.errorMsg);
                    }
                    this.isLoadingDialog = false;
                }
                catch (err) {
                    alert(err)
                }

            },
            //將多筆資料轉換至tmpCUD中
            setTmpCUD(allRowData, oriAllRowData, extendParam) {
                _.each(allRowData, (lo_data) => {
                    //新增狀態
                    if (!_.isUndefined(lo_data.createRow)) {
                        this.tmpCUD.createData.push(_.extend(lo_data, extendParam));
                    }
                    //修改狀態
                    else {
                        let ln_oriIdx = _.findIndex(oriAllRowData, {ikey_seq_nos: Number(lo_data.ikey_seq_nos)});
                        if (ln_oriIdx > -1) {
                            console.log(this.oriOrderDtRowsData[ln_oriIdx].order_sta, lo_data.order_sta);
                            let la_orderDtDataKey = Object.keys(lo_data);
                            for (let ls_key of la_orderDtDataKey) {
                                if (lo_data[ls_key] != oriAllRowData[ln_oriIdx][ls_key]) {
                                    this.tmpCUD.updateData.push(_.extend(lo_data, extendParam));
                                    this.tmpCUD.oriData.push(_.extend(oriAllRowData[ln_oriIdx], extendParam));
                                    break;
                                }
                            }
                        }
                    }
                });
            },
            //將頁面上資料轉換成儲存格式
            async doConvertData() {
                //主檔資料轉換
                if (!_.isUndefined(this.orderMnSingleData)) {
                    let lo_saveSingleData = JSON.parse(JSON.stringify(this.orderMnSingleData));
                    lo_saveSingleData = _.extend(lo_saveSingleData, {
                        page_id: 1,
                        tab_page_id: 12,
                        key_nos: this.keyNos
                    });
                    //旅客登記卡印房租
                    lo_saveSingleData.prtconfirm_sta = lo_saveSingleData.prtconfirm_sta ? 'Y' : 'N';

                    //訂房公司
                    let lo_acustField = _.findWhere(this.oriOrderMnFieldsData, {ui_field_name: 'acust_nam'});
                    if (!_.isUndefined(lo_acustField)) {
                        let la_acustSelectData = _.isUndefined(lo_acustField.selectData) ? [] : lo_acustField.selectData.selectData;
                        let lo_selectedData = _.findWhere(la_acustSelectData, {cust_cod: lo_saveSingleData.acust_cod});
                        lo_saveSingleData.acust_nam = _.isUndefined(lo_selectedData) ? lo_saveSingleData.acust_nam : lo_selectedData.alt_nam;
                    }
                    if (this.isCreateStatus) {
                        this.tmpCUD.createData.splice(0, 0, lo_saveSingleData);
                    }
                    else {
                        this.tmpCUD.updateData.splice(0, 0, lo_saveSingleData);
                        this.tmpCUD.oriData.splice(0, 0, this.oriOrderMnSingleData);
                    }
                }

                //order dt 資料
                if (!_.isEmpty(this.orderDtRowsData4table[this.editingOrderDtIdx])) {
                    let lo_editingRow = JSON.parse(JSON.stringify(this.orderDtRowsData4table[this.editingOrderDtIdx]));

                    //改變orderDtRowsData資料，除了間數以外的屬性，並重新group資料
                    this.setOrderDtRowData(lo_editingRow);

                    //計算所有group data的房價
                    await this.computeGroupOrderDtPrice(lo_editingRow);
                }

                //order dt資料傳至tmpCUD
                this.setTmpCUD(this.orderDtRowsData, this.oriOrderDtRowsData, {page_id: 1, tab_page_id: 13});

                //guest mn 資料傳至tmpCUD
                _.each(this.guestMnRowsData, (lo_data, ln_idx) => {
                    this.guestMnRowsData[ln_idx].alt_nam = lo_data.alt_nam.split(":")[1];
                });
                _.each(this.oriGuestMnRowsData, (lo_data, ln_idx) => {
                    this.oriGuestMnRowsData[ln_idx].alt_nam = lo_data.alt_nam.split(":")[1];
                });
                this.setTmpCUD(this.guestMnRowsData, this.oriGuestMnRowsData, {page_id: 1, tab_page_id: 11});
            },
            //驗證要儲存的資料
            async dataValidate(chkData, chkFields) {
                return await new Promise((resolve, reject) => {
                    let lo_checkResult = {success: true, msg: ""};
                    let la_chkData = Array.isArray(chkData) ? chkData : [chkData];
                    //檢查資料
                    for (let lo_chkData of la_chkData) {
                        for (let lo_field of chkFields) {
                            //必填
                            if (lo_field.requirable == "Y" && lo_field.modificable != "N" && lo_field.ui_type != "checkbox") {
                                lo_checkResult = go_validateClass.required(lo_chkData[lo_field.ui_field_name], lo_field.ui_display_name);
                                if (lo_checkResult.success == false) {
                                    break;
                                }
                            }
                            //有format
                            if (lo_field.format_func_name.validate != "" && !_.isUndefined(go_validateClass[lo_field.format_func_name.validate]) && lo_chkData[lo_field.ui_field_name] != '') {
                                lo_checkResult = go_validateClass[lo_field.format_func_name.validate](lo_chkData[lo_field.ui_field_name], lo_field.ui_display_name);
                                if (lo_checkResult.success == false) {
                                    break;
                                }
                            }
                        }
                    }
                    resolve(lo_checkResult)
                });
            },
            //region 按鈕的function
            //搜尋住客歷史資料
            searchGuestMnAltName() {
                this.$store.dispatch("orderMnModule/setOpenModule", {openModule: "pms0110041_lite"});
                if (!_.isEmpty(this.guestMnRowsData4Single) && this.isModifiable) {
                    let ls_gcustCod = this.guestMnRowsData4Single.gcust_cod || "";
                    if (ls_gcustCod != "") {
                        this.editingGuestMnData = JSON.parse(JSON.stringify(this.guestMnRowsData4Single));
                        this.isCreate4GuestMn = false;
                        this.isEdit4GuestMn = true;
                    }
                    else {
                        this.editingGuestMnData = JSON.parse(JSON.stringify(this.guestMnRowsData4Single));
                        this.editingGuestMnData.gcust_cod = "";
                        this.isCreate4GuestMn = true;
                        this.isEdit4GuestMn = false;
                    }
                    this.showGhistMnDialog();
                }
            },
            //開啟住客歷史資料
            showGhistMnDialog() {
                this.$store.dispatch("ghistMnModule/setAllDataClear");
                let self = this;
                let dialog = $('#PMS0210011').removeClass('hide').dialog({
                    autoOpen: false,
                    modal: true,
                    title: "住客歷史",
                    width: 1000,
                    maxwidth: 1920,
                    minheight: 800,
                    dialogClass: "test",
                    resizable: true,
                    onBeforeClose() {
                        self.editingGuestMnData = {};
                        self.isEdit4GuestMn = false;
                        self.isCreate4GuestMn = false;
                        self.$store.dispatch("orderMnModule/setOpenModule", {openModule: ""});
                        self.$eventHub.$emit("doSaveModifyData");
                    }
                }).dialog('open');
            },
            //開啟訂房公司資料
            showCustMnDialog() {
                if (this.orderMnSingleData.acust_cod != "") {
                    this.editingCustMnData = {};
                    this.editingCustMnData.cust_mn_cust_cod = JSON.parse(JSON.stringify(this.orderMnSingleData)).acust_cod;
                    this.isModifiable4CustMn = false;
                    this.isEdit4CustMn = true;

                    let self = this;
                    var dialog = $('#PMS0610020').removeClass('hide').dialog({
                        autoOpen: false,
                        modal: true,
                        title: go_i18nLang["program"]["PMS0610020"].company_maintain,
                        width: 1000,
                        maxHeight: 1920,
                        resizable: true,
                        onBeforeClose() {
                            self.editingCustMnData = {};
                        }
                    }).dialog('open');
                }
            },
            //開啟公帳號資料
            showMasterStaDialog() {
                var dialog = $("#publicAccount_dialog").removeClass('hide').dialog({
                    modal: true,
                    title: "公帳號",
                    title_html: true,
                    width: 400,
                    maxwidth: 1920,
                    dialogClass: "test",
                    resizable: true
                });
            },
            //開啟聯絡細項資料
            showTelDetailDialog() {
                var dialog = $("#telDetail_dialog").removeClass('hide').dialog({
                    modal: true,
                    title: "其他聯絡方式",
                    title_html: true,
                    width: 400,
                    maxwidth: 1920,
                    dialogClass: "test",
                    resizable: true
                });
            },
            /**
             * 設定搜尋 rate cod 資料
             */
            setSelectRateCodData() {
                this.editingGroupOrderDtData = _.extend(this.orderDtRowsData4Single, this.orderMnSingleData);
                this.openModule = "pms0110041_lite";
                this.showRateCodDialog();
            },
            /**
             * 開啟rate cod資料
             */
            showRateCodDialog() {
                if (this.isModifiable) {
                    var dialog = $("#selectRateCod_dialog").removeClass('hide').dialog({
                        modal: true,
                        title: "選擇房價",
                        title_html: true,
                        width: 450,
                        maxwidth: 1920,
                        dialogClass: "test",
                        resizable: true
                    });
                }
            },
            /**
             * 新增訂房明細
             */
            async appendRow() {
                let la_sourceTypSelectData = _.isUndefined(_.findWhere(this.oriOrderDtFieldsData, {ui_field_name: 'source_typ'})) ? [] : _.findWhere(this.oriOrderDtFieldsData, {ui_field_name: 'source_typ'}).selectData;
                let la_guestTypSelectData = _.isUndefined(_.findWhere(this.oriOrderDtFieldsData, {ui_field_name: 'guest_typ'})) ? [] : _.findWhere(this.oriOrderDtFieldsData, {ui_field_name: 'guest_typ'}).selectData;

                if (this.isModifiable) {
                    let lo_addData = {
                        add_baby: 0,
                        add_child: 0,
                        add_man: 0,
                        addroom_sta: 'N',
                        adult_qnt: 0,
                        arrivl_nos: 0,
                        asi_lock: 'N',
                        assign_qnt: 0,
                        assign_sta: 'N',
                        baby_qnt: 0,
                        block_cod: 1,
                        block_qnt: 1,
                        child_qnt: 0,
                        ci_qnt: 0,
                        ci_dat: moment().format("YYYY/MM/DD"),
                        ci_dat_week: moment().format('ddd'),
                        co_dat: moment().add(1, 'days').format("YYYY/MM/DD"),
                        co_dat_week: moment().add(1, 'days').format('ddd'),
                        commis_rat: 1,
                        creatRow: 'Y',
                        days: 1,
                        guest_typ: la_guestTypSelectData.length == 0 ? "" : la_guestTypSelectData[0].value,
                        ikey: this.orderMnSingleData.ikey,
                        noshow_qnt: 1,
                        order_qnt: 1,
                        order_sta: this.orderStatus,
                        other_tot: 0,
                        rate_cod: "",
                        rent_amt: 0,
                        rent_tot: 0,
                        room_cod: null,
                        serv_amt: 0,
                        serv_tot: 0,
                        source_typ: la_sourceTypSelectData.length == 0 ? "" : la_sourceTypSelectData[0].value,
                        use_cod: null
                    };
                    const lo_param = {
                        prg_id: gs_prgId,
                        page_id: 1,
                        tab_page_id: 1,
                        func_id: 1100,
                        allRowData: this.orderDtRowsData
                    };
                    try {
                        const lo_ruleResult = await this.chkPrgFuncRule(lo_param);
                        lo_addData.ikey_seq_nos = lo_ruleResult.success ?
                            lo_ruleResult.defaultValues.ikey_seq_nos : _.max(this.orderDtRowsData, (lo_orderDtRowsData) => {
                            return lo_orderDtRowsData.ikey_seq_nos;
                        }).ikey_seq_nos + 1;

                        if (this.orderDtRowsData4table.length > 0) {
                            let lo_lastData = this.orderDtRowsData4table[this.orderDtRowsData4table.length - 1];
                            let ls_useCod = lo_lastData.use_cod || "";
                            let ls_roomCod = lo_lastData.room_cod || "";
                            if (ls_roomCod != "" || ls_useCod != "") {
                                lo_addData.ci_dat = moment(lo_lastData.ci_dat).format("YYYY/MM/DD");
                                lo_addData.co_dat = moment(lo_lastData.co_dat).format("YYYY/MM/DD");
                                lo_addData.days = lo_lastData.days;
                                lo_addData.rate_cod = lo_lastData.rate_cod;
                                lo_addData.ci_dat_week = moment(lo_addData.ci_dat).format('ddd');
                                lo_addData.co_dat_week = moment(lo_addData.co_dat).format('ddd');
                            }
                            else {
                                let lo_examFieldData = {};
                                if (ls_roomCod == "") {
                                    lo_examFieldData = _.findWhere(this.orderDtFieldsData4table, {ui_field_name: 'room_cod'});
                                }
                                else {
                                    lo_examFieldData = _.findWhere(this.orderDtFieldsData4table, {ui_field_name: 'use_cod'});
                                }

                                if (!_.isUndefined(lo_examFieldData)) {
                                    let ls_alertMsg = _s.sprintf(go_i18nLang.Validation.Formatter.Required, lo_examFieldData.ui_display_name);
                                    alert(ls_alertMsg)
                                }
                                return;
                            }
                        }

                        this.orderDtRowsData.push(lo_addData);
                        if (this.orderDtRowsData4table.length == 0) {
                            this.groupOrderDtData = JSON.parse(JSON.stringify(this.orderDtRowsData))
                        }
                        this.editingOrderDtIdx = _.isUndefined(this.editingOrderDtIdx) ? 0 : this.editingOrderDtIdx + 1;
                    }
                    catch (err) {
                        alert(err.errorMsg);
                        return;
                    }

                }
            },
            /**
             * 刪除訂房明細資料(order_dt)資料
             * @param index {number} order_dt的index
             */
            async removeRow(index) {
                let lb_isRowDataDelete = false;
                if (this.isModifiable) {
                    const lo_param = {
                        prg_id: gs_prgId,
                        page_id: 1,
                        tab_page_id: 1,
                        func_id: 1110,
                        rowData: this.orderDtRowsData4table[index]
                    };
                    try {
                        const lo_ruleResult = await this.chkPrgFuncRule(lo_param);
                        if (lo_ruleResult.showConfirm) {
                            if (confirm(lo_ruleResult.confirmMsg)) {
                                lb_isRowDataDelete = true;
                            }
                        }
                    }
                    catch (err) {
                        alert(err.errorMsg);
                        return;
                    }

                    //選Y則刪除，選N則什麼事都不做
                    if (!lb_isRowDataDelete) return;

                    /**
                     * 2.注意:訂房明細刪除分兩種狀態(1)本次才新增明細 【DB沒資料】(2)之前新增的明細【DB有資料】
                     * (1)隱藏掉訂房明細order_dt與屬於這個order_dt的guest_mn
                     * (2)將(i)order_dt.order_sta 改成 'X'   (ii)guest_mn.guest_sta 改成 'X'
                     */
                    let lo_deletingData = this.orderDtRowsData4table[index];
                    let lo_groupParam = {
                        rate_cod: lo_deletingData.rate_cod,
                        order_sta: lo_deletingData.order_sta,
                        days: lo_deletingData.days,
                        ci_dat: lo_deletingData.ci_dat,
                        co_dat: lo_deletingData.co_dat,
                        use_cod: lo_deletingData.use_cod,
                        room_cod: lo_deletingData.room_cod,
                        rent_amt: lo_deletingData.rent_amt,
                        serv_amt: lo_deletingData.serv_amt,
                        block_cod: lo_deletingData.block_cod
                    };
                    this.groupOrderDtData = [];
                    this.orderDtRowsData4table.splice(index, 1);
                    this.orderDtRowsData4Single = {};
                    this.editingOrderDtIdx = undefined;
                }
            },
            changeOrderSta(orderStaSelectData) {
                this.orderStatus = orderStaSelectData.value;
                if (this.orderStatus == 'D') {
                    var dialog = $("#cancelRm_dialog").removeClass('hide').dialog({
                        modal: true,
                        title: "訂房取消",
                        title_html: true,
                        width: 500,
                        maxwidth: 1920,
                        dialogClass: "test",
                        resizable: true
                    });
                }
                _.each(this.orderDtRowsData, (lo_orderData, ln_idx) => {
                    this.orderDtRowsData[ln_idx].order_sta = this.orderStatus;
                });
                this.convertDtDataToSingleAndTable();
            },
            async doSave() {
                this.isLoadingDialog = true;
                this.loadingText = "saving...";
                //將資料轉換成tmpCUD格式
                await this.doConvertData();
                //檢驗資料
                let lo_chkOrderMnData = this.isCreateStatus ? this.tmpCUD.createData[0] : this.tmpCUD.updateData[0];
                let lo_orderDtParam = {page_id: 1, tab_page_id: 13};
                let la_chkOrderDtData = this.isCreateStatus ?
                    _.where(this.tmpCUD.createData, lo_orderDtParam) : _.where(this.tmpCUD.createData, lo_orderDtParam).concat(_.where(this.tmpCUD.updateData, lo_orderDtParam));
                let lo_guestMnParam = {page_id: 1, tab_page_id: 11};
                let la_chkGuestMnData = this.isCreateStatus ?
                    _.where(this.tmpCUD.createData, lo_guestMnParam) : _.where(this.tmpCUD.createData, lo_guestMnParam).concat(_.where(this.tmpCUD.updateData, lo_guestMnParam));
                let la_chkData = await Promise.all([
                    this.dataValidate(lo_chkOrderMnData, this.oriOrderMnFieldsData),
                    this.dataValidate(la_chkOrderDtData, this.orderDtFieldsData4table.concat(this.oriOrderDtFieldsData)),
                    this.dataValidate(la_chkGuestMnData, this.oriGuestMnFieldsData)
                ]);
                //儲存資料
                let ln_chkIndex = _.findIndex(la_chkData, {success: false});
                if (ln_chkIndex > -1) {
                    alert(la_chkData[ln_chkIndex].msg);
                    this.isLoadingDialog = false;
                }
                else {
                    console.log(this.tmpCUD);
                    let lo_saveData = await
//                        new Promise((resolve, reject) => {
//                            setTimeout(() => {
//                                resolve({success: true, errorMsg: ""});
//                            }, 500);
//                        });
                        BacUtils.doHttpPromisePostProxy('/api/execNewFormatSQL', {
                            prg_id: 'PMS0110041',
                            func_id: this.isCreateStatus ? "0520" : "0540",
                            tmpCUD: this.tmpCUD
                        })
                            .then(result => {
                                return result;
                            })
                            .catch(err => {
                                return {success: false, errorMsg: err};
                            });
                    if (lo_saveData.success) {
                        alert(go_i18nLang.program.PMS0810230.save_success);
                        let lo_cloneRowData = JSON.parse(JSON.stringify(this.rowData));
                        if (!_.isEmpty(lo_saveData.apiReturnData)) {
                            lo_cloneRowData = _.extend(lo_cloneRowData, lo_saveData.apiReturnData);
                        }

                        this.isEditStatus = true;
                        this.isCreateStatus = false;
                        this.rowData = {};
                        this.rowData = lo_cloneRowData;
                    }
                    else {
                        alert(lo_saveData.errorMsg);
                    }
                    this.isLoadingDialog = false;
                }
            },
            doChkDataIsChange() {
                let lo_oriData = {};
                let lo_nowData = {};

                lo_oriData["orderMnData"] = JSON.parse(JSON.stringify(this.oriOrderMnSingleData));
                lo_nowData["orderMnData"] = JSON.parse(JSON.stringify(this.orderMnSingleData));
                lo_oriData["orderDtData"] = JSON.parse(JSON.stringify(this.oriOrderDtRowsData));
                lo_nowData["orderDtData"] = JSON.parse(JSON.stringify(this.orderDtRowsData));
                lo_oriData["guestMnData"] = JSON.parse(JSON.stringify(this.oriGuestMnRowsData));
                lo_nowData["guestMnData"] = JSON.parse(JSON.stringify(this.guestMnRowsData));

                return go_validateClass.chkDataChang(lo_nowData, lo_oriData);
            },
            doShowGuestDetail() {
                let lo_isModify = this.doChkDataIsChange();
                if (!lo_isModify.success) {
                    alert("請先儲存訂房卡資料")
                }
                else {
                    this.isOpenGuestDetail = true;
                    var dialog = $("#resvGuestDetail_dialog").removeClass('hide').dialog({
                        modal: true,
                        title: "訂房資料",
                        title_html: true,
                        width: 1000,
                        maxwidth: 1920,
//                height: $(window).height(),
//                autoOpen: true,
                        dialogClass: "test",
                        resizable: true
                    });
                }
            },
            doCloseDialog() {
                $("#PMS0110041Lite").dialog('close');
            }
            //endregion
        }
    }
</script>