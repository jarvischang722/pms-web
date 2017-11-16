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
        lo_dgProc.fetchFieldData,
        lo_dgProc.fetchRowData
    ], function (err, result) {
        let rtnData = {
            searchFields: result[0].searchFields,
            dgFieldData: result[0].dgFieldsData,
            dgRowData: result[1]
        };
        callback(err, rtnData);
    });
};
