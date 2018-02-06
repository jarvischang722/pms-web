/**
 * Created by user on 2017/4/11.
 */
const request = require("request");
const mongoAgent = require("../plugins/mongodb");
const queryAgent = require('../plugins/kplug-oracle/QueryAgent');
const async = require("async");
const mailSvc = require("../services/MailService");
const sysConf = require("../configs/systemConfig");
const fs = require('fs');
const path = require('path');
const _ = require('underscore');

exports.monitor = function (req, res) {
    async.parallel([
        function (callback) {
            mongoAgent.TemplateRf.count().exec(function (err, count) {
                callback(err, count);
            });
        },
        function (callback) {
            queryAgent.query("QRY_CONN_SESSION", {}, function (err, session) {
                callback(err, session);
            });
        },
        function (callback) {
            request.get({url: "http://localhost:8888/login", timeout: 20000}, function (err, response, body) {
                callback(err, body);
            });

        }
    ], function (err, results) {
        if (err) {
            var mailObj = {
                exceptionType: "monitor",
                errorMsg: err
            };
            mailSvc.sendExceptionMail(mailObj);
            return res.send(err);
        }

        res.send("success");
    });

};

exports.checkServer = function (req, res) {
    let go_sysConf = {};
    let go_dbConf = {};
    let gas_outputMsg = [];
    try {
        async.series([
            function (cb) {
                let ls_dbPath = path.resolve(__dirname, "../configs/database.js");
                gas_outputMsg.push(`<br><b>資料庫設定檔位置</b> : ${ls_dbPath} `);
                fs.exists(ls_dbPath, (exists) => {
                    if (exists) {
                        go_dbConf = require(ls_dbPath);
                        let ls_dbConfOutput = [];
                        ls_dbConfOutput.push("MongoDB 設定  : <br> ======= ");
                        ls_dbConfOutput.push(`host: ${go_dbConf.mongo.host}`);
                        ls_dbConfOutput.push(`port: ${go_dbConf.mongo.port}`);
                        ls_dbConfOutput.push(`dbname: ${go_dbConf.mongo.dbname}`);
                        ls_dbConfOutput.push(`host: ${go_dbConf.mongo.host}`);

                        ls_dbConfOutput.push("OracleDB 設定  : <br> ======= ");
                        _.each(go_dbConf.oracle, function (dbData, idx) {
                            ls_dbConfOutput.push(`No: ${idx + 1}`);
                            ls_dbConfOutput.push(`id: ${dbData.id}`);
                            ls_dbConfOutput.push(`connectString: ${dbData.connectString}`);
                            ls_dbConfOutput.push(`user: ${dbData.user}`);
                            ls_dbConfOutput.push(`months: ${dbData.months}`);
                        });

                        gas_outputMsg.push(`<br><b>資料庫設定檔</b>:<br> ${ls_dbConfOutput.join("<br>")}`);
                        cb(null, go_dbConf);
                    } else {
                        gas_outputMsg.push(`<span style="color: red;">Database config not found. </span>`);
                        cb(null);
                    }
                });
            },
            function (cb) {
                let ls_sysConfPath = path.resolve(__dirname, "../configs/systemConfig.js");
                gas_outputMsg.push(`<br><b>系統設定檔位置</b> : ${ls_sysConfPath} `);
                fs.exists(ls_sysConfPath, (exists) => {
                    if (exists) {
                        go_sysConf = require(ls_sysConfPath);
                        let ls_sysConfOutput = [];
                        ls_sysConfOutput.push(`<b>common_api_url</b> : ${go_sysConf.api_url}`);
                        ls_sysConfOutput.push(`<b>java_api_url</b>: ${go_sysConf.java_api_url || ""}`);
                        ls_sysConfOutput.push(`<b>dotnet_api_url</b> : ${go_sysConf.dotnet_api_url || "" }`);
                        gas_outputMsg.push(`<br><b>系統設定檔</b>:<br> ${ls_sysConfOutput.join("<br>")}`);
                        cb(null, go_sysConf);
                    } else {
                        gas_outputMsg.push(`<span style="color: red;">System config not found.</span>`);
                        cb(`System config not found.`);
                    }
                });
            },
            function (cb) {
                mongoAgent.TemplateRf.count().exec(function (err, count) {
                    if (err) {
                        gas_outputMsg.push(`<br><b>MongoDB 測試</b>: ERROR <br> <span style="color: red;"> ${JSON.stringify(err)}</span>`);
                    } else {
                        gas_outputMsg.push(`<br><b>MongoDB 測試</b>: OK`);
                    }
                    cb(null);
                });
            },
            function (cb) {
                queryAgent.query("QRY_CONN_SESSION", {}, function (err, session) {
                    if (err) {
                        gas_outputMsg.push(`<br><b>OracleDB 測試</b>: <span style="color: red;"> ERROR <br> ${JSON.stringify(err)}</span>`);
                    } else {
                        gas_outputMsg.push(`<br><b>OracleDB 測試</b>: OK`);
                    }

                    cb(null);
                });
            },
            function (cb) {
                request({
                    url: `${go_sysConf.api_url}`,
                    timeout: 3000
                }, function (error, response, body) {
                    if (error || !response || response && response.statusCode != "200" || (body && body.indexOf("success") == -1)) {
                        gas_outputMsg.push(`<br><b>API 回應</b>: <span style="color: red;">ERROR</span>`);
                    } else {
                        gas_outputMsg.push(`<br><b>API 回應</b>: OK`);
                    }
                    gas_outputMsg.push(`<b>API 回應內容</b>: ${body}`);
                    cb(null);
                });
            }

        ], function (err, result) {

            res.send(gas_outputMsg.join("<br>"));

        });
    } catch (ex) {
        gas_outputMsg.push(`異常 ${ex}`);
        res.send(gas_outputMsg.join("<br>"));
    }


}
;