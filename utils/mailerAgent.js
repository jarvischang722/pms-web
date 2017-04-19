/**
 * Created by Jun Chang on 2016/7/25.
 * Send Mail
 */
var path = require('path');
var rootPath = path.resolve(".");
var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var mailerConfig = require("../configs/mailerConfig");
/**
 * 寄送Mail
 * @input {String } from 寄件人
 * @input {String } to   收件人
 * @input {JSON } subject : 主旨title
 * @input {JSON }  text   : 主旨subtitle
 * @input {String } html  : 信件內容
 * **/
module.exports = function (from, to, subject, text, html) {
    try {


        // create reusable transporter object using the default SMTP transport
        var transporter = nodemailer.createTransport(smtpTransport({
            // host is the hostname or IP address to connect to (defaults to 'localhost')
            host: mailerConfig.host,
            //defines if the connection should use SSL (if true) or not (if false)
            secure: mailerConfig.secure,
            port: mailerConfig.port,
            auth: {
                user: mailerConfig.auth.user,
                pass: mailerConfig.auth.pass
            },
            //defines additional options to be passed to the socket constructor
            tls: {
                rejectUnauthorized: mailerConfig.tls.rejectUnauthorized
            },
            //logs to console.
            logger: mailerConfig.logger

        }));


        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: from,                  // sender address
            to: to,                    // list of receivers
            subject: subject,            //  主旨title
            text: text,                 //  主旨subtitle
            html: html                  // mail 內文
        };


        // send mail with defined transport object
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            /***[info]
             { accepted: [ 'xxxxxxxxxxx@gmail.com' ],
               rejected: [],
               response: '250 2.0.0 Ok: queued as 823FB2166E2',
               envelope:
                 { from: 'webhotel@webhotel.net.tw',
                   to: [ 'xxxxxxxx@gmail.com' ] },
                   messageId: '1467271074977-376f529b-e2616248-bd35fe21@webhotel.net.tw'
               }
             * **/
            console.log("寄信成功  [  From:" + info.envelope.from + "  -> To:" + info.envelope.to + "]");


        });

    } catch (ex) {
        console.error("寄信失敗" + ex);
    }
};
