/**
 * Created by a14020 on 2017/3/24.
 * 住客類別群組設定
 */

var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var queryAgent = require('../../plugins/kplug-oracle/QueryAgent');
var commandRules = require("./commonRule");
var ReturnClass = require("../returnClass");
var ErrorClass = require("../errorClass");

module.exports ={
    chkGuestgrprfIsExistGuestrf : function (postData,session,callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params={
            athena_id : session.user.athena_id,
            guest_grp : postData.gridData.guest_grp
        };

        if(!_.isEmpty(postData.gridData.guest_grp.trim())) {
            queryAgent.query("chkGuestgrprfIsExistGuestrf",params,function (err,guestData) {
                if(!err){
                    if(guestData.guest_count > 0){
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = "住客類別設定有使用此代號時，不可刪除";
                        lo_error.errorCod="1111";
                    }
                    callback(lo_error,lo_result);
                }
                /***
                 * 如果只有if  （line: 25） 才callback  回去  有天遇到err 這裡會卡住回不去
                 */
                //callback(error,result);
            })
        }
    }

};