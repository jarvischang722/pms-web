/**
 * Created by kaiyue on 2017/11/08.
 */
var exceptionMailConfig = require("../configs/exceptionMailMemberList.json");
var _ = require("underscore");
var mailerConfig = require("../configs/mailerConfig");
var mailAgent = require("../utils/MailerAgent");
var ip = require('ip');
var fs = require('fs');
var ejs = require('ejs');
var moment = require("moment");

