/**
 * Created by a17017 on 2017/12/29.
 * 頁面功能
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let OnlineUserSchema = new Schema({
    athena_id: {type: Number, index: true, required: true},  //集團編號
    comp_cod: {type: String, trim: true, index: true, required: true},  //公司編號
    hotel_cod: {type: String, trim: true, index: true, required: true},  //館別編號
    onlineUserSession: {type: [String]},   　 //在線使用者
    availUserNum: {type: Number},    //可使用的人數
    lastUpdTime: {type: Date}       //更新時間
}, {collection: "OnlineUser"});

OnlineUserSchema.index({athena_id: 1, company_cod: 1, hotel_cod: 1}, {unique: true});

mongoose.model("OnlineUser", OnlineUserSchema);