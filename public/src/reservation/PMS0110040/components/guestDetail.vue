<template>
    <div id="resvGuestDetail_dialog" class="hide padding-5">
        <div class="businessCompanyData">
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
                                                        <template v-for="singleData in orderDtRowsData">
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
                                                                        @click="selectedCell(idx, field)"
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
                                                        <template v-for="singleData in guestMnRowsData">
                                                            <tr>
                                                                <td class="text-center">
                                                                    <i class="fa fa-minus red"></i>
                                                                </td>
                                                                <template v-for="field in guestMnFieldData">
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
                                                                        @click="selectedCell(idx, field)"
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
                                                                        <button class="btn btn-sm btn-primary btn-white btn-sm-font2 reservationDialog-2 moreAbso">
                                                                            Profile
                                                                        </button>
                                                                    </td>
                                                                </template>
                                                            </tr>
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
        <specify-houses :row-data="rowData"></specify-houses>
    </div>
</template>

<script>

    import alasql from 'alasql';
    import specifyHouses from './specifyHouses';

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
        props: ["rowData"],
        components: {
            specifyHouses
        },
        created() {
            vmHub.$on("selectDataGridRow", (data) => {
                this.editingGroupDataIndex = data.index;
            })
        },
        mounted() {
            this.activeName = 'orderDetail'
        },
        data() {
            return {
                allOrderDtRowsData: [],         //所有的order dt資料
                oriAllOrderDtRowsData: [],          //所有的原始order dt資料
                orderDtGroupFieldData: [],      //group order dt 的欄位資料
                orderDtGroupRowsData: [],       //group order dt 的資料
                oriOrderDtGroupRowsData: [],    //group order dt 的原始資料
                orderDtFieldData: [],           //所group 到的所有 order dt 欄位資料
                orderDtRowsData: [],            //所group 到的所有 order dt 資料
                oriOrderDtRowsData: [],         //所group 到的所有 order dt 原始資料
                guestMnFieldData: [],           //所group 到的所有 guest mn 欄位資料
                guestMnRowsData: [],            //所group 到的所有 guest mn 原始資料
                oriGuestMnRowsData: [],         //所group 到的所有 guest mn 資料
                dgIns: {},
                editingGroupDataIndex: undefined,
                editingGroupData: {},           //現在所選group order dt 的資料
                activeName: '',
            }
        },
        watch: {
            async rowData(val) {
                if (!_.isEmpty(val)) {
                    await this.fetchAllFieldsData();
                }
            },
            async editingGroupDataIndex(newVal, oldVal) {
                if (!_.isUndefined(newVal)) {
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
                    await this.fetchDetailRowsData(la_detailOrderDtData);
                    await this.fetchGuestRowsData(la_detailOrderDtData);
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
                    this.orderDtFieldData = _.sortBy(lo_fetchOrderDtFieldsData.dgFieldsData, "col_seq");
                    this.guestMnFieldData = _.sortBy(lo_fetchGuestMnFieldsData.dgFieldsData, "col_seq");
                    console.log(this.guestMnFieldData);
                    this.fetchOrderDtRowData();
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
                        this.allOrderDtRowsData = result.dgRowData;
                        this.oriAllOrderDtRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                        let ls_groupStatement =
                            "select * from ? where order_sta <> 'X' group by rate_cod,order_sta,days,ci_dat,co_dat,use_cod,room_cod,rent_amt,serv_amt,block_cod";
                        this.orderDtGroupRowsData = alasql(ls_groupStatement, [this.allOrderDtRowsData]);
                        this.showDataGrid();
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            showDataGrid() {
                this.dgIns = new DatagridSingleGridClass();
                this.dgIns.init("PMS0110042", "orderDtTable", DatagridFieldAdapter.combineFieldOption(this.orderDtGroupFieldData, "orderDtTable"), this.orderDtGroupFieldData);
                this.dgIns.loadDgData(this.orderDtGroupRowsData);
                this.editingGroupDataIndex = 0;
            },
            async fetchDetailRowsData(detailRowsData) {
                let la_ikeySeqNos = [];
                _.each(detailRowsData, (lo_detailData) => {
                    la_ikeySeqNos.push(lo_detailData.ikey_seq_nos);
                });
                await BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", {
                    prg_id: 'PMS0110042',
                    page_id: 1,
                    tab_page_id: 2,
                    searchCond: {ikey_seq_nos: la_ikeySeqNos, ikey: detailRowsData[0].ikey}
                }).then((result) => {
                    if (result.success) {
                        _.each(result.dgRowData, (lo_dgRowData) => {
                            lo_dgRowData.ci_dat = moment(lo_dgRowData.ci_dat).format("YYYY/MM/DD");
                            lo_dgRowData.co_dat = moment(lo_dgRowData.co_dat).format("YYYY/MM/DD");
                            lo_dgRowData.ci_dat_week = moment(lo_dgRowData.ci_dat).format("ddd");
                            lo_dgRowData.co_dat_week = moment(lo_dgRowData.co_dat).format("ddd");
                        });
                        this.orderDtRowsData = result.dgRowData;
                        this.oriOrderDtRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                    }
                    else {
                        alert(result.errorMsg);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            async fetchGuestRowsData(detailRowsData) {
                let la_ikeySeqNos = [];
                _.each(detailRowsData, (lo_detailData) => {
                    la_ikeySeqNos.push(lo_detailData.ikey_seq_nos);
                });
                la_ikeySeqNos.push(0);
                await BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", {
                    prg_id: 'PMS0110042',
                    page_id: 1,
                    tab_page_id: 3,
                    searchCond: {ikey_seq_nos: la_ikeySeqNos, ikey: detailRowsData[0].ikey}
                }).then((result) => {
                    if (result.success) {
                        this.guestMnRowsData = result.dgRowData;
                        this.oriGuestMnRowsData = JSON.parse(JSON.stringify(result.dgRowData));
                    }
                    else {
                        alert(result.errorMsg);
                    }
                }).catch(err => {
                    console.log(err);
                })
            },
            toggle() {
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