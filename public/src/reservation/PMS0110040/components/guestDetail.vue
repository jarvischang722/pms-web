<template>
    <div id="resvGuestDetail_dialog" class="hide padding-5">
        <div class="businessCompanyData">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right">
                            <!-- 訂房資料 dataGrid -->
                            <table id="orderDtTable"></table>
                        </div>
                    </div>
                    <div class="col-xs-1 col-sm-1">
                        <div class="row"></div>
                    </div>
                </div>

                <div class="clearfix"></div>
                <div class="space-6"></div>

                <div class="row">
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right">
                            <!-------- tabPage -------->
                            <div style="position: relative;">
                                <div class="resvTabs-topTxt" style="bottom: -28px;">
                                        <span class="">
                                          <label class="checkbox-width">
                                              <input name="form-field-checkbox"
                                                     type="checkbox"
                                                     class="ace">
                                              <span class="lbl">
                                                  <span class="subtxt">顯示全部</span>
                                              </span>
                                          </label>
                                    </span>
                                </div>
                            </div>
                            <div class="easyui-tabs easyUi-custom1 guestHoliday" style="overflow-y: auto; width: 100%;">
                                <div title="訂房明細" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <div class="container_12 divider">
                                                <div class="grid_12 fixed-table-container">
                                                    <table class="fancyTable themeTable treeControl custom-table"
                                                           id="resvDetailTable" cellpadding="0" cellspacing="0">
                                                        <thead>
                                                        <tr>
                                                            <th class="text-center ca-headerTitle height-fntThead rp-first-th">
                                                                <i class="fa fa-plus green"></i>
                                                            </th>
                                                            <th class="text-left" style="min-width: 40px;">
                                                                序號
                                                            </th>
                                                            <th class="text-left" style="min-width: 40px;">
                                                                入住日期
                                                            </th>
                                                            <th class="text-left" style="min-width: 35px;">星期</th>
                                                            <th class="text-left" style="min-width: 35px;">天數</th>
                                                            <th class="text-left" style="min-width: 40px;">
                                                                退房日期
                                                            </th>
                                                            <th class="text-left" style="min-width: 35px;">星期</th>
                                                            <th class="text-left" style="min-width: 150px;">
                                                                房價代號
                                                            </th>
                                                            <th class="text-left" style="min-width: 80px;">
                                                                計價房型
                                                            </th>
                                                            <th class="text-left" style="min-width: 80px;">使用房型
                                                            </th>
                                                            <th class="text-right" style="min-width: 50px;">
                                                                單價
                                                            </th>
                                                            <th class="text-right" style="min-width: 50px;">
                                                                服務費
                                                            </th>
                                                            <th class="text-right" style="min-width: 35px;">
                                                                佣金
                                                            </th>
                                                            <th class="text-left" style="min-width: 35px;">
                                                                大人
                                                            </th>
                                                            <th class="text-left" style="min-width: 35px;">
                                                                小孩
                                                            </th>
                                                            <th class="text-left" style="min-width: 35px;">
                                                                嬰兒
                                                            </th>
                                                            <th class="text-left" style="min-width: 80px;">
                                                                排房狀態
                                                            </th>
                                                            <th class="text-left" style="min-width: 40px;">
                                                                房號
                                                            </th>
                                                            <th class="text-left" style="min-width: 120px;">
                                                                住客姓名
                                                            </th>
                                                            <th class="text-left" style="min-width: 80px;">
                                                                訂房來源
                                                            </th>
                                                            <th class="text-left" style="min-width: 80px;">
                                                                市場類別
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr class="hidden-firstTr">
                                                            <td class="middle td-first hidden-firstTd"></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                        </tr>
                                                        <!--1-->
                                                        <tr>
                                                            <td class="text-center">
                                                                <i class="fa fa-minus red"></i>
                                                            </td>
                                                            <td class="text-left input-noEdit">1</td>
                                                            <td class="text-left">
                                                                <template>
                                                                    <el-date-picker
                                                                            v-model="resvDetail_ciDate"
                                                                            type="date"
                                                                            placeholder=""
                                                                            class="date-wt input_sta_required">
                                                                    </el-date-picker>
                                                                </template>
                                                            </td>
                                                            <td class="text-left input-noEdit">日</td>
                                                            <td class="text-left">
                                                                <input type="text" class="selectHt" placeholder="2"/>
                                                            </td>
                                                            <td class="text-left">
                                                                <template>
                                                                    <el-date-picker
                                                                            v-model="resvDetail_coDate"
                                                                            type="date"
                                                                            placeholder=""
                                                                            class="date-wt input_sta_required">
                                                                    </el-date-picker>
                                                                </template>
                                                            </td>
                                                            <td class="text-left input-noEdit">日</td>
                                                            <td class="text-left">
                                                                <template>
                                                                    <el-select v-model="roomCodes_val"
                                                                               placeholder="請選擇"
                                                                               class="el-select-ht input_sta_required">
                                                                        <el-option
                                                                                v-for="item in roomCodes"
                                                                                :key="item.value"
                                                                                :label="item.label"
                                                                                :value="item.value">
                                                                        </el-option>
                                                                    </el-select>
                                                                </template>
                                                            </td>
                                                            <td class="text-left">
                                                                <!--計價房型-->
                                                                <template>
                                                                    <el-select v-model="roomTypes_val"
                                                                               placeholder="請選擇"
                                                                               class="el-select-ht input_sta_required">
                                                                        <el-option
                                                                                v-for="item in roomTypes"
                                                                                :key="item.value"
                                                                                :label="item.label"
                                                                                :value="item.value">
                                                                        </el-option>
                                                                    </el-select>
                                                                </template>
                                                            </td>
                                                            <td class="text-left">
                                                                <!--使用房型-->
                                                                <template>
                                                                    <el-select v-model="useRmTypes_val"
                                                                               placeholder="請選擇"
                                                                               class="el-select-ht input_sta_required">
                                                                        <el-option
                                                                                v-for="item in useRmTypes"
                                                                                :key="item.value"
                                                                                :label="item.label"
                                                                                :value="item.value">
                                                                        </el-option>
                                                                    </el-select>
                                                                </template>
                                                            </td>
                                                            <td class="text-right input-noEdit">5,000</td>
                                                            <td class="text-right input-noEdit">50</td>
                                                            <td class="text-right">
                                                                <input type="text" class="selectHt"
                                                                       placeholder="20"/>
                                                            </td>
                                                            <td class="text-right">
                                                                <input type="text" class="selectHt"
                                                                       placeholder="2"/>
                                                            </td>
                                                            <td class="text-right">
                                                                <input type="text" class="selectHt"
                                                                       placeholder="1"/>
                                                            </td>
                                                            <td class="text-right">
                                                                <input type="text" class="selectHt"
                                                                       placeholder="0"/>
                                                            </td>
                                                            <td class="text-left input-noEdit">已排房</td>
                                                            <td class="text-left input-noEdit">503</td>
                                                            <td class="text-left input-noEdit">陳Rick,葉Peter</td>
                                                            <td class="text-left">
                                                                <!--訂房來源-->
                                                                <template>
                                                                    <el-select v-model="resv_sources_val"
                                                                               placeholder="請選擇"
                                                                               class="el-select-ht input_sta_required">
                                                                        <el-option
                                                                                v-for="item in resv_sources"
                                                                                :key="item.value"
                                                                                :label="item.label"
                                                                                :value="item.value">
                                                                        </el-option>
                                                                    </el-select>
                                                                </template>
                                                            </td>
                                                            <td class="text-left">
                                                                <!--市場類別-->
                                                                <template>
                                                                    <el-select v-model="marketCates_val"
                                                                               placeholder="請選擇"
                                                                               class="el-select-ht input_sta_required">
                                                                        <el-option
                                                                                v-for="item in marketCates"
                                                                                :key="item.value"
                                                                                :label="item.label"
                                                                                :value="item.value">
                                                                        </el-option>
                                                                    </el-select>
                                                                </template>
                                                            </td>
                                                        </tr>
                                                        <!--2-->
                                                        <tr>
                                                            <td class="text-center">
                                                                <i class="fa fa-minus red"></i>
                                                            </td>
                                                            <td class="text-left input-noEdit">2</td>
                                                            <td class="text-left">
                                                                <template>
                                                                    <el-date-picker
                                                                            v-model="resvDetail_ciDate_2"
                                                                            type="date"
                                                                            placeholder=""
                                                                            class="date-wt input_sta_required">
                                                                    </el-date-picker>
                                                                </template>
                                                            </td>
                                                            <td class="text-left input-noEdit">日</td>
                                                            <td class="text-left">
                                                                <input type="text" class="selectHt" placeholder="2"/>
                                                            </td>
                                                            <td class="text-left">
                                                                <template>
                                                                    <el-date-picker
                                                                            v-model="resvDetail_coDate_2"
                                                                            type="date"
                                                                            placeholder=""
                                                                            class="date-wt input_sta_required">
                                                                    </el-date-picker>
                                                                </template>
                                                            </td>
                                                            <td class="text-left input-noEdit">日</td>
                                                            <td class="text-left">
                                                                <template>
                                                                    <el-select v-model="roomCodes_val_2"
                                                                               placeholder="請選擇"
                                                                               class="el-select-ht input_sta_required">
                                                                        <el-option
                                                                                v-for="item in roomCodes"
                                                                                :key="item.value"
                                                                                :label="item.label"
                                                                                :value="item.value">
                                                                        </el-option>
                                                                    </el-select>
                                                                </template>
                                                            </td>
                                                            <td class="text-left">
                                                                <!--計價房型-->
                                                                <template>
                                                                    <el-select v-model="roomTypes_val_2"
                                                                               placeholder="請選擇"
                                                                               class="el-select-ht input_sta_required">
                                                                        <el-option
                                                                                v-for="item in roomTypes"
                                                                                :key="item.value"
                                                                                :label="item.label"
                                                                                :value="item.value">
                                                                        </el-option>
                                                                    </el-select>
                                                                </template>
                                                            </td>
                                                            <td class="text-left">
                                                                <!--使用房型-->
                                                                <template>
                                                                    <el-select v-model="useRmTypes_val_2"
                                                                               placeholder="請選擇"
                                                                               class="el-select-ht input_sta_required">
                                                                        <el-option
                                                                                v-for="item in useRmTypes"
                                                                                :key="item.value"
                                                                                :label="item.label"
                                                                                :value="item.value">
                                                                        </el-option>
                                                                    </el-select>
                                                                </template>
                                                            </td>
                                                            <td class="text-right input-noEdit">5,000</td>
                                                            <td class="text-right input-noEdit">50</td>
                                                            <td class="text-right">
                                                                <input type="text" class="selectHt"
                                                                       placeholder="20"/>
                                                            </td>
                                                            <td class="text-right">
                                                                <input type="text" class="selectHt"
                                                                       placeholder="2"/>
                                                            </td>
                                                            <td class="text-right">
                                                                <input type="text" class="selectHt"
                                                                       placeholder="1"/>
                                                            </td>
                                                            <td class="text-right">
                                                                <input type="text" class="selectHt"
                                                                       placeholder="0"/>
                                                            </td>
                                                            <td class="text-left input-noEdit">已排房</td>
                                                            <td class="text-left input-noEdit">601</td>
                                                            <td class="text-left input-noEdit">黃Mike,葉Alice</td>
                                                            <td class="text-left">
                                                                <!--訂房來源-->
                                                                <template>
                                                                    <el-select v-model="resv_sources_val_2"
                                                                               placeholder="請選擇"
                                                                               class="el-select-ht input_sta_required">
                                                                        <el-option
                                                                                v-for="item in resv_sources"
                                                                                :key="item.value"
                                                                                :label="item.label"
                                                                                :value="item.value">
                                                                        </el-option>
                                                                    </el-select>
                                                                </template>
                                                            </td>
                                                            <td class="text-left">
                                                                <!--市場類別-->
                                                                <template>
                                                                    <el-select v-model="marketCates_val_2"
                                                                               placeholder="請選擇"
                                                                               class="el-select-ht input_sta_required">
                                                                        <el-option
                                                                                v-for="item in marketCates"
                                                                                :key="item.value"
                                                                                :label="item.label"
                                                                                :value="item.value">
                                                                        </el-option>
                                                                    </el-select>
                                                                </template>
                                                            </td>
                                                        </tr>
                                                        <!--3-->
                                                        <tr>
                                                            <td class="text-center">
                                                                <i class="fa fa-minus red"></i>
                                                            </td>
                                                            <td class="text-left input-noEdit">3</td>
                                                            <td class="text-left">
                                                                <template>
                                                                    <el-date-picker
                                                                            v-model="resvDetail_ciDate_3"
                                                                            type="date"
                                                                            placeholder=""
                                                                            class="date-wt input_sta_required">
                                                                    </el-date-picker>
                                                                </template>
                                                            </td>
                                                            <td class="text-left input-noEdit">日</td>
                                                            <td class="text-left">
                                                                <input type="text" class="selectHt" placeholder="2"/>
                                                            </td>
                                                            <td class="text-left">
                                                                <template>
                                                                    <el-date-picker
                                                                            v-model="resvDetail_coDate_3"
                                                                            type="date"
                                                                            placeholder=""
                                                                            class="date-wt input_sta_required">
                                                                    </el-date-picker>
                                                                </template>
                                                            </td>
                                                            <td class="text-left input-noEdit">日</td>
                                                            <td class="text-left">
                                                                <template>
                                                                    <el-select v-model="roomCodes_val_3"
                                                                               placeholder="請選擇"
                                                                               class="el-select-ht input_sta_required">
                                                                        <el-option
                                                                                v-for="item in roomCodes"
                                                                                :key="item.value"
                                                                                :label="item.label"
                                                                                :value="item.value">
                                                                        </el-option>
                                                                    </el-select>
                                                                </template>
                                                            </td>
                                                            <td class="text-left">
                                                                <!--計價房型-->
                                                                <template>
                                                                    <el-select v-model="roomTypes_val_3"
                                                                               placeholder="請選擇"
                                                                               class="el-select-ht input_sta_required">
                                                                        <el-option
                                                                                v-for="item in roomTypes"
                                                                                :key="item.value"
                                                                                :label="item.label"
                                                                                :value="item.value">
                                                                        </el-option>
                                                                    </el-select>
                                                                </template>
                                                            </td>
                                                            <td class="text-left">
                                                                <!--使用房型-->
                                                                <template>
                                                                    <el-select v-model="useRmTypes_val_3"
                                                                               placeholder="請選擇"
                                                                               class="el-select-ht input_sta_required">
                                                                        <el-option
                                                                                v-for="item in useRmTypes"
                                                                                :key="item.value"
                                                                                :label="item.label"
                                                                                :value="item.value">
                                                                        </el-option>
                                                                    </el-select>
                                                                </template>
                                                            </td>
                                                            <td class="text-right input-noEdit">5,000</td>
                                                            <td class="text-right input-noEdit">50</td>
                                                            <td class="text-right">
                                                                <input type="text" class="selectHt"
                                                                       placeholder="20"/>
                                                            </td>
                                                            <td class="text-right">
                                                                <input type="text" class="selectHt"
                                                                       placeholder="2"/>
                                                            </td>
                                                            <td class="text-right">
                                                                <input type="text" class="selectHt"
                                                                       placeholder="1"/>
                                                            </td>
                                                            <td class="text-right">
                                                                <input type="text" class="selectHt"
                                                                       placeholder="0"/>
                                                            </td>
                                                            <td class="text-left input-noEdit">未排房</td>
                                                            <td class="text-left input-noEdit">204</td>
                                                            <td class="text-left input-noEdit">王Jim,李Bear</td>
                                                            <td class="text-left">
                                                                <!--訂房來源-->
                                                                <template>
                                                                    <el-select v-model="resv_sources_val_3"
                                                                               placeholder="請選擇"
                                                                               class="el-select-ht input_sta_required">
                                                                        <el-option
                                                                                v-for="item in resv_sources"
                                                                                :key="item.value"
                                                                                :label="item.label"
                                                                                :value="item.value">
                                                                        </el-option>
                                                                    </el-select>
                                                                </template>
                                                            </td>
                                                            <td class="text-left">
                                                                <!--市場類別-->
                                                                <template>
                                                                    <el-select v-model="marketCates_val_3"
                                                                               placeholder="請選擇"
                                                                               class="el-select-ht input_sta_required">
                                                                        <el-option
                                                                                v-for="item in marketCates"
                                                                                :key="item.value"
                                                                                :label="item.label"
                                                                                :value="item.value">
                                                                        </el-option>
                                                                    </el-select>
                                                                </template>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                                <div title="住客名單" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <div class="container_12 divider">
                                                <div class="grid_12 fixed-table-container">
                                                    <table class="fancyTable themeTable treeControl custom-table"
                                                           id="resvDetail-table" cellpadding="0"
                                                           cellspacing="0">
                                                        <thead>
                                                        <tr>
                                                            <th class="text-center ca-headerTitle height-fntThead rp-first-th">
                                                                <i class="fa fa-plus green"></i>
                                                            </th>
                                                            <th class="text-left" style="min-width: 60px;">
                                                                序號
                                                            </th>
                                                            <th class="text-left" style="min-width: 250px;">
                                                                住客姓名
                                                            </th>
                                                            <th class="text-left" style="min-width: 80px;">
                                                                排房狀態
                                                            </th>
                                                            <th class="text-left" style="min-width: 100px;">
                                                                房號
                                                            </th>
                                                            <th class="text-left" style="min-width: 130px;">
                                                                國籍
                                                            </th>
                                                            <th class="text-left" style="min-width: 100px;">
                                                                喜好房號
                                                            </th>
                                                            <th class="text-left" style="min-width: 80px;">
                                                                車號
                                                            </th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        <tr class="hidden-firstTr">
                                                            <td class="middle td-first hidden-firstTd"></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                            <td class=""></td>
                                                        </tr>
                                                        <!--1-->
                                                        <tr>
                                                            <td class="text-center">
                                                                <i class="fa fa-minus red"></i>
                                                            </td>
                                                            <td class="text-left input-noEdit">無指定</td>
                                                            <td class="text-left td-relative">
                                                                <input type="text" class="selectHt input_sta_required"
                                                                       placeholder="住客姓名"/>
                                                                <button class="btn btn-sm btn-primary btn-white btn-sm-font2 reservationDialog-2 moreAbso">
                                                                    Profile
                                                                </button>
                                                            </td>
                                                            <td class="text-left input-noEdit">已排房</td>
                                                            <td class="text-left input-noEdit">801</td>
                                                            <td class="text-left input-noEdit">Taiwan</td>
                                                            <td class="text-left input-noEdit">801</td>
                                                            <td class="text-left">
                                                                <input type="text" class="selectHt"
                                                                       placeholder="001234585"/>
                                                            </td>
                                                        </tr>
                                                        <!--2-->
                                                        <tr>
                                                            <td class="text-center">
                                                                <i class="fa fa-minus red"></i>
                                                            </td>
                                                            <td class="text-left input-noEdit">2</td>
                                                            <td class="text-left td-relative">
                                                                <input type="text" class="selectHt input_sta_required"
                                                                       placeholder="住客姓名"/>
                                                                <button class="btn btn-sm btn-primary btn-white btn-sm-font2 reservationDialog-2 moreAbso">
                                                                    Profile
                                                                </button>
                                                            </td>
                                                            <td class="text-left input-noEdit">未排房</td>
                                                            <td class="text-left input-noEdit">802</td>
                                                            <td class="text-left input-noEdit">Taiwan</td>
                                                            <td class="text-left input-noEdit">802</td>
                                                            <td class="text-left">
                                                                <input type="text" class="selectHt"
                                                                       placeholder="12345678"/>
                                                            </td>
                                                        </tr>
                                                        <!--3-->
                                                        <tr>
                                                            <td class="text-center">
                                                                <i class="fa fa-minus red"></i>
                                                            </td>
                                                            <td class="text-left input-noEdit">3</td>
                                                            <td class="text-left td-relative">
                                                                <input type="text" class="selectHt input_sta_required"
                                                                       placeholder="住客姓名"/>
                                                                <button class="btn btn-sm btn-primary btn-white btn-sm-font2 reservationDialog-2 moreAbso">
                                                                    Profile
                                                                </button>
                                                            </td>
                                                            <td class="text-left input-noEdit">已排房</td>
                                                            <td class="text-left input-noEdit">803</td>
                                                            <td class="text-left input-noEdit">Taiwan</td>
                                                            <td class="text-left input-noEdit">803</td>
                                                            <td class="text-left">
                                                                <input type="text" class="selectHt"
                                                                       placeholder="12345678"/>
                                                            </td>
                                                        </tr>
                                                        <!--4-->
                                                        <tr>
                                                            <td class="text-center">
                                                                <i class="fa fa-minus red"></i>
                                                            </td>
                                                            <td class="text-left input-noEdit">4</td>
                                                            <td class="text-left td-relative">
                                                                <input type="text" class="selectHt input_sta_required"
                                                                       placeholder="住客姓名"/>
                                                                <button class="btn btn-sm btn-primary btn-white btn-sm-font2 reservationDialog-2 moreAbso">
                                                                    Profile
                                                                </button>
                                                            </td>
                                                            <td class="text-left input-noEdit">已排房</td>
                                                            <td class="text-left input-noEdit">804</td>
                                                            <td class="text-left input-noEdit">Taiwan</td>
                                                            <td class="text-left input-noEdit">804</td>
                                                            <td class="text-left">
                                                                <input type="text" class="selectHt"
                                                                       placeholder="12345678"/>
                                                            </td>
                                                        </tr>
                                                        <!--5-->
                                                        <tr>
                                                            <td class="text-center">
                                                                <i class="fa fa-minus red"></i>
                                                            </td>
                                                            <td class="text-left input-noEdit">5</td>
                                                            <td class="text-left td-relative">
                                                                <input type="text" class="selectHt input_sta_required"
                                                                       placeholder="住客姓名"/>
                                                                <button class="btn btn-sm btn-primary btn-white btn-sm-font2 reservationDialog-2 moreAbso">
                                                                    Profile
                                                                </button>
                                                            </td>
                                                            <td class="text-left input-noEdit">已排房</td>
                                                            <td class="text-left input-noEdit">805</td>
                                                            <td class="text-left input-noEdit">Taiwan</td>
                                                            <td class="text-left input-noEdit">805</td>
                                                            <td class="text-left">
                                                                <input type="text" class="selectHt"
                                                                       placeholder="12345678"/>
                                                            </td>
                                                        </tr>
                                                        </tbody>
                                                    </table>
                                                    <!-- table -->
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                            <!-------- /.tabPage -------->
                        </div>
                    </div>
                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth resv_assignHouse"
                                                role="button">指定房組
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-gray btn-defaultWidth resv_PaxImports"
                                                role="button">Imports
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth resv_guestDetail-btn1"
                                                role="button">交辦事項
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth foCnt_roomAssign"
                                                role="button">排房
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">儲存
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
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
</template>

