/**
 * Created by a17010 on 2017/12/11.
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
var tools = require(appRootDir + "/utils/CommonTools");

module.exports = {
    /**
     * PMS0610020 商務公司資料編輯 單筆主檔各欄位預設值
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
                if (_.isUndefined(postData.prg_id)) {
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "Missing Program ID.";
                    lo_result.success = false;
                    cb(lo_error, lo_result);
                }
                else {
                    let prg_id = postData.prg_id;

                    // let apiParams = {
                    //     "REVE-CODE": "PMS0620030",
                    //     "athena_id": userInfo.athena_id,
                    //     "hotel_cod": userInfo.hotel_cod,
                    //     "program_id": prg_id,
                    //     "user": userInfo.usr_id,
                    //     "count": 1,
                    //     "exec_data": [{
                    //         function: '0500',
                    //         sales_cod: sales_cod,
                    //         cust_cod: cust_cod,
                    //         upd_order_mn: upd_order_mn
                    //     }]
                    // };
                    // tools.requestApi(sysConf.api_url, apiParams, function (apiErr, apiRes, data) {
                    //
                    //     if (apiErr || !data) {
                    //         lo_result.success = false;
                    //         lo_error = new ErrorClass();
                    //         lo_error.errorMsg = apiErr;
                    //     }
                    //     else if (data["RETN-CODE"] != "0000") {
                    //         lo_result.success = false;
                    //         lo_error = new ErrorClass();
                    //         console.error(data["RETN-CODE-DESC"]);
                    //         lo_error.errorMsg = "save error!";
                    //     }
                    //     cb(lo_error, lo_result);
                    // });
                    ls_custMnCustCod = "CS 000000000019602  ";
                    ls_custMnShowCod = ls_custMnCustCod.substring(8, 12);
                    ls_custMnPcustCod = ls_custMnCustCod;
                    cb(lo_error, lo_result);
                }
            }
        ], function (err, result) {
            lo_result.defaultValues = {
                cust_mn_contract_sta: ls_custMncontractSta,
                cust_mn_cust_cod: ls_custMnCustCod,
                cust_mn_show_cod: ls_custMnShowCod,
                cust_mn_pcust_cod: ls_custMnPcustCod
            };
            callback(lo_error, lo_result);
        });
    },

    /**
     * PMS0610020 商務公司資料編輯 頁籤合約 預設值
     * @param postData
     * @param session
     * @param callback
     */
    defaultCustMnContract: function (postData, session, callback) {
        let lo_result = new ReturnClass;
        let lo_error = null;

        let ls_rentDathq;

        //取得訂房中心滾房租日
        queryAgent.query("QRY_RENT_DAT_HQ", {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        }, function (err, data) {
            if (err) {
                lo_error = new ErrorClass();
                lo_error.errorMsg = err;
                lo_result.success = false;
            }
            else {
                ls_rentDathq = data.rent_dat_hq;
            }

            lo_result.defaultValues = {
                rent_dat_hq: ls_rentDathq
            };

            callback(lo_error, lo_result);
        });
    },

    /**
     * PMS0610020 商務公司資料編輯 合約內容 開始日期
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
        let lo_oldValue = postData.oldValue == "" ? postData.rowData[postData.validateField] : postData.oldValue;
        let lo_param = {
            athena_id: session.user.athena_id,
            hotel_cod: postData.rowData.hotel_cod
        };

        async.waterfall([
            examineContract,
            compareDat,
            setRateCodSelectData
        ], function (err, result) {
            callback(err, result);
        });

        function examineContract(cb) {
            if (ls_beginDat != "" && ls_endDat != "" && ls_rateCod != "") {
                lo_param.end_dat = moment(new Date(ls_endDat)).format("YYYY/MM/DD");
                lo_param.begin_dat = moment(new Date(ls_beginDat)).format("YYYY/MM/DD");
                lo_param.rate_cod = ls_rateCod;
                queryAgent.queryList("QRY_CONTRACT_DT_RATE_COD", lo_param, 0, 0, function (err, getResult) {
                    if (err) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = "sql err";
                        cb(lo_error, lo_result);
                    }
                    else if (getResult > 0) {
                        lo_result.success = false;
                        lo_result.effectValues = {begin_dat: lo_oldValue};
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms61msg1", session.locale);
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
                        lo_result.alertMsg = commandRules.getMsgByCod("pms61msg2", session.locale);
                        cb(lo_error, lo_result);
                    }
                    else {
                        cb(lo_error, lo_result);
                    }
                }
            });
        }

        function setRateCodSelectData(result, cb) {
            if (ls_rateCod != "" && ls_endDat != "" && ls_rateCod != "") {
                queryAgent.queryList("QRY_CONTRACT_DT_RATE_COD", lo_param, 0, 0, function (err, getResult) {
                    if (err) {
                        lo_result.success = false;
                        lo_error = ErrorClass();
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
     * PMS0610020 商務公司資料編輯 合約內容 開始日期
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

        let ls_beginDat = postData.rowData.begin_dat;
        let ls_endDat = postData.rowData.end_dat || "";
        let ls_rateCod = postData.rowData.rate_cod || "";
        let ls_hotelCod = postData.rowData.hotel_cod || "";
        let lo_oldValue = postData.oldValue == "" ? postData.rowData[postData.validateField] : postData.oldValue;
        let lo_param = {
            athena_id: session.user.athena_id,
            hotel_cod: postData.rowData.hotel_cod
        };

        async.waterfall([
            examineContract,
            setRateCodSelectData
        ], function (err, result) {
            callback(err, result);
        });

        function examineContract(cb) {
            if (ls_beginDat != "" && ls_endDat != "" && ls_rateCod != "") {
                lo_param.end_dat = moment(new Date(ls_endDat)).format("YYYY/MM/DD");
                lo_param.begin_dat = moment(new Date(ls_beginDat)).format("YYYY/MM/DD");
                lo_param.rate_cod = ls_rateCod;
                queryAgent.queryList("QRY_CONTRACT_DT_RATE_COD", lo_param, 0, 0, function (err, getResult) {
                    if (err) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = "sql err";
                        cb(lo_error, lo_result);
                    }
                    else if (getResult > 0) {
                        lo_result.success = false;
                        lo_result.effectValues = {begin_dat: lo_oldValue};
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms61msg1", session.locale);
                        cb(lo_error, lo_result);
                    }
                    else {
                        cb(lo_error, ls_beginDat);
                    }
                });
            }
            else{
                cb(lo_error, lo_result);
            }
        }

        function setRateCodSelectData(result, cb) {
            if (ls_rateCod != "" && ls_endDat != "" && ls_rateCod != "") {
                queryAgent.queryList("QRY_CONTRACT_DT_RATE_COD", lo_param, 0, 0, function (err, getResult) {
                    if (err) {
                        lo_result.success = false;
                        lo_error = ErrorClass();
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
            else{
                cb(lo_error, lo_result);
            }
        }
    },

    /**
     * PMS0610020 商務公司資料編輯 合約內容 館別
     * 1.合約內容 參考房價代號下拉資料
     * 2.合約內容 餐廳折扣下拉資料
     * @param postData
     * @param session
     * @param callback
     */
    r_ContractHotelCod: function(postData, session, callback){
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
            end_dat: ls_endDat,
            begin_dat: ls_beginDat
        };

        async.waterfall([
            setRateCodSelectData,
            setRsdiscCodSelectData
        ], function(err, result){
            callback(err, result);
        });

        function setRateCodSelectData(cb){
            if (ls_hotelCod != "" && ls_endDat != "" && ls_beginDat != "") {
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
            else{
                cb(lo_error, lo_result);
            }
        }

        function setRsdiscCodSelectData(result, cb){
            queryAgent.queryList("QRY_CONTRACT_DT_RSDISC_COD", lo_param, 0, 0, function(err, getResult){
                if(err){
                    lo_result.success = false;
                    lo_error = ErrorClass();
                    lo_error.errorMsg = err;
                    cb(lo_error, lo_result);
                }
                else{
                    lo_result.multiSelectOptions.rsdisc_cod = getResult;
                    lo_result.selectField.push("rsdisc_cod");
                    cb(lo_error, lo_result);
                }
            });
        }
    },

    /**
     * PMS0610020 商務公司資料編輯 合約內容 參考房價代號
     * 房價代號帶回房價名稱
     * @param postData
     * @param session
     * @param callback
     */
    r_ContractdtRatecod: function(postData, session, callback){
        let lo_result = new ReturnClass();
        let lo_error = null;

        let ls_rateCod = postData.rowData.rate_cod;
        let lo_oldValue = postData.oldValue == "" ? postData.rowData[postData.validateField] : postData.oldValue;

        queryAgent.query("QRY_RATE_NAM", {rate_cod: ls_rateCod}, function(err, getResult){
            if(err){
                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = "sql err";
                callback(lo_error, lo_result);
            }
            else{
                lo_result.effectValues = {ratecod_nam: getResult.ratecod_nam};
                callback(lo_error, lo_result);
            }
        });


    },

    /**
     * PMS0610020 商務公司資料編輯 相關人員 切換主要聯絡人
     * 1.主要聯絡人僅可指定予一筆相關人員資料，於勾選欄位時自動切換
     * 2.主要聯絡人非必要勾選，可無指定主要聯絡人
     * 3.主要聯絡人的seq_nos要入到主檔cust_mn.atten_cod
     * @param postData
     * @param session
     * @param callback
     */
    r_primary_pers: function(postData, session, callback){
        let lo_result = new ReturnClass();
        let lo_error = null;

        if(postData.newValue == 'Y'){
            _.each(postData.allRowData, function(lo_rowData, idx){
                postData.allRowData[idx].primary_pers = "N";
            });
            postData.allRowData[postData.rowIndex].primary_pers = postData.newValue;
            lo_result.effectValues = postData.allRowData;
        }

        callback(lo_error, lo_result);
    },

    /**
     * PMS0610020 商務公司資料編輯 相關人員刪除前檢查
     * 主要聯絡人打勾，則不允許刪除 訊息「此筆資料設為主要聯絡人，不可刪除」
     * @param postData
     * @param session
     * @param callback
     */
    deleteRelatedPerson: function(postData, session, callback){
        let lo_result = new ReturnClass();
        let lo_error = null;

        if(postData.singleRowData.primary_pers == 'Y'){
            lo_result.success = false;
            lo_error = new ErrorClass();
            lo_error.errorMsg = commandRules.getMsgByCod("pms62msg7", session.locale);
        }

        callback(lo_error, lo_result);
    },

    /**
     * PMS0610020 商務公司資料編輯 合約內容刪除前檢查
     * 1.檢查訂房卡資料
     * 2.檢查住客資料
     * @param postData
     * @param session
     * @param callback
     */
    deleteContractContent: function(postData, session, callback){
        let lo_result = new ReturnClass();
        let lo_error = null;

        let lo_param = {
            athena_id: session.user.athena_id,
            cust_cod: postData.singleRowData.cust_mn_cust_cod,
            hotel_cod: postData.deleteData[0].hotel_cod,
            rate_cod: postData.deleteData[0].rate_cod
        };

        async.waterfall([
            qryOrderMn,//檢查訂房卡資料，房價代號使否已被使用
            qryGuestMn//檢查住客資料，房價代號使否已被使用
        ], function(err, result){
            callback(err, result);
        });

        function qryOrderMn(cb){
            queryAgent.query("CHK_RATE_COD_IS_EXIST_IN_ORDER_MN", lo_param, function(err, getResult){
                if(err){
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "sql err";
                    cb(lo_error, lo_result);
                }
                else{
                    if(getResult.order_rate_Count > 0){
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms61msg3", session.locale);
                        cb(lo_error, lo_result);
                    }
                    else{
                        cb(lo_error, lo_result);
                    }
                }
            });
        }

        function qryGuestMn(result, cb){
            queryAgent.query("CHK_RATE_COD_IS_EXIST_IN_GUEST_MN", lo_param, function(err, getResult){
                if(err){
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "sql err";
                    cb(lo_error, lo_result);
                }
                else{
                    if(getResult.order_rate_Count > 0){
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms61msg4", session.locale);;
                        cb(lo_error, lo_result);
                    }
                    else{
                        cb(lo_error, lo_result);
                    }
                }
            });
        }
    },

    /**
     * PMS0610020 商務公司資料編輯 公司狀態是否可以為刪除
     * @param postData
     * @param session
     * @param callback
     */
    r_1010_CustmnStatuscod: function(postData, session, callback){
        let lo_result = new ReturnClass();
        let lo_error = null;

        if(postData.singleRowData.cust_mn_status_cod == 'D'){
            async.waterfall([
                qryFitCod,
                qryOfficialCustCod
            ],function(err, result){
                callback(lo_error, lo_result);
            });
        }
        else{

            callback(lo_error, lo_result);
        }

        function qryFitCod(cb){
            queryAgent.query("QRY_FIT_COD", {athena_id: session.user.athena_id}, function(err, getResult){
                if(err){
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "sql err";
                    cb(lo_error, lo_result);
                }
                else{
                    if(getResult.fit_cod == postData.singleRowData.cust_cod){
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms61msg5", session.locale);;
                        cb(lo_error, lo_result);
                    }
                    else{
                        cb(lo_error, lo_result);
                    }
                }
            });
        }

        function qryOfficialCustCod(result, cb){
            queryAgent.query("QRY_OFFICIAL_WEB_CUST_COD", {athena_id: session.user.athena_id}, function(err, getResult){
                if(err){
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = "sql err";
                    cb(lo_error, lo_result);
                }
                else{
                    if(getResult.cust_cod == postData.singleRowData.cust_cod){
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms61msg6", session.locale);;
                        cb(lo_error, lo_result);
                    }
                    else{
                        cb(lo_error, lo_result);
                    }
                }
            });
        }

    }
};