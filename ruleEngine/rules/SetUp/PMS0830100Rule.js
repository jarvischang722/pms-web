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

    qryHfdrestmnRoomcod: function(postData, session, callback){
        let lo_params = {
            athena_id: session.user.athena_id,
            hotel_cod: session.user.hotel_cod
        };
        async.waterfall([
            qryRentCalDat,
            qryRoomCod
        ], function(err, getResult){

        });

        function qryRentCalDat(cb){
            queryAgent.query("QRY_RENT_CAL_DAT", lo_params, function(err, getResult){
                if(!err){
                    cb(null, getResult.rent_cal_dat);
                }
                else{
                    cb(err, null);
                }
            });
        }

        function qryRoomCod(rent_cal_dat, cb){

        }
    }


};