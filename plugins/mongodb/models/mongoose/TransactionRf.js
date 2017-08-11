/**
 * Created by Jun on 2017/8/11.
 * 特殊程式交易代碼
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var TransactionRfSchema = new Schema({

    prg_id: String,      　 　　        //程式編號
    page_id: Number,      　　　        //頁面編號
    tab_page_id: Number,      　　　    //頁面編號
    template_id: String,             　//版型代碼
    func_id: String,             　    //功能代碼
    trans_code: String,        　      //交易代碼

}, {collection: "TransactionRf"});


mongoose.model("TransactionRf", TransactionRfSchema);