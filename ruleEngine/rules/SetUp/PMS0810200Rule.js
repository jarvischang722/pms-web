/**
 * Created by a14020 on 2017/4/18.
 */
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
    /*
     PMS0810200 :最大的顯示順序+10
     */
    r_pms0810200_add: function (postData, session, callback) {
        var data = postData.gridDataInfo ;
        var result = new ReturnClass();
        var error = null;
        var maxNumber;
        var getMaxValue = 0;
        if (data.total > 0) {

          _.each(data.rows,function (row) {
              getMaxValue = parseInt(row.view_seq) > parseInt(getMaxValue) ? row.view_seq : getMaxValue;
          });

            maxNumber = parseInt(getMaxValue) +10;
        } else {
            maxNumber = 10;
        }
        var dataObj = {"view_seq": maxNumber};
        result.defaultValues = dataObj;
        callback(error, result);
    }
};