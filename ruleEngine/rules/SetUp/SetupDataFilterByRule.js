/**
 * Created by Jun on 2017/8/27.
 * 設定檔多筆資料特殊條件刪選規則
 * 方法以程式編碼(Prg_id)命名
 * 回傳型態皆為Array[Object]
 */
let _ = require("underscore");
let moment = require("moment");
let async = require("async");
let queryAgent = require('../../../plugins/kplug-oracle/QueryAgent');

/**
 *
 * @param rows
 * @param searchCond
 * @param callback
 * @constructor
 */
exports.PMS0810020Filter = function (rows, session, searchCond, callback) {
    if (!_.isUndefined(searchCond.query_dat) && searchCond.query_dat.length > 0) {
        searchCond.query_dat = moment(new Date(searchCond.query_dat)).format("YYYY/MM/DD");
        rows = _.filter(rows, function (d) {
            return new Date(d.begin_dat) <= new Date(searchCond.query_dat) &&
                new Date(d.end_dat) >= new Date(searchCond.query_dat);
        });
    }
    callback(rows);
};

/**
 *
 * @param rows
 * @param searchCond
 * @param callback
 * @constructor
 */
exports.PMS0830070Filter = function (rows, session, searchCond, callback) {
    callback(rows);
};

exports.PMS0830090Filter = function(rows, session, searchCond, callback) {
    callback(rows);
};

/**
 *
 * @param rows
 * @param searchCond
 * @param callback
 * @constructor
 */
exports.PMS0810180Filter = function (rows, session, searchCond, callback) {
    callback(rows);
};

/**
 *
 * @param rows
 * @param searchCond
 * @param callback
 * @constructor
 */
exports.PMS0820050Filter = function (rows, session, searchCond, callback) {
    if (!_.isUndefined(searchCond.query_dat) && !_.isEmpty(searchCond.query_dat[0]) && !_.isEmpty(searchCond.query_dat[1])) {
        let ld_begin_dat = searchCond.query_dat[0];
        let ld_end_dat = searchCond.query_dat[1];
        rows = _.filter(rows, function (d) {
            return new Date(d.begin_dat) <= new Date(ld_begin_dat) && new Date(d.end_dat) >= new Date(ld_end_dat);
        });
    }
    callback(rows);
};

/**
 *
 * @param rows
 * @param searchCond
 * @param callback
 * @constructor
 */
exports.PMS0830100Filter = function (rows, session, searchCond, callback) {
    if (!_.isUndefined(searchCond.query_dat) && !_.isEmpty(searchCond.query_dat)) {
        let li_counter = 0;
        let lo_rtnData = [];
        _.each(rows, function (eachRow, li_rowIndex) {
            let lo_params = {
                athena_id: eachRow.athena_id,
                hotel_cod: eachRow.hotel_cod,
                room_cod: eachRow.room_cod
            };
            queryAgent.queryList("QRY_HFD_REST_DT", lo_params, 0, 0, function (err, getResult) {
                if (!err) {
                    li_counter++;
                    let la_dtData = getResult;
                    let ld_query_dat = searchCond.query_dat;

                    let chkQueryResult = _.filter(la_dtData, function (lo_dtData) {
                        return new Date(lo_dtData.begin_dat) <= new Date(ld_query_dat) && new Date(lo_dtData.end_dat) >= new Date(ld_query_dat);
                    });

                    if (chkQueryResult.length != 0) {
                        lo_rtnData.push(rows[li_rowIndex]);
                    }
                }

                if (li_counter == rows.length) {
                    return callback(lo_rtnData);
                }
            });
        });
    }
    callback(rows);
};

/**
 * PMS0830010_出納員設定
 * @param rows
 * @param searchCond
 * @param callback
 * @constructor
 */
exports.PMS0830010Filter = function (rows, session, searchCond, callback) {
    if (!_.isUndefined(searchCond.usr_cname) && searchCond.usr_cname.length > 0) {
        let lo_params = {
            athena_id: session.user.athena_id,
            cmp_id: session.user.cmp_id,
            usr_cname: searchCond.usr_cname
        };

        queryAgent.query("QRY_USR_ID_BY_USR_CNAME", lo_params, function (err, getResult) {
            let ls_usr_id = getResult.usr_id;
            rows = _.filter(rows, function (d) {
                return _.indexOf([d.cashier_cod], ls_usr_id) > -1;
            });
            callback(rows);
        });
    }
    else {
        callback(rows);
    }
};