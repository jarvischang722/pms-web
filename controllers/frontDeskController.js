/**
 * Created by jing on 2017/7/05.
 */

var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/RoleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/RoleFuncService");

/**
 * 櫃檯備品(靜態)
 */
exports.getPMS0210010 = function (req, res) {
    res.render("subsystem/frontDesk/PMS0210010");
}
/**
 * 團體管理(靜態)
 */
exports.getPMS0210040 = function (req, res) {
    res.render("subsystem/frontDesk/PMS0210040");
};