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
            if (!err) {
                let lo_result = new ReturnClass();
                lo_result.selectOptions = getResult;
                callback(null, lo_result);
            }
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
            lo_params.rent_cal_dat = rent_cal_dat;
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
        let lo_result = new ReturnClass();
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod,
            day_sta: postData.rowData.day_sta
        };

        queryAgent.query("QRY_DAY_STA_COLOR", lo_params, function (err, getResult) {
            if (!err) {
                var color = colorTool.colorCodToHex(getResult.color_num);
                postData.rowData.day_sta_color = "#" + color;
                lo_result.effectValues = postData.rowData;
                callback(null, lo_result);
            }
        });
    },

    r_PMS0830100_save: function (postData, session, callback) {
        let lo_result = new ReturnClass();
        let li_seq_nos = 0;

        _.each(postData, function (lo_ary, key) {
            if (key == "dt_createData" || key == "dt_updateData") {
                _.each(lo_ary, function (eachAry, Idx) {
                    li_seq_nos++;
                    postData[key][Idx].seq_nos = li_seq_nos;
                });
            }
        });
        callback(null, lo_result);
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
        console.log(postData);
        let ls_repeatMsg = "";

        _.each(postData.allRowData, function(eachRowData, index){
            let ls_eachRowBeginDat = eachRowData.begin_dat;
            let ls_eachRowEndDat = eachRowData.end_dat;
            let lb_chkBeginDat = chkDateIsBetween(ls_eachRowBeginDat, ls_eachRowEndDat, postData.editRowData.begin_dat);
            let lb_chkEndDat = chkDateIsBetween(ls_eachRowBeginDat, ls_eachRowEndDat, postData.editRowData.end_dat);
            if (lb_chkBeginDat && lb_chkEndDat) {
                ls_repeatMsg = "第" + (li_curIdx + 1) + "行" + lo_beginDat.format("YYYY/MM/DD") + "~" + lo_endDat.format("YYYY/MM/DD") +
                    "與第" + (compIdx + 1) + "行" + moment(comparDT.begin_dat).format("YYYY/MM/DD") + "~" + moment(comparDT.end_dat).format("YYYY/MM/DD") + ",日期區間重疊";
                return false;
            }
        });
    }


};

function chkDateIsBetween(begin_dat, end_dat, now_dat) {
    return moment(now_dat).isBetween(begin_dat, end_dat);
}

// //反轉成16進位
// function colorCodToHex(colorCod) {
//     if (_.isUndefined(colorCod)) {
//         colorCod = 0;
//     }
//     colorCod = Number(colorCod);
//     var lo_rgb = colorCodToRgb(colorCod);
//     return rgbToHex(lo_rgb.r, lo_rgb.g, lo_rgb.b);
// }
//
// //反轉成RGB
// function colorCodToRgb(colorCod) {
//     colorCod = Number(colorCod);
//     var lo_color = {r: 0, g: 0, b: 0};
//     var remainder = Math.floor(colorCod % 65536);
//     lo_color.b = Math.floor(colorCod / 65536);
//     lo_color.g = Math.floor(remainder / 256);
//     remainder = Math.floor(colorCod % 256);
//     lo_color.r = remainder;
//     return lo_color;
//
// }
//
// //RGB 轉 16進位色碼
// function rgbToHex(r, g, b) {
//     return (r < 16 ? "0" + r.toString(16).toUpperCase() : r.toString(16).toUpperCase()) + (g < 16 ? "0" + g.toString(16).toUpperCase() : g.toString(16).toUpperCase()) + (b < 16 ? "0" + b.toString(16).toUpperCase() : b.toString(16).toUpperCase());
// }