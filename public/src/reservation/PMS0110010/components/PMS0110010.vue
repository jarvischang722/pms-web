<template>
    <div class="pageMain" v-loading="isLoading" element-loading-text="Loading...">
        <div class="col-xs-12">
            <div class="col-sm-11 col-xs-11">
                <div class="row no-margin-right">
                    <!--  依房型訂房 -->
                    <div class="container_12 divider">
                        <!--toDO-->
                        <!--暫時設定高度-->
                        <!--window 問題：最後一個<th>會超出範圍，並且看不到-->
                        <div class="grid_12 height600 resRoomType-table fixed-table-container cus-roomType-table"
                             style="width: 99% !important;">
                            <table class="fancyTable themeTable treeControl" id="resRoomType-table" cellpadding="0" cellspacing="0">
                                <thead>
                                <tr>
                                    <th class="ca-headerTitle height-fntThead rp-first-th" rowspan="2">
                                        <!--ca-center-->
                                        <div class="caSelect">
                                            <el-date-picker
                                                    class="input-medium ca-select"
                                                    v-model="searchData4Month"
                                                    :clearable="false"
                                                    :editable="false"
                                                    format="yyyy-MM-dd"
                                                    :placeholder="i18nLang.SystemCommon.selectMonth"
                                                    @change="selectDate">
                                            </el-date-picker>
                                            <div class="space-2"></div>
                                        </div>
                                        <div class="caIcon">
                                            <span class="ca-headerIcon">
                                                <i class="fa fa-calendar-check-o orange fa-lg" data-rel="tooltip" data-placement="bottom"
                                                   :title="i18nLang.SystemCommon.rentCalDat" @click="backToRentCalDat"></i>
                                            </span>
                                        </div>
                                        <div class="clearfix"></div>
                                    </th>
                                    <!--日期-->
                                    <th class="dateColor" :style="{background: field.color}" v-for="field in dateFieldData">
                                        {{field.data}}
                                    </th>
                                </tr>
                                <tr>
                                    <!--星期-->
                                    <th v-for="field in dayFieldData" :style="{background: field.color}">
                                        {{field.data}}
                                    </th>
                                </tr>
                                </thead>
                                <tbody>

                                <template v-for="(field,fieldIdx) in roomFieldData">
                                    <template v-for="(roomTyp, roomIdx) in roomTypData[field]">
                                        <tr :data-tt-id="5*roomTyp.idx + 1">
                                            <td class="middle td-first">
                                                {{field}} <span class="roomNumTip">{{roomTyp.room_qnt}}</span></td>
                                            <template v-for="emptyRm in roomTyp.emptyRm">
                                                <td v-if="emptyRm.num === ''" class="numeric"></td>
                                                <td v-else class="numeric">
                                                    {{ emptyRm.num }}
                                                </td>
                                            </template>
                                        </tr>
                                        <tr :data-tt-id="5*roomTyp.idx + 2" :data-tt-parent-id="5*roomTyp.idx + 1" class="subTree-s">
                                            <td class="middle td-first subTree-title">
                                                {{i18nLang.program.PMS0110010.useRm}}
                                            </td>
                                            <template v-for="useRm in roomTyp.useRm">
                                                <td class="numeric" v-if="useRm.num === ''"></td>
                                                <td class="numeric" v-else>
                                                    {{ useRm.num }}
                                                </td>
                                            </template>
                                        </tr>
                                        <tr :data-tt-id="5*roomTyp.idx + 3" :data-tt-parent-id="5*roomTyp.idx + 1" class="subTree-s">
                                            <td class="middle td-first subTree-title">
                                                {{i18nLang.program.PMS0110010.notWrsRm}}
                                            </td>
                                            <template v-for="notWrsRm in roomTyp.notWrsRm">
                                                <td class="numeric" v-if="notWrsRm.num === ''"></td>
                                                <td class="numeric" v-else>
                                                    {{ notWrsRm.num }}
                                                </td>
                                            </template>
                                        </tr>
                                        <tr :data-tt-id="5*roomTyp.idx + 4" :data-tt-parent-id="5*roomTyp.idx + 1" class="subTree-s">
                                            <td class="middle td-first subTree-title">
                                                {{i18nLang.program.PMS0110010.wrsRm}}
                                            </td>
                                            <template v-for="wrsRm in roomTyp.wrsRm">
                                                <td class="numeric" v-if="wrsRm.num === ''"></td>
                                                <td class="numeric" v-else>
                                                    {{ wrsRm.num }}
                                                </td>
                                            </template>
                                        </tr>
                                        <tr :data-tt-id="5*roomTyp.idx + 5" :data-tt-parent-id="5*roomTyp.idx + 1" class="subTree-s">
                                            <td class="middle td-first subTree-title">
                                                {{i18nLang.program.PMS0110010.overBooking}}
                                            </td>
                                            <template v-for="overBooking in roomTyp.overBooking">
                                                <td class="numeric" v-if="overBooking.num === ''"></td>
                                                <td class="numeric" v-else>
                                                    {{ overBooking.num }}
                                                </td>
                                            </template>
                                        </tr>
                                    </template>
                                </template>

                                <template v-if="is4fieldAppear">
                                    <tr>
                                        <td class="middle td-first">
                                            <span class="room-field-text">
                                                {{i18nLang.program.PMS0110010.Total_available}}
                                            </span>
                                        </td>
                                        <td class="numeric" v-for="number in totalAvailable.number">
                                            {{number.num}}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="middle td-first">
                                            <span class="room-field-text">
                                                {{i18nLang.program.PMS0110010.occupancy}}
                                            </span>
                                        </td>
                                        <td class="numeric" v-for="number in occupancy.number">
                                            {{number.num}}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="middle td-first">
                                            <span class="room-field-text">{{i18nLang.program.PMS0110010.phyOccupancy}}</span>
                                        </td>
                                        <td class="numeric" v-for="number in phyOccupancy.number">
                                            {{number.num}}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td class="middle td-first">
                                            <span class="room-field-text">
                                                {{i18nLang.program.PMS0110010.phyAvailable}}
                                            </span>
                                        </td>
                                        <td class="numeric" v-for="number in phyAvailable.number">
                                            {{number.num}}
                                        </td>
                                    </tr>
                                </template>

                                </tbody>
                            </table>
                        </div>
                        <div class="clear"></div>
                    </div> <!-- table -->
                    <!--  /.End 依房型訂房 -->
                </div>
            </div>
            <div class="col-xs-1 col-sm-1">
                <div class="row">
                    <div class="right-menu-co">
                        <ul>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth width-50 pull-left"
                                        role="button" data-rel="tooltip" data-placement="bottom" :title="i18nLang.SystemCommon.before7days"
                                        @click="changDate(-7)">
                                    <i class="fa fa-angle-left fa-lg"></i>
                                </button>
                                <button class="btn btn-primary btn-white btn-defaultWidth width-50 pull-left"
                                        role="button" data-rel="tooltip" data-placement="bottom" :title="i18nLang.SystemCommon.after7days"
                                        @click="changDate(7)">
                                    <i class="fa fa-angle-right fa-lg"></i>
                                </button>
                                <div class="clearfix"></div>
                            </li>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth width-50 pull-left"
                                        role="button" data-rel="tooltip" data-placement="bottom" :title="i18nLang.SystemCommon.before14days"
                                        @click="changDate(-14)">
                                    <i class="fa fa-angle-double-left fa-lg"></i>
                                </button>
                                <button
                                        class="btn btn-primary btn-white btn-defaultWidth width-50 pull-left"
                                        role="button" data-rel="tooltip" data-placement="bottom" :title="i18nLang.SystemCommon.after14days"
                                        @click="changDate(14)">
                                    <i class="fa fa-angle-double-right fa-lg"></i>
                                </button>
                                <div class="clearfix"></div>
                            </li>
                            <li>
                                <!--@click="reservationDialog_1" -->
                                <button class="btn btn-primary btn-white btn-defaultWidth reservationDialog-1"
                                        role="button">{{i18nLang.program.PMS0110010.reservation}}
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth"
                                        role="button">{{i18nLang.SystemCommon.print}}
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-primary btn-white btn-defaultWidth saveAsBtn"
                                        role="button">{{i18nLang.SystemCommon.save_as}}
                                </button>
                            </li>
                            <!--PMS(lite) excample:"
                                加：btn-gray disabled" "
                                減:btn-white 原本的(ex.btn-primary)"
                                -->
                            <li>
                                <button class="btn btn-gray btn-defaultWidth resv_ratePlanBtn"
                                        role="button">{{i18nLang.program.PMS0110010.Rate_Plan}}
                                </button>
                            </li>
                            <li>
                                <button class="btn btn-skin btn-defaultWidth resv_amenitiesIny"
                                        role="button">{{i18nLang.program.PMS0110010.Amenities_Iny}}
                                </button>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div> <!-- /.col-sm-12 -->
        <div class="clearfix"></div>
    </div>
