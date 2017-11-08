/**
 * Created by kaiyue on 2017/11/08.
 */

var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var resvSvc = require("../services/reserveBanquetService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);

//reserveBanquet格萊天漾訂席頁
exports.getRS00202010 = function (req, res) {
    res.render("subsystem/reserveBanquet/RS00202010");
};