/**
 * Created by Jun on 2017/2/9.
 */
module.exports = function (io) {

    require("./events/setup-process")(io); //setup socket io event
    require("./events/sysCommon-process")(io); // socket io event


};