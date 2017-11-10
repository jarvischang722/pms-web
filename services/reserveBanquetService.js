/**
 * Created by kaiyue on 2017/11/08.
 */
let _ = require("underscore");
let fs = require('fs');
let moment = require("moment");
let async = require("async");
let queryAgent = require('../plugins/kplug-oracle/QueryAgent');
let path = require('path');
let appRootDir = path.dirname(require.main.filename);
let ruleRootPath = appRootDir + "/ruleEngine/";
let ReturnClass = require(ruleRootPath + "/returnClass");
let ErrorClass = require(ruleRootPath + "/errorClass");

//[RS00202010] 取格萊天漾查詢頁資料
exports.qryPageOneData = function (postData, session, callback) {
    let lo_error = null;
    let lo_result = new ReturnClass();
    let lo_params = {
        use_dat: "2005/11/06"
    };

    async.parallel([
        qryBanquetData,     // 查訂席平面圖資料
        qryBanquetSta       // 查訂席場地狀態
    ], function(err, result){
        var la_banquetData = result[0];
        var la_banquetSta = result[1];
        convertDataToDisplay(la_banquetData, la_banquetSta);
        lo_result.defaultValues = la_banquetData;
        callback(lo_error, lo_result);
    });

    function qryBanquetData(cb){
        fs.readFile("./public/jsonData/reserveBanquet/banquetData.json", "utf8", function (err, data) {
            data = JSON.parse(data);
            cb(null, data);
        });
    }

    function qryBanquetSta(cb){
        queryAgent.queryList("QRY_RESV_ORDER_STA", lo_params, 0, 0, function(err,result){
            cb(null, result);
        });
    }

};

//[RS00202010] 將資料轉換為顯示用格式
function convertDataToDisplay(la_data, la_sta) {
    let lo_resvBanquetData = new ResvBanquetData(la_data, la_sta);
    lo_resvBanquetData.convertExec();
    return la_data;
}

class ResvBanquetData {
    constructor(la_data, la_sta) {
        this.lo_beg_hour = _.findWhere(la_data, {datatype: "BEG_HOUR"});
        this.lo_end_hour = _.findWhere(la_data, {datatype: "END_HOUR"});
        this.la_rspt = _.where(la_data, {datatype: "RSPT"});
        this.la_place = _.where(la_data, {datatype: "PLACE"});
        this.la_mtime = _.where(la_data, {datatype: "MTIME"});
    }

    convertExec() {
        let la_rtnData = {};

    }
}

