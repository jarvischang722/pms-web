/**
 * Created by a17017 on 2018/3/26.
 * select data 過濾
 */
const _ = require("underscore");

/**
 * 過濾訂房來源資料
 * @param selectData{array}: 所有下拉資料
 * @param callback{function}
 */
exports.filter_source_typ = function (selectData, callback) {
    let la_filterSelectData = _.filter(selectData, function(lo_selectData){
        return lo_selectData.use_sta == 'Y';
    });
    callback(la_filterSelectData);
};

exports.filter_guest_typ = function(selectData, callback){
    let la_filterSelectData = _.filter(selectData, function(lo_selectData){
        return lo_selectData.use_sta == 'Y';
    });
    callback(la_filterSelectData);
};

exports.filter_rate_grp = function(selectData, callback){
    let la_filterSelectData = _.filter(selectData, function(lo_selectData){
        return lo_selectData.use_sta == 'Y';
    });
    callback(la_filterSelectData);
};