/**
 * Created by Jun on 2017/2/10.
 */
var datagridSVC = require("../services/DatagridService");
var dataRuleSVC = require("../services/DataRuleService");
var _ = require("underscore");
var commonTools = require("../utils/CommonTools");

/**
 * 取得datagrid資料
 */
exports.prgDataGridDataQuery = function (req, res) {
    var prg_id = req.body["prg_id"];
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

    datagridSVC.fetchPrgDataGrid(req.session, req.body, function (err, dataGridRows, fieldData, la_searchFields) {
        returnData.dataGridRows = dataGridRows;
        returnData.fieldData = fieldData;
        returnData.searchFields = la_searchFields;
        res.json(returnData);
    });

};


/**
 * 使用者離開datagrid 儲存欄位屬性
 */
exports.saveFieldOptionByUser = function (req, res) {
    var fieldOptions = req.body["fieldOptions"];
    var prg_id = req.body["prg_id"];
    var page_id = req.body["page_id"] || 1;

    datagridSVC.doSaveFieldOption(prg_id, page_id, req.session.user, fieldOptions, function (err, success) {
        var errorCode = '';
        if (err) {
            errorCode = '1000';
        }

        res.json({success: success, errorMsg: err, errorCode: errorCode});
    });


};


/**
 * 儲存DataGrid
 */
exports.saveDataRow = function (req, res) {
    datagridSVC.doSaveDataGrid(req.body, req.session, function (err, result) {
        res.json({success: result.success, errorMsg: err});
    });
};

/**
 * datagrid 新增按鈕按下時Rule檢查
 * @param req
 * @param res
 */
exports.handleDataGridAddEventRule = function (req, res) {
    datagridSVC.getPrgRowDefaultObject(req.body, req.session, function (err, result) {
        res.json({success: err == null, errorMsg: err, prgDefaultObj: result.defaultValues});
    });

};

/**
 * datagrid 按下刪除按鈕檢查
 */
exports.handleDataGridDeleteEventRule = function (req, res) {
    dataRuleSVC.chkDatagridDeleteEventRule(req.body, req.session, function (err, result) {
        res.json(commonTools.mergeRtnErrResultJson(err, result));
    });
};

/**
 * 特殊版型多筆，按下特殊按鈕，規則檢查
 * @param req
 * @param res
 */
exports.specialDataGridBtnEventRule = function(req, res){
    dataRuleSVC.chkSpecialDataGridBtnEventRule(req.body, req.session, function (err, result) {
        res.json(commonTools.mergeRtnErrResultJson(err, result));
    });
};