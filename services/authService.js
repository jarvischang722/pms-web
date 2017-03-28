/**
 * Created by Jun Chang on 2016/12/30.
 * 驗證
 */
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var async = require("async");
/**
 * 驗證登入
 */
exports.doAuthAccount = function (authData, callback) {
    var self = this;
    try {
        var params = {

            cmp_id: authData.comp_id || "",
            user_id: authData.username || "",
            usr_pwd: authData.passwd || "",

        };
        async.waterfall([
            function(cb){
                queryAgent.query("QRY_TRAN_S99_USER_PWD", params, function (err, data) {
                    cb(err, data.usr_pwd);
                })
            },
            function (usr_pwd,cb) {
                params["usr_pwd"] = usr_pwd;
                queryAgent.query("QRY_BAC_GET_USER_BY_ONE", params, function (err, user) {
                    cb(err, user);
                })
            }
        ], function (err, user) {
            if (err || !user) {
                callback(err, "5555", null);
            } else {
                self.getUserHotels(user, function (err, hotels) {
                    user.hotels = hotels;
                    user.fun_hotel_cod = hotels.length > 0 ? hotels[0].hotel_cod.trim() : "";
                    user.fun_hotel_name = hotels.length > 0 ? hotels[0].hotel_nam.trim() : "";
                    user.athena_id = hotels.length > 0 ? hotels[0].athena_id : "";
                    callback(null, "", user);
                });

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
    queryAgent.queryList("QUY_ROLE_USER_USE_HOTELS", {user_id: user.usr_id.trim(),user_athena_id:user.user_athena_id}, 0, 0, function (err, hotels) {

        if (err) {
            hotels = [];
        }

        callback(err, hotels);
    })
};