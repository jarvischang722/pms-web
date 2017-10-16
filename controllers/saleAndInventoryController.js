
var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/RoleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/RoleFuncService");
var ruleAgent = require("../ruleEngine/ruleAgent");
var PSIWService = require("../services/SaleAndInventoryService");

//門市WEB訂單作業
exports.getPSIW500030 = function (req, res) {
    res.render("subsystem/saleAndInventory/PSIW500030");
};

//QueryResult
exports.getQueryResult = function (req, res) {

    switch (req.body.func)
    {
        case "getDataGridRows":
            PSIWService.getDataGridRows(req.body, req.session, function (err, result) {
                res.json({data: result, errorMsg: err});
            });
            break;
    }


};