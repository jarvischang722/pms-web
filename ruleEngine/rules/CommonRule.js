/**
 * Created by Jun on 2017/3/19.
 * 共用Rule
 */
var moment = require("moment");
var _ = require("underscore");
// var i18n = require("i18n");
var fs = require("fs");

module.exports = {
    /**
     * 新增時共用一定要帶回的值
     * @param session
     * @return
     */
    getCreateCommonDefaultDataRule: function (session) {
        if (_.isUndefined(session)) {
            return {};
        }
        var lo_common = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.fun_hotel_cod,
            ins_usr: session.user.usr_id,
            ins_dat: moment().format("YYYY/MM/DD HH:mm:ss"),
            upd_usr: session.user.usr_id,
            upd_dat: moment().format("YYYY/MM/DD HH:mm:ss")
        };
        return lo_common;
    },

    /**
     * 編輯時共用一定要帶回的值
     * @param session
     * @return
     */
    getEditDefaultDataRule: function (session) {
        var lo_common = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.fun_hotel_cod,
            upd_usr: session.user.usr_id,
            upd_dat: moment().format("YYYY/MM/DD HH:mm:ss")
        };
        return lo_common;
    },

    /**
     * 日期區間比較
     * @param compar_begin_dat 比較對象開始日
     * @param compar_end_dat 比較對象結束日
     * @param now_begin_dat 此筆資料開始日
     * @param now_end_dat 此筆資料結束日
     * @returns {boolean}
     */
    chkDateIsBetween: function (compar_begin_dat, compar_end_dat, now_begin_dat, now_end_dat) {
        compar_begin_dat = moment.isMoment(compar_begin_dat) ? compar_begin_dat : moment(new Date(compar_begin_dat));
        compar_end_dat = moment.isMoment(compar_end_dat) ? compar_end_dat : moment(new Date(compar_end_dat));
        now_begin_dat = moment.isMoment(now_begin_dat) ? now_begin_dat : moment(new Date(now_begin_dat));
        now_end_dat = moment.isMoment(now_end_dat) ? now_end_dat : moment(new Date(now_end_dat));
        if (compar_begin_dat.diff(now_end_dat, "days") <= 0 && compar_end_dat.diff(now_begin_dat, "days") >= 0) {
            return true;
        }
        else {
            return false;
        }
    },

    /**
     * 解決js相乘的浮點運算bug
     * @param arg1 : 被乘數
     * @param arg2 : 乘數
     * @returns {Number} : 結果
     */
    accMul: function (arg1, arg2) {
        var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
        try {
            m += s1.split(".")[1].length;
        } catch (e) {
        }
        try {
            m += s2.split(".")[1].length;
        } catch (e) {
        }
        return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
    },

    getMsgByCod: function (msgCod, locale) {

        var appRootPath = require('app-root-path').path;
        var localeContent = {};
        var localesPath = appRootPath + "/locales/";

        var isExist = fs.existsSync(localesPath + locale.toLowerCase() + ".json");
        if (isExist) {
            localeContent = require(localesPath + locale.toLowerCase() + ".json");

        } else {
            console.error("找不到多語系對應檔案[" + localesPath + locale.toLowerCase() + ".json]");
            localeContent = require(localesPath + "en.json");
        }

        return localeContent.ErrorMsg[msgCod];
    }
};