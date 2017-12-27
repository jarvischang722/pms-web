/**
 * Created by Jun on 2017/4/28.
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let sessionSchema = new Schema({
    _id:String,
    session: String,
    expires: { type: Date, default: Date.now }
}, {collection: "sessions"});

mongoose.model("Sessions", sessionSchema);
