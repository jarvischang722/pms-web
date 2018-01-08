/**
 * Created by a17017 on 2018/1/4.
 * 記錄使用者使用button的狀況
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let UserActionSchema = new Schema({
    prg_id: {type: String, trim: true, required: true},      　 　      //程式編號
    session_id: {type: String, trim: true, required: true},      　 　  //session_id
    func_id: {type: String, trim: true, required: true},      　 　     //功能編號
    url: {type: String, trim: true, required: true},      　 　         //url
    event_time: {type: Date, trim: true, index: true, required: true},  //動作時間
    athena_id: {type: Number, trim: true, index: true, required: true}, //athena_id
    comp_cod: {type: String, trim: true, index: true, required: true},  //公司編號
    hotel_cod: {type: String, trim: true, index: true, required: true}, //館別編號
    usr_id: {type: String, trim: true, required: true}      　 　        //使用者編號
}, {collection: "UserAction"});

UserActionSchema.index({hotel_cod: 1, comp_cod: 1, athena_id: 1, event_time: 1}, {unique: true});

mongoose.model("UserAction", UserActionSchema);