</template>

<script>
    import _s from 'underscore.string';

    export default {
        name: 'pms0110010',
        mounted() {
            // this.isLoading = false;
            this.fetchRentCalDat();
            this.fetchData();
        },
        updated() {
            $("table.treeControl").agikiTreeTable({
                persist: false,
                persistStoreName: "files"
            });
        },
        watch: {},
        data() {
            return {
                i18nLang: go_i18nLang,
                isLoading: true,
                //滾房租日
                rentCalDat: "",
                //搜尋日期
                searchData: {
                    year: moment(new Date()).format("YYYY/MM/DD").toString().split("/")[0],
                    month: moment(new Date()).format("YYYY/MM/DD").toString().split("/")[1],
                    date: moment(new Date()).format("YYYY/MM/DD").toString().split("/")[2]
                },
                nowSearchDate: "",
                searchData4Month: moment(new Date()).format("YYYY/MM/DD").toString(),
                //日期欄位資料
                dateFieldData: [],
                dayFieldData: [],
                //開始數與結束數
                beginNum: "",
                endNum: "",
                //房型資料
                roomFieldData: [],
                roomTypData: {},
                //以下四個為頁面上不是房型的最後四筆
                //房間總數
                totalAvailable: {},
                occupancy: {},
                phyAvailable: {},
                phyOccupancy: {},
                //控制套件參數
                isFirst: true,
                //控制4欄顯示參數
                is4fieldAppear: true,
                //各欄位顏色
                color: []
            }
        },
        methods: {
            fetchRentCalDat() {
                BacUtils.doHttpPostAgent('/api/qryRentCalDat', {}, (result) => {
                    this.rentCalDat = result.rent_cal_dat;
                });
            },
            initData() {
                this.dateFieldData = [];
                this.dayFieldData = [];
                this.roomFieldData = [];
                this.roomTypData = {};
                this.totalAvailable = {};
                this.occupancy = {};
                this.phyAvailable = {};
                this.phyOccupancy = {};
                this.beginNum = "";
                this.endNum = "";
            },
            fetchData() {
                this.isLoading = true;
                this.initData();

                this.nowSearchDate = this.searchData.year + "/" + _s.lpad(this.searchData.month, 2, '0') + "/" + _s.lpad(this.searchData.date, 2, '0');
                let lo_param = {
                    begin_dat: this.nowSearchDate
                };

                $.post('/api/qryPageOneDataByRmTyp', lo_param).then(result => {
                    if (result.success) {
                        if (!_.isEmpty(result.data)) {
                            this.is4fieldAppear = true;
                            this.beginNum = result.data.date_range.begin_dat;
                            this.endNum = result.data.date_range.end_dat;
                            this.color = result.data.date_range.color;
                            this.roomTypData = result.data.roomTypData;
                            this.totalAvailable = result.data.totalAvailable;
                            this.occupancy = result.data.occupancy;
                            this.phyAvailable = result.data.phyAvailable;
                            this.phyOccupancy = result.data.phyOccupancy;
                            this.convertData();
                        }
                        else {
                            //處理日期欄位資料
                            let ls_date = this.searchData.year + "/" + _s.lpad(this.searchData.month, 2, '0') + "/" + _s.lpad(this.searchData.date, 2, '0');

                            for (let i = 0; i <= 20; i++) {
                                let lo_date = moment(new Date(ls_date)).add('days', i);
                                this.dateFieldData.push({
                                    data: lo_date.format("YYYY/MM/DD").toString().split("/")[2],
                                    color: '#fff'
                                });
                                this.dayFieldData.push({data: lo_date.format("ddd"), color: '#fff'});
                            }

                            this.is4fieldAppear = false;
                            alert(this.i18nLang.SystemCommon.noData);
                        }

                    }
                    else {
                        //處理日期欄位資料
                        let ls_date = this.searchData.year + "/" + _s.lpad(this.searchData.month, 2, '0') + "/" + _s.rpad(this.searchData.date, 2, '0');
                        for (let i = 0; i <= 20; i++) {
                            let lo_date = moment(new Date(ls_date)).add('days', i);
                            this.dateFieldData.push({
                                data: lo_date.format("YYYY/MM/DD").toString().split("/")[2],
                                color: '#fff'
                            });
                            this.dayFieldData.push({data: lo_date.format("ddd"), color: '#fff'});
                        }

                        this.is4fieldAppear = false;
                        alert(result.errorMsg);
                    }
                    this.isLoading = false;
                });
            },
            convertData() {
                let self = this;

                this.dateFieldData = [];
                this.dayFieldData = [];

                //轉換顏色格式
                _.each(this.color, (ls_color, idx) => {
                    this.color[idx] = 'rgb(' + colorTool.colorCodToRgb(ls_color).r + ', ' + colorTool.colorCodToRgb(ls_color).g + ', ' + colorTool.colorCodToRgb(ls_color).b + ')';
                });

                //處理日期欄位資料
                let ls_date = this.searchData.year + "/" + _s.lpad(this.searchData.month, 2, '0') + "/" + _s.lpad(this.searchData.date, 2, '0');
                for (let i = this.beginNum; i <= this.endNum; i++) {
                    let lo_date = moment(new Date(ls_date)).add('days', i - this.beginNum);
                    this.dateFieldData.push({
                        data: lo_date.format("YYYY/MM/DD").toString().split("/")[2],
                        color: this.color[i - this.beginNum]
                    });
                    this.dayFieldData.push({data: lo_date.format("ddd"), color: this.color[i - this.beginNum]});
                }

                //取房型種類
                _.each(this.roomTypData, (data, key) => {
                    this.roomFieldData.push(key);
                });

                //處理個房型每日數量
                let la_dateNumData = [];
                for (let i = this.beginNum; i <= this.endNum; i++) {
                    la_dateNumData.push(i);
                }
                _.each(this.roomTypData, (data, key, idx) => {
                    _.each(this.roomTypData[key], (roomData, idx) => {
                        let ln_beginIdx = _.indexOf(la_dateNumData, roomData.begin_dat);
                        let ln_endIdx = _.indexOf(la_dateNumData, roomData.end_dat);

                        let la_emptyRm = new Array(this.endNum - this.beginNum + 1);
                        let la_notWrsRm = new Array(this.endNum - this.beginNum + 1);
                        let la_overBooking = new Array(this.endNum - this.beginNum + 1);
                        let la_useRm = new Array(this.endNum - this.beginNum + 1);
                        let la_wrsRm = new Array(this.endNum - this.beginNum + 1);

                        for (let i = self.beginNum; i <= self.endNum; i++) {
                            la_emptyRm[i - self.beginNum] = {color: self.color[i - self.beginNum], num: ''};
                            la_notWrsRm[i - self.beginNum] = {color: self.color[i - self.beginNum], num: ''};
                            la_overBooking[i - self.beginNum] = {color: self.color[i - self.beginNum], num: ''};
                            la_useRm[i - self.beginNum] = {color: self.color[i - self.beginNum], num: ''};
                            la_wrsRm[i - self.beginNum] = {color: self.color[i - self.beginNum], num: ''};
                        }

                        for (let i = ln_beginIdx; i <= ln_endIdx; i++) {
                            la_emptyRm[i].num = JSON.parse(JSON.stringify(roomData.emptyRm[i - ln_beginIdx]));
                            la_notWrsRm[i].num = JSON.parse(JSON.stringify(roomData.notWrsRm[i - ln_beginIdx]));
                            la_overBooking[i].num = JSON.parse(JSON.stringify(roomData.overBooking[i - ln_beginIdx]));
                            la_useRm[i].num = JSON.parse(JSON.stringify(roomData.useRm[i - ln_beginIdx]));
                            la_wrsRm[i].num = JSON.parse(JSON.stringify(roomData.wrsRm[i - ln_beginIdx]));
                        }

                        roomData.emptyRm = la_emptyRm;
                        roomData.notWrsRm = la_notWrsRm;
                        roomData.overBooking = la_overBooking;
                        roomData.useRm = la_useRm;
                        roomData.wrsRm = la_wrsRm;
                    });
                });

                //處理房型套件樹狀結構
                let ln_roomTypLen = 0;

                for (let i = 0; i < this.roomFieldData.length; i++) {
                    _.each(this.roomTypData[this.roomFieldData[i]], function (val, idx) {
                        self.roomTypData[self.roomFieldData[i]][idx].idx = ln_roomTypLen + idx;
                    });
                    ln_roomTypLen = ln_roomTypLen + this.roomTypData[this.roomFieldData[i]].length;
                }

                //處理下面四欄位資料(數量、顏色)
                let la_dataNumData4Field = [];

                for (let i = this.beginNum; i <= this.endNum; i++) {
                    la_dataNumData4Field.push(i);
                }

                let ln_beginIdx4Field = _.indexOf(la_dataNumData4Field, this.beginNum);
                let ln_endIdx4Field = _.indexOf(la_dataNumData4Field, this.endNum);

                let la_totalAvailable = new Array(this.endNum - this.beginNum + 1);
                let la_occupancy = new Array(this.endNum - this.beginNum + 1);
                let la_phyAvailable = new Array(this.endNum - this.beginNum + 1);
                let la_phyOccupancy = new Array(this.endNum - this.beginNum + 1);

                for (let i = this.beginNum; i <= this.endNum; i++) {
                    la_totalAvailable[i - this.beginNum] = {color: self.color[i - this.beginNum], num: ''};
                    la_occupancy[i - this.beginNum] = {color: self.color[i - this.beginNum], num: ''};
                    la_phyAvailable[i - this.beginNum] = {color: self.color[i - this.beginNum], num: ''};
                    la_phyOccupancy[i - this.beginNum] = {color: self.color[i - this.beginNum], num: ''};
                }

                for (let i = ln_beginIdx4Field; i <= ln_endIdx4Field; i++) {
                    if (i - ln_beginIdx4Field < this.totalAvailable.number.length) {
                        la_totalAvailable[i].num = JSON.parse(JSON.stringify(self.totalAvailable.number[i - ln_beginIdx4Field]));
                        la_occupancy[i].num = JSON.parse(JSON.stringify(self.occupancy.number[i - ln_beginIdx4Field]));
                        la_phyAvailable[i].num = JSON.parse(JSON.stringify(self.phyAvailable.number[i - ln_beginIdx4Field]));
                        la_phyOccupancy[i].num = JSON.parse(JSON.stringify(self.phyOccupancy.number[i - ln_beginIdx4Field]));
                    }
                }

                this.totalAvailable.number = la_totalAvailable;
                this.occupancy.number = la_occupancy;
                this.phyAvailable.number = la_phyAvailable;
                this.phyOccupancy.number = la_phyOccupancy;
            },
            backToRentCalDat() {
                let ls_searchData4Month = moment(JSON.parse(JSON.stringify(this.searchData4Month))).format("YYYY/MM/DD").toString();
                let ls_rentCalDate = moment(new Date(this.rentCalDat)).format("YYYY/MM/DD").toString();

                if (ls_searchData4Month != ls_rentCalDate) {
                    this.searchData4Month = this.rentCalDat;
                }
                else {
                    this.searchData.year = moment(new Date(this.rentCalDat)).year();
                    this.searchData.month = moment(new Date(this.rentCalDat)).month() + 1;
                    this.searchData.date = moment(new Date(this.rentCalDat)).date();
                    this.fetchData();
                }
            },
            changDate(num) {
                let ls_date = moment(new Date(this.nowSearchDate)).add('days', num).format("YYYY/MM/DD").toString();
                this.searchData4Month = moment(new Date(ls_date));
            },
            selectDate() {
                this.searchData4Month = moment(new Date(this.searchData4Month)).format("YYYY/MM/DD").toString();
                this.searchData.year = moment(new Date(this.searchData4Month)).year();
                this.searchData.month = moment(new Date(this.searchData4Month)).month() + 1;
                this.searchData.date = moment(new Date(this.searchData4Month)).date();
                this.fetchData();
            }
        }
    }
</script>