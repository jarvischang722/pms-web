/**
 * Created by Mike on 2017/10/16.
 * dataGrid 相關處理
 */
let config = require("../configs/database");
let sysConf = require("../configs/SystemConfig");
let queryAgent = require('../plugins/kplug-oracle/QueryAgent');
let mongoAgent = require("../plugins/mongodb");
let _ = require("underscore");
let async = require("async");
let moment = require("moment");
let i18n = require("i18n");
let tools = require("../utils/CommonTools");
let dataRuleSvc = require("./DataRuleService");
let ruleAgent = require("../ruleEngine/ruleAgent");
let logSvc = require("./LogService");
let mailSvc = require("./MailService");
let langSvc = require("./LangService");
let fieldAttrSvc = require("./FieldsAttrService");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var ruleRootPath = appRootDir+"/ruleEngine/";

var ErrorClass = require(ruleRootPath + "/errorClass");

/**
 * 取得多筆
 * @param params
 * @param session
 * @param callback
 */
exports.getDataGridRows = function (params ,session, callback) {

    var lo_searchCond = params.searchCond || {};    //搜尋條件
    var lo_error = null;

    var lo_params = {
        comp_cod: session.user.cmp_id,
        key_cod1: session.user.usr_id,
    };

    //過濾掉無效條件
    _.each(lo_searchCond, function (condVal, condKey) {
        if (_.isArray(condVal) && condVal.length > 0) {
            lo_params[condKey] = condVal;
        } else if (!_.isUndefined(condVal) && !_.isEmpty(condVal)) {
            lo_params[condKey] = condVal;
        }
    });

    queryAgent.queryList("QRY_PSI_QUOTE_MN", lo_params, 0, 0, function (err, Result) {
        if (!err) {
            if(Result)
            {
                //  ) 條件過濾
                if (!_.isUndefined(ruleAgent[params.prg_id + "Filter"])) {
                    ruleAgent[params.prg_id + "Filter"](Result, session, lo_searchCond, function (dataRow) {
                        callback(lo_error, dataRow);
                    });
                } else {
                    callback(lo_error, Result);
                }
            }

            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};

/**
 * 取得單筆(MN)
 * @param params
 * @param session
 * @param callback
 */
exports.getSingleDataMN = function (params ,session, callback) {

    var lo_error = null;

    var lo_params = {
        comp_cod: session.user.cmp_id,
        order_nos: params.postData.order_nos
    };

    queryAgent.query("QRY_PSI_QUOTE_SINGLE_MN", lo_params, function (err, Result) {
        if (!err) {
            if(Result)
                callback(lo_error, Result);
            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};

/**
 * 取得單筆(DT)
 * @param params
 * @param session
 * @param callback
 */
exports.getSingleDataDT = function (params ,session, callback) {

    var lo_error = null;

    var lo_params = {
        comp_cod: session.user.cmp_id,
        order_nos: params.postData.order_nos
    };

    queryAgent.queryList("QRY_PSI_QUOTE_SINGLE_DT", lo_params, 0, 0, function (err, Result) {
        if (!err) {
            if(Result)
                callback(lo_error, Result);
            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};

/**
 * 取得客戶代號下拉
 * @param params
 * @param session
 * @param callback
 */
exports.getShowCodSelect = function (params ,session, callback) {

    var lo_error = null;

    var lo_params = {
        comp_cod: session.user.cmp_id,
        key_cod1: session.user.usr_id
    };

    queryAgent.queryList("QRY_CUST_COD_SELECT", lo_params, 0, 0, function (err, Result) {
        if (!err) {
            if(Result)
                callback(lo_error, Result);
            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};

/**
 * 取得客戶資料
 * @param params
 * @param session
 * @param callback
 */
exports.getCustInfo = function (params ,session, callback) {

    var lo_error = null;

    var lo_params = {
        comp_cod: session.user.cmp_id,
        cust_cod: params.singleData.cust_cod
    };

    queryAgent.query("QRY_CUST_INFO", lo_params, function (err, Result) {
        if (!err) {
            if(Result)
                callback(lo_error, Result);
            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};

/**
 * 取得客戶住址
 * @param params
 * @param session
 * @param callback
 */
exports.getCustAdd = function (params ,session, callback) {

    var lo_error = null;

    var lo_params = {
        //comp_cod: session.user.cmp_id,
        comp_cod: "CHIPN     "
    };

    queryAgent.query("QRY_SHIP_ADD_COD", lo_params, function (err, Result) {
        if (Result) {
            var lo_params2 = {
                cust_cod: params.singleData.cust_cod,
                add_cod: Result.ship_add_cod
            };

            queryAgent.query("QRY_ADDRESS_DT_SELECT", lo_params2, function (err, Result) {
                if (!err) {
                    if(Result)
                        callback(lo_error, Result);
                    else
                        callback(lo_error, "");
                }
                else {
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = err || "error";
                    lo_error.errorCod = "1111";
                    callback(lo_error, Result);
                }
            });
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });

};

/**
 * 取得客戶電話
 * @param params
 * @param session
 * @param callback
 */
exports.getCustContact = function (params ,session, callback) {

    var lo_error = null;

    var lo_params = {
        //comp_cod: session.user.cmp_id,
        comp_cod: "CHIPN     "
    };

    queryAgent.query("QRY_CONTACT_COD", lo_params, function (err, Result) {
        if (Result) {

            var lo_params2 = {
                cust_cod: params.singleData.cust_cod,
                contact_cod: Result.contact_cod
            };

            queryAgent.query("QRY_CONTACT_DT_SELECT", lo_params2, function (err, Result) {
                if (!err) {
                    if(Result)
                        callback(lo_error, Result);
                    else
                        callback(lo_error, "");
                }
                else {
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = err || "error";
                    lo_error.errorCod = "1111";
                    callback(lo_error, Result);
                }
            });
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });

};

/**
 * 取得期別
 * @param params
 * @param session
 * @param callback
 */
exports.getPeriod = function (params ,session, callback) {

    var lo_error = null;

    var lo_params = {
        order_dat: params.singleData.order_dat
    };

    queryAgent.query("QRY_PSI_PERIOD_RF", lo_params, function (err, Result) {
        if (!err) {
            if(Result)
                callback(lo_error, Result);
            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};

/**
 * 取得訂單格式
 * @param params
 * @param session
 * @param callback
 */
exports.getFormatSta = function (params ,session, callback) {

    var lo_error = null;

    var lo_params = {
        comp_cod: session.user.cmp_id,
        cust_cod: params.singleData.cust_cod,
        period_cod: params.singleData.period_cod,
        week: params.singleData.week
    };

    queryAgent.queryList("QRY_PSI_FORMAT_STA", lo_params, 0, 0, function (err, Result) {
        if (!err) {
            if(Result)
                callback(lo_error, Result);
            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};

/**
 * 取得所有訂單格式(空白表單下載用)
 * @param params
 * @param session
 * @param callback
 */
exports.getAllFormatSta = function (params ,session, callback) {

    var lo_error = null;

    var lo_params = {
        //comp_cod: session.user.cmp_id,
        comp_cod: "CHIPN     "
    };

    queryAgent.queryList("QRY_ALL_PSI_FORMAT_STA", lo_params, 0, 0, function (err, Result) {
        if (!err) {
            if(Result)
                callback(lo_error, Result);
            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};

/**
 * 取得所有訂單格式(空白表單下載用)
 * @param params
 * @param session
 * @param callback
 */
exports.getGoodsData = function (params ,session, callback) {

    var lo_error = null;

    var lo_params = {
        comp_cod: session.user.cmp_id,
        format_sta : params.select_format_sta
    };

    queryAgent.queryList("QRY_GOODS_DATA", lo_params, 0, 0, function (err, Result) {
        if (!err) {
            if(Result)
                callback(lo_error, Result);
            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};

/**
 * 判斷訂單格式
 * @param params
 * @param session
 * @param callback
 */
exports.chkFormatSta = function (params ,session, callback) {

    var lo_error = null;

    async.waterfall([
        //1.相同格式的訂單，一天只能有一張
        function(cb){

            var lo_params = {
                comp_cod: session.user.cmp_id,
                cust_cod: params.singleData.cust_cod,
                order_dat: params.singleData.order_dat,
                format_sta: params.singleData.format_sta
            };

            queryAgent.query("CHK_PSI_FORMAT_STA", lo_params, function (err, Result) {
                if (!err) {
                    if(Result.count > 0){
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = "相同格式的訂單，一天只能有一張";
                        lo_error.errorCod = "1111";
                        cb(true, lo_error);
                    }
                    else{
                        cb(false, '');
                    }
                }
                else {
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = err || "error";
                    lo_error.errorCod = "1111";
                    cb(true, lo_error);
                }
            });
        },
        //2. 訂貨時間點order_time第1碼非P,則要檢查[銷售]有沒有值
        function(result, cb){

            if(params.singleData.order_time.toString().substr(0, 1) != 'P'){
                var lo_params = {
                    show_cod: params.singleData.show_cod,
                    order_dat: params.singleData.order_dat,
                };

                queryAgent.query("CHK_SELL_MN", lo_params, function (err, Result) {
                    if (!err) {
                        if(Result.count == 0){
                            lo_error = new ErrorClass();
                            lo_error.errorMsg = "尚未有[銷售]資料,不能新增訂單, 請先至POS傳送";
                            lo_error.errorCod = "1111";
                            cb(true, lo_error);
                        }
                        else{
                            cb(false, '');
                        }
                    }
                    else {
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = err || "error";
                        lo_error.errorCod = "1111";
                        cb(true, lo_error);
                    }
                });
            }
            else {
                cb(false, result);
            }
        },
        //3. 訂貨時間點order_time第1碼非P,則要檢查 [萬元用量/庫存]有沒有值
        function(result, cb){
            if(params.singleData.order_time.toString().substr(0, 1) != 'P') {
                var lo_params = {
                    comp_cod: session.user.cmp_id,
                    order_dat: params.singleData.order_dat,
                    cust_cod: params.singleData.show_cod,
                };

                queryAgent.query("CHK_PSI_POSINV_MN", lo_params, function (err, Result) {
                    if (!err) {
                        if (Result.count == 0) {
                            lo_error = new ErrorClass();
                            lo_error.errorMsg = "尚未有[萬元用量/庫存]資料,不能新增訂單, 請先至POS傳送";
                            lo_error.errorCod = "1111";
                            cb(true, lo_error);
                        }
                        else {
                            cb(false, '');
                        }
                    }
                    else {
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = err || "error";
                        lo_error.errorCod = "1111";
                        cb(true, lo_error);
                    }
                });
            }
            else {
                cb(false, result);
            }
        },
        //4. 訂貨時間點order_time第1碼非P,則要檢查 [業績] 有沒有值
        function(result, cb){
            if(params.singleData.order_time.toString().substr(0, 1) != 'P') {
                var lo_params = {
                    comp_cod: session.user.cmp_id,
                    order_dat: params.singleData.order_dat,
                    cust_cod: params.singleData.show_cod,
                };

                queryAgent.query("CHK_PSI_BUG_SALES", lo_params, function (err, Result) {
                    if (!err) {
                        if(Result.count == 0){
                            lo_error = new ErrorClass();
                            lo_error.errorMsg = "尚未有[業績]資料,不能新增訂單, 請先至POS傳送";
                            lo_error.errorCod = "1111";
                            cb(true, lo_error);
                        }
                        else{
                            cb(false, '');
                        }
                    }
                    else {
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = err || "error";
                        lo_error.errorCod = "1111";
                        cb(true, lo_error);
                    }
                });
            }
            else
            {
                cb(false, result);
            }
        }
    ], function(err, result){
        callback(err, result);
    });
};

/**
 * 取得訂單格式下拉(查詢欄位用)
 * @param params
 * @param session
 * @param callback
 */
exports.getSearchFormatSta = function (params ,session, callback) {

    var lo_error = null;

    var lo_params = {
        comp_cod: session.user.cmp_id
    };

    queryAgent.queryList("QRY_SEARCH_PSI_FORMAT_STA", lo_params, 0, 0, function (err, Result) {
        if (!err) {
            if(Result)
                callback(lo_error, Result);
            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};

/**
 * Call Save API
 * @param params
 * @param session
 * @param callback
 */
exports.callSaveAPI = function (params ,session, callback) {

    index = 1;
    var exec_data = {};
    exec_data[index] = params.singleData;
    index++;

    _.each(params.singleDataGridRows, function (value, index2) {
        value.kindOfRel = 'dt';
        exec_data[index] = value;
        index++;
    });

    var apiParams = {
        "REVE-CODE": params.REVE_CODE,
        "program_id": params.prg_id,
        "user": session.user.usr_id,
        "table_name": 'psi_quote_mn',
        "count": index - 1,
        "exec_data": exec_data,
        "ip" : params.ip
    };

    tools.requestApi(sysConf.api_url, apiParams, function (apiErr, apiRes, data) {
        var log_id = moment().format("YYYYMMDDHHmmss");
        var success = true;
        var errorMsg = "";
        if (apiErr || !data) {
            success = false;
            errorMsg = apiErr;
        } else if (data["RETN-CODE"] != "0000") {
            success = false;
            errorMsg = data["RETN-CODE-DESC"] || '發生錯誤';
            console.error(data["RETN-CODE-DESC"]);
        } else
        {
            errorMsg = data["RETN-CODE-DESC"];
        }

        //寄出exceptionMail
        if (!success) {
            mailSvc.sendExceptionMail({
                log_id: log_id,
                exceptionType: "execSQL",
                errorMsg: errorMsg
            });
        }

        // //log 紀錄
        // logSvc.recordLogAPI({
        //     log_id: log_id,
        //     success: chk_result.success,
        //     prg_id: prg_id,
        //     api_prg_code: '0300901000',
        //     req_content: apiParams,
        //     res_content: data
        // });
        callback(errorMsg, success, data);
    });
};

/**
 * Call API
 * @param params
 * @param session
 * @param callback
 */
exports.callAPI = function (params ,session, callback) {
    var apiParams = {
        "REVE-CODE": params.REVE_CODE,
        //"COMP_COD": session.user.cmp_id,
        "comp_cod": "CHIPN     ",
        "program_id": params.prg_id,
        "user": session.user.usr_id,
        "table_name": 'psi_quote_mn',
        "count": 1,
        "ip" : params.ip,
        "order_nos": params.order_nos
    };

    tools.requestApi(sysConf.api_url, apiParams, function (apiErr, apiRes, data) {
        var log_id = moment().format("YYYYMMDDHHmmss");
        var success = true;
        var errorMsg = "";
        if (apiErr || !data) {
            success = false;
            errorMsg = apiErr;
        } else if (data["RETN-CODE"] != "0000") {
            success = false;
            errorMsg = data["RETN-CODE-DESC"] || '發生錯誤';
            console.error(data["RETN-CODE-DESC"]);
        } else
        {
            errorMsg = data["RETN-CODE-DESC"];
        }

        //寄出exceptionMail
        if (!success) {
            mailSvc.sendExceptionMail({
                log_id: log_id,
                exceptionType: "execSQL",
                errorMsg: errorMsg
            });
        }

        // //log 紀錄
        // logSvc.recordLogAPI({
        //     log_id: log_id,
        //     success: chk_result.success,
        //     prg_id: prg_id,
        //     api_prg_code: '0300901000',
        //     req_content: apiParams,
        //     res_content: data
        // });
        callback(errorMsg, success, data);
    });
};

/**
 * Call 貨品 API
 * @param params
 * @param session
 * @param callback
 */
exports.callOrderAPI = function (params ,session, callback) {
    var apiParams = {
        "REVE-CODE": params.REVE_CODE,
        "COMP_COD":"CHIPN    ",
        //"COMP_COD": session.user.cmp_id,
        "CUST_COD": params.singleData.cust_cod,
        "FORMAT_STA": params.singleData.format_sta,
        "ORDER_DAT": moment(params.singleData.order_dat).format('YYYY/MM/DD')
    };
    //
    // var apiParams = {
    //     "REVE-CODE":"PSIW5100302020",
    //     "COMP_COD":"CHIPN    ",
    //     "CUST_COD": "PSI000000000000201",
    //     "FORMAT_STA": "002",
    //     "ORDER_DAT": "2017/5/4"
    // };

    tools.requestApi(sysConf.api_url, apiParams, function (apiErr, apiRes, data) {
        var log_id = moment().format("YYYYMMDDHHmmss");
        var success = true;
        var errorMsg = "";
        if (apiErr || !data) {
            success = false;
            errorMsg = apiErr;
        } else if (data["RETN-CODE"] != "0000") {
            success = false;
            errorMsg = data["RETN-CODE-DESC"];
            console.error(data["RETN-CODE-DESC"]);
        } else
        {
            errorMsg = data["RETN-CODE-DESC"];
        }

        //寄出exceptionMail
        if (!success) {
            mailSvc.sendExceptionMail({
                log_id: log_id,
                exceptionType: "execSQL",
                errorMsg: errorMsg
            });
        }

        // //log 紀錄
        // logSvc.recordLogAPI({
        //     log_id: log_id,
        //     success: chk_result.success,
        //     prg_id: prg_id,
        //     api_prg_code: '0300901000',
        //     req_content: apiParams,
        //     res_content: data
        // });
        callback(errorMsg, success, data);
    });
};

/**
 * 欄位驗證
 * @param prg_id
 * @param ui_field_name
 * @param verifyValue
 * @param callback
 */
exports.doCheckFieldFormatVerify = function (prg_id, ui_field_name, verifyValue, callback) {

    async.waterfall([
        //驗證資料格式是否正常
        function (callback) {
            mongoAgent.UIFieldFormat.findOne({
                prg_id: prg_id,
                ui_field_name: ui_field_name
            }, function (err, fieldFormat) {
                if (!err && fieldFormat) {

                    mongoAgent.FormatRF.findOne({format_id: fieldFormat.format_id}, function (err, format) {
                        console.log(ui_field_name);

                        var regExp = new RegExp(format.reg_exp);
                        if (!regExp.test(verifyValue)) {
                            callback("資料格式錯誤", false);
                        }
                    });
                } else {
                    callback(null, true);
                }
            });
        },
        //驗證資料內容是否正確
        function (checkFormat, callback) {
            callback(null, true);
        }
    ], function (err, success) {

        if (err || !success) {
            callback(err, false);
        } else {
            callback(null, true);
        }
    });


};

/**
 * 取系統參數
 * @param params
 * @param session
 * @param callback
 */
exports.getSystemParam = function (params ,session, callback) {

    var lo_error = null;

    var lo_params = {
        //comp_cod: session.user.cmp_id,
        comp_cod: "CHIPN     "
    };

    var paramName = "QRY_" + params.paramName.toUpperCase();

    queryAgent.query(paramName, lo_params, function (err, Result) {
        if (!err) {
            if(Result)
                callback(lo_error, Result);
            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};

//WebService

/**
 * 萬元用量表轉檔(PSI0000001)
 * @param params
 * @param session
 * @param callback
 */
exports.PSI0000001 = function (params ,session, callback) {

    //var object = base64.decode(params);
    var a = new Buffer(params, 'base64').toString();

    var objJsonArray =JSON.parse(JSON.stringify(a));
    console.log(a.tenKDosage);
    console.log(objJsonArray.tenKDosage);




};

/**
 * 預估業績轉檔(PSI0000002)
 * @param params
 * @param session
 * @param callback
 */
exports.PSI0000002 = function (params ,session, callback) {

    var lo_error = null;

    var lo_params = {
        //comp_cod: session.user.cmp_id,
        comp_cod: "CHIPN     "
    };

    var paramName = "QRY_" + params.paramName.toUpperCase();

    queryAgent.query(paramName, lo_params, function (err, Result) {
        if (!err) {
            if(Result)
                callback(lo_error, Result);
            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};

/**
 * POS資料轉檔(PSI0000003)
 * @param params
 * @param session
 * @param callback
 */
exports.PSI0000003 = function (params ,session, callback) {

    var lo_error = null;

    var lo_params = {
        //comp_cod: session.user.cmp_id,
        comp_cod: "CHIPN     "
    };

    var paramName = "QRY_" + params.paramName.toUpperCase();

    queryAgent.query(paramName, lo_params, function (err, Result) {
        if (!err) {
            if(Result)
                callback(lo_error, Result);
            else
                callback(lo_error, "");
        }
        else {
            lo_error = new ErrorClass();
            lo_error.errorMsg = err || "error";
            lo_error.errorCod = "1111";
            callback(lo_error, Result);
        }
    });
};