/**
 * Created by a17007 on 2018/6/7.
 */
const _ = require("underscore");
const _s = require("underscore.string");
const moment = require("moment");
const async = require("async");
const path = require('path');
const appRootDir = path.dirname(require.main.filename);
const ruleRootPath = appRootDir + "/ruleEngine/";
const queryAgent = require(appRootDir + '/plugins/kplug-oracle/QueryAgent');
const commandRules = require("./../CommonRule");
const ReturnClass = require(ruleRootPath + "/returnClass");
const ErrorClass = require(ruleRootPath + "/errorClass");
const tools = require(appRootDir + "/utils/CommonTools");
const sysConf = require("../../../configs/systemConfig");

module.exports = {
    /**
     * 編輯單筆訂房卡時，將order_appraise轉到tmp_order_appraise
     * @param postData
     * @param session
     * @param callback
     */
    convert_oder_appraise_to_tmp: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let apiParams = {
            "REVE-CODE": "PMS0110041",
            "prg_id": "PMS0110041",
            "func_id": "0900",
            "athena_id": session.user.athena_id,
            "hotel_cod": session.user.hotel_cod,
            "ikey": postData.ikey
        };
        tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
            if (apiErr || !data) {
                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = apiErr;
            }
            else if (data["RETN-CODE"] != "0000") {
                lo_result.success = false;
                lo_error = new ErrorClass();
                console.error(data["RETN-CODE-DESC"]);
                lo_error.errorMsg = data["RETN-CODE-DESC"];
            }
            else {
                lo_result.defaultValues.key_nos = data["returnNos"];
            }
            callback(lo_error, lo_result);
        });
        // callback(lo_error, lo_result);

    },

    /**
     * order dt 中使用房型及計價房型的下拉資料
     * @param postData
     * @param session
     * @param callback
     */
    select_cod_data: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let ls_ciDat = postData.rowData.ci_dat || "";
        let ls_coDat = postData.rowData.co_dat || "";
        let ls_rateCod = postData.rowData.rate_cod || "";
        try {
            if (ls_ciDat != "" && ls_coDat != "" && ls_rateCod != "") {
                let lo_params = {
                    athena_id: session.user.athena_id,
                    hotel_cod: session.user.hotel_cod,
                    co_dat: moment(postData.rowData.co_dat).format("YYYY/MM/DD"),
                    ci_dat: moment(postData.rowData.ci_dat).format("YYYY/MM/DD"),
                    rate_cod: ls_rateCod
                };

                let la_roomCodSelectData = await new Promise((resolve, reject) => {
                    queryAgent.queryList("SEL_ORDERDTROOMCOD", lo_params, 0, 0, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                _.each(la_roomCodSelectData, (lo_roomCodSelectData, idx) => {
                    la_roomCodSelectData[idx].display = lo_roomCodSelectData.value + ':' + lo_roomCodSelectData.display;
                });

                lo_params.days = postData.rowData.days;
                let la_useCodSelectData = await new Promise((resolve, reject) => {
                    queryAgent.queryList("SEL_ORDERDTUSECOD", lo_params, 0, 0, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                _.each(la_useCodSelectData, (lo_useCodSelectData, idx) => {
                    lo_useCodSelectData[idx].display = lo_useCodSelectData.value + ':' + lo_useCodSelectData.display;
                });

                lo_result.selectField = ["room_cod", "use_cod"];
                lo_result.multiSelectOptions.room_cod = la_roomCodSelectData;
                lo_result.multiSelectOptions.use_cod = la_useCodSelectData;
            }
            else {
                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = commandRules.getMsgByCod('pms14msg1', session.locale);
            }
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_result, lo_error);
    },

    /**
     * order dt 中 rate cod 的樹狀下拉資料
     * @param postData
     * @param session
     * @param callback
     */
    sel_order_dt_rate_cod_data_for_tree_select: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            let lo_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod,
                days: postData.rowData.days,
                ci_dat: moment(postData.rowData.ci_dat).format("YYYY/MM/DD"),
                acust_cod: postData.rowData.acust_cod
            };

            let la_selectData = await new Promise((resolve, reject) => {
                queryAgent.queryList("SEL_ORDERDT_RATECOD_SELECT_TREE", lo_params, 0, 0, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            //組成tree的 資料結構
            let la_treeData = [];
            _.each(la_selectData, (lo_selectData) => {
                //先判斷下拉資料是否有此兩分類
                let ln_classIdx = _.findIndex(la_treeData, {value: lo_selectData.parent_cod});
                if (ln_classIdx == -1) {
                    let lo_addClass = {parent_cod: 'root'};
                    lo_addClass.value = lo_selectData.parent_cod;
                    lo_addClass.label = lo_selectData.parent_cod;
                    lo_addClass.children = [];
                    la_treeData.push(lo_addClass);
                }
                //將搜尋到的資料份配進此兩分類中
                let ln_index = _.findIndex(la_treeData, {value: lo_selectData.parent_cod});
                if (ln_index > -1) {
                    la_treeData[ln_index].children.push(lo_selectData);
                }
            });

            lo_result.selectOptions = la_treeData;
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_result, lo_error);
    },

    /**
     * order dt 中 rate cod 的下拉資料
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise.<void>}
     */
    sel_order_dt_rate_cod_data: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            let lo_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod,
                days: postData.rowData.days,
                rate_grp: postData.selectedData[1]
            };
            let ls_class = postData.selectedData[0];
            let ls_queryName = "";
            if (ls_class == '合約') {
                ls_queryName = "SEL_ORDERDT_RATECOD_SELECT_DATA_CONTRACT";
                lo_params.ci_dat = postData.rowData.ci_dat;
                lo_params.acust_cod = postData.rowData.acust_cod;
            }
            else {
                ls_queryName = "SEL_ORDERDT_RATECOD_SELECT_DATA_COMMON";
            }

            let la_selectData = await new Promise((resolve, reject) => {
                queryAgent.queryList(ls_queryName, lo_params, 0, 0, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            lo_result.selectOptions = la_selectData;
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_result, lo_error);
    },

    /**
     * 計算 order dt 價錢
     * @param postData
     * @param session
     * @param callback
     */
    compute_oder_dt_price: function (postData, session, callback) {

        let lo_result = new ReturnClass();
        let lo_error = null;

        // let apiParams = {
        //     "REVE-CODE": "PMS0110041",
        //     "prg_id": "PMS0110041",
        //     "func_id": "0900",
        //     "athena_id": session.user.athena_id,
        //     "hotel_cod": session.user.hotel_cod,
        //     "ikey": postData.ikey
        // };
        // tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
        //     if (apiErr || !data) {
        //         lo_result.success = false;
        //         lo_error = new ErrorClass();
        //         lo_error.errorMsg = apiErr;
        //     }
        //     else if (data["RETN-CODE"] != "0000") {
        //         lo_result.success = false;
        //         lo_error = new ErrorClass();
        //         console.error(data["RETN-CODE-DESC"]);
        //         lo_error.errorMsg = data["RETN-CODE-DESC"];
        //     }
        //     else {
        //         lo_result.defaultValues.key_nos = data["returnNos"];
        //     }
        //     callback(lo_error, lo_result);
        // });
        callback(lo_error, lo_result);
    }
};