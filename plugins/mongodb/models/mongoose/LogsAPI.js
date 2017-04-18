/**
 * Created by Jun on 2017/4/18.
 * API Log
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogsAPISchema = new Schema({
    prg_id: String,        //作業編號
    REVE_CODE: String,     //API 程式編號
    requestObj: {},
    resposeObj: {}

}, {collection: "LogsAPI"});


mongoose.model("LogsAPI", LogsAPISchema);
