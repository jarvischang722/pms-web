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
     PMS0860050 :拜訪資料有資料就不能刪除
     */
    chk_ps_visit_rf_is_exist_ps_visit_dt: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params = {
            athena_id: session.user.athena_id,
            visit_typ: postData.singleRowData.visit_typ
        };

        if (!_.isEmpty(postData.singleRowData.visit_typ.trim())) {
            queryAgent.query("QRY_PS_VISIT_RF_GET_COUNT", params, function (err, guestData) {
                if (!err) {
                    if (guestData.visitcount > 0) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = "在商務公司資料維護已使用,不可刪除";
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