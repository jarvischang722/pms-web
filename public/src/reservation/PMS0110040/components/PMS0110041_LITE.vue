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
                                                    <bac-select
                                                            v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                            class="input-medium resvCard-xs"
                                                            :style="{width:field.width + 'px'}"
                                                            v-model="orderMnSingleData[field.ui_field_name]"
                                                            :data-display="field.selectDataDisplay "
                                                            :data="field.selectData"
                                                            is-qry-src-before="Y" value-field="value"
                                                            text-field="display"
                                                            @update:v-model="val => orderMnSingleData[field.ui_field_name] = val"
                                                            :default-val="orderMnSingleData[field.ui_field_name]"
                                                            :field="field"
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
                                                                            :disabled="field.modificable == 'N'|| !isModifiable ||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                    </bac-select-grid>

                                                                    <!--按鈕-->
                                                                    <button @click="searchGuestMnAltName()"
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
                                                                            text-field="display"
                                                                            @update:v-model="val => orderMnSingleData[field.ui_field_name] = val"
                                                                            :default-val="orderMnSingleData[field.ui_field_name]"
                                                                            :field="field"
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
                                                                        text-field="display"
                                                                        @update:v-model="val => orderMnSingleData[field.ui_field_name] = val"
                                                                        :default-val="orderMnSingleData[field.ui_field_name]"
                                                                        :field="field"
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
                                                                       :disabled="field.modificable == 'N'|| !isModifiable ||
                                                                        (field.modificable == 'I') || (field.modificable == 'E')">
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
                                                                                   :disabled="field.modificable == 'N'|| !isModifiable ||
                                                                    (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                            <i class="moreClick fa fa-ellipsis-h pull-left"
                                                                               @click="showRateCodDialog"></i>
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
                                                               :disabled="field.modificable == 'N'|| !isModifiable ||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                        <input type="text" style="margin-left: -12px;"
                                                               v-model="orderDtRowsData4Single[field.ui_field_name]"
                                                               v-else-if="field.visiable == 'Y' && field.label_width == 0 && field.ui_type == 'text'"
                                                               :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                               :required="field.requirable == 'Y'" min="0"
                                                               :maxlength="field.ui_field_length"
                                                               :class="{'input_sta_required' : field.requirable == 'Y'}"
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
        <select-rate-cod
                :row-data="editingGroupOrderDtData"
        ></select-rate-cod>
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

    Vue.prototype.$eventHub = new Vue();

    const gs_prgId = 'PMS0110041';

    export default {
        name: 'pms0110041-lite',
        components: {pms0210011, pms0610020, publicAccount, telDetail, selectRateCod},
        props: ["rowData", "isCreateStatus", "isEditStatus", "isModifiable"],
        created() {
            //取得order dt 房價資料
            this.$eventHub.$on('getOrderDtRateCod', (data) => {
                this.orderDtRowsData4table[this.editingOrderDtIdx].rate_cod = data.rateCodData.rate_cod;
            });
            //取得guest mn 資料
            this.$eventHub.$on("getGhistMnDataToOrder", (data) => {
                if (!_.isUndefined(this.guestMnRowsData4Single)) {
                    let lo_cloneGuestMnData = JSON.parse(JSON.stringify(this.guestMnRowsData4Single));
                    let lo_ghistMnData = data.ghistMnData;
                    let lo_extendParam = {};
                    if (this.isCreate4GuestMn) {
                        lo_extendParam = {
                            athena_id: lo_ghistMnData.athena_id,
                            hotel_cod: userInfo.hotel_cod,
                            ci_ser: 0,//todo  資料檔取得系統編號程式=>get_ci_ser
                            ikey: this.orderDtRowsData4Single.ikey,
                            ikey_seq_nos: this.orderDtRowsData4Single.ikey_seq_nos,
                            psngr_nos: 0,//todo 訂房時依訂房卡+psngr_nos捉最大值，由1開始
                            assign_sta: 'N',
                            guest_sta: 'E',
                            master_sta: 'G',
                            gcust_cod: lo_ghistMnData.gcust_cod,
                            ccust_nam: lo_ghistMnData.ccust_nam,
                            alt_nam: lo_ghistMnData.gcust_cod + ":" + lo_ghistMnData.alt_nam,
                            first_nam: lo_ghistMnData.first_nam,
                            last_nam: lo_ghistMnData.last_nam,
                            car_nos: lo_ghistMnData.car_nos,
                            airline_cod: lo_ghistMnData.airline_cod,
                            airmb_nos: lo_ghistMnData.airmb_nos,
                            rent_amt: 0,
                            serv_amt: 0,
                            precredit_amt: 0,
                            contry_cod: lo_ghistMnData.contry_cod,
                            system_typ: 'HFD'
                        };
                    }
                    else {
                        lo_extendParam = {
                            ccust_nam: lo_ghistMnData.ccust_nam,
                            alt_nam: lo_ghistMnData.gcust_cod + ":" + lo_ghistMnData.alt_nam,
                            first_nam: lo_ghistMnData.first_nam,
                            last_nam: lo_ghistMnData.last_nam,
                            car_nos: lo_ghistMnData.car_nos,
                            airline_cod: lo_ghistMnData.airline_cod,
                            airmb_nos: lo_ghistMnData.airmb_nos,
                            contry_cod: lo_ghistMnData.contry_cod,
                        };
                    }
                    this.guestMnRowsData4Single = _.extend(lo_cloneGuestMnData, lo_extendParam);
                }
            });
        },
        mounted() {
            this.fetchUserInfo();
        },
        updated() {
            $("#resvSingleTable").tableHeadFixer({"left": 1});
        },
        data() {
            return {
                i18n_Lang: go_i18nLang,           //多語系
                userInfo: {},                     //使用者資訊
                keyNos: '',                       //tmp_order_appraise key值
                fieldsDataLeft: [],               //頁面顯示欄位資料
                fieldsDataRight: [],              //頁面顯示欄位資料
                oriOrderMnFieldsData: [],         //原始order mn 欄位資料
                orderMnSingleData: {},            //單筆order mn 資料
                oriOrderMnSingleData: {},         //單筆 原始order mn 資料
                orderDtFieldsData: [],            //單筆 order dt 欄位資料
                oriOrderDtFieldsData: [],         //單筆 原始order dt 欄位資料
                orderDtRowsData4Single: {},       //單筆 order dt 資料
                orderDtRowsData: [],              //多筆 order dt 資料
                oriOrderDtRowsData: [],           //多筆 原始order dt 資料
                orderDtFieldsData4table: [],      //多筆 order dt 欄位資料
                orderDtRowsData4table: [],        //多筆 order dt 資料(顯示)
                groupOrderDtData: [],             //group 的order dt 資料
                oriGuestMnFieldsData: [],         //原始guest mn 欄位資料
                guestMnRowsData: [],              //guest mn 資料
                oriGuestMnRowsData: [],           //原始guest mn 欄位資料
                guestMnRowsData4Single: {},       //單筆 guest mn 資料
                editingGuestMnData: {},           //正在編輯的 guest mn 資料
                isLoadingDialog: false,           //是否載入完畢
                tableHeight: 34,                  //多筆table高度
                orderStatus: 'N',                 //訂房狀態
                editingOrderDtIdx: undefined,     //現在正在編輯的orderDt index
                isCreate4GuestMn: false,          //guest mn 中的alt name 是否為新增
                isEdit4GuestMn: false,            //guest mn 中的alt name 是否為修改
                isModifiable4GuestMn: false,      //guest mn 中的alt name 是否可修改
                editingCustMnData: {},            //正在編輯資料的acust_cod
                isCreate4CustMn: false,           //guest mn 中的alt name 是否為新增
                isEdit4CustMn: false,             //guest mn 中的alt name 是否為修改
                isModifiable4CustMn: false,       //guest mn 中的alt name 是否可修改
                editingGroupOrderDtData: {},      //正在編輯的多筆order dt 資料
                tmpCUD: {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                }
            }
        },
        watch: {
            rowData(val) {
                if (!_.isEmpty(val)) {
                    this.initData();
                    this.initTmpCUD();
                    this.isLoadingDialog = true;
                    this.fetchFieldsData();
                }
            },
            async editingOrderDtIdx(newVal, oldVal) {
                if (!_.isUndefined(newVal)) {
                    //取得使用房型及計價房型下拉
                    let lo_postData = {
                        rule_func_name: 'select_cod_data',
                        rowData: this.orderDtRowsData4table[newVal],
                        allRowData: this.orderDtRowsData4table
                    };
                    let lo_fetchSelectData = await new Promise((resolve, reject) => {
                        BacUtils.doHttpPostAgent('/api/chkFieldRule', lo_postData, (result) => {
                            resolve(result);
                        });
                    });

                    let lo_useCodFieldData = _.findWhere(this.orderDtFieldsData4table, {ui_field_name: 'use_cod'});
                    if (!_.isUndefined(lo_useCodFieldData)) {
                        lo_useCodFieldData.selectData = lo_fetchSelectData.multiSelectOptions.use_cod;
                        lo_useCodFieldData.selectDataDisplay = lo_fetchSelectData.multiSelectOptions.use_cod;
                    }
                    let lo_roomCodFieldData = _.findWhere(this.orderDtFieldsData4table, {ui_field_name: 'room_cod'});
                    if (!_.isUndefined(lo_roomCodFieldData)) {
                        lo_roomCodFieldData.selectData = lo_fetchSelectData.multiSelectOptions.room_cod;
                        lo_roomCodFieldData.selectDataDisplay = lo_fetchSelectData.multiSelectOptions.room_cod;
                    }
                }
                if (newVal != oldVal && !_.isUndefined(oldVal)) {
                    let lo_editingRow = JSON.parse(JSON.stringify(this.orderDtRowsData4table[oldVal]));

                    //間數改變，增加或減少orderDtRowsData
                    if (lo_editingRow.order_qnt != this.orderDtRowsData4Single.order_qnt) {
                        //間數不得小於0
                        if (lo_editingRow.order_qnt != "" && lo_editingRow.order_qnt > 0) {
                            let ln_orderQnt = Number(lo_editingRow.order_qnt) - Number(this.orderDtRowsData4Single.order_qnt);
                            if (ln_orderQnt > 0) {
                                //增加orderDtRowsData
                                let ln_ikeySeqNos = _.max(this.orderDtRowsData, (lo_orderDtRowsData) => {
                                    return lo_orderDtRowsData.ikey_seq_nos;
                                }).ikey_seq_nos + 1;
                                for (let i = 0; i < ln_orderQnt; i++) {
                                    let lo_editParam = {
                                        rate_cod: lo_editingRow.rate_cod,
                                        days: lo_editingRow.days,
                                        ci_dat: lo_editingRow.ci_dat,
                                        co_dat: lo_editingRow.co_dat,
                                        use_cod: lo_editingRow.use_cod,
                                        room_cod: lo_editingRow.room_cod,
                                        rent_amt: lo_editingRow.rent_amt,
                                        serv_amt: lo_editingRow.serv_amt,
                                        block_cod: lo_editingRow.block_cod
                                    };

                                    //order_sta 為'x'的改為現在的訂房狀況
                                    let la_editData = _.where(this.orderDtRowsData, lo_editParam);
                                    let ln_editIndex = _.findIndex(la_editData, {order_sta: 'X'});
                                    if (ln_editIndex > -1) {
                                        let ln_orderDtIndex = _.findIndex(this.orderDtRowsData, la_editData[ln_editIndex]);
                                        if (ln_orderDtIndex > -1) {
                                            this.orderDtRowsData[ln_orderDtIndex].order_sta = this.orderStatus;
                                        }
                                    }
                                    else {
                                        let lo_addParams = {};
                                        lo_addParams = _.extend(lo_addParams, lo_editingRow);
                                        lo_addParams.order_qnt = 1;
                                        lo_addParams.ikey_seq_nos = Number(ln_ikeySeqNos) + i;

                                        this.orderDtRowsData.push(lo_addParams);
                                    }
                                }
                            }
                            else {
                                //減少orderDtRowsData
                                let lo_delParam = {};
                                lo_delParam = _.extend(lo_delParam, lo_editingRow);
                                delete lo_delParam.ikey_seq_nos;
                                delete lo_delParam.order_qnt;

                                let la_delOrderDtRowsData = _.where(this.orderDtRowsData, lo_delParam);
                                for (let i = 0; i < Math.abs(ln_orderQnt); i++) {
                                    let lo_delData = la_delOrderDtRowsData[la_delOrderDtRowsData.length - 1 - i];
                                    //原本就在資料庫裡的資料
                                    let ln_delIndex = _.findLastIndex(this.oriOrderDtRowsData, {ikey_seq_nos: lo_delData.ikey_seq_nos});
                                    if (ln_delIndex > -1) {
                                        this.orderDtRowsData[ln_delIndex].order_sta = 'X';
                                    }
                                    else {
                                        //此次新增的
                                        let ln_delTmpIndex = _.findLastIndex(this.tmpCUD.createData, lo_delData);
                                        if (ln_delTmpIndex > -1) {
                                            this.tmpCUD.createData.splice(ln_delTmpIndex, 1);
                                            let ln_delOrderDtIndex = _.findLastIndex(this.orderDtRowsData, lo_delData);
                                            if (ln_delOrderDtIndex > -1) {
                                                this.orderDtRowsData.splice(ln_delOrderDtIndex, 1);
                                            }
                                        }
                                    }
                                }
                            }
                        }
                        else {
                            this.orderDtRowsData4table[oldVal].order_qnt = this.orderDtRowsData4Single.order_qnt;
                        }
                    }

                    //計算房價
//                    let lo_groupParam = {
//                        rate_cod: lo_editingRow.rate_cod,
//                        order_sta: lo_editingRow.order_sta,
//                        days: lo_editingRow.days,
//                        ci_dat: lo_editingRow.ci_dat,
//                        co_dat: lo_editingRow.co_dat,
//                        use_cod: lo_editingRow.use_cod,
//                        room_cod: lo_editingRow.room_cod,
//                        rent_amt: lo_editingRow.rent_amt,
//                        serv_amt: lo_editingRow.serv_amt
//                    };
//                    let la_groupData = _.where(this.orderDtRowsData, lo_groupParam);
//                    if (la_groupData.length > 0) {
//                        let lo_params = {
//                            rule_func_name: 'compute_oder_dt_price',
//                            allRowData: [],
//                            key_nos: this.keyNos,
//                            acust_cod: this.orderMnSingleData.acust_cod
//                        };
//                        lo_params.allRowData = la_groupData;
//
//                        let lo_doComputePrice = await $.post("/api/chkFieldRule", lo_params).then(result => {
//                            return result;
//                        }, err => {
//                            throw Error(err);
//                        });
//
//                        if (lo_doComputePrice.success) {
//                            _.each(la_groupData, (lo_groupData) => {
//                                let ln_editIndex = _.findIndex(this.orderDtRowsData, lo_groupData);
//                                if (ln_editIndex > -1) {
//                                    this.orderDtRowsData[ln_editIndex] = _.extend(this.orderDtRowsData[ln_editIndex], lo_doComputePrice.effectValues);
//                                }
//                            });
//                        }
//                        else {
//                            alert(lo_doComputePrice.errorMsg);
//                            return;
//                        }
//                    }

                    //重新group orderDtRowsData
                    this.convertDtDataToSingleAndTable();
                }
            },
            "orderDtRowsData4Single.ikey_seq_nos"(val) {
                let lo_selectGuestMnData = _.findWhere(this.guestMnRowsData, {ikey_seq_nos: val});
                if (!_.isUndefined(lo_selectGuestMnData)) {
                    this.guestMnRowsData4Single = lo_selectGuestMnData;
                }
                else {
                    this.guestMnRowsData4Single = {ikey_seq_nos: val, alt_nam: "", gcust_cod: ""};
                }
            },
            "guestMnRowsData4Single.alt_nam"(newVal, oldVal) {
                if (!_.isUndefined(newVal)) {
                    let la_convertData = newVal.toString().split(":");
                    if (la_convertData.length > 1) {
                        this.guestMnRowsData4Single["gcust_cod"] = la_convertData[0];
                    }
                }
            },
            orderDtRowsData: {
                handler(val) {
                    console.log(val);
                    //處理暫存資料
                    _.each(val, (lo_orderDtRowData) => {
                        lo_orderDtRowData = _.extend(lo_orderDtRowData, {page_id: 1, tab_page_id: 13});
                        let lo_param = {ikey_seq_nos: lo_orderDtRowData.ikey_seq_nos};
                        let ln_index = _.findIndex(this.oriOrderDtRowsData, lo_param);
                        //新增狀態
                        if (ln_index == -1) {
                            //是否已在暫存中
                            let ln_addIndex = _.findIndex(this.tmpCUD.createData, lo_param);
                            if (ln_addIndex > -1) {
                                this.tmpCUD.createData.splice(ln_addIndex, 1);
                            }
                            this.tmpCUD.createData.push(lo_orderDtRowData);
                        }
                        //修改狀態
                        else {
                            if (!_.isMatch(lo_orderDtRowData, this.oriOrderDtRowsData[ln_index])) {
                                //是否已在暫存中
                                let ln_editIndex = _.findIndex(this.tmpCUD.updateData, lo_param);
                                if (ln_editIndex > -1) {
                                    this.tmpCUD.updateData.splice(ln_editIndex, 1);
                                    this.tmpCUD.oriData.splice(ln_editIndex, 1);
                                }
                                this.tmpCUD.updateData.push(lo_orderDtRowData);
                                this.tmpCUD.oriData.push(lo_orderDtRowData);
                            }
                            else {
                                //是否已在暫存中
                                let ln_editIndex = _.findIndex(this.tmpCUD.updateData, lo_param);
                                if (ln_editIndex > -1) {
                                    this.tmpCUD.updateData.splice(ln_editIndex, 1);
                                    this.tmpCUD.oriData.splice(ln_editIndex, 1);
                                }
                            }
                        }
                    });
                },
                deep: true
            },
            orderDtRowsData4table: {
                handler(val) {
                    if (!_.isUndefined(this.editingOrderDtIdx)) {
                        if (!_.isUndefined(val[this.editingOrderDtIdx])) {
                            val[this.editingOrderDtIdx].ci_dat = moment(val[this.editingOrderDtIdx].ci_dat).format("YYYY/MM/DD");
                            val[this.editingOrderDtIdx].co_dat = moment(val[this.editingOrderDtIdx].co_dat).format("YYYY/MM/DD");

                            //轉換資料
                            let lo_editingRow = JSON.parse(JSON.stringify(val[this.editingOrderDtIdx]));
                            //c/i日期和 c/o日期的判斷
                            if (moment(new Date(lo_editingRow.ci_dat)).diff(moment(new Date(lo_editingRow.co_dat)), "days") >= 1) {
                                alert("c/i 日期要小於 c/o日期");
                                let ln_groupIdx = _.findIndex(this.groupOrderDtData, {ikey_seq_nos: lo_editingRow.ikey_seq_nos});
                                if (ln_groupIdx > -1) {
                                    val[this.editingOrderDtIdx].ci_dat = moment(this.groupOrderDtData[ln_groupIdx].ci_dat).format("YYYY/MM/DD");
                                    val[this.editingOrderDtIdx].co_dat = moment(this.groupOrderDtData[ln_groupIdx].co_dat).format("YYYY/MM/DD");
                                }
                            }
                            else {
                                let ln_days = moment(new Date(lo_editingRow.co_dat)).diff(moment(new Date(lo_editingRow.ci_dat)), "days");
                                val[this.editingOrderDtIdx].days = ln_days;
                                val[this.editingOrderDtIdx].ci_dat_week = moment(lo_editingRow.ci_dat).format("ddd");
                                val[this.editingOrderDtIdx].co_dat_week = moment(lo_editingRow.co_dat).format("ddd");
                            }

                            //改變orderDtRowsData資料，除了間數以外的屬性
                            let lo_orderParams = {
                                block_cod: lo_editingRow.block_cod,
                                ci_dat: lo_editingRow.ci_dat,
                                co_dat: lo_editingRow.co_dat,
                                days: lo_editingRow.days,
                                order_sta: lo_editingRow.order_sta,
                                rate_cod: lo_editingRow.rate_cod,
                                rent_amt: lo_editingRow.rent_amt,
                                room_cod: lo_editingRow.room_cod,
                                serv_amt: lo_editingRow.serv_amt,
                                use_cod: lo_editingRow.use_cod
                            };
                            _.each(this.groupOrderDtData, (lo_orderDtData, idx) => {
                                let ln_editIdx = _.findIndex(this.orderDtRowsData, {ikey_seq_nos: lo_orderDtData.ikey_seq_nos});
                                if (ln_editIdx > -1) {
                                    this.orderDtRowsData[ln_editIdx] = _.extend(this.orderDtRowsData[ln_editIdx], lo_orderParams);
                                }
                            });
                        }
                    }
                    this.tableHeight = _.size(this.orderDtRowsData4table) > 4 ? 132 : 38 + 30 * _.size(this.orderDtRowsData4table);
                },
                deep: true
            },
            guestMnRowsData4Single: {
                handler(val) {
                    if (!_.isEmpty(val)) {
                        if (val["gcust_cod"] != "") {
                            let ln_editIndex = _.findIndex(this.guestMnRowsData, {
                                ikey_seq_nos: val["ikey_seq_nos"],
                                gcust_cod: val["gcust_cod"]
                            });
                            if (ln_editIndex > -1) {
                                this.guestMnRowsData[ln_editIndex] = val;
                            }
                            else {
                                this.guestMnRowsData.push(val);
                            }

                            //todo guestMnRows watch 不到，直接修改tmpCUD資料
                            // let la_guestMnRowsData = JSON.parse(JSON.stringify(this.guestMnRowsData));
                            // _.each(la_guestMnRowsData, (lo_guestMnData) => {
                            //     if (lo_guestMnData.gcust_cod != "") {
                            //         //轉換姓名
                            //         if (!_.isUndefined(lo_guestMnData["alt_nam"])) {
                            //             let la_convertAltNam = lo_guestMnData["alt_nam"].split(":");
                            //             if (la_convertAltNam.length > 1) {
                            //                 lo_guestMnData["alt_nam"] = la_convertAltNam[1];
                            //             }
                            //         }
                            //
                            //         lo_guestMnData = _.extend(lo_guestMnData, {page_id: 1, tab_page_id: 11});
                            //         let lo_params = {
                            //             ikey_seq_nos: lo_guestMnData.ikey_seq_nos,
                            //             gcust_cod: lo_guestMnData.gcust_cod
                            //         };
                            //         let ln_Index = _.findIndex(this.oriGuestMnRowsData, lo_params);
                            //         //新增狀況
                            //         if (ln_Index == -1) {
                            //             let ln_addIndex = _.findIndex(this.tmpCUD.createData, lo_params);
                            //             if (ln_addIndex > -1) {
                            //                 this.tmpCUD.createData.splice(ln_addIndex, 1);
                            //             }
                            //             this.tmpCUD.createData.push(lo_guestMnData);
                            //         }
                            //         //修改狀況
                            //         else {
                            //             let ln_editIndex = _.findIndex(this.tmpCUD.updateData, lo_params);
                            //             if (ln_editIndex > -1) {
                            //                 this.tmpCUD.updateData.splice(ln_editIndex, 1);
                            //                 this.tmpCUD.oriData.splice(ln_editIndex, 1);
                            //             }
                            //             this.tmpCUD.updateData.push(lo_guestMnData);
                            //             this.tmpCUD.oriData.push(lo_guestMnData);
                            //         }
                            //     }
                            // });
                        }
                    }
                },
                deep: true
            },
            guestMnRowsData: {
                handler(val) {
                    //處理暫存資料
                    let la_guestMnRowsData = JSON.parse(JSON.stringify(val));
                    _.each(la_guestMnRowsData, (lo_guestMnData) => {
                        if (lo_guestMnData.gcust_cod != "") {
                            //轉換姓名
                            if (!_.isUndefined(lo_guestMnData["alt_nam"])) {
                                let la_convertAltNam = lo_guestMnData["alt_nam"].split(":");
                                if (la_convertAltNam.length > 1) {
                                    lo_guestMnData["alt_nam"] = la_convertAltNam[1];
                                }
                            }

                            lo_guestMnData = _.extend(lo_guestMnData, {page_id: 1, tab_page_id: 11});
                            let lo_params = {
                                ikey_seq_nos: lo_guestMnData.ikey_seq_nos,
                                gcust_cod: lo_guestMnData.gcust_cod
                            };
                            let ln_Index = _.findIndex(this.oriGuestMnRowsData, lo_params);
                            // //新增狀況
                            // if (ln_Index == -1) {
                            //     let ln_addIndex = _.findIndex(this.tmpCUD.createData, lo_params);
                            //     if (ln_addIndex > -1) {
                            //         this.tmpCUD.createData.splice(ln_addIndex, 1);
                            //     }
                            //     this.tmpCUD.createData.push(lo_guestMnData);
                            // }
                            // //修改狀況
                            // else {
                            //     let ln_editIndex = _.findIndex(this.tmpCUD.updateData, lo_params);
                            //     if (ln_editIndex > -1) {
                            //         this.tmpCUD.updateData.splice(ln_editIndex, 1);
                            //         this.tmpCUD.oriData.splice(ln_editIndex, 1);
                            //     }
                            //     this.tmpCUD.updateData.push(lo_guestMnData);
                            //     this.tmpCUD.oriData.push(lo_guestMnData);
                            // }
                        }
                    });
                },
                deep: true
            },
            tmpCUD: {
                handler(val) {
                    console.log(val);
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
                this.fieldsDataLeft = [];
                this.fieldsDataRight = [];
                this.oriOrderMnFieldsData = [];
                this.orderMnSingleData = {};
                this.oriOrderMnSingleData = {};
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
                this.guestMnRowsData4Single = {};
            },
            initTmpCUD() {
                this.tmpCUD = {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                }
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
                let lo_fetchGuestMnData = {};
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
                    let lo_doDefault = await new Promise((resolve, reject) => {
                        BacUtils.doHttpPostAgent("/api/chkFieldRule", {
                            rule_func_name: 'convert_oder_appraise_to_tmp',
                            ikey: this.rowData.ikey
                        }, (result) => {
                            resolve(result);
                        });
                    });

                    if (lo_doDefault.success) {
                        this.keyNos = lo_doDefault.defaultValues.key_nos;
                    }
                    else {
                        alert(lo_doDefault.errorMsg);
                    }

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
                    if (this.isCreateStatus) {
                        this.orderMnSingleData = lo_fetchSingleData.gsDefaultData;
                        this.oriOrderMnSingleData = JSON.parse(JSON.stringify(lo_fetchSingleData.gsDefaultData));
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

                //取所有此ikey的 guestMn、orderDt資料
                if (this.isEditStatus) {
                    ls_apiUrl = "/api/fetchDgRowData";
                    lo_params = {
                        prg_id: gs_prgId,
                        page_id: 1,
                        searchCond: {ikey: this.rowData.ikey}
                    };
                    //取guest mn資料
                    lo_params.tab_page_id = 11;
                    lo_fetchGuestMnData = await new Promise((resolve, reject) => {
                        BacUtils.doHttpPostAgent(ls_apiUrl, lo_params, (result) => {
                            resolve(result);
                        });
                    });
                    if (lo_fetchGuestMnData.success) {
                        this.guestMnRowsData = lo_fetchGuestMnData.dgRowData;
                        this.oriGuestMnRowsData = JSON.parse(JSON.stringify(lo_fetchGuestMnData.dgRowData));
                    }
                    else {
                        alert(lo_fetchOderDtData.errorMsg);
                    }

                    //取order dt 資料
                    lo_params.tab_page_id = 1;
                    lo_fetchOderDtData = await new Promise((resolve, reject) => {
                        BacUtils.doHttpPostAgent(ls_apiUrl, lo_params, (result) => {
                            resolve(result);
                        });
                    });
                    if (lo_fetchOderDtData.success) {
                        _.each(lo_fetchOderDtData.dgRowData, (lo_dgRowData) => {
                            lo_dgRowData.ci_dat = moment(lo_dgRowData.ci_dat).format("YYYY/MM/DD");
                            lo_dgRowData.co_dat = moment(lo_dgRowData.co_dat).format("YYYY/MM/DD");
                            lo_dgRowData.ci_dat_week = moment(lo_dgRowData.ci_dat).format('ddd');
                            lo_dgRowData.co_dat_week = moment(lo_dgRowData.co_dat).format('ddd');
                        });
                        this.oriOrderDtRowsData = JSON.parse(JSON.stringify(lo_fetchOderDtData.dgRowData));
                        //所有的order dt 資料
                        this.orderDtRowsData = lo_fetchOderDtData.dgRowData;

                        //將資料轉換成多筆和單筆的格式
                        if (this.orderDtRowsData.length > 0) {
                            this.editingOrderDtIdx = 0;
                            this.convertDtDataToSingleAndTable();
                        }

                    }
                    else {
                        alert(lo_fetchOderDtData.errorMsg);
                    }
                }
            },
            convertDtDataToSingleAndTable() {
                //顯示在多筆的order dt資料
                let ls_groupStatement =
                    "select * from ? where order_sta <> 'X' group by rate_cod,order_sta,days,ci_dat,co_dat,use_cod,room_cod,rent_amt,serv_amt,block_cod";

                this.orderDtRowsData4table = alasql(ls_groupStatement, [this.orderDtRowsData]);
                _.each(this.orderDtRowsData4table, (lo_tableData, ln_idx) => {
                    let lo_param = {
                        rate_cod: lo_tableData.rate_cod,
                        order_sta: lo_tableData.order_sta,
                        days: lo_tableData.days,
                        ci_dat: lo_tableData.ci_dat,
                        co_dat: lo_tableData.co_dat,
                        use_cod: lo_tableData.use_cod,
                        room_cod: lo_tableData.room_cod,
                        rent_amt: lo_tableData.rent_amt,
                        serv_amt: lo_tableData.serv_amt
                    };
                    let la_groupData = _.where(this.orderDtRowsData, lo_param);
                    let ln_orderQnt = 0;
                    _.each(la_groupData, (lo_groupData) => {
                        ln_orderQnt = ln_orderQnt + Number(lo_groupData.order_qnt);
                    });
                    this.orderDtRowsData4table[ln_idx].order_qnt = ln_orderQnt;
                });

                //顯示在單筆的order dt資料
                let la_orderDtRowsData4table = JSON.parse(JSON.stringify(this.orderDtRowsData4table));
                this.orderDtRowsData4Single = _.isUndefined(this.editingOrderDtIdx) ? _.first(la_orderDtRowsData4table) : la_orderDtRowsData4table[this.editingOrderDtIdx];
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
            },
            searchGuestMnAltName() {
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
                        self.$eventHub.$emit("doSaveModifyData");
                    }
                }).dialog('open');
            },
            buttonFunction(fieldData) {
                if (this.isModifiable) {
                    if (fieldData.ui_field_name == 'search_acust_nam') {
                        this.showCustMnDialog();
                    }
                    else if (fieldData.ui_field_name == 'search_master_sta') {
                        this.showMasterStaDialog();
                    }
                    else if (fieldData.ui_field_name == 'tel_detail') {
                        this.showTelDetailDialog();
                    }
                }
            },
            showCustMnDialog() {
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
            },
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
            showRateCodDialog() {
                if (this.isModifiable) {
                    let self = this;
                    this.editingGroupOrderDtData = _.extend(this.orderDtRowsData4Single, this.orderMnSingleData);
                    var dialog = $("#selectRateCod_dialog").removeClass('hide').dialog({
                        modal: true,
                        title: "選擇房價",
                        title_html: true,
                        width: 450,
                        maxwidth: 1920,
                        dialogClass: "test",
                        resizable: true,
                        onBeforeClose() {
                            self.editingCustMnData = {};
                        }
                    });
                }
            },
            async selectedCell(idx, field) {
                //單筆order dt的設定
                this.editingOrderDtIdx = idx;
            },
            appendRow() {
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
                        block_cod: undefined,
                        child_qnt: 0,
                        ci_qnt: 0,
                        ci_dat: moment().format("YYYY/MM/DD"),
                        ci_dat_week: moment().format('ddd'),
                        co_dat: moment().add(1, 'days').format("YYYY/MM/DD"),
                        co_dat_week: moment().add(1, 'days').format('ddd'),
                        days: 1,
                        ikey: this.orderMnSingleData.ikey,
                        order_qnt: 1,
                        order_sta: this.orderStatus,
                        other_tot: 0,
                        rate_cod: "",
                        rent_amt: 0,
                        rent_tot: 0,
                        room_cod: null,
                        serv_amt: 0,
                        serv_tot: 0,
                        use_cod: null
                    };
                    lo_addData.ikey_seq_nos = this.orderDtRowsData.length > 0 ?
                        _.max(this.orderDtRowsData, (lo_orderDtRowsData) => {
                            return lo_orderDtRowsData.ikey_seq_nos;
                        }).ikey_seq_nos + 1 : 1;
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

                    this.editingOrderDtIdx = this.orderDtRowsData4table.length > 0 ? this.orderDtRowsData4table.length : 0;
                    this.orderDtRowsData.push(lo_addData);
                    this.convertDtDataToSingleAndTable();
                }
            },
            async removeRow(index) {
                if (this.isModifiable) {
                    await this.selectedCell(index);
                    _.each(this.groupOrderDtData, (lo_groupData) => {
                        let ln_delIndex = _.findIndex(this.orderDtRowsData, {ikey_seq_nos: lo_groupData.ikey_seq_nos});
                        if (ln_delIndex > -1) {
                            this.orderDtRowsData[ln_delIndex].order_sta = 'X';
                        }
                    });
                    this.groupOrderDtData = [];
                    this.orderDtRowsData4table.splice(index, 1);
                }
            },
            async doSave() {
                console.log(this.tmpCUD);
            }
        }
    }
</script>

<style>

</style>