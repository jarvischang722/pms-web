var _ = require('underscore');
_.str = require('underscore.string');
var config = require("../configs/database");
require('../plugins/kplug-oracle/DB').create(config.oracle);
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var  funcSvc = require("../services/RoleFuncService");
var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var params = {
    user_comp_cod: 'CHIPN',
    user_id: 'cio',
    // usr_pwd: '111',
    cmp_id: 'CHIPN',
    sys_id: 'PMS0000000',
    fun_hotel_cod:'02',
    subsys_id : "PMS0300000",
    hotel_cod:'99',
    athena_id: 1,
    rv2_typ:"1",
    rv7_typ :"7",
    begin_dat:'2017/03/06',
    begin_dat1:'2017/03/06',
    contact1_cod:'04'
}
var co = require("co");
var await = require("await");



test2();

function test1(params) {
    queryAgent.query("CHK_ORDER_MN_RV_TYP_IS_EXIST", params, function (err, data) {
        console.error(err);
        console.log(data);
    });
}

function test2(params) {
    var tableName = "lang_room_rf";
    var room_typ = 'TE';
    var xml = '<dao >' +
        '<statement><![CDATA[ SELECT * FROM '+tableName+'  WHERE athena_id=? and trim(room_typ) = ? ]]></statement>' +
        '<parameter type="string" kind="1" >athena_id</parameter>' +
        '<parameter type="string" kind="1" >room_typ</parameter>' +
        '</dao>';
    queryAgent.queryList({xml: xml}, {athena_id: 1,room_typ:'TE'}, 0, 10, function (err, row) {
        if (err) {
            console.error(err);
        }
        console.log(row);

    });
}
// funcSvc.querySubsyMdulBySys(params,function(err,grp){
//     console.log(err);
//     console.log(grp);
// })


// queryAgent.queryList('QRY_USER_QUICK_MENU', params,0,0, function (err, quickMenuRows) {
//
//     console.log(quickMenuRows);
//
// });