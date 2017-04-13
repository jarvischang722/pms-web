/**
 * Created by a14020 on 2017/4/11.
 */

var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var queryAgent = require('../../plugins/kplug-oracle/QueryAgent');
var commandRules = require("./commonRule");
var ReturnClass = require("../returnClass");
var ErrorClass = require("../errorClass");

module.exports = {
    chk_source_grp_rf: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params = {
            athena_id: session.user.athena_id,
            source_grp: postData.rowData.source_grp
        };

        if (!_.isEmpty(postData.rowData.source_grp.trim())) {
            queryAgent.query("CHK_SOURCE_GRP_RF".toUpperCase(), params, function (err, guestData) {
                if (!err) {
                    if (guestData.source_count == 0) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = "此群組代號不在群組中";
                        lo_error.errorCod = "1111";

                        lo_result.effectValues = postData.rowData;

                        callback(lo_error, lo_result);
                    } else {
                        lo_error = new ErrorClass();
                        lo_result.success = true;
                        postData.rowData.source_grp = postData.newValue;
                        lo_result.effectValues = postData.rowData;

                        callback(lo_error, lo_result);

                    }
                } else {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = err;
                    lo_error.errorCod = "1111";

                    callback(err, lo_result);
                }

            })
        }
    },
    chkSourcerfModifysta: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params = {
            athena_id: session.user.athena_id,
            source_grp: postData.singleRowData.source_grp
        };

        var createSubFunc = [];
        var isDeleteRow = false;

            createSubFunc.push(
                function (callback) {
                    async.waterfall([
                        function (callback) {
                            var modifySta = postData.singleRowData.modify_sta.trim();
                            if (modifySta == "N") {
                                isDeleteRow = false;
                                callback(isDeleteRow, []);
                            } else {
                                isDeleteRow = true;
                                callback(isDeleteRow, []);
                            }
                        },
                        function (data, callback) {
                            queryAgent.query("GET_ORDER_MN.GUEST_TYP_COUNT".toUpperCase(), params, function (err, guestData) {
                                if (!err) {
                                    if (data == true) {
                                        if (guestData.guest_count > 0) {
                                            isDeleteRow = false;
                                            callback(isDeleteRow, []);
                                        } else {
                                            isDeleteRow = true;
                                            callback(isDeleteRow, []);
                                        }
                                    } else {
                                        callback(data, []);
                                    }
                                } else {
                                    callback(err, []);
                                }
                            })
                        }, function (data, callback) {
                            queryAgent.query("GET_GW_CUST_RF.DEFAULT_GUEST_TYP_COUNT".toUpperCase(), params, function (err, guestData) {
                                if (!err) {
                                    if (data == true) {
                                        if (guestData.guest_count > 0) {
                                            isDeleteRow = false;
                                            callback(isDeleteRow, []);
                                        } else {
                                            isDeleteRow = true;
                                            callback(isDeleteRow, []);
                                        }
                                    } else {
                                        callback(data, []);
                                    }
                                } else {
                                    callback(err, []);
                                }
                            })
                        }
                        // , function (data, callback) {  SAM 等待星光大哥確認package
                        //
                        // }
                    ], function (errMsg, result) {
                        if (errMsg) {
                            lo_error = new ErrorClass();
                            lo_result.success = false;
                            if (errMsg == false)
                                lo_error.errorMsg = "已經有使用到此類別，不能刪除";
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