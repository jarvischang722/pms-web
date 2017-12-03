/**
 * Created by jing on 2017/11/25.
 */

var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/RoleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/RoleFuncService");



/**
 * 設定 layout
 */
exports.setupLayout = function (req, res) {
    var mdl_id = req.params.mdl_id; //模組ID
    res.render('subsystem/setup/setupLayout', {mdl_id: mdl_id, usingSubsysID: req.cookies["usingSubsysID"]});
};



/**
 * 設定欄位寬度的屬性
 */
exports.getSetPageProSize = function (req, res) {
    res.render("subsystem/admin/setPageProSize");
};
