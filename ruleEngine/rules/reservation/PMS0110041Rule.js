/**
 * Created by a17007 on 2018/6/7.
 */
const _ = require("underscore");
const moment = require("moment");
const path = require('path');
const appRootDir = path.dirname(require.main.filename);
const ruleRootPath = appRootDir + "/ruleEngine/";
const clusterQueryAgent = require("../../../plugins/kplug-oracle/ClusterQueryAgent");
const commandRules = require("./../CommonRule");
const ReturnClass = require(ruleRootPath + "/returnClass");
const ErrorClass = require(ruleRootPath + "/errorClass");
const tools = require(appRootDir + "/utils/CommonTools");
const sysConf = require("../../../configs/systemConfig");

module.exports = {
    /**
     * 取order_mn ikey 和 tmp_orde_appraise key_nos
     * @param postData
     * @param session
     * @param callback
     */
    dfaultOrderMn: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            //取order_mn tmp ikey
            let lo_fetchTmpIkey = await new Promise((resolve, reject) => {
                let apiParams = {
                    "REVE-CODE": "BAC0900805",
                    "func_id": "0000",
                    "athena_id": session.user.athena_id,
                    "comp_cod": "NULL",
                    "hotel_cod": session.user.hotel_cod,
                    "sys_cod": "CS",
                    "nos_nam": "TMP_IKEY",
                    "link_dat": "2000/01/01"
                };
                tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
                    if (apiErr || !data) {
                        reject(apiErr)
                    }
                    else {
                        resolve(data)
                    }
                });
            });
            if (lo_fetchTmpIkey["RETN-CODE"] != "0000") {
                lo_result.success = false;
                lo_error = new ErrorClass();
                console.error(lo_fetchTmpIkey["RETN-CODE-DESC"]);
                lo_error.errorMsg = lo_fetchTmpIkey["RETN-CODE-DESC"];
            }
            else {
                let ls_ikey = `!tmp${lo_fetchTmpIkey["SERIES_NOS"]}`;

                //取 tmp_order_appraise key_nos
                let lo_fetchKeyNos = await new Promise((resolve, reject) => {
                    let apiParams = {
                        "REVE-CODE": "PMS0110041",
                        "prg_id": "PMS0110041",
                        "func_id": "0900",
                        "athena_id": session.user.athena_id,
                        "hotel_cod": session.user.hotel_cod,
                        "ikey": ls_ikey
                    };
                    tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
                        if (apiErr || !data) {
                            reject(apiErr)
                        }
                        else {
                            resolve(data)
                        }
                    });
                });
                if (lo_fetchKeyNos["RETN-CODE"] != "0000") {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    console.error(lo_fetchKeyNos["RETN-CODE-DESC"]);
                    lo_error.errorMsg = lo_fetchKeyNos["RETN-CODE-DESC"];
                }
                else {
                    lo_result.defaultValues = {
                        key_nos: lo_fetchKeyNos["returnNos"],
                        ikey: ls_ikey,
                        fixed_order: 'Y',
                        master_sta: 'N',
                        order_deposit: 0,
                        lang_cod: 'ENG',
                        ins_hotel: session.user.hotel_cod,
                        open_web: 'N',
                        is_prtconfirm: 'N',
                    };

                }
            }
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }

        callback(lo_error, lo_result);
    },

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
     * 取guest_mn ci_ser
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise.<void>}
     */
    get_guest_mn_default_data: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            //取order_mn tmp ikey
            let lo_fetchCiSer = await new Promise((resolve, reject) => {
                let apiParams = {
                    "REVE-CODE": "BAC0900805",
                    "func_id": "0000",
                    "athena_id": session.user.athena_id,
                    "comp_cod": "NULL",
                    "hotel_cod": session.user.hotel_cod,
                    "sys_cod": "HFD",
                    "nos_nam": "CI_SER",
                    "link_dat": "2000/01/01"
                };
                tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
                    if (apiErr || !data) {
                        reject(apiErr)
                    }
                    else {
                        resolve(data)
                    }
                });
            });
            if (lo_fetchCiSer["RETN-CODE"] != "0000") {
                lo_result.success = false;
                lo_error = new ErrorClass();
                console.error(lo_fetchCiSer["RETN-CODE-DESC"]);
                lo_error.errorMsg = lo_fetchCiSer["RETN-CODE-DESC"];
            }
            else {
                lo_result.defaultValues = {
                    athena_id: session.user.athena_id,
                    hotel_cod: session.user.hotel_cod,
                    ci_ser: lo_fetchCiSer["SERIES_NOS"],
                    assign_sta: 'N',
                    guest_sta: 'E',
                    master_sta: 'G',
                    system_typ: 'HFD'
                };
            }
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_error, lo_result);
    },

    /**
     * 訂房卡序號最大值變數
     * 取order dt ikey_seq_nos
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise.<void>}
     */
    get_order_dt_default_data: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            let lo_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod,
                ikey: postData.allRowData[0].ikey
            };

            //取order_dt max ikey_seq_nos
            let lo_fetchMaxIkeySeqNos = await new Promise((resolve, reject) => {
                const lo_daoParams = commandRules.ConvertToQueryParams(session.athena_id, "SEL_ORDER_DT_MAX_IKEY_SEQ_NOS");
                clusterQueryAgent.query(lo_daoParams, lo_params, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            let lo_nowMaxIkeySeqNos = _.isUndefined(postData.allRowData[0].ikey_seq_nos) ? 0 : _.max(postData.allRowData, (lo_orderDtRowsData) => {
                return Number(lo_orderDtRowsData.ikey_seq_nos);
            });
            let ln_ikeySeqNos = 0;
            if (!_.isNull(lo_fetchMaxIkeySeqNos.ikey_seq_nos)) {
                ln_ikeySeqNos = Number(lo_fetchMaxIkeySeqNos.ikey_seq_nos) > Number(lo_nowMaxIkeySeqNos.ikey_seq_nos) ? Number(lo_fetchMaxIkeySeqNos.ikey_seq_nos) : Number(lo_nowMaxIkeySeqNos.ikey_seq_nos);
            }
            lo_result.defaultValues.ikey_seq_nos = ln_ikeySeqNos + 1;
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_error, lo_result);
    },

    /**
     * 選定guest mn 資料後要打 procedure
     * @param postData
     * @param session
     * @param callback
     */
    set_guest_mn_data: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            let lo_doSetGhistMn = await new Promise((resolve, reject) => {
                let apiParams = {
                    "REVE-CODE": "PMS0110041",
                    "prg_id": "PMS0110041",
                    "func_id": "0000",
                    "athena_id": session.user.athena_id,
                    "hotel_cod": session.user.hotel_cod,
                    "cust_cod": postData.rowData.gcust_cod,
                    "usr_id": session.user.usr_id
                };
                tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
                    if (apiErr || !data) {
                        reject(apiErr)
                    }
                    else {
                        resolve(data)
                    }
                });
            });
            if (lo_doSetGhistMn["RETN-CODE"] != "0000") {
                lo_result.success = false;
                lo_error = new ErrorClass();
                console.error(lo_doSetGhistMn["RETN-CODE-DESC"]);
                lo_error.errorMsg = lo_doSetGhistMn["RETN-CODE-DESC"];
            }
            else {
                const lo_daoParam = commandRules.ConvertToQueryParams(session.athena_id, "QRY_GHIST_MN");
                let lo_params = {
                    athena_id: session.athena_id,
                    hotel_cod: session.hotel_cod,
                    gcust_cod: postData.rowData.gcust_cod
                };
                let lo_ghistMnData = await new Promise((resolve, reject) => {
                    clusterQueryAgent.query(lo_daoParam, lo_params, function (err, result) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                lo_result.defaultValues = {
                    airline_cod: lo_ghistMnData.airline_cod,
                    airmb_nos: lo_ghistMnData.airmb_nos,
                    car_nos: lo_ghistMnData.car_nos,
                    ccust_nam: lo_ghistMnData.ccust_nam,
                    contry_cod: lo_ghistMnData.contry_cod,
                    first_nam: lo_ghistMnData.first_nam,
                    psngr_nos: 0,//todo 訂房時依訂房卡+psngr_nos捉最大值，由1開始
                    last_nam: lo_ghistMnData.last_nam,
                    precredit_amt: 0,
                    rent_amt: 0,
                    requst_rmk: lo_ghistMnData.requst_rmk,
                    role_cod: lo_ghistMnData.role_cod,
                    salute_cod: lo_ghistMnData.salute_cod,
                    serv_amt: 0,
                    vip_sta: lo_ghistMnData.vip_sta
                };
            }
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_error, lo_result);
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
                    const lo_daoParams = commandRules.ConvertToQueryParams(session.athena_id, "SEL_ORDERDTROOMCOD");
                    clusterQueryAgent.queryList(lo_daoParams, lo_params, (err, result) => {
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
                    const lo_daoParams = commandRules.ConvertToQueryParams(session.athena_id, "SEL_ORDERDTUSECOD");
                    clusterQueryAgent.queryList(lo_daoParams, lo_params, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                _.each(la_useCodSelectData, (lo_useCodSelectData, idx) => {
                    la_useCodSelectData[idx].display = lo_useCodSelectData.value + ':' + lo_useCodSelectData.display;
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
                const lo_daoParams = commandRules.ConvertToQueryParams(session.athena_id, "SEL_ORDERDT_RATECOD_SELECT_TREE");
                clusterQueryAgent.queryList(lo_daoParams, lo_params, (err, result) => {
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
                lo_params.ci_dat = moment(postData.rowData.ci_dat).format("YYYY/MM/DD");
                lo_params.acust_cod = postData.rowData.acust_cod;
            }
            else {
                ls_queryName = "SEL_ORDERDT_RATECOD_SELECT_DATA_COMMON";
            }

            let la_selectData = await new Promise((resolve, reject) => {
                const lo_daoParams = commandRules.ConvertToQueryParams(session.athena_id, ls_queryName);
                clusterQueryAgent.queryList(lo_daoParams, lo_params, (err, result) => {
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
    compute_oder_dt_price: async function (postData, session, callback) {

        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            let lo_rowData = postData.allRowData[0];
            let la_ikey_seq_nos = [];
            _.each(postData.allRowData, (lo_rowData) => {
                la_ikey_seq_nos.push(lo_rowData.ikey_seq_nos);
            });

            let apiParams = {
                "REVE-CODE": "PMS0110041",
                "prg_id": "PMS0110041",
                "func_id": "0700",
                "athena_id": session.user.athena_id,
                "hotel_cod": session.user.hotel_cod,
                "key_nos": postData.key_nos,
                "rate_cod": lo_rowData.rate_cod,
                "room_cod": lo_rowData.room_cod,
                "acust_cod": postData.acust_cod,
                "ci_dat": lo_rowData.ci_dat,
                "stay_night": lo_rowData.days,
                "order_sta": lo_rowData.order_sta,
                "add_man_qnt": 0,
                "add_child_qnt": 0,
                "ikey": lo_rowData.ikey,
                "ikey_seq_nos": la_ikey_seq_nos,
                "upd_usr": session.user.usr_id,
            };

            let lo_computePrice = await new Promise((resolve, reject) => {
                tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
                    if (apiErr || !data) {
                        reject(apiErr)
                    }
                    else {
                        resolve(data)
                    }
                });
            });

            if (lo_computePrice["RETN-CODE"] != "0000") {
                lo_result.success = false;
                lo_error = new ErrorClass();
                console.error(lo_computePrice["RETN-CODE-DESC"]);
                lo_error.errorMsg = lo_computePrice["RETN-CODE-DESC"];
            }
            else {
                let lo_params = {
                    athena_id: session.user.athena_id,
                    hotel_cod: session.user.hotel_cod,
                    ikey_seq_nos: la_ikey_seq_nos[0],
                    ikey: lo_rowData.ikey,
                    key_nos: postData.key_nos
                };
                let lo_fetchPrice = await new Promise((resolve, reject) => {
                    const lo_daoParams = commandRules.ConvertToQueryParams(session.athena_id, "QUY_ORDER_APPRAISE_FOR_ORDER_DT");
                    clusterQueryAgent.query(lo_daoParams, lo_params, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                lo_result.effectValues.rent_amt = lo_fetchPrice.rent_amt;
                lo_result.effectValues.serv_amt = lo_fetchPrice.serv_amt;
                lo_result.effectValues.other_amt = Number(lo_fetchPrice.total) - Number(lo_fetchPrice.serv_amt) - Number(lo_fetchPrice.rent_amt);
            }
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_error, lo_result);
    },

    /**
     * 公帳號 自動選取
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise<void>}
     */
    r_1141: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            //取得公帳號
            let lo_fetchPublicAccount = await new Promise((resolve, reject) => {
                const lo_daoParams = commandRules.ConvertToQueryParams(session.athena_id, "QUY_MASTER_RF_FOR_AUTO_SELECT");
                clusterQueryAgent.query(lo_daoParams, {}, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });

            //todo 在問勝擁api參數為何
            //卡住公帳號
            // let lo_doLockMaster = await new Promise((resolve, reject) => {
            //     tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
            //         if (apiErr || !data) {
            //             reject(apiErr)
            //         }
            //         else {
            //             resolve(data)
            //         }
            //     });
            // });
            lo_result.effectValues.master_nos = lo_fetchPublicAccount.master_nos;
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_error, lo_result);
    },

    /**
     * 公帳號 手動選取
     * 1.卡住公帳號不讓別人選到 call API
     * 2.帶回公帳號
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise<void>}
     */
    r_1142: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            //todo 在問勝擁api參數為何
            //卡住公帳號
            // let lo_doLockMaster = await new Promise((resolve, reject) => {
            //     tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
            //         if (apiErr || !data) {
            //             reject(apiErr)
            //         }
            //         else {
            //             resolve(data)
            //         }
            //     });
            // });
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_error, lo_result);
    },

    /**
     * 公帳號離開
     * 檢查公帳號欄位master_nos有沒有值,有值則call API
     * @param postData
     * @param session
     * @returns {Promise<void>}
     */
    r_1144: async (postData, session) => {
        const lo_return = new ReturnClass();
        try {
            let ls_master_nos = postData.rowData.master_nos || "";
            if (ls_master_nos.trim() !== "") {
                //卡住公帳號釋放
                // let lo_doLockMaster = await new Promise((resolve, reject) => {
                //     tools.requestApi(sysConf.api_url.java, apiParams, function (apiErr, apiRes, data) {
                //         if (apiErr || !data) {
                //             reject(apiErr)
                //         }
                //         else {
                //             resolve(data)
                //         }
                //     });
                // });
            }
            return lo_return;
        }
        catch (errorMsg) {
            throw errorMsg;
        }

    },

    /**
     * 公帳狀態master_sta欄位,從"有"改成"無"
     * 1.call API【看宏興儲存SD  卡住公帳號釋放】,傳入清空前的公帳號master_nos
     * 2.將公帳號master_nos清空
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise<void>}
     */
    chkMastersta: async (postData, session, callback) => {
        const lo_return = new ReturnClass();
        let lo_error = null;
        try {
            const lo_param = {
                master_nos: postData.oriSingleData.master_nos
            };
            //1. CALL API
            //2. 清空公帳號
            lo_return.effectValues = {master_nos: ""};
            callback(lo_error, lo_return);
        }
        catch (errorMsg) {
            lo_error = new ErrorClass();
            lo_return.success = false;
            lo_error.errorMsg = errorMsg;
            callback(lo_error, lo_return);
        }


    },

    /**
     * 公帳號手動選取下拉資料
     * @param postData
     * @param session
     * @param callback
     */
    fetchMasterNosSelectData: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let lo_param = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod,
            acust_cod: postData.rowData.acust_cod
        };

        try {
            //取得公帳號 下拉資料
            let lo_fetchSelectData = await new Promise((resolve, reject) => {
                const lo_daoParams = commandRules.ConvertToQueryParams(session.athena_id, "QUY_MASTER_RF_FOR_MANUAL_SELECT");
                clusterQueryAgent.queryList(lo_daoParams, lo_param, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            lo_result.selectOptions = lo_fetchSelectData;
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_error, lo_result);
    },

    //TODO 一開始在抓欄位資料的時候就會因為modificable 為C而跑此rule, 但因為一開始沒有rate cod資料,所以會壞掉, 所以先將modificable改為N
    /**
     * 佣金欄位可不可以修改
     * @param postData
     * @param session
     * @param callback
     */
    r_commis_rat_modify: (postData, session, callback) => {
        const lo_return = new ReturnClass();
        let lo_error = null;
        if (_.isUndefined(postData.singleRowData)) {
            return callback(null, lo_return);
        }
        const lo_params = {
            athena_id: session.athena_id,
            hotel_cod: session.hotel_cod,
            rate_cod: postData.singleRowData.rate_cod
        };
        const lo_daoParams = commandRules.ConvertToQueryParams(session.athena_id, "QRY_COMMIS_CHG_BY_RATE_COD");
        clusterQueryAgent.query(lo_daoParams, lo_params, (err, result) => {
            if (err) {

                lo_error = new ErrorClass();
                lo_error.errorMsg = err;
            }
            else {
                if (result.commis_chg == "N") {
                    lo_return.isModifiable = false;
                    lo_return.readonlyFields.push("order_dt.commis_rat");
                }
                else {
                    lo_return.isModifiable = true;
                }
            }
            callback(lo_error, lo_return);
        });
    },

    /**
     * 刪除明細
     * @param postData {object} postData資料
     * @param session {object} 使用者資訊
     * @returns {Promise<any>}
     */
    del_order_dt: async (postData, session) => {
        const lo_return = new ReturnClass();
        const lo_param = {
            athena_id: session.athena_id,
            ikey: postData.rowData.ikey,
            ikey_seq_nos: postData.rowData.ikey_seq_nos
        };

        return await new Promise((resolve, reject) => {
            const lo_daoParams = commandRules.ConvertToQueryParams(session.athena_id, "QRY_ASSIGN_QNT_ISEXIST");
            clusterQueryAgent.query(lo_daoParams, lo_param, (err, result) => {
                if (err) {
                    const lo_error = new ErrorClass();
                    lo_error.errorMsg = err;
                    reject(lo_error);
                }
                else {
                    if (result.assign_qnt > 0) {
                        lo_return.showConfirm = true;
                        lo_return.confirmMsg = commandRules.getMsgByCod("pms11msg1", session.locale);
                    }
                    resolve(lo_return);
                }
            });
        });
    },

    /**
     * Detail頁
     * @param postData
     * @param session
     * @returns {Promise<void>}
     */
    sel_detail: async (postData, session) => {
        const lo_return = new ReturnClass();
        let lo_error = null;
        const lo_params = {
            athena_id: session.athena_id,
            hotel_cod: session.hotel_cod,
            ikey: postData.rowData.ikey,
            ikey_seq_nos: postData.rowData.ikey_seq_nos
        };
        const lo_daoParam = commandRules.ConvertToQueryParams(session.athena_id, "QRY_IS_ASSIGN_ORDER_ROOM");
        return new Promise((resolve, reject) => {
            clusterQueryAgent.query(lo_daoParam, lo_params, (err, result) => {
                if (err) {
                    lo_error = new ErrorClass();
                    lo_return.success = false;
                    lo_error.errorMsg = err;
                    reject(lo_error);
                }
                else {
                    resolve(result.room_nos);
                }
            });
        });

    },

    /**
     * 選完訂房公司Agent
     * 4.cust_mn.remark1入到order_mn.order_rmk【select remark1 from cust_mn where athena_id = ? and cust_cod = ?】
     * 6.聯絡人的帶法見聯絡人處理方式,看『宏興SD 4.聯絡人處理方式』
     * 7.有固定的公帳號時,入到master_nos 且 master_sta = 'Y' 看SA『是否有固定公帳號SQL』
     * 8.如果訂房公司與舊的不同時，訂房明細房價要重算
     * call pg_hd1_cal_appraise2.pp_ren_dt_order_appraise()   看SA『計算房價』有傳入欄位
     * @param postData {object} post資料
     * @param session {object}
     * @returns {Promise<void>}
     */
    chkOrdermnAcustnam: async (postData, session, callback) => {
        const lo_return = new ReturnClass();
        let lo_error = null;
        const lo_daoParams = commandRules.ConvertToQueryParams(session.athena_id, "QRY_REMARK1");
        const lo_params = {
            athena_id: session.athena_id,
            cust_cod: postData.order_mn.acust_cod,
            allRowsData: postData.allRowsData
        };

        try {
            //4.
            const ls_remark1 = await new Promise((resolve, reject) => {
                clusterQueryAgent.query(lo_daoParams, lo_params, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result.remark1);
                    }
                });
            });

            //6.

        }
        catch (errorMsg) {
            lo_error = new ErrorClass();
            lo_return.success = false;
            lo_error.errorMsg = errorMsg.message || errorMsg;
        }
        callback(lo_error, lo_return);
    },

    /**
     * 『宏興SD 4.聯絡人處理方式』
     * (1)看『旅客姓名guest_mn.alt_nam、訂房公司名稱order_mn.acust_nam』,那個先key,就由它帶入
     * (2)看另一個欄位有沒有值,來判斷先key後key
     * (3)聯絡人order_mn.atten_nam是空值,才帶入
     * (4)改變聯絡人來源order_mn.atten_by時,任一”聯絡資料” 有值時,要詢問：”是否蓋掉現有連絡資料?”
     * P.S. 全部”聯絡資料” 沒值則直接蓋掉
     * (5)入到”聯絡資料”order_mn的attnd_nam、mobile_nos、office_tel、home_tel、fax_nos、e_mail
     * (6)取得聯絡資料兩者sql一樣,只差在紅色字
     * select alt_nam , mobile_nos, office_tel, home_tel, fax_nos, e_mail
     * from cust_idx where cust_cod = 訂房公司cust_mn.atten_cod
     * and athena_id = ?;
     * @param params {object} 參數條件
     * @param callback
     * @returns {Promise<void>}
     */

    async chkAttenNamRule(params, callback) {
        const lo_return = new ReturnClass();
        const lo_guest_mn = params.guest_mn;
        const lo_order_mn = params.order_mn;
        lo_guest_mn.alt_nam = lo_guest_mn.alt_nam || "";        //旅客姓名
        lo_order_mn.acust_nam = lo_order_mn.acust_nam || "";    //訂房公司名稱
        lo_order_mn.atten_nam = lo_order_mn.atten_nam || "";    //聯絡人

        if (lo_order_mn.atten_nam.trim() === "") {
            //旅客姓名先key
            if (lo_guest_mn.alt_nam.trim() !== "" && lo_order_mn.acust_nam.trim() === "") {
                const ls_atten_by = "P";
            }
            //訂房公司名稱先key
            else if (lo_guest_mn.alt_nam.trim() === "" && lo_order_mn.acust_nam.trim() !== "") {

            }
        }

    }

};