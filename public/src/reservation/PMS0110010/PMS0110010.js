import _s from 'underscore.string';

var vm = new Vue({
    el: '#PMS0110010App',
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
    watch: {
        searchData: {
            handler(val) {
                this.isLoading = true;
                this.fetchData();
            },
            deep: true
        }
    },
    data: {
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
    },
    methods: {
        fetchRentCalDat() {
            $.post('/api/qryRentCalDat', {}, (result) => {
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
            this.initData();

            this.nowSearchDate = this.searchData.year + "/" + _s.rpad(this.searchData.month, 2, '0') + "/" + _s.rpad(this.searchData.date, 2, '0');

            var lo_param = {
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
                        this.isLoading = false;
                    }
                    else {
                        this.is4fieldAppear = false;
                        this.isLoading = false;
                        alert('查無資料');
                    }

                }
            });

        },
        convertData() {
            var self = this;

            //轉換顏色格式
            _.each(this.color, (ls_color, idx) => {
                this.color[idx] = 'rgb(' + colorTool.colorCodToRgb(ls_color).r + ', ' + colorTool.colorCodToRgb(ls_color).g + ', ' + colorTool.colorCodToRgb(ls_color).b + ')';
            });

            //處理日期欄位資料
            var ls_date = this.searchData.year + "/" + _s.rpad(this.searchData.month, 2, '0') + "/" + _s.rpad(this.searchData.date, 2, '0');
            for (let i = this.beginNum; i <= this.endNum; i++) {
                let lo_date = moment(new Date(ls_date)).add('days', i - this.beginNum);
                this.dateFieldData.push({data: lo_date.format("YYYY/MM/DD").toString().split("/")[2],color: this.color[i - this.beginNum]});
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

                    let la_emptyRm = new Array(21);
                    let la_notWrsRm = new Array(21);
                    let la_overBooking = new Array(21);
                    let la_useRm = new Array(21);
                    let la_wrsRm = new Array(21);

                    for (let i = 0; i < 21; i++) {
                        la_emptyRm[i] = {color: self.color[i], num: ''};
                        la_notWrsRm[i] = {color: self.color[i], num: ''};
                        la_overBooking[i] = {color: self.color[i], num: ''};
                        la_useRm[i] = {color: self.color[i], num: ''};
                        la_wrsRm[i] = {color: self.color[i], num: ''};
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
            var ln_roomTypLen = 0;

            for (let i = 0; i < this.roomFieldData.length; i++) {
                _.each(this.roomTypData[this.roomFieldData[i]], function (val, idx) {
                    self.roomTypData[self.roomFieldData[i]][idx].idx = ln_roomTypLen + idx;
                });
                ln_roomTypLen = ln_roomTypLen + this.roomTypData[this.roomFieldData[i]].length;
            }

            //處理下面四欄位資料
            let la_dataNumData4Field = [];

            for (let i = this.beginNum; i <= this.endNum; i++) {
                la_dataNumData4Field.push(i);
            }

            let ln_beginIdx4Field = _.indexOf(la_dataNumData4Field, this.beginNum);
            let ln_endIdx4Field = _.indexOf(la_dataNumData4Field, this.endNum);

            let la_totalAvailable = new Array(21);
            let la_occupancy = new Array(21);
            let la_phyAvailable = new Array(21);
            let la_phyOccupancy = new Array(21);

            for (let i = 0; i < 21; i++) {
                la_totalAvailable[i] = {color: self.color[i], num: ''};
                la_occupancy[i] = {color: self.color[i], num: ''};
                la_phyAvailable[i] = {color: self.color[i], num: ''};
                la_phyOccupancy[i] = {color: self.color[i], num: ''};
            }


            for (let i = ln_beginIdx4Field; i <= ln_endIdx4Field; i++) {
                if ((i - ln_beginIdx4Field) < this.totalAvailable.number.length) {
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
            this.searchData.year = this.rentCalDat.split("/")[0];
            this.searchData.month = this.rentCalDat.split("/")[1];
            this.searchData.date = this.rentCalDat.split("/")[2];
            this.searchData4Month = moment(new Date(this.rentCalDat));

        },
        changDate(num) {
            var self = this;
            var ls_date = moment(new Date(this.nowSearchDate)).add('days', num).format("YYYY/MM/DD").toString();
            this.searchData.year = ls_date.split("/")[0];
            this.searchData.month = ls_date.split("/")[1];
            this.searchData.date = ls_date.split("/")[2];
            this.searchData4Month = moment(new Date(ls_date));

        },
        selectDate() {
            var ls_date = moment(new Date(this.searchData4Month)).format("YYYY/MM/DD").toString();
            this.searchData.year = ls_date.split("/")[0];
            this.searchData.month = ls_date.split("/")[1];
            this.searchData.date = ls_date.split("/")[2];
        }
    }
});