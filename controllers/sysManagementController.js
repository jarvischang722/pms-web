/**
 * Created by jing on 2018/04/26.
 */

var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/RoleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/RoleFuncService");

/**
 * 客戶購買授權(靜態)
 */
exports.getSYS0210010 = function (req, res) {
    res.render("subsystem/sysManagement/SYS0210010");
}