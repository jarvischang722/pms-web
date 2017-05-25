
var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/roleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/roleFuncService");
/**
 * 首頁
 */
exports.index = function (req, res) {
    res.render("mainIndex");
};

/**
 * 系統別選擇
 */
exports.systemOption = function (req, res) {

    if (_.isUndefined(req.session.user) || _.isNull(req.session.user)) {
        res.redirect("/login");
        return;
    }

    var params = {
        user_comp_cod: req.session.user.cmp_id.trim(),
        user_id: req.session.user.usr_id,
        fun_comp_cod: req.session.user.cmp_id.trim(),
        fun_hotel_cod: req.session.user.fun_hotel_cod
    };

    queryAgent.queryList("QUY_ROLE_USER_USE_SYSTEM", params, 0, 0, function (err, sysRows) {
        res.render('system/systemOption', {sysList: sysRows});
    })

};

/**
 * 換館別
 */
exports.changeHotelCod = function (req, res) {
    var hotel_cod = req.body["hotel_cod"].trim();
    var hotelInfo = {};
    _.each(req.session.user.hotels, function (hotel) {
        if (hotel.hotel_cod.trim() == hotel_cod) {
            hotelInfo = hotel;
        }
    });
    req.session.user["fun_hotel_cod"] = hotelInfo.hotel_cod;
    req.session.user["fun_hotel_name"] = hotelInfo.hotel_nam;
    req.session.user["athena_id"] = hotelInfo.athena_id;
    roleFuncSvc.updateUserPurview(req, function (err) {
        res.json({success: err == null, errorMsg: err});
    })

};


//商務公司資料編輯
exports.getPMS0610010 = function (req, res) {
    res.render("subsystem/sales/PMS0610010");
};
//業務員資料編輯(業務→業務員設定作業→業務員資料維護)
exports.getPMS0620010 = function (req, res) {
    res.render("subsystem/sales/PMS0620010");
};

//業務 拜訪計畫
exports.getPMS0620040 = function (req, res) {
    res.render("subsystem/sales/PMS0620040");
};

//業務 拜訪計畫
exports.getPMS0620050 = function (req, res) {
    res.render("subsystem/sales/PMS0620050");
};
