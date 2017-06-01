/**
 * Created by jing on 2017/5/31.
 */

var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/roleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/roleFuncService");


//依房型訂房
exports.getReservationRoomType = function (req, res) {
    res.render("subsystem/reservation/reservationRoomType");
};
//setUp 房價設定
exports.getSetRateCode = function (req, res) {
    res.render("subsystem/reservation//setRateCode");
};
//交通接駁設定
exports.getTrafficConnection = function (req, res) {
    res.render("subsystem/reservation/trafficConnection");
};