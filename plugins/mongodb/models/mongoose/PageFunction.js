/**
 * Created by Jun on 2017/2/24.
 * 頁面功能
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var PageFunctionSchema = new Schema({

    prg_id: String,      　 　　//程式編號
    page_id: Number,      　　　//頁面編號
    func_id: String,        　　//功能編號
    rule_func_name: String   　 //規則功能

}, {collection: "PageFunction"});


mongoose.model("PageFunction", PageFunctionSchema);