/**
 * Created by a17017 on 2018/3/23.
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
    /**
     * 取得可選擇的房型
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise.<void>}
     */
    async get_room_typ_select(postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        }

        try {
            let lo_rentCalData = await new Promise((resolve, reject) => {
                queryAgent.query("QRY_RENT_CAL_DAT", lo_params, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            let la_roomTypeSelectData = await new Promise((resolve, reject) => {
                queryAgent.queryList("QRY_RVRMCOD_RF_FOR_RATECOD", _.extend(lo_params, {rent_cal_dat: lo_rentCalData.rent_cal_dat}), 0, 0, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            lo_result.multiSelectOptions = la_roomTypeSelectData;
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_error, lo_result);
    },

    async getOracleData(rule_func_name, params) {
        return new Promise((resolve, reject) => {
            queryAgent.query(rule_func_name, params, function (err, result) {

            });
        });
    },

    PMS0810230_templateRf: (page_id, tab_page_id) => {
        if(page_id == 1 && tab_page_id == 1){
            return "datagrid";
        }
    }
};