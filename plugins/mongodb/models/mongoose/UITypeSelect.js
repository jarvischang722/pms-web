/**
 * Created by Jun on 2017/2/24.
 * UIPageField.ui_Type 是select 的細項
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UI_Type_SelectSchema = new Schema({

    prg_id: String,      　 　    //程式編號
    ui_field_name: String,       //頁面欄位名稱
    ui_display_name:String,      //
    rule_func_name: String,      //單筆資料來源規則
    multi_lang_table:String,     //
    multi_value_field:String,    //
    multi_display_field:String,  //
    defaultVal: String   　      //(option 預設值

}, {collection: "UITypeSelect"});


mongoose.model("UITypeSelect", UI_Type_SelectSchema);