/**
 * Created by Jun on 2017/2/24.
 * UIPageField.ui_Type 是select 的細項
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let UITypeSelectSchema = new Schema({
    prg_id: {type: String, trim: true, index: true, required: true},      　 　   //程式編號
    ui_field_name: {type: String, trim: true, index: true, required: true},       //頁面欄位名稱
    ui_display_name: String,      //
    rule_func_name: String,      //單筆資料來源規則
    /**
     * 格式可以接受
     * 1. array(多規則)
     * [
     *      {
     *          rule1_name: Y,
     *          sort: 1
     *      },
     *      {
     *          rule2_name: N,
     *          sort: 2
     *      }
     * ]
     * 2. string(單一規則)
     */
    rule_extend_func_name: Schema.Types.Mixed,  //擴充規則
    multi_lang_table: String,     //
    multi_value_field: String,    //
    multi_display_field: String,  //
    defaultVal: String,   　      //(option 預設值
    is_qry_src_before: String,     //'Y':先撈資料、'N':輸入完資料才撈資料
    column_func_name: String      //欄位名稱來源規則
}, {collection: "UITypeSelect"});

UITypeSelectSchema.index({prg_id: 1, page_id: 1, tab_page_id: 1, ui_field_name: 1, template_id: 1}, {unique: true});

mongoose.model("UITypeSelect", UITypeSelectSchema);