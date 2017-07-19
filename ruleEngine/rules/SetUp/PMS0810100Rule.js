/**
 * Created by a14020 on 2017/3/30.
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
    chk_source_grp_rf_is_exist_source_rf: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params = {
            athena_id: session.user.athena_id,
            source_grp: postData.singleRowData.source_grp
        };

        if (!_.isEmpty(postData.singleRowData.source_grp.trim())) {
            queryAgent.query("CHK_SOURCE_GRP_RF_IS_EXIST_SOURCE_RF".toUpperCase(), params, function (err, guestData) {
                if (!err) {
                    if (guestData.source_count > 0) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = "訂房來源對照檔有使用此代號時，不可刪除";
                        lo_error.errorCod = "1111";
                        callback(lo_error, lo_result);
                    } else {
                        callback(lo_error, lo_result);
                    }
                } else {
                    callback(err, lo_result);
                }

            });
        }
    }

};