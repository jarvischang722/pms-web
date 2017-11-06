/**
 * Created by a17017 on 2017/10/20.
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

    /**
     * 業務員新增按鈕規則檢查
     */
    defaultStatusCod1: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;
        lo_result.defaultValues = {
            status_cod1: "N",
            status_cod: "01",
            class_cod: "000001"
        };
        callback(lo_error, lo_result);
    },


    /**
     * 館別編號檢查，若已使用此編號則無法使用
     */
    chkHotelCod: function(postData, session, callback){
        var la_allRowData = postData["allRowData"];
        var newValue = postData["newValue"];
        var oldValue = postData["oldValue"];

        var lo_result = new ReturnClass();
        var lo_error = null;
        for(var i = 0;i < la_allRowData.length - 1;i ++){
            if(la_allRowData[i]["hotel_cod"] == newValue){
                lo_result.success = false;
                lo_result.effectValues = {hotel_cod: oldValue};
                lo_error = new ErrorClass();
                lo_error.errorMsg = commandRules.getMsgByCod("pms62msg7", session.locale);
                break;
            }
        }

        callback(lo_error, lo_result);
    },


    /**
     * 業務員狀態由「N:在職」改「Q:離職」時，檢查商務公司業務員是否指定此業務員資料，若有指定則不允許修改
     * 訊息『商務公司資料已使用，不可修改狀態』pms62msg6
     */
    chkSalesmnStatuscod: function (postData, session, callback) {
        let lo_params = {
            athena_id: session.user.athena_id,
            sales_cod: postData.singleRowData.sales_cod
        };
        let lo_result = new ReturnClass();
        let lo_error = null;

        queryAgent.query("CHK_SALES_COD_IS_EXIST_IN_CUST_MN".toUpperCase(), lo_params, function (err, salesData) {
            if (err) {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = err;
                lo_error.errorCod = "1111";
            }
            else {
                if (salesData.cust_sales_count > 0) {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = commandRules.getMsgByCod("pms62msg6", session.locale);
                    lo_result.effectValues = {status_cod: postData.oriSingleData[postData.validateField]};
                }
            }
            callback(lo_error, lo_result);
        });

    },


    /** 館別狀態為X:停用時，停用年月必填
     * 1.status_cod欄位=N  ->nouse_dat欄位不可輸入
     *(1)清空nouse_dat欄位
     *(2)訊息「非停用,停用年月不可輸入」pms62msg4
     *2.status_cod欄位=Y  ->nouse_dat欄位必填
     *訊息「請輸入停用年月」pms62msg5
     */
    chkNousedat: function (postData, session, callback) {
        var nouse_dat = postData.newValue;
        var status_cod = postData.rowData.status_cod1;
        var lo_result = new ReturnClass();
        var lo_error = null;

        if (nouse_dat == '') {
            if (status_cod == 'X') {
                lo_result.success = false;
                lo_result.effectValues = {status_cod1: status_cod};
                lo_error = new ErrorClass();
                lo_error.errorMsg = commandRules.getMsgByCod("pms62msg5", session.locale);
            }
        }
        else {
            if (status_cod == 'N') {
                nouse_dat = '';
                lo_result.success = false;
                lo_result.effectValues = {nouse_dat: nouse_dat};
                lo_result.readonlyFields = 'nouse_dat';
                lo_error = new ErrorClass();
                lo_error.errorMsg = commandRules.getMsgByCod("pms62msg4", session.locale);
            }
        }

        callback(lo_error, lo_result);
    },


    /**館別狀態為N:正常，清空停用年月
     *status_cod值=N  ->清空nouse_dat欄位
     */
    chkSaleshoteldtStatuscod: function (postData, session, callback) {
        var status_cod = postData.newValue;
        var lo_result = new ReturnClass();
        var lo_error = null;

        if (status_cod == 'N') {
            lo_result.effectValues = {nouse_dat: ''};
            lo_result.readonlyFields = 'nouse_dat';
        }

        callback(lo_error, lo_result);
    },


    /**
     * use_nos欄位(多筆搜尋) popupgrid顯示內容
     */
    qry_user_nos: function (postData, session, callback) {
        var lo_params = {
            athena_id: session.user.user_athena_id
        };
        var lo_result = new ReturnClass();
        var lo_error = null;

        let ui_field_name = _.isUndefined(postData.fields) ? "" : postData.fields.ui_field_name;
        let updateFieldName = {
            user_nos: "value"
        };

        let fieldNameChangeLanguage = {
            value: "使用者代號",
            display: "使用者名稱"
        };

        if (ui_field_name != "") {
            queryAgent.queryList("QRY_USER_NOS", lo_params, 0, 0, function (err, userList) {
                if (!err) {
                    lo_result.effectValues.showDataGrid = userList;
                    lo_result.effectValues.updateFieldNameTmp = updateFieldName;
                    lo_result.effectValues.fieldNameChangeLanguageTmp = fieldNameChangeLanguage;
                    callback(lo_error, [lo_result]);
                }
            });
        }
        else {
            callback(null, lo_result);
        }
    },


    /**
     *存檔
     *1.檢查停用年月
     *2.檢查使用者代號(訂席用)欄位設定資料是否於其他業務員資料已設定
     *3.新增獨有「新增一筆到table sales_class_hs」(第2個明細頁面)
     *4.修改獨有「若業務員組別有異動,新增一筆到table sales_class_hs」(第2個明細頁面)
     */

    r_SalesmnAdd: function (postData, session, callback) {
        var lo_createData = postData["tmpCUD"]["createData"][0] || {};
        var la_dt_createData = postData["tmpCUD"]["dt_createData"] || [];
        var userInfo = session.user;
        var params = {
            athena_id: userInfo.athena_id,
            hotel_cod: userInfo.hotel_cod
        };

        let lo_result = new ReturnClass();
        let lo_error = null;

        async.waterfall([
            chkNouseDat,//檢查停用狀態及停用年月
            chkUserNos,//檢查使用者代號(訂席用)欄位設定資料是否於其他業務員資料已設定
            addClassHs//新增組別異動狀態
        ], function (err, result) {
            callback(err, result);
        });

        function chkNouseDat(cb) {
            for (var i = 0; i < la_dt_createData.length; i++) {
                if (la_dt_createData[i]["nouse_dat"] == '') {
                    if (la_dt_createData[i]["status_cod"] == 'X') {
                        lo_result.success = false;
                        lo_result.effectValues = {status_cod1: la_dt_createData[i]["status_cod"]};
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms62msg5", session.locale);
                        break;
                    }
                }
                else {
                    if (la_dt_createData[i]["status_cod"] == 'N') {
                        lo_result.success = false;
                        lo_result.effectValues = {nouse_dat: ''};
                        lo_result.readonlyFields = 'nouse_dat';
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms62msg4", session.locale);
                        break;
                    }
                }

            }
            cb(lo_error, lo_result);
        }

        function chkUserNos(result, cb) {
            var params = {
                athena_id: userInfo.athena_id,
                sales_cod: lo_createData.sales_cod,
                user_nos: lo_createData.user_nos
            };
            queryAgent.query("QRY_USER_NOS_IN_SALES_MN".toUpperCase(), params, function (err, getResult) {
                if (err) {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = err;
                    lo_error.errorCod = "1111";
                }
                else {
                    if (getResult.user_nos_count > 0) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = commandRules.getMsgByCod("pms62msg8", session.locale);
                    }
                }
                cb(lo_error, lo_result);
            });
        }

        function addClassHs(result, cb) {
            queryAgent.query("QRY_RENT_DAT_HQ".toUpperCase(), params, function (err, getResult) {
                var lo_rentDatHq = getResult;
                if (err) {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    lo_error.errorMsg = err;

                    cb(lo_error, lo_result);
                }
                else {
                    lo_result.extendExecDataArrSet.push({
                        function: '1',
                        table_name: 'sales_class_hs',
                        athena_id: userInfo.athena_id,
                        hotel_cod: userInfo.hotel_cod,
                        sales_cod: lo_createData.sales_cod,
                        class_cod: lo_createData.class_cod,
                        begin_dat: moment(new Date(lo_rentDatHq.rent_dat_hq)).format("YYYY/MM/DD"),
                        end_dat: moment(new Date("2999/12/31")).format("YYYY/MM/DD"),
                        ins_dat: moment().format("YYYY/MM/DD"),
                        ins_usr: userInfo.usr_id,
                        upd_dat: moment().format("YYYY/MM/DD"),
                        upd_usr: userInfo.usr_id,
                        event_time: moment().format("YYYY/MM/DD HH:mm:ss"),
                        kindOfRel: 'dt'
                    });

                    cb(lo_error, lo_result);
                }
            });
        }

    },

    r_SalesmnUpdate: function (postData, session, callback) {
        var lo_updateData = postData["tmpCUD"]["updateData"][0] || {};
        var la_dt_createData = postData["tmpCUD"]["dt_createData"] || [];
        var la_dt_updateData = postData["tmpCUD"]["dt_updateData"] || [];
        var userInfo = session.user;

        var salesParsms = {
            athena_id: userInfo.athena_id,
            sales_cod: lo_updateData.sales_cod
        };
        var rentDatParams = {
            athena_id: userInfo.athena_id,
            hotel_cod: userInfo.hotel_cod
        };

        let lo_result = new ReturnClass();
        let lo_error = null;

        async.waterfall([
            chkNouseDat,//檢查停用狀態及停用年月
            chkUserNos,//檢查使用者代號(訂席用)欄位設定資料是否於其他業務員資料已設定
            updateClassHs//修改組別異動狀態
        ], function (err, result) {
            callback(err, result);
        });

        function chkNouseDat(cb) {
            for (var i = 0; i < la_dt_createData.length; i++) {
                if (la_dt_createData[i]["nouse_dat"] == '') {
                    if (la_dt_createData[i]["status_cod"] == 'X') {
                        lo_result.success = false;
                        lo_result.effectValues = {status_cod1: la_dt_createData[i]["status_cod1"]};
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms62msg5", session.locale);
                        break;
                    }
                }
                else {
                    if (la_dt_createData[i]["status_cod"] == 'N') {
                        lo_result.success = false;
                        lo_result.effectValues = {nouse_dat: ''};
                        lo_result.readonlyFields = 'nouse_dat';
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms62msg4", session.locale);
                        break;
                    }
                }

            }
            for (var j = 0; j < la_dt_updateData.length; j++) {
                if (la_dt_updateData[j]["nouse_dat"] == '') {
                    if (la_dt_updateData[j]["status_cod"] == 'X') {
                        lo_result.success = false;
                        lo_result.effectValues = {status_cod1: la_dt_updateData[j]["status_cod"]};
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms62msg5", session.locale);
                        break;
                    }
                }
                else {
                    if (la_dt_updateData[j]["status_cod"] == 'N') {
                        lo_result.success = false;
                        lo_result.effectValues = {nouse_dat: ''};
                        lo_result.readonlyFields = 'nouse_dat';
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms62msg4", session.locale);
                        break;
                    }
                }
            }
            cb(lo_error, lo_result);
        }

        function chkUserNos(result, cb) {
            var params = {
                athena_id: userInfo.athena_id,
                sales_cod: lo_updateData.sales_cod,
                user_nos: lo_updateData.user_nos
            };
            queryAgent.query("QRY_USER_NOS_IN_SALES_MN".toUpperCase(), params, function (err, getResult) {
                if (err) {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = err;
                    lo_error.errorCod = "1111";
                }
                else {
                    if (getResult.user_nos_count > 0) {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = commandRules.getMsgByCod("pms62msg8", session.locale);
                    }
                }
                cb(lo_error, lo_result);
            });
        }

        function updateClassHs(result, cb) {
            async.waterfall([
                //取舊資料
                function (part_cb) {
                    queryAgent.query("QRY_SALES_MN_ALL_FIELDS".toUpperCase(), salesParsms, function (err, getSalesResult) {
                        part_cb(err, getSalesResult);
                    });
                },
                function (salesData, part_cb) {
                    var ls_oldClassCod = salesData.class_cod;
                    var ls_newClassCod = lo_updateData.class_cod;
                    //若class_cod改變
                    if (ls_newClassCod != ls_oldClassCod) {
                        //取sales_class_hs最後一筆資料
                        queryAgent.query("qry_last_sales_class_hs", salesParsms, function (errClassHsData, classHsData) {
                            if(errClassHsData){
                                lo_result.success = false;
                                lo_error = new ErrorClass();
                                lo_error.errorMsg = errClassHsData;

                                part_cb(lo_error, lo_result);
                            }
                            else{
                                var ls_beginDat = classHsData.begin_dat;
                                // 取訂房中心滾房租日
                                queryAgent.query("QRY_RENT_DAT_HQ".toUpperCase(), rentDatParams, function (err, getResult){
                                    if(err){
                                        lo_result.success = false;
                                        lo_error = new ErrorClass();
                                        lo_error.errorMsg = err;

                                        part_cb(lo_error, lo_result);
                                    }
                                    else{
                                        if(ls_beginDat == getResult.rent_dat_hq){
                                            lo_result.extendExecDataArrSet.push({
                                                function: 2,
                                                table_name: 'sales_class_hs',
                                                condition: [{
                                                    key: 'athena_id',
                                                    operation: "=",
                                                    value: userInfo.athena_id
                                                }, {
                                                    key: 'sales_cod',
                                                    operation: "=",
                                                    value: lo_updateData.sales_cod.trim()
                                                }, {
                                                    key: 'class_cod',
                                                    operation: "=",
                                                    value: ls_oldClassCod
                                                }
                                                ],
                                                class_cod: ls_newClassCod,
                                                upd_dat: moment().format("YYYY/MM/DD"),
                                                upd_usr: userInfo.usr_id,
                                                event_time: moment().format("YYYY/MM/DD HH:mm:ss"),
                                                kindOfRel: 'dt'
                                            });

                                            part_cb(lo_error, lo_result);
                                        }
                                        else{
                                            lo_result.extendExecDataArrSet.push({
                                                function: 2,
                                                table_name: 'sales_class_hs',
                                                condition: [{
                                                    key: 'athena_id',
                                                    operation: "=",
                                                    value: userInfo.athena_id
                                                }, {
                                                    key: 'sales_cod',
                                                    operation: "=",
                                                    value: lo_updateData.sales_cod
                                                }, {
                                                    key: 'class_cod',
                                                    operation: "=",
                                                    value: ls_oldClassCod
                                                }
                                                ],
                                                end_dat: moment(new Date(getResult.rent_dat_hq)).add(-1, 'days').format("YYYY/MM/DD"),
                                                upd_dat: moment().format("YYYY/MM/DD"),
                                                upd_usr: userInfo.usr_id,
                                                event_time: moment().format("YYYY/MM/DD HH:mm:ss"),
                                                kindOfRel: 'dt'
                                            });
                                            lo_result.extendExecDataArrSet.push({
                                                function: '1',
                                                table_name: 'sales_class_hs',
                                                athena_id: userInfo.athena_id,
                                                hotel_cod: userInfo.hotel_cod,
                                                sales_cod: lo_updateData.sales_cod,
                                                class_cod: ls_newClassCod,
                                                begin_dat: moment(new Date(getResult.rent_dat_hq)).format("YYYY/MM/DD"),
                                                end_dat: moment(new Date("2999/12/31")).format("YYYY/MM/DD"),
                                                ins_dat: moment().format("YYYY/MM/DD"),
                                                ins_usr: userInfo.usr_id,
                                                upd_dat: moment().format("YYYY/MM/DD"),
                                                upd_usr: userInfo.usr_id,
                                                event_time: moment().add(1, 'seconds').format("YYYY/MM/DD HH:mm:ss"),
                                                kindOfRel: 'dt'
                                            });

                                            part_cb(lo_error, lo_result);
                                        }
                                    }
                                });
                            }
                        });
                    }
                    else {
                        part_cb(lo_error, lo_result);
                    }
                }
            ], function (err, result) {
                cb(err, result);
            });
        }
    }

};