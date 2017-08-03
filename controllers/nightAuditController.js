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
 * 房價稽核表
 */
exports.getPMS0510020 = function (req, res) {
    res.render("subsystem/nightAudit/PMS0510020");
}