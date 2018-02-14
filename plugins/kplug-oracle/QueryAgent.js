var DB = require('./DB.js');
var _ = require("underscore");
var _s = require("underscore.string");

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
	DB.queryDao(ddObj, param, function (err, sql, con) {
		if (err) {
			console.error(err);
			if (mode == 1) {
				cb(err, [], agent);
			} else {
				cb(err, null, agent);
			}
			return;
		}
		if (agent == null) {
            //TODO 因為達美樂首頁公司別撈不出來問題，需要設debug 計算執行時間有無卡住
            let start  = new Date().getTime();
			DB.getConnection(ddObj.id, function (err, connection) {
                let end  = new Date().getTime();
                if((end-start) / 1000  > 1){
                    console.error(`Oracle DB 連線異常: ${(end-start) / 1000} sec`);
                    console.error(`異常params : ${JSON.stringify(param)}`);
                }
				DB.doQuery(connection, sql, con, mode, start, size, function (err, result) {
					if(err){
                        console.error(err);
					}
					cb(err, result, agent);
				});
			});
		} else {
			DB.doQuery(agent.connection, sql, con, mode, start, size, function (err, result) {
                if(err){
                    console.error(err);
                }
				cb(err, result, agent);
			});
		}
	});
}
