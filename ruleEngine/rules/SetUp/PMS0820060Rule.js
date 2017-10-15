/**
 * Created by a14020 on 2017/6/20.
 */

let _ = require("underscore");
let moment = require("moment");
let async = require("async");
let path = require('path');
let appRootDir = path.dirname(require.main.filename);
let ruleRootPath = appRootDir + "/ruleEngine/";
let queryAgent = require(appRootDir + '/plugins/kplug-oracle/QueryAgent');
let commandRules = require("./../CommonRule");
let ReturnClass = require(ruleRootPath + "/returnClass");
let ErrorClass = require(ruleRootPath + "/errorClass");

module.exports = {
    chkMsggtrmkrfMsgtax: function (postData, session, callback) {
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
        });
    }
};