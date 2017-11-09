/**
 * Created by kaiyue on 2017/11/08.
 */

var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var resvBanquetSvc = require("../services/reserveBanquetService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);

//[RS00202010] 格萊天漾訂席頁
exports.getRS00202010 = function (req, res) {
    res.render("subsystem/reserveBanquet/RS00202010");
};

//[RS00202010] 取格萊天漾查詢頁資料
exports.qryPageOneData = function (req, res) {
    resvBanquetSvc.qryPageOneData(req.body, req.session, function (err, result) {
        res.json({success: result.success, pageOneData: result.defaultValues});
    });
};