
var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/RoleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/RoleFuncService");

/**
 * 分帳規則(靜態)
 */
// exports.getPMS0830080 = function (req, res) {
//     res.render("subsystem/setup/PMS0830080");
// };
