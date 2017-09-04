/**
 * Created by a16010 on 2017/8/14.
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
    chk_area_cod_kvrf_is_exist_cust_mn: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;
        let li_counter = 0;

        let lo_params = {
            athena_id: session.user.athena_id
        };

        _.each(postData.deleteData, function (delData) {
            lo_params.area_cod = delData.area_cod;

            queryAgent.query("QRY_AREA_COUNT", lo_params, function (err, getResult) {
                li_counter++;
                if (getResult.areacount > 0) {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = "在商務公司資料維護已使用,不可刪除";
                    lo_error.errorCod = "1111";
                    callback(lo_error, lo_result);
                    return true;
                }
                if (li_counter == postData.deleteData.length) {
                    callback(lo_error, lo_result);
                }

            });
        });
    }
};
