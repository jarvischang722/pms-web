/**
 * Created by Jun Chang on 2017/2/14.
 */
var tools = require("../utils/CommonTools");
var moment = require("moment");
var sysConf = require("../configs/SystemConfig");
var dgSvc = require("../services/DatagridService");



var dataRow0 = [{"function": "0", "condition": "keyField = 'R015' "} ];

var dataRow1 = [
    {
        "function": "1",
        "room_typ": "R014",
        "room_nam": "優質單人房",
        "room_snabbb": "SNNG",
        "room_qnt": "5",
        "INS_DAT": moment().format("YYYY/MM/DD HH:mm:ss"),
        "INS_USR": "cio",
        "upd_dat": moment().format("YYYY/MM/DD HH:mm:ss"),
        "upd_usr": "cio",
        "HOTEL_COD": "A28"
    }
];

var dataRow2 = [
    {
        "function": "2",
        "condition": "room_typ = 'R004'",
        "room_nam": "房型1",
        "room_sna": "房",
        "room_qnt": "100",
        "upd_dat": moment().format("YYYY/MM/DD HH:mm:ss"),
        "upd_usr": "jer"
    }
];

var params = {
    "REVE-CODE": "0300901000",
    "program_id": "1",
    "user":"cio",
   // "password":"athena",
    "table_name": "ROOM_RF",
    "date_row": dataRow0
};



tools.requestApi(sysConf.api_url, params, function (err, res, data) {
    console.log(data);
})

