/**
 * Created by Jun Chang on 2016/12/30.
 * 驗證
 */
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var mongoAgent = require("../plugins/mongodb");
var async = require("async");
var _ = require('underscore');
var moment = require('moment');
/**
 * 驗證登入
 */
exports.doAuthAccount = function (authData, callback) {
    var self = this;
    try {
        var params = {

            cmp_id: authData.comp_id || "",
            user_id: authData.username || "",
            usr_pwd: authData.passwd || ""

        };
        async.waterfall([
            function (cb) {
                queryAgent.query("QRY_TRAN_S99_USER_PWD", params, function (err, data) {
                    cb(err, data.usr_pwd);
                });
            },
            function (usr_pwd, cb) {
                params["usr_pwd"] = usr_pwd;
                queryAgent.query("QRY_BAC_GET_USER_BY_ONE", params, function (err, user) {
                    if (!user) {
                        err = {message: "密碼錯誤"};
                    }
                    cb(err, user);
                });
            },
            //取得使用者館別資訊
            function (user, cb) {
                self.getUserHotels(user, function (err, hotels) {
                    user.hotels = hotels;
                    user.hotel_cod = hotels.length > 0 ? hotels[0].hotel_cod.trim() : "";
                    user.fun_hotel_cod = hotels.length > 0 ? hotels[0].hotel_cod.trim() : "";
                    user.fun_hotel_name = hotels.length > 0 ? hotels[0].hotel_nam.trim() : "";
                    user.athena_id = hotels.length > 0 ? hotels[0].athena_id : "";
                    cb(err, user);
                });
            },
            //取得人數上限
            function (user, cb) {
                user.onlineUserBy = {};
                queryAgent.queryList("QRY_AVAIL_USER_NUM", {athena_id: user.athena_id}, 0, 0, function (err, result) {
                    if (err) {
                        cb(err, null);
                    }
                    else if (result.length == 0) {
                        err = {message: "無此權限"};
                        cb(err, null);
                    }
                    else {
                        //人數控管到athena_id
                        if (result.length == 1) {
                            user.onlineUserBy.athena_id = result[0].athena_id;
                            user.onlineUserBy.comp_cod = _.isNull(result[0].comp_cod) ?
                                "" : result[0].comp_cod.trim();
                            user.onlineUserBy.hotel_cod = _.isNull(result[0].hotel_cod) ?
                                "" : result[0].hotel_cod.trim();
                            user.onlineUserBy.availUserNum = Number(result[0].concurrent_user);
                            cb(err, user);
                        }
                        //人數控管到comp_cod、hotel_cod
                        else {
                            _.each(result, function (lo_result, idx) {
                                result[idx].comp_cod = _.isNull(lo_result.comp_cod) ? "" : lo_result.comp_cod.trim();
                                result[idx].hotel_cod = _.isNull(lo_result.hotel_cod) ? "" : lo_result.hotel_cod.trim();
                            });
                            let lo_userNumField = _.findIndex(result, {hotel_cod: user.hotel_cod});
                            //人數控管到hotel_cod
                            if (lo_userNumField > -1) {
                                user.onlineUserBy.athena_id = result[lo_userNumField].athena_id;
                                user.onlineUserBy.comp_cod = result[lo_userNumField].comp_cod;
                                user.onlineUserBy.hotel_cod = result[lo_userNumField].hotel_cod;
                                user.onlineUserBy.availUserNum = Number(result[lo_userNumField].concurrent_user);
                                cb(err, user);
                            }
                            //人數控管到comp_cod
                            else {
                                lo_userNumField = _.findIndex(result, {comp_cod: params.cmp_id});
                                if (lo_userNumField > -1) {
                                    user.onlineUserBy.athena_id = result[lo_userNumField].athena_id;
                                    user.onlineUserBy.comp_cod = _.isNull(result[lo_userNumField].comp_cod) ?
                                        "" : result[lo_userNumField].comp_cod;
                                    user.onlineUserBy.hotel_cod = result[lo_userNumField].hotel_cod;
                                    user.onlineUserBy.availUserNum = Number(result[lo_userNumField].concurrent_user);
                                    cb(err, user);
                                }
                                else {
                                    err = {message: "無此公司別"};
                                    cb(err, null);
                                }
                            }

                        }
                    }
                });
            },
            //insert 到mongo
            function (user, cb) {
                mongoAgent.OnlineUser.findOne(user.onlineUserBy, function (err, result) {
                    if (err) {
                        err.message = "mongo 's err";
                        cb(err, user);
                    }
                    //mongo沒有這筆資料則新增一筆
                    else if (!result) {
                        let lo_saveData = {
                            athena_id: user.onlineUserBy.athena_id,
                            comp_cod: user.onlineUserBy.comp_cod,
                            hotel_cod: user.onlineUserBy.hotel_cod,
                            onlineUserSession: [],
                            availUserNum: user.onlineUserBy.availUserNum,
                            lastUpdTime: moment(new Date())
                        };
                        mongoAgent.OnlineUser(lo_saveData).save(function (errSave) {
                            if (errSave) {
                                errSave.message = "mongo 's err";
                            }
                            cb(errSave, user);
                        });
                    }
                    //mongo有這筆資料則更新availUserNum
                    else {
                        var lo_lastUpdTime = moment(new Date(moment(new Date(result.lastUpdTime)).toString()));
                        var ls_today = moment(new Date());
                        var ln_duration = moment.duration(lo_lastUpdTime.diff(ls_today));

                        let lo_cond = {
                            "athena_id": user.onlineUserBy.athena_id,
                            "comp_cod": user.onlineUserBy.comp_cod,
                            "hotel_cod": user.onlineUserBy.hotel_cod
                        };
                        //lastUpdTime 超過今天一天就更新mongo中的availUserNum、lastUpdTime
                        if (Math.abs(Number(ln_duration.asDays())) > 1) {
                            mongoAgent.OnlineUser.update(lo_cond, {
                                availUserNum: user.onlineUserBy.availUserNum,
                                lastUpdTime: moment(new Date())
                            }, function (errUpdate) {
                                if (errUpdate) {
                                    errUpdate.message = "mongo 's err";
                                }
                                cb(errUpdate, user);
                            });
                        }
                        else {
                            cb(err, user);
                        }
                    }
                });
            }
        ], function (err, user) {
            if (err) {
                callback(err, "5555", null);
            }
            else {
                callback(null, "", user);
            }
        });
    } catch (err) {
        console.error(err);
        callback(err, "5555", null);
    }

};


/**
 * 獲取使用者可使用的公司別
 * @param user {Object}
 * @param  callback {Function} (hotels)
 */
exports.getUserHotels = function (user, callback) {
    queryAgent.queryList("QUY_ROLE_USER_USE_HOTELS", {
        user_id: user.usr_id.trim(),
        user_athena_id: user.user_athena_id
    }, 0, 0, function (err, hotels) {

        if (err) {
            hotels = [];
        }

        callback(err, hotels);
    });
};