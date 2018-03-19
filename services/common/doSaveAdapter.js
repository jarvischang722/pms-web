/**
 * Created by kaiyue on 2017/10/22.
 * 作業儲存轉接器
 */

let _ = require("underscore");
let async = require("async");
let moment = require("moment");
let mongoAgent = require("../plugins/mongodb");
let commonRule = require("../ruleEngine/rules/CommonRule");
let commonTools = require("../utils/CommonTools");
let langSvc = require("../services/LangService");

