/**
 * Created by a14020 on 2017/4/5.
 */
var _ = require("underscore");
var moment = require("moment");
//var async = require("async");
var queryAgent = require('../../plugins/kplug-oracle/QueryAgent');
//var commandRules = require("./commonRule");
var ReturnClass = require("../returnClass");
var ErrorClass = require("../errorClass");

module.exports = {
    chk_guest_rf_guest_way : function (postData,session,callback) {

        var guestNewValue =  postData.newValue;
        var lo_result = new ReturnClass();
        var lo_error = null;
        if(guestNewValue == "G") {
            postData.rowData.rcard_prtrent = "N";
            lo_result.success = true;
            postData.rowData.guest_way = guestNewValue;
            lo_result.effectValues = postData.rowData;

            callback(lo_error,lo_result);
        }else {
            postData.rowData.rcard_prtrent = "Y";
            lo_result.success = true;
            postData.rowData.guest_way = guestNewValue;
            lo_result.effectValues = postData.rowData;

            callback(lo_error,lo_result);
        }
    }

}