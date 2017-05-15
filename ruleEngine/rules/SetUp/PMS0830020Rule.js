/**
 * Created by a16010 on 2017/5/11.
 * 程式代碼: PMS0830020, 服務種類設定
 */

var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var ruleRootPath = appRootDir + "/ruleEngine/";
var queryAgent = require(appRootDir + '/plugins/kplug-oracle/QueryAgent');
var commandRules = require("./../CommonRule");
var ReturnClass = require(ruleRootPath + "/returnClass");
var ErrorClass = require(ruleRootPath + "/errorClass");

module.exports = {
    chkUsetyp: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;

        var isDeleteRow = (postData.rowData.modify_sta == "N") ? false : true;

        if (isDeleteRow == false) {
            lo_error = new ErrorClass();
            if (postData.oldValue != "") {
                postData.rowData.use_typ = postData.oldValue;
                lo_result.effectValues = postData.rowData;
            }
            lo_error.errorCod = "1111";
            lo_error.errorMsg = "已經有使用到此類別，不能刪除";
        }
        callback(lo_error, lo_result);
    },
    chk_serv_type_rf_is_exist_service_rf: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var modifySta = postData.singleRowData.modify_sta;
        var params = {
            athena_id: session.user.athena_id,
            hotel_cod: postData.singleRowData.hotel_cod,
            serv_typ: postData.singleRowData.serv_typ
        };

        // 1.欄位modify_sta不為’Y’的，則不可刪除
        var isDeleteRow = (modifySta != "Y") ? false : true;

        // 2.檢查若服務項目設定有使用，則不可刪除
        queryAgent.query("chk_serv_type_rf_is_exist_service_rf".toUpperCase(), params, function (err, chkResult) {
            if (chkResult) {
                if (chkResult.service_count > 0 || isDeleteRow == true) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "服務項目有使用，則不可刪除";
                    lo_error.errorCod = "1111";
                }
                callback(lo_error, lo_result);
            }
        });
    }
}