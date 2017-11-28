/**
 * Created by kaiyue on 2017/11/08.
 */

var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var resvBanquetSvc = require("../services/reserveBanquetService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);

//[RS0W202010] 格萊天漾訂席頁
exports.getRS0W202010 = function (req, res) {
    res.render("subsystem/reserveBanquet/RS0W202010");
};

//[RS0W202010] 取格萊天漾查詢頁資料
exports.qryPageOneData = function (req, res) {
    resvBanquetSvc.qryPageOneData(req.body, req.session, function (err, result) {
        res.json({success: result.success, pageOneData: result.defaultValues});
    });
};

//[RS0W202010] 取格萊天漾單筆頁資料
exports.qryPageTwoData = function (req, res) {
    resvBanquetSvc.qryPageTwoData(req.body, req.session, function (err, result) {
        res.json({data: result, error: err});
    });
};

//[RS0W202010] 取系統參數
exports.qrySystemParam = function (req, res) {
    resvBanquetSvc.qrySystemParam(req.body, req.session, function (err, result) {
        res.json({data: result, error: err});
    });
};

//[RS0W202010] 取宴席類別
exports.chk_use_typ = function (req, res) {
    resvBanquetSvc.chk_use_typ(req.body, req.session, function (err, result) {
        res.json({data: result, error: err});
    });
};