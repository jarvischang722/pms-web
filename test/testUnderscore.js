/**
 * Created by Jun on 2017/3/24.
 */
var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var config = require("../configs/database");
require('../plugins/kplug-oracle/DB').create(config.oracle);
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');

console.log(moment(new Date('2018/05/23')).diff(moment(new Date('2018/10/13')), "days"));


let la_test = [{field: 'a'}, {field: 'b'}, {field: 'c'}];

_.each(la_test, function(lo_test){
    if(lo_test.field == 'a'){
        lo_test.field = 'd';
    }
})

let lo_find = _.findWhere(la_test, {field: 'a'});
if(_.isUndefined(lo_find)){
    la_test.push({});
}
else{
    _.extend(lo_find, {field: 'd'});
}
console.log(la_test);
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
// let la_select = [];
// let la_filterSelectData = _.filter(la_select, function(lo_selectData){
//     return lo_selectData.use_sta == 'Y';
// });
// console.log(la_filterSelectData);