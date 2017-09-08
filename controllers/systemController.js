/**
 * Created by Jun Chang on 2016/12/30.
 */

var _ = require("underscore");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var roleFuncSvc = require("../services/RoleFuncService");
var fs = require("fs");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var roleSvc = require("../services/RoleFuncService");
var dbSvc = require("../services/DbTableService");
var langSvc = require("../services/LangService");
var uploadSvc = require("../services/uploadService");
var logSvc = require("../services/LogService");
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
    var la_locales = _.pluck(req.cookies.sys_locales, "lang");
    queryAgent.queryList("QUY_ROLE_USER_USE_SYSTEM", params, 0, 0, function (err, sysRows) {
        langSvc.handleMultiLangContentByField("lang_s99_system", 'sys_name', '', function (err, sysLang) {
            _.each(sysRows, function (sys, sIdx) {
                var allLangForSys = _.where(sysLang, {sys_id: sys.sys_id});
                _.each(la_locales, function (locale) {
                    var sys_name = "";
                    var tmp = _.findWhere(allLangForSys, {locale: locale});
                    if (!_.isUndefined(tmp)) {
                        sys_name = tmp.words;
                    }
                    sysRows[sIdx]["sys_name_" + locale] = sys_name;
                });

            });
            res.render('system/systemOption', {sysList: sysRows});
        });

    });

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
    req.session.user["hotel_cod"] = hotelInfo.hotel_cod.trim();
    req.session.user["fun_hotel_cod"] = hotelInfo.hotel_cod.trim();
    req.session.user["fun_hotel_name"] = hotelInfo.hotel_nam.trim();
    req.session.user["athena_id"] = hotelInfo.athena_id;
    roleFuncSvc.updateUserPurview(req, function (err) {
        res.json({success: err == null, errorMsg: err});
    });

};

/** 子系統 **/

/**
 * 訂房
 */
exports.reservation = function (req, res) {
    res.render('subsystem/reservation/index');
};

/**
 * 接待
 */
exports.reception = function (req, res) {
    res.render('subsystem/reception/index');
};

/**
 * 出納
 */
exports.cashier = function (req, res) {
    res.render('subsystem/cashier/index');
};

/**
 * 房務
 */
exports.housekeeping = function (req, res) {
    res.render('subsystem/houseKeeping/index');
};

/**
 * 夜核
 */
exports.night_check = function (req, res) {
    res.render('subsystem/nightAudit/index');
};

/**
 * 業務
 */
exports.sales = function (req, res) {
    res.render('subsystem/sales/index');
};

/**
 * 報表
 */
exports.report = function (req, res) {
    res.render('subsystem/report/index');
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
exports.ownMenu = function (req, res) {
    res.render('subsystem/ownMenu');
};

/**
 * 共用
 */
exports.commom = function (req, res) {
    res.render('subsystem/commom/index');
};

/**
 * 取得設定模組裡所有的設定名稱
 */
exports.getGroupMdlPros = function (req, res) {
    var mdl_id = req.body.mdl_id;
    var la_locales = req.cookies.sys_locales || [];
    roleSvc.handleGroupMdlProcess(req.session.user, mdl_id, la_locales, function (err, ProsList) {
        res.json({success: _.isNull(err), errorMsg: err, prosList: ProsList});
    });
};

/**
 * 執行sql 程序
 */
exports.execSQLProcess = function (req, res) {
    dbSvc.handleExecSQLProcess(req.body, req.session, function (err, success) {
        res.json({success: success, errorMsg: err});
    });
};

// 上傳檔案
exports.uploadFile = function (req, res) {
    uploadSvc.uploadFile(req, req.session, function (err, uploadResult) {
        res.json({success: uploadResult.success, errorMsg: err, rtnData: uploadResult.rtnData});
    });
};

/**
 * 抓取異動紀錄
 * @param req
 * @param res
 */
exports.getSetupPrgChangeLog = function (req, res) {
    logSvc.getSetupPrgChangeLog(req, function (err, allChangeLogList) {
        res.json({success: false, errorMsg: '', allChangeLogList: allChangeLogList});
    })
};