/**
 * Created by Jun Chang on 2016/12/30.
 */

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

/** 子系統 **/

/**
 * 訂房
 */
exports.reservation = function (req, res) {
    res.render('subsystem/reservation');
};

/**
 * 接待
 */
exports.reception = function (req, res) {
    res.render('subsystem/reception');
};

/**
 * 出納
 */
exports.cashier = function (req, res) {
    res.render('subsystem/cashier');
};

/**
 * 房務
 */
exports.housekeeping = function (req, res) {
    res.render('subsystem/housekeeping');
};

/**
 * 夜核
 */
exports.night_check = function (req, res) {
    res.render('subsystem/night_check');
};

/**
 * 業務
 */
exports.sales = function (req, res) {
    res.render('subsystem/sales/');
};

/**
 * 報表
 */
exports.report = function (req, res) {
    res.render('subsystem/report');
};

/**
 * 設定
 */
exports.setup = function (req, res) {
    res.render('subsystem/setup/index');
};

/**
 * 自訂
 */
exports.customize_setup = function (req, res) {
    res.render('subsystem/customize_setup');
};



/**
 * 取得設定模組裡所有的設定名稱
 */
exports.getGroupMdlPros =  function(req, res){
    var mdl_id = req.body.mdl_id;
    var la_locales = req.cookies.sys_locales || [];
    roleSvc.handleGroupMdlProcess(req.session.user, mdl_id,la_locales,function(err,ProsList){
        res.json({success:_.isNull(err), errorMsg:err, prosList:ProsList});
    })
};