/**
 * Created by Jun on 2017/3/19.
 * 共用Rule
 */
var moment = require("moment");
var _ = require("underscore");

module.exports = {
    /**
     * 新增時共用一定要帶回的值
     * @param session
     * @return
     */
    getCreateCommonDefaultDataRule: function (session) {
        if(_.isUndefined(session)){
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
    }

}