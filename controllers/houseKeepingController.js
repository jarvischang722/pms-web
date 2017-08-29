
var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/RoleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/RoleFuncService");

/**
 * 失物管理(靜態)
 */
exports.getPMS0410050 = function (req, res) {
    res.render("subsystem/housekeeping/PMS0410050");
};
/**
 * 房務入帳
 */
exports.getPMS0410020 = function (req, res) {
    res.render("subsystem/housekeeping/PMS0410020");
};
/**
 * 房務管理
 */
exports.getPMS0410010 = function (req, res) {
    res.render("subsystem/housekeeping/PMS0410010");
};
/**
 * 打掃安排
 */
exports.getPMS0410060 = function (req, res) {
    res.render("subsystem/housekeeping/PMS0410060");
};