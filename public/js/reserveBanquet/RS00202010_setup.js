var RS00202010VM = new Vue({
    el: "#RS00202010Main",
    data: {
        defaultDate: new Date(),
        searchDate: "",
        pageOneData: {
            time_range: ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
                "19:00", "20:00", "21:00", "22:00", "23:00", "00:00", "01:00", "02:00"],
            rowData:[
                {
                    tr_class: "no-cursor-tr h23-tr",
                    datatype: "RSPT",
                    name: "蜻蜓餐廳",
                    rowspan: 0,
                    banquet_dt: [
                        {
                            name: "BREAKFAST2",
                            beg_tim: "09:00",
                            end_tim: "10:30",
                            colspan: 3,
                            datatype: "MTIME",
                            order_sta: ""
                        },
                        {
                            name: "LUNCH2",
                            beg_tim: "09:00",
                            end_tim: "10:30",
                            colspan: 8,
                            datatype: "MTIME",
                            order_sta: ""
                        },
                        {
                            name: "SNACK2",
                            beg_tim: "14:30",
                            end_tim: "17:30",
                            colspan: 6,
                            datatype: "MTIME",
                            order_sta: ""
                        },
                        {
                            name: "DINNER",
                            beg_tim: "17:30",
                            end_tim: "23:00",
                            colspan: 13,
                            datatype: "MTIME",
                            order_sta: ""
                        },
                        {
                            name: "",
                            beg_tim: "00:00",
                            end_tim: "02:00",
                            colspan: 6,
                            datatype: "MTIME",
                            order_sta: ""
                        }
                    ]
                },
                {
                    tr_class: "",
                    datatype: "PLACE",
                    name: "宴蜓區 (5)",
                    rowspan: 2,
                    banquet_dt: [
                        {
                            name: "test1",
                            beg_tim: "09:00",
                            end_tim: "00:00",
                            colspan: 32,
                            datatype: "Reserve",
                            order_sta: "N"
                        },
                        {
                            name: "test2",
                            beg_tim: "09:00",
                            end_tim: "00:00",
                            colspan: 2,
                            datatype: "Reserve",
                            order_sta: "W"
                        },
                        {
                            datatype: "",
                            repeat: 2
                        }
                    ]
                },
                {
                    tr_class: "",
                    datatype: "PLACE",
                    name: "宴蜓區 (5)",
                    rowspan: -1,
                    banquet_dt: [
                        {
                            repeat: 4,
                            datatype: ""
                        },
                        {
                            name: "(詢)test123_1",
                            beg_tim: "09:00",
                            end_tim: "00:00",
                            colspan: 28,
                            datatype: "Reserve",
                            order_sta: "Q"
                        },
                        {
                            name: "test2",
                            beg_tim: "09:00",
                            end_tim: "00:00",
                            colspan: 2,
                            datatype: "Reserve",
                            order_sta: "W"
                        },
                        {
                            datatype: "",
                            repeat: 2
                        }
                    ]
                },
                {
                    tr_class: "no-cursor-tr h23-tr",
                    datatype: "RSPT",
                    name: "雨林餐廳",
                    rowspan: 0,
                    banquet_dt: [
                        {
                            name: "BREAKFAST1",
                            beg_tim: "09:00",
                            end_tim: "10:30",
                            colspan: 3,
                            datatype: "MTIME"
                        },
                        {
                            name: "LUNCH2",
                            beg_tim: "09:00",
                            end_tim: "10:30",
                            colspan: 6,
                            datatype: "MTIME"
                        },
                        {
                            name: "",
                            beg_tim: "00:00",
                            end_tim: "02:00",
                            colspan: 7,
                            datatype: "MTIME"
                        },
                        {
                            name: "DINNER",
                            beg_tim: "14:30",
                            end_tim: "17:30",
                            colspan: 8,
                            datatype: "MTIME"
                        },
                        {
                            name: "",
                            beg_tim: "14:30",
                            end_tim: "17:30",
                            colspan: 2,
                            datatype: "MTIME"
                        },
                        {
                            name: "MIDNIGHT",
                            beg_tim: "00:00",
                            end_tim: "02:00",
                            colspan: 8,
                            datatype: "MTIME"
                        },
                        {
                            name: "",
                            beg_tim: "14:30",
                            end_tim: "17:30",
                            colspan: 2,
                            datatype: "MTIME"
                        }
                    ]
                }
            ]
        }
    },
    mounted: function () {
        var self = this;
        //啟用fixTable
        $("#gs-fixTable").tableHeadFixer({"left": 1});
        $("table.treeControl").agikiTreeTable({persist: true, persistStoreName: "files"});
        $.post("/reserveBanquet/qryPageOneData", function (result) {
            if (result.success) {
                self.pageOneData.time_range = result.pageOneData.time_range;
                self.pageOneData.rowData = result.pageOneData.rowData;
                console.log(result.pageOneData.rowData);
            }
        });
    }
});

// 啟用tree
