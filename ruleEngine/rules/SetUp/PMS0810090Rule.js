/**
 * Created by a14020 on 2017/4/5.
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
    chk_guest_rf_guest_way: function (postData, session, callback) {

        var guestNewValue = postData.newValue;
        var lo_result = new ReturnClass();
        var lo_error = null;
        if (guestNewValue == "G") {
            postData.rowData.rcard_prtrent = "N";
            lo_result.success = true;
            postData.rowData.guest_way = guestNewValue;
            lo_result.effectValues = postData.rowData;

            callback(lo_error, lo_result);
        } else {
            postData.rowData.rcard_prtrent = "Y";
            lo_result.success = true;
            postData.rowData.guest_way = guestNewValue;
            lo_result.effectValues = postData.rowData;

            callback(lo_error, lo_result);
        }
    },

    chk_guest_rf_is_exist_order_mn: function (postData, session, callback) {
        var params = {
            athena_id: session.user.athena_id,
            guest_typ: postData.singleRowData.guest_typ.trim()
        };
        var isUsed = false;

        var createSubFunc = [];
        var lo_result = new ReturnClass();
        var lo_error = null;
        //以下四種狀況如有一項沒過就不能刪除
        createSubFunc.push(
            function (callback) {
                async.waterfall([
                    function (callback) {
                        queryAgent.query("GET_ORDER_MN.GUEST_TYP_COUNT".toUpperCase(), params, function (err, guestData) {
                            if (!err) {
                                if (guestData.guest_count > 0) {
                                    isUsed = true;
                                    callback(isUsed, []);
                                } else {
                                    isUsed = false;
                                    callback(isUsed, []);
                                }
                            } else {
                                callback(err, []);
                            }
                        })
                    },
                    function (data, callback) {
                        queryAgent.query("GET_GUEST_MN.GUEST_TYP_COUNT".toUpperCase(), params, function (err, guestData) {
                            if (!err) {
                                if (data != false) {
                                    if (guestData.guest_count > 0) {
                                        isUsed = true;
                                        callback(isUsed, []);
                                    } else {
                                        isUsed = false;
                                        callback(isUsed, []);
                                    }
                                } else {
                                    callback(isUsed, []);
                                }
                            } else {
                                callback(err, []);
                            }
                        })
                    },
                    function (data, callback) {
                        queryAgent.query("GET_GHIST_MN.GUEST_TYP_COUNT".toUpperCase(), params, function (err, guestData) {
                            if (!err) {
                                if (data != false) {
                                    if (guestData.guest_count > 0) {
                                        isUsed = true;
                                        callback(isUsed, []);
                                    } else {
                                        isUsed = false;
                                        callback(isUsed, []);
                                    }
                                } else {
                                    callback(isUsed, []);
                                }
                            } else {
                                callback(err, []);
                            }

                        })
                    },
                    function (data, callback) {
                        queryAgent.query("GET_GW_CUST_RF.DEFAULT_GUEST_TYP_COUNT".toUpperCase(), params, function (err, guestData) {
                            if (!err) {
                                if (data != false) {
                                    if (guestData.guest_count > 0) {
                                        isUsed = true;
                                        callback(isUsed, []);
                                    } else {
                                        isUsed = false;
                                        callback(isUsed, []);
                                    }
                                } else {
                                    callback(isUsed, []);
                                }
                            } else {
                                callback(err, []);
                            }
                        })
                    }
                    //因SD有變，這個不做檢查
                    // },
                    // function (data, callback) {
                    //     queryAgent.query("CHK_HOTEL_SVAL_MN_IS_EXIST_ORDER_MN".toUpperCase(), params, function (err, guestData) {
                    //         if (!err) {
                    //             if (data != false) {
                    //                 if (guestData.hotel_sval_mn_count > 0) {
                    //                     isUsed = true;
                    //                     callback(isUsed, []);
                    //                 } else {
                    //                     isUsed = false;
                    //                     callback(isUsed, []);
                    //                 }
                    //             } else {
                    //                 callback(isUsed, []);
                    //             }
                    //         } else {
                    //             callback(err, []);
                    //         }
                    //     })
                    // }
                ], function (errMsg, result) {
                    if (errMsg) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        if (errMsg == true)
                            lo_error.errorMsg = "已使用此類別，不可刪除";
                        else
                            lo_error.errorMsg = errMsg;

                        lo_error.errorCod = "1111";
                        callback(lo_error, lo_result);

                    } else {
                        callback(lo_error, lo_result);
                    }

                })
            }
        );
        async.parallel(createSubFunc, function (err, result) {
            callback(err, result);
        })

    }

}