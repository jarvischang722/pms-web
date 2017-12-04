/**
 * Created by Jun Chang on 2017/2/8.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DatagridFunctionSchema = new Schema({
    prg_id: {type: String, trim: true, index: true, required: true},  //程式編號
    page_id: {type: Number, index: true, required: true},      　　　 //頁面編號
    func_id: {type: String, trim: true, index: true, required: true}, //功能編號
    rule_func_name: String
}, {collection: "SetupDatagridFunction"});

DatagridFunctionSchema.index({prg_id: 1, page_id: 1, func_id: 1}, {unique: true});

mongoose.model("SetupDatagridFunction", DatagridFunctionSchema);
