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
const fetechDataModule = require("./common/fetchFieldsAndDataModule");

// 取作業多筆欄位資料
exports.fetchDgFieldData = async function (postData, session, callback) {
    let lo_dgProc = new fetechDataModule.DataGridProc(postData, session);

    try {
        let [fetchFieldsResult, fetchRowsResult] = await Promise.all([
            lo_dgProc.fetchDgFieldsData(),
            lo_dgProc.fetchDgRowData()
        ]);
        let lo_rtnData = {
            searchFields: fetchFieldsResult.searchFields,
            dgFieldsData: fetchFieldsResult.dgFieldsData,
            dgRowData: fetchRowsResult
        };
        callback(null, lo_rtnData);
    }
    catch (err) {
        callback(err, {})
    }
};

/**
 *
 * @param postData  {object} 前端資料
 * @param session   {object}
 * @param callback
 * @returns {Promise<void>}
 */
exports.fetchDgRowData = async function (postData, session, callback) {
    let lo_dgProc = new fetechDataModule.DataGridProc(postData, session);

    try {
        let fetchDgRowsResult = await lo_dgProc.fetchDgRowData();
        callback(null, fetchDgRowsResult);
    }
    catch (err) {
        callback(err, []);
    }
};

/**
 * 取作業單筆欄位資料
 */
exports.fetchGsFieldData = async function (postData, session, callback) {
    let lo_gsProc = new fetechDataModule.GridSingleProc(postData, session);
    let lo_dgProc = new fetechDataModule.DataGridProc(postData, session);

    try {
        let [lo_gsMnData, la_gsDtData] = await Promise.all([
            lo_gsProc.fetchGsMnData(),
            lo_dgProc.fetchDgData()
        ]);
        callback(null, {gsMnData: lo_gsMnData, gsDtData: la_gsDtData});
    }
    catch (err) {
        callback(err, {});
    }
};

/**
 * 取作業(只有)搜尋欄位資料
 */
exports.fetchOnlySearchFieldsData = async function (postData, session) {
    try {
        let la_searchFields = await fetechDataModule.qrySearchFields(postData, session);
        return la_searchFields;
    }
    catch (err) {
        throw err.message;
    }


};

/**
 * 取作業(只有)多筆欄位資料
 */
exports.fetchOnlyDgFieldData = async function (postData, session, callback) {
    let lo_dgProc = new fetechDataModule.DataGridProc(postData, session);

    try {
        let lo_dgFieldsData = await lo_dgProc.fetchDgFieldsData();
        let lo_rtnData = {
            dgFieldsData: lo_dgFieldsData.dgFieldsData
        };
        callback(null, lo_rtnData);
    }
    catch (err) {
        callback(null, {dgFieldsData: []});
    }
};

/**
 * 取作業(只有)單筆欄位資料
 */
exports.fetchOnlyGsFieldData = async function (postData, session, callback) {
    let lo_gsProc = new fetechDataModule.GridSingleProc(postData, session);

    try {
        let la_gsFieldsData = await lo_gsProc.fetchGsMnFieldsData();
        callback(null, {gsFieldsData: la_gsFieldsData});
    }
    catch (err) {
        callback(err, []);
    }
};

/**
 * 取作業預設單筆資料
 */
exports.fetchDefaultGsRowData = async function (postData, session, callback) {
    let lo_gsProc = new fetechDataModule.GridSingleProc(postData, session);

    try {
        let la_gsDefaultData = await lo_gsProc.fetchDefaultMnRowData();
        callback(null, {gsDefaultData: la_gsDefaultData});
    }
    catch (err) {
        throw new Error(err);
    }
};

/**
 * 取作業(只有)多筆oracle資料
 * @param postData
 * @param session
 * @param callback
 * @returns {Promise.<void>}
 */
exports.fetchDgRowData = async function (postData, session, callback) {
    let lo_dgProc = new fetechDataModule.DataGridProc(postData, session);

    try {
        let fetchDgRowsResult = await lo_dgProc.fetchDgRowData();
        callback(null, fetchDgRowsResult);
    }
    catch (err) {
        callback(err, []);
    }
};
