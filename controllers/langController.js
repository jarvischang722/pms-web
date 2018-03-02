/**
 * Created by Jun on 2017/4/26.
 */
const datagridSVC = require("../services/DatagridService");
const dataRuleSVC = require("../services/DataRuleService");
const langSVC = require("../services/LangService");
const _ = require("underscore");
const commonTools = require("../utils/CommonTools");
const mongoAgent = require("../plugins/mongodb");
const fs = require("fs");

/**
 * 一個欄位全語系的內容
 */
exports.fieldAllLocaleContent = function (req, res) {

    langSVC.handleRowDataMultiLang(req, req.body.ui_field_name, function (multiLangData) {
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
    let appRootPath = require('app-root-path').path;
    let localeContent = {};
    let ls_localesPath = appRootPath + "/locales/";
    let ls_locale = req.cookies.locale.toLowerCase();
    try {
        fs.exists(ls_localesPath + ls_locale + ".json", function (isExist) {
            if (isExist) {
                localeContent = require(ls_localesPath + ls_locale + ".json");
            } else {
                console.error("找不到多語系對應檔案[" + ls_localesPath + ls_locale + ".json" + "]");
                localeContent = require(ls_localesPath + "en.json");
            }
            res.json({success: true, localeContent: localeContent});
        });
    }
    catch (ex) {
        console.error(ex);
    }

};