/**
 * Created by kaiyue on 2017/11/13.
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

// 取作業多筆欄位資料
exports.fetchDgFieldData = function (postData, session, callback) {
    let lo_dgProc = new fetechDataModule.DataGridProc(postData, session);

    async.parallel({
        fetchFieldsResult: lo_dgProc.fetchDgFieldsData,   //取多筆欄位資料
        fetchRowsResult: lo_dgProc.fetchDgRowData      //取多筆資料
    }, function (err, result) {
        let lo_rtnData = {
            searchFields: result.fetchFieldsResult.searchFields,
            dgFieldsData: result.fetchFieldsResult.dgFieldsData,
            dgRowData: result.fetchRowsResult
        };
        callback(err, lo_rtnData);
    });
};

/**
 * 取作業單筆欄位資料
 */
exports.fetchGsFieldData = function (postData, session, callback) {
    let lo_gsProc = new fetechDataModule.GridSingleProc(postData, session);
    let lo_dgProc = new fetechDataModule.DataGridProc(postData, session);

    async.parallel({
        gsMnData: lo_gsProc.fetchGsMnData,
        gsDtData: lo_dgProc.fetchDgData
    }, function (err, result) {
        let lo_rtnData = {
            gsMnData: result.gsMnData,
            gsDtData: result.gsDtData
        };
        callback(err, lo_rtnData);
    });
};

/**
 * 取作業(只有)搜尋欄位資料
 */
exports.fetchOnlySearchFieldsData = function (postData, session, callback) {
    fetechDataModule.qrySearchFields(postData, session, function (err, result) {
        callback(err, result);
    });
};

/**
 * 取作業(只有)多筆欄位資料
 */
exports.fetchOnlyDgFieldData = function (postData, session, callback) {
    let lo_dgProc = new fetechDataModule.DataGridProc(postData, session);

    async.parallel({
        dgFieldsData: lo_dgProc.fetchDgFieldsData
    }, function (err, result) {
        let lo_rtnData = {
            dgFieldsData: result.dgFieldsData.dgFieldsData
        };
        callback(err, lo_rtnData);
    });
};

/**
 * 取作業(只有)單筆欄位資料
 */
exports.fetchOnlyGsFieldData = function (postData, session, callback) {
    let lo_gsProc = new fetechDataModule.GridSingleProc(postData, session);

    async.parallel({
        gsFieldsData: lo_gsProc.fetchGsMnFieldsData
    }, function (err, result) {
        let lo_rtnData = {
            gsFieldsData: result.gsFieldsData
        };
        callback(err, lo_rtnData);
    });
};

/**
 * 取作業預設單筆資料
 */
exports.fetchDefaultGsRowData = function (postData, session, callback) {
    let lo_gsProc = new fetechDataModule.GridSingleProc(postData, session);

    async.parallel({
        gsDefaultData: lo_gsProc.fetchDefaultMnRowData
    }, function (err, result) {
        let lo_rtnData = {
            gsDefaultData: result.gsDefaultData
        };
        callback(err, lo_rtnData);
    });
};
