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
                        title: localContent.program.PMS0610020.show_cod,
                        width: 100
                    },
                    {
                        field: "cust_nam",
                        title: localContent.program.PMS0610020.cust_nam,
                        width: 100
                    },
                    {
                        field: "uni_cod",
                        title: localContent.program.PMS0610020.uni_cod,
                        width: 100
                    },
                    {
                        field: "uni_title",
                        title: localContent.program.PMS0610020.uni_title,
                        width: 100
                    },
                    {
                        field: "cust_cod",
                        title: localContent.program.PMS0610020.cust_cod,
                        width: 0,
                        hidden: true
                    },
                    {
                        field: "cust_dispalay",
                        title: localContent.program.PMS0610020.cust_cod,
                        width: 0,
                        hidden: true
                    }
                ],
                display: "cust_display",
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
                        title: localContent.program.PMS0610020.sales_cod,
                        width: 100
                    },
                    {
                        field: "sales_nam",
                        title: localContent.program.PMS0610020.sales_nam,
                        width: 100
                    },
                    {
                        field: "class_nam",
                        title: localContent.program.PMS0610020.class_nam,
                        width: 100
                    },
                    {
                        field: "sales_display",
                        title: localContent.program.PMS0610020.class_nam,
                        width: 100,
                        hidden: true
                    }
                ],
                display: "sales_display",
                value: "sales_cod"
            };
            callback(null, lo_result);
        }
    });
};

exports.sel_alt_nam = function(session, callback){
    getlocaleContent(session, function(err, localContent){
        if(err){
            callback(err, null);
        }
        else{
            let lo_result = {
                columns: [
                    {
                        field: "show_cod",
                        title: localContent.program.RS0W212010.show_cod,
                        width: 100
                    },
                    {
                        field: "alt_nam",
                        title: localContent.program.RS0W212010.alt_nam,
                        width: 100
                    },
                    {
                        field: "contact_rmk",
                        title: localContent.program.RS0W212010.contact_rmk,
                        width: 100
                    },
                    {
                        field: "first_nam",
                        title: localContent.program.RS0W212010.first_nam,
                        width: 100
                    },
                    {
                        field: "last_nam",
                        title: localContent.program.RS0W212010.last_nam,
                        width: 100
                    },
                    {
                        field: "cust_typ",
                        title: localContent.program.RS0W212010.cust_typ,
                        width: 100
                    },
                    {
                        field: "cust_sta",
                        title: localContent.program.RS0W212010.cust_sta,
                        width: 100
                    },
                    {
                        field: "cust_cod",
                        title: localContent.program.RS0W212010.cust_cod,
                        width: 0,
                        hidden: true
                    }
                ],
                display: "alt_nam",
                value: "alt_nam"
            };
            callback(null, lo_result);
        }
    });
};

exports.sel_atten_nam = function(session, callback){
    getlocaleContent(session, function(err, localContent){
        if(err){
            callback(err, null);
        }
        else{
            let lo_result = {
                columns: [
                    {
                        field: "atten_nam",
                        title: localContent.program.RS0W212010.atten_nam,
                        width: 100
                    },
                    {
                        field: "role_rmk",
                        title: localContent.program.RS0W212010.role_rmk,
                        width: 100
                    },
                    {
                        field: "tel_nos",
                        title: localContent.program.RS0W212010.tel_nos,
                        width: 100
                    }
                ],
                display: "atten_nam",
                value: "atten_nam"
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

