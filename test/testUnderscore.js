/**
 * Created by Jun on 2017/3/24.
 */
var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var config = require("../configs/database");
require('../plugins/kplug-oracle/DB').create(config.oracle);
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');

// var la_compare  =  [1,2,3,4,5,6,7,8,9,10];
// var la_targetCompar = [];
// var list = [{a:1,b:2},{a:1,c:5},{a:2},{a:3},{a:4},{a:3},{a:2}];
//
// var result = _.groupBy([0, 1, 2, 3, 4, 5], function(item, i) {
//     return Math.floor(i/2);
// });
//
//
// console.log(_.values(result));

var roomNosData = [
    {
        roomTyp: 'DXK',
        room_nos: '501',
        room_sta: 'Q', 	//清掃狀況
        begin_dat: 24, 	//有效開始日期
        end_dat: 30, 	//有效結束日期
        room_use: [
            {
                begin_dat: 24,
                end_dat: 30,
                ci_dat: 30,
                co_dat: 31,
                ues_rmk: "test",
                use_typ: "A"//使用類別，A:排房／O:住人／R:修理／S:參觀
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
                end_dat: 37,
                ci_dat: 30,
                co_dat: 31,
                ues_rmk: "test2",
                use_typ: "A"//使用類別，A:排房／O:住人／R:修理／S:參觀
            },
            {
                begin_dat: 37,
                end_dat: 37,
                ci_dat: 32,
                co_dat: 35,
                ues_rmk: "test3",
                use_typ: "O"//使用類別，A:排房／O:住人／R:修理／S:參觀
            }
        ]
    }
];

var beginNum = 24;
var endNum = 37;

_.each(roomNosData, (lo_roomNosData) => {
    var ln_numFieldLen = 2 * (endNum - beginNum + 1);
    var la_tmpRoomUse = new Array(ln_numFieldLen);

    let ln_count = 0;
    let ln_pushNum = 0;
    while (ln_count < ln_numFieldLen) {
        la_tmpRoomUse[ln_count] = {num: beginNum + ln_pushNum, isUsed: false};
        la_tmpRoomUse[ln_count + 1] = {num: beginNum + ln_pushNum , isUsed: false};
        ln_count = ln_count + 2;
        ln_pushNum = ln_pushNum + 1;
    }

    _.each(lo_roomNosData.room_use, function(lo_roomUse){
        let ln_ciDatIdx = _.findIndex(la_tmpRoomUse,{num: lo_roomUse.ci_dat});
        la_tmpRoomUse[ln_ciDatIdx + 1].isUsed = true;
    });

    console.log(la_tmpRoomUse);

});
