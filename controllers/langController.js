/**
 * Created by Jun on 2017/4/26.
 */
const datagridSVC = require("../services/datagridService");
const dataRuleSVC = require("../services/dataRuleService");
const langSVC = require("../services/langService");
const _ = require("underscore");
const commonTools = require("../utils/commonTools");
const mongoAgent = require("../plugins/mongodb");
const fs = require("fs");

/**
 * 一個欄位全語系的內容
 */
exports.fieldAllLocaleContent = function (req, res) {

    langSVC.handleRowDataMultiLang(req, ui_field_name, function (multiLangData) {
        res.json({success: true, multiLangContentList: multiLangData});
    });
};

/**
 * 全部多語欄位資料
 */
exports.multiLangFieldContentByKey = function (req, res) {

    langSVC.handleRowDataMultiLang(req, "", function (multiLangData) {
        res.json({success: true, multiLangContent: multiLangData});
    });


};

/**
 * 取得目前語系對應檔內容
 */
exports.getLocaleContent = function (req, res) {
    var appRootPath = require('app-root-path').path;
    var localeContent = {};
    var localesPath = appRootPath + "/locales/";

    fs.exists(localesPath + req.session.locale.toLowerCase() + ".json", function (isExist) {
        if (isExist) {
            localeContent = require(localesPath + req.session.locale.toLowerCase() + ".json");
        } else {
            console.error("找不到多語系對應檔案[" + localesPath + req.session.locale.toLowerCase() + ".json" + "]");
            localeContent = require(localesPath + "en.json");
        }
        res.json({success: true, localeContent: localeContent});
    });
};