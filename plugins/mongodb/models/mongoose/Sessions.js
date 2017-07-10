/**
 * Created by Jun on 2017/4/28.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var sessionSchema = new Schema({
    _id:String,
    session: String,
    expires: { type: Date, default: Date.now }

}, {collection: "sessions"});


mongoose.model("Sessions", sessionSchema);
