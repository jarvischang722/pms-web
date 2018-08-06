<template>
    <div>
        <div class="page-header"></div><!-- /.page-header -->
        <!-- 排房作業 Page-->
        <div class="pageMain">
            <!-- search content -->
            <div class="col-xs-12 search-co-content search-S2">
                <div class="row">
                    <search-comp
                            :search-fields="searchFields"
                            :search-cond.sync="searchCond"
                            :fetch-data="bindGroupOrderDtRowData"
                    ></search-comp>
                </div> <!-- row-->
            </div> <!-- /.col-sm-12 -->
            <div class="clearfix"></div>

            <!--<div class="row">-->
            <div class="col-xs-12">
                <div class="roomAssign">
                    <!--  接待 roomAssign 內容-->
                    <!--<div id="roomDetail-all-container" class="col-xs-11">-->
                    <div class="col-xs-11">
                        <div class="row no-margin-right">
                            <!--訂房多筆&定房明細-->
                            <div class="col-xs-5 no-padding-left">
                                <!--訂房多筆-->

                                <div id="roomDetail-table-first" class="roomDetail-table2 easyui-panel dataGrid-s1"
                                     v-loading="isLoadingGroupOrderDt">
                                    <table id="groupOrderDt_dg" style="height: 250px;"></table>
                                </div>
                                <div class="clearfix"></div>
                                <br>
                                <div class="space-12"></div>
                                <!--定房明細-->
                                <div class="jqGridEdit-table roomDetail-table2 cardDetail_margin easyui-panel dataGrid-s1"
                                     v-loading="isLoadingOrderDtList">
                                    <!--class="roomAssTableHt" 控制高度隨著螢幕預設變化-->
                                    <table id="OrderDtList_dg" style="height: 400px;"></table>
                                </div>
                                <br>

                            </div>
                            <!--排房資料-->
                            <div class="col-xs-7 right-info">
                                <div class="">
                                    <!-- #section:elements.tab.position -->
                                    <div class="col-xs-12">
                                        <div class="row">
                                            <div class="col-xs-10">
                                                <div class="row no-padding">
                                                    <div class="tooltip-sp pull-left">
                                                        <span class=" color-desc">
                                                            <i class="fa fa-dashboard"></i>顏色說明
                                                        </span>
                                                        <span class="tooltip-text">
                                                            <ul>
                                                            <!--顏色對應方式??-->
                                                                <li v-for="colorText in colorMessage">
                                                                    <div class="square-color pull-left"
                                                                         :style="{'background-color':'#' + colorText.color}"
                                                                    ></div>
                                                                    <div class="pull-left">{{colorText.display}}</div>
                                                                    <div class="clearfix"></div>
                                                                </li>
                                                                <!--<li v-for="(textDetail,idx) in ColorList">-->
                                                                    <!--<div class="square-color pull-left"-->
                                                                         <!--:class="'roomAsg-status-'+(idx+1)"></div>-->
                                                                    <!--<div class="pull-left">{{textDetail}}</div>-->
                                                                    <!--<div class="clearfix"></div>-->
                                                                <!--</li>-->
                                                            </ul>
                                                        </span>
                                                    </div>
                                                    <div class="searchCheckbox pull-left">
                                    <span class="checkbox">
                                          <label class="checkbox-width">
                                              <input name="form-field-checkbox"
                                                     type="checkbox"
                                                     class="ace"
                                                     v-model="chkAssign"
                                              >
                                              <span class="lbl">
                                                  <span class="subtxt">可排房</span>
                                              </span>
                                          </label>
                                    </span>
                                                    </div>
                                                    <div class="clearfix"></div>
                                                </div>
                                            </div>
                                            <!-- lite 版隱藏 -->
                                            <div style="display: none;">
                                                <div class="col-xs-2">
                                                    <div class="row ml--13">
                                                        <div class="select-group chgText-effect">
                                                            <button data-toggle="dropdown"
                                                                    class="btn btn-primary btn-white btn-defaultWidth dropdown-toggle"
                                                                    aria-expanded="false">
                                                                <span class="dpShowValue">特色</span>
                                                                <span class="ace-icon fa fa-angle-down icon-on-right"></span>
                                                            </button>
                                                            <ul class="dropdown-menu dropdown-info dropdown-menu-right dpUIList">
                                                                <li><a href="#">G001:面公道五路</a></li>
                                                                <li><a href="#">G002:面華夏新城</a></li>
                                                                <li><a href="#">N003:不要四號房</a></li>
                                                                <li><a href="#">N004:不要角間</a></li>
                                                                <li><a href="#">ALL</a></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-2">
                                                    <div class="row ml--13">
                                                        <div class="select-group chgText-effect">
                                                            <button data-toggle="dropdown"
                                                                    class="btn btn-primary btn-white btn-defaultWidth dropdown-toggle"
                                                                    aria-expanded="false">
                                                                <span class="dpShowValue">棟別</span>
                                                                <span class="ace-icon fa fa-angle-down icon-on-right"></span>
                                                            </button>
                                                            <ul class="dropdown-menu dropdown-info dropdown-menu-right dpUIList">
                                                                <li><a href="#">A棟</a></li>
                                                                <li><a href="#">B棟</a></li>
                                                                <li><a href="#">C棟</a></li>
                                                                <!--<li class="divider"></li>-->
                                                                <li><a href="#">D棟</a></li>
                                                                <li><a href="#">ALL</a></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="col-xs-2">
                                                    <div class="row ml--13">
                                                        <div class="select-group chgText-effect">
                                                            <button data-toggle="dropdown"
                                                                    class="btn btn-primary btn-white btn-defaultWidth dropdown-toggle"
                                                                    aria-expanded="false">
                                                                <span class="dpShowValue">拆併床</span>
                                                                <span class="ace-icon fa fa-angle-down icon-on-right"></span>
                                                            </button>
                                                            <ul class="dropdown-menu dropdown-info dropdown-menu-right dpUIList">
                                                                <li><a href="#">拆床</a></li>
                                                                <li><a href="#">併床</a></li>
                                                                <li><a href="#">ALL</a></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="col-xs-2">
                                                <div class="row ml--13">
                                                    <div class="select-group chgText-effect">
                                                        <button data-toggle="dropdown"
                                                                class="btn btn-primary btn-white btn-defaultWidth dropdown-toggle "
                                                                aria-expanded="false">
                                                            <span class="dpShowValue">樓層</span>

                                                            <span class="ace-icon fa fa-angle-down icon-on-right"></span>
                                                        </button>
                                                        <!--<ul class="dropdown-menu dropdown-info dropdown-menu-right dpUIList">-->
                                                        <ul class="dropdown-menu dropdown-info dropdown-menu-right">
                                                            <li v-for="(room, idx) in roomFloor"
                                                                @click="chooseRoomFloor(room.value)"
                                                                :class="{'click-act': isChkRoomFloor(room.value)}"
                                                            >
                                                                <a href="#">{{room.display}}</a>
                                                            </li>
                                                            <!--<li class="divider"></li>-->
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                            <div class="clearfix"></div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <div class="space-2"></div>
                                    <!--排房房間資料-->
                                    <div class="tabbable tabs-left">
                                        <!--房型過濾條件-->
                                        <div class="horizTable-outer pull-left chooseCount"
                                             style="min-width: 49px; max-width:5%;">
                                            <table class="css_table horizTable center table-lg width-100 rm-table-s ">
                                                <tbody class="css_tbody">
                                                <tr class="css_tr" v-for="(room,idx) in roomType"
                                                    @click="chooseRoomType(room.room_cod)">
                                                    <td class="css_td"
                                                        :class="{active:room.room_cod === selectRoomType }">
                                                        {{room.room_cod}}
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <!--/房型過濾條件-->
                                        <div class="tab-content roomAssign-p" style="overflow: hidden;">
                                            <div id="All" class="tab-pane in active"
                                                 style="position: relative;">
                                                <div class="town-grap scrollable" v-show="btnList">
                                                    <div class="townPage">
                                                        <!--<div class="townBlock roomAss_detail"-->
                                                        <div class="townBlock"
                                                             v-for="(roomDt, index) in filterRoomList"
                                                             @click="chooseRoomDt(roomDt)"
                                                        >
                                                            <div class="head">
                                                                <span class="left txt-lg">{{roomDt.room_nos}}</span>
                                                                <span class="right">{{roomDt.room_cod}}</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>{{roomDt.alt_nam !== null ? roomDt.alt_nam: '尚未設定' }}</span>
                                                            </div>
                                                            <div class="content">
                                                                <span v-if="roomDt.ci_dat !== null">
                                                                    {{roomDt.ci_dat}}-{{roomDt.co_dat}}
                                                                </span>
                                                                <span v-else>
                                                                    {{roomListCiCoDat}}
                                                                </span>
                                                            </div>
                                                            <!-- 拆併床 Lite 不顯示 -->
                                                            <div class="content">
                                                                <div style="height: 15px"></div>
                                                            </div>
                                                            <div class="clearfix"></div>

                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"
                                                                     v-show="clean_sta === 'C'"
                                                                />
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"
                                                                     v-show="room_sta ==='R'"
                                                                />
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"
                                                                     v-show="assign_sta === 'Y'"
                                                                />
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"
                                                                     v-show="room_sta === 'O'"
                                                                />
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"
                                                                />
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="town-table" v-show="!btnList">
                                                    <div class="townRow easyui-panel">
                                                        <!--高度: townPage 的高度-->
                                                        <table id="townList-table" style="height: 500px;"></table>
                                                    </div>
                                                </div>
                                            </div>
                                            <div id="SPR" class="tab-pane">
                                                <p>Etsy mixtape wayfarers, ethical wes anderson tofu before they
                                                    sold out mcsweeney's organic lomo retro fanny pack lo-fi
                                                    farm-to-table readymade.</p>
                                                <p>Raw denim you probably haven't heard of them jean shorts
                                                    Austin.</p>
                                            </div>
                                            <div id="DXK" class="tab-pane">
                                                <p>Etsy mixtape wayfarers, ethical wes anderson tofu before they
                                                    sold out mcsweeney's organic lomo retro fanny pack lo-fi
                                                    farm-to-table readymade.</p>
                                                <p>Raw denim you probably haven't heard of them jean shorts
                                                    Austin.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="clearfix"></div>
                                    <!--/排房房間資料-->
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--  /.End 接待 roomAssign 內容 -->
                    <!--按鈕-->
                    <div class="col-xs-1 col-sm-1">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                :disabled="!lockStatus" @click="doAssign()"
                                                role="button">排房
                                        </button>
                                    </li>
                                    <li>
                                        <!--<button class="btn btn-primary btn-white btn-defaultWidth foCnt_autoAssignSGL"-->
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                :disabled="!lockStatus" @click="doAssignAll"
                                                role="button">批次排房
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-danger btn-white btn-defaultWidth"
                                                :disabled="!lockStatus" @click="doUnassign()"
                                                role="button">取消排房
                                        </button>
                                    </li>
                                    <li>
                                        <!--<button class="btn btn-danger btn-white btn-defaultWidth foCnt_batch_cal"-->
                                        <button class="btn btn-danger btn-white btn-defaultWidth"
                                                :disabled="!lockStatus" @click="doUnassignAll()"
                                                role="button">批次取消
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-gray btn-defaultWidth foCnt_autoAssign"
                                                role="button">自動排房
                                        </button>
                                    </li>
                                    <li>
                                        <!--<button class="btn  btn-primary btn-white btn-defaultWidth focnt_lockRoom"-->
                                        <button class="btn  btn-primary btn-white btn-defaultWidth"
                                                :disabled="!lockStatus" @click="lockRoom"
                                                role="button">鎖定排房
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth reservationDialog-1"
                                                :disabled="!lockStatus" @click="checkRawCode()"
                                                role="button">訂房卡
                                        </button>
                                    </li>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                @click="changeRoomDataType"
                                        >
                                            {{btnList? '清單模式':'圖形模式'}}
                                        </button>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <!--/按鈕-->
                </div>
            </div>
        </div>

        <!-- 批次取消失敗清單 -->
        <div id="batchCancelList" class="hide padding-5">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-10 col-sm-10">
                        <div class="row no-margin-right">
                            <table class="css_table horizTable click-effect">
                                <thead class="css_thead">
                                <tr class="css_tr">
                                    <th class="css_th" v-for="(field, key) in cancelFaildField">
                                        {{field.field}}
                                    </th>
                                </tr>
                                </thead>
                                <tbody class="css_tbody">
                                <template v-for="(FaildData, key) in cancelFaildData">
                                    <tr class="css_tr" v-for="(item) in FaildData">
                                        <template>
                                            <td class="css_td" v-for="(data) in item">
                                                {{data}}
                                            </td>
                                        </template>
                                    </tr>
                                </template>
                                </tbody>
                            </table>
                        </div>
                        <div class="clearfix"></div>
                    </div>
                    <div class="col-xs-2 col-sm-2">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                @click="doCloseCancelAssign"
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
        <!-- /批次取消失敗清單 -->

        <!-- 批次排房彈出視窗 -->
        <div id="batchAssignListDialog" class="hide padding-5">
            <div class="col-xs-12 col-sm-12">
                <div class="row">
                    <div class="col-xs-10 col-sm-10">
                        <div class="row no-margin-right">
                            <div class="main-content-data">
                                <table class="css_table horizTable click-effect">
                                    <thead class="css_thead">
                                    <tr class="css_tr">
                                        <th class="css_th" v-for="(field, key) in batchAssignListField">
                                            {{field.field}}
                                        </th>
                                    </tr>
                                    </thead>
                                    <tbody class="css_tbody">
                                    <template v-for="(AssignData, AssignKey) in batchAssignDataList">
                                        <tr>
                                            <template v-for="(AssignField, key) in batchAssignListField">
                                                <td class="css_td"
                                                    v-if="AssignField.type === 'checkbox'"
                                                >
                                                    <input style="margin: 5px" type="checkbox"
                                                           :value="AssignData"
                                                           v-model="chkAssignDataList"
                                                           :disabled="AssignData.choose === 'N' ? 'disabled' : null "
                                                    >
                                                </td>
                                                <td class="css_td"
                                                    v-if="AssignField.type === 'text'"
                                                >
                                                    <span>{{AssignData[AssignField.value]}}</span>
                                                </td>
                                            </template>
                                        </tr>
                                    </template>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                        <div class="clearfix"></div>

                    </div>
                    <div class="col-xs-2 col-sm-2">
                        <div class="row">
                            <div class="right-menu-co">
                                <ul>
                                    <li>
                                        <button class="btn btn-primary btn-white btn-defaultWidth"
                                                role="button"
                                                @click="doAssignAllSure"
                                        >
                                            確定
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

                <div class="clearfix"></div>
            </div>
        </div>
    </div>
