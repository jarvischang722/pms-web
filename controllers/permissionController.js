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