const oracledb = require('oracledb');
const path = require('path');
const moment = require('moment');
const async = require('async');
const _ = require("underscore");
const _s = require("underscore.string");
const exprjs = require('exprjs');
const parser = new exprjs();
const XMLUtil = require('./XMLUtil.js');
const dbConfig = require('../../configs/database');
const kplugFun = {
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

let prefix = ':';
let pools = {};
let daoList = [];
let months = {};
let daoPool = {};
let daoPath = path.join(__dirname, './dao/', 'service_dao.xml');
let daoDoc = XMLUtil.createDocument(daoPath);
let list = XMLUtil.getNodeList(daoDoc, "*//sql-source");
list.forEach(function (source) {
	let daoPath2 = path.join(__dirname, './dao/', XMLUtil.getAttr(source, "path"));
	daoList[daoList.length] = XMLUtil.createDocument(daoPath2);
});
console.log("Finished loading DAOs.");

// Oracle db options
oracledb.maxRows = dbConfig.oracle_maxRows || 1000;
oracledb.poolMin = dbConfig.oracle_poolMin || 5;
oracledb.poolMax = dbConfig.oracle_poolMax || 21;
oracledb.poolTimeout = dbConfig.oracle_poolTimeout || 60;
oracledb.poolIncrement = dbConfig.oracle_poolIncrement || 1;

// Return all CLOBs as Strings
oracledb.fetchAsString = [oracledb.CLOB];

function DB() {

}

DB.prototype.validQuery = null;
DB.prototype.debug = 0;
DB.prototype.clusters = [];
DB.prototype.options = {};
DB.prototype.create = function (opt) {
	this.options = opt;
	if (Array.isArray(opt) == false) {
		this.options = [opt];
	} else {
		this.options = opt;
	}
	this.clusters = [];
	for (let i = 0; i < this.options.length; i++) {
		this.clusters.push(this.options[i].id);
		this.debug = this.options[i].debug;
	}
	async.each(this.options, function (option, callback) {
		oracledb.createPool(
			{
				user: option.user,
				password: option.password,
				connectString: option.connectString
			},
			function (err, p) {
				if (err) {
					console.error(err);
					process.exit(1);
				}
				// console.log(p._createdDate)
				pools[option.id] = p;
				p.id = option.id;
				if (pools['default'] == null) {
					pools['default'] = p;
				}
				//console.log('create pool:' + option.id);
				if (_.isUndefined(option.months) == false) {
					option.months.forEach(function (month) {
						months[month] = p;
					});
				}
				callback();
			});
	}, function (err) {
		if (err) {
			console.error(err);
		}
		dbObj.validQuery = setInterval(function () {
			_.map(pools, async function (p, k) {
				for (let i = 0; i < oracledb.poolMin; i++) {
					let connection = null;
					try {
						let startTime = new Date().getTime();
						connection = await dbObj.getConn(k);
						let endTime = new Date().getTime();
						if ((endTime - startTime) / 1000 > 1) {
							console.error(`Oracle DB 連線異常: ${(endTime - startTime) / 1000} sec`);
							console.error(`異常SQL:validQuery`);
						}
						if (connection != null) {
							let result = await dbObj.doSearch(connection, "select 1 from dual", {}, 0, 0, 1);
						}
					} catch (err) {
						console.error(err);
					}
					finally {
						if (connection) {
							try {
								await connection.close();
							} catch (e) {
								console.error(e);
							}
						}
					}
				}
			});
		}, 60000);
	});

};

DB.prototype.isOk = function (id) {
	if (_.isUndefined(id)) {
		id = 'default';
	}
	return pools[id] == null ? false : true;
};

function getConnection(arg1, arg2) {
	let cb = arg1;
	let id = 'default';
	if (_.isFunction(arg1) == false) {
		cb = arg2;
		if (_.isUndefined(arg1) == false) {
			id = arg1;
		}
	}
	if (pools[id] == null) {
		console.log('wait [%s] pool init', id);
		setTimeout(function () {
			getConnection(id, cb);
		}, 1000);
		return;
	}
	pools[id].getConnection(function (err, connection) {
		if (err) {
			console.error(err);
			cb(err, null);
			return;
		}
		// console.log('pool.connectionOpen:' + pools[id].connectionsOpen);
		cb(err, connection);
	});
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms))
}

function getConn(arg1) {
	return new Promise(async function (resolve, reject) {
		let id = 'default';
		if (_.isUndefined(arg1) == false) {
			id = arg1;
		}
		while (pools[id] == null) {
			console.log('wait [%s] pool init', id);
			await sleep(1000);
		}

		let conn;
		try {
			conn = await pools[id].getConnection();
			resolve(conn);
		} catch (err) { // catches errors in getConnection and the query
			reject(err);
		} finally {
			// if (conn) {   // the conn assignment worked, must release
			// 	try {
			// 		await conn.release();
			// 	} catch (e) {
			// 		console.error(e);
			// 	}
			// }
		}
	});
}

