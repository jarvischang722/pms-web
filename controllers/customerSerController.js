/**
 * Created by jing on 2018/03/29.
 */

var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/RoleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/RoleFuncService");

/**
 * 客戶維護(靜態)
 */
exports.getSER0110010 = function (req, res) {
    res.render("subsystem/customerService/SER0110010");
}