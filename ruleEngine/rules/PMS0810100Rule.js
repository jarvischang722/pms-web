/**
 * Created by a14020 on 2017/3/30.
 */

var _ = require("underscore");
var moment = require("moment");
//var async = require("async");
var queryAgent = require('../../plugins/kplug-oracle/QueryAgent');
//var commandRules = require("./commonRule");
var ReturnClass = require("../returnClass");
var ErrorClass = require("../errorClass");

module.exports ={
    CHK_SOURCE_GRP_RF_IS_EXIST_SOURCE_RF : function (postData,session,callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params={
            athena_id : session.user.athena_id,
            source_grp : postData.singleRowData.source_grp
        };

        if(!_.isEmpty(postData.singleRowData.source_grp.trim())) {
            queryAgent.query("CHK_SOURCE_GRP_RF_IS_EXIST_SOURCE_RF".toUpperCase(),params,function (err,guestData) {
                if(!err){
                    if(guestData.sourceCount > 0){
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = "訂房來源對照檔有使用此代號時，不可刪除";
                        lo_error.errorCod="1111";
                    }else {
                        callback(lo_error,lo_result);
                    }
                }else {
                    callback(err,lo_result);
                }

            })
        }
    }

};