import _s from "underscore.string";
import _ from "underscore";

new Vue({
    el: '#PMS0110050App',
    mounted() {
        this.fetchRentCalDat();
        this.fetchData();
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
            month: "03",
            date: "24"
        },
        nowSearchDate: "",
        searchData4Month: moment(new Date()).format("YYYY/MM/DD").toString(),
        //日期欄位資料
        dateFieldData: [],
        dayFieldData: [],
        //開始數與結束數
        beginNum: "",
        endNum: "",
        numFieldData: [],
        //房型資料
        roomFieldData: [],
        roomNosData: []
    },
    methods: {
        //取滾房租日
        fetchRentCalDat() {
            $.post('/api/qryRentCalDat', {}, (result) => {
                this.rentCalDat = result.rent_cal_dat;
            });
        },
        //資料初始化
        initData() {
            this.dateFieldData = [];
            this.dayFieldData = [];
            this.roomFieldData = [];
            this.roomNosData = [];
            this.beginNum = "";
            this.endNum = "";
        },
        fetchData() {
            this.initData();

            this.nowSearchDate = this.searchData.year + "/" + _s.rpad(this.searchData.month, 2, '0') + "/" + _s.rpad(this.searchData.date, 2, '0');

            var lo_param = {
                begin_dat: this.nowSearchDate
            };

            // $.post('/api/qryPageOneDataByRmTyp', lo_param).then(result => {
            //     if (result.success) {
            //         if (!_.isEmpty(result.data)) {
            //             this.is4fieldAppear = true;
            //             this.beginNum = result.data.date_range.begin_dat;
            //             this.endNum = result.data.date_range.end_dat;
            //             this.color = result.data.date_range.color;
            //             this.roomTypData = result.data.roomTypData;
            //             this.convertData();
            //             this.isLoading = false;
            //         }
            //         else {
            //             this.isLoading = false;
            //             alert('查無資料');
            //         }
            //
            //     }
            // });
            this.beginNum = 24;
            this.endNum = 37;
            this.roomNosData = [
                {
                    roomTyp: 'DXK',
                    room_nos: '501',
                    room_sta: 'Q', 	//清掃狀況
                    begin_dat: 24, 	//有效開始日期
                    end_dat: 30, 	//有效結束日期
                    room_use: [
                        {
                            begin_dat: 25,
                            end_dat: 25,
                            ci_dat: 30,
                            co_dat: 31,
                            ues_rmk: "test",
                            use_typ: "R"//使用類別，A:排房／O:住人／R:修理／S:參觀
                        }
                    ]
                },
                {
                    roomTyp: 'DXK',
                    room_nos: '502',
                    room_sta: 'Q', //清掃狀況
                    begin_dat: 31, //有效開始日期
                    end_dat: 37,	//有效結束日期
                    room_use: [
                        {
                            begin_dat: 31,
                            end_dat: 35,
                            ci_dat: 30,
                            co_dat: 31,
                            ues_rmk: "test2",
                            use_typ: "A"//使用類別，A:排房／O:住人／R:修理／S:參觀
                        },
                        {
                            begin_dat: 36,
                            end_dat: 39,
                            ci_dat: 32,
                            co_dat: 35,
                            ues_rmk: "test3",
                            use_typ: "O"//使用類別，A:排房／O:住人／R:修理／S:參觀
                        }
                    ]
                }
            ];
            this.convertData();
        },
        convertData() {
            var self = this;

            //處理日期欄位資料
            var ls_date = this.searchData.year + "/" + _s.rpad(this.searchData.month, 2, '0') + "/" + _s.rpad(this.searchData.date, 2, '0');
            for (let i = this.beginNum; i <= this.endNum; i++) {
                let lo_date = moment(new Date(ls_date)).add('days', i - this.beginNum);
                this.dateFieldData.push({data: lo_date.format("YYYY/MM/DD").toString().split("/")[2]});
                this.dayFieldData.push({data: lo_date.format("ddd")});
            }

            //處理房間有效日期
            _.each(this.roomNosData, (lo_roomNosData, idx) => {
                var ln_numFieldLen = 2 * (this.endNum - this.beginNum + 1);
                var la_tmpRoomUse = new Array(ln_numFieldLen);

                let ln_count = 0;
                let ln_pushNum = 0;
                while (ln_count < ln_numFieldLen) {
                    la_tmpRoomUse[ln_count] = {num: this.beginNum + ln_pushNum, isUsed: false};
                    la_tmpRoomUse[ln_count + 1] = {num: this.beginNum + ln_pushNum, isUsed: false};
                    ln_count = ln_count + 2;
                    ln_pushNum = ln_pushNum + 1;
                }

                //處理房號使用狀況
                _.each(lo_roomNosData.room_use, function (lo_roomUse) {
                    let ln_beginDatIdx = _.findIndex(la_tmpRoomUse, {num: lo_roomUse.begin_dat});
                    let ln_endDatIdx = _.findIndex(la_tmpRoomUse, {num: lo_roomUse.end_dat});

                    ln_beginDatIdx = ln_beginDatIdx > -1 ? ln_beginDatIdx + 1 : 0;
                    ln_endDatIdx = ln_endDatIdx > -1 ? ln_endDatIdx : la_tmpRoomUse.length - 1;

                    la_tmpRoomUse[ln_beginDatIdx].isUsed = true;

                    let ls_roomUseClass = "";
                    //轉換房間使用類別代號
                    lo_roomUse.use_typ = lo_roomUse.use_typ == "R" ? 'OOO' : lo_roomUse.use_typ;
                    ls_roomUseClass = ls_roomUseClass + 'status_' + lo_roomUse.use_typ.toLocaleLowerCase();
                    //轉換房間使用期間
                    ls_roomUseClass = ls_roomUseClass + ' colspan-' + (ln_endDatIdx - ln_beginDatIdx + 1);
                    if (lo_roomUse.begin_dat < self.beginNum) {
                        ls_roomUseClass = ls_roomUseClass + ' only-oneArrow-left';
                    }
                    else if (lo_roomUse.end_dat > self.endNum) {
                        ls_roomUseClass = ls_roomUseClass + ' only-oneArrow-right';
                    }
                    else if(lo_roomUse.end_dat == lo_roomUse.begin_dat){
                        ls_roomUseClass = ls_roomUseClass + ' only-oneArrow-right';
                    }

                    la_tmpRoomUse[ln_beginDatIdx].attClass = ls_roomUseClass;

                    //轉換房間使用備註
                    la_tmpRoomUse[ln_beginDatIdx].use_rmk = lo_roomUse.ues_rmk;

                });

                this.roomNosData[idx].room_use = la_tmpRoomUse;
            });
        },
        selectDate() {
            var ls_date = moment(new Date(this.searchData4Month)).format("YYYY/MM/DD").toString();
            this.searchData.year = ls_date.split("/")[0];
            this.searchData.month = ls_date.split("/")[1];
            this.searchData.date = ls_date.split("/")[2];
        },
        //搜尋日轉回滾房租日
        backToRentCalDat() {
            this.searchData.year = this.rentCalDat.split("/")[0];
            this.searchData.month = this.rentCalDat.split("/")[1];
            this.searchData.date = this.rentCalDat.split("/")[2];
            this.searchData4Month = moment(new Date(this.rentCalDat));
        }

    }
});