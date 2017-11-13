/**
 * Created by kaiyue on 2017/11/13.
 */

var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var operationSvc = require("../services/operationService");

exports.fetchDataGridFieldData = function(req, res){
    operationSvc.fetchDataGridFieldData(req.body, res.session, function(err, result){

    });
};