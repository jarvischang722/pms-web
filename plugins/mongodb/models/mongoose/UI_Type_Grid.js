/**
 * Created by Jun on 2017/2/24.
 * UI_PageField.ui_Type 是grid 的細項
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UI_Type_GridSchema = new Schema({

    prg_id: String,      　 　//程式編號
    ui_field_name: String,    //頁面欄位名稱
    table_name:String,        //Table名稱
    rule_func_name: String,   //單筆資料來源規則
    lock_table: String,   　  //鎖定資料表名稱
    lock_type: String,   　   //單筆鎖定
    row_click: String         //(P:跳頁面編輯)

}, {collection: "UI_Type_Grid"});


mongoose.model("UI_Type_Grid", UI_Type_GridSchema);