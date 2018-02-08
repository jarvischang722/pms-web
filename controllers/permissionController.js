/**
 * Created by kaiyue on 2017/12/26.
 */

const _ = require("underscore");
const queryAgent = require('../plugins/kplug-oracle/QueryAgent');
const fs = require("fs");
const path = require('path');
const permissionSvc = require("../services/permissionService");

/**
 * 新增角色權限
 */
exports.saveAuthByRole = function (req, res) {
    permissionSvc.saveAuthByRole(req.body, req.session, function (err, result) {
        res.json({success: err == null, errMsg: err, data: result});
    });
};

/**
 * 新增人員權限
 */
exports.saveAuthByStaff = function (req, res) {
    permissionSvc.saveAuthByStaff(req.body, req.session, function (err, result) {
        res.json({success: err == null, errMsg: err, data: result});
    });
};

/**
 * 新增功能權限
 */
exports.saveAuthByFunc = function (req, res) {
    permissionSvc.saveAuthByFunc(req.body, req.session, function (err, result) {
        res.json({success: err == null, errMsg: err, data: result});
    });
};

exports.addRole = function (req, res) {
    permissionSvc.addRole(req.body, req.session, function (err, result) {
        res.json({success: err == null, errorMsg: err});
    });
};

exports.delRole = function (req, res) {
    permissionSvc.delRole(req.body, req.session, function (err, result) {
        res.json({success: err == null, errorMsg: err});
    });
};

exports.updRole = function (req, res) {
    permissionSvc.updRole(req.body, req.session, function (err, result) {
        res.json({success: err == null, errorMsg: err});
    });
};

exports.addStaff = function (req, res) {
    permissionSvc.addStaff(req.body, req.session, function (err, result) {
        res.json({success: err == null, errorMsg: err});
    });
};

/**
 * 取功能權限資料
 */
exports.qryPermissionFuncTreeData = function (req, res) {
    permissionSvc.qryPermissionFuncTreeData(req, req.session, function (err, result) {
        res.json({success: err == null, errMsg: err, funcTreeData: result.funcTreeData, funcList: result.funcList});
    });
};

exports.qryRoleByUserID = function (req, res) {
    permissionSvc.qryRoleByUserID(req.body, req.session, function (err, result) {
        res.json({success: err == null, errMsg: err, roleList: result});
    });
};

exports.qryRoleByCurrentID = function (req, res) {
    permissionSvc.qryRoleByCurrentID(req.body, req.session, function (err, result) {
        res.json({success: err == null, errMsg: err, roleList: result});
    });
};