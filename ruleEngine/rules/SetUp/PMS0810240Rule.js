let _ = require("underscore");
let _s = require("underscore.string");
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
    /**
     * 新增預設值
     * @param postData {object}
     * @param session {object}
     * @param callback
     */
    PMS0810240_0200(postData, session, callback) {
        let lo_return = new ReturnClass();
        lo_return.defaultValues = {view_seq: 0};
        callback(null, lo_return);
    },

    /**
     * 刪除檢查
     * 訊息『已於房價主檔資料中使用，不可刪除』
     * @param postData {object}
     * @param session {object}
     * @param callback
     */
    PMS0810240_0300(postData, session, callback) {
        let lo_error = null;
        let lo_return = new ReturnClass();
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod,
            rate_grp: postData.deleteData[0].rate_grp
        };

        queryAgent.query("QRY_RATEGRP_IS_EXIST", lo_params, function (err, result) {
            if (err) {
                lo_return.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = err;
            }
            else {
                if (result.rate_grp_count > 0) {
                    lo_return.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = commandRules.getMsgByCod('pms81msg42', session.locale);
                }
            }
            callback(lo_error, lo_return);
        });
    },

    /**
     * 檢查房價分類代號(rate_grp)是否存在
     * @param postData {object}
     * @param session {object}
     * @param callback
     */
    chkRategrpIsExist(postData, session, callback) {
        let la_deleteData = postData.deleteData || [];
        let lo_createData = postData.singleRowData;
        let lo_return = new ReturnClass();


        let ln_isDelete = _.findIndex(la_deleteData, {rate_grp: lo_createData.rate_grp});
        if (ln_isDelete > -1) {
            return callback(null, lo_return);
        }

        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod,
            rate_grp: lo_createData.rate_grp
        };
        this.chkIsExistByRategrp(lo_params, session, callback);
    },

    chkIsExistByRategrp(lo_params, session, callback) {
        let lo_return = new ReturnClass();
        let lo_error = null;
        queryAgent.query("CHK_RATEGRP_IS_EXIST", lo_params, function (err, result) {
            if (err) {
                lo_error = new ErrorClass();
                lo_return.success = false;
                lo_error.errorMsg = err;
            }
            else {
                if (result.rategrp_rf_count > 0) {
                    lo_error = new ErrorClass();
                    lo_return.success = false;
                    let ls_errMsg = commandRules.getMsgByCod("pms81msg43", session.locale);
                    lo_error.errorMsg = _s.sprintf(ls_errMsg, lo_params.rate_grp);
                }
            }
            callback(lo_error, lo_return);
        });
    }
};