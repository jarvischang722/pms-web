/**
 * Created by Jun on 2017/2/24.
 * 單檔版行設定
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let TemplateRfSchema = new Schema({
    prg_id: {type: String, trim: true, index: true, required: true},    //程式編號
    page_id: {type: Number, index: true, required: true},      　　      //頁面編號
    tab_page_id: {type: Number, index: true, required: true},      　　      //頁面編號
    template_id: {type: String, trim: true, index: true, required: true},   //版型邊號
    table_name: {type: String, trim: true, index: true},       //資料表名稱
    rule_func_name: String,   //單筆資料來源規則
    lock_table: String,   　  //鎖定資料表名稱
    lock_type: String   　    //單筆鎖定
}, {collection: "TemplateRf"});

TemplateRfSchema.index({prg_id: 1, page_id: 1, tab_page_id: 1, template_id: 1, table_name: 1}, {unique: true});

mongoose.model("TemplateRf", TemplateRfSchema);