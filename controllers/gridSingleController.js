/**
 * Created by Jun Chang on 2017/2/24.
 * 單檔對照
 */
var singleGridSVC = require("../services/gridSingleService");
var _ = require("underscore");
var i18n = require("i18n");
var ruleSVC = require("../services/dataRuleService");
var commonTools = require("../utils/commonTools");
/**
 * 取得singleGrid 欄位資料
 */
exports.singleGridPageFieldQuery = function (req, res) {
    var prg_id = req.body["prg_id"];
    var page_id = req.body["page_id"] ? Number(req.body["page_id"]) : 1;
    var returnData = {
        success: true,
        errorMsg: "",
        errorCode: ""
    };
    if (_.isUndefined(prg_id) || _.isNull(prg_id)) {

        returnData.success = false;
        returnData.errorMsg = "無效程式編號";
        returnData.errorCode = "1000";

        res.json(returnData);
        return;
    }

    singleGridSVC.fetchPageFieldAttr(req.session, page_id, prg_id, function (err, fieldData) {
        returnData.fieldData = fieldData;
        res.json(returnData);
    });

};


/**
 * 取得single 資料
 */
exports.singlePageRowDataQuery = function (req, res) {
    singleGridSVC.handleSinglePageRowData(req.session, req.body, function (err, result) {
        res.json(commonTools.mergeRtnErrResultJson(err,result));
    });
};

/**
 * singleGrid儲存新增修改刪除
 */
exports.saveGridSingleData = function (req, res) {
    singleGridSVC.handleSaveSingleGridData(req.body,req.session, function (errorMsg, result) {
        res.json({success: result.success, errorMsg: errorMsg});
    });
};
