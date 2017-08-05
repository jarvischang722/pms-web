/**
 * Created by Jun Chang on 2017/2/7.
 */
var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var tbSVC = require("../services/DbTableService");
var mongoAgent = require("../plugins/mongodb");
var ejs = require("ejs");
var fs = require("fs");

/**
 * 設定檔
 */
exports.dataSetting = function (req, res) {
    res.render("subsystem/setup/dataGridTmp", {prg_id: req.params.prg_id});
};

/**
 * 對照檔入口
 */
exports.mainSetUp = function (req, res) {

    var prg_id = req.params.prg_id || "";
    var temp_page = "";
    mongoAgent.TemplateRf.find({prg_id: prg_id}).sort({page_id: 1}).exec(function (err, tmpInfo) { //page_id先排序，後判斷規則
        if (tmpInfo && tmpInfo.length > 0) {

            if(tmpInfo.length == 1 && tmpInfo[0].template_id == "datagrid"){
                //多筆
                temp_page = 'dataGridSetUp';
            }else if(tmpInfo.length > 1 && tmpInfo[0].template_id == "datagrid"){
                //單筆
                temp_page = 'gridSingleSetUp';
            }else {
                //特殊版型
                temp_page = 'specialSetUp';
            }

            res.redirect("/" + temp_page + "/" + prg_id);
        } else {
            var exHtml = fs.readFileSync(__dirname + '/../views/system/errorProgram.ejs', 'utf8');
            res.end(ejs.render(exHtml,{prg_id:prg_id}));
        }

    });

};

/**
 * 多檔設定頁面
 */
exports.dataGridSetUp = function (req, res) {
    res.render("subsystem/setup/dataGridTmp", {prg_id: req.params.prg_id});
};

/**
 * 單檔設定頁面
 */
exports.gridSingleSetUp = function (req, res) {
    res.render("subsystem/setup/gridSingle", {prg_id: req.params.prg_id});
};

/**
 * 特殊版型設定頁面
 */
exports.specialSetUp = function (req, res) {
    res.render("subsystem/setup/specialTmp/"+req.params.prg_id, {prg_id: req.params.prg_id});
};

/**
 * Table lock
 */
exports.dbTableLock = function (req, res) {
    var userInfo = req.session.user;
    var page_id = req.body["page_id"] || 1;
    var prg_id = req.body["prg_id"];
    var key_cod = req.body["key_cod"] || "";
    mongoAgent.TemplateRf.findOne({prg_id: prg_id, page_id: page_id}, function (err, template) {

        if (!err && template) {
            template = template.toObject();
            tbSVC.doTableLock(prg_id, template.lock_table, userInfo,
                template.lock_type == "table" ? "T" : "R", key_cod, "", function (err, success) {
                    res.json({success: success, errorMsg: err});
                });
        } else {
            res.json({success: true, errorMsg: "not found unlock table name"});
        }


    });
};

/**
 * Table unlock
 */
exports.dbTableUnLock = function (req, res) {
    var userInfo = req.session.user;
    var page_id = req.body["page_id"] || 1;
    var prg_id = req.body["prg_id"];
    var key_cod = req.body["key_cod"] || "";
    mongoAgent.TemplateRf.findOne({prg_id: prg_id, page_id: page_id}, function (err, template) {

        if (!err && template) {
            template = template.toObject();
            tbSVC.doTableUnLock(prg_id, template.lock_table, userInfo,
                template.lock_type == "table" ? "T" : "R", key_cod, "", function (err, success) {
                    res.json({success: success, errorMsg: err});
                });
        } else {
            res.json({success: true, errorMsg: "not found unlock table name"});
        }


    });
};