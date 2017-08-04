/**
 * Created by Jun on 2017/2/24.
 * ChangeLog
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var SettingHistorySchema = new Schema({

    prg_id: String,      　
    table_name:String,
    action:String,
    event_time : String,
    key: {},
    user: String,   　

}, {collection: "SettingHistory"});


mongoose.model("SettingHistory", SettingHistorySchema);