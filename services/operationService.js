/**
 * Created by kaiyue on 2017/11/13.
 */
const path = require('path');
const moment = require("moment");
const _ = require("underscore");
const async = require("async");

const appRootDir = path.dirname(require.main.filename);
const ruleAgent = require(appRootDir + "/ruleEngine/ruleAgent");
const queryAgent = require(appRootDir + "/plugins/kplug-oracle/QueryAgent");
const mongoAgent = require(appRootDir + "/plugins/mongodb");
const sysConfig = require(appRootDir + "/configs/systemConfig");
const tools = require(appRootDir + "/utils/CommonTools");
let dgProc = require(appRootDir + "/services/common/DataGridProcModule");

// 取作業多筆資料
exports.fetchDataGridFieldData = function (postData, session, callback) {
    let lo_dgProc = new dgProc(postData, session);

    async.parallel([
        lo_dgProc.qryFieldData,
        lo_dgProc.qryRowData
    ], function (err, result) {
        let rtnData = {
            dgFieldData: result[0],
            dgRowData: result[1]
        };
        callback(err, rtnData);
    });
};
