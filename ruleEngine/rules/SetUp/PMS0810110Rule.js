/**
 * Created by a14020 on 2017/4/11.
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
                        lo_error.errorMsg = commandRules.getMsgByCod("pms81msg17", session.locale);
                        lo_result.effectValues = postData.rowData;
                    } else {
                        lo_error = new ErrorClass();
                        lo_result.success = true;
                        postData.rowData.source_grp = postData.newValue;
                        lo_result.effectValues = postData.rowData;
                    }
                } else {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = err;
                    lo_error.errorCod = "1111";
                }
                callback(lo_error, lo_result);
            });
        }
    },
    chkSourcerfModifysta: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params = {
            athena_id: session.user.athena_id,
            source_typ: postData.singleRowData.source_typ
        };

        var createSubFunc = [];
        var isDeleteRow = false;
        var ls_errCod = '';

        createSubFunc.push(
            function (callback) {
                async.waterfall([
                        function (callback) {
                            var modifySta = postData.singleRowData.modify_sta.trim();
                            if (modifySta == "N") {
                                isDeleteRow = false;
                                ls_errCod = "pms81msg18";
                            } else {
                                isDeleteRow = true;
                            }
                            callback(null, isDeleteRow);
                        },
                        function (data, callback) {
                            if (data) {
                                queryAgent.query("GET_ORDER_MN.SOURCE_TYP_COUNT".toUpperCase(), params, function (err, guestData) {
                                    if (!err) {
                                        if (guestData.source_count > 0) {
                                            isDeleteRow = false;
                                            ls_errCod = "pms81msg19";
                                        } else {
                                            isDeleteRow = true;
                                        }
                                        callback(null, isDeleteRow);
                                    } else {
                                        callback(err, []);
                                    }
                                });
                            }
                            else {
                                callback(null, data);
                            }
                        },
                        function (data, callback) {
                            if (data) {
                                queryAgent.query("GET_GW_CUST_RF.DEFAULT_SOURCE_TYP_COUNT".toUpperCase(), params, function (err, guestData) {
                                    if (!err) {
                                        if (guestData.source_count > 0) {
                                            isDeleteRow = false;
                                            ls_errCod = "pms81msg19";
                                        } else {
                                            isDeleteRow = true;
                                        }
                                        callback(null, isDeleteRow);
                                    } else {
                                        callback(err, []);
                                    }
                                });
                            }
                            else {
                                callback(null, data);
                            }
                        }],
                    function (errMsg, result) {
                        if (errMsg == null) {
                            if (result == false) {
                                lo_error = new ErrorClass();
                                lo_result.success = false;
                                lo_error.errorMsg = commandRules.getMsgByCod(ls_errCod, session.locale);
                            }
                            callback(lo_error, lo_result);
                        } else {
                            callback(lo_error, lo_result);
                        }
                    });
            }
        );

        async.parallel(createSubFunc, function (err, result) {
            callback(err, result);
        });
    }
}