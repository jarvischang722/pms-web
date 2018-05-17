/**
 * Created by Jun Chang on 2016/12/30.
 */

const _ = require("underscore");
const roleFuncSvc = require("../services/RoleFuncService");
const roleSvc = require("../services/RoleFuncService");
const dbSvc = require("../services/DbTableService");
const uploadSvc = require("../services/uploadService");
const logSvc = require("../services/LogService");
const SysFuncPurviewSvc = require("../services/SysFuncPurviewService");
const moment = require("moment");


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
        res.redirect(`/${req.cookies.athena_id}/${req.cookies.comp_cod}/login`);
        return;
    }

    SysFuncPurviewSvc.getUserAllowSystem(req, function (err, sysList) {
        res.render('system/systemOption', {sysList});
    });

};

/**
 * 撈取可選系統
 */
exports.userAllowSystem = function (req, res) {


    SysFuncPurviewSvc.getUserAllowSystem(req, function (err, sysList) {
        res.json({success: true, sysList});
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
exports.houseKeeping = function (req, res) {
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
    res.render('subsystem/reports/index');
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

// 上傳檔案
exports.uploadFile = function (req, res) {
    uploadSvc.uploadFile(req, req.session, function (err, uploadResult) {
        res.json({success: uploadResult.success, errorMsg: err, rtnData: uploadResult.rtnData});
    });
};

/**
 * 抓取異動紀錄
 */
exports.getSetupPrgChangeLog = function (req, res) {
    logSvc.getSetupPrgChangeLog(req, function (err, allChangeLogList) {
        res.json({success: true, errorMsg: '', allChangeLogList: allChangeLogList});
    });
};

/**
 * 抓取session 結束時間
 */
exports.getSessionExpireTime = function (req, res) {
    let lo_session = req.session;
    res.json({success: true, session: lo_session, serverTime: moment()});
};

/**
 * 權限設定
 */
exports.permissionSetup = function (req, res) {
    res.render("system/permissionSetup");
};

/**
 * 執行sql 程序
 */
exports.execSQLProcess = function (req, res) {
    dbSvc.handleExecSQLProcess(req.body, req.session, function (err, success) {
        res.json({success: success, errorMsg: err});
    });
};