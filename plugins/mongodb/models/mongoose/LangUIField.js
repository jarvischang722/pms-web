/**
 * Created by Jun on 2017/6/1.
 * 欄位多語
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LangUIFieldSchema = new Schema({

    prg_id: String,        //作業編號
    page_id: Number,       //(參考UIPageField頁籤的page_id)
    template_id: String,   //(datagrid:多筆  gridsingle:單筆)
    ui_field_name: String, // (欄位名稱)
    ui_display_name_zh_TW : String, //(欄位中文顯示名稱)
    ui_display_name_en : String,    //(欄位英文顯示名稱)
    hint_zh_TW: String,             //(滑鼠移入顯示中文提示字)
    hint_en: String                 //(滑鼠移入顯示英文提示字)

}, {collection: "LangUIField"});


mongoose.model("LangUIField", LangUIFieldSchema);
