/**
 * Created by a14020 on 2017/5/24.
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
    chkContactrfContacttyp: function (postData, session, callback) {
        var deleteFlag = postData.rowData.delete_flag;
        var lo_error = null;
        var lo_result = new ReturnClass();

        if(deleteFlag == 'N'  && postData.oldValue != ""){
            lo_result.success = false;
            lo_error = new ErrorClass();
            lo_error.errorMsg = commandRules.getMsgByCod("cmm11msg1", session.locale);
            if (postData.oldValue != "") {
                postData.rowData.contact_typ = postData.oldValue;
                lo_result.effectValues = postData.rowData;
            }
        }
        callback(lo_error, lo_result);
    },
    chk_contact_rf_del:function (postData, session, callback) {
        var lo_error = null;
        var lo_result = new ReturnClass();
        var isDeleteRow = false;

        var lb_canDelete = postData.singleRowData.delete_flag == "N" ? false : true;

        var params = {
            athena_id: session.user.athena_id,
            contact_cod: postData.singleRowData.contact_cod
        };

        if (lb_canDelete == false) {
            lo_result.success = false;
            lo_error = new ErrorClass();
            lo_error.errorMsg = commandRules.getMsgByCod("pms81msg18", session.locale);
        }

        async.waterfall([
                function (callback) {
                    //取得聯絡資料檔的設定數量
                    queryAgent.query("QRY_CONTACT_DT_IS_CONTACT_COD_COUNT", params, function (err, Data) {
                        if (!err) {
                            if (Data.contactcount > 0) {
                                isDeleteRow = false;
                                callback(null, isDeleteRow);
                            } else {
                                isDeleteRow = true;
                                callback(null, isDeleteRow);
                            }
                        } else {
                            callback(err, lo_result);
                        }
                    });
                }
            ], function (errMsg, result) {
                if (errMsg == null) {
                    if (result == false) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = commandRules.getMsgByCod("cmm11msg2", session.locale);
                    }
                }
            callback(lo_error, lo_result);
            }
        );

    }
}