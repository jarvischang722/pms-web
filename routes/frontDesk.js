/**
 * Created by jing on 2017/7/05.
 */
var frontDeskCrtl = require("../controllers/frontDeskController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,sysMW];

/* GET  page. */
module.exports = function(app  ) {

    //櫃檯備品(靜態)
    app.get('/PMS0210010', frontDeskCrtl.getPMS0210010);

    //團體管理(靜態)
    app.get('/PMS0210040', frontDeskCrtl.getPMS0210040);

};