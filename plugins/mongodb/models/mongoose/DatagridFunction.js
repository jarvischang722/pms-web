/**
 * Created by Jun Chang on 2017/2/8.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var  DatagridFunctionSchema = new Schema({
    prg_id : String,           //作業編號
    func_id : String ,         //功能編號
    rule_id :  String          //功能規則編號

}, {collection: "DatagridFunction"});




mongoose.model("DatagridFunction", DatagridFunctionSchema);
