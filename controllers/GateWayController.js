/**
 * Created by Jun on 2017/6/27.
 */
var GatewaySVC = require("../services/GatewayService");
var dbSVC = require("../services/DbTableService");
var commonTools = require("../utils/CommonTools");
var _ = require("underscore");

/**
 * 產生房型庫存
 */
exports.genRoomTypeStock = function (req, res) {
    GatewaySVC.genRoomTypeStock(req.session, req.body, function (err, success) {
        res.json({success: success, errorMsg: err});
    });
};

/**
 * 上傳圖片
 */
exports.uploadRoomTypePic = function (req, res) {
    GatewaySVC.uploadRoomTypePic(req.session, req.body, function (err, success) {
        res.json({success: success, errorMsg: err});
    });
};

/**
 * 上傳房型到ERP
 */
exports.uploadRoomType = function (req, res) {
    GatewaySVC.uploadRoomType(req.session, req.body, function (err, success) {
        res.json({success: success, errorMsg: err});
    });
};