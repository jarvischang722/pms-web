/**
 * Created by Jun on 2017/3/23.
 * 程式代碼:PMS0810130 ,訂房分類設定規則
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
    /**
     * 1.mn只能新增1到10的大類，若1到10都滿了，就不可新增了，顯示「最多只能設定10筆」
     * 2.mn新增時，「大類別代號」帶出1~10中”缺少＂的＂最小”數字
     * @param postData
     * @param session
     * @param callback
     */
    chkRvtyprfIns: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var la_rvtyp_OneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
        var la_rvtyp = [];
        queryAgent.queryList("QRY_RVTYPE_RF", session.user, 0, 0, function (err, rvtypList) {
            if (rvtypList.length > 0 && rvtypList.length < 10) {
                la_rvtyp = _.pluck(rvtypList, "type");  //取房間類別種類陣列
                var la_diffType = _.difference(la_rvtyp_OneToTen, la_rvtyp);
                lo_result.defaultValues = commandRules.getCreateCommonDefaultDataRule();
                lo_result.defaultValues["type"] = la_diffType[0];
            } else {
                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = "最多只能設定10筆";
                lo_error.errorCod = "1111";
            }

            callback(lo_error, lo_result);
        });

    },
    /**
     * 檢查訂房主檔rv*_typ是否有值，若有則不可刪除（*為訂房大類代號)
     * @param postData
     * @param session
     * @param callback
     */
    chkRvTypRfDel: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var type_cod = postData.singleRowData["type"].toString();
        var params = {};
        params["athena_id"] = session.user.athena_id;
        params["rv" + type_cod + "_typ"] = type_cod;
        queryAgent.query("CHK_ORDER_MN_RV_TYP_IS_EXIST", params, function (err, data) {
            if (!err && data) {
                if (data.rvtyp_count > 0) {
                    lo_result.success = false;

                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "此大類別代號[" + type_cod + "]資料不可刪除";
                    lo_error.errorCod = "1111";
                }
            }

            callback(lo_error, lo_result);
        });
    },
    /**
     * 檢查在訂房卡是否已使用，若已使用則明細不可刪除
     * @param postData
     * @param session
     * @param callback
     */
    chkRvTypDtDel: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var singleRowData = postData.singleRowData || {};
        var type_cod = singleRowData.type.toString();
        var params = {};
        params["athena_id"] = session.user.athena_id;
        params["rv_typ"] = postData.singleRowData.rv_typ;
        params["rv" + type_cod + "_typ"] = type_cod;

        queryAgent.query("CHK_ORDER_MN_RV_TYP_CODE_IS_EXIST", params, function (err, data) {
            if (!err && data) {
                if (data.rvtyp_count > 0) {
                    lo_result.success = false;

                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "訂房卡已使用[" + type_cod + "]類別代號, 不可刪除！";
                    lo_error.errorCod = "1111";
                }
            }

            callback(lo_error, lo_result);
        });
    }
};
