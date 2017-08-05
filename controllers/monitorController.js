/**
 * Created by user on 2017/4/11.
 */
var request = require("request");
var mongoAgent = require("../plugins/mongodb");
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');
var async = require("async");
var mailSvc = require("../services/MailService");

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
    })

};