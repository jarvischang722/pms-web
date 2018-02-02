import _s from 'underscore.string';

var vm = new Vue({
    el: '#PMS0110010App',
    mounted() {
        this.fetchData();
        $("table.treeControl").agikiTreeTable({
            persist: false,
            persistStoreName: "files"
        });
    },
    data: {
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
            date: '01'
        },
        //日期欄位資料
        dateFieldData: [],
        dayFieldData: [],
        //房型資料
        roomTypData: {
            DSX: {
                total: 10,
                emptyRoom: { //空房數
                    begin_dat: 20,
                    end_dat: 30,
                    number: [13, 13, 13, 14, 14] //對應天數給房間庫存
                },
                use: { //用房數
                    begin_dat: 20,
                    end_dat: 30,
                    number: [13, 13, 13, 14, 14] //對應天數給房間庫存
                },
                wrs: {   //鎖控剩餘數
                    begin_dat: 20,
                    end_dat: 30,
                    number: [13, 13, 13, 14, 14]
                },
                notWrs: { //非鎖控剩餘數
                    begin_dat: 20,
                    end_dat: 30,
                    number: [13, 13, 13, 14, 14]
                },
                overBooking: {  //庫存可超訂
                    begin_dat: 20,
                    end_dat: 30,
                    number: [13, 13, 13, 14, 14]
                }

            },
            STK: {
                total: 10,
                emptyRoom: { //空房數
                    begin_dat: 20,
                    end_dat: 30,
                    number: [13, 13, 13, 14, 14] //對應天數給房間庫存
                },
                use: { //用房數
                    begin_dat: 20,
                    end_dat: 30,
                    number: [13, 13, 13, 14, 14] //對應天數給房間庫存
                },
                wrs: {   //鎖控剩餘數
                    begin_dat: 20,
                    end_dat: 30,
                    number: [13, 13, 13, 14, 14]
                },
                notWrs: { //非鎖控剩餘數
                    begin_dat: 20,
                    end_dat: 30,
                    number: [13, 13, 13, 14, 14]
                },
                overBooking: {  //庫存可超訂
                    begin_dat: 20,
                    end_dat: 30,
                    number: [13, 13, 13, 14, 14]
                }

            }
        }
    },
    methods: {
        fetchData() {
            var lo_param = {
                date: this.searchData.year + "/" + _s.rpad(this.searchData.month, 2, '0') + "/" + _s.rpad(this.searchData.date, 2, '0')
            };
            var ls_beginDate = 1;
            var ls_endDate = 21;

            // $.post('', lo_param).then(result => {
            //     ls_beginDate = result.roomTypMap.date_range.begin_dat;
            //     ls_endDate = result.roomTypMap.date_range.end_dat;
            //
            //     for (let i = (ls_beginDate - 1); i <= (ls_endDate - 1); i++) {
            //         let lo_date = moment(new Date(lo_param.date)).add('days', i);
            //         this.dateFieldData.push(lo_date.format("YYYY/MM/DD").toString().split("/")[2]);
            //         this.dayFieldData.push(lo_date.format("ddd"));
            //     }
            // });

            for (let i = (ls_beginDate - 1); i <= (ls_endDate - 1); i++) {
                let lo_date = moment(new Date(lo_param.date)).add('days', i);
                this.dateFieldData.push(lo_date.format("YYYY/MM/DD").toString().split("/")[2]);
                this.dayFieldData.push(lo_date.format("ddd"));
            }
        }
    }
});