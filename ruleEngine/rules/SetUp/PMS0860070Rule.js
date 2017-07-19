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
                if(result){
                    if(result.custmncount > 0){
                        lo_result.success = false;
                        lo_error = new ErrorClass();
                        lo_error.errorMsg = "在商務公司資料維護已使用,不可刪除";
                        lo_error.errorCod = "1111";
                    }
                }
            });
        } else {
            lo_result.success = false;
            lo_error = new ErrorClass();
            lo_error.errorMsg = "此筆設定資料為預設狀態資料，不可刪除";
            lo_error.errorCod = "1111";
        }
        callback(lo_error,lo_result);
    },
    //為了checkbox所有資料中只能預設一個或一定要一個勾選(有問題)
    chkContractstatusrfDefaultsta: function (postData, session, callback) {
        //var allGridData =$('#prg_dg').datagrid('getData');
        var allGridData =document.getElementById('prg_dg').datagrid('getData');
        var count = 0;
        var lo_result = new ReturnClass();
        var lo_error = null;
        if(allGridData) {
            $.each(allGridData.rows,function (index,item) {
                count +=1;
            });
        }

        if(count >1){
            lo_result.success = false;
            lo_error = new ErrorClass();
            lo_error.errorMsg = "預設狀態只能勾選一筆";
            lo_error.errorCod = "1111";

        }else if(count == 0){
            lo_result.success = false;
            lo_error = new ErrorClass();
            lo_error.errorMsg = "預設狀態要勾選一筆";
            lo_error.errorCod = "1111";
        }

        callback(lo_error,lo_result);
    }
};