DB.prototype.getConnection = getConnection;
DB.prototype.getConn = getConn;

DB.prototype.execute = function (sql, param, cb) {
	getConnection(function (err, con) {
		con.execute(sql, param, function (err, result) {
			if (err) {
				cb(err, result);
				return;
			}
			cb(err, result);
			con.close(
				function (err) {
					if (err) {
						console.error(err.message);
					}
					console.error('connection.close');
				});
		});
	});
};

DB.prototype.loadDao = function (dao) {
	if (dao && dao.dao) {
		console.log("Exec Dao name : " + dao.dao);
	}
	if (_.isUndefined(dao.xml) == true && daoPool[dao.dao] != null) {
		return daoPool[dao.dao];
	}
	let dNode;
	if (_.isUndefined(dao.xml) == false) {
		let doc = XMLUtil.createDocumentFromString('<?xml version="1.0" encoding="UTF-8"?>\r\n' + dao.xml);
		dNode = XMLUtil.getNode(doc, "dao");
	} else {
		for (let idx = 0; idx < daoList.length; idx++) {
			let doc = daoList[idx];
			let daoNode = XMLUtil.getNode(doc, "*//dao[@name='" + dao.dao + "']");
			if (daoNode != null) {
				dNode = daoNode;
				break;
			}
		}
	}
	if (dNode == null) {
		return null;
	}
	let statementsNode = XMLUtil.getNodeList(dNode, "statement");
	let statements = [];
	statementsNode.forEach(function (node, idx) {
		let sql = XMLUtil.getNodeValue(node);
		let test = XMLUtil.getAttr(node, "test");
		statements.push({sql: sql, test: test});
	});
	let parametersNode = XMLUtil.getNodeList(dNode, "parameter");
	let parameters = [];
	parametersNode.forEach(function (node, idx) {
		let key = XMLUtil.getNodeValue(node);
		key = key.toLowerCase();
		let kind = XMLUtil.getAttr(node, "kind");
		let type = XMLUtil.getAttr(node, "type");
		type = type.toLowerCase();
		if (kind == "" || kind == "1") {
			parameters.push({kind: 1, key: key, i: idx, type: type});
		} else if (kind == "2") {
			parameters.push({kind: 2, key: key, i: idx, type: type, condition: XMLUtil.getAttr(node, 'condition')});
		} else if (kind == "3") {
			parameters.push({kind: 3, key: key, i: idx, type: type});
		}
	});
	parameters.sort(function (a, b) {
		if (a.kind > b.kind) {
			return 1;
		} else if (a.kind < b.kind) {
			return -1;
		}
		return a.i > b.i ? 1 : -1;
	});

	let groupbysNode = XMLUtil.getNodeList(dNode, "groupby");
	let groupbys = [];
	groupbysNode.forEach(function (node, idx) {
		let sql = XMLUtil.getNodeValue(node);
		let test = XMLUtil.getAttr(node, "test");
		groupbys.push({sql: sql, test: test});
	});

	let orderbysNode = XMLUtil.getNodeList(dNode, "orderby");
	let orderbys = [];
	orderbysNode.forEach(function (node, idx) {
		let sql = XMLUtil.getNodeValue(node);
		let test = XMLUtil.getAttr(node, "test");
		orderbys.push({sql: sql, test: test});
	});

	return {statements: statements, parameters: parameters, groupbys: groupbys, orderbys: orderbys};
};

DB.prototype.paramTypeFormat = function (ls_paramType, lo_param, ls_paramKey) {
	let ls_cond = "";
	if (ls_paramType.toLowerCase() == 'likestring') {
		ls_cond = '%' + lo_param[ls_paramKey] + '%';
	}
	else if (ls_paramType.toLowerCase() == "number") {
		let strToNum = Number(lo_param[ls_paramKey]);
		ls_cond = _.isNaN(strToNum) ? "" : strToNum;
	}
	else if (ls_paramType.toLowerCase() == 'date') {
		if (lo_param[ls_paramKey] instanceof Date) {
			ls_cond = lo_param[ls_paramKey];
		} else {
			ls_cond = new moment(moment(new Date(lo_param[ls_paramKey])).format('YYYY/MM/DD HH:mm:ss')).toDate();
		}
	}
	else {
		ls_cond = lo_param[ls_paramKey];
	}

	return ls_cond;
};

