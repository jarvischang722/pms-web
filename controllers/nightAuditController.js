/**
 * Created by jing on 2017/8/03.
 */

var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/RoleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/RoleFuncService");

/**
 * 夜間稽核
 */
exports.getPMS0510010 = function (req, res) {
    res.render("subsystem/nightAudit/PMS0510010");
}
/**
 * 房價稽核表
 */
exports.getPMS0510020 = function (req, res) {
    res.render("subsystem/nightAudit/PMS0510020");
}