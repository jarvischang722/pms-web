/**
 * Created by Jun on 2017/4/18.
 * API Log
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let LogsAPISchema = new Schema({
    prg_id: String,             //作業編號
    api_prg_code: String,       //API 程式編號
    req_content: {},             //打給API的資料
    res_content: {},             //API回傳的時間
    success: Boolean,           //是否成功
    ins_datetime: {type: Date, default: Date.now}
}, {collection: "LogsAPI"});


mongoose.model("LogsAPI", LogsAPISchema);
