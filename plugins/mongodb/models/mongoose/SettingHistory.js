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
    key: {},
    dataOfChanges:{},
    user: String,
    event_time : String

}, {collection: "SettingHistory"});


mongoose.model("SettingHistory", SettingHistorySchema);