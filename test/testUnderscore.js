/**
 * Created by Jun on 2017/3/24.
 */
var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var config = require("../configs/database");
require('../plugins/kplug-oracle/DB').create(config.oracle);
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');

var la_compare  =  [1,2,3,4,5,6,7,8,9,10];
var la_targetCompar = [];
queryAgent.queryList("QRY_RVTYPE_RF_BY_ATHENA_ID",{athena_id:1001002},0,0,function(err,rvtypList){

    if(rvtypList.length >0 && rvtypList.length < 10){
        la_targetCompar = _.pluck(rvtypList,"type");
        var diff = _.difference(la_compare,la_targetCompar);
        console.log(diff);

    }else{
        console.log("大於10");
    }



})