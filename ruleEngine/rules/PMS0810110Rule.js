/**
 * Created by a14020 on 2017/4/11.
 */

var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var queryAgent = require('../../plugins/kplug-oracle/QueryAgent');
var commandRules = require("./commonRule");
var ReturnClass = require("../returnClass");
var ErrorClass = require("../errorClass");

module.exports ={
    chk_source_grp_rf : function (postData,session,callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params={
            athena_id : session.user.athena_id,
            source_grp : postData.rowData.source_grp
        };

        if(!_.isEmpty(postData.rowData.source_grp.trim())) {
            queryAgent.query("CHK_SOURCE_GRP_RF".toUpperCase(),params,function (err,guestData) {
                if(!err){
                    if(guestData.source_count == 0){
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = "此群組代號不在群組中";
                        lo_error.errorCod="1111";

                        lo_result.effectValues = postData.rowData;

                        callback(lo_error,lo_result);
                    }else {
                        lo_error = new ErrorClass();
                        lo_result.success = true;
                        postData.rowData.source_grp = postData.newValue;
                        lo_result.effectValues = postData.rowData;

                        callback(lo_error,lo_result);

                    }
                }else {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = err;
                    lo_error.errorCod="1111";

                    callback(err,lo_result);
                }

            })
        }
    }
}