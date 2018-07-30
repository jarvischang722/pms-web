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
                            :fetch-data="queryGroupOrderDtRowData"
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

                                <div id="roomDetail-table-first" class="roomDetail-table2 easyui-panel dataGrid-s1">
                                    <table id="groupOrderDt_dg" style="height: 250px;"></table>
                                </div>
                                <div class="clearfix"></div>
                                <br>
                                <div class="space-12"></div>
                                <!--定房明細-->
                                <div class="jqGridEdit-table roomDetail-table2 cardDetail_margin easyui-panel dataGrid-s1">
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
                                            <li v-for="(textDetail,idx) in ColorList">
                                                <div class="square-color pull-left"
                                                     :class="'roomAsg-status-'+(idx+1)"></div>
                                                <div class="pull-left">{{textDetail}}</div>
                                                <div class="clearfix"></div>
                                            </li>
                                        </ul>
                                </span>
                                                    </div>
                                                    <div class="searchCheckbox pull-left">
                                    <span class="checkbox">
                                          <label class="checkbox-width">
                                              <input name="form-field-checkbox"
                                                     type="checkbox" checked
                                                     class="ace">
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
                                                        <ul class="dropdown-menu dropdown-info dropdown-menu-right dpUIList">
                                                            <li v-for="(room, idx) in roomFloor"
                                                                @click="chooseRoomFloor(room.value)"
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
                                                    <td class="css_td" :class="{active:room.room_cod === selectRoomType }"> {{room.room_cod}}</td>
                                                </tr>
                                                </tbody>
                                            </table>
                                        </div>
                                        <!--/房型過濾條件-->
                                        <div class="tab-content roomAssign-p" style="overflow: hidden;">
                                            <div id="All" class="tab-pane in active"
                                                 style="position: relative;">
                                                <div class="town-table" v-show="!btnList">
                                                    <div class="townRow easyui-panel">
                                                        <!--高度: townPage 的高度-->
                                                        <table id="townList-table" style="height: 500px;"></table>
                                                    </div>
                                                </div>
                                                <div class="town-grap scrollable" v-show="btnList">
                                                    <div class="townPage">
                                                        <!--<div class="townBlock roomAss_detail"-->
                                                        <div class="townBlock"
                                                             v-for="(roomDt, index) in roomDtListRowData"
                                                             @click="chooseRoomDt(roomDt)"
                                                        >
                                                            <div class="head">
                                                                <span class="left txt-lg">{{roomDt.room_nos}}</span>
                                                                <span class="right">{{roomDt.room_cod}}</span>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                            <div class="content">
                                                                <span>{{roomDt.alt_namALT_NAM}}</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>{{roomDt.CI_DAT}}-{{roomDt.CO_DAT}}</span>
                                                            </div>
                                                            <div class="content">
                                                                <span>{{roomDt.BED_STA}}</span>
                                                            </div>
                                                            <div class="clearfix"></div>

                                                            <div class="foot">
                                                                <img src="/images/intCounter/clean.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/wrench.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/assign.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/do-not-disturb.png"
                                                                     class="float-left foCnt_icon"/>
                                                                <img src="/images/intCounter/bed.png"
                                                                     class="float-left foCnt_icon"/>
                                                            </div>
                                                            <div class="clearfix"></div>
                                                        </div>
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
                                        <button class="btn btn-primary btn-white btn-defaultWidth foCnt_autoAssignSGL"
                                                :disabled="!lockStatus" @click="doAssignAll()"
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
                                        <button class="btn btn-danger btn-white btn-defaultWidth foCnt_batch_cal"
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
                                        <button class="btn  btn-primary btn-white btn-defaultWidth focnt_lockRoom"
                                                :disabled="!lockStatus" @click="lockRoom()"
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
        <input type="button" @click="fetchOrderDtListField">
        <input type="button" @click="fetchOrderDtListData">
    </div>
</template>

