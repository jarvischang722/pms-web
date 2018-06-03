/**
 * Created by a17010 on 2017/12/11.
 */
var _ = require("underscore");
var _s = require("underscore.string");
var moment = require("moment");
var async = require("async");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var ruleRootPath = appRootDir + "/ruleEngine/";
var queryAgent = require(appRootDir + '/plugins/kplug-oracle/QueryAgent');
var commandRules = require("./../CommonRule");
var ReturnClass = require(ruleRootPath + "/returnClass");
var ErrorClass = require(ruleRootPath + "/errorClass");
var tools = require(appRootDir + "/utils/CommonTools");
var sysConf = require("../../../configs/systemConfig");

module.exports = {
    /**
     * 單筆主檔各欄位預設值
     * 1.取得欄位contractSta
     * 2.取得欄位custCod、showCod
     * @param postData
     * @param session
     * @param callback
     */
    defaultCustMn: function (postData, session, callback) {
        let lo_result = new ReturnClass;
        let lo_error = null;
        let lo_params = postData.params;

        let ls_custMncontractSta = "";
        let ls_custMnCustCod = "";
        let ls_custMnShowCod = "";
        let ls_custMnPcustCod = "";

        async.waterfall([
            //取得欄位contractSta
            function (cb) {
                queryAgent.query("SEL_DEAFULTCONTRACTSTA", {athena_id: session.user.athena_id}, function (err, csData) {
                    if (err) {
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = err;
                        lo_result.success = false;
                    }
                    else {
                        ls_custMncontractSta = csData.status_cod;
                    }
                    cb(lo_error, lo_result);
                });
            },
            //取得欄位custCod、showCod
            function (result, cb) {
                let apiParams = {
                    "REVE-CODE": "BAC0900805",
                    "func_id": "0000",
                    "athena_id": session.user.athena_id,
                    "comp_cod": "NULL",
                    "hotel_cod": session.user.hotel_cod,
                    "sys_cod": "CS",
                    "nos_nam": "CUST_COD",
                    "link_dat": "2000/01/01"
                };
                tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
                    if (apiErr || !data) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = apiErr;
                    }
                    else if (data["RETN-CODE"] != "0000") {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        console.error(data["RETN-CODE-DESC"]);
                        lo_error.errorMsg = data["RETN-CODE-DESC"];
                    }
                    else {
                        let ls_cod = data["SERIES_NOS"].toString();
                        ls_custMnCustCod = "CS " + _s.lpad(ls_cod, 13, '0') + session.user.hotel_cod.trim();
                        ls_custMnShowCod = ls_custMnCustCod.substring(8, 20);
                        ls_custMnPcustCod = ls_custMnCustCod;
                    }
                    cb(lo_error, lo_result);
                });
            }
        ], function (err, result) {
            lo_result.defaultValues = {
                contract_sta: ls_custMncontractSta,
                cust_cod: ls_custMnCustCod,
                show_cod: ls_custMnShowCod,
                pcust_cod: ls_custMnPcustCod
            };
            callback(lo_error, lo_result);
        });
    },

    /**
     * 相關設定欄位area_cod下拉選單
     * @param postData
     * @param session
     * @param callback
     */
    sel_area_cod_kvrf_single: function (postData, session, callback) {
        let self = this;
        let lo_error = null;
        let lo_result = new ReturnClass();
        let lo_params = {
            athena_id: session.athena_id
        };

        queryAgent.queryList("SEL_AREA_COD_KVRF", lo_params, 0, 0, function (err, result) {

            let la_selectData = [];
            let la_root = _.filter(result, function (lo_rowData) {
                return lo_rowData.parent_cod.trim() == "ROOT";
            });

            _.each(la_root, function (lo_root) {
                let lo_node = new node(lo_root);
                convertData2TreeData(result, lo_node);
                la_selectData.push(lo_node);
            });

            lo_result.selectOptions = la_selectData;
            callback(lo_error, lo_result);
        });
    },

    /**
     * 合約內容 預設值
     * @param postData
     * @param session
     * @param callback
     */
    defaultCustMnContract: async function (postData, session, callback) {
        let lo_result = new ReturnClass;
        let lo_error = null;

        try {
            //取得訂房中心滾房租日
            let ls_rentDathq = await new Promise((resolve, reject) => {
                queryAgent.query("QRY_RENT_DAT_HQ", {
                    athena_id: session.user.athena_id,
                    hotel_cod: session.user.hotel_cod
                }, function (err, data) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(data.rent_dat_hq);
                    }
                });
            });

            lo_result.defaultValues = {
                rent_dat_hq: ls_rentDathq,
                rate_cod: ""
            };
        }
        catch (err) {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err;
            lo_result.success = false;
        }

        callback(lo_error, lo_result);
    },

    /**
     * 合約內容 開始日期
     * 1.合約期間檢查:
     * 如果『合約起始日』、『合約終止日』、『參考房價代號』3欄位都有值,如果sql檢查=0,訊息『相同館別及房價代號之合約期間不可重覆』,起始日回復到舊值
     * 2.輸入合約起始日小於參數『訂房中心滾房租日』時，顯示提示訊息「合約起始日在今天之前」,但可以繼續輸入
     * 3.合約內容 參考房價代號下拉資料
     * @param postData
     * @param session
     * @param callback
     */
    r_ContractdtBegindat: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let ls_beginDat = postData.rowData.begin_dat;
        let ls_endDat = postData.rowData.end_dat || "";
        let ls_rateCod = postData.rowData.rate_cod || "";
        let ls_hotelCod = postData.rowData.hotel_cod || "";
        let ls_oldValue = postData.oldValue == "" ? postData.rowData[postData.validateField] : postData.oldValue;
        let lo_param = {
            athena_id: session.user.athena_id,
            hotel_cod: ls_hotelCod,
            end_dat: moment(new Date(ls_endDat)).format("YYYY/MM/DD"),
            begin_dat: moment(new Date(ls_beginDat)).format("YYYY/MM/DD")
        };

        async.waterfall([
            examineContract,
            compareDat,
            setRateCodSelectData
        ], function (err, result) {
            callback(err, result);
        });

        function examineContract(cb) {
            if (ls_beginDat != "" && ls_endDat != "" && ls_rateCod != "" && ls_beginDat != ls_oldValue) {
                lo_param.rate_cod = ls_rateCod;
                queryAgent.query("QRY_CONTRACT_EXIST", lo_param, function (err, getResult) {
                    if (err) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = err;
                        cb(lo_error, lo_result);
                    }
                    else if (getResult.order_rate_count == 0) {
                        lo_result.success = false;
                        lo_result.effectValues = {begin_dat: ls_oldValue, rate_cod: "", ratecod_nam: ""};
                        cb(lo_error, lo_result);
                    }
                    else {
                        cb(lo_error, ls_beginDat);
                    }
                });
            }
            else {
                cb(lo_error, lo_result);
            }
        }

        function compareDat(begin_dat, cb) {
            queryAgent.query("QRY_RENT_DAT_HQ", lo_param, function (err, getResult) {
                if (err) {
                    lo_result.success = false;
                    lo_error = ErrorClass();
                    lo_error.errorMsg = err;
                    cb(lo_error, lo_result);
                }
                else {
                    if (moment(new Date(begin_dat)).diff(moment(new Date(getResult.rent_dat_hq)), "days") < 0) {
                        lo_result.showAlert = true;
                        lo_result.alertMsg = commandRules.getMsgByCod("pms61msg2", session.locale);
                        if (ls_beginDat != "" && ls_endDat != "" && moment(new Date(begin_dat)).diff(moment(new Date(ls_endDat)), "days") > 0) {
                            lo_result.success = false;
                            lo_result.effectValues = {begin_dat: ls_oldValue};
                            lo_error = new ErrorClass();
                            lo_error.errorMsg = commandRules.getMsgByCod("pms61msg15", session.locale);
                        }
                        cb(lo_error, lo_result);
                    }
                    else {
                        cb(lo_error, lo_result);
                    }
                }
            });
        }

        function setRateCodSelectData(result, cb) {
            if (ls_beginDat != "" && ls_endDat != "" && ls_hotelCod != "") {
                queryAgent.queryList("QRY_CONTRACT_DT_RATE_COD", lo_param, 0, 0, function (err, getResult) {
                    if (err) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = err;
                        cb(lo_error, lo_result);
                    }
                    else {
                        lo_result.selectOptions = getResult;
                        lo_result.selectField = ["rate_cod"];
                        cb(lo_error, lo_result);
                    }
                });
            }
            else {
                cb(lo_error, lo_result);
            }
        }
    },

    /**
     * 合約內容 結束日期
     * 1.合約期間檢查:
     * 如果『合約起始日』、『合約終止日』、『參考房價代號』3欄位都有值,如果sql檢查=0,訊息『相同館別及房價代號之合約期間不可重覆』,起始日回復到舊值
     * 2.合約內容 參考房價代號下拉資料
     * @param postData
     * @param session
     * @param callback
     */
    r_ContractdtEnddat: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let ls_beginDat = postData.rowData.begin_dat || "";
        let ls_endDat = postData.rowData.end_dat || "";
        let ls_rateCod = postData.rowData.rate_cod || "";
        let ls_hotelCod = postData.rowData.hotel_cod || "";
        let ls_oldValue = postData.oldValue == "" ? postData.rowData[postData.validateField] : postData.oldValue;
        let lo_param = {
            athena_id: session.user.athena_id,
            hotel_cod: ls_hotelCod,
            end_dat: moment(new Date(ls_endDat)).format("YYYY/MM/DD"),
            begin_dat: moment(new Date(ls_beginDat)).format("YYYY/MM/DD")
        };

        async.waterfall([
            examineContract,
            compareDat,
            setRateCodSelectData
        ], function (err, result) {
            callback(lo_error, lo_result);
        });

        function examineContract(cb) {
            if (ls_beginDat != "" && ls_endDat != "" && ls_rateCod != "" && ls_endDat != ls_oldValue) {
                lo_param.rate_cod = ls_rateCod;
                queryAgent.query("QRY_CONTRACT_EXIST", lo_param, function (err, getResult) {
                    if (err) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = err;
                        cb(lo_error, lo_result);
                    }
                    else if (getResult.order_rate_count == 0) {
                        lo_result.success = false;
                        lo_result.effectValues = {end_dat: ls_oldValue, rate_cod: "", ratecod_nam: ""};
                        cb(lo_error, lo_result);
                    }
                    else {
                        cb(lo_error, ls_beginDat);
                    }
                });
            }
            else {
                cb(lo_error, lo_result);
            }
        }

        function compareDat(result, cb) {
            if (ls_beginDat != "" && ls_endDat != "" && moment(new Date(ls_beginDat)).diff(moment(new Date(ls_endDat)), "days") > 0) {
                lo_result.success = false;
                lo_result.effectValues = {end_dat: ls_oldValue};
                lo_error = new ErrorClass();
                lo_error.errorMsg = commandRules.getMsgByCod("pms61msg15", session.locale);
                cb(lo_error, lo_result);
            }
            else {
                cb(lo_error, lo_result);
            }
        }

        function setRateCodSelectData(result, cb) {
            if (ls_beginDat != "" && ls_endDat != "" && ls_hotelCod != "") {
                queryAgent.queryList("QRY_CONTRACT_DT_RATE_COD", lo_param, 0, 0, function (err, getResult) {
                    if (err) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = err;
                        cb(lo_error, lo_result);
                    }
                    else {
                        lo_result.selectOptions = getResult;
                        lo_result.selectField = ["rate_cod"];
                        cb(lo_error, lo_result);
                    }
                });
            }
            else {
                cb(lo_error, lo_result);
            }
        }
    },

    /**
     * 合約內容 館別
     * 1.合約內容 參考房價代號下拉資料
     * 2.合約內容 餐廳折扣下拉資料
     * @param postData
     * @param session
     * @param callback
     */
    r_ContractHotelCod: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let ls_beginDat = postData.rowData.begin_dat;
        let ls_endDat = postData.rowData.end_dat || "";
        let ls_rateCod = postData.rowData.rate_cod || "";
        let ls_hotelCod = postData.rowData.hotel_cod || "";
        let lo_oldValue = postData.oldValue == "" ? postData.rowData[postData.validateField] : postData.oldValue;
        let lo_param = {
            athena_id: session.user.athena_id,
            hotel_cod: ls_hotelCod,
            end_dat: moment(new Date(ls_endDat)).format("YYYY/MM/DD"),
            begin_dat: moment(new Date(ls_beginDat)).format("YYYY/MM/DD")
        };

        async.waterfall([
            setRateCodSelectData,
            setRsdiscCodSelectData
        ], function (err, result) {
            callback(err, result);
        });

        function setRateCodSelectData(cb) {
            if (ls_beginDat != "" && ls_endDat != "" && ls_hotelCod != "") {
                queryAgent.queryList("QRY_CONTRACT_DT_RATE_COD", lo_param, 0, 0, function (err, getResult) {
                    if (err) {
                        lo_result.success = false;
                        lo_error = ErrorClass();
                        lo_error.errorMsg = err;
                        cb(lo_error, lo_result);
                    }
                    else {
                        lo_result.multiSelectOptions.rate_cod = getResult;
                        lo_result.selectField.push("rate_cod");
                        cb(lo_error, lo_result);
                    }
                });
            }
            else {
                lo_result.multiSelectOptions.rate_cod = [];
                lo_result.selectField.push("rate_cod");
                cb(lo_error, lo_result);
            }
        }

        function setRsdiscCodSelectData(result, cb) {
            queryAgent.queryList("QRY_CONTRACT_DT_RSDISC_COD", lo_param, 0, 0, function (err, getResult) {
                if (err) {
                    lo_result.success = false;
                    lo_error = ErrorClass();
                    lo_error.errorMsg = err;
                    cb(lo_error, lo_result);
                }
                else {
                    lo_result.multiSelectOptions.rsdisc_cod = getResult;
                    lo_result.selectField.push("rsdisc_cod");
                    cb(lo_error, lo_result);
                }
            });
        }
    },

    /**
     * 合約內容 參考房價代號
     * 1.合約期間檢查:
     * 如果『合約起始日』、『合約終止日』、『參考房價代號』3欄位都有值,如果sql檢查=0,訊息『相同館別及房價代號之合約期間不可重覆』,起始日回復到舊值
     * 2.參考房價代號下拉資料
     * 3.參考餐廳折扣下拉資料
     * 4.房價代號帶回房價名稱
     * 5.檢查相同館別及房價代號之合約期間不可重覆
     * @param postData
     * @param session
     * @param callback
     */
    r_ContractdtRatecod: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let ls_rateCod = postData.rowData.rate_cod;
        let ls_beginDat = postData.rowData.begin_dat || "";
        let ls_endDat = postData.rowData.end_dat || "";
        let ls_hotelCod = postData.rowData.hotel_cod || "";
        let ls_oldValue = postData.oldValue;

        try {
            let la_rateCodSelectData = [];
            let la_rsdiscCodSelectData = [];

            if (ls_beginDat == "" || ls_endDat == "") {
                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = commandRules.getMsgByCod("pms61msg13", session.locale);
                ls_rateCod = "";
                lo_result.effectValues = {rate_cod: ls_rateCod};
            }
            else {
                ls_beginDat = moment(new Date(ls_beginDat)).format("YYYY/MM/DD");
                ls_endDat = moment(new Date(ls_endDat)).format("YYYY/MM/DD");

                //合約期間檢查:
                let lo_examineContract = await new Promise((resolve, reject) => {
                    if (ls_beginDat != "" && ls_endDat != "" && ls_rateCod != "" && ls_rateCod != ls_oldValue) {
                        queryAgent.query("QRY_CONTRACT_EXIST", {
                            athena_id: session.user.athena_id,
                            hotel_cod: ls_hotelCod,
                            end_dat: ls_endDat,
                            begin_dat: ls_beginDat,
                            rate_cod: ls_rateCod
                        }, function (err, getResult) {
                            if (err) {
                                reject(err)
                            }
                            else {
                                resolve(getResult);
                            }
                        });
                    }
                });
                if (lo_examineContract.order_rate_count == 0) {
                    ls_rateCod = "";
                    lo_result.success = false;
                    lo_result.effectValues = {rate_cod: ls_rateCod};
                }
                //參考房價代號下拉資料
                la_rateCodSelectData = await new Promise((resolve, reject) => {
                    if (ls_beginDat != "" && ls_endDat != "" && ls_hotelCod != "") {
                        queryAgent.queryList("QRY_CONTRACT_DT_RATE_COD", {
                            athena_id: session.user.athena_id,
                            hotel_cod: ls_hotelCod,
                            end_dat: ls_endDat,
                            begin_dat: ls_beginDat
                        }, 0, 0, function (err, getResult) {
                            if (err) {
                                reject(err)
                            }
                            else {
                                resolve(getResult);
                            }
                        });
                    }
                });
                //參考餐廳折扣下拉資料
                la_rsdiscCodSelectData = await new Promise((resolve, reject) => {
                    queryAgent.queryList("QRY_CONTRACT_DT_RSDISC_COD", {
                        athena_id: session.user.athena_id,
                        hotel_cod: ls_hotelCod,
                        end_dat: ls_endDat,
                        begin_dat: ls_beginDat
                    }, 0, 0, function (err, getResult) {
                        if (err) {
                            reject(err)
                        }
                        else {
                            resolve(getResult);
                        }
                    });
                });

                lo_result.selectField = ["rate_cod", "rsdisc_cod"];
                lo_result.multiSelectOptions.rate_cod = la_rateCodSelectData;
                lo_result.multiSelectOptions.rsdisc_cod = la_rsdiscCodSelectData;

                // 檢查相同館別及房價代號之合約期間不可重覆
                let la_examData = JSON.parse(JSON.stringify(postData.allRowData));
                for (let i = 0; i < la_examData.length; i++) {
                    for (let j = 0; j < i; j++) {
                        let lo_nowData = la_examData[i];
                        let lo_compareData = la_examData[j];
                        if (lo_compareData.rate_cod == lo_nowData.rate_cod && lo_compareData.hotel_cod == lo_nowData.hotel_cod) {
                            let ls_nowBeginDat = moment(new Date(lo_nowData.begin_dat));
                            let ls_nowEndDat = moment(new Date(lo_nowData.end_dat));
                            let ls_compareBeginDat = moment(new Date(lo_compareData.begin_dat));
                            let ls_compareEndDat = moment(new Date(lo_compareData.begin_dat));
                            let lb_chkOverLap = commandRules.chkDateIsBetween(ls_compareBeginDat, ls_compareEndDat, ls_nowBeginDat, ls_nowEndDat);

                            if (lb_chkOverLap) {
                                lo_result.success = false;
                                lo_error = new ErrorClass();
                                lo_error.errorMsg = commandRules.getMsgByCod("pms61msg1", session.locale);
                                break;
                            }
                        }
                    }
                }
            }

            //房價代號帶回房價名稱
            let ls_ratecodNam = "";
            if (ls_rateCod != "") {
                ls_ratecodNam = await new Promise((resolve, reject) => {
                    queryAgent.query("QRY_RATE_NAM", {rate_cod: ls_rateCod}, function (err, getResult) {
                        if (err) {
                            reject(err)
                        }
                        else {
                            resolve(getResult);
                        }
                    });
                });
            }

            lo_result.effectValues = _.extend(lo_result.effectValues, {ratecod_nam: _.isNull(ls_ratecodNam) ? "" : ls_ratecodNam.ratecod_nam});
            lo_result.selectField = ["rate_cod", "rsdisc_cod"];
            lo_result.multiSelectOptions.rate_cod = la_rateCodSelectData;
            lo_result.multiSelectOptions.rsdisc_cod = la_rsdiscCodSelectData;

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
     * 相關人員 切換主要聯絡人
     * 1.主要聯絡人僅可指定予一筆相關人員資料，於勾選欄位時自動切換
     * 2.主要聯絡人非必要勾選，可無指定主要聯絡人
     * 3.主要聯絡人的seq_nos要入到主檔cust_mn.atten_cod
     * @param postData
     * @param session
     * @param callback
     */
    r_primary_pers: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        if (postData.rowData.primary_pers == 'Y') {
            let ln_clearIndex = Number(postData.rowIndex);
            let la_otherRowData = JSON.parse(JSON.stringify(postData.allRowData));
            la_otherRowData.splice(ln_clearIndex, 1);
            let lo_effectRow = _.findWhere(la_otherRowData, {primary_pers: 'Y'});

            if (!_.isUndefined(lo_effectRow)) {
                let ln_effectIndex = _.findIndex(postData.allRowData, {seq_nos: lo_effectRow.seq_nos});
                if (ln_effectIndex > -1) {
                    lo_result.effectValues = {effectIndex: ln_effectIndex, primary_pers: 'N'};
                }
            }
        }

        callback(lo_error, lo_result);
    },

    /**
     * 相關人員 人員名稱
     *1.切換主要聯絡人
     * @param postData
     * @param session
     * @param callback
     */
    sel_cust_idx_cust_mn_pers_dt: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            //帶入所選擇的人員資料
            let lo_params = {athena_id: session.user.athena_id};
            let ls_altName = postData.newValue;

            let lo_altNameSelectData = await new Promise((resolve, reject) => {
                if (ls_altName != "") {
                    lo_params.alt_nam = ls_altName;
                }
                queryAgent.query("SEL_CUST_IDX_CUST_MN_PERS_DT", lo_params, function (err, getResult) {
                    if (err) {
                        reject(err)
                    }
                    else {
                        resolve(getResult);
                    }
                });
            });

            lo_result.effectValues = _.extend(lo_altNameSelectData);
            lo_result.effectValues.dept_nam = "";
            lo_result.effectValues.role_cod = "";
            lo_result.effectValues.remark = "";
            lo_result.effectValues.quit_dat = "";

            //檢查主要聯絡人
            if (postData.rowData.primary_pers == 'Y') {
                let ln_clearIndex = Number(postData.rowIndex);
                let la_otherRowData = JSON.parse(JSON.stringify(postData.allRowData));
                la_otherRowData.splice(ln_clearIndex, 1);
                let lo_effectRow = _.findWhere(la_otherRowData, {primary_pers: 'Y'});

                if (!_.isUndefined(lo_effectRow)) {
                    let ln_effectIndex = _.findIndex(postData.allRowData, {seq_nos: lo_effectRow.seq_nos});
                    if (ln_effectIndex > -1) {
                        lo_result.effectValues = {effectIndex: ln_effectIndex, primary_pers: 'N'};
                    }
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
     * 相關人員預設值
     * 取得相關人員
     * @param postData
     * @param session
     * @param callback
     */
    defaultRelatedPerson: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let apiParams = {
            "REVE-CODE": "BAC0900805",
            "func_id": "0000",
            "athena_id": session.user.athena_id,
            "comp_cod": "NULL",
            "hotel_cod": session.user.hotel_cod,
            "sys_cod": "CSP",
            "nos_nam": "CUST_COD",
            "link_dat": "2000/01/01"
        };

        tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
            if (apiErr || !data) {
                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = apiErr;
            }
            else if (data["RETN-CODE"] != "0000") {
                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = data["RETN-CODE-DESC"];
                console.error(data["RETN-CODE-DESC"]);
            }
            else {
                let ls_cod = data["SERIES_NOS"].toString();
                let ls_perCustCod = "CSP" + _s.lpad(ls_cod, 13, '0') + session.user.hotel_cod.trim();
                let la_allRows = _.isUndefined(postData.allRows) ? [{}] : _.sortBy(postData.allRows, "seq_nos");
                let ln_seq_nos = Number(la_allRows[la_allRows.length - 1].seq_nos) || 0;
                lo_result.defaultValues = {
                    athena_id: session.user.athena_id,
                    per_cust_cod: ls_perCustCod,
                    seq_nos: ln_seq_nos + 1,
                    cust_cod: postData.mnRowData.cust_cod
                };
            }
            callback(lo_error, lo_result);
        });
    },

    /**
     * 相關人員刪除前檢查
     * 主要聯絡人打勾，則不允許刪除 訊息「此筆資料設為主要聯絡人，不可刪除」
     * @param postData
     * @param session
     * @param callback
     */
    deleteRelatedPerson: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        if (postData.singleRowData.primary_pers == 'Y') {
            lo_result.success = false;
            lo_error = new ErrorClass();
            lo_error.errorMsg = commandRules.getMsgByCod("pms61msg7", session.locale);
        }

        callback(lo_error, lo_result);
    },

    /**
     * 合約內容刪除前檢查
     * 1.檢查訂房卡資料
     * 2.檢查住客資料
     * @param postData
     * @param session
     * @param callback
     */
    deleteContractContent: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let lo_param = {
            athena_id: session.user.athena_id,
            cust_cod: postData.singleRowData.cust_cod,
            hotel_cod: postData.deleteData[0].hotel_cod,
            rate_cod: postData.deleteData[0].rate_cod
        };

        async.waterfall([
            qryOrderMn,//檢查訂房卡資料，房價代號使否已被使用
            qryGuestMn//檢查住客資料，房價代號使否已被使用
        ], function (err, result) {
            callback(err, result);
        });

        function qryOrderMn(cb) {
            queryAgent.query("CHK_RATE_COD_IS_EXIST_IN_ORDER_MN", lo_param, function (err, getResult) {
                if (err) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = err;
                    cb(lo_error, lo_result);
                }
                else {
                    if (getResult.order_rate_Count > 0) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms61msg3", session.locale);
                        cb(lo_error, lo_result);
                    }
                    else {
                        cb(lo_error, lo_result);
                    }
                }
            });
        }

        function qryGuestMn(result, cb) {
            queryAgent.query("CHK_RATE_COD_IS_EXIST_IN_GUEST_MN", lo_param, function (err, getResult) {
                if (err) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "sql err";
                    cb(lo_error, lo_result);
                }
                else {
                    if (getResult.order_rate_Count > 0) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms61msg4", session.locale);
                        ;
                        cb(lo_error, lo_result);
                    }
                    else {
                        cb(lo_error, lo_result);
                    }
                }
            });
        }
    },

    /**
     * 公司狀態是否可以為刪除
     * @param postData
     * @param session
     * @param callback
     */
    r_1010_CustmnStatuscod: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        if (postData.singleRowData.cust_mn_status_cod == 'D') {
            async.waterfall([
                qryFitCod,
                qryOfficialCustCod
            ], function (err, result) {
                callback(lo_error, lo_result);
            });
        }
        else {

            callback(lo_error, lo_result);
        }

        function qryFitCod(cb) {
            queryAgent.query("QRY_FIT_COD", {
                athena_id: session.user.athena_id,
                cust_cod: postData.singleRowData.cust_cod
            }, function (err, getResult) {
                if (err) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = err;
                    cb(lo_error, lo_result);
                }
                else {
                    if (getResult.fit_cod_count > 0) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms61msg5", session.locale);
                        cb(lo_error, lo_result);
                    }
                    else {
                        cb(lo_error, lo_result);
                    }
                }
            });
        }

        function qryOfficialCustCod(result, cb) {
            queryAgent.query("QRY_OFFICIAL_WEB_CUST_COD", {
                athena_id: session.user.athena_id,
                cust_cod: postData.singleRowData.cust_cod
            }, function (err, getResult) {
                if (err) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = err;
                    cb(lo_error, lo_result);
                }
                else {
                    if (getResult.web_cust_cod_count > 0) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms61msg6", session.locale);
                        cb(lo_error, lo_result);
                    }
                    else {
                        cb(lo_error, lo_result);
                    }
                }
            });
        }

    },

    /**
     * 存檔(新增)
     * 1.公司編號不可重複
     * 2.公司編號不可與財務應收客戶重複
     * 3.檢查相同館別及房價代號之合約期間不可重覆
     * 4.新增cust_idx
     * @param postData
     * @param session
     * @param callback
     */
    r_compMnAdd: function (postData, session, callback) {
        let userInfo = session.user;
        let lo_mnSaveData = postData["tmpCUD"]["createData"][0] || {};
        let la_dtCreateData = postData["tmpCUD"]["dt_createData"] || [];

        let lo_result = new ReturnClass();
        let lo_error = null;

        async.waterfall([
            qryCustMn,
            qryFincustMn,
            qryContract,
            addCustIdx
        ], function (err, result) {
            callback(err, result);
        });

        function qryCustMn(cb) {
            queryAgent.query("CHK_CUST_MN_IS_EXIST", {
                athena_id: userInfo.athena_id,
                show_cod: lo_mnSaveData.show_cod,
                cust_cod: lo_mnSaveData.cust_cod
            }, function (err, getResult) {
                if (err) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "sql err";
                    cb(lo_error, lo_result);
                }
                else {
                    if (getResult.cust_mn_count > 0) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        let ls_errMsg = commandRules.getMsgByCod("pms61msg8", session.locale);
                        lo_error.errorMsg = _s.sprintf(ls_errMsg, lo_mnSaveData.show_cod);
                        cb(lo_error, lo_result);
                    }
                    else {
                        cb(lo_error, lo_result);
                    }
                }
            });
        }

        function qryFincustMn(data, cb) {
            queryAgent.query("CHK_FIN_CUST_MN_IS_EXIST_", {
                athena_id: userInfo.athena_id,
                show_cod: lo_mnSaveData.show_cod,
                cust_cod: lo_mnSaveData.cust_cod
            }, function (err, getResult) {
                if (err) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "sql err";
                    cb(lo_error, lo_result);
                }
                else {
                    if (getResult.fincust_mn_count > 0) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        let ls_errMsg = commandRules.getMsgByCod("pms61msg9", session.locale);
                        lo_error.errorMsg = _s.sprintf(ls_errMsg, lo_mnSaveData.show_cod);
                        cb(lo_error, lo_result);
                    }
                    else {
                        cb(lo_error, lo_result);
                    }
                }
            });
        }

        function qryContract(data, cb) {
            let la_examData = [];
            _.each(la_dtCreateData, function (lo_dtCreateData) {
                if (Number(lo_dtCreateData.tab_page_id) == 4) {
                    la_examData.push(lo_dtCreateData);
                }
            });

            for (let i = 0; i < la_examData.length; i++) {
                for (let j = 0; j < i; j++) {
                    let lo_nowData = la_examData[i];
                    let lo_compareData = la_examData[j];
                    if (lo_compareData.rate_cod == lo_nowData.rate_cod && lo_compareData.hotel_cod == lo_nowData.hotel_cod) {
                        let ls_nowBeginDat = moment(new Date(lo_nowData.begin_dat));
                        let ls_nowEndDat = moment(new Date(lo_nowData.end_dat));
                        let ls_compareBeginDat = moment(new Date(lo_compareData.begin_dat));
                        let ls_compareEndDat = moment(new Date(lo_compareData.begin_dat));
                        let lb_chkOverLap = commandRules.chkDateIsBetween(ls_compareBeginDat, ls_compareEndDat, ls_nowBeginDat, ls_nowEndDat);

                        if (lb_chkOverLap) {
                            lo_result.success = false;
                            lo_error = new ErrorClass();
                            lo_error.errorMsg = commandRules.getMsgByCod("pms61msg1", session.locale);
                            break;
                        }
                    }
                }
            }
            cb(lo_error, lo_result);
        }

        function addCustIdx(data, cb) {
            //cust_mn資料 儲存cust_idx
            lo_result.extendExecDataArrSet.push({
                function: '1',
                table_name: 'cust_idx',
                athena_id: userInfo.athena_id,
                cust_cod: lo_mnSaveData.cust_cod,
                show_cod: lo_mnSaveData.show_cod,
                cust_sta: lo_mnSaveData.status_cod,
                alt_nam: lo_mnSaveData.cust_idx_alt_nam,
                uni_cod: lo_mnSaveData.cust_idx_uni_cod,
                uni_title: lo_mnSaveData.cust_idx_uni_titile,
                from_table: 'CUST_MN',
                cust_typ: 'N',
                office_tel: lo_mnSaveData.cust_idx_office_tel,
                fax_nos: lo_mnSaveData.cust_idx_fax_nos,
                zip_cod: lo_mnSaveData.cust_idx_zip_cod,
                add_rmk: lo_mnSaveData.cust_idx_add_rmk,
                credit_sta: lo_mnSaveData.cust_idx_credit_sta,
                credit_amt: lo_mnSaveData.cust_idx_credit_amt,
                ar_amt: lo_mnSaveData.cust_idx_ar_amt,
                event_time: moment().format("YYYY/MM/DD HH:mm:ss"),
                kindOfRel: 'dt'
            });
            //cust_mn_pers_dt 資料 儲存cust_idx
            _.each(la_dtCreateData, function (lo_dtCreateData, idx) {
                if (Number(lo_dtCreateData.tab_page_id) == 2) {
                    lo_result.extendExecDataArrSet.push({
                        function: '1',
                        table_name: 'cust_idx',
                        athena_id: userInfo.athena_id,
                        cust_cod: lo_dtCreateData.per_cust_cod,
                        alt_nam: lo_dtCreateData.alt_nam,
                        from_table: 'CUST_MN_PERS_DT',
                        cust_typ: 'H',
                        office_tel: lo_dtCreateData.office_tel,
                        fax_nos: lo_dtCreateData.fax_nos,
                        mobile_nos: lo_dtCreateData.mobile_nos,
                        home_tel: lo_dtCreateData.home_tel,
                        e_mail: lo_dtCreateData.e_mail,
                        birth_dat: lo_dtCreateData.birth_dat,
                        sex_typ: lo_dtCreateData.sex_typ,
                        show_cod: lo_dtCreateData.per_cust_cod
                    });
                }
            });

            cb(lo_error, lo_result);
        }
    },

    /**
     * 存檔(編輯)
     * 1.公司編號不可重複
     * 2.公司編號不可與財務應收客戶重複
     * 3.檢查拜訪紀錄是否重複
     * 4.檢查業務備註是否重複
     * 5檢查相同館別及房價代號之合約期間不可重覆
     * 6.修改cust_idx
     * 7.刪除cust_idx(相關人員)
     * @param postData
     * @param session
     * @param callback
     */
    r_compMnUpdate: function (postData, session, callback) {
        let userInfo = session.user;
        let ln_counter = 0;
        let lo_mnSaveData = postData["tmpCUD"]["updateData"][0] || {};
        let lo_mnOriData = postData["tmpCUD"]["oriData"][0] || {};
        let la_dtCreateData = postData["tmpCUD"]["dt_createData"] || [];
        let la_dtUpdateData = postData["tmpCUD"]["dt_updateData"] || [];
        let la_dtDeleteData = postData["tmpCUD"]["dt_deleteData"] || [];

        let lo_result = new ReturnClass();
        let lo_error = null;

        async.waterfall([
            qryCustMn,
            qryFincustMn,
            qryVisitRecord,
            qryRemarkDt,
            qryContract,
            updateCustIdx,
            deleteCustIdx
        ], function (err, result) {
            callback(err, result);
        });

        function qryCustMn(cb) {
            queryAgent.query("CHK_CUST_MN_IS_EXIST", {
                athena_id: userInfo.athena_id,
                show_cod: lo_mnSaveData.show_cod,
                cust_cod: lo_mnSaveData.cust_cod
            }, function (err, getResult) {
                if (err) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = err;
                    cb(lo_error, lo_result);
                }
                else {
                    if (getResult.cust_mn_count > 0) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        let ls_errMsg = commandRules.getMsgByCod("pms61msg8", session.locale);
                        lo_error.errorMsg = _s.sprintf(ls_errMsg, lo_mnSaveData.show_cod);
                        cb(lo_error, lo_result);
                    }
                    else {
                        cb(lo_error, lo_result);
                    }
                }
            });
        }

        function qryFincustMn(data, cb) {
            queryAgent.query("CHK_FIN_CUST_MN_IS_EXIST_", {
                athena_id: userInfo.athena_id,
                show_cod: lo_mnSaveData.show_cod,
                cust_cod: lo_mnSaveData.cust_cod
            }, function (err, getResult) {
                if (err) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = err;
                    cb(lo_error, lo_result);
                }
                else {
                    if (getResult.fincust_mn_count > 0) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        let ls_errMsg = commandRules.getMsgByCod("pms61msg9", session.locale);
                        lo_error.errorMsg = _s.sprintf(ls_errMsg, lo_mnSaveData.show_cod);
                        cb(lo_error, lo_result);
                    }
                    else {
                        cb(lo_error, lo_result);
                    }
                }
            });
        }

        function qryVisitRecord(data, cb) {
            let la_examData = [];
            let la_returnMsg = [];
            _.each(la_dtCreateData, function (lo_dtCreateData) {
                if (Number(lo_dtCreateData.tab_page_id == 5)) {
                    la_examData.push(lo_dtCreateData);
                }
            });
            if (la_examData.length > 0) {
                ln_counter = 0;
                _.each(la_examData, function (lo_examData) {
                    let lo_params = {
                        athena_id: userInfo.athena_id,
                        cust_cod: lo_examData.cust_cod,
                        visit_typ: lo_examData.visit_typ,
                        visit_dat: lo_examData.visit_dat
                    };
                    queryAgent.query("QRY_PS_VISIT_DT_SINGLE", lo_params, function (err, result) {
                        ln_counter++;
                        if (err) {
                            lo_error = new ErrorClass();
                            lo_result.success = false;
                            lo_error.errorMsg = err;
                            lo_error.errorCod = "1111";
                            cb(lo_error, lo_result);
                        }
                        else if (result) {
                            la_returnMsg.push("公司編號: " + result.show_cod.trim() + " 公司名稱: " + result.cust_nam + "，拜訪計畫已存在\n");
                        }

                        if (ln_counter == la_examData.length) {
                            if (la_returnMsg.length > 0) {
                                lo_error = new ErrorClass();
                                lo_result.success = false;
                                _.each(la_returnMsg, function (ls_returnMsg) {
                                    lo_error.errorMsg = lo_error.errorMsg + ls_returnMsg;
                                });
                            }
                            cb(lo_error, lo_result);
                        }
                    });
                });
            }
            else {
                cb(lo_error, lo_result);
            }
        }

        async function qryRemarkDt(data, cb) {
            let la_examData = [];
            _.each(la_dtCreateData, function (lo_dtCreateData) {
                if (Number(lo_dtCreateData.tab_page_id == 6)) {
                    la_examData.push(lo_dtCreateData);
                }
            });
            try {
                if (la_examData.length > 0) {
                    for (let i = 0; i < la_examData.length; i++) {
                        let lo_examData = la_examData[i];
                        let lo_params = {
                            athena_id: userInfo.athena_id,
                            cust_cod: lo_examData.cust_cod,
                            remark_typ: lo_examData.remark_typ
                        };

                        let ln_remarkDtExistNum = await new Promise((resolve, reject) => {
                            queryAgent.query("QRY_REMARK_DT_SINGLE", lo_params, function (err, result) {
                                if (err) {
                                    reject(err)
                                }
                                else {
                                    resolve(result);
                                }
                            });
                        });
                        if (ln_remarkDtExistNum.remark_dt_count > 0) {
                            lo_error = new ErrorClass();
                            lo_result.success = false;
                            let ls_errMsg = commandRules.getMsgByCod("pms61msg14", session.locale);
                            lo_error.errorMsg = _s.sprintf(ls_errMsg, lo_examData.remark_typ_rmk);
                        }
                    }
                }
            }
            catch (err) {
                console.log(err);
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = err;
            }
            cb(lo_error, lo_result);
        }

        function qryContract(data, cb) {
            let la_examData = [];
            _.each(la_dtCreateData, function (lo_dtCreateData) {
                if (Number(lo_dtCreateData.tab_page_id) == 4) {
                    la_examData.push(lo_dtCreateData);
                }
            });
            _.each(la_dtUpdateData, function (lo_dtUpdateData) {
                if (Number(lo_dtUpdateData.tab_page_id) == 4) {
                    la_examData.push(lo_dtUpdateData);
                }
            });

            for (let i = 0; i < la_examData.length; i++) {
                for (let j = 0; j < i; j++) {
                    let lo_nowData = la_examData[i];
                    let lo_compareData = la_examData[j];
                    if (lo_compareData.rate_cod == lo_nowData.rate_cod && lo_compareData.hotel_cod == lo_nowData.hotel_cod) {
                        let ls_nowBeginDat = moment(lo_nowData.begin_dat).format("YYYY/MM/DD");
                        let ls_nowEndDat = moment(lo_nowData.end_dat).format("YYYY/MM/DD");
                        let ls_compareBeginDat = moment(lo_compareData.begin_dat).format("YYYY/MM/DD");
                        let ls_compareEndDat = moment(lo_compareData.begin_dat).format("YYYY/MM/DD");
                        let lb_chkOverLap = commandRules.chkDateIsBetween(ls_compareBeginDat, ls_compareEndDat, ls_nowBeginDat, ls_nowEndDat);

                        if (lb_chkOverLap) {
                            lo_result.success = false;
                            lo_error = new ErrorClass();
                            lo_error.errorMsg = commandRules.getMsgByCod("pms61msg1", session.locale);
                            break;
                        }
                    }
                }
            }
            cb(lo_error, lo_result);
        }

        function updateCustIdx(data, cb) {
            //cust_mn資料 儲存cust_idx
            lo_result.extendExecDataArrSet.push({
                function: '2',
                table_name: 'cust_idx',
                condition: [
                    {
                        key: 'athena_id',
                        operation: "=",
                        value: userInfo.athena_id
                    },
                    {
                        key: 'cust_cod',
                        operation: "=",
                        value: lo_mnOriData.cust_cod
                    },
                    {
                        key: 'show_cod',
                        operation: "=",
                        value: lo_mnOriData.show_cod
                    }
                ],
                athena_id: userInfo.athena_id,
                cust_cod: lo_mnSaveData.cust_cod,
                show_cod: lo_mnSaveData.show_cod,
                alt_nam: lo_mnSaveData.cust_idx_alt_nam,
                uni_cod: lo_mnSaveData.cust_idx_uni_cod,
                uni_title: lo_mnSaveData.cust_idx_uni_titile,
                from_table: 'CUST_MN',
                cust_typ: 'N',
                office_tel: lo_mnSaveData.cust_idx_office_tel,
                fax_nos: lo_mnSaveData.cust_idx_fax_nos,
                zip_cod: lo_mnSaveData.cust_idx_zip_cod,
                add_rmk: lo_mnSaveData.cust_idx_add_rmk,
                credit_sta: lo_mnSaveData.cust_idx_credit_sta,
                credit_amt: lo_mnSaveData.cust_idx_credit_amt,
                ar_amt: lo_mnSaveData.cust_idx_ar_amt,
                upd_dat: moment().format("YYYY/MM/DD"),
                upd_usr: userInfo.usr_id,
                event_time: moment().format("YYYY/MM/DD HH:mm:ss"),
                kindOfRel: 'dt'
            });
            //cust_mn_pers_dt 資料 儲存cust_idx
            _.each(la_dtCreateData, function (lo_dtCreateData) {
                if (Number(lo_dtCreateData.tab_page_id) == 2) {
                    lo_result.extendExecDataArrSet.push({
                        function: '1',
                        table_name: 'cust_idx',
                        athena_id: userInfo.athena_id,
                        cust_cod: lo_dtCreateData.per_cust_cod,
                        alt_nam: lo_dtCreateData.alt_nam,
                        from_table: 'CUST_MN_PERS_DT',
                        cust_typ: 'H',
                        office_tel: lo_dtCreateData.office_tel,
                        fax_nos: lo_dtCreateData.fax_nos,
                        mobile_nos: lo_dtCreateData.mobile_nos,
                        home_tel: lo_dtCreateData.home_tel,
                        e_mail: lo_dtCreateData.e_mail,
                        birth_dat: lo_dtCreateData.birth_dat,
                        sex_typ: lo_dtCreateData.sex_typ,
                        show_cod: lo_dtCreateData.per_cust_cod
                    });
                }
            });
            _.each(la_dtUpdateData, function (lo_dtUpdateData) {
                if (Number(lo_dtUpdateData.tab_page_id) == 2) {
                    lo_result.extendExecDataArrSet.push({
                        function: '2',
                        table_name: 'cust_idx',
                        condition: [
                            {
                                key: 'athena_id',
                                operation: "=",
                                value: userInfo.athena_id
                            },
                            {
                                key: 'cust_cod',
                                operation: "=",
                                value: lo_dtUpdateData.per_cust_cod
                            },
                            {
                                key: 'show_cod',
                                operation: "=",
                                value: lo_dtUpdateData.per_cust_cod
                            }
                        ],
                        athena_id: userInfo.athena_id,
                        cust_cod: lo_dtUpdateData.per_cust_cod,
                        alt_nam: lo_dtUpdateData.alt_nam,
                        from_table: 'CUST_MN_PERS_DT',
                        cust_typ: 'H',
                        office_tel: lo_dtUpdateData.office_tel,
                        fax_nos: lo_dtUpdateData.fax_nos,
                        mobile_nos: lo_dtUpdateData.mobile_nos,
                        home_tel: lo_dtUpdateData.home_tel,
                        e_mail: lo_dtUpdateData.e_mail,
                        birth_dat: lo_dtUpdateData.birth_dat,
                        sex_typ: lo_dtUpdateData.sex_typ
                    });
                }
            });

            cb(lo_error, lo_result);
        }

        function deleteCustIdx(data, cb) {
            let ln_examCustCount = 0;
            let ln_examGhistCount = 0;
            let la_rpData = [];

            if (la_dtDeleteData.length > 0) {
                //取出相關人員資料
                _.each(la_dtDeleteData, function (lo_dtDeleteData) {
                    if (Number(lo_dtDeleteData.tab_page_id) == 2) {
                        la_rpData.push(lo_dtDeleteData);
                    }
                });

                if (la_rpData.length > 0) {
                    async.waterfall([
                        //檢查此相關人員的客戶索引檔是否被使用
                        function (rp_cb) {
                            _.each(la_rpData, function (lo_rpData) {
                                queryAgent.query("CHK_RELATED_PERSON_IS_USED", {
                                    athena_id: session.user.athena_id,
                                    per_cust_cod: lo_rpData.per_cust_cod,
                                    cust_cod: lo_mnSaveData.cust_cod
                                }, function (err, getResult) {
                                    ln_examGhistCount++;
                                    if (err) {
                                        lo_result.success = false;
                                        lo_error = new ErrorClass();
                                        lo_error.errorMsg = err;
                                        return rp_cb(lo_error, lo_result);
                                    }
                                    else {
                                        if (getResult.related_person_count <= 0) {
                                            if (ln_examGhistCount == la_rpData.length) {
                                                rp_cb(lo_error, lo_result);
                                            }
                                        }
                                        else {
                                            lo_result.success = false;
                                            lo_error = new ErrorClass();
                                            let ls_errMsg = commandRules.getMsgByCod("pms61msg11", session.locale);
                                            lo_error.errorMsg = _s.sprintf(ls_errMsg, lo_rpData.per_cust_cod);
                                            return rp_cb(lo_error, lo_result);
                                        }
                                    }
                                });
                            });
                        },
                        //檢查此相關人員是否被住客歷史使用，沒有則刪除此相關人員的客戶索引檔
                        function (rpData, rp_cb) {
                            _.each(la_rpData, function (lo_rpData) {
                                queryAgent.query("CHK_RELATED_PERSON_IN_GHIST_MN", {
                                    athena_id: session.user.athena_id,
                                    per_cust_cod: lo_rpData.per_cust_cod
                                }, function (err, getResult) {
                                    ln_examCustCount++;
                                    if (err) {
                                        lo_result.success = false;
                                        lo_error = new ErrorClass();
                                        lo_error.errorMsg = err;
                                        return rp_cb(lo_error, lo_result);
                                    }
                                    else {
                                        if (getResult.related_person_count <= 0) {
                                            lo_result.extendExecDataArrSet.push({
                                                function: '0',
                                                table_name: 'cust_idx',
                                                condition: [{
                                                    key: 'athena_id',
                                                    operation: "=",
                                                    value: userInfo.athena_id
                                                }, {
                                                    key: 'cust_cod',
                                                    operation: "=",
                                                    value: lo_rpData.per_cust_cod
                                                }]
                                            });
                                            if (ln_examCustCount == la_rpData.length) {
                                                rp_cb(lo_error, lo_result);
                                            }
                                        }
                                        else {
                                            lo_result.success = false;
                                            lo_error = new ErrorClass();
                                            let ls_errMsg = commandRules.getMsgByCod("pms61msg12", session.locale);
                                            lo_error.errorMsg = _s.sprintf(ls_errMsg, lo_rpData.per_cust_cod);
                                            return rp_cb(lo_error, lo_result);
                                        }
                                    }
                                });
                            });
                        }
                    ], function (reErr, rpResult) {
                        cb(lo_error, lo_result);
                    });
                }
                else {
                    cb(lo_error, lo_result);
                }
            }
            else {
                cb(lo_error, lo_result);
            }
        }
    }
};

//轉換資料格式(tree)
function convertData2TreeData(lo_selectRowData, lo_parent_node) {
    let la_rowData = _.filter(lo_selectRowData, function (lo_rowData) {
        return lo_rowData.parent_cod.trim() == lo_parent_node.value;
    });

    if (la_rowData.length != 0) {
        lo_parent_node.children = [];
        _.each(la_rowData, function (lo_rowData) {
            let lo_node = new node(lo_rowData);
            convertData2TreeData(lo_selectRowData, lo_node);
            lo_parent_node.children.push(lo_node);
        });
    }
}

//tree 的基本資料結構
class node {
    constructor(lo_rowData) {
        this.parent_cod = lo_rowData.parent_cod;
        this.label = lo_rowData.area_nam;
        this.value = lo_rowData.area_cod;
    }
}