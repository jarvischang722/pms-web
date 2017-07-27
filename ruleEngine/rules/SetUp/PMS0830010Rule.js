/**
 * Created by a16010 on 2017/7/27.
 * 程式代碼: PMS0830010, 出納員設定
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
var selOptLib = require("../SelectOptionsLib");

module.exports = {
    chkCashierrfCashiercod: function (postData, session, callback) {

    },
    qryCashierrfUsesta: function(postData, callback){
        selOptLib.qryCashierrfUsesta(postData, function(err, result){
            callback(result);
        });
    },
    chkCashierrfOpentimes: function(postData, session, callback){
        let lo_params = {
            athena_id: session.athena_id,
            hotel_cod: session.func_hotel_cod
        };
        this.qryUseShiftOpen(lo_params, function(err, qryResult){
            postData.visable = (qryResult == "Y") ? "N" : "Y";
            callback(null, [postData]);
        });
    },
    qryUseShiftOpen: function(params, callback){

        queryAgent.query("QRY_USE_SHIFT_OPEN", params, function(err, getResult){
            if(_.isNull(getResult.use_shift_open)){
                getResult.use_shift_open = "Y";
            }
            callback(err, getResult.use_shift_open);
        });
    }
};