/**
 * Created by a17007 on 2018/6/7.
 */
const _ = require("underscore");
const moment = require("moment");
const path = require('path');
const appRootDir = path.dirname(require.main.filename);
const ruleRootPath = appRootDir + "/ruleEngine/";
const clusterQueryAgent = require("../../../plugins/kplug-oracle/ClusterQueryAgent");
const commonRules = require("./../CommonRule");
const ReturnClass = require("../../returnClass");
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
     * 取guest_mn預設值
     * @param postData {object} : 前端條件
     * @param session {object}
     * @param callback {function} : 回調函數
     * @returns {Promise.<void>}
     */
    get_guest_mn_default_data: async function (postData, session, callback) {
        const lo_result = new ReturnClass();
        let lo_error = null;

        try {
            //取ci_ser
            const ls_ci_ser = await this.get_ci_ser(postData, session);
            lo_result.defaultValues = {
                athena_id: session.user.athena_id,
                assign_sta: 'N',
                ci_ser: ls_ci_ser,
                hotel_cod: session.user.hotel_cod,
                guest_sta: 'E',
                master_sta: 'G',
                system_typ: 'HFD'
            };
        }
        catch (err) {
            console.error(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
        }
        callback(lo_error, lo_result);
    },

    /**
     * 取ci_ser
     * @param postData
     * @param session
     * @returns {Promise<*>}
     */
    get_ci_ser: async (postData, session) => {
        const lo_apiParams = {
            "REVE-CODE": "BAC0900805",
            "func_id": "0000",
            "athena_id": session.athena_id,
            "comp_cod": "NULL",
            "hotel_cod": session.hotel_cod,
            "sys_cod": "HFD",
            "nos_nam": "CI_SER",
            "link_dat": "2000/01/01"
        };
        const lo_fetchCiSer = await tools.requestApi(sysConf.api_url.java, lo_apiParams);
        if (lo_fetchCiSer["RETN-CODE"] !== "0000") {
            throw lo_fetchCiSer["RETN-CODE-DESC"];
        }
        else {
            return lo_fetchCiSer["SERIES_NOS"];
        }
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
                const lo_daoParams = commonRules.ConvertToQueryParams(session.athena_id, "SEL_ORDER_DT_MAX_IKEY_SEQ_NOS");
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
     * (1)選定guest mn 資料後要打 procedure
     * an_return為0表示執行成功，非0表示執行失敗
     * 失敗時中止程序並顯示訊息：『注意,轉入住客歷史失敗(sp_hfd_ins_ghist_mn=> as_return_msg)』
     * (2)帶回住客歷史ghist_mn到住客guest_mn【如何帶回,search SA keyword 『ghist_mn帶到guest_mn欄位對應』】
     * (3)訂房公司(order_mn.acust_cod)未填時，填入ghist_mn.acust_cod
     * (4)公司名稱(order_mn.ccust_nam)未填時，填入ghist_mn.ccust_nam
     * (5)團號(order_mn.group_nos)未填時,將guest_mn.alt_nam入到order_mn.group_nos
     * 2.若沒有選任何人，則顯示訊息『'注意','查無此人，(Y) 新增旅客 ,(N) 重新查詢』, 預設 N
     * (1)若選Y=>開啟住客歷史單筆功能，將輸入的姓名帶到住客歷史，待住客歷史存檔成功後，『帶回住客歷史ghist_mn到住客guest_mn』【如何帶回,search SA keyword 『ghist_mn帶到guest_mn欄位對應』】
     * 3.檢查此住客同一天否重覆訂(檢查此住客同一天否重覆訂sql)，若有，顯示訊息 ：『住客:[[%%as_alt_nam%%]],已於[[%%yyyy/mm/dd%%]]登錄過！ 』,可繼續操作
     * 4.如果GHIST_MN的ghist_visit_dt有喜好房(看SA prefer room_sql)，顯示訊息『 注意！prefer room:[[%%pref_room%%]]』
     * 5.聯絡人的帶法見聯絡人處理方式,看『宏興SD 4.聯絡人處理方式』
     * @param postData {object} 前端post資料
     * @param session {object}
     * @param callback
     */
    set_guest_mn_data: async function (postData, session, callback) {
        const lo_result = new ReturnClass();
        lo_result.alertMsg = [];
        let lo_error = null;

        const lo_singleRowData = postData.singleRowData[0];
        const lo_order_mn = postData.order_mn;
        const lo_guest_mn = postData.guest_mn;
        const lo_order_dt = _.findWhere(postData.order_dt, {ikey_seq_nos: lo_singleRowData.ikey_seq_nos});
        let ls_altName = lo_singleRowData.alt_nam || "";
        let ls_gcustCod = ls_altName !== "" && ls_altName.split(":").length > 1 ? ls_altName.split(":")[0] : "";

        if (ls_gcustCod !== "") {
            try {
                //(1)選定guest mn 資料後要打 procedure
                const lo_apiParams = {
                    "REVE-CODE": "PMS0110041",
                    "prg_id": "PMS0110041",
                    "func_id": "0000",
                    "athena_id": session.user.athena_id,
                    "hotel_cod": session.user.hotel_cod,
                    "cust_cod": _.isUndefined(postData.rowData) ? ls_gcustCod : postData.rowData.gcust_cod,
                    "usr_id": session.user.usr_id
                };
                const lo_doSetGhistMn = await tools.requestApi(sysConf.api_url.java, lo_apiParams);

                if (lo_doSetGhistMn["RETN-CODE"] !== "0000") {
                    lo_result.success = false;
                    lo_error = new ErrorClass();
                    console.error(lo_doSetGhistMn["RETN-CODE-DESC"]);
                    lo_error.errorMsg = lo_doSetGhistMn["RETN-CODE-DESC"];
                }
                else {
                    const lo_ghistParams = {
                        athena_id: session.athena_id,
                        hotel_cod: session.hotel_cod,
                        gcust_cod: _.isUndefined(postData.rowData) ? ls_gcustCod : postData.rowData.gcust_cod
                    };
                    const lo_ghistMnData = await commonRules.clusterQuery(session, lo_ghistParams, "QRY_GHIST_MN");

                    if (lo_ghistMnData !== null) {
                        //(2)帶回住客歷史ghist_mn到住客guest_mn
                        //新增
                        if (lo_guest_mn.gcust_cod === "") {
                            const ls_ci_ser = await this.get_ci_ser(postData, session);
                            lo_result.defaultValues = {
                                guestMnRowsData4Single: {
                                    ci_ser: ls_ci_ser,
                                    ikey: lo_order_mn.ikey,
                                    ikey_seq_nos: lo_order_dt.ikey_seq_nos,
                                    psngr_nos: "",
                                    assign_sta: "N",
                                    guest_sta: "E",
                                    master_sta: "G",
                                    gcust_cod: lo_ghistMnData.gcust_cod,
                                    ccust_nam: lo_ghistMnData.ccust_nam,
                                    alt_nam: lo_ghistMnData.alt_nam,
                                    first_nam: lo_ghistMnData.first_nam,
                                    last_nam: lo_ghistMnData.last_nam,
                                    car_nos: lo_ghistMnData.car_nos,
                                    airline_cod: lo_ghistMnData.airline_cod,
                                    airmb_nos: lo_ghistMnData.airmb_nos,
                                    rent_amt: 0,
                                    serv_amt: 0,
                                    precredit_amt: 0,
                                    contry_cod: lo_ghistMnData.contry_cod,
                                    system_typ: "HFD"
                                }
                            }
                        }
                        //修改
                        else {
                            lo_result.effectValues = {
                                guestMnRowsData4Single: {
                                    ccust_nam: lo_ghistMnData.ccust_nam,
                                    alt_nam: `${lo_ghistMnData.gcust_cod}:${lo_ghistMnData.alt_nam}`,
                                    first_nam: lo_ghistMnData.first_nam,
                                    last_nam: lo_ghistMnData.last_nam,
                                    car_nos: lo_ghistMnData.car_nos,
                                    airline_cod: lo_ghistMnData.airline_cod,
                                    airmb_nos: lo_ghistMnData.airmb_nos,
                                    contry_cod: lo_ghistMnData.contry_cod,
                                    //SA沒有寫
                                    requst_rmk: lo_ghistMnData.requst_rmk,
                                    role_cod: lo_ghistMnData.role_cod,
                                    salute_cod: lo_ghistMnData.salute_cod,
                                    vip_sta: lo_ghistMnData.vip_sta
                                }
                            };
                        }

                        lo_result.effectValues.orderMnSingleData = {};
                        // (3)訂房公司(order_mn.acust_cod)未填時，填入ghist_mn.acust_cod
                        if (_.isUndefined(lo_order_mn.acust_cod) || lo_order_mn.acust_cod === "") {
                            lo_result.effectValues.orderMnSingleData.acust_cod = lo_ghistMnData.acust_cod;
                        }
                        // (4)公司名稱(order_mn.ccust_nam)未填時，填入ghist_mn.ccust_nam
                        if (_.isUndefined(lo_order_mn.ccust_nam) || lo_order_mn.ccust_nam === "") {
                            lo_result.effectValues.orderMnSingleData.ccust_nam = lo_ghistMnData.ccust_nam;
                        }
                    }

                    // (5)團號(order_mn.group_nos)未填時,將guest_mn.alt_nam入到order_mn.group_nos
                    if (lo_order_mn.group_nos === "") {
                        let ls_alt_nam = "";
                        if (lo_guest_mn.alt_nam.indexOf(":") > -1) {
                            ls_alt_nam = lo_guest_mn.alt_nam.split(":")[1];
                        }
                        else {
                            ls_alt_nam = lo_guest_mn.alt_nam;
                        }
                        lo_result.effectValues.orderMnSingleData.group_nos = ls_alt_nam;
                    }

                    //3.檢查此住客同一天否重覆訂(檢查此住客同一天否重覆訂sql)，若有，顯示訊息 ：『住客:[[%%as_alt_nam%%]],已於[[%%yyyy/mm/dd%%]]登錄過！ 』,可繼續操作
                    const lo_guestParams = {
                        athena_id: session.athena_id,
                        hotel_cod: session.hotel_cod,
                        ikey: lo_order_mn.ikey,
                        ci_dat: lo_order_dt.ci_dat,
                        alt_nam: ls_altName.split(":")[1],
                    };
                    const ln_guestIsBooking = await commonRules.clusterQuery(session, lo_guestParams, "CHK_GUEST_IS_OVER_BOOKING");
                    if (ln_guestIsBooking.booking_qnt > 0) {
                        lo_result.showAlert = true;
                        lo_result.alertMsg.push(`住客: ${ls_altName}, 已於 ${moment(lo_order_dt.ci_dat).format("YYYY/MM/DD")}登錄過}`);
                    }

                    //4.如果GHIST_MN的ghist_visit_dt有喜好房(看SA prefer room_sql)，顯示訊息『 注意！prefer room:[[%%pref_room%%]]』
                    const lo_perferParams = {
                        athena_id: session.athena_id,
                        hotel_cod: session.hotel_cod,
                        gcust_cod: lo_singleRowData.gcust_cod
                    };
                    const lo_perferRoomResult = await commonRules.clusterQuery(session, lo_perferParams, "QRY_PREFER_ROOM");
                    if (lo_perferRoomResult !== null && lo_perferRoomResult.pref_room !== "") {
                        lo_result.showAlert = true;
                        lo_result.alertMsg.push(`注意！prefer room:${lo_perferRoomResult.pref_room}`);
                    }

                    //5.聯絡人的帶法見聯絡人處理方式,看『宏興SD 4.聯絡人處理方式』
                    const lo_attenResult = await chkAttenNamRule({
                        order_mn: lo_order_mn,
                        guest_mn: lo_singleRowData,
                        type: "guest_mn"
                    }, session);
                    if (!_.isEmpty(lo_attenResult)) {
                        lo_result.effectValues.orderMnSingleData = lo_attenResult;
                    }

                }
            }
            catch (err) {
                console.error(err);
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = err.message || err;
            }
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
        const lo_result = new ReturnClass();
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
                    const lo_daoParams = commonRules.ConvertToQueryParams(session.athena_id, "SEL_ORDERDTROOMCOD");
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
                    const lo_daoParams = commonRules.ConvertToQueryParams(session.athena_id, "SEL_ORDERDTUSECOD");
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
                lo_error.errorMsg = commonRules.getMsgByCod('pms14msg1', session.locale);
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
                const lo_daoParams = commonRules.ConvertToQueryParams(session.athena_id, "SEL_ORDERDT_RATECOD_SELECT_TREE");
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
                const lo_daoParams = commonRules.ConvertToQueryParams(session.athena_id, ls_queryName);
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

            if (lo_computePrice["RETN-CODE"] !== "0000") {
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
                    const lo_daoParams = commonRules.ConvertToQueryParams(session.athena_id, "QUY_ORDER_APPRAISE_FOR_ORDER_DT");
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
                const lo_daoParams = commonRules.ConvertToQueryParams(session.athena_id, "QUY_MASTER_RF_FOR_AUTO_SELECT");
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
        const lo_param = {
            master_nos: postData.oriSingleData.master_nos
        };
        //CALL API


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
                const lo_daoParams = commonRules.ConvertToQueryParams(session.athena_id, "QUY_MASTER_RF_FOR_MANUAL_SELECT");
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
        const lo_daoParams = commonRules.ConvertToQueryParams(session.athena_id, "QRY_COMMIS_CHG_BY_RATE_COD");
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
     * 欄位間數
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise.<void>}
     */
    chkOrderdtOrderqnt: async function (postData, session, callback) {
        const lo_return = new ReturnClass();
        let lo_error = null;

        let ln_nowOrderQnt = Number(postData.singleRowData[0].order_qnt) || 1;
        let ln_beforeOrderQnt = Number(postData.oriSingleData[0].order_qnt) || 1;
        let la_delTmpIkeySeqNos = [];

        if (ln_nowOrderQnt > 0) {
            let ln_orderQnt = ln_nowOrderQnt - ln_beforeOrderQnt;
            let lo_editingRow = postData.singleRowData[0];
            //增加orderDtRowsData
            if (ln_orderQnt > 0) {
                //取order_dt max ikey_seq_nos
                let ln_ikeySeqNos = 0;
                let lo_fetchMaxIkeySeqNos = await new Promise((resolve, reject) => {
                    const lo_params = {
                        athena_id: session.user.athena_id,
                        hotel_cod: session.user.hotel_cod,
                        ikey: postData.allRowData[0].ikey
                    };
                    const lo_daoParams = commonRules.ConvertToQueryParams(session.athena_id, "SEL_ORDER_DT_MAX_IKEY_SEQ_NOS");
                    clusterQueryAgent.query(lo_daoParams, lo_params, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                let lo_nowMaxIkeySeqNos = _.max(postData.allRowData, (lo_orderDtRowsData) => {
                    return lo_orderDtRowsData.ikey_seq_nos;
                });

                if (!_.isNull(lo_fetchMaxIkeySeqNos.ikey_seq_nos)) {
                    ln_ikeySeqNos = Number(lo_fetchMaxIkeySeqNos.ikey_seq_nos) > Number(lo_nowMaxIkeySeqNos.ikey_seq_nos) ?
                        Number(lo_fetchMaxIkeySeqNos.ikey_seq_nos) : Number(lo_nowMaxIkeySeqNos.ikey_seq_nos);
                }
                ln_ikeySeqNos = ln_ikeySeqNos + 1;

                for (let i = 0; i < ln_orderQnt; i++) {
                    let lo_editParam = {
                        rate_cod: lo_editingRow.rate_cod,
                        days: lo_editingRow.days,
                        ci_dat: lo_editingRow.ci_dat,
                        co_dat: lo_editingRow.co_dat,
                        use_cod: lo_editingRow.use_cod,
                        room_cod: lo_editingRow.room_cod,
                        block_cod: lo_editingRow.block_cod,
                        rent_amt: lo_editingRow.rent_amt,
                        serv_amt: lo_editingRow.serv_amt
                    };

                    //order_sta 為'x'的改為現在的訂房狀況
                    let la_editData = _.where(postData.allRowData, lo_editParam);
                    let ln_editIndex = _.findIndex(la_editData, {order_sta: 'X'});
                    if (ln_editIndex > -1) {
                        let ln_orderDtIndex = _.findIndex(postData.allRowData, la_editData[ln_editIndex]);
                        if (ln_orderDtIndex > -1) {
                            postData.allRowData[ln_orderDtIndex].order_sta = lo_editingRow.order_sta;
                        }
                    }
                    else {
                        let lo_addParams = {createRow: 'Y'};
                        lo_addParams = _.extend(lo_addParams, lo_editingRow);
                        lo_addParams.order_qnt = 1;
                        lo_addParams.ikey_seq_nos = Number(ln_ikeySeqNos) + i;

                        postData.allRowData.push(lo_addParams);
                    }
                }
            }
            //減少orderDtRowsData和guestMnRowsData
            else {
                //減少orderDtRowsData和guestMnRowsData
                let lo_groupParam = {
                    rate_cod: lo_editingRow.rate_cod,
                    days: lo_editingRow.days,
                    ci_dat: lo_editingRow.ci_dat,
                    co_dat: lo_editingRow.co_dat,
                    use_cod: lo_editingRow.use_cod,
                    room_cod: lo_editingRow.room_cod,
                    block_cod: lo_editingRow.block_cod,
                    rent_amt: lo_editingRow.rent_amt,
                    serv_amt: lo_editingRow.serv_amt
                };
                let la_groupData = _.where(postData.allRowData, lo_groupParam);
                let la_oriOrderDtRowsData = [];
                _.each(postData.allRowData, (lo_data) => {
                    if (_.isUndefined(lo_data.createRow)) {
                        la_oriOrderDtRowsData.push(lo_data);
                    }
                });
                for (let i = 0; i < Math.abs(ln_orderQnt); i++) {
                    let lo_delData = la_groupData[la_groupData.length - 1 - i];

                    let ln_delOrderIndex = _.findLastIndex(la_oriOrderDtRowsData, {ikey_seq_nos: lo_delData.ikey_seq_nos});
                    //order dt 原本就在資料庫裡的資料
                    if (ln_delOrderIndex > -1) {
                        let ln_delIndex = _.findIndex(postData.allRowData, {ikey_seq_nos: la_oriOrderDtRowsData[ln_delOrderIndex].ikey_seq_nos});
                        if (ln_delIndex > -1) {
                            postData.allRowData[ln_delIndex].order_sta = 'X';
                        }
                    }
                    //此次新增的
                    else {
                        let ln_delOrderDtIndex = _.findLastIndex(postData.allRowData, lo_delData);
                        if (ln_delOrderDtIndex > -1) {
                            postData.allRowData.splice(ln_delOrderDtIndex, 1);
                        }
                        let la_newAddData = _.where(postData.allRowData, {createRow: "Y"});
                        let ln_delTmpIndex = _.findLastIndex(la_newAddData, lo_delData);
                        if (ln_delTmpIndex > -1) {
                            la_delTmpIkeySeqNos.push(la_newAddData[ln_delTmpIndex]);
                        }
                    }
                }
            }

            lo_return.effectValues = {
                allRowData: postData.allRowData
            };
        }
        else {
            lo_return.effectValues = {order_qnt: ln_beforeOrderQnt};
        }

        callback(lo_error, lo_return);
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
            const lo_daoParams = commonRules.ConvertToQueryParams(session.athena_id, "QRY_ASSIGN_QNT_ISEXIST");
            clusterQueryAgent.query(lo_daoParams, lo_param, (err, result) => {
                if (err) {
                    const lo_error = new ErrorClass();
                    lo_error.errorMsg = err;
                    reject(lo_error);
                }
                else {
                    if (result.assign_qnt > 0) {
                        lo_return.showConfirm = true;
                        lo_return.confirmMsg = commonRules.getMsgByCod("pms11msg1", session.locale);
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
        const lo_daoParam = commonRules.ConvertToQueryParams(session.athena_id, "QRY_IS_ASSIGN_ORDER_ROOM");
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
     * 1.cust_cod入到order_mn.acust_cod
     * 2.alt_nam入到order_mn.acust_nam
     * 3.sales_cod入到order_mn.sales_cod
     * 4.cust_mn.remark1入到order_mn.order_rmk【select remark1 from cust_mn where athena_id = ? and cust_cod = ?】
     * 5.如果團號(order_mn.group_nos)未填時,將alt_nam入到order_mn.group_nos
     * 6.聯絡人的帶法見聯絡人處理方式,看『宏興SD 4.聯絡人處理方式』
     * 7.有固定的公帳號時,入到master_nos 且 master_sta = 'Y' 看SA『是否有固定公帳號SQL』
     * 8.如果訂房公司與舊的不同時，訂房明細房價要重算
     * call pg_hd1_cal_appraise2.pp_ren_dt_order_appraise()   看SA『計算房價』有傳入欄位
     * @param postData {object} post資料
     * @param session {object}
     * @returns {Promise<void>}
     */
    chkOrdermnAcustnam: async function (postData, session, callback) {
        const lo_return = new ReturnClass();
        lo_return.effectValues.orderMnSingleData = {};
        lo_return.effectValues.orderMnSingleData = {};
        const la_orderDt4Table = postData.orderDt4Table;
        let lo_error = null;

        try {
            //4.
            const lo_params = {
                athena_id: session.athena_id,
                cust_cod: postData.order_mn.acust_cod
            };
            const lo_remarkResult = await
                commonRules.clusterQuery(session, lo_params, "QRY_REMARK1");
            lo_return.effectValues.orderMnSingleData.order_rmk = lo_remarkResult.remark1;

            //5.如果團號(order_mn.group_nos)未填時,將alt_nam入到order_mn.group_nos
            if (postData.order_mn.group_nos === "") {
                let ls_alt_nam = "";
                if(postData.guest_mn.alt_nam.indexOf(":") > -1){
                    ls_alt_nam = postData.guest_mn.alt_nam.split(":")[1];
                }
                lo_return.effectValues.orderMnSingleData.group_nos = ls_alt_nam;
            }

            //6.『宏興SD 4.聯絡人處理方式』
            const lo_attenNamParams = {
                order_mn: postData.order_mn,
                guest_mn: postData.guest_mn,
                type: "acust_nam"
            };
            let lo_contact = await
                chkAttenNamRule(lo_attenNamParams, session);
            lo_return.effectValues.orderMnSingleData = _.extend(lo_return.effectValues.orderMnSingleData, lo_contact);

            //TODO: 8.如果訂房公司與舊的不同時，訂房明細房價要重算
            // _.each(la_orderDt4Table, async (lo_orderDt4Table, ln_idx) => {
            //     lo_orderDt4Table.key_nos = postData.key_nos;
            //     la_orderDt4Table[ln_idx] = await CalculationRoomPrice(lo_orderDt4Table, session);
            // });
            // postData.allRowData = la_orderDt4Table;
            // this.compute_oder_dt_price(postData, session, function (err, result) {
            //     lo_return.effectValues.orderDtRowsData4table = result.effectValues;
            // })


        }
        catch (errorMsg) {
            lo_error = new ErrorClass();
            lo_return.success = false;
            lo_error.errorMsg = errorMsg.message || errorMsg;
        }
        callback(lo_error, lo_return);
    },

    /**
     * 訂房取消原因
     * 1.將下拉的"說明",帶入"說明"欄位
     * 2.依照下拉的"可否修改說明"flag1_sta,控制"說明"欄位是否readonly
     * @param postData {object} 前端條件
     * @param session   {object}
     * @param callback
     * @returns {Promise<void>}
     */
    chkOrderdtCancelcod: async (postData, session, callback) => {
        const lo_return = new ReturnClass();
        const la_cancelFieldsData = postData.cancelFieldsData;
        const ls_cancelCod = postData.cancelData.cancel_cod;
        const la_selectData = _.findWhere(la_cancelFieldsData, {ui_field_name: "cancel_cod"}).selectData.selectData;

        const lo_selectData = _.findWhere(la_selectData, {cancel_cod: ls_cancelCod});

        if (lo_selectData.flag1_sta === "N") {
            lo_return.readonlyFields.push("cancel_rmk");
        }
        else {
            lo_return.unReadonlyFields.push("cancel_rmk");
        }
        callback(null, lo_return);
    }

};

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
const chkAttenNamRule = async (params, session) => {
    const lo_return = new ReturnClass();
    const lo_guest_mn = params.guest_mn;
    const lo_order_mn = params.order_mn;
    lo_guest_mn.alt_nam = lo_guest_mn.alt_nam || "";        //旅客姓名
    lo_order_mn.acust_nam = lo_order_mn.acust_nam || "";    //訂房公司名稱
    lo_order_mn.atten_nam = lo_order_mn.atten_nam || "";    //聯絡人

    //(3)聯絡人order_mn.atten_nam是空值,才帶入
    if (lo_order_mn.atten_nam.trim() === "") {
        let ls_atten_by;
        //(1)看『旅客姓名guest_mn.alt_nam、訂房公司名稱order_mn.acust_nam』,那個先key,就由它帶入
        //(2)看另一個欄位有沒有值,來判斷先key後key
        //旅客姓名先key
        if (lo_guest_mn.alt_nam.trim() !== "" && lo_order_mn.acust_nam.trim() === "") {
            ls_atten_by = "P";
            lo_order_mn.atten_nam = lo_order_mn.alt_nam;
        }
        //訂房公司名稱先key
        else if (lo_guest_mn.alt_nam.trim() === "" && lo_order_mn.acust_nam.trim() !== "") {
            ls_atten_by = "C";
            lo_order_mn.atten_nam = lo_order_mn.acust_nam;
        }

        else {
            ls_atten_by = params.type === "acust_nam" ? "C" : "P";
            lo_order_mn.atten_nam = lo_order_mn.acust_nam;
        }

        if (lo_order_mn.atten_by !== ls_atten_by) {
            //(4)改變聯絡人來源order_mn.atten_by時,任一”聯絡資料” 有值時,要詢問：”是否蓋掉現有連絡資料?”
            const la_contactData = ["alt_nam", "mobile_nos", "office_tel", "home_tel", "fax_nos", "e_mail"];
            for (let lo_contactData of la_contactData) {
                const lo_data = lo_order_mn[lo_contactData] || "";
                if (lo_data.trim() !== "") {
                    lo_return.showConfirm = true;
                    lo_return.confirmMsg = commonRules.getMsgByCod("pms11msg5", session.locale);
                    break;
                }
            }
            //(6)取得聯絡資料兩者sql一樣,只差在紅色字
            const lo_param = {
                athena_id: session.athena_id,
                acust_cod: lo_order_mn.acust_cod,
                atten_by: lo_order_mn.atten_by,
                gcust_cod: lo_guest_mn.gcust_cod
            };
            const lo_contact = await commonRules.clusterQuery(session, lo_param, "QRY_CONTACT_BY_ATTEN_BY");
            if (lo_contact === null) return {};

            //移除null、undefined
            _.each(lo_contact, (value, key) => {
                lo_contact[key] = value || "";
            });
            lo_contact.atten_nam = lo_order_mn.atten_nam;
            delete lo_contact["alt_nam"];
            return lo_contact;
        }
        else {
            return {atten_nam: lo_order_mn.atten_nam};
        }
    }
    else {
        return {atten_nam: lo_order_mn.atten_nam};
    }
};