/**
 * Created by Jun on 2017/2/9.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var  UIDatagridFieldSchema = new Schema({
    user_athena_id: String, //使用者登入驗證athena_id
    athena_id : String,    //athena_id
    user_id :String,       //使用者
    prg_id :String,        //程式編號
    page_id :Number,        //PageID
    ui_field_name :String, //欄位KEY值
    ui_type :String,       //顯示類型
    col_seq :String,       //欄位順序
    width :String,         //欄位寬度
    visiable :String,      //是否顯示
    modificable :String,   //是否可修改　
    requirable :String,     //是否必填
    keyable :String,             //是否為pk
    multi_lang_table:String,     //多語TABLE
    ui_field_length :Number,     //欄位可輸入長度
    ui_field_num_point :Number,    //小數點幾位
    grid_field_name: String,      //grid field name 名稱
    format_func_name: String,   　       //欄位格式檢查函式
    rule_func_name: String,  　          //欄位資料內容檢查函式
    selectData: String          //comboBox在程式中取的到資料後塞入

} ,{collection: "UIDatagridField"});


mongoose.model("UIDatagridField", UIDatagridFieldSchema);