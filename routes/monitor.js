/**
 * Created by user on 2017/4/11.
 */
var monitor = require("../controllers/monitorController");
module.exports = function (app) {
    app.get('/monitor', monitor.monitor);
    app.get('/checkServerSta', monitor.checkServerSta);
    app.get('/checkSysAlive', monitor.checkSysAlive);
};