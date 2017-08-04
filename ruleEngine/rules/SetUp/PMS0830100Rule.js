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