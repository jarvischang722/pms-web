/**
 * Created by Jun on 2017/2/24.
 * ChangeLog
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let SettingHistorySchema = new Schema({

    prg_id: String,
    table_name: String,
    action: String,
    key: {},
    dataOfChanges: {},
    user: String,
    dt: Array,
    event_time: String

}, {collection: "SettingHistory"});


mongoose.model("SettingHistory", SettingHistorySchema);