/**
 * Created by Jun on 2017/2/28.
 */
// var RuleEngine = require('node-rules');
let PMS0210011Rule = require("../ruleEngine/rules/FrontDesk/PMS0210011Rule");
let config = require("../configs/database");
require('../plugins/kplug-oracle/DB').create(config.oracle);
// var queryAgent = require('../plugins/kplug-oracle/QueryAgent');


let lo_postData = {
    // alt_nam: "王明"
    // alt_nam: "王小明"
    // alt_nam: "德安資訊股份有限公司"
    // alt_nam: "Wang,Yaung John"
    // alt_nam: "Yaung John Wang"
    cust_cod: "HFD000000000003202"
    // alt_nam: "王小明,Wang,Yaung John"
    // alt_nam: "Wang,Yaung,王小明"
};
let session = {
    user: {
        athena_id: 1,
        hotel_cod: '02'
    },
    locale: "zh_tw"
};
PMS0210011Rule.r_1040(lo_postData, session, function (err, result) {
    console.log(result);
});


// var params = {
//     subsys_id : "PMS0300000",
//     athena_id: 1001002
// }
// //define the rules
// var rules = [{
//     "name": "transaction minimum",
//     "priority": 3,
//     "on": true,
//     "condition": function (R) {
//       R.when(true);
//
//     },
//     "consequence": function (R) {
//         var r_this = this;
//         queryAgent.query("QRY_CONN_SESSION",{},function (err,session) {
//             r_this.result = err == null && session;
//             R.stop();
//         })
//
//     }
// },
//     {
//         "name": "transaction minimum2",
//         "priority": 10,
//         "on": true,
//         "condition": function (R) {
//             R.when(true);
//         },
//         "consequence": function (R) {
//             this.errorMsg = "hello invalil";
//             R.next()
//         }
//     }
// ];

// //sample fact to run the rules on
// var fact = {
//     "name": "user4",
//     "application": "MOB2",
//     "transactionTotal": 400,
//     "cardType": "Credit Card",
// };
//
// //initialize the rule engine
// var R = new RuleEngine("r_alt_nam");
//
// //Now pass the fact on to the rule engine for results
// R.execute(fact, function (result) {
//
//     if (result.result)
//         console.log("Payment Accepted");
//     else
//         console.log("Payment Rejected");
//
// });