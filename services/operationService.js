/**
 * Created by kaiyue on 2017/11/13.
 */

const moment = require("moment");
const queryAgent = require('../plugins/kplug-oracle/QueryAgent');
const mongoAgent = require("../plugins/mongodb");
const _ = require("underscore");
const async = require("async");
const CommonTools = require("../utils/CommonTools");
const sysConfig = require("../configs/systemConfig");

// 取作業多筆資料
exports.fetchDataGridFieldData = function (postData, session, callback) {
    async.waterfall([
        qryDataGridFieldData,

    ], function(err, result){
        callback(err, result);
    });

    function qryDataGridFieldData(cb){

    }
};