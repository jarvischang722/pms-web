/**
 * Created by kaiyue on 2017/11/13.
 */

const _ = require("underscore");
const queryAgent = require('../plugins/kplug-oracle/QueryAgent');
const fs = require("fs");
const path = require('path');
const operationSvc = require("../services/operationService");
const commonTools = require("../utils/CommonTools");


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

    operationSvc.fetchDataGridFieldData(req.body, res.session, function (err, success) {
        res.json(commonTools.mergeRtnErrResultJson(err, success));
    });
};