/**
 * Created by Jun Chang on 2017/1/20.
 */
let _ = require("underscore");
let dbConfig = require("../../configs/database");
let mongoose = require('mongoose');
let dbconn = ["mongodb://", dbConfig.mongo.username, ":", dbConfig.mongo.password, "@", dbConfig.mongo.host, ":", dbConfig.mongo.port, "/", dbConfig.mongo.dbname].join("");
let options = {
    useMongoClient: true
};

mongoose.Promise = global.Promise;

mongoose.connect(dbconn, options, function (err) {
    if (err) {
        console.error('connect to %s error: ', dbconn, err.message);
        process.exit(1);
    }
});

require("./models/mongoose/SetupDatagridFunction");
require("./models/mongoose/UIDatagridField");
require("./models/mongoose/UIPageField");
require("./models/mongoose/UITypeSelect");
require("./models/mongoose/UserAction");
require("./models/mongoose/TemplateRf");
require("./models/mongoose/TemplateGridSingle");
require("./models/mongoose/SetupPageFunction");
require("./models/mongoose/LogsAPI");
require("./models/mongoose/Sessions");
require("./models/mongoose/LangUIField");
require("./models/mongoose/SettingHistory");
require("./models/mongoose/TransactionRf");
require("./models/mongoose/PrgFunction");
require("./models/mongoose/OnlineUser");


exports.SetupDatagridFunction = mongoose.model("SetupDatagridFunction");
exports.UIDatagridField = mongoose.model("UIDatagridField");
exports.UIPageField = mongoose.model("UIPageField");
exports.UITypeSelect = mongoose.model("UITypeSelect");
exports.UserAction = mongoose.model("UserAction");
exports.TemplateRf = mongoose.model("TemplateRf");
exports.TemplateGridSingle = mongoose.model("TemplateGridSingle");
exports.SetupPageFunction = mongoose.model("SetupPageFunction");
exports.LogsAPI = mongoose.model("LogsAPI");
exports.Sessions = mongoose.model("Sessions");
exports.LangUIField = mongoose.model("LangUIField");
exports.SettingHistory = mongoose.model("SettingHistory");
exports.TransactionRf = mongoose.model("TransactionRf");
exports.PrgFunction = mongoose.model("PrgFunction");
exports.OnlineUser = mongoose.model("OnlineUser");
