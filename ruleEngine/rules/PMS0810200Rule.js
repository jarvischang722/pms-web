/**
 * Created by a14020 on 2017/4/18.
 */
var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var queryAgent = require('../../plugins/kplug-oracle/QueryAgent');
var commandRules = require("./CommonRule");
var ReturnClass = require("../returnClass");
var ErrorClass = require("../errorClass");

module.exports = {
    /*
    PMS0810200 :最大的顯示順序+1
    */
    r_pms0810200_add : function (postData, session, callback) {
        var dataCount = postData.dataCount;
        var result = new ReturnClass();
        var error = null;
        var dataObj= {"view_seq" : parseInt(dataCount) +1};
        result.defaultValues = dataObj;
        callback(error,result);
    }
}