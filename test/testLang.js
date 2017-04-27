/**
 * Created by Jun on 2017/4/25.
 */
var config = require("../configs/database");
var langSvc = require("../services/langService");
require('../plugins/kplug-oracle/DB').create(config.oracle);
var _ = require("underscore");
var moment = require("moment");
var keys = {
    athena_id: 1001002,
    ROOM_COD: 'HURR',
    BEGIN_DAT: '2017/03/15',
    FIELD_NAME: 'room_nam'

};
var field_name = ['room_nam','room_sna'];
var table = "rvrmcod_rf";
var locale = "zh_TW";


test1();
function test1(){

    langSvc.handleMultiLangContentByKey(table,locale, keys,  function (err, data) {
        // console.log("____");
        var obj = data[0];
        console.log(obj.begin_dat);
        console.log(moment(obj.begin_dat).diff(moment('2017-03-15'),"days"));
        console.log(moment(obj.begin_dat).diff(moment('2017-03-15'),"days") == 0 );
        // console.dir(data);

    });
}


function test2(){
    langSvc.handleMultiLangContentByField(table, field_name, function (err, data) {
    // console.log("____");
    console.log(data);
});
}
