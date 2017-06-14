/**
 * Created by Jun on 2017/2/9.
 */
module.exports = function (io) {

    require("./events/singleGrid-process")(io); //singleGrid socket io event
    require("./events/setup-process")(io); //setup socket io event
    require("./events/webStatus-process")(io); // socket io event


};