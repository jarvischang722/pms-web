var config = require("../../configs/database");
var XMLUtil = require('./XMLUtil.js');
var DB = require('./DB.js');
var _ = require("underscore");
var _s = require("underscore.string");
var exprjs = require('exprjs');
var parser = new exprjs();
var moment = require('moment');

var prefix = ':';

var kplugFun = {
	_v: function (value) {
		if (_.isUndefined(value) || _.isNull(value)) {
			return "";
		}
		return value;
	}, _d: function (value) {
		if (_.isUndefined(value) || _.isNull(value)) {
			return 0;
		}
		if (_.isNaN(value * 1)) {
			return 0;
		}
		return value * 1;
	}
};

exports.query = function (daoName, param, cb, agent) {
	queryData(agent, 0, cb, daoName, param);
};

exports.queryList = function (daoName, param, start, size, cb, agent) {
	queryData(agent, 1, cb, daoName, param, start, size);
};

function doQuery(connection, sqlstring, condition, mode, start, size, cb) {
	if (mode == 0 || (mode == 1 && size > 0)) {
		if (connection.oracleServerVersion >= 1201000000) {
			sqlstring += " OFFSET :offset ROWS FETCH NEXT :maxnumrows ROWS ONLY";
		} else {
			sqlstring = "SELECT * FROM (SELECT A.*, ROWNUM AS MY_RNUM FROM"
				+ "(" + sqlstring + ") A "
				+ "WHERE ROWNUM <= :maxnumrows + :offset) WHERE MY_RNUM > :offset";
		}
		if (mode == 0) {
			condition['offset'] = 0;
			condition['maxnumrows'] = 1;
		} else if (mode == 1 && size > 0) {
			condition['offset'] = start;
			condition['maxnumrows'] = size;
		}
	}
	if (config.debug == 1) {
		console.log("sqlstring:" + sqlstring);
		console.log("parameters:" + JSON.stringify(condition));
	}
	connection.execute(sqlstring, condition, {maxRows: 500},function (err, result) {
		if (err) {
			if (mode == 1) {
				cb(err, []);
			} else {
				cb(err, null);
			}
			connection.close(
				function (err) {
					if (err) {
						console.error(err.message);
					}
					console.info('connection.close');
				});
			return;
		}
		var data = [];
		_.each(result.rows, function (row, idx) {
			var dd = {};
			for (var i = 0; i < row.length; i++) {
				dd[result.metaData[i].name.toLowerCase()] = row[i];
			}
			data.push(dd);
		});
		if (mode == 1) {
			cb(null, data);
		} else {
			if (data.length > 0) {
				cb(null, data[0]);
			} else {
				cb(null, null);
			}
		}
		connection.close(
			function (err) {
				if (err) {
					console.error(err.message);
				}
				console.info('connection.close');
			});
	});
}

function queryDao(daoName, param, cb) {
	var daoBean = DB.loadDao(daoName);
	if (daoBean == null) {
		cb({message: 'no dao:' + daoName}, null, null);
		return;
	}

	var sql = "";
	daoBean.statements.forEach(function (statement) {
		if (statement.test != '') {
			var test = parser.parse(statement.test);
			var r = parser.run(test, kplugFun, {
				param: param
			});
			test = null;
			if (r) {
				sql += ' ' + statement.sql;
			}
		} else {
			sql += ' ' + statement.sql;
		}
	});

	var con = {};
	daoBean.parameters.forEach(function (parameter) {
		if (parameter.kind == 1) {
			sql = sql.replace('?', prefix + parameter.key);
			if (parameter.type == 'likestring') {
				con[parameter.key] = '%' + param[parameter.key] + '%';
			} else if (parameter.type == 'date') {
				if (param[parameter.key] instanceof Date) {
					con[parameter.key] = param[parameter.key];
				} else {
					con[parameter.key] = new moment(param[parameter.key], 'YYYY/MM/DD HH:mm:ss').toDate();
				}
			} else {
				con[parameter.key] = param[parameter.key];
			}
		} else if (parameter.kind == 2) {
			if (_.isUndefined(param[parameter.key]) == false || _.isEmpty(param[parameter.key]) == false) {
				sql += " and " + parameter.condition;
				sql = sql.replace('?', prefix + parameter.key);
				if (parameter.type == 'likestring') {
					con[parameter.key] = '%' + param[parameter.key] + '%';
				} else if (parameter.type == 'date') {
					if (param[parameter.key] instanceof Date) {
						con[parameter.key] = param[parameter.key];
					} else {
						con[parameter.key] = new moment(param[parameter.key], 'YYYY/MM/DD HH:mm:ss').toDate();
					}
				} else {
					con[parameter.key] = param[parameter.key];
				}
			}
		} else if (parameter.kind == 3) {
			if (sql.indexOf(prefix + parameter.key) >= 0) {
				if (parameter.type == 'likestring') {
					con[parameter.key] = '%' + param[parameter.key] + '%';
				} else if (parameter.type == 'date') {
					if (param[parameter.key] instanceof Date) {
						con[parameter.key] = param[parameter.key];
					} else {
						con[parameter.key] = new moment(param[parameter.key], 'YYYY/MM/DD HH:mm:ss').toDate();
					}
				} else {
					con[parameter.key] = param[parameter.key];
				}
			}
		}
	});

	daoBean.groupbys.forEach(function (statement) {
		if (statement.test != '') {
			var test = parser.parse(statement.test);
			var r = parser.run(test, kplugFun, {
				param: param
			});
			test = null;
			if (r) {
				sql += ' ' + statement.sql;
			}
		} else {
			sql += ' ' + statement.sql;
		}
	});

	daoBean.orderbys.forEach(function (statement) {
		if (statement.test != '') {
			var test = parser.parse(statement.test);
			var r = parser.run(test, kplugFun, {
				param: param
			});
			test = null;
			if (r) {
				sql += ' ' + statement.sql;
			}
		} else {
			sql += ' ' + statement.sql;
		}
	});
	cb(null, sql, con);
}

function queryData(agent, mode, cb, daoName, param, start, size) {
	queryDao(daoName, param, function (err, sql, con) {
		if (err) {
			if (mode == 1) {
				cb(err, [], agent);
			} else {
				cb(err, null, agent);
			}
			return;
		}
		if (agent == null) {
			DB.getConnection(function (err, connection) {
				doQuery(connection, sql, con, mode, start, size, function (err, result) {
					cb(err, result, agent);
				});
			});
		} else {
			doQuery(agent.connection, sql, con, mode, start, size, function (err, result) {
				cb(err, result, agent);
			});
		}
	});
}
