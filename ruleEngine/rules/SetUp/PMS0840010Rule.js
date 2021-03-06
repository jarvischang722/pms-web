/**
 * Created by a16010 on 2017/7/18..
 * 程式代碼:PMS0840010 ,房務入帳分類設定
 */

var _ = require("underscore");
var _s = require("underscore.string");
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

        if (postData.dt_createData != null) {
            var li_totalCreateDT = postData.dt_createData.length;
            var li_dt_counter = 0;
            _.each(postData.dt_createData, function (eachDT) {
                lo_params.small_typ = eachDT.small_typ;
                queryAgent.queryList("CHK_HKMTYPE_RF_INS", lo_params, 0, 0, function (err, chkResult) {
                    if (chkResult.length > 0) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms84msg1", session.locale);
                        callback(lo_error, lo_result);
                        return false;
                    }
                    li_dt_counter++;
                    if (li_dt_counter == li_totalCreateDT) {
                        callback(lo_error, lo_result);
                    }
                });
            });
        }
        else {
            callback(lo_error, lo_result);
        }

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
            if (err) {
                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = chkResult;
                lo_error.errorCod = "1111";
            }
            callback(lo_error, lo_result);
        });

        function chkMiddleTypDel(cb) {
            let lo_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod,
                middle_typ: postData.deleteData[0].middle_typ
            };
            queryAgent.query("GET_MIDDLE_TYP_COUNT", lo_params, function (err, result) {
                if (result.middle_typ_count > 0) {
                    let ls_errMsg = commandRules.getMsgByCod("pms84msg2", session.locale);
                    ls_errMsg = _s.sprintf(ls_errMsg, lo_params.middle_typ.trim());
                    cb(true, ls_errMsg);
                }
                else {
                    cb(null, "");
                }
            });
        }

        function getSmallTypData(middleResult, cb) {
            let lo_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod,
                middle_typ: postData.deleteData[0].middle_typ
            };
            queryAgent.queryList("QRY_HKSTYPE_RF", lo_params, 0, 0, function (err, smallTypResult) {
                if (!err) {
                    if (smallTypResult.length > 0) {
                        cb(null, smallTypResult);
                    }
                    else {
                        cb(false, []);
                    }
                }
            });
        }

        function chkSmallTypDel(smallTypData, cb) {
            var laf_checkFunc = [];

            let li_smallTyp_count = smallTypData.length;
            let li_counter = 0;
            _.each(smallTypData, function (eachData) {

                let lo_params = {
                    athena_id: session.user.athena_id,
                    hotel_cod: session.user.hotel_cod,
                    small_typ: eachData.small_typ
                };

                laf_checkFunc.push(
                    function (callback) {
                        queryAgent.query("GET_SMALL_TYP_COUNT", lo_params, function (err, result) {
                            if (result.small_typ_count > 0) {
                                let ls_errMsg = commandRules.getMsgByCod("pms84msg3", session.locale);
                                ls_errMsg = _s.sprintf(ls_errMsg, lo_params.small_typ.trim());
                                callback(true, ls_errMsg);
                            } else {
                                callback(null, "");
                            }

                        });
                    }
                );

            });
            async.parallel(laf_checkFunc, function (err, result) {
                cb(err, result);
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
                    let ls_errMsg = commandRules.getMsgByCod("pms84msg3", session.locale);
                    lo_error.errorMsg = _s.sprintf(ls_errMsg, lo_params.small_typ.trim());
                    callback(lo_error, lo_result);
                    return false;
                }
                if (li_del_counter == li_totalDelData) {
                    callback(lo_error, lo_result);
                }
            });
        });
    }
};
