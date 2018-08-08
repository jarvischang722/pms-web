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
let permissionSvc = require("./../../../services/permissionService");

module.exports = {

    /**
     * 單筆主檔各欄位預設值
     * @param postData
     * @param session
     * @param callback
     */
    defaultratecod_mn(postData, session, callback) {
        let lo_result = new ReturnClass;
        let lo_error = null;

        lo_result.defaultValues = {
            base_carry: 'RND',
            base_unit: 0,
            commis_rat: 0,
            eb_ctl: 'N',
            eb_from_day: 0,
            eb_to_day: 0,
            gen_from: 'H',//此欄位文件沒有，宏興大哥給的問題單有
            min_stay_day: 0,
            min_occupy_rat: 0,
            max_occupy_rat: 1,
            occupy_rate_ctl: 'N',
            occupy_rate_rul: 'ROM',
            rent_cal_rul: 'RM',
            sell_ctl: 'N',
            serv_rat: 0.1,
            view_seq: 0,
        };
        callback(lo_error, lo_result);
    },

    /**
     * 房型資料預設值設定
     * @param postData
     * @param session
     * @param callback
     */
    defaultratecod_dt(postData, session, callback) {
        let lo_result = new ReturnClass;
        let lo_error = null;
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod,
            supply_nos: postData.supply_nos,
            rate_cod: postData.rate_cod
        };

        queryAgent.queryList("QRY_RATECOD_DT", lo_params, 0, 0, function (err, result) {
            if (err) {
                console.log(err);
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = err;
            }
            else {
                lo_result.defaultValues = result;
            }
            callback(lo_error, lo_result);
        });
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
        };

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
     * 取得可選擇的使用期間
     * @param postData
     * @param session
     * @param callback
     */
    async qry_ratesupplydt_for_select_data(postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod,
            rate_cod: postData.rate_cod
        };

        try {
            let la_ratesupplyData = await new Promise((resolve, reject) => {
                queryAgent.queryList("QRY_RATESUPPLY_DT_FOR_SELECT", lo_params, 0, 0, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            lo_result.selectOptions = la_ratesupplyData;
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
     * 檢查使用期間日期是否重疊
     * @param postData
     * @param session
     * @param callback
     */
    chk_ratesupply_dt_data(postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let la_examData = postData.rowsData;
        for (let i = 0; i < la_examData.length; i++) {
            for (let j = 0; j <= i; j++) {
                if (i != j) {
                    let lo_nowData = la_examData[i];
                    let lo_compareData = la_examData[j];

                    let ls_nowBeginDat = moment(new Date(lo_nowData.begin_dat));
                    let ls_nowEndDat = moment(new Date(lo_nowData.end_dat));
                    let ls_compareBeginDat = moment(new Date(lo_compareData.begin_dat));
                    let ls_compareEndDat = moment(new Date(lo_compareData.end_dat));
                    let lb_chkOverLap = commandRules.chkDateIsBetween(ls_compareBeginDat, ls_compareEndDat, ls_nowBeginDat, ls_nowEndDat);

                    if (lb_chkOverLap) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms81msg44", session.locale);
                        break;
                    }
                }

            }
        }
        callback(lo_error, lo_result);
    },

    /**
     * 房型下拉資料
     * @param postData
     * @param session
     * @param callback
     */
    async qry_ratesupplydt_room_cod(postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        };

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
                queryAgent.queryList("QRY_RVRMCOD_RF_FOR_RATESUPPLY_DT", _.extend(lo_params, {rent_cal_dat: lo_rentCalData.rent_cal_dat}), 0, 0, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            let la_roomTypeViewSeq = await new Promise((resolve, reject) => {
                queryAgent.queryList("QRY_ROOM_COD_ORDER", lo_params, 0, 0, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            _.each(la_roomTypeSelectData, (lo_roomTypeSelectData) => {
                let lo_roomType = _.findWhere(la_roomTypeViewSeq, {room_cod: lo_roomTypeSelectData.value});
                if (!_.isUndefined(lo_roomType)) {
                    lo_roomTypeSelectData.view_seq = lo_roomType.view_seq;
                } else {
                    lo_roomTypeSelectData.view_seq = 0;
                }
                lo_roomTypeSelectData.display = lo_roomTypeSelectData.value + " : " + lo_roomTypeSelectData.display;
            });
            lo_result.selectOptions = _.sortBy(la_roomTypeSelectData, 'view_seq');
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
    async r_rate_cod(postData, session, callback) {
        let lo_result = new ReturnClass;
        let lo_error = null;
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod,
            rate_cod: postData.singleRowData[0].rate_cod
        };

        try {
            const lo_chkRateCod = await commandRules.clusterQuery(session, lo_params, "QRY_RATECOD_MN");
            if (!_.isNull(lo_chkRateCod)) {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = commandRules.getMsgByCod("pms81msg46", session.locale);
                lo_result.effectValues = {
                    rate_cod: ""
                }
            } else {
                lo_result.effectValues = {
                    baserate_cod: postData.singleRowData[0].rate_cod
                };
            }
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err.message || err;
        }
        callback(lo_error, lo_result);
    },

    /**
     * 欄位 屬性: 有其他DP的房價代號有使用到，不許修改
     * @param postData
     * @param session
     * @param callback
     */
    async r_baserate_flag(postData, session, callback) {
        let lo_result = new ReturnClass;
        let lo_error = null;
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod,
            rate_cod: postData.singleRowData[0].rate_cod
        };

        try {
            let lo_chkNum = await new Promise((resolve, reject) => {
                queryAgent.query("CHK_BASERATE_FLAG", lo_params, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result.chk_num);
                    }
                });
            });
            if (lo_chkNum > 0) {
                lo_result.effectValues = {
                    baserate_flag: postData.oriSingleData[0].baserate_flag
                }
            }
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
     * 得得使用期間一覽表資料
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise.<void>}
     */
    async query_rate_list(postData, session, callback) {
        let lo_result = new ReturnClass;
        let lo_error = null;
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod,
            rate_cod: postData.rate_cod,
            begin_dat: postData.year + "/01/01",
            end_dat: postData.year + "/12/31"
        };

        try {
            let la_rateList = await new Promise((resolve, reject) => {
                queryAgent.queryList("QRY_RENT_DT", lo_params, 0, 0, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            lo_result.effectValues = la_rateList;
        }
        catch
            (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_error, lo_result);
    },

    PMS0810230_templateRf: (page_id, tab_page_id) => {
        if (page_id == 1 && tab_page_id == 1) {
            return "datagrid";
        }
    },

    /**
     * "『設定類別』下拉多
     * DR:DAILY
     * PKG:PACKAGE
     * 則是Business就有,不是OptionID"
     * @param postData
     * @param session
     * @returns {Promise<*>}
     */
    async chkOptionID(postData, session) {
        let lo_prgEditionOptions = await permissionSvc.qryPrgEditionOptionList(postData, session);
        console.log(`edition: ${lo_prgEditionOptions.edition}`);
        if (lo_prgEditionOptions.edition.toLocaleUpperCase() == "BUSINESS") {
            postData.push({
                display: "DAILY",
                value: "DR"
            }, {
                display: "PACKAGE",
                value: "PKG"
            });
        }
        return postData;
    },

    /**
     * 房型資料預設值設定
     * @param postData
     * @param session
     * @param callback
     */
    r_1011(postData, session, callback) {
        let lo_result = new ReturnClass;
        let lo_error = null;
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        };

        queryAgent.query("QRY_HOLIDAY_RF_MAXDATE", lo_params, function (err, result) {
            if (err) {
                console.log(err);
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = err;
            }
            else {
                lo_result.defaultValues = moment(result.maxDat).format("YYYY/MM/DD");
            }
            callback(lo_error, lo_result);
        })
    }
};