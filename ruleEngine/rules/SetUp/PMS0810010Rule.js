/**
 * Created by Jun on 2017/3/30.
 * 房間大類對照檔規則
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
    /**
     * 房間大類新增時預設值
     * @param postData {Object} : 使用者傳來的資料
     * @param session {Object}  : Session
     * @param callback {Function} :
     */
    room_rf_add: function (postData, session, callback) {
        var result = new ReturnClass();
        var error = null;
        result.defaultValues = commandRules.getCreateCommonDefaultDataRule(session);
        callback(error, result);
    },
    chk_guest_grp_rf_is_exist_rvrmcod_rf:function (postData,session,callback) {
        var result = new ReturnClass();
        var error = null;
        var params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.fun_hotel_cod,
            room_typ: postData.singleRowData.room_typ || ""
        }
        queryAgent.query("CHK_GUEST_GRP_RF_IS_EXIST_RVRMCOD_RF", params, function (err, data) {
            if (data.room_count > 0) {
                result.success = false;
                error = new ErrorClass();
                error.errorMsg = "房間小類設定存在時，不可刪除";
                error.errorCod = "1111";

            }
            callback(error, result);
        })
    }
    

};

