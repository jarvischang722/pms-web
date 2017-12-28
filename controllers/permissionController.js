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
 exports.saveAuthByStaff = function(req, res){
    permissionSvc.saveAuthByStaff(req.body, req.session, function(err, result){
        res.json({success: err == null, errMsg: err, data: result});
    });
};

/**
 * 取功能權限資料
 */
exports.qryPermissionFuncTreeData = function (req, res) {
    permissionSvc.qryPermissionFuncTreeData(req, req.session, function(err, result){
        res.json({success: err == null, errMsg: err, funcList: result});
    });
};

exports.qryRoleByUserID = function(req, res){
    permissionSvc.qryRoleByUserID(req.body, req.session, function(err, result){
        res.json({success: err == null, errMsg: err, roleList: result});
    })
}