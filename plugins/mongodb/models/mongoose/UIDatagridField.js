/**
 * Created by Jun on 2017/2/9.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;
let UIDatagridFieldSchema = new Schema({
    user_athena_id: String, //使用者登入驗證athena_id
    athena_id: String,    //athena_id
    user_id: String,       //使用者
    prg_id: {type: String, trim: true, index: true, required: true},      　 　　        //程式編號
    page_id: {type: Number, index: true, required: true},      　　　        //頁面編號
    tab_page_id: {type: Number, index: true, required: true},      　　　    //頁面編號
    ui_field_name: {type: String, trim: true, index: true, required: true},  　        //頁面欄位名稱
    ui_type: String,       //顯示類型
    col_seq: String,       //欄位順序
    width: String,         //欄位寬度
    visiable: String,      //是否顯示
    modificable: String,   //是否可修改　
    requirable: String,     //是否必填
    keyable: String,             //是否為pk
    multi_lang_table: String,     //多語TABLE
    ui_field_length: Number,     //欄位可輸入長度
    ui_field_num_point: Number,    //小數點幾位
    grid_field_name: String,      //grid field name 名稱
    format_func_name: String,   　       //欄位格式檢查函式
    rule_func_name: String,  　          //欄位資料內容檢查函式
    attr_func_name: String  　          //欄位資料驗證檢查函式

}, {collection: "UIDatagridField"});

UIDatagridFieldSchema.index({prg_id: 1, page_id: 1, tab_page_id: 1, ui_field_name: 1}, {unique: true});

mongoose.model("UIDatagridField", UIDatagridFieldSchema);