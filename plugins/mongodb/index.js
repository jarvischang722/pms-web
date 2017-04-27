/**
 * Created by Jun Chang on 2017/1/20.
 */
var _ = require("underscore");
var dbConfig = require("../../configs/database");
var mongoose = require('mongoose');
var dbconn = ["mongodb://",dbConfig.mongo.username,":",dbConfig.mongo.password,"@", dbConfig.mongo.host, ":", dbConfig.mongo.port, "/", dbConfig.mongo.dbname].join("");

mongoose.Promise = global.Promise;

mongoose.connect(dbconn, function (err) {
    if (err) {
        console.error('connect to %s error: ', dbconn, err.message);
        process.exit(1);
    }
});

require("./models/mongoose/DatagridFunction");
require("./models/mongoose/UIDatagridField");
require("./models/mongoose/UI_PageField");
require("./models/mongoose/UI_Type_Grid");
require("./models/mongoose/UI_Type_Select");
require("./models/mongoose/TemplateRf");
require("./models/mongoose/TemplateGridSingle");
require("./models/mongoose/PageFunction");
require("./models/mongoose/LogsAPI");
require("./models/mongoose/Sessions");


exports.DatagridFunction = mongoose.model("DatagridFunction");
exports.UIDatagridField = mongoose.model("UIDatagridField");
exports.UI_PageField = mongoose.model("UI_PageField");
exports.UI_Type_Grid = mongoose.model("UI_Type_Grid");
exports.UI_Type_Select = mongoose.model("UI_Type_Select");
exports.TemplateRf = mongoose.model("TemplateRf");
exports.TemplateGridSingle = mongoose.model("TemplateGridSingle");
exports.PageFunction = mongoose.model("PageFunction");
exports.LogsAPI = mongoose.model("LogsAPI");
exports.Sessions = mongoose.model("Sessions");
