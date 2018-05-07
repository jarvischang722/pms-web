/**
 * Created by jing on 2018/05/07.
 */

var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/RoleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/RoleFuncService");

/**
 * 報表(靜態)
 */
exports.getreport = function (req, res) {
    res.render("subsystem/report/report");
}