var oracledb = require('oracledb');
var path = require('path');
var moment = require('moment');
var XMLUtil = require('./XMLUtil.js');

var option = {};
var id = moment().format("YYYYMMDDHHmmssSSS");
var pool;
var daoList = [];
var daoPool = {};
var daoPath = path.join(__dirname, './dao/', 'service_dao.xml');
// console.log(daoPath);
var daoDoc = XMLUtil.createDocument(daoPath);
var list = XMLUtil.getNodeList(daoDoc, "*//sql-source");

console.log("start load dao...");
list.forEach(function (source) {
	var daoPath2 = path.join(__dirname, './dao/', XMLUtil.getAttr(source, "path"));
	daoList[daoList.length] = XMLUtil.createDocument(daoPath2);
	console.log( XMLUtil.getAttr(source, "path"));
});
console.log("finished load dao...");
function DB() {

}
DB.prototype.option = option;
DB.prototype.create = function (oracle) {
	option = oracle;
	oracledb.createPool(
		{
			user: oracle.user,
			password: oracle.password,
			connectString: oracle.connectString
		},
		function (err, p) {

			pool = p;
			console.log('create pool:' + id);
		});
};

function getConnection(cb) {
	if (pool == null) {
		console.log('wait pool init');
		setTimeout(function () {
			getConnection(cb);
		}, 100);
		return;
	}
	pool.getConnection(function (err, connection) {
		console.log('pool.connectionOpen:' + pool.connectionsOpen);
		cb(err, connection);
	});
}
DB.prototype.getConnection = getConnection;

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
}

DB.prototype.loadDao = function (daoKey) {
	if (daoPool[daoKey] != null) {
		return daoPool[daoKey];
	}
	var dNode;
	console.log('-----------------------------------------------------');
	console.log(daoKey + ',daoList:' + daoList.length);
	for (var idx = 0; idx < daoList.length; idx++) {
		//console.log('idx:' + idx);
		var doc = daoList[idx];
		var daoNode = XMLUtil.getNode(doc, "*//dao[@name='" + daoKey + "']");
		if (daoNode != null) {
			dNode = daoNode;
			break;
		}
	}
	if (dNode == null) {
		return null;
	}
	var statementsNode = XMLUtil.getNodeList(dNode, "statement");
	var statements = [];
	statementsNode.forEach(function (node, idx) {
		var sql = XMLUtil.getNodeValue(node);
		var test = XMLUtil.getAttr(node, "test");
		statements.push({sql: sql, test: test});
	});
	var parametersNode = XMLUtil.getNodeList(dNode, "parameter");
	var parameters = [];
	parametersNode.forEach(function (node, idx) {
		var key = XMLUtil.getNodeValue(node);
		key = key.toLowerCase();
		var kind = XMLUtil.getAttr(node, "kind");
		var type = XMLUtil.getAttr(node, "type");
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

	var groupbysNode = XMLUtil.getNodeList(dNode, "groupby");
	var groupbys = [];
	groupbysNode.forEach(function (node, idx) {
		var sql = XMLUtil.getNodeValue(node);
		var test = XMLUtil.getAttr(node, "test");
		groupbys.push({sql: sql, test: test});
	});

	var orderbysNode = XMLUtil.getNodeList(dNode, "orderby");
	var orderbys = [];
	orderbysNode.forEach(function (node, idx) {
		var sql = XMLUtil.getNodeValue(node);
		var test = XMLUtil.getAttr(node, "test");
		orderbys.push({sql: sql, test: test});
	});

	return {statements: statements, parameters: parameters, groupbys: groupbys, orderbys: orderbys};
};
module.exports = exports = new DB;