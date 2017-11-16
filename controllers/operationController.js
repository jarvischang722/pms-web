/**
 * Created by kaiyue on 2017/11/13.
 */

const _ = require("underscore");
const queryAgent = require('../plugins/kplug-oracle/QueryAgent');
const fs = require("fs");
const path = require('path');

const appRootDir = path.dirname(require.main.filename);
const operSVC = require("../services/operationService");
const dbSVC = require("../services/DbTableService");
const tools = require(appRootDir + "/utils/CommonTools");

/**
 * 執行作業sql 程序
 */
exports.doOperationSave = function (req, res) {
    req.body.page_id = req.body.page_id || 1;
    doOperationProc(req, res);
};

function doOperationProc(req, res) {
    req.body.trans_cod = req.body.trans_cod || "BAC03009010000";

    //特殊交易
    if (req.body.trans_cod != "" && req.body.trans_cod != "BAC03009010000") {
        dbSVC.execTransSQL(req.body, req.session, function (err, success) {
            res.json(tools.mergeRtnErrResultJson(err, success));
        });
    }
    //一般儲存
    else {
        dbSVC.execNormalSQL(req.body, req.session, function (err, success) {
            res.json(tools.mergeRtnErrResultJson(err, success));
        });
    }
}

exports.fetchDataGridFieldData = function (req, res) {
    let ls_prg_id = req.body.prg_id || "";
    let returnData = {
        success: true,
        errorMsg: "",
        errorCode: ""
    };
    if (ls_prg_id.trim() == "") {
        returnData.success = false;
        returnData.errorMsg = "無效程式編號";
        returnData.errorCode = "1000";
        return res.json(returnData);
    }

    operSVC.fetchDataGridFieldData(req.body, req.session, function (err, result) {
        let rtnData = {
            success: _.isNull(err),
            errorMsg: err,
            dgFieldsData: result.dgFieldsData,
            dgRowData: result.dgRowData,
            searchFields: result.searchFields
        };
        res.json(rtnData);
    });
};