/**
 * Created by Jun Chang on 2017/2/13.
 */
var RegExp = require("regex");
var org_reg =  /[\d\D\w\W]/;
var reggg = org_reg;
var rrrr = new RegExp(/[\d\D\w\W]/);
console.log(reggg.test("aaabbb"));