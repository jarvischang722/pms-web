/**
 * Created by a16009 on 2017/10/11.
 * 程式編號: PSIW510030
 * 程式名稱: 門市WEB訂單作業
 */

const _ = require("underscore");
const queryAgent = require('../plugins/kplug-oracle/QueryAgent');
const roleFuncSvc = require("../services/RoleFuncService");
const fs = require("fs");
const path = require('path');
const appRootDir = path.dirname(require.main.filename);
const roleSvc = require("../services/RoleFuncService");
const ruleAgent = require("../ruleEngine/ruleAgent");
const PSIWService = require("../services/SaleAndInventoryService");

//門市WEB訂單作業
exports.getPSIW510030 = function (req, res) {
    res.render("subsystem/saleAndInventory/PSIW510030");
};

//QueryResult
exports.getQueryResult = function (req, res) {

    switch (req.body.func) {
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
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    req.body.ip = ip.substr(ip.lastIndexOf(':') + 1);
    PSIWService.callSaveAPI(req.body, req.session, function (errorMsg, success, data) {
        res.json({data: data, success: success, errorMsg: errorMsg});
    });
};

//call API
exports.callAPI = function (req, res) {
    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
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

    let ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    req.session.ip = ip.substr(ip.lastIndexOf(':') + 1);

    let trans_cod = req.params.trans_cod;

    console.log("transCod :" + trans_cod + ", sendData : " + req.body.data);

    let lo_postData;

    try {
        lo_postData = JSON.parse(new Buffer(req.body.data, 'base64').toString());
    }
    catch (ex) {
        console.error(ex.message);
        let RESPONSE = {
            "RETN-CODE": "9999",
            "RETN-CODE-DESC": "JSON base64解碼失敗"
        };
        return res.json({RESPONSE});
    }

    if (PSIWService[trans_cod]) {
        PSIWService[trans_cod](lo_postData, req.session, function (RESPONSE) {
            res.json({RESPONSE: RESPONSE});
        });
    }
    else {
        res.json({RESPONSE: {"RETN-CODE": "1111", "RETN-CODE-DESC": "無此交易代碼"}});
    }
};



