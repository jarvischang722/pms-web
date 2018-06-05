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
                                        <span class="subT">官網號碼:</span>
                                        <span class="subCon">RMHTD17000121</span>
                                        <span class="subT">訂房卡號:</span>
                                        <span class="subCon">06587201</span>
                                        <span class="subT">確認狀態:</span>
                                        <select class="input-medium resvCard-xs">
                                            <option value="y">Y</option>
                                            <option value="n">N</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div class="easyui-tabs easyUi-custom1 guestHoliday" style="overflow-y: auto; width: 100%;">
                                <div title="Reservation" class="padding-tabs">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <div class="main-content-data">
                                                <!--1-->
                                                <div class="grid">
                                                    <div class="grid-item">
                                                        <label>住客姓名</label>
                                                        <input type="text" class="input-medium resvCard-col2Spec1"
                                                               placeholder="Simon Cowll"/>
                                                        <button class="btn btn-sm btn-primary btn-white btn-sm-font2 reservationDialog-2 btn-afterInput">
                                                            Profile
                                                        </button>
                                                    </div>
                                                    <div class="grid-item">
                                                        <label>訂房公司</label>
                                                        <input type="text"
                                                               class="input-medium resvCard-col2Rm input_sta_required"
                                                               placeholder="agoda"/>
                                                        <i class="moreClick fa fa-ellipsis-h sales-AccountMain"></i>
                                                    </div>
                                                </div>
                                                <!--2-->
                                                <div class="grid">
                                                    <div class="grid-item">
                                                        <label>職稱</label>
                                                        <input type="text" class="input-medium resvCard-sm"
                                                               placeholder="Manager" disabled/>
                                                        <!--<select class="input-medium resvCard-xs" disabled>-->
                                                        <!--<option value="male">M</option>-->
                                                        <!--<option value="female">F</option>-->
                                                        <!--</select>-->
                                                        <input type="text" class="input-medium resvCard-xs ml-4"
                                                               placeholder=""
                                                               disabled/>
                                                    </div>
                                                    <div class="grid-item">
                                                        <label>VIP</label>
                                                        <input type="text" class="input-medium resvCard-sm"
                                                               placeholder="Normal" disabled/>
                                                    </div>
                                                    <div class="grid-item">
                                                        <label>團號</label>
                                                        <input type="text" class="input-medium resvCard-col2"
                                                               placeholder=""/>
                                                    </div>
                                                </div>
                                                <!--3-->
                                                <div class="grid">
                                                    <div class="pull-left">
                                                        <div class="grid-item">
                                                            <label class="pull-left">歷史備註</label>
                                                            <textarea
                                                                    class="input-medium resvCard-col2 pull-left input-hCol2"
                                                                    placeholder="pick guy" disabled></textarea>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="clearfix"></div>
                                                    </div>
                                                    <div class="pull-left">
                                                        <div class="grid">
                                                            <div class="grid-item">
                                                                <label class="pull-left">公帳號</label>
                                                                <input type="text"
                                                                       class="input-medium resvCard-xs pull-left"
                                                                       placeholder="Y" disabled>
                                                                <input type="text"
                                                                       class="input-medium resvCard-xs pull-left ml-3"
                                                                       placeholder="G01" disabled/>
                                                                <div class="pull-left">
                                                                    <i class="moreClick fa fa-ellipsis-h publicAccount-btn"></i>
                                                                </div>
                                                                <div class="clearfix"></div>
                                                            </div>
                                                            <div class="grid-item">
                                                                <label>業務員</label>
                                                                <select class="input-medium resvCard">
                                                                    <option value="1">Rick Chen</option>
                                                                    <option value="2">Jing Chen</option>
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div class="grid">
                                                            <div class="grid-item">
                                                                <label>公司名稱</label>
                                                                <input type="text" class="input-medium resvCard-col2"
                                                                       placeholder="Nokia company Ltd."/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="clearfix"></div>
                                                </div>
                                                <div class="border-double1"></div>
                                                <!--4-->
                                                <div class="grid">
                                                    <div class="grid-item">
                                                        <label>Fixed Order</label>
                                                        <select class="input-medium resvCard">
                                                            <option value="y">Yes</option>
                                                            <option value="n">No</option>
                                                        </select>
                                                    </div>
                                                    <div class="grid-item">
                                                        <label class="pull-left">旅客登記卡</label>
                                                        <div class="popCheckbox pull-left resvCk-1">
                                                                                <span class="checkbox">
                                                                                  <label class="checkbox-width">
                                                                                      <input name="form-field-checkbox"
                                                                                             type="checkbox"
                                                                                             class="ace" checked>
                                                                                      <span class="lbl">
                                                                                        <span class="txt">印房租</span>
                                                                                      </span>
                                                                                  </label>
                                                                                </span>
                                                        </div>
                                                        <div class="clearfix"></div>
                                                    </div>
                                                    <div class="grid-item">
                                                        <label>From</label>
                                                        <select class="input-medium resvCard-xs">
                                                            <option value="c">C</option>
                                                            <option value="p">P</option>
                                                        </select>
                                                    </div>

                                                    <div class="grid-item">
                                                        <label class="label-sm">聯絡人</label>
                                                        <input type="text"
                                                               class="input-medium rc-contact-man input_sta_required"
                                                               placeholder="Gloria"/>
                                                        <input type="text"
                                                               class="input-medium resvCard-xs ml-4 input_sta_required"
                                                               placeholder="Ms."/>
                                                    </div>
                                                </div>
                                                <!--5-->
                                                <div class="grid">
                                                    <div class="pull-left">
                                                        <div class="grid-item">
                                                            <label class="pull-left">訂房備註</label>
                                                            <textarea
                                                                    class="input-medium resvCard-col2 pull-left input-hCol2"
                                                                    placeholder="All = Co"></textarea>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                        <div class="clearfix"></div>
                                                    </div>
                                                    <div class="pull-left">
                                                        <div class="grid">
                                                            <div class="grid-item">
                                                                <label>手機</label>
                                                                <input type="text" class="input-medium resvCard"
                                                                       placeholder="932555656"/>
                                                            </div>
                                                            <div class="grid-item">
                                                                <label>公司電話</label>
                                                                <input type="text" class="input-medium resvCardRm"
                                                                       placeholder="02-25175008"/>
                                                                <i class="moreClick fa fa-ellipsis-h othContact"></i>
                                                            </div>
                                                        </div>

                                                        <div class="grid">
                                                            <div class="grid-item">
                                                                <label>電子郵件</label>
                                                                <input type="text" class="input-medium resvCard-col2"
                                                                       placeholder="simonoowll@nokia.com"/>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div class="clearfix"></div>
                                                </div>
                                            </div><!--main-content-data-->
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                            </div>
                            <!-------- /.tabPage -------->

                            <div class="space-6"></div>
                            <div id="resv-single-info">
                                <div class="col-xs-12 col-sm-12">
                                    <div class="row">
                                        <div class="main-content-data">
                                            <div>
                                                <!--訂房卡資料table-->
                                                <!--<table id="reservation_resvCard-table"-->
                                                <!--style="height: 165px; width: 100%;"></table>-->
                                                <div class="container_12 divider">
                                                    <div class="grid_12 fixed-table-container" style="height: 132px;">
                                                        <table class="fancyTable themeTable treeControl custom-table"
                                                               id="resvSingle-table" cellpadding="0" cellspacing="0">
                                                            <thead>
                                                            <tr>
                                                                <th class="text-center ca-headerTitle height-fntThead rp-first-th">
                                                                    <i class="fa fa-plus green"></i>
                                                                </th>
                                                                <th class="text-left" style="min-width: 40px;">狀態</th>
                                                                <th class="text-left" style="min-width: 40px;">入住日期</th>
                                                                <th class="text-left" style="min-width: 35px;">星期</th>
                                                                <th class="text-left" style="min-width: 35px;">天數</th>
                                                                <th class="text-left" style="min-width: 40px;">退房日期</th>
                                                                <th class="text-left" style="min-width: 35px;">星期</th>
                                                                <th class="text-left" style="min-width: 215px;">房價代號
                                                                </th>
                                                                <th class="text-left" style="min-width: 70px;">計價房型</th>
                                                                <th class="text-left" style="min-width: 70px;">使用房型</th>
                                                                <th class="text-right" style="min-width: 35px;">間數</th>
                                                                <th class="text-right" style="min-width: 50px;">單價</th>
                                                                <th class="text-right" style="min-width: 50px;">服務費</th>
                                                                <!--<th class="text-left" style="min-width: 35px;">大人</th>-->
                                                                <!--<th class="text-left" style="min-width: 35px;">小孩</th>-->
                                                                <!--<th class="text-left" style="min-width: 35px;">嬰兒</th>-->
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
                                                                <!--<td class=""></td>-->
                                                                <!--<td class=""></td>-->
                                                                <!--<td class=""></td>-->
                                                            </tr>
                                                            <!--1-->
                                                            <tr>
                                                                <td class="text-center">
                                                                    <i class="fa fa-minus red"></i>
                                                                </td>
                                                                <td class="text-left input-noEdit">正常</td>
                                                                <td class="text-left">
                                                                    <template>
                                                                        <el-date-picker v-model="ciDate1" type="date"
                                                                                        placeholder=""
                                                                                        class="date-wt input_sta_required">
                                                                        </el-date-picker>
                                                                    </template>
                                                                </td>
                                                                <td class="text-left input-noEdit">日</td>
                                                                <td class="text-left">
                                                                    <input type="text" class="selectHt"
                                                                           placeholder="2"/></td>
                                                                <td class="text-left">
                                                                    <template>
                                                                        <el-date-picker v-model="coDate1" type="date"
                                                                                        placeholder=""
                                                                                        class="date-wt input_sta_required">
                                                                        </el-date-picker>
                                                                    </template>
                                                                </td>
                                                                <td class="text-left input-noEdit">日</td>
                                                                <td class="text-left td-more">
                                                                    <input type="text"
                                                                           class="selectHt pull-left wt-input input_sta_required"
                                                                           placeholder="F1To1:一般散客價"/>
                                                                    <i class="moreClick fa fa-ellipsis-h choiceRmPrice pull-left"></i>
                                                                </td>
                                                                <td class="text-left">
                                                                    <!--計價房型-->
                                                                    <template>
                                                                        <el-select v-model="roomTypes_val_1"
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
                                                                        <el-select v-model="useRmTypes_val_1"
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
                                                                <td class="text-right">
                                                                    <input type="text"
                                                                           class="selectHt input_sta_required"
                                                                           placeholder="2"/>
                                                                </td>
                                                                <td class="text-right input-noEdit">5,000</td>
                                                                <td class="text-right input-noEdit">500</td>
                                                                <!--<td class="text-left"><input type="text"-->
                                                                <!--class="selectHt"-->
                                                                <!--placeholder="2"/></td>-->
                                                                <!--<td class="text-left"><input type="text"-->
                                                                <!--class="selectHt"-->
                                                                <!--placeholder="1"/></td>-->
                                                                <!--<td class="text-left"><input type="text"-->
                                                                <!--class="selectHt"-->
                                                                <!--placeholder="1"/></td>-->
                                                            </tr>
                                                            <!--2-->
                                                            <tr>
                                                                <td class="text-center">
                                                                    <i class="fa fa-minus red"></i>
                                                                </td>
                                                                <td class="text-left input-noEdit">正常</td>
                                                                <td class="text-left">
                                                                    <template>
                                                                        <el-date-picker v-model="ciDate2" type="date"
                                                                                        placeholder=""
                                                                                        class="date-wt input_sta_required">
                                                                        </el-date-picker>
                                                                    </template>
                                                                </td>
                                                                <td class="text-left input-noEdit">日</td>
                                                                <td class="text-left">
                                                                    <input type="text" class="selectHt"
                                                                           placeholder="2"/>
                                                                </td>
                                                                <td class="text-left">
                                                                    <template>
                                                                        <el-date-picker v-model="coDate2" type="date"
                                                                                        placeholder=""
                                                                                        class="date-wt input_sta_required">
                                                                        </el-date-picker>
                                                                    </template>
                                                                </td>
                                                                <td class="text-left input-noEdit">日</td>
                                                                <td class="text-left td-more">
                                                                    <input type="text"
                                                                           class="selectHt pull-left wt-input input_sta_required"
                                                                           placeholder="F1To1:一般散客價"/>
                                                                    <i class="moreClick fa fa-ellipsis-h choiceRmPrice pull-left"></i>
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
                                                                <td class="text-right">
                                                                    <input type="text"
                                                                           class="selectHt input_sta_required"
                                                                           placeholder="2"/>
                                                                </td>
                                                                <td class="text-right input-noEdit">5,000</td>
                                                                <td class="text-right input-noEdit">500</td>
                                                            </tr>
                                                            <!--3-->
                                                            <tr>
                                                                <td class="text-center">
                                                                    <i class="fa fa-minus red"></i>
                                                                </td>
                                                                <td class="text-left input-noEdit">正常</td>
                                                                <td class="text-left">
                                                                    <template>
                                                                        <el-date-picker v-model="ciDate3" type="date"
                                                                                        placeholder=""
                                                                                        class="date-wt input_sta_required">
                                                                        </el-date-picker>
                                                                    </template>
                                                                </td>
                                                                <td class="text-left input-noEdit">日</td>
                                                                <td class="text-left">
                                                                    <input type="text" class="selectHt"
                                                                           placeholder="2"/></td>
                                                                <td class="text-left">
                                                                    <template>
                                                                        <el-date-picker v-model="coDate3" type="date"
                                                                                        placeholder=""
                                                                                        class="date-wt input_sta_required">
                                                                        </el-date-picker>
                                                                    </template>
                                                                </td>
                                                                <td class="text-left input-noEdit">日</td>
                                                                <td class="text-left td-more">
                                                                    <input type="text"
                                                                           class="selectHt pull-left wt-input input_sta_required"
                                                                           placeholder="F1To1:一般散客價"/>
                                                                    <i class="moreClick fa fa-ellipsis-h choiceRmPrice pull-left"></i>
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
                                                                <td class="text-right">
                                                                    <input type="text"
                                                                           class="selectHt input_sta_required"
                                                                           placeholder="2"/>
                                                                </td>
                                                                <td class="text-right input-noEdit">5,000</td>
                                                                <td class="text-right input-noEdit">500</td>
                                                            </tr>
                                                            <!--4-->
                                                            <tr>
                                                                <td class="text-center">
                                                                    <i class="fa fa-minus red"></i>
                                                                </td>
                                                                <td class="text-left input-noEdit">正常</td>
                                                                <td class="text-left">
                                                                    <template>
                                                                        <el-date-picker v-model="ciDate4" type="date"
                                                                                        placeholder=""
                                                                                        class="date-wt input_sta_required">
                                                                        </el-date-picker>
                                                                    </template>
                                                                </td>
                                                                <td class="text-left input-noEdit">日</td>
                                                                <td class="text-left">
                                                                    <input type="text" class="selectHt"
                                                                           placeholder="2"/></td>
                                                                <td class="text-left">
                                                                    <template>
                                                                        <el-date-picker v-model="coDate4" type="date"
                                                                                        placeholder=""
                                                                                        class="date-wt input_sta_required">
                                                                        </el-date-picker>
                                                                    </template>
                                                                </td>
                                                                <td class="text-left input-noEdit">日</td>
                                                                <td class="text-left td-more">
                                                                    <input type="text"
                                                                           class="selectHt pull-left wt-input input_sta_required"
                                                                           placeholder="F1To1:一般散客價"/>
                                                                    <i class="moreClick fa fa-ellipsis-h choiceRmPrice pull-left"></i>
                                                                </td>
                                                                <td class="text-left">
                                                                    <!--計價房型-->
                                                                    <template>
                                                                        <el-select v-model="roomTypes_val_4"
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
                                                                        <el-select v-model="useRmTypes_val_4"
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
                                                                <td class="text-right">
                                                                    <input type="text"
                                                                           class="selectHt input_sta_required"
                                                                           placeholder="2"/>
                                                                </td>
                                                                <td class="text-right input-noEdit">5,000</td>
                                                                <td class="text-right input-noEdit">500</td>
                                                            </tr>
                                                            <!--5-->
                                                            <tr>
                                                                <td class="text-center">
                                                                    <i class="fa fa-minus red"></i>
                                                                </td>
                                                                <td class="text-left input-noEdit">正常</td>
                                                                <td class="text-left">
                                                                    <template>
                                                                        <el-date-picker v-model="ciDate5" type="date"
                                                                                        placeholder=""
                                                                                        class="date-wt input_sta_required">
                                                                        </el-date-picker>
                                                                    </template>
                                                                </td>
                                                                <td class="text-left input-noEdit">日</td>
                                                                <td class="text-left">
                                                                    <input type="text" class="selectHt"
                                                                           placeholder="2"/></td>
                                                                <td class="text-left">
                                                                    <template>
                                                                        <el-date-picker v-model="coDate5" type="date"
                                                                                        placeholder=""
                                                                                        class="date-wt input_sta_required">
                                                                        </el-date-picker>
                                                                    </template>
                                                                </td>
                                                                <td class="text-left input-noEdit">日</td>
                                                                <td class="text-left td-more">
                                                                    <input type="text"
                                                                           class="selectHt pull-left wt-input input_sta_required"
                                                                           placeholder="F1To1:一般散客價"/>
                                                                    <i class="moreClick fa fa-ellipsis-h choiceRmPrice pull-left"></i>
                                                                </td>
                                                                <td class="text-left">
                                                                    <!--計價房型-->
                                                                    <template>
                                                                        <el-select v-model="roomTypes_val_5"
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
                                                                        <el-select v-model="useRmTypes_val_5"
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
                                                                <td class="text-right">
                                                                    <input type="text"
                                                                           class="selectHt input_sta_required"
                                                                           placeholder="2"/>
                                                                </td>
                                                                <td class="text-right input-noEdit">5,000</td>
                                                                <td class="text-right input-noEdit">500</td>
                                                            </tr>
                                                            <!--6-->
                                                            <tr>
                                                                <td class="text-center">
                                                                    <i class="fa fa-minus red"></i>
                                                                </td>
                                                                <td class="text-left input-noEdit">正常</td>
                                                                <td class="text-left">
                                                                    <template>
                                                                        <el-date-picker v-model="ciDate6" type="date"
                                                                                        placeholder=""
                                                                                        class="date-wt input_sta_required">
                                                                        </el-date-picker>
                                                                    </template>
                                                                </td>
                                                                <td class="text-left input-noEdit">日</td>
                                                                <td class="text-left">
                                                                    <input type="text" class="selectHt"
                                                                           placeholder="2"/></td>
                                                                <td class="text-left">
                                                                    <template>
                                                                        <el-date-picker v-model="coDate6" type="date"
                                                                                        placeholder=""
                                                                                        class="date-wt input_sta_required">
                                                                        </el-date-picker>
                                                                    </template>
                                                                </td>
                                                                <td class="text-left input-noEdit">日</td>
                                                                <td class="text-left td-more">
                                                                    <input type="text"
                                                                           class="selectHt pull-left wt-input input_sta_required"
                                                                           placeholder="F1To1:一般散客價"/>
                                                                    <i class="moreClick fa fa-ellipsis-h choiceRmPrice pull-left"></i>
                                                                </td>
                                                                <td class="text-left">
                                                                    <!--計價房型-->
                                                                    <template>
                                                                        <el-select v-model="roomTypes_val_6"
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
                                                                        <el-select v-model="useRmTypes_val_6"
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
                                                                <td class="text-right">
                                                                    <input type="text"
                                                                           class="selectHt input_sta_required"
                                                                           placeholder="2"/>
                                                                </td>
                                                                <td class="text-right input-noEdit">5,000</td>
                                                                <td class="text-right input-noEdit">500</td>
                                                            </tr>
                                                            </tbody>
                                                        </table>
                                                        <!-- table -->
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="resvCard-data">
                                                <div class="pull-right">
                                                    <span>房租:<span class="font-lg">10,000</span></span>
                                                    <span>服務費:<span class="font-lg">1,000</span></span>
                                                    <span>其他費用:<span class="font-lg">700</span></span>
                                                    <span>總計:<span class="font-lg">11,700</span></span>
                                                    <span>大人:<span class="font-lg">4</span></span>
                                                    <span>小孩:<span class="font-lg">1</span></span>
                                                    <span>嬰兒:<span class="font-lg">0</span></span>
                                                </div>
                                            </div>
                                        </div><!--main-content-data-->
                                    </div>
                                </div>
                                <div class="clearfix"></div>

                                <div class="space-4"></div>
                                <div class="col-xs-12 col-sm-12">
                                    <div class="row">
                                        <div class="main-content-data borderFrame">
                                            <!--1-->
                                            <div class="grid">
                                                <div class="grid-item">
                                                    <label>
                                                    <span class="notice">
                                                        <i class="fa fa-star"></i>
                                                    </span>訂房來源
                                                    </label>
                                                    <template>
                                                        <el-select v-model="resv_sources_val_4"
                                                                   placeholder="請選擇"
                                                                   class="el-select-ht input-medium resvCard input_sta_required">
                                                            <el-option
                                                                    v-for="item in resv_sources"
                                                                    :key="item.value"
                                                                    :label="item.label"
                                                                    :value="item.value">
                                                            </el-option>
                                                        </el-select>
                                                    </template>
                                                </div>
                                                <div class="grid-item">
                                                    <label>佣金</label>
                                                    <input type="text" class="input-medium resvCard"
                                                           placeholder=""/>
                                                </div>
                                                <div class="grid-item">
                                                    <label>房租</label>
                                                    <input type="text" class="input-medium resvCard text-right"
                                                           placeholder="10,000" disabled/>
                                                </div>
                                                <div class="grid-item">
                                                    <label>服務費</label>
                                                    <input type="text" class="input-medium resvCard text-right"
                                                           placeholder="1000" disabled/>
                                                </div>
                                            </div>
                                            <!--2-->
                                            <div class="grid">
                                                <div class="grid-item">
                                                    <label>市場類別</label>
                                                    <template>
                                                        <el-select v-model="marketCates_val_4"
                                                                   placeholder="請選擇"
                                                                   class="el-select-ht input-medium resvCard input_sta_required">
                                                            <el-option
                                                                    v-for="item in marketCates"
                                                                    :key="item.value"
                                                                    :label="item.label"
                                                                    :value="item.value">
                                                            </el-option>
                                                        </el-select>
                                                    </template>
                                                </div>

                                                <div class="grid-item">
                                                    <label>大/小/嬰</label>
                                                    <input type="text" class="input-medium resvCard-2xs text-right"
                                                           placeholder="1" disabled/>
                                                    <input type="text" class="input-medium resvCard-2xs text-right ml-2"
                                                           placeholder="0" disabled/>
                                                    <input type="text" class="input-medium resvCard-2xs text-right ml-2"
                                                           placeholder="0" disabled/>
                                                </div>
                                                <div class="grid-item">
                                                    <label>其他費用</label>
                                                    <input type="text" class="input-medium resvCard text-right"
                                                           placeholder="700" disabled/>
                                                </div>
                                                <div class="grid-item">
                                                    <label>小計</label>
                                                    <input type="text" class="input-medium resvCard text-right"
                                                           placeholder="11,700" disabled/>
                                                </div>
                                            </div>
                                        </div><!--main-content-data-->
                                    </div>
                                </div>
                                <div class="resvCard-data">
                                    <div class="pull-right">
                                    </div>
                                </div>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                    </div>
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
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
    </div>
</template>
<script>
    export default {
        name: 'pms0110041-lite',
        props: ["rowData", "isCreateStatus", "isEditStatus", "isModifiable"],
        data() {
            return {
                orderMnFieldsData: [],      //order mn 欄位資料
                oriOrderMnFieldsData: [],   //原始order mn 欄位資料
                orderMnRowsData: {},        //order mn 資料
                oriOrderMnRowsData: {},     //原始order mn 欄位資料
                orderDtFieldsData: [],      //order dt 欄位資料
                oriOrderDtFieldsData: [],
                orderDtRowsData: [],
                oriOrderMDtRowsData: [],
                guestMnFieldsData: [],
                oriGuestMnFieldsData: [],
                guestMnRowsData: [],
                oriGuestMnRowsData: [],
            }
        },
        watch: {
            rowData(val) {
                if (!_.isEmpty(val)) {
                    this.initTmpCUD();
                    this.fetchOrderMnFieldsData();
                }
            }
        },
        methods: {
            initTmpCUD() {
            },
            fetchOrderMnFieldsData() {
            }
        }
    }
</script>
<style>

</style>