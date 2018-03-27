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
     * 單筆主檔各欄位預設值
     * @param postData
     * @param session
     * @param callback
     */
    defaultratecod_mn(postData, session, callback){
        let lo_result = new ReturnClass;
        let lo_error = null;

        lo_result.defaultValues = {
            base_carry: 'RND',
            base_unit: 0,
            rent_cal_rul: 'RM',
            min_stay_day: 0,
            serv_rat: 10,
            view_seq: 0,
            commis_rat: 0,
            eb_ctl: 'N',
            eb_from_day: 0,
            eb_to_day: 0,
            sell_ctl: 'N',
            occupy_rate_ctl: 'N',
            occupy_rate_rul: 'ROM',
            min_occupy_rat: 0,
            max_occupy_rat: 1
        };
        callback(lo_error, lo_result);
    },

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

    /**
     * 將ratecod值入到欄位baserate_cod
     * @param postData
     * @param session
     * @param callback
     */
    r_rate_cod(postData, session, callback){
        let lo_result = new ReturnClass;
        let lo_error = null;

        lo_result.effectValues = {
            baserate_cod: postData.singleRowData[0].rate_cod
        };
        callback(lo_error, lo_result);
    }
};