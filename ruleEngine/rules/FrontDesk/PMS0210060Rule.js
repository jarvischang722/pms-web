/**
 * Created by a17017 on 2018/07/27.
 */
const _ = require("underscore");
const _s = require("underscore.string");
const moment = require("moment");
const queryAgent = require("../../../plugins/kplug-oracle/QueryAgent");
const clusterQueryAgent = require("../../../plugins/kplug-oracle/ClusterQueryAgent");
const commonRule = require("./../CommonRule");
const ReturnClass = require("../../returnClass");
const ErrorClass = require("../../errorClass");
const tools = require("../../../utils/CommonTools");
const sysConf = require("../../../configs/systemConfig");
const encryptTools = require("../../../utils/encryptTools");

module.exports = {
    r_1021: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        callback(lo_error, lo_result);
    }
};