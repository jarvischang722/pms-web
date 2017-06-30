/**
 * Created by Jun on 2017/6/27.
 */
var GatewaySVC = require("../services/GatewayService");
var commonTools = require("../utils/CommonTools");
var _ = require("underscore");

exports.genRoomTypeStoc = function (req, res) {
    GatewaySVC.genRoomTypeStock(req.session, req.body, function (err, success) {
        res.json({success: success, errorMsg: err});
    });
};

exports.uploadRoomTypePic = function (req, res) {
    GatewaySVC.uploadRoomTypePic(req.session, req.body, function (err, success) {
        res.json({success: success, errorMsg: err});
    });
};

exports.uploadRoomType = function (req, res) {
    GatewaySVC.uploadRoomType(req.session, req.body, function (err, success) {
        res.json({success: success, errorMsg: err});
    });
};