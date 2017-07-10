/**
 * Created by Jun on 2017/2/24.
 * 單檔版行設定
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TemplateGridSingleSchema = new Schema({

    prg_id: String,      　 　 //程式編號
    page_id: Number,      　　 //頁面編號
    template_id: String,      //版型邊號
    table_name: String,       //資料表名稱
    rule_func_name: String,   //單筆資料來源規則
    lock_table: String,   　  //鎖定資料表名稱
    lock_type: String   　    //單筆鎖定

}, {collection: "TemplateGridSingle"});


mongoose.model("TemplateGridSingle", TemplateGridSingleSchema);

