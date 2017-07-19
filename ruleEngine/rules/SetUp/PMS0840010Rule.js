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
            hotel_cod: session.user.hotel_cod,
            middle_typ: postData.createData[0].middle_typ
        };

        var li_totalCreateDT = postData.dt_createData.length;
        var li_dt_counter = 0;
        _.each(postData.dt_createData, function (eachDT) {
            li_dt_counter++;
            lo_params.small_typ = eachDT.small_typ;
            queryAgent.queryList("CHK_HKMTYPE_RF_INS", lo_params, 0, 0, function (err, chkResult) {
                if (chkResult.length > 0) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "小分類『" + eachDT.small_typ + "』 已被中分類『" + chkResult[0].middle_typ.trim() + "』使用,不允許新增";
                    lo_error.errorCod = "1111";
                    callback(lo_error, lo_result);
                    return false;
                }
                if (li_dt_counter == li_totalCreateDT) {
                    callback(lo_error, lo_result);
                }

            });
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
        let lo_result = new ReturnClass();
        let lo_error = null;

        async.waterfall([
            chkMiddleTypDel,    // 檢查mn是否已被使用
            getSmallTypData,    // 取dt資料
            chkSmallTypDel      // 檢查dt是否已被使用
        ], function (err, chkResult) {
            if (!err) {
                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = chkResult;
                lo_error.errorCod = "1111";
            }
            callback(lo_error, lo_result);
        })

        function chkMiddleTypDel(cb) {
            let lo_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod,
                middle_typ: postData.deleteData[0].middle_typ
            };
            queryAgent.query("GET_MIDDLE_TYP_COUNT", lo_params, function (err, result) {
                if (result.middle_typ_count > 0) {
                    cb(false, "中分類『" + lo_params.middle_typ.trim() + "』,已被『房務入帳明細項目設定』使用,不可刪除");
                }
                else {
                    cb(true, true);
                }
            });
        }

        function getSmallTypData(middleResult, cb){
            let lo_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod,
                middle_typ: postData.deleteData[0].middle_typ
            };
            queryAgent.queryList("QRY_HKSTYPE_RF", lo_params, 0, 0, function(err, smallTypResult){
                if(!err){
                    cb(true, smallTypResult);
                }
            });
        }

        function chkSmallTypDel(smallTypData, cb) {
            let lo_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod
            };
            let li_smallTyp_count = smallTypData.length;
            let li_counter = 0;
            _.each(smallTypData, function(eachData){
                li_counter++;
                queryAgent.query("GET_SMALL_TYP_COUNT", lo_params, function (err, result) {
                    if (result.small_typ_count > 0) {
                        cb(false, "小分類『" + lo_params.small_typ.trim() + "』,已被『房務入帳明細項目設定』使用,不可刪除");
                    }

                    if(li_counter == li_smallTyp_count)
                        cb(true, "success");
                });
            });

        }
    },

    /**
     * 小分類已被使用，則不可刪除
     * 訊息: 小分類『[[%%明細的small_typ%%]]』,已被『房務入帳明細項目設定』使用,不可刪除"
     * @param postData
     * @param session
     * @param callback
     * @constructor
     */
    CHK_HKSTYPE_RF_DEL: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;

        var lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        };

        var li_totalDelData = postData.deleteData.length;
        var li_del_counter = 0;
        _.each(postData.deleteData, function (eachDelData) {
            li_del_counter++;
            lo_params.small_typ = eachDelData.small_typ;
            queryAgent.query("GET_SMALL_TYP_COUNT", lo_params, function (err, result) {
                if (result.small_typ_count > 0) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "小分類『" + lo_params.small_typ.trim() + "』,已被『房務入帳明細項目設定』使用,不可刪除";
                    lo_error.errorCod = "1111";
                    callback(lo_error, lo_result);
                    return false;
                }
                if (li_del_counter == li_totalDelData)
                    callback(lo_error, lo_result);
            });
        });
    }
};
