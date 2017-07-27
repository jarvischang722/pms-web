/**
 * Created by Jun on 2017/5/9.
 */
var setupCrtl = require("../controllers/setupController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,sysMW];

/* GET  page. */
module.exports = function(app) {

    /** 飯店前台參數 **/
    app.get('/setup/front_desk_conf', middles, setupCrtl.front_desk_conf);

    /** 訂房確認書 email **/
    app.get('/reservationCheckMail', setupCrtl.getReservationCheckMail);

    /** 設定Layout **/
    app.get('/setup/:mdl_id', middles, setupCrtl.setupLayout);

    /** 交通接駁設定資料 **/
    app.post('/api/getTrafficData',setupCrtl.getTrafficData);

    // 取得假日種類設定資料
    app.post("/api/getHolidayKindSet", setupCrtl.getHolidayKindSet);

    // 取假日日期設定
    app.post("/api/getHolidayDateSet", setupCrtl.getHolidayDateSet);

    // 取年度總天數
    app.post("/api/getHolidayDateCount", setupCrtl.getHolidayDateCount);

    // 取房型排序設定 (程式編號 : PMS0810020)
    app.post("/api/PMS0810020/roomCodOrder", setupCrtl.roomCodOrder);

    // 取房型圖片 (程式編號 : PMS0810020)
    app.post("/api/PMS0810020/getRoomTypeUploadPic", setupCrtl.getRoomTypeUploadPic);

    //分帳規則(靜態)
    app.get('/PMS0830080', setupCrtl.getPMS0830080);

    //區域別(靜態)
    app.get('/PMS0860030', setupCrtl.getPMS0860030);
};