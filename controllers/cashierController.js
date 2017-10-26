let _ = require("underscore");
let queryAgent = require('../plugins/kplug-oracle/QueryAgent');
let roleFuncSvc = require("../services/RoleFuncService");
let fs = require("fs");
let path = require('path');
let async = require("async");
let appRootDir = path.dirname(require.main.filename);
let roleSvc = require("../services/RoleFuncService");
let commonTools = require("../utils/CommonTools");
let dbTableSvc = require("../services/DbTableService");
/**
 * 外幣匯兌(靜態)
 */
exports.getPMS0320010 = function (req, res) {
    res.render("subsystem/cashier/PMS0320010");
};
/**
 * 住客帳維護(靜態)
 */
exports.getPMS0310010 = function (req, res) {
    res.render("subsystem/cashier/PMS0310010");
};

/**
 * 出鈉-已結帳處理(靜態)
 */
exports.getPMS0310030 = function (req, res) {
    res.render("subsystem/cashier/PMS0310030");
};

/**
 * 取得收入小分類
 */
exports.getStypeRf = function (req, res) {
    queryAgent.queryList("QRY_STYPE_RF", {
        athena_id: req.session.user.athena_id,
        hotel_cod: req.session.user.hotel_cod
    }, 0, 0, function (err, stypeList) {
        res.json({success: true, stypeList: stypeList});
    });

};

/**
 * 取得收入小分類
 */
exports.getRouteDtByRouteCod = function (req, res) {
    queryAgent.queryList("QRY_ROUTE_DT_BY_ROUTE_COD", {
        athena_id: req.session.user.athena_id,
        hotel_cod: req.session.user.hotel_cod,
        route_cod: req.body.route_cod
    }, 0, 0, function (err, routeDtList) {
        res.json({success: true, routeDtList: commonTools.trimObjectAllVal(routeDtList)});
    });
};

/**
 * PMS0830080 分帳規則儲存
 */
exports.doSavePMS0830080 = function (req, res) {
    dbTableSvc.doSavePMS0830080(req.session, req.body, function (errorMsg, success) {
        res.json({success: success, errorMsg: errorMsg});
    });
};

/**
 * PMS0830070 虛擬帳單項目設定
 */
exports.doSavePMS0830070 = function (req, res) {
    dbTableSvc.doSavePMS0830070(req.session, req.body, function (errorMsg, success) {
        res.json({success: success, errorMsg: errorMsg});
    });
};

/**
 * 取得虛擬帳單項目設定 單筆資料
 */
exports.qryPMS0830070SingleData = function(req, res){
    var lo_params = {
        athena_id: req.session.user.athena_id,
        hotel_cod: req.session.user.hotel_cod,
        adjfolio_cod: req.body.adjfolio_cod
    };

    async.parallel([
        function(cb){
            queryAgent.query("QRY_SINGLE_HC_ADJFOLIO_MN".toUpperCase(), lo_params, function (err, mnData) {
                cb(null, mnData);
            });
        },
        function(cb){
            queryAgent.queryList("QRY_HC_ADJFOLIO_DT", lo_params, 0, 0, function (err, dtData) {
                cb(null, dtData);
            });
        }
    ], function(err, result){
        res.json({success: true, mnData: result[0], dtData: result[1]});
    });



};

/**
 * 取得虛擬帳單項目設定>單筆
 */
// exports.qryPMS0830070SingleMn = function (req, res) {
//     var params = {
//         athena_id: req.session.user.athena_id,
//         hotel_cod: req.session.user.hotel_cod,
//         adjfolio_cod: req.body.adjfolio_cod.trim()
//     };
//     queryAgent.query("QRY_SINGLE_HC_ADJFOLIO_MN".toUpperCase(), params, function (err, routeDt) {
//         res.json({success: true, routeDt: routeDt});
//     });
// };

/**
 * 取得虛擬帳單項目設定>單筆>DT
 */
// exports.qryPMS0830070SingleDt = function (req, res) {
//
//     queryAgent.queryList("QRY_HC_ADJFOLIO_DT", {
//         athena_id: req.session.user.athena_id,
//         hotel_cod: req.session.user.hotel_cod,
//         adjfolio_cod: req.body.adjfolio_cod
//     }, 0, 0, function (err, routeDtList) {
//         res.json({success: true, routeDtList: commonTools.trimObjectAllVal(routeDtList)});
//     });
// };

/**
 * 取得虛擬帳單項目設定>單筆>DT2
 */
exports.qryPMS0830070SingleDt2 = function (req, res) {
    let lo_userInfo = req.session.user;
    let lo_params = {
        athena_id: lo_userInfo.athena_id,
        hotel_cod: lo_userInfo.hotel_cod,
        seq_nos: req.body.seq_nos,
        adjfolio_cod: req.body.adjfolio_cod
    };

    queryAgent.queryList("QRY_HC_ADJFOLIO_DT2", lo_params, 0, 0, function (err, routeDtList) {
        res.json({success: true, dt2Data: commonTools.trimObjectAllVal(routeDtList)});
    });
};

/*
* 取得虛擬帳單項目設定>單筆>DT2(全部資料)
*/
exports.qryPMS0830070SingleAllDt2 = function (req, res) {

    let lo_userInfo = req.session.user;
    let lo_params = {
        athena_id: lo_userInfo.athena_id,
        hotel_cod: lo_userInfo.hotel_cod,
        adjfolio_cod: req.body.adjfolio_cod
    };

    queryAgent.queryList("QRY_HC_ADJFOLIO_ALL_DT2", lo_params, 0, 0, function (err, dt2Data) {
        res.json({success: true, dt2Data: commonTools.trimObjectAllVal(dt2Data)});
    });
};

/**
 * 取得虛擬帳單項目設定>單筆>DT
 */
exports.qryPMS0830070SingleDt4Dt = function (req, res) {

    queryAgent.queryList("QRY_HC_ADJFOLIO_DT2_ITEM_NOS", {
        athena_id: req.session.user.athena_id,
        hotel_cod: req.session.user.hotel_cod
    }, 0, 0, function (err, routeDtList) {
        res.json({success: true, routeDtList: commonTools.trimObjectAllVal(routeDtList)});
    });
};