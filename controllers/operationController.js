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

/**
 * 取多筆欄位資料
 */
exports.fetchDgFieldData = function (req, res) {
    let lo_chkResult = chkPrgID(req);
    if(lo_chkResult.success == false){
        return res.json(lo_chkResult);
    }
    operSVC.fetchDgFieldData(req.body, req.session, function (err, result) {
        let lo_rtnData = {
            success: _.isNull(err),
            errorMsg: err,
            dgFieldsData: result.dgFieldsData,
            dgRowData: result.dgRowData,
            searchFields: result.searchFields
        };
        res.json(lo_rtnData);
    });
};

/**
 * 取單筆欄位資料
 */
exports.fetchGsFieldData = function(req, res){
    let lo_chkResult = chkPrgID(req);
    if(lo_chkResult.success == false){
        return res.json(lo_chkResult);
    }
    operSVC.fetchGsFieldData(req.body, req.session, function (err, result) {
        let lo_rtnData = {
            success: _.isNull(err),
            errorMsg: err,
            gsDtData: result.gsDtData,
            gsMnData: result.gsMnData
        };
        res.json(lo_rtnData);
    });
};

// 驗證prg_id
function chkPrgID(req){
    let ls_prg_id = req.body.prg_id || "";
    let lo_returnData = {
        success: true,
        errorMsg: "",
        errorCode: ""
    };
    if (ls_prg_id.trim() == "") {
        lo_returnData.success = false;
        lo_returnData.errorMsg = "無效程式編號";
        lo_returnData.errorCode = "1000";
    }
    return lo_returnData;
}