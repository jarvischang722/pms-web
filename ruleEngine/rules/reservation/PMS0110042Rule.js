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
const clusterQueryAgent = require("../../../plugins/kplug-oracle/ClusterQueryAgent");
const commandRules = require("./../CommonRule");
const ReturnClass = require(ruleRootPath + "/returnClass");
const ErrorClass = require(ruleRootPath + "/errorClass");
const tools = require(appRootDir + "/utils/CommonTools");
const sysConf = require("../../../configs/systemConfig");

module.exports = {
    /**
     * order dt 欄位ci日期
     * 1.連動欄位days
     * 2.當source_typ=DU時,days=0
     * 3.重算房價
     * 4.取房型下拉資料
     * @param postData
     * @param session
     * @param callback
     */
    chkOrderdtCidat: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            let ls_ciDat = postData.singleRowData[0].ci_dat || "";
            let ls_coDat = postData.singleRowData[0].co_dat || "";

            //連動欄位days
            let ln_days = moment(new Date(ls_coDat)).diff(moment(new Date(ls_ciDat)), "days");

            if (ln_days < 0) {
                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = 'c/i 日期要小於 c/o日期';
            }
            else {
                //當source_typ=DU時,days=0
                let ls_sourceTyp = postData.singleRowData[0].source_typ || "";
                if (ls_sourceTyp !== "") {
                    ln_days = ls_sourceTyp === "DU" ? 0 : ln_days;
                }

                //重算房價
                let lo_calculationRoomPrice = {};
                if (ln_days !== 0) {
                    postData.singleRowData[0].days = ln_days;
                    lo_calculationRoomPrice = await CalculationRoomPrice(postData.singleRowData[0], session);

                    if (lo_calculationRoomPrice.success) {
                        lo_result.effectValues = _.extend(lo_result.effectValues, lo_calculationRoomPrice.data);
                    }
                    else {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = lo_calculationRoomPrice.errorMsg;
                    }

                }
                lo_result.effectValues.days = ln_days;
                lo_result.effectValues.ci_dat = moment(ls_ciDat).format("YYYY/MM/DD");
                lo_result.effectValues.co_dat = moment(ls_coDat).format("YYYY/MM/DD");
                lo_result.effectValues.ci_dat_week = moment(ls_ciDat).format("ddd");
                lo_result.effectValues.co_dat_week = moment(ls_coDat).format("ddd");

                //取得房型下拉資料
                let lo_roomCodSelectData = await GetRoomCodSelectOption(postData.singleRowData[0], session);
                let lo_useCodSelectData = await GetUseCodSelectOption(postData.singleRowData[0], session);
                lo_result.selectField = ["room_cod", "use_cod"];
                lo_result.multiSelectOptions.room_cod = lo_roomCodSelectData.data;
                lo_result.multiSelectOptions.use_cod = lo_useCodSelectData.data;
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
     * order dt 欄位co日期
     * 1.連動欄位days
     * 2.當source_typ=DU時,days=0
     * 3.重算房價
     * 4.取房型下拉資料
     * @param postData
     * @param session
     * @param callback
     */
    chkOrderdtCodat: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            let ls_ciDat = postData.singleRowData[0].ci_dat || "";
            let ls_coDat = postData.singleRowData[0].co_dat || "";

            //連動欄位days
            let ln_days = moment(new Date(ls_coDat)).diff(moment(new Date(ls_ciDat)), "days");

            if (ln_days < 0) {
                lo_result.success = false;
                lo_error = new ErrorClass();
                lo_error.errorMsg = 'c/i 日期要小於 c/o日期';
            }
            else {
                //當source_typ=DU時,days=0
                let ls_sourceTyp = postData.singleRowData[0].source_typ || "";
                if (ls_sourceTyp !== "") {
                    ln_days = ls_sourceTyp === "DU" ? 0 : ln_days;
                }
                //重算房價
                let lo_calculationRoomPrice = {};
                if (ln_days !== 0) {
                    postData.singleRowData[0].days = ln_days;
                    lo_calculationRoomPrice = await CalculationRoomPrice(postData.singleRowData[0], session);
                    if (lo_calculationRoomPrice.success) {
                        lo_result.effectValues = _.extend(lo_result.effectValues, lo_calculationRoomPrice.data);
                    }
                    else {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = lo_calculationRoomPrice.errorMsg;
                    }
                    lo_result.effectValues.days = ln_days;
                    lo_result.effectValues.ci_dat = moment(ls_ciDat).format("YYYY/MM/DD");
                    lo_result.effectValues.co_dat = moment(ls_coDat).format("YYYY/MM/DD");
                    lo_result.effectValues.ci_dat_week = moment(ls_ciDat).format("ddd");
                    lo_result.effectValues.co_dat_week = moment(ls_coDat).format("ddd");

                    //取得房型下拉資料
                    let lo_roomCodSelectData = await GetRoomCodSelectOption(postData.singleRowData[0], session);
                    let lo_useCodSelectData = await GetUseCodSelectOption(postData.singleRowData[0], session);
                    lo_result.selectField = ["room_cod", "use_cod"];
                    lo_result.multiSelectOptions.room_cod = lo_roomCodSelectData.data;
                    lo_result.multiSelectOptions.use_cod = lo_useCodSelectData.data;
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
     *  order dt 欄位 房價代號
     * 1.帶回soruce_typ, guest_typ,commis_rat
     * 2.欄位佣金commis_rat,可否修改
     * 3.計算房價
     * 4.取房型下拉資料
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise<void>}
     */
    chkOrderdtRatecod: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {

            let ls_rateCod = postData.singleRowData[0].rate_cod || "";
            if (ls_rateCod != "") {
                let lo_param = {
                    athena_id: session.athena_id,
                    hotel_cod: session.hotel_cod,
                    rate_cod: ls_rateCod
                };

                //帶回soruce_typ, guest_typ,commis_rat
                let lo_daoParams = commandRules.ConvertToQueryParams(lo_param.athena_id, "SEL_SOURCE_TYP_GUEST_TYP_COMMIS_RAT_FOR_RATECOD");
                let lo_fetchData = await new Promise((resolve, reject) => {
                    clusterQueryAgent.query(lo_daoParams, lo_param, function (err, result) {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });

                //欄位佣金commis_rat,可否修改
                lo_daoParams = commandRules.ConvertToQueryParams(lo_param.athena_id, "SEL_COMMIS_CHG_FOR_ATHENA_ID_AND_HOTEL_ID_AND_RATE_COD");
                let lo_fetchCommis = await new Promise((resolve, reject) => {
                    clusterQueryAgent.query(lo_daoParams, lo_param, function (err, result) {
                        if (err) {
                            reject(err);
                        } else {
                            resolve(result);
                        }
                    });
                });
                if (lo_fetchCommis.commis_chg == "N") {
                    lo_result.readonlyFields.push("commis_rat");
                }
                else {
                    lo_result.unReadonlyFields.push("commis_rat");
                }

                //檢查新rate_cod與計價房型能否配對
                let lo_chkRoomTyp = await GetUseCodSelectOption(postData.singleRowData[0], session);
                let la_roomTyp = lo_chkRoomTyp.data;
                let ln_roomTypIdx = _.findIndex(la_roomTyp, {room_cod: postData.singleRowData[0].use_cod});
                if (ln_roomTypIdx == -1) {
                    lo_result.effectValues.use_cod = "";
                }

                //重算房價
                let lo_calculationRoomPrice = await CalculationRoomPrice(postData.singleRowData[0], session);

                if (lo_calculationRoomPrice.success) {
                    lo_result.effectValues = _.extend(lo_result.effectValues, lo_fetchData);
                    lo_result.effectValues = _.extend(lo_result.effectValues, lo_calculationRoomPrice.data);

                    //取得房型下拉資料
                    let lo_roomCodSelectData = await GetRoomCodSelectOption(postData.singleRowData[0], session);
                    let lo_useCodSelectData = await GetUseCodSelectOption(postData.singleRowData[0], session);
                    lo_result.selectField = ["room_cod", "use_cod"];
                    lo_result.multiSelectOptions.room_cod = lo_roomCodSelectData.data;
                    lo_result.multiSelectOptions.use_cod = lo_useCodSelectData.data;

                    lo_result.isEffectFromRule = false;
                }
                else {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = lo_calculationRoomPrice.errorMsg;
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
     * order dt 欄位 使用房型
     * 1.若有排房，顯示訊息『已有排房不可修改，請至排房作業調整』
     * 2.取房型資料
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise.<void>}
     */
    chkOrderdtRoomcod: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            let ls_ciDat = postData.singleRowData[0].ci_dat || "";
            let ls_coDat = postData.singleRowData[0].co_dat || "";
            let ls_rateCod = postData.singleRowData[0].rate_cod || "";
            let ls_ikey = postData.singleRowData[0].ikey || "";
            let ls_ikeySeqNos = postData.singleRowData[0].ikey_seq_nos || "";
            let la_chkFiled = [ls_ciDat, ls_coDat, ls_rateCod, ls_ikey, ls_ikeySeqNos];
            if (la_chkFiled.indexOf("") == -1) {
                //檢查是否有排房
                let lo_chkIsAssign = await new Promise((resolve, reject) => {
                    const lo_params = {
                        athena_id: session.athena_id,
                        ikey: ls_ikeySeqNos,
                        ikey_seq_nos: la_chkFiled
                    };
                    const lo_daoParams = commandRules.ConvertToQueryParams(session.athena_id, "QRY_ASSIGN_QNT_ISEXIST");
                    clusterQueryAgent.query(lo_daoParams, lo_params, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                if (lo_chkIsAssign.assign_qnt > 0) {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = commandRules.getMsgByCod("pms11msg4", session.locale);
                }
                else {
                    //取房型下拉資料
                    let [lo_roomCodSelectData, lo_useCodSelectData] = await Promise.all([
                        GetRoomCodSelectOption(postData.singleRowData[0], session),
                        GetUseCodSelectOption(postData.singleRowData[0], session)
                    ]);
                    lo_result.selectFiled = ["use_cod", "room_cod"];
                    lo_result.multiSelectOptions.room_cod = lo_roomCodSelectData.data;
                    lo_result.multiSelectOptions.use_cod = lo_useCodSelectData.data;
                }
            }
            else {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = commandRules.getMsgByCod('pms11msg3', session.locale);
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
     * order dt 欄位 計價房型
     * 1.取房型資料
     * 2.使用房型要同時修改成相同房型
     * 3.Upgrade授權人(upgrade_usr)與Upgrade原因(upgrade_reason) 要清空
     * 4.當使用房型為空值而帶入計價房型時，需再帶此房型設定標準人數
     * 5.重算房價
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise.<void>}
     */
    chkOrderdtUsecod: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            let ls_ciDat = postData.singleRowData[0].ci_dat || "";
            let ls_coDat = postData.singleRowData[0].co_dat || "";
            let ls_rateCod = postData.singleRowData[0].rate_cod || "";
            let ls_uesCod = postData.singleRowData[0].use_cod || "";
            let la_chkFiled = [ls_ciDat, ls_coDat, ls_rateCod, ls_uesCod];
            if (la_chkFiled.indexOf("") == -1) {
                //取房型下拉資料
                let [lo_roomCodSelectData, lo_useCodSelectData] = await Promise.all([
                    GetRoomCodSelectOption(postData.singleRowData[0], session),
                    GetUseCodSelectOption(postData.singleRowData[0], session)]);
                lo_result.selectFiled = ["use_cod", "room_cod"];
                lo_result.multiSelectOptions.room_cod = lo_roomCodSelectData.data;
                lo_result.multiSelectOptions.use_cod = lo_useCodSelectData.data;

                //使用房型要同時修改成相同房型
                lo_result.effectValues.room_cod = ls_uesCod;

                //清空Upgrade授權人、Upgrade原因
                lo_result.effectValues.upgrade_usr = "";
                lo_result.effectValues.upgrade_reason = "";

                //當使用房型為空值而帶入計價房型時，需再帶此房型設定標準人數
                let lo_fetchRoomNum = await new Promise((resolve, reject) => {
                    const lo_params = {
                        athena_id: session.athena_id,
                        hotel_cod: session.hotel_cod,
                        room_cod: ls_uesCod
                    };
                    const lo_daoParams = commandRules.ConvertToQueryParams(session.athena_id, "SEL_ROOM_TYP_DEFAULT_NUM");
                    clusterQueryAgent.query(lo_daoParams, lo_params, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });
                lo_result.effectValues.adult_qnt = lo_fetchRoomNum.default_adult_qnt;
                lo_result.effectValues.child_qnt = lo_fetchRoomNum.default_child_qnt;
                lo_result.effectValues.baby_qnt = lo_fetchRoomNum.default_baby_qnt;

                //重算房價
                let lo_calculationRoomPrice = await CalculationRoomPrice(postData.singleRowData[0], session);

                if (lo_calculationRoomPrice.success) {
                    lo_result.effectValues = _.extend(lo_result.effectValues, lo_calculationRoomPrice.data);

                    lo_result.isEffectFromRule = false;
                }
                else {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = lo_calculationRoomPrice.errorMsg;
                }
            }
            else {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = commandRules.getMsgByCod('pms11msg3', session.locale);
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
     * order dt 欄位 大人
     * 1.檢查人數不可超過計價房型設定中的最大人數
     * @param postData
     * @param session
     * @param callback
     */
    chkOrderdtAdultqnt: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {

            let ls_useCod = postData.singleRowData[0].use_cod || "";
            if (ls_useCod != "") {
                let lo_params = {
                    athena_id: session.athena_id,
                    hotel_cod: session.hotel_cod,
                    room_cod: ls_useCod
                };

                let lo_calculationRoomPrice = {};
                let lo_doChkQnt = await new Promise((resolve, reject) => {
                    const lo_daoParams = commandRules.ConvertToQueryParams(session.athena_id, "SEL_ORDER_DT_ADUL_QNT");
                    clusterQueryAgent.query(lo_daoParams, lo_params, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });

                let ln_maxQnt = Number(lo_doChkQnt.max_guest_qnt);
                let ln_adultQnt = Number(postData.singleRowData[0].adult_qnt);
                let ln_childQnt = Number(postData.singleRowData[0].child_qnt);
                if (ln_adultQnt + ln_childQnt <= ln_maxQnt) {
                    //計算房價
                    lo_calculationRoomPrice = await CalculationRoomPrice(postData.singleRowData[0], session);

                    if (lo_calculationRoomPrice.success) {
                        lo_result.effectValues = _.extend(lo_result.effectValues, lo_calculationRoomPrice.data);

                        lo_result.isEffectFromRule = false;
                    }
                    else {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = lo_calculationRoomPrice.errorMsg;
                    }
                }
                else {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = commandRules.getMsgByCod('pms11msg2', session.locale);
                }
            }
            else {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = commandRules.getMsgByCod('pms11msg3', session.locale);
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
     * order dt 欄位 小孩
     * 1.檢查人數不可超過計價房型設定中的最大人數
     * @param postData
     * @param session
     * @param callback
     */
    chkOrderdtChildqnt: async function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {

            let ls_useCod = postData.singleRowData[0].use_cod || "";
            if (ls_useCod != "") {
                let lo_params = {
                    athena_id: session.athena_id,
                    hotel_cod: session.hotel_cod,
                    room_cod: ls_useCod
                };

                let lo_calculationRoomPrice = {};
                let lo_doChkQnt = await new Promise((resolve, reject) => {
                    const lo_daoParams = commandRules.ConvertToQueryParams(session.athena_id, "SEL_ORDER_DT_ADUL_QNT");
                    clusterQueryAgent.query(lo_daoParams, lo_params, (err, result) => {
                        if (err) {
                            reject(err);
                        }
                        else {
                            resolve(result);
                        }
                    });
                });

                let ln_maxQnt = Number(lo_doChkQnt.max_guest_qnt);
                let ln_adultQnt = Number(postData.singleRowData[0].adult_qnt);
                let ln_childQnt = Number(postData.singleRowData[0].child_qnt);
                if (ln_adultQnt + ln_childQnt <= ln_maxQnt) {
                    //計算房價
                    lo_calculationRoomPrice = await CalculationRoomPrice(postData.singleRowData[0], session);

                    if (lo_calculationRoomPrice.success) {
                        lo_result.effectValues = _.extend(lo_result.effectValues, lo_calculationRoomPrice.data);

                        lo_result.isEffectFromRule = false;
                    }
                    else {
                        lo_error = new ErrorClass();
                        lo_result.success = false;
                        lo_error.errorMsg = lo_calculationRoomPrice.errorMsg;
                    }
                }
                else {
                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = commandRules.getMsgByCod('pms11msg2', session.locale);
                }
            }
            else {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = commandRules.getMsgByCod('pms11msg3', session.locale);
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
     * order dt 欄位　訂房來源
     * @param postData
     * @param session
     * @param callback
     */
    chk_source_typ: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        let ls_sourceTyp = postData.singleRowData[0].source_typ || "";
        if (ls_sourceTyp !== "" && ls_sourceTyp === "DU") {
            lo_result.effectValues.co_dat = postData.singleRowData[0].ci_dat;
        }

        callback(lo_error, lo_result);
    },

    /**
     * 取使用房型下拉資料
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise.<void>}
     */
    sel_room_cod_rule: async function (postData, session) {
        let lo_result = new ReturnClass();

        try {
            let ls_ciDat = postData.singleRowData[0].ci_dat || "";
            let ls_coDat = postData.singleRowData[0].co_dat || "";
            let ls_rateCod = postData.singleRowData[0].rate_cod || "";
            let la_chkFiled = [ls_ciDat, ls_coDat, ls_rateCod];
            if (la_chkFiled.indexOf("") == -1) {
                let lo_fetchSelectData = await GetRoomCodSelectOption(postData.singleRowData[0], session);
                lo_result.selectOptions = lo_fetchSelectData.data;
                return lo_result;
            }
            else {
                throw commandRules.getMsgByCod('pms11msg3', session.locale);
            }
        }
        catch (err) {
            throw err;
        }
    },

    /**
     * 取計價房型下拉資料
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise.<void>}
     */
    sel_use_cod_rule: async function (postData, session) {
        let lo_result = new ReturnClass();
        let lo_error = null;

        try {
            let ls_ciDat = postData.singleRowData[0].ci_dat || "";
            let ls_coDat = postData.singleRowData[0].co_dat || "";
            let ls_rateCod = postData.singleRowData[0].rate_cod || "";
            let la_chkFiled = [ls_ciDat, ls_coDat, ls_rateCod];
            if (la_chkFiled.indexOf("") == -1) {
                let lo_fetchSelectData = await GetUseCodSelectOption(postData.singleRowData[0], session);
                lo_result.selectOptions = lo_fetchSelectData.data;
                return lo_result;
            }
            else {
                throw commandRules.getMsgByCod('pms11msg3', session.locale);
            }
        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
            throw err;
        }
    },

    /**
     * 新增order dt明細
     * 1.取訂房卡序號
     * @param postData
     * @param session
     * @param callback
     * @returns {Promise.<void>}
     */
    ins_order_dt: async function (postData, session) {
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
            let lo_nowMaxIkeySeqNos = _.isUndefined(postData.allRowData[0].ikey_seq_nos) ?
                0 : _.max(postData.allRowData, (lo_orderDtRowsData) => {
                    return Number(lo_orderDtRowsData.ikey_seq_nos);
                });
            let ln_ikeySeqNos = 0;
            if (!_.isNull(lo_fetchMaxIkeySeqNos.ikey_seq_nos)) {
                ln_ikeySeqNos = Number(lo_fetchMaxIkeySeqNos.ikey_seq_nos) > Number(lo_nowMaxIkeySeqNos.ikey_seq_nos) ?
                    Number(lo_fetchMaxIkeySeqNos.ikey_seq_nos) : Number(lo_nowMaxIkeySeqNos.ikey_seq_nos);
            }
            lo_result.defaultValues.ikey_seq_nos = ln_ikeySeqNos + 1;

            return lo_result;

        }
        catch (err) {
            console.log(err);
            lo_error = new ErrorClass();
            lo_result.success = false;
            lo_error.errorMsg = err;
            throw lo_error;
        }
    },

    /**
     * 新增guest mn 資料
     * @param postData
     * @param session
     * @returns {Promise.<void>}
     */
    ins_guest_mn: async function (postData, session) {
        let lo_result = new ReturnClass();
        let lo_error = null;
        try {
            return await new Promise((resolve, reject) => {
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
                        if (data["RETN-CODE"] != "0000") {
                            reject(data["RETN-CODE-DESC"]);
                        }
                        else {
                            lo_result.defaultValues = {
                                athena_id: session.user.athena_id,
                                hotel_cod: session.user.hotel_cod,
                                ci_ser: data["SERIES_NOS"],
                                assign_sta: 'N',
                                guest_sta: 'E',
                                master_sta: 'G',
                                system_typ: 'HFD'
                            };
                            resolve(lo_result);
                        }
                    }
                });
            });
        }
        catch (err) {
            throw err;
        }
    },
};

//計算房價
async function CalculationRoomPrice(orderDtData, session) {
    let lo_data = {
        success: true,
        errorMsg: "",
        data: {}
    };

    try {
        let apiParams = {
            "REVE-CODE": "PMS0110041",
            "prg_id": "PMS0110041",
            "func_id": "0700",
            "athena_id": session.user.athena_id,
            "hotel_cod": session.user.hotel_cod,
            "key_nos": orderDtData.key_nos,
            "rate_cod": orderDtData.rate_cod,
            "room_cod": orderDtData.room_cod,
            "acust_cod": orderDtData.acust_cod,
            "ci_dat": moment(orderDtData.ci_dat).format("YYYY/MM/DD"),
            "stay_night": orderDtData.days,
            "order_sta": orderDtData.order_sta,
            "add_man_qnt": 0,
            "add_child_qnt": 0,
            "ikey": orderDtData.ikey,
            "ikey_seq_nos": [orderDtData.ikey_seq_nos],
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
            lo_data.success = false;
            lo_data.errorMsg = lo_computePrice["RETN-CODE-DESC"];
        }
        else {
            let lo_params = {
                athena_id: session.user.athena_id,
                hotel_cod: session.user.hotel_cod,
                ikey_seq_nos: orderDtData.ikey_seq_nos,
                ikey: orderDtData.ikey,
                key_nos: orderDtData.key_nos
            };
            let lo_fetchPrice = await new Promise((resolve, reject) => {
                queryAgent.query("QUY_ORDER_APPRAISE_FOR_ORDER_DT", lo_params, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            lo_data.data.rent_amt = lo_fetchPrice.rent_amt;
            lo_data.data.serv_amt = lo_fetchPrice.serv_amt;
            lo_data.data.other_amt = Number(lo_fetchPrice.total) - Number(lo_fetchPrice.serv_amt) - Number(lo_fetchPrice.rent_amt);
        }
    }
    catch (err) {
        console.log(err);
        lo_data.success = false;
        lo_data.errorMsg = err;
    }

    return lo_data;
}

//取使用房型下拉資料
async function GetRoomCodSelectOption(postData, session) {
    let lo_data = {
        success: true,
        errorMsg: "",
        data: {}
    };

    try {
        let lo_params = {
            athena_id: session.athena_id,
            hotel_cod: session.hotel_cod,
            co_dat: moment(postData.co_dat).format("YYYY/MM/DD"),
            ci_dat: moment(postData.ci_dat).format("YYYY/MM/DD"),
            rate_cod: postData.rate_cod,
            days: postData.days
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

        lo_data.data = la_roomCodSelectData;
    }
    catch (err) {
        console.log(err);
        lo_data.success = false;
        lo_data.errorMsg = err;
    }

    return lo_data;
}

//取計價房型下拉資料
async function GetUseCodSelectOption(postData, session) {
    let lo_data = {
        success: true,
        errorMsg: "",
        data: {}
    };

    try {
        let lo_params = {
            athena_id: session.athena_id,
            hotel_cod: session.hotel_cod,
            co_dat: moment(postData.co_dat).format("YYYY/MM/DD"),
            ci_dat: moment(postData.ci_dat).format("YYYY/MM/DD"),
            rate_cod: postData.rate_cod,
            days: postData.days
        };

        let la_roomCodSelectData = await new Promise((resolve, reject) => {
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
        _.each(la_roomCodSelectData, (lo_roomCodSelectData, idx) => {
            la_roomCodSelectData[idx].display = lo_roomCodSelectData.value + ':' + lo_roomCodSelectData.display;
        });

        lo_data.data = la_roomCodSelectData;
    }
    catch (err) {
        console.log(err);
        lo_data.success = false;
        lo_data.errorMsg = err;
    }

    return lo_data;
}