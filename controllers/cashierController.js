
var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/RoleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/RoleFuncService");

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