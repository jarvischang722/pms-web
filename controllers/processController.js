/**
 * Created by jing on 2018/02/27.
 */

var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/RoleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/RoleFuncService");

/**
 * 前台流程設定(靜態)
 */
exports.getPMS0710010 = function (req, res) {
    res.render("subsystem/process/PMS0710010");
}