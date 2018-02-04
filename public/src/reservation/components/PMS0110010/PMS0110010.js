import _s from 'underscore.string';

var vm = new Vue({
    el: '#PMS0110010App',
    mounted() {
        this.fetchRentCalDat();
        this.fetchData();
    },
    updated() {
        if (this.isFirst) {
            $("table.treeControl").agikiTreeTable({
                persist: false,
                persistStoreName: "files"
            });

            this.isFirst = false;
        }
    },
    data: {
        //滾房租日
        rentCalDat: "",
        //搜尋選單下拉資料
        yearSelectData: [
            {display: '2016', value: '2016'},
            {display: '2017', value: '2017'},
            {display: '2018', value: '2018'},
            {display: '2019', value: '2019'},
            {display: '2020', value: '2020'},
            {display: '2021', value: '2021'}
        ],
        monthSelectData: [
            {display: 'Jan', value: '01'},
            {display: 'Feb', value: '02'},
            {display: 'Mar', value: '03'},
            {display: 'Apr', value: '04'},
            {display: 'May', value: '05'},
            {display: 'Jun', value: '06'},
            {display: 'Jul', value: '07'},
            {display: 'Aug', value: '08'},
            {display: 'Sep', value: '09'},
            {display: 'Oct', value: '10'},
            {display: 'Nov', value: '11'},
            {display: 'Dec', value: '12'}
        ],
        searchData: {
            year: '2016',
            month: '01',
            date: '20'
        },
        nowSearchDate: "",
        //日期欄位資料
        dateFieldData: [],
        dayFieldData: [],
        //開始數與結束數
        beginNum: "",
        endNum: "",
        //房型資料
        roomFieldData: [],
        roomTypData: {
            //房型不重複了
            //DSX房型
            DSX: [
                //依照房間總數分object
                {
                    room_qnt: 10,	//房間總數
                    begin_dat: 26,
                    end_dat: 30,
                    //空房數
                    emptyRm: [10, 10, 10, 10, 10], //對應天數給房間庫存
                    //用房數
                    useRm: [10, 10, 10, 10, 10], //對應天數給房間庫存
                    //鎖控剩餘數
                    wrsRm: [10, 10, 10, 10, 10],
                    //非鎖控剩餘數
                    notWrsRm: [10, 10, 10, 10, 10],
                    //庫存可超訂
                    overBooking: [10, 10, 10, 10, 10]
                },
                //依照房間總數分object
                {
                    room_qnt: 20,	//房間總數
                    begin_dat: 36,
                    end_dat: 40,
                    //空房數
                    emptyRm: [20, 20, 20, 20, 20], //對應天數給房間庫存
                    //用房數
                    useRm: [20, 20, 20, 20, 20], //對應天數給房間庫存
                    //鎖控剩餘數
                    wrsRm: [20, 20, 20, 20, 20],
                    //非鎖控剩餘數
                    notWrsRm: [20, 20, 20, 20, 20],
                    //庫存可超訂
                    overBooking: [20, 20, 20, 20, 20]
                }
            ],
            //DRK房型
            DRK: [
                //依照房間總數分object
                {
                    room_qnt: 10,	//房間總數
                    begin_dat: 20,
                    end_dat: 25,
                    //空房數
                    emptyRm: [10, 10, 10, 10, 10, 10], //對應天數給房間庫存
                    //用房數
                    useRm: [10, 10, 10, 10, 10, 10], //對應天數給房間庫存
                    //鎖控剩餘數
                    wrsRm: [10, 10, 10, 10, 10, 10],
                    //非鎖控剩餘數
                    notWrsRm: [10, 10, 10, 10, 10, 10],
                    //庫存可超訂
                    overBooking: [10, 10, 10, 10, 10, 10]
                },
                //依照房間總數分object
                {
                    room_qnt: 20,	//房間總數
                    begin_dat: 31,
                    end_dat: 35,
                    //空房數
                    emptyRm: [20, 20, 20, 20, 20], //對應天數給房間庫存
                    //用房數
                    useRm: [20, 20, 20, 20, 20], //對應天數給房間庫存
                    //鎖控剩餘數
                    wrsRm: [20, 20, 20, 20, 20],
                    //非鎖控剩餘數
                    notWrsRm: [20, 20, 20, 20, 20],
                    //庫存可超訂
                    overBooking: [20, 20, 20, 20, 20]
                }
            ]
        },
        //以下四個為頁面上不是房型的最後四筆
        //房間總數
        totalAvailable: {
            begin_dat: 20,
            end_dat: 40,
            number: [10, 10, 10, 10, 10]
        },
        occupancy: {
            begin_dat: 20,
            end_dat: 40,
            number: [10, 10, 10, 10, 10]
        },
        phyAvailable: {
            begin_dat: 20,
            end_dat: 40,
            number: [10, 10, 10, 10, 10]
        },
        phyOccupancy: {
            begin_dat: 20,
            end_dat: 40,
            number: [10, 10, 10, 10, 10]
        },
        //控制套件參數
        isFirst: true
    },
    methods: {
        fetchRentCalDat() {
            // $.post('', {}, (restult) => {
            //     this.rentCalDat = result.rent_cal_dat;
            // });
        },
        initData() {
            // this.dateFieldData = [];
            // this.dayFieldData = [];
            // this.roomFieldData = [];
            // this.roomTypData = {};
            // this.totalAvailable = {};
            // this.occupancy = {};
            // this.phyAvailable = {};
            // this.phyOccupancy = {};
            // this.beginNum = "";
            // this.endNum = "";

        },
        fetchData() {

            this.initData();

            this.nowSearchDate = this.searchData.year + "/" + _s.rpad(this.searchData.month, 2, '0') + "/" + _s.rpad(this.searchData.date, 2, '0');

            var lo_param = {
                date: this.nowSearchDate
            };
            var ls_beginDate = 20;
            var ls_endDate = 40;

            this.beginNum = ls_beginDate;
            this.endNum = ls_endDate;

            // $.post('', lo_param).then(result => {
            //     this.beginNum = result.date_range.begin_dat;
            //     this.endNum = result.date_range.end_dat;
            //     this.roomTypData = result.roomTypData;
            //     this.totalAvailable = result.totalAvailable;
            //     this.occupancy = result.occupancy;
            //     this.phyAvailable = result.phyAvailable;
            //     this.phyOccupancy = result.phyOccupancy;
                this.convertData();
            // });

        },
        convertData() {
            var self = this;

            //取房型種類
            _.each(this.roomTypData, (data, key) => {
                this.roomFieldData.push(key);
            });

            //處理日期欄位資料
            var ls_date = this.searchData.year + "/" + _s.rpad(this.searchData.month, 2, '0') + "/" + _s.rpad(this.searchData.date, 2, '0');

            for (let i = 0; i <= 20; i++) {
                let lo_date = moment(new Date(ls_date)).add('days', i);
                this.dateFieldData.push(lo_date.format("YYYY/MM/DD").toString().split("/")[2]);
                this.dayFieldData.push(lo_date.format("ddd"));
            }

            //處理個房型每日數量
            var la_dateNumData = [];
            for (let i = this.beginNum; i <= this.endNum; i++) {
                la_dateNumData.push(i);
            }
            _.each(this.roomTypData, (data, key, idx) => {
                _.each(this.roomTypData[key], (roomData, idx) => {
                    let ln_beginIdx = _.indexOf(la_dateNumData, roomData.begin_dat);
                    let ln_endIdx = _.indexOf(la_dateNumData, roomData.end_dat);

                    let la_emptyRm = new Array(21);
                    let la_notWrsRm = new Array(21);
                    let la_overBooking = new Array(21);
                    let la_useRm = new Array(21);
                    let la_wrsRm = new Array(21);

                    for (let i = 0; i < 21; i++) {
                        la_emptyRm[i] = "";
                        la_notWrsRm[i] = "";
                        la_overBooking[i] = "";
                        la_useRm[i] = "";
                        la_wrsRm[i] = "";
                    }

                    for (let i = ln_beginIdx; i <= ln_endIdx; i++) {
                        la_emptyRm[i] = JSON.parse(JSON.stringify(roomData.emptyRm[i - ln_beginIdx]));
                        la_notWrsRm[i] = JSON.parse(JSON.stringify(roomData.notWrsRm[i - ln_beginIdx]));
                        la_overBooking[i] = JSON.parse(JSON.stringify(roomData.overBooking[i - ln_beginIdx]));
                        la_useRm[i] = JSON.parse(JSON.stringify(roomData.useRm[i - ln_beginIdx]));
                        la_wrsRm[i] = JSON.parse(JSON.stringify(roomData.wrsRm[i - ln_beginIdx]));
                    }

                    roomData.emptyRm = la_emptyRm;
                    roomData.notWrsRm = la_notWrsRm;
                    roomData.overBooking = la_overBooking;
                    roomData.useRm = la_useRm;
                    roomData.wrsRm = la_wrsRm;

                });
            });


            //處理房型套件樹狀結構
            var ln_roomTypLen = 0;

            for (let i = 0; i < this.roomFieldData.length; i++) {
                _.each(this.roomTypData[this.roomFieldData[i]], function (val, idx) {
                    self.roomTypData[self.roomFieldData[i]][idx].idx = ln_roomTypLen + idx;
                });
                ln_roomTypLen = ln_roomTypLen + this.roomTypData[this.roomFieldData[i]].length;
            }
        },
        backToRentCalDat() {
            this.searchDate.year = this.rentCalDat.split("/")[0];
            this.searchDate.month = this.rentCalDat.split("/")[1];
            this.searchDate.date = this.rentCalDat.split("/")[2];
            this.fetchData();
        },
        changDate(num) {
            var self = this;
            var ls_date = moment(new Date(this.nowSearchDate)).add('days', num).format("YYYY/MM/DD").toString();
            this.searchData.year = ls_date.split("/")[0];
            this.searchData.month = ls_date.split("/")[1];
            this.searchData.date = ls_date.split("/")[2];

            this.fetchData();
        }
    }
});