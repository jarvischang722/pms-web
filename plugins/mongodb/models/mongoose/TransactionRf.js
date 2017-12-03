/**
 * Created by Jun on 2017/8/11.
 * 特殊程式交易代碼
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionRfSchema = new Schema({

    prg_id: {type: String, trim: true, index: true, required: true},      　 //程式編號
    page_id: {type: Number, index: true, required: true},      　　　        //頁面編號
    tab_page_id: {type: Number, index: true, required: true},      　　　    //頁面編號
    template_id: String,             　//版型代碼
    func_id: {type: String, trim: true, index: true, required: true},        //功能代碼
    trans_code: String,        　      //交易代碼

}, {collection: "TransactionRf"});

TransactionRfSchema.index({prg_id: 1, page_id: 1, tab_page_id: 1, func_id: 1}, {unique: true});

mongoose.model("TransactionRf", TransactionRfSchema);