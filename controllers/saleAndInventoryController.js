
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
exports.getPSIW510030 = function (req, res) {
    res.render("subsystem/saleAndInventory/PSIW510030");
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
        case "getUnitSelect":
            PSIWService.getUnitSelect(req.body, req.session, function (err, result) {
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
        case "getAllFormatSta":
            PSIWService.getAllFormatSta(req.body, req.session, function (err, result) {
                res.json({data: result, error: err});
            });
            break;
        case "getGoodsData":
            PSIWService.getGoodsData(req.body, req.session, function (err, result) {
                res.json({data: result, error: err});
            });
            break;
        case "getSearchFormatSta":
            PSIWService.getSearchFormatSta(req.body, req.session, function (err, result) {
                res.json({data: result, error: err});
            });
            break;
        case "getSearchShowCod":
            PSIWService.getSearchShowCod(req.body, req.session, function (err, result) {
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
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    req.body.ip = ip.substr(ip.lastIndexOf(':') + 1);
    PSIWService.callSaveAPI(req.body, req.session, function (errorMsg, success, data) {
        res.json({data: data, success: success, errorMsg: errorMsg});
    });
};

//call API
exports.callAPI = function (req, res) {
    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    req.body.ip = ip.substr(ip.lastIndexOf(':') + 1);
    PSIWService.callAPI(req.body, req.session, function (errorMsg, success) {
        res.json({success: success, errorMsg: errorMsg});
    });
};

//call 貨品API
exports.callOrderAPI = function (req, res) {
    PSIWService.callOrderAPI(req.body, req.session, function (errorMsg, success, data) {
        res.json({data: data, success: success, errorMsg: errorMsg});
    });
};

//WebService
exports.dominosWebService = function (req, res) {

    var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    req.session.ip = ip.substr(ip.lastIndexOf(':') + 1);

    var trans_cod = req.params.trans_cod;

    switch (trans_cod)
    {
        case 'PSI0000001':
            PSIWService.PSI0000001(req.body.data, req.session, function (RESPONSE) {
                res.json({RESPONSE: RESPONSE});
            });
            break;
        case 'PSI0000002':
            PSIWService.PSI0000002(req.body.data, req.session, function (RESPONSE) {
                res.json({RESPONSE: RESPONSE});
            });
            break;
        case 'PSI0000003':
            PSIWService.PSI0000003(req.body.data, req.session, function (RESPONSE) {
                res.json({RESPONSE: RESPONSE});
            });
            break;
        default:
            break;

    }

};



