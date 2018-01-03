/**
 * Created by Jun Chang on 2016/12/30.
 * 驗證
 */
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var mongoAgent = require("../plugins/mongodb");
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
                    cb(err, user);
                });
            }
        ], function (err, user) {
            if (err || !user) {
                callback(err, "5555", null);
            } else {
                self.getUserHotels(user, function (err, hotels) {
                    user.hotels = hotels;
                    user.hotel_cod = hotels.length > 0 ? hotels[0].hotel_cod.trim() : "";
                    user.fun_hotel_cod = hotels.length > 0 ? hotels[0].hotel_cod.trim() : "";
                    user.fun_hotel_name = hotels.length > 0 ? hotels[0].hotel_nam.trim() : "";
                    user.athena_id = hotels.length > 0 ? hotels[0].athena_id : "";
                    //取得人數上限
                    /**
                     * 測試
                     */
                    // user.onlineUserBy = {};
                    // user.onlineUserBy.athena_id = user.athena_id;
                    // user.onlineUserBy.comp_cod = params.cmp_id.trim();
                    // user.onlineUserBy.hotel_cod = user.hotel_cod;
                    // user.onlineUserBy.availUserNum = 2;
                    // mongoAgent.OnlineUser.findOne(user.onlineUserBy, function (err, result) {
                    //     if (!result) {
                    //         let lo_saveData = {
                    //             athena_id: user.onlineUserBy.athena_id,
                    //             comp_cod: user.onlineUserBy.comp_cod,
                    //             hotel_cod: user.onlineUserBy.hotel_cod,
                    //             onlineUserSession: [],
                    //             availUserNum: user.onlineUserBy.availUserNum,
                    //             lastUpdTime: new Date()
                    //         };
                    //         mongoAgent.OnlineUser(lo_saveData).save(function (err) {
                    //             if (err) {
                    //                 callback(err, "1111", null);
                    //             }
                    //             else {
                    //                 callback(null, "", user);
                    //             }
                    //         });
                    //     }
                    //     else {
                    //         let lo_cond = {
                    //             "athena_id": user.onlineUserBy.athena_id,
                    //             "comp_cod": user.onlineUserBy.comp_cod,
                    //             "hotel_cod": user.onlineUserBy.hotel_cod
                    //         };
                    //         mongoAgent.OnlineUser.update(lo_cond, {availUserNum: user.onlineUserBy.availUserNum}, function (err) {
                    //             if (err) {
                    //                 callback(err, "1111", null);
                    //             }
                    //             else {
                    //                 callback(null, "", user);
                    //             }
                    //         });
                    //     }
                    // });

                    /**
                     * 正式
                     */
                    // queryAgent.queryList("QRY_AVAIL_USER_NUM", {athena_id: user.athena_id}, 0, 0, function(err, result){
                    //     if(err){
                    //         callback(err, "555", null);
                    //     }
                    //     else{
                    //         //上線人數以集團為主
                    //         if(result.length == 1){
                    //             user.onlineUserBy.athena_id = result[0].athena_id;
                    //             user.onlineUserBy.comp_cod = result[0].comp_cod;
                    //             user.onlineUserBy.hotel_cod = result[0].hotel_cod;
                    //             user.onlineUserBy.availUserNum = result[0].current_user;
                    //         }
                    //         else{
                    //             // let lo_userNumField =  _.findIndex(result, {hotel_cod: user.hotel_cod});
                    //             // //上線人數以館別為主
                    //             // if(lo_userNumField > -1){
                    //             //     user.onlineUserBy.athena_id = result[lo_userNumField].athena_id;
                    //             //     user.onlineUserBy.comp_cod = result[lo_userNumField].comp_cod;
                    //             //     user.onlineUserBy.hotel_cod = result[lo_userNumField].hotel_cod;
                    //             //     user.onlineUserBy.availUserNum = result[lo_userNumField].current_user;
                    //             // }
                    //             // //上線人數以公司別為主
                    //             // else{
                    //             //     lo_userNumField = _.findIndex(result, {comp_cod: params.cmp_id});
                    //             //     user.onlineUserBy.athena_id = result[lo_userNumField].athena_id;
                    //             //     user.onlineUserBy.comp_cod = result[lo_userNumField].comp_cod;
                    //             //     user.onlineUserBy.hotel_cod = result[lo_userNumField].hotel_cod;
                    //             //     user.onlineUserBy.availUserNum = result[lo_userNumField].current_user;
                    //             // }
                    //
                    //             user.onlineUserBy.athena_id = user.athena_id;
                    //             user.onlineUserBy.comp_cod = params.cmp_id;
                    //             user.onlineUserBy.hotel_cod = user.hotel_cod;
                    //             user.onlineUserBy.availUserNum = 2;
                    //         }
                    //         //insert 到 mongo裡面
                    //         mongoAgent.OnlineUser.findOne(user.onlineUserBy, function(result){
                    //             if(!result){
                    //                 let lo_saveData = {
                    //                     athena_id: user.onlineUserBy.athena_id,
                    //                     comp_cod: user.onlineUserBy.comp_cod,
                    //                     hotel_cod: user.onlineUserBy.hotel_cod,
                    //                     onlineUserSession: [],
                    //                     availUserNum: user.onlineUserBy.availUserNum,
                    //                     lastUpdTime: new Date()
                    //                 };
                    //                 mongoAgent.OnlineUser(lo_saveData).save(function (err) {
                    //                     if (err) {
                    //                         callback(err, "1111", null);
                    //                     }
                    //                     else{
                    //                         callback(null, "", user);
                    //                     }
                    //                 });
                    //             }
                    //             else{
                    //                 let lo_cond = {
                    //                     "athena_id": user.onlineUserBy.athena_id,
                    //                     "comp_cod": user.onlineUserBy.comp_cod,
                    //                     "hotel_cod": user.onlineUserBy.hotel_cod
                    //                 };
                    //                 mongoAgent.OnlineUser.update(lo_cond, {availUserNum: user.onlineUserBy.availUserNum}, function (err) {
                    //                     if (err) {
                    //                         callback(err, "1111", null);
                    //                     }
                    //                     else{
                    //                         callback(null, "", user);
                    //                     }
                    //                 });
                    //             }
                    //         });
                    //     }
                    // });
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