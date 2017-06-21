/**
 * Created by a14020 on 2017/6/20.
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
    chkMsggtrmkrfMsgLin2: function (field, userInfo, callback) {
        var params = {
            athena_id: userInfo.athena_id,
            hotel_cod: userInfo.fun_hotel_cod
        };
        var createSubFunc = [];
        createSubFunc.push(
            function (callback) {
                async.waterfall([
                    function (callback) {
                        queryAgent.query("CHK_PG_MSGGT_MN_LIN", params, function (err, dataInfo) {
                            if (!err) {
                                if (dataInfo.msggtlin != null) {
                                    if (dataInfo.msggtlin >= 2) {
                                        field.visiable = "Y";
                                        callback(null, field);
                                    } else {
                                        field.visiable = "N";
                                        callback(null, field);
                                    }
                                } else {
                                    field.visiable = "N";
                                    callback(null, field);
                                }
                            } else {
                                field.visiable = "N";
                                callback(err, field);
                            }
                        })
                    }
                ],function (errMsg, result) {
                    callback(null, result);
                })
            });

        async.parallel(createSubFunc, function (err, result) {
            callback(err, result);
        })

    },
    chkMsggtrmkrfMsgLin3: function (field, userInfo, callback) {
        var params = {
            athena_id: userInfo.athena_id,
            hotel_cod: userInfo.fun_hotel_cod
        };
        var createSubFunc = [];
        createSubFunc.push(
            function (callback) {
                async.waterfall([
                    function (callback) {
                        queryAgent.query("CHK_PG_MSGGT_MN_LIN", params, function (err, dataInfo) {
                            if (!err) {
                                if (dataInfo.msggtlin != null) {
                                    if (dataInfo.msggtlin >= 3) {
                                        field.visiable = "Y";
                                        callback(null, field);
                                    } else {
                                        field.visiable = "N";
                                        callback(null, field);
                                    }
                                } else {
                                    field.visiable = "N";
                                    callback(null, field);
                                }
                            } else {
                                field.visiable = "N";
                                callback(err, field);
                            }
                        })
                    }
                ],function (errMsg, result) {
                    callback(null, result);
                })
            });

        async.parallel(createSubFunc, function (err, result) {
            callback(err, result);
        })
    },
    chkMsggtrmkrfMsgLin4: function (field, userInfo, callback) {
        var params = {
            athena_id: userInfo.athena_id,
            hotel_cod: userInfo.fun_hotel_cod
        };
        var createSubFunc = [];
        createSubFunc.push(
            function (callback) {
                async.waterfall([
                    function (callback) {
                        queryAgent.query("CHK_PG_MSGGT_MN_LIN", params, function (err, dataInfo) {
                            if (!err) {
                                if (dataInfo.msggtlin != null) {
                                    if (dataInfo.msggtlin >= 4) {
                                        field.visiable = "Y";
                                        callback(null, field);
                                    } else {
                                        field.visiable = "N";
                                        callback(null, field);
                                    }
                                } else {
                                    field.visiable = "N";
                                    callback(null, field);
                                }
                            } else {
                                field.visiable = "N";
                                callback(err, field);
                            }
                        })
                    }
                ],function (errMsg, result) {
                    callback(null, result);
                })
            });

        async.parallel(createSubFunc, function (err, result) {
            callback(err, result);
        })
    },
    chkMsggtrmkrfMsgtax:function (postData, session, callback) {
        var params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.fun_hotel_cod
        };

        var inputMsgLength = postData.singleRowData[postData.validateField].length;
        var lo_result = new ReturnClass();
        var lo_error = null;


        queryAgent.query("CHK_PG_MSGGT_MN_LENGTH", params, function (err, dataInfo) {
            if (!err) {
                if (dataInfo.msggtlength != null) {
                    if (dataInfo.msggtlength < inputMsgLength) {
                        postData.singleRowData[postData.validateField] =postData.singleRowData[postData.validateField].substring(0,dataInfo.msggtlength);
                        lo_result.showAlert = true;
                        lo_result.alertMsg ="只能輸入:" + dataInfo.msggtlength + "個字";
                        lo_result.effectValues =postData.singleRowData;
                        callback(lo_error, lo_result);
                    } else {

                        callback(lo_error, lo_result);
                    }
                } else {
                    callback(lo_error, lo_result);
                }
            } else {
                callback(lo_error, lo_result);
            }
        })
    }
}