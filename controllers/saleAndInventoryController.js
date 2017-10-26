
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
                res.json({data: result, error: err});
            });
            break;
        case "getSingleDataMN":
            PSIWService.getSingleDataMN(req.body, req.session, function (err, result) {
                res.json({data: result, error: err});
            });
            break;
        case "getSingleDataDT":
            PSIWService.getSingleDataDT(req.body, req.session, function (err, result) {
                res.json({data: result, error: err});
            });
            break;
        case "getSystemParam":
            PSIWService.getSystemParam(req.body, req.session, function (err, result) {
                res.json({data: result, error: err});
            });
            break;
        case "getShowCodSelect":
            PSIWService.getShowCodSelect(req.body, req.session, function (err, result) {
                res.json({data: result, error: err});
            });
            break;
        case "getCustInfo":
            PSIWService.getCustInfo(req.body, req.session, function (err, result) {
                res.json({data: result, error: err});
            });
            break;
        case "getCustAdd":
            PSIWService.getCustAdd(req.body, req.session, function (err, result) {
                res.json({data: result, error: err});
            });
            break;
        case "getCustContact":
            PSIWService.getCustContact(req.body, req.session, function (err, result) {
                res.json({data: result, error: err});
            });
            break;
        case "getPeriod":
            PSIWService.getPeriod(req.body, req.session, function (err, result) {
                res.json({data: result, error: err});
            });
            break;
        case "getFormatSta":
            PSIWService.getFormatSta(req.body, req.session, function (err, result) {
                res.json({data: result, error: err});
            });
            break;
        case "chkFormatSta":
            PSIWService.chkFormatSta(req.body, req.session, function (err, result) {
                res.json({data: result, error: err});
            });
            break;
    }
};

//call Save API
exports.callSaveAPI = function (req, res) {
    PSIWService.callSaveAPI(req.body, req.session, function (err, result) {
        res.json({data: result, error: err});
    });
};

//call API
exports.callAPI = function (req, res) {
    PSIWService.callAPI(req.body, req.session, function (err, result) {
        res.json({data: result, error: err});
    });
};

//call 貨品API
exports.callOrderAPI = function (req, res) {
    PSIWService.callOrderAPI(req.body, req.session, function (err, result, data) {
        res.json({data: data, result: result, error: err});
    });
};

