/**
 * Created by user on 2017/4/7.
 */
var exceptionMailConfig = require("../configs/exceptionMailMemberList.json");
var _ = require("underscore");
var mailerConfig = require("../configs/mailerConfig");
var mailAgent = require("../utils/mailerAgent");
var ip = require('ip');
var fs = require('fs');
var ejs = require('ejs');
var moment = require("moment");

/**
 * 寄送Exception Mail
 * @param mailInfo{Object} :
 *          {
 *              exceptionType: 錯誤類別,
 *              errorMsg : 錯誤資訊
 *          }
 */
exports.sendExceptionMail = function (mailInfo) {
    var mailFrom = mailerConfig.auth.user || "";
    var mailTo = "";
    var exceptionType = mailInfo.exceptionType || "";
    var subject = "Bacchus Exception [ "+ exceptionType + "] ";
    var subtitle = 'Bacchus Exception';
    var memberList = exceptionMailConfig.memberList;
    var exHtml = fs.readFileSync(__dirname + '/../views/mailHtml/exception.ejs', 'utf8');
    var mailContent = ejs.render(exHtml, {
        "exceptionType": exceptionType,
        "errorMsg" : mailInfo.errorMsg,
        "server_ip":ip.address(),
        "eventTime" : moment().format("YYYY/MM/DD HH:mm:ss")
    });

    //取得要收到Exception Mail的人
    _.each(memberList, function (pepo) {
        var name = pepo.name;
        var email = pepo.email;
        mailTo += "'"+name+"' <" + email+">,";
    });

    mailAgent(mailFrom, mailTo, subject, subtitle, mailContent);
};

