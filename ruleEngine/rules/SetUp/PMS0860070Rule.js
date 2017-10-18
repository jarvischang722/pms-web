/**
 * Created by a14020 on 2017/5/23.
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
    //刪除前檢查
    chk_contract_status_rf_is_exist_cust_mn: function (postData, session, callback) {
        var lo_result = new ReturnClass();
        var lo_error = null;
        var params = {
            athena_id: session.user.athena_id,
            status_cod: postData.singleRowData.status_cod
        };

        var isDeleteRow = false;

        isDeleteRow = postData.singleRowData.default_sta.trim() == "Y" ? false : true;
        if (isDeleteRow) {
            queryAgent.query("CHK_CONSTRACT_STA_IS_EXIST_CUST_MN".toUpperCase(), params, function (err, result) {
                if (result) {
                    if (result.custmncount > 0) {
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = commandRules.getMsgByCod("pms86msg1", session.locale);
                    }
                }
            });
        } else {
            lo_result.success = false;
            lo_error = new ErrorClass();
            lo_error.errorMsg = commandRules.getMsgByCod("pms86msg3", session.locale);
        }
        callback(lo_error, lo_result);
    },
    //為了checkbox所有資料中只能預設一個或一定要一個勾選(有問題)
    chkContractstatusrfDefaultsta: function (postData, session, callback) {
        //var allGridData =$('#prg_dg').datagrid('getData');
        var allGridData = postData.allRowData;
        var updateRows = [];
        var count = 0;
        var lo_result = new ReturnClass();
        var lo_error = null;
        if (postData.newValue == "Y") {
            _.each(allGridData, function (item, index) {
                if (item.default_sta == "Y") {
                    count += 1;
                }
            });
        }

        if (count > 1) {

            _.each(allGridData, function (item, index) {
                if (item.default_sta == "Y" && item.status_cod != postData.rowData.status_cod) {
                    //allGridData[index]["default_sta"]= "N";
                    item.default_sta = "N";
                    item.rowindex = index;  //SAM2017727:因不想全部資料都更新，所以要知道他第幾筆資料
                    updateRows.push(item);
                }
            });

            lo_result.success = true;
            lo_result.effectValues = updateRows;

        } else if (count == 0) {
            postData.rowData["default_sta"] = postData.oldValue;
            lo_result.effectValues = postData.rowData;
            lo_result.success = false;
            lo_error = new ErrorClass();
            lo_error.errorMsg = commandRules.getMsgByCod("pms86msg4", session.locale);
        }

        callback(lo_error, lo_result);
    }
};
