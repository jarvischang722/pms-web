/**
 * Created by Jun on 2017/6/27.
 */
var gateWayCrtl = require("../controllers/GateWayController");
var authMW = require("../middlewares/authMiddleware");
var middles = [ authMW];

module.exports = function (app) {

    /** 產生房型庫存**/
    app.post('/api/gateway/genRoomTypeStoc',middles, gateWayCrtl.genRoomTypeStoc);
    /** 上傳房型**/
    app.post('/api/gateway/uploadRoomType',middles, gateWayCrtl.uploadRoomType);
    /** 上傳房型圖片**/
    app.post('/api/gateway/uploadRoomTypePic',middles, gateWayCrtl.uploadRoomTypePic);
};