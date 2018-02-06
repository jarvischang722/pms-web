/**
 * Created by a17017 on 2017/12/29.
 * 頁面功能
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let OnlineUserSchema = new Schema({
    athena_id: {type: Number, index: true, required: true},  //集團編號
    comp_cod: {type: String, trim: true},  //公司編號
    hotel_cod: {type: String, trim: true},  //館別編號
    onlineUserSession: [{
        session_id: String,
        usr_id: String,
        insertDate: Date
    }],         //在線使用者
    availUserNum: {type: Number},    //可使用的人數
    lastUpdTime: {type: Date}       //更新時間
}, {collection: "OnlineUser"});

OnlineUserSchema.index({athena_id: 1}, {unique: true});

mongoose.model("OnlineUser", OnlineUserSchema);