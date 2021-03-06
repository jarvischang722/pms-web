/**
 * Created by Jun on 2017/3/7.
 */
let ruleSVC = require("../services/DataRuleService");
let commonTools = require("../utils/CommonTools");
let ruleAgent = require("../ruleEngine/ruleAgent");
let queryAgent = require('../plugins/kplug-oracle/QueryAgent');
const ReturnClass = require("../ruleEngine/returnClass");
const ErrorClass = require("../ruleEngine/errorClass");
/**
 * 欄位規則檢查
 */
exports.chkFieldRule = function (req, res) {
    /**
     * req.body :
     * prg_id         : 程式代號
     * validateField  : 要驗證的欄位
     * singleRowData  : 此筆明細全部資料
     * rule_func_name : 欄位規則函數
     **/
    ruleSVC.handleBlurUiField(req.body, req.session, function (err, result) {

        res.json(commonTools.mergeRtnErrResultJson(err, result));

    });
};

/**
 * 按鈕規則檢查
 * @param req
 * @param res
 */
exports.chkPrgFuncRule = async (req, res) => {
    let lo_result = new ReturnClass();
    let lo_error = null;
    try {
        lo_result = await ruleSVC.handlePrgFuncRule(req.body, req.session);
    }
    catch (errorMsg) {
        lo_error = new ErrorClass();
        lo_result.success = false;
        lo_error.errorMsg = errorMsg.message || errorMsg;
    }
    res.json(commonTools.mergeRtnErrResultJson(lo_error, lo_result));
};

exports.chkDtFieldRule = function (req, res) {
    ruleSVC.handleClickUiRow(req.body, req.session, function (err, result) {
        res.json(commonTools.mergeRtnErrResultJson(err, result));
    });
};

/**
 * data grid select click 規則檢查
 * @param req
 * @param res
 */
exports.chkDgSelectClickRule = function (req, res) {
    ruleSVC.chkSelectClickRule(req.body, req.session, function (err, result) {
        res.json(commonTools.mergeRtnErrResultJson(err, result));
    });
};

/**
 * data grid select grid 搜尋時規則檢查
 * @param req
 * @param res
 */
exports.chkDgSelectgridQryRule = function (req, res) {
    ruleSVC.chkDgSelectgridQryRule(req.body, req.session, function (err, result) {
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

/**
 * 透過規則取資料
 */
exports.queryDataByRule = function (req, res) {
    ruleSVC.handleBlurUiField(req.body, req.session, function (err, result) {
        res.json(commonTools.mergeRtnErrResultJson(err, result));
    });
};

exports.chkSelectOptionRule = async function (req, res) {
    let lo_result = new ReturnClass();
    let lo_error = null;
    try {
        lo_result = await ruleSVC.handleSelectOptionRule(req.body, req.session);
    }
    catch (errorMsg) {
        lo_result.success = false;
        lo_error = new ErrorClass();
        lo_error.errorMsg = errorMsg;
    }
    res.json(commonTools.mergeRtnErrResultJson(lo_error, lo_result));
};


/**
 * 復原此RoomCod 原來的房間名稱
 */
exports.revertRoomNam = function (req, res) {
    ruleAgent.getOriRoomNamByRoomCod(req.body, req.session, function (err, result) {
        res.json(commonTools.mergeRtnErrResultJson(err, result));
    });
};

/**
 * 復原此RoomCod 原來的房間簡稱
 */
exports.revertRoomSna = function (req, res) {
    ruleAgent.getOriRoomSnaByRoomCod(req.body, req.session, function (err, result) {
        res.json(commonTools.mergeRtnErrResultJson(err, result));
    });
};


/**
 * 動態取得Select 資料
 */
exports.getSelectOptions = function (req, res) {
    let _ = require("underscore");
    let ls_keyword = req.body.keyword || "";
    if (_.isEmpty(ls_keyword)) {
        return res.json([]);
    }
    console.log(`關鍵字 :  ${ls_keyword}`);
    queryAgent.queryList("QRY_ALL_USER_WITH_COMP", {athena_id: 1, cmp_id: "MIRACHU"}, 0, 0, function (err, data) {
        let filetedData = _.filter(data, function (data) {
            return _.values(data).join(" ").indexOf(ls_keyword.trim()) > -1;
        });
        let select_data = _.map(filetedData, function (item) {
            return {id: item.usr_id, text: item.usr_cname};
        });
        res.json(select_data);
    });

    // res.json([{text: "哈囉", value: "20"}]);
};