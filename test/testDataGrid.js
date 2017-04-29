/**
 * Created by Jun on 2017/2/10.
 */
var config = require("../configs/database");
require('../plugins/kplug-oracle/DB').create(config.oracle);
var datagridSVC = require("../services/datagridService");
var sgSVC = require("../services/gridSingleService");
var tbSVC = require("../services/dbTableService");

var userInfo = {

    user_id: "a14017",
    athena_id: 1001002
};
var params = {
    prg_id: 'PMS0810020',
    room_cod: 'DRK',
    begin_dat: '2013/05/01'
}


sgSVC.handleSinglePageRowData(userInfo, params, function (err, fieldData) {
    console.log(err);
});

// tbSVC.doTableUnLock("PMS0810010", "ROOM_RF", "cio", "T",null, function(err,success){
//     console.log(err);
//     console.log(success);
// })