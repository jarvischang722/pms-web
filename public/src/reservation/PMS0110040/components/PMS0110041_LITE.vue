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
                            <!--order mn&guest mn 單筆-->
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
                                                               id="resvSingle-table" cellpadding="0" cellspacing="0">
                                                            <thead>
                                                            <tr>
                                                                <th class="text-center ca-headerTitle height-fntThead rp-first-th">
                                                                    <i class="fa fa-plus green" @click="appendRow"></i>
                                                                </th>
                                                                <template v-for="field in orderDtFieldsData4table">
                                                                    <th v-if="field.visiable == 'Y'"
                                                                        :style="{'min-width': field.width + 'px'}">
                                                                        {{field.ui_display_name}}
                                                                    </th>
                                                                </template>
                                                                <!--<th class="text-left" style="min-width: 40px;">狀態</th>-->
                                                                <!--<th class="text-left" style="min-width: 40px;">入住日期</th>-->
                                                                <!--<th class="text-left" style="min-width: 35px;">星期</th>-->
                                                                <!--<th class="text-left" style="min-width: 35px;">天數</th>-->
                                                                <!--<th class="text-left" style="min-width: 40px;">退房日期</th>-->
                                                                <!--<th class="text-left" style="min-width: 35px;">星期</th>-->
                                                                <!--<th class="text-left" style="min-width: 215px;">房價代號-->
                                                                <!--</th>-->
                                                                <!--<th class="text-left" style="min-width: 70px;">計價房型</th>-->
                                                                <!--<th class="text-left" style="min-width: 70px;">使用房型</th>-->
                                                                <!--<th class="text-right" style="min-width: 35px;">間數</th>-->
                                                                <!--<th class="text-right" style="min-width: 50px;">單價</th>-->
                                                                <!--<th class="text-right" style="min-width: 50px;">服務費</th>-->
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

                                                            <template v-for="singleData in orderDtRowsData4table">
                                                                <tr>
                                                                    <td class="text-center">
                                                                        <i class="fa fa-minus red" @click="removeRow"></i>
                                                                    </td>
                                                                    <template v-for="field in orderDtFieldsData4table">
                                                                        <td class="text-left" v-if="field.visiable == 'Y'">

                                                                            <label v-if="field.ui_type=='label'">{{singleData[field.ui_field_name]}}</label>

                                                                            <input type="text" v-model="singleData[field.ui_field_name]"
                                                                                   v-if="field.visiable == 'Y' &&  field.ui_type == 'text'"
                                                                                   :style="{width:field.width + 'px'}"
                                                                                   :required="field.requirable == 'Y'" min="0"
                                                                                   :maxlength="field.ui_field_length"
                                                                                   :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                                   :disabled="field.modificable == 'N'|| !isModifiable ||
                                            (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">

                                                                            <bac-select v-if="field.visiable == 'Y' && field.ui_type == 'select'"
                                                                                        :style="{width:field.width + 'px'}"
                                                                                        v-model="singleData[field.ui_field_name]" :data="field.selectData"
                                                                                        is-qry-src-before="Y" value-field="value" text-field="display"
                                                                                        @update:v-model="val => singleData[field.ui_field_name] = val"
                                                                                        :default-val="singleData[field.ui_field_name] || field.defaultVal"
                                                                                        :field="field"
                                                                                        :disabled="field.modificable == 'N'|| !isModifiable ||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                            </bac-select>

                                                                            <!--number 金額顯示format-->
                                                                            <input type="text" v-model="singleData[field.ui_field_name]"
                                                                                   v-if="field.visiable == 'Y' && field.ui_type == 'number'"
                                                                                   :style="{width:field.width + 'px'}"
                                                                                   :class="{'input_sta_required' : field.requirable == 'Y', 'text-right' : field.ui_type == 'number'}"
                                                                                   :disabled="field.modificable == 'N'|| !isModifiable ||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">

                                                                            <!-- 日期時間選擇器 -->
                                                                            <el-date-picker v-if="field.visiable == 'Y' && field.ui_type == 'date'"
                                                                                            v-model="singleData[field.ui_field_name]" type="date"
                                                                                            :disabled="field.modificable == 'N'|| !isModifiable ||
                                                    (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                                                                            size="small" format="yyyy/MM/dd"
                                                                                            :style="{width:field.width + 'px'}"
                                                                            >
                                                                            </el-date-picker>

                                                                            <input type="text" v-model="singleData[field.ui_field_name]"
                                                                                   v-if="field.visiable == 'Y' && field.ui_type == 'button'"
                                                                                   :style="{width:field.width + 'px'}"
                                                                                   :required="field.requirable == 'Y'" min="0"
                                                                                   :maxlength="field.ui_field_length"
                                                                                   :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                                   :disabled="field.modificable == 'N'|| !isModifiable ||
                                            (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)"
                                                                            >
                                                                            <i v-if="field.ui_type == 'button'"
                                                                               class="moreClick fa fa-ellipsis-h choiceRmPrice pull-left"></i>

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
    export default {
        name: 'pms0110041-lite',
        props: ["rowData", "isCreateStatus", "isEditStatus", "isModifiable"],
        updated() {
            $("#resvSingle-table").tableHeadFixer({"left": 1});
        },
        data() {
            return {
                fieldsDataLeft: [],               //頁面顯示欄位資料
                fieldsDataRight: [],              //頁面顯示欄位資料
                oriOrderMnFieldsData: [],         //原始order mn 欄位資料
                orderMnRowsData: {},              //order mn 資料
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
                this.orderMnRowsData = {};
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
                    let lo_orderMnFieldsData = await new Promise((resolve, reject) => {
                        BacUtils.doHttpPostAgent("/api/fetchOnlySinglePageFieldData", {
                            prg_id: "PMS0110041",
                            page_id: 1,
                            tab_page_id: 12
                        }, (result) => {
                            resolve(result);
                        });
                    });
                    let lo_orderDtFieldsData = await new Promise((resolve, reject) => {
                        BacUtils.doHttpPostAgent("/api/fetchOnlySinglePageFieldData", {
                            prg_id: "PMS0110041",
                            page_id: 1,
                            tab_page_id: 13
                        }, (result) => {
                            resolve(result);
                        });
                    });
                    let lo_guestMnFieldsData = await new Promise((resolve, reject) => {
                        BacUtils.doHttpPostAgent("/api/fetchOnlySinglePageFieldData", {
                            prg_id: "PMS0110041",
                            page_id: 1,
                            tab_page_id: 11
                        }, (result) => {
                            resolve(result);
                        });
                    });
                    let lo_orderDtDgFieldsData = await new Promise((resolve, reject) => {
                        BacUtils.doHttpPostAgent("/api/fetchOnlyDataGridFieldData", {
                            prg_id: "PMS0110041",
                            page_id: 1,
                            tab_page_id: 1
                        }, (result) => {
                            resolve(result);
                        });
                    });

                    this.oriOrderMnFieldsData = lo_orderMnFieldsData.gsFieldsData;
                    this.oriOrderDtFieldsData = lo_orderDtFieldsData.gsFieldsData;
                    this.oriGuestMnFieldsData = lo_guestMnFieldsData.gsFieldsData;
                    this.orderDtFieldsData4table = _.sortBy(lo_orderDtDgFieldsData.dgFieldsData, "col_seq");

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

                    this.isLoadingDialog = true;
                    console.log(this.orderDtFieldsData4table);
                    this.orderDtRowsData4table = [{
                        athena_id: 1,
                        hotel_cod: '02',
                        ikey: 1,
                        ikey_seq_nos: 1,
                        order_sta: 1,
                        ci_dat: '2018/06/12',
                        ci_dat_week: '二',
                        days: 2,
                        co_dat: '2012/06/13',
                        co_dat_week: '三',
                        rate_cod: 'test',
                        use_cod: 1,
                        room_cod: 'test',
                        order_qnt: 1,
                        rent_amt: 1,
                        serv_amt: 1
                    }];
                }
                catch (err) {
                    console.log(err)
                }

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