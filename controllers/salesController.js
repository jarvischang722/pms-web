
var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/RoleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/RoleFuncService");


//商務公司資料編輯
exports.getPMS0610010 = function (req, res) {
    res.render("subsystem/sales/PMS0610010");
};
//業務員資料編輯(業務→業務員設定作業→業務員資料維護)
exports.getPMS0620010 = function (req, res) {
    res.render("subsystem/sales/PMS0620010");
};

//業務 拜訪計畫
exports.getPMS0620040 = function (req, res) {
    res.render("subsystem/sales/PMS0620040");
};

//業務 拜訪計畫
exports.getPMS0620050 = function (req, res) {
    res.render("subsystem/sales/PMS0620050");
};
