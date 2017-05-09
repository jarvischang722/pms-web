/**
 * Created by Jun on 2017/5/9.
 */
var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var tbSVC = require("../services/dbTableService");
var mongoAgent = require("../plugins/mongodb");


/**
 * 前台參數設定 Module
 */
exports.front_desk_conf = function (req, res) {
    res.render('subsystem/setup/front_desk_conf');
};

/**
 * 訂房對照檔
 */
exports.reservation_comparison = function (req, res) {
    res.render('subsystem/setup/reservation_comparison');
};