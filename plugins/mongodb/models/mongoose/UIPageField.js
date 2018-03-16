/**
 * Created by Jun on 2017/2/24.
 * 頁面欄位屬性
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let UIPageFieldSchema = new Schema({

    prg_id: {type: String, trim: true, index: true, required: true},      　 　　        //程式編號
    page_id: {type: Number, index: true, required: true},      　　　        //頁面編號
    tab_page_id: {type: Number, index: true, required: true},      　　　    //頁面編號
    template_id: {type: String, index: true, required: true},             　//版型代碼
    user_athena_id: String,        　  //認證athena_id
    athena_id: String,        　       //athena_id
    user_id: {type: String}, 　                //登入使用者代碼
    ui_field_name: {type: String, trim: true, index: true, required: true},  　        //頁面欄位名稱
    ui_type: String,   　              //頁面欄位型別：Grid, Select, Text...
    row_seq: Number,   　              //第幾列，由0開始
    col_seq: Number,   　              //第幾欄，由0開始
    height: Number,   　               //欄位高度px
    width: Number,   　                //欄位寬度px
    label_width: Number,   　          //標題欄位寬度px
    ui_field_length: Number,   　      //欄位長度
    ui_field_num_point: Number,   　    //欄位小數點長度
    multi_lang_table: String,            //多語TABLE
    format_func_name: String,   　       //欄位格式檢查函式
    rule_func_name: String   　          //欄位資料內容檢查函式

}, {collection: "UIPageField"});

UIPageFieldSchema.index({
    prg_id: 1,
    page_id: 1,
    tab_page_id: 1,
    ui_field_name: 1,
    template_id: 1
}, {unique: true});

mongoose.model("UIPageField", UIPageFieldSchema);