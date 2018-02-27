import _s from "underscore.string";
import _ from "underscore";
import crypto from "crypto";

new Vue({
    el: '#PMS0110050App',
    mounted() {
        this.fetchRentCalDat();
        this.fetchData();
        this.fetchSearchFields();
    },
    updated() {
        $("#resRoomPlan-table").tableHeadFixer({"left": 1});
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
        randomString: crypto.randomBytes(32).toString('base64').replace(/([\(\)\[\]\{\}\^\$\+\=\-\*\?\.\"\'\|\/\\])/g, ""),
        isLoading: true,
        //滾房租日
        rentCalDat: "",
        //搜尋欄位資料
        searchFields: [],
        searchCond: {
            room_cod: [],
            room_nos: "",
            character_rmk: [],
            build_nos: [],
            floor_nos: []
        },
        //搜尋日期
        searchData: {
            year: moment().year().toString(),
            month: moment().month() + 1,
            date: moment().date().toString()
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
        roomNosData: [],
        roomNosDataDisplay: [],
        roomNosDataBlankDisplay: [],
        //排序的箭頭方向顯示
        typArrowClass: "fa-caret-down",
        nosArrowClass: "fa-caret-down",
        staArrowClass: "fa-caret-down"
    },
    methods: {
        //取滾房租日
        fetchRentCalDat() {
            $.post('/api/qryRentCalDat', {}, (result) => {
                this.rentCalDat = result.rent_cal_dat;
            });
        },
        //取搜尋欄位資料
        fetchSearchFields() {
            $.post('/api/fetchOnlySearchFieldsData', {prg_id: 'PMS0110050'}, (result) => {
                if (result.success) {
                    this.searchFields = result.searchFieldsData;
                }
            });
        },
        //資料初始化
        initData() {
            this.dateFieldData = [];
            this.dayFieldData = [];
            this.roomNosData = [];
            this.roomNosDataBlankDisplay = [];
            this.beginNum = "";
            this.endNum = "";
        },
        fetchData() {
            this.initData();

            this.nowSearchDate = this.searchData.year + "/" + _s.lpad(this.searchData.month, 2, '0') + "/" + _s.lpad(this.searchData.date, 2, '0');

            let lo_param = {
                socket_id: this.randomString,
                begin_dat: this.nowSearchDate,
                room_cod: this.searchCond.room_cod,
                room_nos: this.searchCond.room_nos,
                character_rmk: this.searchCond.character_rmk,
                build_nos: this.searchCond.build_nos,
                floor_nos: this.searchCond.floor_nos
            };

            $.post('/api/qryRmNosPageOneMap', lo_param).then(result => {
                if (result.success) {
                    if (result.data.roomNosData.length != 0) {
                        console.log(result.data.roomNosData);
                        this.beginNum = result.data.date_range.begin_dat;
                        this.endNum = result.data.date_range.end_dat;
                        this.roomNosData = result.data.roomNosData;
                        this.convertData(this.roomNosData);
                    }
                    else {
                        //處理日期欄位資料
                        let ls_date = this.searchData.year + "/" + _s.lpad(this.searchData.month, 2, '0') + "/" + _s.lpad(this.searchData.date, 2, '0');

                        for (let i = 0; i < 14; i++) {
                            let lo_date = moment(new Date(ls_date)).add('days', i);
                            this.dateFieldData.push({data: lo_date.format("YYYY/MM/DD").toString().split("/")[2]});
                            this.dayFieldData.push({data: lo_date.format("ddd")});
                        }
                        for (let i = 0; i < 28; i++) {
                            this.roomNosDataBlankDisplay.push(i);
                        }
                        alert('查無資料');
                    }
                }
                else {
                    alert(result.errorMsg);
                    //處理日期欄位資料
                    let ls_date = this.searchData.year + "/" + _s.lpad(this.searchData.month, 2, '0') + "/" + _s.lpad(this.searchData.date, 2, '0');

                    for (let i = 0; i < 14; i++) {
                        let lo_date = moment(new Date(ls_date)).add('days', i);
                        this.dateFieldData.push({data: lo_date.format("YYYY/MM/DD").toString().split("/")[2]});
                        this.dayFieldData.push({data: lo_date.format("ddd")});
                    }
                    for (let i = 0; i < 28; i++) {
                        this.roomNosDataBlankDisplay.push(i);
                    }
                }
                this.isLoading = false;
            });

        },
        convertData(la_roomNosData) {
            let self = this;
            this.dateFieldData = [];
            this.dayFieldData = [];
            console.log(this.endNum);
            this.roomNosDataDisplay = JSON.parse(JSON.stringify(la_roomNosData));
            //處理日期欄位資料
            let ls_date = this.searchData.year + "/" + _s.lpad(this.searchData.month, 2, '0') + "/" + _s.lpad(this.searchData.date, 2, '0');

            for (let i = this.beginNum; i <= this.endNum; i++) {
                let lo_date = moment(new Date(ls_date)).add('days', i - this.beginNum);
                this.dateFieldData.push({data: lo_date.format("YYYY/MM/DD").toString().split("/")[2]});
                this.dayFieldData.push({data: lo_date.format("ddd")});
            }
            //處理房號資料
            _.each(this.roomNosDataDisplay, (lo_roomNosData, idx) => {
                //處理房間有效日期
                let ln_numFieldLen = 2 * (this.endNum - this.beginNum + 1);
                let la_tmpRoomUse = new Array(ln_numFieldLen);
                let ln_count = 0;
                let ln_pushNum = 0;
                while (ln_count < ln_numFieldLen) {
                    la_tmpRoomUse[ln_count] = {num: this.beginNum + ln_pushNum, isUsed: false, isValidity: false};
                    la_tmpRoomUse[ln_count + 1] = {num: this.beginNum + ln_pushNum, isUsed: false, isValidity: false};
                    ln_count = ln_count + 2;
                    ln_pushNum = ln_pushNum + 1;
                }

                //處理房號的有效期限
                let ln_validBeginDatIdx = _.findIndex(la_tmpRoomUse, {num: lo_roomNosData.begin_dat});
                let ln_validEndDatIdx = _.findIndex(la_tmpRoomUse, {num: lo_roomNosData.end_dat});
                ln_validBeginDatIdx = ln_validBeginDatIdx > -1 ? ln_validBeginDatIdx : 0;
                ln_validEndDatIdx = ln_validEndDatIdx > -1 ? ln_validEndDatIdx + 1 : la_tmpRoomUse.length - 1;

                for (let i = ln_validBeginDatIdx; i <= ln_validEndDatIdx; i++) {
                    la_tmpRoomUse[i].isValidity = true;
                }

                //處理房號使用狀況
                _.each(lo_roomNosData.room_use, function (lo_roomUse) {
                    let ln_beginDatIdx = _.findIndex(la_tmpRoomUse, {num: lo_roomUse.begin_dat});
                    let ln_endDatIdx = _.findIndex(la_tmpRoomUse, {num: lo_roomUse.end_dat});
                    let ln_coDatIdx = _.findIndex(la_tmpRoomUse, {num: lo_roomUse.co_dat});

                    ln_beginDatIdx = lo_roomUse.begin_dat < self.beginNum ? 0 : ln_beginDatIdx + 1;
                    ln_beginDatIdx = lo_roomUse.begin_dat > self.endNum ? la_tmpRoomUse.length - 1 : ln_beginDatIdx;
                    la_tmpRoomUse[ln_beginDatIdx].isUsed = true;

                    let ls_roomUseClass = "";

                    //轉換房間使用類別代號
                    lo_roomUse.use_typ = lo_roomUse.use_typ == "R" ? 'OOO' : lo_roomUse.use_typ;
                    ls_roomUseClass = ls_roomUseClass + 'status_' + lo_roomUse.use_typ.toLocaleLowerCase();

                    //轉換房間使用期間
                    ln_endDatIdx = ln_coDatIdx != ln_endDatIdx ? ln_endDatIdx + 2 : ln_endDatIdx + 1;
                    ln_endDatIdx = lo_roomUse.end_dat < self.beginNum ? 0 : ln_endDatIdx;
                    ln_endDatIdx = lo_roomUse.end_dat > self.endNum ? la_tmpRoomUse.length - 1 : ln_endDatIdx;
                    ln_endDatIdx = ln_coDatIdx <= -1 && lo_roomUse.co_dat > self.endNum ? la_tmpRoomUse.length - 1 : ln_endDatIdx;

                    ls_roomUseClass = ls_roomUseClass + ' colspan-' + (ln_endDatIdx - ln_beginDatIdx + 1);

                    //轉換房間使用箭頭
                    if (lo_roomUse.begin_dat < self.beginNum && lo_roomUse.end_dat > self.endNum) {
                        ls_roomUseClass = ls_roomUseClass + ' only-oneArrow-left';
                        ls_roomUseClass = ls_roomUseClass + ' only-oneArrow-right';
                    }
                    else if (lo_roomUse.begin_dat < self.beginNum) {
                        ls_roomUseClass = ls_roomUseClass + ' only-oneArrow-left';
                    }
                    else if (lo_roomUse.begin_dat < self.beginNum) {
                        ls_roomUseClass = ls_roomUseClass + ' only-oneArrow-left';
                    }
                    else if (lo_roomUse.end_dat > self.endNum) {
                        ls_roomUseClass = ls_roomUseClass + ' only-oneArrow-right';
                    }
                    else if (ln_endDatIdx == ln_beginDatIdx) {
                        ls_roomUseClass = ls_roomUseClass + ' only-oneArrow-right';
                    }
                    else if (lo_roomUse.co_dat > self.endNum) {
                        ls_roomUseClass = ls_roomUseClass + ' only-oneArrow-right';
                    }

                    if(lo_roomUse.end_dat == lo_roomUse.co_dat ){
                        ls_roomUseClass = ls_roomUseClass + ' only-oneArrow-right';
                    }

                    la_tmpRoomUse[ln_beginDatIdx].attClass = ls_roomUseClass;

                    //轉換房間使用備註
                    la_tmpRoomUse[ln_beginDatIdx].text = lo_roomUse.use_rmk;

                    //轉換房間使用title
                    la_tmpRoomUse[ln_beginDatIdx].title = lo_roomUse.use_rmk + "(" + lo_roomUse.dis_ci_dat + "~" + lo_roomUse.dis_co_dat + ")";
                });

                this.roomNosDataDisplay[idx].room_use_display = la_tmpRoomUse;
            });
        },
        selectDate() {
            this.searchData.year = moment(new Date(this.searchData4Month)).year();
            this.searchData.month = moment(new Date(this.searchData4Month)).month() + 1;
            this.searchData.date = moment(new Date(this.searchData4Month)).date();
        },
        //依房種、房號、清掃狀況排序
        sortData(dataTyp) {
            if (this.roomNosDataDisplay.length != 0) {
                this.convertData(_.sortBy(this.roomNosData, dataTyp));
                if (dataTyp == "roomTyp") {
                    this.typArrowClass = "fa-caret-up";
                    this.nosArrowClass = "fa-caret-down";
                    this.staArrowClass = "fa-caret-down";
                }
                else if (dataTyp == "room_nos") {
                    this.typArrowClass = "fa-caret-down";
                    this.nosArrowClass = "fa-caret-up";
                    this.staArrowClass = "fa-caret-down";
                }
                else if (dataTyp == "room_sta") {
                    this.typArrowClass = "fa-caret-down";
                    this.nosArrowClass = "fa-caret-down";
                    this.staArrowClass = "fa-caret-up";
                }
            }
        },
        //搜尋日轉回滾房租日
        backToRentCalDat() {
            this.searchData.year = moment(new Date(this.rentCalDat)).year();
            this.searchData.month = moment(new Date(this.rentCalDat)).month() + 1;
            this.searchData.date = moment(new Date(this.rentCalDat)).date();
            this.searchData4Month = moment(new Date(this.rentCalDat));
        },
        changDate(num) {
            let ls_date = moment(new Date(this.nowSearchDate)).add('days', num).format("YYYY/MM/DD").toString();
            this.searchData.year = moment(new Date(ls_date)).year();
            this.searchData.month = moment(new Date(ls_date)).month() + 1;
            this.searchData.date = moment(new Date(ls_date)).date();
            this.searchData4Month = moment(new Date(ls_date));
        }

    }
});