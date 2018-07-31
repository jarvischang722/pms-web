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
	var start = 0;
	var size = 0;
	var offset = 0;
	var length = 0;
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
	var daoDD = DB.queryDao(ddObj, param);
	if (daoDD == null) {
		if (mode == 1) {
			cb({err: 'no dao'}, []);
		} else {
			cb({err: 'no dao'}, null);
		}
		return;
	}
	var results = [];
	if (_.isUndefined(ddObj.id) == false) {
		DB.getConnection(ddObj.id, function (err, connection) {
			if (err) {
				if (mode == 1) {
					cb(err, []);
				} else {
					cb(err, null);
				}
				return;
			}
			DB.doQuery(connection, daoDD.sql, daoDD.param, mode, start, size, function (err, result) {
				if (err) {
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
				if (connection) {
					connection.close(function (err) {
						if (err) {
							console.error(err.message);
						}
					});
				}
			});
		});
	} else {
		async.each(DB.clusters, function (id, callback) {
			DB.getConnection(id, function (err, connection) {
				if (err) {
					callback(err);
					return;
				}
				DB.doQuery(connection, daoDD.sql, daoDD.param, mode, start, size, function (err, result) {
					results = results.concat(result);
					callback(err);
					if (connection) {
						connection.close(function (err) {
							if (err) {
								console.error(err.message);
							}
						});
					}
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
};


