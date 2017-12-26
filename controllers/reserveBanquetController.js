/**
 * Created by kaiyue on 2017/11/08.
 */

var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var resvBanquetSvc = require("../services/reserveBanquetService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);

//[RS0W212010] 格萊天漾訂席頁
exports.getRS0W212010 = function (req, res) {
    res.render("subsystem/reserveBanquet/RS0W212010");
};

//[RS0W212010] 取格萊天漾查詢頁資料
exports.qryPageOneData = function (req, res) {
    resvBanquetSvc.qryPageOneData(req.body, req.session, function (err, result) {
        res.json({success: result.success, pageOneData: result.defaultValues, errorMsg: err});
    });
};

//[RS0W212010] 取格萊天漾單筆頁資料
exports.qryPageTwoData = function (req, res) {
    resvBanquetSvc.qryPageTwoData(req.body, req.session, function (err, result) {
        res.json({data: result, error: err});
    });
};

//[RS0W212010] 取系統參數
exports.qrySystemParam = function (req, res) {
    resvBanquetSvc.qrySystemParam(req.body, req.session, function (err, result) {
        res.json({data: result, error: err});
    });
};

//[RS0W212010] 取宴席類別
exports.chk_use_typ = function (req, res) {
    resvBanquetSvc.chk_use_typ(req.body, req.session, function (err, result) {
        res.json({data: result, error: err});
    });
};

//[RS0W212010] 取預約處理預設值
exports.def_proc_sta = function (req, res) {
    resvBanquetSvc.def_proc_sta(req.body, req.session, function (err, result) {
        res.json({data: result, error: err});
    });
};

//[RS0W212010] 取已付訂金預設值
exports.def_banlance_amt = function (req, res) {
    resvBanquetSvc.def_banlance_amt(req.body, req.session, function (err, result) {
        res.json({data: result, error: err});
    });
};

//[RS0W212010] 取客戶資料
exports.qry_bqcust_mn = function (req, res) {
    resvBanquetSvc.qry_bqcust_mn(req.body, req.session, function (err, result) {
        res.json({data: result, error: err});
    });
};

//[RS0W212010] 取場地單價
exports.getPlaceUnitAmt = function (req, res) {
    resvBanquetSvc.getPlaceUnitAmt(req.body, req.session, function (err, result) {
        res.json({data: result, error: err});
    });
};

//[RS0W212010] 異動表單狀態
exports.chgOrderStaAPI = function (req, res) {
    resvBanquetSvc.chgOrderStaAPI(req.body, req.session, function (err, result) {
        res.json({success: result, msg: err});
    });
};

