
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
