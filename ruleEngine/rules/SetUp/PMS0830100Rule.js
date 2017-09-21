var _ = require("underscore");
var moment = require("moment");
var async = require("async");
var path = require('path');
var appRootDir = path.dirname(require.main.filename);
var ruleRootPath = appRootDir + "/ruleEngine/";
var queryAgent = require(appRootDir + '/plugins/kplug-oracle/QueryAgent');
var commandRules = require("./../CommonRule");
var ReturnClass = require(ruleRootPath + "/returnClass");
var ErrorClass = require(ruleRootPath + "/errorClass");

module.exports = {
    qryHfdrestmnRoomcod: function (postData, callback) {
        let lo_params = {
            athena_id: postData.athena_id,
            hotel_cod: postData.hotel_cod
        };

        async.waterfall([
            qryRentCalDat,
            qryRoomCod
        ], function (err, getResult) {
            let lo_result = new ReturnClass();
            if (err) {
                console.error(err);
                lo_result.success = false;
                return callback(null, lo_result);
            }
            lo_result.selectOptions = getResult;
            callback(null, lo_result);
        });

        function qryRentCalDat(cb) {
            queryAgent.query("QRY_RENT_CAL_DAT", lo_params, function (err, getResult) {
                if (!err) {
                    cb(null, getResult.rent_cal_dat);
                }
                else {
                    cb(err, null);
                }
            });
        }

        function qryRoomCod(rent_cal_dat, cb) {
            lo_params.rent_cal_dat = moment(rent_cal_dat).format("YYYY-MM-DD");
            queryAgent.queryList("QRY_HFD_REST_MN_ROOM_COD", lo_params, 0, 0, function (err, getResult) {
                if (!err) {
                    cb(null, getResult);
                }
                else {
                    cb(err, null);
                }
            });
        }
    },

    chkHfdrestdtDaysta: function (postData, session, callback) {
        let self = this;
        let lo_result = new ReturnClass();
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod,
            day_sta: postData.rowData.day_sta
        };

        async.waterfall([
            chkDayStaOverLap,
            qryDayStaColor
        ], function(err, getResult){
            if(getResult.success){
                callback(null, lo_result);
            }
            else{
                callback(err, getResult);
            }
        });

        function chkDayStaOverLap(cb){
            self.chkDayStaOverLap(postData, session, cb);
        }

        function qryDayStaColor(chkResult, cb){
            queryAgent.query("QRY_DAY_STA_COLOR", lo_params, function (err, getResult) {
                if (!err) {
                    try {
                        var color = colorCodToHex(getResult.color_num);
                        postData.rowData.day_sta_color = "#" + color;
                    }
                    catch(ex){}
                    lo_result.effectValues = {day_sta_color: postData.rowData.day_sta_color};
                    cb(null, lo_result);
                }
            });
        }
    },

    QRY_HFD_REST_DT_SEQ_NOS: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        };

        queryAgent.query("QRY_HFD_REST_DT_SEQ_NOS", lo_params, function(err, getResult){
            let li_max_seq_nos = getResult.max_seq_nos || 0;

            _.each(postData.dt_createData, function(lo_dtCreateData){
                lo_dtCreateData.seq_nos = li_max_seq_nos;
                li_max_seq_nos++;
            });
            callback(lo_error, lo_result);
        });
    },

    chkHfdrestmnRoomcod: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let lo_error = null;
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod,
            room_cod: postData.singleRowData.room_cod
        };


        queryAgent.query("QRY_REST_MN_COUNT", lo_params, function (err, result) {
            if (result.restmncount == 0) {
                callback(null, lo_result);
            }
            else {
                lo_error = new ErrorClass();
                lo_result.success = false;
                lo_error.errorMsg = "一個房型只能有一筆";
                lo_error.errorCod = "1111";
                lo_result.effectValues = {room_cod: ""};
                callback(lo_error, lo_result);
            }
        });
    },

    chkDayStaOverLap: function(postData, session, callback){
        let ls_repeatMsg = "";
        let lo_result = new ReturnClass();
        let lo_error = null;

        _.each(postData.allRowData, function(eachRowData, index){
            if(index != postData.rowIndex && postData.editRowData.begin_dat != "" && postData.editRowData.end_dat != "" && postData.editRowData.day_sta != "") {
                let ls_eachRowBeginDat = eachRowData.begin_dat;
                let ls_eachRowEndDat = eachRowData.end_dat;
                let lb_chkBeginDat = chkDateIsBetween(ls_eachRowBeginDat, ls_eachRowEndDat, postData.editRowData.begin_dat);
                let lb_chkEndDat = chkDateIsBetween(ls_eachRowBeginDat, ls_eachRowEndDat, postData.editRowData.end_dat);
                let li_curIdx = Number(postData.rowIndex);

                if ((lb_chkBeginDat || lb_chkEndDat) && postData.editRowData.day_sta == eachRowData.day_sta) {

                    ls_repeatMsg = "第[" + (li_curIdx + 1) + "]行 開始日[" + postData.editRowData.begin_dat + "]結束日[" + postData.editRowData.begin_dat + "]假日類別[" + postData.editRowData.day_sta + "] " +
                        "與 第[" + (index + 1) + "]行 開始日["+ ls_eachRowBeginDat +"]結束日["+ ls_eachRowEndDat +"]假日類別["+ eachRowData.day_sta +"] 日期重疊";

                    lo_error = new ErrorClass();
                    lo_result.success = false;
                    lo_error.errorMsg = ls_repeatMsg;
                    lo_error.errorCod = "1111";
                    lo_result.effectValues = {day_sta: ""};
                    return false;
                }
            }
        });
        callback(lo_error, lo_result);
    }


};

function chkDateIsBetween(begin_dat, end_dat, now_dat) {
    begin_dat = new Date(begin_dat);
    end_dat = new Date(end_dat);
    now_dat = new Date(now_dat);
    return moment(now_dat).isBetween(begin_dat, end_dat);
}

//反轉成16進位
function colorCodToHex(colorCod) {
    if (_.isUndefined(colorCod)) {
        colorCod = 0;
    }
    colorCod = Number(colorCod);
    var lo_rgb = colorCodToRgb(colorCod);
    return rgbToHex(lo_rgb.r, lo_rgb.g, lo_rgb.b);
}

//反轉成RGB
function colorCodToRgb(colorCod) {
    colorCod = Number(colorCod);
    var lo_color = {r: 0, g: 0, b: 0};
    var remainder = Math.floor(colorCod % 65536);
    lo_color.b = Math.floor(colorCod / 65536);
    lo_color.g = Math.floor(remainder / 256);
    remainder = Math.floor(colorCod % 256);
    lo_color.r = remainder;
    return lo_color;

}

//RGB 轉 16進位色碼
function rgbToHex(r, g, b) {
    return (r < 16 ? "0" + r.toString(16).toUpperCase() : r.toString(16).toUpperCase()) + (g < 16 ? "0" + g.toString(16).toUpperCase() : g.toString(16).toUpperCase()) + (b < 16 ? "0" + b.toString(16).toUpperCase() : b.toString(16).toUpperCase());
}