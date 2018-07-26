<template>
    <div id="PMS0210060_dialog" class="hide padding-5">
        <div class="businessCompanyData">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-10 col-sm-10">
                        <div class="row no-margin-right">
                            <!--單筆 order mn -->
                            <div class="main-content-data borderFrame">
                                <div v-for="(fields, key) in orderMnFieldsData">
                                    <div class="grid">
                                        <div class="grid-item" v-for="field in fields" style="position: relative;">
                                            <label v-if="field.visiable == 'Y' && field.ui_type != 'checkbox'"
                                                   :style="{width:field.label_width + 'px' , height:field.height + 'px'}">
                                                <span v-if=" field.requirable == 'Y' " style="color: red;">*</span>
                                                <span v-else>{{ field.ui_display_name }}</span>
                                            </label>

                                            <input type="text" v-model="orderMnValueData[field.ui_field_name]"
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
                                                        v-model="orderMnValueData[field.ui_field_name]"
                                                        :data-display="field.selectDataDisplay "
                                                        :data="field.selectData"
                                                        is-qry-src-before="Y" value-field="value" text-field="display"
                                                        @update:v-model="val => orderMnValueData[field.ui_field_name] = val"
                                                        :default-val="orderMnValueData[field.ui_field_name]"
                                                        :field="field"
                                                        :disabled="field.modificable == 'N'|| !isModifiable ||
                                                      (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                            </bac-select>

                                            <!--  textarea -->
                                            <template v-if="field.visiable == 'Y' && field.ui_type == 'textarea'">
                                                <textarea v-model="orderMnValueData[field.ui_field_name]"
                                                          class="numStyle-none btn-gray" rows="1"
                                                          style="resize: none; display: inline-block;"
                                                          :style="{width:field.width + 'px'}"
                                                          :required="field.requirable == 'Y'"
                                                          :maxlength="field.ui_field_length"
                                                          :disabled="field.modificable == 'N'|| !isModifiable ||
                                                      (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                </textarea>
                                            </template>

                                            <!--按鈕-->
                                            <div class="pull-left"
                                                 v-if="field.visiable == 'Y' && field.ui_type == 'button'">
                                                <i class="moreClick fa fa-ellipsis-h"
                                                   @click="buttonFunction(field)"></i>
                                            </div>

                                        </div>
                                    </div>
                                </div>

                                <div class="grid">
                                    <div class="grid-item">
                                        <label>訂房公司</label>
                                        <input class="input-medium rateCode-s1" placeholder="" type="text">
                                    </div>
                                    <div class="grid-item">
                                        <label>訂房卡號</label>
                                        <input class="input-medium rateCode-s1" type="text" placeholder="">
                                    </div>
                                </div>
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>公司名稱</label>
                                        <input class="input-medium rateCode-s1" type="text" placeholder="">
                                    </div>
                                    <div class="grid-item">
                                        <label class="pull-left">公帳號</label>
                                        <input type="text"
                                               class="input-medium resvCard-s1Half2 pull-left"
                                               placeholder="Y" disabled>
                                        <input type="text"
                                               class="input-medium resvCard-s1Half2 pull-left ml-3"
                                               placeholder="G01" disabled/>
                                        <div class="clearfix"></div>
                                    </div>
                                </div>
                                <div class="grid">
                                    <div class="grid-item">
                                        <label>團號</label>
                                        <input class="input-medium rateCode-s1" placeholder="" type="text">
                                    </div>
                                    <!--lite 版不顯示-->
                                    <!--<div class="grid-item">-->
                                    <!--<label>訂金編號</label>-->
                                    <!--<input class="input-medium rateCode-s1" type="text" placeholder="">-->
                                    <!--<i class="moreClick fa fa-ellipsis-h"></i>-->
                                    <!--</div>-->
                                </div>
                                <div class="grid">
                                    <div class="grid-item">
                                        <label class="pull-left">訂房備註</label>
                                        <textarea class="input-medium pull-left rateCode-s1-col2 height-auto rzNone"
                                                  placeholder="" rows="4"></textarea>
                                        <i class="moreClick fa fa-ellipsis-h pull-left resvMoreRmks"></i>
                                    </div>
                                </div>
                            </div>
                            <!--/.單筆 order mn -->
                            <div class="space-4"></div>
                            <!--多筆 guest mn -->
                            <div class="main-content-data">
                                <table id="fd-checkIn-table" style="height: 200px;"></table>
                            </div>
                            <!--/.多筆 guest mn -->
                            <div class="clearfix"></div>
                        </div>
                    </div>
                    <div class="col-xs-2 col-sm-2">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">全選
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">取消全選
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">入住
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button">C/I公帳號
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth reservationDialog-1"
                                                role="button">修改訂房卡
                                        </button>
                                    </li>
                                    <!--<li>-->
                                    <!--<button class="btn btn-primary btn-white btn-defaultWidth resv_guestDetail"-->
                                    <!--role="button">住客資料-->
                                    <!--</button>-->
                                    <!--</li>-->
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth foCnt_roomAssign"
                                                role="button">排房
                                        </button>
                                    </li>
                                    <!--l 版隱藏-->
                                    <!--<li>-->
                                    <!--<button class="btn btn-gray btn-defaultWidth"-->
                                    <!--role="button">螢幕簽帳-->
                                    <!--</button>-->
                                    <!--</li>-->
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

                <div class="clearfix"></div>
            </div>
        </div>
    </div>
</template>

<script>
    const gs_prgId = "PMS0210060";

    export default {
        name: "PMS0210060_dialog",
        props: ["rowData", "isCheckIn"],
        mounted() {
        },
        data() {
            return {
                oriOrderMnFieldsData: [],
                orderMnFieldsData: [],
                orderMnValueData: {},
                guestMnFieldData: [],
                guestMnValueData: []
            }
        },
        watch: {
            async isCheckIn(val) {
                if (!_.isUndefined(val)) {
                    await this.fetchOrderMnData();
                    await this.fetchGuestMnData();
                }
            }
        },
        methods: {
            async fetchOrderMnData() {
                let lo_param = {
                    prg_id: gs_prgId,
                    page_id: this.isCheckIn ? 1010 : 1020,
                    tab_page_id: 11,
                    searchCond: this.rowData
                };

                let lo_orderMnData = await BacUtils.doHttpPromisePostProxy("/api/fetchSinglePageFieldData", lo_param).then(result => {
                    return result
                }).catch(err => {
                    return {success: false, errorMsg: err}
                });

                if (lo_orderMnData.success) {
                    this.oriOrderMnFieldsData = lo_orderMnData.gsMnData.fieldsData;
                    this.orderMnFieldsData = _.values(_.groupBy(_.sortBy(this.oriOrderMnFieldsData, "col_seq"), "row_seq"));
                    this.orderMnValueData = lo_orderMnData.gsMnData.rowData[0];
                }
                else {
                    alert(lo_orderMnData.errorMsg);
                }
            },
            async fetchGuestMnData() {
                let lo_param = {
                    prg_id: gs_prgId,
                    page_id: this.isCheckIn ? 1010 : 1020,
                    tab_page_id: 12,
                    searchCond: this.rowData
                };

                let lo_guestMnData = await BacUtils.doHttpPromisePostProxy("/api/fetchDataGridFieldData", lo_param).then(result => {
                    return result
                }).catch(err => {
                    return {success: false, errorMsg: err}
                });

                if (lo_guestMnData.success) {
                    this.guestMnFieldData = _.sortBy(lo_guestMnData.dgFieldsData, "col_seq");
                    this.guestMnValueData = lo_guestMnData.dgRowData;
                }
                else {
                    alert(lo_guestMnData.errorMsg);
                }
            },
            buttonFunction(field) {
            }
        }
    }
</script>

<style scoped>

</style>