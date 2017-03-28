/**
 * Created by Jun on 2017/2/24.
 * 頁面欄位屬性
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UI_PageFieldSchema = new Schema({

    prg_id: String,      　 　　        //程式編號
    page_id: Number,      　　　        //頁面編號
    template_id: String,             　//版型代碼
    user_athena_id: String,        　  //認證athena_id
    athena_id: String,        　       //athena_id
    user_id: String, 　                //登入使用者代碼
    ui_field_name: String,   　        //頁面欄位名稱
    ui_type: String,   　              //頁面欄位型別：Grid, Select, Text...
    row_seq: Number,   　              //第幾列，由0開始
    col_seq: Number,   　              //第幾欄，由0開始
    height: Number,   　               //欄位高度px
    width: Number,   　                //欄位寬度px
    ui_field_length: Number,   　      //欄位長度
    ui_field_num_point: Number,   　    //欄位小數點長度
    multi_lang_table:String,            //多語TABLE
    format_func_name: String,   　       //欄位格式檢查函式
    rule_func_name: String   　          //欄位資料內容檢查函式

}, {collection: "UI_PageField"});


mongoose.model("UI_PageField", UI_PageFieldSchema);