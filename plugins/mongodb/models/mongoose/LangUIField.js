/**
 * Created by Jun on 2017/6/1.
 * 欄位多語
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let LangUIFieldSchema = new Schema({
    prg_id: {type: String, trim: true, index: true, required: true},        //作業編號
    page_id: {type: Number, index: true, required: true},
    template_id: {type: String, trim: true, index: true, required: true},
    ui_field_name: {type: String, trim: true, index: true, required: true}, // (欄位名稱)
    ui_display_name_zh_TW: String, //(欄位中文顯示名稱)
    ui_display_name_en: String,    //(欄位英文顯示名稱)
    hint_zh_TW: String,             //(滑鼠移入顯示中文提示字)
    hint_en: String                 //(滑鼠移入顯示英文提示字)
}, {collection: "LangUIField"});

LangUIFieldSchema.index({prg_id: 1, page_id: 1, template_id: 1, ui_field_name: 1}, {unique: true});

mongoose.model("LangUIField", LangUIFieldSchema);
