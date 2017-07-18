/**
 * Created by a16010 on 2017/7/18..
 * 程式代碼:PMS0840010 ,房務入帳分類設定
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
     * 如果有找到,則顯示訊息,並且不能儲存
     * 小分類已被其他中分類使用則不允許新增
     * 訊息: 小分類『[[%%small_typ%%]]』 已被中分類『[[%%middle_typ%%]]』使用,不允許新增
     * @param postData
     * @param session
     * @param callback
     */
    CHK_HKMTYPE_RF_INS: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.func_hotel_cod,
            small_typ: postData.small_typ,
            middle_typ: postData.middle_typ
        };

        queryAgent.queryList("CHK_HKMTYPE_RF_INS", lo_params, 0, 0, function (err, chkResult) {
            if (chkResult.length > 0) {
                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = "小分類『" + postData.small_typ + "』 已被中分類『" + postData.middle_typ + "』使用,不允許新增";
                lo_error.errorCod = "1111";
            }

            callback(lo_error, lo_result);
        });
    },
    /**
     * 1.中分類已被使用，則不可刪除
     * 訊息: 中分類『[[%%主檔middle_typ%%]]』,已被『房務入帳明細項目設定』使用,不可刪除
     * 2.小分類已被使用，則不可刪除
     * 訊息: 小分類『[[%%明細的每筆small_typ%%]]』,已被『房務入帳明細項目設定』使用,不可刪除
     * @param postData
     * @param session
     * @param callback
     * @constructor
     */
    CHK_HKMTYPE_RF_DEL: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;

        async.waterfall([
            chkMiddleTypDel,
            chkSmallTypDel
        ], function(err, chkResult){
            if(!err){
                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = chkResult;
                lo_error.errorCod = "1111";
            }
            callback(lo_error, lo_result);
        })

        function chkMiddleTypDel(cb) {
            var lo_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.func_hotel_cod,
                middle_typ: postData.middle_typ
            };
            queryAgent.query("GET_MIDDLE_TYP_COUNT", lo_params, function (err, result) {
                if (result > 0) {
                    cb(false, "中分類『"+ lo_params.middle_typ +"』,已被『房務入帳明細項目設定』使用,不可刪除");
                }
                else {
                    cb(null, "success");
                }
            });
        }

        function chkSmallTypDel(middleResult, cb) {
            var lo_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.func_hotel_cod,
                small_typ: postData.small_typ
            };
            queryAgent.query("GET_SMALL_TYP_COUNT", lo_params, function (err, result) {
                if (result > 0) {
                    cb(false, "小分類『"+ lo_params.small_typ +"』,已被『房務入帳明細項目設定』使用,不可刪除");
                }
                else {
                    cb(null, "success");
                }
            });
        }
    }
};
