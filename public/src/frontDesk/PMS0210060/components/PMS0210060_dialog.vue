<template>
    <div id="PMS0210060_dialog" class="hide padding-5">
        <div class="businessCompanyData">
            <div class="col-xs-12 col-sm-12" v-loading="isLoading" :element-loading-text="loadingText">
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
                                                          class="numStyle-none btn-gray" rows="4"
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
                            </div>
                            <!--/.單筆 order mn -->
                            <div class="space-4"></div>
                            <!--多筆 guest mn -->
                            <div class="main-content-data">
                                <div class="horizTable-outer pull-left ml-5">
                                    <table class="css_table horizTable">
                                        <thead class="css_thead">
                                        <tr class="css_tr">
                                            <th class="css_th" style="min-width:40px;">選擇</th>
                                            <th class="css_th" v-for="field in guestMnFieldData"
                                                v-if="field.visiable === 'Y'"
                                                :style="{'min-width': field.width + 'px'}">
                                                {{ field.ui_display_name }}
                                            </th>
                                        </tr>
                                        </thead>
                                        <tbody class="css_tbody">
                                        <tr class="css_tr" v-for="data in guestMnValueData">
                                            <td class="css_td">
                                                <div class="popCheckbox rmAssignCk">
                                                    <span class="checkbox">
                                                        <label class="checkbox-width">
                                                            <input name="form-field-checkbox"
                                                                   type="checkbox" :value="data"
                                                                   class="ace"
                                                                   v-model="guestMnRowDataChecked">
                                                            <span class="lbl"></span>
                                                        </label>
                                                    </span>
                                                </div>
                                            </td>
                                            <template v-for="field in guestMnFieldData">
                                                <td class="css_td" v-if="field.visiable == 'Y'">
                                                    <template v-if="field.ui_field_name == 'room_mn.clean_sta'">
                                                        <template v-if="data[field.ui_field_name] == 'D'">
                                                            <span class='red'>{{ cleanStaVal(field, data)}}</span>
                                                        </template>
                                                        <template v-else-if="data[field.ui_field_name] !== null">
                                                            <span>{{cleanStaVal(field, data)}}</span>
                                                        </template>
                                                        <template v-else>
                                                            <span>{{data[field.ui_field_name]}}</span>
                                                        </template>
                                                    </template>
                                                    <template v-else><span>{{data[field.ui_field_name]}}</span>
                                                    </template>
                                                </td>
                                            </template>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                                <table id="fd-checkIn-table" style="height: 200px;"></table>
                            </div>
                            <!--/.多筆 guest mn -->
                            <div class="clearfix"></div>
                        </div>
                    </div>
                    <!--按鈕-->
                    <div class="col-xs-2 col-sm-2">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="selectAll">
                                            {{i18nLang.program.PMS0210060.allSelected}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="guestMnRowDataChecked = []">
                                            {{i18nLang.program.PMS0210060.clearSelected}}
                                        </button>
                                    </li>
                                    <li v-if="isCheckIn">
                                        <button
                                                class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="r_1011">{{i18nLang.program.PMS0210060['1010']}}
                                        </button>
                                    </li>
                                    <!--<li v-if="isCheckIn">-->
                                        <!--<button-->
                                                <!--class="btn btn-primary btn-white btn-defaultWidth"-->
                                                <!--role="button">{{i18nLang.program.PMS0210060['1012']}}-->
                                        <!--</button>-->
                                    <!--</li>-->
                                    <li v-if="isCheckIn">
                                        <button
                                                class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="r_1013">{{i18nLang.program.PMS0210060['1013']}}
                                        </button>
                                    </li>
                                    <!--<li>-->
                                    <!--<button class="btn btn-primary btn-white btn-defaultWidth resv_guestDetail"-->
                                    <!--role="button">住客資料-->
                                    <!--</button>-->
                                    <!--</li>-->
                                    <li v-if="isCheckIn">
                                        <button
                                                class="btn btn-primary btn-white btn-defaultWidth foCnt_roomAssign"
                                                role="button">{{i18nLang.program.PMS0210060['1014']}}
                                        </button>
                                    </li>
                                    <!--l 版隱藏-->
                                    <!--<li>-->
                                    <!--<button class="btn btn-gray btn-defaultWidth"-->
                                    <!--role="button">螢幕簽帳-->
                                    <!--</button>-->
                                    <!--</li>-->
                                    <li v-if="!isCheckIn">
                                        <button
                                                class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="r_1021">{{i18nLang.program.PMS0210060['1021']}}
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="close">{{i18nLang.SystemCommon.Leave}}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--/.按鈕-->
                </div>

                <div class="clearfix"></div>
            </div>
        </div>
        <!--訂房備註明細dialog-->
        <div id="resvMoreRmks_dialog" class="hide padding-5">
            <div class="businessCompanyData">
                <div class="col-sm-12 col-xs-12">
                    <div class="row">
                        <div class="col-sm-10 col-xs-10">
                            <div class="row no-margin-right">
                                <textarea class="input-medium medium-c1-colv2 height-auto rzNone"
                                          style="width: 100%; max-width: 100%;" rows="8" disabled
                                          v-model="orderMnValueData['order_rmk']"></textarea>
                                <div class="clearfix"></div>
                            </div>
                        </div>
                        <div class="col-sm-2 col-xs-2">
                            <div class="row right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="closeRmkDialog">{{i18nLang.SystemCommon.Leave}}
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
        <!--/.訂房備註明細dialog-->
        <pms0110041-lite
                :row-data="editingOrderMnData"
                :is-modifiable="isModifiable4OrderMn"
                :is-create-status="isCreate4OrderMn"
                :is-edit-status="isEdit4OrderMn"
        ></pms0110041-lite>
    </div>
</template>

<script>
    import _s from 'underscore.string';
    import pms0110041Lite from '../../../reservation/PMS0110040/components/PMS0110041_LITE'

    const gs_prgId = "PMS0210060";

    export default {
        name: "PMS0210060_dialog",
        props: ["rowData", "isCheckIn"],
        components: {pms0110041Lite},
        created() {
            let self = this;
            this.$eventHub.$on("openOrder", (data) => {
                this.editingOrderMnData = JSON.parse(JSON.stringify(data.rowData));
                let dialog = $('#PMS0110041Lite').removeClass('hide').dialog({
                    autoOpen: false,
                    modal: true,
                    title: '訂房卡',
                    width: 1000,
                    maxHeight: 1920,
                    resizable: true,
                    onBeforeClose() {
                        self.editingOrderMnData = {};
                        self.$eventHub.$emit("clearData");
                        self.$eventHub.$emit("closeOrder")
                    }
                });
                dialog.dialog('open');
            });
        },
        mounted() {
        },
        data() {
            return {
                i18nLang: go_i18nLang,
                isLoading: false,
                loadingText: "Loading...",

                oriOrderMnFieldsData: [],
                orderMnFieldsData: [],
                orderMnValueData: {},
                guestMnFieldData: [],
                guestMnValueData: [],
                guestMnRowDataChecked: [],           //勾選guest mn資料

                editingOrderMnData: {},
                isModifiable4OrderMn: true,
                isCreate4OrderMn: false,
                isEdit4OrderMn: true
            }
        },
        watch: {
            async isCheckIn(val) {
                if (!_.isUndefined(val)) {
                    this.isLoading = true;
                    await this.fetchOrderMnData();
                    await this.fetchGuestMnData();
                    this.isLoading = false;
                }
                else {
                    this.initData();
                }
            }
        },
        methods: {
            initData() {
                this.oriOrderMnFieldsData = [];
                this.orderMnFieldsData = [];
                this.orderMnValueData = {};
                this.guestMnFieldData = [];
                this.guestMnValueData = [];
                this.guestMnRowDataChecked = [];
            },
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

                    if (this.isCheckIn) {
                        _.each(lo_guestMnData.dgRowData, (lo_data, ln_idx) => {
                            let lo_formatGuestMnData = {
                                "room_mn.clean_sta": lo_data.clean_sta,
                                "order_dt.ikey_seq_nos": lo_data.ikey_seq_nos,
                                "order_dt.room_nos": lo_data.room_nos,
                                "ghist_mn.vip_sta": lo_data.vip_sta,
                                "order_dt.ci_dat": moment(lo_data.ci_dat).format("YYYY/MM/DD"),
                                "order_dt.co_dat": moment(lo_data.co_dat).format("YYYY/MM/DD"),
                                "order_dt.use_cod": lo_data.use_cod,
                                "order_dt.room_cod": lo_data.room_cod,
                                "order_dt.rent_amt": lo_data.rent_amt,
                                "order_dt.serv_amt": lo_data.serv_amt,
                            };
                            lo_guestMnData.dgRowData[ln_idx] = _.extend(lo_data, lo_formatGuestMnData)
                        });
                    }
                    this.guestMnValueData = lo_guestMnData.dgRowData;
                }
                else {
                    alert(lo_guestMnData.errorMsg);
                }
            },
            cleanStaVal(field, singleData) {
                let ls_cleanSta = "";
                if (!_.isUndefined(field.selectData)) {
                    let lo_selectedData = _.findWhere(field.selectData, {value: singleData[field.ui_field_name]});
                    ls_cleanSta = _.isUndefined(lo_selectedData) ? ls_cleanSta : lo_selectedData.display;
                }
                return ls_cleanSta;
            },
            /**
             * 執行欄位為button的function
             */
            buttonFunction(field) {
                if (field.rule_func_name != "" && !_.isUndefined(this[field.rule_func_name])) {
                    this[field.rule_func_name]();
                }
            },
            /**
             * 開啟定備註明細
             */
            r_1015() {
                let lo_orderRmkFiled = _.findWhere(this.oriOrderMnFieldsData, {ui_field_name: "order_rmk"});
                var dialog = $("#resvMoreRmks_dialog").removeClass('hide').dialog({
                    modal: true,
                    title: _.isUndefined(lo_orderRmkFiled) ? "" : lo_orderRmkFiled.ui_display_name,
                    title_html: true,
                    width: 600,
                    maxwidth: 1920,
                    dialogClass: "test",
                    resizable: true
                });
            },
            /**
             * 關閉訂房被註明細
             */
            closeRmkDialog() {
                $("#resvMoreRmks_dialog").dialog("close");
            },
            selectAll() {
                this.guestMnRowDataChecked = [];
                _.each(this.guestMnValueData, (lo_data) => {
                    this.guestMnRowDataChecked.push(lo_data);
                });
            },
            /**
             * 修改訂房卡
             */
            r_1013() {
                let self = this;
                this.editingOrderMnData = JSON.parse(JSON.stringify(this.rowData));
                let dialog = $('#PMS0110041Lite').removeClass('hide').dialog({
                    autoOpen: false,
                    modal: true,
                    title: '訂房卡',
                    width: 1000,
                    maxHeight: 1920,
                    resizable: true,
                    onBeforeClose() {
                        self.editingOrderMnData = {};
                        self.$eventHub.$emit("clearData");
                        self.isCheckIn = undefined;
                        setTimeout(() => {
                            self.isCheckIn = true;
                        }, 100)
                    }
                });
                dialog.dialog('open');
            },
            /**
             * 驗證儲存資料
             * 1.檢查有勾選資料
             * 2.自動產生住客資料
             * 3.檢查公帳號
             */
            async doValidate() {
                let lo_return = {success: true, errorMsg: ""};
                let la_ciSerBlankData = [];

                //1.檢查有勾選資料
                //2.自動產生住客資料
                for (let lo_guestData of this.guestMnRowDataChecked) {
                    //檢查所選定的guest mn資料房號'
                    let ls_roomNos = lo_guestData.room_nos || "";
                    if (ls_roomNos === "") {
                        lo_return.success = false;
                        lo_return.errorMsg = go_i18nLang.ErrorMsg.pms21msg4;
                        break;
                    }
                    //檢查是否有尚未指定住客資料之訂房資料
                    let ls_ciSer = lo_guestData.ci_ser || "";
                    if (ls_ciSer === "") {
                        if (la_ciSerBlankData.length === 0) {
                            let lb_confirm = confirm(go_i18nLang.program.PMS0210060.isCiSerBlank);
                            if (lb_confirm) {
                                la_ciSerBlankData.push(lo_guestData);
                            }
                            else {
                                lo_return.success = false;
                                lo_return.errorMsg = _s.sprintf(go_i18nLang.ErrorMsg.pms21msg5, lo_guestData.ikey_seq_nos);
                                break;
                            }
                        }
                        else {
                            la_ciSerBlankData.push(lo_guestData);
                        }

                    }
                }
                if (lo_return.success) {
                    if (la_ciSerBlankData.length > 0) {
                        //自動生成guest mn 資料
                        let lo_doRule = await BacUtils.doHttpPromisePostProxy("/api/queryDataByRule", {
                            rule_func_name: "r_2010",
                            orderMnData: this.orderMnValueData,
                            guestMnData: la_ciSerBlankData
                        }).then(result => {
                            return result
                        }).catch(err => {
                            return {success: false, errorMsg: err}
                        });

                        if (!lo_doRule.success) {
                            lo_return.success = false;
                            lo_return.errorMsg = lo_doRule.errorMsg;
                        }
                    }
                }

                //檢查order mn 公帳號 LITE版不做
//                if (lo_return.success && this.guestMnRowDataChecked.length > 0) {
//                    let lo_doMasterRule = await BacUtils.doHttpPromisePostProxy("/api/queryDataByRule", {
//                        rule_func_name: "r_1021",
//                        isFirst: true,
//                        orderMnData: this.orderMnValueData
//                    }).then(result => {
//                        return result
//                    }).catch(err => {
//                        return {success: false, errorMsg: err}
//                    });
//
//                    // lo_return.success = false;
//                    // lo_return.errorMsg = "false";
//
//                    if (lo_doMasterRule.showConfirm) {
//                        let lb_confirm = confirm(go_i18nLang.program.PMS0210060.chkMaster);
//
//                        if (lb_confirm) {
//                            let lo_doMasterRuleAgain = await BacUtils.doHttpPromisePostProxy("/api/queryDataByRule", {
//                                rule_func_name: "r_1021",
//                                isFirst: false,
//                                orderMnData: this.orderMnValueData
//                            }).then(result => {
//                                return result
//                            }).catch(err => {
//                                return {success: false, errorMsg: err}
//                            });
//                            if (!lo_doMasterRuleAgain.success) {
//                                lo_return.success = false;
//                                lo_return.errorMsg = lo_doMasterRuleAgain.errorMsg;
//                            }
//                        }
//                        else {
//                            lo_return.success = false;
//                        }
//                    }
//                }

                return lo_return;
            },
            /**
             * 入住
             */
            async r_1011() {
                this.isLoading = true;
                this.loadingText = "saving...";
                let ls_funcId = "1010";
                let ls_pageId = 1010;
                let lo_validate = await this.doValidate();
                if (lo_validate.success) {
                    let lo_save = await this.doSave(ls_funcId, ls_pageId);
                    if (lo_save.success) {
                        let lb_isCheckIn = this.isCheckIn;
                        this.isCheckIn = undefined;
                        setTimeout(() => {
                            this.isCheckIn = lb_isCheckIn;
                        }, 100)
                    }
                    else {
                        alert(lo_save.errorMsg);
                    }
                }
                else {
                    alert(lo_validate.errorMsg);
                }
                this.isLoading = false;
                this.loadingText = "loading...";
            },
            /**
             *取消入住
             */
            async r_1021() {
                this.isLoading = true;
                this.loadingText = "saving...";
                let ls_funcId = "1022";
                let ls_pageId = 1020;
                let lo_save = await this.doSave(ls_funcId, ls_pageId);

                if (lo_save.success) {
                    let lb_isCheckIn = this.isCheckIn;
                    this.isCheckIn = undefined;
                    setTimeout(() => {
                        this.isCheckIn = lb_isCheckIn;
                    }, 100)
                }
                else {
                    alert(lo_save.errorMsg);
                }
                this.isLoading = false;
                this.loadingText = "loading...";
            },
            async doSave(func_id, page_id) {
                let lo_tmpCUD = {
                    updateData: [_.extend(this.orderMnValueData, {page_id: page_id, tab_page_id: 11})],
                    oriData: [this.orderMnValueData]
                };
                let la_saveData = JSON.parse(JSON.stringify(this.guestMnRowDataChecked));

                _.each(la_saveData, (lo_data) => {
                    _.each(lo_data, (ls_val, ls_key) => {
                        let la_key = ls_key.split(".");
                        if (la_key.length > 1) {
                            lo_data[la_key[1]] = ls_val;
                            delete lo_data[ls_key];
                        }
                    });
                    lo_tmpCUD.updateData.push(_.extend(lo_data, {page_id: page_id, tab_page_id: 12}));
                    lo_tmpCUD.oriData.push(_.extend(lo_data, {page_id: page_id, tab_page_id: 12}));
                });

                let lo_save = await
//                         new Promise((resolve, reject) => {
//                         setTimeout(() => {
//                             resolve({success: false, errorMsg: "test"});
//                         }, 500);
//                     });

                    BacUtils.doHttpPromisePostProxy('/api/execNewFormatSQL', {
                        prg_id: gs_prgId,
                        page_id: page_id,
                        func_id: func_id,
                        tmpCUD: lo_tmpCUD
                    }).then(
                        result => {
                            return (result);
                        }).catch(err => {
                        return {success: false, errorMsg: err};
                    });

                return lo_save;
            },
            close() {
                $("#PMS0210060_dialog").dialog("close")
            }
        }
    }
</script>

<style scoped>

</style>