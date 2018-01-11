/**
 * Created by a17017 on 2018/1/10.
 * select grid 欄位名稱
 */

const i18n = require("i18n");
const fs = require("fs");
const async = require('async');

exports.sel_custMnCustColumn = function (session, callback) {
    getlocaleContent(session, function(err, localContent){
        if(err){
            callback(err, null);
        }
        else{
            let lo_result = {
                columns: [
                    {
                        field: "show_cod",
                        text: localContent.program.PMS0610020.show_cod,
                        width: 100
                    },
                    {
                        field: "cust_nam",
                        text: localContent.program.PMS0610020.cust_nam,
                        width: 100
                    },
                    {
                        field: "uni_cod",
                        text: localContent.program.PMS0610020.uni_cod,
                        width: 100
                    },
                    {
                        field: "uni_title",
                        text: localContent.program.PMS0610020.uni_title,
                        width: 100
                    },
                    {
                        field: "cust_cod",
                        text: localContent.program.PMS0610020.cust_cod,
                        width: 0
                    }
                ],
                display: "cust_nam",
                value: "cust_cod"
            };
            callback(null, lo_result);
        }
    });
};

exports.sel_salesMnHotelStatusNColumn = function(session, callback){
    getlocaleContent(session, function(err, localContent){
        if(err){
            callback(err, null);
        }
        else{
            let lo_result = {
                columns: [
                    {
                        field: "sales_cod",
                        text: localContent.program.PMS0610020.sales_cod,
                        width: 100
                    },
                    {
                        field: "sales_nam",
                        text: localContent.program.PMS0610020.sales_nam,
                        width: 100
                    },
                    {
                        field: "class_nam",
                        text: localContent.program.PMS0610020.class_nam,
                        width: 100
                    }
                ],
                display: "sales_nam",
                value: "sales_cod"
            };
            callback(null, lo_result);
        }
    });
};

function getlocaleContent(session, callback) {
    var localeContent = {};
    var appRootPath = require('app-root-path').path;
    var localesPath = appRootPath + "/locales/";
    var err = null;

    try {
        fs.exists(localesPath + session.locale.toLowerCase() + ".json", function (isExist) {
            if (isExist) {
                localeContent = require(localesPath + session.locale.toLowerCase() + ".json");
            } else {
                console.error("找不到多語系對應檔案[" + localesPath + session.locale.toLowerCase() + ".json" + "]");
                localeContent = require(localesPath + "en.json");
            }
            callback(err, localeContent);
        });
    }
    catch (ex) {
        console.error(ex);
        err = ex;
        callback(err, null);
    }
}

