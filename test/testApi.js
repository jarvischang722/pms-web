/**
 * Created by Jun Chang on 2017/2/14.
 */

const Svc = require("../ruleEngine/rules/FontDesk/PMS0210011Rule");

let encode = Svc.encodeCreditNos("hello");
console.log(encode);
let decode = Svc.decodeCreditNos(encode);
console.log(decode);
//
// let string7 = Svc.doCreditNosMask("1111222233334444", "7");
// let string2 = Svc.doCreditNosMask("1111222233334444", "2");
// let string99 = Svc.doCreditNosMask("1111222233334444", "99");
// console.log(string7, string2, string99);
