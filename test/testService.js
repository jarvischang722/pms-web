/**
 * Created by Jun Chang on 2017/2/14.
 */
var tools = require("../utils/CommonTools");
var moment = require("moment");
var dgSvc = require("../services/DatagridService");
var _ = require("underscore");
var dbSVC = require("../services/DbTableService");


var dtValue  = "NaN/NaN/NaN"
var dtRegex = new RegExp(/^[0-9]{4}[/](0[1-9]|1[012])[/](0[1-9]|[12][0-9]|3[01])$/);
console.log( dtRegex.test(dtValue));

var dataRow0 = [
    {
        "function": "0",
        "room_typ": "R002",
        "room_nam": "湖景雙床房",
        "room_sna": "HUG",
        "room_qnt": 12,
        "ins_dat": moment().format("YYYY/MM/DD HH:mm:ss"),
        "ins_usr": "cio",
        "upd_dat": moment().format("YYYY/MM/DD HH:mm:ss"),
        "upd_usr": "cio",
        "hotel_cod": "A28"
    }
];

var dataRow1 = [
    {
        "function": "1",
        "room_typ": "R018",
        "room_nam": "湖景雙床房",
        "room_sna": "MVV",
        "room_qnt": 12,
        "ins_dat": "2017/02/15 03:20:55",
        "ins_usr": "cio",
        "upd_dat": "2017/02/15 03:20:55",
        "upd_usr": "cio",
        "hotel_cod": "A28"
    }
];

var dataRow2 = [
    {
        "function": "2",
        "hotel_cod": "A28",
        "room_typ": "R019",
        "room_nam": "山景四人房",
        "room_sna": "MVR",
        "room_qnt": 25,
        "upd_dat": "02/15/2017 03:20:55",
        "upd_usr": "cio"
    }

];



var postData = {
    prg_id:"PMS0810010",
    deleteData : [],
    createData : [],
    updateData : dataRow2

};

var userInfo = {
    usr_id : 'cio',
    fun_hotel_cod:'A28'
};
var sessionData = {
    user : userInfo
}
var method = 'getPrgRowDefaultObject';

// dgSvc[method]('PMS0810010', sessionData , function(err,success){
//     console.error(err);
//     console.log(success);
//
// });