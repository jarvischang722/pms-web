/**
 * Created by a17017 on 2017/12/14.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
var PrgFunctionSchema = new Schema({
    prg_id: {type: String, trim: true, index: true, required: true},  //程式編號
    page_id: {type: Number, index: true, required: true},      　　　  //頁面編號,
    tab_page_id: {type: Number, index: true, require: true},
    template_id: {type: String, trim: true, index: true, require: true},
    func_id: {type: String, trim: true, index: true, required: true}, //功能編號
    rule_func_name: String
}, {collection: "PrgFunction"});

PrgFunctionSchema.index({prg_id: 1, page_id: 1, tab_page_id: 1, func_id: 1}, {unique: true});

mongoose.model("PrgFunction", PrgFunctionSchema);