var config = require("../configs/DB_config");
require('../plugins/kplug-oracle/DB').create(config.oracle);
var queryAgent = require('../plugins/kplug-oracle/QueryAgent');

var params = {
    hotel_cod:'99'
};

queryAgent.query("QRY_HOTEL_RF",params,function(err,rows){
    console.log(rows);
})
