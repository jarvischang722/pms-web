/**
 * Created by a14020 on 2017/5/5.
 */
var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var ruleRootPath = appRootDir+"/ruleEngine/";
var queryAgent = require(appRootDir+'/plugins/kplug-oracle/QueryAgent');
var commandRules = require("./../CommonRule");
var ReturnClass = require(ruleRootPath+"/returnClass");
var ErrorClass = require(ruleRootPath+"/errorClass");

module.exports = {
    /*
     PMS0860040 :備註有資料就不能刪除
     */
    chk_remark_typ_rf_is_exist_cust_mn: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params = {
            athena_id: session.user.athena_id,
            remark_typ: postData.singleRowData.remark_typ
        };

        if (postData.singleRowData.remark_typ && !_.isEmpty(postData.singleRowData.remark_typ)) {
            queryAgent.query("QRY_REMARK_TYP_RF_IS_EXIST_CUST_MN_COUNT", params, function (err, guestData) {
                if (!err) {
                    if (guestData.countremark > 0) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = commandRules.getMsgByCod("pms86msg1", session.locale);
                    }
                }
                callback(err, lo_result);
            });
        }else {
            callback(null, lo_result);
        }
    }
};