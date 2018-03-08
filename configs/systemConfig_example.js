/**
 * Created by Jun on 2016/12/26.
 * 系統設定檔
 */
module.exports = {
    sessionExpiredMS: 1000 * 60 * 60 * 3,
    secret: "ea2c9dfdc3c13cc685f1f9246f7e3be4b4888f2e",
    api_url: "http://192.168.60.74:8080/bacchus/GatewaySvc",
    upload_url: "/var/www/images/bacchus/",    //上傳圖片路徑
    image_url: "http://wrs.linktravel.tw/images/bacchus/", //讀取圖片路徑
    isDefaultUserID: "Y"                                    //是否使用預設帳號
};