var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/RoleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/RoleFuncService");
var ruleAgent = require("../ruleEngine/ruleAgent");
var salesSVC = require("../services/SalesService");
var singleGridSVC = require("../services/GridSingleService");
var commonTools = require("../utils/CommonTools");


//商務公司資料編輯
exports.getPMS0610010 = function (req, res) {
    res.render("subsystem/sales/PMS0610010");
};
//業務員資料編輯(業務→業務員設定作業→業務員資料維護)
exports.getPMS0620010 = function (req, res) {
    res.render("subsystem/sales/PMS0620010");
};

//業務 拜訪計畫
exports.getPMS0620040 = function (req, res) {
    res.render("subsystem/sales/PMS0620040");
};

//業務 拜訪紀錄
exports.getPMS0620050 = function (req, res) {
    res.render("subsystem/sales/PMS0620050");
};

exports.qrySalesMn = function (req, res) {
    ruleAgent.qrySalesMn(req.body, req.session, function (err, getResult) {
        res.json({success: _.isNull(err), errorMsg: err, data: getResult.effectValues});
    });
};

exports.qryTreeSelectData = function (req, res) {
    ruleAgent.qryTreeSelectData(req.body, req.session, function (err, getResult) {
        res.json(commonTools.mergeRtnErrResultJson(err, getResult));
    });
};

// 業務員資料編輯(欄位資料)
exports.qrySingleGridFieldData_PM0620020 = function (req, res) {
    var prg_id = req.body["prg_id"];
    var page_id = req.body["page_id"] ? Number(req.body["page_id"]) : 1;
    var singleRowData = req.body.singleRowData || "";
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

    salesSVC.handleSinglePageFieldData_PM0620020(req.session, req.body, function (err, result) {
        if (err) {
            returnData.success = false;
            returnData.errorMsg = err;
            returnData.errorCode = err;
        }
        else {
            returnData.salesMnField = result[0];
            returnData.hotelDtField = result[1];
            returnData.classHsField = result[2];
        }
        res.json(returnData);
    });


};

// 業務員資料編輯(單筆資料)
exports.qrySalesMn_PM0620020 = function (req, res) {
    var returnData = {
        success: true,
        errorMsg: "",
        errorCode: ""
    };
    salesSVC.handleSinglePageRowData_PM0620020(req.session, req.body, function (err, result) {
        if (err) {
            returnData.success = false;
            returnData.errorMsg = err;
            returnData.errorCode = err;
        }
        else {
            returnData.rtnObject = result;
        }
        res.json(returnData);
    });
};

// 業務員新增按鈕需要執行的規則
exports.addFuncRule_PMS0620020 = function (req, res) {
    salesSVC.handleAddFuncRule_PMS0620020(req.session, req.body, function (err, result) {
        res.json(commonTools.mergeRtnErrResultJson(err, result));
    });
};

//業務員指派(修改商務公司的業務員)
exports.doEditSalesClerk = function (req, res) {
    salesSVC.handleEditSalesClerk(req.session, req.body, function (err, result) {
        res.json(commonTools.mergeRtnErrResultJson(err, result));
    });
};


