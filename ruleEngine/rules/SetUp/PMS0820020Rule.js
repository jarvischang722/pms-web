/**
 * Created by a14020 on 2017/9/12.
 */
var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var ruleRootPath = appRootDir + "/ruleEngine/";
var queryAgent = require(appRootDir + '/plugins/kplug-oracle/QueryAgent');
var commandRules = require("./../CommonRule");
var ReturnClass = require(ruleRootPath + "/returnClass");
var ErrorClass = require(ruleRootPath + "/errorClass");

module.exports = {
    chkRoommnConnroom: function (postData, session, callback) {
        // var lo_result = new ReturnClass();
        // var lo_error = null;
        //
        // var lb_isDefault = (postData.rowData.sys_default == "Y") ? false : true;
        // if (lb_isDefault == false) {
        //
        //     lo_result.success = false;
        //     lo_error = new ErrorClass();
        //     lo_error.errorMsg = "系統預設,不可異動";
        //     lo_error.errorCod = "1111";
        //     if (postData.oldValue != "") {
        //         postData.rowData.character_nam = postData.oldValue;
        //         lo_result.effectValues = postData.rowData;
        //     }
        // }
        // callback(lo_error, lo_result);
    },
    r_RoommnDel:function (postData, session, callback) {

    },
    r_RoommnIns:function (postData, session, callback) {

    },
    r_RoommnUpd:function (postData, session, callback) {

    }
}