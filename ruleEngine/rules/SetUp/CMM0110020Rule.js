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
    chkAddressrfContacttyp: function (postData, session, callback) {
        var deleteFlag = postData.rowData.delete_flag;
        var error = null;
        var result = new ReturnClass();

        if(deleteFlag == 'N' && postData.oldValue != ""){
            result.success = false;
            error = new ErrorClass();
            error.errorMsg = "地址類別，不可異動";
            error.errorCod = "1111";
            if (postData.oldValue != "") {
                postData.rowData.add_type = postData.oldValue;
                result.effectValues = postData.rowData;
            }
        }
        callback(error, result);

    },
    chk_address_rf_del:function (postData, session, callback) {
        var lo_error = null;
        var lo_result = new ReturnClass();
        var isDeleteRow = false;
        var lb_canDelete = postData.singleRowData.delete_flag == "N" ? false : true;

        var params = {
            athena_id: session.user.athena_id,
            add_cod: postData.singleRowData.add_cod
        };

        if (lb_canDelete == false) {
            lo_result.success = false;
            lo_error = new ErrorClass();
            lo_error.errorMsg = "系統預設,不可刪除";
            lo_error.errorCod = "1111";
        }

        async.waterfall([
                function (callback) {
                    //取得聯絡資料檔的設定數量
                    queryAgent.query("QRY_CONTACT_DT_IS_ADD_COD_COUNT", params, function (err, Data) {
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
                    })
                }
            ], function (errMsg, result) {
                if (errMsg == null) {

                    if (result == false) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorCod = "1111";
                        lo_error.errorMsg = "已於聯絡資料中使用，不可刪除";
                    }

                    callback(lo_error, lo_result);

                } else {
                    callback(lo_error, lo_result);
                }
            }
        )
    }
}