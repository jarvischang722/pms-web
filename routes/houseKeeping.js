/**
 * Created by jing on 2017/7/19.
 */

var houseKeepingCrtl = require("../controllers/houseKeepingController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,sysMW];

/* GET  page. */
module.exports = function(app  ) {

    //失物管理(靜態)
    app.get('/PMS0410050', houseKeepingCrtl.getPMS0410050);

    //房務入帳
    app.get('/PMS0410020', houseKeepingCrtl.getPMS0410020);

};