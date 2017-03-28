/**
 * Created by Jun Chang on 2017/2/7.
 */
var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var tbSVC = require("../services/dbTableService");
var mongoAgent = require("../plugins/mongodb");


/**
 *
 */
exports.manageSetting = function (req, res) {
    res.render('setting/manageSetting');
};


/**
 * 設定檔
 */
exports.dataSetting = function (req, res) {
    res.render("setting/dataGridTmp", {prg_id: req.params.prg_id});
};

/**
 * 對照檔入口
 */
exports.mainSetUp = function (req, res) {

    var prg_id = req.params.prg_id || "";
    var temp_page = "";
    mongoAgent.UI_PageField.findOne({prg_id: prg_id, page_id: 1}, function (err, pageInfo) {
        if (pageInfo) {
            if (pageInfo.template_id == "gridsingle") {
                temp_page = 'gridSingleSetUp';
            } else if (pageInfo.template_id == "datagrid") {
                temp_page = 'dataGridSetUp';
            }
            res.redirect("/" + temp_page + "/" + prg_id);
        } else {
            res.end("<h1>Invaild program ID</h1>")
        }

    });

};

/**
 * 多檔設定頁面
 */
exports.dataGridSetUp = function (req, res) {
    res.render("setting/dataGridTmp", {prg_id: req.params.prg_id});
};

/**
 * 單檔設定頁面
 */
exports.gridSingleSetUp = function (req, res) {
    res.render("setting/gridSingle", {prg_id: req.params.prg_id});
};

/**
 * Table lock
 */
exports.dbTableLock = function (req, res) {
    var prg_id = req.body["prg_id"];
    var user = req.session.user.usr_id || "";
    var key_cod = req.body["key_cod"] || null;
    mongoAgent.UI_PageField.findOne({prg_id: prg_id, page_id: 1, ui_type: 'grid'}, function (err, field) {
        if (!err && field) {
            field = field.toObject();
            mongoAgent.UI_Type_Grid.findOne({
                prg_id: prg_id,
                ui_field_name: field.ui_field_name
            }, function (err, gridObj) {
                if (!err && gridObj) {
                    gridObj = gridObj.toObject();
                    tbSVC.doTableLock(prg_id,
                        gridObj.lock_table,
                        user,
                        gridObj.lock_type == "table" ? "T" : "R",
                        key_cod,
                        function (errorMsg, success) {
                            res.json({success: success, errorMsg: errorMsg})
                        })
                } else {
                    res.json({success: true, errorMsg: "not found lock table"})
                }
            });
        } else {
            res.json({success: true, errorMsg: "not found lock table"})
        }
    })
};

/**
 * Table unlock
 */
exports.dbTableUnLock = function (req, res) {

    var prg_id = req.body["prg_id"];
    var user = req.session.user.usr_id || "";
    var key_cod = req.body["key_cod"] || null;
    mongoAgent.UI_PageField.findOne({prg_id: prg_id, page_id: 1, ui_type: 'grid'}, function (err, field) {
        if (!err && field) {
            field = field.toObject();
            mongoAgent.UI_Type_Grid.findOne({
                prg_id: prg_id,
                ui_field_name: field.ui_field_name
            }, function (errorMsg, gridObj) {

                if (!errorMsg && gridObj) {
                    gridObj = gridObj.toObject();
                    tbSVC.doTableUnLock(prg_id,
                        gridObj.lock_table,
                        user,
                        gridObj.lock_type == "table" ? "T" : "R",
                        key_cod,
                        function (err, success) {
                            res.json({success: success, errorMsg: errorMsg})
                        })
                } else {
                    res.json({success: true, errorMsg: "not found unlock table"})
                }


            });
        } else {
            res.json({success: true, errorMsg: "not found unlock table"})
        }
    })
};