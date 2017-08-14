let _ = require("underscore");
let queryAgent = require('../plugins/kplug-oracle/QueryAgent');
let roleFuncSvc = require("../services/RoleFuncService");
let fs = require("fs");
let path = require('path');
let appRootDir = path.dirname(require.main.filename);
let roleSvc = require("../services/RoleFuncService");
let commonTools = require("../utils/CommonTools");
let dbTableSvc = require("../services/DbTableService");
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

/**
 * PMS0830080 分帳規則儲存
 */
exports.doSavePMS0830080 = function (req ,res) {
    dbTableSvc.doSavePMS0830080(req.session, req.body,function(errorMsg, success){
        res.json({success:success,errorMsg:errorMsg});
    });
};

/**
 * 取得虛擬帳單項目設定>單筆
 */
exports.qryPMS0830070SingleMn = function (req, res) {
    queryAgent.queryList("QRY_SINGLE_HC_ADJFOLIO_MN", {
        athena_id: req.session.user.athena_id,
        hotel_cod: req.session.user.hotel_cod,
        route_cod: req.body.adjfolio_cod
    }, 0, 0, function (err, routeDtList) {
        res.json({success: true, routeDtList: commonTools.trimObjectAllVal(routeDtList)});
    });
};