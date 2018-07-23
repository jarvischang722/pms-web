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
                                                     class="ace"
                                                     v-model="allMark"
                                              >
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
                                                                <i class="fa fa-plus green"
                                                                   :class="{'pointer': isModifiable}"
                                                                   @click="addOrderDtRow"></i>
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
                                                        <template v-if="allMark===false">
                                                            <template v-for="(rowsData, key) in orderDtRowsData">
                                                                <template v-if="key == editingGroupDataIndex"
                                                                          v-for="(singleData, idx) in rowsData">
                                                                    <tr>
                                                                        <td class="text-center">
                                                                            <i class="fa fa-minus red"
                                                                               :class="{'pointer': isModifiable}"
                                                                               @click="removeOrderDtRow(singleData)"
                                                                            ></i>
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
                                                                                       @change="chkOrderDtFieldRule(field.ui_field_name, field.rule_func_name)"
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
                                                                                            @change="chkOrderDtFieldRule(field.ui_field_name, field.rule_func_name)"
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
                                                                                        :editable="false"
                                                                                        :clearable="false"
                                                                                        @change="chkOrderDtFieldRule(field.ui_field_name, field.rule_func_name)"
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
                                                                                       @change="chkOrderDtFieldRule(field.ui_field_name, field.rule_func_name)"
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
                                                                                       @change="chkOrderDtFieldRule(field.ui_field_name, field.rule_func_name)"
                                                                                       :disabled="field.modificable == 'N'|| !isModifiable ||
                                                                    (field.modificable == 'I' && isEditStatus) || (field.modificable == 'E' && isCreateStatus)">
                                                                                <i class="moreClick fa fa-ellipsis-h pull-left"
                                                                                   @click="showRateCodDialog(idx)"></i>
                                                                            </td>
                                                                        </template>
                                                                    </tr>
                                                                </template>
                                                            </template>
                                                        </template>
                                                        <template v-else>
                                                            <template v-for="(rowsData, key) in orderDtRowsData">
                                                                <tr>
                                                                    <td class="text-center">
                                                                        <i class="fa fa-minus red"></i>
                                                                    </td>
                                                                    <template v-for="field in orderDtFieldData">
                                                                        <td class="text-left input-noEdit"
                                                                            :style="{width:field.width + 'px'}"
                                                                            :maxlength="field.ui_field_length"
                                                                            v-if="field.visiable === 'Y' ">
                                                                            {{rowsData[field.ui_field_name]}}
                                                                        </td>
                                                                    </template>
                                                                </tr>
                                                            </template>
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
                                                                <i class="fa fa-plus green" @click="addGuestMnData"
                                                                   :class="{'pointer': isModifiable}"></i>
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
                                                                        <i class="fa fa-minus red"
                                                                           @click="removeGuestMnData(singleData)"
                                                                           :class="{'pointer': isModifiable}"></i>
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
                                                role="button"
                                                @click="save"
                                        >儲存
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

    const vmHub = new Vue();
    const gs_prgId = "PMS0110042";

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
                this.orderDtRowsData[this.editingGroupDataIndex][this.editingOrderDtIdx].rate_cod = data.rateCodData.rate_cod;
                let lo_rateFieldData = _.findWhere(this.orderDtFieldData, {ui_field_name: 'rate_cod'});
                if (!_.isUndefined(lo_rateFieldData)) {
                    this.chkOrderDtFieldRule(lo_rateFieldData.ui_field_name, lo_rateFieldData.rule_func_name);
                }
            });
            //取得ghist mn 資料
            this.$eventHub.$on("getGhistMnDataToOrder", (data) => {
                if (this.$store.state.orderMnModule.gs_openModule == "guestDetail") {
                    let lo_ghistMnData = JSON.parse(JSON.stringify(data.ghistMnData));
                    console.log(data.ghistMnData);
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
        mounted() {
            this.fetchRentCalDat();
        },
        data() {
            return {
                activeName: '',
                dgIns: {},
                isLoading: false,
                loadingText: "loading...",
                isOpenSpecifyHouse: false,
                rentCalDat: "",                     //訂房中心滾房租日

                allOrderDtRowsData: [],             //所有的order dt資料
                oriAllOrderDtRowsData: [],          //所有的原始order dt資料
                allGuestMnRowsData: [],             //所有的guest mn資料

                orderDtGroupFieldData: [],          //group order dt 的欄位資料
                orderDtGroupRowsData: [],           //group order dt 的資料(顯示用)
                oriOrderDtGroupRowsData: [],        //group order dt 的原始資料(顯示用)
                orderDtGroupData: {},               //分組後的order dt資料

                orderDtFieldData: [],               //所group 到的所有 order dt 欄位資料
                orderDtRowsData: {},                //所group 到的所有 order dt 現在資料
                oriOrderDtRowsData: {},             //所group 到的所有 order dt 原始資料
                beforeOrderDtRowsData: {},          //所group 到的所有 order dt 修改前資料

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
                },

                isEffectFromRule: true,
                isFirstFetch: true,

                tmpCUD: {
                    createData: [],
                    updateData: [],
                    deleteData: [],
                    oriData: []
                },
                allOrderDetail: [],
                allMark: false,
                reload: false,
            }
        },
        watch: {
            //一開始打開訂房明細
            async isGuestDetail(val) {
                if (val && !_.isUndefined(this.rowData.ikey)) {
                    //是否第一次開起
                    if (this.orderDtGroupFieldData.length == 0) {
                        this.isLoading = true;
                        //清空資料
                        this.initData();
                        //取三個table的欄位資料
                        await this.fetchAllFieldsData();
                        //取所有order dt 資料
                        await this.fetchAllOrderDtRowData();
                        //取所有guest mn 資料
                        await this.fetchAllGuestRowsData();
                        //顯示group order dt 的table
                        this.showDataGrid();
                        //設定group order dt table所選定的index
                        this.editingGroupDataIndex = this.orderDtGroupRowsData.length > 0 ? 0 : undefined;
                        if (!_.isUndefined(this.editingGroupDataIndex)) {
                            $("#orderDtTable").datagrid('selectRow', this.editingGroupDataIndex);
                        }
                        //將所有order dt 資料依據group order dt 做分組
                        this.groupOrderDtData(this.allOrderDtRowsData);
                        //將所有guest mn 資料依據group order dt 做分組
                        this.groupGuestMnData();
                        this.activeName = 'orderDetail';
                        this.editingOrderDtIdx = this.orderDtRowsData[this.editingGroupDataIndex].length > 0 ? 0 : undefined;
                        //取房型下拉資料
                        await this.qryRoomCodSelectOption();
                        this.isLoading = false;
                    }
                }
                else {
                    this.initData();
                }
            },
            async reload(newV) {
                /**
                 * 上方的 isGuestDetail 因為是 props，無法再guestDetail 進行改變，但也不想隨意讓子組件傳遞資料後，改變父組件資料
                 * 目前我無法預測改了 父層級的資料會有甚麼變化影響到其他功能。
                 */
                if (newV) {
                    if (this.isGuestDetail && !_.isUndefined(this.rowData.ikey)) {
                        this.initData();
                        //取三個table的欄位資料
                        await this.fetchAllFieldsData();
                        //取所有order dt 資料
                        await this.fetchAllOrderDtRowData();
                        //取所有guest mn 資料
                        await this.fetchAllGuestRowsData();
                        //顯示group order dt 的table
                        this.showDataGrid();
                        //設定group order dt table所選定的index
                        this.editingGroupDataIndex = this.orderDtGroupRowsData.length > 0 ? 0 : undefined;
                        if (!_.isUndefined(this.editingGroupDataIndex)) {
                            $("#orderDtTable").datagrid('selectRow', this.editingGroupDataIndex);
                        }
                        //將所有order dt 資料依據group order dt 做分組
                        this.groupOrderDtData(this.allOrderDtRowsData);
                        //將所有guest mn 資料依據group order dt 做分組
                        this.groupGuestMnData();
                        this.activeName = 'orderDetail';
                        this.editingOrderDtIdx = this.orderDtRowsData[this.editingGroupDataIndex].length > 0 ? 0 : undefined;
                        //取房型下拉資料
                        await this.qryRoomCodSelectOption();
                    }
                    else {
                        this.initData();
                    }
                    this.reload = false;
                }
            },
            editingGroupDataIndex(val) {
                this.editingOrderDtIdx = undefined;
                $("#orderDtTable").datagrid('selectRow', this.editingGroupDataIndex);
                this.editingGroupData = $("#orderDtTable").datagrid('getSelected');
                if (!_.isUndefined(this.editingGroupData)) {
                    let ls_orderSta = this.editingGroupData.order_sta;
                    let ls_ciDat = this.editingGroupData.ci_dat;

                    /**
                     * 看文件應該是'I,O,S,D'不能修改的，能修改的只有 order_sta: N 以及 C/I日期小於滾房租日期
                     */
                    // let la_checkField = ["I", "O", "S", "D"];
                    // this.isModifiable = (la_checkField.indexOf(ls_orderSta) > -1 && moment(ls_ciDat).diff(moment(this.rentCalDat), "days") >= 0)
                    this.isModifiable = (ls_orderSta === 'N' && moment(ls_ciDat).diff(moment(this.rentCalDat), "days") >= 0)
                }
            },
            allMark(newVal) {
                if (newVal) {
                    this.allDetail();
                } else {
                    let la_orderDtRowsData = [];
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
                        la_orderDtRowsData[idx] = _.where(this.orderDtRowsData, lo_groupParam);
                    });
                    this.orderDtRowsData = la_orderDtRowsData;
                }
            }
        },
        methods: {
            //取滾房租日
            fetchRentCalDat() {
                BacUtils.doHttpPromisePostProxy('/api/qryRentCalDat').then((result) => {
                    this.rentCalDat = result.rent_cal_dat;
                });
            },
            initData() {
                this.allOrderDtRowsData = [];
                this.oriAllOrderDtRowsData = [];
                this.allGuestMnRowsData = [];
                this.oriAllGuestMnRowsData = [];
                this.orderDtGroupFieldData = [];
                this.orderDtGroupRowsData = [];
                this.oriOrderDtGroupRowsData = [];
                this.orderDtFieldData = [];
                this.orderDtRowsData = {};
                this.oriOrderDtRowsData = {};
                this.guestMnFieldData = [];
                this.guestMnRowsData = {};
                this.oriGuestMnRowsData = {};
                this.dgIns = {};
                this.editingGroupDataIndex = undefined;
                this.editingGroupData = {};
                this.activeName = '';
                this.isOpenSpecifyHouse = false;

                Object.keys(this.tmpCUD).forEach(key => {
                    this.tmpCUD[key] = [];
                })
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
                    let [lo_fetchGroupOrderDtFieldsData, lo_fetchOrderDtFieldsData, lo_fetchGuestMnFieldsData] = await Promise.all([
                        this.fetchFieldsData({prg_id: gs_prgId, page_id: 1, tab_page_id: 1}),
                        this.fetchFieldsData({prg_id: gs_prgId, page_id: 1, tab_page_id: 2}),
                        this.fetchFieldsData({prg_id: gs_prgId, page_id: 1, tab_page_id: 3})
                    ]);
                    this.orderDtGroupFieldData = lo_fetchGroupOrderDtFieldsData.dgFieldsData;
                    this.orderDtFieldData = _.sortBy(lo_fetchOrderDtFieldsData.dgFieldsData, "col_seq");
                    this.guestMnFieldData = _.sortBy(lo_fetchGuestMnFieldsData.dgFieldsData, "col_seq");
                }
                catch (err) {
                    console.log(err);
                }
            },
            async fetchAllOrderDtRowData() {
                let lo_fetchOrderDtData = await BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", {
                    prg_id: gs_prgId,
                    page_id: 1,
                    tab_page_id: 1,
                    searchCond: {ikey: this.rowData.ikey}
                }).then((result) => {
                    return result;
                }).catch(err => {
                    return {success: false, errorMsg: err};
                });

                if (lo_fetchOrderDtData.success) {
                    _.each(lo_fetchOrderDtData.dgRowData, data => {
                        data.ci_dat = moment(data.ci_dat).format("YYYY/MM/DD");
                        data.co_dat = moment(data.co_dat).format("YYYY/MM/DD");
                        data.ci_dat_week = moment(data.ci_dat).format("ddd");
                        data.co_dat_week = moment(data.co_dat).format("ddd");
                        data.key_nos = this.rowData.key_nos;
                    });

                    this.allOrderDtRowsData = lo_fetchOrderDtData.dgRowData;
                    let ls_groupStatement = "select *, count(*) as order_qnt from ? where order_sta <> 'X' group by rate_cod,order_sta,days,ci_dat,co_dat,use_cod,room_cod,rent_amt,serv_amt,block_cod";
                    this.orderDtGroupRowsData = alasql(ls_groupStatement, [this.allOrderDtRowsData]);
                }
                else {
                    alert(lo_fetchOrderDtData.errorMsg);
                }
            },
            async fetchAllGuestRowsData() {
                let lo_fetchGuestMnData = await BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", {
                    prg_id: gs_prgId,
                    page_id: 1,
                    tab_page_id: 3,
                    searchCond: {ikey: this.rowData.ikey}
                }).then((result) => {
                    return result;
                }).catch(err => {
                    return {success: false, errorMsg: err};
                });
                if (lo_fetchGuestMnData.success) {
                    this.allGuestMnRowsData = lo_fetchGuestMnData.dgRowData;
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
            /**
             *
             * @param currentOrderDtRowsData 當前的頁面資料
             */
            groupOrderDtData(currentOrderDtRowsData) {
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
                    this.orderDtRowsData[idx] = _.where(currentOrderDtRowsData, lo_groupParam);
                });

                this.oriOrderDtRowsData = JSON.parse(JSON.stringify(this.orderDtRowsData));
            },
            groupGuestMnData() {
                //利用分組後的order dt 資料將guest mn 資料做分組
                _.each(this.orderDtRowsData, (la_ikey_seq_nos, idx) => {
                    this.guestMnRowsData[idx] = [];
                    _.each(la_ikey_seq_nos, (lo_data) => {
                        let lo_guestMnRowData = _.findWhere(this.allGuestMnRowsData, {ikey_seq_nos: lo_data.ikey_seq_nos});
                        if (!_.isUndefined(lo_guestMnRowData)) {
                            this.guestMnRowsData[idx].push(lo_guestMnRowData);
                        }
                    });
                });
                //未指定的guest mn 資料
                this.guestMnRowsData["unspecified"] = _.where(this.allGuestMnRowsData, {ikey_seq_nos: 0});

                this.oriGuestMnRowsData = JSON.parse(JSON.stringify(this.guestMnRowsData));
            },
            //因為房型下拉資料會因為當筆order dt影響，因此要一開始透過規則以第一個渠組的第一筆資料去產生下拉資料
            async qryRoomCodSelectOption() {
                let ln_roomCodIndex = _.findIndex(this.orderDtFieldData, {ui_field_name: 'room_cod'});
                let ln_useCodIndex = _.findIndex(this.orderDtFieldData, {ui_field_name: 'use_cod'});
                if (ln_roomCodIndex > -1 && ln_useCodIndex > -1) {
                    let lo_roomCodParam = {
                        prg_id: gs_prgId,
                        page_id: 1,
                        tab_page_id: 2,
                        ui_field_name: this.orderDtFieldData[ln_roomCodIndex].ui_field_name,
                        singleRowData: [this.orderDtRowsData[this.editingGroupDataIndex][this.editingOrderDtIdx]]
                    };
                    let lo_useCodParam = {
                        prg_id: gs_prgId,
                        page_id: 1,
                        tab_page_id: 2,
                        ui_field_name: this.orderDtFieldData[ln_useCodIndex].ui_field_name,
                        singleRowData: [this.orderDtRowsData[this.editingGroupDataIndex][this.editingOrderDtIdx]]
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
                        this.orderDtFieldData[ln_roomCodIndex].selectData = lo_fetchRoomCod.selectOptions;
                        this.orderDtFieldData[ln_roomCodIndex].selectDataDisplay = lo_fetchRoomCod.selectOptions;
                    }
                    else {
                        alert(lo_fetchRoomCod.errorMsg);
                    }
                    if (lo_fetchUseCod.success) {
                        this.orderDtFieldData[ln_useCodIndex].selectData = lo_fetchUseCod.selectOptions;
                        this.orderDtFieldData[ln_useCodIndex].selectDataDisplay = lo_fetchUseCod.selectOptions;
                    }
                    else {
                        alert(lo_fetchRoomCod.errorMsg);
                    }
                }
            },
            showRateCodDialog(index) {
                this.editingOrderDtIdx = index;
                this.editingOrderDtData = _.extend(this.rowData, this.orderDtRowsData[this.editingGroupDataIndex][this.editingOrderDtIdx]);
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
                let dialog = $("#resv_assignHouse_dialog").removeClass('hide').dialog({
                    modal: true,
                    title: "指定房組",
                    title_html: true,
                    width: 800,
                    maxwidth: 1920,
                    dialogClass: "test",
                    resizable: true
                });
            },
            async addOrderDtRow() {
                if (this.isModifiable) {
                    this.isLoading = true;
                    // 取當前頁面的最大
                    let la_allOrderDtRowsData = [];
                    _.each(this.orderDtRowsData, (la_orderDtRowsData) => {
                        _.each(la_orderDtRowsData, (lo_orderDtRowsData) => {
                            la_allOrderDtRowsData.push(lo_orderDtRowsData);
                        });
                    });

                    //新增 order dt 前要做得規則
                    let lo_chkAddRule = await BacUtils.doHttpPromisePostProxy("/api/chkPrgFuncRule", {
                        prg_id: gs_prgId,
                        page_id: 1,
                        tab_page_id: 2,
                        func_id: "0200",
                        allRowData: la_allOrderDtRowsData
                    }).then(result => {
                        return result
                    }).catch(err => {
                        return {success: false, errorMsg: err}
                    });

                    if (lo_chkAddRule.success) {
                        $("#orderDtTable").datagrid('selectRow', this.editingGroupDataIndex);
                        this.editingGroupData = $("#orderDtTable").datagrid('getSelected');


                        let lo_cloneOrderData = JSON.parse(JSON.stringify(this.editingGroupData));
                        lo_cloneOrderData.ikey_seq_nos = lo_chkAddRule.defaultValues.ikey_seq_nos;
                        lo_cloneOrderData.page_id = 1;
                        lo_cloneOrderData.tab_page_id = 2;
                        this.tmpCUD.createData.push(lo_cloneOrderData);

                        let lo_orderDtData = JSON.parse(JSON.stringify(this.orderDtRowsData));
                        lo_orderDtData[this.editingGroupDataIndex].push(lo_cloneOrderData);

                        this.orderDtRowsData = lo_orderDtData;
                    }
                    else {
                        alert(lo_chkAddRule.errorMsg);
                    }
                    this.isLoading = false;
                }

            },
            async removeOrderDtRow(data) {
                if (this.isModifiable) {
                    this.isLoading = true;
                    //刪除 order dt 前要做得規則
                    let lo_chkDelRule = await BacUtils.doHttpPromisePostProxy("/api/chkPrgFuncRule", {
                        prg_id: gs_prgId,
                        page_id: 1,
                        tab_page_id: 2,
                        func_id: "0300",
                        rowData: data
                    }).then(result => {
                        return result
                    }).catch(err => {
                        return {success: false, errorMsg: err}
                    });

                    if (lo_chkDelRule.success) {
                        console.log(lo_chkDelRule);
                        if (lo_chkDelRule.showConfirm) {
                            if (confirm(lo_chkDelRule.confirmMsg)) {
                                let lo_DataRow = _.findWhere(this.oriOrderDtRowsData[this.editingGroupDataIndex], {ikey_seq_nos: data.ikey_seq_nos});

                                // 刪除tmpCUD資料
                                if (lo_DataRow === undefined) {
                                    // 刪除此次新增的資料
                                    let ln_tmpIndex = _.findIndex(this.tmpCUD.createData, {ikey_seq_nos: data.ikey_seq_nos});
                                    this.tmpCUD.createData.splice(ln_tmpIndex, 1);
                                }
                                else {
                                    lo_DataRow.page_id = 1;
                                    lo_DataRow.tab_page_id = 2;

                                    // 刪除既有的資料
                                    let ln_modifyIndex = _.findIndex(this.tmpCUD.updateData, {
                                        ikey_seq_nos: data.ikey_seq_nos
                                    });

                                    let lo_cloneDataRow = JSON.parse(JSON.stringify(lo_DataRow));
                                    lo_cloneDataRow.order_sta = 'X';

                                    if (ln_modifyIndex > -1) {
                                        this.tmpCUD.updateData[ln_modifyIndex] = lo_cloneDataRow;
                                    } else {
                                        this.tmpCUD.updateData.push(lo_cloneDataRow);
                                        this.tmpCUD.oriData.push(lo_DataRow);
                                    }
                                }

                                // 刪除 orderDtRowsData的資料
                                let ln_index = _.findIndex(this.orderDtRowsData[this.editingGroupDataIndex], {
                                    ikey_seq_nos: data.ikey_seq_nos
                                });
                                let la_orderDtRowsData = JSON.parse(JSON.stringify(this.orderDtRowsData));
                                la_orderDtRowsData[this.editingGroupDataIndex].splice(ln_index, 1);
                                this.orderDtRowsData = la_orderDtRowsData;
                            }
                        }
                        else {
                            let lo_DataRow = _.findWhere(this.oriOrderDtRowsData[this.editingGroupDataIndex], {ikey_seq_nos: data.ikey_seq_nos});

                            // 刪除tmpCUD資料
                            if (lo_DataRow === undefined) {
                                // 刪除此次新增的資料
                                let ln_tmpIndex = _.findIndex(this.tmpCUD.createData, {ikey_seq_nos: data.ikey_seq_nos});
                                this.tmpCUD.createData.splice(ln_tmpIndex, 1);
                            }
                            else {
                                lo_DataRow.page_id = 1;
                                lo_DataRow.tab_page_id = 2;

                                // 刪除既有的資料
                                let ln_modifyIndex = _.findIndex(this.tmpCUD.updateData, {
                                    ikey_seq_nos: data.ikey_seq_nos
                                });

                                let lo_cloneDataRow = JSON.parse(JSON.stringify(lo_DataRow));
                                lo_cloneDataRow.order_sta = 'X';

                                if (ln_modifyIndex > -1) {
                                    this.tmpCUD.updateData[ln_modifyIndex] = lo_cloneDataRow;
                                } else {
                                    this.tmpCUD.updateData.push(lo_cloneDataRow);
                                    this.tmpCUD.oriData.push(lo_DataRow);
                                }
                            }

                            // 刪除 orderDtRowsData的資料
                            let ln_index = _.findIndex(this.orderDtRowsData[this.editingGroupDataIndex], {
                                ikey_seq_nos: data.ikey_seq_nos
                            });
                            let la_orderDtRowsData = JSON.parse(JSON.stringify(this.orderDtRowsData));
                            la_orderDtRowsData[this.editingGroupDataIndex].splice(ln_index, 1);
                            this.orderDtRowsData = la_orderDtRowsData;
                        }
                    }
                    else {
                        alert(lo_chkDelRule.errorMsg);
                    }
                    this.isLoading = false;
                }

            },
            //新增guest mn 資料
            async addGuestMnData() {

                // if (this.isModifiable) {
                // 讀取group order_dt 當前選擇的列的資料
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
                // 篩選order_dt 明細
                let la_detailOrderDtData = _.where(this.allOrderDtRowsData, lo_groupParam);

                // la_detailOrderDtData 有顧客明細才做
                if (la_detailOrderDtData.length > 0) {
                    let la_lossIkeySeqNosGuest = [];
                    // order_dt明細和group guest顧客做比對抓出目前缺少的ikey_seq_nos
                    for (let lo_orderDtData of la_detailOrderDtData) {
                        let lo_currentGuest = _.findWhere(this.guestMnRowsData[this.editingGroupDataIndex], {
                            ikey_seq_nos: lo_orderDtData.ikey_seq_nos
                        });
                        if (_.isUndefined(lo_currentGuest)) {
                            la_lossIkeySeqNosGuest.push(lo_orderDtData);
                            break;
                        }
                    }

                    let la_allGuestMnData = [];
                    _.each(this.guestMnRowsData, (la_data) => {
                        _.each(la_data, (lo_data) => {
                            la_allGuestMnData.push(lo_data);
                        });
                    });
                    // 新增guest mn 前要做得規則
                    let lo_chkAddRule = await
                        BacUtils.doHttpPromisePostProxy("/api/chkPrgFuncRule", {
                            prg_id: gs_prgId,
                            page_id: 1,
                            tab_page_id: 3,
                            func_id: "0200",
                            allRowData: la_allGuestMnData
                        }).then(result => {
                            return result
                        }).catch(err => {
                            return {success: false, errorMsg: err}
                        });

                    if (lo_chkAddRule.success) {
                        let lo_addRowData = lo_chkAddRule.defaultValues;
                        // console.log(lo_addRowData);
                        // 新增顧客資料把目前缺少的ikey_seq_nos補齊
                        if (la_lossIkeySeqNosGuest.length > 0) {
                            _.each(la_lossIkeySeqNosGuest, (lo_guest) => {
                                let lo_newGuest = {
                                    ikey: lo_guest.ikey,
                                    athena_id: lo_addRowData.athena_id,
                                    hotel_cod: lo_addRowData.hotel_cod,
                                    ci_ser: "",
                                    ikey_seq_nos: lo_guest.ikey_seq_nos,
                                    alt_nam: "",
                                    assign_sta: lo_addRowData.assign_sta,
                                    room_nos: "",
                                    contry_cod: "",
                                    pref_room: "",
                                    car_nos: "",
                                    guest_sta: lo_addRowData.guest_sta,
                                    master_sta: lo_addRowData.master_sta,
                                    system_typ: lo_addRowData.system_typ,
                                    status: "new"
                                };
                                //新加入的object，vue前端畫面無法做出反應，解決方法深層複製新的物件
                                let lo_cloneGuestMnRowsData = JSON.parse(JSON.stringify(this.guestMnRowsData));
                                lo_cloneGuestMnRowsData[this.editingGroupDataIndex].push(lo_newGuest);
                                this.guestMnRowsData = lo_cloneGuestMnRowsData;


                            });
                        } else if (la_lossIkeySeqNosGuest.length === 0) {
                            let lo_newGuest = {
                                ikey: la_detailOrderDtData[0].ikey,
                                athena_id: lo_addRowData.athena_id,
                                hotel_cod: lo_addRowData.hotel_cod,
                                ci_ser: "",
                                ikey_seq_nos: 0,
                                alt_nam: "",
                                assign_sta: lo_addRowData.assign_sta,
                                room_nos: "",
                                contry_cod: "",
                                pref_room: "",
                                car_nos: "",
                                guest_sta: lo_addRowData.guest_sta,
                                master_sta: lo_addRowData.master_sta,
                                system_typ: lo_addRowData.system_typ,
                                status: "new"
                            };
                            //新加入的object，vue前端畫面無法做出反應，解決方法深層複製新的物件
                            let lo_cloneGuestMnRowsData = JSON.parse(JSON.stringify(this.guestMnRowsData));
                            lo_cloneGuestMnRowsData[this.editingGroupDataIndex].push(lo_newGuest);
                            this.guestMnRowsData = lo_cloneGuestMnRowsData;
                        }
                    }
                    else {
                        alert(lo_chkAddRule.errorMsg);
                    }

                }
                // }
            },
            //刪除guest mn 資料
            async removeGuestMnData(data) {
                // if (this.isModifiable) {
                this.isLoading = true;


                this.isLoading = false;
                // }
            },
            async save() {
                try {
                    this.isLoading = true;

                    // 原始資料、現在資料 排序
                    let la_allOriOrderData = [];
                    let la_allOrderdata = [];
                    _.each(this.oriOrderDtRowsData, lo_oriOrderData => {
                        _.each(lo_oriOrderData, x => {
                            la_allOriOrderData.push(x);
                        })
                    });

                    _.each(this.orderDtRowsData, data => {
                        _.each(data, x => {
                            la_allOrderdata.push(x);
                        })
                    });
                    la_allOriOrderData = _.sortBy(la_allOriOrderData, 'ikey_seq_nos');
                    la_allOrderdata = _.sortBy(la_allOrderdata, 'ikey_seq_nos');

                    // 新增
                    if (la_allOriOrderData.length < la_allOrderdata.length) {
                        let la_newOrderData = la_allOrderdata.slice(la_allOriOrderData.length);
                        _.each(la_newOrderData, x => {
                            x.page_id = 1;
                            x.tab_page_id = 2;
                        });

                        this.tmpCUD.createData = la_newOrderData;
                    }

                    // 修改
                    let la_beforeOrder = [];
                    let la_afterOrder = [];
                    la_allOriOrderData.forEach((val, idx) => {
                        if (val.ikey_seq_nos === la_allOrderdata[idx].ikey_seq_nos) {
                            let la_keys = _.keys(val);

                            let lb_diffMark = true;
                            la_keys.forEach(x => {
                                if (val[x] !== la_allOrderdata[idx][x] && lb_diffMark) {
                                    lb_diffMark = false;
                                    val.page_id = 1;
                                    val.tab_page_id = 2;
                                    la_allOrderdata[idx].page_id = 1;
                                    la_allOrderdata[idx].tab_page_id = 2;
                                    la_beforeOrder.push(val);
                                    la_afterOrder.push(la_allOrderdata[idx]);
                                }
                            });
                        }
                    });
                    this.tmpCUD.updateData = la_afterOrder;
                    this.tmpCUD.oriData = la_beforeOrder;

                    // 驗證
                    let la_orderDtRowsData = [];
                    Object.keys(this.tmpCUD).forEach(key => {
                        if (this.tmpCUD[key].length > 0 && this.tmpCUD[key] !== 'oriData') {
                            la_orderDtRowsData.push(this.dataValidate(this.tmpCUD[key], this.orderDtFieldData));
                        }
                    });

                    let la_chkData = await Promise.all(la_orderDtRowsData);
                    let ln_chkIndex = _.findIndex(la_chkData, {success: false});
                    if (ln_chkIndex > -1) {
                        alert(la_chkData[ln_chkIndex].msg);
                        return;
                    }

                    // 儲存
                    let lo_result = await BacUtils.doHttpPromisePostProxy('/api/execNewFormatSQL', {
                        prg_id: gs_prgId,
                        func_id: "0500",
                        tmpCUD: this.tmpCUD
                    });

                    if (lo_result.success) {
                        this.isLoading = false;
                        this.reload = true;
                    } else {
                        alert(lo_result.errorMsg)
                    }
                } catch (err) {
                    console.log(err)
                    // alert(err)
                }
            },
            async chkOrderDtFieldRule(ui_field_name, rule_func_name) {
                if (_.isEmpty(this.beforeOrderDtRowsData)) {
                    this.beforeOrderDtRowsData = this.oriOrderDtRowsData;
                }

                if (_.isUndefined(this.editingOrderDtIdx)) {
                    return;
                }
                let lo_param = {key_nos: this.rowData.key_nos, acust_cod: this.rowData.acust_cod};
                let la_beforeData = [_.extend(this.beforeOrderDtRowsData[this.editingGroupDataIndex][this.editingOrderDtIdx], lo_param)];
                let la_orderData = [_.extend(this.orderDtRowsData[this.editingGroupDataIndex][this.editingOrderDtIdx], lo_param)];
                let la_diff = _.difference(la_beforeData, la_orderData);

                let la_allOrderDtRowsData = [];
                _.each(this.orderDtRowsData, (la_data) => {
                    _.each(la_data, (lo_data) => {
                        la_allOrderDtRowsData.push(lo_data);
                    });
                });

                if (la_diff.length === 0 && !this.isFirstFetch) {
                    return;
                }

                if (rule_func_name === '' || !this.isEffectFromRule) {
                    this.isEffectFromRule = true;
                    return;
                }

                try {
                    this.isFirstFetch = false;
                    if (!_.isEmpty(rule_func_name.trim())) {
                        let lo_postData = {
                            prg_id: gs_prgId,
                            rule_func_name: rule_func_name,
                            validateField: ui_field_name,
                            singleRowData: la_orderData,
                            oriSingleData: la_beforeData,
                            allRowData: la_allOrderDtRowsData
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
                                this.orderDtRowsData[this.editingGroupDataIndex][this.editingOrderDtIdx] =
                                    _.extend(this.orderDtRowsData[this.editingGroupDataIndex][this.editingOrderDtIdx], lo_doChkFiledRule.effectValues);

                                this.isEffectFromRule = lo_doChkFiledRule.isEffectFromRule;
                            }
                            //是否要show出訊息
                            if (lo_doChkFiledRule.showAlert) {
                                alert(lo_doChkFiledRule.alertMsg);
                            }
                            //欄位是否唯獨
                            if (lo_doChkFiledRule.readonlyFields.length > 0) {
                                _.each(lo_doChkFiledRule.readonlyFields, (ls_field) => {
                                    let ln_changFieldIndex = _.findIndex(this.orderDtFieldData, {ui_field_name: ls_field});
                                    if (ln_changFieldIndex > -1) {
                                        this.orderDtFieldData[ln_changFieldIndex].modificable = 'N';
                                    }
                                });
                            }
                            //欄位是否可修改
                            if (lo_doChkFiledRule.unReadonlyFields.length > 0) {
                                _.each(lo_doChkFiledRule.unReadonlyFields, (ls_field) => {
                                    let ln_changFieldIndex = _.findIndex(this.orderDtFieldData, {ui_field_name: ls_field});
                                    if (ln_changFieldIndex > -1) {
                                        this.orderDtFieldData[ln_changFieldIndex].modificable = 'Y';
                                    }
                                });
                            }
                            //欄位下拉資料
                            if (lo_doChkFiledRule.selectField.length > 0) {
                                _.each(lo_doChkFiledRule.selectField, (ls_field) => {
                                    let ln_changFieldIndex = _.findIndex(this.orderDtFieldData, {ui_field_name: ls_field});
                                    if (ln_changFieldIndex > -1) {
                                        this.orderDtFieldData[ln_changFieldIndex].selectData = lo_doChkFiledRule.multiSelectOptions[ls_field];
                                        this.orderDtFieldData[ln_changFieldIndex].selectDataDisplay = lo_doChkFiledRule.multiSelectOptions[ls_field];
                                    }
                                });
                            }
                            //改變前資料改為現在資料
                            this.beforeOrderDtRowsData = JSON.parse(JSON.stringify(this.orderDtRowsData));

                            // 儲存
                            let lo_orderData = this.orderDtRowsData[this.editingGroupDataIndex][this.editingOrderDtIdx];
                            let ls_ikeyseqnos = lo_orderData.ikey_seq_nos;
                            let lo_oriOrderData = _.findWhere(this.oriOrderDtRowsData[this.editingGroupDataIndex], {
                                ikey_seq_nos: ls_ikeyseqnos
                            });

                            if (lo_orderData !== undefined && lo_oriOrderData === undefined) {
                                // 此次新增的資料 並且要修改
                                let ln_createIndex = _.findIndex(this.tmpCUD.createData, {
                                    ikey_seq_nos: ls_ikeyseqnos
                                });

                                this.tmpCUD.createData[ln_createIndex] = lo_orderData; //

                            }
                            else if (!_.isUndefined(lo_orderData) && !_.isUndefined(lo_oriOrderData)) {
                                //既有的資料 並且要修改
                                let ln_modifyIndex = _.findIndex(this.tmpCUD.updateData, {
                                    ikey_seq_nos: ls_ikeyseqnos
                                });

                                if (ln_modifyIndex > -1) {
                                    //tmp已經有值
                                    this.tmpCUD.updateData[ln_modifyIndex] = lo_orderData;
                                } else {
                                    //tmp沒有
                                    this.tmpCUD.updateData.push(lo_orderData);
                                    this.tmpCUD.oriData.push(lo_oriOrderData);
                                }
                            }
                        }
                        else {
                            alert(lo_doChkFiledRule.errorMsg);
                        }
                    }
                }
                catch (err) {
                    console.log(err)
                }
            },
            allDetail: function () {
                let la_allOrderdata = [];
                _.each(this.orderDtRowsData, la_orderDtRowsData => {
                    _.each(la_orderDtRowsData, lo_orderDtRowsData => {
                        la_allOrderdata.push(lo_orderDtRowsData);
                    })
                });
                la_allOrderdata = _.sortBy(la_allOrderdata, 'ikey_seq_nos');
                this.orderDtRowsData = JSON.parse(JSON.stringify(la_allOrderdata));
            },
            // 驗證
            dataValidate(chkData, chkFields) {
                return new Promise((resolve, reject) => {
                    let lo_checkResult = {success: true, msg: ""};
                    let la_chkData = Array.isArray(chkData) ? chkData : [chkData];

                    //檢查資料
                    for (let lo_chkData of la_chkData) {
                        for (let lo_field of chkFields) {
                            //必填
                            if (lo_field.requirable === "Y" && lo_field.modificable !== "N" && lo_field.ui_type !== "checkbox") {
                                lo_checkResult = go_validateClass.required(lo_chkData[lo_field.ui_field_name], lo_field.ui_display_name);
                                if (lo_checkResult.success === false) {
                                    break;
                                }
                            }
                            //有format
                            if (lo_field.format_func_name.validate !== "" && !_.isUndefined(go_validateClass[lo_field.format_func_name.validate]) && lo_chkData[lo_field.ui_field_name] !== '') {
                                lo_checkResult = go_validateClass[lo_field.format_func_name.validate](lo_chkData[lo_field.ui_field_name], lo_field.ui_display_name);
                                if (lo_checkResult.success === false) {
                                    break;
                                }
                            }
                        }
                    }
                    resolve(lo_checkResult)
                });
            },
        },
    }
</script>

<style scoped>

</style>