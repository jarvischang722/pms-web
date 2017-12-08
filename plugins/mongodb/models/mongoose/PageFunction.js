/**
 * Created by Jun on 2017/2/24.
 * 頁面功能
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let PageFunctionSchema = new Schema({
    prg_id: {type: String, trim: true, index: true, required: true},  //程式編號
    page_id: {type: Number, index: true, required: true},      　　　 //頁面編號
    func_id: {type: String, trim: true, index: true, required: true}, //功能編號
    rule_func_name: String   　 //規則功能
}, {collection: "SetupPageFunction"});

PageFunctionSchema.index({prg_id: 1, page_id: 1, func_id: 1}, {unique: true});

mongoose.model("SetupPageFunction", PageFunctionSchema);