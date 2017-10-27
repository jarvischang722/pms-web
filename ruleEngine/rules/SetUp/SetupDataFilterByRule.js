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

    async.waterfall([
            function (callback) {
                //show_cod
                if (!_.isUndefined(searchCond.show_cod) && searchCond.show_cod.length > 0) {
                    let lo_params = {
                        show_cod: searchCond.show_cod
                    };

                    queryAgent.query("QRY_CUST_COD_BY_SHOW_COD", lo_params, function (err, getResult) {
                        if (getResult == null) {
                            rows = {};
                        }
                        else {
                            let ls_cust_cod = getResult.cust_cod;
                            rows = _.filter(rows, function (d) {
                                return _.indexOf([d.cust_cod], ls_cust_cod) > -1;
                            });
                        }
                        callback(null, rows);
                    });
                }
                else {
                    callback(null, rows);
                }
            },
        function (rows, callback) {
            //alt_nam
            if (!_.isUndefined(searchCond.alt_nam) && searchCond.alt_nam.length > 0) {
                let lo_params = {
                    cust_nam: searchCond.alt_nam
                };

                queryAgent.query("QRY_CUST_COD_BY_CUST_NAM", lo_params, function (err, getResult) {
                    if (getResult == null) {
                        rows = {};
                    }
                    else {
                        let ls_cust_cod = getResult.cust_cod;
                        rows = _.filter(rows, function (d) {
                            return _.indexOf([d.cust_cod], ls_cust_cod) > -1;
                        });
                    }
                    callback(null, rows);
                });
            }
            else {
                callback(null, rows);
            }
        }
        ], function (errMsg, rows) {
            callback(rows);
        }
    );
};

/**
 *
 * @param rows
 * @param searchCond
 * @param callback
 * @constructor
 */
exports.PMS0810180Filter = function (rows, session, searchCond, callback) {

    //ashow_cod
    if (!_.isUndefined(searchCond.ashow_cod) && searchCond.ashow_cod.length > 0) {
        rows = _.filter(rows, function (d) {
            return _.indexOf([d.ashow_cod.trim()], searchCond.ashow_cod.trim()) > -1;
        });
    }

    //acust_nam
    if (!_.isUndefined(searchCond.acust_nam) && searchCond.acust_nam.length > 0) {
        rows = _.filter(rows, function (d) {
            return _.indexOf([d.acust_nam.trim()], searchCond.acust_nam.trim()) > -1;
        });
    }

    //cshow_cod
    if (!_.isUndefined(searchCond.cshow_cod) && searchCond.cshow_cod.length > 0) {
        rows = _.filter(rows, function (d) {
            return _.indexOf([d.cshow_cod.trim()], searchCond.cshow_cod.trim()) > -1;
        });
    }

    //ccust_nam
    if (!_.isUndefined(searchCond.ccust_nam) && searchCond.ccust_nam.length > 0) {
        rows = _.filter(rows, function (d) {
            return _.indexOf([d.ccust_nam.trim()], searchCond.ccust_nam.trim()) > -1;
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

/**
 *
 * PSIW500030 門市web訂單作業
 * @param rows
 * @param searchCond
 * @param callback
 * @constructor
 */
exports.PSIW500030Filter = function (rows, session, searchCond, callback) {
    if (!_.isUndefined(searchCond.order_dat) && searchCond.order_dat.length > 0) {
        searchCond.order_dat = moment(new Date(searchCond.order_dat)).format("YYYY/MM/DD");
        rows = _.filter(rows, function (d) {
            return new Date(d.order_dat) == new Date(searchCond.order_dat);
        });
    }
    callback(rows);
};