</template>

<script>
    const gs_prgId = "PMS0210030";
    import _ from "underscore";

    let vmHub = new Vue();
    //region  DatagridRmSingleGridClass
    // 訂房多筆
    function DatagridGroupClass() {
    }

    DatagridGroupClass.prototype = new DatagridBaseClass();
    DatagridGroupClass.prototype.onClickCell = function (idx, row) {
        vmHub.$emit("setGroupOrderDt", {row: row, index: idx});
    };
    DatagridGroupClass.prototype.onClickRow = function (idx, row) {
    };

    // 訂房明細 List
    function DatagridOrderListClass() {
    }

    DatagridOrderListClass.prototype = new DatagridBaseClass();
    DatagridOrderListClass.prototype.onClickCell = function (idx, row) {
        vmHub.$emit("setOrderDt", {row: row, index: idx});
    };
    DatagridOrderListClass.prototype.onClickRow = function (idx, row) {
    };

    // 排房房間
    function DatagridRoomListClass() {
    }

    DatagridRoomListClass.prototype = new DatagridBaseClass();
    DatagridRoomListClass.prototype.onClickCell = function (idx, row) {
        vmHub.$emit("setRoomDt", {row: row, index: idx});
    };
    DatagridRoomListClass.prototype.onClickRow = function (idx, row) {
    };
    /*** Class End  ***/
    //endregion

    export default {
        props: {
            parent_ikey: String,
        },
        data() {
            return {
                // DataGrid
                dgGroup: {},
                dgList: {},
                dgRoom: {},

                // 搜尋
                searchFields: [],
                searchCond: {},

                // 滾房租日
                rentCalDat: '',

                // 訂房多筆
                groupOrderDtField: [],
                groupOrderDtRowData: [],
                selectDtIndex: -1,

                // 訂房明細
                orderDtListField: [],
                orderDtListRowData: [],
                selectListIndex: -1,

                // 排房房間
                roomDtListField: [],
                roomDtListRowData: [],
                selectRoomDtIndex: -1,
                // 選擇房間資料
                selectRoomData: {},

                // 顯示清單或是圖形模式 true:清單 false:圖形
                btnList: true,
                // 可排房 or 不可排房 Button
                chkAssign: true,
                // 房型顯示資料
                roomType: [],
                // 樓層顯示資料
                roomFloor: [],
                // 選擇房型資料
                selectRoomType: '',
                // 選擇樓層資料
                selectRoomFloor: [],
                // 顏色說明
                ColorList: ['不可排房', '修理房間', '可排房間', '不可移動', '今日預定C/O', '參觀'],

                // isLite:true, 要討論未來如何判斷使用版本(lite)
                lockStatus: false,//lock有做的話(true)可以按按鈕

                // 失敗清單
                cancelFaildField: [
                    {field: '序號'},
                    {field: '房號'},
                    {field: '住客姓名'},
                    {field: '訊息說明'},
                ],
                cancelFaildData: [],
                // 批次清單
                batchAssignListField: [
                    {field: '選擇', value: 'choose', type: 'checkbox', width: 60},
                    {field: '房號', value: 'room_nos', type: 'text', width: 60},
                    {field: '序號', value: 'ikey_seq_nos', type: 'text', width: 60},
                    {field: '住客姓名', value: 'full_nam', type: 'text', width: 60},
                    {field: '訊息說明', value: 'message', type: 'text'},
                ],
                batchAssignDataList: [],
                chkAssignDataList: [],

                // [訂房多筆] Loading
                isLoadingGroupOrderDt: false,
                // [訂房明細] Loading
                isLoadingOrderDtList: false,

                colorMessage: [],
            };
        },
        created() {
            vmHub.$on("setGroupOrderDt", (lo_params) => {
                this.selectDtIndex = lo_params.index;
            });
            vmHub.$on('setOrderDt', (lo_params) => {
                this.selectListIndex = lo_params.index;
            });
            vmHub.$on('setRoomDt', (lo_params) => {
                this.selectRoomDtIndex = lo_params.index;
            });

            // rowLock
            let self = this;
            g_socket.on('checkTableLock', function (result) {
                if (!result.success) {
                    self.lockStatus = false;
                    alert(result.errorMsg);

                } else {
                    self.lockStatus = true;
                }
            });

            this.dgGroup = new DatagridGroupClass();
            this.dgList = new DatagridOrderListClass();
            this.dgRoom = new DatagridRoomListClass();
        },
        watch: {
            async selectDtIndex(newV, oldV) {
                console.log('訂房多筆', newV, oldV);
                // 房型種類
                let ls_ciDat = moment(this.groupOrderDtRowData[this.selectDtIndex].ci_dat).format('YYYY/MM/DD');
                let lo_roomType = await this.getAllRoomType(ls_ciDat);
                this.roomType = lo_roomType.effectValues;
                this.selectRoomType = this.groupOrderDtRowData[this.selectDtIndex].use_cod;

                await this.doRowUnLock();
                await this.doRowLock();

                // 產生 [訂房明細] DataGrid 資料
                await this.bindOrderDtList();

                // 產生 [排房房間] 資料
                await this.bindRoomList();
            },
            async selectListIndex(newVal, oldVal) {
                console.log('訂房明細', newVal, oldVal);
            },
            async chkAssign(newVal, oldVal) {
                await this.bindRoomList();
            },
        },
        computed: {
            /**
             * 依照選擇的房型種類，過濾房型
             */
            filterRoomList: function () {
                if (this.selectRoomType === 'ALL') {
                    return this.roomDtListRowData;
                } else {
                    return this.roomDtListRowData.filter(lo_data => lo_data.room_cod === this.selectRoomType);
                }
            },
            /**
             * 尚未設定排房的房間日期 (依照所選的 訂房多筆 給予相對應的CI/CO日期) todo 暫時需討論
             */
            roomListCiCoDat: function () {
                let ls_ciDat = moment(this.groupOrderDtRowData[this.selectDtIndex].ci_dat).local().format('MM/DD');
                let ls_coDat = moment(this.groupOrderDtRowData[this.selectDtIndex].co_dat).local().format('MM/DD');
                return `${ls_ciDat} - ${ls_coDat}`;
            },
        },
        async mounted() {
            // 初始化頁面
            await this.initPageLoad();
        },
        methods: {
            /**
             * 初始化頁面要做的事情
             */
            async initPageLoad() {
                // 撈 [搜尋條件] 規格
                let lo_searchFields = await this.fetchSearchFields();
                if (lo_searchFields.success) {
                    this.searchFields = lo_searchFields.searchFieldsData;
                } else {
                    alert(lo_searchFields.errorMsg);
                    return;
                }

                // 撈 [滾房租日期]
                let lo_rentCalDat = await this.fetchRentCalDat();
                if (lo_rentCalDat.success) {
                    // 會有警告
                    // this.rentCalDat = moment(lo_rentCalDat.rent_cal_dat).format('YYYY/MM/DD');
                    this.rentCalDat = moment(lo_rentCalDat.rent_cal_dat, 'YYYY/MM/DD').format('YYYY/MM/DD')
                    this.searchCond.ci_dat = this.rentCalDat;
                } else {
                    alert(lo_rentCalDat.errorMsg);
                    return;
                }

                // 產生 [訂房多筆] [訂房明細] [排房房間] DataGrid 欄位
                let lb_success = await this.bindField();
                if (!lb_success) {
                    alert('欄位資料有誤');
                    return;
                }

                // 樓層資料 (固定的資料，只在初始化頁面時候撈取)
                let lo_roomFloor = await this.getRoomFloor();
                this.roomFloor = lo_roomFloor.effectValues;
                this.chooseRoomFloor(-1);

                // todo 樓層顏色說明 (固定的資料，只在初始化頁面時候撈取)
                let la_roomColor = await this.fetchRoomColor();
                _.each(la_roomColor.effectValues, (lo_roomColor) =>{
                    lo_roomColor.display = '';
                    switch (lo_roomColor.state_cod) {
                        case 'NA':
                            lo_roomColor.display = '不可排房';
                            break;
                        case 'OOO':
                            lo_roomColor.display = '修理房間';
                            break;
                        case 'CA':
                            lo_roomColor.display = '可排房間';
                            break;
                        case 'X':
                            lo_roomColor.display = '不可移動';
                            break;
                        case 'DO':
                            lo_roomColor.display = '今日預定C/O';
                            break;
                        case 'S':
                            lo_roomColor.display = '參觀';
                            break;
                    }
                });
                this.colorMessage = la_roomColor.effectValues.filter(data => data.state_cod !== 'FONT');

                // 產生 [訂房多筆] DataGrid 資料
                await this.bindGroupOrderDtRowData();
            },

            /**
             * 撈滾房租日期
             */
            async fetchRentCalDat() {
                try {
                    let lo_result = await BacUtils.doHttpPromisePostProxy('/api/qryRentCalDat', {});
                    return lo_result;
                } catch (err) {
                    throw Error(err);
                }
            },

            /**
             * 撈搜尋條件規格
             */
            async fetchSearchFields() {
                try {
                    let lo_result = await BacUtils.doHttpPromisePostProxy('/api/fetchOnlySearchFieldsData', {prg_id: gs_prgId});
                    return lo_result;
                } catch (err) {
                    throw Error(err);
                }
            },

            /**
             * 產生 [訂房多筆] [訂房明細] [排房房間] DataGrid 欄位 :todo 需要重寫
             */
            async bindField() {
                try {
                    let ln_groupOrderDtLength = this.groupOrderDtField.length;
                    let ln_OrderDtLength = this.orderDtListField.length;
                    if (ln_groupOrderDtLength === 0 || ln_OrderDtLength === 0) {
                        let lo_GroupOrderDtField = await this.fetchGroupOrderDtField();
                        let lo_OrderDtListField = await this.fetchOrderDtListField();
                        this.dgGroup.init(gs_prgId, "groupOrderDt_dg", DatagridFieldAdapter.combineFieldOption(lo_GroupOrderDtField, "groupOrderDt_dg"), lo_GroupOrderDtField, {
                            singleSelect: true,
                            pagination: false,
                            rownumbers: true,
                            pageSize: 20 //一開始只載入20筆資料
                        });
                        this.dgList.init(gs_prgId, "OrderDtList_dg", DatagridFieldAdapter.combineFieldOption(lo_OrderDtListField, "OrderDtList_dg"), lo_OrderDtListField, {
                            singleSelect: true,
                            pagination: false,
                            rownumbers: true,
                            pageSize: 20
                        });
                    }

                    let ln_roomList = await this.fetchRoomListField();
                    if (ln_roomList.length) {
                        this.dgRoom.init(gs_prgId, "townList-table", DatagridFieldAdapter.combineFieldOption(ln_roomList, "townList-table"), ln_roomList, {
                            singleSelect: true,
                            pagination: true,
                            rownumbers: true,
                            pageSize: 20 //一開始只載入20筆資料
                        });
                        return true;
                    } else {
                        return false;
                    }
                } catch (err) {
                    throw Error(err)
                }
            },

            //region [訂房多筆]
            /**
             * 訂房多筆
             */
            // 單純撈 [訂房多筆] 欄位
            async fetchGroupOrderDtField() {
                try {
                    let searchCond = this.searchCond;

                    const lo_params = {
                        prg_id: gs_prgId,
                        page_id: 1,
                        tab_page_id: 11,
                        searchCond: searchCond
                    };

                    let lo_result = await BacUtils.doHttpPromisePostProxy("/api/fetchOnlyDataGridFieldData", lo_params);
                    if (lo_result.success) {
                        this.groupOrderDtField = lo_result.dgFieldsData;
                        return this.groupOrderDtField;
                    } else {
                        alert(lo_result.errorMsg);
                    }
                }
                catch (err) {
                    throw Error(err);
                }
            },
            // 單純撈 [訂房多筆] 資料
            async fetchGroupOrderDtRowData() {
                try {
                    let searchCond = this.searchCond;

                    const lo_params = {
                        prg_id: gs_prgId,
                        page_id: 1,
                        tab_page_id: 11,
                        searchCond: searchCond
                    };

                    let lo_result = await BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", lo_params);
                    if (lo_result.success) {
                        this.groupOrderDtRowData = lo_result.dgRowData;
                        return this.groupOrderDtRowData;
                    } else {
                        alert(lo_result.errorMsg);
                    }
                }
                catch (err) {
                    throw Error(err);
                }
            },
            // 產生 [訂房多筆] DataGrid 資料
            async bindGroupOrderDtRowData() {
                try {
                    this.isLoadingGroupOrderDt = true;
                    let ln_groupOrderDtRowData = await this.fetchGroupOrderDtRowData();
                    this.dgGroup.loadPageDgData(this.groupOrderDtRowData);
                    this.isLoadingGroupOrderDt = false;
                    // Lock 第一筆資料
                    if (ln_groupOrderDtRowData.length > 0) {
                        let ln_selectDtIndex = this.selectDtIndex === -1 ? 0 : this.selectDtIndex;

                        $("#groupOrderDt_dg").datagrid('selectRow', ln_selectDtIndex);
                        this.selectDtIndex = ln_selectDtIndex;
                    } else if (ln_groupOrderDtRowData.length === 0) {
                        this.dgList.loadPageDgData([]);
                        this.roomDtListRowData = [];
                        alert('找不到資料');
                    }
                } catch (err) {
                    throw Error(err);
                }
            },
            //endregion

            //region [訂房明細]
            /**
             * 訂房明細
             */
            // 單純撈 [訂房明細] 欄位
            async fetchOrderDtListField() {
                try {
                    const lo_params = {
                        prg_id: gs_prgId,
                        page_id: 1,
                        tab_page_id: 12,
                    };

                    let lo_result = await BacUtils.doHttpPromisePostProxy("/api/fetchOnlyDataGridFieldData", lo_params);

                    if (lo_result.success) {
                        this.orderDtListField = lo_result.dgFieldsData;
                        return this.orderDtListField;
                    }
                    else {
                        alert(lo_result.errorMsg);
                    }
                } catch (err) {
                    throw Error(err);
                }
            },
            // 單純撈 [訂房明細] 資料
            async fetchOrderDtListData() {
                //[訂房多筆]尚未選擇任何一筆資料的話 不撈取 [排房房間]資料
                if (this.selectDtIndex < 0) {
                    return;
                }

                const lo_searchCond = {
                    ikey: this.groupOrderDtRowData[this.selectDtIndex].ikey,
                    order_sta: this.groupOrderDtRowData[this.selectDtIndex].order_sta,
                    ci_dat: moment(this.groupOrderDtRowData[this.selectDtIndex].ci_dat).format('YYYY/MM/DD'),
                    co_dat: moment(this.groupOrderDtRowData[this.selectDtIndex].co_dat).format('YYYY/MM/DD'),
                    rate_cod: this.groupOrderDtRowData[this.selectDtIndex].rate_cod,
                    use_cod: this.groupOrderDtRowData[this.selectDtIndex].use_cod,
                    room_cod: this.groupOrderDtRowData[this.selectDtIndex].room_cod,
                    rent_amt: this.groupOrderDtRowData[this.selectDtIndex].rent_amt,
                    serv_amt: this.groupOrderDtRowData[this.selectDtIndex].serv_amt,
                    status: this.searchCond.status,
                };

                const lo_params = {
                    prg_id: gs_prgId,
                    page_id: 1,
                    tab_page_id: 12,
                    searchCond: lo_searchCond
                };

                let lo_result = await BacUtils.doHttpPromisePostProxy("/api/fetchDgRowData", lo_params);
                if (lo_result.success) {
                    this.orderDtListRowData = lo_result.dgRowData;
                    return this.orderDtListRowData;
                }
                else {
                    alert(lo_result.errorMsg);
                }
            },
            // 產生 [訂房明細] DataGrid 資料
            async bindOrderDtList() {
                this.isLoadingOrderDtList = true;
                let ln_OrderDtList = await this.fetchOrderDtListData();
                this.dgList.loadPageDgData(ln_OrderDtList);
                this.isLoadingOrderDtList = false;
                // Lock 第一筆資料
                if (ln_OrderDtList.len > 0) {
                    $("#OrderDtList_dg").datagrid('selectRow', 0);
                    this.selectListIndex = 0; // watch selectDtIndex
                }
            },
            //endregion

            //region [排房房間]
            /**
             * 排房房間
             */
            // 單純撈 [排房房間] 欄位
            async fetchRoomListField() {
                try {
                    const lo_params = {
                        prg_id: gs_prgId,
                        page_id: 1,
                        tab_page_id: 13,
                    };

                    let lo_result = await BacUtils.doHttpPromisePostProxy("/api/fetchOnlyDataGridFieldData", lo_params);

                    if (lo_result) {
                        this.roomDtListField = lo_result.dgFieldsData;
                        return this.roomDtListField;
                    } else {
                        alert(lo_result.errorMsg);
                    }
                } catch (err) {
                    throw Error(err);
                }
            },
            // 單純撈 [排房房間] 資料 todo 圖形
            async fetchRoomData() {
                try {
                    // [訂房多筆]尚未選擇任何一筆資料的話 ，撈取[排房房間]資料
                    if (this.selectDtIndex < 0) {
                        return;
                    }

                    // 組資料格式，樓層: 1樓、3樓、5樓、7樓	 => '1','3','5','7'
                    // 打API給後端時資料是長 "'1','3','5','7'"
                    let ls_roomFloor = this.selectRoomFloor.map(data => {
                        if (data === '') {
                            return "";
                        }
                        return "'" + data + "'";
                    });
                    ls_roomFloor = ls_roomFloor.join(',');

                    // 組資料格式，房間種類
                    let ls_roomType;
                    if (this.selectRoomType === 'ALL') {
                        ls_roomType = "";
                    } else {
                        ls_roomType = "'" + this.selectRoomType + "'";
                    }

                    const lo_params = {
                        rule_func_name: 'fetchRoomData',
                        order_dt: _.extend(this.groupOrderDtRowData[this.selectDtIndex], {
                            floor_nos: ls_roomFloor,
                            room_cod: ls_roomType,
                            can_assign: this.chkAssign ? 'Y' : 'N'
                        }),
                    };

                    // SP 執行程序 *查詢開始日期不可小於滾房租日期
                    let lo_roomList = await BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', lo_params);

                    if (lo_roomList.success) {
                        lo_roomList.effectValues.roomList.forEach(data => {
                            if (data.ci_dat !== null && data.co_dat !== null) {
                                data.ci_dat = moment(this.groupOrderDtRowData[this.selectDtIndex].ci_dat).local().format('MM/DD');
                                data.co_dat = moment(this.groupOrderDtRowData[this.selectDtIndex].co_dat).local().format('MM/DD');
                            }
                        });

                        console.log(lo_roomList);
                        return lo_roomList;
                    } else {
                        alert(errorMsg);
                    }
                } catch (err) {
                    throw Error(err);
                }
            },

            async bindRoomList() {
                let lo_roomList = await this.fetchRoomData();
                if (lo_roomList !== undefined) {
                    this.roomDtListRowData = lo_roomList.effectValues.roomList;
                    let lo_roomDtListRowData = [];
                    if (this.selectRoomType !== 'ALL') {
                        lo_roomDtListRowData = this.roomDtListRowData.filter(lo_data => lo_data.room_cod === this.selectRoomType);
                    }

                    this.dgRoom.loadPageDgData(lo_roomDtListRowData);
                }
            },
            //endregion

            //region [房間類型]
            /**
             * 撈房間類型
             * @param ci_dat {String} 查詢開始日期 format格式
             */
            async getAllRoomType(ci_dat) {
                try {
                    const lo_params = {
                        rule_func_name: 'getRoomType',
                        ci_dat: ci_dat
                    };
                    let lo_result = await BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', lo_params);
                    return lo_result;
                } catch (err) {
                    console.log(err);
                    throw Error(err);
                }
            },

            /**
             * 選擇房間類型
             * @param room_cod {String} 使用房型
             */
            async chooseRoomType(room_cod) {
                this.selectRoomType = room_cod;
                this.selectRoomData = this.filterRoomList[0]; // todo 注意忘了當初為什麼要這樣寫

                await this.bindRoomList();
            },
            //endregion

            //region [飯店樓層]
            /**
             * 顯示樓層的選項
             */
            async getRoomFloor(room_floor) {
                const lo_params = {
                    rule_func_name: 'getRoomMnQryFloorNos',
                };
                try {
                    let lo_result = await BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', lo_params);
                    return lo_result;
                } catch (err) {
                    throw Error(err);
                }
            },

            /**
             * 選擇樓層選項
             */
            chooseRoomFloor(room_floor) {
                if (room_floor === -1) {
                    this.selectRoomFloor.length = 0;
                    this.selectRoomFloor.push('');
                } else {
                    //
                    let isAll = _.indexOf(this.selectRoomFloor, '');
                    if (isAll > -1) {
                        this.selectRoomFloor.splice(isAll, 1);
                    }

                    let isExtend = _.indexOf(this.selectRoomFloor, room_floor);
                    if (isExtend === -1) {
                        this.selectRoomFloor.push(room_floor);
                    } else {
                        this.selectRoomFloor.splice(isExtend, 1);
                    }
                }
                this.bindRoomList();
            },

            /**
             * 將當前有選擇的樓層選項打勾
             */
            isChkRoomFloor: function (value) {
                if (this.selectRoomFloor.indexOf('') > -1 && value === -1) {
                    return true;
                } else if (this.selectRoomFloor.indexOf(value) > -1) {
                    return true
                } else {
                    return false;
                }
            },
            //endregion

            /**
             * 飯店顏色說明
             */
            async fetchRoomColor() {
                try {
                    const lo_params = {
                        rule_func_name: 'getRoomColor',
                    };

                    let lo_result = await BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', lo_params);
                    return lo_result;
                } catch (err) {
                    throw Error(err);
                }
            },

            // 選擇的排房房間
            chooseRoomDt(roomDt) {
                this.selectRoomData = roomDt;
            },

            // 組合條件 (排房、取消排房)
            combinationData: function () {
                // let lo_combinationData = _.extend(this.orderDtListRowData[this.selectListIndex], {
                //     'ci_dat': this.groupOrderDtRowData[this.selectDtIndex].ci_dat,
                //     'co_dat': this.groupOrderDtRowData[this.selectDtIndex].co_dat,
                //     'ikey': this.groupOrderDtRowData[this.selectDtIndex].ikey,
                //     // "ikey_seq_nos": this.orderDtListRowData[this.selectListIndex].ikey_seq_nos,
                //     'select_room_nos': this.selectRoomData.room_nos, //組合
                //     'begin_dat': moment(this.groupOrderDtRowData[this.selectDtIndex].ci_dat).format('YYYY/MM/DD'),
                //     'end_dat': moment(this.groupOrderDtRowData[this.selectDtIndex].co_dat).format('YYYY/MM/DD'),
                //     'order_sta': this.groupOrderDtRowData[this.selectDtIndex].order_sta,
                //     'rate_cod': this.groupOrderDtRowData[this.selectDtIndex].rate_cod,
                //     'use_cod': this.groupOrderDtRowData[this.selectDtIndex].use_cod,
                //     'rent_amt': this.groupOrderDtRowData[this.selectDtIndex].rent_amt,
                //     'serv_amt': this.groupOrderDtRowData[this.selectDtIndex].serv_amt
                // });

                let lo_combinationData = _.extend(this.orderDtListRowData[this.selectListIndex], this.groupOrderDtRowData[this.selectDtIndex]);
                lo_combinationData = _.extend(lo_combinationData, {
                    'select_room_nos': this.selectRoomData.room_nos || '', //選擇的排房房號
                    'select_room_cod': this.selectRoomData.room_cod || this.selectRoomType, //選擇的排房房型
                    'select_batch_room_cod': this.selectRoomType,
                    'begin_dat': moment(this.groupOrderDtRowData[this.selectDtIndex].ci_dat).format('YYYY/MM/DD'),
                    'end_dat': moment(this.groupOrderDtRowData[this.selectDtIndex].co_dat).format('YYYY/MM/DD'),
                });
                return lo_combinationData;
            },

            //region按鈕功能
            // 排房 :todo 顯示未來用清單
            async doAssign() {
                try {
                    let lo_currentListRowData = this.orderDtListRowData[this.selectListIndex];
                    let lo_combinationData = this.combinationData();
                    let lb_confrim = true;

                    //region ### 驗證 ###
                    if (Object.keys(this.selectRoomData).length === 0) {
                        alert('請選擇一筆房間');
                        return;
                    }

                    if (lo_currentListRowData.assign_sta === 'Y' || lo_currentListRowData.assign_sta === 'I') {
                        alert('不能排房');
                        return;
                    }

                    // 檢查房號可否排房
                    const lo_checkRommNosParams = {
                        rule_func_name: 'checkRoomNos',
                        order_dt: lo_combinationData,
                    };
                    let lo_checkRommNos = await BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', lo_checkRommNosParams);
                    // todo 顯示未來用清單
                    if (lo_checkRommNos.effectValues[0]['count(*)'] > 0) {
                        alert('此房號已經被使用。');
                        return;
                    }

                    if (lo_currentListRowData.room_cod !== this.selectRoomData.room_cod) {
                        lb_confrim = confirm(`訂房使用房型與排房房號房型${this.selectRoomData.room_cod}不同是否確定執行排房?`);
                    }
                    //endregion

                    if (lb_confrim) {
                        const lo_apiParams = {
                            rule_func_name: 'doAssign',
                            order_dt: lo_combinationData,
                        };

                        let lo_result = await BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', lo_apiParams);
                        // todo 詢問後端能否不要回字串訊息?
                        if (lo_result === "成功") {
                            this.reloadBindData();
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
            },

            // 批次排房
            async doAssignAll() {
                try {
                    let lo_groupOrderDtRowData = this.groupOrderDtRowData[this.selectDtIndex];
                    let lb_confrim = true;

                    //region ### 驗證 ###
                    if (lo_groupOrderDtRowData.assign_qnt + lo_groupOrderDtRowData.ci_qnt > 0) {
                        alert('指定訂房資料皆已排房或已入住');
                        return;
                    }

                    if (this.selectRoomType === 'ALL') {
                        alert('請先指定房型後再執行批次排房');
                        return;
                    }

                    if (lo_groupOrderDtRowData.room_cod !== this.selectRoomType) {
                        lb_confrim = confirm(`訂房使用房型與排房房號房型${this.selectRoomType}不同，是否確定執行批次排房?`);
                    }
                    //endregion

                    if (lb_confrim) {
                        let lo_combinationData = this.combinationData();

                        const lo_apiParams = {
                            rule_func_name: 'quyBatchAssignDt',
                            order_dt: lo_combinationData,
                        };
                        // 批次排房預計排房明細資料
                        let lo_result = await BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', lo_apiParams);
                        if (lo_result.effectValues.length > 0) {
                            let la_canAssignRoomNos = [];
                            for (let lo_RoomData of this.filterRoomList) {
                                if (la_canAssignRoomNos.length < lo_result.effectValues.length) {
                                    _.extend(lo_combinationData, {
                                        'select_room_nos': lo_RoomData.room_nos,
                                    });
                                    const lo_checkRommNosParams = {
                                        rule_func_name: 'checkRoomNos',
                                        order_dt: lo_combinationData,
                                    };
                                    let lo_checkRommNos = await BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', lo_checkRommNosParams);
                                    if (lo_checkRommNos.effectValues[0]['count(*)'] === 0) {
                                        la_canAssignRoomNos.push(lo_RoomData)
                                    }
                                }
                            }

                            lo_result.effectValues.forEach((lo_value, idx) => {
                                if (la_canAssignRoomNos[idx] !== undefined) {
                                    lo_value.room_nos = la_canAssignRoomNos[idx].room_nos;
                                    lo_value.choose = 'Y';
                                }
                            });
                            this.batchAssignDataList = lo_result.effectValues;

                            let la_chkAssignDataList = lo_result.effectValues.filter(lo_data => lo_data.choose === 'Y');
                            this.chkAssignDataList = la_chkAssignDataList;

                            $("#batchAssignListDialog").removeClass('hide').dialog({
                                modal: true,
                                title: `[訂房卡號：${lo_groupOrderDtRowData.ikey}  使用房型:${lo_groupOrderDtRowData.room_cod}]`,
                                title_html: true,
                                width: 700,
                                maxwidth: 1920,
                                dialogClass: "test",
                                resizable: true
                            });
                        }
                    }
                } catch (err) {
                    console.log(err);
                }
            },

            // 批次排房 確認按鈕
            async doAssignAllSure() {
                let lo_combinationData = this.combinationData();
                lo_combinationData = _.extend(lo_combinationData, {
                    assignDataList: this.chkAssignDataList
                });
                console.log(lo_combinationData)

                const lo_apiParams = {
                    rule_func_name: 'doBatchAssign',
                    order_dt: lo_combinationData,
                };

                let lo_result = await BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', lo_apiParams);
                if (lo_result === '成功') {
                    this.reloadBindData();
                }
            },

            // 取消排房
            async doUnassign() {
                try {
                    let lo_currentListRowData = this.orderDtListRowData[this.selectListIndex];
                    if (lo_currentListRowData.assign_sta === 'N') {
                        alert('不能取消');
                        return;
                    }
                    if (lo_currentListRowData.asi_lock === 'Y') {
                        alert('已設定鎖定排房，不可執行取消排房');
                        return;
                    }

                    let lo_combinationData = this.combinationData();

                    const lo_apiParams = {
                        rule_func_name: 'doUnassign',
                        order_dt: lo_combinationData,
                    };
                    let lo_result = await BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', lo_apiParams);

                    // todo 詢問後端能否不要回字串訊息?
                    if (lo_result === "成功") {
                        this.reloadBindData();
                    }
                } catch (err) {
                    console.log(err);
                }
            },

            // 批次取消 todo 待整理程式碼
            async doUnassignAll() {
                // 批次取消預計取消排房明細資料
                let lo_currentRowData = this.groupOrderDtRowData[this.selectDtIndex];
                const lo_params_ExpectedCancelData = {
                    rule_func_name: 'quyCancelRoomList',
                    ikey: lo_currentRowData.ikey,
                    assign_sta: lo_currentRowData.assign_sta,
                    order_sta: lo_currentRowData.order_sta,
                    ci_dat: lo_currentRowData.ci_dat,
                    co_dat: lo_currentRowData.co_dat,
                    rate_cod: lo_currentRowData.rate_cod,
                    use_cod: lo_currentRowData.use_cod,
                    room_cod: lo_currentRowData.room_cod,
                    rent_amt: lo_currentRowData.rent_amt,
                    serv_amt: lo_currentRowData.serv_amt,
                };
                let lo_expectedCancelData = await BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', lo_params_ExpectedCancelData);
                if (lo_expectedCancelData.effectValues.length === 0) {
                    alert('無任何排房資料');
                    return;
                }

                let lb_isAsiLock = lo_expectedCancelData.effectValues.some(function (item) {
                    return item.asi_lock === 'Y'
                });

                if (lb_isAsiLock) {
                    let lo_cloneExpectedCancle = JSON.parse(JSON.stringify(lo_expectedCancelData));
                    lo_cloneExpectedCancle.effectValues.forEach(data => {
                        if (data.asi_lock === 'Y') {
                            data.asi_lock = '已設定鎖定排房，不可執行取消排房。';
                        } else {
                            data.asi_lock = '';
                        }
                    });
                    this.cancelFaildData = lo_cloneExpectedCancle;

                    $("#batchCancelList").removeClass('hide').dialog({
                        modal: true,
                        title: "批次取消失敗清單",
                        title_html: true,
                        width: 700,
                        maxwidth: 1920,
                        dialogClass: "test",
                        resizable: true
                    });
                } else {
                    let la_ikeySeqNosList = lo_expectedCancelData.effectValues.map(x => x.ikey_seq_nos);

                    let lo_combinationData = this.combinationData();
                    lo_combinationData = _.extend(lo_combinationData, {
                        ikey_seq_nos_List: la_ikeySeqNosList
                    });

                    const lo_apiParams = {
                        rule_func_name: 'doBatchUnassign',
                        order_dt: lo_combinationData,
                    };
                    let lo_result = await BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', lo_apiParams);
                    // todo 詢問後端能否不要回字串訊息?
                    if (lo_result === "成功") {
                        this.reloadBindData();
                    }
                }
            },

            // 鎖定排房
            async lockRoom() {
                try {
                    let self = this;
                    let lo_order_dt = this.combinationData();
                    let ls_keyWord = lo_order_dt.asi_lock === 'N' ? '鎖定' : '解除';
                    if (this.orderDtListRowData[this.selectListIndex].room_nos === undefined || this.orderDtListRowData[this.selectListIndex].room_nos === null) {
                        alert('請先設定排房');
                        return;
                    }


                    let lb_isLockAssign = confirm(`是否${ls_keyWord}排房`);
                    if (lb_isLockAssign) {
                        const lo_apiParams = {
                            rule_func_name: 'doAsiLock',
                            order_dt: lo_order_dt,
                        };
                        let lo_result = await BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', lo_apiParams);
                        // 重新render資料 :todo 詢問後端能否不要回字串訊息?
                        if (lo_result === '成功') {
                            self.reloadBindData();
                        }
                    }
                    //
                    // $.messager.confirm({
                    //     title: '鎖定訂房',
                    //     msg: `是否${ls_keyWord}排房`,
                    //     fn: async function (result) {
                    //         if (result) {
                    //             const lo_apiParams = {
                    //                 rule_func_name: 'doAsiLock',
                    //                 order_dt: lo_order_dt,
                    //             };
                    //             let lo_result = await BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', lo_apiParams);
                    //             // 重新render資料 :todo 詢問後端能否不要回字串訊息?
                    //             if (lo_result === '成功') {
                    //                 self.reloadBindData();
                    //             }
                    //         }
                    //     }
                    // });
                } catch (err) {
                    console.log(err);
                }
            },

            // 訂房卡
            checkRawCode() {
            },

            // 切換模式 (圖形/清單) :todo 切換有更好的方法嗎?
            changeRoomDataType() {
                this.bindField();
                this.bindRoomList();
                this.btnList = !this.btnList;
            },

            // 取消清單失敗離開按鈕
            doCloseCancelAssign: function () {
                $('#batchCancelList').dialog('close');
            },
            //endregion

            // 重讀畫面
            reloadBindData() {
                this.bindGroupOrderDtRowData();
                this.bindOrderDtList();
                this.bindRoomList();
            },

            /**
             * RowLock
             */
            doRowLock: async function () {
                let lo_param = {
                    prg_id: gs_prgId,
                    table_name: 'order_mn',
                    lock_type: "R",
                    key_cod: this.groupOrderDtRowData[this.selectDtIndex].ikey
                };
                g_socket.emit('handleTableLock', lo_param);
            },

            /**
             * RowUnLock
             */
            doRowUnLock: async function () {
                let lo_param = {
                    prg_id: gs_prgId
                };
                g_socket.emit('handleTableUnlock', lo_param);
            },
        },
    }


</script>