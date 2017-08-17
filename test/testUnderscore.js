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
var list = [{a:1,b:2},{a:1,c:5},{a:2},{a:3},{a:4},{a:3},{a:2}];

_.each(list,function(d ,idx){
    let targetIdx = _.findIndex(list,{a:d.a});
    console.log("=======");
    console.log(idx);
    console.log(targetIdx);
    if(targetIdx > -1 && idx > targetIdx){
        delete list[targetIdx];
    }
})
// var ttt  = _.compact(la_compare);
console.log(_.compact(list));
