let DB = require('./DB.js');
let async = require('async');
let _ = require("underscore");

exports.query = function (dao, param, cb) {
    if (_.isObject(dao)) {
        queryData(0, cb, dao, param);
    } else {
        queryData(0, cb, {dao: dao}, param);
    }
};

exports.queryList = function (dao, param, cb) {
    if (_.isObject(dao)) {
        queryData(1, cb, dao, param);
    } else {
        queryData(1, cb, {dao: dao}, param);
    }
};


function queryData(mode, cb, ddObj, param) {

    let start = 0;
    let size = 0;
    let offset = 0;
    let length = 0;
    if (mode == 1) {
        if (Number.isInteger(ddObj.start)) {
            start = ddObj.start;
        }
        if (Number.isInteger(ddObj.size)) {
            size = ddObj.size;
        }
        if (Number.isInteger(ddObj.offset)) {
            offset = ddObj.offset;
        }
        if (Number.isInteger(ddObj.length)) {
            length = ddObj.length;
        }
    }
    DB.queryDao(ddObj, param, function (err, sql, con) {
        if (err) {
            if (mode == 1) {
                cb(err, []);
            } else {
                cb(err, null);
            }
            return;
        }
        let results = [];
        if (_.isUndefined(ddObj.id)) {
            DB.getConnection(ddObj.id, function (err, connection) {
                if (err) {
                    if (mode == 1) {
                        cb(err, []);
                    } else {
                        cb(err, null);
                    }
                    return;
                }
                DB.doQuery(connection, sql, con, mode, start, size, function (err, result) {
                    if (err) {

                        console.error(err);
                        console.error(sql);
                        console.error(con);

                        if (mode == 1) {
                            cb(err, []);
                        } else {
                            cb(err, null);
                        }
                        return;
                    }
                    results = results.concat(result);
                    if (mode == 1) {
                        if (offset > 0 || length > 0) {
                            cb(null, results.slice(offset, offset + length));
                        } else {
                            cb(null, results);
                        }
                    } else {
                        if (results.length > 0) {
                            cb(null, results[0]);
                        } else {
                            cb(null, null);
                        }
                    }
                });
            });
        }
        else {
            async.each(DB.clusters, function (id, callback) {
                DB.getConnection(id, function (err, connection) {
                    if (err) {
                        callback(err);
                        return;
                    }
                    DB.doQuery(connection, sql, con, mode, start, size, function (err, result) {
                        if (err) {
                            console.error(err);
                            console.error(sql);
                            console.error(con);
                        }
                        results = results.concat(result);
                        callback(err);
                    });
                });
            }, function (err) {
                if (err) {
                    if (mode == 1) {
                        cb(err, []);
                    } else {
                        cb(err, null);
                    }
                    return;
                }
                if (mode == 1) {
                    if (offset > 0 || length > 0) {
                        cb(null, results.slice(offset, offset + length));
                    } else {
                        cb(null, results);
                    }
                } else {
                    if (results.length > 0) {
                        cb(null, results[0]);
                    } else {
                        cb(null, null);
                    }
                }
            });
        }
    });

}


