/**
 * Created by Jun on 2017/3/7.
 */
var ruleSVC = require("../services/DataRuleService");
var commonTools = require("../utils/CommonTools");

/**
 * 欄位規則檢查
 */
exports.chkFieldRule = function (req, res) {

    /** req.body :
     prg_id         : 程式代號
     validateField  : 要驗證的欄位
     singleRowData  : 此筆明細全部資料
     rule_func_name : 欄位規則函數
     **/
    ruleSVC.handleBlurUiField(req.body, req.session, function (err, result) {

        res.json(commonTools.mergeRtnErrResultJson(err, result));

    });

};

exports.chkDtFieldRule = function (req, res) {
    ruleSVC.handleClickUiRow(req.body, req.session, function(err, result){
        res.json(commonTools.mergeRtnErrResultJson(err, result));
    });
};

/**
 * 新增按鈕需要執行的規則
 */
exports.addFuncRule = function (req, res) {
    ruleSVC.handleAddFuncRule(req.body, req.session, function (err, result) {
        res.json(commonTools.mergeRtnErrResultJson(err, result));
    });
};


/**
 * 編輯按鈕需要執行的規則
 */
exports.editFuncRule = function (req, res) {
    ruleSVC.handleEditFuncRule(req.body, req.session, function (err, result) {
        res.json(commonTools.mergeRtnErrResultJson(err, result));
    });
};

/**
 * 刪除按鈕需要執行的規則
 */
exports.deleteFuncRule = function (req, res) {
    ruleSVC.handleDeleteFuncRule(req.body, req.session, function (err, result) {
        res.json(commonTools.mergeRtnErrResultJson(err, result));
    });
};

//TODO: 小良Rule完成後可刪
exports.getKeyNos = function(req, res){
    ruleSVC.getKeyNos(req.body, req.session, function(err, result){
        res.json(commonTools.mergeRtnErrResultJson(err, result));
    });
};

