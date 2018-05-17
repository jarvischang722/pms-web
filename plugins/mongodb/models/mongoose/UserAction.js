/**
 * Created by a17017 on 2018/1/4.
 * 記錄使用者使用button的狀況
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let UserActionSchema = new Schema({
    usr_id: {type: String, trim: true, required: true},      　 　       //使用者編號
    prg_id: {type: String, trim: true, required: true},      　 　       //程式編號
    session_id: {type: String, trim: true, required: true},      　 　   //session_id
    func_id: {type: String, trim: true},      　 　      //功能編號
    url: {type: String, trim: true},      　 　          //url
    event_time: {type: Date, trim: true, required: true},  //動作時間
    athena_id: {type: Number, trim: true, index: true, required: true}, //Ａthena ID
    comp_cod: {type: String, trim: true, index: true, required: true},  //公司編號
    hotel_cod: {type: String, trim: true, index: true, required: true}, //館別編號
    req_data: {type: Object, default: {}},                              //打給後端的資料
    res_data: {type: Object, default: {}},                              //後端回來的資料
    exec_time_sec: {type: Number, default: 0}                           //執行時間
}, {collection: "UserAction"});

UserActionSchema.index({hotel_cod: 1, comp_cod: 1, athena_id: 1, func_id: 1});

mongoose.model("UserAction", UserActionSchema);