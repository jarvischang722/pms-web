/**
 * Created by a17017 on 2017/12/29.
 * 頁面功能
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let OnlineUserSchema = new Schema({
    athena_id: {type: Number, index: true, required: true},  //集團編號
    company_cod: {type: String, trim: true, index: true, required: true},  //公司編號
    hotel_cod: {type: String, trim: true, index: true, required: true},  //館別編號
    current_user: {type: [String]},   　 //在線使用者
    availability_num: {type: Number},    //可使用的人數
    last_Update_time: {type: Date}       //更新時間
}, {collection: "SetupPageFunction"});

OnlineUserSchema.index({athena_id: 1, company_cod: 1, hotel_cod: 1}, {unique: true});

mongoose.model("OnlineUser", OnlineUserSchema);