/**
 * Created by a17017 on 2018/3/26.
 * select data 過濾
 */
const _ = require("underscore");

exports.filter_source_typ = function (selectData, callback) {
    let la_filterSelectData = _.filter(selectData, function(lo_selectData){
        return lo_selectData.use_sta == 'Y';
    });
    callback(la_filterSelectData);
};