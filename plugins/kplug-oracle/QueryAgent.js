const DB = require('./DB.js');
const _ = require("underscore");
const _s = require("underscore.string");

exports.query = function (dao, param, cb, agent) {
	if (_.isObject(dao)) {
		queryData(agent, 0, cb, dao, param);
	} else {
		queryData(agent, 0, cb, {dao: dao, id: 'default'}, param);
	}
};

exports.queryList = function (dao, param, start, size, cb, agent) {
	if (_.isObject(dao)) {
		queryData(agent, 1, cb, dao, param, start, size);
	} else {
		queryData(agent, 1, cb, {dao: dao, id: 'default'}, param, start, size);
	}
};

exports.queryData = queryData;

function queryData(agent, mode, cb, ddObj, param, start, size) {
	let daoDD = DB.queryDao(ddObj, param);
	if (daoDD == null) {
		console.error({err: 'no dao'});
		if (mode == 1) {
			cb({err: 'no dao'}, [], agent);
		} else {
			cb({err: 'no dao'}, null, agent);
		}
		return;
	}
	if (agent == null) {
		//TODO 因為達美樂首頁公司別撈不出來問題，需要設debug 計算執行時間有無卡住
		let startTime = new Date().getTime();
		DB.getConnection(ddObj.id, function (err, connection) {
			let end = new Date().getTime();
			if ((end - startTime) / 1000 > 1) {
				console.error(`Oracle DB 連線異常: ${(end - startTime) / 1000} sec`);
				console.error(`異常SQL: ${ddObj.dao || ""}`);
				console.error(`異常params : ${JSON.stringify(param)}`);
			}
			if (err) {
				cb(err, {}, agent);
				console.error(err);
				return;
			}
			DB.doQuery(connection, daoDD.sql, daoDD.param, mode, start, size, function (err, result) {
				if (err) {
					console.error(err);
					console.error(daoDD.sql);
					console.error(daoDD.param);
				}
				cb(err, result, agent);
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
		DB.doQuery(agent.connection, daoDD.sql, daoDD.param, mode, start, size, function (err, result) {
			if (err) {
				console.error(err);
				console.error(daoDD.sql);
				console.error(daoDD.param);
			}
			cb(err, result, agent);
		});
	}
}

exports.queryData = searchData;

exports.search = async function (dao, param, cb, agent) {
	if (_.isObject(dao)) {
		return await searchData(agent, 0, dao, param);
	} else {
		return await searchData(agent, 0, {dao: dao, id: 'default'}, param);
	}
};

exports.searchList = async function (dao, param, start, size, cb, agent) {
	if (_.isObject(dao)) {
		return await searchData(agent, 1, dao, param, start, size);
	} else {
		return await searchData(agent, 1, {dao: dao, id: 'default'}, param, start, size);
	}
};

function searchData(agent, mode, ddObj, param, start, size) {
	return new Promise(async function (resolve, reject) {
		let daoDD = DB.queryDao(ddObj, param);
		if (daoDD == null) {
			reject({err: 'no dao ' + JSON.stringify(ddObj)});
			return;
		}
		let connection = null;
		try {
			if (agent == null) {
				//TODO 因為達美樂首頁公司別撈不出來問題，需要設debug 計算執行時間有無卡住
				let startTime = new Date().getTime();
				connection = await DB.getConn(ddObj.id);
				let endTime = new Date().getTime();
				if ((endTime - startTime) / 1000 > 1) {
					console.error(`Oracle DB 連線異常: ${(endTime - startTime) / 1000} sec`);
					console.error(`異常SQL: ${ddObj.dao || ""}`);
					console.error(`異常params : ${JSON.stringify(param)}`);
				}
				if (connection == null) {
					reject({err: 'no connection'});
					return;
				}
			} else {
				connection = agent.connection;
			}

			let result = await DB.doSearch(connection, daoDD.sql, daoDD.param, mode, start, size);
			resolve(result);
		} catch (err) {
			reject(err);
			console.error(err);
			console.error(daoDD.sql);
			console.error(daoDD.param);
		}
		finally {
			if (agent == null) {
				if (connection) {   // the conn assignment worked, must release
					try {
						await connection.close();
					} catch (e) {
						console.error(e);
					}
				}
			}
		}
	});
}