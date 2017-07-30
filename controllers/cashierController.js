var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/RoleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/RoleFuncService");
var commonTools = require("../utils/CommonTools");

/**
 * 外幣匯兌(靜態)
 */
exports.getPMS0320010 = function (req, res) {
    res.render("subsystem/cashier/PMS0320010");
};
/**
 * 住客帳維護(靜態)
 */
exports.getPMS0310010 = function (req, res) {
    res.render("subsystem/cashier/PMS0310010");
};

/**
 * 出鈉-已結帳處理(靜態)
 */
exports.getPMS0310030 = function (req, res) {
    res.render("subsystem/cashier/PMS0310030");
};

/**
 * 取得收入小分類
 */
exports.getStypeRf = function (req, res) {
    queryAgent.queryList("QRY_STYPE_RF", {
        athena_id: req.session.user.athena_id,
        hotel_cod: req.session.user.hotel_cod
    }, 0, 0, function (err, stypeList) {
        res.json({success: true, stypeList: stypeList});
    });

};

/**
 * 取得收入小分類
 */
exports.getRouteDtByRouteCod = function (req, res) {
    queryAgent.queryList("QRY_ROUTE_DT_BY_ROUTE_COD", {
        athena_id: req.session.user.athena_id,
        hotel_cod: req.session.user.hotel_cod,
        route_cod: req.body.route_cod
    }, 0, 0, function (err, routeDtList) {
        res.json({success: true, routeDtList: commonTools.trimObjectAllVal(routeDtList)});
    });
};