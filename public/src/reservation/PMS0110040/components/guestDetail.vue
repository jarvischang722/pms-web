<template>
    <div id="resvGuestDetail_dialog" class="hide padding-5">
        <div class="businessCompanyData" v-loading="isLoading" :element-loading-text="loadingText">
            <div class="col-xs-12 col-sm-12">
                <!--訂房資料 dataGrid-->
                <div class="row">
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right">
                            <table id="orderDtTable"></table>
                        </div>
                    </div>
                    <div class="col-xs-1 col-sm-1">
                        <div class="row"></div>
                    </div>
                </div>
                <!--/.訂房資料 dataGrid-->

                <div class="clearfix"></div>
                <div class="space-6"></div>
                <div class="row">
                    <!-------- tabPage -------->
                    <div class="col-xs-11 col-sm-11">
                        <div class="row no-margin-right">
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
                            <el-tabs v-model="activeName" type="card">
                                <el-tab-pane label="訂房明細" name="orderDetail"></el-tab-pane>
                                <el-tab-pane label="住客名單" name="guestDetail"></el-tab-pane>
                            </el-tabs>
                            <div>
                                <div class="easyui-panel" v-show="activeName=='orderDetail'">
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
                                                            <template v-for="field in orderDtFieldData">
                                                                <th v-if="field.visiable == 'Y'" class="text-left"
                                                                    :style="{'min-width': field.width+'px'}">
                                                                    {{field.ui_display_name}}
                                                                </th>
                                                            </template>
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
                                                        <template v-for="(singleData, idx) in orderDtRowsData">
                                                            <tr>
                                                                <td class="text-center">
                                                                    <i class="fa fa-minus red"></i>
                                                                </td>
                                                                <template v-for="field in orderDtFieldData">
                                                                    <td class="text-left input-noEdit"
                                                                        :style="{width:field.width + 'px'}"
                                                                        v-if="field.visiable == 'Y' && field.ui_type=='label'"
                                                                        @click="editingOrderDtIdx = idx">
                                                                        {{singleData[field.ui_field_name]}}
                                                                    </td>
                                                                    <td class="text-left"
                                                                        @click="editingOrderDtIdx = idx"
                                                                        v-if="field.visiable == 'Y' && field.ui_type=='number'">
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
                                                                        v-if="field.visiable == 'Y' && field.ui_type=='text'">
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
                                                                           @click="showRateCodDialog(idx)"></i>
                                                                    </td>
                                                                </template>
                                                            </tr>
                                                        </template>
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                </div>
                                <div class="easyui-panel" v-show="activeName=='guestDetail'">
                                    <div class="col-xs-12 col-sm-12">
                                        <div class="row">
                                            <div class="container_12 divider">
                                                <div class="grid_12 fixed-table-container">
                                                    <table class="fancyTable themeTable treeControl custom-table"
                                                           cellpadding="0"
                                                           cellspacing="0">
                                                        <thead>
                                                        <tr>
                                                            <th class="text-center ca-headerTitle height-fntThead rp-first-th">
                                                                <i class="fa fa-plus green"></i>
                                                            </th>
                                                            <template v-for="field in guestMnFieldData">
                                                                <th v-if="field.visiable == 'Y'" class="text-left"
                                                                    :style="{'min-width': field.width+'px'}">
                                                                    {{field.ui_display_name}}
                                                                </th>
                                                            </template>
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
                                                        <template v-for="(rowsData, key) in guestMnRowsData">
                                                            <template v-if="key == editingGroupDataIndex"
                                                                      v-for="(singleData, idx) in rowsData.concat(guestMnRowsData['unspecified'])">
                                                                <tr>
                                                                    <td class="text-center">
                                                                        <i class="fa fa-minus red"></i>
                                                                    </td>
                                                                    <template v-for="field in guestMnFieldData">
                                                                        <td class="text-left input-noEdit"
                                                                            :style="{width:field.width + 'px'}"
                                                                            v-if="field.visiable == 'Y' && field.ui_type=='label'"
                                                                            @click="editingGuestMnIdx = idx">
                                                                            {{singleData[field.ui_field_name]}}
                                                                        </td>
                                                                        <td class="text-left"
                                                                            @click="editingGuestMnIdx = idx"
                                                                            v-if="field.visiable == 'Y' && field.ui_type=='text'">
                                                                            <input type="text"
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
                                                                            @click="editingGuestMnIdx = idx"
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
                                                                            @click="editingGuestMnIdx = idx"
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
                                                                            @click="editingGuestMnIdx = idx"
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
                                                                            @click="editingGuestMnIdx = idx"
                                                                            v-if="field.visiable == 'Y' && field.ui_type=='selectgrid'">
                                                                            <bac-select-grid
                                                                                    v-if="field.visiable == 'Y' && field.ui_type == 'selectgrid'"
                                                                                    :style="{width:field.width + 'px' , height:field.height + 'px'}"
                                                                                    :class="{'input_sta_required' : field.requirable == 'Y'}"
                                                                                    v-model="singleData[field.ui_field_name]"
                                                                                    :columns="field.selectData.columns"
                                                                                    :data="field.selectData.selectData"
                                                                                    :field="field"
                                                                                    :is-qry-src-before="field.selectData.isQrySrcBefore"
                                                                                    :id-field="field.selectData.value"
                                                                                    :text-field="field.selectData.display"
                                                                                    @update:v-model="val => singleData[field.ui_field_name] = val"
                                                                                    :default-val="singleData[field.ui_field_name]"
                                                                                    :disabled="field.modificable == 'N'|| !isModifiable ||
                                                   (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                            </bac-select-grid>
                                                                            <button @click="searchGuestMnAltName(singleData, idx)"
                                                                                    class="btn btn-sm btn-primary btn-white btn-sm-font2 moreAbso">
                                                                                Profile
                                                                            </button>
                                                                        </td>
                                                                    </template>
                                                                </tr>
                                                            </template>
                                                        </template>
                                                        <!--1-->
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
                        </div>
                    </div>
                    <!-------- /.tabPage -------->
                    <!--按鈕-->
                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button" @click="toggle">指定房組
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
                    <!--/.按鈕-->
                </div>
            </div>
            <div class="clearfix"></div>
        </div>
        <!--指定房組-->
        <specify-houses
                :is-specify-house="isOpenSpecifyHouse"
                :row-data="rowData"
                :is-edit-status="isEditStatus"
        ></specify-houses>
        <!--/.指定房組-->
    </div>
</template>

<script>

    import alasql from 'alasql';
    import specifyHouses from './specifyHouses';
    import selectRateCod from './selectRateCod';

    var vmHub = new Vue();

    /** DatagridRmSingleGridClass **/
    function DatagridSingleGridClass() {
    }

    DatagridSingleGridClass.prototype = new DatagridBaseClass();
    DatagridSingleGridClass.prototype.onClickCell = function (idx, row) {
        vmHub.$emit("selectDataGridRow", {row: row, index: idx});
    };
    DatagridSingleGridClass.prototype.onClickRow = function (idx, row) {
    };

    export default {
        name: "guestDetail",
        props: ["isGuestDetail", "rowData", "isCreateStatus", "isEditStatus", "isModifiable"],
        components: {specifyHouses},
        created() {
            vmHub.$on("selectDataGridRow", (data) => {
                this.editingGroupDataIndex = data.index;
            });
            //取得rate cod 資料
            this.$eventHub.$on("getGuestDetailRateCod", (data) => {
                this.orderDtRowsData[this.editingOrderDtIdx].rate_cod = data.rateCodData.rate_cod;
            });
            //取得ghist mn 資料
            this.$eventHub.$on("getGhistMnDataToOrder", (data) => {
                if (this.$store.state.orderMnModule.gs_openModule == "guestDetail") {
                    let lo_ghistMnData = JSON.parse(JSON.stringify(data.ghistMnData));
                    if (this.editingGuestMnData.ikey_seq_nos == 0) {
                        let ln_editIdx = _.findIndex(this.guestMnRowsData["unspecified"], {ci_ser: this.editingGuestMnData.ci_ser});
                        if (ln_editIdx > -1) {
                            this.guestMnRowsData["unspecified"][ln_editIdx] =
                                _.extend(lo_ghistMnData, this.guestMnRowsData["unspecified"][ln_editIdx]);
                        }
                    }
                    else {
                        this.guestMnRowsData[this.editingGroupDataIndex][this.editingGuestMnIdx] =
                            _.extend(lo_ghistMnData, this.guestMnRowsData[this.editingGroupDataIndex][this.editingGuestMnIdx]);
                    }
                }
            });
        },
        data() {
            return {
                activeName: '',
                dgIns: {},
                isLoading: false,
                loadingText: "loading...",
                isOpenSpecifyHouse: false,

                allOrderDtRowsData: [],             //所有的order dt資料
                oriAllOrderDtRowsData: [],          //所有的原始order dt資料
                orderDtGroupFieldData: [],          //group order dt 的欄位資料
                orderDtGroupRowsData: [],           //group order dt 的資料(顯示用)
                oriOrderDtGroupRowsData: [],        //group order dt 的原始資料(顯示用)
                orderDtGroupData: {},               //分組後的order dt資料

                orderDtFieldData: [],               //所group 到的所有 order dt 欄位資料
                orderDtRowsData: [],                //所group 到的所有 order dt 資料
                oriOrderDtRowsData: [],             //所group 到的所有 order dt 原始資料

                guestMnFieldData: [],               //所group 到的所有 guest mn 欄位資料
                guestMnRowsData: {},                //所group 到的所有 guest mn 原始資料
                oriGuestMnRowsData: {},             //所group 到的所有 guest mn 資料

                editingGroupDataIndex: undefined,   //現在所選group order dt 的index
                editingGroupData: {},               //現在所選group order dt 的資料

                editingOrderDtIdx: undefined,       //現在所選明細order dt 的index
                editingOrderDtData: {},             //現在所選明細order dt 的資料

                editingGuestMnIdx: undefined,       //現在所選明細guest mn 的index
                editingGuestMnData: {},             //現在所選明細guest mn 的資料
                guestMnTmpCUD: {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                }
            }
        },
        watch: {
            async isGuestDetail(val) {
                if (val && !_.isUndefined(this.rowData.ikey)) {
                    //是否第一次開起
                    if (this.orderDtGroupFieldData.length == 0) {
                        this.initData();
                        await this.fetchAllFieldsData();
                        this.activeName = 'guestDetail'
                    }
                }
                else {
                    this.initData();
                }
            },
            async editingGroupDataIndex(newVal, oldVal) {
                if (!_.isUndefined(newVal)) {
                    this.isLoading = true;
                    $("#orderDtTable").datagrid('selectRow', newVal);
                    this.editingGroupData = $("#orderDtTable").datagrid('getSelected');
                    let lo_groupParam = {
                        rate_cod: this.editingGroupData.rate_cod,
                        order_sta: this.editingGroupData.order_sta,
                        days: this.editingGroupData.days,
                        ci_dat: this.editingGroupData.ci_dat,
                        co_dat: this.editingGroupData.co_dat,
                        use_cod: this.editingGroupData.use_cod,
                        room_cod: this.editingGroupData.room_cod,
                        rent_amt: this.editingGroupData.rent_amt,
                        serv_amt: this.editingGroupData.serv_amt,
                        block_cod: this.editingGroupData.block_cod
                    };
                    let la_detailOrderDtData = _.where(this.allOrderDtRowsData, lo_groupParam);
                    this.fetchDetailRowsData(la_detailOrderDtData);
                    this.isLoading = false;
                }
            }
        },
        methods: {
            initData() {
                this.allOrderDtRowsData = [];
                this.oriAllOrderDtRowsData = [];
                this.allGuestMnRowsData = [];
                this.oriAllGuestMnRowsData = [];
                this.orderDtGroupFieldData = [];
                this.orderDtGroupRowsData = [];
                this.oriOrderDtGroupRowsData = [];
                this.orderDtFieldData = [];
                this.orderDtRowsData = [];
                this.oriOrderDtRowsData = [];
                this.guestMnFieldData = [];
                this.guestMnRowsData = [];
                this.oriGuestMnRowsData = [];
                this.dgIns = {};
                this.editingGroupDataIndex = undefined;
                this.editingGroupData = {};
                this.activeName = '';
                this.isOpenSpecifyHouse = false;
            },
            async fetchFieldsData(param) {
                return await BacUtils.doHttpPromisePostProxy("/api/fetchOnlyDataGridFieldData", param).then((result) => {
                    return result;
                }).catch(err => {
                    return {success: false, errMsg: err};
                })
            },
            async fetchAllFieldsData() {
                try {
                    this.isLoading = true;
                    let [lo_fetchGroupOrderDtFieldsData, lo_fetchOrderDtFieldsData, lo_fetchGuestMnFieldsData] = await Promise.all([
                        this.fetchFieldsData({prg_id: 'PMS0110042', page_id: 1, tab_page_id: 1}),
                        this.fetchFieldsData({prg_id: 'PMS0110042', page_id: 1, tab_page_id: 2}),
                        this.fetchFieldsData({prg_id: 'PMS0110042', page_id: 1, tab_page_id: 3})
                    ]);
                    this.orderDtGroupFieldData = lo_fetchGroupOrderDtFieldsData.dgFieldsData;
                    this.orderDtFieldData = _.sortBy(lo_fetchOrderDtFieldsData.dgFieldsData, "col_seq");
                    this.guestMnFieldData = _.sortBy(lo_fetchGuestMnFieldsData.dgFieldsData, "col_seq");

                    if (this.isEditStatus) {
                        await this.fetchAllOrderDtRowData();
                        await this.fetchAllGuestRowsData();
                        this.showDataGrid();
                    }
                    else {
                        this.showDataGrid();
                    }
                    this.editingGroupDataIndex = this.orderDtGroupRowsData.length > 0 ? 0 : undefined;
                    this.isLoading = false;
                }
                catch (err) {
                    console.log(err);
                }
            },
            async fetchAllOrderDtRowData() {
                let lo_fetchOrderDtData = await BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", {
                    prg_id: 'PMS0110042',
                    page_id: 1,
                    tab_page_id: 1,
                    searchCond: {ikey: this.rowData.ikey}
                }).then((result) => {
                    return result;
                }).catch(err => {
                    return {success: false, errorMsg: err};
                });

                if (lo_fetchOrderDtData.success) {
                    this.allOrderDtRowsData = lo_fetchOrderDtData.dgRowData;
                    this.oriAllOrderDtRowsData = JSON.parse(JSON.stringify(lo_fetchOrderDtData.dgRowData));
                    let ls_groupStatement =
                        "select *, count(*) as order_qnt from ? where order_sta <> 'X' group by rate_cod,order_sta,days,ci_dat,co_dat,use_cod,room_cod,rent_amt,serv_amt,block_cod";
                    this.orderDtGroupRowsData = alasql(ls_groupStatement, [this.allOrderDtRowsData]);

                    //組分組後的order dt 資料
                    _.each(this.orderDtGroupRowsData, (lo_groupData, idx) => {
                        let lo_groupParam = {
                            rate_cod: lo_groupData.rate_cod,
                            order_sta: lo_groupData.order_sta,
                            days: lo_groupData.days,
                            ci_dat: lo_groupData.ci_dat,
                            co_dat: lo_groupData.co_dat,
                            use_cod: lo_groupData.use_cod,
                            room_cod: lo_groupData.room_cod,
                            rent_amt: lo_groupData.rent_amt,
                            serv_amt: lo_groupData.serv_amt,
                            block_cod: lo_groupData.block_cod
                        };
                        this.orderDtGroupData[idx] = _.where(this.allOrderDtRowsData, lo_groupParam);
                    });
                }
                else {
                    alert(lo_fetchOrderDtData.errorMsg);
                }
            },
            async fetchAllGuestRowsData() {
                let lo_fetchGuestMnData = await BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", {
                    prg_id: 'PMS0110042',
                    page_id: 1,
                    tab_page_id: 3,
                    searchCond: {ikey: this.rowData.ikey}
                }).then((result) => {
                    return result;
                }).catch(err => {
                    return {success: false, errorMsg: err};
                });
                if (lo_fetchGuestMnData.success) {
                    let la_unGroupGuestMnData = lo_fetchGuestMnData.dgRowData;

                    //利用分組後的order dt 資料將guest mn 資料做分組
                    _.each(this.orderDtGroupData, (la_ikey_seq_nos, idx) => {
                        this.guestMnRowsData[idx] = [];
                        _.each(la_ikey_seq_nos, (lo_data) => {
                            let lo_guestMnRowData = _.findWhere(la_unGroupGuestMnData, {ikey_seq_nos: lo_data.ikey_seq_nos});
                            if (!_.isUndefined(lo_guestMnRowData)) {
                                this.guestMnRowsData[idx].push(lo_guestMnRowData);
                            }
                        });
                    });
                    //未指定的guest mn 資料
                    this.guestMnRowsData["unspecified"] = _.where(la_unGroupGuestMnData, {ikey_seq_nos: 0});
                    this.oriGuestMnRowsData = JSON.parse(JSON.stringify(this.guestMnRowsData));
                }
                else {
                    alert(lo_fetchGuestMnData.errorMsg);
                }
            },
            showDataGrid() {
                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init("PMS0110042", "orderDtTable", DatagridFieldAdapter.combineFieldOption(this.orderDtGroupFieldData, "orderDtTable"), this.orderDtGroupFieldData);
                this.dgIns.loadDgData(this.orderDtGroupRowsData);
            },
            fetchDetailRowsData(detailRowsData) {
                let ls_ikeySeqNos = "";
                _.each(detailRowsData, (lo_detailData) => {
                    ls_ikeySeqNos += `,${lo_detailData.ikey_seq_nos}`;
                });
                ls_ikeySeqNos = ls_ikeySeqNos.substring(1, ls_ikeySeqNos.length);
                let ls_selectParams = `select * from ? where ikey_seq_nos in (${ls_ikeySeqNos})`;
                this.orderDtRowsData = alasql(ls_selectParams, [this.allOrderDtRowsData]);
            },
            showRateCodDialog(index) {
                this.editingOrderDtIdx = index;
                this.editingOrderDtData = _.extend(this.rowData, this.orderDtRowsData[this.editingOrderDtIdx]);
                this.$eventHub.$emit("setSelectRateCodData", {
                    rowData: this.editingOrderDtData,
                    openModule: "orderDetail"
                });
            },
            searchGuestMnAltName(guestMnData, index) {
                this.$store.dispatch("orderMnModule/setOpenModule", {openModule: "guestDetail"});
                this.editingGuestMnIdx = index;
                this.editingGuestMnData = _.extend(this.rowData, guestMnData);
                this.$eventHub.$emit("setSelectGuestMnAltData", {
                    rowData: this.editingGuestMnData
                });
            },
            toggle() {
                //TODO 檢查資料是否有異動之後做
                this.isOpenSpecifyHouse = true;
                var dialog = $("#resv_assignHouse_dialog").removeClass('hide').dialog({
                    modal: true,
                    title: "指定房組",
                    title_html: true,
                    width: 800,
                    maxwidth: 1920,
                    dialogClass: "test",
                    resizable: true
                });
            }
        }
    }
</script>

<style scoped>

</style>