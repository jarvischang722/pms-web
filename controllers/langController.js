/**
 * Created by Jun on 2017/4/26.
 */
var datagridSVC = require("../services/datagridService");
var dataRuleSVC = require("../services/dataRuleService");
var langSVC = require("../services/langService");
var _ = require("underscore");
var commonTools = require("../utils/commonTools");
var mongoAgent = require("../plugins/mongodb");

/**
 * 一個欄位全語系的內容
 */
exports.fieldAllLocaleContent = function (req, res) {

    var rowData = req.body["rowData"];
    var prg_id = req.body["prg_id"];
    var page_id = req.body["page_id"];
    var ui_field_name = req.body["ui_field_name"];

    langSVC.handleRowDataMultiLang(prg_id, page_id, rowData, "gridsingle",ui_field_name, function (multiLangData) {
        res.json({success: true, multiLangContentList: multiLangData});
    })
};

/**
 * 全部多語欄位資料
 */
exports.multiLangFieldContentByKey = function (req, res) {

    var rowData = req.body["rowData"];
    var prg_id = req.body["prg_id"];
    var page_id = req.body["page_id"];
    var dataType = req.body["dataType"] || "datagrid"; // da`tagrid | girdsingle
    langSVC.handleRowDataMultiLang(prg_id, page_id, rowData, dataType,"", function (multiLangData) {
        res.json({success: true, multiLangContent: multiLangData});
    })


};