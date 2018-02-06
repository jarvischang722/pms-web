/**
 * Created by user on 2017/4/11.
 */
var monitor = require("../controllers/monitorController");
module.exports = function (app) {
    //登入頁面
    app.get('/monitor', monitor.monitor);
    app.get('/checkServer', monitor.checkServer);
};