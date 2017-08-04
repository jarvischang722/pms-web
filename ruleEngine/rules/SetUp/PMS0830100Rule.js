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
                var color = colorCodToHex(getResult.color_num);
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
    }


};

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