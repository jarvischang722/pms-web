/**
 * Created by Jun on 2017/8/27.
 * 設定檔多筆資料特殊條件刪選規則
 * 方法以程式編碼(Prg_id)命名
 * 回傳型態皆為Array[Object]
 */
let _ = require("underscore");
let moment = require("moment");
let async = require("async");

/**
 *
 * @param rows
 * @param searchCond
 * @param callback
 * @constructor
 */
exports.PMS0810020Filter = function(rows,searchCond,callback){
    if(!_.isUndefined(searchCond.room_typ) && searchCond.room_typ.length > 0){
        rows = _.filter(rows,function(d){
            return _.indexOf(searchCond.room_typ,d.room_typ) > -1;
        });
    }
    if(!_.isUndefined(searchCond.rent_cod) && searchCond.rent_cod.length > 0){
        rows = _.filter(rows,function(d){
            return _.indexOf(searchCond.rent_cod,d.rent_cod) > -1;
        });
    }
    if(!_.isUndefined(searchCond.serv_cod) && searchCond.serv_cod.length > 0){
        rows = _.filter(rows,function(d){
            return _.indexOf(searchCond.serv_cod,d.serv_cod) > -1;
        });
    }
    if(!_.isUndefined(searchCond.free_cod) && searchCond.free_cod.length > 0){
        rows = _.filter(rows,function(d){
            return _.indexOf(searchCond.free_cod,d.free_cod) > -1;
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
exports.PMS0830070Filter = function(rows,searchCond,callback){
    callback(rows);
};

/**
 *
 * @param rows
 * @param searchCond
 * @param callback
 * @constructor
 */
exports.PMS0830020Filter = function(rows,searchCond,callback){
    if(!_.isUndefined(searchCond.use_typ) && searchCond.use_typ.length > 0){
        rows = _.filter(rows,function(d){
            return _.indexOf(searchCond.use_typ,d.use_typ) > -1;
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
exports.PMS0810180Filter = function(rows,searchCond,callback){
    callback(rows);
};

/**
 *
 * @param rows
 * @param searchCond
 * @param callback
 * @constructor
 */
exports.PMS0820050Filter = function(rows,searchCond,callback){
    callback(rows);
};

/**
 *
 * @param rows
 * @param searchCond
 * @param callback
 * @constructor
 */
exports.PMS0810150Filter = function(rows,searchCond,callback){

};