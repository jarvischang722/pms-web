/**
 * Created by a14020 on 2017/5/15.
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
    chk_hfd_transport_rf_del: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.fun_hotel_cod,
            transport_cod: postData.singleRowData.transport_cod
        };

        if (!_.isEmpty(postData.singleRowData.transport_cod.trim())) {
            queryAgent.query("QRY_HFD_PICKUP_DT_COUNT", lo_params, function (err, guestData) {
                if (!err) {
                    if (guestData.pickupcount > 0) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = commandRules.getMsgByCod("pms81msg32", session.locale);
                    }
                }
                callback(err, lo_result);
            });
        }
    }
};