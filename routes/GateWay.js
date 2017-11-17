/**
 * Created by Jun on 2017/6/27.
 */
var gateWayCrtl = require("../controllers/GateWayController");
var authMW = require("../middlewares/authMiddleware");
var middles = [ authMW];
var apiMiddles = [authMW];

module.exports = function (app) {

    /** 產生房型庫存**/
    app.post('/api/gateway/genRoomTypeStock',apiMiddles, gateWayCrtl.genRoomTypeStock);
    /** 上傳房型**/
    app.post('/api/gateway/uploadRoomType',apiMiddles, gateWayCrtl.uploadRoomType);
    /** 上傳房型圖片**/
    app.post('/api/gateway/uploadRoomTypePic',middles, gateWayCrtl.uploadRoomTypePic);
};