<script>
    const gs_prgId = "PMS0210030";
    import _ from "underscore";

    var vmHub = new Vue();
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
        created() {
            vmHub.$on("setGroupOrderDt", (data) => {
                this.selectDtIndex = data.index;
            });
            vmHub.$on('setOrderDt', (data) => {
                this.selectListIndex = data.index;
            });
            vmHub.$on('setRoomDt', (data) => {
                this.selectRoomDtIndex = data.index;
            });

            // rowLock
            let self = this;
            g_socket.on('checkTableLock', function (result) {
                if (!result.success) {
                    self.lockStatus = false;
                    alert(result.errorMsg);

                } else {
                    self.lockStatus = true;
                    alert(result.success);
                }
            });
        },
        async mounted() {
            // 初始化頁面
            await this.initPageLoad();
        },
        watch: {
            async selectDtIndex(newV, oldV) {
                console.log('訂房多筆', newV, oldV);
                await this.queryOrderDtList();

                $("#OrderDtList_dg").datagrid('selectRow', 0);
                this.selectListIndex = 0; //watch selectListIndex
                this.selectRoomType = this.groupOrderDtRowData[this.selectDtIndex].use_cod;
                let lsCiDat = moment(this.groupOrderDtRowData[this.selectDtIndex].ci_dat).format('YYYY/MM/DD');

                // 房型種類
                let lo_roomType = await this.getAllRoomType(lsCiDat);
                this.roomType = lo_roomType.effectValues;

                // 清單
                await this.getRoomColumns();
                await this.getRoomData();
                this.showRoomList();
                // this.fetchRoomList();
            },
            async selectListIndex(newVal, oldVal) {
                console.log('訂房明細', newVal, oldVal);
            },
        },
        data() {
            return {
                searchFields: [],
                searchCond: {},

                //滾房租日
                rentCalDat: '',
                //訂房多筆
                groupOrderDtField: [],
                groupOrderDtRowData: [],
                selectDtIndex: -1,

                //訂房明細
                orderDtListField: [],
                orderDtListRowData: [],
                selectListIndex: -1,

                //排房房間
                roomDtListField: [],
                roomDtListRowData: [
                    {
                        room_nos: '0301',
                        room_cod: 'DDT',
                        room_sta: 'V',
                        clean_sta: 'C',
                        oos_sta: 'Y',
                        assign_sta: 'N',
                        ALT_NAM: '陳先生',
                        BED_STA: 'S',
                        CI_DAT: '2018/04/29',
                        CO_DAT: '2018/04/30',
                        ROOM_RMK: '~~~'
                    },
                    {
                        room_nos: '0301',
                        room_cod: 'DDT',
                        room_sta: 'V',
                        clean_sta: 'C',
                        oos_sta: 'Y',
                        assign_sta: 'N',
                        ALT_NAM: '陳先生',
                        BED_STA: 'S',
                        CI_DAT: '2018/04/29',
                        CO_DAT: '2018/04/30',
                        ROOM_RMK: '~~~'
                    },
                    {
                        room_nos: '0301',
                        room_cod: 'DDT',
                        room_sta: 'V',
                        clean_sta: 'C',
                        oos_sta: 'Y',
                        assign_sta: 'N',
                        ALT_NAM: '陳先生',
                        BED_STA: 'S',
                        CI_DAT: '2018/04/29',
                        CO_DAT: '2018/04/30',
                        ROOM_RMK: '~~~'
                    }],
                selectRoomDtIndex: -1,

                //顯示清單或是圖形模式 true:清單 false:圖形
                btnList: false,
                condition: {
                    floor: [],
                    roomStatus: '',
                    roomType: []
                },
                //條件選項存放區
                roomType: [],
                roomFloor: [],
                selectRoomType: '',
                selectRoomFloor: [],
                ColorList: ['不可排房', '修理房間', '可排房間', '不可移動', '今日預定C/O', '參觀'],
                // isLite:true, 要討論未來如何判斷使用版本(lite)
                //
                lockStatus: false,//lock有做的話(true)可以按按鈕
                dgGroup: {},
                dgDetail: {},
                dgRoom: {},
            };
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
                    //this.rentCalDat = moment(lo_rentCalDat.rent_cal_dat).format('YYYY/MM/DD');
                    this.rentCalDat = '2018/06/29'; // todo 目前寫死，之後要改
                    this.searchCond.ci_dat = this.rentCalDat;
                    this.searchCond.co_dat = moment(this.rentCalDat).add(1, 'days').format('YYYY/MM/DD');
                } else {
                    alert(lo_rentCalDat.errorMsg);
                    return;
                }


                // todo 產生欄位 (之後包起來)
                await this.fetchGroupOrderDtField();
                await this.fetchOrderDtListField();

                // 產生 [訂房多筆] 資料，並且用 DataGrid繫結
                await this.queryGroupOrderDtRowData();

                // 樓層資料 (固定的資料，只在初始化頁面時候撈取)
                let lo_roomFloor = await this.getRoomFloor();
                this.roomFloor = lo_roomFloor.effectValues;

                // todo 樓層顏色說明 (固定的資料，只在初始化頁面時候撈取) ***目前撈沒資料
                this.getRoomColor();
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
             * 訂房多筆
             */
            // 處理 [訂房多筆]
            async queryGroupOrderDtRowData() {
                try {
                    let ln_groupOrderDtRowDataLength = await this.fetchGroupOrderDtRowData();
                    this.showAllOrderDts();

                    // Lock 第一筆資料
                    if (ln_groupOrderDtRowDataLength > 0) {
                        $("#groupOrderDt_dg").datagrid('selectRow', 0);
                        this.selectDtIndex = 0; // watch selectDtIndex
                        this.doRowLock();
                    }
                } catch (err) {
                    throw Error(err);
                }
            },
            // subFunction 單純撈 [訂房多筆] 欄位
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
                    } else {
                        alert(lo_result.errorMsg);
                    }
                }
                catch (err) {
                    throw Error(err);
                }
            },
            // subFunction 單純撈 [訂房多筆] 資料
            async fetchGroupOrderDtRowData() {
                try {
                    console.log(this.searchCond);
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
                        return this.groupOrderDtRowData.length;
                    } else {
                        alert(lo_result.errorMsg);
                    }
                }
                catch (err) {
                    throw Error(err);
                }
            },
            // subFunction 顯示 [訂房多筆] 欄位 + 資料
            showAllOrderDts() {
                this.dgGroup = new DatagridGroupClass();
                this.dgGroup.init(gs_prgId, "groupOrderDt_dg", DatagridFieldAdapter.combineFieldOption(this.groupOrderDtField, "groupOrderDt_dg"), this.groupOrderDtField, {
                    singleSelect: true,
                    pagination: false,
                    rownumbers: true,
                    pageSize: 20 //一開始只載入20筆資料
                });
                this.dgGroup.loadPageDgData(this.groupOrderDtRowData);
            },

            /**
             * 訂房明細
             */
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
                    }
                    else {
                        alert(lo_result.errorMsg);
                    }
                } catch (err) {
                    throw Error(err);
                }
            },
            async fetchOrderDtListData() {
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
                    return this.orderDtListRowData.length;
                }
                else {
                    alert(lo_result.errorMsg);
                }
            },
            showOrderDtList() {
                this.dgList = new DatagridOrderListClass();
                this.dgList.init(gs_prgId, "OrderDtList_dg", DatagridFieldAdapter.combineFieldOption(this.orderDtListField, "OrderDtList_dg"), this.orderDtListField, {
                    singleSelect: true,
                    pagination: false,
                    rownumbers: true,
                    pageSize: 20
                });
                this.dgList.loadPageDgData(this.orderDtListRowData);
            },
            async queryOrderDtList() {
                let ln_OrderDtListLength = await this.fetchOrderDtListData();
                this.showOrderDtList();
            },

            /**
             * 排房房間 搜尋條件
             */
            getSearchCondition() {

            },

            /**
             * 排房房間 欄位標題
             */
            async getRoomColumns() {
                try {
                    const lo_searchCond = this.getSearchCondition();
                    const lo_params = {
                        prg_id: gs_prgId,
                        page_id: 1,
                        tab_page_id: 13,
                        searchCond: lo_searchCond
                    };

                    let lo_result = await BacUtils.doHttpPromisePostProxy("/api/fetchOnlyDataGridFieldData", lo_params);
                    if (lo_result) {
                        this.roomDtListField = lo_result.dgFieldsData;
                    } else {
                        alert(lo_result.errorMsg);
                    }
                } catch (err) {
                    throw Error(err);
                }
            },

            /**
             * 排房房間 資料
             */
            async getRoomData() {
                try {
                    const lo_params = {
                        rule_func_name: 'fetchRoomData',

                        ci_dat: this.searchCond.ci_dat,
                        co_dat: this.searchCond.co_dat,
                        room_cod: this.selectRoomType,
                        character_rmk: "",
                        build_nos: "",
                        floor_nos: this.selectRoomFloor,
                        bed_sta: "",
                        can_assign: "N"
                    };

                    let lo_result = await BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', lo_params);
                    return lo_result;
                } catch (err) {
                    throw Error(err);
                }
            },

            /**
             * 顯示排房
             */
            showRoomList() {
                this.dgRoom = new DatagridRoomListClass();
                this.dgRoom.init(gs_prgId, "townList-table", DatagridFieldAdapter.combineFieldOption(this.roomDtListField, "townList-table"), this.roomDtListField, {
                    singleSelect: true,
                    pagination: false,
                    rownumbers: true,
                    pageSize: 20 //一開始只載入20筆資料
                });

                // this.dgRoom.loadPageDgData(this.roomDtListRowData);
            },

            /**
             * 顯示
             */
            async fetchRoomList() {
                // await this.getRoomColumns();
                // this.getRoomData();
                // this.showRoomList();
            },

            /**
             * 撈房間類型
             * @param ci_dat {String} 查詢開始日期 format格式
             */
            async getAllRoomType(ci_dat) {
                const lo_params = {
                    rule_func_name: 'getRoomType',
                    ci_dat: ci_dat
                };
                try {
                    let lo_result = await BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', lo_params);
                    return lo_result;
                } catch (err) {
                    throw Error(err);
                }
            },

            /**
             * 選擇房間類型
             * @param room_cod {String} 使用房型
             */
            chooseRoomType(room_cod) {
                this.selectRoomType = room_cod;

                //todo 重撈資料庫資料
            },

            /**
             * 樓層選項
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
                    let isExtend = _.indexOf(this.selectRoomType, room_floor);
                    if (isExtend === -1) {
                        this.selectRoomFloor.push(room_floor);
                    } else {
                        this.selectRoomFloor.splice(isExtend, 1);
                    }
                }
            },

            /**
             * 飯店顏色說明
             */
            async getRoomColor() {
                const lo_params = {
                    rule_func_name: 'getRoomColor',
                };
                try {
                    let lo_result = await BacUtils.doHttpPromisePostProxy('/api/queryDataByRule', lo_params);
                    return lo_result;
                } catch (err) {
                    throw Error(err);
                }
            },

            chooseRoomDt(roomDt) {
                console.log(roomDt)
            },

            doAssign() {
            },
            doAssignAll() {
            },
            doUnassign() {
            },
            doUnassignAll() {
            },
            lockRoom() {
            },
            checkRawCode() {
            },
            // 切換模式 (圖形/清單)
            changeRoomDataType() {
                this.btnList = !this.btnList;
            },
            /**
             * RowLock
             */
            doRowLock: function () {
                var lo_param = {
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
            doRowUnLock: function () {
                var lo_param = {
                    prg_id: gs_prgId
                };
                g_socket.emit('handleTableUnlock', lo_param);
            },
        }
    }


</script>