<script>

    /** DatagridRmSingleGridClass **/
    function DatagridSingleGridClass() {
    }

    DatagridSingleGridClass.prototype = new DatagridBaseClass();
    DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
    };
    DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
    };

    export default {
        name: "guestDetail",
        props: ["rowData"],
        mounted() {
            this.fetchAllFieldsData();
        },
        data() {
            return {
                orderDtGroupFieldData: [],      //group order dt 的欄位資料
                orderDtGroupRowsData: [],       //group order dt 的資料
                oriOrderDtGroupRowsData: [],    //group order dt 的原始資料
                orderDtFieldData: [],           //所group 到的所有 order dt 欄位資料
                orderDtRowsData: [],            //所group 到的所有 order dt 資料
                oriOrderDtRowsData: [],         //所group 到的所有 order dt 原始資料
                guestMnFieldData: [],           //所group 到的所有 guest mn 欄位資料
                guestMnRowsData: [],            //所group 到的所有 guest mn 原始資料
                oriGuestMnRowsData: [],         //所group 到的所有 guest mn 資料
                dgIns: {}
            }
        },
        watch: {
            rowData(val) {
                if (!_.isEmpty(val)) {
                    this.fetchOrderDtRowData();
                }
            }
        },
        methods: {
            async fetchFieldsData(param) {
                return await BacUtils.doHttpPromisePostProxy("/api/fetchOnlyDataGridFieldData", param).then((result) => {
                    return result;
                }).catch(err => {
                    return {success: false, errMsg: err};
                })
            },
            async fetchAllFieldsData() {
                try {
                    let [lo_fetchGroupOrderDtFieldsData, lo_fetchOrderDtFieldsData, lo_fetchGuestMnFieldsData] = await Promise.all([
                        this.fetchFieldsData({prg_id: 'PMS0110042', page_id: 1, tab_page_id: 1}),
                        this.fetchFieldsData({prg_id: 'PMS0110042', page_id: 1, tab_page_id: 2}),
                        this.fetchFieldsData({prg_id: 'PMS0110042', page_id: 1, tab_page_id: 3})
                    ]);
                    this.orderDtGroupFieldData = lo_fetchGroupOrderDtFieldsData.dgFieldsData;
                    this.orderDtFieldData = lo_fetchOrderDtFieldsData.dgFieldsData;
                    this.guestMnFieldData = lo_fetchGuestMnFieldsData.dgFieldsData;
                    console.log(lo_fetchGroupOrderDtFieldsData, lo_fetchOrderDtFieldsData, lo_fetchGuestMnFieldsData)
                }
                catch (err) {
                    console.log(err);
                }
            },
            fetchOrderDtRowData() {
                BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", {
                    prg_id: 'PMS0110042',
                    page_id: 1,
                    tab_page_id: 1,
                    searchCond: {ikey: this.rowData.ikey}
                }).then((result) => {
                    if (result.success) {
                        this.orderDtGroupRowsData = result.dgRowData;
                        this.showDataGrid();
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            showDataGrid() {
                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init("PMS0110042", "orderDtTable", DatagridFieldAdapter.combineFieldOption(this.orderDtGroupFieldData, "orderDtTable"), this.orderDtGroupFieldData, {
                    pagination: true,
                    rownumbers: true
                });
                this.dgIns.loadPageDgData(this.orderDtGroupRowsData);
            }
        }
    }
</script>

<style scoped>

</style>