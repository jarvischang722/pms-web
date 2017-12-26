/**
 * Created by kaiyue on 2017/12/26.
 */
const path = require('path');
const moment = require("moment");
const _ = require("underscore");
const async = require("async");

const ruleAgent = require("../ruleEngine/ruleAgent");
const queryAgent = require("../plugins/kplug-oracle/QueryAgent");
const mongoAgent = require("../plugins/mongodb");
const sysConfig = require("../configs/systemConfig");
const tools = require("../utils/CommonTools");
const fetechDataModule = require("./common/fetchDataModule");

exports.saveAuthByRole = function (postData, session, callback) {
    let ls_staffOfRole = postData.staffOfRole;
    let la_staffChecked = postData.staffChecked;
    let la_funcChecked = postData.funcChecked;

    callback(null, true);
};