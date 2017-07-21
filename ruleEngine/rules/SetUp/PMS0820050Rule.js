/**
 * Created by a16010 on 2017/7/20.
 * 程式代碼: PMS0820050, 櫃檯備品庫存設定
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
    r_HfduserfViewseqAttr: function(postData, session, callback){
        var result = new ReturnClass();
        var error = null;
        var ls_sys_default = _.findWhere(postData, {ui_field_name: "sys_default"});
        var lo_view_seq = _.findWhere(postData, {ui_field_name: "view_seq"});
        lo_view_seq.modificable = ls_sys_default.modificable == "Y" ? "N" : "Y";
        callback(error, [lo_view_seq]);
    },
    chk_hfd_use_dt_begin_end_dat: function(postData, session, callback){

    }
};
