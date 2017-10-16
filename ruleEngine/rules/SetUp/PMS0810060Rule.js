/**
 * Created by a14020 on 2017/5/19.
 */
var _ = require("underscore");
var moment = require("moment");
//var async = require("async");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var ruleRootPath = appRootDir+"/ruleEngine/";
var queryAgent = require(appRootDir+'/plugins/kplug-oracle/QueryAgent');
var commandRules = require("./../CommonRule");
var ReturnClass = require(ruleRootPath+"/returnClass");
var ErrorClass = require(ruleRootPath+"/errorClass");

module.exports = {
    chkHfdLivecodrfDel: function (postData,session,callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params={
            athena_id: session.user.athena_id,
            live_cod: postData.singleRowData.live_cod
        };

        if(!_.isEmpty(postData.singleRowData.live_cod.trim())) {
            queryAgent.query("GET_GHIST_MN.LIVE_COD_COUNT",params,function (err,guestData) {
                if(!err){
                    if(guestData.ghistcount > 0){
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = commandRules.getMsgByCod("pms81msg13", session.locale);
                        callback(lo_error,lo_result);
                    }else {
                        callback(lo_error,lo_result);
                    }
                }else
                {
                    callback(err,lo_result);
                }
            });
        }
    }
};