DB.prototype.queryDao = function (dao, param) {
	try {
		let daoBean = this.loadDao(dao);
		if (daoBean == null) {
			console.error('no dao:' + dao.dao);
			return null;
		}
		let sql = "";
		daoBean.statements.forEach(function (statement) {
			if (statement.test != '') {
				let r;
				let test = parser.parse(statement.test);
				r = parser.run(test, kplugFun, {
					param: param
				});
				test = null;

				if (r) {
					sql += ' ' + statement.sql;
				}
			}
			else {
				sql += ' ' + statement.sql;
			}
		});

		let con = {};
		let lo_inCond = {};
		let self = this;
		daoBean.parameters.forEach(function (parameter) {
			if (parameter.kind == 1) {
				sql = sql.replace('?', prefix + parameter.key);
				con[parameter.key] = self.paramTypeFormat(parameter.type, param, parameter.key);

			}
			else if (parameter.kind == 2) {
				if (_.isUndefined(param[parameter.key]) == false || _.isEmpty(param[parameter.key]) == false) {
					sql += " and " + parameter.condition;
					sql = sql.replace('?', prefix + parameter.key);
					con[parameter.key] = self.paramTypeFormat(parameter.type, param, parameter.key);
				}
			}
			else if (parameter.kind == 3) {
				if (sql.search(prefix + parameter.key) >= 0 && param[parameter.key] != undefined) {
					if (parameter.type.toLowerCase() == 'instring') {
						if (param[parameter.key] instanceof Array) {
							_.each(param[parameter.key], function (ls_param, index) {
								if (index == 0) {
									lo_inCond[parameter.key] = "";
								}
								index++;
								lo_inCond[parameter.key] += "'" + ls_param + "'";
								if (index < param[parameter.key].length) {
									lo_inCond[parameter.key] += ",";
								}
							});
						}
						else {
							lo_inCond[parameter.key] = param[parameter.key];
						}
						con.inCond = lo_inCond;
					}
					else {
						con[parameter.key] = self.paramTypeFormat(parameter.type, param, parameter.key);
					}
				}
			}
		});

		daoBean.groupbys.forEach(function (statement) {
			if (statement.test != '') {
				let test = parser.parse(statement.test);
				let r = parser.run(test, kplugFun, {
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
				let test = parser.parse(statement.test);
				let r = parser.run(test, kplugFun, {
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
		// cb(null, sql, con);
		return {sql: sql, param: con};
	} catch (ex) {
		console.log(ex);
		return null;
	}
};

DB.prototype.doQuery = function (connection, sqlstring, condition, mode, start, size, cb) {
	if (mode == 0 || mode == 1 && size > 0) {
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

	// where in 用字串取代方式作
	if (!_.isUndefined(condition.inCond)) {
		_.each(condition.inCond, function (value, paramKey) {
			sqlstring = sqlstring.replace(":" + paramKey, value);
		});
		delete condition["inCond"];
	}

	//判斷condition有沒有 '.'的欄位，用字串取代方法做
	_.each(condition, (value, paramKey) => {
		if (paramKey.indexOf(".") > -1) {
			sqlstring = sqlstring.replace(new RegExp(`:${paramKey}`, 'g'), `'${value}'`);
			delete condition[paramKey];
		}
	});

	if (dbObj.debug == 1) {
		console.log("sqlstring:" + sqlstring);
		console.log("parameters:" + JSON.stringify(condition));
	}

	connection.execute(sqlstring, condition, function (err, result) {
		if (err) {
			console.error(err);
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
					// console.info('connection.close');
				});
			return;
		}
		let data = [];
		_.each(result.rows, function (row, idx) {
			let dd = {};
			for (let i = 0; i < row.length; i++) {
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
	});
};

DB.prototype.doSearch = function (connection, sqlstring, condition, mode, start, size, cb) {
	return new Promise(async function (resolve, reject) {
		if (mode == 0 || mode == 1 && size > 0) {
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
		// where in 用字串取代方式作
		if (!_.isUndefined(condition.inCond)) {
			_.each(condition.inCond, function (value, paramKey) {
				sqlstring = sqlstring.replace(":" + paramKey, value);
			});
			delete condition["inCond"];
		}
		//判斷condition有沒有 '.'的欄位，用字串取代方法做
		_.each(condition, (value, paramKey) => {
			if (paramKey.indexOf(".") > -1) {
				sqlstring = sqlstring.replace(new RegExp(`:${paramKey}`, 'g'), `'${value}'`);
				delete condition[paramKey];
			}
		});
		if (dbObj.debug == 1) {
			console.log("sqlstring:" + sqlstring);
			console.log("parameters:" + JSON.stringify(condition));
		}
		try {
			let result = await connection.execute(sqlstring, condition);
			if (mode == 1) {
				let data = [];
				_.each(result.rows, function (row, idx) {
					let dd = {};
					for (let i = 0; i < row.length; i++) {
						dd[result.metaData[i].name.toLowerCase()] = row[i];
					}
					data.push(dd);
				});
				resolve(data);
			} else {
				if (result.rows.length > 0) {
					let dd = {};
					for (let i = 0; i < result.rows[0].length; i++) {
						dd[result.metaData[i].name.toLowerCase()] = result.rows[0][i];
					}
					resolve(dd);
				} else {
					resolve(null);
				}
			}
		} catch (err) {
			reject(err);
		}
	});
};

let dbObj = new DB();
module.exports = exports = dbObj;