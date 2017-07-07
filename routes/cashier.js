/**
 * Created by jing on 2017/5/24.
 */

var cashierCrtl = require("../controllers/cashierController");
var authMW = require("../middlewares/authMiddleware");
var sysMW = require("../middlewares/systemMiddleware");
var i18nMW = require("../middlewares/i18nMiddleware");
var middles = [i18nMW,authMW,sysMW];

/* GET  page. */
module.exports = function(app  ) {


    //分帳規則
    app.get('/PMS0830080', cashierCrtl.getPMS0830080);

};